from flask import jsonify
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload

from ..DataBase.database import db_session
from ..DataBase.modelos import (
    Cuota,
    MetodoPago,
    Pago,
)
from .crud import (
    GroupAPI,
    datos_json,
    respuesta_error,
)


class PagoAPI(GroupAPI):
    """
    POST /pagos/ custom.

    El GroupAPI genérico no sirve acá: hace flush()
    antes del hook on_create, así que una FK inválida
    revienta con 409 antes de poder validar. En este
    POST validamos primero (cuota, método de pago e
    importe contra el saldo) para responder 400 en
    JSON con mensaje claro.
    """

    def post(self):

        data = datos_json()

        try:
            cuota_id = data.get("cuotaId")
            metodo_pago_id = data.get("metodoPagoId")
            importe = data.get("importe")

            if not isinstance(
                cuota_id,
                int,
            ) or isinstance(cuota_id, bool):
                raise ValueError(
                    "cuotaId debe ser un número"
                )

            if not isinstance(
                metodo_pago_id,
                int,
            ) or isinstance(metodo_pago_id, bool):
                raise ValueError(
                    "metodoPagoId debe ser un número"
                )

            if not isinstance(
                importe,
                int,
            ) or isinstance(importe, bool):
                raise ValueError(
                    "importe debe ser un número entero"
                )

            if importe <= 0:
                raise ValueError(
                    "importe debe ser mayor a 0"
                )

            if not data.get("fecha"):
                raise ValueError(
                    "fecha es requerida"
                )

            cuota = db_session.scalar(
                select(Cuota)
                .where(Cuota.id == cuota_id)
                .options(
                    selectinload(Cuota.pagos),
                    selectinload(Cuota.cuotas_planes),
                )
            )

            if cuota is None:
                raise ValueError(
                    f"Cuota inexistente: {cuota_id}"
                )

            if importe > cuota.saldo:
                raise ValueError(
                    "El importe excede el saldo "
                    f"pendiente de la cuota "
                    f"({cuota.saldo})"
                )

            metodo = db_session.scalar(
                select(MetodoPago).where(
                    MetodoPago.id == metodo_pago_id,
                )
            )

            if metodo is None:
                raise ValueError(
                    f"Método de pago inexistente: "
                    f"{metodo_pago_id}"
                )

            if not metodo.activo:
                raise ValueError(
                    f"Método de pago inactivo: "
                    f"{metodo.nombre}"
                )

            pago = Pago.from_json(data)

            db_session.add(pago)
            db_session.commit()
        except (KeyError, ValueError, SQLAlchemyError) as exc:
            return respuesta_error(exc)

        return jsonify(
            pago.to_json()
        ), 201
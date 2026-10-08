from flask import jsonify
from flask.views import MethodView
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload

from ..DataBase.database import db_session
from ..DataBase.modelos.socios import Socio
from ..DataBase.modelos.socio_planes import SocioPlan
from ..DataBase.modelos.cuotas import Cuota
from ..DataBase.modelos.cuotas_planes import CuotaPlan
from .crud import datos_json, respuesta_error


class GenerarCuotasAPI(MethodView):

    def post(self):

        data = datos_json()

        año = data.get("año")
        mes = data.get("mes")

        if not isinstance(año, int) or isinstance(año, bool):
            return jsonify({
                "error": "año debe ser un número"
            }), 400

        if not isinstance(mes, int) or isinstance(mes, bool):
            return jsonify({
                "error": "mes debe ser un número"
            }), 400

        if mes < 1 or mes > 12:
            return jsonify({
                "error": "El mes debe estar entre 1 y 12"
            }), 400

        # Solo socios activos generan cuota.
        socios = db_session.scalars(
            select(Socio)
            .where(
                Socio.activo.is_(True),
            )
            .options(
                selectinload(
                    Socio.socios_planes
                ).selectinload(
                    SocioPlan.plan
                )
            )
        ).all()

        cuotas_existentes = db_session.scalars(
            select(Cuota).where(
                Cuota.año == año,
                Cuota.mes == mes,
            )
        ).all()

        socios_con_cuota = {
            cuota.socioId
            for cuota in cuotas_existentes
        }

        cuotas_creadas = []

        try:
            for socio in socios:

                planes_activos = [
                    socio_plan
                    for socio_plan in socio.socios_planes
                    if socio_plan.activo
                    and socio_plan.plan.activo
                ]

                # Sin planes activos no se genera cuota.
                if not planes_activos:
                    continue

                # Si ya tiene cuota para ese período,
                # no hacemos nada.
                if socio.id in socios_con_cuota:
                    continue

                cuota = Cuota(
                    socioId=socio.id,
                    año=año,
                    mes=mes,
                )

                for socio_plan in planes_activos:

                    cuota_plan = CuotaPlan(
                        planId=socio_plan.planId,
                        precio=socio_plan.plan.valor,
                    )

                    cuota.cuotas_planes.append(
                        cuota_plan
                    )

                db_session.add(cuota)

                cuotas_creadas.append(cuota)

            db_session.commit()
        except (KeyError, ValueError, SQLAlchemyError) as exc:
            return respuesta_error(exc)

        return jsonify({
            "año": año,
            "mes": mes,
            "cantidad": len(cuotas_creadas),
            "cuotas": [
                cuota.to_json()
                for cuota in cuotas_creadas
            ],
        }), 201

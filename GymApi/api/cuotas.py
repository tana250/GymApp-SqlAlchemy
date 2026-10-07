from flask import jsonify, request
from flask.views import MethodView
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from ..DataBase.database import db_session
from ..DataBase.modelos.socios import Socio
from ..DataBase.modelos.socio_planes import SocioPlan
from ..DataBase.modelos.cuotas import Cuota
from ..DataBase.modelos.cuotas_planes import CuotaPlan


class GenerarCuotasAPI(MethodView):

    def post(self):

        data = request.get_json()

        año = data.get("año")
        mes = data.get("mes")

        if año is None or mes is None:
            return jsonify({
                "error": "año y mes son obligatorios"
            }), 400

        if mes < 1 or mes > 12:
            return jsonify({
                "error": "El mes debe estar entre 1 y 12"
            }), 400

        socios = db_session.scalars(
            select(Socio)
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

        for socio in socios:

            # Si el socio no tiene planes,
            # no se genera una cuota.
            if not socio.socios_planes:
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

            for socio_plan in socio.socios_planes:

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

        return jsonify({
            "año": año,
            "mes": mes,
            "cantidad": len(cuotas_creadas),
            "cuotas": [
                cuota.to_json()
                for cuota in cuotas_creadas
            ],
        }), 201
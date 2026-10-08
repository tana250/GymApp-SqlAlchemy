from flask import jsonify
from flask.views import MethodView
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from ..DataBase.database import db_session
from ..DataBase.modelos.socio_planes import SocioPlan
from .crud import datos_json, respuesta_error


class SocioPlanAPI(MethodView):

    def post(self):

        data = datos_json()

        try:
            socio_id = data["socioId"]
            plan_id = data["planId"]

            # Evitar asignaciones duplicadas
            existing = db_session.scalar(
                select(SocioPlan).where(
                    SocioPlan.socioId == socio_id,
                    SocioPlan.planId == plan_id,
                )
            )

            if existing is not None:
                return jsonify({
                    "error": "El socio ya tiene asignado este plan"
                }), 409

            socio_plan = SocioPlan(
                socioId=socio_id,
                planId=plan_id,
            )

            db_session.add(socio_plan)
            db_session.commit()
        except (KeyError, ValueError, SQLAlchemyError) as exc:
            return respuesta_error(exc)

        return jsonify(
            socio_plan.to_json()
        ), 201


class SocioPlanListAPI(MethodView):

    def get(self):

        items = db_session.scalars(
            select(SocioPlan)
        ).all()

        return jsonify([
            item.to_json()
            for item in items
        ])


class SocioPlanItemAPI(MethodView):

    def delete(self, socio_id, plan_id):

        item = db_session.scalar(
            select(SocioPlan).where(
                SocioPlan.socioId == socio_id,
                SocioPlan.planId == plan_id,
            )
        )

        if item is None:
            return jsonify({
                "error": "Asignación no encontrada"
            }), 404

        try:
            db_session.delete(item)
            db_session.commit()
        except SQLAlchemyError as exc:
            return respuesta_error(exc)

        return "", 204
from flask import jsonify, request
from flask.views import MethodView
from sqlalchemy import select

from ..DataBase.database import db_session
from ..DataBase.modelos.socio_planes import SocioPlan


class SocioPlanAPI(MethodView):

    def post(self):

        data = request.get_json()

        socio_plan = SocioPlan(
            socioId=data["socioId"],
            planId=data["planId"],
        )

        # Evitar asignaciones duplicadas
        existing = db_session.scalar(
            select(SocioPlan).where(
                SocioPlan.socioId == data["socioId"],
                SocioPlan.planId == data["planId"],
            )
        )

        if existing is not None:
            return jsonify({
                "error": "El socio ya tiene asignado este plan"
            }), 409

        db_session.add(socio_plan)
        db_session.commit()

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

        db_session.delete(item)
        db_session.commit()

        return "", 204
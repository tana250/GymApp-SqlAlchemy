from flask import jsonify
from flask.views import MethodView
from sqlalchemy.exc import SQLAlchemyError

from ..DataBase.database import db_session
from ..DataBase.modelos import Telefono


class TelefonoItemAPI(MethodView):
    """
    DELETE /telefonos/<socioId>/<numero>

    Telefono tiene clave compuesta (socioId, numero),
    por lo que no puede usar la vista genérica ItemAPI
    (que espera un id numérico).
    """

    def delete(self, socio_id, numero):

        item = db_session.get(
            Telefono,
            {
                "socioId": socio_id,
                "numero": numero,
            },
        )

        if item is None:
            return jsonify({
                "error": "No encontrado",
            }), 404

        try:
            db_session.delete(item)
            db_session.commit()
        except SQLAlchemyError as exc:
            db_session.rollback()
            return jsonify({
                "error": str(exc),
            }), 500

        return "", 204

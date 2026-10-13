from flask import (
    jsonify,
    session,
)
from flask.views import MethodView
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from ..DataBase.database import db_session
from ..DataBase.modelos import Usuario
from .crud import (
    datos_json,
    respuesta_error,
)


class LoginAPI(MethodView):
    """
    POST /auth/login

    {username, password} → abre la sesión (cookie)
    y devuelve el usuario.

    Un usuario inexistente, una contraseña incorrecta
    y un usuario inactivo devuelven el MISMO 401
    genérico: no se filtra qué usuarios existen.
    """

    init_every_request = False

    def post(self):

        data = datos_json()

        username = data.get("username")
        password = data.get("password")

        incorrecto = jsonify({
            "error": "Usuario o contraseña incorrectos",
        }), 401

        if not isinstance(username, str) or not username.strip():
            return incorrecto

        if not isinstance(password, str) or not password:
            return incorrecto

        try:
            usuario = db_session.scalar(
                select(Usuario).where(
                    Usuario.username == username,
                )
            )
        except SQLAlchemyError as exc:
            return respuesta_error(exc)

        if usuario is None or not usuario.check_password(password):
            return incorrecto

        if not usuario.activo:
            return incorrecto

        session.clear()
        session["usuarioId"] = usuario.id

        return jsonify(usuario.to_json())


class LogoutAPI(MethodView):
    """
    POST /auth/logout

    Cierra la sesión. Idempotente: 204 aunque no
    hubiera una sesión abierta.
    """

    def post(self):

        session.clear()

        return "", 204


class MeAPI(MethodView):
    """
    GET /auth/me

    Devuelve el usuario de la sesión o 401.

    /auth/* está exento del @app.before_request de
    create_app, así que acá se valida la sesión
    (incluido que el usuario siga activo).
    """

    def get(self):

        usuario_id = session.get("usuarioId")

        if usuario_id is None:
            return jsonify({
                "error": "No autorizado",
            }), 401

        try:
            usuario = db_session.scalar(
                select(Usuario).where(
                    Usuario.id == usuario_id,
                )
            )
        except SQLAlchemyError as exc:
            return respuesta_error(exc)

        if usuario is None or not usuario.activo:
            session.clear()
            return jsonify({
                "error": "No autorizado",
            }), 401

        return jsonify(usuario.to_json())

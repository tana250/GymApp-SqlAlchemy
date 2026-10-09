import os

from flask import (
    Flask,
    jsonify,
    request,
    session,
)
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from .DataBase.database import (
    db_session,
    init_db,
)

from .DataBase.modelos import (
    Telefono,
    Socio,
    Plan,
    SocioPlan,
    Cuota,
    CuotaPlan,
    MetodoPago,
    Pago,
    Usuario,
)

from .api.crud import (
    ItemAPI,
    register_api,
)

from .api.socio_planes import (
    SocioPlanAPI,
    SocioPlanListAPI,
    SocioPlanItemAPI,
)

from .api.telefonos import (
    TelefonoItemAPI,
)

from .api.cuotas import GenerarCuotasAPI

from .api.pagos import PagoAPI

from .api.auth import (
    LoginAPI,
    LogoutAPI,
    MeAPI,
)


def crear_relaciones_socio(socio, data):
    """
    Hook on_create de POST /socios/.

    Crea los teléfonos y asigna los planes en la
    MISMA transacción que el socio:

        {
            ...campos del socio,
            "telefonos": ["1234", "5678"],
            "planIds": [1, 2]
        }

    Si falla algo, se hace rollback completo: no
    queda el socio a medio armar.
    """

    telefonos = data.get("telefonos", [])

    if not isinstance(telefonos, list):
        raise ValueError("telefonos debe ser una lista")

    for numero in telefonos:
        db_session.add(
            Telefono(
                socioId=socio.id,
                numero=str(numero),
            )
        )

    plan_ids = data.get("planIds", [])

    if not isinstance(plan_ids, list):
        raise ValueError("planIds debe ser una lista")

    if not plan_ids:
        return

    try:
        plan_ids = [
            int(plan_id)
            for plan_id in plan_ids
        ]
    except (TypeError, ValueError):
        raise ValueError(
            "planIds debe contener solo números"
        ) from None

    # Sin duplicados y con validación explícita:
    # SQLite no valida foreign keys a nivel de datos
    # por sí solo (solo con el PRAGMA, ver database.py),
    # así que un plan inexistente no triggerea error.
    plan_ids = list(dict.fromkeys(plan_ids))

    existentes = set(
        db_session.scalars(
            select(Plan.id).where(
                Plan.id.in_(plan_ids)
            )
        ).all()
    )

    faltantes = set(plan_ids) - existentes

    if faltantes:
        raise ValueError(
            f"Planes inexistentes: {sorted(faltantes)}"
        )

    for plan_id in plan_ids:
        db_session.add(
            SocioPlan(
                socioId=socio.id,
                planId=plan_id,
            )
        )


def create_app(test_config=None):

    app = Flask(
        __name__,
        instance_relative_config=True,
    )

    app.config.from_mapping(
        SECRET_KEY="dev",
    )

    if test_config is None:
        app.config.from_pyfile(
            "config.py",
            silent=True,
        )
    else:
        app.config.from_mapping(
            test_config
        )

    try:
        os.makedirs(
            app.instance_path
        )
    except OSError:
        pass

    # Crear las tablas.
    init_db()

    # Seed: si no hay usuarios, crear el admin
    # por defecto (cambiar la password por
    # SQL/script; no hay endpoint de gestión).
    if db_session.scalar(select(Usuario.id)) is None:
        admin = Usuario(
            username="admin",
            activo=True,
        )
        admin.set_password("admin")
        db_session.add(admin)
        db_session.commit()

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    @app.before_request
    def exigir_sesion():
        # Todo lo que no sea /auth requiere sesión.
        if request.path.startswith("/auth"):
            return None

        usuario_id = session.get("usuarioId")

        if usuario_id is None:
            return jsonify({
                "error": "No autorizado"
            }), 401

        # Se valida el usuario completo (no solo el
        # id) para que un usuario desactivado pierda
        # el acceso apenas se lo desactiva.
        usuario = db_session.scalar(
            select(Usuario).where(
                Usuario.id == usuario_id,
            )
        )

        if usuario is None or not usuario.activo:
            session.clear()
            return jsonify({
                "error": "No autorizado"
            }), 401

        return None

    # =========================
    # AUTH
    # =========================

    app.add_url_rule(
        "/auth/login",
        view_func=LoginAPI.as_view(
            "auth-login"
        ),
        methods=["POST"],
    )

    app.add_url_rule(
        "/auth/logout",
        view_func=LogoutAPI.as_view(
            "auth-logout"
        ),
        methods=["POST"],
    )

    app.add_url_rule(
        "/auth/me",
        view_func=MeAPI.as_view(
            "auth-me"
        ),
        methods=["GET"],
    )

    # =========================
    # SOCIOS
    # =========================

    register_api(
        app,
        Socio,
        "socios",
        on_create=crear_relaciones_socio,
        load=(
            selectinload(Socio.socios_planes),
        ),
    )

    # =========================
    # TELEFONOS
    # =========================

    # Sin vista genérica de item: Telefono tiene
    # clave compuesta (socioId, numero).
    register_api(
        app,
        Telefono,
        "telefonos",
        item=False,
    )

    app.add_url_rule(
        "/telefonos/<int:socio_id>/<numero>",
        view_func=TelefonoItemAPI.as_view(
            "telefono-item"
        ),
        methods=["DELETE"],
    )

    # =========================
    # PLANES
    # =========================

    register_api(
        app,
        Plan,
        "planes",
    )

    # =========================
    # SOCIO - PLANES
    # =========================

    app.add_url_rule(
        "/socioPlanes/",
        view_func=SocioPlanListAPI.as_view(
            "socio-planes-list"
        ),
        methods=["GET"],
    )

    app.add_url_rule(
        "/socioPlanes/",
        view_func=SocioPlanAPI.as_view(
            "socio-planes"
        ),
        methods=["POST"],
    )

    app.add_url_rule(
        "/socioPlanes/<int:socio_id>/<int:plan_id>",
        view_func=SocioPlanItemAPI.as_view(
            "socio-plan-item"
        ),
        methods=["DELETE"],
    )

    # =========================
    # CUOTAS
    # =========================

    register_api(
        app,
        Cuota,
        "cuotas",
        load=(
            selectinload(Cuota.socio),
            selectinload(Cuota.cuotas_planes),
            selectinload(Cuota.pagos),
        ),
    )

    # =========================
    # GENERAR CUOTAS
    # =========================

    app.add_url_rule(
        "/cuotas/generar",
        view_func=GenerarCuotasAPI.as_view(
            "generar-cuotas"
        ),
        methods=["POST"],
    )

    # =========================
    # CUOTAS - PLANES
    # =========================

    register_api(
        app,
        CuotaPlan,
        "cuotasPlanes",
    )

    # =========================
    # METODOS DE PAGO
    # =========================

    register_api(
        app,
        MetodoPago,
        "metodosPago",
    )

    # =========================
    # PAGOS
    # =========================

    pago_group = PagoAPI.as_view(
        "pagos-group",
        Pago,
        None,
        (
            selectinload(Pago.metodoPago),
            selectinload(Pago.cuota).selectinload(
                Cuota.socio,
            ),
        ),
    )

    app.add_url_rule(
        "/pagos/",
        view_func=pago_group,
        methods=[
            "GET",
            "POST",
        ],
    )

    app.add_url_rule(
        "/pagos/<int:id>",
        view_func=ItemAPI.as_view(
            "pagos-item",
            Pago,
        ),
        methods=[
            "GET",
            "PATCH",
            "DELETE",
        ],
    )

    return app

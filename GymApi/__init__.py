import os

from flask import Flask

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
    Pago,
)

from .api.crud import register_api

from .api.socio_planes import (
    SocioPlanAPI,
    SocioPlanListAPI,
    SocioPlanItemAPI,
)

from .api.cuotas import GenerarCuotasAPI


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

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    # =========================
    # SOCIOS
    # =========================

    register_api(
        app,
        Socio,
        "socios",
    )

    # =========================
    # TELEFONOS
    # =========================

    register_api(
        app,
        Telefono,
        "telefonos",
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
    # PAGOS
    # =========================

    register_api(
        app,
        Pago,
        "pagos",
    )

    return app

from sqlalchemy import select

from ..database import db_session
from ..modelos.cuotas import Cuota
from ..modelos.cuota_plan import CuotaPlan
from ..modelos.socio_plan import SocioPlan


def generar_cuotas(año: int, mes: int):

    socios_planes = (
        db_session.query(SocioPlan)
        .join(SocioPlan.socio)
        .join(SocioPlan.plan)
        .filter(
            SocioPlan.activo.is_(True),
        )
        .filter(
            SocioPlan.socio.has(activo=True)
        )
        .filter(
            SocioPlan.plan.has(activo=True)
        )
        .all()
    )

    socios = {}

    for socio_plan in socios_planes:
        socio_id = socio_plan.socioId

        if socio_id not in socios:
            socios[socio_id] = []

        socios[socio_id].append(
            socio_plan
        )

    creadas = 0

    for socio_id, planes in socios.items():

        cuota = (
            db_session.query(Cuota)
            .filter_by(
                socioId=socio_id,
                año=año,
                mes=mes,
            )
            .first()
        )

        if cuota is None:
            cuota = Cuota(
                socioId=socio_id,
                año=año,
                mes=mes,
            )

            db_session.add(cuota)
            db_session.flush()

            creadas += 1

        for socio_plan in planes:

            existente = (
                db_session.query(CuotaPlan)
                .filter_by(
                    cuotaId=cuota.id,
                    planId=socio_plan.planId,
                )
                .first()
            )

            if existente:
                continue

            cuota_plan = CuotaPlan(
                cuotaId=cuota.id,
                planId=socio_plan.planId,
                precio=socio_plan.plan.valor,
            )

            db_session.add(cuota_plan)

    db_session.commit()

    return creadas
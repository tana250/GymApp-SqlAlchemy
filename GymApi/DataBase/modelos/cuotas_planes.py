from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class CuotaPlan(Base):

    __tablename__ = "CuotasPlanes"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    cuotaId: Mapped[int] = mapped_column(
        ForeignKey("Cuotas.id"),
        nullable=False,
    )

    planId: Mapped[int] = mapped_column(
        ForeignKey("Planes.id"),
        nullable=False,
    )

    precio: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    cuota: Mapped["Cuota"] = relationship(
        back_populates="cuotas_planes"
    )

    plan: Mapped["Plan"] = relationship(
        back_populates="cuotas_planes"
    )

    __table_args__ = (
        UniqueConstraint(
            "cuotaId",
            "planId",
            name="uq_cuota_plan",
        ),
    )

    def __init__(
        self,
        cuotaId=None,
        planId=None,
        precio=None,
    ):
        self.cuotaId = cuotaId
        self.planId = planId
        self.precio = precio

    def to_json(self):

        return {
            "id": self.id,
            "cuotaId": self.cuotaId,
            "planId": self.planId,
            "precio": self.precio,
        }

    @classmethod
    def from_json(cls, data):

        return cls(
            cuotaId=data["cuotaId"],
            planId=data["planId"],
            precio=data["precio"],
        )

    def update_from_json(self, data):

        if "precio" in data:
            self.precio = data["precio"]
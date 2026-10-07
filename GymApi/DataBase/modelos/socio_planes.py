from __future__ import annotations

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class SocioPlan(Base):

    __tablename__ = "SociosPlanes"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    socioId: Mapped[int] = mapped_column(
        ForeignKey("Socios.id"),
        nullable=False,
    )

    planId: Mapped[int] = mapped_column(
        ForeignKey("Planes.id"),
        nullable=False,
    )

    activo: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    socio: Mapped["Socio"] = relationship(
        back_populates="socios_planes"
    )

    plan: Mapped["Plan"] = relationship(
        back_populates="socios_planes"
    )

    def __init__(
        self,
        socioId=None,
        planId=None,
        activo=True,
    ):
        self.socioId = socioId
        self.planId = planId
        self.activo = activo

    def to_json(self):
        return {
            "id": self.id,
            "socioId": self.socioId,
            "planId": self.planId,
            "activo": self.activo,
        }

    @classmethod
    def from_json(cls, data):
        return cls(
            socioId=data["socioId"],
            planId=data["planId"],
            activo=data.get("activo", True),
        )

    def update_from_json(self, data):

        if "activo" in data:
            self.activo = data["activo"]

        if "socioId" in data:
            self.socioId = data["socioId"]

        if "planId" in data:
            self.planId = data["planId"]
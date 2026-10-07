from __future__ import annotations

from datetime import date

from sqlalchemy import Date, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Pago(Base):

    __tablename__ = "Pagos"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    cuotaId: Mapped[int] = mapped_column(
        ForeignKey("Cuotas.id"),
        nullable=False,
    )

    fecha: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    importe: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    cuota: Mapped["Cuota"] = relationship(
        back_populates="pagos"
    )

    def __init__(
        self,
        cuotaId=None,
        fecha=None,
        importe=None,
    ):
        self.cuotaId = cuotaId
        self.fecha = fecha
        self.importe = importe

    def to_json(self):

        return {
            "id": self.id,
            "cuotaId": self.cuotaId,
            "fecha": (
                self.fecha.isoformat()
                if self.fecha
                else None
            ),
            "importe": self.importe,
        }

    @classmethod
    def from_json(cls, data):

        fecha = data.get("fecha")

        if isinstance(fecha, str):
            fecha = date.fromisoformat(fecha)

        return cls(
            cuotaId=data["cuotaId"],
            fecha=fecha,
            importe=data["importe"],
        )

    def update_from_json(self, data):

        if "fecha" in data:

            fecha = data["fecha"]

            if isinstance(fecha, str):
                fecha = date.fromisoformat(fecha)

            self.fecha = fecha

        if "importe" in data:
            self.importe = data["importe"]
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

    metodoPagoId: Mapped[int] = mapped_column(
        ForeignKey("MetodosPago.id"),
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

    metodoPago: Mapped["MetodoPago"] = relationship(
        back_populates="pagos"
    )

    def __init__(
        self,
        cuotaId=None,
        metodoPagoId=None,
        fecha=None,
        importe=None,
    ):
        self.cuotaId = cuotaId
        self.metodoPagoId = metodoPagoId
        self.fecha = fecha
        self.importe = importe

    def to_json(self):

        return {
            "id": self.id,
            "cuotaId": self.cuotaId,
            "metodoPagoId": self.metodoPagoId,
            "metodoPago": (
                self.metodoPago.to_json()
                if self.metodoPago
                else None
            ),
            "socio": (
                {
                    "id": self.cuota.socio.id,
                    "nombre": self.cuota.socio.nombre,
                    "apellido": self.cuota.socio.apellido,
                }
                if self.cuota and self.cuota.socio
                else None
            ),
            "periodo": (
                {
                    "año": self.cuota.año,
                    "mes": self.cuota.mes,
                }
                if self.cuota
                else None
            ),
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
            metodoPagoId=data["metodoPagoId"],
            fecha=fecha,
            importe=data["importe"],
        )

    def update_from_json(self, data):

        if "cuotaId" in data:
            self.cuotaId = data["cuotaId"]

        if "metodoPagoId" in data:
            self.metodoPagoId = data["metodoPagoId"]

        if "fecha" in data:

            fecha = data["fecha"]

            if isinstance(fecha, str):
                fecha = date.fromisoformat(fecha)

            self.fecha = fecha

        if "importe" in data:
            self.importe = data["importe"]
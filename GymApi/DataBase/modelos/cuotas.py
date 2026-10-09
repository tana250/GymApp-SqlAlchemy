from __future__ import annotations

from typing import List

from sqlalchemy import ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Cuota(Base):

    __tablename__ = "Cuotas"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    socioId: Mapped[int] = mapped_column(
        ForeignKey("Socios.id"),
        nullable=False,
    )

    año: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    mes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    socio: Mapped["Socio"] = relationship(
        back_populates="cuotas"
    )

    cuotas_planes: Mapped[List["CuotaPlan"]] = relationship(
        back_populates="cuota",
        cascade="all, delete-orphan",
    )

    pagos: Mapped[List["Pago"]] = relationship(
        back_populates="cuota",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "socioId",
            "año",
            "mes",
            name="uq_cuota_socio_periodo",
        ),
    )

    def __init__(
        self,
        socioId=None,
        año=None,
        mes=None,
    ):
        self.socioId = socioId
        self.año = año
        self.mes = mes

    @property
    def total(self) -> int:
        """
        Total de la cuota.

        Se calcula sumando el precio de todos
        los planes incluidos en la cuota.
        """
        return sum(
            cuota_plan.precio
            for cuota_plan in self.cuotas_planes
        )

    @property
    def pagado(self) -> int:
        """
        Total abonado para esta cuota.
        """
        return sum(
            pago.importe
            for pago in self.pagos
        )

    @property
    def saldo(self) -> int:
        """
        Saldo pendiente de la cuota.
        """
        return max(
            self.total - self.pagado,
            0
        )

    @property
    def estado(self) -> str:
        """
        Estado actual de la cuota.
        """

        if self.pagado == 0:
            return "pendiente"

        if self.pagado < self.total:
            return "parcial"

        return "pagada"

    def to_json(self):

        return {
            "id": self.id,
            "socioId": self.socioId,
            "año": self.año,
            "mes": self.mes,

            "socio": (
                {
                    "id": self.socio.id,
                    "dni": self.socio.dni,
                    "nombre": self.socio.nombre,
                    "apellido": self.socio.apellido,
                }
                if self.socio
                else None
            ),

            "planes": [
                cuota_plan.to_json()
                for cuota_plan in self.cuotas_planes
            ],

            "total": self.total,
            "pagado": self.pagado,
            "saldo": self.saldo,
            "estado": self.estado,

            "pagos": [
                pago.to_json()
                for pago in self.pagos
            ],
        }

    @classmethod
    def from_json(cls, data):

        return cls(
            socioId=data["socioId"],
            año=data["año"],
            mes=data["mes"],
        )

    def update_from_json(self, data):
        """
        Las cuotas generadas no se pueden modificar
        mediante PATCH.

        Para modificar una cuota se deberían crear
        operaciones específicas.
        """
        pass
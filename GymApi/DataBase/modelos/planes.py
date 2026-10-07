from __future__ import annotations

from typing import List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Plan(Base):

    __tablename__ = "Planes"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    nombre: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    descripcion: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    valor: Mapped[int] = mapped_column(
        nullable=False,
    )

    activo: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    socios_planes: Mapped[List["SocioPlan"]] = relationship(
        back_populates="plan",
    )

    cuotas_planes: Mapped[List["CuotaPlan"]] = relationship(
        back_populates="plan",
    )

    def __init__(
        self,
        nombre=None,
        descripcion=None,
        valor=None,
        activo=True,
    ):
        self.nombre = nombre
        self.descripcion = descripcion
        self.valor = valor
        self.activo = activo

    def to_json(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "valor": self.valor,
            "activo": self.activo,
        }

    @classmethod
    def from_json(cls, data):
        return cls(
            nombre=data["nombre"],
            descripcion=data.get("descripcion"),
            valor=data["valor"],
            activo=data.get("activo", True),
        )

    def update_from_json(self, data):

        if "nombre" in data:
            self.nombre = data["nombre"]

        if "descripcion" in data:
            self.descripcion = data["descripcion"]

        if "valor" in data:
            self.valor = data["valor"]

        if "activo" in data:
            self.activo = data["activo"]
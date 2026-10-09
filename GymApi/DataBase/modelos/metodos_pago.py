from __future__ import annotations

from typing import List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class MetodoPago(Base):

    __tablename__ = "MetodosPago"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    nombre: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
    )

    descripcion: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    activo: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    pagos: Mapped[List["Pago"]] = relationship(
        back_populates="metodoPago",
    )

    def __init__(
        self,
        nombre=None,
        descripcion=None,
        activo=True,
    ):
        self.nombre = nombre
        self.descripcion = descripcion
        self.activo = activo

    def to_json(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "activo": self.activo,
        }

    @classmethod
    def from_json(cls, data):
        return cls(
            nombre=data["nombre"],
            descripcion=data.get("descripcion"),
            activo=data.get("activo", True),
        )

    def update_from_json(self, data):

        if "nombre" in data:
            self.nombre = data["nombre"]

        if "descripcion" in data:
            self.descripcion = data["descripcion"]

        if "activo" in data:
            self.activo = data["activo"]
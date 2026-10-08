from __future__ import annotations

from typing import List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Socio(Base):

    __tablename__ = "Socios"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    dni: Mapped[str | None] = mapped_column(
        String(10),
        unique=True,
        nullable=True,
    )

    nombre: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    apellido: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    activo: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    socios_planes: Mapped[List["SocioPlan"]] = relationship(
        back_populates="socio",
        cascade="all, delete-orphan",
    )

    cuotas: Mapped[List["Cuota"]] = relationship(
        back_populates="socio",
        cascade="all, delete-orphan",
    )

    telefonos: Mapped[List["Telefono"]] = relationship(
        back_populates="socio",
        cascade="all, delete-orphan",
    )

    def __init__(
        self,
        dni=None,
        nombre=None,
        apellido=None,
        activo=True,
    ):
        self.dni = dni
        self.nombre = nombre
        self.apellido = apellido
        self.activo = activo

    def to_json(self):
        return {
            "id": self.id,
            "dni": self.dni,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "activo": self.activo,

            "planes": [
                socio_plan.to_json()
                for socio_plan in self.socios_planes
            ],
        }

    @classmethod
    def from_json(cls, data):
        return cls(
            # Un DNI vacío se guarda como NULL:
            # la columna es unique y dos "" chocarían.
            dni=data.get("dni") or None,
            nombre=data["nombre"],
            apellido=data["apellido"],
            activo=data.get("activo", True),
        )

    def update_from_json(self, data):

        if "dni" in data:
            self.dni = data["dni"] or None

        if "nombre" in data:
            self.nombre = data["nombre"]

        if "apellido" in data:
            self.apellido = data["apellido"]

        if "activo" in data:
            self.activo = data["activo"]
from __future__ import annotations

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Telefono(Base):

    __tablename__ = "Telefonos"

    socioId: Mapped[int] = mapped_column(
        ForeignKey("Socios.id"),
        primary_key=True,
    )

    numero: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
    )

    socio: Mapped["Socio"] = relationship(
        back_populates="telefonos"
    )

    def __init__(
        self,
        numero=None,
        socioId=None,
    ):
        self.numero = numero
        self.socioId = socioId

    def to_json(self):
        return {
            "socioId": self.socioId,
            "numero": self.numero,
        }

    @classmethod
    def from_json(cls, data):
        return cls(
            socioId=data["socioId"],
            numero=data["numero"],
        )
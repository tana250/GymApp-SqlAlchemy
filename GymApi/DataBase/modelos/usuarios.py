from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from werkzeug.security import (
    check_password_hash,
    generate_password_hash,
)

from ..database import Base


class Usuario(Base):

    __tablename__ = "Usuarios"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    username: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    activo: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    def __init__(
        self,
        username=None,
        activo=True,
    ):
        self.username = username
        self.activo = activo

    def set_password(self, password):
        self.password_hash = (
            generate_password_hash(password)
        )

    def check_password(self, password):
        return check_password_hash(
            self.password_hash,
            password,
        )

    def to_json(self):
        # OJO: nunca exponer password_hash.
        return {
            "id": self.id,
            "username": self.username,
            "activo": self.activo,
        }
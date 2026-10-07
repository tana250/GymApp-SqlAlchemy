from flask import jsonify, request
from flask.views import MethodView
from sqlalchemy import select

from ..DataBase.database import db_session


class ItemAPI(MethodView):

    init_every_request = False

    def __init__(self, model):
        self.model = model

    def _get_item(self, id):

        return db_session.scalar(
            select(self.model).where(
                self.model.id == id
            )
        )

    def get(self, id):

        item = self._get_item(id)

        if item is None:
            return jsonify({
                "error": "No encontrado"
            }), 404

        return jsonify(
            item.to_json()
        )

    def patch(self, id):

        item = self._get_item(id)

        if item is None:
            return jsonify({
                "error": "No encontrado"
            }), 404

        data = request.get_json()

        item.update_from_json(data)

        db_session.commit()

        return jsonify(
            item.to_json()
        )

    def delete(self, id):

        item = self._get_item(id)

        if item is None:
            return jsonify({
                "error": "No encontrado"
            }), 404

        db_session.delete(item)
        db_session.commit()

        return "", 204


class GroupAPI(MethodView):

    init_every_request = False

    def __init__(self, model):
        self.model = model

    def get(self):

        items = db_session.scalars(
            select(self.model)
        ).all()

        return jsonify([
            item.to_json()
            for item in items
        ])

    def post(self):

        data = request.get_json()

        item = self.model.from_json(
            data
        )

        db_session.add(item)
        db_session.commit()

        return jsonify(
            item.to_json()
        ), 201


def register_api(app, model, name):

    item = ItemAPI.as_view(
        f"{name}-item",
        model,
    )

    group = GroupAPI.as_view(
        f"{name}-group",
        model,
    )

    app.add_url_rule(
        f"/{name}/<int:id>",
        view_func=item,
        methods=[
            "GET",
            "PATCH",
            "DELETE",
        ],
    )

    app.add_url_rule(
        f"/{name}/",
        view_func=group,
        methods=[
            "GET",
            "POST",
        ],
    )

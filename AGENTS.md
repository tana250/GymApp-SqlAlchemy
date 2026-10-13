# AGENTS.md

Dos mitades independientes, sin herramientas compartidas:
- `GymApi/` — API Flask 3 + SQLAlchemy 2 puro (NO Flask-SQLAlchemy), SQLite
- `frontend/` — React 19 + Vite 8 + oxlint, JS puro (sin TypeScript)

## Comandos

Desde la raíz del repo:
```bash
.env/bin/flask --app GymApi run   # API en :5000 (factory: GymApi.create_app)
```
En `frontend/`:
```bash
npm run dev    # servidor dev de Vite (:5173 por defecto), proxea rutas de la API a localhost:5000
npm run lint   # oxlint; pasa, hoy con warnings
```

- `.env/` es el venv de Python, NO un archivo de variables de entorno. No hay
  requirements.txt/pyproject: reinstalar deps con `.env/bin/pip install flask sqlalchemy`.
- No hay tests, CI, linter/formatter de Python ni migraciones.

## Backend

- `GymApi/__init__.py: create_app` registra todas las rutas y ejecuta `init_db()` al arrancar.
- `GymApi/DataBase/database.py`: el engine `sqlite:///instance/database.db` es relativo al
  CWD — siempre arrancar Flask desde la raíz del repo o se crea silenciosamente una DB vacía
  en otro lado. Activa `PRAGMA foreign_keys=ON` en cada conexión: las FK se validan de verdad
  (violación → 409 en JSON).
- `GymApi/api/crud.py: register_api(app, model, name, on_create=None, load=(), item=True)`
  monta automáticamente `GET/POST /{name}/` y (si `item=True`) `GET/PATCH/DELETE /{name}/<id>`.
  El modelo debe implementar `to_json()`, `from_json(data)`, `update_from_json(data)` y un PK `id`.
  `on_create` es un hook que recibe `(item, data)` y corre en la MISMA transacción del alta;
  `load` recibe tuplas de `selectinload` para evitar N+1 en listados (socios y cuotas lo usan);
  `item=False` es para modelos sin id numérico — `Telefono` tiene clave compuesta y su DELETE
  vive en `api/telefonos.py` (`/telefonos/<socioId>/<numero>`). Todas las vistas devuelven
  errores JSON `{"error": ...}` (400 campos/validación, 404, 409 integridad/FK, 500 SQL),
  nunca HTML. Las rutas custom se conectan a mano en `create_app` (ej. `/socioPlanes/…`,
  `POST /cuotas/generar`).
- Los modelos viven en `GymApi/DataBase/modelos/` y deben exportarse desde `modelos/__init__.py`.
- `POST /socios/` acepta además `"telefonos": [...]` y `"planIds": [...]`: socio + teléfonos +
  planes en una sola transacción (hook `crear_relaciones_socio` en `GymApi/__init__.py`); si
  falla algo, rollback total (no queda el socio a medio armar).
- Listados genéricos filtran con `?activo=true|false` (solo en modelos con columna `activo`;
  recurso sin la columna → 400). `POST /cuotas/generar` solo genera cuotas de socios/planes
  activos.
- El schema se crea con `Base.metadata.create_all()` al arrancar. No hay Alembic: cambiar un
  modelo NO altera el `instance/database.db` existente; borrarlo reconstruye el schema (pérdida
  de datos). Los deletes en cascada están declarados en `Socio` (socios_planes, cuotas → pagos);
  borrar un plan en uso responde 409 en vez de dejar huérfanos.
- `instance/config.py` es opcional: se carga como config de Flask si existe (hoy no existe).
- Modelos y endpoints pagos: `Pago` tiene `metodoPagoId` (FK a `MetodosPago`). `POST /pagos/` usa un view custom (`GymApi/api/pagos.py`, `PagoAPI`) que valida antes del flush (cuota/método inexistentes, método inactivo e importe contra saldo → 400): el `GroupAPI` genérico no sirve porque hace `flush()` antes del hook `on_create` y la FK revienta con 409. `PagoAPI` hereda de `GroupAPI` (mismo GET listado con `load`). `GET /pagos/` devuelve el método (`metodoPago`), el socio y el período de la cuota.
- `MetodoPago` (`GymApi/DataBase/modelos/metodos_pago.py`): `nombre` único requerido, `descripcion` opcional, `activo` (default True; los pagos solo se registran con métodos activos); CRUD genérico en `/metodosPago/` con filtro `?activo=true|false`. La tabla `MetodosPago` se crea sola con `create_all`; las columnas `Pagos.metodoPagoId` y `MetodosPago.activo` se agregaron a la DB existente con `ALTER TABLE` one-off (la tabla `Pagos` estaba vacía y `MetodosPago` tiene default). Al recrear la DB desde cero el schema sale completo — no hay migraciones para estos cambios.
- Autenticación por sesión cookie: `Usuario` (`GymApi/DataBase/modelos/usuarios.py`) con `username` único y `password_hash` (werkzeug `generate_password_hash`/`check_password_hash`; `to_json()` jamás expone el hash). Endpoints custom en `GymApi/api/auth.py`: `POST /auth/login` (401 genérico "Usuario o contraseña incorrectos"), `POST /auth/logout` (204) y `GET /auth/me` (usuario logueado o 401). Un `@app.before_request` en `create_app` exige sesión + usuario **activo** en toda la API → 401 JSON; quedan públicos solo `/auth/*` y el frontend (raíz `index` y assets `static` servidos desde `frontend/dist`). `Usuarios` se crea sola con `create_all`; en cada arranque, si la tabla está vacía, `create_app` siembra `admin`/`admin` (cambiar la password por SQL/script). `secret_key` = "dev" (configurable en `instance/config.py`).
- `/` (`index` en `create_app`) sirve `frontend/dist/index.html`: el SPA compilado con Vite (`npm run build` en `frontend/`). Los assets (`/assets/…`, `favicon.svg`, `icons.svg`) los sirve Flask solo vía `static_folder=FRONTEND_DIST` + `static_url_path=""` (la ruta se calcula desde `__file__`, no depende del CWD). La raíz y los assets son públicos — el login lo decide el propio SPA contra `/auth/me`; todo el resto de la API exige sesión. Si el build no existe, `/` responde 503 con un aviso.
- El código, los nombres de campos (`año`, `mes`) y los mensajes de error de la API están en
  español — mantener la consistencia.
- Código muerto: `GymApi/DataBase/modelos/servicios/cuotas.py` nunca se importa y sus imports
  están rotos; la lógica real de generación de cuotas está inline en `GymApi/api/cuotas.py`.

## Frontend

- Sin router: `src/App.jsx` renderiza las cinco páginas a la vez (Socios, Planes, Cuotas, Métodos de pago, Pagos) tras el auth gate: `useAuth` (`hooks/useAuth.jsx`) consulta `GET /auth/me` al montar; sin sesión muestra `LoginForm` (`components/Auth/LoginForm.jsx`); logueado muestra las páginas + botón "Cerrar sesión" (`POST /auth/logout`).
- Los llamados a la API pasan por `request()` en `src/services/api.js`; un archivo por recurso
  en `src/services/`. Los errores son `{"error": ...}` (la key de Flask) y se lanzan con `throw`.
- Convención de hooks (`useSocios`, `usePlanes`, `usePagos`, `useCuotas`, `useTelefonos`,
  `useSocioPlanes`, `useMetodosPago`): toda mutación termina con `await loadX()` — la lista se
  re-pide al backend, nunca se actualiza en local. El `loading` de pantalla completa solo se
  activa en la primera carga (ref `primeraCarga`), para no blanquear la UI en cada guardado.
- La página de Socios usa modales (`components/Socios/Modal.jsx`): "Modificar" (`SocioEditForm`:
  nombre, apellido y ABM de teléfonos) y "Planes" (`SocioPlanes`: asignar/quitar). "Dar de baja"
  / "Reactivar" es un `PATCH /socios/<id> {activo}`; la creación manda `telefonos` + `planIds`
  en el mismo `POST /socios/` (`SocioForm`). El socio del modal se deriva de la lista por id
  (no se guarda un snapshot).
- Cuotas: el listado filtra las cuotas `estado === "pagada"` (en `useCuotas.loadCuotas`; `estado`
  es calculado, no columna). El cobro NO vive en el detalle de la cuota (es informativo).
- Pagos: `PagosPage` tiene "Cobrar cuota" (`components/Pagos/PagarCuotaForm.jsx` — busca socio por
  DNI en cliente, elige socio → cuota pendiente → método activo → importe, y registra con
  `POST /pagos/` vía `createPago`) y el listado "Cobros". La gestión de métodos de pago es una
  página aparte (`MetodosPagoPage`) con crear/editar/eliminar y toggle `activo`
  (`PATCH /metodosPago/<id> {activo}`). `PagoForm` filtra los métodos activos.
- Proxy de Vite (`frontend/vite.config.js`): solo los prefijos listados llegan a la API — hoy
  `/auth`, `/socios`, `/telefonos`, `/planes`, `/socioPlanes`, `/cuotas`, `/cuotasPlanes`,
  `/metodosPago`, `/pagos`. Al agregar un recurso, agregar su prefijo acá o Vite devuelve
  `index.html` en vez de JSON.
- La API no tiene CORS: las llamadas del browser tienen que pasar por el proxy de Vite en dev.

## Git

- Solo `main`. `__pycache__/*.pyc` y `instance/database.db` están trackeados, así que aparecen
  como modificados en `git status` — no commitear bytecode regenerado ni cambios de la DB.

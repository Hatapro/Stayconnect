Listado Simple (React + PocketBase)

Proyecto mínimo en React + Vite para mostrar y eliminar elementos desde una colección PocketBase llamada `simpleList`.

Setup

1. Sitúate en la carpeta del proyecto:

```cmd
cd Codigo\listado-simple-react
```

2. Instala dependencias:

```cmd
npm install
```

3. Ejecuta en modo desarrollo:

```cmd
npm run dev
```

Funcionalidades

- El frontend obtiene todos los registros de la colección `simpleList` (usa el Admin UI de PocketBase para crear la colección y añade los campos: `name` (text), `attibute` (text) y `price` (number)).
- Haz clic en "Eliminar" para borrar un elemento (se pedirá confirmación).

Seeder

Incluye un seeder en `src/seed_simpleList.mjs` que limpia e inserta registros en la colección `simpleList`.

Para ejecutarlo:

```cmd
cd Codigo\listado-simple-react
npm install
npm run seed
```
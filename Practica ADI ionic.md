### Practica 4 - Aplicaciones web en dispositivos móviles

### Creacion del proyecto

- [Documentacion Ionic creacion de proyecto](https://ionicframework.com/docs/vue/quickstart)

- De las 3 plantillas escogeremos blank

> Ionic usa TypeScript

### Requisitos minimos (7 puntos)

- Minimo: Login, Logout y CRUD de algun recurso

- Organizacion con `<ion-page>`. 

    > 1 pantalla = ion-page

- Minimo estas 2 pantallas: 

    - Pantalla inicial solo con el formulario de login

    - Pantalla con lista &rarr; `<ion-list>`. Donde en cada fila aparecera un elemento con botones para editar y borrar y haya alguna forma de añadir un elemento. Desde esta pantalla se podra hacer logout.

> En resumen, una pantalla de login y otra de productos.

- [Documentacion Ionic componentes](https://ionicframework.com/docs/components)


### Requisitos adicionales (3 puntos)


- CRUD mas de un recuros `(1 punto)` &rarr; Si hay que añadir otra pantalla habra que hacer un menu para navegar entre ambas.

- Implementar notificaciones en tiempo real `(1 punto)` &rarr; [Realtime API de PocketBase](https://pocketbase.io/docs/api-realtime/). Se usa para cuando se modifiquen los datos en el backend aparezcan automaticamente en el frontend. No hace falta que modifiquemos los datos en el frontend, se puede hacer en el panel de control de PocketBase.

    > Hay que grabar un video para demostrar que se cambian los datos correctamente (si se hace esta parte)

- Desplegar la app como una pwa `(2 puntos, 1 por frontend y 1 por backend)` &rarr; [Documentacion como convertir una app web en una PWA](https://ionicframework.com/docs/vue/pwa). Para el backend podeis crear una maquina virtual gratuita en [Azure](https://eps.ua.es/es/eservices/microsoft-azure.html) donde se puede instalar pocketbase.

    > No creo que haga falta instalar la VB desde Azure.

### Entrega

- Viernes 19 de diciembre 23:59

- Entregar tambien documentacion LEEME.txt para explicar las cosas optativas y cualquier detalle que veamos necesario




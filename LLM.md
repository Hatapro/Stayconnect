# Promps y ayuda solicitada a los LLM

Un promp que hicimos pero lo perdimos porque sin querer lo hicimos en un chat temporal, era preguntándole formas para subir un modelo de datos al Github, y nos respondió con dos métodos el PlantUML, el que descartamos por el formato, y el Mermaid, el usado actualmente en el nuestro y justo el que se usó en el ejemplo de la práctica.

También le pedimos ayuda con ciertas relaciones entre tablas, las cuáles no llegabamos a aclararnos, exactamente fueron los siguientes:

    CARRITOS o{--o{ VARIANTES : "contiene"
    PEDIDOS ||--o{ DETALLE_PEDIDOS : "incluye"
    VARIANTES ||--o{ DETALLE_PEDIDOS : "pertenece"
    PRODUCTOS ||--o{ VARIANTES : "tiene"
    PRODUCTOS ||--o{ PRODUCTO_ATRIBUTOS : "tiene"

Por último, le hemos pedido ayuda con la creación del nombre, le pedimos que nos genere una serie de palabras clave y nosostros los usamos de base para crear el que tenemos actualmente:

    Perfecto 🙌 Aquí tienes una lista de palabras clave (1 o 2) que reflejan lo que aporta el deporte y pueden servirte como base para nombres de tu tienda:

    Energía, Fuerza, Resistencia, Agilidad, Velocidad, Vitalidad, Superación, Disciplina, Equilibrio, Bienestar, Movimiento, Pasión, Logro, Desafío, Conexión, Actitud

# Promps y ayuda solicitada a los LLM, Parte 2

Le hemos pedido ayuda a los LLM para la creación de la API del mapa, la cual se encuenta en el archivo `mapService.js` y su integración en nuestro códgio, que ha sido específicamente en los footer de todas las páginas.

También le hemos pedido ayuda con los scripts js de cada html y también el css de estos.

* Ejemplo de uno de los css generados
```
CSS adicional
/* Agregar estos estilos al final de tu styles.css */

.products-container {
  display: flex;
  max-width: 1200px;
  margin: 2rem auto;
  gap: 1.5rem;
  padding: 0 1rem;
}

.sidebar-filters {
  width: 280px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,
```

Otra cosa que le hemos pedido es una creación de una seed aleatoria y abundante para poder tener varios records en la base de datos.
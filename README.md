# LaptopMania

## Catálogo de productos

El catálogo vive en `server/data/products.json` y se entrega mediante el endpoint `GET /api/products` (`server/api/products.get.ts`). El archivo JSON ya no se importa desde el código del cliente.

El store Pinia `app/store/shop.ts` solicita el catálogo con `$fetch('/api/products')`, mantiene el estado de carga/error y conserva el carrito en `localStorage`. `Card.vue` recibe el producto mediante `props` y comunica la acción de agregar mediante el evento `add-to-cart`; la página recibe ese evento y llama al store.

## Ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`; el endpoint se puede comprobar en `http://localhost:3000/api/products`.

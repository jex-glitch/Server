import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: '2026-10-27',
  app: {
    head: {
      title: "LaptopMania | Tienda de Computadores",
      meta: [
        {
          name: "description",
          content:
            "LaptopMania - Computadores y portátiles de alto rendimiento",
        },
      ],
    },
  },

  css: [
    "vuetify/lib/styles/main.css",
    "@mdi/font/css/materialdesignicons.min.css",
  ],

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  modules: ["@pinia/nuxt"],
});

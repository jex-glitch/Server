<template>
  <div>
    <section class="hero-section py-12 py-md-16">
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="6" class="pr-md-8">
            <div class="d-inline-flex align-center ga-2 px-3 py-1 mb-4 rounded-pill hero-badge">
              <v-icon icon="mdi-lightning-bolt" size="16" color="amber-darken-2" />
              <span class="text-caption font-weight-bold text-uppercase">Tu tienda de tecnología</span>
            </div>

            <h1 class="hero-title font-weight-black mb-3">
              LAPTOP<span class="hero-gradient">MANIA</span>
            </h1>

            <h2 class="hero-subtitle text-h5 text-md-h4 font-weight-bold text-grey-darken-3 mb-4">
              Poder y Rendimiento en Cada Portátil
            </h2>

            <p class="hero-desc text-body-1 text-grey-darken-1 mb-8">
              Descubre las mejores laptops del mercado: Apple MacBook, Lenovo, ASUS, Dell y HP. Compra directamente sin registros molestos, con garantía y envío seguro.
            </p>

            <div class="d-flex ga-3 flex-wrap align-center">
              <v-btn size="large" color="primary" elevation="2" rounded="lg" class="px-8 text-none font-weight-bold"
                prepend-icon="mdi-laptop" @click="scrollToProducts">
                Ver catálogo
              </v-btn>
              <v-btn size="large" variant="outlined" rounded="lg" class="px-6 text-none font-weight-medium"
                prepend-icon="mdi-cart-outline" @click="store.openCart()">
                Carrito ({{ store.cartCount }})
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="mt-8 mt-md-0">
            <div class="hero-image-wrapper">
              <v-img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80"
                aspect-ratio="16/10" cover rounded="xl" class="hero-img shadow-lg" alt="Laptops de alto rendimiento">
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height bg-grey-lighten-2">
                    <v-progress-circular indeterminate color="primary" />
                  </div>
                </template>
              </v-img>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="py-12 bg-grey-lighten-5">
      <v-container id="products-section">
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-8 ga-3">
          <div>
            <h2 class="text-h4 font-weight-bold text-grey-darken-4">Catálogo de Equipos</h2>
            <p class="text-body-2 text-grey-darken-1 mt-1">Explora y filtra las mejores opciones disponibles</p>
          </div>

          <div class="d-flex align-center ga-3">
            <v-chip color="primary" variant="tonal" class="font-weight-medium">
              {{ store.filteredProducts.length }} productos
            </v-chip>
            <v-btn variant="text" class="text-none" prepend-icon="mdi-cart-outline" @click="store.openCart()">
              Ver carrito<span v-if="store.cartCount > 0" class="ml-1 font-weight-bold">({{ store.cartCount }})</span>
            </v-btn>
          </div>
        </div>

        <v-alert v-if="store.productsError" type="error" variant="tonal" class="mb-5">
          {{ store.productsError }}
          <template #append>
            <v-btn variant="text" @click="store.hydrate()">Reintentar</v-btn>
          </template>
        </v-alert>

        <div v-if="store.productsLoading" class="d-flex justify-center py-12">
          <v-progress-circular indeterminate color="primary" size="48" />
        </div>
        <v-alert v-else-if="!store.productsError && store.filteredProducts.length === 0" type="info" variant="tonal">
          No hay productos para mostrar con los filtros seleccionados.
        </v-alert>

        <v-row v-else>
          <v-col v-for="p in store.filteredProducts" :key="p.id" cols="12" sm="6" md="4" lg="3">
            <Card :product="p" @add-to-cart="handleAddToCart" />
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { useShopStore } from '~/store/shop'
import { onMounted } from 'vue'

const store = useShopStore()

onMounted(async () => {
  await store.hydrate()
})

const handleAddToCart = (product) => {
  store.addToCart(product)
}

const scrollToProducts = () => {
  const section = document.getElementById('products-section')
  if (!section) return
  section.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.hero-section {
  background: radial-gradient(circle at 10% 20%, #ffffff 0%, #f7f9fc 90%);
  border-bottom: 1px solid #e8e8e8;
}

.hero-badge {
  background: rgba(25, 118, 210, 0.08);
  border: 1px solid rgba(25, 118, 210, 0.16);
  color: #1565c0;
  letter-spacing: 0.5px;
}

.hero-title {
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  letter-spacing: -1.5px;
  line-height: 1.05;
  color: #0f172a;
}

.hero-gradient {
  background: linear-gradient(135deg, #1976d2 0%, #9c27b0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.hero-subtitle {
  letter-spacing: -0.5px;
  line-height: 1.25;
}

.hero-desc {
  line-height: 1.65;
  max-width: 520px;
}

.hero-image-wrapper {
  position: relative;
}

.hero-img {
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
</style>
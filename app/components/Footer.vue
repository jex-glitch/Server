<template>
  <v-footer class="footer-shell py-4">
    <v-container class="text-center text-caption text-grey-darken-1">
      <div class="d-flex align-center justify-center ga-1 mb-1 font-weight-bold text-body-2 text-grey-darken-3">
        <v-icon icon="mdi-laptop" size="18" color="primary" />
        <span>LaptopMania</span>
      </div>
      <div>Tu tienda de computadores y tecnología de alto rendimiento · © {{ year }}</div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.footer-shell {
  background: #ffffff;
  border-top: 1px solid #e8e8e8;
}
</style>

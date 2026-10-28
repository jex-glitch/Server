<template>
	<v-card border flat class="product-card h-100 d-flex flex-column">
		<v-img :src="props.product.img" height="220" cover class="bg-grey-lighten-4" />

		<v-card-text class="pb-1">
			<div class="text-caption text-grey-darken-1 mb-2">{{ props.product.category }} · {{ props.product.brand }}
			</div>
			<div class="text-body-1 font-weight-bold mb-1">{{ props.product.name }}</div>

			<div class="text-subtitle-1 font-weight-black">{{ formatPrice(props.product.price) }}</div>
		</v-card-text>

		<v-spacer />

		<v-card-actions>
			<v-btn block color="primary" class="text-none" prepend-icon="mdi-cart-plus" @click="emit('add-to-cart', props.product)">
				Agregar al carrito
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">

import type { Product } from '~/types/shop'

const props = defineProps<{
	product: Product
}>()

const formatPrice = (value: number) => new Intl.NumberFormat("es-CO", {
	style: "currency",
	currency: "COP",
	maximumFractionDigits: 0,
}).format(value)

const emit = defineEmits<{
	(e: "add-to-cart", product: Product): void
}>()
</script>

<style scoped>
.product-card {
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}
</style>

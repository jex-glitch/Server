<template>
	<v-app-bar flat color="white" height="74" class="header-shell">
		<v-container class="d-flex align-center ga-4 px-2 px-md-4">
			<button class="brand" @click="navigateTo('/')" type="button" aria-label="LaptopMania Inicio">
				<div class="brand-icon-wrapper">
					<v-icon icon="mdi-laptop" color="white" size="22" />
				</div>
				<div class="brand-text">
					<span class="brand-main">Laptop</span><span class="brand-highlight">Mania</span>
				</div>
			</button>

			<div class="search-input">
				<SearchInput :model-value="store.filters.search" @update:model-value="store.setSearch" />
			</div>

			<div class="actions d-flex align-center ga-1 ga-md-2">
				<v-btn icon variant="tonal" color="primary" size="small" @click="store.openCart()"
					:class="{ pulse: cartPulse }" aria-label="Ver carrito">
					<v-badge v-if="store.cartCount > 0" :content="store.cartCount" color="error" offset-x="1"
						offset-y="1">
						<v-icon icon="mdi-cart-outline" />
					</v-badge>
					<v-icon v-else icon="mdi-cart-outline" />
				</v-btn>
			</div>
		</v-container>
	</v-app-bar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SearchInput from '~/components/SearchInput.vue'
import { useShopStore } from '~/store/shop'

const store = useShopStore()
const cartPulse = ref(false)

watch(
	() => store.ui.cartPulseKey,
	() => {
		cartPulse.value = true
		setTimeout(() => {
			cartPulse.value = false
		}, 260)
	},
)
</script>

<style scoped>
.header-shell {
	border-bottom: 1px solid #e8e8e8;
	z-index: 100 !important;
}

.brand {
	border: 0;
	background: transparent;
	display: inline-flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	text-decoration: none;
	padding: 4px 6px;
	border-radius: 8px;
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.brand:hover {
	transform: translateY(-1px);
	opacity: 0.92;
}

.brand-icon-wrapper {
	width: 38px;
	height: 38px;
	border-radius: 10px;
	background: linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%);
	display: grid;
	place-items: center;
	box-shadow: 0 4px 12px rgba(25, 118, 210, 0.35);
}

.brand-text {
	display: flex;
	align-items: baseline;
	font-size: 1.45rem;
	letter-spacing: -0.6px;
	line-height: 1;
}

.brand-main {
	color: #0f172a;
	font-weight: 900;
}

.brand-highlight {
	background: linear-gradient(135deg, #1976d2 0%, #9c27b0 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	font-weight: 900;
}

.search-input {
	max-width: 640px;
	width: 100%;
}

.pulse {
	animation: cart-pulse 0.26s ease;
}

@keyframes cart-pulse {
	0% {
		transform: scale(1);
	}

	45% {
		transform: scale(1.16);
	}

	100% {
		transform: scale(1);
	}
}

@media (max-width: 959px) {
	.search-input {
		max-width: 360px;
	}

	.brand-text {
		font-size: 1.25rem;
	}
}
</style>

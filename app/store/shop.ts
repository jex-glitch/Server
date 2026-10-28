import { defineStore } from "pinia";
import type {
  CartItem,
  PaymentPayload,
  Product,
  ShopState,
  SortOption,
} from "~/types/shop";

const STORAGE_KEYS = {
  cart: "bztore_cart",
} as const;

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const parseStorage = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const sanitizeCart = (cart: unknown): CartItem[] => {
  if (!Array.isArray(cart)) return [];

  return cart
    .filter((item: unknown): item is CartItem => {
      return Boolean(item) && typeof item === "object";
    })
    .map((item) => item as CartItem)
    .filter(
      (item: CartItem) =>
        typeof item.id === "number" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.img === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    );
};

export const useShopStore = defineStore("shop", {
  state: (): ShopState => ({
    products: [],
    productsLoading: false,
    productsError: null as string | null,
    filters: {
      category: "Todo",
      search: "",
      sort: "destacados",
    },
    cart: [],
    dialogs: {
      cart: false,
    },
    checkoutState: "idle",
    checkoutError: "",
    ui: {
      cartPulseKey: 0,
      checkoutPulseKey: 0,
    },
  }),

  getters: {
    categories: (state) => [
      "Todo",
      ...new Set(state.products.map((product) => product.category)),
    ],

    filteredProducts: (state) => {
      const term = state.filters.search.trim().toLowerCase();
      let list = [...state.products];

      if (state.filters.category !== "Todo") {
        list = list.filter(
          (product) => product.category === state.filters.category,
        );
      }

      if (term) {
        list = list.filter(
          (product) =>
            product.name.toLowerCase().includes(term) ||
            product.brand.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term),
        );
      }

      if (state.filters.sort === "precio_asc") {
        list.sort((a, b) => a.price - b.price);
      } else if (state.filters.sort === "precio_desc") {
        list.sort((a, b) => b.price - a.price);
      } else if (state.filters.sort === "rating") {
        list.sort((a, b) => b.rating - a.rating);
      }

      return list;
    },

    cartCount: (state) =>
      state.cart.reduce(
        (acc: number, item: CartItem) => acc + item.quantity,
        0,
      ),

    cartSubtotal: (state) =>
      state.cart.reduce(
        (acc: number, item: CartItem) => acc + item.price * item.quantity,
        0,
      ),

    shipping: (state) => (state.cart.length ? 18000 : 0),

    cartTotal(): number {
      return this.cartSubtotal + this.shipping;
    },
  },

  actions: {
    async hydrate() {
      if (import.meta.client) {
        this.cart = sanitizeCart(
          parseStorage<unknown>(localStorage.getItem(STORAGE_KEYS.cart), []),
        );
      }

      if (this.products.length || this.productsLoading) return;
      this.productsLoading = true;
      this.productsError = null;
      try {
        this.products = await $fetch<Product[]>("/api/products");
      } catch (error) {
        console.error("No se pudo cargar el catálogo de productos:", error);
        this.productsError = "No fue posible cargar los productos. Intenta nuevamente.";
      } finally {
        this.productsLoading = false;
      }
    },

    persistCart() {
      if (!import.meta.client) return;
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(this.cart));
    },

    formatPrice(value: number) {
      return formatCOP(value);
    },

    setSearch(value: string) {
      this.filters.search = value;
    },

    setCategory(value: string) {
      this.filters.category = value;
    },

    setSort(value: SortOption) {
      this.filters.sort = value;
    },

    addToCart(product: Product) {
      const found = this.cart.find((item: CartItem) => item.id === product.id);

      if (found) {
        found.quantity += 1;
      } else {
        this.cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          quantity: 1,
        });
      }

      this.ui.cartPulseKey += 1;
      this.persistCart();
      return true;
    },

    incrementQty(id: number) {
      const found = this.cart.find((item: CartItem) => item.id === id);
      if (!found) return;

      found.quantity += 1;
      this.ui.cartPulseKey += 1;
      this.persistCart();
    },

    decrementQty(id: number) {
      const found = this.cart.find((item: CartItem) => item.id === id);
      if (!found) return;

      if (found.quantity <= 1) {
        this.removeFromCart(id);
        return;
      }

      found.quantity -= 1;
      this.persistCart();
    },

    removeFromCart(id: number) {
      this.cart = this.cart.filter((item: CartItem) => item.id !== id);
      this.persistCart();
    },

    clearCart() {
      this.cart = [];
      this.persistCart();
    },

    rateProduct(productId: number, rating: number) {
      const product = this.products.find(
        (item: Product) => item.id === productId,
      );
      if (!product) return false;

      const safeRating = Math.min(5, Math.max(1, rating));
      const totalScore = product.rating * product.ratingCount + safeRating;
      product.ratingCount += 1;
      product.rating = Number((totalScore / product.ratingCount).toFixed(1));
      return true;
    },

    openCart() {
      this.dialogs.cart = true;
    },

    closeCart() {
      this.dialogs.cart = false;
      this.checkoutState = "idle";
      this.checkoutError = "";
    },

    async simulatePayment(payload: PaymentPayload) {
      const hasInvalidField =
        !payload.card.trim() ||
        !payload.name.trim() ||
        !payload.exp.trim() ||
        !payload.cvv.trim();

      if (hasInvalidField) {
        this.checkoutError = "Completa todos los campos de pago.";
        this.checkoutState = "error";
        return false;
      }

      this.checkoutError = "";
      this.checkoutState = "processing";

      await new Promise((resolve) => setTimeout(resolve, 700));

      this.checkoutState = "success";
      this.clearCart();
      this.ui.checkoutPulseKey += 1;
      return true;
    },
  },
});

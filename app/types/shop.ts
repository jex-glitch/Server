export type SortOption = "destacados" | "precio_asc" | "precio_desc" | "rating";
export type CheckoutState = "idle" | "processing" | "success" | "error";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  img: string;
  rating: number;
  ratingCount: number;
  stock: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  img: string;
  quantity: number;
}

export interface PaymentPayload {
  card: string;
  name: string;
  exp: string;
  cvv: string;
}

export interface ShopState {
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  filters: {
    category: string;
    search: string;
    sort: SortOption;
  };
  cart: CartItem[];
  dialogs: {
    cart: boolean;
  };
  checkoutState: CheckoutState;
  checkoutError: string;
  ui: {
    cartPulseKey: number;
    checkoutPulseKey: number;
  };
}

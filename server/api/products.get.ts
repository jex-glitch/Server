import productsData from "../data/products.json";
import { defineEventHandler } from "h3";

type RawProduct = {
  img: string;
  name: string;
  precio: string | number;
  categoria: string;
  marca: string;
  link?: string;
};

const toPrice = (value: string | number): number => {
  if (typeof value === "number") return value;
  // The source catalog uses Colombian-style thousands separators (e.g. 1.299.000).
  const normalized = value.trim().replace(/[^\d,.-]/g, "");
  if (normalized.includes(",") && !normalized.includes(".")) {
    return Number(normalized.replace(",", "."));
  }
  return Number(normalized.replace(/[.,]/g, ""));
};

export default defineEventHandler(() => {
  const source = Array.isArray(productsData) ? (productsData as RawProduct[]) : [];

  return source.map((item, index) => ({
    id: index + 1,
    name: item.name,
    price: toPrice(item.precio),
    category: item.categoria,
    brand: item.marca,
    img: item.img,
    rating: 4.5,
    ratingCount: 0,
    stock: 10,
  }));
});

import type { Product, Category } from "@repo/product-db";

export type ProductType = Product;
export type ProductsType = Array<ProductType>;
export type CategoryType = Category;

export type StripeProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
};

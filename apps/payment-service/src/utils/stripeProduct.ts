import { StripeProductType } from "@repo/types";
import stripe from "./stripe";

export async function createStripeProduct(item: StripeProductType) {
  try {
    const response = await stripe.products.create({
      id: item.id,
      name: item.name,
      description: item.description,
      default_price_data: {
        currency: "usd",
        unit_amount: item.price * 100,
      },
      expand: ["default_price"],
    });

    return response;
  } catch (error) {
    console.log("Error creating product:", error);
    return error;
  }
}

export async function getStripeProductPrice(productId: string) {
  try {
    const response = await stripe.prices.list({
      product: productId,
      limit: 1,
    });

    return response.data[0]?.unit_amount;
  } catch (error) {
    console.log("Error fetching product price:", error);
    return error;
  }
}

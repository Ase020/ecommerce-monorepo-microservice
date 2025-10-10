import { consumer } from "./kafka";
import { createStripeProduct, deleteStripeProduct } from "./stripeProduct";

export const runKafkaSubscriptions = async () => {
  consumer.subscribe("product.created", async (message) => {
    const product = message.value?.toString();
    console.log("Received message for product.created:", product);

    await createStripeProduct(product);
  });

  consumer.subscribe("product.deleted", async (message) => {
    const productId = message.value?.toString();
    console.log("Received message for product.deleted:", productId);

    await deleteStripeProduct(productId);
  });
};

import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const webhookRoute = new Hono();

webhookRoute.post("/stripe", async (c) => {
  const body = await c.req.text();
  const signature = c.req.header("stripe-signature");

  if (!signature) {
    return c.json({ message: "Missing Stripe signature" }, 400);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id
        );

        // TODO: Create order
        console.log("Checkout Session Completed:", session);
        console.log("Line Items:", lineItems);

        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return c.json({ received: true });
  } catch (error: any) {
    console.log("Stripe webhook verification failed.");
    return c.json(
      { message: `Stripe Webhook Error: ${error.message}`, error },
      400
    );
  }
});

export default webhookRoute;

import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";
import { CartItemsType, CartItemType } from "@repo/types";
import { getStripeProductPrice } from "../utils/stripeProduct";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  const { cart }: { cart: CartItemsType } = await c.req.json();
  const userId = c.get("userId");

  const lineItems = await Promise.all(
    cart.map(async (item: CartItemType) => {
      const unitAmount = await getStripeProductPrice(String(item.id));
      return {
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: unitAmount as number,
        },
        quantity: item.quantity,
      };
    })
  );

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId || undefined,
      mode: "payment",
      ui_mode: "custom",
      return_url:
        "http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}",
    });

    return c.json({
      message: "Session route is working!",
      checkoutSessionClientSecret: session.client_secret,
    });
  } catch (error: any) {
    console.log("Error:", error);
    return c.json(
      { message: error?.message || "Internal Server Error", error },
      500
    );
  }
});

sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  if (!session_id) {
    return c.json({ message: "Session ID is required" }, 400);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(
      session_id as string,
      {
        expand: ["line_items"],
      }
    );

    console.log("Session:", session);
    const sessionObj = {
      status: session.status,
      paymentStatus: session.payment_status,
    };

    return c.json({ message: "Session retrieved", session: sessionObj });
  } catch (error: any) {
    console.log("Error:", error);
    return c.json(
      { message: error?.message || "Internal Server Error", error },
      500
    );
  }
});

export default sessionRoute;

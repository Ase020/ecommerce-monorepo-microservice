import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { shouldBeUser } from "./middleware/authMiddleware";

const PORT = Number(process.env.PORT) || 8082;

const app = new Hono();

app.use("*", clerkMiddleware());

app.get("/", (c) => {
  return c.json({ message: "Payment service is running" }, 200);
});

app.get("/health-check", (c) => {
  return c.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
    },
    200
  );
});

app.get("/test", shouldBeUser, (c) => {
  return c.json({
    message: "Payment service is authenticated",
    userId: c.get("userId"),
  });
});

// app.post("/create-stripe-product", shouldBeUser, async (c) => {
//   const response = await stripe.products.create({
//     id: "test_product_123",
//     name: "Test Product",
//     description: "This is a test product",
//     default_price_data: {
//       currency: "usd",
//       unit_amount: 10 * 100,
//     },
//     expand: ["default_price"],
//   });

//   return c.json(
//     { product: response, message: "Product created successfully" },
//     200
//   );
// });

// app.get("/stripe-product-price", shouldBeUser, async (c) => {
//   const response = await stripe.prices.list({
//     product: "test_product_123",
//     limit: 1,
//   });

//   console.log("Response:", response);

//   return c.json({
//     price: response.data[0],
//     message: "Product price fetched successfully",
//   });
// });

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: PORT,
      },
      (info) => {
        console.log(
          `Payment service is running on http://localhost:${info.port}`
        );
      }
    );
  } catch (error) {
    console.log("Error starting Payment service:", error);
    process.exit(1);
  }
};

start();

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

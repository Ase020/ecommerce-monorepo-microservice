import { serve } from "@hono/node-server";
import { Hono } from "hono";

const PORT = Number(process.env.PORT) || 8082;

const app = new Hono();

app.get("/", (c) => {
  return c.text("Payment service is running");
});

app.get("/health-check", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage(),
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

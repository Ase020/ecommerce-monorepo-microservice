import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { shouldBeUser } from "./middleware/authMiddleware";
import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import { consumer, producer } from "./utils/kafka";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
  })
);
app.use(clerkMiddleware());

app.get("/", (req: Request, res: Response) => {
  res.json("Product Service is running");
});

app.get("/health-check", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage(),
  });
});

app.get("/test", shouldBeUser, (req: Request, res: Response) => {
  res.json({ message: "Product service authenticated", userId: req.userId });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("Eror: ", err);

  return res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

app.use("/products", productRouter);
app.use("/categories", categoryRouter);

const start = async () => {
  try {
    Promise.all([await producer.connect(), await consumer.connect()]);

    app.listen(PORT, () => {
      console.log(`Product Service is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
  }
};

start();

import express, { Response, Request } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { shouldBeUser } from "./middleware/authMiddleware";

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

app.listen(PORT, () => {
  console.log(`Product Service is listening on port ${PORT}`);
});

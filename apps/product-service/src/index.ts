import express, { Response, Request } from "express";
import cors from "cors";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
  })
);

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

app.listen(PORT, () => {
  console.log(`Product Service is listening on port ${PORT}`);
});

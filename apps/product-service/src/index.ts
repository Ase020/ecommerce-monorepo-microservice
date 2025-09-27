import express from "express";
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

app.get("/", (req, res) => {
  res.send("Product Service is running");
});

app.listen(PORT, () => {
  console.log(`Product Service is listening on port ${PORT}`);
});

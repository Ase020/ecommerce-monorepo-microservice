import Fastify from "fastify";
import Clerk from "@clerk/fastify";
import { shouldBeUser } from "./middleware/authMiddleware";

const PORT = Number(process.env.PORT) || 8081;

const fastify = Fastify({
  logger: true,
});

fastify.register(Clerk.clerkPlugin);

fastify.get("/", async (request, reply) => {
  return reply.send("Order service is running");
});

fastify.get("/health-check", async (request, reply) => {
  return reply.status(200).send({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage(),
  });
});

fastify.get("/test", { preHandler: shouldBeUser }, async (request, reply) => {
  return reply.status(200).send({
    message: "Order service is authenticated",
    userId: request.userId,
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    console.log(`Order service is running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

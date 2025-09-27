import Fastify from "fastify";

const PORT = Number(process.env.PORT) || 8081;

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "Order service is running" };
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

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { shouldBeUser } from "../middleware/authMiddleware";
import { Order } from "@repo/order-db";

export const orderRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    "/user-orders",
    { preHandler: shouldBeUser },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const orders = await Order.find({ userId: request.userId });

      return reply.send({
        message: "User orders fetched successfully",
        orders,
      });
    }
  );

  fastify.get(
    "/orders",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const orders = await Order.find();

      return reply.send({
        message: "Orders fetched successfully",
        orders,
      });
    }
  );
};

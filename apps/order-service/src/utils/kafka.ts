import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

const kakfaClient = createKafkaClient("order-service");

export const producer = createProducer(kakfaClient);
export const consumer = createConsumer(kakfaClient, "order-group");

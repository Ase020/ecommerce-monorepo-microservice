import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

const kakfaClient = createKafkaClient("payment-service");

export const producer = createProducer(kakfaClient);
export const consumer = createConsumer(kakfaClient, "payment-group");

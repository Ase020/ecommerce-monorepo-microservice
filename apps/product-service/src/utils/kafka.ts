import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

const kakfaClient = createKafkaClient("product-service");

export const producer = createProducer(kakfaClient);
export const consumer = createConsumer(kakfaClient, "product-group");

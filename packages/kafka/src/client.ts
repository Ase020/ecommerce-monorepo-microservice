import { Kafka } from "kafkajs";

export const createKafkaClient = (service: string) => {
  return new Kafka({
    brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
    clientId: service,
  });
};

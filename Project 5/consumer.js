import 'dotenv/config';
import { Kafka } from 'kafkajs';
import avro from 'avsc';

const main = async () => {
  const type = avro.Type.forSchema({
    type: 'record',
    fields: [
      { name: 'kind', type: { type: 'enum', symbols: ['CAT', 'DOG'] } },
      { name: 'name', type: 'string' },
    ],
  });

  const kafka = new Kafka({
    brokers: [process.env.KAFKA_HOSTNAME],
    sasl: {
      mechanism: 'scram-sha-256',
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD,
    },
    ssl: true,
  });

  /////////////
  const consumer = kafka.consumer({ groupId: 'test-group-1' });

  await consumer.connect();
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const decodedValue = type.fromBuffer(message.value);
      console.log(decodedValue);
    },
  });

  console.log('[x] To exit press CTRL+C');
  console.log('Listening for messages...');
};

main();

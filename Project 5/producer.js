import 'dotenv/config';
import { Kafka, Partitioners } from 'kafkajs';
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

  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner, // Используем старый разделитель
  });

  await producer.connect();

  {
    const encodedValue = type.toBuffer({ kind: 'DOG', name: 'Albert' });
    await producer.send({
      topic: 'my-topic',
      messages: [{ value: encodedValue }],
    });
  }

  {
    const encodedValue = type.toBuffer({ kind: 'CAT', name: 'Tom' });
    await producer.send({
      topic: 'my-topic',
      messages: [{ value: encodedValue }],
    });
  }

  {
    const encodedValue = type.toBuffer({ kind: 'DOG', name: 'Reks' });
    await producer.send({
      topic: 'my-topic',
      messages: [{ value: encodedValue }],
    });
  }

  await producer.disconnect();
};

main();

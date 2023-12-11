const avro = require('avsc');

// Определение схемы Avro
const schema = {
  type: 'record',
  name: 'Visit',
  fields: [
    { name: 'city', type: 'string' },
    { name: 'zipCodes', type: { type: 'array', items: 'string' } },
    { name: 'visits', type: 'int' },
  ],
};

// Создание Avro схемы
const type = avro.Type.forSchema(schema);

// Пример массива закодированных данных
const bufs = [
  type.toBuffer({ city: 'Seattle', zipCodes: ['98101'], visits: 3 }),
  type.toBuffer({ city: 'NYC', zipCodes: [], visits: 0 }),
  type.toBuffer({ city: 'Cambridge', zipCodes: ['02138', '02139'], visits: 2 }),
];

// Декодирование каждого буфера
const decodedData = bufs.map((buf) => type.fromBuffer(buf));
console.log('Decoded Data:', decodedData);

// Декодирование каждого буфера
bufs.forEach((buf) => console.log('Decoded Data:', type.fromBuffer(buf)));

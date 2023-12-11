const avro = require('avsc');
const fs = require('fs');

// Определение схемы Avro
const schema = {
  //namespace: 'my.namespace.com',
  type: 'record',
  name: 'indentity',
  fields: [
    { name: 'FirstName', type: 'string' },
    { name: 'LastName', type: 'string' },
    {
      name: 'Errors',
      type: ['null', { type: 'array', items: 'string' }],
      default: null,
    },
    {
      name: 'Address',
      type: [
        'null',
        {
          // namespace: 'my.namespace.com',
          type: 'record',
          name: 'address',
          fields: [
            { name: 'Address1', type: 'string' },
            { name: 'Address2', type: ['null', 'string'], default: null },
            { name: 'City', type: 'string' },
            { name: 'State', type: 'string' },
            { name: 'Zip', type: 'int' },
          ],
        },
      ],
      default: null,
    },
  ],
};

// Создание Avro схемы
const type = avro.Type.forSchema(schema);

// Пример данных для кодирования
const data = {
  FirstName: 'John',
  LastName: 'Doe',
  Errors: null,
  Address: {
    Address1: '123 Main St',
    Address2: null,
    City: 'Seattle',
    State: 'WA',
    Zip: 98101,
  },
};

// Кодирование данных в Avro бинарный формат
const avroBuffer = type.toBuffer(data);

// Запись закодированных данных в файл
fs.writeFileSync('indentity_data.avro', avroBuffer);

// Чтение закодированных данных из файла
const fileData = fs.readFileSync('indentity_data.avro');

// Декодирование данных из буфера
const decodedData = type.fromBuffer(fileData);

console.log('Decoded Data:', decodedData);

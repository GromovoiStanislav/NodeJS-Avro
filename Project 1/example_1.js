const avro = require('avsc');

// Определение схемы Avro
const userSchema = {
  type: 'record',
  name: 'User',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'age', type: 'int' },
    { name: 'emails', type: { type: 'array', items: 'string' } },
  ],
};

// Создание Avro схемы
const type = avro.Type.forSchema(userSchema);

// Создание данных пользователя
const user = {
  name: 'John Doe',
  age: 30,
  emails: ['john.doe@example.com', 'johndoe@gmail.com'],
};

// Кодирование данных в Avro бинарный формат
const encodedBuffer = type.toBuffer(user);

console.log('Encoded:', encodedBuffer);

// Декодирование бинарных данных обратно в объект
const decodedUser = type.fromBuffer(encodedBuffer);

console.log('Decoded:', decodedUser);

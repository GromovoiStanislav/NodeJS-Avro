const avro = require('avsc');
const net = require('net');
const fs = require('fs');

// Загрузка схемы из файла
const userSchema = JSON.parse(fs.readFileSync('user_schema.avsc', 'utf8'));

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

// Подключение к серверу по TCP
const client = net.createConnection({ port: 3000, host: 'localhost' }, () => {
  console.log('Connected to server!');
  // Отправка закодированных данных на сервер
  client.write(encodedBuffer);
  client.end();
});

client.on('end', () => {
  console.log('Disconnected from server');
});

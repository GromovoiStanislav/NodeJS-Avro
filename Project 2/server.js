const avro = require('avsc');
const net = require('net');
const fs = require('fs');

// Загрузка схемы из файла
const userSchema = JSON.parse(fs.readFileSync('user_schema.avsc', 'utf8'));

// Создание Avro схемы
const type = avro.Type.forSchema(userSchema);

// Создание сервера TCP
const server = net.createServer((socket) => {
  console.log('Client connected!');

  // Обработка данных от клиента
  let receivedData = Buffer.from([]);
  socket.on('data', (data) => {
    receivedData = Buffer.concat([receivedData, data]);
  });

  // Обработка завершения соединения
  socket.on('end', () => {
    console.log('Client disconnected!');
    // Декодирование данных и вывод на сервере
    const decodedUser = type.fromBuffer(receivedData);
    console.log('Received Data:', decodedUser);
  });
});

// Слушаем на порту 3000
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

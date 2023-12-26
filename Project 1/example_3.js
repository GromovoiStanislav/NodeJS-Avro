const avro = require('avsc');
const fs = require('node:fs');

// Процедура для получения Avro схемы
function getAvroType() {
  // Загрузка схемы из файла
  const userSchema = JSON.parse(fs.readFileSync('user_schema.avsc', 'utf8'));

  // Создание Avro схемы
  return avro.Type.forSchema(userSchema);
}

// Процедура для записи данных в файл
function writeToFile(data, fileName) {
  const encodedBuffer = getAvroType().toBuffer(data);
  fs.writeFileSync(fileName, encodedBuffer);
  console.log(`Data written to ${fileName}`);
}

// Процедура для считывания данных из файла
function readFromFile(fileName) {
  const fileData = fs.readFileSync(fileName);
  const decodedData = getAvroType().fromBuffer(fileData);
  console.log('Decoded:', decodedData);
}

// Создание данных пользователя
const user = {
  name: 'John Doe',
  age: 30,
  emails: ['john.doe@example.com', 'johndoe@gmail.com'],
};

// Использование процедур
writeToFile(user, 'user.avro');
readFromFile('user.avro');

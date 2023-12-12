import crc32 from 'buffer-crc32';

// Создаем буфер с данными
const dataBuffer = Buffer.from('Hello, world!', 'utf8');

// Вычисляем CRC32
const crc32Value = crc32.unsigned('Hello, world!'); //dataBuffer

console.log('CRC32:', crc32Value);

//// Отправка данных
// SendOverNetwork({ data: dataBuffer, crc32: crc32Value });
//// Прием данных
// const receivedData = receiveOverNetwork();

// Проверка целостности данных при чтении
if (crc32.unsigned(dataBuffer) === crc32Value) {
  console.log('Данные целостны');
} else {
  console.log('Данные повреждены');
}

// Проверка целостности данных при чтении
const newDataBuffer = Buffer.from('Hello, world', 'utf8');
if (crc32.unsigned(newDataBuffer) === crc32Value) {
  console.log('Данные целостны');
} else {
  console.log('Данные повреждены');
}

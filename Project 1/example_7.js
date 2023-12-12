const avro = require('avsc');

const schema = {
  type: 'record',
  name: 'Header',
  fields: [
    { name: 'id', type: 'long' },
    { name: 'name', type: 'string' },
  ],
};

//const type = avro.Type.forSchema(schema);
const type = avro.parse(schema);
const data = { id: 123, name: 'abc' };

if (type.isValid(data)) {
  const encodedBuffer = type.toBuffer(data);
  console.log('Encoded:', encodedBuffer);

  const decodedData = type.fromBuffer(encodedBuffer);
  console.log('Decoded:', decodedData);
}

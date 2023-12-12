const avro = require('avro-js');
const fs = require('node:fs');

{
  // We can declare a schema inline:
  const type = avro.parse({
    name: 'Pet',
    type: 'record',
    fields: [
      {
        name: 'kind',
        type: { name: 'Kind', type: 'enum', symbols: ['CAT', 'DOG'] },
      },
      { name: 'name', type: 'string' },
    ],
  });

  const pet = { kind: 'CAT', name: 'Albert' };

  // Check whether an object fits a given schema
  if (type.isValid(pet)) {
    const buf = type.toBuffer(pet); // Serialized object.
    const obj = type.fromBuffer(buf); // {kind: 'CAT', name: 'Albert'}
    console.log(obj);
  }

  // Generate random instances of a schema
  const instances1 = type.random(); //Pet { kind: 'DOG', name: 'iEFzayMaIhUBCM' }
  console.log(instances1);

  const instances2 = type.random(); //Pet { kind: 'CAT', name: 'oJa'
  console.log(instances2);
}

{
  // We can also parse a JSON-stringified schema:
  const type = avro.parse('{"type": "fixed", "name": "Id", "size": 4}');
  const buf = type.random(); // E.g. Buffer([48, 152, 2, 123])
  console.log(buf);
}

{
  // We can specify a path to a schema file:
  //const type = avro.parse('./user.avsc');

  // Загрузка схемы из файла
  const userSchema = JSON.parse(fs.readFileSync('user.avsc', 'utf8'));
  const type = avro.parse(userSchema);

  const person = { name: 'Bob', address: { city: 'Cambridge', zip: '02139' } };
  console.log(type.isValid(person)); // false.

  const user = { name: 'Bob', favorite_number: 10, favorite_color: 'red' };
  console.log(type.isValid(user)); // true
}

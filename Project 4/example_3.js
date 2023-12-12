const avro = require('avro-js');

const type = avro.parse({
  type: 'record',
  name: 'user',
  fields: [
    { name: 'first_name', type: 'string' },
    { name: 'last_name', type: 'string' },
    { name: 'middle_name', type: 'string', default: '' },
    {
      name: 'children',
      type: {
        type: 'array',
        items: {
          type: 'record',
          name: 'child',
          fields: [
            { name: 'first_name', type: 'string' },
            { name: 'age', type: 'int' },
          ],
        },
      },
      default: [],
    },
  ],
});

const encoder = avro.createFileEncoder('./users.avro', type);

encoder.write({
  first_name: 'Frank',
  last_name: 'Baele',
  middle_name: 'Peter',
  children: [
    {
      first_name: 'Bort',
      age: 10,
    },
  ],
});

encoder.write({
  first_name: 'Peter',
  last_name: 'Peterson',
  children: [
    {
      first_name: 'Jef',
      age: 11,
    },
    {
      first_name: 'Ann',
      age: 8,
    },
  ],
});

encoder.write({
  first_name: 'Ann',
  last_name: 'Peterson',
  middle_name: 'Frank',
});

encoder.end();

avro
  .createFileDecoder('./users.avro')
  .on('metadata', (type) => {
    //console.log(type);
  })
  .on('data', (record) => {
    /* Do something with the record. */
    console.dir(record);
    console.log(record.children);
    if (record.children.length) {
      console.log(record.children[0].first_name);
    }
  })
  .on('end', () => {
    console.log('All records read');
  });

import avsc from 'avsc';

const schema = {
  type: 'record',
  name: 'user',
  fields: [
    { name: 'first_name', type: 'string' },
    { name: 'last_name', type: 'string' },
    { name: 'middle_name', default: null, type: ['null', 'string'] },
    {
      name: 'children',
      default: null,
      type: [
        'null',
        {
          type: 'array',
          items: [
            {
              type: 'record',
              name: 'child',
              fields: [
                { name: 'first_name', type: 'string' },
                { name: 'age', type: 'int' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const encoder = avsc.createFileEncoder('./users.avro', schema);

encoder.write({
  first_name: 'Frank',
  last_name: 'Baele',
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
  //children: [],
});

encoder.end();

avsc
  .createFileDecoder('./users.avro')
  .on('metadata', (type) => {
    //console.log(type);
  })
  .on('data', (val) => {
    console.log(val);
  })
  .on('end', () => {
    console.log('All records read');
  });

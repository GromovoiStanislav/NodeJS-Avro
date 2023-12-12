import avsc from 'avsc';
import fs from 'fs';

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
const type = avsc.Type.forSchema(schema);

const encoder = avsc.createFileEncoder('./users.avro', schema);

function write(item) {
  return new Promise((resolve, reject) => {
    const result = type.isValid(item, {
      errorHook: (err) => {
        err.forEach((key) => {
          console.log('Invalid field name: ' + key);
          console.log(
            'Invalid field content: ' + JSON.stringify(item[key], null, 2)
          );
        });
        reject();
      },
    });
    if (result) {
      encoder.write(item, resolve);
    }
  });
}

write({
  first_name: 'Frank',
  last_name: 'Baele',
  children: [
    {
      first_name: 'Bort',
      age: 10,
    },
  ],
}).catch(() => {
  // Handle the rejection here
  console.log('Promise rejected');
});

write({
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
}).catch(() => {
  // Handle the rejection here
  console.log('Promise rejected');
});

encoder.end();

// Reading part
const src = fs.createReadStream('./users.avro');
src
  .pipe(new avsc.streams.BlockDecoder())
  .on('data', (item) => {
    console.log(item);
  })
  .on('end', () => {
    console.log('All records read');
  });

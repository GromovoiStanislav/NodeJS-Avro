const avro = require('avro-js');

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

const encoder = avro.createFileEncoder('./pets.avro', type);

encoder.write({ kind: 'CAT', name: 'Albert' });
encoder.write({ kind: 'DOG', name: 'Reks' });
encoder.write({ kind: 'CAT', name: 'Nise' });
// Write other pets as desired...

encoder.end();

avro
  .createFileDecoder('./pets.avro')
  .on('data', function (pet) {
    console.log(pet);
  })
  .on('end', () => {
    console.log('All records read');
  });

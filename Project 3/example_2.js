import avsc from 'avsc';
import snappy from 'snappy';
import crc32 from 'buffer-crc32';

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

const snappyEncoder = avsc.createFileEncoder('./snappy.avro', schema, {
  snappy: (buf, cb) => {
    const checksum = crc32(buf);
    snappy.compress(buf, (err, deflated) => {
      if (err) {
        cb(err);
        return;
      }
      const block = Buffer.alloc(deflated.length + 4);
      deflated.copy(block);
      checksum.copy(block, deflated.length);
      cb(null, block);
    });
  },
});

snappyEncoder.write({
  first_name: 'Frank',
  last_name: 'Baele',
  children: [
    {
      first_name: 'Bort',
      age: 10,
    },
  ],
});

snappyEncoder.write({
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

snappyEncoder.end();

avsc
  .createFileDecoder('./snappy.avro', {
    snappy: function (buf, cb) {
      // Avro appends checksums to compressed blocks, which we skip here.
      return snappy.uncompress(buf.slice(0, buf.length - 4), cb);
    },
  })
  .on('metadata', function (type) {
    //console.log(type);
  })
  .on('data', function (val) {
    console.log(val);
  })
  .on('end', () => {
    console.log('All records read');
  });

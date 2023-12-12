const avro = require('avsc');

// A schema's first version.
const v1 = avro.Type.forSchema({
  name: 'Person',
  type: 'record',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'age', type: 'int' },
  ],
});

// The updated version.
const v2 = avro.Type.forSchema({
  type: 'record',
  name: 'Person',
  fields: [
    {
      name: 'name',
      type: [
        'string',
        {
          name: 'Name',
          type: 'record',
          fields: [
            { name: 'first', type: 'string' },
            { name: 'last', type: 'string' },
          ],
        },
      ],
    },
    { name: 'phone', type: ['null', 'string'], default: null },
  ],
});

/** 
The two types are compatible since the name field is present in both 
(the string can be promoted to the new union) and the new phone field has a default value.
*/

//  We can therefore create a resolver.
const resolver = v2.createResolver(v1);

// And pass it whenever we want to decode from the old type to the new.
const buf = v1.toBuffer({ name: 'Ann', age: 25 });
const obj = v2.fromBuffer(buf, resolver);

console.log(obj); // Person { name: 'Ann', phone: null }

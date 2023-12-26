const avro = require('avsc');
const fs = require('node:fs');

const schema = JSON.parse(fs.readFileSync('schema-channels.avsc', 'utf8'));
const type = avro.Type.forSchema(schema);

const data = require('./data.json');
const buf = type.toBuffer(data);
const val = type.fromBuffer(buf);

console.log(val);
console.log(JSON.stringify(val, null, 2));
console.log(JSON.stringify(JSON.parse(val), null, 2));

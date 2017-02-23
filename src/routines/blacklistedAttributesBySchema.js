/* eslint no-unused-vars: "error"*/

import { _schemaHacks } from './_schemaHacks';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export default function blacklistedAttributesBySchema() {
  let attrs;
  let dict;
  let field;
  let schema;
  let _i;
  let _len;
  let fields;
  const dicts = {};
  for (schema in _schemaHacks) {
    console.log('schema from blacklistedAttributesBySchema', schema);
    if ({}.hasOwnProperty.call(_schemaHacks, schema)) {
      attrs = _schemaHacks[schema];
      dict = { __meta: true };
      dicts[schema] = dict;
      console.log('attrs from blacklistedAttributesBySchema', attrs);
      if (attrs.fields) {
        fields = flowPrelude.words(attrs.fields);
        console.log('fields from blacklistedAttributesBySchema', fields);
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
          dict[field] = true;
        }
      }
    }
  }
  console.log('dicts from blacklistedAttributesBySchema', dicts);
  return dicts;
}

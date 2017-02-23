import { format6fi } from './format6fi';
import { inspectRawArray_ } from './inspectRawArray_';
import { inspectObjectArray_ } from './inspectObjectArray_';
import { inspectTwoDimTable_ } from './inspectTwoDimTable_';
import { inspectRawObject_ } from './inspectRawObject_';
import { schemaTransforms } from './schemaTransforms';
import blacklistedAttributesBySchema from './blacklistedAttributesBySchema';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function inspectObject(inspections, name, origin, obj) {
  const lodash = window._;
  let k;
  let meta;
  let v;

  let schemaType;
  if (typeof obj !== 'undefined') {
    if (typeof obj.__meta !== 'undefined') {
      schemaType = obj.__meta.schema_type;
    }
  }
  const blacklistedAttributesBySchemaObject = blacklistedAttributesBySchema();
  const attrs = blacklistedAttributesBySchemaObject[schemaType];
  console.log('schemaType', schemaType);
  console.log('blacklistedAttributesBySchemaObject', blacklistedAttributesBySchemaObject);
  console.log('attrs', attrs);

  let blacklistedAttributes = {};
  if (typeof schemaType !== 'undefined') {
    if (typeof attrs !== 'undefined') {
      blacklistedAttributes = attrs;
    } 
  }
  const transform = schemaTransforms[schemaType];
  if (transform) {
    obj = transform(obj);
  }
  const record = {};
  inspections[name] = inspectRawObject_(name, origin, name, record);
  for (k in obj) {
    if ({}.hasOwnProperty.call(obj, k)) {
      v = obj[k];
      console.log('blacklistedAttributes', blacklistedAttributes);
      console.log('k', k);
      if (!blacklistedAttributes[k]) {
        if (v === null) {
          record[k] = null;
        } else {
          if (typeof v !== 'undefined') {
            if (typeof v.__meta !== 'undefined') {
              if (v.__meta.schema_type === 'TwoDimTable') {
                inspections[`${name} - ${v.name}`] = inspectTwoDimTable_(origin, `${name} - ${v.name}`, v);
              }
            }
          } else {
            if (lodash.isArray(v)) {
              if (k === 'cross_validation_models' || k === 'cross_validation_predictions' || name === 'output' && (k === 'weights' || k === 'biases')) {
                inspections[k] = inspectObjectArray_(k, origin, k, v);
              } else {
                inspections[k] = inspectRawArray_(k, origin, k, v);
              }
            } else if (lodash.isObject(v) && typeof v !== 'undefined') {
              if (typeof v.__meta !== 'undefined') {
                if (v.__meta.schema_type === 'Key<Frame>') {
                  record[k] = `<a href=\'#\' data-type=\'frame\' data-key=${flowPrelude.stringify(v.name)}>${lodash.escape(v.name)}</a>`;
                } else if (v.__meta.schema_type === 'Key<Model>') {
                  record[k] = `<a href=\'#\' data-type=\'model\' data-key=${flowPrelude.stringify(v.name)}>${lodash.escape(v.name)}</a>`;
                } else if (v.__meta.schema_type === 'Frame') {
                  record[k] = `<a href=\'#\' data-type=\'frame\' data-key=${flowPrelude.stringify(v.frame_id.name)}>${lodash.escape(v.frame_id.name)}</a>`;
                } else {
                  inspectObject(inspections, `${name} - ${k}`, origin, v);
                }
              } else {
                console.log(`WARNING: dropping [${k}] from inspection:`, v);
              }
            } else {
              record[k] = lodash.isNumber(v) ? format6fi(v) : v;
            }
          }
        }
      }
    }
  }
}

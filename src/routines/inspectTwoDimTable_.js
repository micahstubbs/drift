import { convertTableToFrame } from './convertTableToFrame';

export function inspectTwoDimTable_(origin, tableName, table) {
  return convertTableToFrame(table, tableName, {
    description: table.description || '',
    origin,
  });
}

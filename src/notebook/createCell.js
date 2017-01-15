import { flowCell } from '../flowCell';

export function createCell(_, _renderers, type, input) {
  if (type == null) {
    type = 'cs';
  }
  if (input == null) {
    input = '';
  }
  return flowCell(_, _renderers, type, input);
}

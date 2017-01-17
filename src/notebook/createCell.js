import { flowCell } from '../flowCell';

export function createCell(_, type, input) {
  if (type == null) {
    type = 'cs';
  }
  if (input == null) {
    input = '';
  }
  return flowCell(_, type, input);
}

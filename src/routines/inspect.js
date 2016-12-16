import { inspect$1 } from './inspectDollar1';
import { inspect$2 } from './inspectDollar2';

export function inspect(a, b) {
  if (arguments.length === 1) {
    return inspect$1(a);
  }
  return inspect$2(a, b);
}

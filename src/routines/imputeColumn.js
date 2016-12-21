import { _fork } from './_fork';

export function imputeColumn(opts) {
  if (opts && opts.frame && opts.column && opts.method) {
    return _fork(requestImputeColumn, opts);
  }
  return assist(_, imputeColumn, opts);
}

import { _fork } from './_fork';
import { requestImputeColumn } from './requestImputeColumn';
import { assist } from './routines';

export function imputeColumn(opts) {
  if (opts && opts.underbar && opts.frame && opts.column && opts.method) {
    return _fork(requestImputeColumn, opts);
  }
  const _ = opts.underbar;
  return assist(_, imputeColumn, opts);
}

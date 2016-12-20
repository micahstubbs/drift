import { render_ } from './render_';

export function proceed(_, func, args, go) {
  console.log('proceed was called', proceed);
  console.log('func', func);
  console.log('args', args);
  console.log('go', go);
  return go(null, render_(_,  ...[
    {},
    func
  ].concat(args || [])));
}

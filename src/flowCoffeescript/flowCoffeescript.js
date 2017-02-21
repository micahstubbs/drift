/* eslint no-unused-vars: "error"*/

import render from './render';

export function flowCoffeescript(_, guid, sandbox) {
  console.log('arguments passed to flowCoffeescript', arguments);
  render.isCode = true;
  return render.bind(this, _, guid, sandbox);
}

import { h2oApplicationContext } from './h2oApplicationContext';

export function h2oApplication(_) {
  h2oApplicationContext(_);
  return H2O.Proxy(_);
};

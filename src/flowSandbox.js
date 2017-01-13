import { h2oRoutines } from './routines/h2oRoutines';

export function flowSandbox(_) {
  return {
    routines: h2oRoutines,
    context: {},
    results: {},
  };
}


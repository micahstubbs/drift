import { render_ } from './render_';

export function extendParseResult(_, parseResult) {
  const H2O = window.H2O;
  return render_(_, parseResult, H2O.JobOutput, parseResult.job);
}

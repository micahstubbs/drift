import { render_ } from './render_';

export function extendParseSetupResults(_, args, parseSetupResults) {
  const H2O = window.H2O;
  return render_(_, parseSetupResults, H2O.SetupParseOutput, args, parseSetupResults);
}

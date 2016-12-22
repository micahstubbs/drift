import { render_ } from './render_';

export function extendImportModel(_, result) {
  const H2O = window.H2O;
  return render_(_, result, H2O.ImportModelOutput, result);
}

export function extendImportModel(result) {
  const H2O = window.H2O;
  return render_(_, result, H2O.ImportModelOutput, result);
}

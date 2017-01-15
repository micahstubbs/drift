import { createCell } from './createCell';

export function deserialize(
  _,
  _renderers,
  _localName,
  _remoteName,
  _cells,
  selectCell,
  localName,
  remoteName,
  doc
) {
  const lodash = window._;
  let cell;
  let _i;
  let _len;
  _localName(localName);
  _remoteName(remoteName);
  const cells = (() => {
    let _i;
    let _len;
    const _ref = doc.cells;
    const _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cell = _ref[_i];
      _results.push(createCell(_, _renderers, cell.type, cell.input));
    }
    return _results;
  })();
  _cells(cells);
  selectCell(lodash.head(cells));

      // Execute all non-code cells (headings, markdown, etc.)
  const _ref = _cells();
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    cell = _ref[_i];
    if (!cell.isCode()) {
      cell.execute();
    }
  }
}

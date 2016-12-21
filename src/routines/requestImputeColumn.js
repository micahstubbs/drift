export function requestImputeColumn(opts, go) {
  let column;
  let combineMethod;
  let frame;
  let groupByColumns;
  let method;
  frame = opts.frame, column = opts.column, method = opts.method, combineMethod = opts.combineMethod, groupByColumns = opts.groupByColumns;
  combineMethod = combineMethod != null ? combineMethod : 'interpolate';
  return _.requestFrameSummaryWithoutData(frame, (error, result) => {
    let columnIndex;
    let columnIndicesError;
    let columnKeyError;
    let groupByArg;
    let groupByColumnIndices;
    if (error) {
      return go(error);
    }
    try {
      columnIndex = findColumnIndexByColumnLabel(result, column);
    } catch (_error) {
      columnKeyError = _error;
      return go(columnKeyError);
    }
    if (groupByColumns && groupByColumns.length) {
      try {
        groupByColumnIndices = findColumnIndicesByColumnLabels(result, groupByColumns);
      } catch (_error) {
        columnIndicesError = _error;
        return go(columnIndicesError);
      }
    } else {
      groupByColumnIndices = null;
    }
    groupByArg = groupByColumnIndices ? `[${groupByColumnIndices.join(' ')}]` : '[]';
    return _.requestExec(`(h2o.impute ${frame} ${columnIndex} ${JSON.stringify(method)} ${JSON.stringify(combineMethod)} ${groupByArg} _ _)`, (error, result) => {
      if (error) {
        return go(error);
      }
      return requestColumnSummary(frame, column, go);
    });
  });
}

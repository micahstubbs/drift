import { requestColumnSummary } from './requestColumnSummary';
import { findColumnIndexByColumnLabel } from './findColumnIndexByColumnLabel';

export function requestChangeColumnType(_, opts, go) {
  const frame = opts.frame;
  const column = opts.column;
  const type = opts.type;
  const method = type === 'enum' ? 'as.factor' : 'as.numeric';
  return _.requestFrameSummaryWithoutData(frame, (error, result) => {
    let columnIndex;
    let columnKeyError;
    try {
      columnIndex = findColumnIndexByColumnLabel(result, column);
    } catch (_error) {
      columnKeyError = _error;
      return go(columnKeyError);
    }
    return _.requestExec(`(assign ${frame} (:= ${frame} (${method} (cols ${frame} ${columnIndex})) ${columnIndex} [0:${result.rows}]))`, (error, result) => {
      if (error) {
        return go(error);
      }
      return requestColumnSummary(_, frame, column, go);
    });
  });
}

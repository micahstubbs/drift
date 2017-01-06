import { doGet } from './doGet';

export function getModelRequest(_, key, go) {
  const lodash = window._;
  return doGet(_, `/3/Models/${encodeURIComponent(key)}`, (error, result) => {
    if (error) {
      return go(error, result);
    }
    return go(error, lodash.head(result.models));
  });
}

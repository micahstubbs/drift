import { doGet } from './doGet';

export function postPartialDependenceDataRequest(_, key, go) {
  return doGet(_, `/3/PartialDependence/${encodeURIComponent(key)}`, (error, result) => {
    if (error) {
      return go(error, result);
    }
    return go(error, result);
  });
}

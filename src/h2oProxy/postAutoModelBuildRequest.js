import { doPostJSON } from './doPostJSON';

export function postAutoModelBuildRequest(_, parameters, go) {
  return doPostJSON(_, '/3/AutoMLBuilder', parameters, go);
}

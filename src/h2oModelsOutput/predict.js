import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export default function predict(_, model) {
  return _.insertAndExecuteCell('cs', `predict model: ${flowPrelude.stringify(model.model_id.name)}`);
}

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export default function predict(_) {
  return _.insertAndExecuteCell('cs', `predict model: ${flowPrelude.stringify(_.model.model_id.name)}`);
}

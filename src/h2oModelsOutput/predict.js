import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export default function predict(_, model) {
  const codeCellCode = `predict model: ${flowPrelude.stringify(model.model_id.name)}`;
  return _.insertAndExecuteCell('cs', codeCellCode);
}

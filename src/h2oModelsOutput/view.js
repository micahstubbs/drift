import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export default function view(_, model) {
  const codeCellCode = `getModel ${flowPrelude.stringify(model.model_id.name)}`;
  return _.insertAndExecuteCell('cs', codeCellCode);
}

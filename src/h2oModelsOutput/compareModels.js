import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export default function compareModels(_, collectSelectedKeys) {
  const codeCellCode = `inspect getModels ${flowPrelude.stringify(collectSelectedKeys())}`;
  return _.insertAndExecuteCell('cs', codeCellCode);
}

import { print } from './print';
import { isRoutine } from './isRoutine';

import { safetyWrapCoffeescript } from './safetyWrapCoffeescript';
import { compileCoffeescript } from './compileCoffeescript';
import { parseJavascript } from './parseJavascript';
import { createRootScope } from './createRootScope';
import { removeHoistedDeclarations } from './removeHoistedDeclarations';
import { rewriteJavascript } from './rewriteJavascript';
import { generateJavascript } from './generateJavascript';
import { compileJavascript } from './compileJavascript';
import { executeJavascript } from './executeJavascript';

import { routinesThatAcceptUnderbarParameter } from '../routinesThatAcceptUnderbarParameter';

// XXX special-case functions so that bodies are not printed with the raw renderer.
export function render(_, guid, sandbox, input, output) {
  console.log('arguments passed to render', arguments);
  const lodash = window._;
  const Flow = window.Flow;
  console.log('input from flowCoffeescript render', input);
  console.log('output from flowCoffeescript render', output);
  let cellResult;
  let outputBuffer;
  sandbox.results[guid] = cellResult = {
    result: Flow.Dataflow.signal(null),
    outputs: outputBuffer = Flow.Async.createBuffer([]),
  };
  const evaluate = ft => {
    if (ft != null ? ft.isFuture : void 0) {
      return ft((error, result) => {
        console.log('error from flowCoffeescript render evaluate', error);
        console.log('result from flowCoffeescript render evaluate', result);
        const _ref = result._flow_;
        if (error) {
          output.error(new Flow.Error('Error evaluating cell', error));
          return output.end();
        }
        if (result != null ? _ref != null ? _ref.render : void 0 : void 0) {
          return output.data(result._flow_.render(() => output.end()));
        }
        return output.data(Flow.objectBrowser(_, (() => output.end())('output', result)));
      });
    }
    return output.data(Flow.objectBrowser(_, () => output.end(), 'output', ft));
  };
  outputBuffer.subscribe(evaluate);
  const tasks = [
    safetyWrapCoffeescript(guid),
    compileCoffeescript,
    parseJavascript,
    createRootScope(sandbox),
    removeHoistedDeclarations,
    rewriteJavascript(sandbox),
    generateJavascript,
    compileJavascript,
    executeJavascript(sandbox, print),
  ];
  return Flow.Async.pipe(tasks)(input, error => {
    if (error) {
      output.error(error);
    }
    const result = cellResult.result();
      // console.log('result.name from tasks pipe', result.name);
      // console.log('result from tasks pipe', result);
    if (lodash.isFunction(result)) {
      if (isRoutine(result, sandbox)) {
          // a hack to gradually migrate routines to accept _ as a parameter
          // rather than expect _ to be a global variable
        if (typeof result !== 'undefined' && routinesThatAcceptUnderbarParameter.indexOf(result.name) > -1) {
          return print(result(_), guid, sandbox);
        }
        return print(result(), guid, sandbox);
      }
      return evaluate(result);
    }
    return output.close(Flow.objectBrowser(_, () => output.end(), 'result', result));
  });
}

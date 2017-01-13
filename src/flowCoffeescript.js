import { flowCoffeescriptKernel } from './flowCoffeescriptKernel/flowCoffeescriptKernel';
import { routinesThatAcceptUnderbarParameter } from './routinesThatAcceptUnderbarParameter';

export function flowCoffeescript(_, guid, sandbox) {
  const lodash = window._;
  const Flow = window.Flow;
  const _kernel = flowCoffeescriptKernel();
  const print = arg => {
    if (arg !== print) {
      sandbox.results[guid].outputs(arg);
    }
    return print;
  };
  const isRoutine = f => {
    let name;
    let routine;
    const _ref = sandbox.routines;
    for (name in _ref) {
      if ({}.hasOwnProperty.call(_ref, name)) {
        routine = _ref[name];
        if (f === routine) {
          return true;
        }
      }
    }
    return false;
  };

  // XXX special-case functions so that bodies are not printed with the raw renderer.
  const render = (input, output) => {
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
      _kernel.safetyWrapCoffeescript(guid),
      _kernel.compileCoffeescript,
      _kernel.parseJavascript,
      _kernel.createRootScope(sandbox),
      _kernel.removeHoistedDeclarations,
      _kernel.rewriteJavascript(sandbox),
      _kernel.generateJavascript,
      _kernel.compileJavascript,
      _kernel.executeJavascript(sandbox, print),
    ];
    return Flow.Async.pipe(tasks)(input, error => {
      if (error) {
        output.error(error);
      }
      const result = cellResult.result();
      // console.log('result.name from tasks pipe in flowCoffeescriptKernel', result.name);
      // console.log('result from tasks pipe in flowCoffeescriptKernel', result);
      if (lodash.isFunction(result)) {
        if (isRoutine(result)) {
          // a hack to gradually migrate routines to accept _ as a parameter
          // rather than expect _ to be a global variable
          if (typeof result !== 'undefined' && routinesThatAcceptUnderbarParameter.indexOf(result.name) > -1) {
            return print(result(_));
          }
          return print(result());
        }
        return evaluate(result);
      }
      return output.close(Flow.objectBrowser(_, () => output.end(), 'result', result));
    });
  };
  render.isCode = true;
  return render;
}


import { flowCoffeescriptKernel } from './flowCoffeescriptKernel';

export function flowCoffeescript(_, guid, sandbox) {
  var lodash = window._;
  var Flow = window.Flow;
  var isRoutine;
  var print;
  var render;
  var _kernel;
  _kernel = flowCoffeescriptKernel();
  print = arg => {
    if (arg !== print) {
      sandbox.results[guid].outputs(arg);
    }
    return print;
  };
  isRoutine = f => {
    var name;
    var routine;
    var _ref;
    _ref = sandbox.routines;
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
  render = (input, output) => {
    var cellResult;
    var evaluate;
    var outputBuffer;
    var tasks;
    sandbox.results[guid] = cellResult = {
      result: Flow.Dataflow.signal(null),
      outputs: outputBuffer = Flow.Async.createBuffer([])
    };
    evaluate = ft => {
      if (ft != null ? ft.isFuture : void 0) {
        return ft((error, result) => {
          var _ref;
          if (error) {
            output.error(new Flow.Error('Error evaluating cell', error));
            return output.end();
          }
          if (result != null ? (_ref = result._flow_) != null ? _ref.render : void 0 : void 0) {
            return output.data(result._flow_.render(() => output.end()));
          }
          return output.data(Flow.ObjectBrowser(_, (() => output.end())('output', result)));
        });
      }
      return output.data(Flow.ObjectBrowser(_, () => output.end(), 'output', ft));
    };
    outputBuffer.subscribe(evaluate);
    tasks = [
      _kernel.safetyWrapCoffeescript(guid),
      _kernel.compileCoffeescript,
      _kernel.parseJavascript,
      _kernel.createRootScope(sandbox),
      _kernel.removeHoistedDeclarations,
      _kernel.rewriteJavascript(sandbox),
      _kernel.generateJavascript,
      _kernel.compileJavascript,
      _kernel.executeJavascript(sandbox, print)
    ];
    return Flow.Async.pipe(tasks)(input, error => {
      var result;
      if (error) {
        output.error(error);
      }
      result = cellResult.result();
      if (lodash.isFunction(result)) {
        if (isRoutine(result)) {
          return print(result());
        }
        return evaluate(result);
      }
      return output.close(Flow.ObjectBrowser(_, () => output.end(), 'result', result));
    });
  };
  render.isCode = true;
  return render;
}


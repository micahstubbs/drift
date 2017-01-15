import { safetyWrapCoffeescript } from './safetyWrapCoffeescript';
import { compileCoffeescript } from './compileCoffeescript';
import { parseJavascript } from './parseJavascript';
import { createRootScope } from './createRootScope';
import { removeHoistedDeclarations } from './removeHoistedDeclarations';
import { rewriteJavascript } from './rewriteJavascript';
import { generateJavascript } from './generateJavascript';

export function flowCoffeescriptKernel() {
  const lodash = window._;
  const Flow = window.Flow;
  const escodegen = window.escodegen;
  const esprima = window.esprima;
  const CoffeeScript = window.CoffeeScript;
  const compileJavascript = (js, go) => {
    let closure;
    let error;
    try {
      closure = new Function('h2o', '_h2o_context_', '_h2o_results_', 'print', js); // eslint-disable-line
      return go(null, closure);
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error compiling javascript', error));
    }
  };
  const executeJavascript = (sandbox, print) => (closure, go) => {
    console.log('sandbox from flowCoffeescriptKernel executeJavascript', sandbox);
    let error;
    try {
      return go(null, closure(sandbox.routines, sandbox.context, sandbox.results, print));
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error executing javascript', error));
    }
  };
  return {
    safetyWrapCoffeescript,
    compileCoffeescript,
    parseJavascript,
    createRootScope,
    removeHoistedDeclarations,
    rewriteJavascript,
    generateJavascript,
    compileJavascript,
    executeJavascript,
  };
}

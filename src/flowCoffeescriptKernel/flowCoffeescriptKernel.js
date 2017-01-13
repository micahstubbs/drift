import { safetyWrapCoffeescript } from './safetyWrapCoffeescript';
import { compileCoffeescript } from './compileCoffeescript';
import { parseJavascript } from './parseJavascript';
import { traverseJavascriptScoped } from './traverseJavascriptScoped';
import { createRootScope } from './createRootScope';
import { removeHoistedDeclarations } from './removeHoistedDeclarations';

export function flowCoffeescriptKernel() {
  const lodash = window._;
  const Flow = window.Flow;
  const escodegen = window.escodegen;
  const esprima = window.esprima;
  const CoffeeScript = window.CoffeeScript;
  const createGlobalScope = (rootScope, routines) => {
    let identifier;
    let name;
    const globalScope = {};
    for (name in rootScope) {
      if ({}.hasOwnProperty.call(rootScope, name)) {
        identifier = rootScope[name];
        globalScope[name] = identifier;
      }
    }
    for (name in routines) {
      if ({}.hasOwnProperty.call(routines, name)) {
        globalScope[name] = {
          name,
          object: 'h2o',
        };
      }
    }
    return globalScope;
  };
  const rewriteJavascript = sandbox => (rootScope, program, go) => {
    let error;
    const globalScope = createGlobalScope(rootScope, sandbox.routines);
    try {
      traverseJavascriptScoped([globalScope], globalScope, null, null, program, (globalScope, parent, key, node) => {
        let identifier;
        if (node.type === 'Identifier') {
          // ignore var declarations
          if (parent.type === 'VariableDeclarator' && key === 'id') {
            return;
          }
          // ignore members
          if (key === 'property') {
            return;
          }
          identifier = globalScope[node.name];
          if (!identifier) {
            return;
          }

          // qualify identifier with '_h2o_context_'
          parent[key] = {
            type: 'MemberExpression',
            computed: false,
            object: {
              type: 'Identifier',
              name: identifier.object,
            },
            property: {
              type: 'Identifier',
              name: identifier.name,
            },
          };
          return parent[key];
        }
      });
      return go(null, program);
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error rewriting javascript', error));
    }
  };
  const generateJavascript = (program, go) => {
    let error;
    try {
      return go(null, escodegen.generate(program));
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error generating javascript', error));
    }
  };
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

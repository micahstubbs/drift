import { safetyWrapCoffeescript } from './safetyWrapCoffeescript';
import { compileCoffeescript } from './compileCoffeescript';
import { parseJavascript } from './parseJavascript';
import { parseDeclarations } from './parseDeclarations';
import { traverseJavascript } from './traverseJavascript';
import { deleteAstNode } from './deleteAstNode';
import { createLocalScope } from './createLocalScope';

export function flowCoffeescriptKernel() {
  const lodash = window._;
  const Flow = window.Flow;
  const escodegen = window.escodegen;
  const esprima = window.esprima;
  const CoffeeScript = window.CoffeeScript;
  // redefine scope by coalescing down to non-local identifiers
  const coalesceScopes = scopes => {
    let i;
    let identifier;
    let name;
    let scope;
    let _i;
    let _len;
    const currentScope = {};
    for (i = _i = 0, _len = scopes.length; _i < _len; i = ++_i) {
      scope = scopes[i];
      if (i === 0) {
        for (name in scope) {
          if ({}.hasOwnProperty.call(scope, name)) {
            identifier = scope[name];
            currentScope[name] = identifier;
          }
        }
      } else {
        for (name in scope) {
          if ({}.hasOwnProperty.call(scope, name)) {
            identifier = scope[name];
            currentScope[name] = null;
          }
        }
      }
    }
    return currentScope;
  };
  const traverseJavascriptScoped = (scopes, parentScope, parent, key, node, f) => {
    let child;
    let currentScope;
    const isNewScope = node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration';
    if (isNewScope) {
      // create and push a new local scope onto scope stack
      scopes.push(createLocalScope(node));
      currentScope = coalesceScopes(scopes);
    } else {
      currentScope = parentScope;
    }
    for (key in node) {
      if ({}.hasOwnProperty.call(node, key)) {
        child = node[key];
        if (lodash.isObject(child)) {
          traverseJavascriptScoped(scopes, currentScope, node, key, child, f);
          f(currentScope, node, key, child);
        }
      }
    }
    if (isNewScope) {
      // discard local scope
      scopes.pop();
    }
  };
  const createRootScope = sandbox => function (program, go) {
    let error;
    let name;
    let rootScope;
    try {
      rootScope = parseDeclarations(program.body[0].expression.arguments[0].callee.body);
      for (name in sandbox.context) {
        if ({}.hasOwnProperty.call(sandbox.context, name)) {
          rootScope[name] = {
            name,
            object: '_h2o_context_',
          };
        }
      }
      return go(null, rootScope, program);
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error parsing root scope', error));
    }
  };

  // TODO DO NOT call this for raw javascript:
  // Require alternate strategy:
  //  Declarations with 'var' need to be local to the cell.
  //  Undeclared identifiers are assumed to be global.
  //  'use strict' should be unsupported.
  const removeHoistedDeclarations = (rootScope, program, go) => {
    let error;
    try {
      traverseJavascript(null, null, program, (parent, key, node) => {
        let declarations;
        if (node.type === 'VariableDeclaration') {
          declarations = node.declarations.filter(declaration => declaration.type === 'VariableDeclarator' && declaration.id.type === 'Identifier' && !rootScope[declaration.id.name]);
          if (declarations.length === 0) {
            // purge this node so that escodegen doesn't fail
            return deleteAstNode(parent, key);
          }
          // replace with cleaned-up declarations
          node.declarations = declarations;
          return node.declarations;
        }
      });
      return go(null, rootScope, program);
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error rewriting javascript', error));
    }
  };
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

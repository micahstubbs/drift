export function flowCoffeescriptKernel() {
  const lodash = window._;
  const Flow = window.Flow;
  const escodegen = window.escodegen;
  const esprima = window.esprima;
  const CoffeeScript = window.CoffeeScript;
  const safetyWrapCoffeescript = guid => (cs, go) => {
    const lines = cs.replace(/[\n\r]/g, '\n').split('\n');
    const block = lodash.map(lines, line => `  ${line}`);
    block.unshift(`_h2o_results_[\'${guid}\'].result do ->`);
    return go(null, block.join('\n'));
  };
  const compileCoffeescript = (cs, go) => {
    let error;
    try {
      return go(null, CoffeeScript.compile(cs, { bare: true }));
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error compiling coffee-script', error));
    }
  };
  const parseJavascript = (js, go) => {
    let error;
    try {
      return go(null, esprima.parse(js));
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error parsing javascript expression', error));
    }
  };
  const identifyDeclarations = node => {
    let declaration;
    if (!node) {
      return null;
    }
    switch (node.type) {
      case 'VariableDeclaration':
        return (() => {
          let _i;
          let _len;
          const _ref = node.declarations;
          const _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            declaration = _ref[_i];
            if (declaration.type === 'VariableDeclarator' && declaration.id.type === 'Identifier') {
              _results.push({
                name: declaration.id.name,
                object: '_h2o_context_'
              });
            }
          }
          return _results;
        })();
      case 'FunctionDeclaration':
        if (node.id.type === 'Identifier') {
          return [{
            name: node.id.name,
            object: '_h2o_context_'
          }];
        }
        break;
      case 'ForStatement':
        return identifyDeclarations(node.init);
      case 'ForInStatement':
      case 'ForOfStatement':
        return identifyDeclarations(node.left);
    }
    return null;
  };
  const parseDeclarations = block => {
    let declaration;
    let declarations;
    let node;
    let _i;
    let _j;
    let _len;
    let _len1;
    const identifiers = [];
    const _ref = block.body;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      if (declarations = identifyDeclarations(node)) {
        for (_j = 0, _len1 = declarations.length; _j < _len1; _j++) {
          declaration = declarations[_j];
          identifiers.push(declaration);
        }
      }
    }
    return lodash.indexBy(identifiers, identifier => identifier.name);
  };
  const traverseJavascript = (parent, key, node, f) => {
    let child;
    let i;
    if (lodash.isArray(node)) {
      i = node.length;
      while (i--) {
        child = node[i];
        if (lodash.isObject(child)) {
          traverseJavascript(node, i, child, f);
          f(node, i, child);
        }
      }
    } else {
      for (i in node) {
        if ({}.hasOwnProperty.call(node, i)) {
          child = node[i];
          if (lodash.isObject(child)) {
            traverseJavascript(node, i, child, f);
            f(node, i, child);
          }
        }
      }
    }
  };
  const deleteAstNode = (parent, i) => {
    if (lodash.isArray(parent)) {
      return parent.splice(i, 1);
    } else if (lodash.isObject(parent)) {
      return delete parent[i];
    }
  };
  const createLocalScope = node => {
    let param;
    let _i;
    let _len;
    const localScope = parseDeclarations(node.body);
    const _ref = node.params;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      param = _ref[_i];
      if (param.type === 'Identifier') {
        localScope[param.name] = {
          name: param.name,
          object: 'local'
        };
      }
    }
    return localScope;
  };
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
            object: '_h2o_context_'
          };
        }
      }
      return go(null, rootScope, program);
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error parsing root scope', error));
    }
  };
  const removeHoistedDeclarations = (rootScope, program, go) => {
    let error;
    try {
      traverseJavascript(null, null, program, (parent, key, node) => {
        let declarations;
        if (node.type === 'VariableDeclaration') {
          declarations = node.declarations.filter(declaration => declaration.type === 'VariableDeclarator' && declaration.id.type === 'Identifier' && !rootScope[declaration.id.name]);
          if (declarations.length === 0) {
            return deleteAstNode(parent, key);
          }
          return node.declarations = declarations;
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
          object: 'h2o'
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
          if (parent.type === 'VariableDeclarator' && key === 'id') {
            return;
          }
          if (key === 'property') {
            return;
          }
          if (!(identifier = globalScope[node.name])) {
            return;
          }
          return parent[key] = {
            type: 'MemberExpression',
            computed: false,
            object: {
              type: 'Identifier',
              name: identifier.object
            },
            property: {
              type: 'Identifier',
              name: identifier.name
            }
          };
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
      closure = new Function('h2o', '_h2o_context_', '_h2o_results_', 'print', js);
      return go(null, closure);
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error compiling javascript', error));
    }
  };
  const executeJavascript = (sandbox, print) => (closure, go) => {
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
    executeJavascript
  };
}

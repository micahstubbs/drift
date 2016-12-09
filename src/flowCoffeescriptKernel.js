export function flowCoffeescriptKernel() {
  var lodash = window._;
  var Flow = window.Flow;
  var coalesceScopes;
  var compileCoffeescript;
  var compileJavascript;
  var createGlobalScope;
  var createLocalScope;
  var createRootScope;
  var deleteAstNode;
  var executeJavascript;
  var generateJavascript;
  var identifyDeclarations;
  var parseDeclarations;
  var parseJavascript;
  var removeHoistedDeclarations;
  var rewriteJavascript;
  var safetyWrapCoffeescript;
  var traverseJavascript;
  var traverseJavascriptScoped;
  safetyWrapCoffeescript = guid => (cs, go) => {
    var block;
    var lines;
    lines = cs.replace(/[\n\r]/g, '\n').split('\n');
    block = lodash.map(lines, line => `  ${line}`);
    block.unshift(`_h2o_results_[\'${guid}\'].result do ->`);
    return go(null, block.join('\n'));
  };
  compileCoffeescript = (cs, go) => {
    var error;
    try {
      return go(null, CoffeeScript.compile(cs, { bare: true }));
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error compiling coffee-script', error));
    }
  };
  parseJavascript = (js, go) => {
    var error;
    try {
      return go(null, esprima.parse(js));
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error parsing javascript expression', error));
    }
  };
  identifyDeclarations = node => {
    var declaration;
    if (!node) {
      return null;
    }
    switch (node.type) {
      case 'VariableDeclaration':
        return (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = node.declarations;
          _results = [];
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
  parseDeclarations = block => {
    var declaration;
    var declarations;
    var identifiers;
    var node;
    var _i;
    var _j;
    var _len;
    var _len1;
    var _ref;
    identifiers = [];
    _ref = block.body;
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
  traverseJavascript = (parent, key, node, f) => {
    var child;
    var i;
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
  deleteAstNode = (parent, i) => {
    if (_.isArray(parent)) {
      return parent.splice(i, 1);
    } else if (lodash.isObject(parent)) {
      return delete parent[i];
    }
  };
  createLocalScope = node => {
    var localScope;
    var param;
    var _i;
    var _len;
    var _ref;
    localScope = parseDeclarations(node.body);
    _ref = node.params;
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
  coalesceScopes = scopes => {
    var currentScope;
    var i;
    var identifier;
    var name;
    var scope;
    var _i;
    var _len;
    currentScope = {};
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
  traverseJavascriptScoped = (scopes, parentScope, parent, key, node, f) => {
    var child;
    var currentScope;
    var isNewScope;
    isNewScope = node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration';
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
  createRootScope = sandbox => function (program, go) {
    var error;
    var name;
    var rootScope;
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
  removeHoistedDeclarations = (rootScope, program, go) => {
    var error;
    try {
      traverseJavascript(null, null, program, (parent, key, node) => {
        var declarations;
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
  createGlobalScope = (rootScope, routines) => {
    var globalScope;
    var identifier;
    var name;
    globalScope = {};
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
  rewriteJavascript = sandbox => (rootScope, program, go) => {
    var error;
    var globalScope;
    globalScope = createGlobalScope(rootScope, sandbox.routines);
    try {
      traverseJavascriptScoped([globalScope], globalScope, null, null, program, (globalScope, parent, key, node) => {
        var identifier;
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
  generateJavascript = (program, go) => {
    var error;
    try {
      return go(null, escodegen.generate(program));
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error generating javascript', error));
    }
  };
  compileJavascript = (js, go) => {
    var closure;
    var error;
    try {
      closure = new Function('h2o', '_h2o_context_', '_h2o_results_', 'print', js);
      return go(null, closure);
    } catch (_error) {
      error = _error;
      return go(new Flow.Error('Error compiling javascript', error));
    }
  };
  executeJavascript = (sandbox, print) => (closure, go) => {
    var error;
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

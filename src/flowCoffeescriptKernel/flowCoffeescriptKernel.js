import { safetyWrapCoffeescript } from './safetyWrapCoffeescript';
import { compileCoffeescript } from './compileCoffeescript';
import { parseJavascript } from './parseJavascript';
import { createRootScope } from './createRootScope';
import { removeHoistedDeclarations } from './removeHoistedDeclarations';
import { rewriteJavascript } from './rewriteJavascript';
import { generateJavascript } from './generateJavascript';
import { compileJavascript } from './compileJavascript';
import { executeJavascript } from './executeJavascript';

export function flowCoffeescriptKernel() {
  const lodash = window._;
  const Flow = window.Flow;
  const escodegen = window.escodegen;
  const esprima = window.esprima;
  const CoffeeScript = window.CoffeeScript;
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

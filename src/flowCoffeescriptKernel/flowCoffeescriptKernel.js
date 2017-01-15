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

import { _fork } from './_fork';
import { proceed } from './proceed';
import { _assistance } from './_assistance';

import { h2oImportFilesInput } from '../h2oImportFilesInput';
import { h2oAutoModelInput } from '../h2oAutoModelInput';
import { h2oPredictInput } from '../h2oPredictInput';
import { h2oCreateFrameInput } from '../h2oCreateFrameInput';
import { h2oSplitFrameInput } from '../h2oSplitFrameInput';
import { h2oMergeFramesInput } from '../h2oMergeFramesInput';
import { h2oPartialDependenceInput } from '../h2oPartialDependenceInput';
import { h2oExportFrameInput } from '../h2oExportFrameInput';
import { h2oImportModelInput } from '../h2oImportModelInput';
import { h2oExportModelInput } from '../h2oExportModelInput';
import { h2oNoAssist } from '../h2oNoAssist';
import { h2oAssist } from '../h2oAssist';

export function assist() {
  const H2O = window.H2O;
  let func;
  let args;
  let _;
  switch (arguments.length) {
    // only the `_`
    case 1:
      func = undefined;
      args = [];
      _ = arguments[0];
      break;
    // a function and the `_`
    case 2:
      func = arguments[0];
      args = [];
      _ = arguments[1];
      break;
    // a function, some other arguments, and the `_`
    default:
      func = arguments[0];
      args = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
      _ = arguments[arguments.length - 1];
      break;
  }
  console.log('func from assist', func);
  if (typeof(func) !== 'undefined') {
    console.log('func.name from assist', func.name);
  }
  console.log('arguments passed to assist', arguments);
  if (func === void 0 || func === _) {
    return _fork(proceed, _, h2oAssist, [_assistance]);
  }
  switch (func.name) {
    case 'importFiles':
      return _fork(proceed, _, h2oImportFilesInput, []);
    case 'buildModel':
      return _fork(proceed, _, H2O.ModelInput, args);
    case 'buildAutoModel':
      return _fork(proceed, _, h2oAutoModelInput, args);
    case 'predict':
    case 'getPrediction':
      console.log('case predict or case getPrediction from assist');
      return _fork(proceed, _, h2oPredictInput, args);
    case 'createFrame':
      return _fork(proceed, _, h2oCreateFrameInput, args);
    case 'splitFrame':
      return _fork(proceed, _, h2oSplitFrameInput, args);
    case 'mergeFrames':
      return _fork(proceed, _, h2oMergeFramesInput, args);
    case 'buildPartialDependence':
      return _fork(proceed, _, h2oPartialDependenceInput, args);
    case 'exportFrame':
      return _fork(proceed, _, h2oExportFrameInput, args);
    case 'imputeColumn':
      return _fork(proceed, _, H2O.ImputeInput, args);
    case 'importModel':
      return _fork(proceed, _, h2oImportModelInput, args);
    case 'exportModel':
      return _fork(proceed, _, h2oExportModelInput, args);
    default:
      return _fork(proceed, _, h2oNoAssist, []);
  }
}

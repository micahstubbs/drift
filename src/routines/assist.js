import { proceed } from './proceed';
import { _fork } from './_fork';
import { exportModel } from './exportModel';
import { importModel } from './importModel';

import { h2oNoAssist } from '../h2oNoAssist';
import { h2oExportModelInput } from '../h2oExportModelInput';
import { h2oImportModelInput } from '../h2oImportModelInput';
import { h2oExportFrameInput } from '../h2oExportFrameInput';
import { h2oPartialDependenceInput } from '../h2oPartialDependenceInput';
import { h2oMergeFramesInput } from '../h2oMergeFramesInput';
import { h2oSplitFrameInput } from '../h2oSplitFrameInput';
import { h2oCreateFrameInput } from '../h2oCreateFrameInput';
import { h2oPredictInput } from '../h2oPredictInput';
import { h2oAutoModelInput } from '../h2oAutoModelInput';
import { h2oImportFilesInput } from '../h2oImportFilesInput';
import { h2oAssist } from '../h2oAssist';

export function assist() {
  const H2O = window.H2O;
  const __slice = [].slice;
  const _ = arguments[0];
  const func = arguments[1];
  const args = arguments.length >= 3 ? __slice.call(arguments, 2) : [];
  if (func === void 0) {
    return _fork(proceed, _, h2oAssist, [_assistance]);
  }
  switch (func) {
    case importFiles:
      return _fork(proceed, _, h2oImportFilesInput, []);
    case buildModel:
      return _fork(proceed, _, H2O.ModelInput, args);
    case buildAutoModel:
      return _fork(proceed, _, h2oAutoModelInput, args);
    case predict:
    case getPrediction:
      return _fork(proceed, _, h2oPredictInput, args);
    case createFrame:
      return _fork(proceed, _, h2oCreateFrameInput, args);
    case splitFrame:
      return _fork(proceed, _, h2oSplitFrameInput, args);
    case mergeFrames:
      return _fork(proceed, _, h2oMergeFramesInput, args);
    case buildPartialDependence:
      return _fork(proceed, _, h2oPartialDependenceInput, args);
    case exportFrame:
      return _fork(proceed, _, h2oExportFrameInput, args);
    case imputeColumn:
      return _fork(proceed, _, H2O.ImputeInput, args);
    case importModel:
      return _fork(proceed, _, h2oImportModelInput, args);
    case exportModel:
      return _fork(proceed, _, h2oExportModelInput, args);
    default:
      return _fork(proceed, _, h2oNoAssist, []);
  }
}

import { h2oImportModelOutput } from './h2oImportModelOutput';
import { h2oFrameDataOutput } from './h2oFrameDataOutput';
import { h2oDataFrameOutput } from './h2oDataFrameOutput';

import { flowForm } from './flowForm';
import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

import { modelInput } from './modelInput/modelInput';
import { parseInput } from './parseInput/parseInput';
import { jobOutput } from './jobOutput/jobOutput';
import { imputeInput } from './imputeInput/imputeInput';
import { util } from './util/util';
import { routines } from './routines/routines';
import { coreUtils } from './coreUtils/coreUtils';
import { localStorage } from './localStorage/localStorage';
import { knockout } from './knockout/knockout';
import { html } from './html/html';
import { format } from './format/format';
import { error } from './error/error';
import { dialogs } from './dialogs/dialogs';
import { dataflow } from './dataflow/dataflow';
import { data } from './data/data';
import { async } from './async/async';
import { objectBrowser } from './objectBrowser/objectBrowser';
import { help } from './help/help';
import { notebook } from './notebook/notebook';
import { failure } from './failure/failure';
import { clipboard } from './clipboard/clipboard';
import { about } from './about/about';
import { gui } from './gui/gui';
import { flow } from './flow/flow';

// flow.coffee
// parent IIFE for the rest of this file
// defer for now
(function () {
  const lodash = window._;
  window.Flow = {};
  window.H2O = {};
  flow();
  about();
  clipboard();
  failure();
  help();
  notebook();
  objectBrowser();
  async();
  data();
  dataflow();
  dialogs();
  error();
  format();
  gui();
  html();
  knockout();
  localStorage();
  // src/core/modules/marked.coffee IIFE
  // experience errors on first abstraction attempt
  // defer for now
  (function () {
    if ((typeof window !== 'undefined' && window !== null ? window.marked : void 0) == null) {
      return;
    }
    marked.setOptions({
      smartypants: true,
      highlight(code, lang) {
        if (window.hljs) {
          return window.hljs.highlightAuto(code, [lang]).value;
        }
        return code;
      }
    });
  }.call(this));
  coreUtils();
  routines();
  util();
  imputeInput();
  jobOutput();
  modelInput();
  parseInput();
}).call(this);

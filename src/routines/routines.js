/* eslint-disable */
import { format4f } from './format4f';
import { getTwoDimData } from './getTwoDimData';
import { format6fi } from './format6fi';
import { createArrays } from './createArrays';
import { parseNaNs } from './parseNaNs';
import { parseNulls } from './parseNulls';
import { parseAndFormatArray } from './parseAndFormatArray';
import { parseAndFormatObjectArray } from './parseAndFormatObjectArray';
import { _fork } from './_fork';
import { _join } from './_join';
import { _call } from './_call';
import { _apply } from './_apply';
import { inspect_ } from './inspect_';
import { flow_ } from './flow_';
import { inspect } from './inspect';
import { render_ } from './render_';
import { ls } from './ls';
import { transformBinomialMetrics } from './transformBinomialMetrics';
import { extendPartialDependence } from './extendPartialDependence';
import { inspectTwoDimTable_ } from './inspectTwoDimTable_';
import { getModelParameterValue } from './getModelParameterValue';
import { inspectRawObject_ } from './inspectRawObject_';
import { inspectRawArray_ } from './inspectRawArray_';
import { inspectObjectArray_ } from './inspectObjectArray_';
import { inspectObject } from './inspectObject';
import { proceed } from './proceed';
import { gui } from './gui';
import { createPlot } from './createPlot';
import { _assistance } from './_assistance';
import { createTempKey } from './createTempKey';
import { extendCloud } from './extendCloud';
import { extendTimeline } from './extendTimeline';
import { extendStackTrace } from './extendStackTrace';
import { extendLogFile } from './extendLogFile';
import { extendNetworkTest } from './extendNetworkTest';
import { extendProfile } from './extendProfile';
import { extendFrames } from './extendFrames';
import { extendJob } from './extendJob';
import { extendJobs } from './extendJobs';
import { extendCancelJob } from './extendCancelJob';
import { extendDeletedKeys } from './extendDeletedKeys';
import { extendModel } from './extendModel';
import { extendModels } from './extendModels';

import { h2oPlotOutput } from '../h2oPlotOutput';
import { h2oPlotInput } from '../h2oPlotInput';
import { h2oCloudOutput } from '../h2oCloudOutput';
import { h2oPartialDependenceOutput } from '../h2oPartialDependenceOutput';
import { h2oGridOutput } from '../h2oGridOutput';
import { h2oPredictsOutput } from '../h2oPredictsOutput';
import { h2oPredictOutput } from '../h2oPredictOutput';
import { h2oH2OFrameOutput } from '../h2oH2OFrameOutput';
import { h2oFrameOutput } from '../h2oFrameOutput';
import { h2oColumnSummaryOutput } from '../h2oColumnSummaryOutput';
import { h2oExportFrameOutput } from '../h2oExportFrameOutput';
import { h2oBindFramesOutput } from '../h2oBindFramesOutput';
import { h2oExportModelOutput } from '../h2oExportModelOutput';
import { h2oImportFilesOutput } from '../h2oImportFilesOutput';
import { h2oRDDsOutput } from '../h2oRDDsOutput';
import { h2oDataFramesOutput } from '../h2oDataFramesOutput';
import { h2oScalaCodeOutput } from '../h2oScalaCodeOutput';
import { h2oScalaIntpOutput } from '../h2oScalaIntpOutput';
import { h2oAssist } from '../h2oAssist';
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

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function routines() {
  const lodash = window._;
  const Flow = window.Flow;
  const H2O = window.H2O;
  let createDataframe;
  let createFactor;
  let createList;
  let createTempKey;
  let createVector;
  let lightning;
  const __slice = [].slice;
  lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
  if (lightning.settings) {
    lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
    lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
  }
  createVector = lightning.createVector;
  createFactor = lightning.createFactor;
  createList = lightning.createList;
  createDataframe = lightning.createFrame;
  H2O.Routines = _ => {
    let asDataFrame;
    let asH2OFrameFromDF;
    let asH2OFrameFromRDD;
    let assist;
    let attrname;
    let bindFrames;
    let buildAutoModel;
    let buildModel;
    let buildPartialDependence;
    let cancelJob;
    let changeColumnType;
    let computeSplits;
    let createFrame;
    let deleteAll;
    let deleteFrame;
    let deleteFrames;
    let deleteModel;
    let deleteModels;
    let dump;
    let dumpFuture;
    let exportFrame;
    let exportModel;
    let extendAsDataFrame;
    let extendAsH2OFrame;
    let extendBindFrames;
    let extendColumnSummary;
    let extendDataFrames;
    let extendExportFrame;
    let extendExportModel;
    let extendFrame;
    let extendFrameData;
    let extendFrameSummary;
    let extendGrid;
    let extendImportModel;
    let extendImportResults;
    let extendParseResult;
    let extendParseSetupResults;
    let extendPrediction;
    let extendPredictions;
    let extendRDDs;
    let extendScalaCode;
    let extendScalaIntp;
    let f;
    let findColumnIndexByColumnLabel;
    let findColumnIndicesByColumnLabels;
    let getCloud;
    let getColumnSummary;
    let getDataFrames;
    let getFrame;
    let getFrameData;
    let getFrameSummary;
    let getFrames;
    let getGrid;
    let getGrids;
    let getJob;
    let getJobs;
    let getLogFile;
    let getModel;
    let getModels;
    let getPartialDependence;
    let getPrediction;
    let getPredictions;
    let getProfile;
    let getRDDs;
    let getScalaIntp;
    let getStackTrace;
    let getTimeline;
    let grid;
    let importFiles;
    let importModel;
    let imputeColumn;
    let initAssistanceSparklingWater;
    let inspectFrameColumns;
    let inspectFrameData;
    let loadScript;
    let mergeFrames;
    let name;
    let parseFiles;
    let plot;
    let predict;
    let read;
    let requestAsDataFrame;
    let requestAsH2OFrameFromDF;
    let requestAsH2OFrameFromRDD;
    let requestAutoModelBuild;
    let requestBindFrames;
    let requestCancelJob;
    let requestChangeColumnType;
    let requestCloud;
    let requestColumnSummary;
    let requestCreateFrame;
    let requestDataFrames;
    let requestDeleteFrame;
    let requestDeleteFrames;
    let requestDeleteModel;
    let requestDeleteModels;
    let requestExportFrame;
    let requestExportModel;
    let requestFrame;
    let requestFrameData;
    let requestFrameSummary;
    let requestFrameSummarySlice;
    let requestFrames;
    let requestGrid;
    let requestGrids;
    let requestImportAndParseFiles;
    let requestImportAndParseSetup;
    let requestImportFiles;
    let requestImportModel;
    let requestImputeColumn;
    let requestJob;
    let requestJobs;
    let requestLogFile;
    let requestMergeFrames;
    let requestModel;
    let requestModelBuild;
    let requestModels;
    let requestModelsByKeys;
    let requestNetworkTest;
    let requestParseFiles;
    let requestParseSetup;
    let requestPartialDependence;
    let requestPartialDependenceData;
    let requestPredict;
    let requestPrediction;
    let requestPredictions;
    let requestPredicts;
    let requestProfile;
    let requestRDDs;
    let requestRemoveAll;
    let requestScalaCode;
    let requestScalaIntp;
    let requestSplitFrame;
    let requestStackTrace;
    let requestTimeline;
    let routines;
    let routinesOnSw;
    let runScalaCode;
    let setupParse;
    let splitFrame;
    let testNetwork;
    let unwrapPrediction;

    // TODO move these into Flow.Async
    let _async;
    let _get;
    let _isFuture;
    let _ref;
    let _schemaHacks;
    _isFuture = Flow.Async.isFuture;
    _async = Flow.Async.async;
    _get = Flow.Async.get;

    // depends on `assist`
    plot = f => {
      if (_isFuture(f)) {
        return _fork(proceed, h2oPlotInput, f);
      } else if (lodash.isFunction(f)) {
        return _fork(_, createPlot, f);
      }
      return assist(plot);
    };
    // depends on `plot`
    grid = f => plot(g => g(g.select(), g.from(f)));
    // depends on `grid`
    extendGrid = (grid, opts) => {
      let inspections;
      let origin;
      origin = `getGrid ${flowPrelude.stringify(grid.grid_id.name)}`;
      if (opts) {
        origin += `, ${flowPrelude.stringify(opts)}`;
      }
      inspections = {
        summary: inspectTwoDimTable_(origin, 'summary', grid.summary_table),
        scoring_history: inspectTwoDimTable_(origin, 'scoring_history', grid.scoring_history)
      };
      inspect_(grid, inspections);
      return render_(_,  grid, h2oGridOutput, grid);
    };
    //
    //
    //
    read = value => {
      if (value === 'NaN') {
        return null;
      }
      return value;
    };
    extendPredictions = (opts, predictions) => {
      render_(_,  predictions, h2oPredictsOutput, opts, predictions);
      return predictions;
    };
    extendPrediction = result => {
      let frameKey;
      let inspections;
      let modelKey;
      let prediction;
      let predictionFrame;
      let _ref1;
      modelKey = result.model.name;
      frameKey = (_ref1 = result.frame) != null ? _ref1.name : void 0;
      prediction = lodash.head(result.model_metrics);
      predictionFrame = result.predictions_frame;
      inspections = {};
      if (prediction) {
        inspectObject(inspections, 'Prediction', `getPrediction model: ${flowPrelude.stringify(modelKey)}, frame: ${flowPrelude.stringify(frameKey)}`, prediction);
      } else {
        prediction = {};
        inspectObject(inspections, 'Prediction', `getPrediction model: ${flowPrelude.stringify(modelKey)}, frame: ${flowPrelude.stringify(frameKey)}`, { prediction_frame: predictionFrame });
      }
      inspect_(prediction, inspections);
      return render_(_,  prediction, h2oPredictOutput, prediction);
    };
    inspectFrameColumns = (tableLabel, frameKey, frame, frameColumns) => () => {
      let actionsData;
      let attr;
      let attrs;
      let column;
      let i;
      let labelVector;
      let title;
      let toColumnSummaryLink;
      let toConversionLink;
      let typeVector;
      let vectors;
      attrs = [
        'label',
        'type',
        'missing_count|Missing',
        'zero_count|Zeros',
        'positive_infinity_count|+Inf',
        'negative_infinity_count|-Inf',
        'min',
        'max',
        'mean',
        'sigma',
        'cardinality'
      ];
      toColumnSummaryLink = label => `<a href=\'#\' data-type=\'summary-link\' data-key=${flowPrelude.stringify(label)}>${lodash.escape(label)}</a>`;
      toConversionLink = value => {
        let label;
        let type;
        let _ref1;
        _ref1 = value.split('\0'), type = _ref1[0], label = _ref1[1];
        switch (type) {
          case 'enum':
            return `<a href=\'#\' data-type=\'as-numeric-link\' data-key=${flowPrelude.stringify(label)}>Convert to numeric</a>`;
          case 'int':
          case 'string':
            return `<a href=\'#\' data-type=\'as-factor-link\' data-key=${flowPrelude.stringify(label)}>Convert to enum</a>'`;
          default:
            return void 0;
        }
      };
      vectors = (() => {
        // XXX format functions
        let _i;
        let _len;
        let _ref1;
        let _results;
        _results = [];
        for (_i = 0, _len = attrs.length; _i < _len; _i++) {
          attr = attrs[_i];
          _ref1 = attr.split('|'), name = _ref1[0], title = _ref1[1];
          title = title != null ? title : name;
          switch (name) {
            case 'min':
              _results.push(createVector(title, 'Number', (() => {
                let _j;
                let _len1;
                let _results1;
                _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(lodash.head(column.mins));
                }
                return _results1;
              })(), format4f));
              break;
            case 'max':
              _results.push(createVector(title, 'Number', (() => {
                let _j;
                let _len1;
                let _results1;
                _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(lodash.head(column.maxs));
                }
                return _results1;
              })(), format4f));
              break;
            case 'cardinality':
              _results.push(createVector(title, 'Number', (() => {
                let _j;
                let _len1;
                let _results1;
                _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(column.type === 'enum' ? column.domain_cardinality : void 0);
                }
                return _results1;
              })()));
              break;
            case 'label':
              _results.push(createFactor(title, 'String', (() => {
                let _j;
                let _len1;
                let _results1;
                _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(column[name]);
                }
                return _results1;
              })(), null, toColumnSummaryLink));
              break;
            case 'type':
              _results.push(createFactor(title, 'String', (() => {
                let _j;
                let _len1;
                let _results1;
                _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(column[name]);
                }
                return _results1;
              })()));
              break;
            case 'mean':
            case 'sigma':
              _results.push(createVector(title, 'Number', (() => {
                let _j;
                let _len1;
                let _results1;
                _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(column[name]);
                }
                return _results1;
              })(), format4f));
              break;
            default:
              _results.push(createVector(title, 'Number', (() => {
                let _j;
                let _len1;
                let _results1;
                _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(column[name]);
                }
                return _results1;
              })()));
          }
        }
        return _results;
      })();
      labelVector = vectors[0], typeVector = vectors[1];
      actionsData = (() => {
        let _i;
        let _ref1;
        let _results;
        _results = [];
        for (i = _i = 0, _ref1 = frameColumns.length; _ref1 >= 0 ? _i < _ref1 : _i > _ref1; i = _ref1 >= 0 ? ++_i : --_i) {
          _results.push(`${typeVector.valueAt(i)}\0${labelVector.valueAt(i)}`);
        }
        return _results;
      })();
      vectors.push(createFactor('Actions', 'String', actionsData, null, toConversionLink));
      return createDataframe(tableLabel, vectors, lodash.range(frameColumns.length), null, {
        description: `A list of ${tableLabel} in the H2O Frame.`,
        origin: `getFrameSummary ${flowPrelude.stringify(frameKey)}`,
        plot: `plot inspect \'${tableLabel}\', getFrameSummary ${flowPrelude.stringify(frameKey)}`
      });
    };
    inspectFrameData = (frameKey, frame) => () => {
      let column;
      let domain;
      let frameColumns;
      let index;
      let rowIndex;
      let vectors;
      frameColumns = frame.columns;
      vectors = (() => {
        let _i;
        let _len;
        let _results;
        _results = [];
        for (_i = 0, _len = frameColumns.length; _i < _len; _i++) {
          column = frameColumns[_i];
          switch (column.type) {
            case 'int':
            case 'real':
              _results.push(createVector(column.label, 'Number', parseNaNs(column.data), format4f));
              break;
            case 'enum':
              domain = column.domain;
              _results.push(createFactor(column.label, 'String', (() => {
                let _j;
                let _len1;
                let _ref1;
                let _results1;
                _ref1 = column.data;
                _results1 = [];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  index = _ref1[_j];
                  _results1.push(index != null ? domain[index] : void 0);
                }
                return _results1;
              })()));
              break;
            case 'time':
              _results.push(createVector(column.label, 'Number', parseNaNs(column.data)));
              break;
            case 'string':
            case 'uuid':
              _results.push(createList(column.label, parseNulls(column.string_data)));
              break;
            default:
              _results.push(createList(column.label, parseNulls(column.data)));
          }
        }
        return _results;
      })();
      vectors.unshift(createVector('Row', 'Number', (() => {
        let _i;
        let _ref1;
        let _ref2;
        let _results;
        _results = [];
        for (rowIndex = _i = _ref1 = frame.row_offset, _ref2 = frame.row_count; _ref1 <= _ref2 ? _i < _ref2 : _i > _ref2; rowIndex = _ref1 <= _ref2 ? ++_i : --_i) {
          _results.push(rowIndex + 1);
        }
        return _results;
      })()));
      return createDataframe('data', vectors, lodash.range(frame.row_count - frame.row_offset), null, {
        description: 'A partial list of rows in the H2O Frame.',
        origin: `getFrameData ${flowPrelude.stringify(frameKey)}`
      });
    };
    extendFrameData = (frameKey, frame) => {
      let inspections;
      let origin;
      inspections = { data: inspectFrameData(frameKey, frame) };
      origin = `getFrameData ${flowPrelude.stringify(frameKey)}`;
      inspect_(frame, inspections);
      return render_(_,  frame, h2oFrameDataOutput, frame);
    };
    extendFrame = (frameKey, frame) => {
      let column;
      let enumColumns;
      let inspections;
      let origin;
      inspections = {
        columns: inspectFrameColumns('columns', frameKey, frame, frame.columns),
        data: inspectFrameData(frameKey, frame)
      };
      enumColumns = (() => {
        let _i;
        let _len;
        let _ref1;
        let _results;
        _ref1 = frame.columns;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          column = _ref1[_i];
          if (column.type === 'enum') {
            _results.push(column);
          }
        }
        return _results;
      })();
      if (enumColumns.length > 0) {
        inspections.factors = inspectFrameColumns('factors', frameKey, frame, enumColumns);
      }
      origin = `getFrameSummary ${flowPrelude.stringify(frameKey)}`;
      inspections[frame.chunk_summary.name] = inspectTwoDimTable_(origin, frame.chunk_summary.name, frame.chunk_summary);
      inspections[frame.distribution_summary.name] = inspectTwoDimTable_(origin, frame.distribution_summary.name, frame.distribution_summary);
      inspect_(frame, inspections);
      return render_(_,  frame, h2oFrameOutput, frame);
    };
    extendFrameSummary = (frameKey, frame) => {
      let column;
      let enumColumns;
      let inspections;
      let origin;
      inspections = { columns: inspectFrameColumns('columns', frameKey, frame, frame.columns) };
      enumColumns = (() => {
        let _i;
        let _len;
        let _ref1;
        let _results;
        _ref1 = frame.columns;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          column = _ref1[_i];
          if (column.type === 'enum') {
            _results.push(column);
          }
        }
        return _results;
      })();
      if (enumColumns.length > 0) {
        inspections.factors = inspectFrameColumns('factors', frameKey, frame, enumColumns);
      }
      origin = `getFrameSummary ${flowPrelude.stringify(frameKey)}`;
      inspections[frame.chunk_summary.name] = inspectTwoDimTable_(origin, frame.chunk_summary.name, frame.chunk_summary);
      inspections[frame.distribution_summary.name] = inspectTwoDimTable_(origin, frame.distribution_summary.name, frame.distribution_summary);
      inspect_(frame, inspections);
      return render_(_,  frame, h2oFrameOutput, frame);
    };
    extendColumnSummary = (frameKey, frame, columnName) => {
      let column;
      let inspectCharacteristics;
      let inspectDistribution;
      let inspectDomain;
      let inspectPercentiles;
      let inspectSummary;
      let inspections;
      let rowCount;
      column = lodash.head(frame.columns);
      rowCount = frame.rows;
      inspectPercentiles = () => {
        let vectors;
        vectors = [
          createVector('percentile', 'Number', frame.default_percentiles),
          createVector('value', 'Number', column.percentiles)
        ];
        return createDataframe('percentiles', vectors, lodash.range(frame.default_percentiles.length), null, {
          description: `Percentiles for column \'${column.label}\' in frame \'${frameKey}\'.`,
          origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`
        });
      };
      inspectDistribution = () => {
        let base;
        let binCount;
        let binIndex;
        let bins;
        let count;
        let countData;
        let i;
        let interval;
        let intervalData;
        let m;
        let minBinCount;
        let n;
        let rows;
        let stride;
        let vectors;
        let width;
        let widthData;
        let _i;
        let _j;
        let _k;
        let _l;
        let _len;
        let _ref1;
        minBinCount = 32;
        base = column.histogram_base, stride = column.histogram_stride, bins = column.histogram_bins;
        width = Math.ceil(bins.length / minBinCount);
        interval = stride * width;
        rows = [];
        if (width > 0) {
          binCount = minBinCount + (bins.length % width > 0 ? 1 : 0);
          intervalData = new Array(binCount);
          widthData = new Array(binCount);
          countData = new Array(binCount);

          // Trim off empty bins from the end
          for (i = _i = 0; binCount >= 0 ? _i < binCount : _i > binCount; i = binCount >= 0 ? ++_i : --_i) {
            m = i * width;
            n = m + width;
            count = 0;
            for (binIndex = _j = m; m <= n ? _j < n : _j > n; binIndex = m <= n ? ++_j : --_j) {
              if (binIndex < bins.length) {
                count += bins[binIndex];
              }
            }
            intervalData[i] = base + i * interval;
            widthData[i] = interval;
            countData[i] = count;
          }
        } else {
          binCount = bins.length;
          intervalData = new Array(binCount);
          widthData = new Array(binCount);
          countData = new Array(binCount);
          for (i = _k = 0, _len = bins.length; _k < _len; i = ++_k) {
            count = bins[i];
            intervalData[i] = base + i * stride;
            widthData[i] = stride;
            countData[i] = count;
          }
        }
        for (i = _l = _ref1 = binCount - 1; _ref1 <= 0 ? _l <= 0 : _l >= 0; i = _ref1 <= 0 ? ++_l : --_l) {
          if (countData[i] !== 0) {
            binCount = i + 1;
            intervalData = intervalData.slice(0, binCount);
            widthData = widthData.slice(0, binCount);
            countData = countData.slice(0, binCount);
            break;
          }
        }
        vectors = [
          createFactor('interval', 'String', intervalData),
          createVector('width', 'Number', widthData),
          createVector('count', 'Number', countData)
        ];
        return createDataframe('distribution', vectors, lodash.range(binCount), null, {
          description: `Distribution for column \'${column.label}\' in frame \'${frameKey}\'.`,
          origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
          plot: `plot inspect \'distribution\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`
        });
      };
      inspectCharacteristics = () => {
        let characteristicData;
        let count;
        let countData;
        let missing_count;
        let negative_infinity_count;
        let other;
        let percentData;
        let positive_infinity_count;
        let vectors;
        let zero_count;
        missing_count = column.missing_count, zero_count = column.zero_count, positive_infinity_count = column.positive_infinity_count, negative_infinity_count = column.negative_infinity_count;
        other = rowCount - missing_count - zero_count - positive_infinity_count - negative_infinity_count;
        characteristicData = [
          'Missing',
          '-Inf',
          'Zero',
          '+Inf',
          'Other'
        ];
        countData = [
          missing_count,
          negative_infinity_count,
          zero_count,
          positive_infinity_count,
          other
        ];
        percentData = (() => {
          let _i;
          let _len;
          let _results;
          _results = [];
          for (_i = 0, _len = countData.length; _i < _len; _i++) {
            count = countData[_i];
            _results.push(100 * count / rowCount);
          }
          return _results;
        })();
        vectors = [
          createFactor('characteristic', 'String', characteristicData),
          createVector('count', 'Number', countData),
          createVector('percent', 'Number', percentData)
        ];
        return createDataframe('characteristics', vectors, lodash.range(characteristicData.length), null, {
          description: `Characteristics for column \'${column.label}\' in frame \'${frameKey}\'.`,
          origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
          plot: `plot inspect \'characteristics\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`
        });
      };
      inspectSummary = () => {
        let defaultPercentiles;
        let maximum;
        let mean;
        let minimum;
        let outliers;
        let percentiles;
        let q1;
        let q2;
        let q3;
        let vectors;
        defaultPercentiles = frame.default_percentiles;
        percentiles = column.percentiles;
        mean = column.mean;
        q1 = percentiles[defaultPercentiles.indexOf(0.25)];
        q2 = percentiles[defaultPercentiles.indexOf(0.5)];
        q3 = percentiles[defaultPercentiles.indexOf(0.75)];
        outliers = lodash.unique(column.mins.concat(column.maxs));
        minimum = lodash.head(column.mins);
        maximum = lodash.head(column.maxs);
        vectors = [
          createFactor('column', 'String', [columnName]),
          createVector('mean', 'Number', [mean]),
          createVector('q1', 'Number', [q1]),
          createVector('q2', 'Number', [q2]),
          createVector('q3', 'Number', [q3]),
          createVector('min', 'Number', [minimum]),
          createVector('max', 'Number', [maximum])
        ];
        return createDataframe('summary', vectors, lodash.range(1), null, {
          description: `Summary for column \'${column.label}\' in frame \'${frameKey}\'.`,
          origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
          plot: `plot inspect \'summary\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`
        });
      };
      inspectDomain = () => {
        let counts;
        let i;
        let labels;
        let level;
        let levels;
        let percents;
        let sortedLevels;
        let vectors;
        let _i;
        let _len;
        let _ref1;
        levels = lodash.map(column.histogram_bins, (count, index) => ({
          count,
          index
        }));
        sortedLevels = lodash.sortBy(levels, level => -level.count);
        _ref1 = createArrays(3, sortedLevels.length), labels = _ref1[0], counts = _ref1[1], percents = _ref1[2];
        for (i = _i = 0, _len = sortedLevels.length; _i < _len; i = ++_i) {
          level = sortedLevels[i];
          labels[i] = column.domain[level.index];
          counts[i] = level.count;
          percents[i] = 100 * level.count / rowCount;
        }
        vectors = [
          createFactor('label', 'String', labels),
          createVector('count', 'Number', counts),
          createVector('percent', 'Number', percents)
        ];
        return createDataframe('domain', vectors, lodash.range(sortedLevels.length), null, {
          description: `Domain for column \'${column.label}\' in frame \'${frameKey}\'.`,
          origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
          plot: `plot inspect \'domain\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`
        });
      };
      inspections = { characteristics: inspectCharacteristics };
      switch (column.type) {
        case 'int':
        case 'real':
          // Skip for columns with all NAs
          if (column.histogram_bins.length) {
            inspections.distribution = inspectDistribution;
          }
          // Skip for columns with all NAs
          if (!lodash.some(column.percentiles, a => a === 'NaN')) {
            inspections.summary = inspectSummary;
            inspections.percentiles = inspectPercentiles;
          }
          break;
        case 'enum':
          inspections.domain = inspectDomain;
      }
      inspect_(frame, inspections);
      return render_(_,  frame, h2oColumnSummaryOutput, frameKey, frame, columnName);
    };
    requestFrame = (frameKey, go) => _.requestFrameSlice(frameKey, void 0, 0, 20, (error, frame) => {
      if (error) {
        return go(error);
      }
      return go(null, extendFrame(frameKey, frame));
    });
    requestFrameData = (frameKey, searchTerm, offset, count, go) => _.requestFrameSlice(frameKey, searchTerm, offset, count, (error, frame) => {
      if (error) {
        return go(error);
      }
      return go(null, extendFrameData(frameKey, frame));
    });
    requestFrameSummarySlice = (frameKey, searchTerm, offset, length, go) => _.requestFrameSummarySlice(frameKey, searchTerm, offset, length, (error, frame) => {
      if (error) {
        return go(error);
      }
      return go(null, extendFrameSummary(frameKey, frame));
    });
    requestFrameSummary = (frameKey, go) => _.requestFrameSummarySlice(frameKey, void 0, 0, 20, (error, frame) => {
      if (error) {
        return go(error);
      }
      return go(null, extendFrameSummary(frameKey, frame));
    });
    requestColumnSummary = (frameKey, columnName, go) => _.requestColumnSummary(frameKey, columnName, (error, frame) => {
      if (error) {
        return go(error);
      }
      return go(null, extendColumnSummary(frameKey, frame, columnName));
    });
    requestFrames = go => _.requestFrames((error, frames) => {
      if (error) {
        return go(error);
      }
      return go(null, extendFrames(_, frames));
    });
    requestCreateFrame = (opts, go) => _.requestCreateFrame(opts, (error, result) => {
      if (error) {
        return go(error);
      }
      return _.requestJob(result.key.name, (error, job) => {
        if (error) {
          return go(error);
        }
        return go(null, extendJob(_, job));
      });
    });
    requestPartialDependence = (opts, go) => _.requestPartialDependence(opts, (error, result) => {
      if (error) {
        return go(error);
      }
      return _.requestJob(result.key.name, (error, job) => {
        if (error) {
          return go(error);
        }
        return go(null, extendJob(_, job));
      });
    });
    requestPartialDependenceData = (key, go) => _.requestPartialDependenceData(key, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendPartialDependence(_, result));
    });
    computeSplits = (ratios, keys) => {
      let i;
      let key;
      let part;
      let parts;
      let ratio;
      let splits;
      let sum;
      let _i;
      let _j;
      let _len;
      let _len1;
      let _ref1;
      parts = [];
      sum = 0;
      _ref1 = keys.slice(0, ratios.length);
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        key = _ref1[i];
        sum += ratio = ratios[i];
        parts.push({
          key,
          ratio
        });
      }
      parts.push({
        key: keys[keys.length - 1],
        ratio: 1 - sum
      });
      splits = [];
      sum = 0;
      for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
        part = parts[_j];
        splits.push({
          min: sum,
          max: sum + part.ratio,
          key: part.key
        });
        sum += part.ratio;
      }
      return splits;
    };
    requestBindFrames = (key, sourceKeys, go) => _.requestExec(`(assign ${key} (cbind ${sourceKeys.join(' ')}))`, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendBindFrames(key, result));
    });
    requestSplitFrame = (frameKey, splitRatios, splitKeys, seed, go) => {
      let g;
      let i;
      let l;
      let part;
      let randomVecKey;
      let sliceExpr;
      let splits;
      let statements;
      let _i;
      let _len;
      if (splitRatios.length === splitKeys.length - 1) {
        splits = computeSplits(splitRatios, splitKeys);
        randomVecKey = createTempKey();
        statements = [];
        statements.push(`(tmp= ${randomVecKey} (h2o.runif ${frameKey} ${seed}))`);
        for (i = _i = 0, _len = splits.length; _i < _len; i = ++_i) {
          part = splits[i];
          g = i !== 0 ? `(> ${randomVecKey} ${part.min})` : null;
          l = i !== splits.length - 1 ? `(<= ${randomVecKey} ${part.max})` : null;
          if (g && l) {
            sliceExpr = `(& ${g} ${l})`;
          } else {
            if (l) {
              sliceExpr = l;
            } else {
              sliceExpr = g;
            }
          }
          statements.push(`(assign ${part.key} (rows ${frameKey} ${sliceExpr}))`);
        }
        statements.push(`(rm ${randomVecKey})`);
        return _.requestExec(`(, ${statements.join(' ')})`, (error, result) => {
          if (error) {
            return go(error);
          }
          return go(null, extendSplitFrameResult(_, {
            keys: splitKeys,
            ratios: splitRatios
          }));
        });
      }
      return go(new Flow.Error('The number of split ratios should be one less than the number of split keys'));
    };
    requestMergeFrames = (
      destinationKey,
      leftFrameKey,
      leftColumnIndex,
      includeAllLeftRows,
      rightFrameKey,
      rightColumnIndex,
      includeAllRightRows,
      go
    ) => {
      let lr;
      let rr;
      let statement;
      lr = includeAllLeftRows ? 'TRUE' : 'FALSE';
      rr = includeAllRightRows ? 'TRUE' : 'FALSE';
      statement = `(assign ${destinationKey} (merge ${leftFrameKey} ${rightFrameKey} ${lr} ${rr} ${leftColumnIndex} ${rightColumnIndex} "radix"))`;
      return _.requestExec(statement, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendMergeFramesResult(_, { key: destinationKey }));
      });
    };
    createFrame = opts => {
      if (opts) {
        return _fork(requestCreateFrame, opts);
      }
      return assist(createFrame);
    };
    splitFrame = (frameKey, splitRatios, splitKeys, seed) => {
      if (seed == null) {
        seed = -1;
      }
      if (frameKey && splitRatios && splitKeys) {
        return _fork(requestSplitFrame, frameKey, splitRatios, splitKeys, seed);
      }
      return assist(splitFrame);
    };
    mergeFrames = (
      destinationKey,
      leftFrameKey,
      leftColumnIndex,
      includeAllLeftRows,
      rightFrameKey,
      rightColumnIndex,
      includeAllRightRows
    ) => {
      if (destinationKey && leftFrameKey && rightFrameKey) {
        return _fork(requestMergeFrames, destinationKey, leftFrameKey, leftColumnIndex, includeAllLeftRows, rightFrameKey, rightColumnIndex, includeAllRightRows);
      }
      return assist(mergeFrames);
    };

    // define the function that is called when 
    // the Partial Dependence plot input form
    // is submitted
    buildPartialDependence = opts => {
      if (opts) {
        return _fork(requestPartialDependence, opts);
      }
      // specify function to call if user
      // provides malformed input
      return assist(buildPartialDependence);
    };
    getPartialDependence = destinationKey => {
      if (destinationKey) {
        return _fork(requestPartialDependenceData, destinationKey);
      }
      return assist(getPartialDependence);
    };
    getFrames = () => _fork(requestFrames);
    getFrame = frameKey => {
      switch (flowPrelude.typeOf(frameKey)) {
        case 'String':
          return _fork(requestFrame, frameKey);
        default:
          return assist(getFrame);
      }
    };
    bindFrames = (key, sourceKeys) => _fork(requestBindFrames, key, sourceKeys);
    getFrameSummary = frameKey => {
      switch (flowPrelude.typeOf(frameKey)) {
        case 'String':
          return _fork(requestFrameSummary, frameKey);
        default:
          return assist(getFrameSummary);
      }
    };
    getFrameData = frameKey => {
      switch (flowPrelude.typeOf(frameKey)) {
        case 'String':
          return _fork(requestFrameData, frameKey, void 0, 0, 20);
        default:
          return assist(getFrameSummary);
      }
    };
    requestDeleteFrame = (frameKey, go) => _.requestDeleteFrame(frameKey, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendDeletedKeys(_, [frameKey]));
    });
    deleteFrame = frameKey => {
      if (frameKey) {
        return _fork(requestDeleteFrame, frameKey);
      }
      return assist(deleteFrame);
    };
    extendExportFrame = result => render_(_,  result, h2oExportFrameOutput, result);
    extendBindFrames = (key, result) => render_(_,  result, h2oBindFramesOutput, key, result);
    requestExportFrame = (frameKey, path, opts, go) => _.requestExportFrame(frameKey, path, opts.overwrite, (error, result) => {
      if (error) {
        return go(error);
      }
      return _.requestJob(result.job.key.name, (error, job) => {
        if (error) {
          return go(error);
        }
        return go(null, extendJob(_, job));
      });
    });
    exportFrame = (frameKey, path, opts) => {
      if (opts == null) {
        opts = {};
      }
      if (frameKey && path) {
        return _fork(requestExportFrame, frameKey, path, opts);
      }
      return assist(exportFrame, frameKey, path, opts);
    };
    requestDeleteFrames = (frameKeys, go) => {
      let futures;
      futures = lodash.map(frameKeys, frameKey => _fork(_.requestDeleteFrame, frameKey));
      return Flow.Async.join(futures, (error, results) => {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys(_, frameKeys));
      });
    };
    deleteFrames = frameKeys => {
      switch (frameKeys.length) {
        case 0:
          return assist(deleteFrames);
        case 1:
          return deleteFrame(lodash.head(frameKeys));
        default:
          return _fork(requestDeleteFrames, frameKeys);
      }
    };
    getColumnSummary = (frameKey, columnName) => _fork(requestColumnSummary, frameKey, columnName);
    requestModels = go => _.requestModels((error, models) => {
      if (error) {
        return go(error);
      }
      return go(null, extendModels(_, models));
    });
    requestModelsByKeys = (modelKeys, go) => {
      let futures;
      futures = lodash.map(modelKeys, key => _fork(_.requestModel, key));
      return Flow.Async.join(futures, (error, models) => {
        if (error) {
          return go(error);
        }
        return go(null, extendModels(_, models));
      });
    };
    getModels = modelKeys => {
      if (lodash.isArray(modelKeys)) {
        if (modelKeys.length) {
          return _fork(requestModelsByKeys, modelKeys);
        }
        return _fork(requestModels);
      }
      return _fork(requestModels);
    };
    requestGrids = go => _.requestGrids((error, grids) => {
      if (error) {
        return go(error);
      }
      return go(null, extendGrids(_, grids));
    });
    getGrids = () => _fork(requestGrids);
    requestModel = (modelKey, go) => _.requestModel(modelKey, (error, model) => {
      if (error) {
        return go(error);
      }
      return go(null, extendModel(_, model));
    });
    getModel = modelKey => {
      switch (flowPrelude.typeOf(modelKey)) {
        case 'String':
          return _fork(requestModel, modelKey);
        default:
          return assist(getModel);
      }
    };
    requestGrid = (gridKey, opts, go) => _.requestGrid(gridKey, opts, (error, grid) => {
      if (error) {
        return go(error);
      }
      return go(null, extendGrid(grid, opts));
    });
    getGrid = (gridKey, opts) => {
      switch (flowPrelude.typeOf(gridKey)) {
        case 'String':
          return _fork(requestGrid, gridKey, opts);
        default:
          return assist(getGrid);
      }
    };
    findColumnIndexByColumnLabel = (frame, columnLabel) => {
      let column;
      let i;
      let _i;
      let _len;
      let _ref1;
      _ref1 = frame.columns;
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        column = _ref1[i];
        if (column.label === columnLabel) {
          return i;
        }
      }
      throw new Flow.Error(`Column [${columnLabel}] not found in frame`);
    };
    findColumnIndicesByColumnLabels = (frame, columnLabels) => {
      let columnLabel;
      let _i;
      let _len;
      let _results;
      _results = [];
      for (_i = 0, _len = columnLabels.length; _i < _len; _i++) {
        columnLabel = columnLabels[_i];
        _results.push(findColumnIndexByColumnLabel(frame, columnLabel));
      }
      return _results;
    };
    requestImputeColumn = (opts, go) => {
      let column;
      let combineMethod;
      let frame;
      let groupByColumns;
      let method;
      frame = opts.frame, column = opts.column, method = opts.method, combineMethod = opts.combineMethod, groupByColumns = opts.groupByColumns;
      combineMethod = combineMethod != null ? combineMethod : 'interpolate';
      return _.requestFrameSummaryWithoutData(frame, (error, result) => {
        let columnIndex;
        let columnIndicesError;
        let columnKeyError;
        let groupByArg;
        let groupByColumnIndices;
        if (error) {
          return go(error);
        }
        try {
          columnIndex = findColumnIndexByColumnLabel(result, column);
        } catch (_error) {
          columnKeyError = _error;
          return go(columnKeyError);
        }
        if (groupByColumns && groupByColumns.length) {
          try {
            groupByColumnIndices = findColumnIndicesByColumnLabels(result, groupByColumns);
          } catch (_error) {
            columnIndicesError = _error;
            return go(columnIndicesError);
          }
        } else {
          groupByColumnIndices = null;
        }
        groupByArg = groupByColumnIndices ? `[${groupByColumnIndices.join(' ')}]` : '[]';
        return _.requestExec(`(h2o.impute ${frame} ${columnIndex} ${JSON.stringify(method)} ${JSON.stringify(combineMethod)} ${groupByArg} _ _)`, (error, result) => {
          if (error) {
            return go(error);
          }
          return requestColumnSummary(frame, column, go);
        });
      });
    };
    requestChangeColumnType = (opts, go) => {
      let column;
      let frame;
      let method;
      let type;
      frame = opts.frame, column = opts.column, type = opts.type;
      method = type === 'enum' ? 'as.factor' : 'as.numeric';
      return _.requestFrameSummaryWithoutData(frame, (error, result) => {
        let columnIndex;
        let columnKeyError;
        try {
          columnIndex = findColumnIndexByColumnLabel(result, column);
        } catch (_error) {
          columnKeyError = _error;
          return go(columnKeyError);
        }
        return _.requestExec(`(assign ${frame} (:= ${frame} (${method} (cols ${frame} ${columnIndex})) ${columnIndex} [0:${result.rows}]))`, (error, result) => {
          if (error) {
            return go(error);
          }
          return requestColumnSummary(frame, column, go);
        });
      });
    };
    // depends on `assist`
    imputeColumn = opts => {
      if (opts && opts.frame && opts.column && opts.method) {
        return _fork(requestImputeColumn, opts);
      }
      return assist(imputeColumn, opts);
    };
    changeColumnType = opts => {
      if (opts && opts.frame && opts.column && opts.type) {
        return _fork(requestChangeColumnType, opts);
      }
      return assist(changeColumnType, opts);
    };
    requestDeleteModel = (modelKey, go) => _.requestDeleteModel(modelKey, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendDeletedKeys(_, [modelKey]));
    });
    deleteModel = modelKey => {
      if (modelKey) {
        return _fork(requestDeleteModel, modelKey);
      }
      return assist(deleteModel);
    };
    extendImportModel = result => render_(_,  result, H2O.ImportModelOutput, result);
    requestImportModel = (path, opts, go) => _.requestImportModel(path, opts.overwrite, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendImportModel(result));
    });
    importModel = (path, opts) => {
      if (path && path.length) {
        return _fork(requestImportModel, path, opts);
      }
      return assist(importModel, path, opts);
    };
    extendExportModel = result => render_(_,  result, h2oExportModelOutput, result);
    requestExportModel = (modelKey, path, opts, go) => _.requestExportModel(modelKey, path, opts.overwrite, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendExportModel(result));
    });
    exportModel = (modelKey, path, opts) => {
      if (modelKey && path) {
        return _fork(requestExportModel, modelKey, path, opts);
      }
      return assist(exportModel, modelKey, path, opts);
    };
    requestDeleteModels = (modelKeys, go) => {
      let futures;
      futures = lodash.map(modelKeys, modelKey => _fork(_.requestDeleteModel, modelKey));
      return Flow.Async.join(futures, (error, results) => {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys(_, modelKeys));
      });
    };
    deleteModels = modelKeys => {
      switch (modelKeys.length) {
        case 0:
          return assist(deleteModels);
        case 1:
          return deleteModel(lodash.head(modelKeys));
        default:
          return _fork(requestDeleteModels, modelKeys);
      }
    };
    requestJob = (key, go) => _.requestJob(key, (error, job) => {
      if (error) {
        return go(error);
      }
      return go(null, extendJob(_, job));
    });
    requestJobs = go => _.requestJobs((error, jobs) => {
      if (error) {
        return go(error);
      }
      return go(null, extendJobs(_, jobs));
    });
    getJobs = () => _fork(requestJobs);
    getJob = arg => {
      switch (flowPrelude.typeOf(arg)) {
        case 'String':
          return _fork(requestJob, arg);
        case 'Object':
          if (arg.key != null) {
            return getJob(arg.key);
          }
          return assist(getJob);
          // break; // no-unreachable
        default:
          return assist(getJob);
      }
    };
    requestCancelJob = (key, go) => _.requestCancelJob(key, error => {
      if (error) {
        return go(error);
      }
      return go(null, extendCancelJob(_, {}));
    });
    cancelJob = arg => {
      switch (flowPrelude.typeOf(arg)) {
        case 'String':
          return _fork(requestCancelJob, arg);
        default:
          return assist(cancelJob);
      }
    };
    extendImportResults = importResults => render_(_,  importResults, h2oImportFilesOutput, importResults);
    requestImportFiles = (paths, go) => _.requestImportFiles(paths, (error, importResults) => {
      if (error) {
        return go(error);
      }
      return go(null, extendImportResults(importResults));
    });
    importFiles = paths => {
      switch (flowPrelude.typeOf(paths)) {
        case 'Array':
          return _fork(requestImportFiles, paths);
        default:
          return assist(importFiles);
      }
    };
    extendParseSetupResults = (args, parseSetupResults) => render_(_,  parseSetupResults, H2O.SetupParseOutput, args, parseSetupResults);
    requestImportAndParseSetup = (paths, go) => _.requestImportFiles(paths, (error, importResults) => {
      let sourceKeys;
      if (error) {
        return go(error);
      }
      sourceKeys = lodash.flatten(lodash.compact(lodash.map(importResults, result => result.destination_frames)));
      return _.requestParseSetup(sourceKeys, (error, parseSetupResults) => {
        if (error) {
          return go(error);
        }
        return go(null, extendParseSetupResults({ paths }, parseSetupResults));
      });
    });
    requestParseSetup = (sourceKeys, go) => _.requestParseSetup(sourceKeys, (error, parseSetupResults) => {
      if (error) {
        return go(error);
      }
      return go(null, extendParseSetupResults({ source_frames: sourceKeys }, parseSetupResults));
    });
    setupParse = args => {
      if (args.paths && lodash.isArray(args.paths)) {
        return _fork(requestImportAndParseSetup, args.paths);
      } else if (args.source_frames && lodash.isArray(args.source_frames)) {
        return _fork(requestParseSetup, args.source_frames);
      }
      return assist(setupParse);
    };
    extendParseResult = parseResult => render_(_,  parseResult, H2O.JobOutput, parseResult.job);
    requestImportAndParseFiles = (
      paths,
      destinationKey,
      parseType,
      separator,
      columnCount,
      useSingleQuotes,
      columnNames,
      columnTypes,
      deleteOnDone,
      checkHeader,
      chunkSize,
      go
    ) => _.requestImportFiles(paths, (error, importResults) => {
      let sourceKeys;
      if (error) {
        return go(error);
      }
      sourceKeys = lodash.flatten(lodash.compact(lodash.map(importResults, result => result.destination_frames)));
      return _.requestParseFiles(sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, (error, parseResult) => {
        if (error) {
          return go(error);
        }
        return go(null, extendParseResult(parseResult));
      });
    });
    requestParseFiles = (
      sourceKeys,
      destinationKey,
      parseType,
      separator,
      columnCount,
      useSingleQuotes,
      columnNames,
      columnTypes,
      deleteOnDone,
      checkHeader,
      chunkSize,
      go
    ) => _.requestParseFiles(sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, (error, parseResult) => {
      if (error) {
        return go(error);
      }
      return go(null, extendParseResult(parseResult));
    });
    parseFiles = opts => {
      let checkHeader;
      let chunkSize;
      let columnCount;
      let columnNames;
      let columnTypes;
      let deleteOnDone;
      let destinationKey;
      let parseType;
      let separator;
      let useSingleQuotes;
      destinationKey = opts.destination_frame;
      parseType = opts.parse_type;
      separator = opts.separator;
      columnCount = opts.number_columns;
      useSingleQuotes = opts.single_quotes;
      columnNames = opts.column_names;
      columnTypes = opts.column_types;
      deleteOnDone = opts.delete_on_done;
      checkHeader = opts.check_header;
      chunkSize = opts.chunk_size;
      if (opts.paths) {
        return _fork(requestImportAndParseFiles, opts.paths, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize);
      }
      return _fork(requestParseFiles, opts.source_frames, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize);
    };
    requestModelBuild = (algo, opts, go) => _.requestModelBuild(algo, opts, (error, result) => {
      let messages;
      let validation;
      if (error) {
        return go(error);
      }
      if (result.error_count > 0) {
        messages = (() => {
          let _i;
          let _len;
          let _ref1;
          let _results;
          _ref1 = result.messages;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            validation = _ref1[_i];
            _results.push(validation.message);
          }
          return _results;
        })();
        return go(new Flow.Error(`Model build failure: ${messages.join('; ')}`));
      }
      return go(null, extendJob(_, result.job));
    });
    requestAutoModelBuild = (opts, go) => {
      let params;
      params = {
        input_spec: {
          training_frame: opts.frame,
          response_column: opts.column
        },
        build_control: { stopping_criteria: { max_runtime_secs: opts.maxRunTime } }
      };
      return _.requestAutoModelBuild(params, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendJob(_, result.job));
      });
    };
    buildAutoModel = opts => {
      if (opts && lodash.keys(opts).length > 1) {
        return _fork(requestAutoModelBuild, opts);
      }
      return assist(buildAutoModel, opts);
    };
    buildModel = (algo, opts) => {
      if (algo && opts && lodash.keys(opts).length > 1) {
        return _fork(requestModelBuild, algo, opts);
      }
      return assist(buildModel, algo, opts);
    };
    unwrapPrediction = go => (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendPrediction(result));
    };
    requestPredict = (destinationKey, modelKey, frameKey, options, go) => _.requestPredict(destinationKey, modelKey, frameKey, options, unwrapPrediction(go));
    requestPredicts = (opts, go) => {
      let futures;
      futures = lodash.map(opts, opt => {
        let frameKey;
        let modelKey;
        let options;
        modelKey = opt.model, frameKey = opt.frame, options = opt.options;
        return _fork(_.requestPredict, null, modelKey, frameKey, options || {});
      });
      return Flow.Async.join(futures, (error, predictions) => {
        if (error) {
          return go(error);
        }
        return go(null, extendPredictions(opts, predictions));
      });
    };
    predict = opts => {
      let combos;
      let deep_features_hidden_layer;
      let exemplar_index;
      let frame;
      let frames;
      let leaf_node_assignment;
      let model;
      let models;
      let predictions_frame;
      let reconstruction_error;
      let _i;
      let _j;
      let _len;
      let _len1;
      if (opts == null) {
        opts = {};
      }
      predictions_frame = opts.predictions_frame, model = opts.model, models = opts.models, frame = opts.frame, frames = opts.frames, reconstruction_error = opts.reconstruction_error, deep_features_hidden_layer = opts.deep_features_hidden_layer, leaf_node_assignment = opts.leaf_node_assignment, exemplar_index = opts.exemplar_index;
      if (models || frames) {
        if (!models) {
          if (model) {
            models = [model];
          }
        }
        if (!frames) {
          if (frame) {
            frames = [frame];
          }
        }
        if (frames && models) {
          combos = [];
          for (_i = 0, _len = models.length; _i < _len; _i++) {
            model = models[_i];
            for (_j = 0, _len1 = frames.length; _j < _len1; _j++) {
              frame = frames[_j];
              combos.push({
                model,
                frame
              });
            }
          }
          return _fork(requestPredicts, combos);
        }
        return assist(predict, {
          predictions_frame,
          models,
          frames
        });
      }
      if (model && frame) {
        return _fork(requestPredict, predictions_frame, model, frame, {
          reconstruction_error,
          deep_features_hidden_layer,
          leaf_node_assignment
        });
      } else if (model && exemplar_index !== void 0) {
        return _fork(requestPredict, predictions_frame, model, null, { exemplar_index });
      }
      return assist(predict, {
        predictions_frame,
        model,
        frame
      });
    };
    requestPrediction = (modelKey, frameKey, go) => _.requestPrediction(modelKey, frameKey, unwrapPrediction(go));
    requestPredictions = (opts, go) => {
      let frameKey;
      let futures;
      let modelKey;
      if (lodash.isArray(opts)) {
        futures = lodash.map(opts, opt => {
          let frameKey;
          let modelKey;
          modelKey = opt.model, frameKey = opt.frame;
          return _fork(_.requestPredictions, modelKey, frameKey);
        });
        return Flow.Async.join(futures, (error, predictions) => {
          let uniquePredictions;
          if (error) {
            return go(error);
          }
          uniquePredictions = lodash.values(lodash.indexBy(lodash.flatten(predictions, true), prediction => prediction.model.name + prediction.frame.name));
          return go(null, extendPredictions(opts, uniquePredictions));
        });
      }
      modelKey = opts.model, frameKey = opts.frame;
      return _.requestPredictions(modelKey, frameKey, (error, predictions) => {
        if (error) {
          return go(error);
        }
        return go(null, extendPredictions(opts, predictions));
      });
    };
    getPrediction = opts => {
      let frame;
      let model;
      let predictions_frame;
      if (opts == null) {
        opts = {};
      }
      predictions_frame = opts.predictions_frame, model = opts.model, frame = opts.frame;
      if (model && frame) {
        return _fork(requestPrediction, model, frame);
      }
      return assist(getPrediction, {
        predictions_frame,
        model,
        frame
      });
    };
    getPredictions = opts => {
      if (opts == null) {
        opts = {};
      }
      return _fork(requestPredictions, opts);
    };
    requestCloud = go => _.requestCloud((error, cloud) => {
      if (error) {
        return go(error);
      }
      return go(null, extendCloud(_, cloud));
    });
    getCloud = () => _fork(requestCloud);
    requestTimeline = go => _.requestTimeline((error, timeline) => {
      if (error) {
        return go(error);
      }
      return go(null, extendTimeline(_, timeline));
    });
    getTimeline = () => _fork(requestTimeline);
    requestStackTrace = go => _.requestStackTrace((error, stackTrace) => {
      if (error) {
        return go(error);
      }
      return go(null, extendStackTrace(_, stackTrace));
    });
    getStackTrace = () => _fork(requestStackTrace);
    requestLogFile = (nodeIndex, fileType, go) => _.requestCloud((error, cloud) => {
      let NODE_INDEX_SELF;
      if (error) {
        return go(error);
      }
      if (nodeIndex < 0 || nodeIndex >= cloud.nodes.length) {
        NODE_INDEX_SELF = -1;
        nodeIndex = NODE_INDEX_SELF;
      }
      return _.requestLogFile(nodeIndex, fileType, (error, logFile) => {
        if (error) {
          return go(error);
        }
        return go(null, extendLogFile(_, cloud, nodeIndex, fileType, logFile));
      });
    });
    getLogFile = (nodeIndex, fileType) => {
      if (nodeIndex == null) {
        nodeIndex = -1;
      }
      if (fileType == null) {
        fileType = 'info';
      }
      return _fork(requestLogFile, nodeIndex, fileType);
    };
    requestNetworkTest = go => _.requestNetworkTest((error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendNetworkTest(_, result));
    });
    testNetwork = () => _fork(requestNetworkTest);
    requestRemoveAll = go => _.requestRemoveAll((error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendDeletedKeys(_, []));
    });
    deleteAll = () => _fork(requestRemoveAll);
    extendRDDs = rdds => {
      render_(_,  rdds, h2oRDDsOutput, rdds);
      return rdds;
    };
    requestRDDs = go => _.requestRDDs((error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendRDDs(result.rdds));
    });
    getRDDs = () => _fork(requestRDDs);
    extendDataFrames = dataframes => {
      render_(_,  dataframes, h2oDataFramesOutput, dataframes);
      return dataframes;
    };
    requestDataFrames = go => _.requestDataFrames((error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendDataFrames(result.dataframes));
    });
    getDataFrames = () => _fork(requestDataFrames);
    extendAsH2OFrame = result => {
      render_(_,  result, h2oH2OFrameOutput, result);
      return result;
    };
    requestAsH2OFrameFromRDD = (rddId, name, go) => _.requestAsH2OFrameFromRDD(rddId, name, (error, h2oframe_id) => {
      if (error) {
        return go(error);
      }
      return go(null, extendAsH2OFrame(h2oframe_id));
    });
    asH2OFrameFromRDD = (rddId, name) => {
      if (name == null) {
        name = void 0;
      }
      return _fork(requestAsH2OFrameFromRDD, rddId, name);
    };
    requestAsH2OFrameFromDF = (dfId, name, go) => _.requestAsH2OFrameFromDF(dfId, name, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendAsH2OFrame(result));
    });
    asH2OFrameFromDF = (dfId, name) => {
      if (name == null) {
        name = void 0;
      }
      return _fork(requestAsH2OFrameFromDF, dfId, name);
    };
    extendAsDataFrame = result => {
      render_(_,  result, h2oDataFrameOutput, result);
      return result;
    };
    requestAsDataFrame = (hfId, name, go) => _.requestAsDataFrame(hfId, name, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendAsDataFrame(result));
    });
    asDataFrame = (hfId, name) => {
      if (name == null) {
        name = void 0;
      }
      return _fork(requestAsDataFrame, hfId, name);
    };
    requestScalaCode = (sessionId, code, go) => _.requestScalaCode(sessionId, code, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendScalaCode(result));
    });
    extendScalaCode = result => {
      render_(_,  result, h2oScalaCodeOutput, result);
      return result;
    };
    runScalaCode = (sessionId, code) => _fork(requestScalaCode, sessionId, code);
    requestScalaIntp = go => _.requestScalaIntp((error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendScalaIntp(result));
    });
    extendScalaIntp = result => {
      render_(_,  result, h2oScalaIntpOutput, result);
      return result;
    };
    getScalaIntp = () => _fork(requestScalaIntp);
    requestProfile = (depth, go) => _.requestProfile(depth, (error, profile) => {
      if (error) {
        return go(error);
      }
      return go(null, extendProfile(_, profile));
    });
    getProfile = opts => {
      if (!opts) {
        opts = { depth: 10 };
      }
      return _fork(requestProfile, opts.depth);
    };
    loadScript = (path, go) => {
      let onDone;
      let onFail;
      onDone = (script, status) => go(null, {
        script,
        status
      });
      onFail = (jqxhr, settings, error) => go(error);
      return $.getScript(path).done(onDone).fail(onFail);
    };
    dumpFuture = (result, go) => {
      if (result == null) {
        result = {};
      }
      console.debug(result);
      return go(null, render_(_,  result, Flow.objectBrowser, 'dump', result));
    };
    dump = f => {
      if (f != null ? f.isFuture : void 0) {
        return _fork(dumpFuture, f);
      }
      return Flow.Async.async(() => f);
    };
    // abstracting this out produces errors
    // defer for now
    assist = function () {
      let args;
      let func;
      func = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
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
    };
    Flow.Dataflow.link(_.ready, () => {
      Flow.Dataflow.link(_.ls, ls);
      Flow.Dataflow.link(_.inspect, inspect);
      Flow.Dataflow.link(_.plot, plot => plot(lightning));
      Flow.Dataflow.link(_.grid, frame => lightning(lightning.select(), lightning.from(frame)));
      Flow.Dataflow.link(_.enumerate, frame => lightning(lightning.select(0), lightning.from(frame)));
      Flow.Dataflow.link(_.requestFrameDataE, requestFrameData);
      return Flow.Dataflow.link(_.requestFrameSummarySliceE, requestFrameSummarySlice);
    });
    initAssistanceSparklingWater = () => {
      _assistance.getRDDs = {
        description: 'Get a list of Spark\'s RDDs',
        icon: 'table'
      };
      return _assistance.getDataFrames = {
        description: 'Get a list of Spark\'s data frames',
        icon: 'table'
      };
    };
    Flow.Dataflow.link(_.initialized, () => {
      if (_.onSparklingWater) {
        return initAssistanceSparklingWater();
      }
    });
    routines = {
      //
      // fork/join
      //
      fork: _fork,
      join: _join,
      call: _call,
      apply: _apply,
      isFuture: _isFuture,
      //
      // Dataflow
      //
      signal: Flow.Dataflow.signal,
      signals: Flow.Dataflow.signals,
      isSignal: Flow.Dataflow.isSignal,
      act: Flow.Dataflow.act,
      react: Flow.Dataflow.react,
      lift: Flow.Dataflow.lift,
      merge: Flow.Dataflow.merge,
      //
      // Generic
      //
      dump,
      inspect,
      plot,
      grid,
      get: _get,
      //
      // Meta
      //
      assist,
      //
      // GUI
      //
      gui,
      //
      // Util
      //
      loadScript,
      //
      // H2O
      //
      getJobs,
      getJob,
      cancelJob,
      importFiles,
      setupParse,
      parseFiles,
      createFrame,
      splitFrame,
      mergeFrames,
      buildPartialDependence,
      getPartialDependence,
      getFrames,
      getFrame,
      bindFrames,
      getFrameSummary,
      getFrameData,
      deleteFrames,
      deleteFrame,
      exportFrame,
      getColumnSummary,
      changeColumnType,
      imputeColumn,
      buildModel,
      buildAutoModel,
      getGrids,
      getModels,
      getModel,
      getGrid,
      deleteModels,
      deleteModel,
      importModel,
      exportModel,
      predict,
      getPrediction,
      getPredictions,
      getCloud,
      getTimeline,
      getProfile,
      getStackTrace,
      getLogFile,
      testNetwork,
      deleteAll
    };
    if (_.onSparklingWater) {
      routinesOnSw = {
        getDataFrames,
        getRDDs,
        getScalaIntp,
        runScalaCode,
        asH2OFrameFromRDD,
        asH2OFrameFromDF,
        asDataFrame
      };
      for (attrname in routinesOnSw) {
        if ({}.hasOwnProperty.call(routinesOnSw, attrname)) {
          routines[attrname] = routinesOnSw[attrname];
        }
      }
    }
    return routines;
  };
}

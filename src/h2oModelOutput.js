import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oModelOutput(_, _go, _model, refresh) {
  const lodash = window._;
  const Flow = window.Flow;
  let createOutput;
  let _isLive;
  let _output;
  let _refresh;
  let _toggleRefresh;
  _output = Flow.Dataflow.signal(null);
  createOutput = _model => {
    let cloneModel;
    let confusionMatrix;
    let deleteModel;
    let downloadMojo;
    let downloadPojo;
    let exportModel;
    let format4f;
    let getAucAsLabel;
    let getThresholdsAndCriteria;
    let inspect;
    let lambdaSearchParameter;
    let output;
    let plotter;
    let predict;
    let previewPojo;
    let renderMultinomialConfusionMatrix;
    let renderPlot;
    let table;
    let tableName;
    let toggle;
    let _i;
    let _inputParameters;
    let _isExpanded;
    let _isPojoLoaded;
    let _len;
    let _plots;
    let _pojoPreview;
    let _ref;
    let _ref1;
    let _ref10;
    let _ref11;
    let _ref12;
    let _ref13;
    let _ref14;
    let _ref15;
    let _ref16;
    let _ref17;
    let _ref18;
    let _ref19;
    let _ref2;
    let _ref20;
    let _ref21;
    let _ref22;
    let _ref23;
    let _ref24;
    let _ref25;
    let _ref3;
    let _ref4;
    let _ref5;
    let _ref6;
    let _ref7;
    let _ref8;
    let _ref9;
    _isExpanded = Flow.Dataflow.signal(false);
    _plots = Flow.Dataflow.signals([]);
    _pojoPreview = Flow.Dataflow.signal(null);
    _isPojoLoaded = Flow.Dataflow.lift(_pojoPreview, preview => {
      if (preview) {
        return true;
      }
      return false;
    });
    _inputParameters = lodash.map(_model.parameters, parameter => {
      let actual_value;
      let default_value;
      let help;
      let label;
      let type;
      let value;
      type = parameter.type, default_value = parameter.default_value, actual_value = parameter.actual_value, label = parameter.label, help = parameter.help;
      value = (() => {
        switch (type) {
          case 'Key<Frame>':
          case 'Key<Model>':
            if (actual_value) {
              return actual_value.name;
            }
            return null;
            // break; // no-unreachable
          case 'VecSpecifier':
            if (actual_value) {
              return actual_value.column_name;
            }
            return null;
            // break; // no-unreachable
          case 'string[]':
          case 'byte[]':
          case 'short[]':
          case 'int[]':
          case 'long[]':
          case 'float[]':
          case 'double[]':
            if (actual_value) {
              return actual_value.join(', ');
            }
            return null;
            // break; // no-unreachable
          default:
            return actual_value;
        }
      })();
      return {
        label,
        value,
        help,
        isModified: default_value === actual_value
      };
    });
    format4f = number => {
      if (number) {
        if (number === 'NaN') {
          return void 0;
        }
        return number.toFixed(4).replace(/\.0+$/, '.0');
      }
      return number;
    };
    getAucAsLabel = (model, tableName) => {
      let metrics;
      if (metrics = _.inspect(tableName, model)) {
        return ` , AUC = ${metrics.schema.AUC.at(0)}`;
      }
      return '';
    };
    getThresholdsAndCriteria = (model, tableName) => {
      let criteria;
      let criterionTable;
      let i;
      let idxVector;
      let metricVector;
      let thresholdVector;
      let thresholds;
      if (criterionTable = _.inspect(tableName, _model)) {
        thresholdVector = table.schema.threshold;
        thresholds = (() => {
          let _i;
          let _ref;
          let _results;
          _results = [];
          for (i = _i = 0, _ref = thresholdVector.count(); _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
            _results.push({
              index: i,
              value: thresholdVector.at(i)
            });
          }
          return _results;
        })();
        metricVector = criterionTable.schema.metric;
        idxVector = criterionTable.schema.idx;
        criteria = (() => {
          let _i;
          let _ref;
          let _results;
          _results = [];
          for (i = _i = 0, _ref = metricVector.count(); _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
            _results.push({
              index: idxVector.at(i),
              value: metricVector.valueAt(i)
            });
          }
          return _results;
        })();
        return {
          thresholds,
          criteria
        };
      }
      return void 0;
    };
    renderPlot = (title, isCollapsed, render, thresholdsAndCriteria) => {
      let container;
      let linkedFrame;
      let rocPanel;
      container = Flow.Dataflow.signal(null);
      linkedFrame = Flow.Dataflow.signal(null);
      if (thresholdsAndCriteria) {
        rocPanel = {
          thresholds: Flow.Dataflow.signals(thresholdsAndCriteria.thresholds),
          threshold: Flow.Dataflow.signal(null),
          criteria: Flow.Dataflow.signals(thresholdsAndCriteria.criteria),
          criterion: Flow.Dataflow.signal(null)
        };
      }
      render((error, vis) => {
        let _autoHighlight;
        if (error) {
          return console.debug(error);
        }
        $('a', vis.element).on('click', e => {
          let $a;
          $a = $(e.target);
          switch ($a.attr('data-type')) {
            case 'frame':
              return _.insertAndExecuteCell('cs', `getFrameSummary ${flowPrelude.stringify($a.attr('data-key'))}`);
            case 'model':
              return _.insertAndExecuteCell('cs', `getModel ${flowPrelude.stringify($a.attr('data-key'))}`);
          }
        });
        container(vis.element);
        _autoHighlight = true;
        if (vis.subscribe) {
          vis.subscribe('markselect', _arg => {
            let currentCriterion;
            let frame;
            let indices;
            let renderTable;
            let selectedIndex;
            let subframe;
            frame = _arg.frame, indices = _arg.indices;
            subframe = window.plot.createFrame(frame.label, frame.vectors, indices);
            renderTable = g => g(indices.length > 1 ? g.select() : g.select(lodash.head(indices)), g.from(subframe));
            _.plot(renderTable)((error, table) => {
              if (!error) {
                return linkedFrame(table.element);
              }
            });
            if (rocPanel) {
              if (indices.length === 1) {
                selectedIndex = lodash.head(indices);
                _autoHighlight = false;
                rocPanel.threshold(lodash.find(rocPanel.thresholds(), threshold => threshold.index === selectedIndex));
                currentCriterion = rocPanel.criterion();
                if (!currentCriterion || currentCriterion && currentCriterion.index !== selectedIndex) {
                  rocPanel.criterion(lodash.find(rocPanel.criteria(), criterion => criterion.index === selectedIndex));
                }
                _autoHighlight = true;
              } else {
                rocPanel.criterion(null);
                rocPanel.threshold(null);
              }
            }
          });
          vis.subscribe('markdeselect', () => {
            linkedFrame(null);
            if (rocPanel) {
              rocPanel.criterion(null);
              return rocPanel.threshold(null);
            }
          });
          if (rocPanel) {
            Flow.Dataflow.react(rocPanel.threshold, threshold => {
              if (threshold && _autoHighlight) {
                return vis.highlight([threshold.index]);
              }
            });
            return Flow.Dataflow.react(rocPanel.criterion, criterion => {
              if (criterion && _autoHighlight) {
                return vis.highlight([criterion.index]);
              }
            });
          }
        }
      });
      return _plots.push({
        title,
        plot: container,
        frame: linkedFrame,
        controls: Flow.Dataflow.signal(rocPanel),
        isCollapsed
      });
    };
    renderMultinomialConfusionMatrix = (title, cm) => {
      let bold;
      let cell;
      let cells;
      let column;
      let columnCount;
      let errorColumnIndex;
      let headers;
      let i;
      let normal;
      let rowCount;
      let rowIndex;
      let rows;
      let table;
      let tbody;
      let totalRowIndex;
      let tr;
      let yellow;
      let _i;
      let _ref;
      _ref = Flow.HTML.template('table.flow-confusion-matrix', 'tbody', 'tr', 'td', 'td.strong', 'td.bg-yellow'), table = _ref[0], tbody = _ref[1], tr = _ref[2], normal = _ref[3], bold = _ref[4], yellow = _ref[5];
      columnCount = cm.columns.length;
      rowCount = cm.rowcount;
      headers = lodash.map(cm.columns, (column, i) => bold(column.description));
      headers.unshift(normal(' '));
      rows = [tr(headers)];
      errorColumnIndex = columnCount - 2;
      totalRowIndex = rowCount - 1;
      for (rowIndex = _i = 0; rowCount >= 0 ? _i < rowCount : _i > rowCount; rowIndex = rowCount >= 0 ? ++_i : --_i) {
        cells = (() => {
          let _j;
          let _len;
          let _ref1;
          let _results;
          _ref1 = cm.data;
          _results = [];
          for (i = _j = 0, _len = _ref1.length; _j < _len; i = ++_j) {
            column = _ref1[i];
            cell = i < errorColumnIndex ? i === rowIndex ? yellow : rowIndex < totalRowIndex ? normal : bold : bold;
            _results.push(cell(i === errorColumnIndex ? format4f(column[rowIndex]) : column[rowIndex]));
          }
          return _results;
        })();
        cells.unshift(bold(rowIndex === rowCount - 1 ? 'Total' : cm.columns[rowIndex].description));
        rows.push(tr(cells));
      }
      return _plots.push({
        title: title + (cm.description ? ` ${cm.description}` : ''),
        plot: Flow.Dataflow.signal(Flow.HTML.render('div', table(tbody(rows)))),
        frame: Flow.Dataflow.signal(null),
        controls: Flow.Dataflow.signal(null),
        isCollapsed: false
      });
    };
    switch (_model.algo) {
      case 'kmeans':
        if (table = _.inspect('output - Scoring History', _model)) {
          renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('iteration', 'within_cluster_sum_of_squares'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('iteration', 'within_cluster_sum_of_squares'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
        }
        break;
      case 'glm':
        if (table = _.inspect('output - Scoring History', _model)) {
          lambdaSearchParameter = lodash.find(_model.parameters, parameter => parameter.name === 'lambda_search');
          if (lambdaSearchParameter != null ? lambdaSearchParameter.actual_value : void 0) {
            renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('lambda', 'explained_deviance_train'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('lambda', 'explained_deviance_test'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('lambda', 'explained_deviance_train'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('lambda', 'explained_deviance_test'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
          } else {
            renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('iteration', 'objective'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('iteration', 'objective'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
          }
        }
        if (table = _.inspect('output - training_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Training Metrics${getAucAsLabel(_model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Validation Metrics${getAucAsLabel(_model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Cross Validation Metrics' + ${getAucAsLabel(_model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - Standardized Coefficient Magnitudes', _model)) {
          renderPlot('Standardized Coefficient Magnitudes', false, _.plot(g => g(g.rect(g.position('coefficients', 'names'), g.fillColor('sign')), g.from(table), g.limit(25))));
        }
        if (output = _model.output) {
          if (output.model_category === 'Multinomial') {
            if (confusionMatrix = (_ref = output.training_metrics) != null ? (_ref1 = _ref.cm) != null ? _ref1.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
            }
            if (confusionMatrix = (_ref2 = output.validation_metrics) != null ? (_ref3 = _ref2.cm) != null ? _ref3.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
            }
            if (confusionMatrix = (_ref4 = output.cross_validation_metrics) != null ? (_ref5 = _ref4.cm) != null ? _ref5.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
            }
          }
        }
        break;
      case 'deeplearning':
      case 'deepwater':
        if (table = _.inspect('output - Scoring History', _model)) {
          if (table.schema.validation_logloss && table.schema.training_logloss) {
            renderPlot('Scoring History - logloss', false, _.plot(g => g(g.path(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('epochs', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
          } else if (table.schema.training_logloss) {
            renderPlot('Scoring History - logloss', false, _.plot(g => g(g.path(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
          }
          if (table.schema.training_deviance) {
            if (table.schema.validation_deviance) {
              renderPlot('Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('epochs', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
            } else {
              renderPlot('Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
            }
          } else if (table.schema.training_mse) {
            if (table.schema.validation_mse) {
              renderPlot('Scoring History - MSE', false, _.plot(g => g(g.path(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('epochs', 'validation_mse'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'validation_mse'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
            } else {
              renderPlot('Scoring History - MSE', false, _.plot(g => g(g.path(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
            }
          }
        }
        if (table = _.inspect('output - training_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Training Metrics${getAucAsLabel(_model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`'ROC Curve - Validation Metrics' + ${getAucAsLabel(_model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`'ROC Curve - Cross Validation Metrics' + ${getAucAsLabel(_model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - Variable Importances', _model)) {
          renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
        }
        if (output = _model.output) {
          if (output.model_category === 'Multinomial') {
            if (confusionMatrix = (_ref6 = output.training_metrics) != null ? (_ref7 = _ref6.cm) != null ? _ref7.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
            }
            if (confusionMatrix = (_ref8 = output.validation_metrics) != null ? (_ref9 = _ref8.cm) != null ? _ref9.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
            }
            if (confusionMatrix = (_ref10 = output.cross_validation_metrics) != null ? (_ref11 = _ref10.cm) != null ? _ref11.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
            }
          }
        }
        break;
      case 'gbm':
      case 'drf':
      case 'svm':
        if (table = _.inspect('output - Scoring History', _model)) {
          if (table.schema.validation_logloss && table.schema.training_logloss) {
            renderPlot('Scoring History - logloss', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('number_of_trees', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
          } else if (table.schema.training_logloss) {
            renderPlot('Scoring History - logloss', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
          }
          if (table.schema.training_deviance) {
            if (table.schema.validation_deviance) {
              renderPlot('Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('number_of_trees', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
            } else {
              renderPlot('Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
            }
          }
        }
        if (table = _.inspect('output - training_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Training Metrics${getAucAsLabel(_model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Validation Metrics${getAucAsLabel(_model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Cross Validation Metrics${getAucAsLabel(_model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - Variable Importances', _model)) {
          renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
        }
        if (output = _model.output) {
          if (output.model_category === 'Multinomial') {
            if (confusionMatrix = (_ref12 = output.training_metrics) != null ? (_ref13 = _ref12.cm) != null ? _ref13.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
            }
            if (confusionMatrix = (_ref14 = output.validation_metrics) != null ? (_ref15 = _ref14.cm) != null ? _ref15.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
            }
            if (confusionMatrix = (_ref16 = output.cross_validation_metrics) != null ? (_ref17 = _ref16.cm) != null ? _ref17.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
            }
          }
        }
        break;
      case 'stackedensemble':
        if (table = _.inspect('output - training_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Training Metrics${getAucAsLabel(_model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`'ROC Curve - Validation Metrics${getAucAsLabel(_model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model)) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Cross Validation Metrics${getAucAsLabel(_model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
        }
        if (table = _.inspect('output - Variable Importances', _model)) {
          renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
        }
        if (output = _model.output) {
          if (output.model_category === 'Multinomial') {
            if (confusionMatrix = (_ref18 = output.training_metrics) != null ? (_ref19 = _ref18.cm) != null ? _ref19.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
            }
            if (confusionMatrix = (_ref20 = output.validation_metrics) != null ? (_ref21 = _ref20.cm) != null ? _ref21.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
            }
            if (confusionMatrix = (_ref22 = output.cross_validation_metrics) != null ? (_ref23 = _ref22.cm) != null ? _ref23.table : void 0 : void 0) {
              renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
            }
          }
        }
    }
    if (table = _.inspect('output - training_metrics - Gains/Lift Table', _model)) {
      renderPlot('Training Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
    }
    if (table = _.inspect('output - validation_metrics - Gains/Lift Table', _model)) {
      renderPlot('Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
    }
    if (table = _.inspect('output - cross_validation_metrics - Gains/Lift Table', _model)) {
      renderPlot('Cross Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
    }
    _ref24 = _.ls(_model);
    for (_i = 0, _len = _ref24.length; _i < _len; _i++) {
      tableName = _ref24[_i];
      if (!(tableName !== 'parameters')) {
        continue;
      }
      if (output = ((_ref25 = _model.output) != null ? _ref25.model_category : void 0) === 'Multinomial') {
        if (tableName.indexOf('output - training_metrics - cm') === 0) {
          continue;
        } else if (tableName.indexOf('output - validation_metrics - cm') === 0) {
          continue;
        } else if (tableName.indexOf('output - cross_validation_metrics - cm') === 0) {
          continue;
        }
      }
      if (table = _.inspect(tableName, _model)) {
        renderPlot(tableName + (table.metadata.description ? ` (${table.metadata.description})` : ''), true, _.plot(g => g(table.indices.length > 1 ? g.select() : g.select(0), g.from(table))));
      }
    }
    toggle = () => _isExpanded(!_isExpanded());
    cloneModel = () => alert('Not implemented');
    predict = () => _.insertAndExecuteCell('cs', `predict model: ${flowPrelude.stringify(_model.model_id.name)}`);
    inspect = () => _.insertAndExecuteCell('cs', `inspect getModel ${flowPrelude.stringify(_model.model_id.name)}`);
    previewPojo = () => _.requestPojoPreview(_model.model_id.name, (error, result) => {
      if (error) {
        return _pojoPreview(`<pre>${lodash.escape(error)}</pre>`);
      }
      return _pojoPreview(`<pre>${Flow.Util.highlight(result, 'java')}</pre>`);
    });
    downloadPojo = () => window.open(`/3/Models.java/${encodeURIComponent(_model.model_id.name)}`, '_blank');
    downloadMojo = () => window.open(`/3/Models/${encodeURIComponent(_model.model_id.name)}/mojo`, '_blank');
    exportModel = () => _.insertAndExecuteCell('cs', `exportModel ${flowPrelude.stringify(_model.model_id.name)}`);
    deleteModel = () => _.confirm('Are you sure you want to delete this model?', {
      acceptCaption: 'Delete Model',
      declineCaption: 'Cancel'
    }, accept => {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteModel ${flowPrelude.stringify(_model.model_id.name)}`);
      }
    });
    return {
      key: _model.model_id,
      algo: _model.algo_full_name,
      plots: _plots,
      inputParameters: _inputParameters,
      isExpanded: _isExpanded,
      toggle,
      cloneModel,
      predict,
      inspect,
      previewPojo,
      downloadPojo,
      downloadMojo,
      pojoPreview: _pojoPreview,
      isPojoLoaded: _isPojoLoaded,
      exportModel,
      deleteModel
    };
  };
  _isLive = Flow.Dataflow.signal(false);
  Flow.Dataflow.act(_isLive, isLive => {
    if (isLive) {
      return _refresh();
    }
  });
  _refresh = () => refresh((error, model) => {
    if (!error) {
      _output(createOutput(model));
      if (_isLive()) {
        return lodash.delay(_refresh, 2000);
      }
    }
  });
  _toggleRefresh = () => _isLive(!_isLive());
  _output(createOutput(_model));
  lodash.defer(_go);
  return {
    output: _output,
    toggleRefresh: _toggleRefresh,
    isLive: _isLive,
    template: 'flow-model-output'
  };
}


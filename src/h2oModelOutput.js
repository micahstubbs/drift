import { requestPojoPreview } from './h2oProxy/requestPojoPreview';
import { highlight } from './utils/highlight';
import { format4f } from './routines/format4f';

import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oModelOutput(_, _go, _model, refresh) {
  const lodash = window._;
  const Flow = window.Flow;
  const $ = window.jQuery;
  const _output = Flow.Dataflow.signal(null);
  const createOutput = _model => {
    let confusionMatrix;
    let lambdaSearchParameter;
    let output;
    let plotter;
    let table;
    let tableName;
    let _i;
    let _len;
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
    let _ref25;
    let _ref3;
    let _ref4;
    let _ref5;
    let _ref6;
    let _ref7; let _ref8;
    let _ref9;
    const _isExpanded = Flow.Dataflow.signal(false);
    const _plots = Flow.Dataflow.signals([]);
    const _pojoPreview = Flow.Dataflow.signal(null);
    const _isPojoLoaded = Flow.Dataflow.lift(_pojoPreview, preview => {
      if (preview) {
        return true;
      }
      return false;
    });

    // TODO use _.enumerate()
    const _inputParameters = lodash.map(_model.parameters, parameter => {
      const type = parameter.type;
      const defaultValue = parameter.default_value;
      const actualValue = parameter.actual_value;
      const label = parameter.label;
      const help = parameter.help;
      const value = (() => {
        switch (type) {
          case 'Key<Frame>':
          case 'Key<Model>':
            if (actualValue) {
              return actualValue.name;
            }
            return null;
            // break; // no-unreachable
          case 'VecSpecifier':
            if (actualValue) {
              return actualValue.column_name;
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
            if (actualValue) {
              return actualValue.join(', ');
            }
            return null;
            // break; // no-unreachable
          default:
            return actualValue;
        }
      })();
      return {
        label,
        value,
        help,
        isModified: defaultValue === actualValue,
      };
    });
    const getAucAsLabel = (model, tableName) => {
      const metrics = _.inspect(tableName, model);
      if (metrics) {
        return ` , AUC = ${metrics.schema.AUC.at(0)}`;
      }
      return '';
    };
    const getThresholdsAndCriteria = (model, tableName) => {
      let criteria;
      let i;
      let idxVector;
      let metricVector;
      let thresholdVector;
      let thresholds;
      const criterionTable = _.inspect(tableName, _model);
      if (criterionTable) {
        // Threshold dropdown items
        thresholdVector = table.schema.threshold;
        thresholds = (() => {
          let _i;
          let _ref;
          const _results = [];
          for (i = _i = 0, _ref = thresholdVector.count(); _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
            _results.push({
              index: i,
              value: thresholdVector.at(i),
            });
          }
          return _results;
        })();

        // Threshold criterion dropdown item
        metricVector = criterionTable.schema.metric;
        idxVector = criterionTable.schema.idx;
        criteria = (() => {
          let _i;
          let _ref;
          const _results = [];
          for (i = _i = 0, _ref = metricVector.count(); _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
            _results.push({
              index: idxVector.at(i),
              value: metricVector.valueAt(i),
            });
          }
          return _results;
        })();
        return {
          thresholds,
          criteria,
        };
      }
      return void 0;
    };

    // TODO Mega-hack alert
    // Last arg thresholdsAndCriteria applicable only to
    // ROC charts for binomial models.
    const renderPlot = (title, isCollapsed, render, thresholdsAndCriteria) => {
      let rocPanel;
      const container = Flow.Dataflow.signal(null);
      const linkedFrame = Flow.Dataflow.signal(null);

      // TODO HACK
      if (thresholdsAndCriteria) {
        rocPanel = {
          thresholds: Flow.Dataflow.signals(thresholdsAndCriteria.thresholds),
          threshold: Flow.Dataflow.signal(null),
          criteria: Flow.Dataflow.signals(thresholdsAndCriteria.criteria),
          criterion: Flow.Dataflow.signal(null),
        };
      }
      render((error, vis) => {
        let _autoHighlight;
        if (error) {
          return console.debug(error);
        }
        $('a', vis.element).on('click', e => {
          const $a = $(e.target);
          switch ($a.attr('data-type')) {
            case 'frame':
              return _.insertAndExecuteCell('cs', `getFrameSummary ${flowPrelude.stringify($a.attr('data-key'))}`);
            case 'model':
              return _.insertAndExecuteCell('cs', `getModel ${flowPrelude.stringify($a.attr('data-key'))}`);
            default:
              // do nothing
          }
        });
        container(vis.element);
        _autoHighlight = true;
        if (vis.subscribe) {
          vis.subscribe('markselect', _arg => {
            let currentCriterion;
            let selectedIndex;
            const frame = _arg.frame;
            const indices = _arg.indices;
            const subframe = window.plot.createFrame(frame.label, frame.vectors, indices);
            const renderTable = g => g(indices.length > 1 ? g.select() : g.select(lodash.head(indices)), g.from(subframe));
            _.plot(renderTable)((error, table) => {
              if (!error) {
                return linkedFrame(table.element);
              }
            });

            // TODO HACK
            if (rocPanel) {
              if (indices.length === 1) {
                selectedIndex = lodash.head(indices);
                _autoHighlight = false;
                rocPanel.threshold(lodash.find(rocPanel.thresholds(), threshold => threshold.index === selectedIndex));
                currentCriterion = rocPanel.criterion();

                // More than one criterion can point to the same threshold,
                // so ensure that we're preserving the existing criterion, if any.
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

            // TODO HACK
            if (rocPanel) {
              rocPanel.criterion(null);
              return rocPanel.threshold(null);
            }
          });

          // TODO HACK
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
        isCollapsed,
      });
    };
    const renderMultinomialConfusionMatrix = (title, cm) => {
      let cell;
      let cells;
      let column;
      let i;
      let rowIndex;
      let _i;
      const _ref = Flow.HTML.template('table.flow-confusion-matrix', 'tbody', 'tr', 'td', 'td.strong', 'td.bg-yellow');
      const table = _ref[0];
      const tbody = _ref[1];
      const tr = _ref[2];
      const normal = _ref[3];
      const bold = _ref[4];
      const yellow = _ref[5];
      const columnCount = cm.columns.length;
      const rowCount = cm.rowcount;
      const headers = lodash.map(cm.columns, (column, i) => bold(column.description));

      // NW corner cell
      headers.unshift(normal(' '));
      const rows = [tr(headers)];
      const errorColumnIndex = columnCount - 2;
      const totalRowIndex = rowCount - 1;
      for (rowIndex = _i = 0; rowCount >= 0 ? _i < rowCount : _i > rowCount; rowIndex = rowCount >= 0 ? ++_i : --_i) {
        cells = (() => {
          let _j;
          let _len;
          const _ref1 = cm.data;
          const _results = [];
          for (i = _j = 0, _len = _ref1.length; _j < _len; i = ++_j) {
            column = _ref1[i];

            // Last two columns should be emphasized
            // special-format error column
            cell = i < errorColumnIndex ? i === rowIndex ? yellow : rowIndex < totalRowIndex ? normal : bold : bold;
            _results.push(cell(i === errorColumnIndex ? format4f(column[rowIndex]) : column[rowIndex]));
          }
          return _results;
        })();
        // Add the corresponding column label
        cells.unshift(bold(rowIndex === rowCount - 1 ? 'Total' : cm.columns[rowIndex].description));
        rows.push(tr(cells));
      }
      return _plots.push({
        title: title + (cm.description ? ` ${cm.description}` : ''),
        plot: Flow.Dataflow.signal(Flow.HTML.render('div', table(tbody(rows)))),
        frame: Flow.Dataflow.signal(null),
        controls: Flow.Dataflow.signal(null),
        isCollapsed: false,
      });
    };
    switch (_model.algo) {
      case 'kmeans':
        table = _.inspect('output - Scoring History', _model);
        if (table) {
          renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('iteration', 'within_cluster_sum_of_squares'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('iteration', 'within_cluster_sum_of_squares'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
        }
        break;
      case 'glm':
        table = _.inspect('output - Scoring History', _model);
        if (table) {
          lambdaSearchParameter = lodash.find(_model.parameters, parameter => parameter.name === 'lambda_search');
          if (lambdaSearchParameter != null ? lambdaSearchParameter.actual_value : void 0) {
            renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('lambda', 'explained_deviance_train'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('lambda', 'explained_deviance_test'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('lambda', 'explained_deviance_train'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('lambda', 'explained_deviance_test'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
          } else {
            renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('iteration', 'objective'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('iteration', 'objective'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
          }
        }
        table = _.inspect('output - training_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Training Metrics${getAucAsLabel(_model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Validation Metrics${getAucAsLabel(_model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
          renderPlot(`ROC Curve - Cross Validation Metrics' + ${getAucAsLabel(_model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - Standardized Coefficient Magnitudes', _model);
        if (table) {
          renderPlot('Standardized Coefficient Magnitudes', false, _.plot(g => g(g.rect(g.position('coefficients', 'names'), g.fillColor('sign')), g.from(table), g.limit(25))));
        }
        output = _model.output;
        if (output) {
          if (output.model_category === 'Multinomial') {
            _ref = output.training_metrics;
            _ref1 = _ref.cm;
            confusionMatrix = _ref != null ? _ref1 != null ? _ref1.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
            }
            _ref2 = output.validation_metrics;
            _ref3 = _ref2.cm;
            confusionMatrix = _ref2 != null ? _ref3 != null ? _ref3.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
            }
            _ref4 = output.cross_validation_metrics;
            _ref5 = _ref4.cm;
            confusionMatrix = _ref4 != null ? _ref5 != null ? _ref5.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
            }
          }
        }
        break;
      case 'deeplearning':
      case 'deepwater':
        table = _.inspect('output - Scoring History', _model);
        if (table) {
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
        table = _.inspect('output - training_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
          renderPlot(`ROC Curve - Training Metrics${getAucAsLabel(_model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
          renderPlot(`'ROC Curve - Validation Metrics' + ${getAucAsLabel(_model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
          renderPlot(`'ROC Curve - Cross Validation Metrics' + ${getAucAsLabel(_model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - Variable Importances', _model);
        if (table) {
          renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
        }
        output = _model.output;
        if (output) {
          if (output.model_category === 'Multinomial') {
            _ref6 = output.training_metrics;
            _ref7 = _ref6.cm;
            confusionMatrix = _ref6 != null ? _ref7 != null ? _ref7.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
            }
            _ref8 = output.validation_metrics;
            _ref9 = _ref8.cm;
            confusionMatrix = _ref8 != null ? _ref9 != null ? _ref9.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
            }
            _ref10 = output.cross_validation_metrics;
            if (_ref10 !== null) {
              _ref11 = _ref10.cm;
            }
            confusionMatrix = _ref10 != null ? _ref11 != null ? _ref11.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
            }
          }
        }
        break;
      case 'gbm':
      case 'drf':
      case 'svm':
        table = _.inspect('output - Scoring History', _model);
        if (table) {
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
        table = _.inspect('output - training_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
          renderPlot(`ROC Curve - Training Metrics${getAucAsLabel(_model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
          renderPlot(`ROC Curve - Validation Metrics${getAucAsLabel(_model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
          renderPlot(`ROC Curve - Cross Validation Metrics${getAucAsLabel(_model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - Variable Importances', _model);
        if (table) {
          renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
        }
        output = _model.output;
        if (output) {
          if (output.model_category === 'Multinomial') {
            _ref12 = output.training_metrics;
            _ref13 = _ref12.cm;
            confusionMatrix = _ref12 != null ? _ref13 != null ? _ref13.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
            }
            _ref14 = output.validation_metrics;
            _ref15 = _ref14.cm;
            confusionMatrix = _ref14 != null ? _ref15 != null ? _ref15.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
            }
            _ref16 = output.cross_validation_metrics;
            _ref17 = _ref16.cm;
            confusionMatrix = _ref16 != null ? _ref17 != null ? _ref17.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
            }
          }
        }
        break;
        // end of when 'gbm', 'drf', 'svm'

      case 'stackedensemble':
        table = _.inspect('output - training_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
          renderPlot(`ROC Curve - Training Metrics${getAucAsLabel(_model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
          renderPlot(`'ROC Curve - Validation Metrics${getAucAsLabel(_model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model);
        if (table) {
          plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
          renderPlot(`ROC Curve - Cross Validation Metrics${getAucAsLabel(_model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
        }
        table = _.inspect('output - Variable Importances', _model);
        if (table) {
          renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
        }
        output = _model.output;
        if (output) {
          if (output.model_category === 'Multinomial') {
            _ref18 = output.training_metrics;
            _ref19 = _ref18.cm;
            confusionMatrix = _ref18 != null ? _ref19 != null ? _ref19.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
            }
            _ref20 = output.validation_metrics;
            _ref21 = _ref20.cm;
            confusionMatrix = _ref20 != null ? _ref21 != null ? _ref21.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
            }
            _ref22 = output.cross_validation_metrics;
            _ref23 = _ref22.cm;
            confusionMatrix = _ref22 != null ? _ref23 != null ? _ref23.table : void 0 : void 0;
            if (confusionMatrix) {
              renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
            }
          }
        }
        break;
      default:
        // do nothing
    }
    // end of stackedensemble

    table = _.inspect('output - training_metrics - Gains/Lift Table', _model);
    if (table) {
      renderPlot('Training Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
    }
    table = _.inspect('output - validation_metrics - Gains/Lift Table', _model);
    if (table) {
      renderPlot('Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
    }
    table = _.inspect('output - cross_validation_metrics - Gains/Lift Table', _model);
    if (table) {
      renderPlot('Cross Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
    }
    const _ref24 = _.ls(_model);
    for (_i = 0, _len = _ref24.length; _i < _len; _i++) {
      tableName = _ref24[_i];
      if (!(tableName !== 'parameters')) {
        continue;
      }
      _ref25 = _model.output;

      // Skip confusion matrix tables for multinomial models
      output = (_ref25 != null ? _ref25.model_category : void 0) === 'Multinomial';
      if (output) {
        if (tableName.indexOf('output - training_metrics - cm') === 0) {
          continue;
        } else if (tableName.indexOf('output - validation_metrics - cm') === 0) {
          continue;
        } else if (tableName.indexOf('output - cross_validation_metrics - cm') === 0) {
          continue;
        }
      }
      table = _.inspect(tableName, _model);
      if (table) {
        renderPlot(tableName + (table.metadata.description ? ` (${table.metadata.description})` : ''), true, _.plot(g => g(table.indices.length > 1 ? g.select() : g.select(0), g.from(table))));
      }
    }
    const toggle = () => _isExpanded(!_isExpanded());
    const cloneModel = () => alert('Not implemented');
    const predict = () => _.insertAndExecuteCell('cs', `predict model: ${flowPrelude.stringify(_model.model_id.name)}`);
    const inspect = () => _.insertAndExecuteCell('cs', `inspect getModel ${flowPrelude.stringify(_model.model_id.name)}`);
    const previewPojo = () => requestPojoPreview(_model.model_id.name, (error, result) => {
      if (error) {
        return _pojoPreview(`<pre>${lodash.escape(error)}</pre>`);
      }
      return _pojoPreview(`<pre>${highlight(result, 'java')}</pre>`);
    });
    const downloadPojo = () => window.open(`/3/Models.java/${encodeURIComponent(_model.model_id.name)}`, '_blank');
    const downloadMojo = () => window.open(`/3/Models/${encodeURIComponent(_model.model_id.name)}/mojo`, '_blank');
    const exportModel = () => _.insertAndExecuteCell('cs', `exportModel ${flowPrelude.stringify(_model.model_id.name)}`);
    const deleteModel = () => _.confirm('Are you sure you want to delete this model?', {
      acceptCaption: 'Delete Model',
      declineCaption: 'Cancel',
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
      deleteModel,
    };
  };
  const _isLive = Flow.Dataflow.signal(false);
  Flow.Dataflow.act(_isLive, isLive => {
    if (isLive) {
      return _refresh();
    }
  });
  function _refresh() {
    refresh((error, model) => {
      if (!error) {
        _output(createOutput(model));
        if (_isLive()) {
          return lodash.delay(_refresh, 2000);
        }
      }
    });
  }
  const _toggleRefresh = () => _isLive(!_isLive());
  _output(createOutput(_model));
  lodash.defer(_go);
  return {
    output: _output,
    toggleRefresh: _toggleRefresh,
    isLive: _isLive,
    template: 'flow-model-output',
  };
}


export function h2oInspectsOutput(_, _go, _tables) {
  var lodash = window._;
  var Flow = window.Flow;
  var createTableView;
  createTableView = function (table) {
    var grid;
    var inspect;
    var plot;
    inspect = function () {
      return _.insertAndExecuteCell('cs', `inspect ${Flow.Prelude.stringify(table.label)}, ${table.metadata.origin}`);
    };
    grid = function () {
      return _.insertAndExecuteCell('cs', `grid inspect ${Flow.Prelude.stringify(table.label)}, ${table.metadata.origin}`);
    };
    plot = function () {
      return _.insertAndExecuteCell('cs', table.metadata.plot);
    };
    return {
      label: table.label,
      description: table.metadata.description,
      inspect,
      grid,
      canPlot: table.metadata.plot,
      plot
    };
  };
  lodash.defer(_go);
  return {
    hasTables: _tables.length > 0,
    tables: lodash.map(_tables, createTableView),
    template: 'flow-inspects-output'
  };
};
  
import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oInspectsOutput(_, _go, _tables) {
  const lodash = window._;
  const Flow = window.Flow;
  let createTableView;
  createTableView = table => {
    let grid;
    let inspect;
    let plot;
    inspect = () => _.insertAndExecuteCell('cs', `inspect ${flowPrelude.stringify(table.label)}, ${table.metadata.origin}`);
    grid = () => _.insertAndExecuteCell('cs', `grid inspect ${flowPrelude.stringify(table.label)}, ${table.metadata.origin}`);
    plot = () => _.insertAndExecuteCell('cs', table.metadata.plot);
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
}


import renderPlot from './renderPlot';

export default function renderTables(_) {
  let tableName;
  let output;
  let table;
  const tableNames = _.ls(_.model);
  console.log('tableNames from renderTables', tableNames);
  for (let i = 0; i < tableNames.length; i++) {
    tableName = tableNames[i];
    if (!(tableName !== 'parameters')) {
      continue;
    }
    // Skip confusion matrix tables for multinomial models
    let output;
    if (_.model !== 'undefined') {
      if (_.model.output !== 'undefined') {
        if (_.model.output.model_category === 'Multinomial') {
          output = true;
        }
      }
    }
    if (output) {
      if (tableName.indexOf('output - training_metrics - cm') === 0) {
        continue;
      } else if (tableName.indexOf('output - validation_metrics - cm') === 0) {
        continue;
      } else if (tableName.indexOf('output - cross_validation_metrics - cm') === 0) {
        continue;
      }
    }
    table = _.inspect(tableName, _.model);
    if (typeof table !== 'undefined') {
      const plotTitle = tableName + (table.metadata.description ? ` (${table.metadata.description})` : '');
      const gFunction = g => g(
        table.indices.length > 1 ? g.select() : g.select(0),
        g.from(table)
      );
      const plotFunction = _.plot(gFunction);
      renderPlot(
        _,
        plotTitle,
        true,
        plotFunction
      );
    }
  }
}

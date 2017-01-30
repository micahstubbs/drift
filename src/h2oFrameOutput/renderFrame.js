import renderPlot from './renderPlot';
import renderGrid from './renderGrid';

export default function renderFrame(_) {
  const gridPlotFunction = _.plot(
        g => g(
          g.select(),
          g.from(
            _.inspect('columns', _.frame)
          )
        )
      );
  renderGrid(_, gridPlotFunction);

  const chunkSummaryPlotFunction = _.plot(
    g => g(
      g.select(),
      g.from(
        _.inspect('Chunk compression summary', _.frame)
      )
    )
  );
  renderPlot(_.chunkSummary, chunkSummaryPlotFunction);

  const distributionSummaryPlotFunction = _.plot(
    g => g(
      g.select(),
      g.from(
        _.inspect('Frame distribution summary', _.frame)
      )
    )
  );
  renderPlot(_.distributionSummary, distributionSummaryPlotFunction);
}

import renderPlot from './renderPlot';
import renderGrid from './renderGrid';

export default function renderFrame(_, _chunkSummary, _distributionSummary, frame) {
  renderGrid(_, _.plot(g => g(g.select(), g.from(_.inspect('columns', frame)))));
  renderPlot(_chunkSummary, _.plot(g => g(g.select(), g.from(_.inspect('Chunk compression summary', frame)))));
  return renderPlot(_distributionSummary, _.plot(g => g(g.select(), g.from(_.inspect('Frame distribution summary', frame)))));
}

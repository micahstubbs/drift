import { flowApplicationContext } from './flowApplicationContext';
import { flowSandbox } from './flowSandbox';
import { flowAnalytics } from './flowAnalytics';
import { flowGrowl } from './flowGrowl';
import { flowAutosave } from './flowAutosave';
import { flowRenderers } from './notebook/flowRenderers';

export function flowApplication(_, routines) {
  const Flow = window.Flow;
  flowApplicationContext(_);
  const _sandbox = flowSandbox(_, routines(_));
  // TODO support external renderers
  _.renderers = flowRenderers(_, _sandbox);
  console.log('_.renderers from flowApplication', _.renderers);
  flowAnalytics(_);
  flowGrowl(_);
  flowAutosave(_);
  const _notebook = Flow.notebook(_);
  return {
    context: _,
    sandbox: _sandbox,
    view: _notebook,
  };
}


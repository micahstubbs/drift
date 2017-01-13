import { flowApplicationContext } from './flowApplicationContext';
import { flowSandbox } from './flowSandbox';
import { flowAnalytics } from './flowAnalytics';
import { flowGrowl } from './flowGrowl';
import { flowAutosave } from './flowAutosave';
import { h2oRoutines } from './routines/h2oRoutines';

export function flowApplication(_) {
  const Flow = window.Flow;
  flowApplicationContext(_);
  const _sandbox = flowSandbox(_, h2oRoutines(_));
  // TODO support external renderers
  const _renderers = Flow.renderers(_, _sandbox);
  console.log('_renderers from flowApplication', _renderers);
  flowAnalytics(_);
  flowGrowl(_);
  flowAutosave(_);
  const _notebook = Flow.notebook(_, _renderers);
  return {
    context: _,
    sandbox: _sandbox,
    view: _notebook,
  };
}


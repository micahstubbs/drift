import { flowApplicationContext } from './flowApplicationContext';
import { flowSandbox } from './flowSandbox';
import { flowAnalytics } from './flowAnalytics';
import { flowGrowl } from './flowGrowl';
import { flowAutosave } from './flowAutosave';

export function flowApplication(_, routines) {
  const Flow = window.Flow;
  let _notebook;
  let _renderers;
  let _sandbox;
  flowApplicationContext(_);
  _sandbox = flowSandbox(_, routines(_));
  _renderers = Flow.Renderers(_, _sandbox);
  flowAnalytics(_);
  flowGrowl(_);
  flowAutosave(_);
  _notebook = Flow.Notebook(_, _renderers);
  return {
    context: _,
    sandbox: _sandbox,
    view: _notebook
  };
}


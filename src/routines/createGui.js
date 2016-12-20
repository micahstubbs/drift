import { extendGuiForm } from './extendGuiForm';

export function createGui(controls, go) {
  const Flow = window.Flow;
  return go(null, extendGuiForm(Flow.Dataflow.signals(controls || []))); 
}
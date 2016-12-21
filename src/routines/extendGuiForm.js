import { render_ } from './render_';

export function extendGuiForm(_, form) {
  return render_(_, form, flowForm, form);
}

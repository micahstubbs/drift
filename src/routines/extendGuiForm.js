import { render_ } from './render_';

export function extendGuiForm(form) {
  return render_(_, form, flowForm, form);
}

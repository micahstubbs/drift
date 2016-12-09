import { flowConfirmDialog } from '../flowConfirmDialog';
import { flowAlertDialog } from '../flowAlertDialog';

export function dialogs() {
  const Flow = window.Flow;
  const __slice = [].slice;
  Flow.Dialogs = _ => {
    let showDialog;
    let _dialog;
    _dialog = Flow.Dataflow.signal(null);
    showDialog = (ctor, args, _go) => {
      let $dialog;
      let dialog;
      let go;
      let responded;
      responded = false;
      go = response => {
        if (!responded) {
          responded = true;
          $dialog.modal('hide');
          if (_go) {
            return _go(response);
          }
        }
      };
      _dialog(dialog = ctor(...[_].concat(args).concat(go)));
      $dialog = $(`#${dialog.template}`);
      $dialog.modal();
      $dialog.on('hidden.bs.modal', e => {
        if (!responded) {
          responded = true;
          _dialog(null);
          if (_go) {
            return _go(null);
          }
        }
      });
    };
    Flow.Dataflow.link(_.dialog, function () {
      let args;
      let ctor;
      let go;
      let _i;
      ctor = arguments[0], args = arguments.length >= 3 ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), go = arguments[_i++];
      return showDialog(ctor, args, go);
    });
    Flow.Dataflow.link(_.confirm, (message, opts, go) => showDialog(flowConfirmDialog, [
      message,
      opts
    ], go));
    Flow.Dataflow.link(_.alert, (message, opts, go) => showDialog(flowAlertDialog, [
      message,
      opts
    ], go));
    return {
      dialog: _dialog,
      template(dialog) {
        return `flow-${dialog.template}`;
      }
    };
  };
}

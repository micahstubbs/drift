import { flowOutline } from './flowOutline';
import { flowBrowser } from './flowBrowser';

export function flowSidebar(_, cells) {
  var Flow = window.Flow;
  var switchToBrowser;
  var switchToClipboard;
  var switchToHelp;
  var switchToOutline;
  var _browser;
  var _clipboard;
  var _help;
  var _isBrowserMode;
  var _isClipboardMode;
  var _isHelpMode;
  var _isOutlineMode;
  var _mode;
  var _outline;
  _mode = Flow.Dataflow.signal('help');
  _outline = flowOutline(_, cells);
  _isOutlineMode = Flow.Dataflow.lift(_mode, mode => mode === 'outline');
  switchToOutline = () => _mode('outline');
  _browser = flowBrowser(_);
  _isBrowserMode = Flow.Dataflow.lift(_mode, mode => mode === 'browser');
  switchToBrowser = () => _mode('browser');
  _clipboard = Flow.Clipboard(_);
  _isClipboardMode = Flow.Dataflow.lift(_mode, mode => mode === 'clipboard');
  switchToClipboard = () => _mode('clipboard');
  _help = Flow.Help(_);
  _isHelpMode = Flow.Dataflow.lift(_mode, mode => mode === 'help');
  switchToHelp = () => _mode('help');
  Flow.Dataflow.link(_.ready, () => {
    Flow.Dataflow.link(_.showHelp, () => switchToHelp());
    Flow.Dataflow.link(_.showClipboard, () => switchToClipboard());
    Flow.Dataflow.link(_.showBrowser, () => switchToBrowser());
    return Flow.Dataflow.link(_.showOutline, () => switchToOutline());
  });
  return {
    outline: _outline,
    isOutlineMode: _isOutlineMode,
    switchToOutline,
    browser: _browser,
    isBrowserMode: _isBrowserMode,
    switchToBrowser,
    clipboard: _clipboard,
    isClipboardMode: _isClipboardMode,
    switchToClipboard,
    help: _help,
    isHelpMode: _isHelpMode,
    switchToHelp
  };
}


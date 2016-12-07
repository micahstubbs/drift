import { flowOutline } from './flowOutline'; 

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
  _isOutlineMode = Flow.Dataflow.lift(_mode, function (mode) {
    return mode === 'outline';
  });
  switchToOutline = function () {
    return _mode('outline');
  };
  _browser = Flow.Browser(_);
  _isBrowserMode = Flow.Dataflow.lift(_mode, function (mode) {
    return mode === 'browser';
  });
  switchToBrowser = function () {
    return _mode('browser');
  };
  _clipboard = Flow.Clipboard(_);
  _isClipboardMode = Flow.Dataflow.lift(_mode, function (mode) {
    return mode === 'clipboard';
  });
  switchToClipboard = function () {
    return _mode('clipboard');
  };
  _help = Flow.Help(_);
  _isHelpMode = Flow.Dataflow.lift(_mode, function (mode) {
    return mode === 'help';
  });
  switchToHelp = function () {
    return _mode('help');
  };
  Flow.Dataflow.link(_.ready, function () {
    Flow.Dataflow.link(_.showHelp, function () {
      return switchToHelp();
    });
    Flow.Dataflow.link(_.showClipboard, function () {
      return switchToClipboard();
    });
    Flow.Dataflow.link(_.showBrowser, function () {
      return switchToBrowser();
    });
    return Flow.Dataflow.link(_.showOutline, function () {
      return switchToOutline();
    });
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
};
  
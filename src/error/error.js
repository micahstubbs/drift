export function error() {
  var Flow = window.Flow;
  var FlowError;
  var __hasProp = {}.hasOwnProperty;

  var __extends = function (child, parent) {
    var key;
    for (key in parent) {
      if (__hasProp.call(parent, key)) {
        child[key] = parent[key];
      }
    }
    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  };

  FlowError = function (_super) {
    __extends(FlowError, _super);
    function FlowError(message, cause) {
      var error;
      var _ref;
      this.message = message;
      this.cause = cause;
      this.name = 'FlowError';
      if ((_ref = this.cause) != null ? _ref.stack : void 0) {
        this.stack = this.cause.stack;
      } else {
        error = new Error();
        if (error.stack) {
          this.stack = error.stack;
        } else {
          this.stack = printStackTrace();
        }
      }
    }
    return FlowError;
  }(Error);
  Flow.Error = FlowError;
}

import { h2oApplication } from '../h2oApplication'; 
import { flowApplication } from '../flowApplication';

export function flow() {
  var Flow = window.Flow;
  var checkSparklingWater;
  var getContextPath;
  getContextPath = function () {
    window.Flow.ContextPath = '/';
    return $.ajax({
      url: window.referrer,
      type: 'GET',
      success(data, status, xhr) {
        if (xhr.getAllResponseHeaders().indexOf('X-h2o-context-path') !== -1) {
          return window.Flow.ContextPath = xhr.getResponseHeader('X-h2o-context-path');
        }
      },
      async: false
    });
  };
  checkSparklingWater = function (context) {
    context.onSparklingWater = false;
    return $.ajax({
      url: `${window.Flow.ContextPath}3/Metadata/endpoints`,
      type: 'GET',
      dataType: 'json',
      success(response) {
        var route;
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = response.routes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          route = _ref[_i];
          if (route.url_pattern === '/3/scalaint') {
            _results.push(context.onSparklingWater = true);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      async: false
    });
  };
  if ((typeof window !== 'undefined' && window !== null ? window.$ : void 0) != null) {
    $(function () {
      var context;
      context = {};
      getContextPath();
      checkSparklingWater(context);
      window.flow = flowApplication(context, H2O.Routines);
      h2oApplication(context);
      ko.applyBindings(window.flow);
      context.ready();
      return context.initialized();
    });
  } 
}

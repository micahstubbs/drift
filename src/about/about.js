export function about() {
  var Flow = window.Flow;
  Flow.Version = '0.4.54';
  Flow.About = function (_) {
    var _properties;
    _properties = Flow.Dataflow.signals([]);
    Flow.Dataflow.link(_.ready, function () {
      if (Flow.BuildProperties) {
        return _properties(Flow.BuildProperties);
      }
      return _.requestAbout(function (error, response) {
        var name;
        var properties;
        var value;
        var _i;
        var _len;
        var _ref;
        var _ref1;
        properties = [];
        if (!error) {
          _ref = response.entries;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            _ref1 = _ref[_i], name = _ref1.name, value = _ref1.value;
            properties.push({
              caption: `H2O ${name}`,
              value
            });
          }
        }
        properties.push({
          caption: 'Flow version',
          value: Flow.Version
        });
        return _properties(Flow.BuildProperties = properties);
      });
    });
    return { properties: _properties };
  };
}

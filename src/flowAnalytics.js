export function flowAnalytics(_) {
  var lodash = window._;
  var Flow = window.Flow;
  Flow.Dataflow.link(_.trackEvent, function (category, action, label, value) {
    return lodash.defer(function () {
      return window.ga('send', 'event', category, action, label, value);
    });
  });
  return Flow.Dataflow.link(_.trackException, function (description) {
    return lodash.defer(function () {
      _.requestEcho(`FLOW: ${description}`, function () {
      });
      return window.ga('send', 'exception', {
        exDescription: description,
        exFatal: false,
        appName: 'Flow',
        appVersion: Flow.Version
      });
    });
  });
};
  
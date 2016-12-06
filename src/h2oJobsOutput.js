export function h2oJobsOutput(_, _go, jobs) {
  var lodash = window._;
  var Flow = window.Flow;
  var createJobView;
  var initialize;
  var refresh;
  var toggleRefresh;
  var _exception;
  var _hasJobViews;
  var _isBusy;
  var _isLive;
  var _jobViews;
  _jobViews = Flow.Dataflow.signals([]);
  _hasJobViews = Flow.Dataflow.lift(_jobViews, function (jobViews) {
    return jobViews.length > 0;
  });
  _isLive = Flow.Dataflow.signal(false);
  _isBusy = Flow.Dataflow.signal(false);
  _exception = Flow.Dataflow.signal(null);
  createJobView = function (job) {
    var type;
    var view;
    view = function () {
      return _.insertAndExecuteCell('cs', `getJob ${Flow.Prelude.stringify(job.key.name)}`);
    };
    type = function () {
      switch (job.dest.type) {
        case 'Key<Frame>':
          return 'Frame';
        case 'Key<Model>':
          return 'Model';
        case 'Key<Grid>':
          return 'Grid';
        case 'Key<PartialDependence>':
          return 'PartialDependence';
        default:
          return 'Unknown';
      }
    }();
    return {
      destination: job.dest.name,
      type,
      description: job.description,
      startTime: Flow.Format.Time(new Date(job.start_time)),
      endTime: Flow.Format.Time(new Date(job.start_time + job.msec)),
      elapsedTime: Flow.Util.formatMilliseconds(job.msec),
      status: job.status,
      view
    };
  };
  toggleRefresh = function () {
    return _isLive(!_isLive());
  };
  refresh = function () {
    _isBusy(true);
    return _.requestJobs(function (error, jobs) {
      _isBusy(false);
      if (error) {
        _exception(Flow.Failure(_, new Flow.Error('Error fetching jobs', error)));
        return _isLive(false);
      }
      _jobViews(lodash.map(jobs, createJobView));
      if (_isLive()) {
        return lodash.delay(refresh, 2000);
      }
    });
  };
  Flow.Dataflow.act(_isLive, function (isLive) {
    if (isLive) {
      return refresh();
    }
  });
  initialize = function () {
    _jobViews(lodash.map(jobs, createJobView));
    return lodash.defer(_go);
  };
  initialize();
  return {
    jobViews: _jobViews,
    hasJobViews: _hasJobViews,
    isLive: _isLive,
    isBusy: _isBusy,
    toggleRefresh,
    refresh,
    exception: _exception,
    template: 'flow-jobs-output'
  };
};
  
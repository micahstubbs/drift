import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oJobsOutput(_, _go, jobs) {
  const lodash = window._;
  const Flow = window.Flow;
  let createJobView;
  let initialize;
  let refresh;
  let toggleRefresh;
  let _exception;
  let _hasJobViews;
  let _isBusy;
  let _isLive;
  let _jobViews;
  _jobViews = Flow.Dataflow.signals([]);
  _hasJobViews = Flow.Dataflow.lift(_jobViews, jobViews => jobViews.length > 0);
  _isLive = Flow.Dataflow.signal(false);
  _isBusy = Flow.Dataflow.signal(false);
  _exception = Flow.Dataflow.signal(null);
  createJobView = job => {
    let type;
    let view;
    view = () => _.insertAndExecuteCell('cs', `getJob ${flowPrelude.stringify(job.key.name)}`);
    type = (() => {
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
    })();
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
  toggleRefresh = () => _isLive(!_isLive());
  refresh = () => {
    _isBusy(true);
    return _.requestJobs((error, jobs) => {
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
  Flow.Dataflow.act(_isLive, isLive => {
    if (isLive) {
      return refresh();
    }
  });
  initialize = () => {
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
}


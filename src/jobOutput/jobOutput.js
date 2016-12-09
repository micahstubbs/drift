import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function jobOutput() {
  var lodash = window._;
  var Flow = window.Flow;
  var getJobOutputStatusColor;
  var getJobProgressPercent;
  var jobOutputStatusColors;
  jobOutputStatusColors = {
    failed: '#d9534f',
    done: '#ccc',
    running: '#f0ad4e'
  };
  getJobOutputStatusColor = status => {
    switch (status) {
      case 'DONE':
        return jobOutputStatusColors.done;
      case 'CREATED':
      case 'RUNNING':
        return jobOutputStatusColors.running;
      default:
        return jobOutputStatusColors.failed;
    }
  };
  getJobProgressPercent = progress => `${Math.ceil(100 * progress)}%`;
  H2O.JobOutput = (_, _go, _job) => {
    var canView;
    var cancel;
    var initialize;
    var isJobRunning;
    var messageIcons;
    var refresh;
    var updateJob;
    var view;
    var _canCancel;
    var _canView;
    var _description;
    var _destinationKey;
    var _destinationType;
    var _exception;
    var _isBusy;
    var _isLive;
    var _key;
    var _messages;
    var _progress;
    var _progressMessage;
    var _remainingTime;
    var _runTime;
    var _status;
    var _statusColor;
    _isBusy = Flow.Dataflow.signal(false);
    _isLive = Flow.Dataflow.signal(false);
    _key = _job.key.name;
    _description = _job.description;
    _destinationKey = _job.dest.name;
    _destinationType = (() => {
      switch (_job.dest.type) {
        case 'Key<Frame>':
          return 'Frame';
        case 'Key<Model>':
          return 'Model';
        case 'Key<Grid>':
          return 'Grid';
        case 'Key<PartialDependence>':
          return 'PartialDependence';
        case 'Key<AutoML>':
          return 'Auto Model';
        case 'Key<KeyedVoid>':
          return 'Void';
        default:
          return 'Unknown';
      }
    })();
    _runTime = Flow.Dataflow.signal(null);
    _remainingTime = Flow.Dataflow.signal(null);
    _progress = Flow.Dataflow.signal(null);
    _progressMessage = Flow.Dataflow.signal(null);
    _status = Flow.Dataflow.signal(null);
    _statusColor = Flow.Dataflow.signal(null);
    _exception = Flow.Dataflow.signal(null);
    _messages = Flow.Dataflow.signal(null);
    _canView = Flow.Dataflow.signal(false);
    _canCancel = Flow.Dataflow.signal(false);
    isJobRunning = job => job.status === 'CREATED' || job.status === 'RUNNING';
    messageIcons = {
      ERROR: 'fa-times-circle red',
      WARN: 'fa-warning orange',
      INFO: 'fa-info-circle'
    };
    canView = job => {
      switch (_destinationType) {
        case 'Model':
        case 'Grid':
          return job.ready_for_view;
        default:
          return !isJobRunning(job);
      }
    };
    updateJob = job => {
      var cause;
      var message;
      var messages;
      _runTime(Flow.Util.formatMilliseconds(job.msec));
      _progress(getJobProgressPercent(job.progress));
      _remainingTime(job.progress ? Flow.Util.formatMilliseconds(Math.round((1 - job.progress) * job.msec / job.progress)) : 'Estimating...');
      _progressMessage(job.progress_msg);
      _status(job.status);
      _statusColor(getJobOutputStatusColor(job.status));
      if (job.error_count) {
        messages = (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = job.messages;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            message = _ref[_i];
            if (message.message_type !== 'HIDE') {
              _results.push({
                icon: messageIcons[message.message_type],
                message: `${message.field_name}: ${message.message}`
              });
            }
          }
          return _results;
        })();
        _messages(messages);
      } else if (job.exception) {
        cause = new Error(job.exception);
        if (job.stacktrace) {
          cause.stack = job.stacktrace;
        }
        _exception(Flow.Failure(_, new Flow.Error('Job failure.', cause)));
      }
      _canView(canView(job));
      return _canCancel(isJobRunning(job));
    };
    refresh = () => {
      _isBusy(true);
      return _.requestJob(_key, (error, job) => {
        _isBusy(false);
        if (error) {
          _exception(Flow.Failure(_, new Flow.Error('Error fetching jobs', error)));
          return _isLive(false);
        }
        updateJob(job);
        if (isJobRunning(job)) {
          if (_isLive()) {
            return lodash.delay(refresh, 1000);
          }
        } else {
          _isLive(false);
          if (_go) {
            return lodash.defer(_go);
          }
        }
      });
    };
    Flow.Dataflow.act(_isLive, isLive => {
      if (isLive) {
        return refresh();
      }
    });
    view = () => {
      if (!_canView()) {
        return;
      }
      switch (_destinationType) {
        case 'Frame':
          return _.insertAndExecuteCell('cs', `getFrameSummary ${flowPrelude.stringify(_destinationKey)}`);
        case 'Model':
          return _.insertAndExecuteCell('cs', `getModel ${flowPrelude.stringify(_destinationKey)}`);
        case 'Grid':
          return _.insertAndExecuteCell('cs', `getGrid ${flowPrelude.stringify(_destinationKey)}`);
        case 'PartialDependence':
          return _.insertAndExecuteCell('cs', `getPartialDependence ${flowPrelude.stringify(_destinationKey)}`);
        case 'Auto Model':
          return _.insertAndExecuteCell('cs', 'getGrids');
        case 'Void':
          return alert(`This frame was exported to\n${_job.dest.name}`);
      }
    };
    cancel = () => _.requestCancelJob(_key, (error, result) => {
      if (error) {
        return console.debug(error);
      }
      return updateJob(_job);
    });
    initialize = job => {
      updateJob(job);
      if (isJobRunning(job)) {
        return _isLive(true);
      }
      if (_go) {
        return lodash.defer(_go);
      }
    };
    initialize(_job);
    return {
      key: _key,
      description: _description,
      destinationKey: _destinationKey,
      destinationType: _destinationType,
      runTime: _runTime,
      remainingTime: _remainingTime,
      progress: _progress,
      progressMessage: _progressMessage,
      status: _status,
      statusColor: _statusColor,
      messages: _messages,
      exception: _exception,
      isLive: _isLive,
      canView: _canView,
      canCancel: _canCancel,
      cancel,
      view,
      template: 'flow-job-output'
    };
  };
}

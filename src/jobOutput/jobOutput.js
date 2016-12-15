import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function jobOutput() {
  const lodash = window._;
  const Flow = window.Flow;
  const H2O = window.H2O;
  const jobOutputStatusColors = {
    failed: '#d9534f',
    done: '#ccc',
    running: '#f0ad4e',
  };
  const getJobOutputStatusColor = status => {
    // CREATED   Job was created
    // RUNNING   Job is running
    // CANCELLED Job was cancelled by user
    // FAILED    Job crashed, error message/exception is available
    // DONE      Job was successfully finished
    switch (status) {
      case 'DONE':
        return jobOutputStatusColors.done;
      case 'CREATED':
      case 'RUNNING':
        return jobOutputStatusColors.running;
      default:
        // 'CANCELLED', 'FAILED'
        return jobOutputStatusColors.failed;
    }
  };
  const getJobProgressPercent = progress => `${Math.ceil(100 * progress)}%`;
  H2O.JobOutput = (_, _go, _job) => {
    const _isBusy = Flow.Dataflow.signal(false);
    const _isLive = Flow.Dataflow.signal(false);
    const _key = _job.key.name;
    const _description = _job.description;
    const _destinationKey = _job.dest.name;
    const _destinationType = (() => {
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
    const _runTime = Flow.Dataflow.signal(null);
    const _remainingTime = Flow.Dataflow.signal(null);
    const _progress = Flow.Dataflow.signal(null);
    const _progressMessage = Flow.Dataflow.signal(null);
    const _status = Flow.Dataflow.signal(null);
    const _statusColor = Flow.Dataflow.signal(null);
    const _exception = Flow.Dataflow.signal(null);
    const _messages = Flow.Dataflow.signal(null);
    const _canView = Flow.Dataflow.signal(false);
    const _canCancel = Flow.Dataflow.signal(false);
    const isJobRunning = job => job.status === 'CREATED' || job.status === 'RUNNING';
    const messageIcons = {
      ERROR: 'fa-times-circle red',
      WARN: 'fa-warning orange',
      INFO: 'fa-info-circle',
    };
    const canView = job => {
      switch (_destinationType) {
        case 'Model':
        case 'Grid':
          return job.ready_for_view;
        default:
          return !isJobRunning(job);
      }
    };
    const updateJob = job => {
      let cause;
      let message;
      let messages;
      _runTime(Flow.Util.formatMilliseconds(job.msec));
      _progress(getJobProgressPercent(job.progress));
      _remainingTime(job.progress ? Flow.Util.formatMilliseconds(Math.round((1 - job.progress) * job.msec / job.progress)) : 'Estimating...');
      _progressMessage(job.progress_msg);
      _status(job.status);
      _statusColor(getJobOutputStatusColor(job.status));
      if (job.error_count) {
        messages = (() => {
          let _i;
          let _len;
          const _ref = job.messages;
          const _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            message = _ref[_i];
            if (message.message_type !== 'HIDE') {
              _results.push({
                icon: messageIcons[message.message_type],
                message: `${message.field_name}: ${message.message}`,
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
        _exception(Flow.failure(_, new Flow.Error('Job failure.', cause)));
      }
      _canView(canView(job));
      return _canCancel(isJobRunning(job));
    };
    const refresh = () => {
      _isBusy(true);
      return _.requestJob(_key, (error, job) => {
        _isBusy(false);
        if (error) {
          _exception(Flow.failure(_, new Flow.Error('Error fetching jobs', error)));
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
    const view = () => {
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
          // FIXME getGrid() for AutoML is hosed; resort to getGrids() for now.
          return _.insertAndExecuteCell('cs', 'getGrids');
        case 'Void':
          return alert(`This frame was exported to\n${_job.dest.name}`);
        default:
          // do nothing
      }
    };
    const cancel = () => _.requestCancelJob(_key, (error, result) => {
      if (error) {
        return console.debug(error);
      }
      return updateJob(_job);
    });
    const initialize = job => {
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
      template: 'flow-job-output',
    };
  };
}

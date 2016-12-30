import { optsToString } from './optsToString';
import { trackPath } from './trackPath';

export function http(_, method, path, opts, go) {
  const Flow = window.Flow;
  const $ = window.jQuery;
  if (path.substring(0, 1) === '/') {
    path = window.Flow.ContextPath + path.substring(1);
  }
  _.status('server', 'request', path);
  trackPath(_, path);
  const req = (() => {
    switch (method) {
      case 'GET':
        return $.getJSON(path);
      case 'POST':
        return $.post(path, opts);
      case 'POSTJSON':
        return $.ajax({
          url: path,
          type: 'POST',
          contentType: 'application/json',
          cache: false,
          data: JSON.stringify(opts),
        });
      case 'PUT':
        return $.ajax({
          url: path,
          type: method,
          data: opts,
        });
      case 'DELETE':
        return $.ajax({
          url: path,
          type: method,
        });
      case 'UPLOAD':
        return $.ajax({
          url: path,
          type: 'POST',
          data: opts,
          cache: false,
          contentType: false,
          processData: false,
        });
      default:
        // do nothing
    }
  })();
  req.done((data, status, xhr) => {
    let error;
    _.status('server', 'response', path);
    try {
      return go(null, data);
    } catch (_error) {
      error = _error;
      return go(new Flow.Error(`Error processing ${method} ${path}`, error));
    }
  });
  return req.fail((xhr, status, error) => {
    let serverError;
    _.status('server', 'error', path);
    const response = xhr.responseJSON;
    const meta = response;
    // special-case net::ERR_CONNECTION_REFUSED
    // if status is 'error' and xhr.status is 0
    const cause = (meta != null ? response.__meta : void 0) && (meta.schema_type === 'H2OError' || meta.schema_type === 'H2OModelBuilderError') ? (serverError = new Flow.Error(response.exception_msg), serverError.stack = `${response.dev_msg} (${response.exception_type})\n  ${response.stacktrace.join('\n  ')}`, serverError) : (error != null ? error.message : void 0) ? new Flow.Error(error.message) : status === 'error' && xhr.status === 0 ? new Flow.Error('Could not connect to H2O. Your H2O cloud is currently unresponsive.') : new Flow.Error(`HTTP connection failure: status=${status}, code=${xhr.status}, error=${(error || '?')}`);
    return go(new Flow.Error(`Error calling ${method} ${path}${optsToString(opts)}`, cause));
  });
}

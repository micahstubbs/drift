import { isJobRunning } from './isJobRunning';

export function canView(job, _destinationType) {
  switch (_destinationType) {
    case 'Model':
    case 'Grid':
      return job.ready_for_view;
    default:
      return !isJobRunning(job);
  }
}

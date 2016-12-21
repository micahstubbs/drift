import { render_ } from './render_';

export function extendJob(_, job) {
  const H2O = window.H2O;
  return render_(_,  job, H2O.JobOutput, job);
}

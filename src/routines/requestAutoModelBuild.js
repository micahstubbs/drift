import { extendJob } from './extendJob';

export function requestAutoModelBuild(_, opts, go) {
  const params = {
    input_spec: {
      training_frame: opts.frame,
      response_column: opts.column,
    },
    build_control: { stopping_criteria: { max_runtime_secs: opts.maxRunTime } },
  };
  return _.requestAutoModelBuild(params, (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, extendJob(_, result.job));
  });
}

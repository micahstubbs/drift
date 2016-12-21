import { inspect_ } from './inspect_';
import { inspectNetworkTestResult } from './inspectNetworkTestResult';
import { render_ } from './render_';

import { h2oNetworkTestOutput } from '../h2oNetworkTestOutput';

export function extendNetworkTest(testResult) {
  inspect_(testResult, { result: inspectNetworkTestResult(testResult) });
  return render_(_,  testResult, h2oNetworkTestOutput, testResult);
};

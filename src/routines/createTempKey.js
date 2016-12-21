export function createTempKey() {
  const Flow = window.Flow;
  return `flow_${Flow.Util.uuid().replace(/\-/g, '')}`;
}

export default function evaluate(_, output, ft) {
  console.log('arguments from flowCoffeescript evaluate', arguments);
  const Flow = window.Flow;
  if (ft != null ? ft.isFuture : void 0) {
    return ft((error, result) => {
      console.log('error from flowCoffeescript render evaluate', error);
      console.log('result from flowCoffeescript render evaluate', result);
      const _ref = result._flow_;
      if (error) {
        output.error(new Flow.Error('Error evaluating cell', error));
        return output.end();
      }
      if (result != null ? _ref != null ? _ref.render : void 0 : void 0) {
        return output.data(result._flow_.render(() => output.end()));
      }
      return output.data(Flow.objectBrowser(_, (() => output.end())('output', result)));
    });
  }
  return output.data(Flow.objectBrowser(_, () => output.end(), 'output', ft));
}

export function flowMarkdown(_) {
  var render;
  render = (input, output) => {
    var error;
    try {
      return output.data({
        html: marked(input.trim() || '(No content)'),
        template: 'flow-html'
      });
    } catch (_error) {
      error = _error;
      return output.error(error);
    } finally {
      output.end();
    }
  };
  render.isCode = false;
  return render;
}


export function flowHeading(_, level) {
  var render;
  render = function (input, output) {
    output.data({
      text: input.trim() || '(Untitled)',
      template: `flow-${level}`
    });
    return output.end();
  };
  render.isCode = false;
  return render;
};

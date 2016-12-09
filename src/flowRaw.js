export function flowRaw(_) {
  var render;
  render = function (input, output) {
    output.data({
      text: input,
      template: 'flow-raw'
    });
    return output.end();
  };
  render.isCode = false;
  return render;
}


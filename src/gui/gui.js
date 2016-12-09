export function gui() {
  const lodash = window._;
  const Flow = window.Flow;
  let button;
  let checkbox;
  let content;
  let control;
  let dropdown;
  let html;
  let listbox;
  let markdown;
  let text;
  let textarea;
  let textbox;
  let wrapArray;
  let wrapValue;
  wrapValue = (value, init) => {
    if (value === void 0) {
      return Flow.Dataflow.signal(init);
    }
    if (Flow.Dataflow.isSignal(value)) {
      return value;
    }
    return Flow.Dataflow.signal(value);
  };
  wrapArray = elements => {
    let element;
    if (elements) {
      if (Flow.Dataflow.isSignal(elements)) {
        element = elements();
        if (lodash.isArray(element)) {
          return elements;
        }
        return Flow.Dataflow.signal([element]);
      }
      return Flow.Dataflow.signals(lodash.isArray(elements) ? elements : [elements]);
    }
    return Flow.Dataflow.signals([]);
  };
  control = (type, opts) => {
    let guid;
    if (!opts) {
      opts = {};
    }
    guid = `gui_${lodash.uniqueId()}`;
    return {
      type,
      id: opts.id || guid,
      label: Flow.Dataflow.signal(opts.label || ' '),
      description: Flow.Dataflow.signal(opts.description || ' '),
      visible: Flow.Dataflow.signal(opts.visible !== false),
      disable: Flow.Dataflow.signal(opts.disable === true),
      template: `flow-form-${type}`,
      templateOf(control) {
        return control.template;
      }
    };
  };
  content = (type, opts) => {
    let self;
    self = control(type, opts);
    self.value = wrapValue(opts.value, '');
    return self;
  };
  text = opts => content('text', opts);
  html = opts => content('html', opts);
  markdown = opts => content('markdown', opts);
  checkbox = opts => {
    let self;
    self = control('checkbox', opts);
    self.value = wrapValue(opts.value, opts.value);
    return self;
  };
  dropdown = opts => {
    let self;
    self = control('dropdown', opts);
    self.options = opts.options || [];
    self.value = wrapValue(opts.value);
    self.caption = opts.caption || 'Choose...';
    return self;
  };
  listbox = opts => {
    let self;
    self = control('listbox', opts);
    self.options = opts.options || [];
    self.values = wrapArray(opts.values);
    return self;
  };
  textbox = opts => {
    let self;
    self = control('textbox', opts);
    self.value = wrapValue(opts.value, '');
    self.event = lodash.isString(opts.event) ? opts.event : null;
    return self;
  };
  textarea = opts => {
    let self;
    self = control('textarea', opts);
    self.value = wrapValue(opts.value, '');
    self.event = lodash.isString(opts.event) ? opts.event : null;
    self.rows = lodash.isNumber(opts.rows) ? opts.rows : 5;
    return self;
  };
  button = opts => {
    let self;
    self = control('button', opts);
    self.click = lodash.isFunction(opts.click) ? opts.click : lodash.noop;
    return self;
  };
  Flow.Gui = {
    text,
    html,
    markdown,
    checkbox,
    dropdown,
    listbox,
    textbox,
    textarea,
    button
  };
}

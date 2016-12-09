export function gui() {
  var lodash = window._;
  var Flow = window.Flow;
  var button;
  var checkbox;
  var content;
  var control;
  var dropdown;
  var html;
  var listbox;
  var markdown;
  var text;
  var textarea;
  var textbox;
  var wrapArray;
  var wrapValue;
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
    var element;
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
    var guid;
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
    var self;
    self = control(type, opts);
    self.value = wrapValue(opts.value, '');
    return self;
  };
  text = opts => content('text', opts);
  html = opts => content('html', opts);
  markdown = opts => content('markdown', opts);
  checkbox = opts => {
    var self;
    self = control('checkbox', opts);
    self.value = wrapValue(opts.value, opts.value);
    return self;
  };
  dropdown = opts => {
    var self;
    self = control('dropdown', opts);
    self.options = opts.options || [];
    self.value = wrapValue(opts.value);
    self.caption = opts.caption || 'Choose...';
    return self;
  };
  listbox = opts => {
    var self;
    self = control('listbox', opts);
    self.options = opts.options || [];
    self.values = wrapArray(opts.values);
    return self;
  };
  textbox = opts => {
    var self;
    self = control('textbox', opts);
    self.value = wrapValue(opts.value, '');
    self.event = lodash.isString(opts.event) ? opts.event : null;
    return self;
  };
  textarea = opts => {
    var self;
    self = control('textarea', opts);
    self.value = wrapValue(opts.value, '');
    self.event = lodash.isString(opts.event) ? opts.event : null;
    self.rows = lodash.isNumber(opts.rows) ? opts.rows : 5;
    return self;
  };
  button = opts => {
    var self;
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

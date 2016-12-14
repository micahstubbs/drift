export function knockout() {
  const lodash = window._;
  const $ = window.jQuery;
  const CodeMirror = window.CodeMirror;
  const ko = window.ko;
  const marked = window.marked;
  if ((typeof window !== 'undefined' && window !== null ? window.ko : void 0) == null) {
    return;
  }
  ko.bindingHandlers.raw = {
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $element;
      const arg = ko.unwrap(valueAccessor());
      if (arg) {
        $element = $(element);
        $element.empty();
        $element.append(arg);
      }
    },
  };
  ko.bindingHandlers.markdown = {
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let error;
      let html;
      const data = ko.unwrap(valueAccessor());
      try {
        html = marked(data || '');
      } catch (_error) {
        error = _error;
        html = error.message || 'Error rendering markdown.';
      }
      return $(element).html(html);
    },
  };
  ko.bindingHandlers.stringify = {
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      const data = ko.unwrap(valueAccessor());
      return $(element).text(JSON.stringify(data, null, 2));
    },
  };
  ko.bindingHandlers.enterKey = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $element;
      const action = ko.unwrap(valueAccessor());
      if (action) {
        if (lodash.isFunction(action)) {
          $element = $(element);
          $element.keydown(e => {
            if (e.which === 13) {
              action(viewModel);
            }
          });
        } else {
          throw 'Enter key action is not a function';
        }
      }
    },
  };
  ko.bindingHandlers.typeahead = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $element;
      const action = ko.unwrap(valueAccessor());
      if (action) {
        if (lodash.isFunction(action)) {
          $element = $(element);
          $element.typeahead(null, {
            displayKey: 'value',
            source: action,
          });
        } else {
          throw 'Typeahead action is not a function';
        }
      }
    },
  };
  ko.bindingHandlers.cursorPosition = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      const arg = ko.unwrap(valueAccessor());
      if (arg) {
        arg.getCursorPosition = () => $(element).textrange('get', 'position');
      }
    },
  };
  ko.bindingHandlers.autoResize = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $el;
      const arg = ko.unwrap(valueAccessor());
      let resize;
      if (arg) {
        arg.autoResize = resize = () => lodash.defer(() => $el.css('height', 'auto').height(element.scrollHeight));
        $el = $(element).on('input', resize);
        resize();
      }
    },
  };
  ko.bindingHandlers.scrollIntoView = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $el;
      let $viewport;
      const arg = ko.unwrap(valueAccessor());
      if (arg) {
        $el = $(element);
        $viewport = $el.closest('.flow-box-notebook');
        arg.scrollIntoView = immediate => {
          if (immediate == null) {
            immediate = false;
          }
          const position = $viewport.scrollTop();
          const top = $el.position().top + position;
          const height = $viewport.height();
          if (top - 20 < position || top + 20 > position + height) {
            if (immediate) {
              return $viewport.scrollTop(top);
            }
            return $viewport.animate({ scrollTop: top }, 'fast');
          }
        };
      }
    },
  };
  ko.bindingHandlers.collapse = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let isCollapsed;
      const caretDown = 'fa-caret-down';
      const caretRight = 'fa-caret-right';
      isCollapsed = ko.unwrap(valueAccessor());
      const caretEl = document.createElement('i');
      caretEl.className = 'fa';
      caretEl.style.marginRight = '3px';
      element.insertBefore(caretEl, element.firstChild);
      const $el = $(element);
      const $nextEl = $el.next();
      if (!$nextEl.length) {
        throw new Error('No collapsible sibling found');
      }
      const $caretEl = $(caretEl);
      const toggle = () => {
        if (isCollapsed) {
          $caretEl.removeClass(caretDown).addClass(caretRight);
          $nextEl.hide();
        } else {
          $caretEl.removeClass(caretRight).addClass(caretDown);
          $nextEl.show();
        }
        isCollapsed = !isCollapsed;
        return isCollapsed;
      };
      $el.css('cursor', 'pointer');
      $el.attr('title', 'Click to expand/collapse');
      $el.on('click', toggle);
      toggle();
      ko.utils.domNodeDisposal.addDisposeCallback(element, () => $el.off('click'));
    },
  };
  ko.bindingHandlers.dom = {
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $element;
      const arg = ko.unwrap(valueAccessor());
      if (arg) {
        $element = $(element);
        $element.empty();
        $element.append(arg);
      }
    },
  };
  ko.bindingHandlers.dump = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      const object = ko.unwrap(valueAccessor());
      return object;
    },
  };
  ko.bindingHandlers.element = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      return valueAccessor()(element);
    },
  };
  ko.bindingHandlers.file = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $file;
      const file = valueAccessor();
      if (file) {
        $file = $(element);
        $file.change(function () {
          return file(this.files[0]);
        });
      }
    },
  };
  ko.bindingHandlers.codemirror = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      const options = ko.unwrap(valueAccessor());
      const editor = CodeMirror.fromTextArea(element, options);
      editor.on('change', cm => allBindings().value(cm.getValue()));
      element.editor = editor;
      if (allBindings().value()) {
        editor.setValue(allBindings().value());
      }
      const internalTextArea = $(editor.getWrapperElement()).find('div textarea');
      internalTextArea.attr('rows', '1');
      internalTextArea.attr('spellcheck', 'false');
      internalTextArea.removeAttr('wrap');
      return editor.refresh();
    },
    update(element, valueAccessor) {
      if (element.editor) {
        return element.editor.refresh();
      }
    },
  };
}

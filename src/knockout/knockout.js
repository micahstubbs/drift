export function knockout() {
  const lodash = window._;
  if ((typeof window !== 'undefined' && window !== null ? window.ko : void 0) == null) {
    return;
  }
  ko.bindingHandlers.raw = {
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $element;
      let arg;
      arg = ko.unwrap(valueAccessor());
      if (arg) {
        $element = $(element);
        $element.empty();
        $element.append(arg);
      }
    }
  };
  ko.bindingHandlers.markdown = {
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let data;
      let error;
      let html;
      data = ko.unwrap(valueAccessor());
      try {
        html = marked(data || '');
      } catch (_error) {
        error = _error;
        html = error.message || 'Error rendering markdown.';
      }
      return $(element).html(html);
    }
  };
  ko.bindingHandlers.stringify = {
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let data;
      data = ko.unwrap(valueAccessor());
      return $(element).text(JSON.stringify(data, null, 2));
    }
  };
  ko.bindingHandlers.enterKey = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $element;
      let action;
      if (action = ko.unwrap(valueAccessor())) {
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
    }
  };
  ko.bindingHandlers.typeahead = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $element;
      let action;
      if (action = ko.unwrap(valueAccessor())) {
        if (lodash.isFunction(action)) {
          $element = $(element);
          $element.typeahead(null, {
            displayKey: 'value',
            source: action
          });
        } else {
          throw 'Typeahead action is not a function';
        }
      }
    }
  };
  ko.bindingHandlers.cursorPosition = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let arg;
      if (arg = ko.unwrap(valueAccessor())) {
        arg.getCursorPosition = () => $(element).textrange('get', 'position');
      }
    }
  };
  ko.bindingHandlers.autoResize = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $el;
      let arg;
      let resize;
      if (arg = ko.unwrap(valueAccessor())) {
        arg.autoResize = resize = () => lodash.defer(() => $el.css('height', 'auto').height(element.scrollHeight));
        $el = $(element).on('input', resize);
        resize();
      }
    }
  };
  ko.bindingHandlers.scrollIntoView = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $el;
      let $viewport;
      let arg;
      if (arg = ko.unwrap(valueAccessor())) {
        $el = $(element);
        $viewport = $el.closest('.flow-box-notebook');
        arg.scrollIntoView = immediate => {
          let height;
          let position;
          let top;
          if (immediate == null) {
            immediate = false;
          }
          position = $viewport.scrollTop();
          top = $el.position().top + position;
          height = $viewport.height();
          if (top - 20 < position || top + 20 > position + height) {
            if (immediate) {
              return $viewport.scrollTop(top);
            }
            return $viewport.animate({ scrollTop: top }, 'fast');
          }
        };
      }
    }
  };
  ko.bindingHandlers.collapse = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $caretEl;
      let $el;
      let $nextEl;
      let caretDown;
      let caretEl;
      let caretRight;
      let isCollapsed;
      let toggle;
      caretDown = 'fa-caret-down';
      caretRight = 'fa-caret-right';
      isCollapsed = ko.unwrap(valueAccessor());
      caretEl = document.createElement('i');
      caretEl.className = 'fa';
      caretEl.style.marginRight = '3px';
      element.insertBefore(caretEl, element.firstChild);
      $el = $(element);
      $nextEl = $el.next();
      if (!$nextEl.length) {
        throw new Error('No collapsible sibling found');
      }
      $caretEl = $(caretEl);
      toggle = () => {
        if (isCollapsed) {
          $caretEl.removeClass(caretDown).addClass(caretRight);
          $nextEl.hide();
        } else {
          $caretEl.removeClass(caretRight).addClass(caretDown);
          $nextEl.show();
        }
        return isCollapsed = !isCollapsed;
      };
      $el.css('cursor', 'pointer');
      $el.attr('title', 'Click to expand/collapse');
      $el.on('click', toggle);
      toggle();
      ko.utils.domNodeDisposal.addDisposeCallback(element, () => $el.off('click'));
    }
  };
  ko.bindingHandlers.dom = {
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $element;
      let arg;
      arg = ko.unwrap(valueAccessor());
      if (arg) {
        $element = $(element);
        $element.empty();
        $element.append(arg);
      }
    }
  };
  ko.bindingHandlers.dump = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let object;
      return object = ko.unwrap(valueAccessor());
    }
  };
  ko.bindingHandlers.element = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      return valueAccessor()(element);
    }
  };
  ko.bindingHandlers.file = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let $file;
      let file;
      file = valueAccessor();
      if (file) {
        $file = $(element);
        $file.change(function () {
          return file(this.files[0]);
        });
      }
    }
  };
  ko.bindingHandlers.codemirror = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      let editor;
      let internalTextArea;
      let options;
      options = ko.unwrap(valueAccessor());
      editor = CodeMirror.fromTextArea(element, options);
      editor.on('change', cm => allBindings().value(cm.getValue()));
      element.editor = editor;
      if (allBindings().value()) {
        editor.setValue(allBindings().value());
      }
      internalTextArea = $(editor.getWrapperElement()).find('div textarea');
      internalTextArea.attr('rows', '1');
      internalTextArea.attr('spellcheck', 'false');
      internalTextArea.removeAttr('wrap');
      return editor.refresh();
    },
    update(element, valueAccessor) {
      if (element.editor) {
        return element.editor.refresh();
      }
    }
  };
}

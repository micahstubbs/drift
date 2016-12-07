export function knockout() {
  if ((typeof window !== 'undefined' && window !== null ? window.ko : void 0) == null) {
    return;
  }
  var lodash = window._;
  ko.bindingHandlers.raw = {
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var $element;
      var arg;
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
      var data;
      var error;
      var html;
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
      var data;
      data = ko.unwrap(valueAccessor());
      return $(element).text(JSON.stringify(data, null, 2));
    }
  };
  ko.bindingHandlers.enterKey = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var $element;
      var action;
      if (action = ko.unwrap(valueAccessor())) {
        if (lodash.isFunction(action)) {
          $element = $(element);
          $element.keydown(function (e) {
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
      var $element;
      var action;
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
      var arg;
      if (arg = ko.unwrap(valueAccessor())) {
        arg.getCursorPosition = function () {
          return $(element).textrange('get', 'position');
        };
      }
    }
  };
  ko.bindingHandlers.autoResize = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var $el;
      var arg;
      var resize;
      if (arg = ko.unwrap(valueAccessor())) {
        arg.autoResize = resize = function () {
          return lodash.defer(function () {
            return $el.css('height', 'auto').height(element.scrollHeight);
          });
        };
        $el = $(element).on('input', resize);
        resize();
      }
    }
  };
  ko.bindingHandlers.scrollIntoView = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var $el;
      var $viewport;
      var arg;
      if (arg = ko.unwrap(valueAccessor())) {
        $el = $(element);
        $viewport = $el.closest('.flow-box-notebook');
        arg.scrollIntoView = function (immediate) {
          var height;
          var position;
          var top;
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
      var $caretEl;
      var $el;
      var $nextEl;
      var caretDown;
      var caretEl;
      var caretRight;
      var isCollapsed;
      var toggle;
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
      toggle = function () {
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
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        return $el.off('click');
      });
    }
  };
  ko.bindingHandlers.dom = {
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var $element;
      var arg;
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
      var object;
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
      var $file;
      var file;
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
      var editor;
      var internalTextArea;
      var options;
      options = ko.unwrap(valueAccessor());
      editor = CodeMirror.fromTextArea(element, options);
      editor.on('change', function (cm) {
        return allBindings().value(cm.getValue());
      });
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

import { h2oImportModelOutput } from './h2oImportModelOutput';
import { h2oFrameDataOutput } from './h2oFrameDataOutput';
import { h2oDataFrameOutput } from './h2oDataFrameOutput';
import { h2oApplicationContext } from './h2oApplicationContext';

import { flowFileUploadDialog } from './flowFileUploadDialog';
import { flowFileOpenDialog } from './flowFileOpenDialog';
import { flowSandbox } from './flowSandbox';
import { flowGrowl } from './flowGrowl';
import { flowApplicationContext } from './flowApplicationContext';
import { flowAnalytics } from './flowAnalytics';
import { flowStatus } from './flowStatus';
import { flowSidebar } from './flowSidebar';
import { flowRaw } from './flowRaw';
import { flowHeading } from './flowHeading';
import { flowForm } from './flowForm';
import { flowCoffeescript } from './flowCoffeescript';
import { flowCell } from './flowCell';
import { flowAutosave } from './flowAutosave';

import { modelInput } from './modelInput/modelInput';
import { parseInput } from './parseInput/parseInput';
import { jobOutput } from './jobOutput/jobOutput';
import { imputeInput } from './imputeInput/imputeInput';
import { util } from './util/util';
import { routines } from './routines/routines';
import { coreUtils } from './coreUtils/coreUtils';
import { types } from './types/types';
import { localStorage } from './localStorage/localStorage';
import { knockout } from './knockout/knockout';
import { html } from './html/html';
import { format } from './format/format';
import { error } from './error/error';
import { dialogs } from './dialogs/dialogs';
import { dataflow } from './dataflow/dataflow';
import { data } from './data/data';
import { async } from './async/async';

// anonymous IIFE
(function () {
  var lodash = window._; window.Flow = {}; window.H2O = {}; (function () {
    var checkSparklingWater;
    var getContextPath;
    getContextPath = function () {
      window.Flow.ContextPath = '/';
      return $.ajax({
        url: window.referrer,
        type: 'GET',
        success(data, status, xhr) {
          if (xhr.getAllResponseHeaders().indexOf('X-h2o-context-path') !== -1) {
            return window.Flow.ContextPath = xhr.getResponseHeader('X-h2o-context-path');
          }
        },
        async: false
      });
    };
    checkSparklingWater = function (context) {
      context.onSparklingWater = false;
      return $.ajax({
        url: `${window.Flow.ContextPath}3/Metadata/endpoints`,
        type: 'GET',
        dataType: 'json',
        success(response) {
          var route;
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = response.routes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            route = _ref[_i];
            if (route.url_pattern === '/3/scalaint') {
              _results.push(context.onSparklingWater = true);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        },
        async: false
      });
    };
    if ((typeof window !== 'undefined' && window !== null ? window.$ : void 0) != null) {
      $(function () {
        var context;
        context = {};
        getContextPath();
        checkSparklingWater(context);
        window.flow = Flow.Application(context, H2O.Routines);
        H2O.Application(context);
        ko.applyBindings(window.flow);
        context.ready();
        return context.initialized();
      });
    }
  }.call(this));
  // anonymous IIFE
  (function () {
    Flow.Version = '0.4.54';
    Flow.About = function (_) {
      var _properties;
      _properties = Flow.Dataflow.signals([]);
      Flow.Dataflow.link(_.ready, function () {
        if (Flow.BuildProperties) {
          return _properties(Flow.BuildProperties);
        }
        return _.requestAbout(function (error, response) {
          var name;
          var properties;
          var value;
          var _i;
          var _len;
          var _ref;
          var _ref1;
          properties = [];
          if (!error) {
            _ref = response.entries;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              _ref1 = _ref[_i], name = _ref1.name, value = _ref1.value;
              properties.push({
                caption: `H2O ${name}`,
                value
              });
            }
          }
          properties.push({
            caption: 'Flow version',
            value: Flow.Version
          });
          return _properties(Flow.BuildProperties = properties);
        });
      });
      return { properties: _properties };
    };
  }.call(this));
  (function () {
    Flow.AlertDialog = function (_, _message, _opts, _go) {
      var accept;
      if (_opts == null) {
        _opts = {};
      }
      lodash.defaults(_opts, {
        title: 'Alert',
        acceptCaption: 'OK'
      });
      accept = function () {
        return _go(true);
      };
      return {
        title: _opts.title,
        acceptCaption: _opts.acceptCaption,
        message: Flow.Util.multilineTextToHTML(_message),
        accept,
        template: 'alert-dialog'
      };
    };
  }.call(this));
  // anonymous IIFE
  (function () {
    var SystemClips;
    SystemClips = [
      'assist',
      'importFiles',
      'getFrames',
      'getModels',
      'getPredictions',
      'getJobs',
      'buildModel',
      'predict'
    ];
    Flow.Clipboard = function (_) {
      var addClip;
      var createClip;
      var emptyTrash;
      var initialize;
      var lengthOf;
      var loadUserClips;
      var removeClip;
      var saveUserClips;
      var serializeUserClips;
      var _hasTrashClips;
      var _hasUserClips;
      var _systemClipCount;
      var _systemClips;
      var _trashClipCount;
      var _trashClips;
      var _userClipCount;
      var _userClips;
      lengthOf = function (array) {
        if (array.length) {
          return `(${array.length})`;
        }
        return '';
      };
      _systemClips = Flow.Dataflow.signals([]);
      _systemClipCount = Flow.Dataflow.lift(_systemClips, lengthOf);
      _userClips = Flow.Dataflow.signals([]);
      _userClipCount = Flow.Dataflow.lift(_userClips, lengthOf);
      _hasUserClips = Flow.Dataflow.lift(_userClips, function (clips) {
        return clips.length > 0;
      });
      _trashClips = Flow.Dataflow.signals([]);
      _trashClipCount = Flow.Dataflow.lift(_trashClips, lengthOf);
      _hasTrashClips = Flow.Dataflow.lift(_trashClips, function (clips) {
        return clips.length > 0;
      });
      createClip = function (_list, _type, _input, _canRemove) {
        var execute;
        var insert;
        var self;
        if (_canRemove == null) {
          _canRemove = true;
        }
        execute = function () {
          return _.insertAndExecuteCell(_type, _input);
        };
        insert = function () {
          return _.insertCell(_type, _input);
        };
        Flow.Prelude.remove = function () {
          if (_canRemove) {
            return removeClip(_list, self);
          }
        };
        return self = {
          type: _type,
          input: _input,
          execute,
          insert,
          remove: Flow.Prelude.remove,
          canRemove: _canRemove
        };
      };
      addClip = function (list, type, input) {
        return list.push(createClip(list, type, input));
      };
      removeClip = function (list, clip) {
        if (list === _userClips) {
          _userClips.remove(clip);
          saveUserClips();
          return _trashClips.push(createClip(_trashClips, clip.type, clip.input));
        }
        return _trashClips.remove(clip);
      };
      emptyTrash = function () {
        return _trashClips.removeAll();
      };
      loadUserClips = function () {
        return _.requestObjectExists('environment', 'clips', function (error, exists) {
          if (exists) {
            return _.requestObject('environment', 'clips', function (error, doc) {
              if (!error) {
                return _userClips(lodash.map(doc.clips, function (clip) {
                  return createClip(_userClips, clip.type, clip.input);
                }));
              }
            });
          }
        });
      };
      serializeUserClips = function () {
        return {
          version: '1.0.0',
          clips: lodash.map(_userClips(), function (clip) {
            return {
              type: clip.type,
              input: clip.input
            };
          })
        };
      };
      saveUserClips = function () {
        return _.requestPutObject('environment', 'clips', serializeUserClips(), function (error) {
          if (error) {
            _.alert(`Error saving clips: ${error.message}`);
          }
        });
      };
      initialize = function () {
        _systemClips(lodash.map(SystemClips, function (input) {
          return createClip(_systemClips, 'cs', input, false);
        }));
        return Flow.Dataflow.link(_.ready, function () {
          loadUserClips();
          return Flow.Dataflow.link(_.saveClip, function (category, type, input) {
            input = input.trim();
            if (input) {
              if (category === 'user') {
                addClip(_userClips, type, input);
                return saveUserClips();
              }
              return addClip(_trashClips, type, input);
            }
          });
        });
      };
      initialize();
      return {
        systemClips: _systemClips,
        systemClipCount: _systemClipCount,
        userClips: _userClips,
        hasUserClips: _hasUserClips,
        userClipCount: _userClipCount,
        trashClips: _trashClips,
        trashClipCount: _trashClipCount,
        hasTrashClips: _hasTrashClips,
        emptyTrash
      };
    };
  }.call(this));
  // anonymous IIFE
  (function () {
    var traceCauses;
    traceCauses = function (error, causes) {
      causes.push(error.message);
      if (error.cause) {
        traceCauses(error.cause, causes);
      }
      return causes;
    };
    Flow.Failure = function (_, error) {
      var causes;
      var message;
      var toggleStack;
      var _isStackVisible;
      causes = traceCauses(error, []);
      message = causes.shift();
      _isStackVisible = Flow.Dataflow.signal(false);
      toggleStack = function () {
        return _isStackVisible(!_isStackVisible());
      };
      _.trackException(`${message}; ${causes.join('; ')}`);
      return {
        message,
        stack: error.stack,
        causes,
        isStackVisible: _isStackVisible,
        toggleStack,
        template: 'flow-failure'
      };
    };
  }.call(this));
  // anonymous IIFE
  (function () {
    var _catalog;
    var _homeContent;
    var _homeMarkdown;
    var _index;
    _catalog = null;
    _index = {};
    _homeContent = null;
    _homeMarkdown = '<blockquote>\nUsing Flow for the first time?\n<br/>\n<div style=\'margin-top:10px\'>\n  <button type=\'button\' data-action=\'get-flow\' data-pack-name=\'examples\' data-flow-name=\'QuickStartVideos.flow\' class=\'flow-button\'><i class=\'fa fa-file-movie-o\'></i><span>Quickstart Videos</span>\n  </button>\n</div>\n</blockquote>\n\nOr, <a href=\'#\' data-action=\'get-pack\' data-pack-name=\'examples\'>view example Flows</a> to explore and learn H<sub>2</sub>O.\n\n###### Star H2O on Github!\n\n<iframe src="https://ghbtns.com/github-btn.html?user=h2oai&repo=h2o-3&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>\n\n###### General\n\n%HELP_TOPICS%\n\n###### Examples\n\nFlow packs are a great way to explore and learn H<sub>2</sub>O. Try out these Flows and run them in your browser.<br/><a href=\'#\' data-action=\'get-packs\'>Browse installed packs...</a>\n\n###### H<sub>2</sub>O REST API\n\n- <a href=\'#\' data-action=\'endpoints\'>Routes</a>\n- <a href=\'#\' data-action=\'schemas\'>Schemas</a>\n';
    Flow.Help = function (_) {
      var buildToc;
      var buildTopics;
      var displayEndpoint;
      var displayEndpoints;
      var displayFlows;
      var displayHtml;
      var displayPacks;
      var displaySchema;
      var displaySchemas;
      var fixImageSources;
      var goBack;
      var goForward;
      var goHome;
      var goTo;
      var initialize;
      var performAction;
      var _canGoBack;
      var _canGoForward;
      var _content;
      var _history;
      var _historyIndex;
      _content = Flow.Dataflow.signal(null);
      _history = [];
      _historyIndex = -1;
      _canGoBack = Flow.Dataflow.signal(false);
      _canGoForward = Flow.Dataflow.signal(false);
      goTo = function (index) {
        var content;
        content = _history[_historyIndex = index];
        $('a, button', $(content)).each(function (i) {
          var $a;
          var action;
          $a = $(this);
          if (action = $a.attr('data-action')) {
            return $a.click(function () {
              return performAction(action, $a);
            });
          }
        });
        _content(content);
        _canGoForward(_historyIndex < _history.length - 1);
        _canGoBack(_historyIndex > 0);
      };
      goBack = function () {
        if (_historyIndex > 0) {
          return goTo(_historyIndex - 1);
        }
      };
      goForward = function () {
        if (_historyIndex < _history.length - 1) {
          return goTo(_historyIndex + 1);
        }
      };
      displayHtml = function (content) {
        if (_historyIndex < _history.length - 1) {
          _history.splice(_historyIndex + 1, _history.length - (_historyIndex + 1), content);
        } else {
          _history.push(content);
        }
        return goTo(_history.length - 1);
      };
      fixImageSources = function (html) {
        return html.replace(/\s+src\s*=\s*"images\//g, ' src="help/images/');
      };
      performAction = function (action, $el) {
        var packName;
        var routeIndex;
        var schemaName;
        var topic;
        switch (action) {
          case 'help':
            topic = _index[$el.attr('data-topic')];
            _.requestHelpContent(topic.name, function (error, html) {
              var contents;
              var div;
              var h5;
              var h6;
              var mark;
              var _ref;
              _ref = Flow.HTML.template('div', 'mark', 'h5', 'h6'), div = _ref[0], mark = _ref[1], h5 = _ref[2], h6 = _ref[3];
              contents = [
                mark('Help'),
                h5(topic.title),
                fixImageSources(div(html))
              ];
              if (topic.children.length) {
                contents.push(h6('Topics'));
                contents.push(buildToc(topic.children));
              }
              return displayHtml(Flow.HTML.render('div', div(contents)));
            });
            break;
          case 'assist':
            _.insertAndExecuteCell('cs', 'assist');
            break;
          case 'get-packs':
            _.requestPacks(function (error, packNames) {
              if (!error) {
                return displayPacks(lodash.filter(packNames, function (packName) {
                  return packName !== 'test';
                }));
              }
            });
            break;
          case 'get-pack':
            packName = $el.attr('data-pack-name');
            _.requestPack(packName, function (error, flowNames) {
              if (!error) {
                return displayFlows(packName, flowNames);
              }
            });
            break;
          case 'get-flow':
            _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
              acceptCaption: 'Load Notebook',
              declineCaption: 'Cancel'
            }, function (accept) {
              var flowName;
              if (accept) {
                packName = $el.attr('data-pack-name');
                flowName = $el.attr('data-flow-name');
                if (H2O.Util.validateFileExtension(flowName, '.flow')) {
                  return _.requestFlow(packName, flowName, function (error, flow) {
                    if (!error) {
                      return _.open(H2O.Util.getFileBaseName(flowName, '.flow'), flow);
                    }
                  });
                }
              }
            });
            break;
          case 'endpoints':
            _.requestEndpoints(function (error, response) {
              if (!error) {
                return displayEndpoints(response.routes);
              }
            });
            break;
          case 'endpoint':
            routeIndex = $el.attr('data-index');
            _.requestEndpoint(routeIndex, function (error, response) {
              if (!error) {
                return displayEndpoint(lodash.head(response.routes));
              }
            });
            break;
          case 'schemas':
            _.requestSchemas(function (error, response) {
              if (!error) {
                return displaySchemas(lodash.sortBy(response.schemas, function (schema) {
                  return schema.name;
                }));
              }
            });
            break;
          case 'schema':
            schemaName = $el.attr('data-schema');
            _.requestSchema(schemaName, function (error, response) {
              if (!error) {
                return displaySchema(lodash.head(response.schemas));
              }
            });
        }
      };
      buildToc = function (nodes) {
        var a;
        var li;
        var ul;
        var _ref;
        _ref = Flow.HTML.template('ul', 'li', 'a href=\'#\' data-action=\'help\' data-topic=\'$1\''), ul = _ref[0], li = _ref[1], a = _ref[2];
        return ul(lodash.map(nodes, function (node) {
          return li(a(node.title, node.name));
        }));
      };
      buildTopics = function (index, topics) {
        var topic;
        var _i;
        var _len;
        for (_i = 0, _len = topics.length; _i < _len; _i++) {
          topic = topics[_i];
          index[topic.name] = topic;
          if (topic.children.length) {
            buildTopics(index, topic.children);
          }
        }
      };
      displayPacks = function (packNames) {
        var a;
        var div;
        var h5;
        var i;
        var mark;
        var p;
        var _ref;
        _ref = Flow.HTML.template('div', 'mark', 'h5', 'p', 'i.fa.fa-folder-o', 'a href=\'#\' data-action=\'get-pack\' data-pack-name=\'$1\''), div = _ref[0], mark = _ref[1], h5 = _ref[2], p = _ref[3], i = _ref[4], a = _ref[5];
        displayHtml(Flow.HTML.render('div', div([
          mark('Packs'),
          h5('Installed Packs'),
          div(lodash.map(packNames, function (packName) {
            return p([
              i(),
              a(packName, packName)
            ]);
          }))
        ])));
      };
      displayFlows = function (packName, flowNames) {
        var a;
        var div;
        var h5;
        var i;
        var mark;
        var p;
        var _ref;
        _ref = Flow.HTML.template('div', 'mark', 'h5', 'p', 'i.fa.fa-file-text-o', `a href=\'#\' data-action=\'get-flow\' data-pack-name=\'${packName}\' data-flow-name=\'$1\'`), div = _ref[0], mark = _ref[1], h5 = _ref[2], p = _ref[3], i = _ref[4], a = _ref[5];
        displayHtml(Flow.HTML.render('div', div([
          mark('Pack'),
          h5(packName),
          div(lodash.map(flowNames, function (flowName) {
            return p([
              i(),
              a(flowName, flowName)
            ]);
          }))
        ])));
      };
      displayEndpoints = function (routes) {
        var action;
        var code;
        var div;
        var els;
        var h5;
        var mark;
        var p;
        var route;
        var routeIndex;
        var _i;
        var _len;
        var _ref;
        _ref = Flow.HTML.template('div', 'mark', 'h5', 'p', 'a href=\'#\' data-action=\'endpoint\' data-index=\'$1\'', 'code'), div = _ref[0], mark = _ref[1], h5 = _ref[2], p = _ref[3], action = _ref[4], code = _ref[5];
        els = [
          mark('API'),
          h5('List of Routes')
        ];
        for (routeIndex = _i = 0, _len = routes.length; _i < _len; routeIndex = ++_i) {
          route = routes[routeIndex];
          els.push(p(`${action(code(`${route.http_method} ${route.url_pattern}`), routeIndex)}<br/>${route.summary}`));
        }
        displayHtml(Flow.HTML.render('div', div(els)));
      };
      goHome = function () {
        return displayHtml(Flow.HTML.render('div', _homeContent));
      };
      displayEndpoint = function (route) {
        var action;
        var code;
        var div;
        var h5;
        var h6;
        var mark;
        var p;
        var _ref;
        var _ref1;
        _ref = Flow.HTML.template('div', 'mark', 'h5', 'h6', 'p', 'a href=\'#\' data-action=\'schema\' data-schema=\'$1\'', 'code'), div = _ref[0], mark = _ref[1], h5 = _ref[2], h6 = _ref[3], p = _ref[4], action = _ref[5], code = _ref[6];
        return displayHtml(Flow.HTML.render('div', div([
          mark('Route'),
          h5(route.url_pattern),
          h6('Method'),
          p(code(route.http_method)),
          h6('Summary'),
          p(route.summary),
          h6('Parameters'),
          p(((_ref1 = route.path_params) != null ? _ref1.length : void 0) ? route.path_params.join(', ') : '-'),
          h6('Input Schema'),
          p(action(code(route.input_schema), route.input_schema)),
          h6('Output Schema'),
          p(action(code(route.output_schema), route.output_schema))
        ])));
      };
      displaySchemas = function (schemas) {
        var action;
        var code;
        var div;
        var els;
        var h5;
        var li;
        var mark;
        var schema;
        var ul;
        var variable;
        var _ref;
        _ref = Flow.HTML.template('div', 'h5', 'ul', 'li', 'var', 'mark', 'code', 'a href=\'#\' data-action=\'schema\' data-schema=\'$1\''), div = _ref[0], h5 = _ref[1], ul = _ref[2], li = _ref[3], variable = _ref[4], mark = _ref[5], code = _ref[6], action = _ref[7];
        els = [
          mark('API'),
          h5('List of Schemas'),
          ul(function () {
            var _i;
            var _len;
            var _results;
            _results = [];
            for (_i = 0, _len = schemas.length; _i < _len; _i++) {
              schema = schemas[_i];
              _results.push(li(`${action(code(schema.name), schema.name)} ${variable(lodash.escape(schema.type))}`));
            }
            return _results;
          }())
        ];
        return displayHtml(Flow.HTML.render('div', div(els)));
      };
      displaySchema = function (schema) {
        var code;
        var content;
        var div;
        var field;
        var h5;
        var h6;
        var mark;
        var p;
        var small;
        var variable;
        var _i;
        var _len;
        var _ref;
        var _ref1;
        _ref = Flow.HTML.template('div', 'mark', 'h5', 'h6', 'p', 'code', 'var', 'small'), div = _ref[0], mark = _ref[1], h5 = _ref[2], h6 = _ref[3], p = _ref[4], code = _ref[5], variable = _ref[6], small = _ref[7];
        content = [
          mark('Schema'),
          h5(`${schema.name} (${lodash.escape(schema.type)})`),
          h6('Fields')
        ];
        _ref1 = schema.fields;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          field = _ref1[_i];
          if (field.name !== '__meta') {
            content.push(p(`${variable(field.name)}${(field.required ? '*' : '')} ${code(lodash.escape(field.type))}<br/>${small(field.help)}`));
          }
        }
        return displayHtml(Flow.HTML.render('div', div(content)));
      };
      initialize = function (catalog) {
        _catalog = catalog;
        buildTopics(_index, _catalog);
        _homeContent = marked(_homeMarkdown).replace('%HELP_TOPICS%', buildToc(_catalog));
        return goHome();
      };
      Flow.Dataflow.link(_.ready, function () {
        return _.requestHelpIndex(function (error, catalog) {
          if (!error) {
            return initialize(catalog);
          }
        });
      });
      return {
        content: _content,
        goHome,
        goBack,
        canGoBack: _canGoBack,
        goForward,
        canGoForward: _canGoForward
      };
    };
  }.call(this));
  (function () {
    Flow.Markdown = function (_) {
      var render;
      render = function (input, output) {
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
    };
  }.call(this));
  // anonymous IIFE
  (function () {
    var __slice = [].slice;
    Flow.Renderers = function (_, _sandbox) {
      return {
        h1() {
          return flowHeading(_, 'h1');
        },
        h2() {
          return flowHeading(_, 'h2');
        },
        h3() {
          return flowHeading(_, 'h3');
        },
        h4() {
          return flowHeading(_, 'h4');
        },
        h5() {
          return flowHeading(_, 'h5');
        },
        h6() {
          return flowHeading(_, 'h6');
        },
        md() {
          return Flow.Markdown(_);
        },
        cs(guid) {
          return flowCoffeescript(_, guid, _sandbox);
        },
        sca(guid) {
          return flowCoffeescript(_, guid, _sandbox);
        },
        raw() {
          return flowRaw(_);
        }
      };
    };
    Flow.Notebook = function (_, _renderers) {
      var appendCell;
      var appendCellAndRun;
      var checkConsistency;
      var checkIfNameIsInUse;
      var clearAllCells;
      var clearCell;
      var cloneCell;
      var continueRunningAllCells;
      var convertCellToCode;
      var convertCellToHeading;
      var convertCellToMarkdown;
      var convertCellToRaw;
      var convertCellToScala;
      var copyCell;
      var createCell;
      var createMenu;
      var createMenuHeader;
      var createMenuItem;
      var createNotebook;
      var createShortcutHint;
      var createTool;
      var cutCell;
      var deleteCell;
      var deserialize;
      var displayAbout;
      var displayDocumentation;
      var displayFAQ;
      var displayKeyboardShortcuts;
      var duplicateNotebook;
      var editModeKeyboardShortcuts;
      var editModeKeyboardShortcutsHelp;
      var editName;
      var executeAllCells;
      var executeCommand;
      var exportNotebook;
      var findBuildProperty;
      var getBuildProperties;
      var goToH2OUrl;
      var goToUrl;
      var initialize;
      var initializeMenus;
      var insertAbove;
      var insertBelow;
      var insertCell;
      var insertCellAbove;
      var insertCellAboveAndRun;
      var insertCellBelow;
      var insertCellBelowAndRun;
      var insertNewCellAbove;
      var insertNewCellBelow;
      var insertNewScalaCellAbove;
      var insertNewScalaCellBelow;
      var loadNotebook;
      var menuCell;
      var menuCellSW;
      var menuDivider;
      var mergeCellAbove;
      var mergeCellBelow;
      var moveCellDown;
      var moveCellUp;
      var normalModeKeyboardShortcuts;
      var normalModeKeyboardShortcutsHelp;
      var notImplemented;
      var openNotebook;
      var pasteCellAbove;
      var pasteCellBelow;
      var pasteCellandReplace;
      var promptForNotebook;
      var removeCell;
      var runAllCells;
      var runCell;
      var runCellAndInsertBelow;
      var runCellAndSelectBelow;
      var saveName;
      var saveNotebook;
      var selectCell;
      var selectNextCell;
      var selectPreviousCell;
      var serialize;
      var setupKeyboardHandling;
      var setupMenus;
      var showBrowser;
      var showClipboard;
      var showHelp;
      var showOutline;
      var shutdown;
      var splitCell;
      var startTour;
      var stopRunningAll;
      var storeNotebook;
      var switchToCommandMode;
      var switchToEditMode;
      var toKeyboardHelp;
      var toggleAllInputs;
      var toggleAllOutputs;
      var toggleInput;
      var toggleOutput;
      var toggleSidebar;
      var undoLastDelete;
      var uploadFile;
      var _about;
      var _areInputsHidden;
      var _areOutputsHidden;
      var _cells;
      var _clipboardCell;
      var _dialogs;
      var _initializeInterpreter;
      var _isEditingName;
      var _isRunningAll;
      var _isSidebarHidden;
      var _lastDeletedCell;
      var _localName;
      var _menus;
      var _remoteName;
      var _runningCaption;
      var _runningCellInput;
      var _runningPercent;
      var _selectedCell;
      var _selectedCellIndex;
      var _sidebar;
      var _status;
      var _toolbar;
      _localName = Flow.Dataflow.signal('Untitled Flow');
      Flow.Dataflow.react(_localName, function (name) {
        return document.title = `H2O${(name && name.trim() ? `- ${name}` : '')}`;
      });
      _remoteName = Flow.Dataflow.signal(null);
      _isEditingName = Flow.Dataflow.signal(false);
      editName = function () {
        return _isEditingName(true);
      };
      saveName = function () {
        return _isEditingName(false);
      };
      _cells = Flow.Dataflow.signals([]);
      _selectedCell = null;
      _selectedCellIndex = -1;
      _clipboardCell = null;
      _lastDeletedCell = null;
      _areInputsHidden = Flow.Dataflow.signal(false);
      _areOutputsHidden = Flow.Dataflow.signal(false);
      _isSidebarHidden = Flow.Dataflow.signal(false);
      _isRunningAll = Flow.Dataflow.signal(false);
      _runningCaption = Flow.Dataflow.signal('Running');
      _runningPercent = Flow.Dataflow.signal('0%');
      _runningCellInput = Flow.Dataflow.signal('');
      _status = flowStatus(_);
      _sidebar = flowSidebar(_, _cells);
      _about = Flow.About(_);
      _dialogs = Flow.Dialogs(_);
      _initializeInterpreter = function () {
        return _.requestScalaIntp(function (error, response) {
          if (error) {
            return _.scalaIntpId(-1);
          }
          return _.scalaIntpId(response.session_id);
        });
      };
      serialize = function () {
        var cell;
        var cells;
        cells = function () {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = _cells();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cell = _ref[_i];
            _results.push({
              type: cell.type(),
              input: cell.input()
            });
          }
          return _results;
        }();
        return {
          version: '1.0.0',
          cells
        };
      };
      deserialize = function (localName, remoteName, doc) {
        var cell;
        var cells;
        var _i;
        var _len;
        var _ref;
        _localName(localName);
        _remoteName(remoteName);
        cells = function () {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = doc.cells;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cell = _ref[_i];
            _results.push(createCell(cell.type, cell.input));
          }
          return _results;
        }();
        _cells(cells);
        selectCell(lodash.head(cells));
        _ref = _cells();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cell = _ref[_i];
          if (!cell.isCode()) {
            cell.execute();
          }
        }
      };
      createCell = function (type, input) {
        if (type == null) {
          type = 'cs';
        }
        if (input == null) {
          input = '';
        }
        return flowCell(_, _renderers, type, input);
      };
      checkConsistency = function () {
        var cell;
        var i;
        var selectionCount;
        var _i;
        var _len;
        var _ref;
        selectionCount = 0;
        _ref = _cells();
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          cell = _ref[i];
          if (!cell) {
            error(`index ${i} is empty`);
          } else {
            if (cell.isSelected()) {
              selectionCount++;
            }
          }
        }
        if (selectionCount !== 1) {
          error(`selected cell count = ${selectionCount}`);
        }
      };
      selectCell = function (target, scrollIntoView, scrollImmediately) {
        if (scrollIntoView == null) {
          scrollIntoView = true;
        }
        if (scrollImmediately == null) {
          scrollImmediately = false;
        }
        if (_selectedCell === target) {
          return;
        }
        if (_selectedCell) {
          _selectedCell.isSelected(false);
        }
        _selectedCell = target;
        _selectedCell.isSelected(true);
        _selectedCellIndex = _cells.indexOf(_selectedCell);
        checkConsistency();
        if (scrollIntoView) {
          lodash.defer(function () {
            return _selectedCell.scrollIntoView(scrollImmediately);
          });
        }
        return _selectedCell;
      };
      cloneCell = function (cell) {
        return createCell(cell.type(), cell.input());
      };
      switchToCommandMode = function () {
        return _selectedCell.isActive(false);
      };
      switchToEditMode = function () {
        _selectedCell.isActive(true);
        return false;
      };
      convertCellToCode = function () {
        return _selectedCell.type('cs');
      };
      convertCellToHeading = function (level) {
        return function () {
          _selectedCell.type(`h${level}`);
          return _selectedCell.execute();
        };
      };
      convertCellToMarkdown = function () {
        _selectedCell.type('md');
        return _selectedCell.execute();
      };
      convertCellToRaw = function () {
        _selectedCell.type('raw');
        return _selectedCell.execute();
      };
      convertCellToScala = function () {
        return _selectedCell.type('sca');
      };
      copyCell = function () {
        return _clipboardCell = _selectedCell;
      };
      cutCell = function () {
        copyCell();
        return removeCell();
      };
      deleteCell = function () {
        _lastDeletedCell = _selectedCell;
        return removeCell();
      };
      removeCell = function () {
        var cells;
        var removedCell;
        cells = _cells();
        if (cells.length > 1) {
          if (_selectedCellIndex === cells.length - 1) {
            removedCell = lodash.head(_cells.splice(_selectedCellIndex, 1));
            selectCell(cells[_selectedCellIndex - 1]);
          } else {
            removedCell = lodash.head(_cells.splice(_selectedCellIndex, 1));
            selectCell(cells[_selectedCellIndex]);
          }
          if (removedCell) {
            _.saveClip('trash', removedCell.type(), removedCell.input());
          }
        }
      };
      insertCell = function (index, cell) {
        _cells.splice(index, 0, cell);
        selectCell(cell);
        return cell;
      };
      insertAbove = function (cell) {
        return insertCell(_selectedCellIndex, cell);
      };
      insertBelow = function (cell) {
        return insertCell(_selectedCellIndex + 1, cell);
      };
      appendCell = function (cell) {
        return insertCell(_cells().length, cell);
      };
      insertCellAbove = function (type, input) {
        return insertAbove(createCell(type, input));
      };
      insertCellBelow = function (type, input) {
        return insertBelow(createCell(type, input));
      };
      insertNewCellAbove = function () {
        return insertAbove(createCell('cs'));
      };
      insertNewCellBelow = function () {
        return insertBelow(createCell('cs'));
      };
      insertNewScalaCellAbove = function () {
        return insertAbove(createCell('sca'));
      };
      insertNewScalaCellBelow = function () {
        return insertBelow(createCell('sca'));
      };
      insertCellAboveAndRun = function (type, input) {
        var cell;
        cell = insertAbove(createCell(type, input));
        cell.execute();
        return cell;
      };
      insertCellBelowAndRun = function (type, input) {
        var cell;
        cell = insertBelow(createCell(type, input));
        cell.execute();
        return cell;
      };
      appendCellAndRun = function (type, input) {
        var cell;
        cell = appendCell(createCell(type, input));
        cell.execute();
        return cell;
      };
      moveCellDown = function () {
        var cells;
        cells = _cells();
        if (_selectedCellIndex !== cells.length - 1) {
          _cells.splice(_selectedCellIndex, 1);
          _selectedCellIndex++;
          _cells.splice(_selectedCellIndex, 0, _selectedCell);
        }
      };
      moveCellUp = function () {
        var cells;
        if (_selectedCellIndex !== 0) {
          cells = _cells();
          _cells.splice(_selectedCellIndex, 1);
          _selectedCellIndex--;
          _cells.splice(_selectedCellIndex, 0, _selectedCell);
        }
      };
      mergeCellBelow = function () {
        var cells;
        var nextCell;
        cells = _cells();
        if (_selectedCellIndex !== cells.length - 1) {
          nextCell = cells[_selectedCellIndex + 1];
          if (_selectedCell.type() === nextCell.type()) {
            nextCell.input(`${_selectedCell.input()}\n${nextCell.input()}`);
            removeCell();
          }
        }
      };
      splitCell = function () {
        var cursorPosition;
        var input;
        var left;
        var right;
        if (_selectedCell.isActive()) {
          input = _selectedCell.input();
          if (input.length > 1) {
            cursorPosition = _selectedCell.getCursorPosition();
            if (
              cursorPosition > 0 &&
              cursorPosition < input.length - 1
            ) {
              left = input.substr(0, cursorPosition);
              right = input.substr(cursorPosition);
              _selectedCell.input(left);
              insertCell(_selectedCellIndex + 1, createCell('cs', right));
              _selectedCell.isActive(true);
            }
          }
        }
      };
      pasteCellAbove = function () {
        if (_clipboardCell) {
          return insertCell(_selectedCellIndex, cloneCell(_clipboardCell));
        }
      };
      pasteCellBelow = function () {
        if (_clipboardCell) {
          return insertCell(_selectedCellIndex + 1, cloneCell(_clipboardCell));
        }
      };
      undoLastDelete = function () {
        if (_lastDeletedCell) {
          insertCell(_selectedCellIndex + 1, _lastDeletedCell);
        }
        return _lastDeletedCell = null;
      };
      runCell = function () {
        _selectedCell.execute();
        return false;
      };
      runCellAndInsertBelow = function () {
        _selectedCell.execute(function () {
          return insertNewCellBelow();
        });
        return false;
      };
      runCellAndSelectBelow = function () {
        _selectedCell.execute(function () {
          return selectNextCell();
        });
        return false;
      };
      checkIfNameIsInUse = function (name, go) {
        return _.requestObjectExists('notebook', name, function (error, exists) {
          return go(exists);
        });
      };
      storeNotebook = function (localName, remoteName) {
        return _.requestPutObject('notebook', localName, serialize(), function (error) {
          if (error) {
            return _.alert(`Error saving notebook: ${error.message}`);
          }
          _remoteName(localName);
          _localName(localName);
          if (remoteName !== localName) {
            return _.requestDeleteObject('notebook', remoteName, function (error) {
              if (error) {
                _.alert(`Error deleting remote notebook [${remoteName}]: ${error.message}`);
              }
              return _.saved();
            });
          }
          return _.saved();
        });
      };
      saveNotebook = function () {
        var localName;
        var remoteName;
        localName = Flow.Util.sanitizeName(_localName());
        if (localName === '') {
          return _.alert('Invalid notebook name.');
        }
        remoteName = _remoteName();
        if (remoteName) {
          storeNotebook(localName, remoteName);
        }
        checkIfNameIsInUse(localName, function (isNameInUse) {
          if (isNameInUse) {
            return _.confirm('A notebook with that name already exists.\nDo you want to replace it with the one you\'re saving?', {
              acceptCaption: 'Replace',
              declineCaption: 'Cancel'
            }, function (accept) {
              if (accept) {
                return storeNotebook(localName, remoteName);
              }
            });
          }
          return storeNotebook(localName, remoteName);
        });
      };
      promptForNotebook = function () {
        return _.dialog(flowFileOpenDialog, function (result) {
          var error;
          var filename;
          var _ref;
          if (result) {
            error = result.error, filename = result.filename;
            if (error) {
              return _.growl((_ref = error.message) != null ? _ref : error);
            }
            loadNotebook(filename);
            return _.loaded();
          }
        });
      };
      uploadFile = function () {
        return _.dialog(flowFileUploadDialog, function (result) {
          var error;
          var _ref;
          if (result) {
            error = result.error;
            if (error) {
              return _.growl((_ref = error.message) != null ? _ref : error);
            }
            _.growl('File uploaded successfully!');
            return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${Flow.Prelude.stringify(result.result.destination_frame)}]`);
          }
        });
      };
      toggleInput = function () {
        return _selectedCell.toggleInput();
      };
      toggleOutput = function () {
        return _selectedCell.toggleOutput();
      };
      toggleAllInputs = function () {
        var cell;
        var wereHidden;
        var _i;
        var _len;
        var _ref;
        wereHidden = _areInputsHidden();
        _areInputsHidden(!wereHidden);
        if (wereHidden) {
          _ref = _cells();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cell = _ref[_i];
            cell.autoResize();
          }
        }
      };
      toggleAllOutputs = function () {
        return _areOutputsHidden(!_areOutputsHidden());
      };
      toggleSidebar = function () {
        return _isSidebarHidden(!_isSidebarHidden());
      };
      showBrowser = function () {
        _isSidebarHidden(false);
        return _.showBrowser();
      };
      showOutline = function () {
        _isSidebarHidden(false);
        return _.showOutline();
      };
      showClipboard = function () {
        _isSidebarHidden(false);
        return _.showClipboard();
      };
      selectNextCell = function () {
        var cells;
        cells = _cells();
        if (_selectedCellIndex !== cells.length - 1) {
          selectCell(cells[_selectedCellIndex + 1]);
        }
        return false;
      };
      selectPreviousCell = function () {
        var cells;
        if (_selectedCellIndex !== 0) {
          cells = _cells();
          selectCell(cells[_selectedCellIndex - 1]);
        }
        return false;
      };
      displayKeyboardShortcuts = function () {
        return $('#keyboardHelpDialog').modal();
      };
      findBuildProperty = function (caption) {
        var entry;
        if (Flow.BuildProperties) {
          if (entry = lodash.find(Flow.BuildProperties, function (entry) {
            return entry.caption === caption;
          })) {
            return entry.value;
          }
          return void 0;
        }
        return void 0;
      };
      getBuildProperties = function () {
        var projectVersion;
        projectVersion = findBuildProperty('H2O Build project version');
        return [
          findBuildProperty('H2O Build git branch'),
          projectVersion,
          projectVersion ? lodash.last(projectVersion.split('.')) : void 0,
          findBuildProperty('H2O Build git hash') || 'master'
        ];
      };
      displayDocumentation = function () {
        var buildVersion;
        var gitBranch;
        var gitHash;
        var projectVersion;
        var _ref;
        _ref = getBuildProperties(), gitBranch = _ref[0], projectVersion = _ref[1], buildVersion = _ref[2], gitHash = _ref[3];
        if (buildVersion && buildVersion !== '99999') {
          return window.open(`http://h2o-release.s3.amazonaws.com/h2o/${gitBranch}/${buildVersion}/docs-website/h2o-docs/index.html`, '_blank');
        }
        return window.open(`https://github.com/h2oai/h2o-3/blob/${gitHash}/h2o-docs/src/product/flow/README.md`, '_blank');
      };
      displayFAQ = function () {
        var buildVersion;
        var gitBranch;
        var gitHash;
        var projectVersion;
        var _ref;
        _ref = getBuildProperties(), gitBranch = _ref[0], projectVersion = _ref[1], buildVersion = _ref[2], gitHash = _ref[3];
        if (buildVersion && buildVersion !== '99999') {
          return window.open(`http://h2o-release.s3.amazonaws.com/h2o/${gitBranch}/${buildVersion}/docs-website/h2o-docs/index.html`, '_blank');
        }
        return window.open(`https://github.com/h2oai/h2o-3/blob/${gitHash}/h2o-docs/src/product/howto/FAQ.md`, '_blank');
      };
      executeCommand = function (command) {
        return function () {
          return _.insertAndExecuteCell('cs', command);
        };
      };
      displayAbout = function () {
        return $('#aboutDialog').modal();
      };
      shutdown = function () {
        return _.requestShutdown(function (error, result) {
          if (error) {
            return _.growl(`Shutdown failed: ${error.message}`, 'danger');
          }
          return _.growl('Shutdown complete!', 'warning');
        });
      };
      showHelp = function () {
        _isSidebarHidden(false);
        return _.showHelp();
      };
      createNotebook = function () {
        return _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
          acceptCaption: 'Create New Notebook',
          declineCaption: 'Cancel'
        }, function (accept) {
          var currentTime;
          if (accept) {
            currentTime = new Date().getTime();
            return deserialize('Untitled Flow', null, {
              cells: [{
                type: 'cs',
                input: ''
              }]
            });
          }
        });
      };
      duplicateNotebook = function () {
        return deserialize(`Copy of ${_localName()}`, null, serialize());
      };
      openNotebook = function (name, doc) {
        return deserialize(name, null, doc);
      };
      loadNotebook = function (name) {
        return _.requestObject('notebook', name, function (error, doc) {
          var _ref;
          if (error) {
            return _.alert((_ref = error.message) != null ? _ref : error);
          }
          return deserialize(name, name, doc);
        });
      };
      exportNotebook = function () {
        var remoteName;
        if (remoteName = _remoteName()) {
          return window.open(`/3/NodePersistentStorage.bin/notebook/${remoteName}`, '_blank');
        }
        return _.alert('Please save this notebook before exporting.');
      };
      goToH2OUrl = function (url) {
        return function () {
          return window.open(window.Flow.ContextPath + url, '_blank');
        };
      };
      goToUrl = function (url) {
        return function () {
          return window.open(url, '_blank');
        };
      };
      executeAllCells = function (fromBeginning, go) {
        var cellCount;
        var cellIndex;
        var cells;
        var executeNextCell;
        _isRunningAll(true);
        cells = _cells().slice(0);
        cellCount = cells.length;
        cellIndex = 0;
        if (!fromBeginning) {
          cells = cells.slice(_selectedCellIndex);
          cellIndex = _selectedCellIndex;
        }
        executeNextCell = function () {
          var cell;
          if (_isRunningAll()) {
            cell = cells.shift();
            if (cell) {
              cell.scrollIntoView(true);
              cellIndex++;
              _runningCaption(`Running cell ${cellIndex} of ${cellCount}`);
              _runningPercent(`${Math.floor(100 * cellIndex / cellCount)}%`);
              _runningCellInput(cell.input());
              return cell.execute(function (errors) {
                if (errors) {
                  return go('failed', errors);
                }
                return executeNextCell();
              });
            }
            return go('done');
          }
          return go('aborted');
        };
        return executeNextCell();
      };
      runAllCells = function (fromBeginning) {
        if (fromBeginning == null) {
          fromBeginning = true;
        }
        return executeAllCells(fromBeginning, function (status) {
          _isRunningAll(false);
          switch (status) {
            case 'aborted':
              return _.growl('Stopped running your flow.', 'warning');
            case 'failed':
              return _.growl('Failed running your flow.', 'danger');
            default:
              return _.growl('Finished running your flow!', 'success');
          }
        });
      };
      continueRunningAllCells = function () {
        return runAllCells(false);
      };
      stopRunningAll = function () {
        return _isRunningAll(false);
      };
      clearCell = function () {
        _selectedCell.clear();
        return _selectedCell.autoResize();
      };
      clearAllCells = function () {
        var cell;
        var _i;
        var _len;
        var _ref;
        _ref = _cells();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cell = _ref[_i];
          cell.clear();
          cell.autoResize();
        }
      };
      notImplemented = function () {
      };
      pasteCellandReplace = notImplemented;
      mergeCellAbove = notImplemented;
      startTour = notImplemented;
      createMenu = function (label, items) {
        return {
          label,
          items
        };
      };
      createMenuHeader = function (label) {
        return {
          label,
          action: null
        };
      };
      createShortcutHint = shortcut => `<span style=\'float:right\'>${lodash.map(shortcut, key => `<kbd>${key}</kbd>`).join(' ')}</span>`;
      createMenuItem = function (label, action, shortcut) {
        var kbds;
        kbds = shortcut ? createShortcutHint(shortcut) : '';
        return {
          label: `${lodash.escape(label)}${kbds}`,
          action
        };
      };
      menuDivider = {
        label: null,
        action: null
      };
      _menus = Flow.Dataflow.signal(null);
      menuCell = [
        createMenuItem('Run Cell', runCell, [
          'ctrl',
          'enter'
        ]),
        menuDivider,
        createMenuItem('Cut Cell', cutCell, ['x']),
        createMenuItem('Copy Cell', copyCell, ['c']),
        createMenuItem('Paste Cell Above', pasteCellAbove, [
          'shift',
          'v'
        ]),
        createMenuItem('Paste Cell Below', pasteCellBelow, ['v']),
        createMenuItem('Delete Cell', deleteCell, [
          'd',
          'd'
        ]),
        createMenuItem('Undo Delete Cell', undoLastDelete, ['z']),
        menuDivider,
        createMenuItem('Move Cell Up', moveCellUp, [
          'ctrl',
          'k'
        ]),
        createMenuItem('Move Cell Down', moveCellDown, [
          'ctrl',
          'j'
        ]),
        menuDivider,
        createMenuItem('Insert Cell Above', insertNewCellAbove, ['a']),
        createMenuItem('Insert Cell Below', insertNewCellBelow, ['b']),
        menuDivider,
        createMenuItem('Toggle Cell Input', toggleInput),
        createMenuItem('Toggle Cell Output', toggleOutput, ['o']),
        createMenuItem('Clear Cell Output', clearCell)
      ];
      menuCellSW = [
        menuDivider,
        createMenuItem('Insert Scala Cell Above', insertNewScalaCellAbove),
        createMenuItem('Insert Scala Cell Below', insertNewScalaCellBelow)
      ];
      if (_.onSparklingWater) {
        menuCell = __slice.call(menuCell).concat(__slice.call(menuCellSW));
      }
      initializeMenus = function (builder) {
        var modelMenuItems;
        modelMenuItems = lodash.map(builder, function (builder) {
          return createMenuItem(`${builder.algo_full_name}...`, executeCommand(`buildModel ${Flow.Prelude.stringify(builder.algo)}`));
        }).concat([
          menuDivider,
          createMenuItem('List All Models', executeCommand('getModels')),
          createMenuItem('List Grid Search Results', executeCommand('getGrids')),
          createMenuItem('Import Model...', executeCommand('importModel')),
          createMenuItem('Export Model...', executeCommand('exportModel'))
        ]);
        return [
          createMenu('Flow', [
            createMenuItem('New Flow', createNotebook),
            createMenuItem('Open Flow...', promptForNotebook),
            createMenuItem('Save Flow', saveNotebook, ['s']),
            createMenuItem('Make a Copy...', duplicateNotebook),
            menuDivider,
            createMenuItem('Run All Cells', runAllCells),
            createMenuItem('Run All Cells Below', continueRunningAllCells),
            menuDivider,
            createMenuItem('Toggle All Cell Inputs', toggleAllInputs),
            createMenuItem('Toggle All Cell Outputs', toggleAllOutputs),
            createMenuItem('Clear All Cell Outputs', clearAllCells),
            menuDivider,
            createMenuItem('Download this Flow...', exportNotebook)
          ]),
          createMenu('Cell', menuCell),
          createMenu('Data', [
            createMenuItem('Import Files...', executeCommand('importFiles')),
            createMenuItem('Upload File...', uploadFile),
            createMenuItem('Split Frame...', executeCommand('splitFrame')),
            createMenuItem('Merge Frames...', executeCommand('mergeFrames')),
            menuDivider,
            createMenuItem('List All Frames', executeCommand('getFrames')),
            menuDivider,
            createMenuItem('Impute...', executeCommand('imputeColumn'))
          ]),
          createMenu('Model', modelMenuItems),
          createMenu('Score', [
            createMenuItem('Predict...', executeCommand('predict')),
            createMenuItem('Partial Dependence Plots...', executeCommand('buildPartialDependence')),
            menuDivider,
            createMenuItem('List All Predictions', executeCommand('getPredictions'))
          ]),
          createMenu('Admin', [
            createMenuItem('Jobs', executeCommand('getJobs')),
            createMenuItem('Cluster Status', executeCommand('getCloud')),
            createMenuItem('Water Meter (CPU meter)', goToH2OUrl('perfbar.html')),
            menuDivider,
            createMenuHeader('Inspect Log'),
            createMenuItem('View Log', executeCommand('getLogFile')),
            createMenuItem('Download Logs', goToH2OUrl('3/Logs/download')),
            menuDivider,
            createMenuHeader('Advanced'),
            createMenuItem('Create Synthetic Frame...', executeCommand('createFrame')),
            createMenuItem('Stack Trace', executeCommand('getStackTrace')),
            createMenuItem('Network Test', executeCommand('testNetwork')),
            createMenuItem('Profiler', executeCommand('getProfile depth: 10')),
            createMenuItem('Timeline', executeCommand('getTimeline')),
            createMenuItem('Shut Down', shutdown)
          ]),
          createMenu('Help', [
            createMenuItem('Assist Me', executeCommand('assist')),
            menuDivider,
            createMenuItem('Contents', showHelp),
            createMenuItem('Keyboard Shortcuts', displayKeyboardShortcuts, ['h']),
            menuDivider,
            createMenuItem('Documentation', displayDocumentation),
            createMenuItem('FAQ', displayFAQ),
            createMenuItem('H2O.ai', goToUrl('http://h2o.ai/')),
            createMenuItem('H2O on Github', goToUrl('https://github.com/h2oai/h2o-3')),
            createMenuItem('Report an issue', goToUrl('http://jira.h2o.ai')),
            createMenuItem('Forum / Ask a question', goToUrl('https://groups.google.com/d/forum/h2ostream')),
            menuDivider,
            createMenuItem('About', displayAbout)
          ])
        ];
      };
      setupMenus = function () {
        return _.requestModelBuilders(function (error, builders) {
          return _menus(initializeMenus(error ? [] : builders));
        });
      };
      createTool = function (icon, label, action, isDisabled) {
        if (isDisabled == null) {
          isDisabled = false;
        }
        return {
          label,
          action,
          isDisabled,
          icon: `fa fa-${icon}`
        };
      };
      _toolbar = [
        [
          createTool('file-o', 'New', createNotebook),
          createTool('folder-open-o', 'Open', promptForNotebook),
          createTool('save', 'Save (s)', saveNotebook)
        ],
        [
          createTool('plus', 'Insert Cell Below (b)', insertNewCellBelow),
          createTool('arrow-up', 'Move Cell Up (ctrl+k)', moveCellUp),
          createTool('arrow-down', 'Move Cell Down (ctrl+j)', moveCellDown)
        ],
        [
          createTool('cut', 'Cut Cell (x)', cutCell),
          createTool('copy', 'Copy Cell (c)', copyCell),
          createTool('paste', 'Paste Cell Below (v)', pasteCellBelow),
          createTool('eraser', 'Clear Cell', clearCell),
          createTool('trash-o', 'Delete Cell (d d)', deleteCell)
        ],
        [
          createTool('step-forward', 'Run and Select Below', runCellAndSelectBelow),
          createTool('play', 'Run (ctrl+enter)', runCell),
          createTool('forward', 'Run All', runAllCells)
        ],
            [createTool('question-circle', 'Assist Me', executeCommand('assist'))]
      ];
      normalModeKeyboardShortcuts = [
        [
          'enter',
          'edit mode',
          switchToEditMode
        ],
        [
          'y',
          'to code',
          convertCellToCode
        ],
        [
          'm',
          'to markdown',
          convertCellToMarkdown
        ],
        [
          'r',
          'to raw',
          convertCellToRaw
        ],
        [
          '1',
          'to heading 1',
          convertCellToHeading(1)
        ],
        [
          '2',
          'to heading 2',
          convertCellToHeading(2)
        ],
        [
          '3',
          'to heading 3',
          convertCellToHeading(3)
        ],
        [
          '4',
          'to heading 4',
          convertCellToHeading(4)
        ],
        [
          '5',
          'to heading 5',
          convertCellToHeading(5)
        ],
        [
          '6',
          'to heading 6',
          convertCellToHeading(6)
        ],
        [
          'up',
          'select previous cell',
          selectPreviousCell
        ],
        [
          'down',
          'select next cell',
          selectNextCell
        ],
        [
          'k',
          'select previous cell',
          selectPreviousCell
        ],
        [
          'j',
          'select next cell',
          selectNextCell
        ],
        [
          'ctrl+k',
          'move cell up',
          moveCellUp
        ],
        [
          'ctrl+j',
          'move cell down',
          moveCellDown
        ],
        [
          'a',
          'insert cell above',
          insertNewCellAbove
        ],
        [
          'b',
          'insert cell below',
          insertNewCellBelow
        ],
        [
          'x',
          'cut cell',
          cutCell
        ],
        [
          'c',
          'copy cell',
          copyCell
        ],
        [
          'shift+v',
          'paste cell above',
          pasteCellAbove
        ],
        [
          'v',
          'paste cell below',
          pasteCellBelow
        ],
        [
          'z',
          'undo last delete',
          undoLastDelete
        ],
        [
          'd d',
          'delete cell (press twice)',
          deleteCell
        ],
        [
          'shift+m',
          'merge cell below',
          mergeCellBelow
        ],
        [
          's',
          'save notebook',
          saveNotebook
        ],
        [
          'o',
          'toggle output',
          toggleOutput
        ],
        [
          'h',
          'keyboard shortcuts',
          displayKeyboardShortcuts
        ]
      ];
      if (_.onSparklingWater) {
        normalModeKeyboardShortcuts.push([
          'q',
          'to Scala',
          convertCellToScala
        ]);
      }
      editModeKeyboardShortcuts = [
        [
          'esc',
          'command mode',
          switchToCommandMode
        ],
        [
          'ctrl+m',
          'command mode',
          switchToCommandMode
        ],
        [
          'shift+enter',
          'run cell, select below',
          runCellAndSelectBelow
        ],
        [
          'ctrl+enter',
          'run cell',
          runCell
        ],
        [
          'alt+enter',
          'run cell, insert below',
          runCellAndInsertBelow
        ],
        [
          'ctrl+shift+-',
          'split cell',
          splitCell
        ],
        [
          'mod+s',
          'save notebook',
          saveNotebook
        ]
      ];
      toKeyboardHelp = function (shortcut) {
        var caption;
        var keystrokes;
        var seq;
        seq = shortcut[0], caption = shortcut[1];
        keystrokes = lodash.map(seq.split(/\+/g), function (key) {
          return `<kbd>${key}</kbd>`;
        }).join(' ');
        return {
          keystrokes,
          caption
        };
      };
      normalModeKeyboardShortcutsHelp = lodash.map(normalModeKeyboardShortcuts, toKeyboardHelp);
      editModeKeyboardShortcutsHelp = lodash.map(editModeKeyboardShortcuts, toKeyboardHelp);
      setupKeyboardHandling = function (mode) {
        var caption;
        var f;
        var shortcut;
        var _i;
        var _j;
        var _len;
        var _len1;
        var _ref;
        var _ref1;
        for (_i = 0, _len = normalModeKeyboardShortcuts.length; _i < _len; _i++) {
          _ref = normalModeKeyboardShortcuts[_i], shortcut = _ref[0], caption = _ref[1], f = _ref[2];
          Mousetrap.bind(shortcut, f);
        }
        for (_j = 0, _len1 = editModeKeyboardShortcuts.length; _j < _len1; _j++) {
          _ref1 = editModeKeyboardShortcuts[_j], shortcut = _ref1[0], caption = _ref1[1], f = _ref1[2];
          Mousetrap.bindGlobal(shortcut, f);
        }
      };
      initialize = function () {
        setupKeyboardHandling('normal');
        setupMenus();
        Flow.Dataflow.link(_.load, loadNotebook);
        Flow.Dataflow.link(_.open, openNotebook);
        Flow.Dataflow.link(_.selectCell, selectCell);
        Flow.Dataflow.link(_.executeAllCells, executeAllCells);
        Flow.Dataflow.link(_.insertAndExecuteCell, function (type, input) {
          return lodash.defer(appendCellAndRun, type, input);
        });
        Flow.Dataflow.link(_.insertCell, function (type, input) {
          return lodash.defer(insertCellBelow, type, input);
        });
        Flow.Dataflow.link(_.saved, function () {
          return _.growl('Notebook saved.');
        });
        Flow.Dataflow.link(_.loaded, function () {
          return _.growl('Notebook loaded.');
        });
        executeCommand('assist')();
        _.setDirty();
        if (_.onSparklingWater) {
          return _initializeInterpreter();
        }
      };
      Flow.Dataflow.link(_.ready, initialize);
      return {
        name: _localName,
        isEditingName: _isEditingName,
        editName,
        saveName,
        menus: _menus,
        sidebar: _sidebar,
        status: _status,
        toolbar: _toolbar,
        cells: _cells,
        areInputsHidden: _areInputsHidden,
        areOutputsHidden: _areOutputsHidden,
        isSidebarHidden: _isSidebarHidden,
        isRunningAll: _isRunningAll,
        runningCaption: _runningCaption,
        runningPercent: _runningPercent,
        runningCellInput: _runningCellInput,
        stopRunningAll,
        toggleSidebar,
        shortcutsHelp: {
          normalMode: normalModeKeyboardShortcutsHelp,
          editMode: editModeKeyboardShortcutsHelp
        },
        about: _about,
        dialogs: _dialogs,
        templateOf(view) {
          return view.template;
        }
      };
    };
  }.call(this));
  // anonymous IIFE 
  (function () {
    var isExpandable;
    var preview;
    var previewArray;
    var previewObject;
    isExpandable = function (type) {
      switch (type) {
        case 'null':
        case 'undefined':
        case 'Boolean':
        case 'String':
        case 'Number':
        case 'Date':
        case 'RegExp':
        case 'Arguments':
        case 'Function':
          return false;
        default:
          return true;
      }
    };
    previewArray = function (array) {
      var element;
      var ellipsis;
      var previews;
      ellipsis = array.length > 5 ? ', ...' : '';
      previews = function () {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = lodash.head(array, 5);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          _results.push(preview(element));
        }
        return _results;
      }();
      return `[${previews.join(', ')}${ellipsis}]`;
    };
    previewObject = function (object) {
      var count;
      var ellipsis;
      var key;
      var previews;
      var value;
      count = 0;
      previews = [];
      ellipsis = '';
      for (key in object) {
        if ({}.hasOwnProperty.call(object, key)) {
          value = object[key];
          if (!(key !== '_flow_')) {
            continue;
          }
          previews.push(`${key}: ${preview(value)}`);
          if (++count === 5) {
            ellipsis = ', ...';
            break;
          }
        }
      }
      return `{${previews.join(', ')}${ellipsis}}`;
    };
    preview = function (element, recurse) {
      var type;
      if (recurse == null) {
        recurse = false;
      }
      type = Flow.Prelude.typeOf(element);
      switch (type) {
        case 'Boolean':
        case 'String':
        case 'Number':
        case 'Date':
        case 'RegExp':
          return element;
        case 'undefined':
        case 'null':
        case 'Function':
        case 'Arguments':
          return type;
        case 'Array':
          if (recurse) {
            return previewArray(element);
          }
          return type;
          // break; // no-unreachable
        default:
          if (recurse) {
            return previewObject(element);
          }
          return type;
      }
    };
    Flow.ObjectBrowserElement = function (key, object) {
      var toggle;
      var _canExpand;
      var _expansions;
      var _isExpanded;
      var _type;
      _expansions = Flow.Dataflow.signal(null);
      _isExpanded = Flow.Dataflow.signal(false);
      _type = Flow.Prelude.typeOf(object);
      _canExpand = isExpandable(_type);
      toggle = function () {
        var expansions;
        var value;
        if (!_canExpand) {
          return;
        }
        if (_expansions() === null) {
          expansions = [];
          for (key in object) {
            if ({}.hasOwnProperty.call(object, key)) {
              value = object[key];
              if (key !== '_flow_') {
                expansions.push(Flow.ObjectBrowserElement(key, value));
              }
            }
          }
          _expansions(expansions);
        }
        return _isExpanded(!_isExpanded());
      };
      return {
        key,
        preview: preview(object, true),
        toggle,
        expansions: _expansions,
        isExpanded: _isExpanded,
        canExpand: _canExpand
      };
    };
    Flow.ObjectBrowser = function (_, _go, key, object) {
      lodash.defer(_go);
      return {
        object: Flow.ObjectBrowserElement(key, object),
        template: 'flow-object'
      };
    };
  }.call(this));
  // defer this for now
  (function () {
    Flow.Application = function (_, routines) {
      var _notebook;
      var _renderers;
      var _sandbox;
      flowApplicationContext(_);
      _sandbox = flowSandbox(_, routines(_));
      _renderers = Flow.Renderers(_, _sandbox);
      flowAnalytics(_);
      flowGrowl(_);
      flowAutosave(_);
      _notebook = Flow.Notebook(_, _renderers);
      return {
        context: _,
        sandbox: _sandbox,
        view: _notebook
      };
    };
  }.call(this));
  // anonymous IIFE
  async();
  data();
  dataflow();
  dialogs();
  error();
  format();
  // anonymous IIFE
  // includes
  // src/core/modules/gui.coffee
  // and more 
  (function () {
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
    wrapValue = function (value, init) {
      if (value === void 0) {
        return Flow.Dataflow.signal(init);
      }
      if (Flow.Dataflow.isSignal(value)) {
        return value;
      }
      return Flow.Dataflow.signal(value);
    };
    wrapArray = function (elements) {
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
    control = function (type, opts) {
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
    content = function (type, opts) {
      var self;
      self = control(type, opts);
      self.value = wrapValue(opts.value, '');
      return self;
    };
    text = function (opts) {
      return content('text', opts);
    };
    html = function (opts) {
      return content('html', opts);
    };
    markdown = function (opts) {
      return content('markdown', opts);
    };
    checkbox = function (opts) {
      var self;
      self = control('checkbox', opts);
      self.value = wrapValue(opts.value, opts.value);
      return self;
    };
    dropdown = function (opts) {
      var self;
      self = control('dropdown', opts);
      self.options = opts.options || [];
      self.value = wrapValue(opts.value);
      self.caption = opts.caption || 'Choose...';
      return self;
    };
    listbox = function (opts) {
      var self;
      self = control('listbox', opts);
      self.options = opts.options || [];
      self.values = wrapArray(opts.values);
      return self;
    };
    textbox = function (opts) {
      var self;
      self = control('textbox', opts);
      self.value = wrapValue(opts.value, '');
      self.event = lodash.isString(opts.event) ? opts.event : null;
      return self;
    };
    textarea = function (opts) {
      var self;
      self = control('textarea', opts);
      self.value = wrapValue(opts.value, '');
      self.event = lodash.isString(opts.event) ? opts.event : null;
      self.rows = lodash.isNumber(opts.rows) ? opts.rows : 5;
      return self;
    };
    button = function (opts) {
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
  }.call(this));
  html();
  knockout();
  localStorage();
  // src/core/modules/marked.coffee IIFE
  // experience errors on first abstraction attempt
  // defer for now
  (function () {
    if ((typeof window !== 'undefined' && window !== null ? window.marked : void 0) == null) {
      return;
    }
    marked.setOptions({
      smartypants: true,
      highlight(code, lang) {
        if (window.hljs) {
          return window.hljs.highlightAuto(code, [lang]).value;
        }
        return code;
      }
    });
  }.call(this));
  // this is used many places
  // 179 matches across 29 files, in fact
  // defer for now
  (function () {
    Flow.Prelude = function () {
      var _always;
      var _copy;
      var _deepClone;
      var _isDefined;
      var _isFalsy;
      var _isTruthy;
      var _negative;
      var _never;
      var _remove;
      var _repeat;
      var _typeOf;
      var _words;
      _isDefined = function (value) {
        return !lodash.isUndefined(value);
      };
      _isTruthy = function (value) {
        if (value) {
          return true;
        }
        return false;
      };
      _isFalsy = function (value) {
        if (value) {
          return false;
        }
        return true;
      };
      _negative = function (value) {
        return !value;
      };
      _always = function () {
        return true;
      };
      _never = function () {
        return false;
      };
      _copy = function (array) {
        return array.slice(0);
      };
      _remove = function (array, element) {
        var index;
        if ((index = lodash.indexOf(array, element)) > -1) {
          return lodash.head(array.splice(index, 1));
        }
        return void 0;
      };
      _words = function (text) {
        return text.split(/\s+/);
      };
      _repeat = function (count, value) {
        var array;
        var i;
        var _i;
        array = [];
        for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
          array.push(value);
        }
        return array;
      };
      _typeOf = function (a) {
        var type;
        type = Object.prototype.toString.call(a);
        if (a === null) {
          return Flow.TNull;
        } else if (a === void 0) {
          return Flow.TUndefined;
        } else if (a === true || a === false || type === '[object Boolean]') {
          return Flow.TBoolean;
        }
        switch (type) {
          case '[object String]':
            return Flow.TString;
          case '[object Number]':
            return Flow.TNumber;
          case '[object Function]':
            return Flow.TFunction;
          case '[object Object]':
            return Flow.TObject;
          case '[object Array]':
            return Flow.TArray;
          case '[object Arguments]':
            return Flow.TArguments;
          case '[object Date]':
            return Flow.TDate;
          case '[object RegExp]':
            return Flow.TRegExp;
          case '[object Error]':
            return Flow.TError;
          default:
            return type;
        }
      };
      _deepClone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
      };
      return {
        isDefined: _isDefined,
        isTruthy: _isTruthy,
        isFalsy: _isFalsy,
        negative: _negative,
        always: _always,
        never: _never,
        copy: _copy,
        remove: _remove,
        words: _words,
        repeat: _repeat,
        typeOf: _typeOf,
        deepClone: _deepClone,
        stringify: JSON.stringify
      };
    }();
  }.call(this));
  types();
  coreUtils();
  // defer for now 
  (function () {
    H2O.Application = function (_) {
      h2oApplicationContext(_);
      return H2O.Proxy(_);
    };
  }.call(this));
  // abstracting out this IIFE produces an error
  // defer for now 
  (function () {
    H2O.Proxy = function (_) {
      var cacheModelBuilders;
      var composePath;
      var doDelete;
      var doGet;
      var doPost;
      var doPostJSON;
      var doPut;
      var doUpload;
      var download;
      var encodeArrayForPost;
      var encodeObject;
      var encodeObjectForPost;
      var getGridModelBuilderEndpoint;
      var getLines;
      var getModelBuilderEndpoint;
      var getModelBuilders;
      var http;
      var mapWithKey;
      var optsToString;
      var requestAbout;
      var requestAsDataFrame;
      var requestAsH2OFrameFromDF;
      var requestAsH2OFrameFromRDD;
      var requestAutoModelBuild;
      var requestCancelJob;
      var requestCloud;
      var requestColumnSummary;
      var requestCreateFrame;
      var requestDataFrames;
      var requestDeleteFrame;
      var requestDeleteModel;
      var requestDeleteObject;
      var requestEcho;
      var requestEndpoint;
      var requestEndpoints;
      var requestExec;
      var requestExportFrame;
      var requestExportModel;
      var requestFileGlob;
      var requestFlow;
      var requestFrame;
      var requestFrameSlice;
      var requestFrameSummary;
      var requestFrameSummarySlice;
      var requestFrameSummaryWithoutData;
      var requestFrames;
      var requestGrid;
      var requestGrids;
      var requestHelpContent;
      var requestHelpIndex;
      var requestImportFile;
      var requestImportFiles;
      var requestImportModel;
      var requestInspect;
      var requestIsStorageConfigured;
      var requestJob;
      var requestJobs;
      var requestLogFile;
      var requestModel;
      var requestModelBuild;
      var requestModelBuilder;
      var requestModelBuilders;
      var requestModelBuildersVisibility;
      var requestModelInputValidation;
      var requestModels;
      var requestNetworkTest;
      var requestObject;
      var requestObjectExists;
      var requestObjects;
      var requestPack;
      var requestPacks;
      var requestParseFiles;
      var requestParseSetup;
      var requestParseSetupPreview;
      var requestPartialDependence;
      var requestPartialDependenceData;
      var requestPojoPreview;
      var requestPredict;
      var requestPrediction;
      var requestPredictions;
      var requestProfile;
      var requestPutObject;
      var requestRDDs;
      var requestRemoveAll;
      var requestScalaCode;
      var requestScalaIntp;
      var requestSchema;
      var requestSchemas;
      var requestShutdown;
      var requestSplitFrame;
      var requestStackTrace;
      var requestTimeline;
      var requestUploadFile;
      var requestUploadObject;
      var requestWithOpts;
      var trackPath;
      var unwrap;
      var __gridModelBuilderEndpoints;
      var __modelBuilderEndpoints;
      var __modelBuilders;
      var _storageConfiguration;
      download = function (type, url, go) {
        if (url.substring(0, 1) === '/') {
          url = window.Flow.ContextPath + url.substring(1);
        }
        return $.ajax({
          dataType: type,
          url,
          success(data, status, xhr) {
            return go(null, data);
          },
          error(xhr, status, error) {
            return go(new Flow.Error(error));
          }
        });
      };
      optsToString = function (opts) {
        var str;
        if (opts != null) {
          str = ` with opts ${JSON.stringify(opts)}`;
          if (str.length > 50) {
            return `${str.substr(0, 50)}...`;
          }
          return str;
        }
        return '';
      };
      http = function (method, path, opts, go) {
        var req;
        if (path.substring(0, 1) === '/') {
          path = window.Flow.ContextPath + path.substring(1);
        }
        _.status('server', 'request', path);
        trackPath(path);
        req = function () {
          switch (method) {
            case 'GET':
              return $.getJSON(path);
            case 'POST':
              return $.post(path, opts);
            case 'POSTJSON':
              return $.ajax({
                url: path,
                type: 'POST',
                contentType: 'application/json',
                cache: false,
                data: JSON.stringify(opts)
              });
            case 'PUT':
              return $.ajax({
                url: path,
                type: method,
                data: opts
              });
            case 'DELETE':
              return $.ajax({
                url: path,
                type: method
              });
            case 'UPLOAD':
              return $.ajax({
                url: path,
                type: 'POST',
                data: opts,
                cache: false,
                contentType: false,
                processData: false
              });
          }
        }();
        req.done(function (data, status, xhr) {
          var error;
          _.status('server', 'response', path);
          try {
            return go(null, data);
          } catch (_error) {
            error = _error;
            return go(new Flow.Error(`Error processing ${method} ${path}`, error));
          }
        });
        return req.fail(function (xhr, status, error) {
          var cause;
          var meta;
          var response;
          var serverError;
          _.status('server', 'error', path);
          response = xhr.responseJSON;
          cause = (meta = response != null ? response.__meta : void 0) && (meta.schema_type === 'H2OError' || meta.schema_type === 'H2OModelBuilderError') ? (serverError = new Flow.Error(response.exception_msg), serverError.stack = `${response.dev_msg} (${response.exception_type})\n  ${response.stacktrace.join('\n  ')}`, serverError) : (error != null ? error.message : void 0) ? new Flow.Error(error.message) : status === 'error' && xhr.status === 0 ? new Flow.Error('Could not connect to H2O. Your H2O cloud is currently unresponsive.') : new Flow.Error(`HTTP connection failure: status=${status}, code=${xhr.status}, error=${(error || '?')}`);
          return go(new Flow.Error(`Error calling ${method} ${path}${optsToString(opts)}`, cause));
        });
      };
      doGet = function (path, go) {
        return http('GET', path, null, go);
      };
      doPost = function (path, opts, go) {
        return http('POST', path, opts, go);
      };
      doPostJSON = function (path, opts, go) {
        return http('POSTJSON', path, opts, go);
      };
      doPut = function (path, opts, go) {
        return http('PUT', path, opts, go);
      };
      doUpload = function (path, formData, go) {
        return http('UPLOAD', path, formData, go);
      };
      doDelete = function (path, go) {
        return http('DELETE', path, null, go);
      };
      trackPath = function (path) {
        var base;
        var e;
        var name;
        var other;
        var root;
        var version;
        var _ref;
        var _ref1;
        try {
          _ref = path.split('/'), root = _ref[0], version = _ref[1], name = _ref[2];
          _ref1 = name.split('?'), base = _ref1[0], other = _ref1[1];
          if (base !== 'Typeahead' && base !== 'Jobs') {
            _.trackEvent('api', base, version);
          }
        } catch (_error) {
          e = _error;
        }
      };
      mapWithKey = function (obj, f) {
        var key;
        var result;
        var value;
        result = [];
        for (key in obj) {
          if ({}.hasOwnProperty.call(obj, key)) {
            value = obj[key];
            result.push(f(value, key));
          }
        }
        return result;
      };
      composePath = function (path, opts) {
        var params;
        if (opts) {
          params = mapWithKey(opts, function (v, k) {
            return `${k}=${v}`;
          });
          return `${path}?${params.join('&')}`;
        }
        return path;
      };
      requestWithOpts = function (path, opts, go) {
        return doGet(composePath(path, opts), go);
      };
      encodeArrayForPost = function (array) {
        if (array) {
          if (array.length === 0) {
            return null;
          }
          return `[${lodash.map(array, element => { if (lodash.isNumber(element)) { return element; } return `"${element}"`; }).join(',')} ]`;
        }
        return null;
      };
      encodeObject = function (source) {
        var k;
        var target;
        var v;
        target = {};
        for (k in source) {
          if ({}.hasOwnProperty.call(source, k)) {
            v = source[k];
            target[k] = encodeURIComponent(v);
          }
        }
        return target;
      };
      encodeObjectForPost = function (source) {
        var k;
        var target;
        var v;
        target = {};
        for (k in source) {
          if ({}.hasOwnProperty.call(source, k)) {
            v = source[k];
            target[k] = lodash.isArray(v) ? encodeArrayForPost(v) : v;
          }
        }
        return target;
      };
      unwrap = function (go, transform) {
        return function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, transform(result));
        };
      };
      requestExec = function (ast, go) {
        return doPost('/99/Rapids', { ast }, function (error, result) {
          if (error) {
            return go(error);
          }
          if (result.error) {
            return go(new Flow.Error(result.error));
          }
          return go(null, result);
        });
      };
      requestInspect = function (key, go) {
        var opts;
        opts = { key: encodeURIComponent(key) };
        return requestWithOpts('/3/Inspect', opts, go);
      };
      requestCreateFrame = function (opts, go) {
        return doPost('/3/CreateFrame', opts, go);
      };
      requestSplitFrame = function (frameKey, splitRatios, splitKeys, go) {
        var opts;
        opts = {
          dataset: frameKey,
          ratios: encodeArrayForPost(splitRatios),
          dest_keys: encodeArrayForPost(splitKeys)
        };
        return doPost('/3/SplitFrame', opts, go);
      };
      requestFrames = function (go) {
        return doGet('/3/Frames', function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, result.frames);
        });
      };
      requestFrame = function (key, go) {
        return doGet(`/3/Frames/${encodeURIComponent(key)}`, unwrap(go, function (result) {
          return lodash.head(result.frames);
        }));
      };
      requestFrameSlice = function (key, searchTerm, offset, count, go) {
        return doGet(`/3/Frames/${encodeURIComponent(key)}?column_offset=${offset}&column_count=${count}`, unwrap(go, function (result) {
          return lodash.head(result.frames);
        }));
      };
      requestFrameSummary = function (key, go) {
        return doGet(`/3/Frames/${encodeURIComponent(key)}/summary`, unwrap(go, function (result) {
          return lodash.head(result.frames);
        }));
      };
      requestFrameSummarySlice = function (key, searchTerm, offset, count, go) {
        return doGet(`/3/Frames/${encodeURIComponent(key)}/summary?column_offset=${offset}&column_count=${count}&_exclude_fields=frames/columns/data,frames/columns/domain,frames/columns/histogram_bins,frames/columns/percentiles`, unwrap(go, function (result) {
          return lodash.head(result.frames);
        }));
      };
      requestFrameSummaryWithoutData = function (key, go) {
        return doGet(`/3/Frames/${encodeURIComponent(key)}/summary?_exclude_fields=frames/chunk_summary,frames/distribution_summary,frames/columns/data,frames/columns/domain,frames/columns/histogram_bins,frames/columns/percentiles`, function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, lodash.head(result.frames));
        });
      };
      requestDeleteFrame = function (key, go) {
        return doDelete(`/3/Frames/${encodeURIComponent(key)}`, go);
      };
      requestExportFrame = function (key, path, overwrite, go) {
        var params;
        params = {
          path,
          force: overwrite ? 'true' : 'false'
        };
        return doPost(`/3/Frames/${encodeURIComponent(key)}/export`, params, go);
      };
      requestColumnSummary = function (frameKey, column, go) {
        return doGet(`/3/Frames/${encodeURIComponent(frameKey)}/columns/${encodeURIComponent(column)}/summary`, unwrap(go, function (result) {
          return lodash.head(result.frames);
        }));
      };
      requestJobs = function (go) {
        return doGet('/3/Jobs', function (error, result) {
          if (error) {
            return go(new Flow.Error('Error fetching jobs', error));
          }
          return go(null, result.jobs);
        });
      };
      requestJob = function (key, go) {
        return doGet(`/3/Jobs/${encodeURIComponent(key)}`, function (error, result) {
          if (error) {
            return go(new Flow.Error(`Error fetching job \'${key}\'`, error));
          }
          return go(null, lodash.head(result.jobs));
        });
      };
      requestCancelJob = function (key, go) {
        return doPost(`/3/Jobs/${encodeURIComponent(key)}/cancel`, {}, function (error, result) {
          if (error) {
            return go(new Flow.Error(`Error canceling job \'${key}\'`, error));
          }
          return go(null);
        });
      };
      requestFileGlob = function (path, limit, go) {
        var opts;
        opts = {
          src: encodeURIComponent(path),
          limit
        };
        return requestWithOpts('/3/Typeahead/files', opts, go);
      };
      requestImportFiles = function (paths, go) {
        var tasks;
        tasks = lodash.map(paths, function (path) {
          return function (go) {
            return requestImportFile(path, go);
          };
        });
        return Flow.Async.iterate(tasks)(go);
      };
      requestImportFile = function (path, go) {
        var opts;
        opts = { path: encodeURIComponent(path) };
        return requestWithOpts('/3/ImportFiles', opts, go);
      };
      requestParseSetup = function (sourceKeys, go) {
        var opts;
        opts = { source_frames: encodeArrayForPost(sourceKeys) };
        return doPost('/3/ParseSetup', opts, go);
      };
      requestParseSetupPreview = function (sourceKeys, parseType, separator, useSingleQuotes, checkHeader, columnTypes, go) {
        var opts;
        opts = {
          source_frames: encodeArrayForPost(sourceKeys),
          parse_type: parseType,
          separator,
          single_quotes: useSingleQuotes,
          check_header: checkHeader,
          column_types: encodeArrayForPost(columnTypes)
        };
        return doPost('/3/ParseSetup', opts, go);
      };
      requestParseFiles = function (sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, go) {
        var opts;
        opts = {
          destination_frame: destinationKey,
          source_frames: encodeArrayForPost(sourceKeys),
          parse_type: parseType,
          separator,
          number_columns: columnCount,
          single_quotes: useSingleQuotes,
          column_names: encodeArrayForPost(columnNames),
          column_types: encodeArrayForPost(columnTypes),
          check_header: checkHeader,
          delete_on_done: deleteOnDone,
          chunk_size: chunkSize
        };
        return doPost('/3/Parse', opts, go);
      };
      requestPartialDependence = function (opts, go) {
        return doPost('/3/PartialDependence/', opts, go);
      };
      requestPartialDependenceData = function (key, go) {
        return doGet(`/3/PartialDependence/${encodeURIComponent(key)}`, function (error, result) {
          if (error) {
            return go(error, result);
          }
          return go(error, result);
        });
      };
      requestGrids = function (go, opts) {
        return doGet('/99/Grids', function (error, result) {
          if (error) {
            return go(error, result);
          }
          return go(error, result.grids);
        });
      };
      requestModels = function (go, opts) {
        return requestWithOpts('/3/Models', opts, function (error, result) {
          if (error) {
            return go(error, result);
          }
          return go(error, result.models);
        });
      };
      requestGrid = function (key, opts, go) {
        var params;
        params = void 0;
        if (opts) {
          params = {};
          if (opts.sort_by) {
            params.sort_by = encodeURIComponent(opts.sort_by);
          }
          if (opts.decreasing === true || opts.decreasing === false) {
            params.decreasing = opts.decreasing;
          }
        }
        return doGet(composePath(`/99/Grids/' + ${encodeURIComponent(key)}`, params), go);
      };
      requestModel = function (key, go) {
        return doGet(`/3/Models/${encodeURIComponent(key)}`, function (error, result) {
          if (error) {
            return go(error, result);
          }
          return go(error, lodash.head(result.models));
        });
      };
      requestPojoPreview = function (key, go) {
        return download('text', `/3/Models.java/${encodeURIComponent(key)}/preview`, go);
      };
      requestDeleteModel = function (key, go) {
        return doDelete(`/3/Models/${encodeURIComponent(key)}`, go);
      };
      requestImportModel = function (path, overwrite, go) {
        var opts;
        opts = {
          dir: path,
          force: overwrite
        };
        return doPost('/99/Models.bin/not_in_use', opts, go);
      };
      requestExportModel = function (key, path, overwrite, go) {
        return doGet(`/99/Models.bin/${encodeURIComponent(key)}?dir=${encodeURIComponent(path)}&force=${overwrite}`, go);
      };
      requestModelBuildersVisibility = function (go) {
        return doGet('/3/Configuration/ModelBuilders/visibility', unwrap(go, function (result) {
          return result.value;
        }));
      };
      __modelBuilders = null;
      __modelBuilderEndpoints = null;
      __gridModelBuilderEndpoints = null;
      cacheModelBuilders = function (modelBuilders) {
        var gridModelBuilderEndpoints;
        var modelBuilder;
        var modelBuilderEndpoints;
        var _i;
        var _len;
        modelBuilderEndpoints = {};
        gridModelBuilderEndpoints = {};
        for (_i = 0, _len = modelBuilders.length; _i < _len; _i++) {
          modelBuilder = modelBuilders[_i];
          modelBuilderEndpoints[modelBuilder.algo] = `/${modelBuilder.__meta.schema_version}/ModelBuilders/${modelBuilder.algo}`;
          gridModelBuilderEndpoints[modelBuilder.algo] = `/99/Grid/${modelBuilder.algo}`;
        }
        __modelBuilderEndpoints = modelBuilderEndpoints;
        __gridModelBuilderEndpoints = gridModelBuilderEndpoints;
        return __modelBuilders = modelBuilders;
      };
      getModelBuilders = function () {
        return __modelBuilders;
      };
      getModelBuilderEndpoint = function (algo) {
        return __modelBuilderEndpoints[algo];
      };
      getGridModelBuilderEndpoint = function (algo) {
        return __gridModelBuilderEndpoints[algo];
      };
      requestModelBuilders = function (go) {
        var modelBuilders;
        var visibility;
        if (modelBuilders = getModelBuilders()) {
          return go(null, modelBuilders);
        }
        visibility = 'Stable';
        return doGet('/3/ModelBuilders', unwrap(go, function (result) {
          var algo;
          var availableBuilders;
          var builder;
          var builders;
          builders = function () {
            var _ref;
            var _results;
            _ref = result.model_builders;
            _results = [];
            for (algo in _ref) {
              if ({}.hasOwnProperty.call(_ref, algo)) {
                builder = _ref[algo];
                _results.push(builder);
              }
            }
            return _results;
          }();
          availableBuilders = function () {
            var _i;
            var _j;
            var _len;
            var _len1;
            var _results;
            var _results1;
            switch (visibility) {
              case 'Stable':
                _results = [];
                for (_i = 0, _len = builders.length; _i < _len; _i++) {
                  builder = builders[_i];
                  if (builder.visibility === visibility) {
                    _results.push(builder);
                  }
                }
                return _results;
                // break; // no-unreachable
              case 'Beta':
                _results1 = [];
                for (_j = 0, _len1 = builders.length; _j < _len1; _j++) {
                  builder = builders[_j];
                  if (builder.visibility === visibility || builder.visibility === 'Stable') {
                    _results1.push(builder);
                  }
                }
                return _results1;
                // break; // no-unreachable
              default:
                return builders;
            }
          }();
          return cacheModelBuilders(availableBuilders);
        }));
      };
      requestModelBuilder = function (algo, go) {
        return doGet(getModelBuilderEndpoint(algo), go);
      };
      requestModelInputValidation = function (algo, parameters, go) {
        return doPost(`${getModelBuilderEndpoint(algo)}/parameters`, encodeObjectForPost(parameters), go);
      };
      requestModelBuild = function (algo, parameters, go) {
        _.trackEvent('model', algo);
        if (parameters.hyper_parameters) {
          parameters.hyper_parameters = Flow.Prelude.stringify(parameters.hyper_parameters);
          if (parameters.search_criteria) {
            parameters.search_criteria = Flow.Prelude.stringify(parameters.search_criteria);
          }
          return doPost(getGridModelBuilderEndpoint(algo), encodeObjectForPost(parameters), go);
        }
        return doPost(getModelBuilderEndpoint(algo), encodeObjectForPost(parameters), go);
      };
      requestAutoModelBuild = function (parameters, go) {
        return doPostJSON('/3/AutoMLBuilder', parameters, go);
      };
      requestPredict = function (destinationKey, modelKey, frameKey, options, go) {
        var opt;
        var opts;
        opts = {};
        if (destinationKey) {
          opts.predictions_frame = destinationKey;
        }
        if (void 0 !== (opt = options.reconstruction_error)) {
          opts.reconstruction_error = opt;
        }
        if (void 0 !== (opt = options.deep_features_hidden_layer)) {
          opts.deep_features_hidden_layer = opt;
        }
        if (void 0 !== (opt = options.leaf_node_assignment)) {
          opts.leaf_node_assignment = opt;
        }
        if (void 0 !== (opt = options.exemplar_index)) {
          opts.exemplar_index = opt;
        }
        return doPost(`/3/Predictions/models/${encodeURIComponent(modelKey)}/frames/${encodeURIComponent(frameKey)}`, opts, function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, result);
        });
      };
      requestPrediction = function (modelKey, frameKey, go) {
        return doGet(`/3/ModelMetrics/models/${encodeURIComponent(modelKey)}/frames/${encodeURIComponent(frameKey)}`, function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, result);
        });
      };
      requestPredictions = function (modelKey, frameKey, _go) {
        var go;
        go = function (error, result) {
          var prediction;
          var predictions;
          if (error) {
            return _go(error);
          }
          predictions = function () {
            var _i;
            var _len;
            var _ref;
            var _results;
            _ref = result.model_metrics;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              prediction = _ref[_i];
              if (modelKey && prediction.model.name !== modelKey) {
                _results.push(null);
              } else if (frameKey && prediction.frame.name !== frameKey) {
                _results.push(null);
              } else {
                _results.push(prediction);
              }
            }
            return _results;
          }();
          return _go(null, function () {
            var _i;
            var _len;
            var _results;
            _results = [];
            for (_i = 0, _len = predictions.length; _i < _len; _i++) {
              prediction = predictions[_i];
              if (prediction) {
                _results.push(prediction);
              }
            }
            return _results;
          }());
        };
        if (modelKey && frameKey) {
          return doGet(`/3/ModelMetrics/models/${encodeURIComponent(modelKey)}/frames/'${encodeURIComponent(frameKey)}`, go);
        } else if (modelKey) {
          return doGet(`/3/ModelMetrics/models/${encodeURIComponent(modelKey)}`, go);
        } else if (frameKey) {
          return doGet(`/3/ModelMetrics/frames/${encodeURIComponent(frameKey)}`, go);
        }
        return doGet('/3/ModelMetrics', go);
      };
      _storageConfiguration = null;
      requestIsStorageConfigured = function (go) {
        if (_storageConfiguration) {
          return go(null, _storageConfiguration.isConfigured);
        }
        return doGet('/3/NodePersistentStorage/configured', function (error, result) {
          _storageConfiguration = { isConfigured: error ? false : result.configured };
          return go(null, _storageConfiguration.isConfigured);
        });
      };
      requestObjects = function (type, go) {
        return doGet(`/3/NodePersistentStorage/${encodeURIComponent(type)}`, unwrap(go, function (result) {
          return result.entries;
        }));
      };
      requestObjectExists = function (type, name, go) {
        return doGet(`/3/NodePersistentStorage/categories/${encodeURIComponent(type)}/names/${encodeURIComponent(name)}/exists`, function (error, result) {
          return go(null, error ? false : result.exists);
        });
      };
      requestObject = function (type, name, go) {
        return doGet(`/3/NodePersistentStorage/${encodeURIComponent(type)}/${encodeURIComponent(name)}`, unwrap(go, function (result) {
          return JSON.parse(result.value);
        }));
      };
      requestDeleteObject = function (type, name, go) {
        return doDelete(`/3/NodePersistentStorage/${encodeURIComponent(type)}/${encodeURIComponent(name)}`, go);
      };
      requestPutObject = function (type, name, value, go) {
        var uri;
        uri = `/3/NodePersistentStorage/${encodeURIComponent(type)}`;
        if (name) {
          uri += `/${encodeURIComponent(name)}`;
        }
        return doPost(uri, { value: JSON.stringify(value, null, 2) }, unwrap(go, function (result) {
          return result.name;
        }));
      };
      requestUploadObject = function (type, name, formData, go) {
        var uri;
        uri = `/3/NodePersistentStorage.bin/${encodeURIComponent(type)}`;
        if (name) {
          uri += `/${encodeURIComponent(name)}`;
        }
        return doUpload(uri, formData, unwrap(go, function (result) {
          return result.name;
        }));
      };
      requestUploadFile = function (key, formData, go) {
        return doUpload(`/3/PostFile?destination_frame=${encodeURIComponent(key)}`, formData, go);
      };
      requestCloud = function (go) {
        return doGet('/3/Cloud', go);
      };
      requestTimeline = function (go) {
        return doGet('/3/Timeline', go);
      };
      requestProfile = function (depth, go) {
        return doGet(`/3/Profiler?depth=${depth}`, go);
      };
      requestStackTrace = function (go) {
        return doGet('/3/JStack', go);
      };
      requestRemoveAll = function (go) {
        return doDelete('/3/DKV', go);
      };
      requestEcho = function (message, go) {
        return doPost('/3/LogAndEcho', { message }, go);
      };
      requestLogFile = function (nodeIndex, fileType, go) {
        return doGet(`/3/Logs/nodes/${nodeIndex}/files/${fileType}`, go);
      };
      requestNetworkTest = function (go) {
        return doGet('/3/NetworkTest', go);
      };
      requestAbout = function (go) {
        return doGet('/3/About', go);
      };
      requestShutdown = function (go) {
        return doPost('/3/Shutdown', {}, go);
      };
      requestEndpoints = function (go) {
        return doGet('/3/Metadata/endpoints', go);
      };
      requestEndpoint = function (index, go) {
        return doGet(`/3/Metadata/endpoints/${index}`, go);
      };
      requestSchemas = function (go) {
        return doGet('/3/Metadata/schemas', go);
      };
      requestSchema = function (name, go) {
        return doGet(`/3/Metadata/schemas/${encodeURIComponent(name)}`, go);
      };
      getLines = function (data) {
        return lodash.filter(data.split('\n'), function (line) {
          if (line.trim()) {
            return true;
          }
          return false;
        });
      };
      requestPacks = function (go) {
        return download('text', '/flow/packs/index.list', unwrap(go, getLines));
      };
      requestPack = function (packName, go) {
        return download('text', `/flow/packs/${encodeURIComponent(packName)}/index.list`, unwrap(go, getLines));
      };
      requestFlow = function (packName, flowName, go) {
        return download('json', `/flow/packs/${encodeURIComponent(packName)}/${encodeURIComponent(flowName)}`, go);
      };
      requestHelpIndex = function (go) {
        return download('json', '/flow/help/catalog.json', go);
      };
      requestHelpContent = function (name, go) {
        return download('text', `/flow/help/${name}.html`, go);
      };
      requestRDDs = function (go) {
        return doGet('/3/RDDs', go);
      };
      requestDataFrames = function (go) {
        return doGet('/3/dataframes', go);
      };
      requestScalaIntp = function (go) {
        return doPost('/3/scalaint', {}, go);
      };
      requestScalaCode = function (session_id, code, go) {
        return doPost(`/3/scalaint/${session_id}`, { code }, go);
      };
      requestAsH2OFrameFromRDD = function (rdd_id, name, go) {
        if (name === void 0) {
          return doPost(`/3/RDDs/${rdd_id}/h2oframe`, {}, go);
        }
        return doPost(`/3/RDDs/${rdd_id}/h2oframe`, { h2oframe_id: name }, go);
      };
      requestAsH2OFrameFromDF = function (df_id, name, go) {
        if (name === void 0) {
          return doPost(`/3/dataframes/${df_id}/h2oframe`, {}, go);
        }
        return doPost(`/3/dataframes/${df_id}/h2oframe`, { h2oframe_id: name }, go);
      };
      requestAsDataFrame = function (hf_id, name, go) {
        if (name === void 0) {
          return doPost(`/3/h2oframes/${hf_id}/dataframe`, {}, go);
        }
        return doPost(`/3/h2oframes/${hf_id}/dataframe`, { dataframe_id: name }, go);
      };
      Flow.Dataflow.link(_.requestInspect, requestInspect);
      Flow.Dataflow.link(_.requestCreateFrame, requestCreateFrame);
      Flow.Dataflow.link(_.requestSplitFrame, requestSplitFrame);
      Flow.Dataflow.link(_.requestFrames, requestFrames);
      Flow.Dataflow.link(_.requestFrame, requestFrame);
      Flow.Dataflow.link(_.requestFrameSlice, requestFrameSlice);
      Flow.Dataflow.link(_.requestFrameSummary, requestFrameSummary);
      Flow.Dataflow.link(_.requestFrameSummaryWithoutData, requestFrameSummaryWithoutData);
      Flow.Dataflow.link(_.requestFrameSummarySlice, requestFrameSummarySlice);
      Flow.Dataflow.link(_.requestDeleteFrame, requestDeleteFrame);
      Flow.Dataflow.link(_.requestExportFrame, requestExportFrame);
      Flow.Dataflow.link(_.requestColumnSummary, requestColumnSummary);
      Flow.Dataflow.link(_.requestJobs, requestJobs);
      Flow.Dataflow.link(_.requestJob, requestJob);
      Flow.Dataflow.link(_.requestCancelJob, requestCancelJob);
      Flow.Dataflow.link(_.requestFileGlob, requestFileGlob);
      Flow.Dataflow.link(_.requestImportFiles, requestImportFiles);
      Flow.Dataflow.link(_.requestImportFile, requestImportFile);
      Flow.Dataflow.link(_.requestParseSetup, requestParseSetup);
      Flow.Dataflow.link(_.requestParseSetupPreview, requestParseSetupPreview);
      Flow.Dataflow.link(_.requestParseFiles, requestParseFiles);
      Flow.Dataflow.link(_.requestPartialDependence, requestPartialDependence);
      Flow.Dataflow.link(_.requestPartialDependenceData, requestPartialDependenceData);
      Flow.Dataflow.link(_.requestGrids, requestGrids);
      Flow.Dataflow.link(_.requestModels, requestModels);
      Flow.Dataflow.link(_.requestGrid, requestGrid);
      Flow.Dataflow.link(_.requestModel, requestModel);
      Flow.Dataflow.link(_.requestPojoPreview, requestPojoPreview);
      Flow.Dataflow.link(_.requestDeleteModel, requestDeleteModel);
      Flow.Dataflow.link(_.requestImportModel, requestImportModel);
      Flow.Dataflow.link(_.requestExportModel, requestExportModel);
      Flow.Dataflow.link(_.requestModelBuilder, requestModelBuilder);
      Flow.Dataflow.link(_.requestModelBuilders, requestModelBuilders);
      Flow.Dataflow.link(_.requestModelBuild, requestModelBuild);
      Flow.Dataflow.link(_.requestModelInputValidation, requestModelInputValidation);
      Flow.Dataflow.link(_.requestAutoModelBuild, requestAutoModelBuild);
      Flow.Dataflow.link(_.requestPredict, requestPredict);
      Flow.Dataflow.link(_.requestPrediction, requestPrediction);
      Flow.Dataflow.link(_.requestPredictions, requestPredictions);
      Flow.Dataflow.link(_.requestObjects, requestObjects);
      Flow.Dataflow.link(_.requestObject, requestObject);
      Flow.Dataflow.link(_.requestObjectExists, requestObjectExists);
      Flow.Dataflow.link(_.requestDeleteObject, requestDeleteObject);
      Flow.Dataflow.link(_.requestPutObject, requestPutObject);
      Flow.Dataflow.link(_.requestUploadObject, requestUploadObject);
      Flow.Dataflow.link(_.requestUploadFile, requestUploadFile);
      Flow.Dataflow.link(_.requestCloud, requestCloud);
      Flow.Dataflow.link(_.requestTimeline, requestTimeline);
      Flow.Dataflow.link(_.requestProfile, requestProfile);
      Flow.Dataflow.link(_.requestStackTrace, requestStackTrace);
      Flow.Dataflow.link(_.requestRemoveAll, requestRemoveAll);
      Flow.Dataflow.link(_.requestEcho, requestEcho);
      Flow.Dataflow.link(_.requestLogFile, requestLogFile);
      Flow.Dataflow.link(_.requestNetworkTest, requestNetworkTest);
      Flow.Dataflow.link(_.requestAbout, requestAbout);
      Flow.Dataflow.link(_.requestShutdown, requestShutdown);
      Flow.Dataflow.link(_.requestEndpoints, requestEndpoints);
      Flow.Dataflow.link(_.requestEndpoint, requestEndpoint);
      Flow.Dataflow.link(_.requestSchemas, requestSchemas);
      Flow.Dataflow.link(_.requestSchema, requestSchema);
      Flow.Dataflow.link(_.requestPacks, requestPacks);
      Flow.Dataflow.link(_.requestPack, requestPack);
      Flow.Dataflow.link(_.requestFlow, requestFlow);
      Flow.Dataflow.link(_.requestHelpIndex, requestHelpIndex);
      Flow.Dataflow.link(_.requestHelpContent, requestHelpContent);
      Flow.Dataflow.link(_.requestExec, requestExec);
      Flow.Dataflow.link(_.requestRDDs, requestRDDs);
      Flow.Dataflow.link(_.requestDataFrames, requestDataFrames);
      Flow.Dataflow.link(_.requestScalaIntp, requestScalaIntp);
      Flow.Dataflow.link(_.requestScalaCode, requestScalaCode);
      Flow.Dataflow.link(_.requestAsH2OFrameFromDF, requestAsH2OFrameFromDF);
      Flow.Dataflow.link(_.requestAsH2OFrameFromRDD, requestAsH2OFrameFromRDD);
      return Flow.Dataflow.link(_.requestAsDataFrame, requestAsDataFrame);
    };
  }.call(this));
  routines();
  util();
  imputeInput();
  jobOutput();
  modelInput();
  parseInput();
}).call(this);

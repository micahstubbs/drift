export function help() {
  var lodash = window._;
  var Flow = window.Flow;
  var _catalog;
  var _homeContent;
  var _homeMarkdown;
  var _index;
  _catalog = null;
  _index = {};
  _homeContent = null;
  _homeMarkdown = '<blockquote>\nUsing Flow for the first time?\n<br/>\n<div style=\'margin-top:10px\'>\n  <button type=\'button\' data-action=\'get-flow\' data-pack-name=\'examples\' data-flow-name=\'QuickStartVideos.flow\' class=\'flow-button\'><i class=\'fa fa-file-movie-o\'></i><span>Quickstart Videos</span>\n  </button>\n</div>\n</blockquote>\n\nOr, <a href=\'#\' data-action=\'get-pack\' data-pack-name=\'examples\'>view example Flows</a> to explore and learn H<sub>2</sub>O.\n\n###### Star H2O on Github!\n\n<iframe src="https://ghbtns.com/github-btn.html?user=h2oai&repo=h2o-3&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>\n\n###### General\n\n%HELP_TOPICS%\n\n###### Examples\n\nFlow packs are a great way to explore and learn H<sub>2</sub>O. Try out these Flows and run them in your browser.<br/><a href=\'#\' data-action=\'get-packs\'>Browse installed packs...</a>\n\n###### H<sub>2</sub>O REST API\n\n- <a href=\'#\' data-action=\'endpoints\'>Routes</a>\n- <a href=\'#\' data-action=\'schemas\'>Schemas</a>\n';
  Flow.Help = _ => {
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
    goTo = index => {
      var content;
      content = _history[_historyIndex = index];
      $('a, button', $(content)).each(function (i) {
        var $a;
        var action;
        $a = $(this);
        if (action = $a.attr('data-action')) {
          return $a.click(() => performAction(action, $a));
        }
      });
      _content(content);
      _canGoForward(_historyIndex < _history.length - 1);
      _canGoBack(_historyIndex > 0);
    };
    goBack = () => {
      if (_historyIndex > 0) {
        return goTo(_historyIndex - 1);
      }
    };
    goForward = () => {
      if (_historyIndex < _history.length - 1) {
        return goTo(_historyIndex + 1);
      }
    };
    displayHtml = content => {
      if (_historyIndex < _history.length - 1) {
        _history.splice(_historyIndex + 1, _history.length - (_historyIndex + 1), content);
      } else {
        _history.push(content);
      }
      return goTo(_history.length - 1);
    };
    fixImageSources = html => html.replace(/\s+src\s*=\s*"images\//g, ' src="help/images/');
    performAction = (action, $el) => {
      var packName;
      var routeIndex;
      var schemaName;
      var topic;
      switch (action) {
        case 'help':
          topic = _index[$el.attr('data-topic')];
          _.requestHelpContent(topic.name, (error, html) => {
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
          _.requestPacks((error, packNames) => {
            if (!error) {
              return displayPacks(lodash.filter(packNames, packName => packName !== 'test'));
            }
          });
          break;
        case 'get-pack':
          packName = $el.attr('data-pack-name');
          _.requestPack(packName, (error, flowNames) => {
            if (!error) {
              return displayFlows(packName, flowNames);
            }
          });
          break;
        case 'get-flow':
          _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
            acceptCaption: 'Load Notebook',
            declineCaption: 'Cancel'
          }, accept => {
            var flowName;
            if (accept) {
              packName = $el.attr('data-pack-name');
              flowName = $el.attr('data-flow-name');
              if (H2O.Util.validateFileExtension(flowName, '.flow')) {
                return _.requestFlow(packName, flowName, (error, flow) => {
                  if (!error) {
                    return _.open(H2O.Util.getFileBaseName(flowName, '.flow'), flow);
                  }
                });
              }
            }
          });
          break;
        case 'endpoints':
          _.requestEndpoints((error, response) => {
            if (!error) {
              return displayEndpoints(response.routes);
            }
          });
          break;
        case 'endpoint':
          routeIndex = $el.attr('data-index');
          _.requestEndpoint(routeIndex, (error, response) => {
            if (!error) {
              return displayEndpoint(lodash.head(response.routes));
            }
          });
          break;
        case 'schemas':
          _.requestSchemas((error, response) => {
            if (!error) {
              return displaySchemas(lodash.sortBy(response.schemas, schema => schema.name));
            }
          });
          break;
        case 'schema':
          schemaName = $el.attr('data-schema');
          _.requestSchema(schemaName, (error, response) => {
            if (!error) {
              return displaySchema(lodash.head(response.schemas));
            }
          });
      }
    };
    buildToc = nodes => {
      var a;
      var li;
      var ul;
      var _ref;
      _ref = Flow.HTML.template('ul', 'li', 'a href=\'#\' data-action=\'help\' data-topic=\'$1\''), ul = _ref[0], li = _ref[1], a = _ref[2];
      return ul(lodash.map(nodes, node => li(a(node.title, node.name))));
    };
    buildTopics = (index, topics) => {
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
    displayPacks = packNames => {
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
        div(lodash.map(packNames, packName => p([
          i(),
          a(packName, packName)
        ])))
      ])));
    };
    displayFlows = (packName, flowNames) => {
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
        div(lodash.map(flowNames, flowName => p([
          i(),
          a(flowName, flowName)
        ])))
      ])));
    };
    displayEndpoints = routes => {
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
    goHome = () => displayHtml(Flow.HTML.render('div', _homeContent));
    displayEndpoint = route => {
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
    displaySchemas = schemas => {
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
        ul((() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = schemas.length; _i < _len; _i++) {
            schema = schemas[_i];
            _results.push(li(`${action(code(schema.name), schema.name)} ${variable(lodash.escape(schema.type))}`));
          }
          return _results;
        })())
      ];
      return displayHtml(Flow.HTML.render('div', div(els)));
    };
    displaySchema = schema => {
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
    initialize = catalog => {
      _catalog = catalog;
      buildTopics(_index, _catalog);
      _homeContent = marked(_homeMarkdown).replace('%HELP_TOPICS%', buildToc(_catalog));
      return goHome();
    };
    Flow.Dataflow.link(_.ready, () => _.requestHelpIndex((error, catalog) => {
      if (!error) {
        return initialize(catalog);
      }
    }));
    return {
      content: _content,
      goHome,
      goBack,
      canGoBack: _canGoBack,
      goForward,
      canGoForward: _canGoForward
    };
  };
}

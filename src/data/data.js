export function data() {
  var lodash = window._;
  var Flow = window.Flow;
  var combineRanges;
  var computeRange;
  var createAbstractVariable;
  var createCompiledPrototype;
  var createFactor;
  var createNumericVariable;
  var createRecordConstructor;
  var createTable;
  var createVariable;
  var factor;
  var includeZeroInRange;
  var nextPrototypeName;
  var permute;
  var _prototypeCache;
  var _prototypeId;
  var __slice = [].slice;
  _prototypeId = 0;
  nextPrototypeName = function () {
    return `Map${++_prototypeId}`;
  };
  _prototypeCache = {};
  createCompiledPrototype = function (attrs) {
    var attr;
    var cacheKey;
    var i;
    var inits;
    var params;
    var proto;
    var prototypeName;
    cacheKey = attrs.join('\0');
    if (proto = _prototypeCache[cacheKey]) {
      return proto;
    }
    params = function () {
      var _i;
      var _ref;
      var _results;
      _results = [];
      for (i = _i = 0, _ref = attrs.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
        _results.push(`a${i}`);
      }
      return _results;
    }();
    inits = function () {
      var _i;
      var _len;
      var _results;
      _results = [];
      for (i = _i = 0, _len = attrs.length; _i < _len; i = ++_i) {
        attr = attrs[i];
        _results.push(`this[${JSON.stringify(attr)}]=a${i};`);
      }
      return _results;
    }();
    prototypeName = nextPrototypeName();
    return _prototypeCache[cacheKey] = new Function(`function ${prototypeName}(${params.join(',')}){${inits.join('')}} return ${prototypeName};`)();
  };
  createRecordConstructor = function (variables) {
    var variable;
    return createCompiledPrototype(function () {
      var _i;
      var _len;
      var _results;
      _results = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        _results.push(variable.label);
      }
      return _results;
    }());
  };
  createTable = function (opts) {
    var description;
    var expand;
    var fill;
    var label;
    var meta;
    var rows;
    var schema;
    var variable;
    var variables;
    var _i;
    var _len;
    label = opts.label, description = opts.description, variables = opts.variables, rows = opts.rows, meta = opts.meta;
    if (!description) {
      description = 'No description available.';
    }
    schema = {};
    for (_i = 0, _len = variables.length; _i < _len; _i++) {
      variable = variables[_i];
      schema[variable.label] = variable;
    }
    fill = function (i, go) {
      _fill(i, function (error, result) {
        var index;
        var startIndex;
        var value;
        var _j;
        var _len1;
        if (error) {
          return go(error);
        }
        startIndex = result.index, lodash.values = result.values;
        for (index = _j = 0, _len1 = lodash.values.length; _j < _len1; index = ++_j) {
          value = lodash.values[index];
          rows[startIndex + index] = lodash.values[index];
        }
        return go(null);
      });
    };
    expand = function (...args) {
      var type;
      var types;
      var _j;
      var _len1;
      var _results;
      types = args.length >= 1 ? __slice.call(args, 0) : [];
      _results = [];
      for (_j = 0, _len1 = types.length; _j < _len1; _j++) {
        type = types[_j];
        label = lodash.uniqueId('__flow_variable_');
        _results.push(schema[label] = createNumericVariable(label));
      }
      return _results;
    };
    return {
      label,
      description,
      schema,
      variables,
      rows,
      meta,
      fill,
      expand,
      _is_table_: true
    };
  };
  includeZeroInRange = function (range) {
    var hi;
    var lo;
    lo = range[0], hi = range[1];
    if (lo > 0 && hi > 0) {
      return [
        0,
        hi
      ];
    } else if (lo < 0 && hi < 0) {
      return [
        lo,
        0
      ];
    }
    return range;
  };
  combineRanges = function (...args) {
    var hi;
    var lo;
    var range;
    var ranges;
    var value;
    var _i;
    var _len;
    ranges = args.length >= 1 ? __slice.call(args, 0) : [];
    lo = Number.POSITIVE_INFINITY;
    hi = Number.NEGATIVE_INFINITY;
    for (_i = 0, _len = ranges.length; _i < _len; _i++) {
      range = ranges[_i];
      if (lo > (value = range[0])) {
        lo = value;
      }
      if (hi < (value = range[1])) {
        hi = value;
      }
    }
    return [
      lo,
      hi
    ];
  };
  computeRange = function (rows, attr) {
    var hi;
    var lo;
    var row;
    var value;
    var _i;
    var _len;
    if (rows.length) {
      lo = Number.POSITIVE_INFINITY;
      hi = Number.NEGATIVE_INFINITY;
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        value = row[attr];
        if (value < lo) {
          lo = value;
        }
        if (value > hi) {
          hi = value;
        }
      }
      return [
        lo,
        hi
      ];
    }
    return [
      -1,
      1
    ];
  };
  permute = function (array, indices) {
    var i;
    var index;
    var permuted;
    var _i;
    var _len;
    permuted = new Array(array.length);
    for (i = _i = 0, _len = indices.length; _i < _len; i = ++_i) {
      index = indices[i];
      permuted[i] = array[index];
    }
    return permuted;
  };
  createAbstractVariable = function (_label, _type, _domain, _format, _read) {
    return {
      label: _label,
      type: _type,
      domain: _domain || [],
      format: _format || lodash.identity,
      read: _read
    };
  };
  createNumericVariable = function (_label, _domain, _format, _read) {
    var self;
    self = createAbstractVariable(_label, Flow.TNumber, _domain || [
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY
    ], _format, _read);
    if (!self.read) {
      self.read = function (datum) {
        if (datum < self.domain[0]) {
          self.domain[0] = datum;
        }
        if (datum > self.domain[1]) {
          self.domain[1] = datum;
        }
        return datum;
      };
    }
    return self;
  };
  createVariable = function (_label, _type, _domain, _format, _read) {
    if (_type === Flow.TNumber) {
      return createNumericVariable(_label, _domain, _format, _read);
    }
    return createAbstractVariable(_label, _type, _domain, _format, _read);
  };
  createFactor = function (_label, _domain, _format, _read) {
    var level;
    var self;
    var _i;
    var _id;
    var _len;
    var _levels;
    var _ref;
    self = createAbstractVariable(_label, Flow.TFactor, _domain || [], _format, _read);
    _id = 0;
    _levels = {};
    if (self.domain.length) {
      _ref = self.domain;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        level = _ref[_i];
        _levels[level] = _id++;
      }
    }
    if (!self.read) {
      self.read = function (datum) {
        var id;
        level = datum === void 0 || datum === null ? 'null' : datum;
        if (void 0 === (id = _levels[level])) {
          _levels[level] = id = _id++;
          self.domain.push(level);
        }
        return id;
      };
    }
    return self;
  };
  factor = function (array) {
    var data;
    var domain;
    var i;
    var id;
    var level;
    var levels;
    var _i;
    var _id;
    var _len;
    _id = 0;
    levels = {};
    domain = [];
    data = new Array(array.length);
    for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
      level = array[i];
      if (void 0 === (id = levels[level])) {
        levels[level] = id = _id++;
        domain.push(level);
      }
      data[i] = id;
    }
    return [
      domain,
      data
    ];
  };
  Flow.Data = {
    Table: createTable,
    Variable: createVariable,
    Factor: createFactor,
    computeColumnInterpretation(type) {
      if (type === Flow.TNumber) {
        return 'c';
      } else if (type === Flow.TFactor) {
        return 'd';
      }
      return 't';
    },
    Record: createRecordConstructor,
    computeRange,
    combineRanges,
    includeZeroInRange,
    factor,
    permute
  };
}

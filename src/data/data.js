export function data() {
  const lodash = window._;
  const Flow = window.Flow;
  let combineRanges;
  let computeRange;
  let createAbstractVariable;
  let createCompiledPrototype;
  let createFactor;
  let createNumericVariable;
  let createRecordConstructor;
  let createTable;
  let createVariable;
  let factor;
  let includeZeroInRange;
  let nextPrototypeName;
  let permute;
  let _prototypeCache;
  let _prototypeId;
  const __slice = [].slice;
  _prototypeId = 0;
  nextPrototypeName = () => `Map${++_prototypeId}`;
  _prototypeCache = {};
  createCompiledPrototype = attrs => {
    let attr;
    let cacheKey;
    let i;
    let inits;
    let params;
    let proto;
    let prototypeName;
    cacheKey = attrs.join('\0');
    if (proto = _prototypeCache[cacheKey]) {
      return proto;
    }
    params = (() => {
      let _i;
      let _ref;
      let _results;
      _results = [];
      for (i = _i = 0, _ref = attrs.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
        _results.push(`a${i}`);
      }
      return _results;
    })();
    inits = (() => {
      let _i;
      let _len;
      let _results;
      _results = [];
      for (i = _i = 0, _len = attrs.length; _i < _len; i = ++_i) {
        attr = attrs[i];
        _results.push(`this[${JSON.stringify(attr)}]=a${i};`);
      }
      return _results;
    })();
    prototypeName = nextPrototypeName();
    return _prototypeCache[cacheKey] = new Function(`function ${prototypeName}(${params.join(',')}){${inits.join('')}} return ${prototypeName};`)();
  };
  createRecordConstructor = variables => {
    let variable;
    return createCompiledPrototype((() => {
      let _i;
      let _len;
      let _results;
      _results = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        _results.push(variable.label);
      }
      return _results;
    })());
  };
  createTable = opts => {
    let description;
    let expand;
    let fill;
    let label;
    let meta;
    let rows;
    let schema;
    let variable;
    let variables;
    let _i;
    let _len;
    label = opts.label, description = opts.description, variables = opts.variables, rows = opts.rows, meta = opts.meta;
    if (!description) {
      description = 'No description available.';
    }
    schema = {};
    for (_i = 0, _len = variables.length; _i < _len; _i++) {
      variable = variables[_i];
      schema[variable.label] = variable;
    }
    fill = (i, go) => {
      _fill(i, (error, result) => {
        let index;
        let startIndex;
        let value;
        let _j;
        let _len1;
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
    expand = (...args) => {
      let type;
      let types;
      let _j;
      let _len1;
      let _results;
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
  includeZeroInRange = range => {
    let hi;
    let lo;
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
  combineRanges = (...args) => {
    let hi;
    let lo;
    let range;
    let ranges;
    let value;
    let _i;
    let _len;
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
  computeRange = (rows, attr) => {
    let hi;
    let lo;
    let row;
    let value;
    let _i;
    let _len;
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
  permute = (array, indices) => {
    let i;
    let index;
    let permuted;
    let _i;
    let _len;
    permuted = new Array(array.length);
    for (i = _i = 0, _len = indices.length; _i < _len; i = ++_i) {
      index = indices[i];
      permuted[i] = array[index];
    }
    return permuted;
  };
  createAbstractVariable = (_label, _type, _domain, _format, _read) => ({
    label: _label,
    type: _type,
    domain: _domain || [],
    format: _format || lodash.identity,
    read: _read
  });
  createNumericVariable = (_label, _domain, _format, _read) => {
    let self;
    self = createAbstractVariable(_label, 'Number', _domain || [
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY
    ], _format, _read);
    if (!self.read) {
      self.read = datum => {
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
  createVariable = (_label, _type, _domain, _format, _read) => {
    if (_type === 'Number') {
      return createNumericVariable(_label, _domain, _format, _read);
    }
    return createAbstractVariable(_label, _type, _domain, _format, _read);
  };
  createFactor = (_label, _domain, _format, _read) => {
    let level;
    let self;
    let _i;
    let _id;
    let _len;
    let _levels;
    let _ref;
    self = createAbstractVariable(_label, 'Factor', _domain || [], _format, _read);
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
      self.read = datum => {
        let id;
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
  factor = array => {
    let data;
    let domain;
    let i;
    let id;
    let level;
    let levels;
    let _i;
    let _id;
    let _len;
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
      if (type === 'Number') {
        return 'c';
      } else if (type === 'Factor') {
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

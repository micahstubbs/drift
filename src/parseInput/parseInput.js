import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function parseInput() {
  var lodash = window._;
  var Flow = window.Flow;
  var MaxItemsPerPage;
  var dataTypes;
  var parseDelimiters;
  var parseTypes;
  MaxItemsPerPage = 15;
  parseTypes = lodash.map([
    'AUTO',
    'ARFF',
    'XLS',
    'XLSX',
    'CSV',
    'SVMLight',
    'ORC',
    'AVRO',
    'PARQUET'
  ], type => ({
    type,
    caption: type
  }));
  parseDelimiters = (() => {
    var characterDelimiters;
    var createDelimiter;
    var otherDelimiters;
    var whitespaceDelimiters;
    var whitespaceSeparators;
    whitespaceSeparators = [
      'NULL',
      'SOH (start of heading)',
      'STX (start of text)',
      'ETX (end of text)',
      'EOT (end of transmission)',
      'ENQ (enquiry)',
      'ACK (acknowledge)',
      'BEL \'\\a\' (bell)',
      'BS  \'\\b\' (backspace)',
      'HT  \'\\t\' (horizontal tab)',
      'LF  \'\\n\' (new line)',
      'VT  \'\\v\' (vertical tab)',
      'FF  \'\\f\' (form feed)',
      'CR  \'\\r\' (carriage ret)',
      'SO  (shift out)',
      'SI  (shift in)',
      'DLE (data link escape)',
      'DC1 (device control 1) ',
      'DC2 (device control 2)',
      'DC3 (device control 3)',
      'DC4 (device control 4)',
      'NAK (negative ack.)',
      'SYN (synchronous idle)',
      'ETB (end of trans. blk)',
      'CAN (cancel)',
      'EM  (end of medium)',
      'SUB (substitute)',
      'ESC (escape)',
      'FS  (file separator)',
      'GS  (group separator)',
      'RS  (record separator)',
      'US  (unit separator)',
      '\' \' SPACE'
    ];
    createDelimiter = (caption, charCode) => ({
      charCode,
      caption: `${caption}: \'${(`00${charCode}`).slice(-2)}\'`
    });
    whitespaceDelimiters = lodash.map(whitespaceSeparators, createDelimiter);
    characterDelimiters = lodash.times(126 - whitespaceSeparators.length, i => {
      var charCode;
      charCode = i + whitespaceSeparators.length;
      return createDelimiter(String.fromCharCode(charCode), charCode);
    });
    otherDelimiters = [{
      charCode: -1,
      caption: 'AUTO'
    }];
    return whitespaceDelimiters.concat(characterDelimiters, otherDelimiters);
  })();
  dataTypes = [
    'Unknown',
    'Numeric',
    'Enum',
    'Time',
    'UUID',
    'String',
    'Invalid'
  ];
  H2O.SetupParseOutput = (_, _go, _inputs, _result) => {
    var filterColumns;
    var goToNextPage;
    var goToPreviousPage;
    var makePage;
    var parseFiles;
    var refreshPreview;
    var _activePage;
    var _canGoToNextPage;
    var _canGoToPreviousPage;
    var _canReconfigure;
    var _chunkSize;
    var _columnCount;
    var _columnNameSearchTerm;
    var _columns;
    var _currentPage;
    var _deleteOnDone;
    var _delimiter;
    var _destinationKey;
    var _filteredColumns;
    var _headerOption;
    var _headerOptions;
    var _inputKey;
    var _parseType;
    var _preview;
    var _sourceKeys;
    var _useSingleQuotes;
    var _visibleColumns;
    _inputKey = _inputs.paths ? 'paths' : 'source_frames';
    _sourceKeys = lodash.map(_result.source_frames, src => src.name);
    _parseType = Flow.Dataflow.signal(lodash.find(parseTypes, parseType => parseType.type === _result.parse_type));
    _canReconfigure = Flow.Dataflow.lift(_parseType, parseType => parseType.type !== 'SVMLight');
    _delimiter = Flow.Dataflow.signal(lodash.find(parseDelimiters, delimiter => delimiter.charCode === _result.separator));
    _useSingleQuotes = Flow.Dataflow.signal(_result.single_quotes);
    _destinationKey = Flow.Dataflow.signal(_result.destination_frame);
    _headerOptions = {
      auto: 0,
      header: 1,
      data: -1
    };
    _headerOption = Flow.Dataflow.signal(_result.check_header === 0 ? 'auto' : _result.check_header === -1 ? 'data' : 'header');
    _deleteOnDone = Flow.Dataflow.signal(true);
    _columnNameSearchTerm = Flow.Dataflow.signal('');
    _preview = Flow.Dataflow.signal(_result);
    _chunkSize = Flow.Dataflow.lift(_preview, preview => preview.chunk_size);
    refreshPreview = () => {
      var column;
      var columnTypes;
      columnTypes = (() => {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = _columns();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          column = _ref[_i];
          _results.push(column.type());
        }
        return _results;
      })();
      return _.requestParseSetupPreview(_sourceKeys, _parseType().type, _delimiter().charCode, _useSingleQuotes(), _headerOptions[_headerOption()], columnTypes, (error, result) => {
        if (!error) {
          return _preview(result);
        }
      });
    };
    _columns = Flow.Dataflow.lift(_preview, preview => {
      var columnCount;
      var columnNames;
      var columnTypes;
      var data;
      var i;
      var j;
      var previewData;
      var row;
      var rowCount;
      var rows;
      var _i;
      var _j;
      columnTypes = preview.column_types;
      columnCount = columnTypes.length;
      previewData = preview.data;
      rowCount = previewData.length;
      columnNames = preview.column_names;
      rows = new Array(columnCount);
      for (j = _i = 0; columnCount >= 0 ? _i < columnCount : _i > columnCount; j = columnCount >= 0 ? ++_i : --_i) {
        data = new Array(rowCount);
        for (i = _j = 0; rowCount >= 0 ? _j < rowCount : _j > rowCount; i = rowCount >= 0 ? ++_j : --_j) {
          data[i] = previewData[i][j];
        }
        rows[j] = row = {
          index: `${(j + 1)}`,
          name: Flow.Dataflow.signal(columnNames ? columnNames[j] : ''),
          type: Flow.Dataflow.signal(columnTypes[j]),
          data
        };
      }
      return rows;
    });
    _columnCount = Flow.Dataflow.lift(_columns, columns => (columns != null ? columns.length : void 0) || 0);
    _currentPage = 0;
    Flow.Dataflow.act(_columns, columns => lodash.forEach(columns, column => Flow.Dataflow.react(column.type, () => {
      _currentPage = _activePage().index;
      return refreshPreview();
    })));
    Flow.Dataflow.react(_parseType, _delimiter, _useSingleQuotes, _headerOption, () => {
      _currentPage = 0;
      return refreshPreview();
    });
    _filteredColumns = Flow.Dataflow.lift(_columns, columns => columns);
    makePage = (index, columns) => ({
      index,
      columns
    });
    _activePage = Flow.Dataflow.lift(_columns, columns => makePage(_currentPage, columns));
    filterColumns = () => _activePage(makePage(0, lodash.filter(_columns(), column => column.name().toLowerCase().indexOf(_columnNameSearchTerm().toLowerCase()) > -1)));
    Flow.Dataflow.react(_columnNameSearchTerm, lodash.throttle(filterColumns, 500));
    _visibleColumns = Flow.Dataflow.lift(_activePage, currentPage => {
      var start;
      start = currentPage.index * MaxItemsPerPage;
      return currentPage.columns.slice(start, start + MaxItemsPerPage);
    });
    parseFiles = () => {
      var column;
      var columnNames;
      var columnTypes;
      var headerOption;
      columnNames = (() => {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = _columns();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          column = _ref[_i];
          _results.push(column.name());
        }
        return _results;
      })();
      headerOption = _headerOptions[_headerOption()];
      if (lodash.every(columnNames, columnName => columnName.trim() === '')) {
        columnNames = null;
        headerOption = -1;
      }
      columnTypes = (() => {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = _columns();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          column = _ref[_i];
          _results.push(column.type());
        }
        return _results;
      })();
      return _.insertAndExecuteCell('cs', 'parseFiles\n  ' + _inputKey + ': ' + flowPrelude.stringify(_inputs[_inputKey]) + '\n  destination_frame: ' + flowPrelude.stringify(_destinationKey()) + '\n  parse_type: ' + flowPrelude.stringify(_parseType().type) + '\n  separator: ' + _delimiter().charCode + '\n  number_columns: ' + _columnCount() + '\n  single_quotes: ' + _useSingleQuotes() + '\n  ' + (_canReconfigure() ? 'column_names: ' + flowPrelude.stringify(columnNames) + '\n  ' : '') + (_canReconfigure() ? 'column_types: ' + flowPrelude.stringify(columnTypes) + '\n  ' : '') + 'delete_on_done: ' + _deleteOnDone() + '\n  check_header: ' + headerOption + '\n  chunk_size: ' + _chunkSize()); // eslint-disable-line
    };
    _canGoToNextPage = Flow.Dataflow.lift(_activePage, currentPage => (currentPage.index + 1) * MaxItemsPerPage < currentPage.columns.length);
    _canGoToPreviousPage = Flow.Dataflow.lift(_activePage, currentPage => currentPage.index > 0);
    goToNextPage = () => {
      var currentPage;
      currentPage = _activePage();
      return _activePage(makePage(currentPage.index + 1, currentPage.columns));
    };
    goToPreviousPage = () => {
      var currentPage;
      currentPage = _activePage();
      if (currentPage.index > 0) {
        return _activePage(makePage(currentPage.index - 1, currentPage.columns));
      }
    };
    lodash.defer(_go);
    return {
      sourceKeys: _inputs[_inputKey],
      canReconfigure: _canReconfigure,
      parseTypes,
      dataTypes,
      delimiters: parseDelimiters,
      parseType: _parseType,
      delimiter: _delimiter,
      useSingleQuotes: _useSingleQuotes,
      destinationKey: _destinationKey,
      headerOption: _headerOption,
      deleteOnDone: _deleteOnDone,
      columns: _visibleColumns,
      parseFiles,
      columnNameSearchTerm: _columnNameSearchTerm,
      canGoToNextPage: _canGoToNextPage,
      canGoToPreviousPage: _canGoToPreviousPage,
      goToNextPage,
      goToPreviousPage,
      template: 'flow-parse-raw-input'
    };
  };
}

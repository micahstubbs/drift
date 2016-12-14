import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function parseInput() {
  const lodash = window._;
  const Flow = window.Flow;
  const H2O = window.H2O;
  const MaxItemsPerPage = 15;
  const parseTypes = lodash.map([
    'AUTO',
    'ARFF',
    'XLS',
    'XLSX',
    'CSV',
    'SVMLight',
    'ORC',
    'AVRO',
    'PARQUET',
  ], type => ({
    type,
    caption: type,
  }));
  const parseDelimiters = (() => {
    const whitespaceSeparators = [
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
      '\' \' SPACE',
    ];
    const createDelimiter = (caption, charCode) => ({
      charCode,
      caption: `${caption}: \'${(`00${charCode}`).slice(-2)}\'`,
    });
    const whitespaceDelimiters = lodash.map(whitespaceSeparators, createDelimiter);
    const characterDelimiters = lodash.times(126 - whitespaceSeparators.length, i => {
      const charCode = i + whitespaceSeparators.length;
      return createDelimiter(String.fromCharCode(charCode), charCode);
    });
    const otherDelimiters = [{
      charCode: -1,
      caption: 'AUTO',
    }];
    return whitespaceDelimiters.concat(characterDelimiters, otherDelimiters);
  })();
  const dataTypes = [
    'Unknown',
    'Numeric',
    'Enum',
    'Time',
    'UUID',
    'String',
    'Invalid',
  ];
  H2O.SetupParseOutput = (_, _go, _inputs, _result) => {
    let _currentPage;
    const _inputKey = _inputs.paths ? 'paths' : 'source_frames';
    const _sourceKeys = lodash.map(_result.source_frames, src => src.name);
    const _parseType = Flow.Dataflow.signal(lodash.find(parseTypes, parseType => parseType.type === _result.parse_type));
    const _canReconfigure = Flow.Dataflow.lift(_parseType, parseType => parseType.type !== 'SVMLight');
    const _delimiter = Flow.Dataflow.signal(lodash.find(parseDelimiters, delimiter => delimiter.charCode === _result.separator));
    const _useSingleQuotes = Flow.Dataflow.signal(_result.single_quotes);
    const _destinationKey = Flow.Dataflow.signal(_result.destination_frame);
    const _headerOptions = {
      auto: 0,
      header: 1,
      data: -1,
    };
    const _headerOption = Flow.Dataflow.signal(_result.check_header === 0 ? 'auto' : _result.check_header === -1 ? 'data' : 'header');
    const _deleteOnDone = Flow.Dataflow.signal(true);
    const _columnNameSearchTerm = Flow.Dataflow.signal('');
    const _preview = Flow.Dataflow.signal(_result);
    const _chunkSize = Flow.Dataflow.lift(_preview, preview => preview.chunk_size);
    const refreshPreview = () => {
      let column;
      const columnTypes = (() => {
        let _i;
        let _len;
        const _ref = _columns();
        const _results = [];
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
    const _columns = Flow.Dataflow.lift(_preview, preview => {
      let data;
      let i;
      let j;
      let row;
      let _i;
      let _j;
      const columnTypes = preview.column_types;
      const columnCount = columnTypes.length;
      const previewData = preview.data;
      const rowCount = previewData.length;
      const columnNames = preview.column_names;
      const rows = new Array(columnCount);
      for (j = _i = 0; columnCount >= 0 ? _i < columnCount : _i > columnCount; j = columnCount >= 0 ? ++_i : --_i) {
        data = new Array(rowCount);
        for (i = _j = 0; rowCount >= 0 ? _j < rowCount : _j > rowCount; i = rowCount >= 0 ? ++_j : --_j) {
          data[i] = previewData[i][j];
        }
        rows[j] = row = {
          index: `${(j + 1)}`,
          name: Flow.Dataflow.signal(columnNames ? columnNames[j] : ''),
          type: Flow.Dataflow.signal(columnTypes[j]),
          data,
        };
      }
      return rows;
    });
    const _columnCount = Flow.Dataflow.lift(_columns, columns => (columns != null ? columns.length : void 0) || 0);
    _currentPage = 0;
    Flow.Dataflow.act(_columns, columns => lodash.forEach(columns, column => Flow.Dataflow.react(column.type, () => {
      _currentPage = _activePage().index;
      return refreshPreview();
    })));
    Flow.Dataflow.react(_parseType, _delimiter, _useSingleQuotes, _headerOption, () => {
      _currentPage = 0;
      return refreshPreview();
    });
    const _filteredColumns = Flow.Dataflow.lift(_columns, columns => columns);
    const makePage = (index, columns) => ({
      index,
      columns,
    });
    const _activePage = Flow.Dataflow.lift(_columns, columns => makePage(_currentPage, columns));
    const filterColumns = () => _activePage(makePage(0, lodash.filter(_columns(), column => column.name().toLowerCase().indexOf(_columnNameSearchTerm().toLowerCase()) > -1)));
    Flow.Dataflow.react(_columnNameSearchTerm, lodash.throttle(filterColumns, 500));
    const _visibleColumns = Flow.Dataflow.lift(_activePage, currentPage => {
      const start = currentPage.index * MaxItemsPerPage;
      return currentPage.columns.slice(start, start + MaxItemsPerPage);
    });
    const parseFiles = () => {
      let column;
      let columnNames;
      let headerOption;
      columnNames = (() => {
        let _i;
        let _len;
        const _ref = _columns();
        const _results = [];
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
      const columnTypes = (() => {
        let _i;
        let _len;
        const _ref = _columns();
        const _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          column = _ref[_i];
          _results.push(column.type());
        }
        return _results;
      })();
      return _.insertAndExecuteCell('cs', 'parseFiles\n  ' + _inputKey + ': ' + flowPrelude.stringify(_inputs[_inputKey]) + '\n  destination_frame: ' + flowPrelude.stringify(_destinationKey()) + '\n  parse_type: ' + flowPrelude.stringify(_parseType().type) + '\n  separator: ' + _delimiter().charCode + '\n  number_columns: ' + _columnCount() + '\n  single_quotes: ' + _useSingleQuotes() + '\n  ' + (_canReconfigure() ? 'column_names: ' + flowPrelude.stringify(columnNames) + '\n  ' : '') + (_canReconfigure() ? 'column_types: ' + flowPrelude.stringify(columnTypes) + '\n  ' : '') + 'delete_on_done: ' + _deleteOnDone() + '\n  check_header: ' + headerOption + '\n  chunk_size: ' + _chunkSize()); // eslint-disable-line
    };
    const _canGoToNextPage = Flow.Dataflow.lift(_activePage, currentPage => (currentPage.index + 1) * MaxItemsPerPage < currentPage.columns.length);
    const _canGoToPreviousPage = Flow.Dataflow.lift(_activePage, currentPage => currentPage.index > 0);
    const goToNextPage = () => {
      const currentPage = _activePage();
      return _activePage(makePage(currentPage.index + 1, currentPage.columns));
    };
    const goToPreviousPage = () => {
      const currentPage = _activePage();
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
      template: 'flow-parse-raw-input',
    };
  };
}

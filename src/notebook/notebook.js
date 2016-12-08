import { flowHeading } from '../flowHeading';
import { flowCoffeescript } from '../flowCoffeescript';
import { flowRaw } from '../flowRaw';
import { flowStatus } from '../flowStatus';
import { flowSidebar } from '../flowSidebar';
import { flowCell } from '../flowCell';
import { flowFileOpenDialog } from '../flowFileOpenDialog';
import { flowFileUploadDialog } from '../flowFileUploadDialog';

export function notebook() {
  var lodash = window._;
  var Flow = window.Flow;
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
}

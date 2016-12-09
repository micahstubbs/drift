import { flowHeading } from '../flowHeading';
import { flowCoffeescript } from '../flowCoffeescript';
import { flowRaw } from '../flowRaw';
import { flowStatus } from '../flowStatus';
import { flowSidebar } from '../flowSidebar';
import { flowCell } from '../flowCell';
import { flowFileOpenDialog } from '../flowFileOpenDialog';
import { flowFileUploadDialog } from '../flowFileUploadDialog';
import { flowMarkdown } from '../flowMarkdown';
import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function notebook() {
  const lodash = window._;
  const Flow = window.Flow;
  const __slice = [].slice;
  Flow.Renderers = (_, _sandbox) => ({
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
      return flowMarkdown(_);
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
  });
  Flow.Notebook = (_, _renderers) => {
    let appendCell;
    let appendCellAndRun;
    let checkConsistency;
    let checkIfNameIsInUse;
    let clearCell;
    let cloneCell;
    let continueRunningAllCells;
    let convertCellToCode;
    let convertCellToHeading;
    let convertCellToMarkdown;
    let convertCellToRaw;
    let convertCellToScala;
    let copyCell;
    let createCell;
    let createNotebook;
    let cutCell;
    let deleteCell;
    let deserialize;
    let displayAbout;
    let displayDocumentation;
    let displayFAQ;
    let displayKeyboardShortcuts;
    let duplicateNotebook;
    let editName;
    let executeAllCells;
    let executeCommand;
    let exportNotebook;
    let findBuildProperty;
    let getBuildProperties;
    let goToH2OUrl;
    let goToUrl;
    let insertAbove;
    let insertBelow;
    let insertCell;
    let insertCellAbove;
    let insertCellAboveAndRun;
    let insertCellBelow;
    let insertCellBelowAndRun;
    let insertNewCellAbove;
    let insertNewCellBelow;
    let insertNewScalaCellAbove;
    let insertNewScalaCellBelow;
    let loadNotebook;
    let menuCell;
    let mergeCellBelow;
    let moveCellDown;
    let moveCellUp;
    let openNotebook;
    let pasteCellAbove;
    let pasteCellBelow;
    let promptForNotebook;
    let removeCell;
    let runAllCells;
    let runCell;
    let runCellAndInsertBelow;
    let runCellAndSelectBelow;
    let saveName;
    let saveNotebook;
    let selectCell;
    let selectNextCell;
    let selectPreviousCell;
    let serialize;
    let showBrowser;
    let showClipboard;
    let showHelp;
    let showOutline;
    let shutdown;
    let splitCell;
    let stopRunningAll;
    let storeNotebook;
    let switchToCommandMode;
    let switchToEditMode;
    let toggleAllInputs;
    let toggleAllOutputs;
    let toggleInput;
    let toggleOutput;
    let toggleSidebar;
    let undoLastDelete;
    let uploadFile;
    let _about;
    let _areInputsHidden;
    let _areOutputsHidden;
    let _cells;
    let _clipboardCell;
    let _dialogs;
    let _initializeInterpreter;
    let _isEditingName;
    let _isRunningAll;
    let _isSidebarHidden;
    let _lastDeletedCell;
    let _localName;
    let _remoteName;
    let _runningCaption;
    let _runningCellInput;
    let _runningPercent;
    let _selectedCell;
    let _selectedCellIndex;
    let _sidebar;
    let _status;
    _localName = Flow.Dataflow.signal('Untitled Flow');
    Flow.Dataflow.react(_localName, name => document.title = `H2O${(name && name.trim() ? `- ${name}` : '')}`);
    _remoteName = Flow.Dataflow.signal(null);
    _isEditingName = Flow.Dataflow.signal(false);
    editName = () => _isEditingName(true);
    saveName = () => _isEditingName(false);
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
    _initializeInterpreter = () => _.requestScalaIntp((error, response) => {
      if (error) {
        return _.scalaIntpId(-1);
      }
      return _.scalaIntpId(response.session_id);
    });
    serialize = () => {
      let cell;
      let cells;
      cells = (() => {
        let _i;
        let _len;
        let _ref;
        let _results;
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
      })();
      return {
        version: '1.0.0',
        cells
      };
    };
    deserialize = (localName, remoteName, doc) => {
      let cell;
      let cells;
      let _i;
      let _len;
      let _ref;
      _localName(localName);
      _remoteName(remoteName);
      cells = (() => {
        let _i;
        let _len;
        let _ref;
        let _results;
        _ref = doc.cells;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cell = _ref[_i];
          _results.push(createCell(cell.type, cell.input));
        }
        return _results;
      })();
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
    createCell = (type, input) => {
      if (type == null) {
        type = 'cs';
      }
      if (input == null) {
        input = '';
      }
      return flowCell(_, _renderers, type, input);
    };
    checkConsistency = () => {
      let cell;
      let i;
      let selectionCount;
      let _i;
      let _len;
      let _ref;
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
    selectCell = (target, scrollIntoView, scrollImmediately) => {
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
        lodash.defer(() => _selectedCell.scrollIntoView(scrollImmediately));
      }
      return _selectedCell;
    };
    cloneCell = cell => createCell(cell.type(), cell.input());
    switchToCommandMode = () => _selectedCell.isActive(false);
    switchToEditMode = () => {
      _selectedCell.isActive(true);
      return false;
    };
    convertCellToCode = () => _selectedCell.type('cs');
    convertCellToHeading = level => () => {
      _selectedCell.type(`h${level}`);
      return _selectedCell.execute();
    };
    convertCellToMarkdown = () => {
      _selectedCell.type('md');
      return _selectedCell.execute();
    };
    convertCellToRaw = () => {
      _selectedCell.type('raw');
      return _selectedCell.execute();
    };
    convertCellToScala = () => _selectedCell.type('sca');
    copyCell = () => _clipboardCell = _selectedCell;
    cutCell = () => {
      copyCell();
      return removeCell();
    };
    deleteCell = () => {
      _lastDeletedCell = _selectedCell;
      return removeCell();
    };
    removeCell = () => {
      let cells;
      let removedCell;
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
    insertCell = (index, cell) => {
      _cells.splice(index, 0, cell);
      selectCell(cell);
      return cell;
    };
    insertAbove = cell => insertCell(_selectedCellIndex, cell);
    insertBelow = cell => insertCell(_selectedCellIndex + 1, cell);
    appendCell = cell => insertCell(_cells().length, cell);
    insertCellAbove = (type, input) => insertAbove(createCell(type, input));
    insertCellBelow = (type, input) => insertBelow(createCell(type, input));
    insertNewCellAbove = () => insertAbove(createCell('cs'));
    insertNewCellBelow = () => insertBelow(createCell('cs'));
    insertNewScalaCellAbove = () => insertAbove(createCell('sca'));
    insertNewScalaCellBelow = () => insertBelow(createCell('sca'));
    insertCellAboveAndRun = (type, input) => {
      let cell;
      cell = insertAbove(createCell(type, input));
      cell.execute();
      return cell;
    };
    insertCellBelowAndRun = (type, input) => {
      let cell;
      cell = insertBelow(createCell(type, input));
      cell.execute();
      return cell;
    };
    appendCellAndRun = (type, input) => {
      let cell;
      cell = appendCell(createCell(type, input));
      cell.execute();
      return cell;
    };
    moveCellDown = () => {
      let cells;
      cells = _cells();
      if (_selectedCellIndex !== cells.length - 1) {
        _cells.splice(_selectedCellIndex, 1);
        _selectedCellIndex++;
        _cells.splice(_selectedCellIndex, 0, _selectedCell);
      }
    };
    moveCellUp = () => {
      let cells;
      if (_selectedCellIndex !== 0) {
        cells = _cells();
        _cells.splice(_selectedCellIndex, 1);
        _selectedCellIndex--;
        _cells.splice(_selectedCellIndex, 0, _selectedCell);
      }
    };
    mergeCellBelow = () => {
      let cells;
      let nextCell;
      cells = _cells();
      if (_selectedCellIndex !== cells.length - 1) {
        nextCell = cells[_selectedCellIndex + 1];
        if (_selectedCell.type() === nextCell.type()) {
          nextCell.input(`${_selectedCell.input()}\n${nextCell.input()}`);
          removeCell();
        }
      }
    };
    splitCell = () => {
      let cursorPosition;
      let input;
      let left;
      let right;
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
    pasteCellAbove = () => {
      if (_clipboardCell) {
        return insertCell(_selectedCellIndex, cloneCell(_clipboardCell));
      }
    };
    pasteCellBelow = () => {
      if (_clipboardCell) {
        return insertCell(_selectedCellIndex + 1, cloneCell(_clipboardCell));
      }
    };
    undoLastDelete = () => {
      if (_lastDeletedCell) {
        insertCell(_selectedCellIndex + 1, _lastDeletedCell);
      }
      return _lastDeletedCell = null;
    };
    runCell = () => {
      _selectedCell.execute();
      return false;
    };
    runCellAndInsertBelow = () => {
      _selectedCell.execute(() => insertNewCellBelow());
      return false;
    };
    runCellAndSelectBelow = () => {
      _selectedCell.execute(() => selectNextCell());
      return false;
    };
    checkIfNameIsInUse = (name, go) => _.requestObjectExists('notebook', name, (error, exists) => go(exists));
    storeNotebook = (localName, remoteName) => _.requestPutObject('notebook', localName, serialize(), error => {
      if (error) {
        return _.alert(`Error saving notebook: ${error.message}`);
      }
      _remoteName(localName);
      _localName(localName);
      if (remoteName !== localName) {
        return _.requestDeleteObject('notebook', remoteName, error => {
          if (error) {
            _.alert(`Error deleting remote notebook [${remoteName}]: ${error.message}`);
          }
          return _.saved();
        });
      }
      return _.saved();
    });
    saveNotebook = () => {
      let localName;
      let remoteName;
      localName = Flow.Util.sanitizeName(_localName());
      if (localName === '') {
        return _.alert('Invalid notebook name.');
      }
      remoteName = _remoteName();
      if (remoteName) {
        storeNotebook(localName, remoteName);
      }
      checkIfNameIsInUse(localName, isNameInUse => {
        if (isNameInUse) {
          return _.confirm('A notebook with that name already exists.\nDo you want to replace it with the one you\'re saving?', {
            acceptCaption: 'Replace',
            declineCaption: 'Cancel'
          }, accept => {
            if (accept) {
              return storeNotebook(localName, remoteName);
            }
          });
        }
        return storeNotebook(localName, remoteName);
      });
    };
    promptForNotebook = () => _.dialog(flowFileOpenDialog, result => {
      let error;
      let filename;
      let _ref;
      if (result) {
        error = result.error, filename = result.filename;
        if (error) {
          return _.growl((_ref = error.message) != null ? _ref : error);
        }
        loadNotebook(filename);
        return _.loaded();
      }
    });
    uploadFile = () => _.dialog(flowFileUploadDialog, result => {
      let error;
      let _ref;
      if (result) {
        error = result.error;
        if (error) {
          return _.growl((_ref = error.message) != null ? _ref : error);
        }
        _.growl('File uploaded successfully!');
        return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${flowPrelude.stringify(result.result.destination_frame)}]`);
      }
    });
    toggleInput = () => _selectedCell.toggleInput();
    toggleOutput = () => _selectedCell.toggleOutput();
    toggleAllInputs = () => {
      let cell;
      let wereHidden;
      let _i;
      let _len;
      let _ref;
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
    toggleAllOutputs = () => _areOutputsHidden(!_areOutputsHidden());
    toggleSidebar = () => _isSidebarHidden(!_isSidebarHidden());
    showBrowser = () => {
      _isSidebarHidden(false);
      return _.showBrowser();
    };
    showOutline = () => {
      _isSidebarHidden(false);
      return _.showOutline();
    };
    showClipboard = () => {
      _isSidebarHidden(false);
      return _.showClipboard();
    };
    selectNextCell = () => {
      let cells;
      cells = _cells();
      if (_selectedCellIndex !== cells.length - 1) {
        selectCell(cells[_selectedCellIndex + 1]);
      }
      return false;
    };
    selectPreviousCell = () => {
      let cells;
      if (_selectedCellIndex !== 0) {
        cells = _cells();
        selectCell(cells[_selectedCellIndex - 1]);
      }
      return false;
    };
    displayKeyboardShortcuts = () => $('#keyboardHelpDialog').modal();
    findBuildProperty = caption => {
      let entry;
      if (Flow.BuildProperties) {
        if (entry = lodash.find(Flow.BuildProperties, entry => entry.caption === caption)) {
          return entry.value;
        }
        return void 0;
      }
      return void 0;
    };
    getBuildProperties = () => {
      let projectVersion;
      projectVersion = findBuildProperty('H2O Build project version');
      return [
        findBuildProperty('H2O Build git branch'),
        projectVersion,
        projectVersion ? lodash.last(projectVersion.split('.')) : void 0,
        findBuildProperty('H2O Build git hash') || 'master'
      ];
    };
    displayDocumentation = () => {
      let buildVersion;
      let gitBranch;
      let gitHash;
      let projectVersion;
      let _ref;
      _ref = getBuildProperties(), gitBranch = _ref[0], projectVersion = _ref[1], buildVersion = _ref[2], gitHash = _ref[3];
      if (buildVersion && buildVersion !== '99999') {
        return window.open(`http://h2o-release.s3.amazonaws.com/h2o/${gitBranch}/${buildVersion}/docs-website/h2o-docs/index.html`, '_blank');
      }
      return window.open(`https://github.com/h2oai/h2o-3/blob/${gitHash}/h2o-docs/src/product/flow/README.md`, '_blank');
    };
    displayFAQ = () => {
      let buildVersion;
      let gitBranch;
      let gitHash;
      let projectVersion;
      let _ref;
      _ref = getBuildProperties(), gitBranch = _ref[0], projectVersion = _ref[1], buildVersion = _ref[2], gitHash = _ref[3];
      if (buildVersion && buildVersion !== '99999') {
        return window.open(`http://h2o-release.s3.amazonaws.com/h2o/${gitBranch}/${buildVersion}/docs-website/h2o-docs/index.html`, '_blank');
      }
      return window.open(`https://github.com/h2oai/h2o-3/blob/${gitHash}/h2o-docs/src/product/howto/FAQ.md`, '_blank');
    };
    executeCommand = command => () => _.insertAndExecuteCell('cs', command);
    displayAbout = () => $('#aboutDialog').modal();
    shutdown = () => _.requestShutdown((error, result) => {
      if (error) {
        return _.growl(`Shutdown failed: ${error.message}`, 'danger');
      }
      return _.growl('Shutdown complete!', 'warning');
    });
    showHelp = () => {
      _isSidebarHidden(false);
      return _.showHelp();
    };
    createNotebook = () => _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
      acceptCaption: 'Create New Notebook',
      declineCaption: 'Cancel'
    }, accept => {
      let currentTime;
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
    duplicateNotebook = () => deserialize(`Copy of ${_localName()}`, null, serialize());
    openNotebook = (name, doc) => deserialize(name, null, doc);
    loadNotebook = name => _.requestObject('notebook', name, (error, doc) => {
      let _ref;
      if (error) {
        return _.alert((_ref = error.message) != null ? _ref : error);
      }
      return deserialize(name, name, doc);
    });
    exportNotebook = () => {
      let remoteName;
      if (remoteName = _remoteName()) {
        return window.open(`/3/NodePersistentStorage.bin/notebook/${remoteName}`, '_blank');
      }
      return _.alert('Please save this notebook before exporting.');
    };
    goToH2OUrl = url => () => window.open(window.Flow.ContextPath + url, '_blank');
    goToUrl = url => () => window.open(url, '_blank');
    executeAllCells = (fromBeginning, go) => {
      let cellCount;
      let cellIndex;
      let cells;
      let executeNextCell;
      _isRunningAll(true);
      cells = _cells().slice(0);
      cellCount = cells.length;
      cellIndex = 0;
      if (!fromBeginning) {
        cells = cells.slice(_selectedCellIndex);
        cellIndex = _selectedCellIndex;
      }
      executeNextCell = () => {
        let cell;
        if (_isRunningAll()) {
          cell = cells.shift();
          if (cell) {
            cell.scrollIntoView(true);
            cellIndex++;
            _runningCaption(`Running cell ${cellIndex} of ${cellCount}`);
            _runningPercent(`${Math.floor(100 * cellIndex / cellCount)}%`);
            _runningCellInput(cell.input());
            return cell.execute(errors => {
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
    runAllCells = fromBeginning => {
      if (fromBeginning == null) {
        fromBeginning = true;
      }
      return executeAllCells(fromBeginning, status => {
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
    continueRunningAllCells = () => runAllCells(false);
    stopRunningAll = () => _isRunningAll(false);
    clearCell = () => {
      _selectedCell.clear();
      return _selectedCell.autoResize();
    };
    clearAllCells = () => {
      let cell;
      let _i;
      let _len;
      const _ref = _cells();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cell = _ref[_i];
        cell.clear();
        cell.autoResize();
      }
    };
    const notImplemented = () => {
    };
    const pasteCellandReplace = notImplemented;
    const mergeCellAbove = notImplemented;
    const startTour = notImplemented;
    const createMenu = (label, items) => ({
      label,
      items
    });
    const createMenuHeader = label => ({
      label,
      action: null
    });
    const createShortcutHint = shortcut => `<span style=\'float:right\'>${lodash.map(shortcut, key => `<kbd>${key}</kbd>`).join(' ')}</span>`;
    const createMenuItem = (label, action, shortcut) => {
      const kbds = shortcut ? createShortcutHint(shortcut) : '';
      return {
        label: `${lodash.escape(label)}${kbds}`,
        action
      };
    };
    const menuDivider = {
      label: null,
      action: null
    };
    const _menus = Flow.Dataflow.signal(null);
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
    const menuCellSW = [
      menuDivider,
      createMenuItem('Insert Scala Cell Above', insertNewScalaCellAbove),
      createMenuItem('Insert Scala Cell Below', insertNewScalaCellBelow)
    ];
    if (_.onSparklingWater) {
      menuCell = __slice.call(menuCell).concat(__slice.call(menuCellSW));
    }
    const initializeMenus = builder => {
      const modelMenuItems = lodash.map(builder, builder => createMenuItem(`${builder.algo_full_name}...`, executeCommand(`buildModel ${flowPrelude.stringify(builder.algo)}`))).concat([
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
    const setupMenus = () => _.requestModelBuilders((error, builders) => _menus(initializeMenus(error ? [] : builders)));
    const createTool = (icon, label, action, isDisabled) => {
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
    const _toolbar = [
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
    const normalModeKeyboardShortcuts = [
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
    const editModeKeyboardShortcuts = [
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
    const toKeyboardHelp = shortcut => {
      let caption;
      let seq;
      seq = shortcut[0], caption = shortcut[1];
      const keystrokes = lodash.map(seq.split(/\+/g), key => `<kbd>${key}</kbd>`).join(' ');
      return {
        keystrokes,
        caption
      };
    };
    const normalModeKeyboardShortcutsHelp = lodash.map(normalModeKeyboardShortcuts, toKeyboardHelp);
    const editModeKeyboardShortcutsHelp = lodash.map(editModeKeyboardShortcuts, toKeyboardHelp);
    const setupKeyboardHandling = mode => {
      let caption;
      let f;
      let shortcut;
      let _i;
      let _j;
      let _len;
      let _len1;
      let _ref;
      let _ref1;
      for (_i = 0, _len = normalModeKeyboardShortcuts.length; _i < _len; _i++) {
        _ref = normalModeKeyboardShortcuts[_i], shortcut = _ref[0], caption = _ref[1], f = _ref[2];
        Mousetrap.bind(shortcut, f);
      }
      for (_j = 0, _len1 = editModeKeyboardShortcuts.length; _j < _len1; _j++) {
        _ref1 = editModeKeyboardShortcuts[_j], shortcut = _ref1[0], caption = _ref1[1], f = _ref1[2];
        Mousetrap.bindGlobal(shortcut, f);
      }
    };
    const initialize = () => {
      setupKeyboardHandling('normal');
      setupMenus();
      Flow.Dataflow.link(_.load, loadNotebook);
      Flow.Dataflow.link(_.open, openNotebook);
      Flow.Dataflow.link(_.selectCell, selectCell);
      Flow.Dataflow.link(_.executeAllCells, executeAllCells);
      Flow.Dataflow.link(_.insertAndExecuteCell, (type, input) => lodash.defer(appendCellAndRun, type, input));
      Flow.Dataflow.link(_.insertCell, (type, input) => lodash.defer(insertCellBelow, type, input));
      Flow.Dataflow.link(_.saved, () => _.growl('Notebook saved.'));
      Flow.Dataflow.link(_.loaded, () => _.growl('Notebook loaded.'));
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

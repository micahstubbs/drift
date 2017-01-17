import { _initializeInterpreter } from './_initializeInterpreter';
import { serialize } from './serialize';
import { deserialize } from './deserialize';
import { createCell } from './createCell';
import { checkConsistency } from './checkConsistency';
import { cloneCell } from './cloneCell';
import { selectCell } from './selectCell';
import { switchToCommandMode } from './switchToCommandMode';
import { switchToEditMode } from './switchToEditMode';
import { convertCellToCode } from './convertCellToCode';
import { convertCellToHeading } from './convertCellToHeading';
import { convertCellToMarkdown } from './convertCellToMarkdown';
import { convertCellToRaw } from './convertCellToRaw';
import { convertCellToScala } from './convertCellToScala';
import { copyCell } from './copyCell';
import { cutCell } from './cutCell';
import { removeCell } from './removeCell';
import { deleteCell } from './deleteCell';
import { insertAbove } from './insertAbove';
import { insertCell } from './insertCell';
import { insertBelow } from './insertBelow';
import { appendCell } from './appendCell';
import { insertCellBelow } from './insertCellBelow';
import { insertNewCellAbove } from './insertNewCellAbove';
import { insertNewCellBelow } from './insertNewCellBelow';
import { insertNewScalaCellAbove } from './insertNewScalaCellAbove';
import { insertNewScalaCellBelow } from './insertNewScalaCellBelow';

import { requestModelBuilders } from '../h2oProxy/requestModelBuilders';
import { getObjectExistsRequest } from '../h2oProxy/getObjectExistsRequest';
import { getObjectRequest } from '../h2oProxy/getObjectRequest';
import { deleteObjectRequest } from '../h2oProxy/deleteObjectRequest';
import { postPutObjectRequest } from '../h2oProxy/postPutObjectRequest';
import { postShutdownRequest } from '../h2oProxy/postShutdownRequest';

import { sanitizeName } from '../utils/sanitizeName';

import { flowStatus } from '../flowStatus';
import { flowSidebar } from '../flowSidebar';
import { flowFileOpenDialog } from '../flowFileOpenDialog';
import { flowFileUploadDialog } from '../flowFileUploadDialog';
import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function notebook() {
  const lodash = window._;
  const Flow = window.Flow;
  const Mousetrap = window.Mousetrap;
  const $ = window.jQuery;
  const __slice = [].slice;
  Flow.notebook = (_) => {
    let menuCell;
    const _localName = Flow.Dataflow.signal('Untitled Flow');
    Flow.Dataflow.react(_localName, name => {
      document.title = `H2O${(name && name.trim() ? `- ${name}` : '')}`;
      return document.title;
    });
    const _remoteName = Flow.Dataflow.signal(null);
    const _isEditingName = Flow.Dataflow.signal(false);
    const editName = () => _isEditingName(true);
    const saveName = () => _isEditingName(false);
    _.cells = Flow.Dataflow.signals([]);
    _.selectedCell = null;
    _.selectedCellIndex = -1;
    _.clipboardCell = null;
    _.lastDeletedCell = null;
    const _areInputsHidden = Flow.Dataflow.signal(false);
    const _areOutputsHidden = Flow.Dataflow.signal(false);
    const _isSidebarHidden = Flow.Dataflow.signal(false);
    const _isRunningAll = Flow.Dataflow.signal(false);
    const _runningCaption = Flow.Dataflow.signal('Running');
    const _runningPercent = Flow.Dataflow.signal('0%');
    const _runningCellInput = Flow.Dataflow.signal('');
    const _status = flowStatus(_);
    const _sidebar = flowSidebar(_);
    const _about = Flow.about(_);
    const _dialogs = Flow.dialogs(_);
    const insertCellAboveAndRun = (type, input) => {
      const cell = insertAbove(_, createCell(_, type, input));
      cell.execute();
      return cell;
    };
    const insertCellBelowAndRun = (type, input) => {
      const cell = insertBelow(_, createCell(_, type, input));
      cell.execute();
      return cell;
    };
    const appendCellAndRun = (type, input) => {
      const cell = appendCell(_, createCell(_, type, input));
      console.log('cell from appendCellAndRun', cell);
      cell.execute();
      return cell;
    };
    const moveCellDown = () => {
      const cells = _.cells();
      if (_.selectedCellIndex !== cells.length - 1) {
        _.cells.splice(_.selectedCellIndex, 1);
        _.selectedCellIndex++;
        _.cells.splice(_.selectedCellIndex, 0, _.selectedCell);
      }
    };
    const moveCellUp = () => {
      let cells;
      if (_.selectedCellIndex !== 0) {
        cells = _.cells();
        _.cells.splice(_.selectedCellIndex, 1);
        _.selectedCellIndex--;
        _.cells.splice(_.selectedCellIndex, 0, _.selectedCell);
      }
    };
    const mergeCellBelow = () => {
      let nextCell;
      const cells = _.cells();
      if (_.selectedCellIndex !== cells.length - 1) {
        nextCell = cells[_.selectedCellIndex + 1];
        if (_.selectedCell.type() === nextCell.type()) {
          nextCell.input(`${_.selectedCell.input()}\n${nextCell.input()}`);
          removeCell(_, _.cells);
        }
      }
    };
    const splitCell = () => {
      let cursorPosition;
      let input;
      let left;
      let right;
      if (_.selectedCell.isActive()) {
        input = _.selectedCell.input();
        if (input.length > 1) {
          cursorPosition = _.selectedCell.getCursorPosition();
          if (
            cursorPosition > 0 &&
            cursorPosition < input.length - 1
          ) {
            left = input.substr(0, cursorPosition);
            right = input.substr(cursorPosition);
            _.selectedCell.input(left);
            insertCell(_, _.selectedCellIndex + 1, createCell(_, 'cs', right));
            _.selectedCell.isActive(true);
          }
        }
      }
    };
    const pasteCellAbove = () => {
      if (_.clipboardCell) {
        return insertCell(_, _.selectedCellIndex, cloneCell(_, _.clipboardCell));
      }
    };
    const pasteCellBelow = () => {
      if (_.clipboardCell) {
        return insertCell(_, _.selectedCellIndex + 1, cloneCell(_, _.clipboardCell));
      }
    };
    const undoLastDelete = () => {
      if (_.lastDeletedCell) {
        insertCell(_, _.selectedCellIndex + 1, _.lastDeletedCell);
      }
      _.lastDeletedCell = null;
      return _.lastDeletedCell;
    };
    const runCell = () => {
      _.selectedCell.execute();
      return false;
    };
    const runCellAndInsertBelow = () => {
      _.selectedCell.execute(() => insertNewCellBelow(_));
      return false;
    };
    // ipython has inconsistent behavior here.
    // seems to be doing runCellAndInsertBelow if executed on the lowermost cell.
    const runCellAndSelectBelow = () => {
      _.selectedCell.execute(() => selectNextCell());
      return false;
    };
    const checkIfNameIsInUse = (name, go) => getObjectExistsRequest(_, 'notebook', name, (error, exists) => go(exists));
    const storeNotebook = (localName, remoteName) => postPutObjectRequest(_, 'notebook', localName, serialize(_), error => {
      if (error) {
        return _.alert(`Error saving notebook: ${error.message}`);
      }
      _remoteName(localName);
      _localName(localName);

      // renamed document
      if (remoteName !== localName) {
        return deleteObjectRequest(_, 'notebook', remoteName, error => {
          if (error) {
            _.alert(`Error deleting remote notebook [${remoteName}]: ${error.message}`);
          }
          return _.saved();
        });
      }
      return _.saved();
    });
    const saveNotebook = () => {
      const localName = sanitizeName(_localName());
      if (localName === '') {
        return _.alert('Invalid notebook name.');
      }

      // saved document
      const remoteName = _remoteName();
      if (remoteName) {
        storeNotebook(localName, remoteName);
      }
      // unsaved document
      checkIfNameIsInUse(localName, isNameInUse => {
        if (isNameInUse) {
          return _.confirm('A notebook with that name already exists.\nDo you want to replace it with the one you\'re saving?', {
            acceptCaption: 'Replace',
            declineCaption: 'Cancel',
          }, accept => {
            if (accept) {
              return storeNotebook(localName, remoteName);
            }
          });
        }
        return storeNotebook(localName, remoteName);
      });
    };
    const promptForNotebook = () => _.dialog(flowFileOpenDialog, result => {
      let error;
      let filename;
      let _ref;
      if (result) {
        error = result.error;
        filename = result.filename;
        if (error) {
          _ref = error.message;
          return _.growl(_ref != null ? _ref : error);
        }
        loadNotebook(filename);
        return _.loaded();
      }
    });
    const uploadFile = () => _.dialog(flowFileUploadDialog, result => {
      let error;
      let _ref;
      if (result) {
        error = result.error;
        if (error) {
          _ref = error.message;
          return _.growl((_ref) != null ? _ref : error);
        }
        _.growl('File uploaded successfully!');
        return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${flowPrelude.stringify(result.result.destination_frame)}]`);
      }
    });
    const toggleInput = () => _.selectedCell.toggleInput();
    const toggleOutput = () => _.selectedCell.toggleOutput();
    const toggleAllInputs = () => {
      let cell;
      let _i;
      let _len;
      let _ref;
      const wereHidden = _areInputsHidden();
      _areInputsHidden(!wereHidden);
      //
      // If cells are generated while inputs are hidden, the input boxes
      //   do not resize to fit contents. So explicitly ask all cells
      //   to resize themselves.
      //
      if (wereHidden) {
        _ref = _.cells();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cell = _ref[_i];
          cell.autoResize();
        }
      }
    };
    const toggleAllOutputs = () => _areOutputsHidden(!_areOutputsHidden());
    const toggleSidebar = () => _isSidebarHidden(!_isSidebarHidden());
    const showBrowser = () => {
      _isSidebarHidden(false);
      return _.showBrowser();
    };
    const showOutline = () => {
      _isSidebarHidden(false);
      return _.showOutline();
    };
    const showClipboard = () => {
      _isSidebarHidden(false);
      return _.showClipboard();
    };
    function selectNextCell() {
      const cells = _.cells();
      if (_.selectedCellIndex !== cells.length - 1) {
        selectCell(
          _,
          cells[_.selectedCellIndex + 1]
        );
      }
      // prevent arrow keys from scrolling the page
      return false;
    }
    const selectPreviousCell = () => {
      let cells;
      if (_.selectedCellIndex !== 0) {
        cells = _.cells();
        selectCell(
          _,
          cells[_.selectedCellIndex - 1]
        );
      }
      // prevent arrow keys from scrolling the page
      return false;
    };
    const displayKeyboardShortcuts = () => $('#keyboardHelpDialog').modal();
    const findBuildProperty = caption => {
      let entry;
      if (Flow.BuildProperties) {
        entry = lodash.find(Flow.BuildProperties, entry => entry.caption === caption);
        if (entry) {
          return entry.value;
        }
        return void 0;
      }
      return void 0;
    };
    const getBuildProperties = () => {
      const projectVersion = findBuildProperty('H2O Build project version');
      return [
        findBuildProperty('H2O Build git branch'),
        projectVersion,
        projectVersion ? lodash.last(projectVersion.split('.')) : void 0,
        findBuildProperty('H2O Build git hash') || 'master',
      ];
    };
    const displayDocumentation = () => {
      const _ref = getBuildProperties();
      const gitBranch = _ref[0];
      const projectVersion = _ref[1];
      const buildVersion = _ref[2];
      const gitHash = _ref[3];
      if (buildVersion && buildVersion !== '99999') {
        return window.open(`http://h2o-release.s3.amazonaws.com/h2o/${gitBranch}/${buildVersion}/docs-website/h2o-docs/index.html`, '_blank');
      }
      return window.open(`https://github.com/h2oai/h2o-3/blob/${gitHash}/h2o-docs/src/product/flow/README.md`, '_blank');
    };
    const displayFAQ = () => {
      const _ref = getBuildProperties();
      const gitBranch = _ref[0];
      const projectVersion = _ref[1];
      const buildVersion = _ref[2];
      const gitHash = _ref[3];
      if (buildVersion && buildVersion !== '99999') {
        return window.open(`http://h2o-release.s3.amazonaws.com/h2o/${gitBranch}/${buildVersion}/docs-website/h2o-docs/index.html`, '_blank');
      }
      return window.open(`https://github.com/h2oai/h2o-3/blob/${gitHash}/h2o-docs/src/product/howto/FAQ.md`, '_blank');
    };
    const executeCommand = command => () => _.insertAndExecuteCell('cs', command);
    const displayAbout = () => $('#aboutDialog').modal();
    const shutdown = () => postShutdownRequest(_, (error, result) => {
      if (error) {
        return _.growl(`Shutdown failed: ${error.message}`, 'danger');
      }
      return _.growl('Shutdown complete!', 'warning');
    });
    const showHelp = () => {
      _isSidebarHidden(false);
      return _.showHelp();
    };
    const createNotebook = () => _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
      acceptCaption: 'Create New Notebook',
      declineCaption: 'Cancel',
    }, accept => {
      let currentTime;
      if (accept) {
        currentTime = new Date().getTime();

        const acceptLocalName = 'Untitled Flow';
        const acceptRemoteName = null;
        const acceptDoc = {
          cells: [{
            type: 'cs',
            input: '',
          }],
        };

        return deserialize(
          _,
          _localName,
          _remoteName,
          acceptLocalName,
          acceptRemoteName,
          acceptDoc
        );
      }
    });
    const duplicateNotebook = () => {
      const duplicateNotebookLocalName = `Copy of ${_localName()}`;
      const duplicateNotebookRemoteName = null;
      const duplicateNotebookDoc = serialize(_);
      return deserialize(
        _,
        _localName,
        _remoteName,
        duplicateNotebookLocalName,
        duplicateNotebookRemoteName,
        duplicateNotebookDoc
      );
    };
    const openNotebook = (name, doc) => {
      const openNotebookLocalName = name;
      const openNotebookRemoteName = null;
      const openNotebookDoc = doc;
      return deserialize(
        _,
        _localName,
        _remoteName,
        openNotebookLocalName,
        openNotebookRemoteName,
        openNotebookDoc
      );
    };
    function loadNotebook(name) {
      return getObjectRequest(_, 'notebook', name, (error, doc) => {
        let _ref;
        if (error) {
          _ref = error.message;
          return _.alert((_ref) != null ? _ref : error);
        }
        const loadNotebookLocalName = name;
        const loadNotebookRemoteName = name;
        const loadNotebookDoc = doc;
        return deserialize(
          _,
          _localName,
          _remoteName,
          loadNotebookLocalName,
          loadNotebookRemoteName,
          loadNotebookDoc
        );
      });
    }

    const exportNotebook = () => {
      const remoteName = _remoteName();
      if (remoteName) {
        return window.open(`/3/NodePersistentStorage.bin/notebook/${remoteName}`, '_blank');
      }
      return _.alert('Please save this notebook before exporting.');
    };
    const goToH2OUrl = url => () => window.open(window.Flow.ContextPath + url, '_blank');
    const goToUrl = url => () => window.open(url, '_blank');
    const executeAllCells = (fromBeginning, go) => {
      let cellIndex;
      let cells;
      _isRunningAll(true);
      cells = _.cells().slice(0);
      const cellCount = cells.length;
      cellIndex = 0;
      if (!fromBeginning) {
        cells = cells.slice(_.selectedCellIndex);
        cellIndex = _.selectedCellIndex;
      }
      const executeNextCell = () => {
        let cell;
        // will be false if user-aborted
        if (_isRunningAll()) {
          cell = cells.shift();
          if (cell) {
            // Scroll immediately without affecting selection state.
            cell.scrollIntoView(true);
            cellIndex++;
            _runningCaption(`Running cell ${cellIndex} of ${cellCount}`);
            _runningPercent(`${Math.floor(100 * cellIndex / cellCount)}%`);
            _runningCellInput(cell.input());
            // TODO Continuation should be EFC, and passing an error should abort 'run all'
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
    const runAllCells = fromBeginning => {
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
            // 'done'
            return _.growl('Finished running your flow!', 'success');
        }
      });
    };
    const continueRunningAllCells = () => runAllCells(false);
    const stopRunningAll = () => _isRunningAll(false);
    const clearCell = () => {
      _.selectedCell.clear();
      return _.selectedCell.autoResize();
    };
    const clearAllCells = () => {
      let cell;
      let _i;
      let _len;
      const _ref = _.cells();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cell = _ref[_i];
        cell.clear();
        cell.autoResize();
      }
    };
    // noop
    const notImplemented = () => {};
    const pasteCellandReplace = notImplemented;
    const mergeCellAbove = notImplemented;
    const startTour = notImplemented;

    //
    // Top menu bar
    //
    const createMenu = (label, items) => ({
      label,
      items,
    });
    const createMenuHeader = label => ({
      label,
      action: null,
    });
    const createShortcutHint = shortcut => `<span style=\'float:right\'>${lodash.map(shortcut, key => `<kbd>${key}</kbd>`).join(' ')}</span>`;
    const createMenuItem = (label, action, shortcut) => {
      const kbds = shortcut ? createShortcutHint(shortcut) : '';
      return {
        label: `${lodash.escape(label)}${kbds}`,
        action,
      };
    };
    const menuDivider = {
      label: null,
      action: null,
    };
    const _menus = Flow.Dataflow.signal(null);
    menuCell = [
      createMenuItem('Run Cell', runCell, [
        'ctrl',
        'enter',
      ]),
      menuDivider,
      createMenuItem('Cut Cell', cutCell, ['x']),
      createMenuItem('Copy Cell', copyCell.bind(this, _), ['c']),
      createMenuItem('Paste Cell Above', pasteCellAbove, [
        'shift',
        'v',
      ]),
      createMenuItem('Paste Cell Below', pasteCellBelow, ['v']),
      // TODO createMenuItem('Paste Cell and Replace', pasteCellandReplace, true),
      createMenuItem('Delete Cell', deleteCell.bind(this, _), [
        'd',
        'd',
      ]),
      createMenuItem('Undo Delete Cell', undoLastDelete, ['z']),
      menuDivider,
      createMenuItem('Move Cell Up', moveCellUp, [
        'ctrl',
        'k',
      ]),
      createMenuItem('Move Cell Down', moveCellDown, [
        'ctrl',
        'j',
      ]),
      menuDivider,
      createMenuItem('Insert Cell Above', insertNewCellAbove, ['a']),
      createMenuItem('Insert Cell Below', insertNewCellBelow, ['b']),
      // TODO createMenuItem('Split Cell', splitCell),
      // TODO createMenuItem('Merge Cell Above', mergeCellAbove, true),
      // TODO createMenuItem('Merge Cell Below', mergeCellBelow),
      menuDivider,
      createMenuItem('Toggle Cell Input', toggleInput),
      createMenuItem('Toggle Cell Output', toggleOutput, ['o']),
      createMenuItem('Clear Cell Output', clearCell),
    ];
    const menuCellSW = [
      menuDivider,
      createMenuItem('Insert Scala Cell Above', insertNewScalaCellAbove),
      createMenuItem('Insert Scala Cell Below', insertNewScalaCellBelow),
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
        createMenuItem('Export Model...', executeCommand('exportModel')),
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
          createMenuItem('Download this Flow...', exportNotebook),
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
          createMenuItem('Impute...', executeCommand('imputeColumn')),
          // TODO Quantiles
          // TODO Interaction
        ]),
        createMenu('Model', modelMenuItems),
        createMenu('Score', [
          createMenuItem('Predict...', executeCommand('predict')),
          createMenuItem('Partial Dependence Plots...', executeCommand('buildPartialDependence')),
          menuDivider,
          createMenuItem('List All Predictions', executeCommand('getPredictions')),
          // TODO Confusion Matrix
          // TODO AUC
          // TODO Hit Ratio
          // TODO PCA Score
          // TODO Gains/Lift Table
          // TODO Multi-model Scoring
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
          // TODO Cluster I/O
          createMenuItem('Profiler', executeCommand('getProfile depth: 10')),
          createMenuItem('Timeline', executeCommand('getTimeline')),
          // TODO UDP Drop Test
          // TODO Task Status
          createMenuItem('Shut Down', shutdown),
        ]),
        createMenu('Help', [
          // TODO createMenuItem('Tour', startTour, true),
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
          // TODO Tutorial Flows
          createMenuItem('About', displayAbout),
        ]),
      ];
    };
    const setupMenus = () => requestModelBuilders(_, (error, builders) => _menus(initializeMenus(error ? [] : builders)));
    const createTool = (icon, label, action, isDisabled) => {
      if (isDisabled == null) {
        isDisabled = false;
      }
      return {
        label,
        action,
        isDisabled,
        icon: `fa fa-${icon}`,
      };
    };
    const _toolbar = [
      [
        createTool('file-o', 'New', createNotebook),
        createTool('folder-open-o', 'Open', promptForNotebook),
        createTool('save', 'Save (s)', saveNotebook),
      ],
      [
        createTool('plus', 'Insert Cell Below (b)', insertNewCellBelow),
        createTool('arrow-up', 'Move Cell Up (ctrl+k)', moveCellUp),
        createTool('arrow-down', 'Move Cell Down (ctrl+j)', moveCellDown),
      ],
      [
        createTool('cut', 'Cut Cell (x)', cutCell),
        createTool('copy', 'Copy Cell (c)', copyCell.bind(this, _)),
        createTool('paste', 'Paste Cell Below (v)', pasteCellBelow),
        createTool('eraser', 'Clear Cell', clearCell),
        createTool('trash-o', 'Delete Cell (d d)', deleteCell.bind(this, _)),
      ],
      [
        createTool('step-forward', 'Run and Select Below', runCellAndSelectBelow),
        createTool('play', 'Run (ctrl+enter)', runCell),
        createTool('forward', 'Run All', runAllCells),
      ],
          [createTool('question-circle', 'Assist Me', executeCommand('assist'))],
    ];


    // (From IPython Notebook keyboard shortcuts dialog)
    //
    // The IPython Notebook has two different keyboard input modes.
    // Edit mode allows you to type code/text into a cell
    // and is indicated by a green cell border.
    // Command mode binds the keyboard to notebook level
    // actions and is indicated by a grey cell border.
    //
    // Command Mode (press Esc to enable)
    //
    const normalModeKeyboardShortcuts = [
      [
        'enter',
        'edit mode',
        switchToEditMode,
      ],
      // [ 'shift+enter', 'run cell, select below', runCellAndSelectBelow ]
      // [ 'ctrl+enter', 'run cell', runCell ]
      // [ 'alt+enter', 'run cell, insert below', runCellAndInsertBelow ]
      [
        'y',
        'to code',
        convertCellToCode,
      ],
      [
        'm',
        'to markdown',
        convertCellToMarkdown,
      ],
      [
        'r',
        'to raw',
        convertCellToRaw,
      ],
      [
        '1',
        'to heading 1',
        convertCellToHeading(_, 1),
      ],
      [
        '2',
        'to heading 2',
        convertCellToHeading(_, 2),
      ],
      [
        '3',
        'to heading 3',
        convertCellToHeading(_, 3),
      ],
      [
        '4',
        'to heading 4',
        convertCellToHeading(_, 4),
      ],
      [
        '5',
        'to heading 5',
        convertCellToHeading(_, 5),
      ],
      [
        '6',
        'to heading 6',
        convertCellToHeading(_, 6),
      ],
      [
        'up',
        'select previous cell',
        selectPreviousCell,
      ],
      [
        'down',
        'select next cell',
        selectNextCell,
      ],
      [
        'k',
        'select previous cell',
        selectPreviousCell,
      ],
      [
        'j',
        'select next cell',
        selectNextCell,
      ],
      [
        'ctrl+k',
        'move cell up',
        moveCellUp,
      ],
      [
        'ctrl+j',
        'move cell down',
        moveCellDown,
      ],
      [
        'a',
        'insert cell above',
        insertNewCellAbove,
      ],
      [
        'b',
        'insert cell below',
        insertNewCellBelow,
      ],
      [
        'x',
        'cut cell',
        cutCell,
      ],
      [
        'c',
        'copy cell',
        copyCell,
      ],
      [
        'shift+v',
        'paste cell above',
        pasteCellAbove,
      ],
      [
        'v',
        'paste cell below',
        pasteCellBelow,
      ],
      [
        'z',
        'undo last delete',
        undoLastDelete,
      ],
      [
        'd d',
        'delete cell (press twice)',
        deleteCell,
      ],
      [
        'shift+m',
        'merge cell below',
        mergeCellBelow,
      ],
      [
        's',
        'save notebook',
        saveNotebook,
      ],
      // [ 'mod+s', 'save notebook', saveNotebook ]
      // [ 'l', 'toggle line numbers' ]
      [
        'o',
        'toggle output',
        toggleOutput,
      ],
      // [ 'shift+o', 'toggle output scrolling' ]
      [
        'h',
        'keyboard shortcuts',
        displayKeyboardShortcuts,
      ],
      // [ 'i', 'interrupt kernel (press twice)' ]
      // [ '0', 'restart kernel (press twice)' ]
    ];

    if (_.onSparklingWater) {
      normalModeKeyboardShortcuts.push([
        'q',
        'to Scala',
        convertCellToScala,
      ]);
    }

    //
    // Edit Mode (press Enter to enable)
    //
    const editModeKeyboardShortcuts = [
      // Tab : code completion or indent
      // Shift-Tab : tooltip
      // Cmd-] : indent
      // Cmd-[ : dedent
      // Cmd-a : select all
      // Cmd-z : undo
      // Cmd-Shift-z : redo
      // Cmd-y : redo
      // Cmd-Up : go to cell start
      // Cmd-Down : go to cell end
      // Opt-Left : go one word left
      // Opt-Right : go one word right
      // Opt-Backspace : del word before
      // Opt-Delete : del word after
      [
        'esc',
        'command mode',
        switchToCommandMode,
      ],
      [
        'ctrl+m',
        'command mode',
        switchToCommandMode,
      ],
      [
        'shift+enter',
        'run cell, select below',
        runCellAndSelectBelow,
      ],
      [
        'ctrl+enter',
        'run cell',
        runCell,
      ],
      [
        'alt+enter',
        'run cell, insert below',
        runCellAndInsertBelow,
      ],
      [
        'ctrl+shift+-',
        'split cell',
        splitCell,
      ],
      [
        'mod+s',
        'save notebook',
        saveNotebook,
      ],
    ];
    const toKeyboardHelp = shortcut => {
      const seq = shortcut[0];
      const caption = shortcut[1];
      const keystrokes = lodash.map(seq.split(/\+/g), key => `<kbd>${key}</kbd>`).join(' ');
      return {
        keystrokes,
        caption,
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
        _ref = normalModeKeyboardShortcuts[_i];
        shortcut = _ref[0];
        caption = _ref[1];
        f = _ref[2].bind(this, _);
        Mousetrap.bind(shortcut, f);
      }
      for (_j = 0, _len1 = editModeKeyboardShortcuts.length; _j < _len1; _j++) {
        _ref1 = editModeKeyboardShortcuts[_j];
        shortcut = _ref1[0];
        caption = _ref1[1];
        f = _ref1[2].bind(this, _);
        Mousetrap.bindGlobal(shortcut, f);
      }
    };
    const initialize = () => {
      setupKeyboardHandling('normal');
      setupMenus();
      Flow.Dataflow.link(_.load, loadNotebook);
      Flow.Dataflow.link(_.open, openNotebook);
      Flow.Dataflow.link(_.selectCell, selectCell.bind(this, _));
      Flow.Dataflow.link(_.executeAllCells, executeAllCells);
      Flow.Dataflow.link(_.insertAndExecuteCell, (type, input) => lodash.defer(appendCellAndRun, type, input));
      Flow.Dataflow.link(_.insertCell, (type, input) => lodash.defer(insertCellBelow, _, type, input));
      Flow.Dataflow.link(_.saved, () => _.growl('Notebook saved.'));
      Flow.Dataflow.link(_.loaded, () => _.growl('Notebook loaded.'));
      executeCommand('assist')();
      // TODO setPristine() when autosave is implemented.
      _.setDirty();
      if (_.onSparklingWater) {
        return _initializeInterpreter(_);
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
      cells: _.cells,
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
        editMode: editModeKeyboardShortcutsHelp,
      },
      about: _about,
      dialogs: _dialogs,
      templateOf(view) {
        return view.template;
      },
    };
  };
}

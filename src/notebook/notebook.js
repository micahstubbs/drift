import { serialize } from './serialize';
import { deserialize } from './deserialize';
import { createCell } from './createCell';
import { checkConsistency } from './checkConsistency';

import { copyCell } from './copyCell';
import { cutCell } from './cutCell';
import { deleteCell } from './deleteCell';
import { insertAbove } from './insertAbove';
import { insertCell } from './insertCell';
import { insertBelow } from './insertBelow';
import { appendCell } from './appendCell';
import { insertNewCellBelow } from './insertNewCellBelow';
import { moveCellUp } from './moveCellUp';
import { mergeCellBelow } from './mergeCellBelow';
import { splitCell } from './splitCell';
import { pasteCellAbove } from './pasteCellAbove';
import { pasteCellBelow } from './pasteCellBelow';
import { runCell } from './runCell';
import { runCellAndSelectBelow } from './runCellAndSelectBelow';
import { saveNotebook } from './saveNotebook';
import { promptForNotebook } from './promptForNotebook';
import { editName } from './editName';
import { saveName } from './saveName';
import { toggleSidebar } from './toggleSidebar';
import { moveCellDown } from './moveCellDown';
// figured out how to use `export default function` syntax here
// hence no {} curly braces
import executeCommand from './executeCommand';
import createNotebook from './createNotebook';
import runAllCells from './runAllCells';
import stopRunningAll from './stopRunningAll';
import clearCell from './clearCell';
import notImplemented from './notImplemented';
import createMenu from './createMenu';

import createTool from './createTool';
import toKeyboardHelp from './toKeyboardHelp';
import createNormalModeKeyboardShortcuts from './createNormalModeKeyboardShortcuts';
import createEditModeKeyboardShortcuts from './createEditModeKeyboardShortcuts';
import initialize from './initialize';

import { getObjectExistsRequest } from '../h2oProxy/getObjectExistsRequest';

import { flowStatus } from '../flowStatus';
import { flowSidebar } from '../flowSidebar';
import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function notebook() {
  const lodash = window._;
  const Flow = window.Flow;
  const Mousetrap = window.Mousetrap;
  const $ = window.jQuery;
  const __slice = [].slice;
  Flow.notebook = (_) => {
    _.localName = Flow.Dataflow.signal('Untitled Flow');
    Flow.Dataflow.react(_.localName, name => {
      document.title = `H2O${(name && name.trim() ? `- ${name}` : '')}`;
      return document.title;
    });
    _.remoteName = Flow.Dataflow.signal(null);
    _.isEditingName = Flow.Dataflow.signal(false);
    _.cells = Flow.Dataflow.signals([]);
    _.selectedCell = null;
    _.selectedCellIndex = -1;
    _.clipboardCell = null;
    _.lastDeletedCell = null;
    _.areInputsHidden = Flow.Dataflow.signal(false);
    _.areOutputsHidden = Flow.Dataflow.signal(false);
    _.isSidebarHidden = Flow.Dataflow.signal(false);
    _.isRunningAll = Flow.Dataflow.signal(false);
    _.runningCaption = Flow.Dataflow.signal('Running');
    _.runningPercent = Flow.Dataflow.signal('0%');
    _.runningCellInput = Flow.Dataflow.signal('');
    const _status = flowStatus(_);
    const _sidebar = flowSidebar(_);
    const _about = Flow.about(_);
    const _dialogs = Flow.dialogs(_);
    const pasteCellandReplace = notImplemented;
    const mergeCellAbove = notImplemented;
    const startTour = notImplemented;

    //
    // Top menu bar
    //
    _.menus = Flow.Dataflow.signal(null);
    const _toolbar = [
      [
        createTool('file-o', 'New', createNotebook.bind(this, _)),
        createTool('folder-open-o', 'Open', promptForNotebook.bind(this, _)),
        createTool('save', 'Save (s)', saveNotebook.bind(this, _)),
      ],
      [
        createTool('plus', 'Insert Cell Below (b)', insertNewCellBelow.bind(this, _)),
        createTool('arrow-up', 'Move Cell Up (ctrl+k)', moveCellUp.bind(this, _)),
        createTool('arrow-down', 'Move Cell Down (ctrl+j)', moveCellDown.bind(this, _)),
      ],
      [
        createTool('cut', 'Cut Cell (x)', cutCell.bind(this, _)),
        createTool('copy', 'Copy Cell (c)', copyCell.bind(this, _)),
        createTool('paste', 'Paste Cell Below (v)', pasteCellBelow.bind(this, _)),
        createTool('eraser', 'Clear Cell', clearCell.bind(this, _)),
        createTool('trash-o', 'Delete Cell (d d)', deleteCell.bind(this, _)),
      ],
      [
        createTool('step-forward', 'Run and Select Below', runCellAndSelectBelow.bind(this, _)),
        createTool('play', 'Run (ctrl+enter)', runCell.bind(this, _)),
        createTool('forward', 'Run All', runAllCells.bind(this, _)),
      ],
      [createTool('question-circle', 'Assist Me', executeCommand(_, 'assist'))],
    ];

    const normalModeKeyboardShortcuts = createNormalModeKeyboardShortcuts(_);
    const editModeKeyboardShortcuts = createEditModeKeyboardShortcuts();
    const normalModeKeyboardShortcutsHelp = lodash.map(normalModeKeyboardShortcuts, toKeyboardHelp);
    const editModeKeyboardShortcutsHelp = lodash.map(editModeKeyboardShortcuts, toKeyboardHelp);
    Flow.Dataflow.link(_.ready, initialize.bind(this, _));
    return {
      name: _.localName,
      isEditingName: _.isEditingName,
      editName: editName.bind(this, _),
      saveName: saveName.bind(this, _),
      menus: _.menus,
      sidebar: _sidebar,
      status: _status,
      toolbar: _toolbar,
      cells: _.cells,
      areInputsHidden: _.areInputsHidden,
      areOutputsHidden: _.areOutputsHidden,
      isSidebarHidden: _.isSidebarHidden,
      isRunningAll: _.isRunningAll,
      runningCaption: _.runningCaption,
      runningPercent: _.runningPercent,
      runningCellInput: _.runningCellInput,
      stopRunningAll: stopRunningAll.bind(this, _),
      toggleSidebar: toggleSidebar.bind(this, _),
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

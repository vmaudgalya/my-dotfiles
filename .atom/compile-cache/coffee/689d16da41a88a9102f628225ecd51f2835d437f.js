(function() {
  var Cursor, Delegator, DisplayBuffer, Editor, LanguageMode, Model, Point, Range, Selection, Serializable, TextMateScopeSelector, deprecate, path, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore-plus');

  path = require('path');

  Serializable = require('serializable');

  Delegator = require('delegato');

  deprecate = require('grim').deprecate;

  Model = require('theorist').Model;

  _ref = require('text-buffer'), Point = _ref.Point, Range = _ref.Range;

  LanguageMode = require('./language-mode');

  DisplayBuffer = require('./display-buffer');

  Cursor = require('./cursor');

  Selection = require('./selection');

  TextMateScopeSelector = require('first-mate').ScopeSelector;

  module.exports = Editor = (function(_super) {
    __extends(Editor, _super);

    Serializable.includeInto(Editor);

    atom.deserializers.add(Editor);

    Delegator.includeInto(Editor);

    Editor.prototype.deserializing = false;

    Editor.prototype.callDisplayBufferCreatedHook = false;

    Editor.prototype.registerEditor = false;

    Editor.prototype.buffer = null;

    Editor.prototype.languageMode = null;

    Editor.prototype.cursors = null;

    Editor.prototype.selections = null;

    Editor.prototype.suppressSelectionMerging = false;

    Editor.delegatesMethods('suggestedIndentForBufferRow', 'autoIndentBufferRow', 'autoIndentBufferRows', 'autoDecreaseIndentForBufferRow', 'toggleLineCommentForBufferRow', 'toggleLineCommentsForBufferRows', {
      toProperty: 'languageMode'
    });

    Editor.delegatesProperties('$lineHeight', '$defaultCharWidth', '$height', '$width', '$scrollTop', '$scrollLeft', 'manageScrollPosition', {
      toProperty: 'displayBuffer'
    });

    function Editor(_arg) {
      var buffer, initialColumn, initialLine, marker, registerEditor, softWrap, suppressCursorCreation, tabLength, _i, _len, _ref1, _ref2, _ref3, _ref4, _ref5;
      this.softTabs = _arg.softTabs, initialLine = _arg.initialLine, initialColumn = _arg.initialColumn, tabLength = _arg.tabLength, softWrap = _arg.softWrap, this.displayBuffer = _arg.displayBuffer, buffer = _arg.buffer, registerEditor = _arg.registerEditor, suppressCursorCreation = _arg.suppressCursorCreation;
      this.handleMarkerCreated = __bind(this.handleMarkerCreated, this);
      Editor.__super__.constructor.apply(this, arguments);
      this.cursors = [];
      this.selections = [];
      if (this.displayBuffer == null) {
        this.displayBuffer = new DisplayBuffer({
          buffer: buffer,
          tabLength: tabLength,
          softWrap: softWrap
        });
      }
      this.buffer = this.displayBuffer.buffer;
      this.softTabs = (_ref1 = (_ref2 = (_ref3 = this.buffer.usesSoftTabs()) != null ? _ref3 : this.softTabs) != null ? _ref2 : atom.config.get('editor.softTabs')) != null ? _ref1 : true;
      _ref4 = this.findMarkers(this.getSelectionMarkerAttributes());
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        marker = _ref4[_i];
        marker.setAttributes({
          preserveFolds: true
        });
        this.addSelection(marker);
      }
      this.subscribeToBuffer();
      this.subscribeToDisplayBuffer();
      if (this.getCursors().length === 0 && !suppressCursorCreation) {
        initialLine = Math.max(parseInt(initialLine) || 0, 0);
        initialColumn = Math.max(parseInt(initialColumn) || 0, 0);
        this.addCursorAtBufferPosition([initialLine, initialColumn]);
      }
      this.languageMode = new LanguageMode(this);
      this.subscribe(this.$scrollTop, (function(_this) {
        return function(scrollTop) {
          return _this.emit('scroll-top-changed', scrollTop);
        };
      })(this));
      this.subscribe(this.$scrollLeft, (function(_this) {
        return function(scrollLeft) {
          return _this.emit('scroll-left-changed', scrollLeft);
        };
      })(this));
      if (registerEditor) {
        if ((_ref5 = atom.workspace) != null) {
          _ref5.editorAdded(this);
        }
      }
    }

    Editor.prototype.serializeParams = function() {
      return {
        id: this.id,
        softTabs: this.softTabs,
        scrollTop: this.scrollTop,
        scrollLeft: this.scrollLeft,
        displayBuffer: this.displayBuffer.serialize()
      };
    };

    Editor.prototype.deserializeParams = function(params) {
      params.displayBuffer = DisplayBuffer.deserialize(params.displayBuffer);
      params.registerEditor = true;
      return params;
    };

    Editor.prototype.subscribeToBuffer = function() {
      this.buffer.retain();
      this.subscribe(this.buffer, "path-changed", (function(_this) {
        return function() {
          if (atom.project.getPath() == null) {
            atom.project.setPath(path.dirname(_this.getPath()));
          }
          _this.emit("title-changed");
          return _this.emit("path-changed");
        };
      })(this));
      this.subscribe(this.buffer, "contents-modified", (function(_this) {
        return function() {
          return _this.emit("contents-modified");
        };
      })(this));
      this.subscribe(this.buffer, "contents-conflicted", (function(_this) {
        return function() {
          return _this.emit("contents-conflicted");
        };
      })(this));
      this.subscribe(this.buffer, "modified-status-changed", (function(_this) {
        return function() {
          return _this.emit("modified-status-changed");
        };
      })(this));
      this.subscribe(this.buffer, "destroyed", (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
      return this.preserveCursorPositionOnBufferReload();
    };

    Editor.prototype.subscribeToDisplayBuffer = function() {
      this.subscribe(this.displayBuffer, 'marker-created', this.handleMarkerCreated);
      this.subscribe(this.displayBuffer, "changed", (function(_this) {
        return function(e) {
          return _this.emit('screen-lines-changed', e);
        };
      })(this));
      this.subscribe(this.displayBuffer, "markers-updated", (function(_this) {
        return function() {
          return _this.mergeIntersectingSelections();
        };
      })(this));
      this.subscribe(this.displayBuffer, 'grammar-changed', (function(_this) {
        return function() {
          return _this.handleGrammarChange();
        };
      })(this));
      return this.subscribe(this.displayBuffer, 'soft-wrap-changed', (function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return _this.emit.apply(_this, ['soft-wrap-changed'].concat(__slice.call(args)));
        };
      })(this));
    };

    Editor.prototype.getViewClass = function() {
      if (atom.config.get('core.useReactEditor')) {
        return require('./react-editor-view');
      } else {
        return require('./editor-view');
      }
    };

    Editor.prototype.destroyed = function() {
      var selection, _i, _len, _ref1;
      this.unsubscribe();
      _ref1 = this.getSelections();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        selection.destroy();
      }
      this.buffer.release();
      this.displayBuffer.destroy();
      return this.languageMode.destroy();
    };

    Editor.prototype.copy = function() {
      var displayBuffer, marker, newEditor, softTabs, tabLength, _i, _len, _ref1;
      tabLength = this.getTabLength();
      displayBuffer = this.displayBuffer.copy();
      softTabs = this.getSoftTabs();
      newEditor = new Editor({
        buffer: this.buffer,
        displayBuffer: displayBuffer,
        tabLength: tabLength,
        softTabs: softTabs,
        suppressCursorCreation: true,
        registerEditor: true
      });
      _ref1 = this.findMarkers({
        editorId: this.id
      });
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        marker = _ref1[_i];
        marker.copy({
          editorId: newEditor.id,
          preserveFolds: true
        });
      }
      return newEditor;
    };

    Editor.prototype.getTitle = function() {
      var sessionPath;
      if (sessionPath = this.getPath()) {
        return path.basename(sessionPath);
      } else {
        return 'untitled';
      }
    };

    Editor.prototype.getLongTitle = function() {
      var directory, fileName, sessionPath;
      if (sessionPath = this.getPath()) {
        fileName = path.basename(sessionPath);
        directory = path.basename(path.dirname(sessionPath));
        return "" + fileName + " - " + directory;
      } else {
        return 'untitled';
      }
    };

    Editor.prototype.setVisible = function(visible) {
      return this.displayBuffer.setVisible(visible);
    };

    Editor.prototype.setEditorWidthInChars = function(editorWidthInChars) {
      return this.displayBuffer.setEditorWidthInChars(editorWidthInChars);
    };

    Editor.prototype.getSoftWrapColumn = function() {
      return this.displayBuffer.getSoftWrapColumn();
    };

    Editor.prototype.getSoftTabs = function() {
      return this.softTabs;
    };

    Editor.prototype.setSoftTabs = function(softTabs) {
      this.softTabs = softTabs;
      return this.softTabs;
    };

    Editor.prototype.toggleSoftTabs = function() {
      return this.setSoftTabs(!this.getSoftTabs());
    };

    Editor.prototype.getSoftWrap = function() {
      return this.displayBuffer.getSoftWrap();
    };

    Editor.prototype.setSoftWrap = function(softWrap) {
      return this.displayBuffer.setSoftWrap(softWrap);
    };

    Editor.prototype.toggleSoftWrap = function() {
      return this.setSoftWrap(!this.getSoftWrap());
    };

    Editor.prototype.getTabText = function() {
      return this.buildIndentString(1);
    };

    Editor.prototype.getTabLength = function() {
      return this.displayBuffer.getTabLength();
    };

    Editor.prototype.setTabLength = function(tabLength) {
      return this.displayBuffer.setTabLength(tabLength);
    };

    Editor.prototype.clipBufferPosition = function(bufferPosition) {
      return this.buffer.clipPosition(bufferPosition);
    };

    Editor.prototype.clipBufferRange = function(range) {
      return this.buffer.clipRange(range);
    };

    Editor.prototype.indentationForBufferRow = function(bufferRow) {
      return this.indentLevelForLine(this.lineForBufferRow(bufferRow));
    };

    Editor.prototype.setIndentationForBufferRow = function(bufferRow, newLevel, _arg) {
      var endColumn, newIndentString, preserveLeadingWhitespace;
      preserveLeadingWhitespace = (_arg != null ? _arg : {}).preserveLeadingWhitespace;
      if (preserveLeadingWhitespace) {
        endColumn = 0;
      } else {
        endColumn = this.lineForBufferRow(bufferRow).match(/^\s*/)[0].length;
      }
      newIndentString = this.buildIndentString(newLevel);
      return this.buffer.setTextInRange([[bufferRow, 0], [bufferRow, endColumn]], newIndentString);
    };

    Editor.prototype.indentLevelForLine = function(line) {
      return this.displayBuffer.indentLevelForLine(line);
    };

    Editor.prototype.buildIndentString = function(number) {
      if (this.getSoftTabs()) {
        return _.multiplyString(" ", Math.floor(number * this.getTabLength()));
      } else {
        return _.multiplyString("\t", Math.floor(number));
      }
    };

    Editor.prototype.save = function() {
      return this.buffer.save();
    };

    Editor.prototype.saveAs = function(filePath) {
      return this.buffer.saveAs(filePath);
    };

    Editor.prototype.checkoutHead = function() {
      var filePath, _ref1;
      if (filePath = this.getPath()) {
        return (_ref1 = atom.project.getRepo()) != null ? _ref1.checkoutHead(filePath) : void 0;
      }
    };

    Editor.prototype.copyPathToClipboard = function() {
      var filePath;
      if (filePath = this.getPath()) {
        return atom.clipboard.write(filePath);
      }
    };

    Editor.prototype.getPath = function() {
      return this.buffer.getPath();
    };

    Editor.prototype.getText = function() {
      return this.buffer.getText();
    };

    Editor.prototype.setText = function(text) {
      return this.buffer.setText(text);
    };

    Editor.prototype.getTextInRange = function(range) {
      return this.buffer.getTextInRange(range);
    };

    Editor.prototype.getLineCount = function() {
      return this.buffer.getLineCount();
    };

    Editor.prototype.getBuffer = function() {
      return this.buffer;
    };

    Editor.prototype.getUri = function() {
      return this.buffer.getUri();
    };

    Editor.prototype.isBufferRowBlank = function(bufferRow) {
      return this.buffer.isRowBlank(bufferRow);
    };

    Editor.prototype.isBufferRowCommented = function(bufferRow) {
      var match, scopes;
      if (match = this.lineForBufferRow(bufferRow).match(/\S/)) {
        scopes = this.tokenForBufferPosition([bufferRow, match.index]).scopes;
        return new TextMateScopeSelector('comment.*').matches(scopes);
      }
    };

    Editor.prototype.nextNonBlankBufferRow = function(bufferRow) {
      return this.buffer.nextNonBlankRow(bufferRow);
    };

    Editor.prototype.getEofBufferPosition = function() {
      return this.buffer.getEndPosition();
    };

    Editor.prototype.getLastBufferRow = function() {
      return this.buffer.getLastRow();
    };

    Editor.prototype.bufferRangeForBufferRow = function(row, _arg) {
      var includeNewline;
      includeNewline = (_arg != null ? _arg : {}).includeNewline;
      return this.buffer.rangeForRow(row, includeNewline);
    };

    Editor.prototype.lineForBufferRow = function(row) {
      return this.buffer.lineForRow(row);
    };

    Editor.prototype.lineLengthForBufferRow = function(row) {
      return this.buffer.lineLengthForRow(row);
    };

    Editor.prototype.scan = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.buffer).scan.apply(_ref1, args);
    };

    Editor.prototype.scanInBufferRange = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.buffer).scanInRange.apply(_ref1, args);
    };

    Editor.prototype.backwardsScanInBufferRange = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.buffer).backwardsScanInRange.apply(_ref1, args);
    };

    Editor.prototype.isModified = function() {
      return this.buffer.isModified();
    };

    Editor.prototype.shouldPromptToSave = function() {
      return this.isModified() && !this.buffer.hasMultipleEditors();
    };

    Editor.prototype.screenPositionForBufferPosition = function(bufferPosition, options) {
      return this.displayBuffer.screenPositionForBufferPosition(bufferPosition, options);
    };

    Editor.prototype.bufferPositionForScreenPosition = function(screenPosition, options) {
      return this.displayBuffer.bufferPositionForScreenPosition(screenPosition, options);
    };

    Editor.prototype.screenRangeForBufferRange = function(bufferRange) {
      return this.displayBuffer.screenRangeForBufferRange(bufferRange);
    };

    Editor.prototype.bufferRangeForScreenRange = function(screenRange) {
      return this.displayBuffer.bufferRangeForScreenRange(screenRange);
    };

    Editor.prototype.clipScreenPosition = function(screenPosition, options) {
      return this.displayBuffer.clipScreenPosition(screenPosition, options);
    };

    Editor.prototype.lineForScreenRow = function(row) {
      return this.displayBuffer.lineForRow(row);
    };

    Editor.prototype.linesForScreenRows = function(start, end) {
      return this.displayBuffer.linesForRows(start, end);
    };

    Editor.prototype.getScreenLineCount = function() {
      return this.displayBuffer.getLineCount();
    };

    Editor.prototype.getMaxScreenLineLength = function() {
      return this.displayBuffer.getMaxLineLength();
    };

    Editor.prototype.getLastScreenRow = function() {
      return this.displayBuffer.getLastRow();
    };

    Editor.prototype.bufferRowsForScreenRows = function(startRow, endRow) {
      return this.displayBuffer.bufferRowsForScreenRows(startRow, endRow);
    };

    Editor.prototype.bufferRowForScreenRow = function(row) {
      return this.displayBuffer.bufferRowForScreenRow(row);
    };

    Editor.prototype.scopesForBufferPosition = function(bufferPosition) {
      return this.displayBuffer.scopesForBufferPosition(bufferPosition);
    };

    Editor.prototype.bufferRangeForScopeAtCursor = function(selector) {
      return this.displayBuffer.bufferRangeForScopeAtPosition(selector, this.getCursorBufferPosition());
    };

    Editor.prototype.tokenForBufferPosition = function(bufferPosition) {
      return this.displayBuffer.tokenForBufferPosition(bufferPosition);
    };

    Editor.prototype.getCursorScopes = function() {
      return this.getCursor().getScopes();
    };

    Editor.prototype.logCursorScope = function() {
      return console.log(this.getCursorScopes());
    };

    Editor.prototype.insertText = function(text, options) {
      if (options == null) {
        options = {};
      }
      if (options.autoIndentNewline == null) {
        options.autoIndentNewline = this.shouldAutoIndent();
      }
      if (options.autoDecreaseIndent == null) {
        options.autoDecreaseIndent = this.shouldAutoIndent();
      }
      return this.mutateSelectedText(function(selection) {
        return selection.insertText(text, options);
      });
    };

    Editor.prototype.insertNewline = function() {
      return this.insertText('\n');
    };

    Editor.prototype.insertNewlineBelow = function() {
      return this.transact((function(_this) {
        return function() {
          _this.moveCursorToEndOfLine();
          return _this.insertNewline();
        };
      })(this));
    };

    Editor.prototype.insertNewlineAbove = function() {
      return this.transact((function(_this) {
        return function() {
          var bufferRow, indentLevel, onFirstLine;
          bufferRow = _this.getCursorBufferPosition().row;
          indentLevel = _this.indentationForBufferRow(bufferRow);
          onFirstLine = bufferRow === 0;
          _this.moveCursorToBeginningOfLine();
          _this.moveCursorLeft();
          _this.insertNewline();
          if (_this.shouldAutoIndent() && _this.indentationForBufferRow(bufferRow) < indentLevel) {
            _this.setIndentationForBufferRow(bufferRow, indentLevel);
          }
          if (onFirstLine) {
            _this.moveCursorUp();
            return _this.moveCursorToEndOfLine();
          }
        };
      })(this));
    };

    Editor.prototype.indent = function(options) {
      if (options == null) {
        options = {};
      }
      if (options.autoIndent == null) {
        options.autoIndent = this.shouldAutoIndent();
      }
      return this.mutateSelectedText(function(selection) {
        return selection.indent(options);
      });
    };

    Editor.prototype.backspace = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.backspace();
      });
    };

    Editor.prototype.backspaceToBeginningOfWord = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.backspaceToBeginningOfWord();
      });
    };

    Editor.prototype.backspaceToBeginningOfLine = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.backspaceToBeginningOfLine();
      });
    };

    Editor.prototype["delete"] = function() {
      return this.mutateSelectedText(function(selection) {
        return selection["delete"]();
      });
    };

    Editor.prototype.deleteToEndOfWord = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.deleteToEndOfWord();
      });
    };

    Editor.prototype.deleteLine = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.deleteLine();
      });
    };

    Editor.prototype.indentSelectedRows = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.indentSelectedRows();
      });
    };

    Editor.prototype.outdentSelectedRows = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.outdentSelectedRows();
      });
    };

    Editor.prototype.toggleLineCommentsInSelection = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.toggleLineComments();
      });
    };

    Editor.prototype.autoIndentSelectedRows = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.autoIndentSelectedRows();
      });
    };

    Editor.prototype.normalizeTabsInBufferRange = function(bufferRange) {
      if (!this.getSoftTabs()) {
        return;
      }
      return this.scanInBufferRange(/\t/g, bufferRange, (function(_this) {
        return function(_arg) {
          var replace;
          replace = _arg.replace;
          return replace(_this.getTabText());
        };
      })(this));
    };

    Editor.prototype.cutToEndOfLine = function() {
      var maintainClipboard;
      maintainClipboard = false;
      return this.mutateSelectedText(function(selection) {
        selection.cutToEndOfLine(maintainClipboard);
        return maintainClipboard = true;
      });
    };

    Editor.prototype.cutSelectedText = function() {
      var maintainClipboard;
      maintainClipboard = false;
      return this.mutateSelectedText(function(selection) {
        selection.cut(maintainClipboard);
        return maintainClipboard = true;
      });
    };

    Editor.prototype.copySelectedText = function() {
      var maintainClipboard, selection, _i, _len, _ref1, _results;
      maintainClipboard = false;
      _ref1 = this.getSelections();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        selection.copy(maintainClipboard);
        _results.push(maintainClipboard = true);
      }
      return _results;
    };

    Editor.prototype.pasteText = function(options) {
      var containsNewlines, metadata, text, _ref1;
      if (options == null) {
        options = {};
      }
      _ref1 = atom.clipboard.readWithMetadata(), text = _ref1.text, metadata = _ref1.metadata;
      containsNewlines = text.indexOf('\n') !== -1;
      if (((metadata != null ? metadata.selections : void 0) != null) && metadata.selections.length === this.getSelections().length) {
        this.mutateSelectedText((function(_this) {
          return function(selection, index) {
            text = metadata.selections[index];
            return selection.insertText(text, options);
          };
        })(this));
        return;
      } else if (atom.config.get("editor.normalizeIndentOnPaste") && ((metadata != null ? metadata.indentBasis : void 0) != null)) {
        if (!this.getCursor().hasPrecedingCharactersOnLine() || containsNewlines) {
          if (options.indentBasis == null) {
            options.indentBasis = metadata.indentBasis;
          }
        }
      }
      return this.insertText(text, options);
    };

    Editor.prototype.undo = function() {
      this.getCursor().needsAutoscroll = true;
      return this.buffer.undo(this);
    };

    Editor.prototype.redo = function() {
      this.getCursor().needsAutoscroll = true;
      return this.buffer.redo(this);
    };

    Editor.prototype.foldCurrentRow = function() {
      var bufferRow;
      bufferRow = this.bufferPositionForScreenPosition(this.getCursorScreenPosition()).row;
      return this.foldBufferRow(bufferRow);
    };

    Editor.prototype.unfoldCurrentRow = function() {
      var bufferRow;
      bufferRow = this.bufferPositionForScreenPosition(this.getCursorScreenPosition()).row;
      return this.unfoldBufferRow(bufferRow);
    };

    Editor.prototype.foldSelectedLines = function() {
      var selection, _i, _len, _ref1, _results;
      _ref1 = this.getSelections();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        _results.push(selection.fold());
      }
      return _results;
    };

    Editor.prototype.foldAll = function() {
      return this.languageMode.foldAll();
    };

    Editor.prototype.unfoldAll = function() {
      return this.languageMode.unfoldAll();
    };

    Editor.prototype.foldAllAtIndentLevel = function(level) {
      return this.languageMode.foldAllAtIndentLevel(level);
    };

    Editor.prototype.foldBufferRow = function(bufferRow) {
      return this.languageMode.foldBufferRow(bufferRow);
    };

    Editor.prototype.unfoldBufferRow = function(bufferRow) {
      return this.displayBuffer.unfoldBufferRow(bufferRow);
    };

    Editor.prototype.isFoldableAtBufferRow = function(bufferRow) {
      return this.languageMode.isFoldableAtBufferRow(bufferRow);
    };

    Editor.prototype.createFold = function(startRow, endRow) {
      return this.displayBuffer.createFold(startRow, endRow);
    };

    Editor.prototype.destroyFoldWithId = function(id) {
      return this.displayBuffer.destroyFoldWithId(id);
    };

    Editor.prototype.destroyFoldsIntersectingBufferRange = function(bufferRange) {
      var row, _i, _ref1, _ref2, _results;
      _results = [];
      for (row = _i = _ref1 = bufferRange.start.row, _ref2 = bufferRange.end.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; row = _ref1 <= _ref2 ? ++_i : --_i) {
        _results.push(this.unfoldBufferRow(row));
      }
      return _results;
    };

    Editor.prototype.toggleFoldAtBufferRow = function(bufferRow) {
      if (this.isFoldedAtBufferRow(bufferRow)) {
        return this.unfoldBufferRow(bufferRow);
      } else {
        return this.foldBufferRow(bufferRow);
      }
    };

    Editor.prototype.isFoldedAtCursorRow = function() {
      return this.isFoldedAtScreenRow(this.getCursorScreenRow());
    };

    Editor.prototype.isFoldedAtBufferRow = function(bufferRow) {
      return this.displayBuffer.isFoldedAtBufferRow(bufferRow);
    };

    Editor.prototype.isFoldedAtScreenRow = function(screenRow) {
      return this.displayBuffer.isFoldedAtScreenRow(screenRow);
    };

    Editor.prototype.largestFoldContainingBufferRow = function(bufferRow) {
      return this.displayBuffer.largestFoldContainingBufferRow(bufferRow);
    };

    Editor.prototype.largestFoldStartingAtScreenRow = function(screenRow) {
      return this.displayBuffer.largestFoldStartingAtScreenRow(screenRow);
    };

    Editor.prototype.outermostFoldsInBufferRowRange = function(startRow, endRow) {
      return this.displayBuffer.outermostFoldsInBufferRowRange(startRow, endRow);
    };

    Editor.prototype.moveLineUp = function() {
      var lastRow, selection;
      selection = this.getSelectedBufferRange();
      if (selection.start.row === 0) {
        return;
      }
      lastRow = this.buffer.getLastRow();
      if (selection.isEmpty() && selection.start.row === lastRow && this.buffer.getLastLine() === '') {
        return;
      }
      return this.transact((function(_this) {
        return function() {
          var bufferRange, endPosition, endRow, fold, foldedRow, foldedRows, insertDelta, insertPosition, lines, precedingBufferRow, precedingScreenRow, row, rows, startRow, _i, _j, _k, _len, _len1, _ref1, _ref2, _results;
          foldedRows = [];
          rows = (function() {
            _results = [];
            for (var _i = _ref1 = selection.start.row, _ref2 = selection.end.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref1 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this);
          if (selection.start.row !== selection.end.row && selection.end.column === 0) {
            if (!_this.isFoldedAtBufferRow(selection.end.row)) {
              rows.pop();
            }
          }
          precedingScreenRow = _this.screenPositionForBufferPosition([selection.start.row]).translate([-1]);
          precedingBufferRow = _this.bufferPositionForScreenPosition(precedingScreenRow).row;
          if (fold = _this.largestFoldContainingBufferRow(precedingBufferRow)) {
            insertDelta = fold.getBufferRange().getRowCount();
          } else {
            insertDelta = 1;
          }
          for (_j = 0, _len = rows.length; _j < _len; _j++) {
            row = rows[_j];
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(row)) {
              bufferRange = fold.getBufferRange();
              startRow = bufferRange.start.row;
              endRow = bufferRange.end.row;
              foldedRows.push(startRow - insertDelta);
            } else {
              startRow = row;
              endRow = row;
            }
            insertPosition = Point.fromObject([startRow - insertDelta]);
            endPosition = Point.min([endRow + 1], _this.buffer.getEndPosition());
            lines = _this.buffer.getTextInRange([[startRow], endPosition]);
            if (endPosition.row === lastRow && endPosition.column > 0 && !_this.buffer.lineEndingForRow(endPosition.row)) {
              lines = "" + lines + "\n";
            }
            _this.buffer.deleteRows(startRow, endRow);
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(insertPosition.row)) {
              _this.unfoldBufferRow(insertPosition.row);
              foldedRows.push(insertPosition.row + endRow - startRow + fold.getBufferRange().getRowCount());
            }
            _this.buffer.insert(insertPosition, lines);
          }
          for (_k = 0, _len1 = foldedRows.length; _k < _len1; _k++) {
            foldedRow = foldedRows[_k];
            if ((0 <= foldedRow && foldedRow <= _this.getLastBufferRow())) {
              _this.foldBufferRow(foldedRow);
            }
          }
          return _this.setSelectedBufferRange(selection.translate([-insertDelta]), {
            preserveFolds: true,
            autoscroll: true
          });
        };
      })(this));
    };

    Editor.prototype.moveLineDown = function() {
      var lastRow, selection;
      selection = this.getSelectedBufferRange();
      lastRow = this.buffer.getLastRow();
      if (selection.end.row === lastRow) {
        return;
      }
      if (selection.end.row === lastRow - 1 && this.buffer.getLastLine() === '') {
        return;
      }
      return this.transact((function(_this) {
        return function() {
          var bufferRange, endPosition, endRow, fold, foldedRow, foldedRows, followingBufferRow, followingScreenRow, insertDelta, insertPosition, lines, row, rows, startRow, _i, _j, _k, _len, _len1, _ref1, _ref2, _results;
          foldedRows = [];
          rows = (function() {
            _results = [];
            for (var _i = _ref1 = selection.end.row, _ref2 = selection.start.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref1 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this);
          if (selection.start.row !== selection.end.row && selection.end.column === 0) {
            if (!_this.isFoldedAtBufferRow(selection.end.row)) {
              rows.shift();
            }
          }
          followingScreenRow = _this.screenPositionForBufferPosition([selection.end.row]).translate([1]);
          followingBufferRow = _this.bufferPositionForScreenPosition(followingScreenRow).row;
          if (fold = _this.largestFoldContainingBufferRow(followingBufferRow)) {
            insertDelta = fold.getBufferRange().getRowCount();
          } else {
            insertDelta = 1;
          }
          for (_j = 0, _len = rows.length; _j < _len; _j++) {
            row = rows[_j];
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(row)) {
              bufferRange = fold.getBufferRange();
              startRow = bufferRange.start.row;
              endRow = bufferRange.end.row;
              foldedRows.push(endRow + insertDelta);
            } else {
              startRow = row;
              endRow = row;
            }
            if (endRow + 1 === lastRow) {
              endPosition = [endRow, _this.buffer.lineLengthForRow(endRow)];
            } else {
              endPosition = [endRow + 1];
            }
            lines = _this.buffer.getTextInRange([[startRow], endPosition]);
            _this.buffer.deleteRows(startRow, endRow);
            insertPosition = Point.min([startRow + insertDelta], _this.buffer.getEndPosition());
            if (insertPosition.row === _this.buffer.getLastRow() && insertPosition.column > 0) {
              lines = "\n" + lines;
            }
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(insertPosition.row)) {
              _this.unfoldBufferRow(insertPosition.row);
              foldedRows.push(insertPosition.row + fold.getBufferRange().getRowCount());
            }
            _this.buffer.insert(insertPosition, lines);
          }
          for (_k = 0, _len1 = foldedRows.length; _k < _len1; _k++) {
            foldedRow = foldedRows[_k];
            if ((0 <= foldedRow && foldedRow <= _this.getLastBufferRow())) {
              _this.foldBufferRow(foldedRow);
            }
          }
          return _this.setSelectedBufferRange(selection.translate([insertDelta]), {
            preserveFolds: true,
            autoscroll: true
          });
        };
      })(this));
    };

    Editor.prototype.duplicateLines = function() {
      return this.transact((function(_this) {
        return function() {
          var delta, endRow, foldEndRow, foldStartRow, foldedRowRanges, rangeToDuplicate, selectedBufferRange, selection, start, startRow, textToDuplicate, _i, _len, _ref1, _ref2, _results;
          _ref1 = _this.getSelectionsOrderedByBufferPosition().reverse();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            selection = _ref1[_i];
            selectedBufferRange = selection.getBufferRange();
            if (selection.isEmpty()) {
              start = selection.getScreenRange().start;
              selection.selectToScreenPosition([start.row + 1, 0]);
            }
            _ref2 = selection.getBufferRowRange(), startRow = _ref2[0], endRow = _ref2[1];
            endRow++;
            foldedRowRanges = _this.outermostFoldsInBufferRowRange(startRow, endRow).map(function(fold) {
              return fold.getBufferRowRange();
            });
            rangeToDuplicate = [[startRow, 0], [endRow, 0]];
            textToDuplicate = _this.getTextInBufferRange(rangeToDuplicate);
            if (endRow > _this.getLastBufferRow()) {
              textToDuplicate = '\n' + textToDuplicate;
            }
            _this.buffer.insert([endRow, 0], textToDuplicate);
            delta = endRow - startRow;
            selection.setBufferRange(selectedBufferRange.translate([delta, 0]));
            _results.push((function() {
              var _j, _len1, _ref3, _results1;
              _results1 = [];
              for (_j = 0, _len1 = foldedRowRanges.length; _j < _len1; _j++) {
                _ref3 = foldedRowRanges[_j], foldStartRow = _ref3[0], foldEndRow = _ref3[1];
                _results1.push(this.createFold(foldStartRow + delta, foldEndRow + delta));
              }
              return _results1;
            }).call(_this));
          }
          return _results;
        };
      })(this));
    };

    Editor.prototype.duplicateLine = function() {
      deprecate("Use Editor::duplicateLines() instead");
      return this.duplicateLines();
    };

    Editor.prototype.mutateSelectedText = function(fn) {
      return this.transact((function(_this) {
        return function() {
          var index, selection, _i, _len, _ref1, _results;
          _ref1 = _this.getSelections();
          _results = [];
          for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
            selection = _ref1[index];
            _results.push(fn(selection, index));
          }
          return _results;
        };
      })(this));
    };

    Editor.prototype.replaceSelectedText = function(options, fn) {
      var selectWordIfEmpty;
      if (options == null) {
        options = {};
      }
      selectWordIfEmpty = options.selectWordIfEmpty;
      return this.mutateSelectedText(function(selection) {
        var range, text;
        range = selection.getBufferRange();
        if (selectWordIfEmpty && selection.isEmpty()) {
          selection.selectWord();
        }
        text = selection.getText();
        selection.deleteSelectedText();
        selection.insertText(fn(text));
        return selection.setBufferRange(range);
      });
    };

    Editor.prototype.getMarker = function(id) {
      return this.displayBuffer.getMarker(id);
    };

    Editor.prototype.getMarkers = function() {
      return this.displayBuffer.getMarkers();
    };

    Editor.prototype.findMarkers = function(properties) {
      return this.displayBuffer.findMarkers(properties);
    };

    Editor.prototype.markScreenRange = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.displayBuffer).markScreenRange.apply(_ref1, args);
    };

    Editor.prototype.markBufferRange = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.displayBuffer).markBufferRange.apply(_ref1, args);
    };

    Editor.prototype.markScreenPosition = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.displayBuffer).markScreenPosition.apply(_ref1, args);
    };

    Editor.prototype.markBufferPosition = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.displayBuffer).markBufferPosition.apply(_ref1, args);
    };

    Editor.prototype.destroyMarker = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.displayBuffer).destroyMarker.apply(_ref1, args);
    };

    Editor.prototype.getMarkerCount = function() {
      return this.buffer.getMarkerCount();
    };

    Editor.prototype.hasMultipleCursors = function() {
      return this.getCursors().length > 1;
    };

    Editor.prototype.getCursors = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Array, this.cursors, function(){});
    };

    Editor.prototype.getCursor = function() {
      return _.last(this.cursors);
    };

    Editor.prototype.addCursorAtScreenPosition = function(screenPosition) {
      this.markScreenPosition(screenPosition, this.getSelectionMarkerAttributes());
      return this.getLastSelection().cursor;
    };

    Editor.prototype.addCursorAtBufferPosition = function(bufferPosition) {
      this.markBufferPosition(bufferPosition, this.getSelectionMarkerAttributes());
      return this.getLastSelection().cursor;
    };

    Editor.prototype.addCursor = function(marker) {
      var cursor;
      cursor = new Cursor({
        editor: this,
        marker: marker
      });
      this.cursors.push(cursor);
      this.emit('cursor-added', cursor);
      return cursor;
    };

    Editor.prototype.removeCursor = function(cursor) {
      return _.remove(this.cursors, cursor);
    };

    Editor.prototype.addSelection = function(marker, options) {
      var cursor, selection, selectionBufferRange, _i, _len, _ref1;
      if (options == null) {
        options = {};
      }
      if (!marker.getAttributes().preserveFolds) {
        this.destroyFoldsIntersectingBufferRange(marker.getBufferRange());
      }
      cursor = this.addCursor(marker);
      selection = new Selection(_.extend({
        editor: this,
        marker: marker,
        cursor: cursor
      }, options));
      this.selections.push(selection);
      selectionBufferRange = selection.getBufferRange();
      this.mergeIntersectingSelections();
      if (selection.destroyed) {
        _ref1 = this.getSelections();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          selection = _ref1[_i];
          if (selection.intersectsBufferRange(selectionBufferRange)) {
            return selection;
          }
        }
      } else {
        this.emit('selection-added', selection);
        return selection;
      }
    };

    Editor.prototype.addSelectionForBufferRange = function(bufferRange, options) {
      if (options == null) {
        options = {};
      }
      this.markBufferRange(bufferRange, _.defaults(this.getSelectionMarkerAttributes(), options));
      return this.getLastSelection();
    };

    Editor.prototype.setSelectedBufferRange = function(bufferRange, options) {
      return this.setSelectedBufferRanges([bufferRange], options);
    };

    Editor.prototype.setSelectedScreenRange = function(screenRange, options) {
      return this.setSelectedBufferRange(this.bufferRangeForScreenRange(screenRange, options), options);
    };

    Editor.prototype.setSelectedBufferRanges = function(bufferRanges, options) {
      var selection, selections, _i, _len, _ref1;
      if (options == null) {
        options = {};
      }
      if (!bufferRanges.length) {
        throw new Error("Passed an empty array to setSelectedBufferRanges");
      }
      selections = this.getSelections();
      _ref1 = selections.slice(bufferRanges.length);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        selection.destroy();
      }
      return this.mergeIntersectingSelections(options, (function(_this) {
        return function() {
          var bufferRange, i, _j, _len1, _results;
          _results = [];
          for (i = _j = 0, _len1 = bufferRanges.length; _j < _len1; i = ++_j) {
            bufferRange = bufferRanges[i];
            bufferRange = Range.fromObject(bufferRange);
            if (selections[i]) {
              _results.push(selections[i].setBufferRange(bufferRange, options));
            } else {
              _results.push(_this.addSelectionForBufferRange(bufferRange, options));
            }
          }
          return _results;
        };
      })(this));
    };

    Editor.prototype.removeSelection = function(selection) {
      _.remove(this.selections, selection);
      return this.emit('selection-removed', selection);
    };

    Editor.prototype.clearSelections = function() {
      this.consolidateSelections();
      return this.getSelection().clear();
    };

    Editor.prototype.consolidateSelections = function() {
      var selection, selections, _i, _len, _ref1;
      selections = this.getSelections();
      if (selections.length > 1) {
        _ref1 = selections.slice(0, -1);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          selection = _ref1[_i];
          selection.destroy();
        }
        return true;
      } else {
        return false;
      }
    };

    Editor.prototype.selectionScreenRangeChanged = function(selection) {
      return this.emit('selection-screen-range-changed', selection);
    };

    Editor.prototype.getSelections = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Array, this.selections, function(){});
    };

    Editor.prototype.getSelection = function(index) {
      if (index == null) {
        index = this.selections.length - 1;
      }
      return this.selections[index];
    };

    Editor.prototype.getLastSelection = function() {
      return _.last(this.selections);
    };

    Editor.prototype.getSelectionsOrderedByBufferPosition = function() {
      return this.getSelections().sort(function(a, b) {
        return a.compare(b);
      });
    };

    Editor.prototype.getLastSelectionInBuffer = function() {
      return _.last(this.getSelectionsOrderedByBufferPosition());
    };

    Editor.prototype.selectionIntersectsBufferRange = function(bufferRange) {
      return _.any(this.getSelections(), function(selection) {
        return selection.intersectsBufferRange(bufferRange);
      });
    };

    Editor.prototype.setCursorScreenPosition = function(position, options) {
      return this.moveCursors(function(cursor) {
        return cursor.setScreenPosition(position, options);
      });
    };

    Editor.prototype.getCursorScreenPosition = function() {
      return this.getCursor().getScreenPosition();
    };

    Editor.prototype.getCursorScreenRow = function() {
      return this.getCursor().getScreenRow();
    };

    Editor.prototype.setCursorBufferPosition = function(position, options) {
      return this.moveCursors(function(cursor) {
        return cursor.setBufferPosition(position, options);
      });
    };

    Editor.prototype.getCursorBufferPosition = function() {
      return this.getCursor().getBufferPosition();
    };

    Editor.prototype.getSelectedScreenRange = function() {
      return this.getLastSelection().getScreenRange();
    };

    Editor.prototype.getSelectedBufferRange = function() {
      return this.getLastSelection().getBufferRange();
    };

    Editor.prototype.getSelectedBufferRanges = function() {
      var selection, _i, _len, _ref1, _results;
      _ref1 = this.getSelectionsOrderedByBufferPosition();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        _results.push(selection.getBufferRange());
      }
      return _results;
    };

    Editor.prototype.getSelectedScreenRanges = function() {
      var selection, _i, _len, _ref1, _results;
      _ref1 = this.getSelectionsOrderedByBufferPosition();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        _results.push(selection.getScreenRange());
      }
      return _results;
    };

    Editor.prototype.getSelectedText = function() {
      return this.getLastSelection().getText();
    };

    Editor.prototype.getTextInBufferRange = function(range) {
      return this.buffer.getTextInRange(range);
    };

    Editor.prototype.setTextInBufferRange = function(range, text) {
      return this.getBuffer().setTextInRange(range, text);
    };

    Editor.prototype.getCurrentParagraphBufferRange = function() {
      return this.getCursor().getCurrentParagraphBufferRange();
    };

    Editor.prototype.getWordUnderCursor = function(options) {
      return this.getTextInBufferRange(this.getCursor().getCurrentWordBufferRange(options));
    };

    Editor.prototype.moveCursorUp = function(lineCount) {
      return this.moveCursors(function(cursor) {
        return cursor.moveUp(lineCount, {
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorDown = function(lineCount) {
      return this.moveCursors(function(cursor) {
        return cursor.moveDown(lineCount, {
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorLeft = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveLeft({
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorRight = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveRight({
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorToTop = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToTop();
      });
    };

    Editor.prototype.moveCursorToBottom = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBottom();
      });
    };

    Editor.prototype.moveCursorToBeginningOfScreenLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfScreenLine();
      });
    };

    Editor.prototype.moveCursorToBeginningOfLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfLine();
      });
    };

    Editor.prototype.moveCursorToFirstCharacterOfLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToFirstCharacterOfLine();
      });
    };

    Editor.prototype.moveCursorToEndOfScreenLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToEndOfScreenLine();
      });
    };

    Editor.prototype.moveCursorToEndOfLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToEndOfLine();
      });
    };

    Editor.prototype.moveCursorToBeginningOfWord = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfWord();
      });
    };

    Editor.prototype.moveCursorToEndOfWord = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToEndOfWord();
      });
    };

    Editor.prototype.moveCursorToBeginningOfNextWord = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfNextWord();
      });
    };

    Editor.prototype.moveCursorToPreviousWordBoundary = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToPreviousWordBoundary();
      });
    };

    Editor.prototype.moveCursorToNextWordBoundary = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToNextWordBoundary();
      });
    };

    Editor.prototype.scrollToCursorPosition = function() {
      return this.getCursor().autoscroll();
    };

    Editor.prototype.pageUp = function() {
      return this.setScrollTop(this.getScrollTop() - this.getHeight());
    };

    Editor.prototype.pageDown = function() {
      return this.setScrollTop(this.getScrollTop() + this.getHeight());
    };

    Editor.prototype.moveCursors = function(fn) {
      this.movingCursors = true;
      return this.batchUpdates((function(_this) {
        return function() {
          var cursor, _i, _len, _ref1;
          _ref1 = _this.getCursors();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            cursor = _ref1[_i];
            fn(cursor);
          }
          _this.mergeCursors();
          _this.movingCursors = false;
          return _this.emit('cursors-moved');
        };
      })(this));
    };

    Editor.prototype.cursorMoved = function(event) {
      this.emit('cursor-moved', event);
      if (!this.movingCursors) {
        return this.emit('cursors-moved');
      }
    };

    Editor.prototype.selectToScreenPosition = function(position) {
      var lastSelection;
      lastSelection = this.getLastSelection();
      lastSelection.selectToScreenPosition(position);
      return this.mergeIntersectingSelections({
        reversed: lastSelection.isReversed()
      });
    };

    Editor.prototype.selectRight = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectRight();
        };
      })(this));
    };

    Editor.prototype.selectLeft = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectLeft();
        };
      })(this));
    };

    Editor.prototype.selectUp = function(rowCount) {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectUp(rowCount);
        };
      })(this));
    };

    Editor.prototype.selectDown = function(rowCount) {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectDown(rowCount);
        };
      })(this));
    };

    Editor.prototype.selectToTop = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToTop();
        };
      })(this));
    };

    Editor.prototype.selectAll = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectAll();
        };
      })(this));
    };

    Editor.prototype.selectToBottom = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToBottom();
        };
      })(this));
    };

    Editor.prototype.selectToBeginningOfLine = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToBeginningOfLine();
        };
      })(this));
    };

    Editor.prototype.selectToFirstCharacterOfLine = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToFirstCharacterOfLine();
        };
      })(this));
    };

    Editor.prototype.selectToEndOfLine = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToEndOfLine();
        };
      })(this));
    };

    Editor.prototype.selectToPreviousWordBoundary = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToPreviousWordBoundary();
        };
      })(this));
    };

    Editor.prototype.selectToNextWordBoundary = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToNextWordBoundary();
        };
      })(this));
    };

    Editor.prototype.selectLine = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectLine();
        };
      })(this));
    };

    Editor.prototype.addSelectionBelow = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.addSelectionBelow();
        };
      })(this));
    };

    Editor.prototype.addSelectionAbove = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.addSelectionAbove();
        };
      })(this));
    };

    Editor.prototype.splitSelectionsIntoLines = function() {
      var end, range, row, selection, start, _i, _len, _ref1, _results;
      _ref1 = this.getSelections();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        range = selection.getBufferRange();
        if (range.isSingleLine()) {
          continue;
        }
        selection.destroy();
        start = range.start, end = range.end;
        this.addSelectionForBufferRange([start, [start.row, Infinity]]);
        row = start.row;
        while (++row < end.row) {
          this.addSelectionForBufferRange([[row, 0], [row, Infinity]]);
        }
        _results.push(this.addSelectionForBufferRange([[end.row, 0], [end.row, end.column]]));
      }
      return _results;
    };

    Editor.prototype.transpose = function() {
      return this.mutateSelectedText((function(_this) {
        return function(selection) {
          var text;
          if (selection.isEmpty()) {
            selection.selectRight();
            text = selection.getText();
            selection["delete"]();
            selection.cursor.moveLeft();
            return selection.insertText(text);
          } else {
            return selection.insertText(selection.getText().split('').reverse().join(''));
          }
        };
      })(this));
    };

    Editor.prototype.upperCase = function() {
      return this.replaceSelectedText({
        selectWordIfEmpty: true
      }, (function(_this) {
        return function(text) {
          return text.toUpperCase();
        };
      })(this));
    };

    Editor.prototype.lowerCase = function() {
      return this.replaceSelectedText({
        selectWordIfEmpty: true
      }, (function(_this) {
        return function(text) {
          return text.toLowerCase();
        };
      })(this));
    };

    Editor.prototype.joinLines = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.joinLines();
      });
    };

    Editor.prototype.selectToBeginningOfWord = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToBeginningOfWord();
        };
      })(this));
    };

    Editor.prototype.selectToEndOfWord = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToEndOfWord();
        };
      })(this));
    };

    Editor.prototype.selectToBeginningOfNextWord = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToBeginningOfNextWord();
        };
      })(this));
    };

    Editor.prototype.selectWord = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectWord();
        };
      })(this));
    };

    Editor.prototype.selectMarker = function(marker) {
      var range;
      if (marker.isValid()) {
        range = marker.getBufferRange();
        this.setSelectedBufferRange(range);
        return range;
      }
    };

    Editor.prototype.mergeCursors = function() {
      var cursor, position, positions, _i, _len, _ref1, _results;
      positions = [];
      _ref1 = this.getCursors();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        cursor = _ref1[_i];
        position = cursor.getBufferPosition().toString();
        if (__indexOf.call(positions, position) >= 0) {
          _results.push(cursor.destroy());
        } else {
          _results.push(positions.push(position));
        }
      }
      return _results;
    };

    Editor.prototype.expandSelectionsForward = function(fn) {
      return this.mergeIntersectingSelections((function(_this) {
        return function() {
          var selection, _i, _len, _ref1, _results;
          _ref1 = _this.getSelections();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            selection = _ref1[_i];
            _results.push(fn(selection));
          }
          return _results;
        };
      })(this));
    };

    Editor.prototype.expandSelectionsBackward = function(fn) {
      return this.mergeIntersectingSelections({
        reversed: true
      }, (function(_this) {
        return function() {
          var selection, _i, _len, _ref1, _results;
          _ref1 = _this.getSelections();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            selection = _ref1[_i];
            _results.push(fn(selection));
          }
          return _results;
        };
      })(this));
    };

    Editor.prototype.finalizeSelections = function() {
      var selection, _i, _len, _ref1, _results;
      _ref1 = this.getSelections();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        _results.push(selection.finalize());
      }
      return _results;
    };

    Editor.prototype.mergeIntersectingSelections = function() {
      var args, fn, options, reducer, result, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (_.isFunction(_.last(args))) {
        fn = args.pop();
      }
      options = (_ref1 = args.pop()) != null ? _ref1 : {};
      if (this.suppressSelectionMerging) {
        return typeof fn === "function" ? fn() : void 0;
      }
      if (fn != null) {
        this.suppressSelectionMerging = true;
        result = fn();
        this.suppressSelectionMerging = false;
      }
      reducer = function(disjointSelections, selection) {
        var intersectingSelection;
        intersectingSelection = _.find(disjointSelections, function(s) {
          return s.intersectsWith(selection);
        });
        if (intersectingSelection != null) {
          intersectingSelection.merge(selection, options);
          return disjointSelections;
        } else {
          return disjointSelections.concat([selection]);
        }
      };
      return _.reduce(this.getSelections(), reducer, []);
    };

    Editor.prototype.preserveCursorPositionOnBufferReload = function() {
      var cursorPosition;
      cursorPosition = null;
      this.subscribe(this.buffer, "will-reload", (function(_this) {
        return function() {
          return cursorPosition = _this.getCursorBufferPosition();
        };
      })(this));
      return this.subscribe(this.buffer, "reloaded", (function(_this) {
        return function() {
          if (cursorPosition) {
            _this.setCursorBufferPosition(cursorPosition);
          }
          return cursorPosition = null;
        };
      })(this));
    };

    Editor.prototype.getGrammar = function() {
      return this.displayBuffer.getGrammar();
    };

    Editor.prototype.setGrammar = function(grammar) {
      return this.displayBuffer.setGrammar(grammar);
    };

    Editor.prototype.reloadGrammar = function() {
      return this.displayBuffer.reloadGrammar();
    };

    Editor.prototype.shouldAutoIndent = function() {
      return atom.config.get("editor.autoIndent");
    };

    Editor.prototype.transact = function(fn) {
      return this.batchUpdates((function(_this) {
        return function() {
          return _this.buffer.transact(fn);
        };
      })(this));
    };

    Editor.prototype.beginTransaction = function() {
      return this.buffer.beginTransaction();
    };

    Editor.prototype.commitTransaction = function() {
      return this.buffer.commitTransaction();
    };

    Editor.prototype.abortTransaction = function() {
      return this.buffer.abortTransaction();
    };

    Editor.prototype.batchUpdates = function(fn) {
      var result;
      this.emit('batched-updates-started');
      result = fn();
      this.emit('batched-updates-ended');
      return result;
    };

    Editor.prototype.inspect = function() {
      return "<Editor " + this.id + ">";
    };

    Editor.prototype.logScreenLines = function(start, end) {
      return this.displayBuffer.logLines(start, end);
    };

    Editor.prototype.handleGrammarChange = function() {
      this.unfoldAll();
      return this.emit('grammar-changed');
    };

    Editor.prototype.handleMarkerCreated = function(marker) {
      if (marker.matchesAttributes(this.getSelectionMarkerAttributes())) {
        return this.addSelection(marker);
      }
    };

    Editor.prototype.getSelectionMarkerAttributes = function() {
      return {
        type: 'selection',
        editorId: this.id,
        invalidate: 'never'
      };
    };

    Editor.prototype.getVerticalScrollMargin = function() {
      return this.displayBuffer.getVerticalScrollMargin();
    };

    Editor.prototype.setVerticalScrollMargin = function(verticalScrollMargin) {
      return this.displayBuffer.setVerticalScrollMargin(verticalScrollMargin);
    };

    Editor.prototype.getHorizontalScrollMargin = function() {
      return this.displayBuffer.getHorizontalScrollMargin();
    };

    Editor.prototype.setHorizontalScrollMargin = function(horizontalScrollMargin) {
      return this.displayBuffer.setHorizontalScrollMargin(horizontalScrollMargin);
    };

    Editor.prototype.getLineHeight = function() {
      return this.displayBuffer.getLineHeight();
    };

    Editor.prototype.setLineHeight = function(lineHeight) {
      return this.displayBuffer.setLineHeight(lineHeight);
    };

    Editor.prototype.getScopedCharWidth = function(scopeNames, char) {
      return this.displayBuffer.getScopedCharWidth(scopeNames, char);
    };

    Editor.prototype.setScopedCharWidth = function(scopeNames, char, width) {
      return this.displayBuffer.setScopedCharWidth(scopeNames, char, width);
    };

    Editor.prototype.getScopedCharWidths = function(scopeNames) {
      return this.displayBuffer.getScopedCharWidths(scopeNames);
    };

    Editor.prototype.clearScopedCharWidths = function() {
      return this.displayBuffer.clearScopedCharWidths();
    };

    Editor.prototype.getDefaultCharWidth = function() {
      return this.displayBuffer.getDefaultCharWidth();
    };

    Editor.prototype.setDefaultCharWidth = function(defaultCharWidth) {
      return this.displayBuffer.setDefaultCharWidth(defaultCharWidth);
    };

    Editor.prototype.setHeight = function(height) {
      return this.displayBuffer.setHeight(height);
    };

    Editor.prototype.getHeight = function() {
      return this.displayBuffer.getHeight();
    };

    Editor.prototype.setWidth = function(width) {
      return this.displayBuffer.setWidth(width);
    };

    Editor.prototype.getWidth = function() {
      return this.displayBuffer.getWidth();
    };

    Editor.prototype.getScrollTop = function() {
      return this.displayBuffer.getScrollTop();
    };

    Editor.prototype.setScrollTop = function(scrollTop) {
      return this.displayBuffer.setScrollTop(scrollTop);
    };

    Editor.prototype.getScrollBottom = function() {
      return this.displayBuffer.getScrollBottom();
    };

    Editor.prototype.setScrollBottom = function(scrollBottom) {
      return this.displayBuffer.setScrollBottom(scrollBottom);
    };

    Editor.prototype.getScrollLeft = function() {
      return this.displayBuffer.getScrollLeft();
    };

    Editor.prototype.setScrollLeft = function(scrollLeft) {
      return this.displayBuffer.setScrollLeft(scrollLeft);
    };

    Editor.prototype.getScrollRight = function() {
      return this.displayBuffer.getScrollRight();
    };

    Editor.prototype.setScrollRight = function(scrollRight) {
      return this.displayBuffer.setScrollRight(scrollRight);
    };

    Editor.prototype.getScrollHeight = function() {
      return this.displayBuffer.getScrollHeight();
    };

    Editor.prototype.getScrollWidth = function(scrollWidth) {
      return this.displayBuffer.getScrollWidth(scrollWidth);
    };

    Editor.prototype.getVisibleRowRange = function() {
      return this.displayBuffer.getVisibleRowRange();
    };

    Editor.prototype.intersectsVisibleRowRange = function(startRow, endRow) {
      return this.displayBuffer.intersectsVisibleRowRange(startRow, endRow);
    };

    Editor.prototype.selectionIntersectsVisibleRowRange = function(selection) {
      return this.displayBuffer.selectionIntersectsVisibleRowRange(selection);
    };

    Editor.prototype.pixelPositionForScreenPosition = function(screenPosition) {
      return this.displayBuffer.pixelPositionForScreenPosition(screenPosition);
    };

    Editor.prototype.pixelPositionForBufferPosition = function(bufferPosition) {
      return this.displayBuffer.pixelPositionForBufferPosition(bufferPosition);
    };

    Editor.prototype.screenPositionForPixelPosition = function(pixelPosition) {
      return this.displayBuffer.screenPositionForPixelPosition(pixelPosition);
    };

    Editor.prototype.pixelRectForScreenRange = function(screenRange) {
      return this.displayBuffer.pixelRectForScreenRange(screenRange);
    };

    Editor.prototype.scrollToScreenRange = function(screenRange) {
      return this.displayBuffer.scrollToScreenRange(screenRange);
    };

    Editor.prototype.scrollToScreenPosition = function(screenPosition) {
      return this.displayBuffer.scrollToScreenPosition(screenPosition);
    };

    Editor.prototype.scrollToBufferPosition = function(bufferPosition) {
      return this.displayBuffer.scrollToBufferPosition(bufferPosition);
    };

    Editor.prototype.joinLine = function() {
      deprecate("Use Editor::joinLines() instead");
      return this.joinLines();
    };

    return Editor;

  })(Model);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL2ZpeHR1cmVzL2xhcmdlLWZpbGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFKQUFBO0lBQUE7Ozs7eUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGNBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxVQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlDLFlBQWEsT0FBQSxDQUFRLE1BQVIsRUFBYixTQUpELENBQUE7O0FBQUEsRUFLQyxRQUFTLE9BQUEsQ0FBUSxVQUFSLEVBQVQsS0FMRCxDQUFBOztBQUFBLEVBTUEsT0FBaUIsT0FBQSxDQUFRLGFBQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBTlIsQ0FBQTs7QUFBQSxFQU9BLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FQZixDQUFBOztBQUFBLEVBUUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FSaEIsQ0FBQTs7QUFBQSxFQVNBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQVRULENBQUE7O0FBQUEsRUFXQSxTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVIsQ0FYWixDQUFBOztBQUFBLEVBWUEscUJBQUEsR0FBd0IsT0FBQSxDQUFRLFlBQVIsQ0FBcUIsQ0FBQyxhQVo5QyxDQUFBOztBQUFBLEVBcUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2QkFBQSxDQUFBOztBQUFBLElBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsTUFBekIs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/fixtures/large-file.coffee

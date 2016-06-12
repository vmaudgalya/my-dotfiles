(function() {
  var CompositeDisposable, Emitter, HighlightedAreaView, Range, StatusBarView, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Range = _ref.Range, CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  StatusBarView = require('./status-bar-view');

  module.exports = HighlightedAreaView = (function() {
    function HighlightedAreaView() {
      this.listenForStatusBarChange = __bind(this.listenForStatusBarChange, this);
      this.removeStatusBar = __bind(this.removeStatusBar, this);
      this.setupStatusBar = __bind(this.setupStatusBar, this);
      this.removeMarkers = __bind(this.removeMarkers, this);
      this.handleSelection = __bind(this.handleSelection, this);
      this.debouncedHandleSelection = __bind(this.debouncedHandleSelection, this);
      this.setStatusBar = __bind(this.setStatusBar, this);
      this.enable = __bind(this.enable, this);
      this.disable = __bind(this.disable, this);
      this.onDidAddMarker = __bind(this.onDidAddMarker, this);
      this.destroy = __bind(this.destroy, this);
      this.emitter = new Emitter;
      this.views = [];
      this.enable();
      this.listenForTimeoutChange();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.debouncedHandleSelection();
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToActiveTextEditor();
      this.listenForStatusBarChange();
    }

    HighlightedAreaView.prototype.destroy = function() {
      var _ref1, _ref2, _ref3;
      clearTimeout(this.handleSelectionTimeout);
      this.activeItemSubscription.dispose();
      if ((_ref1 = this.selectionSubscription) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.statusBarView) != null) {
        _ref2.removeElement();
      }
      if ((_ref3 = this.statusBarTile) != null) {
        _ref3.destroy();
      }
      return this.statusBarTile = null;
    };

    HighlightedAreaView.prototype.onDidAddMarker = function(callback) {
      return this.emitter.on('did-add-marker', callback);
    };

    HighlightedAreaView.prototype.disable = function() {
      this.disabled = true;
      return this.removeMarkers();
    };

    HighlightedAreaView.prototype.enable = function() {
      this.disabled = false;
      return this.debouncedHandleSelection();
    };

    HighlightedAreaView.prototype.setStatusBar = function(statusBar) {
      this.statusBar = statusBar;
      return this.setupStatusBar();
    };

    HighlightedAreaView.prototype.debouncedHandleSelection = function() {
      clearTimeout(this.handleSelectionTimeout);
      return this.handleSelectionTimeout = setTimeout((function(_this) {
        return function() {
          return _this.handleSelection();
        };
      })(this), atom.config.get('highlight-selected.timeout'));
    };

    HighlightedAreaView.prototype.listenForTimeoutChange = function() {
      return atom.config.onDidChange('highlight-selected.timeout', (function(_this) {
        return function() {
          return _this.debouncedHandleSelection();
        };
      })(this));
    };

    HighlightedAreaView.prototype.subscribeToActiveTextEditor = function() {
      var editor, _ref1;
      if ((_ref1 = this.selectionSubscription) != null) {
        _ref1.dispose();
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.selectionSubscription = new CompositeDisposable;
      this.selectionSubscription.add(editor.onDidAddSelection(this.debouncedHandleSelection));
      this.selectionSubscription.add(editor.onDidChangeSelectionRange(this.debouncedHandleSelection));
      return this.handleSelection();
    };

    HighlightedAreaView.prototype.getActiveEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightedAreaView.prototype.handleSelection = function() {
      var editor, range, regex, regexFlags, regexSearch, result, resultCount, text, _ref1, _ref2;
      this.removeMarkers();
      if (this.disabled) {
        return;
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      if (editor.getLastSelection().isEmpty()) {
        return;
      }
      if (!this.isWordSelected(editor.getLastSelection())) {
        return;
      }
      this.selections = editor.getSelections();
      text = _.escapeRegExp(this.selections[0].getText());
      regex = new RegExp("\\S*\\w*\\b", 'gi');
      result = regex.exec(text);
      if (result == null) {
        return;
      }
      if (result[0].length < atom.config.get('highlight-selected.minimumLength') || result.index !== 0 || result[0] !== result.input) {
        return;
      }
      regexFlags = 'g';
      if (atom.config.get('highlight-selected.ignoreCase')) {
        regexFlags = 'gi';
      }
      range = [[0, 0], editor.getEofBufferPosition()];
      this.ranges = [];
      regexSearch = result[0];
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (regexSearch.indexOf("\$") !== -1 && ((_ref1 = editor.getGrammar()) != null ? _ref1.name : void 0) === 'PHP') {
          regexSearch = regexSearch.replace("\$", "\$\\b");
        } else {
          regexSearch = "\\b" + regexSearch;
        }
        regexSearch = regexSearch + "\\b";
      }
      resultCount = 0;
      editor.scanInBufferRange(new RegExp(regexSearch, regexFlags), range, (function(_this) {
        return function(result) {
          var decoration, marker;
          resultCount += 1;
          if (!_this.showHighlightOnSelectedWord(result.range, _this.selections)) {
            marker = editor.markBufferRange(result.range);
            decoration = editor.decorateMarker(marker, {
              type: 'highlight',
              "class": _this.makeClasses()
            });
            _this.views.push(marker);
            return _this.emitter.emit('did-add-marker', marker);
          }
        };
      })(this));
      return (_ref2 = this.statusBarElement) != null ? _ref2.updateCount(resultCount) : void 0;
    };

    HighlightedAreaView.prototype.makeClasses = function() {
      var className;
      className = 'highlight-selected';
      if (atom.config.get('highlight-selected.lightTheme')) {
        className += ' light-theme';
      }
      if (atom.config.get('highlight-selected.highlightBackground')) {
        className += ' background';
      }
      return className;
    };

    HighlightedAreaView.prototype.showHighlightOnSelectedWord = function(range, selections) {
      var outcome, selection, selectionRange, _i, _len;
      if (!atom.config.get('highlight-selected.hideHighlightOnSelectedWord')) {
        return false;
      }
      outcome = false;
      for (_i = 0, _len = selections.length; _i < _len; _i++) {
        selection = selections[_i];
        selectionRange = selection.getBufferRange();
        outcome = (range.start.column === selectionRange.start.column) && (range.start.row === selectionRange.start.row) && (range.end.column === selectionRange.end.column) && (range.end.row === selectionRange.end.row);
        if (outcome) {
          break;
        }
      }
      return outcome;
    };

    HighlightedAreaView.prototype.removeMarkers = function() {
      var view, _i, _len, _ref1, _ref2;
      if (this.views == null) {
        return;
      }
      if (this.views.length === 0) {
        return;
      }
      _ref1 = this.views;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        view.destroy();
        view = null;
      }
      this.views = [];
      return (_ref2 = this.statusBarElement) != null ? _ref2.updateCount(this.views.length) : void 0;
    };

    HighlightedAreaView.prototype.isWordSelected = function(selection) {
      var lineRange, nonWordCharacterToTheLeft, nonWordCharacterToTheRight, selectionRange;
      if (selection.getBufferRange().isSingleLine()) {
        selectionRange = selection.getBufferRange();
        lineRange = this.getActiveEditor().bufferRangeForBufferRow(selectionRange.start.row);
        nonWordCharacterToTheLeft = _.isEqual(selectionRange.start, lineRange.start) || this.isNonWordCharacterToTheLeft(selection);
        nonWordCharacterToTheRight = _.isEqual(selectionRange.end, lineRange.end) || this.isNonWordCharacterToTheRight(selection);
        return nonWordCharacterToTheLeft && nonWordCharacterToTheRight;
      } else {
        return false;
      }
    };

    HighlightedAreaView.prototype.isNonWordCharacter = function(character) {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp("[ \t" + (_.escapeRegExp(nonWordCharacters)) + "]").test(character);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheLeft = function(selection) {
      var range, selectionStart;
      selectionStart = selection.getBufferRange().start;
      range = Range.fromPointWithDelta(selectionStart, 0, -1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheRight = function(selection) {
      var range, selectionEnd;
      selectionEnd = selection.getBufferRange().end;
      range = Range.fromPointWithDelta(selectionEnd, 0, 1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.setupStatusBar = function() {
      if (this.statusBarElement != null) {
        return;
      }
      if (!atom.config.get('highlight-selected.showInStatusBar')) {
        return;
      }
      this.statusBarElement = new StatusBarView();
      return this.statusBarTile = this.statusBar.addLeftTile({
        item: this.statusBarElement.getElement(),
        priority: 100
      });
    };

    HighlightedAreaView.prototype.removeStatusBar = function() {
      var _ref1;
      if (this.statusBarElement == null) {
        return;
      }
      if ((_ref1 = this.statusBarTile) != null) {
        _ref1.destroy();
      }
      this.statusBarTile = null;
      return this.statusBarElement = null;
    };

    HighlightedAreaView.prototype.listenForStatusBarChange = function() {
      return atom.config.onDidChange('highlight-selected.showInStatusBar', (function(_this) {
        return function(changed) {
          if (changed.newValue) {
            return _this.setupStatusBar();
          } else {
            return _this.removeStatusBar();
          }
        };
      })(this));
    };

    return HighlightedAreaView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LXNlbGVjdGVkL2xpYi9oaWdobGlnaHRlZC1hcmVhLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdGQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUF3QyxPQUFBLENBQVEsTUFBUixDQUF4QyxFQUFDLGFBQUEsS0FBRCxFQUFRLDJCQUFBLG1CQUFSLEVBQTZCLGVBQUEsT0FBN0IsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVIsQ0FGaEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFUyxJQUFBLDZCQUFBLEdBQUE7QUFDWCxpRkFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLGlGQUFBLENBQUE7QUFBQSx5REFBQSxDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBRFQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxzQkFBRCxDQUFBLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLHNCQUFELEdBQTBCLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/highlight-selected/lib/highlighted-area-view.coffee

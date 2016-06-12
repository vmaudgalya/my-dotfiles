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
      this.onDidRemoveAllMarkers = __bind(this.onDidRemoveAllMarkers, this);
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

    HighlightedAreaView.prototype.onDidRemoveAllMarkers = function(callback) {
      return this.emitter.on('did-remove-all-markers', callback);
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
      if ((_ref2 = this.statusBarElement) != null) {
        _ref2.updateCount(this.views.length);
      }
      return this.emitter.emit('did-remove-all-markers');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LXNlbGVjdGVkL2xpYi9oaWdobGlnaHRlZC1hcmVhLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdGQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUF3QyxPQUFBLENBQVEsTUFBUixDQUF4QyxFQUFDLGFBQUEsS0FBRCxFQUFRLDJCQUFBLG1CQUFSLEVBQTZCLGVBQUEsT0FBN0IsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVIsQ0FGaEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFUyxJQUFBLDZCQUFBLEdBQUE7QUFDWCxpRkFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLGlGQUFBLENBQUE7QUFBQSx5REFBQSxDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSwyRUFBQSxDQUFBO0FBQUEsNkRBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQURULENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsc0JBQUQsQ0FBQSxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/highlight-selected/lib/highlighted-area-view.coffee

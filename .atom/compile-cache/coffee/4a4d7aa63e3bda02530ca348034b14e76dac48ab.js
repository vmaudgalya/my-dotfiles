(function() {
  var CompositeDisposable, HighlightedAreaView, Range, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Range = _ref.Range, CompositeDisposable = _ref.CompositeDisposable;

  _ = require('underscore-plus');

  module.exports = HighlightedAreaView = (function() {
    function HighlightedAreaView() {
      this.removeMarkers = __bind(this.removeMarkers, this);
      this.handleSelection = __bind(this.handleSelection, this);
      this.debouncedHandleSelection = __bind(this.debouncedHandleSelection, this);
      this.destroy = __bind(this.destroy, this);
      this.views = [];
      this.listenForTimeoutChange();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.debouncedHandleSelection();
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToActiveTextEditor();
    }

    HighlightedAreaView.prototype.destroy = function() {
      var _ref1;
      clearTimeout(this.handleSelectionTimeout);
      this.activeItemSubscription.dispose();
      return (_ref1 = this.selectionSubscription) != null ? _ref1.dispose() : void 0;
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
      var editor, range, regex, regexFlags, regexSearch, result, text, _ref1;
      this.removeMarkers();
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
      return editor.scanInBufferRange(new RegExp(regexSearch, regexFlags), range, (function(_this) {
        return function(result) {
          var decoration, marker;
          if (!_this.showHighlightOnSelectedWord(result.range, _this.selections)) {
            marker = editor.markBufferRange(result.range);
            decoration = editor.decorateMarker(marker, {
              type: 'highlight',
              "class": _this.makeClasses()
            });
            return _this.views.push(marker);
          }
        };
      })(this));
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
      var view, _i, _len, _ref1;
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
      return this.views = [];
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

    return HighlightedAreaView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LXNlbGVjdGVkL2xpYi9oaWdobGlnaHRlZC1hcmVhLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUErQixPQUFBLENBQVEsTUFBUixDQUEvQixFQUFDLGFBQUEsS0FBRCxFQUFRLDJCQUFBLG1CQUFSLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFUyxJQUFBLDZCQUFBLEdBQUE7QUFDWCwyREFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLGlGQUFBLENBQUE7QUFBQSwrQ0FBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQVQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLHNCQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsc0JBQUQsR0FBMEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2pFLFVBQUEsS0FBQyxDQUFBLHdCQUFELENBQUEsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSwyQkFBRCxDQUFBLEVBRmlFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0FGMUIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLDJCQUFELENBQUEsQ0FMQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSxrQ0FRQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxLQUFBO0FBQUEsTUFBQSxZQUFBLENBQWEsSUFBQyxDQUFBLHNC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

//# sourceURL=/Users/vmaudgalya/.atom/packages/highlight-selected/lib/highlighted-area-view.coffee

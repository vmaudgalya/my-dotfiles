(function() {
  var CompositeDisposable, Disposable, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = function() {
    var FakeEditor, HighlightedAreaView, MinimapHighlightSelectedView, highlightSelected, highlightSelectedPackage;
    highlightSelectedPackage = atom.packages.getLoadedPackage('highlight-selected');
    highlightSelected = require(highlightSelectedPackage.path);
    HighlightedAreaView = require(highlightSelectedPackage.path + '/lib/highlighted-area-view');
    FakeEditor = (function() {
      function FakeEditor(minimap) {
        this.minimap = minimap;
      }

      FakeEditor.prototype.getActiveMinimap = function() {
        return this.minimap.getActiveMinimap();
      };

      FakeEditor.prototype.getActiveTextEditor = function() {
        var _ref1;
        return (_ref1 = this.getActiveMinimap()) != null ? _ref1.getTextEditor() : void 0;
      };

      ['markBufferRange', 'scanInBufferRange', 'getEofBufferPosition', 'getSelections', 'getLastSelection', 'bufferRangeForBufferRow', 'getTextInBufferRange'].forEach(function(key) {
        return FakeEditor.prototype[key] = function() {
          var _ref1;
          return (_ref1 = this.getActiveTextEditor()) != null ? _ref1[key].apply(_ref1, arguments) : void 0;
        };
      });

      ['onDidAddSelection', 'onDidChangeSelectionRange'].forEach(function(key) {
        return FakeEditor.prototype[key] = function() {
          var _ref1, _ref2;
          return (_ref1 = (_ref2 = this.getActiveTextEditor()) != null ? _ref2[key].apply(_ref2, arguments) : void 0) != null ? _ref1 : new Disposable(function() {});
        };
      });

      ['decorateMarker'].forEach(function(key) {
        return FakeEditor.prototype[key] = function() {
          var _ref1;
          return (_ref1 = this.getActiveMinimap())[key].apply(_ref1, arguments);
        };
      });

      return FakeEditor;

    })();
    return MinimapHighlightSelectedView = (function(_super) {
      __extends(MinimapHighlightSelectedView, _super);

      function MinimapHighlightSelectedView(minimap) {
        this.fakeEditor = new FakeEditor(minimap);
        MinimapHighlightSelectedView.__super__.constructor.apply(this, arguments);
      }

      MinimapHighlightSelectedView.prototype.getActiveEditor = function() {
        return this.fakeEditor;
      };

      MinimapHighlightSelectedView.prototype.handleSelection = function() {
        var editor, range, regex, regexFlags, regexSearch, result, text;
        if (atom.workspace.getActiveTextEditor() == null) {
          return;
        }
        if (this.fakeEditor.getActiveTextEditor() == null) {
          return;
        }
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
          regexSearch = "\\b" + regexSearch + "\\b";
        }
        return editor.scanInBufferRange(new RegExp(regexSearch, regexFlags), range, (function(_this) {
          return function(result) {
            var className, decoration, marker;
            marker = editor.markBufferRange(result.range);
            className = _this.makeClasses(_this.showHighlightOnSelectedWord(result.range, _this.selections));
            decoration = editor.decorateMarker(marker, {
              type: 'highlight',
              "class": className
            });
            return _this.views.push(marker);
          };
        })(this));
      };

      MinimapHighlightSelectedView.prototype.makeClasses = function(inSelection) {
        var className;
        className = 'highlight-selected';
        if (inSelection) {
          className += ' selected';
        }
        return className;
      };

      MinimapHighlightSelectedView.prototype.subscribeToActiveTextEditor = function() {
        var editor, _ref1;
        if ((_ref1 = this.selectionSubscription) != null) {
          _ref1.dispose();
        }
        this.selectionSubscription = new CompositeDisposable;
        if (editor = this.getActiveEditor()) {
          this.selectionSubscription.add(editor.onDidAddSelection((function(_this) {
            return function() {
              return _this.handleSelection();
            };
          })(this)));
          this.selectionSubscription.add(editor.onDidChangeSelectionRange((function(_this) {
            return function() {
              return _this.handleSelection();
            };
          })(this)));
        }
        return this.handleSelection();
      };

      return MinimapHighlightSelectedView;

    })(HighlightedAreaView);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC1oaWdobGlnaHQtc2VsZWN0ZWQvbGliL21pbmltYXAtaGlnaGxpZ2h0LXNlbGVjdGVkLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsa0JBQUEsVUFBRCxFQUFhLDJCQUFBLG1CQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQUE7QUFDZixRQUFBLDBHQUFBO0FBQUEsSUFBQSx3QkFBQSxHQUEyQixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLG9CQUEvQixDQUEzQixDQUFBO0FBQUEsSUFFQSxpQkFBQSxHQUFvQixPQUFBLENBQVMsd0JBQXdCLENBQUMsSUFBbEMsQ0FGcEIsQ0FBQTtBQUFBLElBR0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFTLHdCQUF3QixDQUFDLElBQXpCLEdBQWdDLDRCQUF6QyxDQUh0QixDQUFBO0FBQUEsSUFLTTtBQUNTLE1BQUEsb0JBQUUsT0FBRixHQUFBO0FBQVksUUFBWCxJQUFDLENBQUEsVUFBQSxPQUFVLENBQVo7TUFBQSxDQUFiOztBQUFBLDJCQUVBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtlQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsQ0FBQSxFQUFIO01BQUEsQ0FGbEIsQ0FBQTs7QUFBQSwyQkFJQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7QUFBRyxZQUFBLEtBQUE7Z0VBQW1CLENBQUUsYUFBckIsQ0FBQSxXQUFIO01BQUEsQ0FKckIsQ0FBQTs7QUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap-highlight-selected/lib/minimap-highlight-selected-view.coffee

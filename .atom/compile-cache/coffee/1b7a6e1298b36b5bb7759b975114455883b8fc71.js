(function() {
  var Point, Range, actionUtils, editorUtils, emmet, insertSnippet, normalize, path, preprocessSnippet, resources, tabStops, utils, visualize, _ref;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  path = require('path');

  emmet = require('emmet');

  utils = require('emmet/lib/utils/common');

  tabStops = require('emmet/lib/assets/tabStops');

  resources = require('emmet/lib/assets/resources');

  editorUtils = require('emmet/lib/utils/editor');

  actionUtils = require('emmet/lib/utils/action');

  insertSnippet = function(snippet, editor) {
    var _ref1, _ref2, _ref3, _ref4;
    if ((_ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
      if ((_ref2 = _ref1.mainModule) != null) {
        _ref2.insert(snippet, editor);
      }
    }
    return editor.snippetExpansion = (_ref3 = atom.packages.getLoadedPackage('snippets')) != null ? (_ref4 = _ref3.mainModule) != null ? _ref4.getExpansions(editor)[0] : void 0 : void 0;
  };

  visualize = function(str) {
    return str.replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\s/g, '\\s');
  };

  normalize = function(text, editor) {
    return editorUtils.normalize(text, {
      indentation: editor.getTabText(),
      newline: '\n'
    });
  };

  preprocessSnippet = function(value) {
    var order, tabstopOptions;
    order = [];
    tabstopOptions = {
      tabstop: function(data) {
        var group, placeholder;
        group = parseInt(data.group, 10);
        if (group === 0) {
          order.push(-1);
          group = order.length;
        } else {
          if (order.indexOf(group) === -1) {
            order.push(group);
          }
          group = order.indexOf(group) + 1;
        }
        placeholder = data.placeholder || '';
        if (placeholder) {
          placeholder = tabStops.processText(placeholder, tabstopOptions);
        }
        if (placeholder) {
          return "${" + group + ":" + placeholder + "}";
        } else {
          return "${" + group + "}";
        }
      },
      escape: function(ch) {
        if (ch === '$') {
          return '\\$';
        } else {
          return ch;
        }
      }
    };
    return tabStops.processText(value, tabstopOptions);
  };

  module.exports = {
    setup: function(editor, selectionIndex) {
      var buf, bufRanges;
      this.editor = editor;
      this.selectionIndex = selectionIndex != null ? selectionIndex : 0;
      buf = this.editor.getBuffer();
      bufRanges = this.editor.getSelectedBufferRanges();
      return this._selection = {
        index: 0,
        saved: new Array(bufRanges.length),
        bufferRanges: bufRanges,
        indexRanges: bufRanges.map(function(range) {
          return {
            start: buf.characterIndexForPosition(range.start),
            end: buf.characterIndexForPosition(range.end)
          };
        })
      };
    },
    exec: function(fn) {
      var ix, success;
      ix = this._selection.bufferRanges.length - 1;
      this._selection.saved = [];
      success = true;
      while (ix >= 0) {
        this._selection.index = ix;
        if (fn(this._selection.index) === false) {
          success = false;
          break;
        }
        ix--;
      }
      if (success && this._selection.saved.length > 1) {
        return this._setSelectedBufferRanges(this._selection.saved);
      }
    },
    _setSelectedBufferRanges: function(sels) {
      var filteredSels;
      filteredSels = sels.filter(function(s) {
        return !!s;
      });
      if (filteredSels.length) {
        return this.editor.setSelectedBufferRanges(filteredSels);
      }
    },
    _saveSelection: function(delta) {
      var i, range, _results;
      this._selection.saved[this._selection.index] = this.editor.getSelectedBufferRange();
      if (delta) {
        i = this._selection.index;
        delta = Point.fromObject([delta, 0]);
        _results = [];
        while (++i < this._selection.saved.length) {
          range = this._selection.saved[i];
          if (range) {
            _results.push(this._selection.saved[i] = new Range(range.start.translate(delta), range.end.translate(delta)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    selectionList: function() {
      return this._selection.indexRanges;
    },
    getCaretPos: function() {
      return this.getSelectionRange().start;
    },
    setCaretPos: function(pos) {
      return this.createSelection(pos);
    },
    getSelectionRange: function() {
      return this._selection.indexRanges[this._selection.index];
    },
    getSelectionBufferRange: function() {
      return this._selection.bufferRanges[this._selection.index];
    },
    createSelection: function(start, end) {
      var buf, sels;
      if (end == null) {
        end = start;
      }
      sels = this._selection.bufferRanges;
      buf = this.editor.getBuffer();
      sels[this._selection.index] = new Range(buf.positionForCharacterIndex(start), buf.positionForCharacterIndex(end));
      return this._setSelectedBufferRanges(sels);
    },
    getSelection: function() {
      return this.editor.getTextInBufferRange(this.getSelectionBufferRange());
    },
    getCurrentLineRange: function() {
      var index, lineLength, row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      lineLength = this.editor.lineTextForBufferRow(row).length;
      index = this.editor.getBuffer().characterIndexForPosition({
        row: row,
        column: 0
      });
      return {
        start: index,
        end: index + lineLength
      };
    },
    getCurrentLine: function() {
      var row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      return this.editor.lineTextForBufferRow(row);
    },
    getContent: function() {
      return this.editor.getText();
    },
    replaceContent: function(value, start, end, noIndent) {
      var buf, caret, changeRange, oldValue;
      if (end == null) {
        end = start == null ? this.getContent().length : start;
      }
      if (start == null) {
        start = 0;
      }
      value = normalize(value, this.editor);
      buf = this.editor.getBuffer();
      changeRange = new Range(Point.fromObject(buf.positionForCharacterIndex(start)), Point.fromObject(buf.positionForCharacterIndex(end)));
      oldValue = this.editor.getTextInBufferRange(changeRange);
      buf.setTextInRange(changeRange, '');
      caret = buf.positionForCharacterIndex(start);
      this.editor.setSelectedBufferRange(new Range(caret, caret));
      insertSnippet(preprocessSnippet(value), this.editor);
      this._saveSelection(utils.splitByLines(value).length - utils.splitByLines(oldValue).length);
      return value;
    },
    getGrammar: function() {
      return this.editor.getGrammar().scopeName.toLowerCase();
    },
    getSyntax: function() {
      var m, scope, sourceSyntax, syntax, _ref1;
      scope = this.getCurrentScope().join(' ');
      if (~scope.indexOf('xsl')) {
        return 'xsl';
      }
      if (!/\bstring\b/.test(scope) && /\bsource\.(js|ts)x?\b/.test(scope)) {
        return 'jsx';
      }
      sourceSyntax = (_ref1 = scope.match(/\bsource\.([\w\-]+)/)) != null ? _ref1[0] : void 0;
      if (!/\bstring\b/.test(scope) && sourceSyntax && resources.hasSyntax(sourceSyntax)) {
        syntax = sourceSyntax;
      } else {
        m = scope.match(/\b(source|text)\.[\w\-\.]+/);
        syntax = m != null ? m[0].split('.').reduceRight(function(result, token) {
          return result || (resources.hasSyntax(token) ? token : void 0);
        }, null) : void 0;
      }
      return actionUtils.detectSyntax(this, syntax || 'html');
    },
    getCurrentScope: function() {
      var range;
      range = this._selection.bufferRanges[this._selection.index];
      return this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
    },
    getProfileName: function() {
      if (this.getCurrentScope().some(function(scope) {
        return /\bstring\.quoted\b/.test(scope);
      })) {
        return 'line';
      } else {
        return actionUtils.detectProfile(this);
      }
    },
    getFilePath: function() {
      return this.editor.buffer.file.path;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvZW1tZXQvbGliL2VkaXRvci1wcm94eS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNklBQUE7O0FBQUEsRUFBQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFpQixPQUFBLENBQVEsTUFBUixDQURqQixDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFjLE9BQUEsQ0FBUSxPQUFSLENBSGQsQ0FBQTs7QUFBQSxFQUlBLEtBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVIsQ0FKZCxDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFjLE9BQUEsQ0FBUSwyQkFBUixDQUxkLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQWMsT0FBQSxDQUFRLDRCQUFSLENBTmQsQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVIsQ0FQZCxDQUFBOztBQUFBLEVBUUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUixDQVJkLENBQUE7O0FBQUEsRUFVQSxhQUFBLEdBQWdCLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNkLFFBQUEsMEJBQUE7OzthQUFzRCxDQUFFLE1BQXhELENBQStELE9BQS9ELEVBQXdFLE1BQXhFOztLQUFBO1dBR0EsTUFBTSxDQUFDLGdCQUFQLDRHQUFnRixDQUFFLGFBQXhELENBQXNFLE1BQXRFLENBQThFLENBQUEsQ0FBQSxvQkFKMUY7RUFBQSxDQVZoQixDQUFBOztBQUFBLEVBZ0JBLFNBQUEsR0FBWSxTQUFDLEdBQUQsR0FBQTtXQUNWLEdBQ0UsQ0FBQyxPQURILENBQ1csS0FEWCxFQUNrQixLQURsQixDQUVFLENBQUMsT0FGSCxDQUVXLEtBRlgs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/emmet/lib/editor-proxy.coffee

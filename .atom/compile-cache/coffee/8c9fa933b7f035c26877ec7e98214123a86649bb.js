(function() {
  var CompositeDisposable, ConfigSchema, isOpeningTagLikePattern,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isOpeningTagLikePattern = /<(?![\!\/])([a-z]{1}[^>\s=\'\"]*)[^>]*>$/i;

  ConfigSchema = require('./configuration.coffee');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: ConfigSchema.config,
    neverClose: [],
    forceInline: [],
    forceBlock: [],
    makeNeverCloseSelfClosing: false,
    ignoreGrammar: false,
    legacyMode: false,
    activate: function() {
      this.autocloseHTMLEvents = new CompositeDisposable;
      atom.commands.add('atom-text-editor', {
        'autoclose-html:close-and-complete': (function(_this) {
          return function(e) {
            if (_this.legacyMode) {
              console.log(e);
              return e.abortKeyBinding();
            } else {
              atom.workspace.getActiveTextEditor().insertText(">");
              return _this.execAutoclose();
            }
          };
        })(this)
      });
      atom.config.observe('autoclose-html.neverClose', (function(_this) {
        return function(value) {
          return _this.neverClose = value;
        };
      })(this));
      atom.config.observe('autoclose-html.forceInline', (function(_this) {
        return function(value) {
          return _this.forceInline = value;
        };
      })(this));
      atom.config.observe('autoclose-html.forceBlock', (function(_this) {
        return function(value) {
          return _this.forceBlock = value;
        };
      })(this));
      atom.config.observe('autoclose-html.makeNeverCloseSelfClosing', (function(_this) {
        return function(value) {
          return _this.makeNeverCloseSelfClosing = value;
        };
      })(this));
      return atom.config.observe('autoclose-html.legacyMode', (function(_this) {
        return function(value) {
          _this.legacyMode = value;
          if (_this.legacyMode) {
            return _this._events();
          } else {
            return _this._unbindEvents();
          }
        };
      })(this));
    },
    deactivate: function() {
      if (this.legacyMode) {
        return this._unbindEvents();
      }
    },
    isInline: function(eleTag) {
      var ele, ret, _ref, _ref1, _ref2;
      if (this.forceInline.indexOf("*") > -1) {
        return true;
      }
      try {
        ele = document.createElement(eleTag);
      } catch (_error) {
        return false;
      }
      if (_ref = eleTag.toLowerCase(), __indexOf.call(this.forceBlock, _ref) >= 0) {
        return false;
      } else if (_ref1 = eleTag.toLowerCase(), __indexOf.call(this.forceInline, _ref1) >= 0) {
        return true;
      }
      document.body.appendChild(ele);
      ret = (_ref2 = window.getComputedStyle(ele).getPropertyValue('display')) === 'inline' || _ref2 === 'inline-block' || _ref2 === 'none';
      document.body.removeChild(ele);
      return ret;
    },
    isNeverClosed: function(eleTag) {
      var _ref;
      return _ref = eleTag.toLowerCase(), __indexOf.call(this.neverClose, _ref) >= 0;
    },
    execAutoclose: function() {
      var doubleQuotes, editor, eleTag, index, isInline, line, matches, oddDoubleQuotes, oddSingleQuotes, partial, range, singleQuotes, tag;
      editor = atom.workspace.getActiveTextEditor();
      range = editor.selections[0].getBufferRange();
      line = editor.buffer.getLines()[range.end.row];
      partial = line.substr(0, range.start.column);
      partial = partial.substr(partial.lastIndexOf('<'));
      if (partial.substr(partial.length - 1, 1) === '/') {
        return;
      }
      singleQuotes = partial.match(/\'/g);
      doubleQuotes = partial.match(/\"/g);
      oddSingleQuotes = singleQuotes && (singleQuotes.length % 2);
      oddDoubleQuotes = doubleQuotes && (doubleQuotes.length % 2);
      if (oddSingleQuotes || oddDoubleQuotes) {
        return;
      }
      index = -1;
      while ((index = partial.indexOf('"')) !== -1) {
        partial = partial.slice(0, index) + partial.slice(partial.indexOf('"', index + 1) + 1);
      }
      while ((index = partial.indexOf("'")) !== -1) {
        partial = partial.slice(0, index) + partial.slice(partial.indexOf("'", index + 1) + 1);
      }
      if ((matches = partial.match(isOpeningTagLikePattern)) == null) {
        return;
      }
      eleTag = matches[matches.length - 1];
      if (this.isNeverClosed(eleTag)) {
        if (this.makeNeverCloseSelfClosing) {
          tag = '/>';
          if (partial.substr(partial.length - 1, 1 !== ' ')) {
            tag = ' ' + tag;
          }
          editor.backspace();
          editor.insertText(tag);
        }
        return;
      }
      isInline = this.isInline(eleTag);
      if (!isInline) {
        editor.insertNewline();
        editor.insertNewline();
      }
      editor.insertText('</' + eleTag + '>');
      if (isInline) {
        return editor.setCursorBufferPosition(range.end);
      } else {
        editor.autoIndentBufferRow(range.end.row + 1);
        return editor.setCursorBufferPosition([range.end.row + 1, atom.workspace.getActivePaneItem().getTabText().length * atom.workspace.getActivePaneItem().indentationForBufferRow(range.end.row + 1)]);
      }
    },
    _events: function() {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          return textEditor.observeGrammar(function(grammar) {
            if (textEditor.autocloseHTMLbufferEvent != null) {
              textEditor.autocloseHTMLbufferEvent.dispose();
            }
            if (atom.views.getView(textEditor).getAttribute('data-grammar').split(' ').indexOf('html') > -1) {
              textEditor.autocloseHTMLbufferEvent = textEditor.buffer.onDidChange(function(e) {
                if ((e != null ? e.newText : void 0) === '>' && textEditor === atom.workspace.getActiveTextEditor()) {
                  return setTimeout(function() {
                    return _this.execAutoclose();
                  });
                }
              });
              return _this.autocloseHTMLEvents.add(textEditor.autocloseHTMLbufferEvent);
            }
          });
        };
      })(this));
    },
    _unbindEvents: function() {
      return this.autocloseHTMLEvents.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXV0b2Nsb3NlLWh0bWwvbGliL2F1dG9jbG9zZS1odG1sLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwREFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsdUJBQUEsR0FBMEIsMkNBQTFCLENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUdDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFIRCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsTUFBQSxFQUFRLFlBQVksQ0FBQyxNQUFyQjtBQUFBLElBRUEsVUFBQSxFQUFXLEVBRlg7QUFBQSxJQUdBLFdBQUEsRUFBYSxFQUhiO0FBQUEsSUFJQSxVQUFBLEVBQVksRUFKWjtBQUFBLElBS0EseUJBQUEsRUFBMkIsS0FMM0I7QUFBQSxJQU1BLGFBQUEsRUFBZSxLQU5mO0FBQUEsSUFPQSxVQUFBLEVBQVksS0FQWjtBQUFBLElBU0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUVOLE1BQUEsSUFBQyxDQUFBLG1CQUFELEdBQXVCLEdBQUEsQ0FBQSxtQkFBdkIsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNJO0FBQUEsUUFBQSxtQ0FBQSxFQUFxQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ2pDLFlBQUEsSUFBRyxLQUFDLENBQUEsVUFBSjtBQUNJLGNBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFaLENBQUEsQ0FBQTtxQkFDQSxDQUFDLENBQUMsZUFBRixDQUFBLEVBRko7YUFBQSxNQUFBO0FBSUksY0FBQSxJQUFJLENB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/autoclose-html/lib/autoclose-html.coffee

(function() {
  var ConfigSchema, defaultGrammars, isOpeningTagLikePattern,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isOpeningTagLikePattern = /<(?![\!\/])([a-z]{1}[^>\s=\'\"]*)[^>]*$/i;

  defaultGrammars = ['HTML', 'HTML (Go)', 'HTML (Rails)', 'HTML (Angular)', 'HTML (Mustache)', 'HTML (Handlebars)', 'HTML (Ruby - ERB)', 'PHP'];

  ConfigSchema = require('./configuration.coffee');

  module.exports = {
    config: ConfigSchema.config,
    neverClose: [],
    forceInline: [],
    forceBlock: [],
    grammars: defaultGrammars,
    makeNeverCloseSelfClosing: false,
    ignoreGrammar: false,
    activate: function() {
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
      atom.config.observe('autoclose-html.additionalGrammars', (function(_this) {
        return function(value) {
          if (__indexOf.call(value, '*') >= 0) {
            return _this.ignoreGrammar = true;
          } else {
            return _this.grammars = defaultGrammars.concat(value);
          }
        };
      })(this));
      atom.config.observe('autoclose-html.makeNeverCloseSelfClosing', (function(_this) {
        return function(value) {
          return _this.makeNeverCloseSelfClosing = value;
        };
      })(this));
      return this._events();
    },
    isInline: function(eleTag) {
      var ele, ret, _ref, _ref1, _ref2;
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
    execAutoclose: function(changedEvent, editor) {
      var doubleQuotes, eleTag, index, isInline, line, matches, oddDoubleQuotes, oddSingleQuotes, partial, singleQuotes;
      if ((changedEvent != null ? changedEvent.newText : void 0) === '>' && editor === atom.workspace.getActiveTextEditor()) {
        line = editor.buffer.getLines()[changedEvent.newRange.end.row];
        partial = line.substr(0, changedEvent.newRange.start.column);
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
            setTimeout(function() {
              var tag;
              tag = '/>';
              if (partial.substr(partial.length - 1, 1 !== ' ')) {
                tag = ' ' + tag;
              }
              editor.backspace();
              return editor.insertText(tag);
            });
          }
          return;
        }
        isInline = this.isInline(eleTag);
        return setTimeout(function() {
          if (!isInline) {
            editor.insertNewline();
            editor.insertNewline();
          }
          editor.insertText('</' + eleTag + '>');
          if (isInline) {
            return editor.setCursorBufferPosition(changedEvent.newRange.end);
          } else {
            editor.autoIndentBufferRow(changedEvent.newRange.end.row + 1);
            return editor.setCursorBufferPosition([changedEvent.newRange.end.row + 1, atom.workspace.getActivePaneItem().getTabText().length * atom.workspace.getActivePaneItem().indentationForBufferRow(changedEvent.newRange.end.row + 1)]);
          }
        });
      }
    },
    _events: function() {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          var bufferEvent;
          bufferEvent = null;
          return textEditor.observeGrammar(function(grammar) {
            var _ref, _ref1;
            if (bufferEvent != null) {
              bufferEvent.dispose();
            }
            if (((_ref = grammar.name) != null ? _ref.length : void 0) > 0 && (_this.ignoreGrammar || (_ref1 = grammar.name, __indexOf.call(_this.grammars, _ref1) >= 0))) {
              return bufferEvent = textEditor.buffer.onDidChange(function(e) {
                return _this.execAutoclose(e, textEditor);
              });
            }
          });
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXV0b2Nsb3NlLWh0bWwvbGliL2F1dG9jbG9zZS1odG1sLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzREFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsdUJBQUEsR0FBMEIsMENBQTFCLENBQUE7O0FBQUEsRUFDQSxlQUFBLEdBQWtCLENBQUMsTUFBRCxFQUFTLFdBQVQsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBQXdELGlCQUF4RCxFQUEyRSxtQkFBM0UsRUFBZ0csbUJBQWhHLEVBQXFILEtBQXJILENBRGxCLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBSGYsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLE1BQUEsRUFBUSxZQUFZLENBQUMsTUFBckI7QUFBQSxJQUVBLFVBQUEsRUFBVyxFQUZYO0FBQUEsSUFHQSxXQUFBLEVBQWEsRUFIYjtBQUFBLElBSUEsVUFBQSxFQUFZLEVBSlo7QUFBQSxJQUtBLFFBQUEsRUFBVSxlQUxWO0FBQUEsSUFNQSx5QkFBQSxFQUEyQixLQU4zQjtBQUFBLElBT0EsYUFBQSxFQUFlLEtBUGY7QUFBQSxJQVNBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFFTixNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiwyQkFBcEIsRUFBaUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO2lCQUM3QyxLQUFDLENBQUEsVUFBRCxHQUFjLE1BRCtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakQsQ0FBQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNEJBQXBC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

//# sourceURL=/Users/vmaudgalya/.atom/packages/autoclose-html/lib/autoclose-html.coffee

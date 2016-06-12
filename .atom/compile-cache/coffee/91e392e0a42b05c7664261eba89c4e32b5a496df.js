(function() {
  var TabsToSpaces,
    __modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  module.exports = TabsToSpaces = (function() {
    function TabsToSpaces() {}

    TabsToSpaces.prototype.allWhitespace = /[ \t]+/g;

    TabsToSpaces.prototype.leadingWhitespace = /^[ \t]+/g;

    TabsToSpaces.prototype.tabify = function(editor) {
      this.editor = editor != null ? editor : atom.workspace.getActiveTextEditor();
      if (this.editor == null) {
        return;
      }
      return this.replaceWhitespaceWithTabs(this.editor);
    };

    TabsToSpaces.prototype.untabify = function(editor) {
      this.editor = editor != null ? editor : atom.workspace.getActiveTextEditor();
      if (this.editor == null) {
        return;
      }
      return this.replaceWhitespaceWithSpaces(this.editor);
    };

    TabsToSpaces.prototype.untabifyAll = function(editor) {
      this.editor = editor != null ? editor : atom.workspace.getActiveTextEditor();
      if (this.editor == null) {
        return;
      }
      return this.replaceAllWhitespaceWithSpaces(this.editor);
    };

    TabsToSpaces.prototype.countSpaces = function(text) {
      var ch, count, tabLength, _i, _len;
      count = 0;
      tabLength = this.editor.getTabLength();
      for (_i = 0, _len = text.length; _i < _len; _i++) {
        ch = text[_i];
        switch (ch) {
          case ' ':
            count += 1;
            break;
          case '\t':
            count += tabLength;
        }
      }
      return count;
    };

    TabsToSpaces.prototype.multiplyText = function(text, count) {
      return Array(count + 1).join(text);
    };

    TabsToSpaces.prototype.replaceAllWhitespaceWithSpaces = function(editor) {
      return editor.transact((function(_this) {
        return function() {
          return editor.scan(_this.allWhitespace, function(_arg) {
            var count, match, replace;
            match = _arg.match, replace = _arg.replace;
            count = _this.countSpaces(match[0]);
            return replace("" + (_this.multiplyText(' ', count)));
          });
        };
      })(this));
    };

    TabsToSpaces.prototype.replaceWhitespaceWithSpaces = function(editor) {
      return editor.transact((function(_this) {
        return function() {
          return editor.scan(_this.leadingWhitespace, function(_arg) {
            var count, match, replace;
            match = _arg.match, replace = _arg.replace;
            count = _this.countSpaces(match[0]);
            return replace("" + (_this.multiplyText(' ', count)));
          });
        };
      })(this));
    };

    TabsToSpaces.prototype.replaceWhitespaceWithTabs = function(editor) {
      return editor.transact((function(_this) {
        return function() {
          return editor.scan(_this.leadingWhitespace, function(_arg) {
            var count, match, replace, spaces, tabs;
            match = _arg.match, replace = _arg.replace;
            count = _this.countSpaces(match[0]);
            tabs = Math.floor(count / _this.editor.getTabLength());
            spaces = __modulo(count, _this.editor.getTabLength());
            return replace("" + (_this.multiplyText('\t', tabs)) + (_this.multiplyText(' ', spaces)));
          });
        };
      })(this));
    };

    return TabsToSpaces;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvdGFicy10by1zcGFjZXMvbGliL3RhYnMtdG8tc3BhY2VzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxZQUFBO0lBQUEsNkRBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNOzhCQUVKOztBQUFBLDJCQUFBLGFBQUEsR0FBZSxTQUFmLENBQUE7O0FBQUEsMkJBR0EsaUJBQUEsR0FBbUIsVUFIbkIsQ0FBQTs7QUFBQSwyQkFRQSxNQUFBLEdBQVEsU0FBRSxNQUFGLEdBQUE7QUFDTixNQURPLElBQUMsQ0FBQSwwQkFBQSxTQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUNmLENBQUE7QUFBQSxNQUFBLElBQWMsbUJBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSx5QkFBRCxDQUEyQixJQUFDLENBQUEsTUFBNUIsRUFGTTtJQUFBLENBUlIsQ0FBQTs7QUFBQSwyQkFlQSxRQUFBLEdBQVUsU0FBRSxNQUFGLEdBQUE7QUFDUixNQURTLElBQUMsQ0FBQSwwQkFBQSxTQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUNqQixDQUFBO0FBQUEsTUFBQSxJQUFjLG1CQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsMkJBQUQsQ0FBNkIsSUFBQyxDQUFBLE1BQTlCLEVBRlE7SUFBQSxDQWZWLENBQUE7O0FBQUEsMkJBc0JBLFdBQUEsR0FBYSxTQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLDBCQUFBLFNBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQ3BCLENBQUE7QUFBQSxNQUFBLElBQWMsbUJBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTthQUNB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/tabs-to-spaces/lib/tabs-to-spaces.coffee

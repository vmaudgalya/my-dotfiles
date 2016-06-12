(function() {
  var TabsToSpaces,
    __modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  TabsToSpaces = (function() {
    function TabsToSpaces() {}

    TabsToSpaces.prototype.allWhitespace = /[ \t]+/gm;

    TabsToSpaces.prototype.leadingWhitespace = /^[ \t]+/gm;

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
      var newText, originalText;
      originalText = editor.getText();
      newText = originalText.replace(this.allWhitespace, (function(_this) {
        return function(match) {
          var count;
          count = _this.countSpaces(match);
          return _this.multiplyText(' ', count);
        };
      })(this));
      if (newText !== originalText) {
        return editor.setText(newText);
      }
    };

    TabsToSpaces.prototype.replaceWhitespaceWithSpaces = function(editor) {
      var newText, originalText;
      originalText = editor.getText();
      newText = originalText.replace(this.leadingWhitespace, (function(_this) {
        return function(match) {
          var count;
          count = _this.countSpaces(match);
          return _this.multiplyText(' ', count);
        };
      })(this));
      if (newText !== originalText) {
        return editor.setText(newText);
      }
    };

    TabsToSpaces.prototype.replaceWhitespaceWithTabs = function(editor) {
      var newText, originalText;
      originalText = editor.getText();
      newText = originalText.replace(this.leadingWhitespace, (function(_this) {
        return function(match) {
          var count, spaces, tabs;
          count = _this.countSpaces(match);
          tabs = Math.floor(count / editor.getTabLength());
          spaces = __modulo(count, editor.getTabLength());
          return "" + (_this.multiplyText('\t', tabs)) + (_this.multiplyText(' ', spaces));
        };
      })(this));
      if (newText !== originalText) {
        return editor.setText(newText);
      }
    };

    return TabsToSpaces;

  })();

  module.exports = new TabsToSpaces;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvdGFicy10by1zcGFjZXMvbGliL3RhYnMtdG8tc3BhY2VzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxZQUFBO0lBQUEsNkRBQUE7O0FBQUEsRUFBTTs4QkFFSjs7QUFBQSwyQkFBQSxhQUFBLEdBQWUsVUFBZixDQUFBOztBQUFBLDJCQUdBLGlCQUFBLEdBQW1CLFdBSG5CLENBQUE7O0FBQUEsMkJBUUEsTUFBQSxHQUFRLFNBQUUsTUFBRixHQUFBO0FBQ04sTUFETyxJQUFDLENBQUEsMEJBQUEsU0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FDZixDQUFBO0FBQUEsTUFBQSxJQUFjLG1CQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEseUJBQUQsQ0FBMkIsSUFBQyxDQUFBLE1BQTVCLEVBRk07SUFBQSxDQVJSLENBQUE7O0FBQUEsMkJBZUEsUUFBQSxHQUFVLFNBQUUsTUFBRixHQUFBO0FBQ1IsTUFEUyxJQUFDLENBQUEsMEJBQUEsU0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FDakIsQ0FBQTtBQUFBLE1BQUEsSUFBYyxtQkFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLDJCQUFELENBQTZCLElBQUMsQ0FBQSxNQUE5QixFQUZRO0lBQUEsQ0FmVixDQUFBOztBQUFBLDJCQXNCQSxXQUFBLEdBQWEsU0FBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSwwQkFBQSxTQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUNwQixDQUFBO0FBQUEsTUFBQSxJQUFjLG1CQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsOEJBQUQsQ0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/tabs-to-spaces/lib/tabs-to-spaces.coffee

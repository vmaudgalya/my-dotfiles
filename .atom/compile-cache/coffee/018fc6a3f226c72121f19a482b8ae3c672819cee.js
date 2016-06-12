(function() {
  var TabsToSpaces,
    __modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  TabsToSpaces = (function() {
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

  module.exports = new TabsToSpaces;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvdGFicy10by1zcGFjZXMvbGliL3RhYnMtdG8tc3BhY2VzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxZQUFBO0lBQUEsNkRBQUE7O0FBQUEsRUFBTTs4QkFFSjs7QUFBQSwyQkFBQSxhQUFBLEdBQWUsU0FBZixDQUFBOztBQUFBLDJCQUdBLGlCQUFBLEdBQW1CLFVBSG5CLENBQUE7O0FBQUEsMkJBUUEsTUFBQSxHQUFRLFNBQUUsTUFBRixHQUFBO0FBQ04sTUFETyxJQUFDLENBQUEsMEJBQUEsU0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FDZixDQUFBO0FBQUEsTUFBQSxJQUFjLG1CQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEseUJBQUQsQ0FBMkIsSUFBQyxDQUFBLE1BQTVCLEVBRk07SUFBQSxDQVJSLENBQUE7O0FBQUEsMkJBZUEsUUFBQSxHQUFVLFNBQUUsTUFBRixHQUFBO0FBQ1IsTUFEUyxJQUFDLENBQUEsMEJBQUEsU0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FDakIsQ0FBQTtBQUFBLE1BQUEsSUFBYyxtQkFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLDJCQUFELENBQTZCLElBQUMsQ0FBQSxNQUE5QixFQUZRO0lBQUEsQ0FmVixDQUFBOztBQUFBLDJCQXNCQSxXQUFBLEdBQWEsU0FBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSwwQkFBQSxTQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUNwQixDQUFBO0FBQUEsTUFBQSxJQUFjLG1CQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsOEJBQUQsQ0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/tabs-to-spaces/lib/tabs-to-spaces.coffee

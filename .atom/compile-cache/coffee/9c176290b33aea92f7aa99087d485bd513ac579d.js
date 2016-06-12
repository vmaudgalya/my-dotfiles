(function() {
  module.exports = {
    activate: function() {
      return atom.commands.add("atom-text-editor", "auto-indent:apply", (function(_this) {
        return function() {
          return _this.apply();
        };
      })(this));
    },
    apply: function() {
      var cursor, editor, savedPosition;
      editor = atom.workspace.getActivePaneItem();
      cursor = editor.getLastCursor();
      savedPosition = cursor.getScreenPosition();
      if (editor.getSelectedText().length === 0) {
        editor.selectAll();
      }
      editor.autoIndentSelectedRows();
      cursor = editor.getLastCursor();
      return cursor.setScreenPosition(savedPosition);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXV0by1pbmRlbnQvbGliL2F1dG8taW5kZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNJO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxtQkFBdEMsRUFBMkQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsS0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzRCxFQURNO0lBQUEsQ0FBVjtBQUFBLElBR0EsS0FBQSxFQUFPLFNBQUEsR0FBQTtBQUNILFVBQUEsNkJBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVMsTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUZULENBQUE7QUFBQSxNQUdBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FIaEIsQ0FBQTtBQUtBLE1BQUEsSUFBRyxNQUFNLENBQUMsZUFBUCxDQUFBLENBQXdCLENBQUMsTUFBekIsS0FBbUMsQ0FBdEM7QUFDSSxRQUFBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBQSxDQURKO09BTEE7QUFBQSxNQU9BLE1BQU0sQ0FBQyxzQkFBUCxDQUFBLENBUEEsQ0FBQTtBQUFBLE1BU0EsTUFBQSxHQUFTLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FUVCxDQUFBO2FBVUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLGFBQXpCLEVBWEc7SUFBQSxDQUhQO0dBREosQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/auto-indent/lib/auto-indent.coffee

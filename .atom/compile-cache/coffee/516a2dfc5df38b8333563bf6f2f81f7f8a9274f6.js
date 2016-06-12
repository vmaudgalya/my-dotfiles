(function() {
  var InsertNlJsx,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  module.exports = InsertNlJsx = (function() {
    function InsertNlJsx(editor) {
      this.editor = editor;
      this.insertText = __bind(this.insertText, this);
      this.adviseBefore(this.editor, 'insertText', this.insertText);
    }

    InsertNlJsx.prototype.insertText = function(text, options) {
      var cursorBufferPosition, indentLength, pad, _ref;
      if (!(text === "\n")) {
        return true;
      }
      if (this.editor.hasMultipleCursors()) {
        return true;
      }
      cursorBufferPosition = this.editor.getCursorBufferPosition();
      if (!(cursorBufferPosition.column > 0)) {
        return true;
      }
      if (__indexOf.call(this.editor.scopeDescriptorForBufferPosition(cursorBufferPosition).getScopesArray(), 'JSXEndTagStart') < 0) {
        return true;
      }
      cursorBufferPosition.column--;
      if (__indexOf.call(this.editor.scopeDescriptorForBufferPosition(cursorBufferPosition).getScopesArray(), 'JSXStartTagEnd') < 0) {
        return true;
      }
      indentLength = (_ref = /^\s*\S/.exec(this.editor.lineTextForBufferRow(cursorBufferPosition.row))) != null ? _ref[0].length : void 0;
      pad = new Array(indentLength).join(' ');
      this.editor.insertText("\n" + pad + (this.editor.getTabText()) + "\n" + pad);
      this.editor.moveUp();
      this.editor.moveToEndOfLine();
      return false;
    };

    InsertNlJsx.prototype.adviseBefore = function(object, methodName, advice) {
      var original;
      original = object[methodName];
      return object[methodName] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (advice.apply(this, args) !== false) {
          return original.apply(this, args);
        }
      };
    };

    return InsertNlJsx;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL2luc2VydC1ubC1qc3guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7SUFBQTs7c0JBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLE1BQWYsRUFBdUIsWUFBdkIsRUFBcUMsSUFBQyxDQUFBLFVBQXRDLENBQUEsQ0FEVztJQUFBLENBQWI7O0FBQUEsMEJBTUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtBQUNWLFVBQUEsNkNBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUFxQixJQUFBLEtBQVEsSUFBVixDQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUFBLENBQWY7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQURBO0FBQUEsTUFHQSxvQkFBQSxHQUF1QixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FIdkIsQ0FBQTtBQUlBLE1BQUEsSUFBQSxDQUFBLENBQW1CLG9CQUFvQixDQUFDLE1BQXJCLEdBQThCLENBQWpELENBQUE7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUpBO0FBS0EsTUFBQSxJQUFtQixlQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLGdDQUFSLENBQXlDLG9CQUF6QyxDQUE4RCxDQUFDLGNBQS9ELENBQUEsQ0FBcEIsRUFBQSxnQkFBQSxLQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BTEE7QUFBQSxNQU1BLG9CQUFvQixDQUFDLE1BQXJCLEVBTkEsQ0FBQTtBQU9BLE1BQUEsSUFBbUIsZUFBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQ0FBUixDQUF5QyxvQkFBekMsQ0FBOEQsQ0FBQyxjQUEvRCxDQUFBLENBQXBCLEVBQUEsZ0JBQUEsS0FBbkI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQVBBO0FBQUEsTUFRQSxZQUFBLG9HQUFzRixDQUFBLENBQUEsQ0FBRSxDQUFDLGVBUnpGLENBQUE7QUFBQSxNQVNBLEdBQUEsR0FBVSxJQUFBLEtBQUEsQ0FBTSxZQUFOLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsR0FBekIsQ0FUVixDQUFBO0FBQUEsTUFVQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBb0IsSUFBQSxHQUFJLEdBQUosR0FBUyxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFBLENBQUQsQ0FBVCxHQUErQixJQUEvQixHQUFtQyxHQUF2RCxDQVZBLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFBLENBWEEsQ0FBQTtBQUFBLE1BWUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUEsQ0FaQSxDQUFBO2FBYUEsTUFkVTtJQUFBLENBTlosQ0FBQTs7QUFBQSwwQkF1QkEsWUFBQSxHQUFjLFNBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsTUFBckIsR0FBQTtBQUNaLFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLE1BQU8sQ0FBQSxVQUFBLENBQWxCLENBQUE7YUFDQSxNQUFPLENBQUEsVUFBQSxDQUFQLEdBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLElBQUE7QUFBQSxRQURvQiw4REFDcEIsQ0FBQTtBQUFBLFFBQUEsSUFBTyxNQUFNLENBQUMsS0FBUCxDQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBQSxLQUE0QixLQUFuQztpQkFDRSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsRUFBcUIsSUFBckIsRUFERjtTQURtQjtNQUFBLEVBRlQ7SUFBQSxDQXZCZCxDQUFBOzt1QkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/insert-nl-jsx.coffee

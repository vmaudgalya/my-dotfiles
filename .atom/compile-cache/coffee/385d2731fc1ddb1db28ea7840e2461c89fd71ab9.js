(function() {
  var LegacyAdater;

  module.exports = LegacyAdater = (function() {
    function LegacyAdater(textEditor) {
      this.textEditor = textEditor;
    }

    LegacyAdater.prototype.onDidChangeScrollTop = function(callback) {
      return this.textEditor.onDidChangeScrollTop(callback);
    };

    LegacyAdater.prototype.onDidChangeScrollLeft = function(callback) {
      return this.textEditor.onDidChangeScrollLeft(callback);
    };

    LegacyAdater.prototype.getHeight = function() {
      return this.textEditor.getHeight();
    };

    LegacyAdater.prototype.getScrollTop = function() {
      return this.textEditor.getScrollTop();
    };

    LegacyAdater.prototype.setScrollTop = function(scrollTop) {
      return this.textEditor.setScrollTop(scrollTop);
    };

    LegacyAdater.prototype.getScrollLeft = function() {
      return this.textEditor.getScrollLeft();
    };

    LegacyAdater.prototype.getHeightWithoutScrollPastEnd = function() {
      return this.textEditor.displayBuffer.getLineHeightInPixels();
    };

    LegacyAdater.prototype.getMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      maxScrollTop = this.textEditor.displayBuffer.getMaxScrollTop();
      lineHeight = this.textEditor.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.getHeight() - 3 * lineHeight;
      }
      return maxScrollTop;
    };

    return LegacyAdater;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvYWRhcHRlcnMvbGVnYWN5LWFkYXB0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxzQkFBRSxVQUFGLEdBQUE7QUFBZSxNQUFkLElBQUMsQ0FBQSxhQUFBLFVBQWEsQ0FBZjtJQUFBLENBQWI7O0FBQUEsMkJBRUEsb0JBQUEsR0FBc0IsU0FBQyxRQUFELEdBQUE7YUFDcEIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxvQkFBWixDQUFpQyxRQUFqQyxFQURvQjtJQUFBLENBRnRCLENBQUE7O0FBQUEsMkJBS0EscUJBQUEsR0FBdUIsU0FBQyxRQUFELEdBQUE7YUFDckIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxxQkFBWixDQUFrQyxRQUFsQyxFQURxQjtJQUFBLENBTHZCLENBQUE7O0FBQUEsMkJBUUEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLEVBRFM7SUFBQSxDQVJYLENBQUE7O0FBQUEsMkJBV0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUNaLElBQUMsQ0FBQSxVQUFVLENBQUMsWUFBWixDQUFBLEVBRFk7SUFBQSxDQVhkLENBQUE7O0FBQUEsMkJBY0EsWUFBQSxHQUFjLFNBQUMsU0FBRCxHQUFBO2FBQ1osSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFaLENBQXlCLFNBQXpCLEVBRFk7SUFBQSxDQWRkLENBQUE7O0FBQUEsMkJBaUJBLGFBQUEsR0FBZSxTQUFBLEdBQUE7YUFDYixJQUFDLENBQUEsVUFBVSxDQUFDLGFBQVosQ0FBQSxFQURhO0lBQUEsQ0FqQmYsQ0FBQTs7QUFBQSwyQkFvQkEsNkJBQUEsR0FBK0IsU0FBQSxHQUFBO2FBQzdCLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBYSxDQUFDLHFCQUExQixDQUFBLEVBRDZCO0lBQUEsQ0FwQi9CLENBQUE7O0FBQUEsMkJBdUJBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSx3QkFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQTFCLENBQUEsQ0FBZixDQUFBO0FBQUEsTUFDQSxVQUFBLEdBQWEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxxQkFBWixDQUFBLENBRGIsQ0FBQTtBQUdBLE1BQUEsSUFBaUQsSUFBQyxDQUFBLGFBQWxEO0FBQUEsUUFBQSxZQUFBLElBQWdCLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBQSxHQUFlLENBQUEsR0FBSSxVQUFuQyxDQUFBO09BSEE7YUFJQSxhQUxlO0lBQUEsQ0F2QmpCLENBQUE7O3dCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/adapters/legacy-adapter.coffee

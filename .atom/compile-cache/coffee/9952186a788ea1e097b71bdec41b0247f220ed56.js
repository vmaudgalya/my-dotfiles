(function() {
  var LegacyAdater;

  module.exports = LegacyAdater = (function() {
    function LegacyAdater(textEditor) {
      this.textEditor = textEditor;
    }

    LegacyAdater.prototype.enableCache = function() {
      return this.useCache = true;
    };

    LegacyAdater.prototype.clearCache = function() {
      this.useCache = false;
      delete this.heightCache;
      delete this.scrollTopCache;
      delete this.scrollLeftCache;
      return delete this.maxScrollTopCache;
    };

    LegacyAdater.prototype.onDidChangeScrollTop = function(callback) {
      return this.textEditor.onDidChangeScrollTop(callback);
    };

    LegacyAdater.prototype.onDidChangeScrollLeft = function(callback) {
      return this.textEditor.onDidChangeScrollLeft(callback);
    };

    LegacyAdater.prototype.getHeight = function() {
      if (this.useCache) {
        return this.heightCache != null ? this.heightCache : this.heightCache = this.textEditor.getHeight();
      }
      return this.textEditor.getHeight();
    };

    LegacyAdater.prototype.getScrollTop = function() {
      if (this.useCache) {
        return this.scrollTopCache != null ? this.scrollTopCache : this.scrollTopCache = this.textEditor.getScrollTop();
      }
      return this.textEditor.getScrollTop();
    };

    LegacyAdater.prototype.setScrollTop = function(scrollTop) {
      return this.textEditor.setScrollTop(scrollTop);
    };

    LegacyAdater.prototype.getScrollLeft = function() {
      if (this.useCache) {
        return this.scrollLeftCache != null ? this.scrollLeftCache : this.scrollLeftCache = this.textEditor.getScrollLeft();
      }
      return this.textEditor.getScrollLeft();
    };

    LegacyAdater.prototype.getMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      if ((this.maxScrollTopCache != null) && this.useCache) {
        return this.maxScrollTopCache;
      }
      maxScrollTop = this.textEditor.displayBuffer.getMaxScrollTop();
      lineHeight = this.textEditor.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.getHeight() - 3 * lineHeight;
      }
      if (this.useCache) {
        return this.maxScrollTopCache = maxScrollTop;
      }
      return maxScrollTop;
    };

    return LegacyAdater;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvYWRhcHRlcnMvbGVnYWN5LWFkYXB0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxzQkFBRSxVQUFGLEdBQUE7QUFBZSxNQUFkLElBQUMsQ0FBQSxhQUFBLFVBQWEsQ0FBZjtJQUFBLENBQWI7O0FBQUEsMkJBRUEsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxRQUFELEdBQVksS0FBZjtJQUFBLENBRmIsQ0FBQTs7QUFBQSwyQkFJQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBQVosQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFBLElBQVEsQ0FBQSxXQURSLENBQUE7QUFBQSxNQUVBLE1BQUEsQ0FBQSxJQUFRLENBQUEsY0FGUixDQUFBO0FBQUEsTUFHQSxNQUFBLENBQUEsSUFBUSxDQUFBLGVBSFIsQ0FBQTthQUlBLE1BQUEsQ0FBQSxJQUFRLENBQUEsa0JBTEU7SUFBQSxDQUpaLENBQUE7O0FBQUEsMkJBV0Esb0JBQUEsR0FBc0IsU0FBQyxRQUFELEdBQUE7YUFDcEIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxvQkFBWixDQUFpQyxRQUFqQyxFQURvQjtJQUFBLENBWHRCLENBQUE7O0FBQUEsMkJBY0EscUJBQUEsR0FBdUIsU0FBQyxRQUFELEdBQUE7YUFDckIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxxQkFBWixDQUFrQyxRQUFsQyxFQURxQjtJQUFBLENBZHZCLENBQUE7O0FBQUEsMkJBaUJBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQWtELElBQUMsQ0FBQSxRQUFuRDtBQUFBLDBDQUFPLElBQUMsQ0FBQSxjQUFELElBQUMsQ0FBQSxjQUFlLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLENBQXZCLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLEVBRlM7SUFBQSxDQWpCWCxDQUFBOztBQUFBLDJCQXFCQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osTUFBQSxJQUF3RCxJQUFDLENBQUEsUUFBekQ7QUFBQSw2Q0FBTyxJQUFDLENBQUEsaUJBQUQsSUFBQyxDQUFBLGlCQUFrQixJQUFDLENBQUEsVUFBVSxDQUFDLFlBQVosQ0FBQSxDQUExQixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLFlBQVosQ0FBQSxFQUZZO0lBQUEsQ0FyQmQsQ0FBQTs7QUFBQSwyQkF5QkEsWUFBQSxHQUFjLFNBQUMsU0FBRCxHQUFBO2FBQ1osSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFaLENBQXlCLFNBQXpCLEVBRFk7SUFBQSxDQXpCZCxDQUFBOztBQUFBLDJCQTRCQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsTUFBQSxJQUEwRCxJQUFDLENBQUEsUUFBM0Q7QUFBQSw4Q0FBTyxJQUFDLENBQUEsa0JBQUQsSUFBQyxDQUFBLGtCQUFtQixJQUFDLENBQUEsVUFBVSxDQUFDLGFBQVosQ0FBQSxDQUEzQixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLGFBQVosQ0FBQSxFQUZhO0lBQUEsQ0E1QmYsQ0FBQTs7QUFBQSwyQkFnQ0EsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLHdCQUFBO0FBQUEsTUFBQSxJQUE2QixnQ0FBQSxJQUF3QixJQUFDLENBQUEsUUFBdEQ7QUFBQSxlQUFPLElBQUMsQ0FBQSxpQkFBUixDQUFBO09BQUE7QUFBQSxNQUNBLFlBQUEsR0FBZSxJQUFDLENBQUEsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUExQixDQUFBLENBRGYsQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxVQUFVLENBQUMscUJBQVosQ0FBQSxDQUZiLENBQUE7QUFJQSxNQUFBLElBQWlELElBQUMsQ0FBQSxhQUFsRDtBQUFBLFFBQUEsWUFBQSxJQUFnQixJQUFDLENBQUEsU0FBRCxDQUFBLENBQUEsR0FBZSxDQUFBLEdBQUksVUFBbkMsQ0FBQTtPQUpBO0FBS0EsTUFBQSxJQUE0QyxJQUFDLENBQUEsUUFBN0M7QUFBQSxlQUFPLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixZQUE1QixDQUFBO09BTEE7YUFNQSxhQVBlO0lBQUEsQ0FoQ2pCLENBQUE7O3dCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/adapters/legacy-adapter.coffee

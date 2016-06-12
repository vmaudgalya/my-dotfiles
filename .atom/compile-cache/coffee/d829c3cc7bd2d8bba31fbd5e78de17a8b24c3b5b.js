(function() {
  var BetaAdater;

  module.exports = BetaAdater = (function() {
    function BetaAdater(textEditor) {
      this.textEditor = textEditor;
      this.textEditorElement = atom.views.getView(this.textEditor);
    }

    BetaAdater.prototype.enableCache = function() {
      return this.useCache = true;
    };

    BetaAdater.prototype.clearCache = function() {
      this.useCache = false;
      delete this.heightCache;
      delete this.scrollTopCache;
      delete this.scrollLeftCache;
      return delete this.maxScrollTopCache;
    };

    BetaAdater.prototype.onDidChangeScrollTop = function(callback) {
      return this.textEditorElement.onDidChangeScrollTop(callback);
    };

    BetaAdater.prototype.onDidChangeScrollLeft = function(callback) {
      return this.textEditorElement.onDidChangeScrollLeft(callback);
    };

    BetaAdater.prototype.getHeight = function() {
      if (this.useCache) {
        return this.heightCache != null ? this.heightCache : this.heightCache = this.textEditorElement.getHeight();
      }
      return this.textEditorElement.getHeight();
    };

    BetaAdater.prototype.getScrollTop = function() {
      if (this.useCache) {
        return this.scrollTopCache != null ? this.scrollTopCache : this.scrollTopCache = this.textEditorElement.getScrollTop();
      }
      return this.textEditorElement.getScrollTop();
    };

    BetaAdater.prototype.setScrollTop = function(scrollTop) {
      return this.textEditorElement.setScrollTop(scrollTop);
    };

    BetaAdater.prototype.getScrollLeft = function() {
      if (this.useCache) {
        return this.scrollLeftCache != null ? this.scrollLeftCache : this.scrollLeftCache = this.textEditorElement.getScrollLeft();
      }
      return this.textEditorElement.getScrollLeft();
    };

    BetaAdater.prototype.getMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      if ((this.maxScrollTopCache != null) && this.useCache) {
        return this.maxScrollTopCache;
      }
      maxScrollTop = this.textEditorElement.getScrollHeight() - this.getHeight();
      lineHeight = this.textEditor.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.getHeight() - 3 * lineHeight;
      }
      if (this.useCache) {
        return this.maxScrollTopCache = maxScrollTop;
      }
      return maxScrollTop;
    };

    return BetaAdater;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvYWRhcHRlcnMvYmV0YS1hZGFwdGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsb0JBQUUsVUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLFVBQXBCLENBQXJCLENBRFc7SUFBQSxDQUFiOztBQUFBLHlCQUdBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsUUFBRCxHQUFZLEtBQWY7SUFBQSxDQUhiLENBQUE7O0FBQUEseUJBS0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBQSxJQUFRLENBQUEsV0FEUixDQUFBO0FBQUEsTUFFQSxNQUFBLENBQUEsSUFBUSxDQUFBLGNBRlIsQ0FBQTtBQUFBLE1BR0EsTUFBQSxDQUFBLElBQVEsQ0FBQSxlQUhSLENBQUE7YUFJQSxNQUFBLENBQUEsSUFBUSxDQUFBLGtCQUxFO0lBQUEsQ0FMWixDQUFBOztBQUFBLHlCQVlBLG9CQUFBLEdBQXNCLFNBQUMsUUFBRCxHQUFBO2FBQ3BCLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxvQkFBbkIsQ0FBd0MsUUFBeEMsRUFEb0I7SUFBQSxDQVp0QixDQUFBOztBQUFBLHlCQWVBLHFCQUFBLEdBQXVCLFNBQUMsUUFBRCxHQUFBO2FBQ3JCLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxxQkFBbkIsQ0FBeUMsUUFBekMsRUFEcUI7SUFBQSxDQWZ2QixDQUFBOztBQUFBLHlCQWtCQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUF5RCxJQUFDLENBQUEsUUFBMUQ7QUFBQSwwQ0FBTyxJQUFDLENBQUEsY0FBRCxJQUFDLENBQUEsY0FBZSxJQUFDLENBQUEsaUJBQWlCLENBQUMsU0FBbkIsQ0FBQSxDQUF2QixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsU0FBbkIsQ0FBQSxFQUZTO0lBQUEsQ0FsQlgsQ0FBQTs7QUFBQSx5QkFzQkEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLE1BQUEsSUFBK0QsSUFBQyxDQUFBLFFBQWhFO0FBQUEsNkNBQU8sSUFBQyxDQUFBLGlCQUFELElBQUMsQ0FBQSxpQkFBa0IsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFlBQW5CLENBQUEsQ0FBMUIsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFlBQW5CLENBQUEsRUFGWTtJQUFBLENBdEJkLENBQUE7O0FBQUEseUJBMEJBLFlBQUEsR0FBYyxTQUFDLFNBQUQsR0FBQTthQUNaLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxZQUFuQixDQUFnQyxTQUFoQyxFQURZO0lBQUEsQ0ExQmQsQ0FBQTs7QUFBQSx5QkE2QkEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsSUFBaUUsSUFBQyxDQUFBLFFBQWxFO0FBQUEsOENBQU8sSUFBQyxDQUFBLGtCQUFELElBQUMsQ0FBQSxrQkFBbUIsSUFBQyxDQUFBLGlCQUFpQixDQUFDLGFBQW5CLENBQUEsQ0FBM0IsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLGFBQW5CLENBQUEsRUFGYTtJQUFBLENBN0JmLENBQUE7O0FBQUEseUJBaUNBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSx3QkFBQTtBQUFBLE1BQUEsSUFBNkIsZ0NBQUEsSUFBd0IsSUFBQyxDQUFBLFFBQXREO0FBQUEsZUFBTyxJQUFDLENBQUEsaUJBQVIsQ0FBQTtPQUFBO0FBQUEsTUFDQSxZQUFBLEdBQWUsSUFBQyxDQUFBLGlCQUFpQixDQUFDLGVBQW5CLENBQUEsQ0FBQSxHQUF1QyxJQUFDLENBQUEsU0FBRCxDQUFBLENBRHRELENBQUE7QUFBQSxNQUVBLFVBQUEsR0FBYSxJQUFDLENBQUEsVUFBVSxDQUFDLHFCQUFaLENBQUEsQ0FGYixDQUFBO0FBSUEsTUFBQSxJQUFpRCxJQUFDLENBQUEsYUFBbEQ7QUFBQSxRQUFBLFlBQUEsSUFBZ0IsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFBLEdBQWUsQ0FBQSxHQUFJLFVBQW5DLENBQUE7T0FKQTtBQUtBLE1BQUEsSUFBNEMsSUFBQyxDQUFBLFFBQTdDO0FBQUEsZUFBTyxJQUFDLENBQUEsaUJBQUQsR0FBcUIsWUFBNUIsQ0FBQTtPQUxBO2FBTUEsYUFQZTtJQUFBLENBakNqQixDQUFBOztzQkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/adapters/beta-adapter.coffee

(function() {
  var BetaAdater;

  module.exports = BetaAdater = (function() {
    function BetaAdater(textEditor) {
      this.textEditor = textEditor;
      this.textEditorElement = atom.views.getView(this.textEditor);
    }

    BetaAdater.prototype.onDidChangeScrollTop = function(callback) {
      return this.textEditorElement.onDidChangeScrollTop(callback);
    };

    BetaAdater.prototype.onDidChangeScrollLeft = function(callback) {
      return this.textEditorElement.onDidChangeScrollLeft(callback);
    };

    BetaAdater.prototype.getHeight = function() {
      return this.textEditorElement.getHeight();
    };

    BetaAdater.prototype.getScrollTop = function() {
      return this.textEditorElement.getScrollTop();
    };

    BetaAdater.prototype.setScrollTop = function(scrollTop) {
      return this.textEditorElement.setScrollTop(scrollTop);
    };

    BetaAdater.prototype.getScrollLeft = function() {
      return this.textEditorElement.getScrollLeft();
    };

    BetaAdater.prototype.getHeightWithoutScrollPastEnd = function() {
      return this.textEditor.displayBuffer.getLineHeightInPixels();
    };

    BetaAdater.prototype.getMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      maxScrollTop = this.textEditorElement.getScrollHeight() - this.getHeight();
      lineHeight = this.textEditor.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.getHeight() - 3 * lineHeight;
      }
      return maxScrollTop;
    };

    return BetaAdater;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvYWRhcHRlcnMvYmV0YS1hZGFwdGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsb0JBQUUsVUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLFVBQXBCLENBQXJCLENBRFc7SUFBQSxDQUFiOztBQUFBLHlCQUdBLG9CQUFBLEdBQXNCLFNBQUMsUUFBRCxHQUFBO2FBQ3BCLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxvQkFBbkIsQ0FBd0MsUUFBeEMsRUFEb0I7SUFBQSxDQUh0QixDQUFBOztBQUFBLHlCQU1BLHFCQUFBLEdBQXVCLFNBQUMsUUFBRCxHQUFBO2FBQ3JCLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxxQkFBbkIsQ0FBeUMsUUFBekMsRUFEcUI7SUFBQSxDQU52QixDQUFBOztBQUFBLHlCQVNBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsaUJBQWlCLENBQUMsU0FBbkIsQ0FBQSxFQURTO0lBQUEsQ0FUWCxDQUFBOztBQUFBLHlCQVlBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDWixJQUFDLENBQUEsaUJBQWlCLENBQUMsWUFBbkIsQ0FBQSxFQURZO0lBQUEsQ0FaZCxDQUFBOztBQUFBLHlCQWVBLFlBQUEsR0FBYyxTQUFDLFNBQUQsR0FBQTthQUNaLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxZQUFuQixDQUFnQyxTQUFoQyxFQURZO0lBQUEsQ0FmZCxDQUFBOztBQUFBLHlCQWtCQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQ2IsSUFBQyxDQUFBLGlCQUFpQixDQUFDLGFBQW5CLENBQUEsRUFEYTtJQUFBLENBbEJmLENBQUE7O0FBQUEseUJBcUJBLDZCQUFBLEdBQStCLFNBQUEsR0FBQTthQUM3QixJQUFDLENBQUEsVUFBVSxDQUFDLGFBQWEsQ0FBQyxxQkFBMUIsQ0FBQSxFQUQ2QjtJQUFBLENBckIvQixDQUFBOztBQUFBLHlCQXdCQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsd0JBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsaUJBQWlCLENBQUMsZUFBbkIsQ0FBQSxDQUFBLEdBQXVDLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBdEQsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhLElBQUMsQ0FBQSxVQUFVLENBQUMscUJBQVosQ0FBQSxDQURiLENBQUE7QUFHQSxNQUFBLElBQWlELElBQUMsQ0FBQSxhQUFsRDtBQUFBLFFBQUEsWUFBQSxJQUFnQixJQUFDLENBQUEsU0FBRCxDQUFBLENBQUEsR0FBZSxDQUFBLEdBQUksVUFBbkMsQ0FBQTtPQUhBO2FBSUEsYUFMZTtJQUFBLENBeEJqQixDQUFBOztzQkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/adapters/beta-adapter.coffee

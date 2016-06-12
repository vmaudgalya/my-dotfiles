(function() {
  var CompositeDisposable, MinimapHighlightSelected, MinimapHighlightSelectedView, requirePackages,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  requirePackages = require('atom-utils').requirePackages;

  MinimapHighlightSelectedView = null;

  MinimapHighlightSelected = (function() {
    function MinimapHighlightSelected() {
      this.destroyViews = __bind(this.destroyViews, this);
      this.createViews = __bind(this.createViews, this);
      this.subscriptions = new CompositeDisposable;
    }

    MinimapHighlightSelected.prototype.activate = function(state) {};

    MinimapHighlightSelected.prototype.consumeMinimapServiceV1 = function(minimap) {
      this.minimap = minimap;
      return requirePackages('highlight-selected').then((function(_this) {
        return function(_arg) {
          _this.highlightSelected = _arg[0];
          MinimapHighlightSelectedView = require('./minimap-highlight-selected-view')();
          return _this.minimap.registerPlugin('highlight-selected', _this);
        };
      })(this));
    };

    MinimapHighlightSelected.prototype.deactivate = function() {
      this.deactivatePlugin();
      this.minimapPackage = null;
      this.highlightSelectedPackage = null;
      this.highlightSelected = null;
      return this.minimap = null;
    };

    MinimapHighlightSelected.prototype.isActive = function() {
      return this.active;
    };

    MinimapHighlightSelected.prototype.activatePlugin = function() {
      if (this.active) {
        return;
      }
      this.active = true;
      this.createViews();
      this.subscriptions.add(this.minimap.onDidActivate(this.createViews));
      return this.subscriptions.add(this.minimap.onDidDeactivate(this.destroyViews));
    };

    MinimapHighlightSelected.prototype.deactivatePlugin = function() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.destroyViews();
      return this.subscriptions.dispose();
    };

    MinimapHighlightSelected.prototype.createViews = function() {
      if (this.viewsCreated) {
        return;
      }
      this.viewsCreated = true;
      this.view = new MinimapHighlightSelectedView(this.minimap);
      return this.view.handleSelection();
    };

    MinimapHighlightSelected.prototype.destroyViews = function() {
      if (!this.viewsCreated) {
        return;
      }
      this.viewsCreated = false;
      this.view.removeMarkers();
      return this.view.destroy();
    };

    return MinimapHighlightSelected;

  })();

  module.exports = new MinimapHighlightSelected;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC1oaWdobGlnaHQtc2VsZWN0ZWQvbGliL21pbmltYXAtaGlnaGxpZ2h0LXNlbGVjdGVkLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0RkFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLFlBQVIsRUFBbkIsZUFERCxDQUFBOztBQUFBLEVBRUEsNEJBQUEsR0FBK0IsSUFGL0IsQ0FBQTs7QUFBQSxFQUlNO0FBQ1MsSUFBQSxrQ0FBQSxHQUFBO0FBQ1gseURBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FEVztJQUFBLENBQWI7O0FBQUEsdUNBR0EsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBLENBSFYsQ0FBQTs7QUFBQSx1Q0FLQSx1QkFBQSxHQUF5QixTQUFFLE9BQUYsR0FBQTtBQUN2QixNQUR3QixJQUFDLENBQUEsVUFBQSxPQUN6QixDQUFBO2FBQUEsZUFBQSxDQUFnQixvQkFBaEIsQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDekMsVUFEMkMsS0FBQyxDQUFBLG9CQUFGLE9BQzFDLENBQUE7QUFBQSxVQUFBLDRCQUFBLEdBQStCLE9BQUEsQ0FBUSxtQ0FBUixDQUFBLENBQUEsQ0FBL0IsQ0FBQTtpQkFFQSxLQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBd0Isb0JBQXhCLEVBQThDLEtBQTlDLEVBSHlDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0MsRUFEdUI7SUFBQSxDQUx6QixDQUFBOztBQUFBLHVDQVdBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFEbEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLHdCQUFELEdBQTRCLElBRjVCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUhyQixDQUFBO2FBSUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUxEO0lBQUEsQ0FYWixDQUFBOztBQUFBLHVDQWtCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE9BQUo7SUFBQSxDQWxCVixDQUFBOztBQUFBLHVDQW9CQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLE1BQUEsSUFBVSxJQUFDLENBQUEsTUFBWDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBRlYsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUpBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBdUIsSUFBQyxDQUFBLFdBQXhCLENBQW5CLENBTkEsQ0FBQTthQU9BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLGVBQVQsQ0FBeUIsSUFBQyxDQUFBLFlBQTFCLENBQW5CLEVBUmM7SUFBQSxDQXBCaEIsQ0FBQTs7QUFBQSx1Q0E4QkEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxNQUFmO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FGVixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsWUFBRCxDQUFBLENBSEEsQ0FBQTthQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBTGdCO0lBQUEsQ0E5QmxCLENBQUE7O0FBQUEsdUNBcUNBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxNQUFBLElBQVUsSUFBQyxDQUFBLFlBQVg7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFGaEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLDRCQUFBLENBQTZCLElBQUMsQ0FBQSxPQUE5QixDQUhaLENBQUE7YUFJQSxJQUFDLENBQUEsSUFBSSxDQUFDLGVBQU4sQ0FBQSxFQUxXO0lBQUEsQ0FyQ2IsQ0FBQTs7QUFBQSx1Q0E0Q0EsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxZQUFmO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLEtBRGhCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBTixDQUFBLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLEVBSlk7SUFBQSxDQTVDZCxDQUFBOztvQ0FBQTs7TUFMRixDQUFBOztBQUFBLEVBdURBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEdBQUEsQ0FBQSx3QkF2RGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap-highlight-selected/lib/minimap-highlight-selected.coffee

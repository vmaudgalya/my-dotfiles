(function() {
  describe('BottomPanelMount', function() {
    var statusBar, statusBarService, workspaceElement, _ref;
    _ref = [], statusBar = _ref[0], statusBarService = _ref[1], workspaceElement = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar').then(function(pack) {
          statusBar = workspaceElement.querySelector('status-bar');
          return statusBarService = pack.mainModule.provideStatusBar();
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return atom.packages.getActivePackage('linter').mainModule.consumeStatusBar(statusBar);
        });
      });
      return waitsForPromise(function() {
        return atom.workspace.open();
      });
    });
    it('can mount to left status-bar', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
    it('can mount to right status-bar', function() {
      var tile;
      atom.config.set('linter.statusIconPosition', 'Right');
      tile = statusBar.getRightTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
    return it('defaults to visible', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      return expect(tile.item.visibility).toBe(true);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvdWkvYm90dG9tLXBhbmVsLW1vdW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsUUFBQSxtREFBQTtBQUFBLElBQUEsT0FBa0QsRUFBbEQsRUFBQyxtQkFBRCxFQUFZLDBCQUFaLEVBQThCLDBCQUE5QixDQUFBO0FBQUEsSUFDQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFlBQTlCLENBQTJDLENBQUMsSUFBNUMsQ0FBaUQsU0FBQyxJQUFELEdBQUE7QUFDL0MsVUFBQSxTQUFBLEdBQVksZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsWUFBL0IsQ0FBWixDQUFBO2lCQUNBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWhCLENBQUEsRUFGNEI7UUFBQSxDQUFqRCxFQURjO01BQUEsQ0FBaEIsQ0FEQSxDQUFBO0FBQUEsTUFLQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QixDQUF1QyxDQUFDLElBQXhDLENBQTZDLFNBQUEsR0FBQTtpQkFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLFVBQVUsQ0FBQyxnQkFBcEQsQ0FBcUUsU0FBckUsRUFEMkM7UUFBQSxDQUE3QyxFQURjO01BQUEsQ0FBaEIsQ0FMQSxDQUFBO2FBUUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxFQURjO01BQUEsQ0FBaEIsRUFUUztJQUFBLENBQVgsQ0FEQSxDQUFBO0FBQUEsSUFhQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLFNBQVMsQ0FBQyxZQUFWLENBQUEsQ0FBeUIsQ0FBQSxDQUFBLENBQWhDLENBQUE7YUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFqQixDQUEyQixDQUFDLElBQTVCLENBQWlDLHlCQUFqQyxFQUZpQztJQUFBLENBQW5DLENBYkEsQ0FBQTtBQUFBLElBaUJBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLEVBQTZDLE9BQTdDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLFNBQVMsQ0FBQyxhQUFWLENBQUEsQ0FBMEIsQ0FBQSxDQUFBLENBRGpDLENBQUE7YUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFqQixDQUEyQixDQUFDLElBQTVCLENBQWlDLHlCQUFqQyxFQUhrQztJQUFBLENBQXBDLENBakJBLENBQUE7V0FzQkEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxTQUFTLENBQUMsWUFBVixDQUFBLENBQXlCLENBQUEsQ0FBQSxDQUFoQyxDQUFBO2FBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBakIsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxJQUFsQyxFQUZ3QjtJQUFBLENBQTFCLEVBdkIyQjtFQUFBLENBQTdCLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/ui/bottom-panel-mount-spec.coffee

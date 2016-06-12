(function() {
  var MinimapHighlightSelected, WorkspaceView;

  WorkspaceView = require('atom').WorkspaceView;

  MinimapHighlightSelected = require('../lib/minimap-highlight-selected');

  describe("MinimapHighlightSelected", function() {
    var activationPromise;
    activationPromise = null;
    return beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return waitsForPromise(function() {
        return atom.packages.activatePackage('minimap-highlight-selected');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC1oaWdobGlnaHQtc2VsZWN0ZWQvc3BlYy9taW5pbWFwLWhpZ2hsaWdodC1zZWxlY3RlZC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTs7QUFBQSxFQUFDLGdCQUFpQixPQUFBLENBQVEsTUFBUixFQUFqQixhQUFELENBQUE7O0FBQUEsRUFDQSx3QkFBQSxHQUEyQixPQUFBLENBQVEsbUNBQVIsQ0FEM0IsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsUUFBQSxpQkFBQTtBQUFBLElBQUEsaUJBQUEsR0FBb0IsSUFBcEIsQ0FBQTtXQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUksQ0FBQyxhQUFMLEdBQXFCLEdBQUEsQ0FBQSxhQUFyQixDQUFBO2FBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsNEJBQTlCLEVBRGM7TUFBQSxDQUFoQixFQUhTO0lBQUEsQ0FBWCxFQUhtQztFQUFBLENBQXJDLENBUkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap-highlight-selected/spec/minimap-highlight-selected-spec.coffee

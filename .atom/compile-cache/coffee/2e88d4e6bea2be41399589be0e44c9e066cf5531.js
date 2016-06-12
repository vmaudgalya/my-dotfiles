(function() {
  describe('Commands', function() {
    var linter;
    linter = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    describe('linter:togglePanel', function() {
      return it('toggles the panel visibility', function() {
        var visibility;
        visibility = linter.views.panel.getVisibility();
        linter.commands.togglePanel();
        expect(linter.views.panel.getVisibility()).toBe(!visibility);
        linter.commands.togglePanel();
        return expect(linter.views.panel.getVisibility()).toBe(visibility);
      });
    });
    return describe('linter:toggle', function() {
      return it('relint when enabled', function() {
        return waitsForPromise(function() {
          return atom.workspace.open(__dirname + '/fixtures/file.txt').then(function() {
            spyOn(linter.commands, 'lint');
            linter.commands.toggleLinter();
            linter.commands.toggleLinter();
            return expect(linter.commands.lint).toHaveBeenCalled();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvY29tbWFuZHMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFFBQUEsTUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsU0FBQSxHQUFBO2lCQUMzQyxNQUFBLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLFVBQVUsQ0FBQyxTQURsQjtRQUFBLENBQTdDLEVBRGM7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQU9BLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7YUFDN0IsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxZQUFBLFVBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFuQixDQUFBLENBQWIsQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFoQixDQUFBLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQW5CLENBQUEsQ0FBUCxDQUEwQyxDQUFDLElBQTNDLENBQWdELENBQUEsVUFBaEQsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQWhCLENBQUEsQ0FIQSxDQUFBO2VBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQW5CLENBQUEsQ0FBUCxDQUEwQyxDQUFDLElBQTNDLENBQWdELFVBQWhELEVBTGlDO01BQUEsQ0FBbkMsRUFENkI7SUFBQSxDQUEvQixDQVBBLENBQUE7V0FlQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7YUFDeEIsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtlQUN4QixlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsU0FBQSxHQUFZLG9CQUFoQyxDQUFxRCxDQUFDLElBQXRELENBQTJELFNBQUEsR0FBQTtBQUN6RCxZQUFBLEtBQUEsQ0FBTSxNQUFNLENBQUMsUUFBYixFQUF1QixNQUF2QixDQUFBLENBQUE7QUFBQSxZQUNBLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBaEIsQ0FBQSxDQURBLENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBaEIsQ0FBQSxDQUZBLENBQUE7bUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBdkIsQ0FBNEIsQ0FBQyxnQkFBN0IsQ0FBQSxFQUp5RDtVQUFBLENBQTNELEVBRGM7UUFBQSxDQUFoQixFQUR3QjtNQUFBLENBQTFCLEVBRHdCO0lBQUEsQ0FBMUIsRUFoQm1CO0VBQUEsQ0FBckIsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/commands-spec.coffee

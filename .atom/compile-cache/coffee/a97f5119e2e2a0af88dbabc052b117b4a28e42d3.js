(function() {
  describe('The Error Panel Visibility Configuration Option', function() {
    var configString;
    configString = 'linter.showErrorPanel';
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter');
      });
    });
    return it('is `true` by default.', function() {
      var packageSetting;
      packageSetting = atom.config.get(configString);
      return expect(packageSetting).toBe(true);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvY29uZmlnL3Nob3ctZXJyb3ItcGFuZWwtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGlEQUFULEVBQTRELFNBQUEsR0FBQTtBQUUxRCxRQUFBLFlBQUE7QUFBQSxJQUFBLFlBQUEsR0FBZSx1QkFBZixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsUUFBOUIsRUFEYztNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQU1BLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsVUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixZQUFoQixDQUFqQixDQUFBO2FBQ0EsTUFBQSxDQUFPLGNBQVAsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixJQUE1QixFQUYwQjtJQUFBLENBQTVCLEVBUjBEO0VBQUEsQ0FBNUQsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/config/show-error-panel-spec.coffee

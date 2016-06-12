(function() {
  var ColorSearch;

  require('./helpers/matchers');

  ColorSearch = require('../lib/color-search');

  describe('ColorSearch', function() {
    var pigments, project, search, _ref;
    _ref = [], search = _ref[0], pigments = _ref[1], project = _ref[2];
    beforeEach(function() {
      atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
      atom.config.set('pigments.extendedSearchNames', ['**/*.css']);
      atom.config.set('pigments.ignoredNames', ['project/vendor/**']);
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
      return waitsForPromise(function() {
        return project.initialize();
      });
    });
    return describe('when created with basic options', function() {
      beforeEach(function() {
        return search = project.findAllColors();
      });
      it('dispatches a did-complete-search when finalizing its search', function() {
        var spy;
        spy = jasmine.createSpy('did-complete-search');
        search.onDidCompleteSearch(spy);
        search.search();
        waitsFor(function() {
          return spy.callCount > 0;
        });
        return runs(function() {
          return expect(spy.argsForCall[0][0].length).toEqual(24);
        });
      });
      return it('dispatches a did-find-matches event for every file', function() {
        var completeSpy, findSpy;
        completeSpy = jasmine.createSpy('did-complete-search');
        findSpy = jasmine.createSpy('did-find-matches');
        search.onDidCompleteSearch(completeSpy);
        search.onDidFindMatches(findSpy);
        search.search();
        waitsFor(function() {
          return completeSpy.callCount > 0;
        });
        return runs(function() {
          expect(findSpy.callCount).toEqual(6);
          return expect(findSpy.argsForCall[0][0].matches.length).toEqual(3);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1zZWFyY2gtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLE9BQUEsQ0FBUSxvQkFBUixDQUFBLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLCtCQUFBO0FBQUEsSUFBQSxPQUE4QixFQUE5QixFQUFDLGdCQUFELEVBQVMsa0JBQVQsRUFBbUIsaUJBQW5CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsQ0FDdEMsV0FEc0MsRUFFdEMsV0FGc0MsQ0FBeEMsQ0FBQSxDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLEVBQWdELENBQzlDLFVBRDhDLENBQWhELENBSkEsQ0FBQTtBQUFBLE1BT0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxDQUN2QyxtQkFEdUMsQ0FBekMsQ0FQQSxDQUFBO0FBQUEsTUFXQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixVQUE5QixDQUF5QyxDQUFDLElBQTFDLENBQStDLFNBQUMsR0FBRCxHQUFBO0FBQ2hFLFVBQUEsUUFBQSxHQUFXLEdBQUcsQ0FBQyxVQUFmLENBQUE7aUJBQ0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxVQUFULENBQUEsRUFGc0Q7UUFBQSxDQUEvQyxFQUFIO01BQUEsQ0FBaEIsQ0FYQSxDQUFBO2FBZUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxPQUFPLENBQUMsVUFBUixDQUFBLEVBQUg7TUFBQSxDQUFoQixFQWhCUztJQUFBLENBQVgsQ0FGQSxDQUFBO1dBb0JBLFFBQUEsQ0FBUyxpQ0FBVCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsTUFBQSxHQUFTLE9BQU8sQ0FBQyxhQUFSLENBQUEsRUFEQTtNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFHQSxFQUFBLENBQUcsNkRBQUgsRUFBa0UsU0FBQSxHQUFBO0FBQ2hFLFlBQUEsR0FBQTtBQUFBLFFBQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxTQUFSLENBQWtCLHFCQUFsQixDQUFOLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixHQUEzQixDQURBLENBQUE7QUFBQSxRQUVBLE1BQU0sQ0FBQyxNQUFQLENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFHQSxRQUFBLENBQVMsU0FBQSxHQUFBO2lCQUFHLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLEVBQW5CO1FBQUEsQ0FBVCxDQUhBLENBQUE7ZUFJQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUFHLE1BQUEsQ0FBTyxHQUFHLENBQUMsV0FBWSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQTdCLENBQW9DLENBQUMsT0FBckMsQ0FBNkMsRUFBN0MsRUFBSDtRQUFBLENBQUwsRUFMZ0U7TUFBQSxDQUFsRSxDQUhBLENBQUE7YUFVQSxFQUFBLENBQUcsb0RBQUgsRUFBeUQsU0FBQSxHQUFBO0FBQ3ZELFlBQUEsb0JBQUE7QUFBQSxRQUFBLFdBQUEsR0FBYyxPQUFPLENBQUMsU0FBUixDQUFrQixxQkFBbEIsQ0FBZCxDQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVUsT0FBTyxDQUFDLFNBQVIsQ0FBa0Isa0JBQWxCLENBRFYsQ0FBQTtBQUFBLFFBRUEsTUFBTSxDQUFDLG1CQUFQLENBQTJCLFdBQTNCLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQXhCLENBSEEsQ0FBQTtBQUFBLFFBSUEsTUFBTSxDQUFDLE1BQVAsQ0FBQSxDQUpBLENBQUE7QUFBQSxRQUtBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7aUJBQUcsV0FBVyxDQUFDLFNBQVosR0FBd0IsRUFBM0I7UUFBQSxDQUFULENBTEEsQ0FBQTtlQU1BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLE1BQUEsQ0FBTyxPQUFPLENBQUMsU0FBZixDQUF5QixDQUFDLE9BQTFCLENBQWtDLENBQWxDLENBQUEsQ0FBQTtpQkFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLFdBQVksQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFPLENBQUMsTUFBekMsQ0FBZ0QsQ0FBQyxPQUFqRCxDQUF5RCxDQUF6RCxFQUZHO1FBQUEsQ0FBTCxFQVB1RDtNQUFBLENBQXpELEVBWDBDO0lBQUEsQ0FBNUMsRUFyQnNCO0VBQUEsQ0FBeEIsQ0FIQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-search-spec.coffee

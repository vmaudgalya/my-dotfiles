(function() {
  var ColorSearch, click;

  click = require('./helpers/events').click;

  ColorSearch = require('../lib/color-search');

  describe('ColorResultsElement', function() {
    var completeSpy, findSpy, pigments, project, resultsElement, search, _ref;
    _ref = [], search = _ref[0], resultsElement = _ref[1], pigments = _ref[2], project = _ref[3], completeSpy = _ref[4], findSpy = _ref[5];
    beforeEach(function() {
      atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
      waitsForPromise(function() {
        return project.initialize();
      });
      return runs(function() {
        search = project.findAllColors();
        spyOn(search, 'search').andCallThrough();
        completeSpy = jasmine.createSpy('did-complete-search');
        search.onDidCompleteSearch(completeSpy);
        resultsElement = atom.views.getView(search);
        return jasmine.attachToDOM(resultsElement);
      });
    });
    afterEach(function() {
      return waitsFor(function() {
        return completeSpy.callCount > 0;
      });
    });
    it('is associated with ColorSearch model', function() {
      return expect(resultsElement).toBeDefined();
    });
    it('starts the search', function() {
      return expect(search.search).toHaveBeenCalled();
    });
    return describe('when matches are found', function() {
      beforeEach(function() {
        return waitsFor(function() {
          return completeSpy.callCount > 0;
        });
      });
      it('groups results by files', function() {
        var fileResults;
        fileResults = resultsElement.querySelectorAll('.list-nested-item');
        expect(fileResults.length).toEqual(8);
        return expect(fileResults[0].querySelectorAll('li.list-item').length).toEqual(3);
      });
      describe('when a file item is clicked', function() {
        var fileItem;
        fileItem = [][0];
        beforeEach(function() {
          fileItem = resultsElement.querySelector('.list-nested-item > .list-item');
          return click(fileItem);
        });
        return it('collapses the file matches', function() {
          return expect(resultsElement.querySelector('.list-nested-item.collapsed')).toExist();
        });
      });
      return describe('when a matches item is clicked', function() {
        var matchItem, spy, _ref1;
        _ref1 = [], matchItem = _ref1[0], spy = _ref1[1];
        beforeEach(function() {
          spy = jasmine.createSpy('did-add-text-editor');
          atom.workspace.onDidAddTextEditor(spy);
          matchItem = resultsElement.querySelector('.search-result.list-item');
          click(matchItem);
          return waitsFor(function() {
            return spy.callCount > 0;
          });
        });
        return it('opens the file', function() {
          var textEditor;
          expect(spy).toHaveBeenCalled();
          textEditor = spy.argsForCall[0][0].textEditor;
          return expect(textEditor.getSelectedBufferRange()).toEqual([[1, 13], [1, 23]]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1yZXN1bHRzLWVsZW1lbnQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxrQkFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixRQUFBLHFFQUFBO0FBQUEsSUFBQSxPQUFvRSxFQUFwRSxFQUFDLGdCQUFELEVBQVMsd0JBQVQsRUFBeUIsa0JBQXpCLEVBQW1DLGlCQUFuQyxFQUE0QyxxQkFBNUMsRUFBeUQsaUJBQXpELENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsQ0FDdEMsV0FEc0MsRUFFdEMsV0FGc0MsQ0FBeEMsQ0FBQSxDQUFBO0FBQUEsTUFLQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixVQUE5QixDQUF5QyxDQUFDLElBQTFDLENBQStDLFNBQUMsR0FBRCxHQUFBO0FBQ2hFLFVBQUEsUUFBQSxHQUFXLEdBQUcsQ0FBQyxVQUFmLENBQUE7aUJBQ0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxVQUFULENBQUEsRUFGc0Q7UUFBQSxDQUEvQyxFQUFIO01BQUEsQ0FBaEIsQ0FMQSxDQUFBO0FBQUEsTUFTQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLE9BQU8sQ0FBQyxVQUFSLENBQUEsRUFBSDtNQUFBLENBQWhCLENBVEEsQ0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-results-element-spec.coffee

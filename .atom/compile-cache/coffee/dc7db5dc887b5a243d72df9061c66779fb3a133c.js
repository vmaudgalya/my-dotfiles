(function() {
  var change;

  change = require('./helpers/events').change;

  describe('ColorProjectElement', function() {
    var pigments, project, projectElement, _ref;
    _ref = [], pigments = _ref[0], project = _ref[1], projectElement = _ref[2];
    beforeEach(function() {
      var jasmineContent;
      jasmineContent = document.body.querySelector('#jasmine-content');
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          project = pigments.getProject();
          projectElement = atom.views.getView(project);
          return jasmineContent.appendChild(projectElement);
        });
      });
    });
    it('is bound to the ColorProject model', function() {
      return expect(projectElement).toExist();
    });
    describe('typing in the sourceNames input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setSourceNames');
        projectElement.sourceNames.getModel().setText('foo, bar');
        projectElement.sourceNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSourceNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the supportedFiletypes input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setSupportedFiletypes');
        projectElement.supportedFiletypes.getModel().setText('foo, bar');
        projectElement.supportedFiletypes.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSupportedFiletypes).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the searchNames input', function() {
      return it('update the search names in the project', function() {
        spyOn(project, 'setSearchNames');
        projectElement.searchNames.getModel().setText('foo, bar');
        projectElement.searchNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSearchNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the ignoredNames input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoredNames');
        projectElement.ignoredNames.getModel().setText('foo, bar');
        projectElement.ignoredNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setIgnoredNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the ignoredScopes input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoredScopes');
        projectElement.ignoredScopes.getModel().setText('foo, bar');
        projectElement.ignoredScopes.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setIgnoredScopes).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('toggling on the includeThemes checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIncludeThemes');
        projectElement.includeThemes.checked = true;
        change(projectElement.includeThemes);
        expect(project.setIncludeThemes).toHaveBeenCalledWith(true);
        projectElement.includeThemes.checked = false;
        change(projectElement.includeThemes);
        return expect(project.setIncludeThemes).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalSourceNames checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSourceNames');
        projectElement.ignoreGlobalSourceNames.checked = true;
        change(projectElement.ignoreGlobalSourceNames);
        expect(project.setIgnoreGlobalSourceNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSourceNames.checked = false;
        change(projectElement.ignoreGlobalSourceNames);
        return expect(project.setIgnoreGlobalSourceNames).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalSupportedFiletypes checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSupportedFiletypes');
        projectElement.ignoreGlobalSupportedFiletypes.checked = true;
        change(projectElement.ignoreGlobalSupportedFiletypes);
        expect(project.setIgnoreGlobalSupportedFiletypes).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSupportedFiletypes.checked = false;
        change(projectElement.ignoreGlobalSupportedFiletypes);
        return expect(project.setIgnoreGlobalSupportedFiletypes).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalIgnoredNames checkbox', function() {
      return it('update the ignored names in the project', function() {
        spyOn(project, 'setIgnoreGlobalIgnoredNames');
        projectElement.ignoreGlobalIgnoredNames.checked = true;
        change(projectElement.ignoreGlobalIgnoredNames);
        expect(project.setIgnoreGlobalIgnoredNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalIgnoredNames.checked = false;
        change(projectElement.ignoreGlobalIgnoredNames);
        return expect(project.setIgnoreGlobalIgnoredNames).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalIgnoredScopes checkbox', function() {
      return it('update the ignored scopes in the project', function() {
        spyOn(project, 'setIgnoreGlobalIgnoredScopes');
        projectElement.ignoreGlobalIgnoredScopes.checked = true;
        change(projectElement.ignoreGlobalIgnoredScopes);
        expect(project.setIgnoreGlobalIgnoredScopes).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalIgnoredScopes.checked = false;
        change(projectElement.ignoreGlobalIgnoredScopes);
        return expect(project.setIgnoreGlobalIgnoredScopes).toHaveBeenCalledWith(false);
      });
    });
    return describe('toggling on the ignoreGlobalSearchNames checkbox', function() {
      return it('update the search names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSearchNames');
        projectElement.ignoreGlobalSearchNames.checked = true;
        change(projectElement.ignoreGlobalSearchNames);
        expect(project.setIgnoreGlobalSearchNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSearchNames.checked = false;
        change(projectElement.ignoreGlobalSearchNames);
        return expect(project.setIgnoreGlobalSearchNames).toHaveBeenCalledWith(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1wcm9qZWN0LWVsZW1lbnQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFDLFNBQVUsT0FBQSxDQUFRLGtCQUFSLEVBQVYsTUFBRCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixRQUFBLHVDQUFBO0FBQUEsSUFBQSxPQUFzQyxFQUF0QyxFQUFDLGtCQUFELEVBQVcsaUJBQVgsRUFBb0Isd0JBQXBCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGNBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFkLENBQTRCLGtCQUE1QixDQUFqQixDQUFBO2FBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsVUFBOUIsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxTQUFDLEdBQUQsR0FBQTtBQUNoRSxVQUFBLFFBQUEsR0FBVyxHQUFHLENBQUMsVUFBZixDQUFBO0FBQUEsVUFDQSxPQUFBLEdBQVUsUUFBUSxDQUFDLFVBQVQsQ0FBQSxDQURWLENBQUE7QUFBQSxVQUVBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE9BQW5CLENBRmpCLENBQUE7aUJBR0EsY0FBYyxDQUFDLFdBQWYsQ0FBMkIsY0FBM0IsRUFKZ0U7UUFBQSxDQUEvQyxFQUFIO01BQUEsQ0FBaEIsRUFIUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFXQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO2FBQ3ZDLE1B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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-project-element-spec.coffee

(function() {
  var Minimap;

  require('./helpers/workspace');

  Minimap = require('../lib/minimap');

  describe('Minimap package', function() {
    var editor, editorElement, minimap, minimapElement, minimapPackage, workspaceElement, _ref;
    _ref = [], editor = _ref[0], minimap = _ref[1], editorElement = _ref[2], minimapElement = _ref[3], workspaceElement = _ref[4], minimapPackage = _ref[5];
    beforeEach(function() {
      atom.config.set('minimap.autoToggle', true);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.workspace.open('sample.coffee');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('minimap').then(function(pkg) {
          return minimapPackage = pkg.mainModule;
        });
      });
      waitsFor(function() {
        return workspaceElement.querySelector('atom-text-editor');
      });
      runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        return editorElement = atom.views.getView(editor);
      });
      return waitsFor(function() {
        return workspaceElement.querySelector('atom-text-editor::shadow atom-text-editor-minimap');
      });
    });
    it('registers the minimap views provider', function() {
      var textEditor;
      textEditor = atom.workspace.buildTextEditor({});
      minimap = new Minimap({
        textEditor: textEditor
      });
      minimapElement = atom.views.getView(minimap);
      return expect(minimapElement).toExist();
    });
    describe('when an editor is opened', function() {
      it('creates a minimap model for the editor', function() {
        return expect(minimapPackage.minimapForEditor(editor)).toBeDefined();
      });
      return it('attaches a minimap element to the editor view', function() {
        return expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).toExist();
      });
    });
    describe('::observeMinimaps', function() {
      var spy;
      spy = [][0];
      beforeEach(function() {
        spy = jasmine.createSpy('observeMinimaps');
        return minimapPackage.observeMinimaps(spy);
      });
      it('calls the callback with the existing minimaps', function() {
        return expect(spy).toHaveBeenCalled();
      });
      return it('calls the callback when a new editor is opened', function() {
        waitsForPromise(function() {
          return atom.workspace.open('other-sample.js');
        });
        return runs(function() {
          return expect(spy.calls.length).toEqual(2);
        });
      });
    });
    describe('::deactivate', function() {
      beforeEach(function() {
        return minimapPackage.deactivate();
      });
      it('destroys all the minimap models', function() {
        return expect(minimapPackage.editorsMinimaps).toBeUndefined();
      });
      return it('destroys all the minimap elements', function() {
        return expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).not.toExist();
      });
    });
    describe('service', function() {
      it('returns the minimap main module', function() {
        return expect(minimapPackage.provideMinimapServiceV1()).toEqual(minimapPackage);
      });
      return it('creates standalone minimap with provided text editor', function() {
        var standaloneMinimap, textEditor;
        textEditor = atom.workspace.buildTextEditor({});
        standaloneMinimap = minimapPackage.standAloneMinimapForEditor(textEditor);
        return expect(standaloneMinimap.getTextEditor()).toEqual(textEditor);
      });
    });
    return describe('plugins', function() {
      var plugin, registerHandler, unregisterHandler, _ref1;
      _ref1 = [], registerHandler = _ref1[0], unregisterHandler = _ref1[1], plugin = _ref1[2];
      beforeEach(function() {
        atom.config.set('minimap.displayPluginsControls', true);
        atom.config.set('minimap.plugins.dummy', void 0);
        plugin = {
          active: false,
          activatePlugin: function() {
            return this.active = true;
          },
          deactivatePlugin: function() {
            return this.active = false;
          },
          isActive: function() {
            return this.active;
          }
        };
        spyOn(plugin, 'activatePlugin').andCallThrough();
        spyOn(plugin, 'deactivatePlugin').andCallThrough();
        registerHandler = jasmine.createSpy('register handler');
        return unregisterHandler = jasmine.createSpy('unregister handler');
      });
      describe('when registered', function() {
        beforeEach(function() {
          minimapPackage.onDidAddPlugin(registerHandler);
          return minimapPackage.registerPlugin('dummy', plugin);
        });
        it('makes the plugin available in the minimap', function() {
          return expect(minimapPackage.plugins['dummy']).toBe(plugin);
        });
        it('emits an event', function() {
          return expect(registerHandler).toHaveBeenCalled();
        });
        it('creates a default config for the plugin', function() {
          return expect(minimapPackage.config.plugins.properties.dummy).toBeDefined();
        });
        it('sets the corresponding config', function() {
          return expect(atom.config.get('minimap.plugins.dummy')).toBeTruthy();
        });
        describe('triggering the corresponding plugin command', function() {
          beforeEach(function() {
            return atom.commands.dispatch(workspaceElement, 'minimap:toggle-dummy');
          });
          return it('receives a deactivation call', function() {
            return expect(plugin.deactivatePlugin).toHaveBeenCalled();
          });
        });
        describe('and then unregistered', function() {
          beforeEach(function() {
            return minimapPackage.unregisterPlugin('dummy');
          });
          it('has been unregistered', function() {
            return expect(minimapPackage.plugins['dummy']).toBeUndefined();
          });
          return describe('when the config is modified', function() {
            beforeEach(function() {
              return atom.config.set('minimap.plugins.dummy', false);
            });
            return it('does not activates the plugin', function() {
              return expect(plugin.deactivatePlugin).not.toHaveBeenCalled();
            });
          });
        });
        return describe('on minimap deactivation', function() {
          beforeEach(function() {
            expect(plugin.active).toBeTruthy();
            return minimapPackage.deactivate();
          });
          return it('deactivates all the plugins', function() {
            return expect(plugin.active).toBeFalsy();
          });
        });
      });
      describe('when the config for it is false', function() {
        beforeEach(function() {
          atom.config.set('minimap.plugins.dummy', false);
          return minimapPackage.registerPlugin('dummy', plugin);
        });
        return it('does not receive an activation call', function() {
          return expect(plugin.activatePlugin).not.toHaveBeenCalled();
        });
      });
      return describe('the registered plugin', function() {
        beforeEach(function() {
          return minimapPackage.registerPlugin('dummy', plugin);
        });
        it('receives an activation call', function() {
          return expect(plugin.activatePlugin).toHaveBeenCalled();
        });
        it('activates the plugin', function() {
          return expect(plugin.active).toBeTruthy();
        });
        return describe('when the config is modified after registration', function() {
          beforeEach(function() {
            return atom.config.set('minimap.plugins.dummy', false);
          });
          return it('receives a deactivation call', function() {
            return expect(plugin.deactivatePlugin).toHaveBeenCalled();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL21pbmltYXAtbWFpbi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxPQUFBOztBQUFBLEVBQUEsT0FBQSxDQUFRLHFCQUFSLENBQUEsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLHNGQUFBO0FBQUEsSUFBQSxPQUFxRixFQUFyRixFQUFDLGdCQUFELEVBQVMsaUJBQVQsRUFBa0IsdUJBQWxCLEVBQWlDLHdCQUFqQyxFQUFpRCwwQkFBakQsRUFBbUUsd0JBQW5FLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsRUFBc0MsSUFBdEMsQ0FBQSxDQUFBO0FBQUEsTUFFQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBRm5CLENBQUE7QUFBQSxNQUdBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUhBLENBQUE7QUFBQSxNQUtBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGVBQXBCLEVBRGM7TUFBQSxDQUFoQixDQUxBLENBQUE7QUFBQSxNQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFNBQTlCLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsU0FBQyxHQUFELEdBQUE7aUJBQzVDLGNBQUEsR0FBaUIsR0FBRyxDQUFDLFdBRHVCO1FBQUEsQ0FBOUMsRUFEYztNQUFBLENBQWhCLENBUkEsQ0FBQTtBQUFBLE1BWUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtlQUFHLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGtCQUEvQixFQUFIO01BQUEsQ0FBVCxDQVpBLENBQUE7QUFBQSxNQWFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO2VBQ0EsYUFBQSxHQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsRUFGYjtNQUFBLENBQUwsQ0FiQSxDQUFBO2FBaUJBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7ZUFDUCxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixtREFBL0IsRUFETztNQUFBLENBQVQsRUFsQlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBdUJBLEVBQUEsQ0FBRyxzQ0FBSCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQStCLEVBQS9CLENBQWIsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRO0FBQUEsUUFBQyxZQUFBLFVBQUQ7T0FBUixDQURkLENBQUE7QUFBQSxNQUVBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE9BQW5CLENBRmpCLENBQUE7YUFJQSxNQUFBLENBQU8sY0FBUCxDQUFzQixDQUFDLE9BQXZCLENBQUEsRUFMeUM7SUFBQSxDQUEzQyxDQXZCQSxDQUFBO0FBQUEsSUE4QkEsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxNQUFBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBLEdBQUE7ZUFDM0MsTUFBQSxDQUFPLGNBQWMsQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUFQLENBQStDLENBQUMsV0FBaEQsQ0FBQSxFQUQyQztNQUFBLENBQTdDLENBQUEsQ0FBQTthQUdBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7ZUFDbEQsTUFBQSxDQUFPLGFBQWEsQ0FBQyxVQUFVLENBQUMsYUFBekIsQ0FBdUMsMEJBQXZDLENBQVAsQ0FBMEUsQ0FBQyxPQUEzRSxDQUFBLEVBRGtEO01BQUEsQ0FBcEQsRUFKbUM7SUFBQSxDQUFyQyxDQTlCQSxDQUFBO0FBQUEsSUFxQ0EsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixVQUFBLEdBQUE7QUFBQSxNQUFDLE1BQU8sS0FBUixDQUFBO0FBQUEsTUFDQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFNBQVIsQ0FBa0IsaUJBQWxCLENBQU4sQ0FBQTtlQUNBLGNBQWMsQ0FBQyxlQUFmLENBQStCLEdBQS9CLEVBRlM7TUFBQSxDQUFYLENBREEsQ0FBQTtBQUFBLE1BS0EsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtlQUNsRCxNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsZ0JBQVosQ0FBQSxFQURrRDtNQUFBLENBQXBELENBTEEsQ0FBQTthQVFBLEVBQUEsQ0FBRyxnREFBSCxFQUFxRCxTQUFBLEdBQUE7QUFDbkQsUUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsaUJBQXBCLEVBQUg7UUFBQSxDQUFoQixDQUFBLENBQUE7ZUFFQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUFHLE1BQUEsQ0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQWpCLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsQ0FBakMsRUFBSDtRQUFBLENBQUwsRUFIbUQ7TUFBQSxDQUFyRCxFQVQ0QjtJQUFBLENBQTlCLENBckNBLENBQUE7QUFBQSxJQW1EQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsY0FBYyxDQUFDLFVBQWYsQ0FBQSxFQURTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUdBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7ZUFDcEMsTUFBQSxDQUFPLGNBQWMsQ0FBQyxlQUF0QixDQUFzQyxDQUFDLGFBQXZDLENBQUEsRUFEb0M7TUFBQSxDQUF0QyxDQUhBLENBQUE7YUFNQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO2VBQ3RDLE1BQUEsQ0FBTyxhQUFhLENBQUMsVUFBVSxDQUFDLGFBQXpCLENBQXVDLDBCQUF2QyxDQUFQLENBQTBFLENBQUMsR0FBRyxDQUFDLE9BQS9FLENBQUEsRUFEc0M7TUFBQSxDQUF4QyxFQVB1QjtJQUFBLENBQXpCLENBbkRBLENBQUE7QUFBQSxJQXFFQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsTUFBQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO2VBQ3BDLE1BQUEsQ0FBTyxjQUFjLENBQUMsdUJBQWYsQ0FBQSxDQUFQLENBQWdELENBQUMsT0FBakQsQ0FBeUQsY0FBekQsRUFEb0M7TUFBQSxDQUF0QyxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcsc0RBQUgsRUFBMkQsU0FBQSxHQUFBO0FBQ3pELFlBQUEsNkJBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBK0IsRUFBL0IsQ0FBYixDQUFBO0FBQUEsUUFDQSxpQkFBQSxHQUFvQixjQUFjLENBQUMsMEJBQWYsQ0FBMEMsVUFBMUMsQ0FEcEIsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxpQkFBaUIsQ0FBQyxhQUFsQixDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxVQUFsRCxFQUh5RDtNQUFBLENBQTNELEVBSmtCO0lBQUEsQ0FBcEIsQ0FyRUEsQ0FBQTtXQThFQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsVUFBQSxpREFBQTtBQUFBLE1BQUEsUUFBK0MsRUFBL0MsRUFBQywwQkFBRCxFQUFrQiw0QkFBbEIsRUFBcUMsaUJBQXJDLENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFBa0QsSUFBbEQsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLE1BQXpDLENBREEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxHQUNFO0FBQUEsVUFBQSxNQUFBLEVBQVEsS0FBUjtBQUFBLFVBQ0EsY0FBQSxFQUFnQixTQUFBLEdBQUE7bUJBQUcsSUFBQyxDQUFBLE1BQUQsR0FBVSxLQUFiO1VBQUEsQ0FEaEI7QUFBQSxVQUVBLGdCQUFBLEVBQWtCLFNBQUEsR0FBQTttQkFBRyxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQWI7VUFBQSxDQUZsQjtBQUFBLFVBR0EsUUFBQSxFQUFVLFNBQUEsR0FBQTttQkFBRyxJQUFDLENBQUEsT0FBSjtVQUFBLENBSFY7U0FKRixDQUFBO0FBQUEsUUFTQSxLQUFBLENBQU0sTUFBTixFQUFjLGdCQUFkLENBQStCLENBQUMsY0FBaEMsQ0FBQSxDQVRBLENBQUE7QUFBQSxRQVVBLEtBQUEsQ0FBTSxNQUFOLEVBQWMsa0JBQWQsQ0FBaUMsQ0FBQyxjQUFsQyxDQUFBLENBVkEsQ0FBQTtBQUFBLFFBWUEsZUFBQSxHQUFrQixPQUFPLENBQUMsU0FBUixDQUFrQixrQkFBbEIsQ0FabEIsQ0FBQTtlQWFBLGlCQUFBLEdBQW9CLE9BQU8sQ0FBQyxTQUFSLENBQWtCLG9CQUFsQixFQWRYO01BQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxNQWtCQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsY0FBYyxDQUFDLGNBQWYsQ0FBOEIsZUFBOUIsQ0FBQSxDQUFBO2lCQUNBLGNBQWMsQ0FBQyxjQUFmLENBQThCLE9BQTlCLEVBQXVDLE1BQXZDLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBSUEsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtpQkFDOUMsTUFBQSxDQUFPLGNBQWMsQ0FBQyxPQUFRLENBQUEsT0FBQSxDQUE5QixDQUF1QyxDQUFDLElBQXhDLENBQTZDLE1BQTdDLEVBRDhDO1FBQUEsQ0FBaEQsQ0FKQSxDQUFBO0FBQUEsUUFPQSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQSxHQUFBO2lCQUNuQixNQUFBLENBQU8sZUFBUCxDQUF1QixDQUFDLGdCQUF4QixDQUFBLEVBRG1CO1FBQUEsQ0FBckIsQ0FQQSxDQUFBO0FBQUEsUUFVQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO2lCQUM1QyxNQUFBLENBQU8sY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQWhELENBQXNELENBQUMsV0FBdkQsQ0FBQSxFQUQ0QztRQUFBLENBQTlDLENBVkEsQ0FBQTtBQUFBLFFBYUEsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtpQkFDbEMsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBUCxDQUErQyxDQUFDLFVBQWhELENBQUEsRUFEa0M7UUFBQSxDQUFwQyxDQWJBLENBQUE7QUFBQSxRQWdCQSxRQUFBLENBQVMsNkNBQVQsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTttQkFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHNCQUF6QyxFQURTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBR0EsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTttQkFDakMsTUFBQSxDQUFPLE1BQU0sQ0FBQyxnQkFBZCxDQUErQixDQUFDLGdCQUFoQyxDQUFBLEVBRGlDO1VBQUEsQ0FBbkMsRUFKc0Q7UUFBQSxDQUF4RCxDQWhCQSxDQUFBO0FBQUEsUUF1QkEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQ1QsY0FBYyxDQUFDLGdCQUFmLENBQWdDLE9BQWhDLEVBRFM7VUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFVBR0EsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTttQkFDMUIsTUFBQSxDQUFPLGNBQWMsQ0FBQyxPQUFRLENBQUEsT0FBQSxDQUE5QixDQUF1QyxDQUFDLGFBQXhDLENBQUEsRUFEMEI7VUFBQSxDQUE1QixDQUhBLENBQUE7aUJBTUEsUUFBQSxDQUFTLDZCQUFULEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxZQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7cUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxLQUF6QyxFQURTO1lBQUEsQ0FBWCxDQUFBLENBQUE7bUJBR0EsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtxQkFDbEMsTUFBQSxDQUFPLE1BQU0sQ0FBQyxnQkFBZCxDQUErQixDQUFDLEdBQUcsQ0FBQyxnQkFBcEMsQ0FBQSxFQURrQztZQUFBLENBQXBDLEVBSnNDO1VBQUEsQ0FBeEMsRUFQZ0M7UUFBQSxDQUFsQyxDQXZCQSxDQUFBO2VBcUNBLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE1BQWQsQ0FBcUIsQ0FBQyxVQUF0QixDQUFBLENBQUEsQ0FBQTttQkFDQSxjQUFjLENBQUMsVUFBZixDQUFBLEVBRlM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFJQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO21CQUNoQyxNQUFBLENBQU8sTUFBTSxDQUFDLE1BQWQsQ0FBcUIsQ0FBQyxTQUF0QixDQUFBLEVBRGdDO1VBQUEsQ0FBbEMsRUFMa0M7UUFBQSxDQUFwQyxFQXRDMEI7TUFBQSxDQUE1QixDQWxCQSxDQUFBO0FBQUEsTUFnRUEsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsS0FBekMsQ0FBQSxDQUFBO2lCQUNBLGNBQWMsQ0FBQyxjQUFmLENBQThCLE9BQTlCLEVBQXVDLE1BQXZDLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUlBLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7aUJBQ3hDLE1BQUEsQ0FBTyxNQUFNLENBQUMsY0FBZCxDQUE2QixDQUFDLEdBQUcsQ0FBQyxnQkFBbEMsQ0FBQSxFQUR3QztRQUFBLENBQTFDLEVBTDBDO01BQUEsQ0FBNUMsQ0FoRUEsQ0FBQTthQXdFQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxjQUFjLENBQUMsY0FBZixDQUE4QixPQUE5QixFQUF1QyxNQUF2QyxFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUdBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7aUJBQ2hDLE1BQUEsQ0FBTyxNQUFNLENBQUMsY0FBZCxDQUE2QixDQUFDLGdCQUE5QixDQUFBLEVBRGdDO1FBQUEsQ0FBbEMsQ0FIQSxDQUFBO0FBQUEsUUFNQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO2lCQUN6QixNQUFBLENBQU8sTUFBTSxDQUFDLE1BQWQsQ0FBcUIsQ0FBQyxVQUF0QixDQUFBLEVBRHlCO1FBQUEsQ0FBM0IsQ0FOQSxDQUFBO2VBU0EsUUFBQSxDQUFTLGdEQUFULEVBQTJELFNBQUEsR0FBQTtBQUN6RCxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxLQUF6QyxFQURTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBR0EsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTttQkFDakMsTUFBQSxDQUFPLE1BQU0sQ0FBQyxnQkFBZCxDQUErQixDQUFDLGdCQUFoQyxDQUFBLEVBRGlDO1VBQUEsQ0FBbkMsRUFKeUQ7UUFBQSxDQUEzRCxFQVZnQztNQUFBLENBQWxDLEVBekVrQjtJQUFBLENBQXBCLEVBL0UwQjtFQUFBLENBQTVCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/minimap-main-spec.coffee

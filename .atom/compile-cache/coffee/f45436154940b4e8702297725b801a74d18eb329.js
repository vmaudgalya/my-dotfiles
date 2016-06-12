(function() {
  var Minimap, TextEditor;

  TextEditor = require('atom').TextEditor;

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
      textEditor = new TextEditor({});
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
        textEditor = new TextEditor({});
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL21pbmltYXAtbWFpbi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGdCQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSxzRkFBQTtBQUFBLElBQUEsT0FBcUYsRUFBckYsRUFBQyxnQkFBRCxFQUFTLGlCQUFULEVBQWtCLHVCQUFsQixFQUFpQyx3QkFBakMsRUFBaUQsMEJBQWpELEVBQW1FLHdCQUFuRSxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDLElBQXRDLENBQUEsQ0FBQTtBQUFBLE1BRUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUZuQixDQUFBO0FBQUEsTUFHQSxPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEIsQ0FIQSxDQUFBO0FBQUEsTUFLQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixlQUFwQixFQURjO01BQUEsQ0FBaEIsQ0FMQSxDQUFBO0FBQUEsTUFRQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixTQUE5QixDQUF3QyxDQUFDLElBQXpDLENBQThDLFNBQUMsR0FBRCxHQUFBO2lCQUM1QyxjQUFBLEdBQWlCLEdBQUcsQ0FBQyxXQUR1QjtRQUFBLENBQTlDLEVBRGM7TUFBQSxDQUFoQixDQVJBLENBQUE7QUFBQSxNQVlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7ZUFBRyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixrQkFBL0IsRUFBSDtNQUFBLENBQVQsQ0FaQSxDQUFBO0FBQUEsTUFhQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtlQUNBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLEVBRmI7TUFBQSxDQUFMLENBYkEsQ0FBQTthQWlCQSxRQUFBLENBQVMsU0FBQSxHQUFBO2VBQ1AsZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsbURBQS9CLEVBRE87TUFBQSxDQUFULEVBbEJTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQXVCQSxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBVyxFQUFYLENBQWpCLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBUTtBQUFBLFFBQUMsWUFBQSxVQUFEO09BQVIsQ0FEZCxDQUFBO0FBQUEsTUFFQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixPQUFuQixDQUZqQixDQUFBO2FBSUEsTUFBQSxDQUFPLGNBQVAsQ0FBc0IsQ0FBQyxPQUF2QixDQUFBLEVBTHlDO0lBQUEsQ0FBM0MsQ0F2QkEsQ0FBQTtBQUFBLElBOEJBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsTUFBQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQSxHQUFBO2VBQzNDLE1BQUEsQ0FBTyxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBUCxDQUErQyxDQUFDLFdBQWhELENBQUEsRUFEMkM7TUFBQSxDQUE3QyxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO2VBQ2xELE1BQUEsQ0FBTyxhQUFhLENBQUMsVUFBVSxDQUFDLGFBQXpCLENBQXVDLDBCQUF2QyxDQUFQLENBQTBFLENBQUMsT0FBM0UsQ0FBQSxFQURrRDtNQUFBLENBQXBELEVBSm1DO0lBQUEsQ0FBckMsQ0E5QkEsQ0FBQTtBQUFBLElBcUNBLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsVUFBQSxHQUFBO0FBQUEsTUFBQyxNQUFPLEtBQVIsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxTQUFSLENBQWtCLGlCQUFsQixDQUFOLENBQUE7ZUFDQSxjQUFjLENBQUMsZUFBZixDQUErQixHQUEvQixFQUZTO01BQUEsQ0FBWCxDQURBLENBQUE7QUFBQSxNQUtBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7ZUFDbEQsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLGdCQUFaLENBQUEsRUFEa0Q7TUFBQSxDQUFwRCxDQUxBLENBQUE7YUFRQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFFBQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGlCQUFwQixFQUFIO1FBQUEsQ0FBaEIsQ0FBQSxDQUFBO2VBRUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFBRyxNQUFBLENBQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFqQixDQUF3QixDQUFDLE9BQXpCLENBQWlDLENBQWpDLEVBQUg7UUFBQSxDQUFMLEVBSG1EO01BQUEsQ0FBckQsRUFUNEI7SUFBQSxDQUE5QixDQXJDQSxDQUFBO0FBQUEsSUFtREEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGNBQWMsQ0FBQyxVQUFmLENBQUEsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFHQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO2VBQ3BDLE1BQUEsQ0FBTyxjQUFjLENBQUMsZUFBdEIsQ0FBc0MsQ0FBQyxhQUF2QyxDQUFBLEVBRG9DO01BQUEsQ0FBdEMsQ0FIQSxDQUFBO2FBTUEsRUFBQSxDQUFHLG1DQUFILEVBQXdDLFNBQUEsR0FBQTtlQUN0QyxNQUFBLENBQU8sYUFBYSxDQUFDLFVBQVUsQ0FBQyxhQUF6QixDQUF1QywwQkFBdkMsQ0FBUCxDQUEwRSxDQUFDLEdBQUcsQ0FBQyxPQUEvRSxDQUFBLEVBRHNDO01BQUEsQ0FBeEMsRUFQdUI7SUFBQSxDQUF6QixDQW5EQSxDQUFBO0FBQUEsSUFxRUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLE1BQUEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtlQUNwQyxNQUFBLENBQU8sY0FBYyxDQUFDLHVCQUFmLENBQUEsQ0FBUCxDQUFnRCxDQUFDLE9BQWpELENBQXlELGNBQXpELEVBRG9DO01BQUEsQ0FBdEMsQ0FBQSxDQUFBO2FBR0EsRUFBQSxDQUFHLHNEQUFILEVBQTJELFNBQUEsR0FBQTtBQUN6RCxZQUFBLDZCQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFXLEVBQVgsQ0FBakIsQ0FBQTtBQUFBLFFBQ0EsaUJBQUEsR0FBb0IsY0FBYyxDQUFDLDBCQUFmLENBQTBDLFVBQTFDLENBRHBCLENBQUE7ZUFFQSxNQUFBLENBQU8saUJBQWlCLENBQUMsYUFBbEIsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsVUFBbEQsRUFIeUQ7TUFBQSxDQUEzRCxFQUprQjtJQUFBLENBQXBCLENBckVBLENBQUE7V0E4RUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFVBQUEsaURBQUE7QUFBQSxNQUFBLFFBQStDLEVBQS9DLEVBQUMsMEJBQUQsRUFBa0IsNEJBQWxCLEVBQXFDLGlCQUFyQyxDQUFBO0FBQUEsTUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLEVBQWtELElBQWxELENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxNQUF6QyxDQURBLENBQUE7QUFBQSxRQUdBLE1BQUEsR0FDRTtBQUFBLFVBQUEsTUFBQSxFQUFRLEtBQVI7QUFBQSxVQUNBLGNBQUEsRUFBZ0IsU0FBQSxHQUFBO21CQUFHLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FBYjtVQUFBLENBRGhCO0FBQUEsVUFFQSxnQkFBQSxFQUFrQixTQUFBLEdBQUE7bUJBQUcsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFiO1VBQUEsQ0FGbEI7QUFBQSxVQUdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7bUJBQUcsSUFBQyxDQUFBLE9BQUo7VUFBQSxDQUhWO1NBSkYsQ0FBQTtBQUFBLFFBU0EsS0FBQSxDQUFNLE1BQU4sRUFBYyxnQkFBZCxDQUErQixDQUFDLGNBQWhDLENBQUEsQ0FUQSxDQUFBO0FBQUEsUUFVQSxLQUFBLENBQU0sTUFBTixFQUFjLGtCQUFkLENBQWlDLENBQUMsY0FBbEMsQ0FBQSxDQVZBLENBQUE7QUFBQSxRQVlBLGVBQUEsR0FBa0IsT0FBTyxDQUFDLFNBQVIsQ0FBa0Isa0JBQWxCLENBWmxCLENBQUE7ZUFhQSxpQkFBQSxHQUFvQixPQUFPLENBQUMsU0FBUixDQUFrQixvQkFBbEIsRUFkWDtNQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsTUFrQkEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGNBQWMsQ0FBQyxjQUFmLENBQThCLGVBQTlCLENBQUEsQ0FBQTtpQkFDQSxjQUFjLENBQUMsY0FBZixDQUE4QixPQUE5QixFQUF1QyxNQUF2QyxFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7aUJBQzlDLE1BQUEsQ0FBTyxjQUFjLENBQUMsT0FBUSxDQUFBLE9BQUEsQ0FBOUIsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxNQUE3QyxFQUQ4QztRQUFBLENBQWhELENBSkEsQ0FBQTtBQUFBLFFBT0EsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUEsR0FBQTtpQkFDbkIsTUFBQSxDQUFPLGVBQVAsQ0FBdUIsQ0FBQyxnQkFBeEIsQ0FBQSxFQURtQjtRQUFBLENBQXJCLENBUEEsQ0FBQTtBQUFBLFFBVUEsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtpQkFDNUMsTUFBQSxDQUFPLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFoRCxDQUFzRCxDQUFDLFdBQXZELENBQUEsRUFENEM7UUFBQSxDQUE5QyxDQVZBLENBQUE7QUFBQSxRQWFBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7aUJBQ2xDLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQVAsQ0FBK0MsQ0FBQyxVQUFoRCxDQUFBLEVBRGtDO1FBQUEsQ0FBcEMsQ0FiQSxDQUFBO0FBQUEsUUFnQkEsUUFBQSxDQUFTLDZDQUFULEVBQXdELFNBQUEsR0FBQTtBQUN0RCxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxzQkFBekMsRUFEUztVQUFBLENBQVgsQ0FBQSxDQUFBO2lCQUdBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7bUJBQ2pDLE1BQUEsQ0FBTyxNQUFNLENBQUMsZ0JBQWQsQ0FBK0IsQ0FBQyxnQkFBaEMsQ0FBQSxFQURpQztVQUFBLENBQW5DLEVBSnNEO1FBQUEsQ0FBeEQsQ0FoQkEsQ0FBQTtBQUFBLFFBdUJBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO21CQUNULGNBQWMsQ0FBQyxnQkFBZixDQUFnQyxPQUFoQyxFQURTO1VBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxVQUdBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7bUJBQzFCLE1BQUEsQ0FBTyxjQUFjLENBQUMsT0FBUSxDQUFBLE9BQUEsQ0FBOUIsQ0FBdUMsQ0FBQyxhQUF4QyxDQUFBLEVBRDBCO1VBQUEsQ0FBNUIsQ0FIQSxDQUFBO2lCQU1BLFFBQUEsQ0FBUyw2QkFBVCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsWUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO3FCQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsS0FBekMsRUFEUztZQUFBLENBQVgsQ0FBQSxDQUFBO21CQUdBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7cUJBQ2xDLE1BQUEsQ0FBTyxNQUFNLENBQUMsZ0JBQWQsQ0FBK0IsQ0FBQyxHQUFHLENBQUMsZ0JBQXBDLENBQUEsRUFEa0M7WUFBQSxDQUFwQyxFQUpzQztVQUFBLENBQXhDLEVBUGdDO1FBQUEsQ0FBbEMsQ0F2QkEsQ0FBQTtlQXFDQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxNQUFkLENBQXFCLENBQUMsVUFBdEIsQ0FBQSxDQUFBLENBQUE7bUJBQ0EsY0FBYyxDQUFDLFVBQWYsQ0FBQSxFQUZTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBSUEsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTttQkFDaEMsTUFBQSxDQUFPLE1BQU0sQ0FBQyxNQUFkLENBQXFCLENBQUMsU0FBdEIsQ0FBQSxFQURnQztVQUFBLENBQWxDLEVBTGtDO1FBQUEsQ0FBcEMsRUF0QzBCO01BQUEsQ0FBNUIsQ0FsQkEsQ0FBQTtBQUFBLE1BZ0VBLFFBQUEsQ0FBUyxpQ0FBVCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLEtBQXpDLENBQUEsQ0FBQTtpQkFDQSxjQUFjLENBQUMsY0FBZixDQUE4QixPQUE5QixFQUF1QyxNQUF2QyxFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFJQSxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO2lCQUN4QyxNQUFBLENBQU8sTUFBTSxDQUFDLGNBQWQsQ0FBNkIsQ0FBQyxHQUFHLENBQUMsZ0JBQWxDLENBQUEsRUFEd0M7UUFBQSxDQUExQyxFQUwwQztNQUFBLENBQTVDLENBaEVBLENBQUE7YUF3RUEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsY0FBYyxDQUFDLGNBQWYsQ0FBOEIsT0FBOUIsRUFBdUMsTUFBdkMsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFHQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO2lCQUNoQyxNQUFBLENBQU8sTUFBTSxDQUFDLGNBQWQsQ0FBNkIsQ0FBQyxnQkFBOUIsQ0FBQSxFQURnQztRQUFBLENBQWxDLENBSEEsQ0FBQTtBQUFBLFFBTUEsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTtpQkFDekIsTUFBQSxDQUFPLE1BQU0sQ0FBQyxNQUFkLENBQXFCLENBQUMsVUFBdEIsQ0FBQSxFQUR5QjtRQUFBLENBQTNCLENBTkEsQ0FBQTtlQVNBLFFBQUEsQ0FBUyxnREFBVCxFQUEyRCxTQUFBLEdBQUE7QUFDekQsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO21CQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsS0FBekMsRUFEUztVQUFBLENBQVgsQ0FBQSxDQUFBO2lCQUdBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7bUJBQ2pDLE1BQUEsQ0FBTyxNQUFNLENBQUMsZ0JBQWQsQ0FBK0IsQ0FBQyxnQkFBaEMsQ0FBQSxFQURpQztVQUFBLENBQW5DLEVBSnlEO1FBQUEsQ0FBM0QsRUFWZ0M7TUFBQSxDQUFsQyxFQXpFa0I7SUFBQSxDQUFwQixFQS9FMEI7RUFBQSxDQUE1QixDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/minimap-main-spec.coffee

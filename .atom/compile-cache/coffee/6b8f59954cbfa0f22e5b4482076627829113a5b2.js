(function() {
  describe('editor-registry', function() {
    var EditorRegistry, editorRegistry;
    EditorRegistry = require('../lib/editor-registry');
    editorRegistry = null;
    beforeEach(function() {
      waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open(__dirname + '/fixtures/file.txt');
      });
      if (editorRegistry != null) {
        editorRegistry.dispose();
      }
      return editorRegistry = new EditorRegistry;
    });
    describe('::create', function() {
      it('cries when invalid TextEditor was provided', function() {
        expect(function() {
          return editorRegistry.create();
        }).toThrow();
        return expect(function() {
          return editorRegistry.create(5);
        }).toThrow();
      });
      it("adds TextEditor to it's registry", function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return expect(editorRegistry.editorLinters.size).toBe(1);
      });
      return it('automatically clears the TextEditor from registry when destroyed', function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        atom.workspace.destroyActivePaneItem();
        return expect(editorRegistry.editorLinters.size).toBe(0);
      });
    });
    describe('::has', function() {
      return it('returns the status of existence', function() {
        var editor;
        editor = atom.workspace.getActiveTextEditor();
        expect(editorRegistry.has(1)).toBe(false);
        expect(editorRegistry.has(false)).toBe(false);
        expect(editorRegistry.has([])).toBe(false);
        expect(editorRegistry.has(editor)).toBe(false);
        editorRegistry.create(editor);
        expect(editorRegistry.has(editor)).toBe(true);
        atom.workspace.destroyActivePaneItem();
        return expect(editorRegistry.has(editor)).toBe(false);
      });
    });
    describe('::forEach', function() {
      return it('calls the callback once per editorLinter', function() {
        var timesCalled;
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        timesCalled = 0;
        editorRegistry.forEach(function() {
          return ++timesCalled;
        });
        editorRegistry.forEach(function() {
          return ++timesCalled;
        });
        return expect(timesCalled).toBe(2);
      });
    });
    describe('::ofTextEditor', function() {
      it('returns undefined when invalid key is provided', function() {
        expect(editorRegistry.ofTextEditor(null)).toBeUndefined();
        expect(editorRegistry.ofTextEditor(1)).toBeUndefined();
        expect(editorRegistry.ofTextEditor(5)).toBeUndefined();
        return expect(editorRegistry.ofTextEditor('asd')).toBeUndefined();
      });
      return it('returns editorLinter when valid key is provided', function() {
        var activeEditor;
        activeEditor = atom.workspace.getActiveTextEditor();
        expect(editorRegistry.ofTextEditor(activeEditor)).toBeUndefined();
        editorRegistry.create(activeEditor);
        return expect(editorRegistry.ofTextEditor(activeEditor)).toBeDefined();
      });
    });
    describe('::ofPath', function() {
      it('returns undefined when invalid key is provided', function() {
        expect(editorRegistry.ofPath(null)).toBeUndefined();
        expect(editorRegistry.ofPath(1)).toBeUndefined();
        expect(editorRegistry.ofPath(5)).toBeUndefined();
        return expect(editorRegistry.ofPath('asd')).toBeUndefined();
      });
      return it('returns editorLinter when valid key is provided', function() {
        var activeEditor, editorPath;
        activeEditor = atom.workspace.getActiveTextEditor();
        editorPath = activeEditor.getPath();
        expect(editorRegistry.ofPath(editorPath)).toBeUndefined();
        editorRegistry.create(activeEditor);
        return expect(editorRegistry.ofPath(editorPath)).toBeDefined();
      });
    });
    describe('::observe', function() {
      it('calls with the current editorLinters', function() {
        var timesCalled;
        timesCalled = 0;
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        editorRegistry.observe(function() {
          return ++timesCalled;
        });
        return expect(timesCalled).toBe(1);
      });
      return it('calls in the future with new editorLinters', function() {
        var timesCalled;
        timesCalled = 0;
        editorRegistry.observe(function() {
          return ++timesCalled;
        });
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return waitsForPromise(function() {
          return atom.workspace.open('someNonExistingFile').then(function() {
            editorRegistry.create(atom.workspace.getActiveTextEditor());
            return expect(timesCalled).toBe(2);
          });
        });
      });
    });
    return describe('::ofActiveTextEditor', function() {
      it('returns undefined if active pane is not a text editor', function() {
        return expect(editorRegistry.ofActiveTextEditor()).toBeUndefined();
      });
      return it('returns editorLinter when active pane is a text editor', function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return expect(editorRegistry.ofActiveTextEditor()).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvZWRpdG9yLXJlZ2lzdHJ5LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSw4QkFBQTtBQUFBLElBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FBakIsQ0FBQTtBQUFBLElBQ0EsY0FBQSxHQUFpQixJQURqQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtBQUNkLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBZixDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixTQUFBLEdBQVksb0JBQWhDLEVBRmM7TUFBQSxDQUFoQixDQUFBLENBQUE7O1FBR0EsY0FBYyxDQUFFLE9BQWhCLENBQUE7T0FIQTthQUlBLGNBQUEsR0FBaUIsR0FBQSxDQUFBLGVBTFI7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBU0EsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLE1BQUEsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxRQUFBLE1BQUEsQ0FBTyxTQUFBLEdBQUE7aUJBQ0wsY0FBYyxDQUFDLE1BQWYsQ0FBQSxFQURLO1FBQUEsQ0FBUCxDQUVBLENBQUMsT0FGRCxDQUFBLENBQUEsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxTQUFBLEdBQUE7aUJBQ0wsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsQ0FBdEIsRUFESztRQUFBLENBQVAsQ0FFQSxDQUFDLE9BRkQsQ0FBQSxFQUorQztNQUFBLENBQWpELENBQUEs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/editor-registry-spec.coffee

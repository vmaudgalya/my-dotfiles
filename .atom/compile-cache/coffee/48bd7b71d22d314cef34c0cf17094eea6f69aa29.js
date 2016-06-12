(function() {
  var HighlightSelected, Point, Range, path, _ref;

  path = require('path');

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  HighlightSelected = require('../lib/highlight-selected');

  describe("HighlightSelected", function() {
    var activationPromise, editor, editorElement, hasMinimap, hasStatusBar, highlightSelected, minimap, minimapHS, minimapModule, statusBar, workspaceElement, _ref1;
    _ref1 = [], activationPromise = _ref1[0], workspaceElement = _ref1[1], minimap = _ref1[2], statusBar = _ref1[3], editor = _ref1[4], editorElement = _ref1[5], highlightSelected = _ref1[6], minimapHS = _ref1[7], minimapModule = _ref1[8];
    hasMinimap = atom.packages.getAvailablePackageNames().indexOf('minimap') !== -1 && atom.packages.getAvailablePackageNames().indexOf('minimap-highlight-selected') !== -1;
    hasStatusBar = atom.packages.getAvailablePackageNames().indexOf('status-bar') !== -1;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return atom.project.setPaths([path.join(__dirname, 'fixtures')]);
    });
    afterEach(function() {
      highlightSelected.deactivate();
      if (minimapHS != null) {
        minimapHS.deactivate();
      }
      return minimapModule != null ? minimapModule.deactivate() : void 0;
    });
    describe("when opening a coffee file", function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('status-bar').then(function(pack) {
            return statusBar = workspaceElement.querySelector("status-bar");
          });
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('highlight-selected').then(function(_arg) {
            var mainModule;
            mainModule = _arg.mainModule;
            return highlightSelected = mainModule;
          });
        });
        if (hasMinimap) {
          waitsForPromise(function() {
            return atom.packages.activatePackage('minimap').then(function(_arg) {
              var mainModule;
              mainModule = _arg.mainModule;
              return minimapModule = mainModule;
            });
          });
          waitsForPromise(function() {
            return atom.packages.activatePackage('minimap-highlight-selected').then(function(_arg) {
              var mainModule;
              mainModule = _arg.mainModule;
              return minimapHS = mainModule;
            });
          });
        }
        waitsForPromise(function() {
          return atom.workspace.open('sample.coffee').then(function(editor) {
            return editor;
          }, function(error) {
            throw error.stack;
          });
        });
        return runs(function() {
          jasmine.attachToDOM(workspaceElement);
          editor = atom.workspace.getActiveTextEditor();
          return editorElement = atom.views.getView(editor);
        });
      });
      describe("updates debounce when config is changed", function() {
        beforeEach(function() {
          spyOn(highlightSelected.areaView, 'debouncedHandleSelection');
          return atom.config.set('highlight-selected.timeout', 20000);
        });
        return it('calls createDebouce', function() {
          return expect(highlightSelected.areaView.debouncedHandleSelection).toHaveBeenCalled();
        });
      });
      describe("when a whole word is selected", function() {
        beforeEach(function() {
          var range;
          range = new Range(new Point(8, 2), new Point(8, 8));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        it("adds the decoration to all words", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(4);
        });
        it("creates the highlight selected status bar element", function() {
          expect(workspaceElement.querySelector('status-bar')).toExist();
          return expect(workspaceElement.querySelector('.highlight-selected-status')).toExist();
        });
        it("updates the status bar with highlights number", function() {
          var content;
          content = workspaceElement.querySelector('.highlight-selected-status').innerHTML;
          return expect(content).toBe('Highlighted: 4');
        });
        return describe("when the status bar is disabled", function() {
          beforeEach(function() {
            return atom.config.set('highlight-selected.showInStatusBar', false);
          });
          return it("highlight isn't attached", function() {
            expect(workspaceElement.querySelector('status-bar')).toExist();
            return expect(workspaceElement.querySelector('.highlight-selected-status')).not.toExist();
          });
        });
      });
      describe("when hide highlight on selected word is enabled", function() {
        beforeEach(function() {
          return atom.config.set('highlight-selected.hideHighlightOnSelectedWord', true);
        });
        describe("when a single line is selected", function() {
          beforeEach(function() {
            var range;
            range = new Range(new Point(8, 2), new Point(8, 8));
            editor.setSelectedBufferRange(range);
            return advanceClock(20000);
          });
          return it("adds the decoration only no selected words", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(3);
          });
        });
        return describe("when multi lines are selected", function() {
          beforeEach(function() {
            var range1, range2;
            range1 = new Range(new Point(8, 2), new Point(8, 8));
            range2 = new Range(new Point(9, 2), new Point(9, 8));
            editor.setSelectedBufferRanges([range1, range2]);
            return advanceClock(20000);
          });
          return it("adds the decoration only no selected words", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(2);
          });
        });
      });
      describe("leading whitespace doesn't get used", function() {
        beforeEach(function() {
          var range;
          range = new Range(new Point(8, 0), new Point(8, 8));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("doesn't add regions", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(0);
        });
      });
      describe("will highlight non whole words", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.onlyHighlightWholeWords', false);
          range = new Range(new Point(10, 13), new Point(10, 17));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("does add regions", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(3);
        });
      });
      describe("will not highlight non whole words", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.onlyHighlightWholeWords', true);
          range = new Range(new Point(10, 13), new Point(10, 17));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("does add regions", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(2);
        });
      });
      describe("will not highlight less than minimum length", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.minimumLength', 7);
          range = new Range(new Point(4, 0), new Point(4, 6));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("doesn't add regions", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(0);
        });
      });
      describe("will not highlight words in different case", function() {
        beforeEach(function() {
          var range;
          range = new Range(new Point(4, 0), new Point(4, 6));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("does add regions", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(2);
        });
      });
      describe("will highlight words in different case", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.ignoreCase', true);
          range = new Range(new Point(4, 0), new Point(4, 6));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        it("does add regions", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(5);
        });
        describe("adds background to selected", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-selected.highlightBackground', true);
            range = new Range(new Point(8, 2), new Point(8, 8));
            editor.setSelectedBufferRange(range);
            return advanceClock(20000);
          });
          return it("adds the background to all highlights", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected.background .region')).toHaveLength(4);
          });
        });
        return describe("adds light theme to selected", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-selected.lightTheme', true);
            range = new Range(new Point(8, 2), new Point(8, 8));
            editor.setSelectedBufferRange(range);
            return advanceClock(20000);
          });
          return it("adds the background to all highlights", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected.light-theme .region')).toHaveLength(4);
          });
        });
      });
      if (hasMinimap) {
        return describe("minimap highlight selected still works", function() {
          beforeEach(function() {
            var range;
            editor = atom.workspace.getActiveTextEditor();
            minimap = minimapModule.minimapForEditor(editor);
            spyOn(minimap, 'decorateMarker').andCallThrough();
            range = new Range(new Point(8, 2), new Point(8, 8));
            editor.setSelectedBufferRange(range);
            return advanceClock(20000);
          });
          return it('adds a decoration for the selection in the minimap', function() {
            return expect(minimap.decorateMarker).toHaveBeenCalled();
          });
        });
      }
    });
    return describe("when opening a php file", function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('highlight-selected').then(function(_arg) {
            var mainModule;
            mainModule = _arg.mainModule;
            return highlightSelected = mainModule;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open('sample.php').then(function(editor) {
            return editor;
          }, function(error) {
            throw error.stack;
          });
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-php');
        });
        return runs(function() {
          jasmine.attachToDOM(workspaceElement);
          editor = atom.workspace.getActiveTextEditor();
          return editorElement = atom.views.getView(editor);
        });
      });
      describe("being able to highlight variables with '$'", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.onlyHighlightWholeWords', true);
          range = new Range(new Point(1, 2), new Point(1, 7));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("finds 3 regions", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(3);
        });
      });
      return describe("being able to highlight variables when not selecting '$'", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.onlyHighlightWholeWords', true);
          range = new Range(new Point(1, 3), new Point(1, 7));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("finds 4 regions", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(4);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LXNlbGVjdGVkL3NwZWMvaGlnaGxpZ2h0LXNlbGVjdGVkLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQURSLENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsMkJBQVIsQ0FGcEIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsUUFBQSw0SkFBQTtBQUFBLElBQUEsUUFDdUUsRUFEdkUsRUFBQyw0QkFBRCxFQUFvQiwyQkFBcEIsRUFBc0Msa0JBQXRDLEVBQStDLG9CQUEvQyxFQUNDLGlCQURELEVBQ1Msd0JBRFQsRUFDd0IsNEJBRHhCLEVBQzJDLG9CQUQzQyxFQUNzRCx3QkFEdEQsQ0FBQTtBQUFBLElBR0EsVUFBQSxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQWQsQ0FBQSxDQUNYLENBQUMsT0FEVSxDQUNGLFNBREUsQ0FBQSxLQUNjLENBQUEsQ0FEZCxJQUNxQixJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUFkLENBQUEsQ0FDaEMsQ0FBQyxPQUQrQixDQUN2Qiw0QkFEdUIsQ0FBQSxLQUNZLENBQUEsQ0FMOUMsQ0FBQTtBQUFBLElBT0EsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQWQsQ0FBQSxDQUNiLENBQUMsT0FEWSxDQUNKLFlBREksQ0FBQSxLQUNlLENBQUEsQ0FSOUIsQ0FBQTtBQUFBLElBVUEsVUFBQSxDQUFXLFNBQUEs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/highlight-selected/spec/highlight-selected-spec.coffee

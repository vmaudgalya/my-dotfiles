(function() {
  var HighlightSelected, Point, Range, path, _ref;

  path = require('path');

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  HighlightSelected = require('../lib/highlight-selected');

  describe("HighlightSelected", function() {
    var activationPromise, editor, editorElement, hasMinimap, highlightSelected, minimap, minimapHS, minimapModule, workspaceElement, _ref1;
    _ref1 = [], activationPromise = _ref1[0], workspaceElement = _ref1[1], minimap = _ref1[2], editor = _ref1[3], editorElement = _ref1[4], highlightSelected = _ref1[5], minimapHS = _ref1[6], minimapModule = _ref1[7];
    hasMinimap = atom.packages.getAvailablePackageNames().indexOf('minimap') !== -1 && atom.packages.getAvailablePackageNames().indexOf('minimap-highlight-selected') !== -1;
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
        return it("adds the decoration to all words", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.highlight-selected .region')).toHaveLength(4);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LXNlbGVjdGVkL3NwZWMvaGlnaGxpZ2h0LXNlbGVjdGVkLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQURSLENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsMkJBQVIsQ0FGcEIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsUUFBQSxtSUFBQTtBQUFBLElBQUEsUUFDdUUsRUFEdkUsRUFBQyw0QkFBRCxFQUFvQiwyQkFBcEIsRUFBc0Msa0JBQXRDLEVBQ0MsaUJBREQsRUFDUyx3QkFEVCxFQUN3Qiw0QkFEeEIsRUFDMkMsb0JBRDNDLEVBQ3NELHdCQUR0RCxDQUFBO0FBQUEsSUFHQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBZCxDQUFBLENBQ1gsQ0FBQyxPQURVLENBQ0YsU0FERSxDQUFBLEtBQ2MsQ0FBQSxDQURkLElBQ3FCLElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQWQsQ0FBQSxDQUNoQyxDQUFDLE9BRCtCLENBQ3ZCLDRCQUR1QixDQUFBLEtBQ1ksQ0FBQSxDQUw5QyxDQUFBO0FBQUEsSUFPQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/highlight-selected/spec/highlight-selected-spec.coffee

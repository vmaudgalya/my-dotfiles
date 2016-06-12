(function() {
  var Minimap, fs;

  require('./helpers/workspace');

  fs = require('fs-plus');

  Minimap = require('../lib/minimap');

  describe('Minimap', function() {
    var editor, editorElement, largeSample, minimap, minimapHorizontalScaleFactor, minimapVerticalScaleFactor, smallSample, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], minimap = _ref[2], largeSample = _ref[3], smallSample = _ref[4], minimapVerticalScaleFactor = _ref[5], minimapHorizontalScaleFactor = _ref[6];
    beforeEach(function() {
      var dir;
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      editor = atom.workspace.buildTextEditor({});
      editorElement = atom.views.getView(editor);
      jasmine.attachToDOM(editorElement);
      editorElement.setHeight(50);
      editorElement.setWidth(200);
      minimapVerticalScaleFactor = 5 / editor.getLineHeightInPixels();
      minimapHorizontalScaleFactor = 2 / editor.getDefaultCharWidth();
      dir = atom.project.getDirectories()[0];
      minimap = new Minimap({
        textEditor: editor
      });
      largeSample = fs.readFileSync(dir.resolve('large-file.coffee')).toString();
      return smallSample = fs.readFileSync(dir.resolve('sample.coffee')).toString();
    });
    it('has an associated editor', function() {
      return expect(minimap.getTextEditor()).toEqual(editor);
    });
    it('returns false when asked if destroyed', function() {
      return expect(minimap.isDestroyed()).toBeFalsy();
    });
    it('raise an exception if created without a text editor', function() {
      return expect(function() {
        return new Minimap;
      }).toThrow();
    });
    it('measures the minimap size based on the current editor content', function() {
      editor.setText(smallSample);
      expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
      editor.setText(largeSample);
      return expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
    });
    it('measures the scaling factor between the editor and the minimap', function() {
      expect(minimap.getVerticalScaleFactor()).toEqual(minimapVerticalScaleFactor);
      return expect(minimap.getHorizontalScaleFactor()).toEqual(minimapHorizontalScaleFactor);
    });
    it('measures the editor visible area size at minimap scale', function() {
      editor.setText(largeSample);
      return expect(minimap.getTextEditorScaledHeight()).toEqual(50 * minimapVerticalScaleFactor);
    });
    it('measures the available minimap scroll', function() {
      var largeLineCount;
      editor.setText(largeSample);
      largeLineCount = editor.getScreenLineCount();
      expect(minimap.getMaxScrollTop()).toEqual(largeLineCount * 5 - 50);
      return expect(minimap.canScroll()).toBeTruthy();
    });
    it('computes the first visible row in the minimap', function() {
      return expect(minimap.getFirstVisibleScreenRow()).toEqual(0);
    });
    it('computes the last visible row in the minimap', function() {
      return expect(minimap.getLastVisibleScreenRow()).toEqual(10);
    });
    it('relays change events from the text editor', function() {
      var changeSpy;
      changeSpy = jasmine.createSpy('didChange');
      minimap.onDidChange(changeSpy);
      editor.setText('foo');
      return expect(changeSpy).toHaveBeenCalled();
    });
    it('relays scroll top events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollTop(scrollSpy);
      editorElement.setScrollTop(100);
      return expect(scrollSpy).toHaveBeenCalled();
    });
    it('relays scroll left events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollLeft(scrollSpy);
      spyOn(editorElement, 'getScrollWidth').andReturn(10000);
      editorElement.setScrollLeft(100);
      return expect(scrollSpy).toHaveBeenCalled();
    });
    describe('when scrols past end is enabled', function() {
      beforeEach(function() {
        editor.setText(largeSample);
        return atom.config.set('editor.scrollPastEnd', true);
      });
      it('adjust the scrolling ratio', function() {
        var maxScrollTop;
        editorElement.setScrollTop(editorElement.getScrollHeight());
        maxScrollTop = editorElement.getScrollHeight() - editorElement.getHeight() - (editorElement.getHeight() - 3 * editor.displayBuffer.getLineHeightInPixels());
        return expect(minimap.getTextEditorScrollRatio()).toEqual(editorElement.getScrollTop() / maxScrollTop);
      });
      it('lock the minimap scroll top to 1', function() {
        editorElement.setScrollTop(editorElement.getScrollHeight());
        return expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
      });
      return describe('getTextEditorScrollRatio(), when getScrollTop() and maxScrollTop both equal 0', function() {
        beforeEach(function() {
          editor.setText(smallSample);
          editorElement.setHeight(40);
          return atom.config.set('editor.scrollPastEnd', true);
        });
        return it('returns 0', function() {
          editorElement.setScrollTop(0);
          return expect(minimap.getTextEditorScrollRatio()).toEqual(0);
        });
      });
    });
    describe('when soft wrap is enabled', function() {
      beforeEach(function() {
        atom.config.set('editor.softWrap', true);
        atom.config.set('editor.softWrapAtPreferredLineLength', true);
        return atom.config.set('editor.preferredLineLength', 2);
      });
      return it('measures the minimap using screen lines', function() {
        editor.setText(smallSample);
        expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
        editor.setText(largeSample);
        return expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
      });
    });
    describe('when there is no scrolling needed to display the whole minimap', function() {
      it('returns 0 when computing the minimap scroll', function() {
        return expect(minimap.getScrollTop()).toEqual(0);
      });
      return it('returns 0 when measuring the available minimap scroll', function() {
        editor.setText(smallSample);
        expect(minimap.getMaxScrollTop()).toEqual(0);
        return expect(minimap.canScroll()).toBeFalsy();
      });
    });
    describe('when the editor is scrolled', function() {
      var editorHeight, editorScrollRatio, largeLineCount, _ref1;
      _ref1 = [], largeLineCount = _ref1[0], editorHeight = _ref1[1], editorScrollRatio = _ref1[2];
      beforeEach(function() {
        spyOn(editorElement, 'getScrollWidth').andReturn(10000);
        editor.setText(largeSample);
        editorElement.setScrollTop(1000);
        editorElement.setScrollLeft(200);
        largeLineCount = editor.getScreenLineCount();
        editorHeight = largeLineCount * editor.getLineHeightInPixels();
        return editorScrollRatio = editorElement.getScrollTop() / (editorElement.getScrollHeight() - editorElement.getHeight());
      });
      it('scales the editor scroll based on the minimap scale factor', function() {
        expect(minimap.getTextEditorScaledScrollTop()).toEqual(1000 * minimapVerticalScaleFactor);
        return expect(minimap.getTextEditorScaledScrollLeft()).toEqual(200 * minimapHorizontalScaleFactor);
      });
      it('computes the offset to apply based on the editor scroll top', function() {
        return expect(minimap.getScrollTop()).toEqual(editorScrollRatio * minimap.getMaxScrollTop());
      });
      it('computes the first visible row in the minimap', function() {
        return expect(minimap.getFirstVisibleScreenRow()).toEqual(58);
      });
      it('computes the last visible row in the minimap', function() {
        return expect(minimap.getLastVisibleScreenRow()).toEqual(69);
      });
      return describe('down to the bottom', function() {
        beforeEach(function() {
          editorElement.setScrollTop(editorElement.getScrollHeight());
          return editorScrollRatio = editorElement.getScrollTop() / editorElement.getScrollHeight();
        });
        it('computes an offset that scrolls the minimap to the bottom edge', function() {
          return expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
        });
        it('computes the first visible row in the minimap', function() {
          return expect(minimap.getFirstVisibleScreenRow()).toEqual(largeLineCount - 10);
        });
        return it('computes the last visible row in the minimap', function() {
          return expect(minimap.getLastVisibleScreenRow()).toEqual(largeLineCount);
        });
      });
    });
    describe('destroying the model', function() {
      it('emits a did-destroy event', function() {
        var spy;
        spy = jasmine.createSpy('destroy');
        minimap.onDidDestroy(spy);
        minimap.destroy();
        return expect(spy).toHaveBeenCalled();
      });
      return it('returns true when asked if destroyed', function() {
        minimap.destroy();
        return expect(minimap.isDestroyed()).toBeTruthy();
      });
    });
    describe('destroying the text editor', function() {
      return it('destroys the model', function() {
        spyOn(minimap, 'destroy');
        editor.destroy();
        return expect(minimap.destroy).toHaveBeenCalled();
      });
    });
    describe('::decorateMarker', function() {
      var changeSpy, decoration, marker, _ref1;
      _ref1 = [], marker = _ref1[0], decoration = _ref1[1], changeSpy = _ref1[2];
      beforeEach(function() {
        editor.setText(largeSample);
        changeSpy = jasmine.createSpy('didChange');
        minimap.onDidChange(changeSpy);
        marker = minimap.markBufferRange([[0, 6], [1, 11]]);
        return decoration = minimap.decorateMarker(marker, {
          type: 'highlight',
          "class": 'dummy'
        });
      });
      it('creates a decoration for the given marker', function() {
        return expect(minimap.decorationsByMarkerId[marker.id]).toBeDefined();
      });
      it('creates a change corresponding to the marker range', function() {
        expect(changeSpy).toHaveBeenCalled();
        expect(changeSpy.calls[0].args[0].start).toEqual(0);
        return expect(changeSpy.calls[0].args[0].end).toEqual(1);
      });
      describe('when the marker range changes', function() {
        beforeEach(function() {
          var markerChangeSpy;
          markerChangeSpy = jasmine.createSpy('marker-did-change');
          marker.onDidChange(markerChangeSpy);
          marker.setBufferRange([[0, 6], [3, 11]]);
          return waitsFor(function() {
            return markerChangeSpy.calls.length > 0;
          });
        });
        return it('creates a change only for the dif between the two ranges', function() {
          expect(changeSpy).toHaveBeenCalled();
          expect(changeSpy.calls[1].args[0].start).toEqual(1);
          return expect(changeSpy.calls[1].args[0].end).toEqual(3);
        });
      });
      describe('destroying the marker', function() {
        beforeEach(function() {
          return marker.destroy();
        });
        it('removes the decoration from the render view', function() {
          return expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
        });
        return it('creates a change corresponding to the marker range', function() {
          expect(changeSpy.calls[1].args[0].start).toEqual(0);
          return expect(changeSpy.calls[1].args[0].end).toEqual(1);
        });
      });
      describe('destroying the decoration', function() {
        beforeEach(function() {
          return decoration.destroy();
        });
        it('removes the decoration from the render view', function() {
          return expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
        });
        return it('creates a change corresponding to the marker range', function() {
          expect(changeSpy.calls[1].args[0].start).toEqual(0);
          return expect(changeSpy.calls[1].args[0].end).toEqual(1);
        });
      });
      describe('destroying all the decorations for the marker', function() {
        beforeEach(function() {
          return minimap.removeAllDecorationsForMarker(marker);
        });
        it('removes the decoration from the render view', function() {
          return expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
        });
        return it('creates a change corresponding to the marker range', function() {
          expect(changeSpy.calls[1].args[0].start).toEqual(0);
          return expect(changeSpy.calls[1].args[0].end).toEqual(1);
        });
      });
      return describe('destroying the minimap', function() {
        beforeEach(function() {
          return minimap.destroy();
        });
        it('removes all the previously added decorations', function() {
          expect(minimap.decorationsById).toEqual({});
          return expect(minimap.decorationsByMarkerId).toEqual({});
        });
        return it('prevents the creation of new decorations', function() {
          marker = editor.markBufferRange([[0, 6], [0, 11]]);
          decoration = minimap.decorateMarker(marker, {
            type: 'highlight',
            "class": 'dummy'
          });
          return expect(decoration).toBeUndefined();
        });
      });
    });
    return describe('::decorationsByTypeThenRows', function() {
      var decorations;
      decorations = [][0];
      beforeEach(function() {
        var createDecoration;
        editor.setText(largeSample);
        createDecoration = function(type, range) {
          var decoration, marker;
          marker = minimap.markBufferRange(range);
          return decoration = minimap.decorateMarker(marker, {
            type: type
          });
        };
        createDecoration('highlight', [[6, 0], [11, 0]]);
        createDecoration('highlight', [[7, 0], [8, 0]]);
        createDecoration('highlight-over', [[1, 0], [2, 0]]);
        createDecoration('line', [[3, 0], [4, 0]]);
        createDecoration('line', [[12, 0], [12, 0]]);
        createDecoration('highlight-under', [[0, 0], [10, 1]]);
        return decorations = minimap.decorationsByTypeThenRows(0, 12);
      });
      it('returns an object whose keys are the decorations types', function() {
        return expect(Object.keys(decorations).sort()).toEqual(['highlight-over', 'highlight-under', 'line']);
      });
      it('stores decorations by rows within each type objects', function() {
        expect(Object.keys(decorations['highlight-over']).sort()).toEqual('1 2 6 7 8 9 10 11'.split(' ').sort());
        expect(Object.keys(decorations['line']).sort()).toEqual('3 4 12'.split(' ').sort());
        return expect(Object.keys(decorations['highlight-under']).sort()).toEqual('0 1 2 3 4 5 6 7 8 9 10'.split(' ').sort());
      });
      return it('stores the decorations spanning a row in the corresponding row array', function() {
        expect(decorations['highlight-over']['7'].length).toEqual(2);
        expect(decorations['line']['3'].length).toEqual(1);
        return expect(decorations['highlight-under']['5'].length).toEqual(1);
      });
    });
  });

  describe('Stand alone minimap', function() {
    var editor, editorElement, largeSample, minimap, smallSample, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], minimap = _ref[2], largeSample = _ref[3], smallSample = _ref[4];
    beforeEach(function() {
      var dir;
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      editor = atom.workspace.buildTextEditor({});
      editorElement = atom.views.getView(editor);
      jasmine.attachToDOM(editorElement);
      editorElement.setHeight(50);
      editorElement.setWidth(200);
      editor.setLineHeightInPixels(10);
      dir = atom.project.getDirectories()[0];
      minimap = new Minimap({
        textEditor: editor,
        standAlone: true
      });
      largeSample = fs.readFileSync(dir.resolve('large-file.coffee')).toString();
      return smallSample = fs.readFileSync(dir.resolve('sample.coffee')).toString();
    });
    it('has an associated editor', function() {
      return expect(minimap.getTextEditor()).toEqual(editor);
    });
    it('measures the minimap size based on the current editor content', function() {
      editor.setText(smallSample);
      expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
      editor.setText(largeSample);
      return expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
    });
    it('measures the scaling factor between the editor and the minimap', function() {
      expect(minimap.getVerticalScaleFactor()).toEqual(0.5);
      return expect(minimap.getHorizontalScaleFactor()).toEqual(2 / editor.getDefaultCharWidth());
    });
    it('measures the editor visible area size at minimap scale', function() {
      editor.setText(largeSample);
      return expect(minimap.getTextEditorScaledHeight()).toEqual(25);
    });
    it('has a visible height based on the passed-in options', function() {
      expect(minimap.getVisibleHeight()).toEqual(5);
      editor.setText(smallSample);
      expect(minimap.getVisibleHeight()).toEqual(20);
      editor.setText(largeSample);
      expect(minimap.getVisibleHeight()).toEqual(editor.getScreenLineCount() * 5);
      minimap.height = 100;
      return expect(minimap.getVisibleHeight()).toEqual(100);
    });
    it('has a visible width based on the passed-in options', function() {
      expect(minimap.getVisibleWidth()).toEqual(0);
      editor.setText(smallSample);
      expect(minimap.getVisibleWidth()).toEqual(36);
      editor.setText(largeSample);
      expect(minimap.getVisibleWidth()).toEqual(editor.getMaxScreenLineLength() * 2);
      minimap.width = 50;
      return expect(minimap.getVisibleWidth()).toEqual(50);
    });
    it('measures the available minimap scroll', function() {
      var largeLineCount;
      editor.setText(largeSample);
      largeLineCount = editor.getScreenLineCount();
      expect(minimap.getMaxScrollTop()).toEqual(0);
      expect(minimap.canScroll()).toBeFalsy();
      minimap.height = 100;
      expect(minimap.getMaxScrollTop()).toEqual(largeLineCount * 5 - 100);
      return expect(minimap.canScroll()).toBeTruthy();
    });
    it('computes the first visible row in the minimap', function() {
      return expect(minimap.getFirstVisibleScreenRow()).toEqual(0);
    });
    it('computes the last visible row in the minimap', function() {
      editor.setText(largeSample);
      expect(minimap.getLastVisibleScreenRow()).toEqual(editor.getScreenLineCount());
      minimap.height = 100;
      return expect(minimap.getLastVisibleScreenRow()).toEqual(20);
    });
    it('does not relay scroll top events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollTop(scrollSpy);
      editorElement.setScrollTop(100);
      return expect(scrollSpy).not.toHaveBeenCalled();
    });
    it('does not relay scroll left events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollLeft(scrollSpy);
      spyOn(editorElement, 'getScrollWidth').andReturn(10000);
      editorElement.setScrollLeft(100);
      return expect(scrollSpy).not.toHaveBeenCalled();
    });
    it('has a scroll top that is not bound to the text editor', function() {
      var scrollSpy;
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollTop(scrollSpy);
      editor.setText(largeSample);
      editorElement.setScrollTop(1000);
      expect(minimap.getScrollTop()).toEqual(0);
      expect(scrollSpy).not.toHaveBeenCalled();
      minimap.setScrollTop(10);
      expect(minimap.getScrollTop()).toEqual(10);
      return expect(scrollSpy).toHaveBeenCalled();
    });
    it('has rendering properties that can overrides the config values', function() {
      minimap.setCharWidth(8.5);
      minimap.setCharHeight(10.2);
      minimap.setInterline(10.6);
      expect(minimap.getCharWidth()).toEqual(8);
      expect(minimap.getCharHeight()).toEqual(10);
      expect(minimap.getInterline()).toEqual(10);
      return expect(minimap.getLineHeight()).toEqual(20);
    });
    return it('emits a config change event when a value is changed', function() {
      var changeSpy;
      changeSpy = jasmine.createSpy('did-change');
      minimap.onDidChangeConfig(changeSpy);
      minimap.setCharWidth(8.5);
      minimap.setCharHeight(10.2);
      minimap.setInterline(10.6);
      return expect(changeSpy.callCount).toEqual(3);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL21pbmltYXAtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLE9BQUEsQ0FBUSxxQkFBUixDQUFBLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxnQkFBUixDQUhWLENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsUUFBQSx3SEFBQTtBQUFBLElBQUEsT0FBdUgsRUFBdkgsRUFBQyxnQkFBRCxFQUFTLHVCQUFULEVBQXdCLGlCQUF4QixFQUFpQyxxQkFBakMsRUFBOEMscUJBQTlDLEVBQTJELG9DQUEzRCxFQUF1RixzQ0FBdkYsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsR0FBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQyxDQUF0QyxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEIsRUFBcUMsQ0FBckMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDLENBQXJDLENBRkEsQ0FBQTtBQUFBLE1BSUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUErQixFQUEvQixDQUpULENBQUE7QUFBQSxNQU1BLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBTmhCLENBQUE7QUFBQSxNQU9BLE9B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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/minimap-spec.coffee

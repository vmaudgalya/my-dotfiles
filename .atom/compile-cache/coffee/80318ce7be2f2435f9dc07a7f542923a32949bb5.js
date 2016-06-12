(function() {
  var Minimap, TextEditor, fs;

  fs = require('fs-plus');

  TextEditor = require('atom').TextEditor;

  Minimap = require('../lib/minimap');

  describe('Minimap', function() {
    var editor, largeSample, minimap, smallSample, _ref;
    _ref = [], editor = _ref[0], minimap = _ref[1], largeSample = _ref[2], smallSample = _ref[3];
    beforeEach(function() {
      var dir;
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      editor = new TextEditor({});
      editor.setLineHeightInPixels(10);
      editor.setHeight(50);
      editor.setWidth(200);
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
      expect(minimap.getVerticalScaleFactor()).toEqual(0.5);
      return expect(minimap.getHorizontalScaleFactor()).toEqual(2 / editor.getDefaultCharWidth());
    });
    it('measures the editor visible area size at minimap scale', function() {
      editor.setText(largeSample);
      return expect(minimap.getTextEditorScaledHeight()).toEqual(25);
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
      editor.setScrollTop(100);
      return expect(scrollSpy).toHaveBeenCalled();
    });
    it('relays scroll left events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollLeft(scrollSpy);
      spyOn(editor.displayBuffer, 'getScrollWidth').andReturn(10000);
      editor.setScrollLeft(100);
      return expect(scrollSpy).toHaveBeenCalled();
    });
    describe('when scrols past end is enabled', function() {
      beforeEach(function() {
        editor.setText(largeSample);
        return atom.config.set('editor.scrollPastEnd', true);
      });
      it('adjust the scrolling ratio', function() {
        var maxScrollTop;
        editor.setScrollTop(editor.displayBuffer.getMaxScrollTop());
        maxScrollTop = editor.displayBuffer.getMaxScrollTop() - (editor.getHeight() - 3 * editor.displayBuffer.getLineHeightInPixels());
        return expect(minimap.getTextEditorScrollRatio()).toEqual(editor.getScrollTop() / maxScrollTop);
      });
      it('lock the minimap scroll top to 1', function() {
        editor.setScrollTop(editor.displayBuffer.getMaxScrollTop());
        return expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
      });
      return describe('when getScrollTop() and maxScrollTop both equal 0', function() {
        beforeEach(function() {
          editor.setText(smallSample);
          editor.setHeight(40);
          return atom.config.set('editor.scrollPastEnd', true);
        });
        return it('getTextEditorScrollRatio() should return 0', function() {
          var maxScrollTop;
          editor.setScrollTop(0);
          maxScrollTop = editor.displayBuffer.getMaxScrollTop() - (editor.getHeight() - 3 * editor.displayBuffer.getLineHeightInPixels());
          expect(maxScrollTop).toEqual(0);
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
        spyOn(editor.displayBuffer, 'getScrollWidth').andReturn(10000);
        editor.setText(largeSample);
        editor.setScrollTop(1000);
        editor.setScrollLeft(200);
        largeLineCount = editor.getScreenLineCount();
        editorHeight = largeLineCount * editor.getLineHeightInPixels();
        return editorScrollRatio = editor.getScrollTop() / editor.displayBuffer.getMaxScrollTop();
      });
      it('scales the editor scroll based on the minimap scale factor', function() {
        expect(minimap.getTextEditorScaledScrollTop()).toEqual(500);
        return expect(minimap.getTextEditorScaledScrollLeft()).toEqual(200 * minimap.getHorizontalScaleFactor());
      });
      it('computes the offset to apply based on the editor scroll top', function() {
        return expect(minimap.getScrollTop()).toEqual(editorScrollRatio * minimap.getMaxScrollTop());
      });
      it('computes the first visible row in the minimap', function() {
        return expect(minimap.getFirstVisibleScreenRow()).toEqual(Math.floor(99));
      });
      it('computes the last visible row in the minimap', function() {
        return expect(minimap.getLastVisibleScreenRow()).toEqual(110);
      });
      return describe('down to the bottom', function() {
        beforeEach(function() {
          editor.setScrollTop(editor.displayBuffer.getMaxScrollTop());
          return editorScrollRatio = editor.getScrollTop() / editor.displayBuffer.getMaxScrollTop();
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
    var editor, largeSample, minimap, smallSample, _ref;
    _ref = [], editor = _ref[0], minimap = _ref[1], largeSample = _ref[2], smallSample = _ref[3];
    beforeEach(function() {
      var dir;
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      editor = new TextEditor({});
      editor.setLineHeightInPixels(10);
      editor.setHeight(50);
      editor.setWidth(200);
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
      editor.setScrollTop(100);
      return expect(scrollSpy).not.toHaveBeenCalled();
    });
    it('does not relay scroll left events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollLeft(scrollSpy);
      spyOn(editor.displayBuffer, 'getScrollWidth').andReturn(10000);
      editor.setScrollLeft(100);
      return expect(scrollSpy).not.toHaveBeenCalled();
    });
    return it('has a scroll top that is not bound to the text editor', function() {
      var scrollSpy;
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollTop(scrollSpy);
      editor.setText(largeSample);
      editor.setScrollTop(1000);
      expect(minimap.getScrollTop()).toEqual(0);
      expect(scrollSpy).not.toHaveBeenCalled();
      minimap.setScrollTop(10);
      expect(minimap.getScrollTop()).toEqual(10);
      return expect(scrollSpy).toHaveBeenCalled();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL21pbmltYXAtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUJBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0MsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBREQsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsK0NBQUE7QUFBQSxJQUFBLE9BQThDLEVBQTlDLEVBQUMsZ0JBQUQsRUFBUyxpQkFBVCxFQUFrQixxQkFBbEIsRUFBK0IscUJBQS9CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLEdBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsRUFBc0MsQ0FBdEMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDLENBQXJDLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQyxDQUFyQyxDQUZBLENBQUE7QUFBQSxNQUlBLE1BQUEsR0FBYSxJQUFBLFVBQUEsQ0FBVyxFQUFYLENBSmIsQ0FBQTtBQUFBLE1BS0EsTUFBTSxDQUFDLHFCQUFQLENBQTZCLEVBQTdCLENBTEEsQ0FBQTtBQUFBLE1BTUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsRUFBakIsQ0FOQSxDQUFBO0FBQUEsTUFPQSxNQUFNLENBQUMsUUFBUCxDQUFnQixH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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/minimap-spec.coffee

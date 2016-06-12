function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./helpers/workspace');

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _libMinimap = require('../lib/minimap');

var _libMinimap2 = _interopRequireDefault(_libMinimap);

'use babel';

describe('Minimap', function () {
  var _ref = [];
  var editor = _ref[0];
  var editorElement = _ref[1];
  var minimap = _ref[2];
  var largeSample = _ref[3];
  var smallSample = _ref[4];
  var minimapVerticalScaleFactor = _ref[5];
  var minimapHorizontalScaleFactor = _ref[6];

  beforeEach(function () {
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

    var dir = atom.project.getDirectories()[0];

    minimap = new _libMinimap2['default']({ textEditor: editor });
    largeSample = _fsPlus2['default'].readFileSync(dir.resolve('large-file.coffee')).toString();
    smallSample = _fsPlus2['default'].readFileSync(dir.resolve('sample.coffee')).toString();
  });

  it('has an associated editor', function () {
    expect(minimap.getTextEditor()).toEqual(editor);
  });

  it('returns false when asked if destroyed', function () {
    expect(minimap.isDestroyed()).toBeFalsy();
  });

  it('raise an exception if created without a text editor', function () {
    expect(function () {
      return new _libMinimap2['default']();
    }).toThrow();
  });

  it('measures the minimap size based on the current editor content', function () {
    editor.setText(smallSample);
    expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);

    editor.setText(largeSample);
    expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
  });

  it('measures the scaling factor between the editor and the minimap', function () {
    expect(minimap.getVerticalScaleFactor()).toEqual(minimapVerticalScaleFactor);
    expect(minimap.getHorizontalScaleFactor()).toEqual(minimapHorizontalScaleFactor);
  });

  it('measures the editor visible area size at minimap scale', function () {
    editor.setText(largeSample);
    expect(minimap.getTextEditorScaledHeight()).toEqual(50 * minimapVerticalScaleFactor);
  });

  it('measures the available minimap scroll', function () {
    editor.setText(largeSample);
    var largeLineCount = editor.getScreenLineCount();

    expect(minimap.getMaxScrollTop()).toEqual(largeLineCount * 5 - 50);
    expect(minimap.canScroll()).toBeTruthy();
  });

  it('computes the first visible row in the minimap', function () {
    expect(minimap.getFirstVisibleScreenRow()).toEqual(0);
  });

  it('computes the last visible row in the minimap', function () {
    expect(minimap.getLastVisibleScreenRow()).toEqual(10);
  });

  it('relays change events from the text editor', function () {
    var changeSpy = jasmine.createSpy('didChange');
    minimap.onDidChange(changeSpy);

    editor.setText('foo');

    expect(changeSpy).toHaveBeenCalled();
  });

  it('relays scroll top events from the editor', function () {
    editor.setText(largeSample);

    var scrollSpy = jasmine.createSpy('didScroll');
    minimap.onDidChangeScrollTop(scrollSpy);

    editorElement.setScrollTop(100);

    expect(scrollSpy).toHaveBeenCalled();
  });

  it('relays scroll left events from the editor', function () {
    editor.setText(largeSample);

    var scrollSpy = jasmine.createSpy('didScroll');
    minimap.onDidChangeScrollLeft(scrollSpy);

    // Seems like text without a view aren't able to scroll horizontally
    // even when its width was set.
    spyOn(editorElement, 'getScrollWidth').andReturn(10000);

    editorElement.setScrollLeft(100);

    expect(scrollSpy).toHaveBeenCalled();
  });

  describe('when scrols past end is enabled', function () {
    beforeEach(function () {
      editor.setText(largeSample);
      atom.config.set('editor.scrollPastEnd', true);
    });

    it('adjust the scrolling ratio', function () {
      editorElement.setScrollTop(editorElement.getScrollHeight());

      var maxScrollTop = editorElement.getScrollHeight() - editorElement.getHeight() - (editorElement.getHeight() - 3 * editor.displayBuffer.getLineHeightInPixels());

      expect(minimap.getTextEditorScrollRatio()).toEqual(editorElement.getScrollTop() / maxScrollTop);
    });

    it('lock the minimap scroll top to 1', function () {
      editorElement.setScrollTop(editorElement.getScrollHeight());
      expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
    });

    describe('getTextEditorScrollRatio(), when getScrollTop() and maxScrollTop both equal 0', function () {
      beforeEach(function () {
        editor.setText(smallSample);
        editorElement.setHeight(40);
        atom.config.set('editor.scrollPastEnd', true);
      });

      it('returns 0', function () {
        editorElement.setScrollTop(0);
        expect(minimap.getTextEditorScrollRatio()).toEqual(0);
      });
    });
  });

  describe('when soft wrap is enabled', function () {
    beforeEach(function () {
      atom.config.set('editor.softWrap', true);
      atom.config.set('editor.softWrapAtPreferredLineLength', true);
      atom.config.set('editor.preferredLineLength', 2);
    });

    it('measures the minimap using screen lines', function () {
      editor.setText(smallSample);
      expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);

      editor.setText(largeSample);
      expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
    });
  });

  describe('when there is no scrolling needed to display the whole minimap', function () {
    it('returns 0 when computing the minimap scroll', function () {
      expect(minimap.getScrollTop()).toEqual(0);
    });

    it('returns 0 when measuring the available minimap scroll', function () {
      editor.setText(smallSample);

      expect(minimap.getMaxScrollTop()).toEqual(0);
      expect(minimap.canScroll()).toBeFalsy();
    });
  });

  describe('when the editor is scrolled', function () {
    var _ref2 = [];
    var largeLineCount = _ref2[0];
    var editorHeight = _ref2[1];
    var editorScrollRatio = _ref2[2];

    beforeEach(function () {
      // Same here, without a view, the getScrollWidth method always returns 1
      // and the test fails because the capped scroll left value always end up
      // to be 0, inducing errors in computations.
      spyOn(editorElement, 'getScrollWidth').andReturn(10000);

      editor.setText(largeSample);
      editorElement.setScrollTop(1000);
      editorElement.setScrollLeft(200);

      largeLineCount = editor.getScreenLineCount();
      editorHeight = largeLineCount * editor.getLineHeightInPixels();
      editorScrollRatio = editorElement.getScrollTop() / (editorElement.getScrollHeight() - editorElement.getHeight());
    });

    it('scales the editor scroll based on the minimap scale factor', function () {
      expect(minimap.getTextEditorScaledScrollTop()).toEqual(1000 * minimapVerticalScaleFactor);
      expect(minimap.getTextEditorScaledScrollLeft()).toEqual(200 * minimapHorizontalScaleFactor);
    });

    it('computes the offset to apply based on the editor scroll top', function () {
      expect(minimap.getScrollTop()).toEqual(editorScrollRatio * minimap.getMaxScrollTop());
    });

    it('computes the first visible row in the minimap', function () {
      expect(minimap.getFirstVisibleScreenRow()).toEqual(58);
    });

    it('computes the last visible row in the minimap', function () {
      expect(minimap.getLastVisibleScreenRow()).toEqual(69);
    });

    describe('down to the bottom', function () {
      beforeEach(function () {
        editorElement.setScrollTop(editorElement.getScrollHeight());
        editorScrollRatio = editorElement.getScrollTop() / editorElement.getScrollHeight();
      });

      it('computes an offset that scrolls the minimap to the bottom edge', function () {
        expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
      });

      it('computes the first visible row in the minimap', function () {
        expect(minimap.getFirstVisibleScreenRow()).toEqual(largeLineCount - 10);
      });

      it('computes the last visible row in the minimap', function () {
        expect(minimap.getLastVisibleScreenRow()).toEqual(largeLineCount);
      });
    });
  });

  describe('destroying the model', function () {
    it('emits a did-destroy event', function () {
      var spy = jasmine.createSpy('destroy');
      minimap.onDidDestroy(spy);

      minimap.destroy();

      expect(spy).toHaveBeenCalled();
    });

    it('returns true when asked if destroyed', function () {
      minimap.destroy();
      expect(minimap.isDestroyed()).toBeTruthy();
    });
  });

  describe('destroying the text editor', function () {
    it('destroys the model', function () {
      spyOn(minimap, 'destroy');

      editor.destroy();

      expect(minimap.destroy).toHaveBeenCalled();
    });
  });

  //    ########  ########  ######   #######
  //    ##     ## ##       ##    ## ##     ##
  //    ##     ## ##       ##       ##     ##
  //    ##     ## ######   ##       ##     ##
  //    ##     ## ##       ##       ##     ##
  //    ##     ## ##       ##    ## ##     ##
  //    ########  ########  ######   #######

  describe('::decorateMarker', function () {
    var _ref3 = [];
    var marker = _ref3[0];
    var decoration = _ref3[1];
    var changeSpy = _ref3[2];

    beforeEach(function () {
      editor.setText(largeSample);

      changeSpy = jasmine.createSpy('didChange');
      minimap.onDidChangeDecorationRange(changeSpy);

      marker = minimap.markBufferRange([[0, 6], [1, 11]]);
      decoration = minimap.decorateMarker(marker, { type: 'highlight', 'class': 'dummy' });
    });

    it('creates a decoration for the given marker', function () {
      expect(minimap.decorationsByMarkerId[marker.id]).toBeDefined();
    });

    it('creates a change corresponding to the marker range', function () {
      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.calls[0].args[0].start).toEqual(0);
      expect(changeSpy.calls[0].args[0].end).toEqual(1);
    });

    describe('when the marker range changes', function () {
      beforeEach(function () {
        var markerChangeSpy = jasmine.createSpy('marker-did-change');
        marker.onDidChange(markerChangeSpy);
        marker.setBufferRange([[0, 6], [3, 11]]);

        waitsFor(function () {
          return markerChangeSpy.calls.length > 0;
        });
      });

      it('creates a change only for the dif between the two ranges', function () {
        expect(changeSpy).toHaveBeenCalled();
        expect(changeSpy.calls[1].args[0].start).toEqual(1);
        expect(changeSpy.calls[1].args[0].end).toEqual(3);
      });
    });

    describe('destroying the marker', function () {
      beforeEach(function () {
        marker.destroy();
      });

      it('removes the decoration from the render view', function () {
        expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
      });

      it('creates a change corresponding to the marker range', function () {
        expect(changeSpy.calls[1].args[0].start).toEqual(0);
        expect(changeSpy.calls[1].args[0].end).toEqual(1);
      });
    });

    describe('destroying the decoration', function () {
      beforeEach(function () {
        decoration.destroy();
      });

      it('removes the decoration from the render view', function () {
        expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
      });

      it('creates a change corresponding to the marker range', function () {
        expect(changeSpy.calls[1].args[0].start).toEqual(0);
        expect(changeSpy.calls[1].args[0].end).toEqual(1);
      });
    });

    describe('destroying all the decorations for the marker', function () {
      beforeEach(function () {
        minimap.removeAllDecorationsForMarker(marker);
      });

      it('removes the decoration from the render view', function () {
        expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
      });

      it('creates a change corresponding to the marker range', function () {
        expect(changeSpy.calls[1].args[0].start).toEqual(0);
        expect(changeSpy.calls[1].args[0].end).toEqual(1);
      });
    });

    describe('destroying the minimap', function () {
      beforeEach(function () {
        minimap.destroy();
      });

      it('removes all the previously added decorations', function () {
        expect(minimap.decorationsById).toEqual({});
        expect(minimap.decorationsByMarkerId).toEqual({});
      });

      it('prevents the creation of new decorations', function () {
        marker = editor.markBufferRange([[0, 6], [0, 11]]);
        decoration = minimap.decorateMarker(marker, { type: 'highlight', 'class': 'dummy' });

        expect(decoration).toBeUndefined();
      });
    });
  });

  describe('::decorationsByTypeThenRows', function () {
    var _ref4 = [];
    var decorations = _ref4[0];

    beforeEach(function () {
      editor.setText(largeSample);

      var createDecoration = function createDecoration(type, range) {
        var decoration = undefined;
        var marker = minimap.markBufferRange(range);
        decoration = minimap.decorateMarker(marker, { type: type });
      };

      createDecoration('highlight', [[6, 0], [11, 0]]);
      createDecoration('highlight', [[7, 0], [8, 0]]);
      createDecoration('highlight-over', [[1, 0], [2, 0]]);
      createDecoration('line', [[3, 0], [4, 0]]);
      createDecoration('line', [[12, 0], [12, 0]]);
      createDecoration('highlight-under', [[0, 0], [10, 1]]);

      decorations = minimap.decorationsByTypeThenRows(0, 12);
    });

    it('returns an object whose keys are the decorations types', function () {
      expect(Object.keys(decorations).sort()).toEqual(['highlight-over', 'highlight-under', 'line']);
    });

    it('stores decorations by rows within each type objects', function () {
      expect(Object.keys(decorations['highlight-over']).sort()).toEqual('1 2 6 7 8 9 10 11'.split(' ').sort());

      expect(Object.keys(decorations['line']).sort()).toEqual('3 4 12'.split(' ').sort());

      expect(Object.keys(decorations['highlight-under']).sort()).toEqual('0 1 2 3 4 5 6 7 8 9 10'.split(' ').sort());
    });

    it('stores the decorations spanning a row in the corresponding row array', function () {
      expect(decorations['highlight-over']['7'].length).toEqual(2);

      expect(decorations['line']['3'].length).toEqual(1);

      expect(decorations['highlight-under']['5'].length).toEqual(1);
    });
  });
});

//     ######  ########    ###    ##    ## ########
//    ##    ##    ##      ## ##   ###   ## ##     ##
//    ##          ##     ##   ##  ####  ## ##     ##
//     ######     ##    ##     ## ## ## ## ##     ##
//          ##    ##    ######### ##  #### ##     ##
//    ##    ##    ##    ##     ## ##   ### ##     ##
//     ######     ##    ##     ## ##    ## ########
//
//       ###    ##        #######  ##    ## ########
//      ## ##   ##       ##     ## ###   ## ##
//     ##   ##  ##       ##     ## ####  ## ##
//    ##     ## ##       ##     ## ## ## ## ######
//    ######### ##       ##     ## ##  #### ##
//    ##     ## ##       ##     ## ##   ### ##
//    ##     ## ########  #######  ##    ## ########

describe('Stand alone minimap', function () {
  var _ref5 = [];
  var editor = _ref5[0];
  var editorElement = _ref5[1];
  var minimap = _ref5[2];
  var largeSample = _ref5[3];
  var smallSample = _ref5[4];

  beforeEach(function () {
    atom.config.set('minimap.charHeight', 4);
    atom.config.set('minimap.charWidth', 2);
    atom.config.set('minimap.interline', 1);

    editor = atom.workspace.buildTextEditor({});
    editorElement = atom.views.getView(editor);
    jasmine.attachToDOM(editorElement);
    editorElement.setHeight(50);
    editorElement.setWidth(200);
    editor.setLineHeightInPixels(10);

    var dir = atom.project.getDirectories()[0];

    minimap = new _libMinimap2['default']({
      textEditor: editor,
      standAlone: true
    });

    largeSample = _fsPlus2['default'].readFileSync(dir.resolve('large-file.coffee')).toString();
    smallSample = _fsPlus2['default'].readFileSync(dir.resolve('sample.coffee')).toString();
  });

  it('has an associated editor', function () {
    expect(minimap.getTextEditor()).toEqual(editor);
  });

  it('measures the minimap size based on the current editor content', function () {
    editor.setText(smallSample);
    expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);

    editor.setText(largeSample);
    expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
  });

  it('measures the scaling factor between the editor and the minimap', function () {
    expect(minimap.getVerticalScaleFactor()).toEqual(0.5);
    expect(minimap.getHorizontalScaleFactor()).toEqual(2 / editor.getDefaultCharWidth());
  });

  it('measures the editor visible area size at minimap scale', function () {
    editor.setText(largeSample);
    expect(minimap.getTextEditorScaledHeight()).toEqual(25);
  });

  it('has a visible height based on the passed-in options', function () {
    expect(minimap.getVisibleHeight()).toEqual(5);

    editor.setText(smallSample);
    expect(minimap.getVisibleHeight()).toEqual(20);

    editor.setText(largeSample);
    expect(minimap.getVisibleHeight()).toEqual(editor.getScreenLineCount() * 5);

    minimap.height = 100;
    expect(minimap.getVisibleHeight()).toEqual(100);
  });

  it('has a visible width based on the passed-in options', function () {
    expect(minimap.getVisibleWidth()).toEqual(0);

    editor.setText(smallSample);
    expect(minimap.getVisibleWidth()).toEqual(36);

    editor.setText(largeSample);
    expect(minimap.getVisibleWidth()).toEqual(editor.getMaxScreenLineLength() * 2);

    minimap.width = 50;
    expect(minimap.getVisibleWidth()).toEqual(50);
  });

  it('measures the available minimap scroll', function () {
    editor.setText(largeSample);
    var largeLineCount = editor.getScreenLineCount();

    expect(minimap.getMaxScrollTop()).toEqual(0);
    expect(minimap.canScroll()).toBeFalsy();

    minimap.height = 100;

    expect(minimap.getMaxScrollTop()).toEqual(largeLineCount * 5 - 100);
    expect(minimap.canScroll()).toBeTruthy();
  });

  it('computes the first visible row in the minimap', function () {
    expect(minimap.getFirstVisibleScreenRow()).toEqual(0);
  });

  it('computes the last visible row in the minimap', function () {
    editor.setText(largeSample);

    expect(minimap.getLastVisibleScreenRow()).toEqual(editor.getScreenLineCount());

    minimap.height = 100;
    expect(minimap.getLastVisibleScreenRow()).toEqual(20);
  });

  it('does not relay scroll top events from the editor', function () {
    editor.setText(largeSample);

    var scrollSpy = jasmine.createSpy('didScroll');
    minimap.onDidChangeScrollTop(scrollSpy);

    editorElement.setScrollTop(100);

    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it('does not relay scroll left events from the editor', function () {
    editor.setText(largeSample);

    var scrollSpy = jasmine.createSpy('didScroll');
    minimap.onDidChangeScrollLeft(scrollSpy);

    // Seems like text without a view aren't able to scroll horizontally
    // even when its width was set.
    spyOn(editorElement, 'getScrollWidth').andReturn(10000);

    editorElement.setScrollLeft(100);

    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it('has a scroll top that is not bound to the text editor', function () {
    var scrollSpy = jasmine.createSpy('didScroll');
    minimap.onDidChangeScrollTop(scrollSpy);

    editor.setText(largeSample);
    editorElement.setScrollTop(1000);

    expect(minimap.getScrollTop()).toEqual(0);
    expect(scrollSpy).not.toHaveBeenCalled();

    minimap.setScrollTop(10);

    expect(minimap.getScrollTop()).toEqual(10);
    expect(scrollSpy).toHaveBeenCalled();
  });

  it('has rendering properties that can overrides the config values', function () {
    minimap.setCharWidth(8.5);
    minimap.setCharHeight(10.2);
    minimap.setInterline(10.6);

    expect(minimap.getCharWidth()).toEqual(8);
    expect(minimap.getCharHeight()).toEqual(10);
    expect(minimap.getInterline()).toEqual(10);
    expect(minimap.getLineHeight()).toEqual(20);
  });

  it('emits a config change event when a value is changed', function () {
    var changeSpy = jasmine.createSpy('did-change');
    minimap.onDidChangeConfig(changeSpy);

    minimap.setCharWidth(8.5);
    minimap.setCharHeight(10.2);
    minimap.setInterline(10.6);

    expect(changeSpy.callCount).toEqual(3);
  });

  it('returns the rounding number of devicePixelRatio', function () {
    devicePixelRatio = 1.25;

    minimap.setDevicePixelRatioRounding(true);

    expect(minimap.getDevicePixelRatioRounding()).toEqual(true);
    expect(minimap.getDevicePixelRatio()).toEqual(1);
  });

  it('prevents the rounding number of devicePixelRatio', function () {
    devicePixelRatio = 1.25;

    minimap.setDevicePixelRatioRounding(false);

    expect(minimap.getDevicePixelRatioRounding()).toEqual(false);
    expect(minimap.getDevicePixelRatio()).toEqual(1.25);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9taW5pbWFwLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7UUFFTyxxQkFBcUI7O3NCQUViLFNBQVM7Ozs7MEJBQ0osZ0JBQWdCOzs7O0FBTHBDLFdBQVcsQ0FBQTs7QUFPWCxRQUFRLENBQUMsU0FBUyxFQUFFLFlBQU07YUFDbUcsRUFBRTtNQUF4SCxNQUFNO01BQUUsYUFBYTtNQUFFLE9BQU87TUFBRSxXQUFXO01BQUUsV0FBVztNQUFFLDBCQUEwQjtNQUFFLDRCQUE0Qjs7QUFFdkgsWUFBVSxDQUFDLFlBQU07QUFDZixRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN4QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN2QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFdkMsVUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFBOztBQUUzQyxpQkFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzFDLFdBQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDbEMsaUJBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDM0IsaUJBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRTNCLDhCQUEwQixHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtBQUMvRCxnQ0FBNEIsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUE7O0FBRS9ELFFBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENB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LFdBQU8sQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsQ0FBQTs7QUFFekMsVUFBTSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzNELFVBQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUNqRCxDQUFDLENBQUE7O0FBRUYsSUFBRSxDQUFDLGtEQUFrRCxFQUFFLFlBQU07QUFDM0Qsb0JBQWdCLEdBQUcsSUFBSSxDQUFBOztBQUV2QixXQUFPLENBQUMsMkJBQTJCLENBQUMsS0FBSyxDQUFDLENBQUE7O0FBRTFDLFVBQU0sQ0FBQyxPQUFPLENBQUMsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1RCxVQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDcEQsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9taW5pbWFwLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgJy4vaGVscGVycy93b3Jrc3BhY2UnXG5cbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IE1pbmltYXAgZnJvbSAnLi4vbGliL21pbmltYXAnXG5cbmRlc2NyaWJlKCdNaW5pbWFwJywgKCkgPT4ge1xuICBsZXQgW2VkaXRvciwgZWRpdG9yRWxlbWVudCwgbWluaW1hcCwgbGFyZ2VTYW1wbGUsIHNtYWxsU2FtcGxlLCBtaW5pbWFwVmVydGljYWxTY2FsZUZhY3RvciwgbWluaW1hcEhvcml6b250YWxTY2FsZUZhY3Rvcl0gPSBbXVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5jaGFySGVpZ2h0JywgNClcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuY2hhcldpZHRoJywgMilcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuaW50ZXJsaW5lJywgMSlcblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcih7fSlcblxuICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgIGphc21pbmUuYXR0YWNoVG9ET00oZWRpdG9yRWxlbWVudClcbiAgICBlZGl0b3JFbGVtZW50LnNldEhlaWdodCg1MClcbiAgICBlZGl0b3JFbGVtZW50LnNldFdpZHRoKDIwMClcblxuICAgIG1pbmltYXBWZXJ0aWNhbFNjYWxlRmFjdG9yID0gNSAvIGVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuICAgIG1pbmltYXBIb3Jpem9udGFsU2NhbGVGYWN0b3IgPSAyIC8gZWRpdG9yLmdldERlZmF1bHRDaGFyV2lkdGgoKVxuXG4gICAgbGV0IGRpciA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdXG5cbiAgICBtaW5pbWFwID0gbmV3IE1pbmltYXAoe3RleHRFZGl0b3I6IGVkaXRvcn0pXG4gICAgbGFyZ2VTYW1wbGUgPSBmcy5yZWFkRmlsZVN5bmMoZGlyLnJlc29sdmUoJ2xhcmdlLWZpbGUuY29mZmVlJykpLnRvU3RyaW5nKClcbiAgICBzbWFsbFNhbXBsZSA9IGZzLnJlYWRGaWxlU3luYyhkaXIucmVzb2x2ZSgnc2FtcGxlLmNvZmZlZScpKS50b1N0cmluZygpXG4gIH0pXG5cbiAgaXQoJ2hhcyBhbiBhc3NvY2lhdGVkIGVkaXRvcicsICgpID0+IHtcbiAgICBleHBlY3QobWluaW1hcC5nZXRUZXh0RWRpdG9yKCkpLnRvRXF1YWwoZWRpdG9yKVxuICB9KVxuXG4gIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gYXNrZWQgaWYgZGVzdHJveWVkJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmlzRGVzdHJveWVkKCkpLnRvQmVGYWxzeSgpXG4gIH0pXG5cbiAgaXQoJ3JhaXNlIGFuIGV4Y2VwdGlvbiBpZiBjcmVhdGVkIHdpdGhvdXQgYSB0ZXh0IGVkaXRvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4geyByZXR1cm4gbmV3IE1pbmltYXAoKSB9KS50b1Rocm93KClcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIG1pbmltYXAgc2l6ZSBiYXNlZCBvbiB0aGUgY3VycmVudCBlZGl0b3IgY29udGVudCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChzbWFsbFNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRIZWlnaHQoKSkudG9FcXVhbChlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiA1KVxuXG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0SGVpZ2h0KCkpLnRvRXF1YWwoZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpICogNSlcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIHNjYWxpbmcgZmFjdG9yIGJldHdlZW4gdGhlIGVkaXRvciBhbmQgdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmVydGljYWxTY2FsZUZhY3RvcigpKS50b0VxdWFsKG1pbmltYXBWZXJ0aWNhbFNjYWxlRmFjdG9yKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldEhvcml6b250YWxTY2FsZUZhY3RvcigpKS50b0VxdWFsKG1pbmltYXBIb3Jpem9udGFsU2NhbGVGYWN0b3IpXG4gIH0pXG5cbiAgaXQoJ21lYXN1cmVzIHRoZSBlZGl0b3IgdmlzaWJsZSBhcmVhIHNpemUgYXQgbWluaW1hcCBzY2FsZScsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRUZXh0RWRpdG9yU2NhbGVkSGVpZ2h0KCkpLnRvRXF1YWwoNTAgKiBtaW5pbWFwVmVydGljYWxTY2FsZUZhY3RvcilcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIGF2YWlsYWJsZSBtaW5pbWFwIHNjcm9sbCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBsZXQgbGFyZ2VMaW5lQ291bnQgPSBlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KClcblxuICAgIGV4cGVjdChtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKS50b0VxdWFsKGxhcmdlTGluZUNvdW50ICogNSAtIDUwKVxuICAgIGV4cGVjdChtaW5pbWFwLmNhblNjcm9sbCgpKS50b0JlVHJ1dGh5KClcbiAgfSlcblxuICBpdCgnY29tcHV0ZXMgdGhlIGZpcnN0IHZpc2libGUgcm93IGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpKS50b0VxdWFsKDApXG4gIH0pXG5cbiAgaXQoJ2NvbXB1dGVzIHRoZSBsYXN0IHZpc2libGUgcm93IGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwoMTApXG4gIH0pXG5cbiAgaXQoJ3JlbGF5cyBjaGFuZ2UgZXZlbnRzIGZyb20gdGhlIHRleHQgZWRpdG9yJywgKCkgPT4ge1xuICAgIGxldCBjaGFuZ2VTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkQ2hhbmdlJylcbiAgICBtaW5pbWFwLm9uRGlkQ2hhbmdlKGNoYW5nZVNweSlcblxuICAgIGVkaXRvci5zZXRUZXh0KCdmb28nKVxuXG4gICAgZXhwZWN0KGNoYW5nZVNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gIH0pXG5cbiAgaXQoJ3JlbGF5cyBzY3JvbGwgdG9wIGV2ZW50cyBmcm9tIHRoZSBlZGl0b3InLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG5cbiAgICBsZXQgc2Nyb2xsU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZFNjcm9sbCcpXG4gICAgbWluaW1hcC5vbkRpZENoYW5nZVNjcm9sbFRvcChzY3JvbGxTcHkpXG5cbiAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcCgxMDApXG5cbiAgICBleHBlY3Qoc2Nyb2xsU3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgfSlcblxuICBpdCgncmVsYXlzIHNjcm9sbCBsZWZ0IGV2ZW50cyBmcm9tIHRoZSBlZGl0b3InLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG5cbiAgICBsZXQgc2Nyb2xsU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZFNjcm9sbCcpXG4gICAgbWluaW1hcC5vbkRpZENoYW5nZVNjcm9sbExlZnQoc2Nyb2xsU3B5KVxuXG4gICAgLy8gU2VlbXMgbGlrZSB0ZXh0IHdpdGhvdXQgYSB2aWV3IGFyZW4ndCBhYmxlIHRvIHNjcm9sbCBob3Jpem9udGFsbHlcbiAgICAvLyBldmVuIHdoZW4gaXRzIHdpZHRoIHdhcyBzZXQuXG4gICAgc3B5T24oZWRpdG9yRWxlbWVudCwgJ2dldFNjcm9sbFdpZHRoJykuYW5kUmV0dXJuKDEwMDAwKVxuXG4gICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxMZWZ0KDEwMClcblxuICAgIGV4cGVjdChzY3JvbGxTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHNjcm9scyBwYXN0IGVuZCBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgdHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ2FkanVzdCB0aGUgc2Nyb2xsaW5nIHJhdGlvJywgKCkgPT4ge1xuICAgICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3AoZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKSlcblxuICAgICAgbGV0IG1heFNjcm9sbFRvcCA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsSGVpZ2h0KCkgLSBlZGl0b3JFbGVtZW50LmdldEhlaWdodCgpIC0gKGVkaXRvckVsZW1lbnQuZ2V0SGVpZ2h0KCkgLSAzICogZWRpdG9yLmRpc3BsYXlCdWZmZXIuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkpXG5cbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3JTY3JvbGxSYXRpbygpKS50b0VxdWFsKGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkgLyBtYXhTY3JvbGxUb3ApXG4gICAgfSlcblxuICAgIGl0KCdsb2NrIHRoZSBtaW5pbWFwIHNjcm9sbCB0b3AgdG8gMScsICgpID0+IHtcbiAgICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsSGVpZ2h0KCkpXG4gICAgICBleHBlY3QobWluaW1hcC5nZXRTY3JvbGxUb3AoKSkudG9FcXVhbChtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnZ2V0VGV4dEVkaXRvclNjcm9sbFJhdGlvKCksIHdoZW4gZ2V0U2Nyb2xsVG9wKCkgYW5kIG1heFNjcm9sbFRvcCBib3RoIGVxdWFsIDAnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgZWRpdG9yLnNldFRleHQoc21hbGxTYW1wbGUpXG4gICAgICAgIGVkaXRvckVsZW1lbnQuc2V0SGVpZ2h0KDQwKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgdHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdyZXR1cm5zIDAnLCAoKSA9PiB7XG4gICAgICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKDApXG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3JTY3JvbGxSYXRpbygpKS50b0VxdWFsKDApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gc29mdCB3cmFwIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5zb2Z0V3JhcCcsIHRydWUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5zb2Z0V3JhcEF0UHJlZmVycmVkTGluZUxlbmd0aCcsIHRydWUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5wcmVmZXJyZWRMaW5lTGVuZ3RoJywgMilcbiAgICB9KVxuXG4gICAgaXQoJ21lYXN1cmVzIHRoZSBtaW5pbWFwIHVzaW5nIHNjcmVlbiBsaW5lcycsICgpID0+IHtcbiAgICAgIGVkaXRvci5zZXRUZXh0KHNtYWxsU2FtcGxlKVxuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0SGVpZ2h0KCkpLnRvRXF1YWwoZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpICogNSlcblxuICAgICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgICBleHBlY3QobWluaW1hcC5nZXRIZWlnaHQoKSkudG9FcXVhbChlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiA1KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gdGhlcmUgaXMgbm8gc2Nyb2xsaW5nIG5lZWRlZCB0byBkaXNwbGF5IHRoZSB3aG9sZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIDAgd2hlbiBjb21wdXRpbmcgdGhlIG1pbmltYXAgc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwoMClcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgMCB3aGVuIG1lYXN1cmluZyB0aGUgYXZhaWxhYmxlIG1pbmltYXAgc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgZWRpdG9yLnNldFRleHQoc21hbGxTYW1wbGUpXG5cbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKS50b0VxdWFsKDApXG4gICAgICBleHBlY3QobWluaW1hcC5jYW5TY3JvbGwoKSkudG9CZUZhbHN5KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBlZGl0b3IgaXMgc2Nyb2xsZWQnLCAoKSA9PiB7XG4gICAgbGV0IFtsYXJnZUxpbmVDb3VudCwgZWRpdG9ySGVpZ2h0LCBlZGl0b3JTY3JvbGxSYXRpb10gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAvLyBTYW1lIGhlcmUsIHdpdGhvdXQgYSB2aWV3LCB0aGUgZ2V0U2Nyb2xsV2lkdGggbWV0aG9kIGFsd2F5cyByZXR1cm5zIDFcbiAgICAgIC8vIGFuZCB0aGUgdGVzdCBmYWlscyBiZWNhdXNlIHRoZSBjYXBwZWQgc2Nyb2xsIGxlZnQgdmFsdWUgYWx3YXlzIGVuZCB1cFxuICAgICAgLy8gdG8gYmUgMCwgaW5kdWNpbmcgZXJyb3JzIGluIGNvbXB1dGF0aW9ucy5cbiAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdnZXRTY3JvbGxXaWR0aCcpLmFuZFJldHVybigxMDAwMClcblxuICAgICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcCgxMDAwKVxuICAgICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxMZWZ0KDIwMClcblxuICAgICAgbGFyZ2VMaW5lQ291bnQgPSBlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KClcbiAgICAgIGVkaXRvckhlaWdodCA9IGxhcmdlTGluZUNvdW50ICogZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG4gICAgICBlZGl0b3JTY3JvbGxSYXRpbyA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkgLyAoZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKSAtIGVkaXRvckVsZW1lbnQuZ2V0SGVpZ2h0KCkpXG4gICAgfSlcblxuICAgIGl0KCdzY2FsZXMgdGhlIGVkaXRvciBzY3JvbGwgYmFzZWQgb24gdGhlIG1pbmltYXAgc2NhbGUgZmFjdG9yJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0VGV4dEVkaXRvclNjYWxlZFNjcm9sbFRvcCgpKS50b0VxdWFsKDEwMDAgKiBtaW5pbWFwVmVydGljYWxTY2FsZUZhY3RvcilcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRTY3JvbGxMZWZ0KCkpLnRvRXF1YWwoMjAwICogbWluaW1hcEhvcml6b250YWxTY2FsZUZhY3RvcilcbiAgICB9KVxuXG4gICAgaXQoJ2NvbXB1dGVzIHRoZSBvZmZzZXQgdG8gYXBwbHkgYmFzZWQgb24gdGhlIGVkaXRvciBzY3JvbGwgdG9wJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwoZWRpdG9yU2Nyb2xsUmF0aW8gKiBtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKVxuICAgIH0pXG5cbiAgICBpdCgnY29tcHV0ZXMgdGhlIGZpcnN0IHZpc2libGUgcm93IGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwoNTgpXG4gICAgfSlcblxuICAgIGl0KCdjb21wdXRlcyB0aGUgbGFzdCB2aXNpYmxlIHJvdyBpbiB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwoNjkpXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdkb3duIHRvIHRoZSBib3R0b20nLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3AoZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKSlcbiAgICAgICAgZWRpdG9yU2Nyb2xsUmF0aW8gPSBlZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpIC8gZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2NvbXB1dGVzIGFuIG9mZnNldCB0aGF0IHNjcm9sbHMgdGhlIG1pbmltYXAgdG8gdGhlIGJvdHRvbSBlZGdlJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWluaW1hcC5nZXRTY3JvbGxUb3AoKSkudG9FcXVhbChtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2NvbXB1dGVzIHRoZSBmaXJzdCB2aXNpYmxlIHJvdyBpbiB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwobGFyZ2VMaW5lQ291bnQgLSAxMClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdjb21wdXRlcyB0aGUgbGFzdCB2aXNpYmxlIHJvdyBpbiB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKSkudG9FcXVhbChsYXJnZUxpbmVDb3VudClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZGVzdHJveWluZyB0aGUgbW9kZWwnLCAoKSA9PiB7XG4gICAgaXQoJ2VtaXRzIGEgZGlkLWRlc3Ryb3kgZXZlbnQnLCAoKSA9PiB7XG4gICAgICBsZXQgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2Rlc3Ryb3knKVxuICAgICAgbWluaW1hcC5vbkRpZERlc3Ryb3koc3B5KVxuXG4gICAgICBtaW5pbWFwLmRlc3Ryb3koKVxuXG4gICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSB3aGVuIGFza2VkIGlmIGRlc3Ryb3llZCcsICgpID0+IHtcbiAgICAgIG1pbmltYXAuZGVzdHJveSgpXG4gICAgICBleHBlY3QobWluaW1hcC5pc0Rlc3Ryb3llZCgpKS50b0JlVHJ1dGh5KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdkZXN0cm95aW5nIHRoZSB0ZXh0IGVkaXRvcicsICgpID0+IHtcbiAgICBpdCgnZGVzdHJveXMgdGhlIG1vZGVsJywgKCkgPT4ge1xuICAgICAgc3B5T24obWluaW1hcCwnZGVzdHJveScpXG5cbiAgICAgIGVkaXRvci5kZXN0cm95KClcblxuICAgICAgZXhwZWN0KG1pbmltYXAuZGVzdHJveSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyAgICMjIyMjIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICMjICMjICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyMjIyMgICAjIyAgICAgICAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgIyMgIyMgICAgICMjXG4gIC8vICAgICMjIyMjIyMjICAjIyMjIyMjIyAgIyMjIyMjICAgIyMjIyMjI1xuXG4gIGRlc2NyaWJlKCc6OmRlY29yYXRlTWFya2VyJywgKCkgPT4ge1xuICAgIGxldCBbbWFya2VyLCBkZWNvcmF0aW9uLCBjaGFuZ2VTcHldID0gW11cblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG5cbiAgICAgIGNoYW5nZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWRDaGFuZ2UnKVxuICAgICAgbWluaW1hcC5vbkRpZENoYW5nZURlY29yYXRpb25SYW5nZShjaGFuZ2VTcHkpXG5cbiAgICAgIG1hcmtlciA9IG1pbmltYXAubWFya0J1ZmZlclJhbmdlKFtbMCw2XSwgWzEsMTFdXSlcbiAgICAgIGRlY29yYXRpb24gPSBtaW5pbWFwLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogJ2R1bW15J30pXG4gICAgfSlcblxuICAgIGl0KCdjcmVhdGVzIGEgZGVjb3JhdGlvbiBmb3IgdGhlIGdpdmVuIG1hcmtlcicsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwLmRlY29yYXRpb25zQnlNYXJrZXJJZFttYXJrZXIuaWRdKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdjcmVhdGVzIGEgY2hhbmdlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG1hcmtlciByYW5nZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChjaGFuZ2VTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsc1swXS5hcmdzWzBdLnN0YXJ0KS50b0VxdWFsKDApXG4gICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzBdLmFyZ3NbMF0uZW5kKS50b0VxdWFsKDEpXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBtYXJrZXIgcmFuZ2UgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBsZXQgbWFya2VyQ2hhbmdlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ21hcmtlci1kaWQtY2hhbmdlJylcbiAgICAgICAgbWFya2VyLm9uRGlkQ2hhbmdlKG1hcmtlckNoYW5nZVNweSlcbiAgICAgICAgbWFya2VyLnNldEJ1ZmZlclJhbmdlKFtbMCw2XSwgWzMsMTFdXSlcblxuICAgICAgICB3YWl0c0ZvcigoKSA9PiB7IHJldHVybiBtYXJrZXJDaGFuZ2VTcHkuY2FsbHMubGVuZ3RoID4gMCB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ2NyZWF0ZXMgYSBjaGFuZ2Ugb25seSBmb3IgdGhlIGRpZiBiZXR3ZWVuIHRoZSB0d28gcmFuZ2VzJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2hhbmdlU3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsc1sxXS5hcmdzWzBdLnN0YXJ0KS50b0VxdWFsKDEpXG4gICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbHNbMV0uYXJnc1swXS5lbmQpLnRvRXF1YWwoMylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdkZXN0cm95aW5nIHRoZSBtYXJrZXInLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3JlbW92ZXMgdGhlIGRlY29yYXRpb24gZnJvbSB0aGUgcmVuZGVyIHZpZXcnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmRlY29yYXRpb25zQnlNYXJrZXJJZFttYXJrZXIuaWRdKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdjcmVhdGVzIGEgY2hhbmdlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG1hcmtlciByYW5nZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsc1sxXS5hcmdzWzBdLnN0YXJ0KS50b0VxdWFsKDApXG4gICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbHNbMV0uYXJnc1swXS5lbmQpLnRvRXF1YWwoMSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdkZXN0cm95aW5nIHRoZSBkZWNvcmF0aW9uJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGRlY29yYXRpb24uZGVzdHJveSgpXG4gICAgICB9KVxuXG4gICAgICBpdCgncmVtb3ZlcyB0aGUgZGVjb3JhdGlvbiBmcm9tIHRoZSByZW5kZXIgdmlldycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF0pLnRvQmVVbmRlZmluZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2NyZWF0ZXMgYSBjaGFuZ2UgY29ycmVzcG9uZGluZyB0byB0aGUgbWFya2VyIHJhbmdlJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzFdLmFyZ3NbMF0uc3RhcnQpLnRvRXF1YWwoMClcbiAgICAgICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsc1sxXS5hcmdzWzBdLmVuZCkudG9FcXVhbCgxKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2Rlc3Ryb3lpbmcgYWxsIHRoZSBkZWNvcmF0aW9ucyBmb3IgdGhlIG1hcmtlcicsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBtaW5pbWFwLnJlbW92ZUFsbERlY29yYXRpb25zRm9yTWFya2VyKG1hcmtlcilcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdyZW1vdmVzIHRoZSBkZWNvcmF0aW9uIGZyb20gdGhlIHJlbmRlciB2aWV3JywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWluaW1hcC5kZWNvcmF0aW9uc0J5TWFya2VySWRbbWFya2VyLmlkXSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnY3JlYXRlcyBhIGNoYW5nZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBtYXJrZXIgcmFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbHNbMV0uYXJnc1swXS5zdGFydCkudG9FcXVhbCgwKVxuICAgICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzFdLmFyZ3NbMF0uZW5kKS50b0VxdWFsKDEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnZGVzdHJveWluZyB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBtaW5pbWFwLmRlc3Ryb3koKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3JlbW92ZXMgYWxsIHRoZSBwcmV2aW91c2x5IGFkZGVkIGRlY29yYXRpb25zJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWluaW1hcC5kZWNvcmF0aW9uc0J5SWQpLnRvRXF1YWwoe30pXG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmRlY29yYXRpb25zQnlNYXJrZXJJZCkudG9FcXVhbCh7fSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdwcmV2ZW50cyB0aGUgY3JlYXRpb24gb2YgbmV3IGRlY29yYXRpb25zJywgKCkgPT4ge1xuICAgICAgICBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKFtbMCw2XSwgWzAsMTFdXSlcbiAgICAgICAgZGVjb3JhdGlvbiA9IG1pbmltYXAuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiAnZHVtbXknfSlcblxuICAgICAgICBleHBlY3QoZGVjb3JhdGlvbikudG9CZVVuZGVmaW5lZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJzo6ZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93cycsICgpID0+IHtcbiAgICBsZXQgW2RlY29yYXRpb25zXSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuXG4gICAgICBsZXQgY3JlYXRlRGVjb3JhdGlvbiA9IGZ1bmN0aW9uKHR5cGUsIHJhbmdlKSB7XG4gICAgICAgIGxldCBkZWNvcmF0aW9uXG4gICAgICAgIGxldCBtYXJrZXIgPSBtaW5pbWFwLm1hcmtCdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgICAgZGVjb3JhdGlvbiA9IG1pbmltYXAuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZX0pXG4gICAgICB9XG5cbiAgICAgIGNyZWF0ZURlY29yYXRpb24oJ2hpZ2hsaWdodCcsIFtbNiwgMF0sIFsxMSwgMF1dKVxuICAgICAgY3JlYXRlRGVjb3JhdGlvbignaGlnaGxpZ2h0JywgW1s3LCAwXSwgWzgsIDBdXSlcbiAgICAgIGNyZWF0ZURlY29yYXRpb24oJ2hpZ2hsaWdodC1vdmVyJywgW1sxLCAwXSwgWzIsMF1dKVxuICAgICAgY3JlYXRlRGVjb3JhdGlvbignbGluZScsIFtbMywwXSwgWzQsMF1dKVxuICAgICAgY3JlYXRlRGVjb3JhdGlvbignbGluZScsIFtbMTIsMF0sIFsxMiwwXV0pXG4gICAgICBjcmVhdGVEZWNvcmF0aW9uKCdoaWdobGlnaHQtdW5kZXInLCBbWzAsMF0sIFsxMCwxXV0pXG5cbiAgICAgIGRlY29yYXRpb25zID0gbWluaW1hcC5kZWNvcmF0aW9uc0J5VHlwZVRoZW5Sb3dzKDAsIDEyKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBhbiBvYmplY3Qgd2hvc2Uga2V5cyBhcmUgdGhlIGRlY29yYXRpb25zIHR5cGVzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKGRlY29yYXRpb25zKS5zb3J0KCkpLnRvRXF1YWwoWydoaWdobGlnaHQtb3ZlcicsICdoaWdobGlnaHQtdW5kZXInLCAnbGluZSddKVxuICAgIH0pXG5cbiAgICBpdCgnc3RvcmVzIGRlY29yYXRpb25zIGJ5IHJvd3Mgd2l0aGluIGVhY2ggdHlwZSBvYmplY3RzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKGRlY29yYXRpb25zWydoaWdobGlnaHQtb3ZlciddKS5zb3J0KCkpXG4gICAgICAudG9FcXVhbCgnMSAyIDYgNyA4IDkgMTAgMTEnLnNwbGl0KCcgJykuc29ydCgpKVxuXG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMoZGVjb3JhdGlvbnNbJ2xpbmUnXSkuc29ydCgpKVxuICAgICAgLnRvRXF1YWwoJzMgNCAxMicuc3BsaXQoJyAnKS5zb3J0KCkpXG5cbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhkZWNvcmF0aW9uc1snaGlnaGxpZ2h0LXVuZGVyJ10pLnNvcnQoKSlcbiAgICAgIC50b0VxdWFsKCcwIDEgMiAzIDQgNSA2IDcgOCA5IDEwJy5zcGxpdCgnICcpLnNvcnQoKSlcbiAgICB9KVxuXG4gICAgaXQoJ3N0b3JlcyB0aGUgZGVjb3JhdGlvbnMgc3Bhbm5pbmcgYSByb3cgaW4gdGhlIGNvcnJlc3BvbmRpbmcgcm93IGFycmF5JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGRlY29yYXRpb25zWydoaWdobGlnaHQtb3ZlciddWyc3J10ubGVuZ3RoKS50b0VxdWFsKDIpXG5cbiAgICAgIGV4cGVjdChkZWNvcmF0aW9uc1snbGluZSddWyczJ10ubGVuZ3RoKS50b0VxdWFsKDEpXG5cbiAgICAgIGV4cGVjdChkZWNvcmF0aW9uc1snaGlnaGxpZ2h0LXVuZGVyJ11bJzUnXS5sZW5ndGgpLnRvRXF1YWwoMSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gICAgICMjIyMjIyAgIyMjIyMjIyMgICAgIyMjICAgICMjICAgICMjICMjIyMjIyMjXG4vLyAgICAjIyAgICAjIyAgICAjIyAgICAgICMjICMjICAgIyMjICAgIyMgIyMgICAgICMjXG4vLyAgICAjIyAgICAgICAgICAjIyAgICAgIyMgICAjIyAgIyMjIyAgIyMgIyMgICAgICMjXG4vLyAgICAgIyMjIyMjICAgICAjIyAgICAjIyAgICAgIyMgIyMgIyMgIyMgIyMgICAgICMjXG4vLyAgICAgICAgICAjIyAgICAjIyAgICAjIyMjIyMjIyMgIyMgICMjIyMgIyMgICAgICMjXG4vLyAgICAjIyAgICAjIyAgICAjIyAgICAjIyAgICAgIyMgIyMgICAjIyMgIyMgICAgICMjXG4vLyAgICAgIyMjIyMjICAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgIyMgIyMjIyMjIyNcbi8vXG4vLyAgICAgICAjIyMgICAgIyMgICAgICAgICMjIyMjIyMgICMjICAgICMjICMjIyMjIyMjXG4vLyAgICAgICMjICMjICAgIyMgICAgICAgIyMgICAgICMjICMjIyAgICMjICMjXG4vLyAgICAgIyMgICAjIyAgIyMgICAgICAgIyMgICAgICMjICMjIyMgICMjICMjXG4vLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICMjICMjICMjIyMjI1xuLy8gICAgIyMjIyMjIyMjICMjICAgICAgICMjICAgICAjIyAjIyAgIyMjIyAjI1xuLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjIyAgICMjIyAjI1xuLy8gICAgIyMgICAgICMjICMjIyMjIyMjICAjIyMjIyMjICAjIyAgICAjIyAjIyMjIyMjI1xuXG5kZXNjcmliZSgnU3RhbmQgYWxvbmUgbWluaW1hcCcsICgpID0+IHtcbiAgbGV0IFtlZGl0b3IsIGVkaXRvckVsZW1lbnQsIG1pbmltYXAsIGxhcmdlU2FtcGxlLCBzbWFsbFNhbXBsZV0gPSBbXVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5jaGFySGVpZ2h0JywgNClcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuY2hhcldpZHRoJywgMilcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuaW50ZXJsaW5lJywgMSlcblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcih7fSlcbiAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKGVkaXRvckVsZW1lbnQpXG4gICAgZWRpdG9yRWxlbWVudC5zZXRIZWlnaHQoNTApXG4gICAgZWRpdG9yRWxlbWVudC5zZXRXaWR0aCgyMDApXG4gICAgZWRpdG9yLnNldExpbmVIZWlnaHRJblBpeGVscygxMClcblxuICAgIGxldCBkaXIgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXVxuXG4gICAgbWluaW1hcCA9IG5ldyBNaW5pbWFwKHtcbiAgICAgIHRleHRFZGl0b3I6IGVkaXRvcixcbiAgICAgIHN0YW5kQWxvbmU6IHRydWVcbiAgICB9KVxuXG4gICAgbGFyZ2VTYW1wbGUgPSBmcy5yZWFkRmlsZVN5bmMoZGlyLnJlc29sdmUoJ2xhcmdlLWZpbGUuY29mZmVlJykpLnRvU3RyaW5nKClcbiAgICBzbWFsbFNhbXBsZSA9IGZzLnJlYWRGaWxlU3luYyhkaXIucmVzb2x2ZSgnc2FtcGxlLmNvZmZlZScpKS50b1N0cmluZygpXG4gIH0pXG5cbiAgaXQoJ2hhcyBhbiBhc3NvY2lhdGVkIGVkaXRvcicsICgpID0+IHtcbiAgICBleHBlY3QobWluaW1hcC5nZXRUZXh0RWRpdG9yKCkpLnRvRXF1YWwoZWRpdG9yKVxuICB9KVxuXG4gIGl0KCdtZWFzdXJlcyB0aGUgbWluaW1hcCBzaXplIGJhc2VkIG9uIHRoZSBjdXJyZW50IGVkaXRvciBjb250ZW50JywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KHNtYWxsU2FtcGxlKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldEhlaWdodCgpKS50b0VxdWFsKGVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKSAqIDUpXG5cbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRIZWlnaHQoKSkudG9FcXVhbChlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiA1KVxuICB9KVxuXG4gIGl0KCdtZWFzdXJlcyB0aGUgc2NhbGluZyBmYWN0b3IgYmV0d2VlbiB0aGUgZWRpdG9yIGFuZCB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICBleHBlY3QobWluaW1hcC5nZXRWZXJ0aWNhbFNjYWxlRmFjdG9yKCkpLnRvRXF1YWwoMC41KVxuICAgIGV4cGVjdChtaW5pbWFwLmdldEhvcml6b250YWxTY2FsZUZhY3RvcigpKS50b0VxdWFsKDIgLyBlZGl0b3IuZ2V0RGVmYXVsdENoYXJXaWR0aCgpKVxuICB9KVxuXG4gIGl0KCdtZWFzdXJlcyB0aGUgZWRpdG9yIHZpc2libGUgYXJlYSBzaXplIGF0IG1pbmltYXAgc2NhbGUnLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VGV4dEVkaXRvclNjYWxlZEhlaWdodCgpKS50b0VxdWFsKDI1KVxuICB9KVxuXG4gIGl0KCdoYXMgYSB2aXNpYmxlIGhlaWdodCBiYXNlZCBvbiB0aGUgcGFzc2VkLWluIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmlzaWJsZUhlaWdodCgpKS50b0VxdWFsKDUpXG5cbiAgICBlZGl0b3Iuc2V0VGV4dChzbWFsbFNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRWaXNpYmxlSGVpZ2h0KCkpLnRvRXF1YWwoMjApXG5cbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRWaXNpYmxlSGVpZ2h0KCkpLnRvRXF1YWwoZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpICogNSlcblxuICAgIG1pbmltYXAuaGVpZ2h0ID0gMTAwXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmlzaWJsZUhlaWdodCgpKS50b0VxdWFsKDEwMClcbiAgfSlcblxuICBpdCgnaGFzIGEgdmlzaWJsZSB3aWR0aCBiYXNlZCBvbiB0aGUgcGFzc2VkLWluIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmlzaWJsZVdpZHRoKCkpLnRvRXF1YWwoMClcblxuICAgIGVkaXRvci5zZXRUZXh0KHNtYWxsU2FtcGxlKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldFZpc2libGVXaWR0aCgpKS50b0VxdWFsKDM2KVxuXG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmlzaWJsZVdpZHRoKCkpLnRvRXF1YWwoZWRpdG9yLmdldE1heFNjcmVlbkxpbmVMZW5ndGgoKSAqIDIpXG5cbiAgICBtaW5pbWFwLndpZHRoID0gNTBcbiAgICBleHBlY3QobWluaW1hcC5nZXRWaXNpYmxlV2lkdGgoKSkudG9FcXVhbCg1MClcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIGF2YWlsYWJsZSBtaW5pbWFwIHNjcm9sbCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBsZXQgbGFyZ2VMaW5lQ291bnQgPSBlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KClcblxuICAgIGV4cGVjdChtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKS50b0VxdWFsKDApXG4gICAgZXhwZWN0KG1pbmltYXAuY2FuU2Nyb2xsKCkpLnRvQmVGYWxzeSgpXG5cbiAgICBtaW5pbWFwLmhlaWdodCA9IDEwMFxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0TWF4U2Nyb2xsVG9wKCkpLnRvRXF1YWwobGFyZ2VMaW5lQ291bnQgKiA1IC0gMTAwKVxuICAgIGV4cGVjdChtaW5pbWFwLmNhblNjcm9sbCgpKS50b0JlVHJ1dGh5KClcbiAgfSlcblxuICBpdCgnY29tcHV0ZXMgdGhlIGZpcnN0IHZpc2libGUgcm93IGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpKS50b0VxdWFsKDApXG4gIH0pXG5cbiAgaXQoJ2NvbXB1dGVzIHRoZSBsYXN0IHZpc2libGUgcm93IGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKSkudG9FcXVhbChlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkpXG5cbiAgICBtaW5pbWFwLmhlaWdodCA9IDEwMFxuICAgIGV4cGVjdChtaW5pbWFwLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwoMjApXG4gIH0pXG5cbiAgaXQoJ2RvZXMgbm90IHJlbGF5IHNjcm9sbCB0b3AgZXZlbnRzIGZyb20gdGhlIGVkaXRvcicsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcblxuICAgIGxldCBzY3JvbGxTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkU2Nyb2xsJylcbiAgICBtaW5pbWFwLm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKHNjcm9sbFNweSlcblxuICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKDEwMClcblxuICAgIGV4cGVjdChzY3JvbGxTcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgfSlcblxuICBpdCgnZG9lcyBub3QgcmVsYXkgc2Nyb2xsIGxlZnQgZXZlbnRzIGZyb20gdGhlIGVkaXRvcicsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcblxuICAgIGxldCBzY3JvbGxTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkU2Nyb2xsJylcbiAgICBtaW5pbWFwLm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdChzY3JvbGxTcHkpXG5cbiAgICAvLyBTZWVtcyBsaWtlIHRleHQgd2l0aG91dCBhIHZpZXcgYXJlbid0IGFibGUgdG8gc2Nyb2xsIGhvcml6b250YWxseVxuICAgIC8vIGV2ZW4gd2hlbiBpdHMgd2lkdGggd2FzIHNldC5cbiAgICBzcHlPbihlZGl0b3JFbGVtZW50LCAnZ2V0U2Nyb2xsV2lkdGgnKS5hbmRSZXR1cm4oMTAwMDApXG5cbiAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbExlZnQoMTAwKVxuXG4gICAgZXhwZWN0KHNjcm9sbFNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGl0KCdoYXMgYSBzY3JvbGwgdG9wIHRoYXQgaXMgbm90IGJvdW5kIHRvIHRoZSB0ZXh0IGVkaXRvcicsICgpID0+IHtcbiAgICBsZXQgc2Nyb2xsU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZFNjcm9sbCcpXG4gICAgbWluaW1hcC5vbkRpZENoYW5nZVNjcm9sbFRvcChzY3JvbGxTcHkpXG5cbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcCgxMDAwKVxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwoMClcbiAgICBleHBlY3Qoc2Nyb2xsU3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBtaW5pbWFwLnNldFNjcm9sbFRvcCgxMClcblxuICAgIGV4cGVjdChtaW5pbWFwLmdldFNjcm9sbFRvcCgpKS50b0VxdWFsKDEwKVxuICAgIGV4cGVjdChzY3JvbGxTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGl0KCdoYXMgcmVuZGVyaW5nIHByb3BlcnRpZXMgdGhhdCBjYW4gb3ZlcnJpZGVzIHRoZSBjb25maWcgdmFsdWVzJywgKCkgPT4ge1xuICAgIG1pbmltYXAuc2V0Q2hhcldpZHRoKDguNSlcbiAgICBtaW5pbWFwLnNldENoYXJIZWlnaHQoMTAuMilcbiAgICBtaW5pbWFwLnNldEludGVybGluZSgxMC42KVxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0Q2hhcldpZHRoKCkpLnRvRXF1YWwoOClcbiAgICBleHBlY3QobWluaW1hcC5nZXRDaGFySGVpZ2h0KCkpLnRvRXF1YWwoMTApXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0SW50ZXJsaW5lKCkpLnRvRXF1YWwoMTApXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0TGluZUhlaWdodCgpKS50b0VxdWFsKDIwKVxuICB9KVxuXG4gIGl0KCdlbWl0cyBhIGNvbmZpZyBjaGFuZ2UgZXZlbnQgd2hlbiBhIHZhbHVlIGlzIGNoYW5nZWQnLCAoKSA9PiB7XG4gICAgbGV0IGNoYW5nZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtY2hhbmdlJylcbiAgICBtaW5pbWFwLm9uRGlkQ2hhbmdlQ29uZmlnKGNoYW5nZVNweSlcblxuICAgIG1pbmltYXAuc2V0Q2hhcldpZHRoKDguNSlcbiAgICBtaW5pbWFwLnNldENoYXJIZWlnaHQoMTAuMilcbiAgICBtaW5pbWFwLnNldEludGVybGluZSgxMC42KVxuXG4gICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsQ291bnQpLnRvRXF1YWwoMylcbiAgfSlcblxuICBpdCgncmV0dXJucyB0aGUgcm91bmRpbmcgbnVtYmVyIG9mIGRldmljZVBpeGVsUmF0aW8nLCAoKSA9PiB7XG4gICAgZGV2aWNlUGl4ZWxSYXRpbyA9IDEuMjVcblxuICAgIG1pbmltYXAuc2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nKHRydWUpXG5cbiAgICBleHBlY3QobWluaW1hcC5nZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcoKSkudG9FcXVhbCh0cnVlKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldERldmljZVBpeGVsUmF0aW8oKSkudG9FcXVhbCgxKVxuICB9KVxuXG4gIGl0KCdwcmV2ZW50cyB0aGUgcm91bmRpbmcgbnVtYmVyIG9mIGRldmljZVBpeGVsUmF0aW8nLCAoKSA9PiB7XG4gICAgZGV2aWNlUGl4ZWxSYXRpbyA9IDEuMjVcblxuICAgIG1pbmltYXAuc2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nKGZhbHNlKVxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nKCkpLnRvRXF1YWwoZmFsc2UpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpKS50b0VxdWFsKDEuMjUpXG4gIH0pXG59KVxuIl19
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/minimap-spec.js

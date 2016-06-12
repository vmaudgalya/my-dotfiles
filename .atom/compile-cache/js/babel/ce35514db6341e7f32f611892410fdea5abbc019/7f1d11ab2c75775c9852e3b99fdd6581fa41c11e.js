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

      var maxScrollTop = editorElement.getScrollHeight() - editorElement.getHeight() - (editorElement.getHeight() - 3 * editor.getLineHeightInPixels());

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
    var editorScrollRatio = _ref2[1];

    beforeEach(function () {
      // Same here, without a view, the getScrollWidth method always returns 1
      // and the test fails because the capped scroll left value always end up
      // to be 0, inducing errors in computations.
      spyOn(editorElement, 'getScrollWidth').andReturn(10000);

      editor.setText(largeSample);
      editorElement.setScrollTop(1000);
      editorElement.setScrollLeft(200);

      largeLineCount = editor.getScreenLineCount();
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

  describe('with scoped settings', function () {
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.packages.activatePackage('language-javascript');
      });

      runs(function () {
        var opts = { scopeSelector: '.source.js' };

        atom.config.set('minimap.charHeight', 8, opts);
        atom.config.set('minimap.charWidth', 4, opts);
        atom.config.set('minimap.interline', 2, opts);

        editor.setGrammar(atom.grammars.grammarForScopeName('source.js'));
      });
    });

    it('honors the scoped settings for the current editor new grammar', function () {
      expect(minimap.getCharHeight()).toEqual(8);
      expect(minimap.getCharWidth()).toEqual(4);
      expect(minimap.getInterline()).toEqual(2);
    });
  });

  describe('when independentMinimapScroll is true', function () {
    var editorScrollRatio = undefined;
    beforeEach(function () {
      editor.setText(largeSample);
      editorElement.setScrollTop(1000);
      editorScrollRatio = editorElement.getScrollTop() / (editorElement.getScrollHeight() - editorElement.getHeight());

      atom.config.set('minimap.independentMinimapScroll', true);
    });

    it('ignores the scroll computed from the editor and return the one of the minimap instead', function () {
      expect(minimap.getScrollTop()).toEqual(editorScrollRatio * minimap.getMaxScrollTop());

      minimap.setScrollTop(200);

      expect(minimap.getScrollTop()).toEqual(200);
    });

    describe('scrolling the editor', function () {
      it('changes the minimap scroll top', function () {
        editorElement.setScrollTop(2000);

        expect(minimap.getScrollTop()).not.toEqual(editorScrollRatio * minimap.getMaxScrollTop());
      });
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

      function createDecoration(type, range) {
        var marker = minimap.markBufferRange(range);
        minimap.decorateMarker(marker, { type: type });
      }

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
    minimap.setScreenHeightAndWidth(100, 100);

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
    window.devicePixelRatio = 1.25;

    minimap.setDevicePixelRatioRounding(true);

    expect(minimap.getDevicePixelRatioRounding()).toEqual(true);
    expect(minimap.getDevicePixelRatio()).toEqual(1);
  });

  it('prevents the rounding number of devicePixelRatio', function () {
    window.devicePixelRatio = 1.25;

    minimap.setDevicePixelRatioRounding(false);

    expect(minimap.getDevicePixelRatioRounding()).toEqual(false);
    expect(minimap.getDevicePixelRatio()).toEqual(1.25);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9taW5pbWFwLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7UUFFTyxxQkFBcUI7O3NCQUViLFNBQVM7Ozs7MEJBQ0osZ0JBQWdCOzs7O0FBTHBDLFdBQVcsQ0FBQTs7QUFPWCxRQUFRLENBQUMsU0FBUyxFQUFFLFlBQU07YUFDbUcsRUFBRTtNQUF4SCxNQUFNO01BQUUsYUFBYTtNQUFFLE9BQU87TUFBRSxXQUFXO01BQUUsV0FBVztNQUFFLDBCQUEwQjtNQUFFLDRCQUE0Qjs7QUFFdkgsWUFBVSxDQUFDLFlBQU07QUFDZixRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN4QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN2QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFdkMsVUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFBOztBQUUzQyxpQkFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzFDLFdBQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDbEMsaUJBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDM0IsaUJBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRTNCLDhCQUEwQixHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtBQUMvRCxnQ0FBNEIsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUE7O0FBRS9ELFFBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENB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QUMsQ0FBQyxDQUFBO0dBQ2pELENBQUMsQ0FBQTs7QUFFRixJQUFFLENBQUMsa0RBQWtELEVBQUUsWUFBTTtBQUMzRCxVQUFNLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFBOztBQUU5QixXQUFPLENBQUMsMkJBQTJCLENBQUMsS0FBSyxDQUFDLENBQUE7O0FBRTFDLFVBQU0sQ0FBQyxPQUFPLENBQUMsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1RCxVQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDcEQsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9taW5pbWFwLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgJy4vaGVscGVycy93b3Jrc3BhY2UnXG5cbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IE1pbmltYXAgZnJvbSAnLi4vbGliL21pbmltYXAnXG5cbmRlc2NyaWJlKCdNaW5pbWFwJywgKCkgPT4ge1xuICBsZXQgW2VkaXRvciwgZWRpdG9yRWxlbWVudCwgbWluaW1hcCwgbGFyZ2VTYW1wbGUsIHNtYWxsU2FtcGxlLCBtaW5pbWFwVmVydGljYWxTY2FsZUZhY3RvciwgbWluaW1hcEhvcml6b250YWxTY2FsZUZhY3Rvcl0gPSBbXVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5jaGFySGVpZ2h0JywgNClcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuY2hhcldpZHRoJywgMilcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuaW50ZXJsaW5lJywgMSlcblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcih7fSlcblxuICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgIGphc21pbmUuYXR0YWNoVG9ET00oZWRpdG9yRWxlbWVudClcbiAgICBlZGl0b3JFbGVtZW50LnNldEhlaWdodCg1MClcbiAgICBlZGl0b3JFbGVtZW50LnNldFdpZHRoKDIwMClcblxuICAgIG1pbmltYXBWZXJ0aWNhbFNjYWxlRmFjdG9yID0gNSAvIGVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuICAgIG1pbmltYXBIb3Jpem9udGFsU2NhbGVGYWN0b3IgPSAyIC8gZWRpdG9yLmdldERlZmF1bHRDaGFyV2lkdGgoKVxuXG4gICAgbGV0IGRpciA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdXG5cbiAgICBtaW5pbWFwID0gbmV3IE1pbmltYXAoe3RleHRFZGl0b3I6IGVkaXRvcn0pXG4gICAgbGFyZ2VTYW1wbGUgPSBmcy5yZWFkRmlsZVN5bmMoZGlyLnJlc29sdmUoJ2xhcmdlLWZpbGUuY29mZmVlJykpLnRvU3RyaW5nKClcbiAgICBzbWFsbFNhbXBsZSA9IGZzLnJlYWRGaWxlU3luYyhkaXIucmVzb2x2ZSgnc2FtcGxlLmNvZmZlZScpKS50b1N0cmluZygpXG4gIH0pXG5cbiAgaXQoJ2hhcyBhbiBhc3NvY2lhdGVkIGVkaXRvcicsICgpID0+IHtcbiAgICBleHBlY3QobWluaW1hcC5nZXRUZXh0RWRpdG9yKCkpLnRvRXF1YWwoZWRpdG9yKVxuICB9KVxuXG4gIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gYXNrZWQgaWYgZGVzdHJveWVkJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmlzRGVzdHJveWVkKCkpLnRvQmVGYWxzeSgpXG4gIH0pXG5cbiAgaXQoJ3JhaXNlIGFuIGV4Y2VwdGlvbiBpZiBjcmVhdGVkIHdpdGhvdXQgYSB0ZXh0IGVkaXRvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4geyByZXR1cm4gbmV3IE1pbmltYXAoKSB9KS50b1Rocm93KClcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIG1pbmltYXAgc2l6ZSBiYXNlZCBvbiB0aGUgY3VycmVudCBlZGl0b3IgY29udGVudCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChzbWFsbFNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRIZWlnaHQoKSkudG9FcXVhbChlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiA1KVxuXG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0SGVpZ2h0KCkpLnRvRXF1YWwoZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpICogNSlcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIHNjYWxpbmcgZmFjdG9yIGJldHdlZW4gdGhlIGVkaXRvciBhbmQgdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmVydGljYWxTY2FsZUZhY3RvcigpKS50b0VxdWFsKG1pbmltYXBWZXJ0aWNhbFNjYWxlRmFjdG9yKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldEhvcml6b250YWxTY2FsZUZhY3RvcigpKS50b0VxdWFsKG1pbmltYXBIb3Jpem9udGFsU2NhbGVGYWN0b3IpXG4gIH0pXG5cbiAgaXQoJ21lYXN1cmVzIHRoZSBlZGl0b3IgdmlzaWJsZSBhcmVhIHNpemUgYXQgbWluaW1hcCBzY2FsZScsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRUZXh0RWRpdG9yU2NhbGVkSGVpZ2h0KCkpLnRvRXF1YWwoNTAgKiBtaW5pbWFwVmVydGljYWxTY2FsZUZhY3RvcilcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIGF2YWlsYWJsZSBtaW5pbWFwIHNjcm9sbCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBsZXQgbGFyZ2VMaW5lQ291bnQgPSBlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KClcblxuICAgIGV4cGVjdChtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKS50b0VxdWFsKGxhcmdlTGluZUNvdW50ICogNSAtIDUwKVxuICAgIGV4cGVjdChtaW5pbWFwLmNhblNjcm9sbCgpKS50b0JlVHJ1dGh5KClcbiAgfSlcblxuICBpdCgnY29tcHV0ZXMgdGhlIGZpcnN0IHZpc2libGUgcm93IGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpKS50b0VxdWFsKDApXG4gIH0pXG5cbiAgaXQoJ2NvbXB1dGVzIHRoZSBsYXN0IHZpc2libGUgcm93IGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwoMTApXG4gIH0pXG5cbiAgaXQoJ3JlbGF5cyBjaGFuZ2UgZXZlbnRzIGZyb20gdGhlIHRleHQgZWRpdG9yJywgKCkgPT4ge1xuICAgIGxldCBjaGFuZ2VTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkQ2hhbmdlJylcbiAgICBtaW5pbWFwLm9uRGlkQ2hhbmdlKGNoYW5nZVNweSlcblxuICAgIGVkaXRvci5zZXRUZXh0KCdmb28nKVxuXG4gICAgZXhwZWN0KGNoYW5nZVNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gIH0pXG5cbiAgaXQoJ3JlbGF5cyBzY3JvbGwgdG9wIGV2ZW50cyBmcm9tIHRoZSBlZGl0b3InLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG5cbiAgICBsZXQgc2Nyb2xsU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZFNjcm9sbCcpXG4gICAgbWluaW1hcC5vbkRpZENoYW5nZVNjcm9sbFRvcChzY3JvbGxTcHkpXG5cbiAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcCgxMDApXG5cbiAgICBleHBlY3Qoc2Nyb2xsU3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgfSlcblxuICBpdCgncmVsYXlzIHNjcm9sbCBsZWZ0IGV2ZW50cyBmcm9tIHRoZSBlZGl0b3InLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG5cbiAgICBsZXQgc2Nyb2xsU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZFNjcm9sbCcpXG4gICAgbWluaW1hcC5vbkRpZENoYW5nZVNjcm9sbExlZnQoc2Nyb2xsU3B5KVxuXG4gICAgLy8gU2VlbXMgbGlrZSB0ZXh0IHdpdGhvdXQgYSB2aWV3IGFyZW4ndCBhYmxlIHRvIHNjcm9sbCBob3Jpem9udGFsbHlcbiAgICAvLyBldmVuIHdoZW4gaXRzIHdpZHRoIHdhcyBzZXQuXG4gICAgc3B5T24oZWRpdG9yRWxlbWVudCwgJ2dldFNjcm9sbFdpZHRoJykuYW5kUmV0dXJuKDEwMDAwKVxuXG4gICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxMZWZ0KDEwMClcblxuICAgIGV4cGVjdChzY3JvbGxTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHNjcm9scyBwYXN0IGVuZCBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgdHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ2FkanVzdCB0aGUgc2Nyb2xsaW5nIHJhdGlvJywgKCkgPT4ge1xuICAgICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3AoZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKSlcblxuICAgICAgbGV0IG1heFNjcm9sbFRvcCA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsSGVpZ2h0KCkgLSBlZGl0b3JFbGVtZW50LmdldEhlaWdodCgpIC0gKGVkaXRvckVsZW1lbnQuZ2V0SGVpZ2h0KCkgLSAzICogZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpKVxuXG4gICAgICBleHBlY3QobWluaW1hcC5nZXRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8oKSkudG9FcXVhbChlZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpIC8gbWF4U2Nyb2xsVG9wKVxuICAgIH0pXG5cbiAgICBpdCgnbG9jayB0aGUgbWluaW1hcCBzY3JvbGwgdG9wIHRvIDEnLCAoKSA9PiB7XG4gICAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcChlZGl0b3JFbGVtZW50LmdldFNjcm9sbEhlaWdodCgpKVxuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwobWluaW1hcC5nZXRNYXhTY3JvbGxUb3AoKSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2dldFRleHRFZGl0b3JTY3JvbGxSYXRpbygpLCB3aGVuIGdldFNjcm9sbFRvcCgpIGFuZCBtYXhTY3JvbGxUb3AgYm90aCBlcXVhbCAwJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KHNtYWxsU2FtcGxlKVxuICAgICAgICBlZGl0b3JFbGVtZW50LnNldEhlaWdodCg0MClcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3Iuc2Nyb2xsUGFzdEVuZCcsIHRydWUpXG4gICAgICB9KVxuXG4gICAgICBpdCgncmV0dXJucyAwJywgKCkgPT4ge1xuICAgICAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcCgwKVxuICAgICAgICBleHBlY3QobWluaW1hcC5nZXRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8oKSkudG9FcXVhbCgwKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHNvZnQgd3JhcCBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3Iuc29mdFdyYXAnLCB0cnVlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3Iuc29mdFdyYXBBdFByZWZlcnJlZExpbmVMZW5ndGgnLCB0cnVlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3IucHJlZmVycmVkTGluZUxlbmd0aCcsIDIpXG4gICAgfSlcblxuICAgIGl0KCdtZWFzdXJlcyB0aGUgbWluaW1hcCB1c2luZyBzY3JlZW4gbGluZXMnLCAoKSA9PiB7XG4gICAgICBlZGl0b3Iuc2V0VGV4dChzbWFsbFNhbXBsZSlcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldEhlaWdodCgpKS50b0VxdWFsKGVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKSAqIDUpXG5cbiAgICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0SGVpZ2h0KCkpLnRvRXF1YWwoZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpICogNSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZXJlIGlzIG5vIHNjcm9sbGluZyBuZWVkZWQgdG8gZGlzcGxheSB0aGUgd2hvbGUgbWluaW1hcCcsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyAwIHdoZW4gY29tcHV0aW5nIHRoZSBtaW5pbWFwIHNjcm9sbCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldFNjcm9sbFRvcCgpKS50b0VxdWFsKDApXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIDAgd2hlbiBtZWFzdXJpbmcgdGhlIGF2YWlsYWJsZSBtaW5pbWFwIHNjcm9sbCcsICgpID0+IHtcbiAgICAgIGVkaXRvci5zZXRUZXh0KHNtYWxsU2FtcGxlKVxuXG4gICAgICBleHBlY3QobWluaW1hcC5nZXRNYXhTY3JvbGxUb3AoKSkudG9FcXVhbCgwKVxuICAgICAgZXhwZWN0KG1pbmltYXAuY2FuU2Nyb2xsKCkpLnRvQmVGYWxzeSgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiB0aGUgZWRpdG9yIGlzIHNjcm9sbGVkJywgKCkgPT4ge1xuICAgIGxldCBbbGFyZ2VMaW5lQ291bnQsIGVkaXRvclNjcm9sbFJhdGlvXSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIC8vIFNhbWUgaGVyZSwgd2l0aG91dCBhIHZpZXcsIHRoZSBnZXRTY3JvbGxXaWR0aCBtZXRob2QgYWx3YXlzIHJldHVybnMgMVxuICAgICAgLy8gYW5kIHRoZSB0ZXN0IGZhaWxzIGJlY2F1c2UgdGhlIGNhcHBlZCBzY3JvbGwgbGVmdCB2YWx1ZSBhbHdheXMgZW5kIHVwXG4gICAgICAvLyB0byBiZSAwLCBpbmR1Y2luZyBlcnJvcnMgaW4gY29tcHV0YXRpb25zLlxuICAgICAgc3B5T24oZWRpdG9yRWxlbWVudCwgJ2dldFNjcm9sbFdpZHRoJykuYW5kUmV0dXJuKDEwMDAwKVxuXG4gICAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKDEwMDApXG4gICAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbExlZnQoMjAwKVxuXG4gICAgICBsYXJnZUxpbmVDb3VudCA9IGVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKVxuICAgICAgZWRpdG9yU2Nyb2xsUmF0aW8gPSBlZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpIC8gKGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsSGVpZ2h0KCkgLSBlZGl0b3JFbGVtZW50LmdldEhlaWdodCgpKVxuICAgIH0pXG5cbiAgICBpdCgnc2NhbGVzIHRoZSBlZGl0b3Igc2Nyb2xsIGJhc2VkIG9uIHRoZSBtaW5pbWFwIHNjYWxlIGZhY3RvcicsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRTY3JvbGxUb3AoKSkudG9FcXVhbCgxMDAwICogbWluaW1hcFZlcnRpY2FsU2NhbGVGYWN0b3IpXG4gICAgICBleHBlY3QobWluaW1hcC5nZXRUZXh0RWRpdG9yU2NhbGVkU2Nyb2xsTGVmdCgpKS50b0VxdWFsKDIwMCAqIG1pbmltYXBIb3Jpem9udGFsU2NhbGVGYWN0b3IpXG4gICAgfSlcblxuICAgIGl0KCdjb21wdXRlcyB0aGUgb2Zmc2V0IHRvIGFwcGx5IGJhc2VkIG9uIHRoZSBlZGl0b3Igc2Nyb2xsIHRvcCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldFNjcm9sbFRvcCgpKS50b0VxdWFsKGVkaXRvclNjcm9sbFJhdGlvICogbWluaW1hcC5nZXRNYXhTY3JvbGxUb3AoKSlcbiAgICB9KVxuXG4gICAgaXQoJ2NvbXB1dGVzIHRoZSBmaXJzdCB2aXNpYmxlIHJvdyBpbiB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpKS50b0VxdWFsKDU4KVxuICAgIH0pXG5cbiAgICBpdCgnY29tcHV0ZXMgdGhlIGxhc3QgdmlzaWJsZSByb3cgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgICBleHBlY3QobWluaW1hcC5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpKS50b0VxdWFsKDY5KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnZG93biB0byB0aGUgYm90dG9tJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsSGVpZ2h0KCkpXG4gICAgICAgIGVkaXRvclNjcm9sbFJhdGlvID0gZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxUb3AoKSAvIGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsSGVpZ2h0KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdjb21wdXRlcyBhbiBvZmZzZXQgdGhhdCBzY3JvbGxzIHRoZSBtaW5pbWFwIHRvIHRoZSBib3R0b20gZWRnZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwobWluaW1hcC5nZXRNYXhTY3JvbGxUb3AoKSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdjb21wdXRlcyB0aGUgZmlyc3QgdmlzaWJsZSByb3cgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpKS50b0VxdWFsKGxhcmdlTGluZUNvdW50IC0gMTApXG4gICAgICB9KVxuXG4gICAgICBpdCgnY29tcHV0ZXMgdGhlIGxhc3QgdmlzaWJsZSByb3cgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwobGFyZ2VMaW5lQ291bnQpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2Rlc3Ryb3lpbmcgdGhlIG1vZGVsJywgKCkgPT4ge1xuICAgIGl0KCdlbWl0cyBhIGRpZC1kZXN0cm95IGV2ZW50JywgKCkgPT4ge1xuICAgICAgbGV0IHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkZXN0cm95JylcbiAgICAgIG1pbmltYXAub25EaWREZXN0cm95KHNweSlcblxuICAgICAgbWluaW1hcC5kZXN0cm95KClcblxuICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiBhc2tlZCBpZiBkZXN0cm95ZWQnLCAoKSA9PiB7XG4gICAgICBtaW5pbWFwLmRlc3Ryb3koKVxuICAgICAgZXhwZWN0KG1pbmltYXAuaXNEZXN0cm95ZWQoKSkudG9CZVRydXRoeSgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZGVzdHJveWluZyB0aGUgdGV4dCBlZGl0b3InLCAoKSA9PiB7XG4gICAgaXQoJ2Rlc3Ryb3lzIHRoZSBtb2RlbCcsICgpID0+IHtcbiAgICAgIHNweU9uKG1pbmltYXAsICdkZXN0cm95JylcblxuICAgICAgZWRpdG9yLmRlc3Ryb3koKVxuXG4gICAgICBleHBlY3QobWluaW1hcC5kZXN0cm95KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aXRoIHNjb3BlZCBzZXR0aW5ncycsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtamF2YXNjcmlwdCcpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0cyA9IHtzY29wZVNlbGVjdG9yOiAnLnNvdXJjZS5qcyd9XG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmNoYXJIZWlnaHQnLCA4LCBvcHRzKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuY2hhcldpZHRoJywgNCwgb3B0cylcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmludGVybGluZScsIDIsIG9wdHMpXG5cbiAgICAgICAgZWRpdG9yLnNldEdyYW1tYXIoYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKCdzb3VyY2UuanMnKSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdob25vcnMgdGhlIHNjb3BlZCBzZXR0aW5ncyBmb3IgdGhlIGN1cnJlbnQgZWRpdG9yIG5ldyBncmFtbWFyJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0Q2hhckhlaWdodCgpKS50b0VxdWFsKDgpXG4gICAgICBleHBlY3QobWluaW1hcC5nZXRDaGFyV2lkdGgoKSkudG9FcXVhbCg0KVxuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0SW50ZXJsaW5lKCkpLnRvRXF1YWwoMilcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIGluZGVwZW5kZW50TWluaW1hcFNjcm9sbCBpcyB0cnVlJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3JTY3JvbGxSYXRpb1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcCgxMDAwKVxuICAgICAgZWRpdG9yU2Nyb2xsUmF0aW8gPSBlZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpIC8gKGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsSGVpZ2h0KCkgLSBlZGl0b3JFbGVtZW50LmdldEhlaWdodCgpKVxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsJywgdHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ2lnbm9yZXMgdGhlIHNjcm9sbCBjb21wdXRlZCBmcm9tIHRoZSBlZGl0b3IgYW5kIHJldHVybiB0aGUgb25lIG9mIHRoZSBtaW5pbWFwIGluc3RlYWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QobWluaW1hcC5nZXRTY3JvbGxUb3AoKSkudG9FcXVhbChlZGl0b3JTY3JvbGxSYXRpbyAqIG1pbmltYXAuZ2V0TWF4U2Nyb2xsVG9wKCkpXG5cbiAgICAgIG1pbmltYXAuc2V0U2Nyb2xsVG9wKDIwMClcblxuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwoMjAwKVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnc2Nyb2xsaW5nIHRoZSBlZGl0b3InLCAoKSA9PiB7XG4gICAgICBpdCgnY2hhbmdlcyB0aGUgbWluaW1hcCBzY3JvbGwgdG9wJywgKCkgPT4ge1xuICAgICAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcCgyMDAwKVxuXG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmdldFNjcm9sbFRvcCgpKS5ub3QudG9FcXVhbChlZGl0b3JTY3JvbGxSYXRpbyAqIG1pbmltYXAuZ2V0TWF4U2Nyb2xsVG9wKCkpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gICAgIyMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMgICAjIyMjIyMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAjIyAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMjIyMjICAgIyMgICAgICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICMjICMjICAgICAjI1xuICAvLyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyAgICMjIyMjIyNcblxuICBkZXNjcmliZSgnOjpkZWNvcmF0ZU1hcmtlcicsICgpID0+IHtcbiAgICBsZXQgW21hcmtlciwgZGVjb3JhdGlvbiwgY2hhbmdlU3B5XSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuXG4gICAgICBjaGFuZ2VTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkQ2hhbmdlJylcbiAgICAgIG1pbmltYXAub25EaWRDaGFuZ2VEZWNvcmF0aW9uUmFuZ2UoY2hhbmdlU3B5KVxuXG4gICAgICBtYXJrZXIgPSBtaW5pbWFwLm1hcmtCdWZmZXJSYW5nZShbWzAsIDZdLCBbMSwgMTFdXSlcbiAgICAgIGRlY29yYXRpb24gPSBtaW5pbWFwLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogJ2R1bW15J30pXG4gICAgfSlcblxuICAgIGl0KCdjcmVhdGVzIGEgZGVjb3JhdGlvbiBmb3IgdGhlIGdpdmVuIG1hcmtlcicsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwLmRlY29yYXRpb25zQnlNYXJrZXJJZFttYXJrZXIuaWRdKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdjcmVhdGVzIGEgY2hhbmdlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG1hcmtlciByYW5nZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChjaGFuZ2VTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsc1swXS5hcmdzWzBdLnN0YXJ0KS50b0VxdWFsKDApXG4gICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzBdLmFyZ3NbMF0uZW5kKS50b0VxdWFsKDEpXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBtYXJrZXIgcmFuZ2UgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBsZXQgbWFya2VyQ2hhbmdlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ21hcmtlci1kaWQtY2hhbmdlJylcbiAgICAgICAgbWFya2VyLm9uRGlkQ2hhbmdlKG1hcmtlckNoYW5nZVNweSlcbiAgICAgICAgbWFya2VyLnNldEJ1ZmZlclJhbmdlKFtbMCwgNl0sIFszLCAxMV1dKVxuXG4gICAgICAgIHdhaXRzRm9yKCgpID0+IHsgcmV0dXJuIG1hcmtlckNoYW5nZVNweS5jYWxscy5sZW5ndGggPiAwIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnY3JlYXRlcyBhIGNoYW5nZSBvbmx5IGZvciB0aGUgZGlmIGJldHdlZW4gdGhlIHR3byByYW5nZXMnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjaGFuZ2VTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzFdLmFyZ3NbMF0uc3RhcnQpLnRvRXF1YWwoMSlcbiAgICAgICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsc1sxXS5hcmdzWzBdLmVuZCkudG9FcXVhbCgzKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2Rlc3Ryb3lpbmcgdGhlIG1hcmtlcicsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgICB9KVxuXG4gICAgICBpdCgncmVtb3ZlcyB0aGUgZGVjb3JhdGlvbiBmcm9tIHRoZSByZW5kZXIgdmlldycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF0pLnRvQmVVbmRlZmluZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2NyZWF0ZXMgYSBjaGFuZ2UgY29ycmVzcG9uZGluZyB0byB0aGUgbWFya2VyIHJhbmdlJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzFdLmFyZ3NbMF0uc3RhcnQpLnRvRXF1YWwoMClcbiAgICAgICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsc1sxXS5hcmdzWzBdLmVuZCkudG9FcXVhbCgxKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2Rlc3Ryb3lpbmcgdGhlIGRlY29yYXRpb24nLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgZGVjb3JhdGlvbi5kZXN0cm95KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdyZW1vdmVzIHRoZSBkZWNvcmF0aW9uIGZyb20gdGhlIHJlbmRlciB2aWV3JywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWluaW1hcC5kZWNvcmF0aW9uc0J5TWFya2VySWRbbWFya2VyLmlkXSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnY3JlYXRlcyBhIGNoYW5nZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBtYXJrZXIgcmFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbHNbMV0uYXJnc1swXS5zdGFydCkudG9FcXVhbCgwKVxuICAgICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzFdLmFyZ3NbMF0uZW5kKS50b0VxdWFsKDEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnZGVzdHJveWluZyBhbGwgdGhlIGRlY29yYXRpb25zIGZvciB0aGUgbWFya2VyJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIG1pbmltYXAucmVtb3ZlQWxsRGVjb3JhdGlvbnNGb3JNYXJrZXIobWFya2VyKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3JlbW92ZXMgdGhlIGRlY29yYXRpb24gZnJvbSB0aGUgcmVuZGVyIHZpZXcnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmRlY29yYXRpb25zQnlNYXJrZXJJZFttYXJrZXIuaWRdKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdjcmVhdGVzIGEgY2hhbmdlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG1hcmtlciByYW5nZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsc1sxXS5hcmdzWzBdLnN0YXJ0KS50b0VxdWFsKDApXG4gICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbHNbMV0uYXJnc1swXS5lbmQpLnRvRXF1YWwoMSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdkZXN0cm95aW5nIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIG1pbmltYXAuZGVzdHJveSgpXG4gICAgICB9KVxuXG4gICAgICBpdCgncmVtb3ZlcyBhbGwgdGhlIHByZXZpb3VzbHkgYWRkZWQgZGVjb3JhdGlvbnMnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmRlY29yYXRpb25zQnlJZCkudG9FcXVhbCh7fSlcbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZGVjb3JhdGlvbnNCeU1hcmtlcklkKS50b0VxdWFsKHt9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3ByZXZlbnRzIHRoZSBjcmVhdGlvbiBvZiBuZXcgZGVjb3JhdGlvbnMnLCAoKSA9PiB7XG4gICAgICAgIG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1swLCA2XSwgWzAsIDExXV0pXG4gICAgICAgIGRlY29yYXRpb24gPSBtaW5pbWFwLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogJ2R1bW15J30pXG5cbiAgICAgICAgZXhwZWN0KGRlY29yYXRpb24pLnRvQmVVbmRlZmluZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCc6OmRlY29yYXRpb25zQnlUeXBlVGhlblJvd3MnLCAoKSA9PiB7XG4gICAgbGV0IFtkZWNvcmF0aW9uc10gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcblxuICAgICAgZnVuY3Rpb24gY3JlYXRlRGVjb3JhdGlvbiAodHlwZSwgcmFuZ2UpIHtcbiAgICAgICAgbGV0IG1hcmtlciA9IG1pbmltYXAubWFya0J1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgICBtaW5pbWFwLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGV9KVxuICAgICAgfVxuXG4gICAgICBjcmVhdGVEZWNvcmF0aW9uKCdoaWdobGlnaHQnLCBbWzYsIDBdLCBbMTEsIDBdXSlcbiAgICAgIGNyZWF0ZURlY29yYXRpb24oJ2hpZ2hsaWdodCcsIFtbNywgMF0sIFs4LCAwXV0pXG4gICAgICBjcmVhdGVEZWNvcmF0aW9uKCdoaWdobGlnaHQtb3ZlcicsIFtbMSwgMF0sIFsyLCAwXV0pXG4gICAgICBjcmVhdGVEZWNvcmF0aW9uKCdsaW5lJywgW1szLCAwXSwgWzQsIDBdXSlcbiAgICAgIGNyZWF0ZURlY29yYXRpb24oJ2xpbmUnLCBbWzEyLCAwXSwgWzEyLCAwXV0pXG4gICAgICBjcmVhdGVEZWNvcmF0aW9uKCdoaWdobGlnaHQtdW5kZXInLCBbWzAsIDBdLCBbMTAsIDFdXSlcblxuICAgICAgZGVjb3JhdGlvbnMgPSBtaW5pbWFwLmRlY29yYXRpb25zQnlUeXBlVGhlblJvd3MoMCwgMTIpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGFuIG9iamVjdCB3aG9zZSBrZXlzIGFyZSB0aGUgZGVjb3JhdGlvbnMgdHlwZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMoZGVjb3JhdGlvbnMpLnNvcnQoKSkudG9FcXVhbChbJ2hpZ2hsaWdodC1vdmVyJywgJ2hpZ2hsaWdodC11bmRlcicsICdsaW5lJ10pXG4gICAgfSlcblxuICAgIGl0KCdzdG9yZXMgZGVjb3JhdGlvbnMgYnkgcm93cyB3aXRoaW4gZWFjaCB0eXBlIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMoZGVjb3JhdGlvbnNbJ2hpZ2hsaWdodC1vdmVyJ10pLnNvcnQoKSlcbiAgICAgIC50b0VxdWFsKCcxIDIgNiA3IDggOSAxMCAxMScuc3BsaXQoJyAnKS5zb3J0KCkpXG5cbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhkZWNvcmF0aW9uc1snbGluZSddKS5zb3J0KCkpXG4gICAgICAudG9FcXVhbCgnMyA0IDEyJy5zcGxpdCgnICcpLnNvcnQoKSlcblxuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKGRlY29yYXRpb25zWydoaWdobGlnaHQtdW5kZXInXSkuc29ydCgpKVxuICAgICAgLnRvRXF1YWwoJzAgMSAyIDMgNCA1IDYgNyA4IDkgMTAnLnNwbGl0KCcgJykuc29ydCgpKVxuICAgIH0pXG5cbiAgICBpdCgnc3RvcmVzIHRoZSBkZWNvcmF0aW9ucyBzcGFubmluZyBhIHJvdyBpbiB0aGUgY29ycmVzcG9uZGluZyByb3cgYXJyYXknLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZGVjb3JhdGlvbnNbJ2hpZ2hsaWdodC1vdmVyJ11bJzcnXS5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAgICAgZXhwZWN0KGRlY29yYXRpb25zWydsaW5lJ11bJzMnXS5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgICAgZXhwZWN0KGRlY29yYXRpb25zWydoaWdobGlnaHQtdW5kZXInXVsnNSddLmxlbmd0aCkudG9FcXVhbCgxKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyAgICAgIyMjIyMjICAjIyMjIyMjIyAgICAjIyMgICAgIyMgICAgIyMgIyMjIyMjIyNcbi8vICAgICMjICAgICMjICAgICMjICAgICAgIyMgIyMgICAjIyMgICAjIyAjIyAgICAgIyNcbi8vICAgICMjICAgICAgICAgICMjICAgICAjIyAgICMjICAjIyMjICAjIyAjIyAgICAgIyNcbi8vICAgICAjIyMjIyMgICAgICMjICAgICMjICAgICAjIyAjIyAjIyAjIyAjIyAgICAgIyNcbi8vICAgICAgICAgICMjICAgICMjICAgICMjIyMjIyMjIyAjIyAgIyMjIyAjIyAgICAgIyNcbi8vICAgICMjICAgICMjICAgICMjICAgICMjICAgICAjIyAjIyAgICMjIyAjIyAgICAgIyNcbi8vICAgICAjIyMjIyMgICAgICMjICAgICMjICAgICAjIyAjIyAgICAjIyAjIyMjIyMjI1xuLy9cbi8vICAgICAgICMjIyAgICAjIyAgICAgICAgIyMjIyMjIyAgIyMgICAgIyMgIyMjIyMjIyNcbi8vICAgICAgIyMgIyMgICAjIyAgICAgICAjIyAgICAgIyMgIyMjICAgIyMgIyNcbi8vICAgICAjIyAgICMjICAjIyAgICAgICAjIyAgICAgIyMgIyMjIyAgIyMgIyNcbi8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgIyMgIyMgIyMjIyMjXG4vLyAgICAjIyMjIyMjIyMgIyMgICAgICAgIyMgICAgICMjICMjICAjIyMjICMjXG4vLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgIyMjICMjXG4vLyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjIyMjIyMgICMjICAgICMjICMjIyMjIyMjXG5cbmRlc2NyaWJlKCdTdGFuZCBhbG9uZSBtaW5pbWFwJywgKCkgPT4ge1xuICBsZXQgW2VkaXRvciwgZWRpdG9yRWxlbWVudCwgbWluaW1hcCwgbGFyZ2VTYW1wbGUsIHNtYWxsU2FtcGxlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmNoYXJIZWlnaHQnLCA0KVxuICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5jaGFyV2lkdGgnLCAyKVxuICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5pbnRlcmxpbmUnLCAxKVxuXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHt9KVxuICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgIGphc21pbmUuYXR0YWNoVG9ET00oZWRpdG9yRWxlbWVudClcbiAgICBlZGl0b3JFbGVtZW50LnNldEhlaWdodCg1MClcbiAgICBlZGl0b3JFbGVtZW50LnNldFdpZHRoKDIwMClcbiAgICBlZGl0b3Iuc2V0TGluZUhlaWdodEluUGl4ZWxzKDEwKVxuXG4gICAgbGV0IGRpciA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdXG5cbiAgICBtaW5pbWFwID0gbmV3IE1pbmltYXAoe1xuICAgICAgdGV4dEVkaXRvcjogZWRpdG9yLFxuICAgICAgc3RhbmRBbG9uZTogdHJ1ZVxuICAgIH0pXG5cbiAgICBsYXJnZVNhbXBsZSA9IGZzLnJlYWRGaWxlU3luYyhkaXIucmVzb2x2ZSgnbGFyZ2UtZmlsZS5jb2ZmZWUnKSkudG9TdHJpbmcoKVxuICAgIHNtYWxsU2FtcGxlID0gZnMucmVhZEZpbGVTeW5jKGRpci5yZXNvbHZlKCdzYW1wbGUuY29mZmVlJykpLnRvU3RyaW5nKClcbiAgfSlcblxuICBpdCgnaGFzIGFuIGFzc29jaWF0ZWQgZWRpdG9yJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3IoKSkudG9FcXVhbChlZGl0b3IpXG4gIH0pXG5cbiAgaXQoJ21lYXN1cmVzIHRoZSBtaW5pbWFwIHNpemUgYmFzZWQgb24gdGhlIGN1cnJlbnQgZWRpdG9yIGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoc21hbGxTYW1wbGUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0SGVpZ2h0KCkpLnRvRXF1YWwoZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpICogNSlcblxuICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldEhlaWdodCgpKS50b0VxdWFsKGVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKSAqIDUpXG4gIH0pXG5cbiAgaXQoJ21lYXN1cmVzIHRoZSBzY2FsaW5nIGZhY3RvciBiZXR3ZWVuIHRoZSBlZGl0b3IgYW5kIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmdldFZlcnRpY2FsU2NhbGVGYWN0b3IoKSkudG9FcXVhbCgwLjUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0SG9yaXpvbnRhbFNjYWxlRmFjdG9yKCkpLnRvRXF1YWwoMiAvIGVkaXRvci5nZXREZWZhdWx0Q2hhcldpZHRoKCkpXG4gIH0pXG5cbiAgaXQoJ21lYXN1cmVzIHRoZSBlZGl0b3IgdmlzaWJsZSBhcmVhIHNpemUgYXQgbWluaW1hcCBzY2FsZScsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRUZXh0RWRpdG9yU2NhbGVkSGVpZ2h0KCkpLnRvRXF1YWwoMjUpXG4gIH0pXG5cbiAgaXQoJ2hhcyBhIHZpc2libGUgaGVpZ2h0IGJhc2VkIG9uIHRoZSBwYXNzZWQtaW4gb3B0aW9ucycsICgpID0+IHtcbiAgICBleHBlY3QobWluaW1hcC5nZXRWaXNpYmxlSGVpZ2h0KCkpLnRvRXF1YWwoNSlcblxuICAgIGVkaXRvci5zZXRUZXh0KHNtYWxsU2FtcGxlKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldFZpc2libGVIZWlnaHQoKSkudG9FcXVhbCgyMClcblxuICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldFZpc2libGVIZWlnaHQoKSkudG9FcXVhbChlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiA1KVxuXG4gICAgbWluaW1hcC5oZWlnaHQgPSAxMDBcbiAgICBleHBlY3QobWluaW1hcC5nZXRWaXNpYmxlSGVpZ2h0KCkpLnRvRXF1YWwoMTAwKVxuICB9KVxuXG4gIGl0KCdoYXMgYSB2aXNpYmxlIHdpZHRoIGJhc2VkIG9uIHRoZSBwYXNzZWQtaW4gb3B0aW9ucycsICgpID0+IHtcbiAgICBleHBlY3QobWluaW1hcC5nZXRWaXNpYmxlV2lkdGgoKSkudG9FcXVhbCgwKVxuXG4gICAgZWRpdG9yLnNldFRleHQoc21hbGxTYW1wbGUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmlzaWJsZVdpZHRoKCkpLnRvRXF1YWwoMzYpXG5cbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRWaXNpYmxlV2lkdGgoKSkudG9FcXVhbChlZGl0b3IuZ2V0TWF4U2NyZWVuTGluZUxlbmd0aCgpICogMilcblxuICAgIG1pbmltYXAud2lkdGggPSA1MFxuICAgIGV4cGVjdChtaW5pbWFwLmdldFZpc2libGVXaWR0aCgpKS50b0VxdWFsKDUwKVxuICB9KVxuXG4gIGl0KCdtZWFzdXJlcyB0aGUgYXZhaWxhYmxlIG1pbmltYXAgc2Nyb2xsJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuICAgIGxldCBsYXJnZUxpbmVDb3VudCA9IGVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKVxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0TWF4U2Nyb2xsVG9wKCkpLnRvRXF1YWwoMClcbiAgICBleHBlY3QobWluaW1hcC5jYW5TY3JvbGwoKSkudG9CZUZhbHN5KClcblxuICAgIG1pbmltYXAuaGVpZ2h0ID0gMTAwXG5cbiAgICBleHBlY3QobWluaW1hcC5nZXRNYXhTY3JvbGxUb3AoKSkudG9FcXVhbChsYXJnZUxpbmVDb3VudCAqIDUgLSAxMDApXG4gICAgZXhwZWN0KG1pbmltYXAuY2FuU2Nyb2xsKCkpLnRvQmVUcnV0aHkoKVxuICB9KVxuXG4gIGl0KCdjb21wdXRlcyB0aGUgZmlyc3QgdmlzaWJsZSByb3cgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwoMClcbiAgfSlcblxuICBpdCgnY29tcHV0ZXMgdGhlIGxhc3QgdmlzaWJsZSByb3cgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG5cbiAgICBleHBlY3QobWluaW1hcC5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpKS50b0VxdWFsKGVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKSlcblxuICAgIG1pbmltYXAuaGVpZ2h0ID0gMTAwXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKSkudG9FcXVhbCgyMClcbiAgfSlcblxuICBpdCgnZG9lcyBub3QgcmVsYXkgc2Nyb2xsIHRvcCBldmVudHMgZnJvbSB0aGUgZWRpdG9yJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuXG4gICAgbGV0IHNjcm9sbFNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWRTY3JvbGwnKVxuICAgIG1pbmltYXAub25EaWRDaGFuZ2VTY3JvbGxUb3Aoc2Nyb2xsU3B5KVxuXG4gICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3AoMTAwKVxuXG4gICAgZXhwZWN0KHNjcm9sbFNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGl0KCdkb2VzIG5vdCByZWxheSBzY3JvbGwgbGVmdCBldmVudHMgZnJvbSB0aGUgZWRpdG9yJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuXG4gICAgbGV0IHNjcm9sbFNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWRTY3JvbGwnKVxuICAgIG1pbmltYXAub25EaWRDaGFuZ2VTY3JvbGxMZWZ0KHNjcm9sbFNweSlcblxuICAgIC8vIFNlZW1zIGxpa2UgdGV4dCB3aXRob3V0IGEgdmlldyBhcmVuJ3QgYWJsZSB0byBzY3JvbGwgaG9yaXpvbnRhbGx5XG4gICAgLy8gZXZlbiB3aGVuIGl0cyB3aWR0aCB3YXMgc2V0LlxuICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdnZXRTY3JvbGxXaWR0aCcpLmFuZFJldHVybigxMDAwMClcblxuICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsTGVmdCgxMDApXG5cbiAgICBleHBlY3Qoc2Nyb2xsU3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gIH0pXG5cbiAgaXQoJ2hhcyBhIHNjcm9sbCB0b3AgdGhhdCBpcyBub3QgYm91bmQgdG8gdGhlIHRleHQgZWRpdG9yJywgKCkgPT4ge1xuICAgIGxldCBzY3JvbGxTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkU2Nyb2xsJylcbiAgICBtaW5pbWFwLm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKHNjcm9sbFNweSlcbiAgICBtaW5pbWFwLnNldFNjcmVlbkhlaWdodEFuZFdpZHRoKDEwMCwgMTAwKVxuXG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3AoMTAwMClcblxuICAgIGV4cGVjdChtaW5pbWFwLmdldFNjcm9sbFRvcCgpKS50b0VxdWFsKDApXG4gICAgZXhwZWN0KHNjcm9sbFNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgbWluaW1hcC5zZXRTY3JvbGxUb3AoMTApXG5cbiAgICBleHBlY3QobWluaW1hcC5nZXRTY3JvbGxUb3AoKSkudG9FcXVhbCgxMClcbiAgICBleHBlY3Qoc2Nyb2xsU3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgfSlcblxuICBpdCgnaGFzIHJlbmRlcmluZyBwcm9wZXJ0aWVzIHRoYXQgY2FuIG92ZXJyaWRlcyB0aGUgY29uZmlnIHZhbHVlcycsICgpID0+IHtcbiAgICBtaW5pbWFwLnNldENoYXJXaWR0aCg4LjUpXG4gICAgbWluaW1hcC5zZXRDaGFySGVpZ2h0KDEwLjIpXG4gICAgbWluaW1hcC5zZXRJbnRlcmxpbmUoMTAuNilcblxuICAgIGV4cGVjdChtaW5pbWFwLmdldENoYXJXaWR0aCgpKS50b0VxdWFsKDgpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0Q2hhckhlaWdodCgpKS50b0VxdWFsKDEwKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldEludGVybGluZSgpKS50b0VxdWFsKDEwKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldExpbmVIZWlnaHQoKSkudG9FcXVhbCgyMClcbiAgfSlcblxuICBpdCgnZW1pdHMgYSBjb25maWcgY2hhbmdlIGV2ZW50IHdoZW4gYSB2YWx1ZSBpcyBjaGFuZ2VkJywgKCkgPT4ge1xuICAgIGxldCBjaGFuZ2VTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLWNoYW5nZScpXG4gICAgbWluaW1hcC5vbkRpZENoYW5nZUNvbmZpZyhjaGFuZ2VTcHkpXG5cbiAgICBtaW5pbWFwLnNldENoYXJXaWR0aCg4LjUpXG4gICAgbWluaW1hcC5zZXRDaGFySGVpZ2h0KDEwLjIpXG4gICAgbWluaW1hcC5zZXRJbnRlcmxpbmUoMTAuNilcblxuICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbENvdW50KS50b0VxdWFsKDMpXG4gIH0pXG5cbiAgaXQoJ3JldHVybnMgdGhlIHJvdW5kaW5nIG51bWJlciBvZiBkZXZpY2VQaXhlbFJhdGlvJywgKCkgPT4ge1xuICAgIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID0gMS4yNVxuXG4gICAgbWluaW1hcC5zZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcodHJ1ZSlcblxuICAgIGV4cGVjdChtaW5pbWFwLmdldERldmljZVBpeGVsUmF0aW9Sb3VuZGluZygpKS50b0VxdWFsKHRydWUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpKS50b0VxdWFsKDEpXG4gIH0pXG5cbiAgaXQoJ3ByZXZlbnRzIHRoZSByb3VuZGluZyBudW1iZXIgb2YgZGV2aWNlUGl4ZWxSYXRpbycsICgpID0+IHtcbiAgICB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA9IDEuMjVcblxuICAgIG1pbmltYXAuc2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nKGZhbHNlKVxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nKCkpLnRvRXF1YWwoZmFsc2UpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpKS50b0VxdWFsKDEuMjUpXG4gIH0pXG59KVxuIl19
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/minimap-spec.js

(function() {
  var Minimap, MinimapElement, TextEditor, fs, isVisible, mousedown, mousemove, mouseup, mousewheel, path, realOffsetLeft, realOffsetTop, sleep, stylesheet, stylesheetPath, touchmove, touchstart, _ref;

  fs = require('fs-plus');

  path = require('path');

  TextEditor = require('atom').TextEditor;

  Minimap = require('../lib/minimap');

  MinimapElement = require('../lib/minimap-element');

  _ref = require('./helpers/events'), mousemove = _ref.mousemove, mousedown = _ref.mousedown, mouseup = _ref.mouseup, mousewheel = _ref.mousewheel, touchstart = _ref.touchstart, touchmove = _ref.touchmove;

  stylesheetPath = path.resolve(__dirname, '..', 'styles', 'minimap.less');

  stylesheet = atom.themes.loadStylesheet(stylesheetPath);

  realOffsetTop = function(o) {
    var transform;
    transform = new WebKitCSSMatrix(window.getComputedStyle(o).transform);
    return o.offsetTop + transform.m42;
  };

  realOffsetLeft = function(o) {
    var transform;
    transform = new WebKitCSSMatrix(window.getComputedStyle(o).transform);
    return o.offsetLeft + transform.m41;
  };

  isVisible = function(node) {
    return node.offsetWidth > 0 || node.offsetHeight > 0;
  };

  window.devicePixelRatio = 2;

  sleep = function(duration) {
    var t;
    t = new Date;
    return waitsFor(function() {
      return new Date - t > duration;
    });
  };

  describe('MinimapElement', function() {
    var dir, editor, editorElement, jasmineContent, largeSample, mediumSample, minimap, minimapElement, smallSample, _ref1;
    _ref1 = [], editor = _ref1[0], minimap = _ref1[1], largeSample = _ref1[2], mediumSample = _ref1[3], smallSample = _ref1[4], jasmineContent = _ref1[5], editorElement = _ref1[6], minimapElement = _ref1[7], dir = _ref1[8];
    beforeEach(function() {
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      atom.config.set('minimap.textOpacity', 1);
      MinimapElement.registerViewProvider();
      editor = new TextEditor({});
      editor.setLineHeightInPixels(10);
      editor.setHeight(50);
      minimap = new Minimap({
        textEditor: editor
      });
      dir = atom.project.getDirectories()[0];
      largeSample = fs.readFileSync(dir.resolve('large-file.coffee')).toString();
      mediumSample = fs.readFileSync(dir.resolve('two-hundred.txt')).toString();
      smallSample = fs.readFileSync(dir.resolve('sample.coffee')).toString();
      editor.setText(largeSample);
      editorElement = atom.views.getView(editor);
      return minimapElement = atom.views.getView(minimap);
    });
    it('has been registered in the view registry', function() {
      return expect(minimapElement).toExist();
    });
    it('has stored the minimap as its model', function() {
      return expect(minimapElement.getModel()).toBe(minimap);
    });
    it('has a canvas in a shadow DOM', function() {
      return expect(minimapElement.shadowRoot.querySelector('canvas')).toExist();
    });
    it('has a div representing the visible area', function() {
      return expect(minimapElement.shadowRoot.querySelector('.minimap-visible-area')).toExist();
    });
    return describe('when attached to the text editor element', function() {
      var canvas, lastFn, nextAnimationFrame, noAnimationFrame, visibleArea, _ref2;
      _ref2 = [], noAnimationFrame = _ref2[0], nextAnimationFrame = _ref2[1], lastFn = _ref2[2], canvas = _ref2[3], visibleArea = _ref2[4];
      beforeEach(function() {
        var requestAnimationFrameSafe, styleNode;
        jasmineContent = document.body.querySelector('#jasmine-content');
        noAnimationFrame = function() {
          throw new Error('No animation frame requested');
        };
        nextAnimationFrame = noAnimationFrame;
        requestAnimationFrameSafe = window.requestAnimationFrame;
        spyOn(window, 'requestAnimationFrame').andCallFake(function(fn) {
          lastFn = fn;
          return nextAnimationFrame = function() {
            nextAnimationFrame = noAnimationFrame;
            return fn();
          };
        });
        styleNode = document.createElement('style');
        styleNode.textContent = "" + stylesheet + "\n\natom-text-editor-minimap[stand-alone] {\n  width: 100px;\n  height: 100px;\n}\n\natom-text-editor atom-text-editor-minimap, atom-text-editor::shadow atom-text-editor-minimap {\n  background: rgba(255,0,0,0.3);\n}\n\natom-text-editor atom-text-editor-minimap::shadow .minimap-scroll-indicator, atom-text-editor::shadow atom-text-editor-minimap::shadow .minimap-scroll-indicator {\n  background: rgba(0,0,255,0.3);\n}\n\natom-text-editor atom-text-editor-minimap::shadow .minimap-visible-area, atom-text-editor::shadow atom-text-editor-minimap::shadow .minimap-visible-area {\n  background: rgba(0,255,0,0.3);\n  opacity: 1;\n}\n\natom-text-editor::shadow atom-text-editor-minimap::shadow .open-minimap-quick-settings {\n  opacity: 1 !important;\n}";
        return jasmineContent.appendChild(styleNode);
      });
      beforeEach(function() {
        canvas = minimapElement.shadowRoot.querySelector('canvas');
        editorElement.style.width = '200px';
        editorElement.style.height = '50px';
        jasmineContent.insertBefore(editorElement, jasmineContent.firstChild);
        editor.setScrollTop(1000);
        editor.setScrollLeft(200);
        return minimapElement.attach();
      });
      afterEach(function() {
        return minimap.destroy();
      });
      it('takes the height of the editor', function() {
        expect(minimapElement.offsetHeight).toEqual(editorElement.clientHeight);
        return expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.clientWidth / 11, 0);
      });
      it('knows when attached to a text editor', function() {
        return expect(minimapElement.attachedToTextEditor).toBeTruthy();
      });
      it('resizes the canvas to fit the minimap', function() {
        expect(canvas.offsetHeight / devicePixelRatio).toBeCloseTo(minimapElement.offsetHeight + minimap.getLineHeight(), 0);
        return expect(canvas.offsetWidth / devicePixelRatio).toBeCloseTo(minimapElement.offsetWidth, 0);
      });
      it('requests an update', function() {
        return expect(minimapElement.frameRequested).toBeTruthy();
      });
      describe('with css filters', function() {
        describe('when a hue-rotate filter is applied to a rgb color', function() {
          var additionnalStyleNode;
          additionnalStyleNode = [][0];
          beforeEach(function() {
            minimapElement.invalidateCache();
            additionnalStyleNode = document.createElement('style');
            additionnalStyleNode.textContent = "" + stylesheet + "\n\n.editor {\n  color: red;\n  -webkit-filter: hue-rotate(180deg);\n}";
            return jasmineContent.appendChild(additionnalStyleNode);
          });
          return it('computes the new color by applying the hue rotation', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.retrieveStyleFromDom(['.editor'], 'color')).toEqual("rgb(0, " + 0x6d + ", " + 0x6d + ")");
            });
          });
        });
        return describe('when a hue-rotate filter is applied to a rgba color', function() {
          var additionnalStyleNode;
          additionnalStyleNode = [][0];
          beforeEach(function() {
            minimapElement.invalidateCache();
            additionnalStyleNode = document.createElement('style');
            additionnalStyleNode.textContent = "" + stylesheet + "\n\n.editor {\n  color: rgba(255,0,0,0);\n  -webkit-filter: hue-rotate(180deg);\n}";
            return jasmineContent.appendChild(additionnalStyleNode);
          });
          return it('computes the new color by applying the hue rotation', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.retrieveStyleFromDom(['.editor'], 'color')).toEqual("rgba(0, " + 0x6d + ", " + 0x6d + ", 0)");
            });
          });
        });
      });
      describe('when the update is performed', function() {
        beforeEach(function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return visibleArea = minimapElement.shadowRoot.querySelector('.minimap-visible-area');
          });
        });
        it('sets the visible area width and height', function() {
          expect(visibleArea.offsetWidth).toEqual(minimapElement.clientWidth);
          return expect(visibleArea.offsetHeight).toBeCloseTo(minimap.getTextEditorScaledHeight(), 0);
        });
        it('sets the visible visible area offset', function() {
          expect(realOffsetTop(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop(), 0);
          return expect(realOffsetLeft(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollLeft(), 0);
        });
        it('offsets the canvas when the scroll does not match line height', function() {
          editor.setScrollTop(1004);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(realOffsetTop(canvas)).toBeCloseTo(-2, -1);
          });
        });
        it('does not fail to update render the invisible char when modified', function() {
          atom.config.set('editor.showInvisibles', true);
          atom.config.set('editor.invisibles', {
            cr: '*'
          });
          return expect(function() {
            return nextAnimationFrame();
          }).not.toThrow();
        });
        it('renders the visible line decorations', function() {
          spyOn(minimapElement, 'drawLineDecorations').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 0], [1, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[10, 0], [10, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 0], [100, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          editor.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawLineDecorations).toHaveBeenCalled();
            return expect(minimapElement.drawLineDecorations.calls.length).toEqual(2);
          });
        });
        it('renders the visible highlight decorations', function() {
          spyOn(minimapElement, 'drawHighlightDecoration').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 0], [1, 4]]), {
            type: 'highlight-under',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[2, 20], [2, 30]]), {
            type: 'highlight-over',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 3], [100, 5]]), {
            type: 'highlight-under',
            color: '#0000FF'
          });
          editor.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawHighlightDecoration).toHaveBeenCalled();
            return expect(minimapElement.drawHighlightDecoration.calls.length).toEqual(2);
          });
        });
        it('renders the visible outline decorations', function() {
          spyOn(minimapElement, 'drawHighlightOutlineDecoration').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 4], [3, 6]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          minimap.decorateMarker(editor.markBufferRange([[6, 0], [6, 7]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 3], [100, 5]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          editor.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawHighlightOutlineDecoration).toHaveBeenCalled();
            return expect(minimapElement.drawHighlightOutlineDecoration.calls.length).toEqual(4);
          });
        });
        describe('when the editor is scrolled', function() {
          beforeEach(function() {
            editor.setScrollTop(2000);
            editor.setScrollLeft(50);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('updates the visible area', function() {
            expect(realOffsetTop(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop(), 0);
            return expect(realOffsetLeft(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollLeft(), 0);
          });
        });
        describe('when the editor is resized to a greater size', function() {
          beforeEach(function() {
            var height;
            height = editor.getHeight();
            editorElement.style.width = '800px';
            editorElement.style.height = '500px';
            minimapElement.measureHeightAndWidth();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('detect the resize and adjust itself', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 11, 0);
            expect(minimapElement.offsetHeight).toEqual(editorElement.offsetHeight);
            expect(canvas.offsetWidth / devicePixelRatio).toBeCloseTo(minimapElement.offsetWidth, 0);
            return expect(canvas.offsetHeight / devicePixelRatio).toBeCloseTo(minimapElement.offsetHeight + minimap.getLineHeight(), 0);
          });
        });
        describe('when the editor visible content is changed', function() {
          beforeEach(function() {
            editor.setScrollLeft(0);
            editor.setScrollTop(1400);
            editor.setSelectedBufferRange([[101, 0], [102, 20]]);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              spyOn(minimapElement, 'drawLines').andCallThrough();
              return editor.insertText('foo');
            });
          });
          return it('rerenders the part that have changed', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              expect(minimapElement.drawLines).toHaveBeenCalled();
              expect(minimapElement.drawLines.argsForCall[0][1]).toEqual(99);
              return expect(minimapElement.drawLines.argsForCall[0][2]).toEqual(101);
            });
          });
        });
        return describe('when the editor visibility change', function() {
          it('does not modify the size of the canvas', function() {
            var canvasHeight, canvasWidth;
            canvasWidth = minimapElement.canvas.width;
            canvasHeight = minimapElement.canvas.height;
            editorElement.style.display = 'none';
            minimapElement.measureHeightAndWidth();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              expect(minimapElement.canvas.width).toEqual(canvasWidth);
              return expect(minimapElement.canvas.height).toEqual(canvasHeight);
            });
          });
          return describe('from hidden to visible', function() {
            beforeEach(function() {
              editorElement.style.display = 'none';
              minimapElement.checkForVisibilityChange();
              spyOn(minimapElement, 'requestForcedUpdate');
              editorElement.style.display = '';
              return minimapElement.pollDOM();
            });
            return it('requests an update of the whole minimap', function() {
              return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
            });
          });
        });
      });
      describe('mouse scroll controls', function() {
        beforeEach(function() {
          editorElement.style.height = '400px';
          editorElement.style.width = '400px';
          editor.setWidth(400);
          editor.setHeight(400);
          editor.setScrollTop(0);
          editor.setScrollLeft(0);
          minimapElement.measureHeightAndWidth();
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        describe('using the mouse scrollwheel over the minimap', function() {
          beforeEach(function() {
            spyOn(editorElement.component.presenter, 'setScrollTop').andCallFake(function() {});
            return mousewheel(minimapElement, 0, 15);
          });
          return it('relays the events to the editor view', function() {
            return expect(editorElement.component.presenter.setScrollTop).toHaveBeenCalled();
          });
        });
        describe('middle clicking the minimap', function() {
          var maxScroll, originalLeft, _ref3;
          _ref3 = [], canvas = _ref3[0], visibleArea = _ref3[1], originalLeft = _ref3[2], maxScroll = _ref3[3];
          beforeEach(function() {
            canvas = minimapElement.canvas, visibleArea = minimapElement.visibleArea;
            originalLeft = visibleArea.getBoundingClientRect().left;
            return maxScroll = minimap.getTextEditorMaxScrollTop();
          });
          it('scrolls to the top using the middle mouse button', function() {
            mousedown(canvas, {
              x: originalLeft + 1,
              y: 0,
              btn: 1
            });
            return expect(editor.getScrollTop()).toEqual(0);
          });
          describe('scrolling to the middle using the middle mouse button', function() {
            var canvasMidY;
            canvasMidY = void 0;
            beforeEach(function() {
              var actualMidY, editorMidY, height, top, _ref4;
              editorMidY = editor.getHeight() / 2.0;
              _ref4 = canvas.getBoundingClientRect(), top = _ref4.top, height = _ref4.height;
              canvasMidY = top + (height / 2.0);
              actualMidY = Math.min(canvasMidY, editorMidY);
              return mousedown(canvas, {
                x: originalLeft + 1,
                y: actualMidY,
                btn: 1
              });
            });
            it('scrolls the editor to the middle', function() {
              var middleScrollTop;
              middleScrollTop = Math.round(maxScroll / 2.0);
              return expect(editor.getScrollTop()).toEqual(middleScrollTop);
            });
            return it('updates the visible area to be centered', function() {
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                var height, top, visibleCenterY, _ref4;
                nextAnimationFrame();
                _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, height = _ref4.height;
                visibleCenterY = top + (height / 2);
                return expect(visibleCenterY).toBeCloseTo(canvasMidY, 0);
              });
            });
          });
          return describe('scrolling the editor to an arbitrary location', function() {
            var scrollRatio, scrollTo, _ref4;
            _ref4 = [], scrollTo = _ref4[0], scrollRatio = _ref4[1];
            beforeEach(function() {
              scrollTo = 101;
              scrollRatio = (scrollTo - minimap.getTextEditorScaledHeight() / 2) / (minimap.getVisibleHeight() - minimap.getTextEditorScaledHeight());
              scrollRatio = Math.max(0, scrollRatio);
              scrollRatio = Math.min(1, scrollRatio);
              mousedown(canvas, {
                x: originalLeft + 1,
                y: scrollTo,
                btn: 1
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            it('scrolls the editor to an arbitrary location', function() {
              var expectedScroll;
              expectedScroll = maxScroll * scrollRatio;
              return expect(editor.getScrollTop()).toBeCloseTo(expectedScroll, 0);
            });
            return describe('dragging the visible area with middle mouse button ' + 'after scrolling to the arbitrary location', function() {
              var originalTop;
              originalTop = [][0];
              beforeEach(function() {
                originalTop = visibleArea.getBoundingClientRect().top;
                mousemove(visibleArea, {
                  x: originalLeft + 1,
                  y: scrollTo + 40
                });
                waitsFor(function() {
                  return nextAnimationFrame !== noAnimationFrame;
                });
                return runs(function() {
                  return nextAnimationFrame();
                });
              });
              afterEach(function() {
                return minimapElement.endDrag();
              });
              return it('scrolls the editor so that the visible area was moved down ' + 'by 40 pixels from the arbitrary location', function() {
                var top;
                top = visibleArea.getBoundingClientRect().top;
                return expect(top).toBeCloseTo(originalTop + 40, -1);
              });
            });
          });
        });
        describe('pressing the mouse on the minimap canvas (without scroll animation)', function() {
          beforeEach(function() {
            var t;
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', false);
            canvas = minimapElement.canvas;
            return mousedown(canvas);
          });
          return it('scrolls the editor to the line below the mouse', function() {
            return expect(editor.getScrollTop()).toEqual(400);
          });
        });
        describe('pressing the mouse on the minimap canvas (with scroll animation)', function() {
          beforeEach(function() {
            var t;
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', true);
            atom.config.set('minimap.scrollAnimationDuration', 300);
            canvas = minimapElement.canvas;
            mousedown(canvas);
            return waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
          });
          return it('scrolls the editor gradually to the line below the mouse', function() {
            return waitsFor(function() {
              nextAnimationFrame !== noAnimationFrame && nextAnimationFrame();
              return editor.getScrollTop() >= 400;
            });
          });
        });
        describe('dragging the visible area', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var left, _ref4;
            visibleArea = minimapElement.visibleArea;
            _ref4 = visibleArea.getBoundingClientRect(), originalTop = _ref4.top, left = _ref4.left;
            mousedown(visibleArea, {
              x: left + 10,
              y: originalTop + 10
            });
            mousemove(visibleArea, {
              x: left + 10,
              y: originalTop + 50
            });
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          afterEach(function() {
            return minimapElement.endDrag();
          });
          it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
            var top;
            top = visibleArea.getBoundingClientRect().top;
            return expect(top).toBeCloseTo(originalTop + 40, -1);
          });
          return it('stops the drag gesture when the mouse is released outside the minimap', function() {
            var left, top, _ref4;
            _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
            mouseup(jasmineContent, {
              x: left - 10,
              y: top + 80
            });
            spyOn(minimapElement, 'drag');
            mousemove(visibleArea, {
              x: left + 10,
              y: top + 50
            });
            return expect(minimapElement.drag).not.toHaveBeenCalled();
          });
        });
        describe('dragging the visible area using touch events', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var left, _ref4;
            visibleArea = minimapElement.visibleArea;
            _ref4 = visibleArea.getBoundingClientRect(), originalTop = _ref4.top, left = _ref4.left;
            touchstart(visibleArea, {
              x: left + 10,
              y: originalTop + 10
            });
            touchmove(visibleArea, {
              x: left + 10,
              y: originalTop + 50
            });
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          afterEach(function() {
            return minimapElement.endDrag();
          });
          it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
            var top;
            top = visibleArea.getBoundingClientRect().top;
            return expect(top).toBeCloseTo(originalTop + 40, -1);
          });
          return it('stops the drag gesture when the mouse is released outside the minimap', function() {
            var left, top, _ref4;
            _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
            mouseup(jasmineContent, {
              x: left - 10,
              y: top + 80
            });
            spyOn(minimapElement, 'drag');
            touchmove(visibleArea, {
              x: left + 10,
              y: top + 50
            });
            return expect(minimapElement.drag).not.toHaveBeenCalled();
          });
        });
        describe('when the minimap cannot scroll', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var sample;
            sample = fs.readFileSync(dir.resolve('seventy.txt')).toString();
            editor.setText(sample);
            return editor.setScrollTop(0);
          });
          return describe('dragging the visible area', function() {
            beforeEach(function() {
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              runs(function() {
                var left, top, _ref4;
                nextAnimationFrame();
                visibleArea = minimapElement.visibleArea;
                _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
                originalTop = top;
                mousedown(visibleArea, {
                  x: left + 10,
                  y: top + 10
                });
                return mousemove(visibleArea, {
                  x: left + 10,
                  y: top + 50
                });
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            afterEach(function() {
              return minimapElement.endDrag();
            });
            return it('scrolls based on a ratio adjusted to the minimap height', function() {
              var top;
              top = visibleArea.getBoundingClientRect().top;
              return expect(top).toBeCloseTo(originalTop + 40, -1);
            });
          });
        });
        return describe('when scroll past end is enabled', function() {
          beforeEach(function() {
            atom.config.set('editor.scrollPastEnd', true);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return describe('dragging the visible area', function() {
            var originalTop, _ref3;
            _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
            beforeEach(function() {
              var left, top, _ref4;
              visibleArea = minimapElement.visibleArea;
              _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
              originalTop = top;
              mousedown(visibleArea, {
                x: left + 10,
                y: top + 10
              });
              mousemove(visibleArea, {
                x: left + 10,
                y: top + 50
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            afterEach(function() {
              return minimapElement.endDrag();
            });
            return it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
              var top;
              top = visibleArea.getBoundingClientRect().top;
              return expect(top).toBeCloseTo(originalTop + 40, -1);
            });
          });
        });
      });
      describe('when the model is a stand-alone minimap', function() {
        beforeEach(function() {
          return minimap.setStandAlone(true);
        });
        it('has a stand-alone attribute', function() {
          return expect(minimapElement.hasAttribute('stand-alone')).toBeTruthy();
        });
        it('sets the minimap size when measured', function() {
          minimapElement.measureHeightAndWidth();
          expect(minimap.width).toEqual(minimapElement.clientWidth);
          return expect(minimap.height).toEqual(minimapElement.clientHeight);
        });
        it('does not display the visible area', function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(isVisible(minimapElement.visibleArea)).toBeFalsy();
          });
        });
        it('does not display the quick settings button', function() {
          atom.config.set('minimap.displayPluginsControls', true);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(isVisible(minimapElement.openQuickSettings)).toBeFalsy();
          });
        });
        describe('when minimap.minimapScrollIndicator setting is true', function() {
          beforeEach(function() {
            editor.setText(mediumSample);
            editor.setScrollTop(50);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            runs(function() {
              nextAnimationFrame();
              return atom.config.set('minimap.minimapScrollIndicator', true);
            });
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('offsets the scroll indicator by the difference', function() {
            var indicator;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            return expect(realOffsetLeft(indicator)).toBeCloseTo(16, -1);
          });
        });
        return describe('pressing the mouse on the minimap canvas', function() {
          beforeEach(function() {
            var t;
            jasmineContent.appendChild(minimapElement);
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', false);
            canvas = minimapElement.canvas;
            return mousedown(canvas);
          });
          return it('does not scroll the editor to the line below the mouse', function() {
            return expect(editor.getScrollTop()).toEqual(1000);
          });
        });
      });
      describe('when the model is destroyed', function() {
        beforeEach(function() {
          return minimap.destroy();
        });
        it('detaches itself from its parent', function() {
          return expect(minimapElement.parentNode).toBeNull();
        });
        return it('stops the DOM polling interval', function() {
          spyOn(minimapElement, 'pollDOM');
          sleep(200);
          return runs(function() {
            return expect(minimapElement.pollDOM).not.toHaveBeenCalled();
          });
        });
      });
      describe('when the atom styles are changed', function() {
        beforeEach(function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          runs(function() {
            var styleNode;
            nextAnimationFrame();
            spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
            spyOn(minimapElement, 'invalidateCache').andCallThrough();
            styleNode = document.createElement('style');
            styleNode.textContent = 'body{ color: #233; }';
            return atom.styles.emitter.emit('did-add-style-element', styleNode);
          });
          return waitsFor(function() {
            return minimapElement.frameRequested;
          });
        });
        return it('forces a refresh with cache invalidation', function() {
          expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
          return expect(minimapElement.invalidateCache).toHaveBeenCalled();
        });
      });
      describe('when minimap.textOpacity is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.textOpacity', 0.3);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.displayCodeHighlights is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.displayCodeHighlights', true);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.charWidth is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.charWidth', 1);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.charHeight is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.charHeight', 1);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.interline is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.interline', 2);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.displayMinimapOnLeft setting is true', function() {
        it('moves the attached minimap to the left', function() {
          atom.config.set('minimap.displayMinimapOnLeft', true);
          return expect(minimapElement.classList.contains('left')).toBeTruthy();
        });
        return describe('when the minimap is not attached yet', function() {
          beforeEach(function() {
            editor = new TextEditor({});
            editor.setLineHeightInPixels(10);
            editor.setHeight(50);
            minimap = new Minimap({
              textEditor: editor
            });
            editorElement = atom.views.getView(editor);
            minimapElement = atom.views.getView(minimap);
            jasmineContent.insertBefore(editorElement, jasmineContent.firstChild);
            atom.config.set('minimap.displayMinimapOnLeft', true);
            return minimapElement.attach();
          });
          return it('moves the attached minimap to the left', function() {
            return expect(minimapElement.classList.contains('left')).toBeTruthy();
          });
        });
      });
      describe('when minimap.adjustMinimapWidthToSoftWrap is true', function() {
        var minimapWidth;
        minimapWidth = [][0];
        beforeEach(function() {
          minimapWidth = minimapElement.offsetWidth;
          atom.config.set('editor.softWrap', true);
          atom.config.set('editor.softWrapAtPreferredLineLength', true);
          atom.config.set('editor.preferredLineLength', 2);
          atom.config.set('minimap.adjustMinimapWidthToSoftWrap', true);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        it('adjusts the width of the minimap canvas', function() {
          return expect(minimapElement.canvas.width / devicePixelRatio).toEqual(4);
        });
        it('offsets the minimap by the difference', function() {
          expect(realOffsetLeft(minimapElement)).toBeCloseTo(editorElement.clientWidth - 4, -1);
          return expect(minimapElement.clientWidth).toBeCloseTo(minimapWidth, -1);
        });
        describe('the dom polling routine', function() {
          return it('does not change the value', function() {
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.canvas.width / devicePixelRatio).toEqual(4);
            });
          });
        });
        describe('when the editor is resized', function() {
          beforeEach(function() {
            atom.config.set('editor.preferredLineLength', 6);
            editorElement.style.width = '100px';
            editorElement.style.height = '100px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('makes the minimap smaller than soft wrap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(10, -1);
            return expect(minimapElement.style.marginRight).toEqual('');
          });
        });
        describe('and when minimap.minimapScrollIndicator setting is true', function() {
          beforeEach(function() {
            editor.setText(mediumSample);
            editor.setScrollTop(50);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            runs(function() {
              nextAnimationFrame();
              return atom.config.set('minimap.minimapScrollIndicator', true);
            });
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('offsets the scroll indicator by the difference', function() {
            var indicator;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            return expect(realOffsetLeft(indicator)).toBeCloseTo(2, -1);
          });
        });
        describe('and when minimap.displayPluginsControls setting is true', function() {
          beforeEach(function() {
            return atom.config.set('minimap.displayPluginsControls', true);
          });
          return it('offsets the scroll indicator by the difference', function() {
            var openQuickSettings;
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            return expect(realOffsetLeft(openQuickSettings)).not.toBeCloseTo(2, -1);
          });
        });
        describe('and then disabled', function() {
          beforeEach(function() {
            atom.config.set('minimap.adjustMinimapWidthToSoftWrap', false);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the width of the minimap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 11, -1);
            return expect(minimapElement.style.width).toEqual('');
          });
        });
        return describe('and when preferredLineLength >= 16384', function() {
          beforeEach(function() {
            atom.config.set('editor.preferredLineLength', 16384);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the width of the minimap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 11, -1);
            return expect(minimapElement.style.width).toEqual('');
          });
        });
      });
      describe('when minimap.minimapScrollIndicator setting is true', function() {
        beforeEach(function() {
          editor.setText(mediumSample);
          editor.setScrollTop(50);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          runs(function() {
            return nextAnimationFrame();
          });
          return atom.config.set('minimap.minimapScrollIndicator', true);
        });
        it('adds a scroll indicator in the element', function() {
          return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).toExist();
        });
        describe('and then deactivated', function() {
          return it('removes the scroll indicator from the element', function() {
            atom.config.set('minimap.minimapScrollIndicator', false);
            return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).not.toExist();
          });
        });
        describe('on update', function() {
          beforeEach(function() {
            var height;
            height = editor.getHeight();
            editorElement.style.height = '500px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the size and position of the indicator', function() {
            var height, indicator, scroll;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            height = editor.getHeight() * (editor.getHeight() / minimap.getHeight());
            scroll = (editor.getHeight() - height) * minimap.getTextEditorScrollRatio();
            expect(indicator.offsetHeight).toBeCloseTo(height, 0);
            return expect(realOffsetTop(indicator)).toBeCloseTo(scroll, 0);
          });
        });
        return describe('when the minimap cannot scroll', function() {
          beforeEach(function() {
            editor.setText(smallSample);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          it('removes the scroll indicator', function() {
            return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).not.toExist();
          });
          return describe('and then can scroll again', function() {
            beforeEach(function() {
              editor.setText(largeSample);
              waitsFor(function() {
                return minimapElement.frameRequested;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            return it('attaches the scroll indicator', function() {
              return waitsFor(function() {
                return minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
              });
            });
          });
        });
      });
      describe('when minimap.absoluteMode setting is true', function() {
        beforeEach(function() {
          return atom.config.set('minimap.absoluteMode', true);
        });
        it('adds a absolute class to the minimap element', function() {
          return expect(minimapElement.classList.contains('absolute')).toBeTruthy();
        });
        return describe('when minimap.displayMinimapOnLeft setting is true', function() {
          return it('also adds a left class to the minimap element', function() {
            atom.config.set('minimap.displayMinimapOnLeft', true);
            expect(minimapElement.classList.contains('absolute')).toBeTruthy();
            return expect(minimapElement.classList.contains('left')).toBeTruthy();
          });
        });
      });
      return describe('when minimap.displayPluginsControls setting is true', function() {
        var openQuickSettings, quickSettingsElement, workspaceElement, _ref3;
        _ref3 = [], openQuickSettings = _ref3[0], quickSettingsElement = _ref3[1], workspaceElement = _ref3[2];
        beforeEach(function() {
          return atom.config.set('minimap.displayPluginsControls', true);
        });
        it('has a div to open the quick settings', function() {
          return expect(minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings')).toExist();
        });
        describe('clicking on the div', function() {
          beforeEach(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            jasmineContent.appendChild(workspaceElement);
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            mousedown(openQuickSettings);
            return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
          });
          afterEach(function() {
            return minimapElement.quickSettingsElement.destroy();
          });
          it('opens the quick settings view', function() {
            return expect(quickSettingsElement).toExist();
          });
          return it('positions the quick settings view next to the minimap', function() {
            var minimapBounds, settingsBounds;
            minimapBounds = minimapElement.canvas.getBoundingClientRect();
            settingsBounds = quickSettingsElement.getBoundingClientRect();
            expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
            return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.left - settingsBounds.width, 0);
          });
        });
        describe('when the displayMinimapOnLeft setting is enabled', function() {
          return describe('clicking on the div', function() {
            beforeEach(function() {
              atom.config.set('minimap.displayMinimapOnLeft', true);
              workspaceElement = atom.views.getView(atom.workspace);
              jasmineContent.appendChild(workspaceElement);
              openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
              mousedown(openQuickSettings);
              return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
            });
            afterEach(function() {
              return minimapElement.quickSettingsElement.destroy();
            });
            return it('positions the quick settings view next to the minimap', function() {
              var minimapBounds, settingsBounds;
              minimapBounds = minimapElement.canvas.getBoundingClientRect();
              settingsBounds = quickSettingsElement.getBoundingClientRect();
              expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
              return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.right, 0);
            });
          });
        });
        describe('when the adjustMinimapWidthToSoftWrap setting is enabled', function() {
          var controls;
          controls = [][0];
          beforeEach(function() {
            atom.config.set('editor.softWrap', true);
            atom.config.set('editor.softWrapAtPreferredLineLength', true);
            atom.config.set('editor.preferredLineLength', 2);
            atom.config.set('minimap.adjustMinimapWidthToSoftWrap', true);
            nextAnimationFrame();
            controls = minimapElement.shadowRoot.querySelector('.minimap-controls');
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            editorElement.style.width = '1024px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          it('adjusts the size of the control div to fit in the minimap', function() {
            return expect(controls.clientWidth).toEqual(minimapElement.canvas.clientWidth / devicePixelRatio);
          });
          it('positions the controls div over the canvas', function() {
            var canvasRect, controlsRect;
            controlsRect = controls.getBoundingClientRect();
            canvasRect = minimapElement.canvas.getBoundingClientRect();
            expect(controlsRect.left).toEqual(canvasRect.left);
            return expect(controlsRect.right).toEqual(canvasRect.right);
          });
          return describe('when the displayMinimapOnLeft setting is enabled', function() {
            beforeEach(function() {
              return atom.config.set('minimap.displayMinimapOnLeft', true);
            });
            it('adjusts the size of the control div to fit in the minimap', function() {
              return expect(controls.clientWidth).toEqual(minimapElement.canvas.clientWidth / devicePixelRatio);
            });
            it('positions the controls div over the canvas', function() {
              var canvasRect, controlsRect;
              controlsRect = controls.getBoundingClientRect();
              canvasRect = minimapElement.canvas.getBoundingClientRect();
              expect(controlsRect.left).toEqual(canvasRect.left);
              return expect(controlsRect.right).toEqual(canvasRect.right);
            });
            return describe('clicking on the div', function() {
              beforeEach(function() {
                workspaceElement = atom.views.getView(atom.workspace);
                jasmineContent.appendChild(workspaceElement);
                openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
                mousedown(openQuickSettings);
                return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
              });
              afterEach(function() {
                return minimapElement.quickSettingsElement.destroy();
              });
              return it('positions the quick settings view next to the minimap', function() {
                var minimapBounds, settingsBounds;
                minimapBounds = minimapElement.canvas.getBoundingClientRect();
                settingsBounds = quickSettingsElement.getBoundingClientRect();
                expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
                return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.right, 0);
              });
            });
          });
        });
        describe('when the quick settings view is open', function() {
          beforeEach(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            jasmineContent.appendChild(workspaceElement);
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            mousedown(openQuickSettings);
            return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
          });
          it('sets the on right button active', function() {
            return expect(quickSettingsElement.querySelector('.btn.selected:last-child')).toExist();
          });
          describe('clicking on the code highlight item', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('li.code-highlights');
              return mousedown(item);
            });
            it('toggles the code highlights on the minimap element', function() {
              return expect(minimapElement.displayCodeHighlights).toBeTruthy();
            });
            return it('requests an update', function() {
              return expect(minimapElement.frameRequested).toBeTruthy();
            });
          });
          describe('clicking on the absolute mode item', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('li.absolute-mode');
              return mousedown(item);
            });
            return it('toggles the absolute-mode setting', function() {
              expect(atom.config.get('minimap.absoluteMode')).toBeTruthy();
              return expect(minimapElement.absoluteMode).toBeTruthy();
            });
          });
          describe('clicking on the on left button', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('.btn:first-child');
              return mousedown(item);
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeTruthy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:last-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:first-child')).toExist();
            });
          });
          describe('core:move-left', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-left');
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeTruthy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:last-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:first-child')).toExist();
            });
          });
          describe('core:move-right when the minimap is on the right', function() {
            beforeEach(function() {
              atom.config.set('minimap.displayMinimapOnLeft', true);
              return atom.commands.dispatch(quickSettingsElement, 'core:move-right');
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeFalsy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:first-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:last-child')).toExist();
            });
          });
          describe('clicking on the open settings button again', function() {
            beforeEach(function() {
              return mousedown(openQuickSettings);
            });
            it('closes the quick settings view', function() {
              return expect(workspaceElement.querySelector('minimap-quick-settings')).not.toExist();
            });
            return it('removes the view from the element', function() {
              return expect(minimapElement.quickSettingsElement).toBeNull();
            });
          });
          return describe('when an external event destroys the view', function() {
            beforeEach(function() {
              return minimapElement.quickSettingsElement.destroy();
            });
            return it('removes the view reference from the element', function() {
              return expect(minimapElement.quickSettingsElement).toBeNull();
            });
          });
        });
        describe('then disabling it', function() {
          beforeEach(function() {
            return atom.config.set('minimap.displayPluginsControls', false);
          });
          return it('removes the div', function() {
            return expect(minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings')).not.toExist();
          });
        });
        return describe('with plugins registered in the package', function() {
          var minimapPackage, pluginA, pluginB, _ref4;
          _ref4 = [], minimapPackage = _ref4[0], pluginA = _ref4[1], pluginB = _ref4[2];
          beforeEach(function() {
            waitsForPromise(function() {
              return atom.packages.activatePackage('minimap').then(function(pkg) {
                return minimapPackage = pkg.mainModule;
              });
            });
            return runs(function() {
              var Plugin;
              Plugin = (function() {
                function Plugin() {}

                Plugin.prototype.active = false;

                Plugin.prototype.activatePlugin = function() {
                  return this.active = true;
                };

                Plugin.prototype.deactivatePlugin = function() {
                  return this.active = false;
                };

                Plugin.prototype.isActive = function() {
                  return this.active;
                };

                return Plugin;

              })();
              pluginA = new Plugin;
              pluginB = new Plugin;
              minimapPackage.registerPlugin('dummyA', pluginA);
              minimapPackage.registerPlugin('dummyB', pluginB);
              workspaceElement = atom.views.getView(atom.workspace);
              jasmineContent.appendChild(workspaceElement);
              openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
              mousedown(openQuickSettings);
              return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
            });
          });
          it('creates one list item for each registered plugin', function() {
            return expect(quickSettingsElement.querySelectorAll('li').length).toEqual(5);
          });
          it('selects the first item of the list', function() {
            return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
          });
          describe('core:confirm', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
            });
            it('disable the plugin of the selected item', function() {
              return expect(pluginA.isActive()).toBeFalsy();
            });
            describe('triggered a second time', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('enable the plugin of the selected item', function() {
                return expect(pluginA.isActive()).toBeTruthy();
              });
            });
            describe('on the code highlight item', function() {
              var initial;
              initial = [][0];
              beforeEach(function() {
                initial = minimapElement.displayCodeHighlights;
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('toggles the code highlights on the minimap element', function() {
                return expect(minimapElement.displayCodeHighlights).toEqual(!initial);
              });
            });
            return describe('on the absolute mode item', function() {
              var initial;
              initial = [][0];
              beforeEach(function() {
                initial = atom.config.get('minimap.absoluteMode');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('toggles the code highlights on the minimap element', function() {
                return expect(atom.config.get('minimap.absoluteMode')).toEqual(!initial);
              });
            });
          });
          describe('core:move-down', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
            });
            it('selects the second item', function() {
              return expect(quickSettingsElement.querySelector('li.selected:nth-child(2)')).toExist();
            });
            describe('reaching a separator', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
              });
              return it('moves past the separator', function() {
                return expect(quickSettingsElement.querySelector('li.code-highlights.selected')).toExist();
              });
            });
            return describe('then core:move-up', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
              });
              return it('selects again the first item of the list', function() {
                return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
              });
            });
          });
          return describe('core:move-up', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
            });
            it('selects the last item', function() {
              return expect(quickSettingsElement.querySelector('li.selected:last-child')).toExist();
            });
            describe('reaching a separator', function() {
              beforeEach(function() {
                atom.commands.dispatch(quickSettingsElement, 'core:move-up');
                return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
              });
              return it('moves past the separator', function() {
                return expect(quickSettingsElement.querySelector('li.selected:nth-child(2)')).toExist();
              });
            });
            return describe('then core:move-down', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
              });
              return it('selects again the first item of the list', function() {
                return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
              });
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL21pbmltYXAtZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrTUFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBRkQsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVIsQ0FIVixDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FKakIsQ0FBQTs7QUFBQSxFQUtBLE9BQXFFLE9BQUEsQ0FBUSxrQkFBUixDQUFyRSxFQUFDLGlCQUFBLFNBQUQsRUFBWSxpQkFBQSxTQUFaLEVBQXVCLGVBQUEsT0FBdkIsRUFBZ0Msa0JBQUEsVUFBaEMsRUFBNEMsa0JBQUEsVUFBNUMsRUFBd0QsaUJBQUEsU0FMeEQsQ0FBQTs7QUFBQSxFQU1BLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLElBQXhCLEVBQThCLFFBQTlCLEVBQXdDLGNBQXhDLENBTmpCLENBQUE7O0FBQUEsRUFPQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFaLENBQTJCLGNBQTNCLENBUGIsQ0FBQTs7QUFBQSxFQVNBLGFBQUEsR0FBZ0IsU0FBQyxDQUFELEdBQUE7QUFDZCxRQUFBLFNBQUE7QUFBQSxJQUFBLFNBQUEsR0FBZ0IsSUFBQSxlQUFBLENBQWdCLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixDQUF4QixDQUEwQixDQUFDLFNBQTNDLENBQWhCLENBQUE7V0FDQSxDQUFD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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/minimap-element-spec.coffee

(function() {
  var Color, ColorMarker, ColorMarkerElement, click, path, stylesheet, stylesheetPath;

  path = require('path');

  Color = require('../lib/color');

  ColorMarker = require('../lib/color-marker');

  ColorMarkerElement = require('../lib/color-marker-element');

  click = require('./helpers/events').click;

  stylesheetPath = path.resolve(__dirname, '..', 'styles', 'pigments.less');

  stylesheet = atom.themes.loadStylesheet(stylesheetPath);

  describe('ColorMarkerElement', function() {
    var colorMarker, colorMarkerElement, editor, jasmineContent, marker, _ref;
    _ref = [], editor = _ref[0], marker = _ref[1], colorMarker = _ref[2], colorMarkerElement = _ref[3], jasmineContent = _ref[4];
    beforeEach(function() {
      var color, styleNode, text;
      jasmineContent = document.body.querySelector('#jasmine-content');
      styleNode = document.createElement('style');
      styleNode.textContent = "" + stylesheet;
      jasmineContent.appendChild(styleNode);
      editor = atom.workspace.buildTextEditor({});
      editor.setText("body {\n  color: #f00;\n  bar: foo;\n  foo: bar;\n}");
      marker = editor.markBufferRange([[1, 9], [4, 1]], {
        invalidate: 'touch'
      });
      color = new Color('#ff0000');
      text = '#f00';
      return colorMarker = new ColorMarker({
        marker: marker,
        color: color,
        text: text,
        colorBuffer: {
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          selectColorMarkerAndOpenPicker: jasmine.createSpy('select-color'),
          ignoredScopes: [],
          findValidColorMarkers: function() {
            return [];
          }
        }
      });
    });
    it('releases itself when the marker is destroyed', function() {
      var eventSpy;
      colorMarkerElement = new ColorMarkerElement;
      colorMarkerElement.setContainer({
        editor: editor,
        useNativeDecorations: function() {
          return false;
        },
        requestMarkerUpdate: function(_arg) {
          var marker;
          marker = _arg[0];
          return marker.render();
        }
      });
      colorMarkerElement.setModel(colorMarker);
      eventSpy = jasmine.createSpy('did-release');
      colorMarkerElement.onDidRelease(eventSpy);
      spyOn(colorMarkerElement, 'release').andCallThrough();
      marker.destroy();
      expect(colorMarkerElement.release).toHaveBeenCalled();
      return expect(eventSpy).toHaveBeenCalled();
    });
    describe('clicking on the decoration', function() {
      beforeEach(function() {
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(_arg) {
            var marker;
            marker = _arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return click(colorMarkerElement);
      });
      return it('calls selectColorMarkerAndOpenPicker on the buffer', function() {
        return expect(colorMarker.colorBuffer.selectColorMarkerAndOpenPicker).toHaveBeenCalled();
      });
    });
    describe('when the render mode is set to background', function() {
      var regions;
      regions = [][0];
      beforeEach(function() {
        ColorMarkerElement.setMarkerType('background');
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(_arg) {
            var marker;
            marker = _arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return regions = colorMarkerElement.querySelectorAll('.region.background');
      });
      it('creates a region div for the color', function() {
        return expect(regions.length).toEqual(4);
      });
      it('fills the region with the covered text', function() {
        expect(regions[0].textContent).toEqual('#f00;');
        expect(regions[1].textContent).toEqual('  bar: foo;');
        expect(regions[2].textContent).toEqual('  foo: bar;');
        return expect(regions[3].textContent).toEqual('}');
      });
      it('sets the background of the region with the color css value', function() {
        var region, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = regions.length; _i < _len; _i++) {
          region = regions[_i];
          _results.push(expect(region.style.backgroundColor).toEqual('rgb(255, 0, 0)'));
        }
        return _results;
      });
      describe('when the marker is modified', function() {
        beforeEach(function() {
          spyOn(colorMarkerElement.renderer, 'render').andCallThrough();
          editor.moveToTop();
          return editor.insertText('\n\n');
        });
        return it('renders again the marker content', function() {
          expect(colorMarkerElement.renderer.render).toHaveBeenCalled();
          return expect(colorMarkerElement.querySelectorAll('.region').length).toEqual(4);
        });
      });
      return describe('when released', function() {
        return it('removes all the previously rendered content', function() {
          colorMarkerElement.release();
          return expect(colorMarkerElement.children.length).toEqual(0);
        });
      });
    });
    describe('when the render mode is set to outline', function() {
      var regions;
      regions = [][0];
      beforeEach(function() {
        ColorMarkerElement.setMarkerType('outline');
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(_arg) {
            var marker;
            marker = _arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return regions = colorMarkerElement.querySelectorAll('.region.outline');
      });
      it('creates a region div for the color', function() {
        return expect(regions.length).toEqual(4);
      });
      it('fills the region with the covered text', function() {
        expect(regions[0].textContent).toEqual('');
        expect(regions[1].textContent).toEqual('');
        expect(regions[2].textContent).toEqual('');
        return expect(regions[3].textContent).toEqual('');
      });
      it('sets the drop shadow color of the region with the color css value', function() {
        var region, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = regions.length; _i < _len; _i++) {
          region = regions[_i];
          _results.push(expect(region.style.borderColor).toEqual('rgb(255, 0, 0)'));
        }
        return _results;
      });
      describe('when the marker is modified', function() {
        beforeEach(function() {
          spyOn(colorMarkerElement.renderer, 'render').andCallThrough();
          editor.moveToTop();
          return editor.insertText('\n\n');
        });
        return it('renders again the marker content', function() {
          expect(colorMarkerElement.renderer.render).toHaveBeenCalled();
          return expect(colorMarkerElement.querySelectorAll('.region').length).toEqual(4);
        });
      });
      return describe('when released', function() {
        return it('removes all the previously rendered content', function() {
          colorMarkerElement.release();
          return expect(colorMarkerElement.children.length).toEqual(0);
        });
      });
    });
    describe('when the render mode is set to underline', function() {
      var regions;
      regions = [][0];
      beforeEach(function() {
        ColorMarkerElement.setMarkerType('underline');
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(_arg) {
            var marker;
            marker = _arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return regions = colorMarkerElement.querySelectorAll('.region.underline');
      });
      it('creates a region div for the color', function() {
        return expect(regions.length).toEqual(4);
      });
      it('fills the region with the covered text', function() {
        expect(regions[0].textContent).toEqual('');
        expect(regions[1].textContent).toEqual('');
        expect(regions[2].textContent).toEqual('');
        return expect(regions[3].textContent).toEqual('');
      });
      it('sets the background of the region with the color css value', function() {
        var region, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = regions.length; _i < _len; _i++) {
          region = regions[_i];
          _results.push(expect(region.style.backgroundColor).toEqual('rgb(255, 0, 0)'));
        }
        return _results;
      });
      describe('when the marker is modified', function() {
        beforeEach(function() {
          spyOn(colorMarkerElement.renderer, 'render').andCallThrough();
          editor.moveToTop();
          return editor.insertText('\n\n');
        });
        return it('renders again the marker content', function() {
          expect(colorMarkerElement.renderer.render).toHaveBeenCalled();
          return expect(colorMarkerElement.querySelectorAll('.region').length).toEqual(4);
        });
      });
      return describe('when released', function() {
        return it('removes all the previously rendered content', function() {
          colorMarkerElement.release();
          return expect(colorMarkerElement.children.length).toEqual(0);
        });
      });
    });
    describe('when the render mode is set to dot', function() {
      var createMarker, markerElement, markers, markersElements, regions, _ref1;
      _ref1 = [], regions = _ref1[0], markers = _ref1[1], markersElements = _ref1[2], markerElement = _ref1[3];
      createMarker = function(range, color, text) {
        marker = editor.markBufferRange(range, {
          invalidate: 'touch'
        });
        color = new Color(color);
        text = text;
        return colorMarker = new ColorMarker({
          marker: marker,
          color: color,
          text: text,
          colorBuffer: {
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            project: {
              colorPickerAPI: {
                open: jasmine.createSpy('color-picker.open')
              }
            },
            ignoredScopes: [],
            findValidColorMarkers: function() {
              return [];
            }
          }
        });
      };
      beforeEach(function() {
        var editorElement;
        editor = atom.workspace.buildTextEditor({});
        editor.setText("body {\n  background: red, green, blue;\n}");
        editorElement = atom.views.getView(editor);
        jasmineContent.appendChild(editorElement);
        markers = [createMarker([[1, 13], [1, 16]], '#ff0000', 'red'), createMarker([[1, 18], [1, 23]], '#00ff00', 'green'), createMarker([[1, 25], [1, 29]], '#0000ff', 'blue')];
        ColorMarkerElement.setMarkerType('dot');
        return markersElements = markers.map(function(colorMarker) {
          colorMarkerElement = new ColorMarkerElement;
          colorMarkerElement.setContainer({
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            requestMarkerUpdate: function(_arg) {
              var marker;
              marker = _arg[0];
              return marker.render();
            }
          });
          colorMarkerElement.setModel(colorMarker);
          jasmineContent.appendChild(colorMarkerElement);
          return colorMarkerElement;
        });
      });
      return it('adds the dot class on the marker', function() {
        var markersElement, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = markersElements.length; _i < _len; _i++) {
          markersElement = markersElements[_i];
          _results.push(expect(markersElement.classList.contains('dot')).toBeTruthy());
        }
        return _results;
      });
    });
    return describe('when the render mode is set to dot', function() {
      var createMarker, markers, markersElements, regions, _ref1;
      _ref1 = [], regions = _ref1[0], markers = _ref1[1], markersElements = _ref1[2];
      createMarker = function(range, color, text) {
        marker = editor.markBufferRange(range, {
          invalidate: 'touch'
        });
        color = new Color(color);
        text = text;
        return colorMarker = new ColorMarker({
          marker: marker,
          color: color,
          text: text,
          colorBuffer: {
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            project: {
              colorPickerAPI: {
                open: jasmine.createSpy('color-picker.open')
              }
            },
            ignoredScopes: [],
            findValidColorMarkers: function() {
              return [];
            }
          }
        });
      };
      beforeEach(function() {
        var editorElement;
        editor = atom.workspace.buildTextEditor({});
        editor.setText("body {\n  background: red, green, blue;\n}");
        editorElement = atom.views.getView(editor);
        jasmineContent.appendChild(editorElement);
        markers = [createMarker([[1, 13], [1, 16]], '#ff0000', 'red'), createMarker([[1, 18], [1, 23]], '#00ff00', 'green'), createMarker([[1, 25], [1, 29]], '#0000ff', 'blue')];
        ColorMarkerElement.setMarkerType('square-dot');
        return markersElements = markers.map(function(colorMarker) {
          colorMarkerElement = new ColorMarkerElement;
          colorMarkerElement.setContainer({
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            requestMarkerUpdate: function(_arg) {
              var marker;
              marker = _arg[0];
              return marker.render();
            }
          });
          colorMarkerElement.setModel(colorMarker);
          jasmineContent.appendChild(colorMarkerElement);
          return colorMarkerElement;
        });
      });
      return it('adds the dot class on the marker', function() {
        var markersElement, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = markersElements.length; _i < _len; _i++) {
          markersElement = markersElements[_i];
          expect(markersElement.classList.contains('dot')).toBeTruthy();
          _results.push(expect(markersElement.classList.contains('square')).toBeTruthy());
        }
        return _results;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1tYXJrZXItZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrRUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FEUixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQUZkLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsNkJBQVIsQ0FIckIsQ0FBQTs7QUFBQSxFQUlDLFFBQVMsT0FBQSxDQUFRLGtCQUFSLEVBQVQsS0FKRCxDQUFBOztBQUFBLEVBTUEsY0FBQSxHQUFpQixJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsSUFBeEIsRUFBOEIsUUFBOUIsRUFBd0MsZUFBeEMsQ0FOakIsQ0FBQTs7QUFBQSxFQU9BLFVBQUEsR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQVosQ0FBMkIsY0FBM0IsQ0FQYixDQUFBOztBQUFBLEVBU0EsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixRQUFBLHFFQUFBO0FBQUEsSUFBQSxPQUFvRSxFQUFwRSxFQUFDLGdCQUFELEVBQVMsZ0JBQVQsRUFBaUIscUJBQWpCLEVBQThCLDRCQUE5QixFQUFrRCx3QkFBbEQsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsc0JBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFkLENBQTRCLGtCQUE1QixDQUFqQixDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksUUFBUSxDQUFD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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-marker-element-spec.coffee

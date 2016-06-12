(function() {
  var Color, ColorMarker, ColorMarkerElement, path, stylesheet, stylesheetPath;

  path = require('path');

  Color = require('../lib/color');

  ColorMarker = require('../lib/color-marker');

  ColorMarkerElement = require('../lib/color-marker-element');

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
      editor.setText("body {\n  color: red;\n  bar: foo;\n  foo: bar;\n}");
      marker = editor.markBufferRange([[1, 9], [4, 1]], {
        type: 'pigments-color',
        invalidate: 'touch'
      });
      color = new Color('#ff0000');
      text = 'red';
      return colorMarker = new ColorMarker({
        marker: marker,
        color: color,
        text: text,
        colorBuffer: {
          editor: editor,
          ignoredScopes: []
        }
      });
    });
    it('releases itself when the marker is destroyed', function() {
      var eventSpy;
      colorMarkerElement = new ColorMarkerElement;
      colorMarkerElement.setModel(colorMarker);
      eventSpy = jasmine.createSpy('did-release');
      colorMarkerElement.onDidRelease(eventSpy);
      spyOn(colorMarkerElement, 'release').andCallThrough();
      marker.destroy();
      expect(colorMarkerElement.release).toHaveBeenCalled();
      return expect(eventSpy).toHaveBeenCalled();
    });
    describe('when the render mode is set to background', function() {
      var regions;
      regions = [][0];
      beforeEach(function() {
        ColorMarkerElement.setMarkerType('background');
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setModel(colorMarker);
        return regions = colorMarkerElement.querySelectorAll('.region.background');
      });
      it('creates a region div for the color', function() {
        return expect(regions.length).toEqual(4);
      });
      it('fills the region with the covered text', function() {
        expect(regions[0].textContent).toEqual('red;');
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
      var createMarker, markers, markersElements, regions, _ref1;
      _ref1 = [], regions = _ref1[0], markers = _ref1[1], markersElements = _ref1[2];
      createMarker = function(range, color, text) {
        marker = editor.markBufferRange(range, {
          type: 'pigments-color',
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
            ignoredScopes: []
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
          type: 'pigments-color',
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
            ignoredScopes: []
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1tYXJrZXItZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3RUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FEUixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQUZkLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsNkJBQVIsQ0FIckIsQ0FBQTs7QUFBQSxFQUtBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLElBQXhCLEVBQThCLFFBQTlCLEVBQXdDLGVBQXhDLENBTGpCLENBQUE7O0FBQUEsRUFNQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFaLENBQTJCLGNBQTNCLENBTmIsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7QUFDN0IsUUFBQSxxRUFBQTtBQUFBLElBQUEsT0FBb0UsRUFBcEUsRUFBQyxnQkFBRCxFQUFTLGdCQUFULEVBQWlCLHFCQUFqQixFQUE4Qiw0QkFBOUIsRUFBa0Qsd0JBQWxELENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLHNCQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBZCxDQUE0QixrQkFBNUIsQ0FBakIsQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCLENBRlosQ0FBQTtBQUFBLE1BR0EsU0FBUyxDQUFD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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-marker-element-spec.coffee

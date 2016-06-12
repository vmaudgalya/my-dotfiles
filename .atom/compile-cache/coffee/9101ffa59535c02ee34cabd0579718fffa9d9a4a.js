(function() {
  var DotRenderer;

  module.exports = DotRenderer = (function() {
    function DotRenderer() {}

    DotRenderer.prototype.render = function(colorMarker) {
      var charWidth, column, displayBuffer, index, lineHeight, markers, pixelPosition, range, screenLine, textEditor, textEditorElement;
      range = colorMarker.getScreenRange();
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      displayBuffer = colorMarker.marker.displayBuffer;
      charWidth = displayBuffer.getDefaultCharWidth();
      markers = displayBuffer.findMarkers({
        type: 'pigments-color',
        intersectsScreenRowRange: [range.end.row, range.end.row]
      });
      index = markers.indexOf(colorMarker.marker);
      screenLine = displayBuffer.screenLines[range.end.row];
      if (screenLine == null) {
        return {};
      }
      lineHeight = textEditor.getLineHeightInPixels();
      column = (screenLine.getMaxScreenColumn() + 1) * charWidth;
      pixelPosition = textEditorElement.pixelPositionForScreenPosition(range.end);
      return {
        "class": 'dot',
        style: {
          backgroundColor: colorMarker.color.toCSS(),
          top: (pixelPosition.top + lineHeight / 2) + 'px',
          left: (column + index * 18) + 'px'
        }
      };
    };

    return DotRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9kb3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNOzZCQUNKOztBQUFBLDBCQUFBLE1BQUEsR0FBUSxTQUFDLFdBQUQsR0FBQTtBQUNOLFVBQUEsNkhBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxXQUFXLENBQUMsY0FBWixDQUFBLENBQVIsQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFhLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFGckMsQ0FBQTtBQUFBLE1BR0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLFVBQW5CLENBSHBCLENBQUE7QUFBQSxNQUlBLGFBQUEsR0FBZ0IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxhQUpuQyxDQUFBO0FBQUEsTUFLQSxTQUFBLEdBQVksYUFBYSxDQUFDLG1CQUFkLENBQUEsQ0FMWixDQUFBO0FBQUEsTUFPQSxPQUFBLEdBQVUsYUFBYSxDQUFDLFdBQWQsQ0FBMEI7QUFBQSxRQUNsQyxJQUFBLEVBQU0sZ0JBRDRCO0FBQUEsUUFFbEMsd0JBQUEsRUFBMEIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVgsRUFBZ0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUExQixDQUZRO09BQTFCLENBUFYsQ0FBQTtBQUFBLE1BWUEsS0FBQSxHQUFRLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFdBQVcsQ0FBQyxNQUE1QixDQVpSLENBQUE7QUFBQSxNQWFBLFVBQUEsR0FBYSxhQUFhLENBQUMsV0FBWSxDQUFBLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVixDQWJ2QyxDQUFBO0FBZUEsTUFBQSxJQUFpQixrQkFBakI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQWZBO0FBQUEsTUFpQkEsVUFBQSxHQUFhLFVBQVUsQ0FBQyxxQkFBWCxDQUFBLENBakJiLENBQUE7QUFBQSxNQWtCQSxNQUFBLEdBQVMsQ0FBQyxVQUFVLENBQUMsa0JBQVgsQ0FBQSxDQUFBLEdBQWtDLENBQW5DLENBQUEsR0FBd0MsU0FsQmpELENBQUE7QUFBQSxNQW1CQSxhQUFBLEdBQWdCLGlCQUFpQixDQUFDLDhCQUFsQixDQUFpRCxLQUFLLENBQUMsR0FBdkQsQ0FuQmhCLENBQUE7YUFxQkE7QUFBQSxRQUFBLE9BQUEsRUFBTyxLQUFQO0FBQUEsUUFDQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLGVBQUEsRUFBaUIsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFsQixDQUFBLENBQWpCO0FBQUEsVUFDQSxHQUFBLEVBQUssQ0FBQyxhQUFhLENBQUMsR0FBZCxHQUFvQixVQUFBLEdBQWEsQ0FBbEMsQ0FBQSxHQUF1QyxJQUQ1QztBQUFBLFVBRUEsSUFBQSxFQUFNLENBQUMsTUFBQSxHQUFTLEtBQUEsR0FBUSxFQUFsQixDQUFBLEdBQXdCLElBRjlCO1NBRkY7UUF0Qk07SUFBQSxDQUFSLENBQUE7O3VCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/dot.coffee

(function() {
  var DotRenderer;

  module.exports = DotRenderer = (function() {
    function DotRenderer() {}

    DotRenderer.prototype.render = function(colorMarker) {
      var charWidth, color, column, index, lineHeight, markers, pixelPosition, range, screenLine, textEditor, textEditorElement;
      range = colorMarker.getScreenRange();
      color = colorMarker.color;
      if (color == null) {
        return {};
      }
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      charWidth = textEditor.getDefaultCharWidth();
      markers = colorMarker.colorBuffer.findValidColorMarkers({
        intersectsScreenRowRange: [range.end.row, range.end.row]
      }).filter(function(m) {
        return m.getScreenRange().end.row === range.end.row;
      });
      index = markers.indexOf(colorMarker);
      screenLine = this.screenLineForScreenRow(textEditor, range.end.row);
      if (screenLine == null) {
        return {};
      }
      lineHeight = textEditor.getLineHeightInPixels();
      column = this.getLineLastColumn(screenLine) * charWidth;
      pixelPosition = textEditorElement.pixelPositionForScreenPosition(range.end);
      return {
        "class": 'dot',
        style: {
          backgroundColor: color.toCSS(),
          top: (pixelPosition.top + lineHeight / 2) + 'px',
          left: (column + index * 18) + 'px'
        }
      };
    };

    DotRenderer.prototype.getLineLastColumn = function(line) {
      if (line.lineText != null) {
        return line.lineText.length + 1;
      } else {
        return line.getMaxScreenColumn() + 1;
      }
    };

    DotRenderer.prototype.screenLineForScreenRow = function(textEditor, row) {
      if (textEditor.screenLineForScreenRow != null) {
        return textEditor.screenLineForScreenRow(row);
      } else {
        return textEditor.displayBuffer.screenLines[row];
      }
    };

    return DotRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9kb3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNOzZCQUNKOztBQUFBLDBCQUFBLE1BQUEsR0FBUSxTQUFDLFdBQUQsR0FBQTtBQUNOLFVBQUEscUhBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxXQUFXLENBQUMsY0FBWixDQUFBLENBQVIsQ0FBQTtBQUFBLE1BRUEsS0FBQSxHQUFRLFdBQVcsQ0FBQyxLQUZwQixDQUFBO0FBSUEsTUFBQSxJQUFpQixhQUFqQjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BSkE7QUFBQSxNQU1BLFVBQUEsR0FBYSxXQUFXLENBQUMsV0FBVyxDQUFDLE1BTnJDLENBQUE7QUFBQSxNQU9BLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixVQUFuQixDQVBwQixDQUFBO0FBQUEsTUFRQSxTQUFBLEdBQVksVUFBVSxDQUFDLG1CQUFYLENBQUEsQ0FSWixDQUFBO0FBQUEsTUFVQSxPQUFBLEdBQVUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxxQkFBeEIsQ0FBOEM7QUFBQSxRQUN0RCx3QkFBQSxFQUEwQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBWCxFQUFnQixLQUFLLENBQUMsR0FBRyxDQUFDLEdBQTFCLENBRDRCO09BQTlDLENBRVIsQ0FBQyxNQUZPLENBRUEsU0FBQyxDQUFELEdBQUE7ZUFBTyxDQUFDLENBQUMsY0FBRixDQUFBLENBQWtCLENBQUMsR0FBRyxDQUFDLEdBQXZCLEtBQThCLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBL0M7TUFBQSxDQUZBLENBVlYsQ0FBQTtBQUFBLE1BY0EsS0FBQSxHQUFRLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFdBQWhCLENBZFIsQ0FBQTtBQUFBLE1BZUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixVQUF4QixFQUFvQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQTlDLENBZmIsQ0FBQTtBQWlCQSxNQUFBLElBQWlCLGtCQUFqQjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BakJBO0FBQUEsTUFtQkEsVUFBQSxHQUFhLFVBQVUsQ0FBQyxxQkFBWCxDQUFBLENBbkJiLENBQUE7QUFBQSxNQW9CQSxNQUFBLEdBQVMsSUFBQyxDQUFBLGlCQUFELENBQW1CLFVBQW5CLENBQUEsR0FBaUMsU0FwQjFDLENBQUE7QUFBQSxNQXFCQSxhQUFBLEdBQWdCLGlCQUFpQixDQUFDLDhCQUFsQixDQUFpRCxLQUFLLENBQUMsR0FBdkQsQ0FyQmhCLENBQUE7YUF1QkE7QUFBQSxRQUFBLE9BQUEsRUFBTyxLQUFQO0FBQUEsUUFDQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLGVBQUEsRUFBaUIsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFqQjtBQUFBLFVBQ0EsR0FBQSxFQUFLLENBQUMsYUFBYSxDQUFDLEdBQWQsR0FBb0IsVUFBQSxHQUFhLENBQWxDLENBQUEsR0FBdUMsSUFENUM7QUFBQSxVQUVBLElBQUEsRUFBTSxDQUFDLE1BQUEsR0FBUyxLQUFBLEdBQVEsRUFBbEIsQ0FBQSxHQUF3QixJQUY5QjtTQUZGO1FBeEJNO0lBQUEsQ0FBUixDQUFBOztBQUFBLDBCQThCQSxpQkFBQSxHQUFtQixTQUFDLElBQUQsR0FBQTtBQUNqQixNQUFBLElBQUcscUJBQUg7ZUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQWQsR0FBdUIsRUFEekI7T0FBQSxNQUFBO2VBR0UsSUFBSSxDQUFDLGtCQUFMLENBQUEsQ0FBQSxHQUE0QixFQUg5QjtPQURpQjtJQUFBLENBOUJuQixDQUFBOztBQUFBLDBCQW9DQSxzQkFBQSxHQUF3QixTQUFDLFVBQUQsRUFBYSxHQUFiLEdBQUE7QUFDdEIsTUFBQSxJQUFHLHlDQUFIO2VBQ0UsVUFBVSxDQUFDLHNCQUFYLENBQWtDLEdBQWxDLEVBREY7T0FBQSxNQUFBO2VBR0UsVUFBVSxDQUFDLGFBQWEsQ0FBQyxXQUFZLENBQUEsR0FBQSxFQUh2QztPQURzQjtJQUFBLENBcEN4QixDQUFBOzt1QkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/dot.coffee

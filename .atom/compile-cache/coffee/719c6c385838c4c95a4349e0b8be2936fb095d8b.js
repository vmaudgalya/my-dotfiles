(function() {
  var RegionRenderer;

  module.exports = RegionRenderer = (function() {
    function RegionRenderer() {}

    RegionRenderer.prototype.includeTextInRegion = false;

    RegionRenderer.prototype.renderRegions = function(colorMarker) {
      var range, regions, row, rowSpan, textEditor, _i, _ref, _ref1;
      range = colorMarker.getScreenRange();
      if (range.isEmpty()) {
        return [];
      }
      rowSpan = range.end.row - range.start.row;
      regions = [];
      textEditor = colorMarker.colorBuffer.editor;
      if (rowSpan === 0) {
        regions.push(this.createRegion(range.start, range.end, colorMarker));
      } else {
        regions.push(this.createRegion(range.start, {
          row: range.start.row,
          column: Infinity
        }, colorMarker, this.screenLineForScreenRow(textEditor, range.start.row)));
        if (rowSpan > 1) {
          for (row = _i = _ref = range.start.row + 1, _ref1 = range.end.row; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
            regions.push(this.createRegion({
              row: row,
              column: 0
            }, {
              row: row,
              column: Infinity
            }, colorMarker, this.screenLineForScreenRow(textEditor, row)));
          }
        }
        regions.push(this.createRegion({
          row: range.end.row,
          column: 0
        }, range.end, colorMarker, this.screenLineForScreenRow(textEditor, range.end.row)));
      }
      return regions;
    };

    RegionRenderer.prototype.screenLineForScreenRow = function(textEditor, row) {
      if (textEditor.screenLineForScreenRow != null) {
        return textEditor.screenLineForScreenRow(row);
      } else {
        return textEditor.displayBuffer.screenLines[row];
      }
    };

    RegionRenderer.prototype.createRegion = function(start, end, colorMarker, screenLine) {
      var bufferRange, charWidth, clippedEnd, clippedStart, css, endPosition, lineHeight, name, needAdjustment, region, startPosition, text, textEditor, textEditorElement, value, _ref, _ref1;
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      if (textEditorElement.component == null) {
        return;
      }
      lineHeight = textEditor.getLineHeightInPixels();
      charWidth = textEditor.getDefaultCharWidth();
      clippedStart = {
        row: start.row,
        column: (_ref = this.clipScreenColumn(screenLine, start.column)) != null ? _ref : start.column
      };
      clippedEnd = {
        row: end.row,
        column: (_ref1 = this.clipScreenColumn(screenLine, end.column)) != null ? _ref1 : end.column
      };
      bufferRange = textEditor.bufferRangeForScreenRange({
        start: clippedStart,
        end: clippedEnd
      });
      needAdjustment = (screenLine != null ? typeof screenLine.isSoftWrapped === "function" ? screenLine.isSoftWrapped() : void 0 : void 0) && end.column >= (screenLine != null ? screenLine.text.length : void 0) - (screenLine != null ? screenLine.softWrapIndentationDelta : void 0);
      if (needAdjustment) {
        bufferRange.end.column++;
      }
      startPosition = textEditorElement.pixelPositionForScreenPosition(clippedStart);
      endPosition = textEditorElement.pixelPositionForScreenPosition(clippedEnd);
      text = textEditor.getBuffer().getTextInRange(bufferRange);
      css = {};
      css.left = startPosition.left;
      css.top = startPosition.top;
      css.width = endPosition.left - startPosition.left;
      if (needAdjustment) {
        css.width += charWidth;
      }
      css.height = lineHeight;
      region = document.createElement('div');
      region.className = 'region';
      if (this.includeTextInRegion) {
        region.textContent = text;
      }
      if (startPosition.left === endPosition.left) {
        region.invalid = true;
      }
      for (name in css) {
        value = css[name];
        region.style[name] = value + 'px';
      }
      return region;
    };

    RegionRenderer.prototype.clipScreenColumn = function(line, column) {
      if (line != null) {
        if (line.clipScreenColumn != null) {
          return line.clipScreenColumn(column);
        } else {
          return Math.min(line.lineText.length, column);
        }
      }
    };

    return RegionRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9yZWdpb24tcmVuZGVyZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO2dDQUNKOztBQUFBLDZCQUFBLG1CQUFBLEdBQXFCLEtBQXJCLENBQUE7O0FBQUEsNkJBRUEsYUFBQSxHQUFlLFNBQUMsV0FBRCxHQUFBO0FBQ2IsVUFBQSx5REFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLFdBQVcsQ0FBQyxjQUFaLENBQUEsQ0FBUixDQUFBO0FBQ0EsTUFBQSxJQUFhLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBYjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BREE7QUFBQSxNQUdBLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVYsR0FBZ0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUh0QyxDQUFBO0FBQUEsTUFJQSxPQUFBLEdBQVUsRUFKVixDQUFBO0FBQUEsTUFNQSxVQUFBLEdBQWEsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQU5yQyxDQUFBO0FBUUEsTUFBQSxJQUFHLE9BQUEsS0FBVyxDQUFkO0FBQ0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsS0FBSyxDQUFDLEtBQXBCLEVBQTJCLEtBQUssQ0FBQyxHQUFqQyxFQUFzQyxXQUF0QyxDQUFiLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBQyxDQUFBLFlBQUQsQ0FDWCxLQUFLLENBQUMsS0FESyxFQUVYO0FBQUEsVUFDRSxHQUFBLEVBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxHQURuQjtBQUFBLFVBRUUsTUFBQSxFQUFR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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/region-renderer.coffee

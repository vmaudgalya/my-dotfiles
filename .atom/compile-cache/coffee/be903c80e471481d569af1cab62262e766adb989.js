(function() {
  var RegionRenderer;

  module.exports = RegionRenderer = (function() {
    function RegionRenderer() {}

    RegionRenderer.prototype.includeTextInRegion = false;

    RegionRenderer.prototype.renderRegions = function(colorMarker) {
      var displayBuffer, range, regions, row, rowSpan, _i, _ref, _ref1;
      range = colorMarker.getScreenRange();
      if (range.isEmpty()) {
        return [];
      }
      rowSpan = range.end.row - range.start.row;
      regions = [];
      displayBuffer = colorMarker.marker.displayBuffer;
      if (rowSpan === 0) {
        regions.push(this.createRegion(range.start, range.end, colorMarker));
      } else {
        regions.push(this.createRegion(range.start, {
          row: range.start.row,
          column: Infinity
        }, colorMarker, displayBuffer.screenLines[range.start.row]));
        if (rowSpan > 1) {
          for (row = _i = _ref = range.start.row + 1, _ref1 = range.end.row; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
            regions.push(this.createRegion({
              row: row,
              column: 0
            }, {
              row: row,
              column: Infinity
            }, colorMarker, displayBuffer.screenLines[row]));
          }
        }
        regions.push(this.createRegion({
          row: range.end.row,
          column: 0
        }, range.end, colorMarker, displayBuffer.screenLines[range.end.row]));
      }
      return regions;
    };

    RegionRenderer.prototype.createRegion = function(start, end, colorMarker, screenLine) {
      var bufferRange, charWidth, clippedEnd, clippedStart, css, displayBuffer, endPosition, lineHeight, name, needAdjustment, region, startPosition, text, textEditor, textEditorElement, value, _ref, _ref1;
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      displayBuffer = colorMarker.marker.displayBuffer;
      lineHeight = textEditor.getLineHeightInPixels();
      charWidth = textEditor.getDefaultCharWidth();
      clippedStart = {
        row: start.row,
        column: (_ref = screenLine != null ? screenLine.clipScreenColumn(start.column) : void 0) != null ? _ref : start.column
      };
      clippedEnd = {
        row: end.row,
        column: (_ref1 = screenLine != null ? screenLine.clipScreenColumn(end.column) : void 0) != null ? _ref1 : end.column
      };
      bufferRange = displayBuffer.bufferRangeForScreenRange({
        start: clippedStart,
        end: clippedEnd
      });
      needAdjustment = (screenLine != null ? screenLine.isSoftWrapped() : void 0) && end.column >= (screenLine != null ? screenLine.text.length : void 0) - (screenLine != null ? screenLine.softWrapIndentationDelta : void 0);
      if (needAdjustment) {
        bufferRange.end.column++;
      }
      startPosition = textEditorElement.pixelPositionForScreenPosition(clippedStart);
      endPosition = textEditorElement.pixelPositionForScreenPosition(clippedEnd);
      text = displayBuffer.buffer.getTextInRange(bufferRange);
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

    return RegionRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9yZWdpb24tcmVuZGVyZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO2dDQUNKOztBQUFBLDZCQUFBLG1CQUFBLEdBQXFCLEtBQXJCLENBQUE7O0FBQUEsNkJBRUEsYUFBQSxHQUFlLFNBQUMsV0FBRCxHQUFBO0FBQ2IsVUFBQSw0REFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLFdBQVcsQ0FBQyxjQUFaLENBQUEsQ0FBUixDQUFBO0FBQ0EsTUFBQSxJQUFhLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBYjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BREE7QUFBQSxNQUdBLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVYsR0FBZ0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUh0QyxDQUFBO0FBQUEsTUFJQSxPQUFBLEdBQVUsRUFKVixDQUFBO0FBQUEsTUFNQSxhQUFBLEdBQWdCLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFObkMsQ0FBQTtBQVFBLE1BQUEsSUFBRyxPQUFBLEtBQVcsQ0FBZDtBQUNFLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFDLENBQUEsWUFBRCxDQUFjLEtBQUssQ0FBQyxLQUFwQixFQUEyQixLQUFLLENBQUMsR0FBakMsRUFBc0MsV0FBdEMsQ0FBYixDQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLElBQUMsQ0FBQSxZQUFELENBQ1gsS0FBSyxDQUFDLEtBREssRUFFWDtBQUFBLFVBQ0UsR0FBQSxFQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FEbkI7QUFBQSxVQUVFLE1BQUEsRUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/region-renderer.coffee

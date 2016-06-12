(function() {
  var CanvasDrawer, Mixin, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  Mixin = require('mixto');

  module.exports = CanvasDrawer = (function(_super) {
    __extends(CanvasDrawer, _super);

    function CanvasDrawer() {
      return CanvasDrawer.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    CanvasDrawer.prototype.initializeCanvas = function() {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      this.canvas.webkitImageSmoothingEnabled = false;
      if (this.pendingChanges == null) {
        this.pendingChanges = [];
      }
      this.offscreenCanvas = document.createElement('canvas');
      return this.offscreenContext = this.offscreenCanvas.getContext('2d');
    };

    CanvasDrawer.prototype.updateCanvas = function() {
      var firstRow, intact, intactRanges, lastRow, _i, _len;
      firstRow = this.minimap.getFirstVisibleScreenRow();
      lastRow = this.minimap.getLastVisibleScreenRow();
      intactRanges = this.computeIntactRanges(firstRow, lastRow);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (intactRanges.length === 0) {
        this.drawLines(this.context, firstRow, lastRow, 0);
      } else {
        for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
          intact = intactRanges[_i];
          this.copyBitmapPart(this.context, this.offscreenCanvas, intact.domStart, intact.start - firstRow, intact.end - intact.start);
        }
        this.fillGapsBetweenIntactRanges(this.context, intactRanges, firstRow, lastRow);
      }
      this.offscreenCanvas.width = this.canvas.width;
      this.offscreenCanvas.height = this.canvas.height;
      this.offscreenContext.drawImage(this.canvas, 0, 0);
      this.offscreenFirstRow = firstRow;
      return this.offscreenLastRow = lastRow;
    };

    CanvasDrawer.prototype.getTextOpacity = function() {
      return this.textOpacity;
    };

    CanvasDrawer.prototype.getDefaultColor = function() {
      var color;
      color = this.retrieveStyleFromDom(['.editor'], 'color', false, true);
      return this.transparentize(color, this.getTextOpacity());
    };

    CanvasDrawer.prototype.getTokenColor = function(token) {
      return this.retrieveTokenColorFromDom(token);
    };

    CanvasDrawer.prototype.getDecorationColor = function(decoration) {
      var properties;
      properties = decoration.getProperties();
      if (properties.color != null) {
        return properties.color;
      }
      return this.retrieveDecorationColorFromDom(decoration);
    };

    CanvasDrawer.prototype.retrieveTokenColorFromDom = function(token) {
      var color, scopes;
      scopes = token.scopeDescriptor || token.scopes;
      color = this.retrieveStyleFromDom(scopes, 'color');
      return this.transparentize(color, this.getTextOpacity());
    };

    CanvasDrawer.prototype.retrieveDecorationColorFromDom = function(decoration) {
      return this.retrieveStyleFromDom(decoration.getProperties().scope.split(/\s+/), 'background-color', false);
    };

    CanvasDrawer.prototype.transparentize = function(color, opacity) {
      if (opacity == null) {
        opacity = 1;
      }
      return color.replace('rgb(', 'rgba(').replace(')', ", " + opacity + ")");
    };

    CanvasDrawer.prototype.drawLines = function(context, firstRow, lastRow, offsetRow) {
      var canvasWidth, charHeight, charWidth, color, decoration, decorations, displayCodeHighlights, highlightDecorations, invisibleRegExp, line, lineDecorations, lineHeight, lines, row, screenRow, token, value, w, x, y, y0, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4;
      if (firstRow > lastRow) {
        return;
      }
      lines = this.getTextEditor().tokenizedLinesForScreenRows(firstRow, lastRow);
      lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      charHeight = this.minimap.getCharHeight() * devicePixelRatio;
      charWidth = this.minimap.getCharWidth() * devicePixelRatio;
      canvasWidth = this.canvas.width;
      displayCodeHighlights = this.displayCodeHighlights;
      decorations = this.minimap.decorationsByTypeThenRows(firstRow, lastRow);
      line = lines[0];
      invisibleRegExp = this.getInvisibleRegExp(line);
      for (row = _i = 0, _len = lines.length; _i < _len; row = ++_i) {
        line = lines[row];
        x = 0;
        y = offsetRow + row;
        screenRow = firstRow + row;
        y0 = y * lineHeight;
        lineDecorations = (_ref = decorations['line']) != null ? _ref[screenRow] : void 0;
        if (lineDecorations != null ? lineDecorations.length : void 0) {
          this.drawLineDecorations(context, lineDecorations, y0, canvasWidth, lineHeight);
        }
        highlightDecorations = (_ref1 = decorations['highlight-under']) != null ? _ref1[firstRow + row] : void 0;
        if (highlightDecorations != null ? highlightDecorations.length : void 0) {
          for (_j = 0, _len1 = highlightDecorations.length; _j < _len1; _j++) {
            decoration = highlightDecorations[_j];
            this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
          }
        }
        if ((line != null ? line.tokens : void 0) != null) {
          _ref2 = line.tokens;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            token = _ref2[_k];
            w = token.screenDelta;
            if (!token.isOnlyWhitespace()) {
              color = displayCodeHighlights ? this.getTokenColor(token) : this.getDefaultColor();
              value = token.value;
              if (invisibleRegExp != null) {
                value = value.replace(invisibleRegExp, ' ');
              }
              x = this.drawToken(context, value, color, x, y0, charWidth, charHeight);
            } else {
              x += w * charWidth;
            }
            if (x > canvasWidth) {
              break;
            }
          }
        }
        highlightDecorations = (_ref3 = decorations['highlight-over']) != null ? _ref3[firstRow + row] : void 0;
        if (highlightDecorations != null ? highlightDecorations.length : void 0) {
          for (_l = 0, _len3 = highlightDecorations.length; _l < _len3; _l++) {
            decoration = highlightDecorations[_l];
            this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
          }
        }
        highlightDecorations = (_ref4 = decorations['highlight-outline']) != null ? _ref4[firstRow + row] : void 0;
        if (highlightDecorations != null ? highlightDecorations.length : void 0) {
          for (_m = 0, _len4 = highlightDecorations.length; _m < _len4; _m++) {
            decoration = highlightDecorations[_m];
            this.drawHighlightOutlineDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
          }
        }
      }
      return context.fill();
    };

    CanvasDrawer.prototype.getInvisibleRegExp = function(line) {
      var invisibles;
      if ((line != null) && (line.invisibles != null)) {
        invisibles = [];
        if (line.invisibles.cr != null) {
          invisibles.push(line.invisibles.cr);
        }
        if (line.invisibles.eol != null) {
          invisibles.push(line.invisibles.eol);
        }
        if (line.invisibles.space != null) {
          invisibles.push(line.invisibles.space);
        }
        if (line.invisibles.tab != null) {
          invisibles.push(line.invisibles.tab);
        }
        return RegExp("" + (invisibles.map(_.escapeRegExp).join('|')), "g");
      }
    };

    CanvasDrawer.prototype.drawToken = function(context, text, color, x, y, charWidth, charHeight) {
      var char, chars, _i, _len;
      context.fillStyle = color;
      chars = 0;
      for (_i = 0, _len = text.length; _i < _len; _i++) {
        char = text[_i];
        if (/\s/.test(char)) {
          if (chars > 0) {
            context.fillRect(x - (chars * charWidth), y, chars * charWidth, charHeight);
          }
          chars = 0;
        } else {
          chars++;
        }
        x += charWidth;
      }
      if (chars > 0) {
        context.fillRect(x - (chars * charWidth), y, chars * charWidth, charHeight);
      }
      return x;
    };

    CanvasDrawer.prototype.drawLineDecorations = function(context, decorations, y, canvasWidth, lineHeight) {
      var decoration, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = decorations.length; _i < _len; _i++) {
        decoration = decorations[_i];
        context.fillStyle = this.getDecorationColor(decoration);
        _results.push(context.fillRect(0, y, canvasWidth, lineHeight));
      }
      return _results;
    };

    CanvasDrawer.prototype.drawHighlightDecoration = function(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth) {
      var colSpan, range, rowSpan, x;
      context.fillStyle = this.getDecorationColor(decoration);
      range = decoration.getMarker().getScreenRange();
      rowSpan = range.end.row - range.start.row;
      if (rowSpan === 0) {
        colSpan = range.end.column - range.start.column;
        return context.fillRect(range.start.column * charWidth, y * lineHeight, colSpan * charWidth, lineHeight);
      } else {
        if (screenRow === range.start.row) {
          x = range.start.column * charWidth;
          return context.fillRect(x, y * lineHeight, canvasWidth - x, lineHeight);
        } else if (screenRow === range.end.row) {
          return context.fillRect(0, y * lineHeight, range.end.column * charWidth, lineHeight);
        } else {
          return context.fillRect(0, y * lineHeight, canvasWidth, lineHeight);
        }
      }
    };

    CanvasDrawer.prototype.drawHighlightOutlineDecoration = function(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth) {
      var bottomWidth, colSpan, range, rowSpan, width, xBottomStart, xEnd, xStart, yEnd, yStart;
      context.fillStyle = this.getDecorationColor(decoration);
      range = decoration.getMarker().getScreenRange();
      rowSpan = range.end.row - range.start.row;
      if (rowSpan === 0) {
        colSpan = range.end.column - range.start.column;
        width = colSpan * charWidth;
        xStart = range.start.column * charWidth;
        xEnd = xStart + width;
        yStart = y * lineHeight;
        yEnd = yStart + lineHeight;
        context.fillRect(xStart, yStart, width, 1);
        context.fillRect(xStart, yEnd, width, 1);
        context.fillRect(xStart, yStart, 1, lineHeight);
        return context.fillRect(xEnd, yStart, 1, lineHeight);
      } else if (rowSpan === 1) {
        xStart = range.start.column * charWidth;
        xEnd = range.end.column * charWidth;
        if (screenRow === range.start.row) {
          width = canvasWidth - xStart;
          yStart = y * lineHeight;
          yEnd = yStart + lineHeight;
          xBottomStart = Math.max(xStart, xEnd);
          bottomWidth = canvasWidth - xBottomStart;
          context.fillRect(xStart, yStart, width, 1);
          context.fillRect(xBottomStart, yEnd, bottomWidth, 1);
          context.fillRect(xStart, yStart, 1, lineHeight);
          return context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
        } else {
          width = canvasWidth - xStart;
          yStart = y * lineHeight;
          yEnd = yStart + lineHeight;
          bottomWidth = canvasWidth - xEnd;
          context.fillRect(0, yStart, xStart, 1);
          context.fillRect(0, yEnd, xEnd, 1);
          context.fillRect(0, yStart, 1, lineHeight);
          return context.fillRect(xEnd, yStart, 1, lineHeight);
        }
      } else {
        xStart = range.start.column * charWidth;
        xEnd = range.end.column * charWidth;
        if (screenRow === range.start.row) {
          width = canvasWidth - xStart;
          yStart = y * lineHeight;
          yEnd = yStart + lineHeight;
          context.fillRect(xStart, yStart, width, 1);
          context.fillRect(xStart, yStart, 1, lineHeight);
          return context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
        } else if (screenRow === range.end.row) {
          width = canvasWidth - xStart;
          yStart = y * lineHeight;
          yEnd = yStart + lineHeight;
          context.fillRect(0, yEnd, xEnd, 1);
          context.fillRect(0, yStart, 1, lineHeight);
          return context.fillRect(xEnd, yStart, 1, lineHeight);
        } else {
          yStart = y * lineHeight;
          yEnd = yStart + lineHeight;
          context.fillRect(0, yStart, 1, lineHeight);
          context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
          if (screenRow === range.start.row + 1) {
            context.fillRect(0, yStart, xStart, 1);
          }
          if (screenRow === range.end.row - 1) {
            return context.fillRect(xEnd, yEnd, canvasWidth - xEnd, 1);
          }
        }
      }
    };

    CanvasDrawer.prototype.copyBitmapPart = function(context, bitmapCanvas, srcRow, destRow, rowCount) {
      var lineHeight;
      lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      return context.drawImage(bitmapCanvas, 0, srcRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight, 0, destRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight);
    };


    /* Internal */

    CanvasDrawer.prototype.fillGapsBetweenIntactRanges = function(context, intactRanges, firstRow, lastRow) {
      var currentRow, intact, _i, _len;
      currentRow = firstRow;
      for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
        intact = intactRanges[_i];
        this.drawLines(context, currentRow, intact.start - 1, currentRow - firstRow);
        currentRow = intact.end;
      }
      if (currentRow <= lastRow) {
        return this.drawLines(context, currentRow, lastRow, currentRow - firstRow);
      }
    };

    CanvasDrawer.prototype.computeIntactRanges = function(firstRow, lastRow) {
      var change, intactRange, intactRanges, newIntactRanges, range, _i, _j, _len, _len1, _ref;
      if ((this.offscreenFirstRow == null) && (this.offscreenLastRow == null)) {
        return [];
      }
      intactRanges = [
        {
          start: this.offscreenFirstRow,
          end: this.offscreenLastRow,
          domStart: 0
        }
      ];
      _ref = this.pendingChanges;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        change = _ref[_i];
        newIntactRanges = [];
        for (_j = 0, _len1 = intactRanges.length; _j < _len1; _j++) {
          range = intactRanges[_j];
          if (change.end < range.start && change.screenDelta !== 0) {
            newIntactRanges.push({
              start: range.start + change.screenDelta,
              end: range.end + change.screenDelta,
              domStart: range.domStart
            });
          } else if (change.end < range.start || change.start > range.end) {
            newIntactRanges.push(range);
          } else {
            if (change.start > range.start) {
              newIntactRanges.push({
                start: range.start,
                end: change.start - 1,
                domStart: range.domStart
              });
            }
            if (change.end < range.end) {
              if (change.bufferDelta !== 0) {
                newIntactRanges.push({
                  start: change.end + change.screenDelta + 1,
                  end: range.end + change.screenDelta,
                  domStart: range.domStart + change.end + 1 - range.start
                });
              }
            }
          }
          intactRange = newIntactRanges[newIntactRanges.length - 1];
        }
        intactRanges = newIntactRanges;
      }
      this.truncateIntactRanges(intactRanges, firstRow, lastRow);
      this.pendingChanges = [];
      return intactRanges;
    };

    CanvasDrawer.prototype.truncateIntactRanges = function(intactRanges, firstRow, lastRow) {
      var i, range;
      i = 0;
      while (i < intactRanges.length) {
        range = intactRanges[i];
        if (range.start < firstRow) {
          range.domStart += firstRow - range.start;
          range.start = firstRow;
        }
        if (range.end > lastRow) {
          range.end = lastRow;
        }
        if (range.start >= range.end) {
          intactRanges.splice(i--, 1);
        }
        i++;
      }
      return intactRanges.sort(function(a, b) {
        return a.domStart - b.domStart;
      });
    };

    return CanvasDrawer;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWl4aW5zL2NhbnZhcy1kcmF3ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQURSLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBO0FBQUEsZ0JBQUE7O0FBQUEsMkJBR0EsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QixDQUFWLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CLENBRFgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQywyQkFBUixHQUFzQyxLQUZ0QyxDQUFBOztRQUdBLElBQUMsQ0FBQSxpQkFBa0I7T0FIbkI7QUFBQSxNQUtBLElBQUMsQ0FBQSxlQUFELEdBQW1CLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBTG5CLENBQUE7YUFNQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBQyxDQUFBLGVBQWUsQ0FBQyxVQUFqQixDQUE0QixJQUE1QixFQVBKO0lBQUEsQ0FIbEIsQ0FBQTs7QUFBQSwyQkFjQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSxpREFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxPQUFPLENBQUMsd0JBQVQsQ0FBQSxDQUFYLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLHVCQUFULENBQUEsQ0FEVixDQUFBO0FBQUEsTUFHQSxZQUFBLEdBQWUsSUFBQyxDQUFBLG1CQUFELENBQXFCLFFBQXJCLEVBQStCLE9BQS9CLENBSGYsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQW1CLENBQW5CLEVBQXFCLENBQXJCLEVBQXVCLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBL0IsRUFBc0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUE5QyxDQUxBLENBQUE7QUFPQSxNQUFBLElBQUcsWUFBWSxDQUFDLE1BQWIsS0FBdUIsQ0FBMUI7QUFDRSxRQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLE9BQVosRUFBcUIsUUFBckIsRUFBK0IsT0FBL0IsRUFBd0MsQ0FBeEMsQ0FBQSxDQURGO09BQUEsTUFBQTtBQUdFLGFBQUEsbURBQUE7b0NBQUE7QUFDRSxVQUFBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUMsQ0FBQSxPQUFqQixFQUEwQixJQUFDLENBQUEsZUFBM0IsRUFBNEMsTUFBTSxDQUFDLFFBQW5ELEVBQTZELE1BQU0sQ0FBQyxLQUFQLEdBQWEsUUFBMUUsRUFBb0YsTUFBTSxDQUFDLEdBQVAsR0FBVyxNQUFNLENBQUMsS0FBdEcsQ0FBQSxDQURGO0FBQUEsU0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLDJCQUFELENBQTZCLElBQUMsQ0FBQSxPQUE5QixFQUF1QyxZQUF2QyxFQUFxRCxRQUFyRCxFQUErRCxPQUEvRCxDQUZBLENBSEY7T0FQQTtBQUFBLE1BZUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxLQUFqQixHQUF5QixJQUFDLENBQUEsTUFBTSxDQUFDLEtBZmpDLENBQUE7QUFBQSxNQWdCQSxJQUFDLENBQUEsZUFBZSxDQUFDLE1BQWpCLEdBQTBCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFoQmxDLENBQUE7QUFBQSxNQWlCQSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsU0FBbEIsQ0FBNEIsSUFBQyxDQUFBLE1BQTdCLEVBQXFDLENBQXJDLEVBQXdDLENBQXhDLENBakJBLENBQUE7QUFBQSxNQWtCQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsUUFsQnJCLENBQUE7YUFtQkEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLFFBcEJSO0lBQUEsQ0FkZCxDQUFBOztBQUFBLDJCQStDQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxZQUFKO0lBQUEsQ0EvQ2hCLENBQUE7O0FBQUEsMkJBdURBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLG9CQUFELENBQXNCLENBQUMsU0FBRCxDQUF0QixFQUFtQyxPQUFuQyxFQUE0QyxLQUE1QyxFQUFtRCxJQUFuRCxDQUFSLENBQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxDQUFnQixLQUFoQixFQUF1QixJQUFDLENBQUEsY0FBRCxDQUFBLENBQXZCLEVBRmU7SUFBQSxDQXZEakIsQ0FBQTs7QUFBQSwyQkFtRUEsYUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO2FBQVcsSUFBQyxDQUFBLHlCQUFELENBQTJCLEtBQTNCLEVBQVg7SUFBQSxDQW5FZixDQUFBOztBQUFBLDJCQThFQSxrQkFBQSxHQUFvQixTQUFDLFVBQUQsR0FBQTtBQUNsQixVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxVQUFVLENBQUMsYUFBWCxDQUFBLENBQWIsQ0FBQTtBQUNBLE1BQUEsSUFBMkIsd0JBQTNCO0FBQUEsZUFBTyxVQUFVLENBQUMsS0FBbEIsQ0FBQTtPQURBO2FBRUEsSUFBQyxDQUFBLDhCQUFELENBQWdDLFVBQWhDLEVBSGtCO0lBQUEsQ0E5RXBCLENBQUE7O0FBQUEsMkJBd0ZBLHlCQUFBLEdBQTJCLFNBQUMsS0FBRCxHQUFBO0FBRXpCLFVBQUEsYUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFVLEtBQUssQ0FBQyxlQUFOLElBQXlCLEtBQUssQ0FBQyxNQUF6QyxDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVEsSUFBQyxDQUFBLG9CQUFELENBQXNCLE1BQXRCLEVBQThCLE9BQTlCLENBRFIsQ0FBQTthQUVBLElBQUMsQ0FBQSxjQUFELENBQWdCLEtBQWhCLEVBQXVCLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBdkIsRUFKeUI7SUFBQSxDQXhGM0IsQ0FBQTs7QUFBQSwyQkFtR0EsOEJBQUEsR0FBZ0MsU0FBQyxVQUFELEdBQUE7YUFDOUIsSUFBQyxDQUFBLG9CQUFELENBQXNCLFVBQVUsQ0FBQyxhQUFYLENBQUEsQ0FBMEIsQ0FBQyxLQUFLLENBQUMsS0FBakMsQ0FBdUMsS0FBdkMsQ0FBdEIsRUFBcUUsa0JBQXJFLEVBQXlGLEtBQXpGLEVBRDhCO0lBQUEsQ0FuR2hDLENBQUE7O0FBQUEsMkJBNkdBLGNBQUEsR0FBZ0IsU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBOztRQUFRLFVBQVE7T0FDOUI7YUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLE1BQWQsRUFBc0IsT0FBdEIsQ0FBOEIsQ0FBQyxPQUEvQixDQUF1QyxHQUF2QyxFQUE2QyxJQUFBLEdBQUksT0FBSixHQUFZLEdBQXpELEVBRGM7SUFBQSxDQTdHaEIsQ0FBQTs7QUFBQSwyQkFpSUEsU0FBQSxHQUFXLFNBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsU0FBN0IsR0FBQTtBQUNULFVBQUEsNlNBQUE7QUFBQSxNQUFBLElBQVUsUUFBQSxHQUFXLE9BQXJCO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLEtBQUEsR0FBUSxJQUFDLENBQUEsYUFBRCxDQUFBLENBQWdCLENBQUMsMkJBQWpCLENBQTZDLFFBQTdDLEVBQXVELE9BQXZELENBRlIsQ0FBQTtBQUFBLE1BR0EsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUFBLENBQUEsR0FBMkIsZ0JBSHhDLENBQUE7QUFBQSxNQUlBLFVBQUEsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBQSxDQUFBLEdBQTJCLGdCQUp4QyxDQUFBO0FBQUEsTUFLQSxTQUFBLEdBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsQ0FBQSxHQUEwQixnQkFMdEMsQ0FBQTtBQUFBLE1BTUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FOdEIsQ0FBQTtBQUFBLE1BT0EscUJBQUEsR0FBd0IsSUFBQyxDQUFBLHFCQVB6QixDQUFBO0FBQUEsTUFRQSxXQUFBLEdBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyx5QkFBVCxDQUFtQyxRQUFuQyxFQUE2QyxPQUE3QyxDQVJkLENBQUE7QUFBQSxNQVVBLElBQUEsR0FBTyxLQUFNLENBQUEsQ0FBQSxDQVZiLENBQUE7QUFBQSxNQWNBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQXBCLENBZGxCLENBQUE7QUFnQkEsV0FBQSx3REFBQTswQkFBQTtBQUNFLFFBQUEsQ0FBQSxHQUFJLENBQUosQ0FBQTtBQUFBLFFBQ0EsQ0FBQSxHQUFJLFNBQUEsR0FBWSxHQURoQixDQUFBO0FBQUEsUUFFQSxTQUFBLEdBQVksUUFBQSxHQUFXLEdBRnZCLENBQUE7QUFBQSxRQUdBLEVBQUEsR0FBSyxDQUFBLEdBQUUsVUFIUCxDQUFBO0FBQUEsUUFNQSxlQUFBLDhDQUF1QyxDQUFBLFNBQUEsVUFOdkMsQ0FBQTtBQVFBLFFBQUEsOEJBQStFLGVBQWUsQ0FBRSxlQUFoRztBQUFBLFVBQUEsSUFBQyxDQUFBLG1CQUFELENBQXFCLE9BQXJCLEVBQThCLGVBQTlCLEVBQStDLEVBQS9DLEVBQW1ELFdBQW5ELEVBQWdFLFVBQWhFLENBQUEsQ0FBQTtTQVJBO0FBQUEsUUFXQSxvQkFBQSwyREFBdUQsQ0FBQSxRQUFBLEdBQVcsR0FBWCxVQVh2RCxDQUFBO0FBWUEsUUFBQSxtQ0FBRyxvQkFBb0IsQ0FBRSxlQUF6QjtBQUNFLGVBQUEsNkRBQUE7a0RBQUE7QUFDRSxZQUFBLElBQUMsQ0FBQSx1QkFBRCxDQUF5QixPQUF6QixFQUFrQyxVQUFsQyxFQUE4QyxDQUE5QyxFQUFpRCxTQUFqRCxFQUE0RCxVQUE1RCxFQUF3RSxTQUF4RSxFQUFtRixXQUFuRixDQUFBLENBREY7QUFBQSxXQURGO1NBWkE7QUFpQkEsUUFBQSxJQUFHLDZDQUFIO0FBQ0U7QUFBQSxlQUFBLDhDQUFBOzhCQUFBO0FBQ0UsWUFBQSxDQUFBLEdBQUksS0FBSyxDQUFDLFdBQVYsQ0FBQTtBQUNBLFlBQUEsSUFBQSxDQUFBLEtBQVksQ0FBQyxnQkFBTixDQUFBLENBQVA7QUFDRSxjQUFBLEtBQUEsR0FBVyxxQkFBSCxHQUNOLElBQUMsQ0FBQSxhQUFELENBQWUsS0FBZixDQURNLEdBR04sSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUhGLENBQUE7QUFBQSxjQUtBLEtBQUEsR0FBUSxLQUFLLENBQUMsS0FMZCxDQUFBO0FBTUEsY0FBQSxJQUErQyx1QkFBL0M7QUFBQSxnQkFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxlQUFkLEVBQStCLEdBQS9CLENBQVIsQ0FBQTtlQU5BO0FBQUEsY0FRQSxDQUFBLEdBQUksSUFBQyxDQUFBLFNBQUQsQ0FBVyxPQUFYLEVBQW9CLEtBQXBCLEVBQTJCLEtBQTNCLEVBQWtDLENBQWxDLEVBQXFDLEVBQXJDLEVBQXlDLFNBQXpDLEVBQW9ELFVBQXBELENBUkosQ0FERjthQUFBLE1BQUE7QUFXRSxjQUFBLENBQUEsSUFBSyxDQUFBLEdBQUksU0FBVCxDQVhGO2FBREE7QUFjQSxZQUFBLElBQVMsQ0FBQSxHQUFJLFdBQWI7QUFBQSxvQkFBQTthQWZGO0FBQUEsV0FERjtTQWpCQTtBQUFBLFFBb0NBLG9CQUFBLDBEQUFzRCxDQUFBLFFBQUEsR0FBVyxHQUFYLFVBcEN0RCxDQUFBO0FBcUNBLFFBQUEsbUNBQUcsb0JBQW9CLENBQUUsZUFBekI7QUFDRSxlQUFBLDZEQUFBO2tEQUFBO0FBQ0UsWUFBQSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsT0FBekIsRUFBa0MsVUFBbEMsRUFBOEMsQ0FBOUMsRUFBaUQsU0FBakQsRUFBNEQsVUFBNUQsRUFBd0UsU0FBeEUsRUFBbUYsV0FBbkYsQ0FBQSxDQURGO0FBQUEsV0FERjtTQXJDQTtBQUFBLFFBMENBLG9CQUFBLDZEQUF5RCxDQUFBLFFBQUEsR0FBVyxHQUFYLFVBMUN6RCxDQUFBO0FBMkNBLFFBQUEsbUNBQUcsb0JBQW9CLENBQUUsZUFBekI7QUFDRSxlQUFBLDZEQUFBO2tEQUFBO0FBQ0UsWUFBQSxJQUFDLENBQUEsOEJBQUQsQ0FBZ0MsT0FBaEMsRUFBeUMsVUFBekMsRUFBcUQsQ0FBckQsRUFBd0QsU0FBeEQsRUFBbUUsVUFBbkUsRUFBK0UsU0FBL0UsRUFBMEYsV0FBMUYsQ0FBQSxDQURGO0FBQUEsV0FERjtTQTVDRjtBQUFBLE9BaEJBO2FBZ0VBLE9BQU8sQ0FBQyxJQUFSLENBQUEsRUFqRVM7SUFBQSxDQWpJWCxDQUFBOztBQUFBLDJCQXdNQSxrQkFBQSxHQUFvQixTQUFDLElBQUQsR0FBQTtBQUNsQixVQUFBLFVBQUE7QUFBQSxNQUFBLElBQUcsY0FBQSxJQUFVLHlCQUFiO0FBQ0UsUUFBQSxVQUFBLEdBQWEsRUFBYixDQUFBO0FBQ0EsUUFBQSxJQUFzQywwQkFBdEM7QUFBQSxVQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBaEMsQ0FBQSxDQUFBO1NBREE7QUFFQSxRQUFBLElBQXVDLDJCQUF2QztBQUFBLFVBQUEsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFoQyxDQUFBLENBQUE7U0FGQTtBQUdBLFFBQUEsSUFBeUMsNkJBQXpDO0FBQUEsVUFBQSxVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQWhDLENBQUEsQ0FBQTtTQUhBO0FBSUEsUUFBQSxJQUF1QywyQkFBdkM7QUFBQSxVQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBaEMsQ0FBQSxDQUFBO1NBSkE7ZUFNQSxNQUFBLENBQUEsRUFBQSxHQUFJLENBQUMsVUFBVSxDQUFDLEdBQVgsQ0FBZSxDQUFDLENBQUMsWUFBakIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxHQUFwQyxDQUFELENBQUosRUFBaUQsR0FBakQsRUFQRjtPQURrQjtJQUFBLENBeE1wQixDQUFBOztBQUFBLDJCQTZOQSxTQUFBLEdBQVcsU0FBQyxPQUFELEVBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QixTQUE3QixFQUF3QyxVQUF4QyxHQUFBO0FBQ1QsVUFBQSxxQkFBQTtBQUFBLE1BQUEsT0FBTyxDQUFDLFNBQVIsR0FBb0IsS0FBcEIsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLENBRFIsQ0FBQTtBQUVBLFdBQUEsMkNBQUE7d0JBQUE7QUFDRSxRQUFBLElBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQUg7QUFDRSxVQUFBLElBQUcsS0FBQSxHQUFRLENBQVg7QUFDRSxZQUFBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQUEsR0FBRSxDQUFDLEtBQUEsR0FBUSxTQUFULENBQW5CLEVBQXdDLENBQXhDLEVBQTJDLEtBQUEsR0FBTSxTQUFqRCxFQUE0RCxVQUE1RCxDQUFBLENBREY7V0FBQTtBQUFBLFVBRUEsS0FBQSxHQUFRLENBRlIsQ0FERjtTQUFBLE1BQUE7QUFLRSxVQUFBLEtBQUEsRUFBQSxDQUxGO1NBQUE7QUFBQSxRQU9BLENBQUEsSUFBSyxTQVBMLENBREY7QUFBQSxPQUZBO0FBWUEsTUFBQSxJQUEyRSxLQUFBLEdBQVEsQ0FBbkY7QUFBQSxRQUFBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQUEsR0FBRSxDQUFDLEtBQUEsR0FBUSxTQUFULENBQW5CLEVBQXdDLENBQXhDLEVBQTJDLEtBQUEsR0FBTSxTQUFqRCxFQUE0RCxVQUE1RCxDQUFBLENBQUE7T0FaQTthQWNBLEVBZlM7SUFBQSxDQTdOWCxDQUFBOztBQUFBLDJCQXFQQSxtQkFBQSxHQUFxQixTQUFDLE9BQUQsRUFBVSxXQUFWLEVBQXVCLENBQXZCLEVBQTBCLFdBQTFCLEVBQXVDLFVBQXZDLEdBQUE7QUFDbkIsVUFBQSw4QkFBQTtBQUFBO1dBQUEsa0RBQUE7cUNBQUE7QUFDRSxRQUFBLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixVQUFwQixDQUFwQixDQUFBO0FBQUEsc0JBQ0EsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsQ0FBakIsRUFBbUIsQ0FBbkIsRUFBcUIsV0FBckIsRUFBaUMsVUFBakMsRUFEQSxDQURGO0FBQUE7c0JBRG1CO0lBQUEsQ0FyUHJCLENBQUE7O0FBQUEsMkJBc1FBLHVCQUFBLEdBQXlCLFNBQUMsT0FBRCxFQUFVLFVBQVYsRUFBc0IsQ0FBdEIsRUFBeUIsU0FBekIsRUFBb0MsVUFBcEMsRUFBZ0QsU0FBaEQsRUFBMkQsV0FBM0QsR0FBQTtBQUN2QixVQUFBLDBCQUFBO0FBQUEsTUFBQSxPQUFPLENBQUMsU0FBUixHQUFvQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsVUFBcEIsQ0FBcEIsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLFVBQVUsQ0FBQyxTQUFYLENBQUEsQ0FBc0IsQ0FBQyxjQUF2QixDQUFBLENBRFIsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVixHQUFnQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBRnRDLENBQUE7QUFJQSxNQUFBLElBQUcsT0FBQSxLQUFXLENBQWQ7QUFDRSxRQUFBLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQVYsR0FBbUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUF6QyxDQUFBO2VBQ0EsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFaLEdBQW1CLFNBQXBDLEVBQThDLENBQUEsR0FBRSxVQUFoRCxFQUEyRCxPQUFBLEdBQVEsU0FBbkUsRUFBNkUsVUFBN0UsRUFGRjtPQUFBLE1BQUE7QUFJRSxRQUFBLElBQUcsU0FBQSxLQUFhLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBNUI7QUFDRSxVQUFBLENBQUEsR0FBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosR0FBcUIsU0FBekIsQ0FBQTtpQkFDQSxPQUFPLENBQUMsUUFBUixDQUFpQixDQUFqQixFQUFtQixDQUFBLEdBQUUsVUFBckIsRUFBZ0MsV0FBQSxHQUFZLENBQTVDLEVBQThDLFVBQTlDLEVBRkY7U0FBQSxNQUdLLElBQUcsU0FBQSxLQUFhLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBMUI7aUJBQ0gsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsQ0FBakIsRUFBbUIsQ0FBQSxHQUFFLFVBQXJCLEVBQWdDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBVixHQUFtQixTQUFuRCxFQUE2RCxVQUE3RCxFQURHO1NBQUEsTUFBQTtpQkFHSCxPQUFPLENBQUMsUUFBUixDQUFpQixDQUFqQixFQUFtQixDQUFBLEdBQUUsVUFBckIsRUFBZ0MsV0FBaEMsRUFBNEMsVUFBNUMsRUFIRztTQVBQO09BTHVCO0lBQUEsQ0F0UXpCLENBQUE7O0FBQUEsMkJBbVNBLDhCQUFBLEdBQWdDLFNBQUMsT0FBRCxFQUFVLFVBQVYsRUFBc0IsQ0FBdEIsRUFBeUIsU0FBekIsRUFBb0MsVUFBcEMsRUFBZ0QsU0FBaEQsRUFBMkQsV0FBM0QsR0FBQTtBQUM5QixVQUFBLHFGQUFBO0FBQUEsTUFBQSxPQUFPLENBQUMsU0FBUixHQUFvQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsVUFBcEIsQ0FBcEIsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLFVBQVUsQ0FBQyxTQUFYLENBQUEsQ0FBc0IsQ0FBQyxjQUF2QixDQUFBLENBRFIsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVixHQUFnQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBRnRDLENBQUE7QUFJQSxNQUFBLElBQUcsT0FBQSxLQUFXLENBQWQ7QUFDRSxRQUFBLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQVYsR0FBbUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUF6QyxDQUFBO0FBQUEsUUFDQSxLQUFBLEdBQVEsT0FBQSxHQUFVLFNBRGxCLENBQUE7QUFBQSxRQUVBLE1BQUEsR0FBUyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosR0FBcUIsU0FGOUIsQ0FBQTtBQUFBLFFBR0EsSUFBQSxHQUFPLE1BQUEsR0FBUyxLQUhoQixDQUFBO0FBQUEsUUFJQSxNQUFBLEdBQVMsQ0FBQSxHQUFJLFVBSmIsQ0FBQTtBQUFBLFFBS0EsSUFBQSxHQUFPLE1BQUEsR0FBUyxVQUxoQixDQUFBO0FBQUEsUUFPQSxPQUFPLENBQUMsUUFBUixDQUFpQixNQUFqQixFQUF5QixNQUF6QixFQUFpQyxLQUFqQyxFQUF3QyxDQUF4QyxDQVBBLENBQUE7QUFBQSxRQVFBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLE1BQWpCLEVBQXlCLElBQXpCLEVBQStCLEtBQS9CLEVBQXNDLENBQXRDLENBUkEsQ0FBQTtBQUFBLFFBU0EsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsTUFBakIsRUFBeUIsTUFBekIsRUFBaUMsQ0FBakMsRUFBb0MsVUFBcEMsQ0FUQSxDQUFBO2VBVUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsSUFBakIsRUFBdUIsTUFBdkIsRUFBK0IsQ0FBL0IsRUFBa0MsVUFBbEMsRUFYRjtPQUFBLE1BYUssSUFBRyxPQUFBLEtBQVcsQ0FBZDtBQUNILFFBQUEsTUFBQSxHQUFTLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBWixHQUFxQixTQUE5QixDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFWLEdBQW1CLFNBRDFCLENBQUE7QUFFQSxRQUFBLElBQUcsU0FBQSxLQUFhLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBNUI7QUFDRSxVQUFBLEtBQUEsR0FBUSxXQUFBLEdBQWMsTUFBdEIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxHQUFTLENBQUEsR0FBSSxVQURiLENBQUE7QUFBQSxVQUVBLElBQUEsR0FBTyxNQUFBLEdBQVMsVUFGaEIsQ0FBQTtBQUFBLFVBR0EsWUFBQSxHQUFlLElBQUksQ0FBQyxHQUFMLENBQVMsTUFBVCxFQUFpQixJQUFqQixDQUhmLENBQUE7QUFBQSxVQUlBLFdBQUEsR0FBYyxXQUFBLEdBQWMsWUFKNUIsQ0FBQTtBQUFBLFVBTUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsTUFBakIsRUFBeUIsTUFBekIsRUFBaUMsS0FBakMsRUFBd0MsQ0FBeEMsQ0FOQSxDQUFBO0FBQUEsVUFPQSxPQUFPLENBQUMsUUFBUixDQUFpQixZQUFqQixFQUErQixJQUEvQixFQUFxQyxXQUFyQyxFQUFrRCxDQUFsRCxDQVBBLENBQUE7QUFBQSxVQVFBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLE1BQWpCLEVBQXlCLE1BQXpCLEVBQWlDLENBQWpDLEVBQW9DLFVBQXBDLENBUkEsQ0FBQTtpQkFTQSxPQUFPLENBQUMsUUFBUixDQUFpQixXQUFBLEdBQWMsQ0FBL0IsRUFBa0MsTUFBbEMsRUFBMEMsQ0FBMUMsRUFBNkMsVUFBN0MsRUFWRjtTQUFBLE1BQUE7QUFZRSxVQUFBLEtBQUEsR0FBUSxXQUFBLEdBQWMsTUFBdEIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxHQUFTLENBQUEsR0FBSSxVQURiLENBQUE7QUFBQSxVQUVBLElBQUEsR0FBTyxNQUFBLEdBQVMsVUFGaEIsQ0FBQTtBQUFBLFVBR0EsV0FBQSxHQUFjLFdBQUEsR0FBYyxJQUg1QixDQUFBO0FBQUEsVUFLQSxPQUFPLENBQUMsUUFBUixDQUFpQixDQUFqQixFQUFvQixNQUFwQixFQUE0QixNQUE1QixFQUFvQyxDQUFwQyxDQUxBLENBQUE7QUFBQSxVQU1BLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQWpCLEVBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDLENBQWhDLENBTkEsQ0FBQTtBQUFBLFVBT0EsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsQ0FBakIsRUFBb0IsTUFBcEIsRUFBNEIsQ0FBNUIsRUFBK0IsVUFBL0IsQ0FQQSxDQUFBO2lCQVFBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLElBQWpCLEVBQXVCLE1BQXZCLEVBQStCLENBQS9CLEVBQWtDLFVBQWxDLEVBcEJGO1NBSEc7T0FBQSxNQUFBO0FBeUJILFFBQUEsTUFBQSxHQUFTLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBWixHQUFxQixTQUE5QixDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFWLEdBQW1CLFNBRDFCLENBQUE7QUFHQSxRQUFBLElBQUcsU0FBQSxLQUFhLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBNUI7QUFDRSxVQUFBLEtBQUEsR0FBUSxXQUFBLEdBQWMsTUFBdEIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxHQUFTLENBQUEsR0FBSSxVQURiLENBQUE7QUFBQSxVQUVBLElBQUEsR0FBTyxNQUFBLEdBQVMsVUFGaEIsQ0FBQTtBQUFBLFVBSUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsTUFBakIsRUFBeUIsTUFBekIsRUFBaUMsS0FBakMsRUFBd0MsQ0FBeEMsQ0FKQSxDQUFBO0FBQUEsVUFLQSxPQUFPLENBQUMsUUFBUixDQUFpQixNQUFqQixFQUF5QixNQUF6QixFQUFpQyxDQUFqQyxFQUFvQyxVQUFwQyxDQUxBLENBQUE7aUJBTUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsV0FBQSxHQUFjLENBQS9CLEVBQWtDLE1BQWxDLEVBQTBDLENBQTFDLEVBQTZDLFVBQTdDLEVBUEY7U0FBQSxNQVNLLElBQUcsU0FBQSxLQUFhLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBMUI7QUFDSCxVQUFBLEtBQUEsR0FBUSxXQUFBLEdBQWMsTUFBdEIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxHQUFTLENBQUEsR0FBSSxVQURiLENBQUE7QUFBQSxVQUVBLElBQUEsR0FBTyxNQUFBLEdBQVMsVUFGaEIsQ0FBQTtBQUFBLFVBSUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsQ0FBakIsRUFBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBZ0MsQ0FBaEMsQ0FKQSxDQUFBO0FBQUEsVUFLQSxPQUFPLENBQUMsUUFBUixDQUFpQixDQUFqQixFQUFvQixNQUFwQixFQUE0QixDQUE1QixFQUErQixVQUEvQixDQUxBLENBQUE7aUJBTUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsSUFBakIsRUFBdUIsTUFBdkIsRUFBK0IsQ0FBL0IsRUFBa0MsVUFBbEMsRUFQRztTQUFBLE1BQUE7QUFTSCxVQUFBLE1BQUEsR0FBUyxDQUFBLEdBQUksVUFBYixDQUFBO0FBQUEsVUFDQSxJQUFBLEdBQU8sTUFBQSxHQUFTLFVBRGhCLENBQUE7QUFBQSxVQUdBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQWpCLEVBQW9CLE1BQXBCLEVBQTRCLENBQTVCLEVBQStCLFVBQS9CLENBSEEsQ0FBQTtBQUFBLFVBSUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsV0FBQSxHQUFjLENBQS9CLEVBQWtDLE1BQWxDLEVBQTBDLENBQTFDLEVBQTZDLFVBQTdDLENBSkEsQ0FBQTtBQU1BLFVBQUEsSUFBRyxTQUFBLEtBQWEsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFaLEdBQWtCLENBQWxDO0FBQ0UsWUFBQSxPQUFPLENBQUMsUUFBUixDQUFpQixDQUFqQixFQUFvQixNQUFwQixFQUE0QixNQUE1QixFQUFvQyxDQUFwQyxDQUFBLENBREY7V0FOQTtBQVNBLFVBQUEsSUFBRyxTQUFBLEtBQWEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFWLEdBQWdCLENBQWhDO21CQUNFLE9BQU8sQ0FBQyxRQUFSLENBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCLFdBQUEsR0FBYyxJQUEzQyxFQUFpRCxDQUFqRCxFQURGO1dBbEJHO1NBckNGO09BbEJ5QjtJQUFBLENBblNoQyxDQUFBOztBQUFBLDJCQXVYQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxFQUFVLFlBQVYsRUFBd0IsTUFBeEIsRUFBZ0MsT0FBaEMsRUFBeUMsUUFBekMsR0FBQTtBQUNkLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUFBLENBQUEsR0FBMkIsZ0JBQXhDLENBQUE7YUFDQSxPQUFPLENBQUMsU0FBUixDQUFrQixZQUFsQixFQUNJLENBREosRUFDTyxNQUFBLEdBQVMsVUFEaEIsRUFFSSxZQUFZLENBQUMsS0FGakIsRUFFd0IsUUFBQSxHQUFXLFVBRm5DLEVBR0ksQ0FISixFQUdPLE9BQUEsR0FBVSxVQUhqQixFQUlJLFlBQVksQ0FBQyxLQUpqQixFQUl3QixRQUFBLEdBQVcsVUFKbkMsRUFGYztJQUFBLENBdlhoQixDQUFBOztBQXVZQTtBQUFBLGtCQXZZQTs7QUFBQSwyQkFnWkEsMkJBQUEsR0FBNkIsU0FBQyxPQUFELEVBQVUsWUFBVixFQUF3QixRQUF4QixFQUFrQyxPQUFsQyxHQUFBO0FBQzNCLFVBQUEsNEJBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxRQUFiLENBQUE7QUFFQSxXQUFBLG1EQUFBO2tDQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLE9BQVgsRUFBb0IsVUFBcEIsRUFBZ0MsTUFBTSxDQUFDLEtBQVAsR0FBYSxDQUE3QyxFQUFnRCxVQUFBLEdBQVcsUUFBM0QsQ0FBQSxDQUFBO0FBQUEsUUFDQSxVQUFBLEdBQWEsTUFBTSxDQUFDLEdBRHBCLENBREY7QUFBQSxPQUZBO0FBS0EsTUFBQSxJQUFHLFVBQUEsSUFBYyxPQUFqQjtlQUNFLElBQUMsQ0FBQSxTQUFELENBQVcsT0FBWCxFQUFvQixVQUFwQixFQUFnQyxPQUFoQyxFQUF5QyxVQUFBLEdBQVcsUUFBcEQsRUFERjtPQU4yQjtJQUFBLENBaFo3QixDQUFBOztBQUFBLDJCQStaQSxtQkFBQSxHQUFxQixTQUFDLFFBQUQsRUFBVyxPQUFYLEdBQUE7QUFDbkIsVUFBQSxvRkFBQTtBQUFBLE1BQUEsSUFBYyxnQ0FBRCxJQUEwQiwrQkFBdkM7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQUFBO0FBQUEsTUFFQSxZQUFBLEdBQWU7UUFBQztBQUFBLFVBQUMsS0FBQSxFQUFPLElBQUMsQ0FBQSxpQkFBVDtBQUFBLFVBQTRCLEdBQUEsRUFBSyxJQUFDLENBQUEsZ0JBQWxDO0FBQUEsVUFBb0QsUUFBQSxFQUFVLENBQTlEO1NBQUQ7T0FGZixDQUFBO0FBSUE7QUFBQSxXQUFBLDJDQUFBOzBCQUFBO0FBQ0UsUUFBQSxlQUFBLEdBQWtCLEVBQWxCLENBQUE7QUFDQSxhQUFBLHFEQUFBO21DQUFBO0FBQ0UsVUFBQSxJQUFHLE1BQU0sQ0FBQyxHQUFQLEdBQWEsS0FBSyxDQUFDLEtBQW5CLElBQTZCLE1BQU0sQ0FBQyxXQUFQLEtBQXNCLENBQXREO0FBQ0UsWUFBQSxlQUFlLENBQUMsSUFBaEIsQ0FDRTtBQUFBLGNBQUEsS0FBQSxFQUFPLEtBQUssQ0FBQyxLQUFOLEdBQWMsTUFBTSxDQUFDLFdBQTVCO0FBQUEsY0FDQSxHQUFBLEVBQUssS0FBSyxDQUFDLEdBQU4sR0FBWSxNQUFNLENBQUMsV0FEeEI7QUFBQSxjQUVBLFFBQUEsRUFBVSxLQUFLLENBQUMsUUFGaEI7YUFERixDQUFBLENBREY7V0FBQSxNQU1LLElBQUcsTUFBTSxDQUFDLEdBQVAsR0FBYSxLQUFLLENBQUMsS0FBbkIsSUFBNEIsTUFBTSxDQUFDLEtBQVAsR0FBZSxLQUFLLENBQUMsR0FBcEQ7QUFDSCxZQUFBLGVBQWUsQ0FBQyxJQUFoQixDQUFxQixLQUFyQixDQUFBLENBREc7V0FBQSxNQUFBO0FBR0gsWUFBQSxJQUFHLE1BQU0sQ0FBQyxLQUFQLEdBQWUsS0FBSyxDQUFDLEtBQXhCO0FBQ0UsY0FBQSxlQUFlLENBQUMsSUFBaEIsQ0FDRTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxLQUFLLENBQUMsS0FBYjtBQUFBLGdCQUNBLEdBQUEsRUFBSyxNQUFNLENBQUMsS0FBUCxHQUFlLENBRHBCO0FBQUEsZ0JBRUEsUUFBQSxFQUFVLEtBQUssQ0FBQyxRQUZoQjtlQURGLENBQUEsQ0FERjthQUFBO0FBS0EsWUFBQSxJQUFHLE1BQU0sQ0FBQyxHQUFQLEdBQWEsS0FBSyxDQUFDLEdBQXRCO0FBR0UsY0FBQSxJQUFPLE1BQU0sQ0FBQyxXQUFQLEtBQXNCLENBQTdCO0FBQ0UsZ0JBQUEsZUFBZSxDQUFDLElBQWhCLENBQ0U7QUFBQSxrQkFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEdBQVAsR0FBYSxNQUFNLENBQUMsV0FBcEIsR0FBa0MsQ0FBekM7QUFBQSxrQkFDQSxHQUFBLEVBQUssS0FBSyxDQUFDLEdBQU4sR0FBWSxNQUFNLENBQUMsV0FEeEI7QUFBQSxrQkFFQSxRQUFBLEVBQVUsS0FBSyxDQUFDLFFBQU4sR0FBaUIsTUFBTSxDQUFDLEdBQXhCLEdBQThCLENBQTlCLEdBQWtDLEtBQUssQ0FBQyxLQUZsRDtpQkFERixDQUFBLENBREY7ZUFIRjthQVJHO1dBTkw7QUFBQSxVQXdCQSxXQUFBLEdBQWMsZUFBZ0IsQ0FBQSxlQUFlLENBQUMsTUFBaEIsR0FBeUIsQ0FBekIsQ0F4QjlCLENBREY7QUFBQSxTQURBO0FBQUEsUUE0QkEsWUFBQSxHQUFlLGVBNUJmLENBREY7QUFBQSxPQUpBO0FBQUEsTUFtQ0EsSUFBQyxDQUFBLG9CQUFELENBQXNCLFlBQXRCLEVBQW9DLFFBQXBDLEVBQThDLE9BQTlDLENBbkNBLENBQUE7QUFBQSxNQXFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixFQXJDbEIsQ0FBQTthQXVDQSxhQXhDbUI7SUFBQSxDQS9ackIsQ0FBQTs7QUFBQSwyQkFpZEEsb0JBQUEsR0FBc0IsU0FBQyxZQUFELEVBQWUsUUFBZixFQUF5QixPQUF6QixHQUFBO0FBQ3BCLFVBQUEsUUFBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLENBQUosQ0FBQTtBQUNBLGFBQU0sQ0FBQSxHQUFJLFlBQVksQ0FBQyxNQUF2QixHQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsWUFBYSxDQUFBLENBQUEsQ0FBckIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxLQUFLLENBQUMsS0FBTixHQUFjLFFBQWpCO0FBQ0UsVUFBQSxLQUFLLENBQUMsUUFBTixJQUFrQixRQUFBLEdBQVcsS0FBSyxDQUFDLEtBQW5DLENBQUE7QUFBQSxVQUNBLEtBQUssQ0FBQyxLQUFOLEdBQWMsUUFEZCxDQURGO1NBREE7QUFJQSxRQUFBLElBQUcsS0FBSyxDQUFDLEdBQU4sR0FBWSxPQUFmO0FBQ0UsVUFBQSxLQUFLLENBQUMsR0FBTixHQUFZLE9BQVosQ0FERjtTQUpBO0FBTUEsUUFBQSxJQUFHLEtBQUssQ0FBQyxLQUFOLElBQWUsS0FBSyxDQUFDLEdBQXhCO0FBQ0UsVUFBQSxZQUFZLENBQUMsTUFBYixDQUFvQixDQUFBLEVBQXBCLEVBQXlCLENBQXpCLENBQUEsQ0FERjtTQU5BO0FBQUEsUUFRQSxDQUFBLEVBUkEsQ0FERjtNQUFBLENBREE7YUFXQSxZQUFZLENBQUMsSUFBYixDQUFrQixTQUFDLENBQUQsRUFBSSxDQUFKLEdBQUE7ZUFBVSxDQUFDLENBQUMsUUFBRixHQUFhLENBQUMsQ0FBQyxTQUF6QjtNQUFBLENBQWxCLEVBWm9CO0lBQUEsQ0FqZHRCLENBQUE7O3dCQUFBOztLQUR5QixNQVQzQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/mixins/canvas-drawer.coffee

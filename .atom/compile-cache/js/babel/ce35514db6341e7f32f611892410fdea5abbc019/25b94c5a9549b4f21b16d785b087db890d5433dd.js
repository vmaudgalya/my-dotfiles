Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _mixto = require('mixto');

var _mixto2 = _interopRequireDefault(_mixto);

var _main = require('../main');

var _main2 = _interopRequireDefault(_main);

var _canvasLayer = require('../canvas-layer');

var _canvasLayer2 = _interopRequireDefault(_canvasLayer);

/**
 * The `CanvasDrawer` mixin is responsible for the rendering of a `Minimap`
 * in a `canvas` element.
 *
 * This mixin is injected in the `MinimapElement` prototype, so all these
 * methods  are available on any `MinimapElement` instance.
 */
'use babel';

var CanvasDrawer = (function (_Mixin) {
  _inherits(CanvasDrawer, _Mixin);

  function CanvasDrawer() {
    _classCallCheck(this, CanvasDrawer);

    _get(Object.getPrototypeOf(CanvasDrawer.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CanvasDrawer, [{
    key: 'initializeCanvas',

    /**
     * Initializes the canvas elements needed to perform the `Minimap` rendering.
     */
    value: function initializeCanvas() {
      /**
      * The main canvas layer where lines are rendered.
      * @type {CanvasLayer}
      */
      this.tokensLayer = new _canvasLayer2['default']();
      /**
      * The canvas layer for decorations below the text.
      * @type {CanvasLayer}
      */
      this.backLayer = new _canvasLayer2['default']();
      /**
      * The canvas layer for decorations above the text.
      * @type {CanvasLayer}
      */
      this.frontLayer = new _canvasLayer2['default']();

      if (!this.pendingChanges) {
        /**
         * Stores the changes from the text editor.
         * @type {Array<Object>}
         * @access private
         */
        this.pendingChanges = [];
      }

      if (!this.pendingBackDecorationChanges) {
        /**
         * Stores the changes from the minimap back decorations.
         * @type {Array<Object>}
         * @access private
         */
        this.pendingBackDecorationChanges = [];
      }

      if (!this.pendingFrontDecorationChanges) {
        /**
         * Stores the changes from the minimap front decorations.
         * @type {Array<Object>}
         * @access private
         */
        this.pendingFrontDecorationChanges = [];
      }
    }

    /**
     * Returns the uppermost canvas in the MinimapElement.
     *
     * @return {HTMLCanvasElement} the html canvas element
     */
  }, {
    key: 'getFrontCanvas',
    value: function getFrontCanvas() {
      return this.frontLayer.canvas;
    }

    /**
     * Attaches the canvases into the specified container.
     *
     * @param  {HTMLElement} parent the canvases' container
     * @access private
     */
  }, {
    key: 'attachCanvases',
    value: function attachCanvases(parent) {
      this.backLayer.attach(parent);
      this.tokensLayer.attach(parent);
      this.frontLayer.attach(parent);
    }

    /**
     * Changes the size of all the canvas layers at once.
     *
     * @param {number} width the new width for the three canvases
     * @param {number} height the new height for the three canvases
     * @access private
     */
  }, {
    key: 'setCanvasesSize',
    value: function setCanvasesSize(width, height) {
      this.backLayer.setSize(width, height);
      this.tokensLayer.setSize(width, height);
      this.frontLayer.setSize(width, height);
    }

    /**
     * Performs an update of the rendered `Minimap` based on the changes
     * registered in the instance.
     */
  }, {
    key: 'updateCanvas',
    value: function updateCanvas() {
      var firstRow = this.minimap.getFirstVisibleScreenRow();
      var lastRow = this.minimap.getLastVisibleScreenRow();

      this.updateTokensLayer(firstRow, lastRow);
      this.updateBackDecorationsLayer(firstRow, lastRow);
      this.updateFrontDecorationsLayer(firstRow, lastRow);

      this.pendingChanges = [];
      this.pendingBackDecorationChanges = [];
      this.pendingFrontDecorationChanges = [];

      /**
       * The first row in the last render of the offscreen canvas.
       * @type {number}
       * @access private
       */
      this.offscreenFirstRow = firstRow;
      /**
       * The last row in the last render of the offscreen canvas.
       * @type {number}
       * @access private
       */
      this.offscreenLastRow = lastRow;
    }

    /**
     * Performs an update of the tokens layer using the pending changes array.
     *
     * @param  {number} firstRow firstRow the first row of the range to update
     * @param  {number} lastRow lastRow the last row of the range to update
     * @access private
     */
  }, {
    key: 'updateTokensLayer',
    value: function updateTokensLayer(firstRow, lastRow) {
      var intactRanges = this.computeIntactRanges(firstRow, lastRow, this.pendingChanges);

      this.redrawRangesOnLayer(this.tokensLayer, intactRanges, firstRow, lastRow, this.drawLines);
    }

    /**
     * Performs an update of the back decorations layer using the pending back
     * decorations changes arrays.
     *
     * @param  {number} firstRow firstRow the first row of the range to update
     * @param  {number} lastRow lastRow the last row of the range to update
     * @access private
     */
  }, {
    key: 'updateBackDecorationsLayer',
    value: function updateBackDecorationsLayer(firstRow, lastRow) {
      var intactRanges = this.computeIntactRanges(firstRow, lastRow, this.pendingBackDecorationChanges);

      this.redrawRangesOnLayer(this.backLayer, intactRanges, firstRow, lastRow, this.drawBackDecorationsForLines);
    }

    /**
     * Performs an update of the front decorations layer using the pending front
     * decorations changes arrays.
     *
     * @param  {number} firstRow firstRow the first row of the range to update
     * @param  {number} lastRow lastRow the last row of the range to update
     * @access private
     */
  }, {
    key: 'updateFrontDecorationsLayer',
    value: function updateFrontDecorationsLayer(firstRow, lastRow) {
      var intactRanges = this.computeIntactRanges(firstRow, lastRow, this.pendingFrontDecorationChanges);

      this.redrawRangesOnLayer(this.frontLayer, intactRanges, firstRow, lastRow, this.drawFrontDecorationsForLines);
    }

    //     ######   #######  ##        #######  ########   ######
    //    ##    ## ##     ## ##       ##     ## ##     ## ##    ##
    //    ##       ##     ## ##       ##     ## ##     ## ##
    //    ##       ##     ## ##       ##     ## ########   ######
    //    ##       ##     ## ##       ##     ## ##   ##         ##
    //    ##    ## ##     ## ##       ##     ## ##    ##  ##    ##
    //     ######   #######  ########  #######  ##     ##  ######

    /**
     * Returns the opacity value to use when rendering the `Minimap` text.
     *
     * @return {Number} the text opacity value
     */
  }, {
    key: 'getTextOpacity',
    value: function getTextOpacity() {
      return this.textOpacity;
    }

    /**
     * Returns the default text color for an editor content.
     *
     * The color value is directly read from the `TextEditorView` computed styles.
     *
     * @return {string} a CSS color
     */
  }, {
    key: 'getDefaultColor',
    value: function getDefaultColor() {
      var color = this.retrieveStyleFromDom(['.editor'], 'color', false, true);
      return this.transparentize(color, this.getTextOpacity());
    }

    /**
     * Returns the text color for the passed-in `token` object.
     *
     * The color value is read from the DOM by creating a node structure that
     * match the token `scope` property.
     *
     * @param  {Object} token a `TextEditor` token
     * @return {string} the CSS color for the provided token
     */
  }, {
    key: 'getTokenColor',
    value: function getTokenColor(token) {
      var scopes = token.scopeDescriptor || token.scopes;
      var color = this.retrieveStyleFromDom(scopes, 'color');

      return this.transparentize(color, this.getTextOpacity());
    }

    /**
     * Returns the background color for the passed-in `decoration` object.
     *
     * The color value is read from the DOM by creating a node structure that
     * match the decoration `scope` property unless the decoration provides
     * its own `color` property.
     *
     * @param  {Decoration} decoration the decoration to get the color for
     * @return {string} the CSS color for the provided decoration
     */
  }, {
    key: 'getDecorationColor',
    value: function getDecorationColor(decoration) {
      var properties = decoration.getProperties();
      if (properties.color) {
        return properties.color;
      }

      if (properties.scope) {
        var scopeString = properties.scope.split(/\s+/);
        return this.retrieveStyleFromDom(scopeString, 'background-color', false);
      } else {
        return this.getDefaultColor();
      }
    }

    /**
     * Converts a `rgb(...)` color into a `rgba(...)` color with the specified
     * opacity.
     *
     * @param  {string} color the CSS RGB color to transparentize
     * @param  {number} [opacity=1] the opacity amount
     * @return {string} the transparentized CSS color
     * @access private
     */
  }, {
    key: 'transparentize',
    value: function transparentize(color) {
      var opacity = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      return color.replace('rgb(', 'rgba(').replace(')', ', ' + opacity + ')');
    }

    //    ########  ########     ###    ##      ##
    //    ##     ## ##     ##   ## ##   ##  ##  ##
    //    ##     ## ##     ##  ##   ##  ##  ##  ##
    //    ##     ## ########  ##     ## ##  ##  ##
    //    ##     ## ##   ##   ######### ##  ##  ##
    //    ##     ## ##    ##  ##     ## ##  ##  ##
    //    ########  ##     ## ##     ##  ###  ###

    /**
     * Routine used to render changes in specific ranges for one layer.
     *
     * @param  {CanvasLayer} layer the layer to redraw
     * @param  {Array<Object>} intactRanges an array of the ranges to leave intact
     * @param  {number} firstRow firstRow the first row of the range to update
     * @param  {number} lastRow lastRow the last row of the range to update
     * @param  {Function} method the render method to use for the lines drawing
     * @access private
     */
  }, {
    key: 'redrawRangesOnLayer',
    value: function redrawRangesOnLayer(layer, intactRanges, firstRow, lastRow, method) {
      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var lineHeight = this.minimap.getLineHeight() * devicePixelRatio;

      layer.clearCanvas();

      if (intactRanges.length === 0) {
        method.call(this, firstRow, lastRow, 0);
      } else {
        for (var j = 0, len = intactRanges.length; j < len; j++) {
          var intact = intactRanges[j];

          layer.copyPartFromOffscreen(intact.offscreenRow * lineHeight, (intact.start - firstRow) * lineHeight, (intact.end - intact.start) * lineHeight);
        }
        this.drawLinesForRanges(method, intactRanges, firstRow, lastRow);
      }

      layer.resetOffscreenSize();
      layer.copyToOffscreen();
    }

    /**
     * Renders the lines between the intact ranges when an update has pending
     * changes.
     *
     * @param  {Function} method the render method to use for the lines drawing
     * @param  {Array<Object>} intactRanges the intact ranges in the minimap
     * @param  {number} firstRow the first row of the rendered region
     * @param  {number} lastRow the last row of the rendered region
     * @access private
     */
  }, {
    key: 'drawLinesForRanges',
    value: function drawLinesForRanges(method, ranges, firstRow, lastRow) {
      var currentRow = firstRow;
      for (var i = 0, len = ranges.length; i < len; i++) {
        var range = ranges[i];

        method.call(this, currentRow, range.start, currentRow - firstRow);

        currentRow = range.end;
      }
      if (currentRow <= lastRow) {
        method.call(this, currentRow, lastRow, currentRow - firstRow);
      }
    }

    /**
     * Draws back decorations on the corresponding layer.
     *
     * The lines range to draw is specified by the `firstRow` and `lastRow`
     * parameters.
     *
     * @param  {number} firstRow the first row to render
     * @param  {number} lastRow the last row to render
     * @param  {number} offsetRow the relative offset to apply to rows when
     *                            rendering them
     * @access private
     */
  }, {
    key: 'drawBackDecorationsForLines',
    value: function drawBackDecorationsForLines(firstRow, lastRow, offsetRow) {
      if (firstRow > lastRow) {
        return;
      }

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      var charHeight = this.minimap.getCharHeight() * devicePixelRatio;
      var charWidth = this.minimap.getCharWidth() * devicePixelRatio;
      var decorations = this.minimap.decorationsByTypeThenRows(firstRow, lastRow);

      var _tokensLayer$getSize = this.tokensLayer.getSize();

      var canvasWidth = _tokensLayer$getSize.width;
      var canvasHeight = _tokensLayer$getSize.height;

      var renderData = {
        context: this.backLayer.context,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        lineHeight: lineHeight,
        charWidth: charWidth,
        charHeight: charHeight,
        orders: _main2['default'].getPluginsOrder()
      };

      for (var screenRow = firstRow; screenRow <= lastRow; screenRow++) {
        renderData.row = offsetRow + (screenRow - firstRow);
        renderData.yRow = renderData.row * lineHeight;
        renderData.screenRow = screenRow;

        this.drawDecorations(screenRow, decorations, renderData, {
          'line': this.drawLineDecoration,
          'highlight-under': this.drawHighlightDecoration,
          'background-custom': this.drawCustomDecoration
        });
      }

      this.backLayer.context.fill();
    }

    /**
     * Draws front decorations on the corresponding layer.
     *
     * The lines range to draw is specified by the `firstRow` and `lastRow`
     * parameters.
     *
     * @param  {number} firstRow the first row to render
     * @param  {number} lastRow the last row to render
     * @param  {number} offsetRow the relative offset to apply to rows when
     *                            rendering them
     * @access private
     */
  }, {
    key: 'drawFrontDecorationsForLines',
    value: function drawFrontDecorationsForLines(firstRow, lastRow, offsetRow) {
      if (firstRow > lastRow) {
        return;
      }

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      var charHeight = this.minimap.getCharHeight() * devicePixelRatio;
      var charWidth = this.minimap.getCharWidth() * devicePixelRatio;
      var decorations = this.minimap.decorationsByTypeThenRows(firstRow, lastRow);

      var _tokensLayer$getSize2 = this.tokensLayer.getSize();

      var canvasWidth = _tokensLayer$getSize2.width;
      var canvasHeight = _tokensLayer$getSize2.height;

      var renderData = {
        context: this.frontLayer.context,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        lineHeight: lineHeight,
        charWidth: charWidth,
        charHeight: charHeight,
        orders: _main2['default'].getPluginsOrder()
      };

      for (var screenRow = firstRow; screenRow <= lastRow; screenRow++) {
        renderData.row = offsetRow + (screenRow - firstRow);
        renderData.yRow = renderData.row * lineHeight;
        renderData.screenRow = screenRow;

        this.drawDecorations(screenRow, decorations, renderData, {
          'gutter': this.drawGutterDecoration,
          'highlight-over': this.drawHighlightDecoration,
          'highlight-outline': this.drawHighlightOutlineDecoration,
          'foreground-custom': this.drawCustomDecoration
        });
      }

      renderData.context.fill();
    }

    /**
     * Returns an array of tokens by line.
     *
     * @param  {number} startRow The start row
     * @param  {number} endRow The end row
     * @return {Array<Array>} An array of tokens by line
     * @access private
     */
  }, {
    key: 'tokenLinesForScreenRows',
    value: function tokenLinesForScreenRows(startRow, endRow) {
      var _this = this;

      var editor = this.getTextEditor();
      var tokenLines = [];
      if (typeof editor.tokenizedLinesForScreenRows === 'function') {
        for (var tokenizedLine of editor.tokenizedLinesForScreenRows(startRow, endRow)) {
          if (tokenizedLine) {
            (function () {
              var invisibleRegExp = _this.getInvisibleRegExpForLine(tokenizedLine);
              tokenLines.push(tokenizedLine.tokens.map(function (token) {
                return {
                  value: token.value.replace(invisibleRegExp, ' '),
                  scopes: token.scopes.slice()
                };
              }));
            })();
          } else {
            return {
              value: '',
              scopes: []
            };
          }
        }
      } else {
        var displayLayer = editor.displayLayer;
        var invisibleRegExp = this.getInvisibleRegExp();
        var screenLines = displayLayer.getScreenLines(startRow, endRow);
        for (var _ref2 of screenLines) {
          var lineText = _ref2.lineText;
          var tagCodes = _ref2.tagCodes;

          var tokens = [];
          var scopes = [];
          var textIndex = 0;
          // console.log(lineText, invisibleRegExp, lineText.replace(invisibleRegExp, ' '))
          for (var tagCode of tagCodes) {
            if (displayLayer.isOpenTagCode(tagCode)) {
              scopes.push(displayLayer.tagForCode(tagCode));
            } else if (displayLayer.isCloseTagCode(tagCode)) {
              scopes.pop();
            } else {
              tokens.push({
                value: lineText.substr(textIndex, tagCode).replace(invisibleRegExp, ' '),
                scopes: scopes.slice()
              });
              textIndex += tagCode;
            }
          }

          tokenLines.push(tokens);
        }
      }
      return tokenLines;
    }

    /**
     * Draws lines on the corresponding layer.
     *
     * The lines range to draw is specified by the `firstRow` and `lastRow`
     * parameters.
     *
     * @param  {number} firstRow the first row to render
     * @param  {number} lastRow the last row to render
     * @param  {number} offsetRow the relative offset to apply to rows when
     *                            rendering them
     * @access private
     */
  }, {
    key: 'drawLines',
    value: function drawLines(firstRow, lastRow, offsetRow) {
      if (firstRow > lastRow) {
        return;
      }

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      var charHeight = this.minimap.getCharHeight() * devicePixelRatio;
      var charWidth = this.minimap.getCharWidth() * devicePixelRatio;
      var displayCodeHighlights = this.displayCodeHighlights;
      var context = this.tokensLayer.context;

      var _tokensLayer$getSize3 = this.tokensLayer.getSize();

      var canvasWidth = _tokensLayer$getSize3.width;

      if (typeof this.tokenLinesForScreenRows !== 'function') {
        console.error('tokenLinesForScreenRows should be a function but it was ' + typeof this.tokenLinesForScreenRows, this.tokenLinesForScreenRows);

        return;
      }

      var screenRowsTokens = this.tokenLinesForScreenRows(firstRow, lastRow);

      var y = offsetRow * lineHeight;
      for (var i = 0; i < screenRowsTokens.length; i++) {
        var tokens = screenRowsTokens[i];
        var x = 0;
        context.clearRect(x, y, canvasWidth, lineHeight);
        for (var j = 0; j < tokens.length; j++) {
          var token = tokens[j];
          if (/^\s+$/.test(token.value)) {
            x += token.value.length * charWidth;
          } else {
            var color = displayCodeHighlights ? this.getTokenColor(token) : this.getDefaultColor();
            x = this.drawToken(context, token.value, color, x, y, charWidth, charHeight);
          }
          if (x > canvasWidth) {
            break;
          }
        }

        y += lineHeight;
      }

      context.fill();
    }

    /**
     * Returns the regexp to replace invisibles substitution characters
     * in editor lines.
     *
     * @return {RegExp} the regular expression to match invisible characters
     * @access private
     */
  }, {
    key: 'getInvisibleRegExp',
    value: function getInvisibleRegExp() {
      var invisibles = this.getTextEditor().getInvisibles();
      var regexp = [];
      if (invisibles.cr != null) {
        regexp.push(invisibles.cr);
      }
      if (invisibles.eol != null) {
        regexp.push(invisibles.eol);
      }
      if (invisibles.space != null) {
        regexp.push(invisibles.space);
      }
      if (invisibles.tab != null) {
        regexp.push(invisibles.tab);
      }

      return RegExp(regexp.filter(function (s) {
        return typeof s === 'string';
      }).map(_underscorePlus2['default'].escapeRegExp).join('|'), 'g');
    }

    /**
     * Returns the regexp to replace invisibles substitution characters
     * in editor lines.
     *
     * @param  {Object} line the tokenized line
     * @return {RegExp} the regular expression to match invisible characters
     * @deprecated Is used only to support Atom version before display layer API
     * @access private
     */
  }, {
    key: 'getInvisibleRegExpForLine',
    value: function getInvisibleRegExpForLine(line) {
      if (line != null && line.invisibles != null) {
        var invisibles = [];
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

        return RegExp(invisibles.filter(function (s) {
          return typeof s === 'string';
        }).map(_underscorePlus2['default'].escapeRegExp).join('|'), 'g');
      }
    }

    /**
     * Draws a single token on the given context.
     *
     * @param  {CanvasRenderingContext2D} context the target canvas context
     * @param  {string} text the token's text content
     * @param  {string} color the token's CSS color
     * @param  {number} x the x position of the token in the line
     * @param  {number} y the y position of the line in the minimap
     * @param  {number} charWidth the width of a character in the minimap
     * @param  {number} charHeight the height of a character in the minimap
     * @return {number} the x position at the end of the token
     * @access private
     */
  }, {
    key: 'drawToken',
    value: function drawToken(context, text, color, x, y, charWidth, charHeight) {
      context.fillStyle = color;

      if (this.ignoreWhitespacesInTokens) {
        var _length = text.length * charWidth;
        context.fillRect(x, y, _length, charHeight);

        return x + _length;
      } else {
        var chars = 0;
        for (var j = 0, len = text.length; j < len; j++) {
          var char = text[j];
          if (/\s/.test(char)) {
            if (chars > 0) {
              context.fillRect(x - chars * charWidth, y, chars * charWidth, charHeight);
            }
            chars = 0;
          } else {
            chars++;
          }
          x += charWidth;
        }
        if (chars > 0) {
          context.fillRect(x - chars * charWidth, y, chars * charWidth, charHeight);
        }
        return x;
      }
    }

    /**
     * Draws the specified decorations for the current `screenRow`.
     *
     * The `decorations` object contains all the decorations grouped by type and
     * then rows.
     *
     * @param  {number} screenRow the screen row index for which
     *                            render decorations
     * @param  {Object} decorations the object containing all the decorations
     * @param  {Object} renderData the object containing the render data
     * @param  {Object} types an object with the type to render as key and the
     *                        render method as value
     * @access private
     */
  }, {
    key: 'drawDecorations',
    value: function drawDecorations(screenRow, decorations, renderData, types) {
      var decorationsToRender = [];

      renderData.context.clearRect(0, renderData.yRow, renderData.canvasWidth, renderData.lineHeight);

      for (var i in types) {
        decorationsToRender = decorationsToRender.concat(decorations[i] != null ? decorations[i][screenRow] || [] : []);
      }

      decorationsToRender.sort(function (a, b) {
        return (renderData.orders[a.properties.plugin] || 0) - (renderData.orders[b.properties.plugin] || 0);
      });

      if (decorationsToRender != null ? decorationsToRender.length : void 0) {
        for (var i = 0, len = decorationsToRender.length; i < len; i++) {
          types[decorationsToRender[i].properties.type].call(this, decorationsToRender[i], renderData);
        }
      }
    }

    /**
     * Draws a line decoration.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawLineDecoration',
    value: function drawLineDecoration(decoration, data) {
      data.context.fillStyle = this.getDecorationColor(decoration);
      data.context.fillRect(0, data.yRow, data.canvasWidth, data.lineHeight);
    }

    /**
     * Draws a gutter decoration.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawGutterDecoration',
    value: function drawGutterDecoration(decoration, data) {
      data.context.fillStyle = this.getDecorationColor(decoration);
      data.context.fillRect(0, data.yRow, 1, data.lineHeight);
    }

    /**
     * Draws a highlight decoration.
     *
     * It renders only the part of the highlight corresponding to the specified
     * row.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawHighlightDecoration',
    value: function drawHighlightDecoration(decoration, data) {
      var range = decoration.getMarker().getScreenRange();
      var rowSpan = range.end.row - range.start.row;

      data.context.fillStyle = this.getDecorationColor(decoration);

      if (rowSpan === 0) {
        var colSpan = range.end.column - range.start.column;
        data.context.fillRect(range.start.column * data.charWidth, data.yRow, colSpan * data.charWidth, data.lineHeight);
      } else if (data.screenRow === range.start.row) {
        var x = range.start.column * data.charWidth;
        data.context.fillRect(x, data.yRow, data.canvasWidth - x, data.lineHeight);
      } else if (data.screenRow === range.end.row) {
        data.context.fillRect(0, data.yRow, range.end.column * data.charWidth, data.lineHeight);
      } else {
        data.context.fillRect(0, data.yRow, data.canvasWidth, data.lineHeight);
      }
    }

    /**
     * Draws a highlight outline decoration.
     *
     * It renders only the part of the highlight corresponding to the specified
     * row.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawHighlightOutlineDecoration',
    value: function drawHighlightOutlineDecoration(decoration, data) {
      var bottomWidth = undefined,
          colSpan = undefined,
          width = undefined,
          xBottomStart = undefined,
          xEnd = undefined,
          xStart = undefined;
      var lineHeight = data.lineHeight;
      var charWidth = data.charWidth;
      var canvasWidth = data.canvasWidth;
      var screenRow = data.screenRow;

      var range = decoration.getMarker().getScreenRange();
      var rowSpan = range.end.row - range.start.row;
      var yStart = data.yRow;
      var yEnd = yStart + lineHeight;

      data.context.fillStyle = this.getDecorationColor(decoration);

      if (rowSpan === 0) {
        colSpan = range.end.column - range.start.column;
        width = colSpan * charWidth;
        xStart = range.start.column * charWidth;
        xEnd = xStart + width;

        data.context.fillRect(xStart, yStart, width, 1);
        data.context.fillRect(xStart, yEnd, width, 1);
        data.context.fillRect(xStart, yStart, 1, lineHeight);
        data.context.fillRect(xEnd, yStart, 1, lineHeight);
      } else if (rowSpan === 1) {
        xStart = range.start.column * data.charWidth;
        xEnd = range.end.column * data.charWidth;

        if (screenRow === range.start.row) {
          width = data.canvasWidth - xStart;
          xBottomStart = Math.max(xStart, xEnd);
          bottomWidth = data.canvasWidth - xBottomStart;

          data.context.fillRect(xStart, yStart, width, 1);
          data.context.fillRect(xBottomStart, yEnd, bottomWidth, 1);
          data.context.fillRect(xStart, yStart, 1, lineHeight);
          data.context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
        } else {
          width = canvasWidth - xStart;
          bottomWidth = canvasWidth - xEnd;

          data.context.fillRect(0, yStart, xStart, 1);
          data.context.fillRect(0, yEnd, xEnd, 1);
          data.context.fillRect(0, yStart, 1, lineHeight);
          data.context.fillRect(xEnd, yStart, 1, lineHeight);
        }
      } else {
        xStart = range.start.column * charWidth;
        xEnd = range.end.column * charWidth;
        if (screenRow === range.start.row) {
          width = canvasWidth - xStart;

          data.context.fillRect(xStart, yStart, width, 1);
          data.context.fillRect(xStart, yStart, 1, lineHeight);
          data.context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
        } else if (screenRow === range.end.row) {
          width = canvasWidth - xStart;

          data.context.fillRect(0, yEnd, xEnd, 1);
          data.context.fillRect(0, yStart, 1, lineHeight);
          data.context.fillRect(xEnd, yStart, 1, lineHeight);
        } else {
          data.context.fillRect(0, yStart, 1, lineHeight);
          data.context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
          if (screenRow === range.start.row + 1) {
            data.context.fillRect(0, yStart, xStart, 1);
          }
          if (screenRow === range.end.row - 1) {
            data.context.fillRect(xEnd, yEnd, canvasWidth - xEnd, 1);
          }
        }
      }
    }

    /**
     * Draws a custom decoration.
     *
     * It renders only the part of the highlight corresponding to the specified
     * row.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawCustomDecoration',
    value: function drawCustomDecoration(decoration, data) {
      var renderRoutine = decoration.getProperties().render;

      if (renderRoutine) {
        data.color = this.getDecorationColor(decoration);
        renderRoutine(decoration, data);
      }
    }

    //    ########     ###    ##    ##  ######   ########  ######
    //    ##     ##   ## ##   ###   ## ##    ##  ##       ##    ##
    //    ##     ##  ##   ##  ####  ## ##        ##       ##
    //    ########  ##     ## ## ## ## ##   #### ######    ######
    //    ##   ##   ######### ##  #### ##    ##  ##             ##
    //    ##    ##  ##     ## ##   ### ##    ##  ##       ##    ##
    //    ##     ## ##     ## ##    ##  ######   ########  ######

    /**
     * Computes the ranges that are not affected by the current pending changes.
     *
     * @param  {number} firstRow the first row of the rendered region
     * @param  {number} lastRow the last row of the rendered region
     * @return {Array<Object>} the intact ranges in the rendered region
     * @access private
     */
  }, {
    key: 'computeIntactRanges',
    value: function computeIntactRanges(firstRow, lastRow, changes) {
      if (this.offscreenFirstRow == null && this.offscreenLastRow == null) {
        return [];
      }

      // At first, the whole range is considered intact
      var intactRanges = [{
        start: this.offscreenFirstRow,
        end: this.offscreenLastRow,
        offscreenRow: 0
      }];

      for (var i = 0, len = changes.length; i < len; i++) {
        var change = changes[i];
        var newIntactRanges = [];

        for (var j = 0, intactLen = intactRanges.length; j < intactLen; j++) {
          var range = intactRanges[j];

          if (change.end < range.start && change.screenDelta !== 0) {
            // The change is above of the range and lines are either
            // added or removed
            newIntactRanges.push({
              start: range.start + change.screenDelta,
              end: range.end + change.screenDelta,
              offscreenRow: range.offscreenRow
            });
          } else if (change.end < range.start || change.start > range.end) {
            // The change is outside the range but didn't add
            // or remove lines
            newIntactRanges.push(range);
          } else {
            // The change is within the range, there's one intact range
            // from the range start to the change start
            if (change.start > range.start) {
              newIntactRanges.push({
                start: range.start,
                end: change.start - 1,
                offscreenRow: range.offscreenRow
              });
            }
            if (change.end < range.end) {
              // The change ends within the range
              if (change.bufferDelta !== 0) {
                // Lines are added or removed, the intact range starts in the
                // next line after the change end plus the screen delta
                newIntactRanges.push({
                  start: change.end + change.screenDelta + 1,
                  end: range.end + change.screenDelta,
                  offscreenRow: range.offscreenRow + change.end + 1 - range.start
                });
              } else if (change.screenDelta !== 0) {
                // Lines are added or removed in the display buffer, the intact
                // range starts in the next line after the change end plus the
                // screen delta
                newIntactRanges.push({
                  start: change.end + change.screenDelta + 1,
                  end: range.end + change.screenDelta,
                  offscreenRow: range.offscreenRow + change.end + 1 - range.start
                });
              } else {
                // No lines are added, the intact range starts on the line after
                // the change end
                newIntactRanges.push({
                  start: change.end + 1,
                  end: range.end,
                  offscreenRow: range.offscreenRow + change.end + 1 - range.start
                });
              }
            }
          }
        }
        intactRanges = newIntactRanges;
      }

      return this.truncateIntactRanges(intactRanges, firstRow, lastRow);
    }

    /**
     * Truncates the intact ranges so that they doesn't expand past the visible
     * area of the minimap.
     *
     * @param  {Array<Object>} intactRanges the initial array of ranges
     * @param  {number} firstRow the first row of the rendered region
     * @param  {number} lastRow the last row of the rendered region
     * @return {Array<Object>} the array of truncated ranges
     * @access private
     */
  }, {
    key: 'truncateIntactRanges',
    value: function truncateIntactRanges(intactRanges, firstRow, lastRow) {
      var i = 0;
      while (i < intactRanges.length) {
        var range = intactRanges[i];

        if (range.start < firstRow) {
          range.offscreenRow += firstRow - range.start;
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

      return intactRanges.sort(function (a, b) {
        return a.offscreenRow - b.offscreenRow;
      });
    }
  }]);

  return CanvasDrawer;
})(_mixto2['default']);

exports['default'] = CanvasDrawer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21peGlucy9jYW52YXMtZHJhd2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OzhCQUVjLGlCQUFpQjs7OztxQkFDYixPQUFPOzs7O29CQUNSLFNBQVM7Ozs7MkJBQ0YsaUJBQWlCOzs7Ozs7Ozs7OztBQUx6QyxXQUFXLENBQUE7O0lBY1UsWUFBWTtZQUFaLFlBQVk7O1dBQVosWUFBWTswQkFBWixZQUFZOzsrQkFBWixZQUFZOzs7ZUFBWixZQUFZOzs7Ozs7V0FJZCw0QkFBRzs7Ozs7QUFLbEIsVUFBSSxDQUFDLFdBQVcsR0FBRyw4QkFBaUIsQ0FBQTs7Ozs7QUFLcEMsVUFBSSxDQUFDLFNBQVMsR0FBRyw4QkFBaUIsQ0FBQTs7Ozs7QUFLbEMsVUFBSSxDQUFDLFVBQVUsR0FBRyw4QkFBaUIsQ0FBQTs7QUFFbkMsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7Ozs7OztBQU14QixZQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQTtPQUN6Qjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFOzs7Ozs7QUFNdEMsWUFBSSxDQUFDLDRCQUE0QixHQUFHLEVBQUUsQ0FBQTtPQUN2Qzs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLDZCQUE2QixFQUFFOzs7Ozs7QUFNdkMsWUFBSSxDQUFDLDZCQUE2QixHQUFHLEVBQUUsQ0FBQTtPQUN4QztLQUNGOzs7Ozs7Ozs7V0FPYywwQkFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUE7S0FBRTs7Ozs7Ozs7OztXQVFwQyx3QkFBQyxNQUFNLEVBQUU7QUFDdEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDN0IsVUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDL0IsVUFBSSxDQUFD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OztBQUVELFlBQUksS0FBSyxDQUFDLEdBQUcsR0FBRyxPQUFPLEVBQUU7QUFBRSxlQUFLLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQTtTQUFFOztBQUVoRCxZQUFJLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUFFLHNCQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO1NBQUU7O0FBRTdELFNBQUMsRUFBRSxDQUFBO09BQ0o7O0FBRUQsYUFBTyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUNqQyxlQUFPLENBQUMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQTtPQUN2QyxDQUFDLENBQUE7S0FDSDs7O1NBdDRCa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWl4aW5zL2NhbnZhcy1kcmF3ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnXG5pbXBvcnQgTWl4aW4gZnJvbSAnbWl4dG8nXG5pbXBvcnQgTWFpbiBmcm9tICcuLi9tYWluJ1xuaW1wb3J0IENhbnZhc0xheWVyIGZyb20gJy4uL2NhbnZhcy1sYXllcidcblxuLyoqXG4gKiBUaGUgYENhbnZhc0RyYXdlcmAgbWl4aW4gaXMgcmVzcG9uc2libGUgZm9yIHRoZSByZW5kZXJpbmcgb2YgYSBgTWluaW1hcGBcbiAqIGluIGEgYGNhbnZhc2AgZWxlbWVudC5cbiAqXG4gKiBUaGlzIG1peGluIGlzIGluamVjdGVkIGluIHRoZSBgTWluaW1hcEVsZW1lbnRgIHByb3RvdHlwZSwgc28gYWxsIHRoZXNlXG4gKiBtZXRob2RzICBhcmUgYXZhaWxhYmxlIG9uIGFueSBgTWluaW1hcEVsZW1lbnRgIGluc3RhbmNlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNEcmF3ZXIgZXh0ZW5kcyBNaXhpbiB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgY2FudmFzIGVsZW1lbnRzIG5lZWRlZCB0byBwZXJmb3JtIHRoZSBgTWluaW1hcGAgcmVuZGVyaW5nLlxuICAgKi9cbiAgaW5pdGlhbGl6ZUNhbnZhcyAoKSB7XG4gICAgLyoqXG4gICAgKiBUaGUgbWFpbiBjYW52YXMgbGF5ZXIgd2hlcmUgbGluZXMgYXJlIHJlbmRlcmVkLlxuICAgICogQHR5cGUge0NhbnZhc0xheWVyfVxuICAgICovXG4gICAgdGhpcy50b2tlbnNMYXllciA9IG5ldyBDYW52YXNMYXllcigpXG4gICAgLyoqXG4gICAgKiBUaGUgY2FudmFzIGxheWVyIGZvciBkZWNvcmF0aW9ucyBiZWxvdyB0aGUgdGV4dC5cbiAgICAqIEB0eXBlIHtDYW52YXNMYXllcn1cbiAgICAqL1xuICAgIHRoaXMuYmFja0xheWVyID0gbmV3IENhbnZhc0xheWVyKClcbiAgICAvKipcbiAgICAqIFRoZSBjYW52YXMgbGF5ZXIgZm9yIGRlY29yYXRpb25zIGFib3ZlIHRoZSB0ZXh0LlxuICAgICogQHR5cGUge0NhbnZhc0xheWVyfVxuICAgICovXG4gICAgdGhpcy5mcm9udExheWVyID0gbmV3IENhbnZhc0xheWVyKClcblxuICAgIGlmICghdGhpcy5wZW5kaW5nQ2hhbmdlcykge1xuICAgICAgLyoqXG4gICAgICAgKiBTdG9yZXMgdGhlIGNoYW5nZXMgZnJvbSB0aGUgdGV4dCBlZGl0b3IuXG4gICAgICAgKiBAdHlwZSB7QXJyYXk8T2JqZWN0Pn1cbiAgICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAgICovXG4gICAgICB0aGlzLnBlbmRpbmdDaGFuZ2VzID0gW11cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGVuZGluZ0JhY2tEZWNvcmF0aW9uQ2hhbmdlcykge1xuICAgICAgLyoqXG4gICAgICAgKiBTdG9yZXMgdGhlIGNoYW5nZXMgZnJvbSB0aGUgbWluaW1hcCBiYWNrIGRlY29yYXRpb25zLlxuICAgICAgICogQHR5cGUge0FycmF5PE9iamVjdD59XG4gICAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgdGhpcy5wZW5kaW5nQmFja0RlY29yYXRpb25DaGFuZ2VzID0gW11cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGVuZGluZ0Zyb250RGVjb3JhdGlvbkNoYW5nZXMpIHtcbiAgICAgIC8qKlxuICAgICAgICogU3RvcmVzIHRoZSBjaGFuZ2VzIGZyb20gdGhlIG1pbmltYXAgZnJvbnQgZGVjb3JhdGlvbnMuXG4gICAgICAgKiBAdHlwZSB7QXJyYXk8T2JqZWN0Pn1cbiAgICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAgICovXG4gICAgICB0aGlzLnBlbmRpbmdGcm9udERlY29yYXRpb25DaGFuZ2VzID0gW11cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdXBwZXJtb3N0IGNhbnZhcyBpbiB0aGUgTWluaW1hcEVsZW1lbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge0hUTUxDYW52YXNFbGVtZW50fSB0aGUgaHRtbCBjYW52YXMgZWxlbWVudFxuICAgKi9cbiAgZ2V0RnJvbnRDYW52YXMgKCkgeyByZXR1cm4gdGhpcy5mcm9udExheWVyLmNhbnZhcyB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoZSBjYW52YXNlcyBpbnRvIHRoZSBzcGVjaWZpZWQgY29udGFpbmVyLlxuICAgKlxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gcGFyZW50IHRoZSBjYW52YXNlcycgY29udGFpbmVyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgYXR0YWNoQ2FudmFzZXMgKHBhcmVudCkge1xuICAgIHRoaXMuYmFja0xheWVyLmF0dGFjaChwYXJlbnQpXG4gICAgdGhpcy50b2tlbnNMYXllci5hdHRhY2gocGFyZW50KVxuICAgIHRoaXMuZnJvbnRMYXllci5hdHRhY2gocGFyZW50KVxuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZXMgdGhlIHNpemUgb2YgYWxsIHRoZSBjYW52YXMgbGF5ZXJzIGF0IG9uY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB0aGUgbmV3IHdpZHRoIGZvciB0aGUgdGhyZWUgY2FudmFzZXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCB0aGUgbmV3IGhlaWdodCBmb3IgdGhlIHRocmVlIGNhbnZhc2VzXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgc2V0Q2FudmFzZXNTaXplICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5iYWNrTGF5ZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KVxuICAgIHRoaXMudG9rZW5zTGF5ZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KVxuICAgIHRoaXMuZnJvbnRMYXllci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpXG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgYW4gdXBkYXRlIG9mIHRoZSByZW5kZXJlZCBgTWluaW1hcGAgYmFzZWQgb24gdGhlIGNoYW5nZXNcbiAgICogcmVnaXN0ZXJlZCBpbiB0aGUgaW5zdGFuY2UuXG4gICAqL1xuICB1cGRhdGVDYW52YXMgKCkge1xuICAgIGNvbnN0IGZpcnN0Um93ID0gdGhpcy5taW5pbWFwLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgY29uc3QgbGFzdFJvdyA9IHRoaXMubWluaW1hcC5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpXG5cbiAgICB0aGlzLnVwZGF0ZVRva2Vuc0xheWVyKGZpcnN0Um93LCBsYXN0Um93KVxuICAgIHRoaXMudXBkYXRlQmFja0RlY29yYXRpb25zTGF5ZXIoZmlyc3RSb3csIGxhc3RSb3cpXG4gICAgdGhpcy51cGRhdGVGcm9udERlY29yYXRpb25zTGF5ZXIoZmlyc3RSb3csIGxhc3RSb3cpXG5cbiAgICB0aGlzLnBlbmRpbmdDaGFuZ2VzID0gW11cbiAgICB0aGlzLnBlbmRpbmdCYWNrRGVjb3JhdGlvbkNoYW5nZXMgPSBbXVxuICAgIHRoaXMucGVuZGluZ0Zyb250RGVjb3JhdGlvbkNoYW5nZXMgPSBbXVxuXG4gICAgLyoqXG4gICAgICogVGhlIGZpcnN0IHJvdyBpbiB0aGUgbGFzdCByZW5kZXIgb2YgdGhlIG9mZnNjcmVlbiBjYW52YXMuXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLm9mZnNjcmVlbkZpcnN0Um93ID0gZmlyc3RSb3dcbiAgICAvKipcbiAgICAgKiBUaGUgbGFzdCByb3cgaW4gdGhlIGxhc3QgcmVuZGVyIG9mIHRoZSBvZmZzY3JlZW4gY2FudmFzLlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5vZmZzY3JlZW5MYXN0Um93ID0gbGFzdFJvd1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGFuIHVwZGF0ZSBvZiB0aGUgdG9rZW5zIGxheWVyIHVzaW5nIHRoZSBwZW5kaW5nIGNoYW5nZXMgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gZmlyc3RSb3cgZmlyc3RSb3cgdGhlIGZpcnN0IHJvdyBvZiB0aGUgcmFuZ2UgdG8gdXBkYXRlXG4gICAqIEBwYXJhbSAge251bWJlcn0gbGFzdFJvdyBsYXN0Um93IHRoZSBsYXN0IHJvdyBvZiB0aGUgcmFuZ2UgdG8gdXBkYXRlXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgdXBkYXRlVG9rZW5zTGF5ZXIgKGZpcnN0Um93LCBsYXN0Um93KSB7XG4gICAgY29uc3QgaW50YWN0UmFuZ2VzID0gdGhpcy5jb21wdXRlSW50YWN0UmFuZ2VzKGZpcnN0Um93LCBsYXN0Um93LCB0aGlzLnBlbmRpbmdDaGFuZ2VzKVxuXG4gICAgdGhpcy5yZWRyYXdSYW5nZXNPbkxheWVyKHRoaXMudG9rZW5zTGF5ZXIsIGludGFjdFJhbmdlcywgZmlyc3RSb3csIGxhc3RSb3csIHRoaXMuZHJhd0xpbmVzKVxuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGFuIHVwZGF0ZSBvZiB0aGUgYmFjayBkZWNvcmF0aW9ucyBsYXllciB1c2luZyB0aGUgcGVuZGluZyBiYWNrXG4gICAqIGRlY29yYXRpb25zIGNoYW5nZXMgYXJyYXlzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpcnN0Um93IGZpcnN0Um93IHRoZSBmaXJzdCByb3cgb2YgdGhlIHJhbmdlIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxhc3RSb3cgbGFzdFJvdyB0aGUgbGFzdCByb3cgb2YgdGhlIHJhbmdlIHRvIHVwZGF0ZVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZUJhY2tEZWNvcmF0aW9uc0xheWVyIChmaXJzdFJvdywgbGFzdFJvdykge1xuICAgIGNvbnN0IGludGFjdFJhbmdlcyA9IHRoaXMuY29tcHV0ZUludGFjdFJhbmdlcyhmaXJzdFJvdywgbGFzdFJvdywgdGhpcy5wZW5kaW5nQmFja0RlY29yYXRpb25DaGFuZ2VzKVxuXG4gICAgdGhpcy5yZWRyYXdSYW5nZXNPbkxheWVyKHRoaXMuYmFja0xheWVyLCBpbnRhY3RSYW5nZXMsIGZpcnN0Um93LCBsYXN0Um93LCB0aGlzLmRyYXdCYWNrRGVjb3JhdGlvbnNGb3JMaW5lcylcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhbiB1cGRhdGUgb2YgdGhlIGZyb250IGRlY29yYXRpb25zIGxheWVyIHVzaW5nIHRoZSBwZW5kaW5nIGZyb250XG4gICAqIGRlY29yYXRpb25zIGNoYW5nZXMgYXJyYXlzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpcnN0Um93IGZpcnN0Um93IHRoZSBmaXJzdCByb3cgb2YgdGhlIHJhbmdlIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxhc3RSb3cgbGFzdFJvdyB0aGUgbGFzdCByb3cgb2YgdGhlIHJhbmdlIHRvIHVwZGF0ZVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZUZyb250RGVjb3JhdGlvbnNMYXllciAoZmlyc3RSb3csIGxhc3RSb3cpIHtcbiAgICBjb25zdCBpbnRhY3RSYW5nZXMgPSB0aGlzLmNvbXB1dGVJbnRhY3RSYW5nZXMoZmlyc3RSb3csIGxhc3RSb3csIHRoaXMucGVuZGluZ0Zyb250RGVjb3JhdGlvbkNoYW5nZXMpXG5cbiAgICB0aGlzLnJlZHJhd1Jhbmdlc09uTGF5ZXIodGhpcy5mcm9udExheWVyLCBpbnRhY3RSYW5nZXMsIGZpcnN0Um93LCBsYXN0Um93LCB0aGlzLmRyYXdGcm9udERlY29yYXRpb25zRm9yTGluZXMpXG4gIH1cblxuICAvLyAgICAgIyMjIyMjICAgIyMjIyMjIyAgIyMgICAgICAgICMjIyMjIyMgICMjIyMjIyMjICAgIyMjIyMjXG4gIC8vICAgICMjICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICMjXG4gIC8vICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICMjICMjXG4gIC8vICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMjIyMjIyMgICAjIyMjIyNcbiAgLy8gICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjIyAgICMjICAgICAgICAgIyNcbiAgLy8gICAgIyMgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjIyAgICAjIyAgIyMgICAgIyNcbiAgLy8gICAgICMjIyMjIyAgICMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMjICAjIyAgICAgIyMgICMjIyMjI1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvcGFjaXR5IHZhbHVlIHRvIHVzZSB3aGVuIHJlbmRlcmluZyB0aGUgYE1pbmltYXBgIHRleHQuXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn0gdGhlIHRleHQgb3BhY2l0eSB2YWx1ZVxuICAgKi9cbiAgZ2V0VGV4dE9wYWNpdHkgKCkgeyByZXR1cm4gdGhpcy50ZXh0T3BhY2l0eSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlZmF1bHQgdGV4dCBjb2xvciBmb3IgYW4gZWRpdG9yIGNvbnRlbnQuXG4gICAqXG4gICAqIFRoZSBjb2xvciB2YWx1ZSBpcyBkaXJlY3RseSByZWFkIGZyb20gdGhlIGBUZXh0RWRpdG9yVmlld2AgY29tcHV0ZWQgc3R5bGVzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGEgQ1NTIGNvbG9yXG4gICAqL1xuICBnZXREZWZhdWx0Q29sb3IgKCkge1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5yZXRyaWV2ZVN0eWxlRnJvbURvbShbJy5lZGl0b3InXSwgJ2NvbG9yJywgZmFsc2UsIHRydWUpXG4gICAgcmV0dXJuIHRoaXMudHJhbnNwYXJlbnRpemUoY29sb3IsIHRoaXMuZ2V0VGV4dE9wYWNpdHkoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0IGNvbG9yIGZvciB0aGUgcGFzc2VkLWluIGB0b2tlbmAgb2JqZWN0LlxuICAgKlxuICAgKiBUaGUgY29sb3IgdmFsdWUgaXMgcmVhZCBmcm9tIHRoZSBET00gYnkgY3JlYXRpbmcgYSBub2RlIHN0cnVjdHVyZSB0aGF0XG4gICAqIG1hdGNoIHRoZSB0b2tlbiBgc2NvcGVgIHByb3BlcnR5LlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHRva2VuIGEgYFRleHRFZGl0b3JgIHRva2VuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIENTUyBjb2xvciBmb3IgdGhlIHByb3ZpZGVkIHRva2VuXG4gICAqL1xuICBnZXRUb2tlbkNvbG9yICh0b2tlbikge1xuICAgIGNvbnN0IHNjb3BlcyA9IHRva2VuLnNjb3BlRGVzY3JpcHRvciB8fCB0b2tlbi5zY29wZXNcbiAgICBjb25zdCBjb2xvciA9IHRoaXMucmV0cmlldmVTdHlsZUZyb21Eb20oc2NvcGVzLCAnY29sb3InKVxuXG4gICAgcmV0dXJuIHRoaXMudHJhbnNwYXJlbnRpemUoY29sb3IsIHRoaXMuZ2V0VGV4dE9wYWNpdHkoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIGZvciB0aGUgcGFzc2VkLWluIGBkZWNvcmF0aW9uYCBvYmplY3QuXG4gICAqXG4gICAqIFRoZSBjb2xvciB2YWx1ZSBpcyByZWFkIGZyb20gdGhlIERPTSBieSBjcmVhdGluZyBhIG5vZGUgc3RydWN0dXJlIHRoYXRcbiAgICogbWF0Y2ggdGhlIGRlY29yYXRpb24gYHNjb3BlYCBwcm9wZXJ0eSB1bmxlc3MgdGhlIGRlY29yYXRpb24gcHJvdmlkZXNcbiAgICogaXRzIG93biBgY29sb3JgIHByb3BlcnR5LlxuICAgKlxuICAgKiBAcGFyYW0gIHtEZWNvcmF0aW9ufSBkZWNvcmF0aW9uIHRoZSBkZWNvcmF0aW9uIHRvIGdldCB0aGUgY29sb3IgZm9yXG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIENTUyBjb2xvciBmb3IgdGhlIHByb3ZpZGVkIGRlY29yYXRpb25cbiAgICovXG4gIGdldERlY29yYXRpb25Db2xvciAoZGVjb3JhdGlvbikge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBkZWNvcmF0aW9uLmdldFByb3BlcnRpZXMoKVxuICAgIGlmIChwcm9wZXJ0aWVzLmNvbG9yKSB7IHJldHVybiBwcm9wZXJ0aWVzLmNvbG9yIH1cblxuICAgIGlmIChwcm9wZXJ0aWVzLnNjb3BlKSB7XG4gICAgICBjb25zdCBzY29wZVN0cmluZyA9IHByb3BlcnRpZXMuc2NvcGUuc3BsaXQoL1xccysvKVxuICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmVTdHlsZUZyb21Eb20oc2NvcGVTdHJpbmcsICdiYWNrZ3JvdW5kLWNvbG9yJywgZmFsc2UpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRDb2xvcigpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgYHJnYiguLi4pYCBjb2xvciBpbnRvIGEgYHJnYmEoLi4uKWAgY29sb3Igd2l0aCB0aGUgc3BlY2lmaWVkXG4gICAqIG9wYWNpdHkuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gY29sb3IgdGhlIENTUyBSR0IgY29sb3IgdG8gdHJhbnNwYXJlbnRpemVcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbb3BhY2l0eT0xXSB0aGUgb3BhY2l0eSBhbW91bnRcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgdHJhbnNwYXJlbnRpemVkIENTUyBjb2xvclxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHRyYW5zcGFyZW50aXplIChjb2xvciwgb3BhY2l0eSA9IDEpIHtcbiAgICByZXR1cm4gY29sb3IucmVwbGFjZSgncmdiKCcsICdyZ2JhKCcpLnJlcGxhY2UoJyknLCBgLCAke29wYWNpdHl9KWApXG4gIH1cblxuICAvLyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgICAgICMjIyAgICAjIyAgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgIyMgICAjIyAjIyAgICMjICAjIyAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAgIyMgICAjIyAgIyMgICMjICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjICAgICAjIyAjIyAgIyMgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICMjICAgIyMjIyMjIyMjICMjICAjIyAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICMjICAjIyAgICAgIyMgIyMgICMjICAjI1xuICAvLyAgICAjIyMjIyMjIyAgIyMgICAgICMjICMjICAgICAjIyAgIyMjICAjIyNcblxuICAvKipcbiAgICogUm91dGluZSB1c2VkIHRvIHJlbmRlciBjaGFuZ2VzIGluIHNwZWNpZmljIHJhbmdlcyBmb3Igb25lIGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0gIHtDYW52YXNMYXllcn0gbGF5ZXIgdGhlIGxheWVyIHRvIHJlZHJhd1xuICAgKiBAcGFyYW0gIHtBcnJheTxPYmplY3Q+fSBpbnRhY3RSYW5nZXMgYW4gYXJyYXkgb2YgdGhlIHJhbmdlcyB0byBsZWF2ZSBpbnRhY3RcbiAgICogQHBhcmFtICB7bnVtYmVyfSBmaXJzdFJvdyBmaXJzdFJvdyB0aGUgZmlyc3Qgcm93IG9mIHRoZSByYW5nZSB0byB1cGRhdGVcbiAgICogQHBhcmFtICB7bnVtYmVyfSBsYXN0Um93IGxhc3RSb3cgdGhlIGxhc3Qgcm93IG9mIHRoZSByYW5nZSB0byB1cGRhdGVcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IG1ldGhvZCB0aGUgcmVuZGVyIG1ldGhvZCB0byB1c2UgZm9yIHRoZSBsaW5lcyBkcmF3aW5nXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcmVkcmF3UmFuZ2VzT25MYXllciAobGF5ZXIsIGludGFjdFJhbmdlcywgZmlyc3RSb3csIGxhc3RSb3csIG1ldGhvZCkge1xuICAgIGNvbnN0IGRldmljZVBpeGVsUmF0aW8gPSB0aGlzLm1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpXG4gICAgY29uc3QgbGluZUhlaWdodCA9IHRoaXMubWluaW1hcC5nZXRMaW5lSGVpZ2h0KCkgKiBkZXZpY2VQaXhlbFJhdGlvXG5cbiAgICBsYXllci5jbGVhckNhbnZhcygpXG5cbiAgICBpZiAoaW50YWN0UmFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgbWV0aG9kLmNhbGwodGhpcywgZmlyc3RSb3csIGxhc3RSb3csIDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBpbnRhY3RSYW5nZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgY29uc3QgaW50YWN0ID0gaW50YWN0UmFuZ2VzW2pdXG5cbiAgICAgICAgbGF5ZXIuY29weVBhcnRGcm9tT2Zmc2NyZWVuKFxuICAgICAgICAgIGludGFjdC5vZmZzY3JlZW5Sb3cgKiBsaW5lSGVpZ2h0LFxuICAgICAgICAgIChpbnRhY3Quc3RhcnQgLSBmaXJzdFJvdykgKiBsaW5lSGVpZ2h0LFxuICAgICAgICAgIChpbnRhY3QuZW5kIC0gaW50YWN0LnN0YXJ0KSAqIGxpbmVIZWlnaHRcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgdGhpcy5kcmF3TGluZXNGb3JSYW5nZXMobWV0aG9kLCBpbnRhY3RSYW5nZXMsIGZpcnN0Um93LCBsYXN0Um93KVxuICAgIH1cblxuICAgIGxheWVyLnJlc2V0T2Zmc2NyZWVuU2l6ZSgpXG4gICAgbGF5ZXIuY29weVRvT2Zmc2NyZWVuKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIHRoZSBsaW5lcyBiZXR3ZWVuIHRoZSBpbnRhY3QgcmFuZ2VzIHdoZW4gYW4gdXBkYXRlIGhhcyBwZW5kaW5nXG4gICAqIGNoYW5nZXMuXG4gICAqXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBtZXRob2QgdGhlIHJlbmRlciBtZXRob2QgdG8gdXNlIGZvciB0aGUgbGluZXMgZHJhd2luZ1xuICAgKiBAcGFyYW0gIHtBcnJheTxPYmplY3Q+fSBpbnRhY3RSYW5nZXMgdGhlIGludGFjdCByYW5nZXMgaW4gdGhlIG1pbmltYXBcbiAgICogQHBhcmFtICB7bnVtYmVyfSBmaXJzdFJvdyB0aGUgZmlyc3Qgcm93IG9mIHRoZSByZW5kZXJlZCByZWdpb25cbiAgICogQHBhcmFtICB7bnVtYmVyfSBsYXN0Um93IHRoZSBsYXN0IHJvdyBvZiB0aGUgcmVuZGVyZWQgcmVnaW9uXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhd0xpbmVzRm9yUmFuZ2VzIChtZXRob2QsIHJhbmdlcywgZmlyc3RSb3csIGxhc3RSb3cpIHtcbiAgICBsZXQgY3VycmVudFJvdyA9IGZpcnN0Um93XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHJhbmdlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgcmFuZ2UgPSByYW5nZXNbaV1cblxuICAgICAgbWV0aG9kLmNhbGwodGhpcywgY3VycmVudFJvdywgcmFuZ2Uuc3RhcnQsIGN1cnJlbnRSb3cgLSBmaXJzdFJvdylcblxuICAgICAgY3VycmVudFJvdyA9IHJhbmdlLmVuZFxuICAgIH1cbiAgICBpZiAoY3VycmVudFJvdyA8PSBsYXN0Um93KSB7XG4gICAgICBtZXRob2QuY2FsbCh0aGlzLCBjdXJyZW50Um93LCBsYXN0Um93LCBjdXJyZW50Um93IC0gZmlyc3RSb3cpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIGJhY2sgZGVjb3JhdGlvbnMgb24gdGhlIGNvcnJlc3BvbmRpbmcgbGF5ZXIuXG4gICAqXG4gICAqIFRoZSBsaW5lcyByYW5nZSB0byBkcmF3IGlzIHNwZWNpZmllZCBieSB0aGUgYGZpcnN0Um93YCBhbmQgYGxhc3RSb3dgXG4gICAqIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gZmlyc3RSb3cgdGhlIGZpcnN0IHJvdyB0byByZW5kZXJcbiAgICogQHBhcmFtICB7bnVtYmVyfSBsYXN0Um93IHRoZSBsYXN0IHJvdyB0byByZW5kZXJcbiAgICogQHBhcmFtICB7bnVtYmVyfSBvZmZzZXRSb3cgdGhlIHJlbGF0aXZlIG9mZnNldCB0byBhcHBseSB0byByb3dzIHdoZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyaW5nIHRoZW1cbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3QmFja0RlY29yYXRpb25zRm9yTGluZXMgKGZpcnN0Um93LCBsYXN0Um93LCBvZmZzZXRSb3cpIHtcbiAgICBpZiAoZmlyc3RSb3cgPiBsYXN0Um93KSB7IHJldHVybiB9XG5cbiAgICBjb25zdCBkZXZpY2VQaXhlbFJhdGlvID0gdGhpcy5taW5pbWFwLmdldERldmljZVBpeGVsUmF0aW8oKVxuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSB0aGlzLm1pbmltYXAuZ2V0TGluZUhlaWdodCgpICogZGV2aWNlUGl4ZWxSYXRpb1xuICAgIGNvbnN0IGNoYXJIZWlnaHQgPSB0aGlzLm1pbmltYXAuZ2V0Q2hhckhlaWdodCgpICogZGV2aWNlUGl4ZWxSYXRpb1xuICAgIGNvbnN0IGNoYXJXaWR0aCA9IHRoaXMubWluaW1hcC5nZXRDaGFyV2lkdGgoKSAqIGRldmljZVBpeGVsUmF0aW9cbiAgICBjb25zdCBkZWNvcmF0aW9ucyA9IHRoaXMubWluaW1hcC5kZWNvcmF0aW9uc0J5VHlwZVRoZW5Sb3dzKGZpcnN0Um93LCBsYXN0Um93KVxuICAgIGNvbnN0IHt3aWR0aDogY2FudmFzV2lkdGgsIGhlaWdodDogY2FudmFzSGVpZ2h0fSA9IHRoaXMudG9rZW5zTGF5ZXIuZ2V0U2l6ZSgpXG4gICAgY29uc3QgcmVuZGVyRGF0YSA9IHtcbiAgICAgIGNvbnRleHQ6IHRoaXMuYmFja0xheWVyLmNvbnRleHQsXG4gICAgICBjYW52YXNXaWR0aDogY2FudmFzV2lkdGgsXG4gICAgICBjYW52YXNIZWlnaHQ6IGNhbnZhc0hlaWdodCxcbiAgICAgIGxpbmVIZWlnaHQ6IGxpbmVIZWlnaHQsXG4gICAgICBjaGFyV2lkdGg6IGNoYXJXaWR0aCxcbiAgICAgIGNoYXJIZWlnaHQ6IGNoYXJIZWlnaHQsXG4gICAgICBvcmRlcnM6IE1haW4uZ2V0UGx1Z2luc09yZGVyKClcbiAgICB9XG5cbiAgICBmb3IgKGxldCBzY3JlZW5Sb3cgPSBmaXJzdFJvdzsgc2NyZWVuUm93IDw9IGxhc3RSb3c7IHNjcmVlblJvdysrKSB7XG4gICAgICByZW5kZXJEYXRhLnJvdyA9IG9mZnNldFJvdyArIChzY3JlZW5Sb3cgLSBmaXJzdFJvdylcbiAgICAgIHJlbmRlckRhdGEueVJvdyA9IHJlbmRlckRhdGEucm93ICogbGluZUhlaWdodFxuICAgICAgcmVuZGVyRGF0YS5zY3JlZW5Sb3cgPSBzY3JlZW5Sb3dcblxuICAgICAgdGhpcy5kcmF3RGVjb3JhdGlvbnMoc2NyZWVuUm93LCBkZWNvcmF0aW9ucywgcmVuZGVyRGF0YSwge1xuICAgICAgICAnbGluZSc6IHRoaXMuZHJhd0xpbmVEZWNvcmF0aW9uLFxuICAgICAgICAnaGlnaGxpZ2h0LXVuZGVyJzogdGhpcy5kcmF3SGlnaGxpZ2h0RGVjb3JhdGlvbixcbiAgICAgICAgJ2JhY2tncm91bmQtY3VzdG9tJzogdGhpcy5kcmF3Q3VzdG9tRGVjb3JhdGlvblxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmJhY2tMYXllci5jb250ZXh0LmZpbGwoKVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIGZyb250IGRlY29yYXRpb25zIG9uIHRoZSBjb3JyZXNwb25kaW5nIGxheWVyLlxuICAgKlxuICAgKiBUaGUgbGluZXMgcmFuZ2UgdG8gZHJhdyBpcyBzcGVjaWZpZWQgYnkgdGhlIGBmaXJzdFJvd2AgYW5kIGBsYXN0Um93YFxuICAgKiBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpcnN0Um93IHRoZSBmaXJzdCByb3cgdG8gcmVuZGVyXG4gICAqIEBwYXJhbSAge251bWJlcn0gbGFzdFJvdyB0aGUgbGFzdCByb3cgdG8gcmVuZGVyXG4gICAqIEBwYXJhbSAge251bWJlcn0gb2Zmc2V0Um93IHRoZSByZWxhdGl2ZSBvZmZzZXQgdG8gYXBwbHkgdG8gcm93cyB3aGVuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmluZyB0aGVtXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhd0Zyb250RGVjb3JhdGlvbnNGb3JMaW5lcyAoZmlyc3RSb3csIGxhc3RSb3csIG9mZnNldFJvdykge1xuICAgIGlmIChmaXJzdFJvdyA+IGxhc3RSb3cpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IGRldmljZVBpeGVsUmF0aW8gPSB0aGlzLm1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpXG4gICAgY29uc3QgbGluZUhlaWdodCA9IHRoaXMubWluaW1hcC5nZXRMaW5lSGVpZ2h0KCkgKiBkZXZpY2VQaXhlbFJhdGlvXG4gICAgY29uc3QgY2hhckhlaWdodCA9IHRoaXMubWluaW1hcC5nZXRDaGFySGVpZ2h0KCkgKiBkZXZpY2VQaXhlbFJhdGlvXG4gICAgY29uc3QgY2hhcldpZHRoID0gdGhpcy5taW5pbWFwLmdldENoYXJXaWR0aCgpICogZGV2aWNlUGl4ZWxSYXRpb1xuICAgIGNvbnN0IGRlY29yYXRpb25zID0gdGhpcy5taW5pbWFwLmRlY29yYXRpb25zQnlUeXBlVGhlblJvd3MoZmlyc3RSb3csIGxhc3RSb3cpXG4gICAgY29uc3Qge3dpZHRoOiBjYW52YXNXaWR0aCwgaGVpZ2h0OiBjYW52YXNIZWlnaHR9ID0gdGhpcy50b2tlbnNMYXllci5nZXRTaXplKClcbiAgICBjb25zdCByZW5kZXJEYXRhID0ge1xuICAgICAgY29udGV4dDogdGhpcy5mcm9udExheWVyLmNvbnRleHQsXG4gICAgICBjYW52YXNXaWR0aDogY2FudmFzV2lkdGgsXG4gICAgICBjYW52YXNIZWlnaHQ6IGNhbnZhc0hlaWdodCxcbiAgICAgIGxpbmVIZWlnaHQ6IGxpbmVIZWlnaHQsXG4gICAgICBjaGFyV2lkdGg6IGNoYXJXaWR0aCxcbiAgICAgIGNoYXJIZWlnaHQ6IGNoYXJIZWlnaHQsXG4gICAgICBvcmRlcnM6IE1haW4uZ2V0UGx1Z2luc09yZGVyKClcbiAgICB9XG5cbiAgICBmb3IgKGxldCBzY3JlZW5Sb3cgPSBmaXJzdFJvdzsgc2NyZWVuUm93IDw9IGxhc3RSb3c7IHNjcmVlblJvdysrKSB7XG4gICAgICByZW5kZXJEYXRhLnJvdyA9IG9mZnNldFJvdyArIChzY3JlZW5Sb3cgLSBmaXJzdFJvdylcbiAgICAgIHJlbmRlckRhdGEueVJvdyA9IHJlbmRlckRhdGEucm93ICogbGluZUhlaWdodFxuICAgICAgcmVuZGVyRGF0YS5zY3JlZW5Sb3cgPSBzY3JlZW5Sb3dcblxuICAgICAgdGhpcy5kcmF3RGVjb3JhdGlvbnMoc2NyZWVuUm93LCBkZWNvcmF0aW9ucywgcmVuZGVyRGF0YSwge1xuICAgICAgICAnZ3V0dGVyJzogdGhpcy5kcmF3R3V0dGVyRGVjb3JhdGlvbixcbiAgICAgICAgJ2hpZ2hsaWdodC1vdmVyJzogdGhpcy5kcmF3SGlnaGxpZ2h0RGVjb3JhdGlvbixcbiAgICAgICAgJ2hpZ2hsaWdodC1vdXRsaW5lJzogdGhpcy5kcmF3SGlnaGxpZ2h0T3V0bGluZURlY29yYXRpb24sXG4gICAgICAgICdmb3JlZ3JvdW5kLWN1c3RvbSc6IHRoaXMuZHJhd0N1c3RvbURlY29yYXRpb25cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmVuZGVyRGF0YS5jb250ZXh0LmZpbGwoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgdG9rZW5zIGJ5IGxpbmUuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gc3RhcnRSb3cgVGhlIHN0YXJ0IHJvd1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGVuZFJvdyBUaGUgZW5kIHJvd1xuICAgKiBAcmV0dXJuIHtBcnJheTxBcnJheT59IEFuIGFycmF5IG9mIHRva2VucyBieSBsaW5lXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgdG9rZW5MaW5lc0ZvclNjcmVlblJvd3MgKHN0YXJ0Um93LCBlbmRSb3cpIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmdldFRleHRFZGl0b3IoKVxuICAgIGxldCB0b2tlbkxpbmVzID0gW11cbiAgICBpZiAodHlwZW9mIGVkaXRvci50b2tlbml6ZWRMaW5lc0ZvclNjcmVlblJvd3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZvciAobGV0IHRva2VuaXplZExpbmUgb2YgZWRpdG9yLnRva2VuaXplZExpbmVzRm9yU2NyZWVuUm93cyhzdGFydFJvdywgZW5kUm93KSkge1xuICAgICAgICBpZiAodG9rZW5pemVkTGluZSkge1xuICAgICAgICAgIGNvbnN0IGludmlzaWJsZVJlZ0V4cCA9IHRoaXMuZ2V0SW52aXNpYmxlUmVnRXhwRm9yTGluZSh0b2tlbml6ZWRMaW5lKVxuICAgICAgICAgIHRva2VuTGluZXMucHVzaCh0b2tlbml6ZWRMaW5lLnRva2Vucy5tYXAoKHRva2VuKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB2YWx1ZTogdG9rZW4udmFsdWUucmVwbGFjZShpbnZpc2libGVSZWdFeHAsICcgJyksXG4gICAgICAgICAgICAgIHNjb3BlczogdG9rZW4uc2NvcGVzLnNsaWNlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAgICAgc2NvcGVzOiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkaXNwbGF5TGF5ZXIgPSBlZGl0b3IuZGlzcGxheUxheWVyXG4gICAgICBjb25zdCBpbnZpc2libGVSZWdFeHAgPSB0aGlzLmdldEludmlzaWJsZVJlZ0V4cCgpXG4gICAgICBjb25zdCBzY3JlZW5MaW5lcyA9IGRpc3BsYXlMYXllci5nZXRTY3JlZW5MaW5lcyhzdGFydFJvdywgZW5kUm93KVxuICAgICAgZm9yIChsZXQge2xpbmVUZXh0LCB0YWdDb2Rlc30gb2Ygc2NyZWVuTGluZXMpIHtcbiAgICAgICAgbGV0IHRva2VucyA9IFtdXG4gICAgICAgIGxldCBzY29wZXMgPSBbXVxuICAgICAgICBsZXQgdGV4dEluZGV4ID0gMFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhsaW5lVGV4dCwgaW52aXNpYmxlUmVnRXhwLCBsaW5lVGV4dC5yZXBsYWNlKGludmlzaWJsZVJlZ0V4cCwgJyAnKSlcbiAgICAgICAgZm9yIChsZXQgdGFnQ29kZSBvZiB0YWdDb2Rlcykge1xuICAgICAgICAgIGlmIChkaXNwbGF5TGF5ZXIuaXNPcGVuVGFnQ29kZSh0YWdDb2RlKSkge1xuICAgICAgICAgICAgc2NvcGVzLnB1c2goZGlzcGxheUxheWVyLnRhZ0ZvckNvZGUodGFnQ29kZSkpXG4gICAgICAgICAgfSBlbHNlIGlmIChkaXNwbGF5TGF5ZXIuaXNDbG9zZVRhZ0NvZGUodGFnQ29kZSkpIHtcbiAgICAgICAgICAgIHNjb3Blcy5wb3AoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgIHZhbHVlOiBsaW5lVGV4dC5zdWJzdHIodGV4dEluZGV4LCB0YWdDb2RlKS5yZXBsYWNlKGludmlzaWJsZVJlZ0V4cCwgJyAnKSxcbiAgICAgICAgICAgICAgc2NvcGVzOiBzY29wZXMuc2xpY2UoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRleHRJbmRleCArPSB0YWdDb2RlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdG9rZW5MaW5lcy5wdXNoKHRva2VucylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRva2VuTGluZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyBsaW5lcyBvbiB0aGUgY29ycmVzcG9uZGluZyBsYXllci5cbiAgICpcbiAgICogVGhlIGxpbmVzIHJhbmdlIHRvIGRyYXcgaXMgc3BlY2lmaWVkIGJ5IHRoZSBgZmlyc3RSb3dgIGFuZCBgbGFzdFJvd2BcbiAgICogcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSBmaXJzdFJvdyB0aGUgZmlyc3Qgcm93IHRvIHJlbmRlclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxhc3RSb3cgdGhlIGxhc3Qgcm93IHRvIHJlbmRlclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IG9mZnNldFJvdyB0aGUgcmVsYXRpdmUgb2Zmc2V0IHRvIGFwcGx5IHRvIHJvd3Mgd2hlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJpbmcgdGhlbVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGRyYXdMaW5lcyAoZmlyc3RSb3csIGxhc3RSb3csIG9mZnNldFJvdykge1xuICAgIGlmIChmaXJzdFJvdyA+IGxhc3RSb3cpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IGRldmljZVBpeGVsUmF0aW8gPSB0aGlzLm1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpXG4gICAgY29uc3QgbGluZUhlaWdodCA9IHRoaXMubWluaW1hcC5nZXRMaW5lSGVpZ2h0KCkgKiBkZXZpY2VQaXhlbFJhdGlvXG4gICAgY29uc3QgY2hhckhlaWdodCA9IHRoaXMubWluaW1hcC5nZXRDaGFySGVpZ2h0KCkgKiBkZXZpY2VQaXhlbFJhdGlvXG4gICAgY29uc3QgY2hhcldpZHRoID0gdGhpcy5taW5pbWFwLmdldENoYXJXaWR0aCgpICogZGV2aWNlUGl4ZWxSYXRpb1xuICAgIGNvbnN0IGRpc3BsYXlDb2RlSGlnaGxpZ2h0cyA9IHRoaXMuZGlzcGxheUNvZGVIaWdobGlnaHRzXG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMudG9rZW5zTGF5ZXIuY29udGV4dFxuICAgIGNvbnN0IHt3aWR0aDogY2FudmFzV2lkdGh9ID0gdGhpcy50b2tlbnNMYXllci5nZXRTaXplKClcblxuICAgIGlmICh0eXBlb2YgdGhpcy50b2tlbkxpbmVzRm9yU2NyZWVuUm93cyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9rZW5MaW5lc0ZvclNjcmVlblJvd3Mgc2hvdWxkIGJlIGEgZnVuY3Rpb24gYnV0IGl0IHdhcyAke3R5cGVvZiB0aGlzLnRva2VuTGluZXNGb3JTY3JlZW5Sb3dzfWAsIHRoaXMudG9rZW5MaW5lc0ZvclNjcmVlblJvd3MpXG5cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHNjcmVlblJvd3NUb2tlbnMgPSB0aGlzLnRva2VuTGluZXNGb3JTY3JlZW5Sb3dzKGZpcnN0Um93LCBsYXN0Um93KVxuXG4gICAgbGV0IHkgPSBvZmZzZXRSb3cgKiBsaW5lSGVpZ2h0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY3JlZW5Sb3dzVG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgdG9rZW5zID0gc2NyZWVuUm93c1Rva2Vuc1tpXVxuICAgICAgbGV0IHggPSAwXG4gICAgICBjb250ZXh0LmNsZWFyUmVjdCh4LCB5LCBjYW52YXNXaWR0aCwgbGluZUhlaWdodClcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdG9rZW5zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCB0b2tlbiA9IHRva2Vuc1tqXVxuICAgICAgICBpZiAoL15cXHMrJC8udGVzdCh0b2tlbi52YWx1ZSkpIHtcbiAgICAgICAgICB4ICs9IHRva2VuLnZhbHVlLmxlbmd0aCAqIGNoYXJXaWR0aFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGNvbG9yID0gZGlzcGxheUNvZGVIaWdobGlnaHRzID8gdGhpcy5nZXRUb2tlbkNvbG9yKHRva2VuKSA6IHRoaXMuZ2V0RGVmYXVsdENvbG9yKClcbiAgICAgICAgICB4ID0gdGhpcy5kcmF3VG9rZW4oY29udGV4dCwgdG9rZW4udmFsdWUsIGNvbG9yLCB4LCB5LCBjaGFyV2lkdGgsIGNoYXJIZWlnaHQpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggPiBjYW52YXNXaWR0aCkgeyBicmVhayB9XG4gICAgICB9XG5cbiAgICAgIHkgKz0gbGluZUhlaWdodFxuICAgIH1cblxuICAgIGNvbnRleHQuZmlsbCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcmVnZXhwIHRvIHJlcGxhY2UgaW52aXNpYmxlcyBzdWJzdGl0dXRpb24gY2hhcmFjdGVyc1xuICAgKiBpbiBlZGl0b3IgbGluZXMuXG4gICAqXG4gICAqIEByZXR1cm4ge1JlZ0V4cH0gdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBpbnZpc2libGUgY2hhcmFjdGVyc1xuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGdldEludmlzaWJsZVJlZ0V4cCAoKSB7XG4gICAgbGV0IGludmlzaWJsZXMgPSB0aGlzLmdldFRleHRFZGl0b3IoKS5nZXRJbnZpc2libGVzKClcbiAgICBsZXQgcmVnZXhwID0gW11cbiAgICBpZiAoaW52aXNpYmxlcy5jciAhPSBudWxsKSB7IHJlZ2V4cC5wdXNoKGludmlzaWJsZXMuY3IpIH1cbiAgICBpZiAoaW52aXNpYmxlcy5lb2wgIT0gbnVsbCkgeyByZWdleHAucHVzaChpbnZpc2libGVzLmVvbCkgfVxuICAgIGlmIChpbnZpc2libGVzLnNwYWNlICE9IG51bGwpIHsgcmVnZXhwLnB1c2goaW52aXNpYmxlcy5zcGFjZSkgfVxuICAgIGlmIChpbnZpc2libGVzLnRhYiAhPSBudWxsKSB7IHJlZ2V4cC5wdXNoKGludmlzaWJsZXMudGFiKSB9XG5cbiAgICByZXR1cm4gUmVnRXhwKHJlZ2V4cC5maWx0ZXIoKHMpID0+IHtcbiAgICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZydcbiAgICB9KS5tYXAoXy5lc2NhcGVSZWdFeHApLmpvaW4oJ3wnKSwgJ2cnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJlZ2V4cCB0byByZXBsYWNlIGludmlzaWJsZXMgc3Vic3RpdHV0aW9uIGNoYXJhY3RlcnNcbiAgICogaW4gZWRpdG9yIGxpbmVzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGxpbmUgdGhlIHRva2VuaXplZCBsaW5lXG4gICAqIEByZXR1cm4ge1JlZ0V4cH0gdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBpbnZpc2libGUgY2hhcmFjdGVyc1xuICAgKiBAZGVwcmVjYXRlZCBJcyB1c2VkIG9ubHkgdG8gc3VwcG9ydCBBdG9tIHZlcnNpb24gYmVmb3JlIGRpc3BsYXkgbGF5ZXIgQVBJXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZ2V0SW52aXNpYmxlUmVnRXhwRm9yTGluZSAobGluZSkge1xuICAgIGlmICgobGluZSAhPSBudWxsKSAmJiAobGluZS5pbnZpc2libGVzICE9IG51bGwpKSB7XG4gICAgICBjb25zdCBpbnZpc2libGVzID0gW11cbiAgICAgIGlmIChsaW5lLmludmlzaWJsZXMuY3IgIT0gbnVsbCkgeyBpbnZpc2libGVzLnB1c2gobGluZS5pbnZpc2libGVzLmNyKSB9XG4gICAgICBpZiAobGluZS5pbnZpc2libGVzLmVvbCAhPSBudWxsKSB7IGludmlzaWJsZXMucHVzaChsaW5lLmludmlzaWJsZXMuZW9sKSB9XG4gICAgICBpZiAobGluZS5pbnZpc2libGVzLnNwYWNlICE9IG51bGwpIHsgaW52aXNpYmxlcy5wdXNoKGxpbmUuaW52aXNpYmxlcy5zcGFjZSkgfVxuICAgICAgaWYgKGxpbmUuaW52aXNpYmxlcy50YWIgIT0gbnVsbCkgeyBpbnZpc2libGVzLnB1c2gobGluZS5pbnZpc2libGVzLnRhYikgfVxuXG4gICAgICByZXR1cm4gUmVnRXhwKGludmlzaWJsZXMuZmlsdGVyKChzKSA9PiB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZydcbiAgICAgIH0pLm1hcChfLmVzY2FwZVJlZ0V4cCkuam9pbignfCcpLCAnZycpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIGEgc2luZ2xlIHRva2VuIG9uIHRoZSBnaXZlbiBjb250ZXh0LlxuICAgKlxuICAgKiBAcGFyYW0gIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGNvbnRleHQgdGhlIHRhcmdldCBjYW52YXMgY29udGV4dFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRleHQgdGhlIHRva2VuJ3MgdGV4dCBjb250ZW50XG4gICAqIEBwYXJhbSAge3N0cmluZ30gY29sb3IgdGhlIHRva2VuJ3MgQ1NTIGNvbG9yXG4gICAqIEBwYXJhbSAge251bWJlcn0geCB0aGUgeCBwb3NpdGlvbiBvZiB0aGUgdG9rZW4gaW4gdGhlIGxpbmVcbiAgICogQHBhcmFtICB7bnVtYmVyfSB5IHRoZSB5IHBvc2l0aW9uIG9mIHRoZSBsaW5lIGluIHRoZSBtaW5pbWFwXG4gICAqIEBwYXJhbSAge251bWJlcn0gY2hhcldpZHRoIHRoZSB3aWR0aCBvZiBhIGNoYXJhY3RlciBpbiB0aGUgbWluaW1hcFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGNoYXJIZWlnaHQgdGhlIGhlaWdodCBvZiBhIGNoYXJhY3RlciBpbiB0aGUgbWluaW1hcFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB4IHBvc2l0aW9uIGF0IHRoZSBlbmQgb2YgdGhlIHRva2VuXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhd1Rva2VuIChjb250ZXh0LCB0ZXh0LCBjb2xvciwgeCwgeSwgY2hhcldpZHRoLCBjaGFySGVpZ2h0KSB7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvclxuXG4gICAgaWYgKHRoaXMuaWdub3JlV2hpdGVzcGFjZXNJblRva2Vucykge1xuICAgICAgY29uc3QgbGVuZ3RoID0gdGV4dC5sZW5ndGggKiBjaGFyV2lkdGhcbiAgICAgIGNvbnRleHQuZmlsbFJlY3QoeCwgeSwgbGVuZ3RoLCBjaGFySGVpZ2h0KVxuXG4gICAgICByZXR1cm4geCArIGxlbmd0aFxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgY2hhcnMgPSAwXG4gICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gdGV4dC5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBjb25zdCBjaGFyID0gdGV4dFtqXVxuICAgICAgICBpZiAoL1xccy8udGVzdChjaGFyKSkge1xuICAgICAgICAgIGlmIChjaGFycyA+IDApIHtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoeCAtIChjaGFycyAqIGNoYXJXaWR0aCksIHksIGNoYXJzICogY2hhcldpZHRoLCBjaGFySGVpZ2h0KVxuICAgICAgICAgIH1cbiAgICAgICAgICBjaGFycyA9IDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGFycysrXG4gICAgICAgIH1cbiAgICAgICAgeCArPSBjaGFyV2lkdGhcbiAgICAgIH1cbiAgICAgIGlmIChjaGFycyA+IDApIHtcbiAgICAgICAgY29udGV4dC5maWxsUmVjdCh4IC0gKGNoYXJzICogY2hhcldpZHRoKSwgeSwgY2hhcnMgKiBjaGFyV2lkdGgsIGNoYXJIZWlnaHQpXG4gICAgICB9XG4gICAgICByZXR1cm4geFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyB0aGUgc3BlY2lmaWVkIGRlY29yYXRpb25zIGZvciB0aGUgY3VycmVudCBgc2NyZWVuUm93YC5cbiAgICpcbiAgICogVGhlIGBkZWNvcmF0aW9uc2Agb2JqZWN0IGNvbnRhaW5zIGFsbCB0aGUgZGVjb3JhdGlvbnMgZ3JvdXBlZCBieSB0eXBlIGFuZFxuICAgKiB0aGVuIHJvd3MuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gc2NyZWVuUm93IHRoZSBzY3JlZW4gcm93IGluZGV4IGZvciB3aGljaFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXIgZGVjb3JhdGlvbnNcbiAgICogQHBhcmFtICB7T2JqZWN0fSBkZWNvcmF0aW9ucyB0aGUgb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBkZWNvcmF0aW9uc1xuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJlbmRlckRhdGEgdGhlIG9iamVjdCBjb250YWluaW5nIHRoZSByZW5kZXIgZGF0YVxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHR5cGVzIGFuIG9iamVjdCB3aXRoIHRoZSB0eXBlIHRvIHJlbmRlciBhcyBrZXkgYW5kIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlciBtZXRob2QgYXMgdmFsdWVcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3RGVjb3JhdGlvbnMgKHNjcmVlblJvdywgZGVjb3JhdGlvbnMsIHJlbmRlckRhdGEsIHR5cGVzKSB7XG4gICAgbGV0IGRlY29yYXRpb25zVG9SZW5kZXIgPSBbXVxuXG4gICAgcmVuZGVyRGF0YS5jb250ZXh0LmNsZWFyUmVjdChcbiAgICAgIDAsIHJlbmRlckRhdGEueVJvdyxcbiAgICAgIHJlbmRlckRhdGEuY2FudmFzV2lkdGgsIHJlbmRlckRhdGEubGluZUhlaWdodFxuICAgIClcblxuICAgIGZvciAobGV0IGkgaW4gdHlwZXMpIHtcbiAgICAgIGRlY29yYXRpb25zVG9SZW5kZXIgPSBkZWNvcmF0aW9uc1RvUmVuZGVyLmNvbmNhdChcbiAgICAgICAgZGVjb3JhdGlvbnNbaV0gIT0gbnVsbCA/IGRlY29yYXRpb25zW2ldW3NjcmVlblJvd10gfHwgW10gOiBbXVxuICAgICAgKVxuICAgIH1cblxuICAgIGRlY29yYXRpb25zVG9SZW5kZXIuc29ydCgoYSwgYikgPT5cbiAgICAgIChyZW5kZXJEYXRhLm9yZGVyc1thLnByb3BlcnRpZXMucGx1Z2luXSB8fCAwKSAtIChyZW5kZXJEYXRhLm9yZGVyc1tiLnByb3BlcnRpZXMucGx1Z2luXSB8fCAwKVxuICAgIClcblxuICAgIGlmIChkZWNvcmF0aW9uc1RvUmVuZGVyICE9IG51bGwgPyBkZWNvcmF0aW9uc1RvUmVuZGVyLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGRlY29yYXRpb25zVG9SZW5kZXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdHlwZXNbZGVjb3JhdGlvbnNUb1JlbmRlcltpXS5wcm9wZXJ0aWVzLnR5cGVdLmNhbGwodGhpcywgZGVjb3JhdGlvbnNUb1JlbmRlcltpXSwgcmVuZGVyRGF0YSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgYSBsaW5lIGRlY29yYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSAge0RlY29yYXRpb259IGRlY29yYXRpb24gdGhlIGRlY29yYXRpb24gdG8gcmVuZGVyXG4gICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSB0aGUgZGF0YSBuZWVkIHRvIHBlcmZvcm0gdGhlIHJlbmRlclxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGRyYXdMaW5lRGVjb3JhdGlvbiAoZGVjb3JhdGlvbiwgZGF0YSkge1xuICAgIGRhdGEuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmdldERlY29yYXRpb25Db2xvcihkZWNvcmF0aW9uKVxuICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCBkYXRhLnlSb3csIGRhdGEuY2FudmFzV2lkdGgsIGRhdGEubGluZUhlaWdodClcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyBhIGd1dHRlciBkZWNvcmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gIHtEZWNvcmF0aW9ufSBkZWNvcmF0aW9uIHRoZSBkZWNvcmF0aW9uIHRvIHJlbmRlclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgdGhlIGRhdGEgbmVlZCB0byBwZXJmb3JtIHRoZSByZW5kZXJcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3R3V0dGVyRGVjb3JhdGlvbiAoZGVjb3JhdGlvbiwgZGF0YSkge1xuICAgIGRhdGEuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmdldERlY29yYXRpb25Db2xvcihkZWNvcmF0aW9uKVxuICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCBkYXRhLnlSb3csIDEsIGRhdGEubGluZUhlaWdodClcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyBhIGhpZ2hsaWdodCBkZWNvcmF0aW9uLlxuICAgKlxuICAgKiBJdCByZW5kZXJzIG9ubHkgdGhlIHBhcnQgb2YgdGhlIGhpZ2hsaWdodCBjb3JyZXNwb25kaW5nIHRvIHRoZSBzcGVjaWZpZWRcbiAgICogcm93LlxuICAgKlxuICAgKiBAcGFyYW0gIHtEZWNvcmF0aW9ufSBkZWNvcmF0aW9uIHRoZSBkZWNvcmF0aW9uIHRvIHJlbmRlclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgdGhlIGRhdGEgbmVlZCB0byBwZXJmb3JtIHRoZSByZW5kZXJcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3SGlnaGxpZ2h0RGVjb3JhdGlvbiAoZGVjb3JhdGlvbiwgZGF0YSkge1xuICAgIGNvbnN0IHJhbmdlID0gZGVjb3JhdGlvbi5nZXRNYXJrZXIoKS5nZXRTY3JlZW5SYW5nZSgpXG4gICAgY29uc3Qgcm93U3BhbiA9IHJhbmdlLmVuZC5yb3cgLSByYW5nZS5zdGFydC5yb3dcblxuICAgIGRhdGEuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmdldERlY29yYXRpb25Db2xvcihkZWNvcmF0aW9uKVxuXG4gICAgaWYgKHJvd1NwYW4gPT09IDApIHtcbiAgICAgIGNvbnN0IGNvbFNwYW4gPSByYW5nZS5lbmQuY29sdW1uIC0gcmFuZ2Uuc3RhcnQuY29sdW1uXG4gICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QocmFuZ2Uuc3RhcnQuY29sdW1uICogZGF0YS5jaGFyV2lkdGgsIGRhdGEueVJvdywgY29sU3BhbiAqIGRhdGEuY2hhcldpZHRoLCBkYXRhLmxpbmVIZWlnaHQpXG4gICAgfSBlbHNlIGlmIChkYXRhLnNjcmVlblJvdyA9PT0gcmFuZ2Uuc3RhcnQucm93KSB7XG4gICAgICBjb25zdCB4ID0gcmFuZ2Uuc3RhcnQuY29sdW1uICogZGF0YS5jaGFyV2lkdGhcbiAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCh4LCBkYXRhLnlSb3csIGRhdGEuY2FudmFzV2lkdGggLSB4LCBkYXRhLmxpbmVIZWlnaHQpXG4gICAgfSBlbHNlIGlmIChkYXRhLnNjcmVlblJvdyA9PT0gcmFuZ2UuZW5kLnJvdykge1xuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIGRhdGEueVJvdywgcmFuZ2UuZW5kLmNvbHVtbiAqIGRhdGEuY2hhcldpZHRoLCBkYXRhLmxpbmVIZWlnaHQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCBkYXRhLnlSb3csIGRhdGEuY2FudmFzV2lkdGgsIGRhdGEubGluZUhlaWdodClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgYSBoaWdobGlnaHQgb3V0bGluZSBkZWNvcmF0aW9uLlxuICAgKlxuICAgKiBJdCByZW5kZXJzIG9ubHkgdGhlIHBhcnQgb2YgdGhlIGhpZ2hsaWdodCBjb3JyZXNwb25kaW5nIHRvIHRoZSBzcGVjaWZpZWRcbiAgICogcm93LlxuICAgKlxuICAgKiBAcGFyYW0gIHtEZWNvcmF0aW9ufSBkZWNvcmF0aW9uIHRoZSBkZWNvcmF0aW9uIHRvIHJlbmRlclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgdGhlIGRhdGEgbmVlZCB0byBwZXJmb3JtIHRoZSByZW5kZXJcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3SGlnaGxpZ2h0T3V0bGluZURlY29yYXRpb24gKGRlY29yYXRpb24sIGRhdGEpIHtcbiAgICBsZXQgYm90dG9tV2lkdGgsIGNvbFNwYW4sIHdpZHRoLCB4Qm90dG9tU3RhcnQsIHhFbmQsIHhTdGFydFxuICAgIGNvbnN0IHtsaW5lSGVpZ2h0LCBjaGFyV2lkdGgsIGNhbnZhc1dpZHRoLCBzY3JlZW5Sb3d9ID0gZGF0YVxuICAgIGNvbnN0IHJhbmdlID0gZGVjb3JhdGlvbi5nZXRNYXJrZXIoKS5nZXRTY3JlZW5SYW5nZSgpXG4gICAgY29uc3Qgcm93U3BhbiA9IHJhbmdlLmVuZC5yb3cgLSByYW5nZS5zdGFydC5yb3dcbiAgICBjb25zdCB5U3RhcnQgPSBkYXRhLnlSb3dcbiAgICBjb25zdCB5RW5kID0geVN0YXJ0ICsgbGluZUhlaWdodFxuXG4gICAgZGF0YS5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZ2V0RGVjb3JhdGlvbkNvbG9yKGRlY29yYXRpb24pXG5cbiAgICBpZiAocm93U3BhbiA9PT0gMCkge1xuICAgICAgY29sU3BhbiA9IHJhbmdlLmVuZC5jb2x1bW4gLSByYW5nZS5zdGFydC5jb2x1bW5cbiAgICAgIHdpZHRoID0gY29sU3BhbiAqIGNoYXJXaWR0aFxuICAgICAgeFN0YXJ0ID0gcmFuZ2Uuc3RhcnQuY29sdW1uICogY2hhcldpZHRoXG4gICAgICB4RW5kID0geFN0YXJ0ICsgd2lkdGhcblxuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhTdGFydCwgeVN0YXJ0LCB3aWR0aCwgMSlcbiAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCh4U3RhcnQsIHlFbmQsIHdpZHRoLCAxKVxuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhTdGFydCwgeVN0YXJ0LCAxLCBsaW5lSGVpZ2h0KVxuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhFbmQsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICB9IGVsc2UgaWYgKHJvd1NwYW4gPT09IDEpIHtcbiAgICAgIHhTdGFydCA9IHJhbmdlLnN0YXJ0LmNvbHVtbiAqIGRhdGEuY2hhcldpZHRoXG4gICAgICB4RW5kID0gcmFuZ2UuZW5kLmNvbHVtbiAqIGRhdGEuY2hhcldpZHRoXG5cbiAgICAgIGlmIChzY3JlZW5Sb3cgPT09IHJhbmdlLnN0YXJ0LnJvdykge1xuICAgICAgICB3aWR0aCA9IGRhdGEuY2FudmFzV2lkdGggLSB4U3RhcnRcbiAgICAgICAgeEJvdHRvbVN0YXJ0ID0gTWF0aC5tYXgoeFN0YXJ0LCB4RW5kKVxuICAgICAgICBib3R0b21XaWR0aCA9IGRhdGEuY2FudmFzV2lkdGggLSB4Qm90dG9tU3RhcnRcblxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeFN0YXJ0LCB5U3RhcnQsIHdpZHRoLCAxKVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeEJvdHRvbVN0YXJ0LCB5RW5kLCBib3R0b21XaWR0aCwgMSlcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhTdGFydCwgeVN0YXJ0LCAxLCBsaW5lSGVpZ2h0KVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoY2FudmFzV2lkdGggLSAxLCB5U3RhcnQsIDEsIGxpbmVIZWlnaHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWR0aCA9IGNhbnZhc1dpZHRoIC0geFN0YXJ0XG4gICAgICAgIGJvdHRvbVdpZHRoID0gY2FudmFzV2lkdGggLSB4RW5kXG5cbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIHlTdGFydCwgeFN0YXJ0LCAxKVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoMCwgeUVuZCwgeEVuZCwgMSlcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhFbmQsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgeFN0YXJ0ID0gcmFuZ2Uuc3RhcnQuY29sdW1uICogY2hhcldpZHRoXG4gICAgICB4RW5kID0gcmFuZ2UuZW5kLmNvbHVtbiAqIGNoYXJXaWR0aFxuICAgICAgaWYgKHNjcmVlblJvdyA9PT0gcmFuZ2Uuc3RhcnQucm93KSB7XG4gICAgICAgIHdpZHRoID0gY2FudmFzV2lkdGggLSB4U3RhcnRcblxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeFN0YXJ0LCB5U3RhcnQsIHdpZHRoLCAxKVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeFN0YXJ0LCB5U3RhcnQsIDEsIGxpbmVIZWlnaHQpXG4gICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdChjYW52YXNXaWR0aCAtIDEsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgIH0gZWxzZSBpZiAoc2NyZWVuUm93ID09PSByYW5nZS5lbmQucm93KSB7XG4gICAgICAgIHdpZHRoID0gY2FudmFzV2lkdGggLSB4U3RhcnRcblxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoMCwgeUVuZCwgeEVuZCwgMSlcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhFbmQsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCB5U3RhcnQsIDEsIGxpbmVIZWlnaHQpXG4gICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdChjYW52YXNXaWR0aCAtIDEsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgICAgaWYgKHNjcmVlblJvdyA9PT0gcmFuZ2Uuc3RhcnQucm93ICsgMSkge1xuICAgICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCB5U3RhcnQsIHhTdGFydCwgMSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NyZWVuUm93ID09PSByYW5nZS5lbmQucm93IC0gMSkge1xuICAgICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCh4RW5kLCB5RW5kLCBjYW52YXNXaWR0aCAtIHhFbmQsIDEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgYSBjdXN0b20gZGVjb3JhdGlvbi5cbiAgICpcbiAgICogSXQgcmVuZGVycyBvbmx5IHRoZSBwYXJ0IG9mIHRoZSBoaWdobGlnaHQgY29ycmVzcG9uZGluZyB0byB0aGUgc3BlY2lmaWVkXG4gICAqIHJvdy5cbiAgICpcbiAgICogQHBhcmFtICB7RGVjb3JhdGlvbn0gZGVjb3JhdGlvbiB0aGUgZGVjb3JhdGlvbiB0byByZW5kZXJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBkYXRhIHRoZSBkYXRhIG5lZWQgdG8gcGVyZm9ybSB0aGUgcmVuZGVyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhd0N1c3RvbURlY29yYXRpb24gKGRlY29yYXRpb24sIGRhdGEpIHtcbiAgICBjb25zdCByZW5kZXJSb3V0aW5lID0gZGVjb3JhdGlvbi5nZXRQcm9wZXJ0aWVzKCkucmVuZGVyXG5cbiAgICBpZiAocmVuZGVyUm91dGluZSkge1xuICAgICAgZGF0YS5jb2xvciA9IHRoaXMuZ2V0RGVjb3JhdGlvbkNvbG9yKGRlY29yYXRpb24pXG4gICAgICByZW5kZXJSb3V0aW5lKGRlY29yYXRpb24sIGRhdGEpXG4gICAgfVxuICB9XG5cbiAgLy8gICAgIyMjIyMjIyMgICAgICMjIyAgICAjIyAgICAjIyAgIyMjIyMjICAgIyMjIyMjIyMgICMjIyMjI1xuICAvLyAgICAjIyAgICAgIyMgICAjIyAjIyAgICMjIyAgICMjICMjICAgICMjICAjIyAgICAgICAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgICMjICAgIyMgICMjIyMgICMjICMjICAgICAgICAjIyAgICAgICAjI1xuICAvLyAgICAjIyMjIyMjIyAgIyMgICAgICMjICMjICMjICMjICMjICAgIyMjIyAjIyMjIyMgICAgIyMjIyMjXG4gIC8vICAgICMjICAgIyMgICAjIyMjIyMjIyMgIyMgICMjIyMgIyMgICAgIyMgICMjICAgICAgICAgICAgICMjXG4gIC8vICAgICMjICAgICMjICAjIyAgICAgIyMgIyMgICAjIyMgIyMgICAgIyMgICMjICAgICAgICMjICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgIyMgICMjIyMjIyAgICMjIyMjIyMjICAjIyMjIyNcblxuICAvKipcbiAgICogQ29tcHV0ZXMgdGhlIHJhbmdlcyB0aGF0IGFyZSBub3QgYWZmZWN0ZWQgYnkgdGhlIGN1cnJlbnQgcGVuZGluZyBjaGFuZ2VzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpcnN0Um93IHRoZSBmaXJzdCByb3cgb2YgdGhlIHJlbmRlcmVkIHJlZ2lvblxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxhc3RSb3cgdGhlIGxhc3Qgcm93IG9mIHRoZSByZW5kZXJlZCByZWdpb25cbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn0gdGhlIGludGFjdCByYW5nZXMgaW4gdGhlIHJlbmRlcmVkIHJlZ2lvblxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNvbXB1dGVJbnRhY3RSYW5nZXMgKGZpcnN0Um93LCBsYXN0Um93LCBjaGFuZ2VzKSB7XG4gICAgaWYgKCh0aGlzLm9mZnNjcmVlbkZpcnN0Um93ID09IG51bGwpICYmICh0aGlzLm9mZnNjcmVlbkxhc3RSb3cgPT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIC8vIEF0IGZpcnN0LCB0aGUgd2hvbGUgcmFuZ2UgaXMgY29uc2lkZXJlZCBpbnRhY3RcbiAgICBsZXQgaW50YWN0UmFuZ2VzID0gW1xuICAgICAge1xuICAgICAgICBzdGFydDogdGhpcy5vZmZzY3JlZW5GaXJzdFJvdyxcbiAgICAgICAgZW5kOiB0aGlzLm9mZnNjcmVlbkxhc3RSb3csXG4gICAgICAgIG9mZnNjcmVlblJvdzogMFxuICAgICAgfVxuICAgIF1cblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjaGFuZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFuZ2UgPSBjaGFuZ2VzW2ldXG4gICAgICBjb25zdCBuZXdJbnRhY3RSYW5nZXMgPSBbXVxuXG4gICAgICBmb3IgKGxldCBqID0gMCwgaW50YWN0TGVuID0gaW50YWN0UmFuZ2VzLmxlbmd0aDsgaiA8IGludGFjdExlbjsgaisrKSB7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gaW50YWN0UmFuZ2VzW2pdXG5cbiAgICAgICAgaWYgKGNoYW5nZS5lbmQgPCByYW5nZS5zdGFydCAmJiBjaGFuZ2Uuc2NyZWVuRGVsdGEgIT09IDApIHtcbiAgICAgICAgICAvLyBUaGUgY2hhbmdlIGlzIGFib3ZlIG9mIHRoZSByYW5nZSBhbmQgbGluZXMgYXJlIGVpdGhlclxuICAgICAgICAgIC8vIGFkZGVkIG9yIHJlbW92ZWRcbiAgICAgICAgICBuZXdJbnRhY3RSYW5nZXMucHVzaCh7XG4gICAgICAgICAgICBzdGFydDogcmFuZ2Uuc3RhcnQgKyBjaGFuZ2Uuc2NyZWVuRGVsdGEsXG4gICAgICAgICAgICBlbmQ6IHJhbmdlLmVuZCArIGNoYW5nZS5zY3JlZW5EZWx0YSxcbiAgICAgICAgICAgIG9mZnNjcmVlblJvdzogcmFuZ2Uub2Zmc2NyZWVuUm93XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmIChjaGFuZ2UuZW5kIDwgcmFuZ2Uuc3RhcnQgfHwgY2hhbmdlLnN0YXJ0ID4gcmFuZ2UuZW5kKSB7XG4gICAgICAgICAgLy8gVGhlIGNoYW5nZSBpcyBvdXRzaWRlIHRoZSByYW5nZSBidXQgZGlkbid0IGFkZFxuICAgICAgICAgIC8vIG9yIHJlbW92ZSBsaW5lc1xuICAgICAgICAgIG5ld0ludGFjdFJhbmdlcy5wdXNoKHJhbmdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBjaGFuZ2UgaXMgd2l0aGluIHRoZSByYW5nZSwgdGhlcmUncyBvbmUgaW50YWN0IHJhbmdlXG4gICAgICAgICAgLy8gZnJvbSB0aGUgcmFuZ2Ugc3RhcnQgdG8gdGhlIGNoYW5nZSBzdGFydFxuICAgICAgICAgIGlmIChjaGFuZ2Uuc3RhcnQgPiByYW5nZS5zdGFydCkge1xuICAgICAgICAgICAgbmV3SW50YWN0UmFuZ2VzLnB1c2goe1xuICAgICAgICAgICAgICBzdGFydDogcmFuZ2Uuc3RhcnQsXG4gICAgICAgICAgICAgIGVuZDogY2hhbmdlLnN0YXJ0IC0gMSxcbiAgICAgICAgICAgICAgb2Zmc2NyZWVuUm93OiByYW5nZS5vZmZzY3JlZW5Sb3dcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjaGFuZ2UuZW5kIDwgcmFuZ2UuZW5kKSB7XG4gICAgICAgICAgICAvLyBUaGUgY2hhbmdlIGVuZHMgd2l0aGluIHRoZSByYW5nZVxuICAgICAgICAgICAgaWYgKGNoYW5nZS5idWZmZXJEZWx0YSAhPT0gMCkge1xuICAgICAgICAgICAgICAvLyBMaW5lcyBhcmUgYWRkZWQgb3IgcmVtb3ZlZCwgdGhlIGludGFjdCByYW5nZSBzdGFydHMgaW4gdGhlXG4gICAgICAgICAgICAgIC8vIG5leHQgbGluZSBhZnRlciB0aGUgY2hhbmdlIGVuZCBwbHVzIHRoZSBzY3JlZW4gZGVsdGFcbiAgICAgICAgICAgICAgbmV3SW50YWN0UmFuZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBjaGFuZ2UuZW5kICsgY2hhbmdlLnNjcmVlbkRlbHRhICsgMSxcbiAgICAgICAgICAgICAgICBlbmQ6IHJhbmdlLmVuZCArIGNoYW5nZS5zY3JlZW5EZWx0YSxcbiAgICAgICAgICAgICAgICBvZmZzY3JlZW5Sb3c6IHJhbmdlLm9mZnNjcmVlblJvdyArIGNoYW5nZS5lbmQgKyAxIC0gcmFuZ2Uuc3RhcnRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hhbmdlLnNjcmVlbkRlbHRhICE9PSAwKSB7XG4gICAgICAgICAgICAgIC8vIExpbmVzIGFyZSBhZGRlZCBvciByZW1vdmVkIGluIHRoZSBkaXNwbGF5IGJ1ZmZlciwgdGhlIGludGFjdFxuICAgICAgICAgICAgICAvLyByYW5nZSBzdGFydHMgaW4gdGhlIG5leHQgbGluZSBhZnRlciB0aGUgY2hhbmdlIGVuZCBwbHVzIHRoZVxuICAgICAgICAgICAgICAvLyBzY3JlZW4gZGVsdGFcbiAgICAgICAgICAgICAgbmV3SW50YWN0UmFuZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBjaGFuZ2UuZW5kICsgY2hhbmdlLnNjcmVlbkRlbHRhICsgMSxcbiAgICAgICAgICAgICAgICBlbmQ6IHJhbmdlLmVuZCArIGNoYW5nZS5zY3JlZW5EZWx0YSxcbiAgICAgICAgICAgICAgICBvZmZzY3JlZW5Sb3c6IHJhbmdlLm9mZnNjcmVlblJvdyArIGNoYW5nZS5lbmQgKyAxIC0gcmFuZ2Uuc3RhcnRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIE5vIGxpbmVzIGFyZSBhZGRlZCwgdGhlIGludGFjdCByYW5nZSBzdGFydHMgb24gdGhlIGxpbmUgYWZ0ZXJcbiAgICAgICAgICAgICAgLy8gdGhlIGNoYW5nZSBlbmRcbiAgICAgICAgICAgICAgbmV3SW50YWN0UmFuZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBjaGFuZ2UuZW5kICsgMSxcbiAgICAgICAgICAgICAgICBlbmQ6IHJhbmdlLmVuZCxcbiAgICAgICAgICAgICAgICBvZmZzY3JlZW5Sb3c6IHJhbmdlLm9mZnNjcmVlblJvdyArIGNoYW5nZS5lbmQgKyAxIC0gcmFuZ2Uuc3RhcnRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGludGFjdFJhbmdlcyA9IG5ld0ludGFjdFJhbmdlc1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnRydW5jYXRlSW50YWN0UmFuZ2VzKGludGFjdFJhbmdlcywgZmlyc3RSb3csIGxhc3RSb3cpXG4gIH1cblxuICAvKipcbiAgICogVHJ1bmNhdGVzIHRoZSBpbnRhY3QgcmFuZ2VzIHNvIHRoYXQgdGhleSBkb2Vzbid0IGV4cGFuZCBwYXN0IHRoZSB2aXNpYmxlXG4gICAqIGFyZWEgb2YgdGhlIG1pbmltYXAuXG4gICAqXG4gICAqIEBwYXJhbSAge0FycmF5PE9iamVjdD59IGludGFjdFJhbmdlcyB0aGUgaW5pdGlhbCBhcnJheSBvZiByYW5nZXNcbiAgICogQHBhcmFtICB7bnVtYmVyfSBmaXJzdFJvdyB0aGUgZmlyc3Qgcm93IG9mIHRoZSByZW5kZXJlZCByZWdpb25cbiAgICogQHBhcmFtICB7bnVtYmVyfSBsYXN0Um93IHRoZSBsYXN0IHJvdyBvZiB0aGUgcmVuZGVyZWQgcmVnaW9uXG4gICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59IHRoZSBhcnJheSBvZiB0cnVuY2F0ZWQgcmFuZ2VzXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgdHJ1bmNhdGVJbnRhY3RSYW5nZXMgKGludGFjdFJhbmdlcywgZmlyc3RSb3csIGxhc3RSb3cpIHtcbiAgICBsZXQgaSA9IDBcbiAgICB3aGlsZSAoaSA8IGludGFjdFJhbmdlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gaW50YWN0UmFuZ2VzW2ldXG5cbiAgICAgIGlmIChyYW5nZS5zdGFydCA8IGZpcnN0Um93KSB7XG4gICAgICAgIHJhbmdlLm9mZnNjcmVlblJvdyArPSBmaXJzdFJvdyAtIHJhbmdlLnN0YXJ0XG4gICAgICAgIHJhbmdlLnN0YXJ0ID0gZmlyc3RSb3dcbiAgICAgIH1cblxuICAgICAgaWYgKHJhbmdlLmVuZCA+IGxhc3RSb3cpIHsgcmFuZ2UuZW5kID0gbGFzdFJvdyB9XG5cbiAgICAgIGlmIChyYW5nZS5zdGFydCA+PSByYW5nZS5lbmQpIHsgaW50YWN0UmFuZ2VzLnNwbGljZShpLS0sIDEpIH1cblxuICAgICAgaSsrXG4gICAgfVxuXG4gICAgcmV0dXJuIGludGFjdFJhbmdlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5vZmZzY3JlZW5Sb3cgLSBiLm9mZnNjcmVlblJvd1xuICAgIH0pXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/mixins/canvas-drawer.js

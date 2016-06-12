Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mixto = require('mixto');

var _mixto2 = _interopRequireDefault(_mixto);

var _atom = require('atom');

var _decoration2 = require('../decoration');

var _decoration3 = _interopRequireDefault(_decoration2);

/**
 * The mixin that provides the decorations API to the minimap editor
 * view.
 *
 * This mixin is injected into the `Minimap` prototype, so every methods defined
 * in this file will be available on any `Minimap` instance.
 */
'use babel';

var DecorationManagement = (function (_Mixin) {
  _inherits(DecorationManagement, _Mixin);

  function DecorationManagement() {
    _classCallCheck(this, DecorationManagement);

    _get(Object.getPrototypeOf(DecorationManagement.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DecorationManagement, [{
    key: 'initializeDecorations',

    /**
     * Initializes the decorations related properties.
     */
    value: function initializeDecorations() {
      if (this.emitter == null) {
        /**
         * The minimap emitter, lazily created if not created yet.
         * @type {Emitter}
         * @access private
         */
        this.emitter = new _atom.Emitter();
      }

      /**
       * A map with the decoration id as key and the decoration as value.
       * @type {Object}
       * @access private
       */
      this.decorationsById = {};
      /**
       * The decorations stored in an array indexed with their marker id.
       * @type {Object}
       * @access private
       */
      this.decorationsByMarkerId = {};
      /**
       * The subscriptions to the markers `did-change` event indexed using the
       * marker id.
       * @type {Object}
       * @access private
       */
      this.decorationMarkerChangedSubscriptions = {};
      /**
       * The subscriptions to the markers `did-destroy` event indexed using the
       * marker id.
       * @type {Object}
       * @access private
       */
      this.decorationMarkerDestroyedSubscriptions = {};
      /**
       * The subscriptions to the decorations `did-change-properties` event
       * indexed using the decoration id.
       * @type {Object}
       * @access private
       */
      this.decorationUpdatedSubscriptions = {};
      /**
       * The subscriptions to the decorations `did-destroy` event indexed using
       * the decoration id.
       * @type {Object}
       * @access private
       */
      this.decorationDestroyedSubscriptions = {};
    }

    /**
     * Returns all the decorations registered in the current `Minimap`.
     *
     * @return {Array<Decoration>} all the decorations in this `Minimap`
     */
  }, {
    key: 'getDecorations',
    value: function getDecorations() {
      var decorations = this.decorationsById;
      var results = [];

      for (var id in decorations) {
        results.push(decorations[id]);
      }

      return results;
    }

    /**
     * Registers an event listener to the `did-add-decoration` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidAddDecoration',
    value: function onDidAddDecoration(callback) {
      return this.emitter.on('did-add-decoration', callback);
    }

    /**
     * Registers an event listener to the `did-remove-decoration` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidRemoveDecoration',
    value: function onDidRemoveDecoration(callback) {
      return this.emitter.on('did-remove-decoration', callback);
    }

    /**
     * Registers an event listener to the `did-change-decoration` event.
     *
     * This event is triggered when the marker targeted by the decoration
     * was changed.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeDecoration',
    value: function onDidChangeDecoration(callback) {
      return this.emitter.on('did-change-decoration', callback);
    }

    /**
     * Registers an event listener to the `did-change-decoration-range` event.
     *
     * This event is triggered when the marker range targeted by the decoration
     * was changed.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeDecorationRange',
    value: function onDidChangeDecorationRange(callback) {
      return this.emitter.on('did-change-decoration-range', callback);
    }

    /**
     * Registers an event listener to the `did-update-decoration` event.
     *
     * This event is triggered when the decoration itself is modified.
     *
     * @param  {function(decoration:Decoration):void} callback a function to call
     *                                                         when the event is
     *                                                         triggered
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidUpdateDecoration',
    value: function onDidUpdateDecoration(callback) {
      return this.emitter.on('did-update-decoration', callback);
    }

    /**
     * Returns the decoration with the passed-in id.
     *
     * @param  {number} id the decoration id
     * @return {Decoration} the decoration with the given id
     */
  }, {
    key: 'decorationForId',
    value: function decorationForId(id) {
      return this.decorationsById[id];
    }

    /**
     * Returns all the decorations that intersect the passed-in row range.
     *
     * @param  {number} startScreenRow the first row of the range
     * @param  {number} endScreenRow the last row of the range
     * @return {Array<Decoration>} the decorations that intersect the passed-in
     *                             range
     */
  }, {
    key: 'decorationsForScreenRowRange',
    value: function decorationsForScreenRowRange(startScreenRow, endScreenRow) {
      var decorationsByMarkerId = {};
      var markers = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });

      for (var i = 0, len = markers.length; i < len; i++) {
        var marker = markers[i];
        var decorations = this.decorationsByMarkerId[marker.id];

        if (decorations != null) {
          decorationsByMarkerId[marker.id] = decorations;
        }
      }

      return decorationsByMarkerId;
    }

    /**
     * Returns the decorations that intersects the passed-in row range
     * in a structured way.
     *
     * At the first level, the keys are the available decoration types.
     * At the second level, the keys are the row index for which there
     * are decorations available. The value is an array containing the
     * decorations that intersects with the corresponding row.
     *
     * @return {Object} the decorations grouped by type and then rows
     * @property {Object} line all the line decorations by row
     * @property {Array<Decoration>} line[row] all the line decorations
     *                                    at a given row
     * @property {Object} highlight-under all the highlight-under decorations
     *                                    by row
     * @property {Array<Decoration>} highlight-under[row] all the highlight-under
     *                                    decorations at a given row
     * @property {Object} highlight-over all the highlight-over decorations
     *                                    by row
     * @property {Array<Decoration>} highlight-over[row] all the highlight-over
     *                                    decorations at a given row
     * @property {Object} highlight-outine all the highlight-outine decorations
     *                                    by row
     * @property {Array<Decoration>} highlight-outine[row] all the
     *                                    highlight-outine decorations at a given
     *                                    row
     */
  }, {
    key: 'decorationsByTypeThenRows',
    value: function decorationsByTypeThenRows() {
      if (this.decorationsByTypeThenRowsCache != null) {
        return this.decorationsByTypeThenRowsCache;
      }

      var cache = {};
      for (var id in this.decorationsById) {
        var decoration = this.decorationsById[id];
        var range = decoration.marker.getScreenRange();
        var type = decoration.getProperties().type;

        if (cache[type] == null) {
          cache[type] = {};
        }

        for (var row = range.start.row, len = range.end.row; row <= len; row++) {
          if (cache[type][row] == null) {
            cache[type][row] = [];
          }

          cache[type][row].push(decoration);
        }
      }

      /**
       * The grouped decorations cache.
       * @type {Object}
       * @access private
       */
      this.decorationsByTypeThenRowsCache = cache;
      return cache;
    }

    /**
     * Invalidates the decoration by screen rows cache.
     */
  }, {
    key: 'invalidateDecorationForScreenRowsCache',
    value: function invalidateDecorationForScreenRowsCache() {
      this.decorationsByTypeThenRowsCache = null;
    }

    /**
     * Adds a decoration that tracks a `Marker`. When the marker moves,
     * is invalidated, or is destroyed, the decoration will be updated to reflect
     * the marker's state.
     *
     * @param  {Marker} marker the marker you want this decoration to follow
     * @param  {Object} decorationParams the decoration properties
     * @param  {string} decorationParams.type the decoration type in the following
     *                                        list:
     * - __line__: Fills the line background with the decoration color.
     * - __highlight__: Renders a colored rectangle on the minimap. The highlight
     *   is rendered above the line's text.
     * - __highlight-over__: Same as __highlight__.
     * - __highlight-under__: Renders a colored rectangle on the minimap. The
     *   highlight is rendered below the line's text.
     * - __highlight-outline__: Renders a colored outline on the minimap. The
     *   highlight box is rendered above the line's text.
     * - __foreground-custom__: A decoration type for which you have the control
     *   over the render routine. Note that your routine should implement a render
     *   on a per-line basis to avoid any side-effect with the offset bitmap cache
     *   mechanism. These decorations are rendred on the foreground decorations
     *   layer.
     * - __background-custom__: A decoration type for which you have the control
     *   over the render routine. Note that your routine should implement a render
     *   on a per-line basis to avoid any side-effect with the offset bitmap cache
     *   mechanism. These decorations are rendred on the background decorations
     *   layer.
     * @param  {string} [decorationParams.class] the CSS class to use to retrieve
     *                                        the background color of the
     *                                        decoration by building a scop
     *                                        corresponding to
     *                                        `.minimap .editor <your-class>`
     * @param  {string} [decorationParams.scope] the scope to use to retrieve the
     *                                        decoration background. Note that if
     *                                        the `scope` property is set, the
     *                                        `class` won't be used.
     * @param  {string} [decorationParams.color] the CSS color to use to render
     *                                           the decoration. When set, neither
     *                                           `scope` nor `class` are used.
     * @param  {string} [decorationParams.plugin] the name of the plugin that
     *                                            created this decoration. It'll
     *                                            be used to order the decorations
     *                                            on the same layer and that are
     *                                            overlapping. If the parameter is
     *                                            omitted the Minimap will attempt
     *                                            to infer the plugin origin from
     *                                            the path of the caller function.
     * @param  {function} [decorationParams.render] the render routine for custom
     *                                              decorations. The function
     *                                              receives the decoration and
     *                                              the render data for the
     *                                              current render pass.
     * @return {Decoration} the created decoration
     * @emits  {did-add-decoration} when the decoration is created successfully
     * @emits  {did-change} when the decoration is created successfully
     */
  }, {
    key: 'decorateMarker',
    value: function decorateMarker(marker, decorationParams) {
      var _this = this;

      if (this.destroyed || marker == null) {
        return;
      }

      var id = marker.id;

      if (decorationParams.type === 'highlight') {
        decorationParams.type = 'highlight-over';
      }

      var type = decorationParams.type;
      var plugin = decorationParams.plugin;

      if (plugin == null) {
        decorationParams.plugin = this.getOriginatorPackageName();
      }

      if (decorationParams.scope == null && decorationParams['class'] != null) {
        var cls = decorationParams['class'].split(' ').join('.');
        decorationParams.scope = '.minimap .' + cls;
      }

      if (this.decorationMarkerDestroyedSubscriptions[id] == null) {
        this.decorationMarkerDestroyedSubscriptions[id] = marker.onDidDestroy(function () {
          _this.removeAllDecorationsForMarker(marker);
        });
      }

      if (this.decorationMarkerChangedSubscriptions[id] == null) {
        this.decorationMarkerChangedSubscriptions[id] = marker.onDidChange(function (event) {
          var decorations = _this.decorationsByMarkerId[id];

          _this.invalidateDecorationForScreenRowsCache();

          if (decorations != null) {
            for (var i = 0, len = decorations.length; i < len; i++) {
              var _decoration = decorations[i];
              _this.emitter.emit('did-change-decoration', {
                marker: marker,
                decoration: _decoration,
                event: event
              });
            }
          }
          var oldStart = event.oldTailScreenPosition;
          var oldEnd = event.oldHeadScreenPosition;
          var newStart = event.newTailScreenPosition;
          var newEnd = event.newHeadScreenPosition;

          if (oldStart.row > oldEnd.row) {
            var _ref = [oldEnd, oldStart];
            oldStart = _ref[0];
            oldEnd = _ref[1];
          }
          if (newStart.row > newEnd.row) {
            var _ref2 = [newEnd, newStart];
            newStart = _ref2[0];
            newEnd = _ref2[1];
          }

          var rangesDiffs = _this.computeRangesDiffs(oldStart, oldEnd, newStart, newEnd);

          for (var i = 0, len = rangesDiffs.length; i < len; i++) {
            var _rangesDiffs$i = _slicedToArray(rangesDiffs[i], 2);

            var start = _rangesDiffs$i[0];
            var end = _rangesDiffs$i[1];

            _this.emitRangeChanges(type, {
              start: start,
              end: end
            }, 0);
          }
        });
      }

      var decoration = new _decoration3['default'](marker, this, decorationParams);

      if (this.decorationsByMarkerId[id] == null) {
        this.decorationsByMarkerId[id] = [];
      }

      this.decorationsByMarkerId[id].push(decoration);
      this.decorationsById[decoration.id] = decoration;

      if (this.decorationUpdatedSubscriptions[decoration.id] == null) {
        this.decorationUpdatedSubscriptions[decoration.id] = decoration.onDidChangeProperties(function (event) {
          _this.emitDecorationChanges(type, decoration);
        });
      }

      this.decorationDestroyedSubscriptions[decoration.id] = decoration.onDidDestroy(function () {
        _this.removeDecoration(decoration);
      });

      this.emitDecorationChanges(type, decoration);
      this.emitter.emit('did-add-decoration', {
        marker: marker,
        decoration: decoration
      });

      return decoration;
    }
  }, {
    key: 'getOriginatorPackageName',
    value: function getOriginatorPackageName() {
      var line = new Error().stack.split('\n')[3];
      var filePath = line.split('(')[1].replace(')', '');
      var re = new RegExp(atom.packages.getPackageDirPaths().join('|') + _underscorePlus2['default'].escapeRegExp(_path2['default'].sep));
      var plugin = filePath.replace(re, '').split(_path2['default'].sep)[0].replace(/minimap-|-minimap/, '');
      return plugin.indexOf(_path2['default'].sep) < 0 ? plugin : undefined;
    }

    /**
     * Given two ranges, it returns an array of ranges representing the
     * differences between them.
     *
     * @param  {number} oldStart the row index of the first range start
     * @param  {number} oldEnd the row index of the first range end
     * @param  {number} newStart the row index of the second range start
     * @param  {number} newEnd the row index of the second range end
     * @return {Array<Object>} the array of diff ranges
     * @access private
     */
  }, {
    key: 'computeRangesDiffs',
    value: function computeRangesDiffs(oldStart, oldEnd, newStart, newEnd) {
      var diffs = [];

      if (oldStart.isLessThan(newStart)) {
        diffs.push([oldStart, newStart]);
      } else if (newStart.isLessThan(oldStart)) {
        diffs.push([newStart, oldStart]);
      }

      if (oldEnd.isLessThan(newEnd)) {
        diffs.push([oldEnd, newEnd]);
      } else if (newEnd.isLessThan(oldEnd)) {
        diffs.push([newEnd, oldEnd]);
      }

      return diffs;
    }

    /**
     * Emits a change in the `Minimap` corresponding to the
     * passed-in decoration.
     *
     * @param  {string} type the type of decoration that changed
     * @param  {Decoration} decoration the decoration for which emitting an event
     * @access private
     */
  }, {
    key: 'emitDecorationChanges',
    value: function emitDecorationChanges(type, decoration) {
      if (!this.textEditor || this.textEditor.isDestroyed()) {
        return;
      }

      this.invalidateDecorationForScreenRowsCache();

      var range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }

      this.emitRangeChanges(type, range, 0);
    }

    /**
     * Emits a change for the specified range.
     *
     * @param  {string} type the type of decoration that changed
     * @param  {Object} range the range where changes occured
     * @param  {number} [screenDelta] an optional screen delta for the
     *                                change object
     * @access private
     */
  }, {
    key: 'emitRangeChanges',
    value: function emitRangeChanges(type, range, screenDelta) {
      var startScreenRow = range.start.row;
      var endScreenRow = range.end.row;
      var lastRenderedScreenRow = this.getLastVisibleScreenRow();
      var firstRenderedScreenRow = this.getFirstVisibleScreenRow();

      if (screenDelta == null) {
        screenDelta = lastRenderedScreenRow - firstRenderedScreenRow - (endScreenRow - startScreenRow);
      }

      var changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta,
        type: type
      };

      this.emitter.emit('did-change-decoration-range', changeEvent);
    }

    /**
     * Removes a `Decoration` from this minimap.
     *
     * @param  {Decoration} decoration the decoration to remove
     * @emits  {did-change} when the decoration is removed
     * @emits  {did-remove-decoration} when the decoration is removed
     */
  }, {
    key: 'removeDecoration',
    value: function removeDecoration(decoration) {
      if (decoration == null) {
        return;
      }

      var marker = decoration.marker;
      var subscription = undefined;

      delete this.decorationsById[decoration.id];

      subscription = this.decorationUpdatedSubscriptions[decoration.id];
      if (subscription != null) {
        subscription.dispose();
      }

      subscription = this.decorationDestroyedSubscriptions[decoration.id];
      if (subscription != null) {
        subscription.dispose();
      }

      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];

      var decorations = this.decorationsByMarkerId[marker.id];
      if (!decorations) {
        return;
      }

      this.emitDecorationChanges(decoration.getProperties().type, decoration);

      var index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);

        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });

        if (decorations.length === 0) {
          this.removedAllMarkerDecorations(marker);
        }
      }
    }

    /**
     * Removes all the decorations registered for the passed-in marker.
     *
     * @param  {Marker} marker the marker for which removing its decorations
     * @emits  {did-change} when a decoration have been removed
     * @emits  {did-remove-decoration} when a decoration have been removed
     */
  }, {
    key: 'removeAllDecorationsForMarker',
    value: function removeAllDecorationsForMarker(marker) {
      if (marker == null) {
        return;
      }

      var decorations = this.decorationsByMarkerId[marker.id];
      if (!decorations) {
        return;
      }

      for (var i = 0, len = decorations.length; i < len; i++) {
        var decoration = decorations[i];

        this.emitDecorationChanges(decoration.getProperties().type, decoration);
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
      }

      this.removedAllMarkerDecorations(marker);
    }

    /**
     * Performs the removal of a decoration for a given marker.
     *
     * @param  {Marker} marker the marker for which removing decorations
     * @access private
     */
  }, {
    key: 'removedAllMarkerDecorations',
    value: function removedAllMarkerDecorations(marker) {
      if (marker == null) {
        return;
      }

      this.decorationMarkerChangedSubscriptions[marker.id].dispose();
      this.decorationMarkerDestroyedSubscriptions[marker.id].dispose();

      delete this.decorationsByMarkerId[marker.id];
      delete this.decorationMarkerChangedSubscriptions[marker.id];
      delete this.decorationMarkerDestroyedSubscriptions[marker.id];
    }

    /**
     * Removes all the decorations that was created in the current `Minimap`.
     */
  }, {
    key: 'removeAllDecorations',
    value: function removeAllDecorations() {
      for (var id in this.decorationMarkerChangedSubscriptions) {
        this.decorationMarkerChangedSubscriptions[id].dispose();
      }

      for (var id in this.decorationMarkerDestroyedSubscriptions) {
        this.decorationMarkerDestroyedSubscriptions[id].dispose();
      }

      for (var id in this.decorationUpdatedSubscriptions) {
        this.decorationUpdatedSubscriptions[id].dispose();
      }

      for (var id in this.decorationDestroyedSubscriptions) {
        this.decorationDestroyedSubscriptions[id].dispose();
      }

      for (var id in this.decorationsById) {
        this.decorationsById[id].destroy();
      }

      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      this.decorationDestroyedSubscriptions = {};
    }
  }]);

  return DecorationManagement;
})(_mixto2['default']);

exports['default'] = DecorationManagement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21peGlucy9kZWNvcmF0aW9uLW1hbmFnZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFFYyxpQkFBaUI7Ozs7b0JBQ2QsTUFBTTs7OztxQkFDTCxPQUFPOzs7O29CQUNILE1BQU07OzJCQUNMLGVBQWU7Ozs7Ozs7Ozs7O0FBTnRDLFdBQVcsQ0FBQTs7SUFlVSxvQkFBb0I7WUFBcEIsb0JBQW9COztXQUFwQixvQkFBb0I7MEJBQXBCLG9CQUFvQjs7K0JBQXBCLG9CQUFvQjs7O2VBQXBCLG9CQUFvQjs7Ozs7O1dBS2pCLGlDQUFHO0FBQ3ZCLFVBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUU7Ozs7OztBQU14QixZQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7T0FDN0I7Ozs7Ozs7QUFPRCxVQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQTs7Ozs7O0FBTXpCLFVBQUksQ0FBQyxxQkFBcUIsR0FBRyxFQUFFLENBQUE7Ozs7Ozs7QUFPL0IsVUFBSSxDQUFDLG9DQUFvQyxHQUFHLEVBQUUsQ0FBQTs7Ozs7OztBQU85QyxVQUFJLENBQUMsc0NBQXNDLEdBQUcsRUFBRSxDQUFBOzs7Ozs7O0FBT2hELFVBQUksQ0FBQyw4QkFBOEIsR0FBRyxFQUFFLENBQUE7Ozs7Ozs7QUFPeEMsVUFBSSxDQUFDLGdDQUFnQyxHQUFHLEVBQUUsQ0FBQTtLQUMzQzs7Ozs7Ozs7O1dBT2MsMEJBQUc7QUFDaEIsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQTtBQUN0QyxVQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7O0FBRWhCLFdBQUssSUFBSSxFQUFFLElBQUksV0FBVyxFQUFFO0FBQUUsZUFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtPQUFFOztBQUU3RCxhQUFPLE9BQU8sQ0FB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QUFBO0FBQy9CLFVBQUksQ0FBQyxvQ0FBb0MsR0FBRyxFQUFFLENBQUE7QUFDOUMsVUFBSSxDQUFDLHNDQUFzQyxHQUFHLEVBQUUsQ0FBQTtBQUNoRCxVQUFJLENBQUMsOEJBQThCLEdBQUcsRUFBRSxDQUFBO0FBQ3hDLFVBQUksQ0FBQyxnQ0FBZ0MsR0FBRyxFQUFFLENBQUE7S0FDM0M7OztTQXhtQmtCLG9CQUFvQjs7O3FCQUFwQixvQkFBb0IiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWl4aW5zL2RlY29yYXRpb24tbWFuYWdlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgTWl4aW4gZnJvbSAnbWl4dG8nXG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2F0b20nXG5pbXBvcnQgRGVjb3JhdGlvbiBmcm9tICcuLi9kZWNvcmF0aW9uJ1xuXG4vKipcbiAqIFRoZSBtaXhpbiB0aGF0IHByb3ZpZGVzIHRoZSBkZWNvcmF0aW9ucyBBUEkgdG8gdGhlIG1pbmltYXAgZWRpdG9yXG4gKiB2aWV3LlxuICpcbiAqIFRoaXMgbWl4aW4gaXMgaW5qZWN0ZWQgaW50byB0aGUgYE1pbmltYXBgIHByb3RvdHlwZSwgc28gZXZlcnkgbWV0aG9kcyBkZWZpbmVkXG4gKiBpbiB0aGlzIGZpbGUgd2lsbCBiZSBhdmFpbGFibGUgb24gYW55IGBNaW5pbWFwYCBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVjb3JhdGlvbk1hbmFnZW1lbnQgZXh0ZW5kcyBNaXhpbiB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBkZWNvcmF0aW9ucyByZWxhdGVkIHByb3BlcnRpZXMuXG4gICAqL1xuICBpbml0aWFsaXplRGVjb3JhdGlvbnMgKCkge1xuICAgIGlmICh0aGlzLmVtaXR0ZXIgPT0gbnVsbCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbWluaW1hcCBlbWl0dGVyLCBsYXppbHkgY3JlYXRlZCBpZiBub3QgY3JlYXRlZCB5ZXQuXG4gICAgICAgKiBAdHlwZSB7RW1pdHRlcn1cbiAgICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAgICovXG4gICAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBtYXAgd2l0aCB0aGUgZGVjb3JhdGlvbiBpZCBhcyBrZXkgYW5kIHRoZSBkZWNvcmF0aW9uIGFzIHZhbHVlLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZWNvcmF0aW9uc0J5SWQgPSB7fVxuICAgIC8qKlxuICAgICAqIFRoZSBkZWNvcmF0aW9ucyBzdG9yZWQgaW4gYW4gYXJyYXkgaW5kZXhlZCB3aXRoIHRoZWlyIG1hcmtlciBpZC5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkID0ge31cbiAgICAvKipcbiAgICAgKiBUaGUgc3Vic2NyaXB0aW9ucyB0byB0aGUgbWFya2VycyBgZGlkLWNoYW5nZWAgZXZlbnQgaW5kZXhlZCB1c2luZyB0aGVcbiAgICAgKiBtYXJrZXIgaWQuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRlY29yYXRpb25NYXJrZXJDaGFuZ2VkU3Vic2NyaXB0aW9ucyA9IHt9XG4gICAgLyoqXG4gICAgICogVGhlIHN1YnNjcmlwdGlvbnMgdG8gdGhlIG1hcmtlcnMgYGRpZC1kZXN0cm95YCBldmVudCBpbmRleGVkIHVzaW5nIHRoZVxuICAgICAqIG1hcmtlciBpZC5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVjb3JhdGlvbk1hcmtlckRlc3Ryb3llZFN1YnNjcmlwdGlvbnMgPSB7fVxuICAgIC8qKlxuICAgICAqIFRoZSBzdWJzY3JpcHRpb25zIHRvIHRoZSBkZWNvcmF0aW9ucyBgZGlkLWNoYW5nZS1wcm9wZXJ0aWVzYCBldmVudFxuICAgICAqIGluZGV4ZWQgdXNpbmcgdGhlIGRlY29yYXRpb24gaWQuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRlY29yYXRpb25VcGRhdGVkU3Vic2NyaXB0aW9ucyA9IHt9XG4gICAgLyoqXG4gICAgICogVGhlIHN1YnNjcmlwdGlvbnMgdG8gdGhlIGRlY29yYXRpb25zIGBkaWQtZGVzdHJveWAgZXZlbnQgaW5kZXhlZCB1c2luZ1xuICAgICAqIHRoZSBkZWNvcmF0aW9uIGlkLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZWNvcmF0aW9uRGVzdHJveWVkU3Vic2NyaXB0aW9ucyA9IHt9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbGwgdGhlIGRlY29yYXRpb25zIHJlZ2lzdGVyZWQgaW4gdGhlIGN1cnJlbnQgYE1pbmltYXBgLlxuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheTxEZWNvcmF0aW9uPn0gYWxsIHRoZSBkZWNvcmF0aW9ucyBpbiB0aGlzIGBNaW5pbWFwYFxuICAgKi9cbiAgZ2V0RGVjb3JhdGlvbnMgKCkge1xuICAgIGxldCBkZWNvcmF0aW9ucyA9IHRoaXMuZGVjb3JhdGlvbnNCeUlkXG4gICAgbGV0IHJlc3VsdHMgPSBbXVxuXG4gICAgZm9yIChsZXQgaWQgaW4gZGVjb3JhdGlvbnMpIHsgcmVzdWx0cy5wdXNoKGRlY29yYXRpb25zW2lkXSkgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtYWRkLWRlY29yYXRpb25gIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIGFuIGV2ZW50IG9iamVjdCB3aXRoXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gbWFya2VyOiB0aGUgbWFya2VyIG9iamVjdCB0aGF0IHdhcyBkZWNvcmF0ZWRcbiAgICogLSBkZWNvcmF0aW9uOiB0aGUgZGVjb3JhdGlvbiBvYmplY3QgdGhhdCB3YXMgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZEFkZERlY29yYXRpb24gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWFkZC1kZWNvcmF0aW9uJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLXJlbW92ZS1kZWNvcmF0aW9uYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCBhbiBldmVudCBvYmplY3Qgd2l0aFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIG1hcmtlcjogdGhlIG1hcmtlciBvYmplY3QgdGhhdCB3YXMgZGVjb3JhdGVkXG4gICAqIC0gZGVjb3JhdGlvbjogdGhlIGRlY29yYXRpb24gb2JqZWN0IHRoYXQgd2FzIGNyZWF0ZWRcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRSZW1vdmVEZWNvcmF0aW9uIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1yZW1vdmUtZGVjb3JhdGlvbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2UtZGVjb3JhdGlvbmAgZXZlbnQuXG4gICAqXG4gICAqIFRoaXMgZXZlbnQgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIG1hcmtlciB0YXJnZXRlZCBieSB0aGUgZGVjb3JhdGlvblxuICAgKiB3YXMgY2hhbmdlZC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCBhbiBldmVudCBvYmplY3Qgd2l0aFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIG1hcmtlcjogdGhlIG1hcmtlciBvYmplY3QgdGhhdCB3YXMgZGVjb3JhdGVkXG4gICAqIC0gZGVjb3JhdGlvbjogdGhlIGRlY29yYXRpb24gb2JqZWN0IHRoYXQgd2FzIGNyZWF0ZWRcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VEZWNvcmF0aW9uIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtZGVjb3JhdGlvbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2UtZGVjb3JhdGlvbi1yYW5nZWAgZXZlbnQuXG4gICAqXG4gICAqIFRoaXMgZXZlbnQgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIG1hcmtlciByYW5nZSB0YXJnZXRlZCBieSB0aGUgZGVjb3JhdGlvblxuICAgKiB3YXMgY2hhbmdlZC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCBhbiBldmVudCBvYmplY3Qgd2l0aFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIG1hcmtlcjogdGhlIG1hcmtlciBvYmplY3QgdGhhdCB3YXMgZGVjb3JhdGVkXG4gICAqIC0gZGVjb3JhdGlvbjogdGhlIGRlY29yYXRpb24gb2JqZWN0IHRoYXQgd2FzIGNyZWF0ZWRcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VEZWNvcmF0aW9uUmFuZ2UgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1kZWNvcmF0aW9uLXJhbmdlJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLXVwZGF0ZS1kZWNvcmF0aW9uYCBldmVudC5cbiAgICpcbiAgICogVGhpcyBldmVudCBpcyB0cmlnZ2VyZWQgd2hlbiB0aGUgZGVjb3JhdGlvbiBpdHNlbGYgaXMgbW9kaWZpZWQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGRlY29yYXRpb246RGVjb3JhdGlvbik6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiB0aGUgZXZlbnQgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyZWRcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRVcGRhdGVEZWNvcmF0aW9uIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtZGVjb3JhdGlvbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlY29yYXRpb24gd2l0aCB0aGUgcGFzc2VkLWluIGlkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGlkIHRoZSBkZWNvcmF0aW9uIGlkXG4gICAqIEByZXR1cm4ge0RlY29yYXRpb259IHRoZSBkZWNvcmF0aW9uIHdpdGggdGhlIGdpdmVuIGlkXG4gICAqL1xuICBkZWNvcmF0aW9uRm9ySWQgKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVjb3JhdGlvbnNCeUlkW2lkXVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIHRoZSBkZWNvcmF0aW9ucyB0aGF0IGludGVyc2VjdCB0aGUgcGFzc2VkLWluIHJvdyByYW5nZS5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSBzdGFydFNjcmVlblJvdyB0aGUgZmlyc3Qgcm93IG9mIHRoZSByYW5nZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGVuZFNjcmVlblJvdyB0aGUgbGFzdCByb3cgb2YgdGhlIHJhbmdlXG4gICAqIEByZXR1cm4ge0FycmF5PERlY29yYXRpb24+fSB0aGUgZGVjb3JhdGlvbnMgdGhhdCBpbnRlcnNlY3QgdGhlIHBhc3NlZC1pblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2VcbiAgICovXG4gIGRlY29yYXRpb25zRm9yU2NyZWVuUm93UmFuZ2UgKHN0YXJ0U2NyZWVuUm93LCBlbmRTY3JlZW5Sb3cpIHtcbiAgICBsZXQgZGVjb3JhdGlvbnNCeU1hcmtlcklkID0ge31cbiAgICBsZXQgbWFya2VycyA9IHRoaXMuZmluZE1hcmtlcnMoe1xuICAgICAgaW50ZXJzZWN0c1NjcmVlblJvd1JhbmdlOiBbc3RhcnRTY3JlZW5Sb3csIGVuZFNjcmVlblJvd11cbiAgICB9KVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG1hcmtlcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBtYXJrZXIgPSBtYXJrZXJzW2ldXG4gICAgICBsZXQgZGVjb3JhdGlvbnMgPSB0aGlzLmRlY29yYXRpb25zQnlNYXJrZXJJZFttYXJrZXIuaWRdXG5cbiAgICAgIGlmIChkZWNvcmF0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgIGRlY29yYXRpb25zQnlNYXJrZXJJZFttYXJrZXIuaWRdID0gZGVjb3JhdGlvbnNcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVjb3JhdGlvbnNCeU1hcmtlcklkXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGVjb3JhdGlvbnMgdGhhdCBpbnRlcnNlY3RzIHRoZSBwYXNzZWQtaW4gcm93IHJhbmdlXG4gICAqIGluIGEgc3RydWN0dXJlZCB3YXkuXG4gICAqXG4gICAqIEF0IHRoZSBmaXJzdCBsZXZlbCwgdGhlIGtleXMgYXJlIHRoZSBhdmFpbGFibGUgZGVjb3JhdGlvbiB0eXBlcy5cbiAgICogQXQgdGhlIHNlY29uZCBsZXZlbCwgdGhlIGtleXMgYXJlIHRoZSByb3cgaW5kZXggZm9yIHdoaWNoIHRoZXJlXG4gICAqIGFyZSBkZWNvcmF0aW9ucyBhdmFpbGFibGUuIFRoZSB2YWx1ZSBpcyBhbiBhcnJheSBjb250YWluaW5nIHRoZVxuICAgKiBkZWNvcmF0aW9ucyB0aGF0IGludGVyc2VjdHMgd2l0aCB0aGUgY29ycmVzcG9uZGluZyByb3cuXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gdGhlIGRlY29yYXRpb25zIGdyb3VwZWQgYnkgdHlwZSBhbmQgdGhlbiByb3dzXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsaW5lIGFsbCB0aGUgbGluZSBkZWNvcmF0aW9ucyBieSByb3dcbiAgICogQHByb3BlcnR5IHtBcnJheTxEZWNvcmF0aW9uPn0gbGluZVtyb3ddIGFsbCB0aGUgbGluZSBkZWNvcmF0aW9uc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0IGEgZ2l2ZW4gcm93XG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoaWdobGlnaHQtdW5kZXIgYWxsIHRoZSBoaWdobGlnaHQtdW5kZXIgZGVjb3JhdGlvbnNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieSByb3dcbiAgICogQHByb3BlcnR5IHtBcnJheTxEZWNvcmF0aW9uPn0gaGlnaGxpZ2h0LXVuZGVyW3Jvd10gYWxsIHRoZSBoaWdobGlnaHQtdW5kZXJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNvcmF0aW9ucyBhdCBhIGdpdmVuIHJvd1xuICAgKiBAcHJvcGVydHkge09iamVjdH0gaGlnaGxpZ2h0LW92ZXIgYWxsIHRoZSBoaWdobGlnaHQtb3ZlciBkZWNvcmF0aW9uc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IHJvd1xuICAgKiBAcHJvcGVydHkge0FycmF5PERlY29yYXRpb24+fSBoaWdobGlnaHQtb3Zlcltyb3ddIGFsbCB0aGUgaGlnaGxpZ2h0LW92ZXJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNvcmF0aW9ucyBhdCBhIGdpdmVuIHJvd1xuICAgKiBAcHJvcGVydHkge09iamVjdH0gaGlnaGxpZ2h0LW91dGluZSBhbGwgdGhlIGhpZ2hsaWdodC1vdXRpbmUgZGVjb3JhdGlvbnNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieSByb3dcbiAgICogQHByb3BlcnR5IHtBcnJheTxEZWNvcmF0aW9uPn0gaGlnaGxpZ2h0LW91dGluZVtyb3ddIGFsbCB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHQtb3V0aW5lIGRlY29yYXRpb25zIGF0IGEgZ2l2ZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dcbiAgICovXG4gIGRlY29yYXRpb25zQnlUeXBlVGhlblJvd3MgKCkge1xuICAgIGlmICh0aGlzLmRlY29yYXRpb25zQnlUeXBlVGhlblJvd3NDYWNoZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWNvcmF0aW9uc0J5VHlwZVRoZW5Sb3dzQ2FjaGVcbiAgICB9XG5cbiAgICBsZXQgY2FjaGUgPSB7fVxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuZGVjb3JhdGlvbnNCeUlkKSB7XG4gICAgICBsZXQgZGVjb3JhdGlvbiA9IHRoaXMuZGVjb3JhdGlvbnNCeUlkW2lkXVxuICAgICAgbGV0IHJhbmdlID0gZGVjb3JhdGlvbi5tYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKVxuICAgICAgbGV0IHR5cGUgPSBkZWNvcmF0aW9uLmdldFByb3BlcnRpZXMoKS50eXBlXG5cbiAgICAgIGlmIChjYWNoZVt0eXBlXSA9PSBudWxsKSB7IGNhY2hlW3R5cGVdID0ge30gfVxuXG4gICAgICBmb3IgKGxldCByb3cgPSByYW5nZS5zdGFydC5yb3csIGxlbiA9IHJhbmdlLmVuZC5yb3c7IHJvdyA8PSBsZW47IHJvdysrKSB7XG4gICAgICAgIGlmIChjYWNoZVt0eXBlXVtyb3ddID09IG51bGwpIHsgY2FjaGVbdHlwZV1bcm93XSA9IFtdIH1cblxuICAgICAgICBjYWNoZVt0eXBlXVtyb3ddLnB1c2goZGVjb3JhdGlvbilcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZ3JvdXBlZCBkZWNvcmF0aW9ucyBjYWNoZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93c0NhY2hlID0gY2FjaGVcbiAgICByZXR1cm4gY2FjaGVcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZhbGlkYXRlcyB0aGUgZGVjb3JhdGlvbiBieSBzY3JlZW4gcm93cyBjYWNoZS5cbiAgICovXG4gIGludmFsaWRhdGVEZWNvcmF0aW9uRm9yU2NyZWVuUm93c0NhY2hlICgpIHtcbiAgICB0aGlzLmRlY29yYXRpb25zQnlUeXBlVGhlblJvd3NDYWNoZSA9IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgZGVjb3JhdGlvbiB0aGF0IHRyYWNrcyBhIGBNYXJrZXJgLiBXaGVuIHRoZSBtYXJrZXIgbW92ZXMsXG4gICAqIGlzIGludmFsaWRhdGVkLCBvciBpcyBkZXN0cm95ZWQsIHRoZSBkZWNvcmF0aW9uIHdpbGwgYmUgdXBkYXRlZCB0byByZWZsZWN0XG4gICAqIHRoZSBtYXJrZXIncyBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtICB7TWFya2VyfSBtYXJrZXIgdGhlIG1hcmtlciB5b3Ugd2FudCB0aGlzIGRlY29yYXRpb24gdG8gZm9sbG93XG4gICAqIEBwYXJhbSAge09iamVjdH0gZGVjb3JhdGlvblBhcmFtcyB0aGUgZGVjb3JhdGlvbiBwcm9wZXJ0aWVzXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZGVjb3JhdGlvblBhcmFtcy50eXBlIHRoZSBkZWNvcmF0aW9uIHR5cGUgaW4gdGhlIGZvbGxvd2luZ1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OlxuICAgKiAtIF9fbGluZV9fOiBGaWxscyB0aGUgbGluZSBiYWNrZ3JvdW5kIHdpdGggdGhlIGRlY29yYXRpb24gY29sb3IuXG4gICAqIC0gX19oaWdobGlnaHRfXzogUmVuZGVycyBhIGNvbG9yZWQgcmVjdGFuZ2xlIG9uIHRoZSBtaW5pbWFwLiBUaGUgaGlnaGxpZ2h0XG4gICAqICAgaXMgcmVuZGVyZWQgYWJvdmUgdGhlIGxpbmUncyB0ZXh0LlxuICAgKiAtIF9faGlnaGxpZ2h0LW92ZXJfXzogU2FtZSBhcyBfX2hpZ2hsaWdodF9fLlxuICAgKiAtIF9faGlnaGxpZ2h0LXVuZGVyX186IFJlbmRlcnMgYSBjb2xvcmVkIHJlY3RhbmdsZSBvbiB0aGUgbWluaW1hcC4gVGhlXG4gICAqICAgaGlnaGxpZ2h0IGlzIHJlbmRlcmVkIGJlbG93IHRoZSBsaW5lJ3MgdGV4dC5cbiAgICogLSBfX2hpZ2hsaWdodC1vdXRsaW5lX186IFJlbmRlcnMgYSBjb2xvcmVkIG91dGxpbmUgb24gdGhlIG1pbmltYXAuIFRoZVxuICAgKiAgIGhpZ2hsaWdodCBib3ggaXMgcmVuZGVyZWQgYWJvdmUgdGhlIGxpbmUncyB0ZXh0LlxuICAgKiAtIF9fZm9yZWdyb3VuZC1jdXN0b21fXzogQSBkZWNvcmF0aW9uIHR5cGUgZm9yIHdoaWNoIHlvdSBoYXZlIHRoZSBjb250cm9sXG4gICAqICAgb3ZlciB0aGUgcmVuZGVyIHJvdXRpbmUuIE5vdGUgdGhhdCB5b3VyIHJvdXRpbmUgc2hvdWxkIGltcGxlbWVudCBhIHJlbmRlclxuICAgKiAgIG9uIGEgcGVyLWxpbmUgYmFzaXMgdG8gYXZvaWQgYW55IHNpZGUtZWZmZWN0IHdpdGggdGhlIG9mZnNldCBiaXRtYXAgY2FjaGVcbiAgICogICBtZWNoYW5pc20uIFRoZXNlIGRlY29yYXRpb25zIGFyZSByZW5kcmVkIG9uIHRoZSBmb3JlZ3JvdW5kIGRlY29yYXRpb25zXG4gICAqICAgbGF5ZXIuXG4gICAqIC0gX19iYWNrZ3JvdW5kLWN1c3RvbV9fOiBBIGRlY29yYXRpb24gdHlwZSBmb3Igd2hpY2ggeW91IGhhdmUgdGhlIGNvbnRyb2xcbiAgICogICBvdmVyIHRoZSByZW5kZXIgcm91dGluZS4gTm90ZSB0aGF0IHlvdXIgcm91dGluZSBzaG91bGQgaW1wbGVtZW50IGEgcmVuZGVyXG4gICAqICAgb24gYSBwZXItbGluZSBiYXNpcyB0byBhdm9pZCBhbnkgc2lkZS1lZmZlY3Qgd2l0aCB0aGUgb2Zmc2V0IGJpdG1hcCBjYWNoZVxuICAgKiAgIG1lY2hhbmlzbS4gVGhlc2UgZGVjb3JhdGlvbnMgYXJlIHJlbmRyZWQgb24gdGhlIGJhY2tncm91bmQgZGVjb3JhdGlvbnNcbiAgICogICBsYXllci5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBbZGVjb3JhdGlvblBhcmFtcy5jbGFzc10gdGhlIENTUyBjbGFzcyB0byB1c2UgdG8gcmV0cmlldmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGJhY2tncm91bmQgY29sb3Igb2YgdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY29yYXRpb24gYnkgYnVpbGRpbmcgYSBzY29wXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcnJlc3BvbmRpbmcgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYC5taW5pbWFwIC5lZGl0b3IgPHlvdXItY2xhc3M+YFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFtkZWNvcmF0aW9uUGFyYW1zLnNjb3BlXSB0aGUgc2NvcGUgdG8gdXNlIHRvIHJldHJpZXZlIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNvcmF0aW9uIGJhY2tncm91bmQuIE5vdGUgdGhhdCBpZlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgYHNjb3BlYCBwcm9wZXJ0eSBpcyBzZXQsIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgY2xhc3NgIHdvbid0IGJlIHVzZWQuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gW2RlY29yYXRpb25QYXJhbXMuY29sb3JdIHRoZSBDU1MgY29sb3IgdG8gdXNlIHRvIHJlbmRlclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZGVjb3JhdGlvbi4gV2hlbiBzZXQsIG5laXRoZXJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHNjb3BlYCBub3IgYGNsYXNzYCBhcmUgdXNlZC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBbZGVjb3JhdGlvblBhcmFtcy5wbHVnaW5dIHRoZSBuYW1lIG9mIHRoZSBwbHVnaW4gdGhhdFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZCB0aGlzIGRlY29yYXRpb24uIEl0J2xsXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZSB1c2VkIHRvIG9yZGVyIHRoZSBkZWNvcmF0aW9uc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gdGhlIHNhbWUgbGF5ZXIgYW5kIHRoYXQgYXJlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVybGFwcGluZy4gSWYgdGhlIHBhcmFtZXRlciBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb21pdHRlZCB0aGUgTWluaW1hcCB3aWxsIGF0dGVtcHRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGluZmVyIHRoZSBwbHVnaW4gb3JpZ2luIGZyb21cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBwYXRoIG9mIHRoZSBjYWxsZXIgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9ufSBbZGVjb3JhdGlvblBhcmFtcy5yZW5kZXJdIHRoZSByZW5kZXIgcm91dGluZSBmb3IgY3VzdG9tXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY29yYXRpb25zLiBUaGUgZnVuY3Rpb25cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZXMgdGhlIGRlY29yYXRpb24gYW5kXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByZW5kZXIgZGF0YSBmb3IgdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgcmVuZGVyIHBhc3MuXG4gICAqIEByZXR1cm4ge0RlY29yYXRpb259IHRoZSBjcmVhdGVkIGRlY29yYXRpb25cbiAgICogQGVtaXRzICB7ZGlkLWFkZC1kZWNvcmF0aW9ufSB3aGVuIHRoZSBkZWNvcmF0aW9uIGlzIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XG4gICAqIEBlbWl0cyAge2RpZC1jaGFuZ2V9IHdoZW4gdGhlIGRlY29yYXRpb24gaXMgY3JlYXRlZCBzdWNjZXNzZnVsbHlcbiAgICovXG4gIGRlY29yYXRlTWFya2VyIChtYXJrZXIsIGRlY29yYXRpb25QYXJhbXMpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQgfHwgbWFya2VyID09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgIGxldCB7aWR9ID0gbWFya2VyXG5cbiAgICBpZiAoZGVjb3JhdGlvblBhcmFtcy50eXBlID09PSAnaGlnaGxpZ2h0Jykge1xuICAgICAgZGVjb3JhdGlvblBhcmFtcy50eXBlID0gJ2hpZ2hsaWdodC1vdmVyJ1xuICAgIH1cblxuICAgIGNvbnN0IHt0eXBlLCBwbHVnaW59ID0gZGVjb3JhdGlvblBhcmFtc1xuXG4gICAgaWYgKHBsdWdpbiA9PSBudWxsKSB7XG4gICAgICBkZWNvcmF0aW9uUGFyYW1zLnBsdWdpbiA9IHRoaXMuZ2V0T3JpZ2luYXRvclBhY2thZ2VOYW1lKClcbiAgICB9XG5cbiAgICBpZiAoZGVjb3JhdGlvblBhcmFtcy5zY29wZSA9PSBudWxsICYmIGRlY29yYXRpb25QYXJhbXNbJ2NsYXNzJ10gIT0gbnVsbCkge1xuICAgICAgbGV0IGNscyA9IGRlY29yYXRpb25QYXJhbXNbJ2NsYXNzJ10uc3BsaXQoJyAnKS5qb2luKCcuJylcbiAgICAgIGRlY29yYXRpb25QYXJhbXMuc2NvcGUgPSBgLm1pbmltYXAgLiR7Y2xzfWBcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWNvcmF0aW9uTWFya2VyRGVzdHJveWVkU3Vic2NyaXB0aW9uc1tpZF0gPT0gbnVsbCkge1xuICAgICAgdGhpcy5kZWNvcmF0aW9uTWFya2VyRGVzdHJveWVkU3Vic2NyaXB0aW9uc1tpZF0gPVxuICAgICAgbWFya2VyLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVtb3ZlQWxsRGVjb3JhdGlvbnNGb3JNYXJrZXIobWFya2VyKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWNvcmF0aW9uTWFya2VyQ2hhbmdlZFN1YnNjcmlwdGlvbnNbaWRdID09IG51bGwpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGlvbk1hcmtlckNoYW5nZWRTdWJzY3JpcHRpb25zW2lkXSA9XG4gICAgICBtYXJrZXIub25EaWRDaGFuZ2UoKGV2ZW50KSA9PiB7XG4gICAgICAgIGxldCBkZWNvcmF0aW9ucyA9IHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkW2lkXVxuXG4gICAgICAgIHRoaXMuaW52YWxpZGF0ZURlY29yYXRpb25Gb3JTY3JlZW5Sb3dzQ2FjaGUoKVxuXG4gICAgICAgIGlmIChkZWNvcmF0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGRlY29yYXRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGVjb3JhdGlvbiA9IGRlY29yYXRpb25zW2ldXG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1kZWNvcmF0aW9uJywge1xuICAgICAgICAgICAgICBtYXJrZXI6IG1hcmtlcixcbiAgICAgICAgICAgICAgZGVjb3JhdGlvbjogZGVjb3JhdGlvbixcbiAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgb2xkU3RhcnQgPSBldmVudC5vbGRUYWlsU2NyZWVuUG9zaXRpb25cbiAgICAgICAgbGV0IG9sZEVuZCA9IGV2ZW50Lm9sZEhlYWRTY3JlZW5Qb3NpdGlvblxuICAgICAgICBsZXQgbmV3U3RhcnQgPSBldmVudC5uZXdUYWlsU2NyZWVuUG9zaXRpb25cbiAgICAgICAgbGV0IG5ld0VuZCA9IGV2ZW50Lm5ld0hlYWRTY3JlZW5Qb3NpdGlvblxuXG4gICAgICAgIGlmIChvbGRTdGFydC5yb3cgPiBvbGRFbmQucm93KSB7XG4gICAgICAgICAgW29sZFN0YXJ0LCBvbGRFbmRdID0gW29sZEVuZCwgb2xkU3RhcnRdXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld1N0YXJ0LnJvdyA+IG5ld0VuZC5yb3cpIHtcbiAgICAgICAgICBbbmV3U3RhcnQsIG5ld0VuZF0gPSBbbmV3RW5kLCBuZXdTdGFydF1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByYW5nZXNEaWZmcyA9IHRoaXMuY29tcHV0ZVJhbmdlc0RpZmZzKFxuICAgICAgICAgIG9sZFN0YXJ0LCBvbGRFbmQsXG4gICAgICAgICAgbmV3U3RhcnQsIG5ld0VuZFxuICAgICAgICApXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHJhbmdlc0RpZmZzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbGV0IFtzdGFydCwgZW5kXSA9IHJhbmdlc0RpZmZzW2ldXG4gICAgICAgICAgdGhpcy5lbWl0UmFuZ2VDaGFuZ2VzKHR5cGUsIHtcbiAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgIGVuZDogZW5kXG4gICAgICAgICAgfSwgMClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgZGVjb3JhdGlvbiA9IG5ldyBEZWNvcmF0aW9uKG1hcmtlciwgdGhpcywgZGVjb3JhdGlvblBhcmFtcylcblxuICAgIGlmICh0aGlzLmRlY29yYXRpb25zQnlNYXJrZXJJZFtpZF0gPT0gbnVsbCkge1xuICAgICAgdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWRbaWRdID0gW11cbiAgICB9XG5cbiAgICB0aGlzLmRlY29yYXRpb25zQnlNYXJrZXJJZFtpZF0ucHVzaChkZWNvcmF0aW9uKVxuICAgIHRoaXMuZGVjb3JhdGlvbnNCeUlkW2RlY29yYXRpb24uaWRdID0gZGVjb3JhdGlvblxuXG4gICAgaWYgKHRoaXMuZGVjb3JhdGlvblVwZGF0ZWRTdWJzY3JpcHRpb25zW2RlY29yYXRpb24uaWRdID09IG51bGwpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGlvblVwZGF0ZWRTdWJzY3JpcHRpb25zW2RlY29yYXRpb24uaWRdID1cbiAgICAgIGRlY29yYXRpb24ub25EaWRDaGFuZ2VQcm9wZXJ0aWVzKChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXREZWNvcmF0aW9uQ2hhbmdlcyh0eXBlLCBkZWNvcmF0aW9uKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmRlY29yYXRpb25EZXN0cm95ZWRTdWJzY3JpcHRpb25zW2RlY29yYXRpb24uaWRdID1cbiAgICBkZWNvcmF0aW9uLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLnJlbW92ZURlY29yYXRpb24oZGVjb3JhdGlvbilcbiAgICB9KVxuXG4gICAgdGhpcy5lbWl0RGVjb3JhdGlvbkNoYW5nZXModHlwZSwgZGVjb3JhdGlvbilcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWFkZC1kZWNvcmF0aW9uJywge1xuICAgICAgbWFya2VyOiBtYXJrZXIsXG4gICAgICBkZWNvcmF0aW9uOiBkZWNvcmF0aW9uXG4gICAgfSlcblxuICAgIHJldHVybiBkZWNvcmF0aW9uXG4gIH1cblxuICBnZXRPcmlnaW5hdG9yUGFja2FnZU5hbWUgKCkge1xuICAgIGNvbnN0IGxpbmUgPSBuZXcgRXJyb3IoKS5zdGFjay5zcGxpdCgnXFxuJylbM11cbiAgICBjb25zdCBmaWxlUGF0aCA9IGxpbmUuc3BsaXQoJygnKVsxXS5yZXBsYWNlKCcpJywgJycpXG4gICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKFxuICAgICAgYXRvbS5wYWNrYWdlcy5nZXRQYWNrYWdlRGlyUGF0aHMoKS5qb2luKCd8JykgKyBfLmVzY2FwZVJlZ0V4cChwYXRoLnNlcClcbiAgICApXG4gICAgY29uc3QgcGx1Z2luID0gZmlsZVBhdGgucmVwbGFjZShyZSwgJycpLnNwbGl0KHBhdGguc2VwKVswXS5yZXBsYWNlKC9taW5pbWFwLXwtbWluaW1hcC8sICcnKVxuICAgIHJldHVybiBwbHVnaW4uaW5kZXhPZihwYXRoLnNlcCkgPCAwID8gcGx1Z2luIDogdW5kZWZpbmVkXG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gdHdvIHJhbmdlcywgaXQgcmV0dXJucyBhbiBhcnJheSBvZiByYW5nZXMgcmVwcmVzZW50aW5nIHRoZVxuICAgKiBkaWZmZXJlbmNlcyBiZXR3ZWVuIHRoZW0uXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gb2xkU3RhcnQgdGhlIHJvdyBpbmRleCBvZiB0aGUgZmlyc3QgcmFuZ2Ugc3RhcnRcbiAgICogQHBhcmFtICB7bnVtYmVyfSBvbGRFbmQgdGhlIHJvdyBpbmRleCBvZiB0aGUgZmlyc3QgcmFuZ2UgZW5kXG4gICAqIEBwYXJhbSAge251bWJlcn0gbmV3U3RhcnQgdGhlIHJvdyBpbmRleCBvZiB0aGUgc2Vjb25kIHJhbmdlIHN0YXJ0XG4gICAqIEBwYXJhbSAge251bWJlcn0gbmV3RW5kIHRoZSByb3cgaW5kZXggb2YgdGhlIHNlY29uZCByYW5nZSBlbmRcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn0gdGhlIGFycmF5IG9mIGRpZmYgcmFuZ2VzXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY29tcHV0ZVJhbmdlc0RpZmZzIChvbGRTdGFydCwgb2xkRW5kLCBuZXdTdGFydCwgbmV3RW5kKSB7XG4gICAgbGV0IGRpZmZzID0gW11cblxuICAgIGlmIChvbGRTdGFydC5pc0xlc3NUaGFuKG5ld1N0YXJ0KSkge1xuICAgICAgZGlmZnMucHVzaChbb2xkU3RhcnQsIG5ld1N0YXJ0XSlcbiAgICB9IGVsc2UgaWYgKG5ld1N0YXJ0LmlzTGVzc1RoYW4ob2xkU3RhcnQpKSB7XG4gICAgICBkaWZmcy5wdXNoKFtuZXdTdGFydCwgb2xkU3RhcnRdKVxuICAgIH1cblxuICAgIGlmIChvbGRFbmQuaXNMZXNzVGhhbihuZXdFbmQpKSB7XG4gICAgICBkaWZmcy5wdXNoKFtvbGRFbmQsIG5ld0VuZF0pXG4gICAgfSBlbHNlIGlmIChuZXdFbmQuaXNMZXNzVGhhbihvbGRFbmQpKSB7XG4gICAgICBkaWZmcy5wdXNoKFtuZXdFbmQsIG9sZEVuZF0pXG4gICAgfVxuXG4gICAgcmV0dXJuIGRpZmZzXG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgYSBjaGFuZ2UgaW4gdGhlIGBNaW5pbWFwYCBjb3JyZXNwb25kaW5nIHRvIHRoZVxuICAgKiBwYXNzZWQtaW4gZGVjb3JhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0eXBlIHRoZSB0eXBlIG9mIGRlY29yYXRpb24gdGhhdCBjaGFuZ2VkXG4gICAqIEBwYXJhbSAge0RlY29yYXRpb259IGRlY29yYXRpb24gdGhlIGRlY29yYXRpb24gZm9yIHdoaWNoIGVtaXR0aW5nIGFuIGV2ZW50XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZW1pdERlY29yYXRpb25DaGFuZ2VzICh0eXBlLCBkZWNvcmF0aW9uKSB7XG4gICAgaWYgKCF0aGlzLnRleHRFZGl0b3IgfHwgdGhpcy50ZXh0RWRpdG9yLmlzRGVzdHJveWVkKCkpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuaW52YWxpZGF0ZURlY29yYXRpb25Gb3JTY3JlZW5Sb3dzQ2FjaGUoKVxuXG4gICAgbGV0IHJhbmdlID0gZGVjb3JhdGlvbi5tYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKVxuICAgIGlmIChyYW5nZSA9PSBudWxsKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLmVtaXRSYW5nZUNoYW5nZXModHlwZSwgcmFuZ2UsIDApXG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgYSBjaGFuZ2UgZm9yIHRoZSBzcGVjaWZpZWQgcmFuZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdHlwZSB0aGUgdHlwZSBvZiBkZWNvcmF0aW9uIHRoYXQgY2hhbmdlZFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJhbmdlIHRoZSByYW5nZSB3aGVyZSBjaGFuZ2VzIG9jY3VyZWRcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbc2NyZWVuRGVsdGFdIGFuIG9wdGlvbmFsIHNjcmVlbiBkZWx0YSBmb3IgdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2Ugb2JqZWN0XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZW1pdFJhbmdlQ2hhbmdlcyAodHlwZSwgcmFuZ2UsIHNjcmVlbkRlbHRhKSB7XG4gICAgbGV0IHN0YXJ0U2NyZWVuUm93ID0gcmFuZ2Uuc3RhcnQucm93XG4gICAgbGV0IGVuZFNjcmVlblJvdyA9IHJhbmdlLmVuZC5yb3dcbiAgICBsZXQgbGFzdFJlbmRlcmVkU2NyZWVuUm93ID0gdGhpcy5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgbGV0IGZpcnN0UmVuZGVyZWRTY3JlZW5Sb3cgPSB0aGlzLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG5cbiAgICBpZiAoc2NyZWVuRGVsdGEgPT0gbnVsbCkge1xuICAgICAgc2NyZWVuRGVsdGEgPSAobGFzdFJlbmRlcmVkU2NyZWVuUm93IC0gZmlyc3RSZW5kZXJlZFNjcmVlblJvdykgLVxuICAgICAgICAgICAgICAgICAgICAoZW5kU2NyZWVuUm93IC0gc3RhcnRTY3JlZW5Sb3cpXG4gICAgfVxuXG4gICAgbGV0IGNoYW5nZUV2ZW50ID0ge1xuICAgICAgc3RhcnQ6IHN0YXJ0U2NyZWVuUm93LFxuICAgICAgZW5kOiBlbmRTY3JlZW5Sb3csXG4gICAgICBzY3JlZW5EZWx0YTogc2NyZWVuRGVsdGEsXG4gICAgICB0eXBlOiB0eXBlXG4gICAgfVxuXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtZGVjb3JhdGlvbi1yYW5nZScsIGNoYW5nZUV2ZW50KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBgRGVjb3JhdGlvbmAgZnJvbSB0aGlzIG1pbmltYXAuXG4gICAqXG4gICAqIEBwYXJhbSAge0RlY29yYXRpb259IGRlY29yYXRpb24gdGhlIGRlY29yYXRpb24gdG8gcmVtb3ZlXG4gICAqIEBlbWl0cyAge2RpZC1jaGFuZ2V9IHdoZW4gdGhlIGRlY29yYXRpb24gaXMgcmVtb3ZlZFxuICAgKiBAZW1pdHMgIHtkaWQtcmVtb3ZlLWRlY29yYXRpb259IHdoZW4gdGhlIGRlY29yYXRpb24gaXMgcmVtb3ZlZFxuICAgKi9cbiAgcmVtb3ZlRGVjb3JhdGlvbiAoZGVjb3JhdGlvbikge1xuICAgIGlmIChkZWNvcmF0aW9uID09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgIGxldCBtYXJrZXIgPSBkZWNvcmF0aW9uLm1hcmtlclxuICAgIGxldCBzdWJzY3JpcHRpb25cblxuICAgIGRlbGV0ZSB0aGlzLmRlY29yYXRpb25zQnlJZFtkZWNvcmF0aW9uLmlkXVxuXG4gICAgc3Vic2NyaXB0aW9uID0gdGhpcy5kZWNvcmF0aW9uVXBkYXRlZFN1YnNjcmlwdGlvbnNbZGVjb3JhdGlvbi5pZF1cbiAgICBpZiAoc3Vic2NyaXB0aW9uICE9IG51bGwpIHsgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKSB9XG5cbiAgICBzdWJzY3JpcHRpb24gPSB0aGlzLmRlY29yYXRpb25EZXN0cm95ZWRTdWJzY3JpcHRpb25zW2RlY29yYXRpb24uaWRdXG4gICAgaWYgKHN1YnNjcmlwdGlvbiAhPSBudWxsKSB7IHN1YnNjcmlwdGlvbi5kaXNwb3NlKCkgfVxuXG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdGlvblVwZGF0ZWRTdWJzY3JpcHRpb25zW2RlY29yYXRpb24uaWRdXG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnNbZGVjb3JhdGlvbi5pZF1cblxuICAgIGxldCBkZWNvcmF0aW9ucyA9IHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF1cbiAgICBpZiAoIWRlY29yYXRpb25zKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLmVtaXREZWNvcmF0aW9uQ2hhbmdlcyhkZWNvcmF0aW9uLmdldFByb3BlcnRpZXMoKS50eXBlLCBkZWNvcmF0aW9uKVxuXG4gICAgbGV0IGluZGV4ID0gZGVjb3JhdGlvbnMuaW5kZXhPZihkZWNvcmF0aW9uKVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBkZWNvcmF0aW9ucy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtcmVtb3ZlLWRlY29yYXRpb24nLCB7XG4gICAgICAgIG1hcmtlcjogbWFya2VyLFxuICAgICAgICBkZWNvcmF0aW9uOiBkZWNvcmF0aW9uXG4gICAgICB9KVxuXG4gICAgICBpZiAoZGVjb3JhdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlZEFsbE1hcmtlckRlY29yYXRpb25zKG1hcmtlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgdGhlIGRlY29yYXRpb25zIHJlZ2lzdGVyZWQgZm9yIHRoZSBwYXNzZWQtaW4gbWFya2VyLlxuICAgKlxuICAgKiBAcGFyYW0gIHtNYXJrZXJ9IG1hcmtlciB0aGUgbWFya2VyIGZvciB3aGljaCByZW1vdmluZyBpdHMgZGVjb3JhdGlvbnNcbiAgICogQGVtaXRzICB7ZGlkLWNoYW5nZX0gd2hlbiBhIGRlY29yYXRpb24gaGF2ZSBiZWVuIHJlbW92ZWRcbiAgICogQGVtaXRzICB7ZGlkLXJlbW92ZS1kZWNvcmF0aW9ufSB3aGVuIGEgZGVjb3JhdGlvbiBoYXZlIGJlZW4gcmVtb3ZlZFxuICAgKi9cbiAgcmVtb3ZlQWxsRGVjb3JhdGlvbnNGb3JNYXJrZXIgKG1hcmtlcikge1xuICAgIGlmIChtYXJrZXIgPT0gbnVsbCkgeyByZXR1cm4gfVxuXG4gICAgbGV0IGRlY29yYXRpb25zID0gdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWRbbWFya2VyLmlkXVxuICAgIGlmICghZGVjb3JhdGlvbnMpIHsgcmV0dXJuIH1cblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBkZWNvcmF0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IGRlY29yYXRpb24gPSBkZWNvcmF0aW9uc1tpXVxuXG4gICAgICB0aGlzLmVtaXREZWNvcmF0aW9uQ2hhbmdlcyhkZWNvcmF0aW9uLmdldFByb3BlcnRpZXMoKS50eXBlLCBkZWNvcmF0aW9uKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1yZW1vdmUtZGVjb3JhdGlvbicsIHtcbiAgICAgICAgbWFya2VyOiBtYXJrZXIsXG4gICAgICAgIGRlY29yYXRpb246IGRlY29yYXRpb25cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVkQWxsTWFya2VyRGVjb3JhdGlvbnMobWFya2VyKVxuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIHRoZSByZW1vdmFsIG9mIGEgZGVjb3JhdGlvbiBmb3IgYSBnaXZlbiBtYXJrZXIuXG4gICAqXG4gICAqIEBwYXJhbSAge01hcmtlcn0gbWFya2VyIHRoZSBtYXJrZXIgZm9yIHdoaWNoIHJlbW92aW5nIGRlY29yYXRpb25zXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcmVtb3ZlZEFsbE1hcmtlckRlY29yYXRpb25zIChtYXJrZXIpIHtcbiAgICBpZiAobWFya2VyID09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuZGVjb3JhdGlvbk1hcmtlckNoYW5nZWRTdWJzY3JpcHRpb25zW21hcmtlci5pZF0uZGlzcG9zZSgpXG4gICAgdGhpcy5kZWNvcmF0aW9uTWFya2VyRGVzdHJveWVkU3Vic2NyaXB0aW9uc1ttYXJrZXIuaWRdLmRpc3Bvc2UoKVxuXG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF1cbiAgICBkZWxldGUgdGhpcy5kZWNvcmF0aW9uTWFya2VyQ2hhbmdlZFN1YnNjcmlwdGlvbnNbbWFya2VyLmlkXVxuICAgIGRlbGV0ZSB0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zW21hcmtlci5pZF1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCB0aGUgZGVjb3JhdGlvbnMgdGhhdCB3YXMgY3JlYXRlZCBpbiB0aGUgY3VycmVudCBgTWluaW1hcGAuXG4gICAqL1xuICByZW1vdmVBbGxEZWNvcmF0aW9ucyAoKSB7XG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5kZWNvcmF0aW9uTWFya2VyQ2hhbmdlZFN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGlvbk1hcmtlckNoYW5nZWRTdWJzY3JpcHRpb25zW2lkXS5kaXNwb3NlKClcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zW2lkXS5kaXNwb3NlKClcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmRlY29yYXRpb25VcGRhdGVkU3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5kZWNvcmF0aW9uVXBkYXRlZFN1YnNjcmlwdGlvbnNbaWRdLmRpc3Bvc2UoKVxuICAgIH1cblxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnNbaWRdLmRpc3Bvc2UoKVxuICAgIH1cblxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuZGVjb3JhdGlvbnNCeUlkKSB7XG4gICAgICB0aGlzLmRlY29yYXRpb25zQnlJZFtpZF0uZGVzdHJveSgpXG4gICAgfVxuXG4gICAgdGhpcy5kZWNvcmF0aW9uc0J5SWQgPSB7fVxuICAgIHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkID0ge31cbiAgICB0aGlzLmRlY29yYXRpb25NYXJrZXJDaGFuZ2VkU3Vic2NyaXB0aW9ucyA9IHt9XG4gICAgdGhpcy5kZWNvcmF0aW9uTWFya2VyRGVzdHJveWVkU3Vic2NyaXB0aW9ucyA9IHt9XG4gICAgdGhpcy5kZWNvcmF0aW9uVXBkYXRlZFN1YnNjcmlwdGlvbnMgPSB7fVxuICAgIHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnMgPSB7fVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/mixins/decoration-management.js

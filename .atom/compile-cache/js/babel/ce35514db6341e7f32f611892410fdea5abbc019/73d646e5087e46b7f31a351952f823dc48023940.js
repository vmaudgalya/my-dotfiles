Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _mixinsDecorationManagement = require('./mixins/decoration-management');

var _mixinsDecorationManagement2 = _interopRequireDefault(_mixinsDecorationManagement);

var _adaptersLegacyAdapter = require('./adapters/legacy-adapter');

var _adaptersLegacyAdapter2 = _interopRequireDefault(_adaptersLegacyAdapter);

var _adaptersStableAdapter = require('./adapters/stable-adapter');

var _adaptersStableAdapter2 = _interopRequireDefault(_adaptersStableAdapter);

'use babel';

var nextModelId = 1;

/**
 * The Minimap class is the underlying model of a <MinimapElement>.
 * Most manipulations of the minimap is done through the model.
 *
 * Any Minimap instance is tied to a `TextEditor`.
 * Their lifecycle follow the one of their target `TextEditor`, so they are
 * destroyed whenever their `TextEditor` is destroyed.
 */

var Minimap = (function () {
  /**
   * Creates a new Minimap instance for the given `TextEditor`.
   *
   * @param  {Object} options an object with the new Minimap properties
   * @param  {TextEditor} options.textEditor the target text editor for
   *                                         the minimap
   * @param  {boolean} [options.standAlone] whether this minimap is in
   *                                        stand-alone mode or not
   * @param  {number} [options.width] the minimap width in pixels
   * @param  {number} [options.height] the minimap height in pixels
   * @throws {Error} Cannot create a minimap without an editor
   */

  function Minimap() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, _Minimap);

    if (!options.textEditor) {
      throw new Error('Cannot create a minimap without an editor');
    }

    /**
     * The Minimap's text editor.
     *
     * @type {TextEditor}
     * @access private
     */
    this.textEditor = options.textEditor;
    /**
     * The stand-alone state of the current Minimap.
     *
     * @type {boolean}
     * @access private
     */
    this.standAlone = options.standAlone;
    /**
     * The width of the current Minimap.
     *
     * @type {number}
     * @access private
     */
    this.width = options.width;
    /**
     * The height of the current Minimap.
     *
     * @type {number}
     * @access private
     */
    this.height = options.height;
    /**
     * The id of the current Minimap.
     *
     * @type {Number}
     * @access private
     */
    this.id = nextModelId++;
    /**
     * The events emitter of the current Minimap.
     *
     * @type {Emitter}
     * @access private
     */
    this.emitter = new _atom.Emitter();
    /**
     * The Minimap's subscriptions.
     *
     * @type {CompositeDisposable}
     * @access private
     */
    this.subscriptions = new _atom.CompositeDisposable();
    /**
     * The adapter object leverage the access to several properties from
     * the `TextEditor`/`TextEditorElement` to support the different APIs
     * between different version of Atom.
     *
     * @type {Object}
     * @access private
     */
    this.adapter = null;
    /**
     * The char height of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.charHeight = null;
    /**
     * The char height from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configCharHeight = null;
    /**
     * The char width of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.charWidth = null;
    /**
     * The char width from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configCharWidth = null;
    /**
     * The interline of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.interline = null;
    /**
     * The interline from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configInterline = null;
    /**
     * The devicePixelRatioRounding of the current Minimap, will be
     * `undefined` unless `setDevicePixelRatioRounding` is called.
     *
     * @type {boolean}
     * @access private
     */
    this.devicePixelRatioRounding = null;
    /**
     * The devicePixelRatioRounding from the package's configuration.
     * Will be overriden by the instance value.
     *
     * @type {boolean}
     * @access private
     */
    this.configDevicePixelRatioRounding = null;
    /**
    /**
     * A boolean value to store whether this Minimap have been destroyed or not.
     *
     * @type {boolean}
     * @access private
     */
    this.destroyed = false;
    /**
     * A boolean value to store whether the `scrollPastEnd` setting is enabled
     * or not.
     *
     * @type {boolean}
     * @access private
     */
    this.scrollPastEnd = false;

    this.initializeDecorations();

    if (atom.views.getView(this.textEditor).getScrollTop != null) {
      this.adapter = new _adaptersStableAdapter2['default'](this.textEditor);
    } else {
      this.adapter = new _adaptersLegacyAdapter2['default'](this.textEditor);
    }

    if (this.standAlone) {
      /**
       * When in stand-alone mode, a Minimap doesn't scroll and will use this
       * value instead.
       *
       * @type {number}
       * @access private
       */
      this.scrollTop = 0;
    }

    var subs = this.subscriptions;
    subs.add(atom.config.observe('editor.scrollPastEnd', function (scrollPastEnd) {
      _this.scrollPastEnd = scrollPastEnd;
      _this.adapter.scrollPastEnd = _this.scrollPastEnd;
      _this.emitter.emit('did-change-config');
    }));
    subs.add(atom.config.observe('minimap.charHeight', function (configCharHeight) {
      _this.configCharHeight = configCharHeight;
      _this.emitter.emit('did-change-config');
    }));
    subs.add(atom.config.observe('minimap.charWidth', function (configCharWidth) {
      _this.configCharWidth = configCharWidth;
      _this.emitter.emit('did-change-config');
    }));
    subs.add(atom.config.observe('minimap.interline', function (configInterline) {
      _this.configInterline = configInterline;
      _this.emitter.emit('did-change-config');
    }));
    // cdprr is shorthand for configDevicePixelRatioRounding
    subs.add(atom.config.observe('minimap.devicePixelRatioRounding', function (cdprr) {
      _this.configDevicePixelRatioRounding = cdprr;
      _this.emitter.emit('did-change-config');
    }));

    subs.add(this.adapter.onDidChangeScrollTop(function () {
      if (!_this.standAlone) {
        _this.emitter.emit('did-change-scroll-top', _this);
      }
    }));
    subs.add(this.adapter.onDidChangeScrollLeft(function () {
      if (!_this.standAlone) {
        _this.emitter.emit('did-change-scroll-left', _this);
      }
    }));

    subs.add(this.textEditor.onDidChange(function (changes) {
      _this.emitChanges(changes);
    }));
    subs.add(this.textEditor.onDidDestroy(function () {
      _this.destroy();
    }));

    /*
    FIXME Some changes occuring during the tokenization produces
    ranges that deceive the canvas rendering by making some
    lines at the end of the buffer intact while they are in fact not,
    resulting in extra lines appearing at the end of the minimap.
    Forcing a whole repaint to fix that bug is suboptimal but works.
    */
    subs.add(this.textEditor.displayBuffer.onDidTokenize(function () {
      _this.emitter.emit('did-change-config');
    }));
  }

  /**
   * Destroys the model.
   */

  _createClass(Minimap, [{
    key: 'destroy',
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      this.removeAllDecorations();
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.textEditor = null;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      this.destroyed = true;
    }

    /**
     * Returns `true` when this `Minimap` has benn destroyed.
     *
     * @return {boolean} whether this Minimap has been destroyed or not
     */
  }, {
    key: 'isDestroyed',
    value: function isDestroyed() {
      return this.destroyed;
    }

    /**
     * Registers an event listener to the `did-change` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                                event is triggered.
     *                                                the callback will be called
     *                                                with an event object with
     *                                                the following properties:
     * - start: The change's start row number
     * - end: The change's end row number
     * - screenDelta: the delta in buffer rows between the versions before and
     *   after the change
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChange',
    value: function onDidChange(callback) {
      return this.emitter.on('did-change', callback);
    }

    /**
     * Registers an event listener to the `did-change-config` event.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeConfig',
    value: function onDidChangeConfig(callback) {
      return this.emitter.on('did-change-config', callback);
    }

    /**
     * Registers an event listener to the `did-change-scroll-top` event.
     *
     * The event is dispatched when the text editor `scrollTop` value have been
     * changed or when the minimap scroll top have been changed in stand-alone
     * mode.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeScrollTop',
    value: function onDidChangeScrollTop(callback) {
      return this.emitter.on('did-change-scroll-top', callback);
    }

    /**
     * Registers an event listener to the `did-change-scroll-left` event.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeScrollLeft',
    value: function onDidChangeScrollLeft(callback) {
      return this.emitter.on('did-change-scroll-left', callback);
    }

    /**
     * Registers an event listener to the `did-change-stand-alone` event.
     *
     * This event is dispatched when the stand-alone of the current Minimap
     * is either enabled or disabled.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeStandAlone',
    value: function onDidChangeStandAlone(callback) {
      return this.emitter.on('did-change-stand-alone', callback);
    }

    /**
     * Registers an event listener to the `did-destroy` event.
     *
     * This event is dispatched when this Minimap have been destroyed. It can
     * occurs either because the {@link destroy} method have been called on the
     * Minimap or because the target text editor have been destroyed.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }

    /**
     * Returns `true` when the current Minimap is a stand-alone minimap.
     *
     * @return {boolean} whether this Minimap is in stand-alone mode or not.
     */
  }, {
    key: 'isStandAlone',
    value: function isStandAlone() {
      return this.standAlone;
    }

    /**
     * Sets the stand-alone mode for this minimap.
     *
     * @param {boolean} standAlone the new state of the stand-alone mode for this
     *                             Minimap
     * @emits {did-change-stand-alone} if the stand-alone mode have been toggled
     *        on or off by the call
     */
  }, {
    key: 'setStandAlone',
    value: function setStandAlone(standAlone) {
      if (standAlone !== this.standAlone) {
        this.standAlone = standAlone;
        this.emitter.emit('did-change-stand-alone', this);
      }
    }

    /**
     * Returns the `TextEditor` that this minimap represents.
     *
     * @return {TextEditor} this Minimap's text editor
     */
  }, {
    key: 'getTextEditor',
    value: function getTextEditor() {
      return this.textEditor;
    }

    /**
     * Returns the height of the `TextEditor` at the Minimap scale.
     *
     * @return {number} the scaled height of the text editor
     */
  }, {
    key: 'getTextEditorScaledHeight',
    value: function getTextEditorScaledHeight() {
      return this.adapter.getHeight() * this.getVerticalScaleFactor();
    }

    /**
     * Returns the `TextEditor` scroll top value at the Minimap scale.
     *
     * @return {number} the scaled scroll top of the text editor
     */
  }, {
    key: 'getTextEditorScaledScrollTop',
    value: function getTextEditorScaledScrollTop() {
      return this.adapter.getScrollTop() * this.getVerticalScaleFactor();
    }

    /**
     * Returns the `TextEditor` scroll left value at the Minimap scale.
     *
     * @return {number} the scaled scroll left of the text editor
     */
  }, {
    key: 'getTextEditorScaledScrollLeft',
    value: function getTextEditorScaledScrollLeft() {
      return this.adapter.getScrollLeft() * this.getHorizontalScaleFactor();
    }

    /**
     * Returns the `TextEditor` maximum scroll top value.
     *
     * When the `scrollPastEnd` setting is enabled, the method compensate the
     * extra scroll by removing the same height as added by the editor from the
     * final value.
     *
     * @return {number} the maximum scroll top of the text editor
     */
  }, {
    key: 'getTextEditorMaxScrollTop',
    value: function getTextEditorMaxScrollTop() {
      return this.adapter.getMaxScrollTop();
    }

    /**
     * Returns the `TextEditor` scroll top value.
     *
     * @return {number} the scroll top of the text editor
     */
  }, {
    key: 'getTextEditorScrollTop',
    value: function getTextEditorScrollTop() {
      return this.adapter.getScrollTop();
    }

    /**
     * Sets the scroll top of the `TextEditor`.
     *
     * @param {number} scrollTop the new scroll top value
     */
  }, {
    key: 'setTextEditorScrollTop',
    value: function setTextEditorScrollTop(scrollTop) {
      this.adapter.setScrollTop(scrollTop);
    }

    /**
     * Returns the `TextEditor` scroll left value.
     *
     * @return {number} the scroll left of the text editor
     */
  }, {
    key: 'getTextEditorScrollLeft',
    value: function getTextEditorScrollLeft() {
      return this.adapter.getScrollLeft();
    }

    /**
     * Returns the height of the `TextEditor`.
     *
     * @return {number} the height of the text editor
     */
  }, {
    key: 'getTextEditorHeight',
    value: function getTextEditorHeight() {
      return this.adapter.getHeight();
    }

    /**
     * Returns the `TextEditor` scroll as a value normalized between `0` and `1`.
     *
     * When the `scrollPastEnd` setting is enabled the value may exceed `1` as the
     * maximum scroll value used to compute this ratio compensate for the extra
     * height in the editor. **Use {@link getCapedTextEditorScrollRatio} when
     * you need a value that is strictly between `0` and `1`.**
     *
     * @return {number} the scroll ratio of the text editor
     */
  }, {
    key: 'getTextEditorScrollRatio',
    value: function getTextEditorScrollRatio() {
      return this.adapter.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
    }

    /**
     * Returns the `TextEditor` scroll as a value normalized between `0` and `1`.
     *
     * The returned value will always be strictly between `0` and `1`.
     *
     * @return {number} the scroll ratio of the text editor strictly between
     *                  0 and 1
     */
  }, {
    key: 'getCapedTextEditorScrollRatio',
    value: function getCapedTextEditorScrollRatio() {
      return Math.min(1, this.getTextEditorScrollRatio());
    }

    /**
     * Returns the height of the whole minimap in pixels based on the `minimap`
     * settings.
     *
     * @return {number} the height of the minimap
     */
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.textEditor.getScreenLineCount() * this.getLineHeight();
    }

    /**
     * Returns the width of the whole minimap in pixels based on the `minimap`
     * settings.
     *
     * @return {number} the width of the minimap
     */
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.textEditor.getMaxScreenLineLength() * this.getCharWidth();
    }

    /**
     * Returns the height the Minimap content will take on screen.
     *
     * When the Minimap height is greater than the `TextEditor` height, the
     * `TextEditor` height is returned instead.
     *
     * @return {number} the visible height of the Minimap
     */
  }, {
    key: 'getVisibleHeight',
    value: function getVisibleHeight() {
      return Math.min(this.getScreenHeight(), this.getHeight());
    }

    /**
     * Returns the height the minimap should take once displayed, it's either
     * the height of the `TextEditor` or the provided `height` when in stand-alone
     * mode.
     *
     * @return {number} the total height of the Minimap
     */
  }, {
    key: 'getScreenHeight',
    value: function getScreenHeight() {
      if (this.isStandAlone()) {
        if (this.height != null) {
          return this.height;
        } else {
          return this.getHeight();
        }
      } else {
        return this.adapter.getHeight();
      }
    }

    /**
     * Returns the width the whole Minimap will take on screen.
     *
     * @return {number} the width of the Minimap when displayed
     */
  }, {
    key: 'getVisibleWidth',
    value: function getVisibleWidth() {
      return Math.min(this.getScreenWidth(), this.getWidth());
    }

    /**
     * Returns the width the Minimap should take once displayed, it's either the
     * width of the Minimap content or the provided `width` when in standAlone
     * mode.
     *
     * @return {number} the Minimap screen width
     */
  }, {
    key: 'getScreenWidth',
    value: function getScreenWidth() {
      if (this.isStandAlone() && this.width != null) {
        return this.width;
      } else {
        return this.getWidth();
      }
    }

    /**
     * Sets the preferred height and width when in stand-alone mode.
     *
     * This method is called by the <MinimapElement> for this Minimap so that
     * the model is kept in sync with the view.
     *
     * @param {number} height the new height of the Minimap
     * @param {number} width the new width of the Minimap
     */
  }, {
    key: 'setScreenHeightAndWidth',
    value: function setScreenHeightAndWidth(height, width) {
      this.height = height;
      this.width = width;
    }

    /**
     * Returns the vertical scaling factor when converting coordinates from the
     * `TextEditor` to the Minimap.
     *
     * @return {number} the Minimap vertical scaling factor
     */
  }, {
    key: 'getVerticalScaleFactor',
    value: function getVerticalScaleFactor() {
      return this.getLineHeight() / this.textEditor.getLineHeightInPixels();
    }

    /**
     * Returns the horizontal scaling factor when converting coordinates from the
     * `TextEditor` to the Minimap.
     *
     * @return {number} the Minimap horizontal scaling factor
     */
  }, {
    key: 'getHorizontalScaleFactor',
    value: function getHorizontalScaleFactor() {
      return this.getCharWidth() / this.textEditor.getDefaultCharWidth();
    }

    /**
     * Returns the height of a line in the Minimap in pixels.
     *
     * @return {number} a line's height in the Minimap
     */
  }, {
    key: 'getLineHeight',
    value: function getLineHeight() {
      return this.getCharHeight() + this.getInterline();
    }

    /**
     * Returns the width of a character in the Minimap in pixels.
     *
     * @return {number} a character's width in the Minimap
     */
  }, {
    key: 'getCharWidth',
    value: function getCharWidth() {
      if (this.charWidth != null) {
        return this.charWidth;
      } else {
        return this.configCharWidth;
      }
    }

    /**
     * Sets the char width for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} charWidth the new width of a char in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setCharWidth',
    value: function setCharWidth(charWidth) {
      this.charWidth = Math.floor(charWidth);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the height of a character in the Minimap in pixels.
     *
     * @return {number} a character's height in the Minimap
     */
  }, {
    key: 'getCharHeight',
    value: function getCharHeight() {
      if (this.charHeight != null) {
        return this.charHeight;
      } else {
        return this.configCharHeight;
      }
    }

    /**
     * Sets the char height for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} charHeight the new height of a char in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setCharHeight',
    value: function setCharHeight(charHeight) {
      this.charHeight = Math.floor(charHeight);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the height of an interline in the Minimap in pixels.
     *
     * @return {number} the interline's height in the Minimap
     */
  }, {
    key: 'getInterline',
    value: function getInterline() {
      if (this.interline != null) {
        return this.interline;
      } else {
        return this.configInterline;
      }
    }

    /**
     * Sets the interline height for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} interline the new height of an interline in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setInterline',
    value: function setInterline(interline) {
      this.interline = Math.floor(interline);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the status of devicePixelRatioRounding in the Minimap.
     *
     * @return {boolean} the devicePixelRatioRounding status in the Minimap
     */
  }, {
    key: 'getDevicePixelRatioRounding',
    value: function getDevicePixelRatioRounding() {
      if (this.devicePixelRatioRounding != null) {
        return this.devicePixelRatioRounding;
      } else {
        return this.configDevicePixelRatioRounding;
      }
    }

    /**
     * Sets the devicePixelRatioRounding status for this Minimap.
     * This value will override the value from the config for this instance only.
     * A `did-change-config` event is dispatched.
     *
     * @param {boolean} devicePixelRatioRounding the new status of
     *                                           devicePixelRatioRounding
     *                                           in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setDevicePixelRatioRounding',
    value: function setDevicePixelRatioRounding(devicePixelRatioRounding) {
      this.devicePixelRatioRounding = devicePixelRatioRounding;
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the devicePixelRatio in the Minimap in pixels.
     *
     * @return {number} the devicePixelRatio in the Minimap
     */
  }, {
    key: 'getDevicePixelRatio',
    value: function getDevicePixelRatio() {
      return this.getDevicePixelRatioRounding() ? Math.floor(devicePixelRatio) : devicePixelRatio;
    }

    /**
     * Returns the index of the first visible row in the Minimap.
     *
     * @return {number} the index of the first visible row
     */
  }, {
    key: 'getFirstVisibleScreenRow',
    value: function getFirstVisibleScreenRow() {
      return Math.floor(this.getScrollTop() / this.getLineHeight());
    }

    /**
     * Returns the index of the last visible row in the Minimap.
     *
     * @return {number} the index of the last visible row
     */
  }, {
    key: 'getLastVisibleScreenRow',
    value: function getLastVisibleScreenRow() {
      return Math.ceil((this.getScrollTop() + this.getScreenHeight()) / this.getLineHeight());
    }

    /**
     * Returns the current scroll of the Minimap.
     *
     * The Minimap can scroll only when its height is greater that the height
     * of its `TextEditor`.
     *
     * @return {number} the scroll top of the Minimap
     */
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      if (this.standAlone) {
        return this.scrollTop;
      } else {
        return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
      }
    }

    /**
     * Sets the minimap scroll top value when in stand-alone mode.
     *
     * @param {number} scrollTop the new scroll top for the Minimap
     * @emits {did-change-scroll-top} if the Minimap's stand-alone mode is enabled
     */
  }, {
    key: 'setScrollTop',
    value: function setScrollTop(scrollTop) {
      this.scrollTop = scrollTop;
      if (this.standAlone) {
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the maximum scroll value of the Minimap.
     *
     * @return {number} the maximum scroll top for the Minimap
     */
  }, {
    key: 'getMaxScrollTop',
    value: function getMaxScrollTop() {
      return Math.max(0, this.getHeight() - this.getScreenHeight());
    }

    /**
     * Returns `true` when the Minimap can scroll.
     *
     * @return {boolean} whether this Minimap can scroll or not
     */
  }, {
    key: 'canScroll',
    value: function canScroll() {
      return this.getMaxScrollTop() > 0;
    }

    /**
     * Delegates to `TextEditor#getMarker`.
     *
     * @access private
     */
  }, {
    key: 'getMarker',
    value: function getMarker(id) {
      return this.textEditor.getMarker(id);
    }

    /**
     * Delegates to `TextEditor#findMarkers`.
     *
     * @access private
     */
  }, {
    key: 'findMarkers',
    value: function findMarkers(o) {
      try {
        return this.textEditor.findMarkers(o);
      } catch (error) {
        return [];
      }
    }

    /**
     * Delegates to `TextEditor#markBufferRange`.
     *
     * @access private
     */
  }, {
    key: 'markBufferRange',
    value: function markBufferRange(range) {
      return this.textEditor.markBufferRange(range);
    }

    /**
     * Emits a change events with the passed-in changes as data.
     *
     * @param  {Object} changes a change to dispatch
     * @access private
     */
  }, {
    key: 'emitChanges',
    value: function emitChanges(changes) {
      this.emitter.emit('did-change', changes);
    }

    /**
     * Enables the cache at the adapter level to avoid consecutive access to the
     * text editor API during a render phase.
     *
     * @access private
     */
  }, {
    key: 'enableCache',
    value: function enableCache() {
      this.adapter.enableCache();
    }

    /**
     * Disable the adapter cache.
     *
     * @access private
     */
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this.adapter.clearCache();
    }
  }]);

  var _Minimap = Minimap;
  Minimap = (0, _decoratorsInclude2['default'])(_mixinsDecorationManagement2['default'])(Minimap) || Minimap;
  return Minimap;
})();

exports['default'] = Minimap;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7aUNBQzdCLHNCQUFzQjs7OzswQ0FDVCxnQ0FBZ0M7Ozs7cUNBQ3hDLDJCQUEyQjs7OztxQ0FDMUIsMkJBQTJCOzs7O0FBTnJELFdBQVcsQ0FBQTs7QUFRWCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUE7Ozs7Ozs7Ozs7O0lBV0UsT0FBTzs7Ozs7Ozs7Ozs7Ozs7QUFhZCxXQWJPLE9BQU8sR0FhQzs7O1FBQWQsT0FBTyx5REFBRyxFQUFFOzs7O0FBQ3ZCLFFBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQ3ZCLFlBQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtLQUM3RDs7Ozs7Ozs7QUFRRCxRQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUE7Ozs7Ozs7QUFPcEMsUUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFBOzs7Ozs7O0FBT3BDLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQTs7Ozs7OztBQU8xQixRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7Ozs7Ozs7QUFPNUIsUUFBSSxDQUFDLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQTs7Ozs7OztBQU92QixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7Ozs7Ozs7QUFPNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7Ozs7Ozs7O0FBUzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBOzs7Ozs7OztBQVFuQixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTs7Ozs7Ozs7QUFRdEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQTs7Ozs7Ozs7QUFRNUIsUUFBSSxD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cUJBQUMsQ0FBQyxFQUFFO0FBQ2QsVUFBSTtBQUNGLGVBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDdEMsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLGVBQU8sRUFBRSxDQUFBO09BQ1Y7S0FDRjs7Ozs7Ozs7O1dBT2UseUJBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUFFOzs7Ozs7Ozs7O1dBUTdELHFCQUFDLE9BQU8sRUFBRTtBQUFFLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUFFOzs7Ozs7Ozs7O1dBUXRELHVCQUFHO0FBQUUsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtLQUFFOzs7Ozs7Ozs7V0FPbEMsc0JBQUc7QUFBRSxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFBO0tBQUU7OztpQkEveUJ4QixPQUFPO0FBQVAsU0FBTyxHQUQzQiw0RUFBNkIsQ0FDVCxPQUFPLEtBQVAsT0FBTztTQUFQLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgaW5jbHVkZSBmcm9tICcuL2RlY29yYXRvcnMvaW5jbHVkZSdcbmltcG9ydCBEZWNvcmF0aW9uTWFuYWdlbWVudCBmcm9tICcuL21peGlucy9kZWNvcmF0aW9uLW1hbmFnZW1lbnQnXG5pbXBvcnQgTGVnYWN5QWRhdGVyIGZyb20gJy4vYWRhcHRlcnMvbGVnYWN5LWFkYXB0ZXInXG5pbXBvcnQgU3RhYmxlQWRhcHRlciBmcm9tICcuL2FkYXB0ZXJzL3N0YWJsZS1hZGFwdGVyJ1xuXG5sZXQgbmV4dE1vZGVsSWQgPSAxXG5cbi8qKlxuICogVGhlIE1pbmltYXAgY2xhc3MgaXMgdGhlIHVuZGVybHlpbmcgbW9kZWwgb2YgYSA8TWluaW1hcEVsZW1lbnQ+LlxuICogTW9zdCBtYW5pcHVsYXRpb25zIG9mIHRoZSBtaW5pbWFwIGlzIGRvbmUgdGhyb3VnaCB0aGUgbW9kZWwuXG4gKlxuICogQW55IE1pbmltYXAgaW5zdGFuY2UgaXMgdGllZCB0byBhIGBUZXh0RWRpdG9yYC5cbiAqIFRoZWlyIGxpZmVjeWNsZSBmb2xsb3cgdGhlIG9uZSBvZiB0aGVpciB0YXJnZXQgYFRleHRFZGl0b3JgLCBzbyB0aGV5IGFyZVxuICogZGVzdHJveWVkIHdoZW5ldmVyIHRoZWlyIGBUZXh0RWRpdG9yYCBpcyBkZXN0cm95ZWQuXG4gKi9cbkBpbmNsdWRlKERlY29yYXRpb25NYW5hZ2VtZW50KVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWluaW1hcCB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IE1pbmltYXAgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyBhbiBvYmplY3Qgd2l0aCB0aGUgbmV3IE1pbmltYXAgcHJvcGVydGllc1xuICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSBvcHRpb25zLnRleHRFZGl0b3IgdGhlIHRhcmdldCB0ZXh0IGVkaXRvciBmb3JcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBtaW5pbWFwXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IFtvcHRpb25zLnN0YW5kQWxvbmVdIHdoZXRoZXIgdGhpcyBtaW5pbWFwIGlzIGluXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kLWFsb25lIG1vZGUgb3Igbm90XG4gICAqIEBwYXJhbSAge251bWJlcn0gW29wdGlvbnMud2lkdGhdIHRoZSBtaW5pbWFwIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFtvcHRpb25zLmhlaWdodF0gdGhlIG1pbmltYXAgaGVpZ2h0IGluIHBpeGVsc1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQ2Fubm90IGNyZWF0ZSBhIG1pbmltYXAgd2l0aG91dCBhbiBlZGl0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICBpZiAoIW9wdGlvbnMudGV4dEVkaXRvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbWluaW1hcCB3aXRob3V0IGFuIGVkaXRvcicpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIE1pbmltYXAncyB0ZXh0IGVkaXRvci5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtUZXh0RWRpdG9yfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMudGV4dEVkaXRvciA9IG9wdGlvbnMudGV4dEVkaXRvclxuICAgIC8qKlxuICAgICAqIFRoZSBzdGFuZC1hbG9uZSBzdGF0ZSBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdGFuZEFsb25lID0gb3B0aW9ucy5zdGFuZEFsb25lXG4gICAgLyoqXG4gICAgICogVGhlIHdpZHRoIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoXG4gICAgLyoqXG4gICAgICogVGhlIGhlaWdodCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0XG4gICAgLyoqXG4gICAgICogVGhlIGlkIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBuZXh0TW9kZWxJZCsrXG4gICAgLyoqXG4gICAgICogVGhlIGV2ZW50cyBlbWl0dGVyIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RW1pdHRlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgLyoqXG4gICAgICogVGhlIE1pbmltYXAncyBzdWJzY3JpcHRpb25zLlxuICAgICAqXG4gICAgICogQHR5cGUge0NvbXBvc2l0ZURpc3Bvc2FibGV9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIC8qKlxuICAgICAqIFRoZSBhZGFwdGVyIG9iamVjdCBsZXZlcmFnZSB0aGUgYWNjZXNzIHRvIHNldmVyYWwgcHJvcGVydGllcyBmcm9tXG4gICAgICogdGhlIGBUZXh0RWRpdG9yYC9gVGV4dEVkaXRvckVsZW1lbnRgIHRvIHN1cHBvcnQgdGhlIGRpZmZlcmVudCBBUElzXG4gICAgICogYmV0d2VlbiBkaWZmZXJlbnQgdmVyc2lvbiBvZiBBdG9tLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmFkYXB0ZXIgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXIgaGVpZ2h0IG9mIHRoZSBjdXJyZW50IE1pbmltYXAsIHdpbGwgYmUgYHVuZGVmaW5lZGAgdW5sZXNzXG4gICAgICogYHNldENoYXJXaWR0aGAgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNoYXJIZWlnaHQgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXIgaGVpZ2h0IGZyb20gdGhlIHBhY2thZ2UncyBjb25maWd1cmF0aW9uLiBXaWxsIGJlIG92ZXJyaWRlblxuICAgICAqIGJ5IHRoZSBpbnN0YW5jZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWdDaGFySGVpZ2h0ID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjaGFyIHdpZHRoIG9mIHRoZSBjdXJyZW50IE1pbmltYXAsIHdpbGwgYmUgYHVuZGVmaW5lZGAgdW5sZXNzXG4gICAgICogYHNldENoYXJXaWR0aGAgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNoYXJXaWR0aCA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgY2hhciB3aWR0aCBmcm9tIHRoZSBwYWNrYWdlJ3MgY29uZmlndXJhdGlvbi4gV2lsbCBiZSBvdmVycmlkZW5cbiAgICAgKiBieSB0aGUgaW5zdGFuY2UgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnQ2hhcldpZHRoID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBpbnRlcmxpbmUgb2YgdGhlIGN1cnJlbnQgTWluaW1hcCwgd2lsbCBiZSBgdW5kZWZpbmVkYCB1bmxlc3NcbiAgICAgKiBgc2V0Q2hhcldpZHRoYCBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaW50ZXJsaW5lID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBpbnRlcmxpbmUgZnJvbSB0aGUgcGFja2FnZSdzIGNvbmZpZ3VyYXRpb24uIFdpbGwgYmUgb3ZlcnJpZGVuXG4gICAgICogYnkgdGhlIGluc3RhbmNlIHZhbHVlLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZ0ludGVybGluZSA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIG9mIHRoZSBjdXJyZW50IE1pbmltYXAsIHdpbGwgYmVcbiAgICAgKiBgdW5kZWZpbmVkYCB1bmxlc3MgYHNldERldmljZVBpeGVsUmF0aW9Sb3VuZGluZ2AgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyBmcm9tIHRoZSBwYWNrYWdlJ3MgY29uZmlndXJhdGlvbi5cbiAgICAgKiBXaWxsIGJlIG92ZXJyaWRlbiBieSB0aGUgaW5zdGFuY2UgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZ0RldmljZVBpeGVsUmF0aW9Sb3VuZGluZyA9IG51bGxcbiAgICAvKipcbiAgICAvKipcbiAgICAgKiBBIGJvb2xlYW4gdmFsdWUgdG8gc3RvcmUgd2hldGhlciB0aGlzIE1pbmltYXAgaGF2ZSBiZWVuIGRlc3Ryb3llZCBvciBub3QuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgLyoqXG4gICAgICogQSBib29sZWFuIHZhbHVlIHRvIHN0b3JlIHdoZXRoZXIgdGhlIGBzY3JvbGxQYXN0RW5kYCBzZXR0aW5nIGlzIGVuYWJsZWRcbiAgICAgKiBvciBub3QuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnNjcm9sbFBhc3RFbmQgPSBmYWxzZVxuXG4gICAgdGhpcy5pbml0aWFsaXplRGVjb3JhdGlvbnMoKVxuXG4gICAgaWYgKGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLnRleHRFZGl0b3IpLmdldFNjcm9sbFRvcCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmFkYXB0ZXIgPSBuZXcgU3RhYmxlQWRhcHRlcih0aGlzLnRleHRFZGl0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRhcHRlciA9IG5ldyBMZWdhY3lBZGF0ZXIodGhpcy50ZXh0RWRpdG9yKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YW5kQWxvbmUpIHtcbiAgICAgIC8qKlxuICAgICAgICogV2hlbiBpbiBzdGFuZC1hbG9uZSBtb2RlLCBhIE1pbmltYXAgZG9lc24ndCBzY3JvbGwgYW5kIHdpbGwgdXNlIHRoaXNcbiAgICAgICAqIHZhbHVlIGluc3RlYWQuXG4gICAgICAgKlxuICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAgICovXG4gICAgICB0aGlzLnNjcm9sbFRvcCA9IDBcbiAgICB9XG5cbiAgICBsZXQgc3VicyA9IHRoaXMuc3Vic2NyaXB0aW9uc1xuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgKHNjcm9sbFBhc3RFbmQpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsUGFzdEVuZCA9IHNjcm9sbFBhc3RFbmRcbiAgICAgIHRoaXMuYWRhcHRlci5zY3JvbGxQYXN0RW5kID0gdGhpcy5zY3JvbGxQYXN0RW5kXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuY2hhckhlaWdodCcsIChjb25maWdDaGFySGVpZ2h0KSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ0NoYXJIZWlnaHQgPSBjb25maWdDaGFySGVpZ2h0XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuY2hhcldpZHRoJywgKGNvbmZpZ0NoYXJXaWR0aCkgPT4ge1xuICAgICAgdGhpcy5jb25maWdDaGFyV2lkdGggPSBjb25maWdDaGFyV2lkdGhcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5pbnRlcmxpbmUnLCAoY29uZmlnSW50ZXJsaW5lKSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ0ludGVybGluZSA9IGNvbmZpZ0ludGVybGluZVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcbiAgICAvLyBjZHByciBpcyBzaG9ydGhhbmQgZm9yIGNvbmZpZ0RldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnbWluaW1hcC5kZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcnLFxuICAgICAgKGNkcHJyKSA9PiB7XG4gICAgICAgIHRoaXMuY29uZmlnRGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nID0gY2RwcnJcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICAgIH1cbiAgICApKVxuXG4gICAgc3Vicy5hZGQodGhpcy5hZGFwdGVyLm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNjcm9sbC10b3AnLCB0aGlzKVxuICAgICAgfVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKHRoaXMuYWRhcHRlci5vbkRpZENoYW5nZVNjcm9sbExlZnQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnN0YW5kQWxvbmUpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc2Nyb2xsLWxlZnQnLCB0aGlzKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgc3Vicy5hZGQodGhpcy50ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlKChjaGFuZ2VzKSA9PiB7XG4gICAgICB0aGlzLmVtaXRDaGFuZ2VzKGNoYW5nZXMpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQodGhpcy50ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7IHRoaXMuZGVzdHJveSgpIH0pKVxuXG4gICAgLypcbiAgICBGSVhNRSBTb21lIGNoYW5nZXMgb2NjdXJpbmcgZHVyaW5nIHRoZSB0b2tlbml6YXRpb24gcHJvZHVjZXNcbiAgICByYW5nZXMgdGhhdCBkZWNlaXZlIHRoZSBjYW52YXMgcmVuZGVyaW5nIGJ5IG1ha2luZyBzb21lXG4gICAgbGluZXMgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGludGFjdCB3aGlsZSB0aGV5IGFyZSBpbiBmYWN0IG5vdCxcbiAgICByZXN1bHRpbmcgaW4gZXh0cmEgbGluZXMgYXBwZWFyaW5nIGF0IHRoZSBlbmQgb2YgdGhlIG1pbmltYXAuXG4gICAgRm9yY2luZyBhIHdob2xlIHJlcGFpbnQgdG8gZml4IHRoYXQgYnVnIGlzIHN1Ym9wdGltYWwgYnV0IHdvcmtzLlxuICAgICovXG4gICAgc3Vicy5hZGQodGhpcy50ZXh0RWRpdG9yLmRpc3BsYXlCdWZmZXIub25EaWRUb2tlbml6ZSgoKSA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBtb2RlbC5cbiAgICovXG4gIGRlc3Ryb3kgKCkge1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5yZW1vdmVBbGxEZWNvcmF0aW9ucygpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLnRleHRFZGl0b3IgPSBudWxsXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGlzIGBNaW5pbWFwYCBoYXMgYmVubiBkZXN0cm95ZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhpcyBNaW5pbWFwIGhhcyBiZWVuIGRlc3Ryb3llZCBvciBub3RcbiAgICovXG4gIGlzRGVzdHJveWVkICgpIHsgcmV0dXJuIHRoaXMuZGVzdHJveWVkIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZWAgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggYW4gZXZlbnQgb2JqZWN0IHdpdGhcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gc3RhcnQ6IFRoZSBjaGFuZ2UncyBzdGFydCByb3cgbnVtYmVyXG4gICAqIC0gZW5kOiBUaGUgY2hhbmdlJ3MgZW5kIHJvdyBudW1iZXJcbiAgICogLSBzY3JlZW5EZWx0YTogdGhlIGRlbHRhIGluIGJ1ZmZlciByb3dzIGJldHdlZW4gdGhlIHZlcnNpb25zIGJlZm9yZSBhbmRcbiAgICogICBhZnRlciB0aGUgY2hhbmdlXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLWNvbmZpZ2AgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGV2ZW50XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgdHJpZ2dlcmVkLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZUNvbmZpZyAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWNvbmZpZycsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2Utc2Nyb2xsLXRvcGAgZXZlbnQuXG4gICAqXG4gICAqIFRoZSBldmVudCBpcyBkaXNwYXRjaGVkIHdoZW4gdGhlIHRleHQgZWRpdG9yIGBzY3JvbGxUb3BgIHZhbHVlIGhhdmUgYmVlblxuICAgKiBjaGFuZ2VkIG9yIHdoZW4gdGhlIG1pbmltYXAgc2Nyb2xsIHRvcCBoYXZlIGJlZW4gY2hhbmdlZCBpbiBzdGFuZC1hbG9uZVxuICAgKiBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihtaW5pbWFwOk1pbmltYXApOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY3VycmVudCBNaW5pbWFwIGlzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIGFzIGFyZ3VtZW50IHRvXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZVNjcm9sbFRvcCAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXNjcm9sbC10b3AnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLXNjcm9sbC1sZWZ0YCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24obWluaW1hcDpNaW5pbWFwKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGN1cnJlbnQgTWluaW1hcCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlZCBhcyBhcmd1bWVudCB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VTY3JvbGxMZWZ0IChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utc2Nyb2xsLWxlZnQnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLXN0YW5kLWFsb25lYCBldmVudC5cbiAgICpcbiAgICogVGhpcyBldmVudCBpcyBkaXNwYXRjaGVkIHdoZW4gdGhlIHN0YW5kLWFsb25lIG9mIHRoZSBjdXJyZW50IE1pbmltYXBcbiAgICogaXMgZWl0aGVyIGVuYWJsZWQgb3IgZGlzYWJsZWQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKG1pbmltYXA6TWluaW1hcCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjdXJyZW50IE1pbmltYXAgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzZWQgYXMgYXJndW1lbnQgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlU3RhbmRBbG9uZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXN0YW5kLWFsb25lJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWRlc3Ryb3lgIGV2ZW50LlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IGlzIGRpc3BhdGNoZWQgd2hlbiB0aGlzIE1pbmltYXAgaGF2ZSBiZWVuIGRlc3Ryb3llZC4gSXQgY2FuXG4gICAqIG9jY3VycyBlaXRoZXIgYmVjYXVzZSB0aGUge0BsaW5rIGRlc3Ryb3l9IG1ldGhvZCBoYXZlIGJlZW4gY2FsbGVkIG9uIHRoZVxuICAgKiBNaW5pbWFwIG9yIGJlY2F1c2UgdGhlIHRhcmdldCB0ZXh0IGVkaXRvciBoYXZlIGJlZW4gZGVzdHJveWVkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbigpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBldmVudFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzIHRyaWdnZXJlZC5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWREZXN0cm95IChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgY3VycmVudCBNaW5pbWFwIGlzIGEgc3RhbmQtYWxvbmUgbWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGlzIE1pbmltYXAgaXMgaW4gc3RhbmQtYWxvbmUgbW9kZSBvciBub3QuXG4gICAqL1xuICBpc1N0YW5kQWxvbmUgKCkgeyByZXR1cm4gdGhpcy5zdGFuZEFsb25lIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3RhbmQtYWxvbmUgbW9kZSBmb3IgdGhpcyBtaW5pbWFwLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0YW5kQWxvbmUgdGhlIG5ldyBzdGF0ZSBvZiB0aGUgc3RhbmQtYWxvbmUgbW9kZSBmb3IgdGhpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2Utc3RhbmQtYWxvbmV9IGlmIHRoZSBzdGFuZC1hbG9uZSBtb2RlIGhhdmUgYmVlbiB0b2dnbGVkXG4gICAqICAgICAgICBvbiBvciBvZmYgYnkgdGhlIGNhbGxcbiAgICovXG4gIHNldFN0YW5kQWxvbmUgKHN0YW5kQWxvbmUpIHtcbiAgICBpZiAoc3RhbmRBbG9uZSAhPT0gdGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICB0aGlzLnN0YW5kQWxvbmUgPSBzdGFuZEFsb25lXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zdGFuZC1hbG9uZScsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCB0aGF0IHRoaXMgbWluaW1hcCByZXByZXNlbnRzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtUZXh0RWRpdG9yfSB0aGlzIE1pbmltYXAncyB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvciAoKSB7IHJldHVybiB0aGlzLnRleHRFZGl0b3IgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIGBUZXh0RWRpdG9yYCBhdCB0aGUgTWluaW1hcCBzY2FsZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2NhbGVkIGhlaWdodCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0SGVpZ2h0KCkgKiB0aGlzLmdldFZlcnRpY2FsU2NhbGVGYWN0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgdG9wIHZhbHVlIGF0IHRoZSBNaW5pbWFwIHNjYWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY2FsZWQgc2Nyb2xsIHRvcCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY2FsZWRTY3JvbGxUb3AgKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsVG9wKCkgKiB0aGlzLmdldFZlcnRpY2FsU2NhbGVGYWN0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgbGVmdCB2YWx1ZSBhdCB0aGUgTWluaW1hcCBzY2FsZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2NhbGVkIHNjcm9sbCBsZWZ0IG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjYWxlZFNjcm9sbExlZnQgKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsTGVmdCgpICogdGhpcy5nZXRIb3Jpem9udGFsU2NhbGVGYWN0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBtYXhpbXVtIHNjcm9sbCB0b3AgdmFsdWUuXG4gICAqXG4gICAqIFdoZW4gdGhlIGBzY3JvbGxQYXN0RW5kYCBzZXR0aW5nIGlzIGVuYWJsZWQsIHRoZSBtZXRob2QgY29tcGVuc2F0ZSB0aGVcbiAgICogZXh0cmEgc2Nyb2xsIGJ5IHJlbW92aW5nIHRoZSBzYW1lIGhlaWdodCBhcyBhZGRlZCBieSB0aGUgZWRpdG9yIGZyb20gdGhlXG4gICAqIGZpbmFsIHZhbHVlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBtYXhpbXVtIHNjcm9sbCB0b3Agb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yTWF4U2Nyb2xsVG9wICgpIHsgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRNYXhTY3JvbGxUb3AoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgdG9wIHZhbHVlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgdG9wIG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjcm9sbFRvcCAoKSB7IHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsVG9wKCkgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzY3JvbGwgdG9wIG9mIHRoZSBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzY3JvbGxUb3AgdGhlIG5ldyBzY3JvbGwgdG9wIHZhbHVlXG4gICAqL1xuICBzZXRUZXh0RWRpdG9yU2Nyb2xsVG9wIChzY3JvbGxUb3ApIHsgdGhpcy5hZGFwdGVyLnNldFNjcm9sbFRvcChzY3JvbGxUb3ApIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCBsZWZ0IHZhbHVlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgbGVmdCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY3JvbGxMZWZ0ICgpIHsgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTY3JvbGxMZWZ0KCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaGVpZ2h0IG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvckhlaWdodCAoKSB7IHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0SGVpZ2h0KCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIGFzIGEgdmFsdWUgbm9ybWFsaXplZCBiZXR3ZWVuIGAwYCBhbmQgYDFgLlxuICAgKlxuICAgKiBXaGVuIHRoZSBgc2Nyb2xsUGFzdEVuZGAgc2V0dGluZyBpcyBlbmFibGVkIHRoZSB2YWx1ZSBtYXkgZXhjZWVkIGAxYCBhcyB0aGVcbiAgICogbWF4aW11bSBzY3JvbGwgdmFsdWUgdXNlZCB0byBjb21wdXRlIHRoaXMgcmF0aW8gY29tcGVuc2F0ZSBmb3IgdGhlIGV4dHJhXG4gICAqIGhlaWdodCBpbiB0aGUgZWRpdG9yLiAqKlVzZSB7QGxpbmsgZ2V0Q2FwZWRUZXh0RWRpdG9yU2Nyb2xsUmF0aW99IHdoZW5cbiAgICogeW91IG5lZWQgYSB2YWx1ZSB0aGF0IGlzIHN0cmljdGx5IGJldHdlZW4gYDBgIGFuZCBgMWAuKipcbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIHJhdGlvIG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjcm9sbFJhdGlvICgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbFRvcCgpIC8gKHRoaXMuZ2V0VGV4dEVkaXRvck1heFNjcm9sbFRvcCgpIHx8IDEpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCBhcyBhIHZhbHVlIG5vcm1hbGl6ZWQgYmV0d2VlbiBgMGAgYW5kIGAxYC5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIHZhbHVlIHdpbGwgYWx3YXlzIGJlIHN0cmljdGx5IGJldHdlZW4gYDBgIGFuZCBgMWAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCByYXRpbyBvZiB0aGUgdGV4dCBlZGl0b3Igc3RyaWN0bHkgYmV0d2VlblxuICAgKiAgICAgICAgICAgICAgICAgIDAgYW5kIDFcbiAgICovXG4gIGdldENhcGVkVGV4dEVkaXRvclNjcm9sbFJhdGlvICgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4oMSwgdGhpcy5nZXRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8oKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIHdob2xlIG1pbmltYXAgaW4gcGl4ZWxzIGJhc2VkIG9uIHRoZSBgbWluaW1hcGBcbiAgICogc2V0dGluZ3MuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGhlaWdodCBvZiB0aGUgbWluaW1hcFxuICAgKi9cbiAgZ2V0SGVpZ2h0ICgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpICogdGhpcy5nZXRMaW5lSGVpZ2h0KClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aWR0aCBvZiB0aGUgd2hvbGUgbWluaW1hcCBpbiBwaXhlbHMgYmFzZWQgb24gdGhlIGBtaW5pbWFwYFxuICAgKiBzZXR0aW5ncy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgd2lkdGggb2YgdGhlIG1pbmltYXBcbiAgICovXG4gIGdldFdpZHRoICgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLmdldE1heFNjcmVlbkxpbmVMZW5ndGgoKSAqIHRoaXMuZ2V0Q2hhcldpZHRoKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgdGhlIE1pbmltYXAgY29udGVudCB3aWxsIHRha2Ugb24gc2NyZWVuLlxuICAgKlxuICAgKiBXaGVuIHRoZSBNaW5pbWFwIGhlaWdodCBpcyBncmVhdGVyIHRoYW4gdGhlIGBUZXh0RWRpdG9yYCBoZWlnaHQsIHRoZVxuICAgKiBgVGV4dEVkaXRvcmAgaGVpZ2h0IGlzIHJldHVybmVkIGluc3RlYWQuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHZpc2libGUgaGVpZ2h0IG9mIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRWaXNpYmxlSGVpZ2h0ICgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4odGhpcy5nZXRTY3JlZW5IZWlnaHQoKSwgdGhpcy5nZXRIZWlnaHQoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgdGhlIG1pbmltYXAgc2hvdWxkIHRha2Ugb25jZSBkaXNwbGF5ZWQsIGl0J3MgZWl0aGVyXG4gICAqIHRoZSBoZWlnaHQgb2YgdGhlIGBUZXh0RWRpdG9yYCBvciB0aGUgcHJvdmlkZWQgYGhlaWdodGAgd2hlbiBpbiBzdGFuZC1hbG9uZVxuICAgKiBtb2RlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldFNjcmVlbkhlaWdodCAoKSB7XG4gICAgaWYgKHRoaXMuaXNTdGFuZEFsb25lKCkpIHtcbiAgICAgIGlmICh0aGlzLmhlaWdodCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SGVpZ2h0KClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRIZWlnaHQoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aWR0aCB0aGUgd2hvbGUgTWluaW1hcCB3aWxsIHRha2Ugb24gc2NyZWVuLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB3aWR0aCBvZiB0aGUgTWluaW1hcCB3aGVuIGRpc3BsYXllZFxuICAgKi9cbiAgZ2V0VmlzaWJsZVdpZHRoICgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4odGhpcy5nZXRTY3JlZW5XaWR0aCgpLCB0aGlzLmdldFdpZHRoKCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggdGhlIE1pbmltYXAgc2hvdWxkIHRha2Ugb25jZSBkaXNwbGF5ZWQsIGl0J3MgZWl0aGVyIHRoZVxuICAgKiB3aWR0aCBvZiB0aGUgTWluaW1hcCBjb250ZW50IG9yIHRoZSBwcm92aWRlZCBgd2lkdGhgIHdoZW4gaW4gc3RhbmRBbG9uZVxuICAgKiBtb2RlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBNaW5pbWFwIHNjcmVlbiB3aWR0aFxuICAgKi9cbiAgZ2V0U2NyZWVuV2lkdGggKCkge1xuICAgIGlmICh0aGlzLmlzU3RhbmRBbG9uZSgpICYmIHRoaXMud2lkdGggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMud2lkdGhcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0V2lkdGgoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwcmVmZXJyZWQgaGVpZ2h0IGFuZCB3aWR0aCB3aGVuIGluIHN0YW5kLWFsb25lIG1vZGUuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgPE1pbmltYXBFbGVtZW50PiBmb3IgdGhpcyBNaW5pbWFwIHNvIHRoYXRcbiAgICogdGhlIG1vZGVsIGlzIGtlcHQgaW4gc3luYyB3aXRoIHRoZSB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IHRoZSBuZXcgaGVpZ2h0IG9mIHRoZSBNaW5pbWFwXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB0aGUgbmV3IHdpZHRoIG9mIHRoZSBNaW5pbWFwXG4gICAqL1xuICBzZXRTY3JlZW5IZWlnaHRBbmRXaWR0aCAoaGVpZ2h0LCB3aWR0aCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmVydGljYWwgc2NhbGluZyBmYWN0b3Igd2hlbiBjb252ZXJ0aW5nIGNvb3JkaW5hdGVzIGZyb20gdGhlXG4gICAqIGBUZXh0RWRpdG9yYCB0byB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgTWluaW1hcCB2ZXJ0aWNhbCBzY2FsaW5nIGZhY3RvclxuICAgKi9cbiAgZ2V0VmVydGljYWxTY2FsZUZhY3RvciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGluZUhlaWdodCgpIC8gdGhpcy50ZXh0RWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaG9yaXpvbnRhbCBzY2FsaW5nIGZhY3RvciB3aGVuIGNvbnZlcnRpbmcgY29vcmRpbmF0ZXMgZnJvbSB0aGVcbiAgICogYFRleHRFZGl0b3JgIHRvIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBNaW5pbWFwIGhvcml6b250YWwgc2NhbGluZyBmYWN0b3JcbiAgICovXG4gIGdldEhvcml6b250YWxTY2FsZUZhY3RvciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hhcldpZHRoKCkgLyB0aGlzLnRleHRFZGl0b3IuZ2V0RGVmYXVsdENoYXJXaWR0aCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIGEgbGluZSBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gYSBsaW5lJ3MgaGVpZ2h0IGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRMaW5lSGVpZ2h0ICgpIHsgcmV0dXJuIHRoaXMuZ2V0Q2hhckhlaWdodCgpICsgdGhpcy5nZXRJbnRlcmxpbmUoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIG9mIGEgY2hhcmFjdGVyIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSBhIGNoYXJhY3RlcidzIHdpZHRoIGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRDaGFyV2lkdGggKCkge1xuICAgIGlmICh0aGlzLmNoYXJXaWR0aCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFyV2lkdGhcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnQ2hhcldpZHRoXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNoYXIgd2lkdGggZm9yIHRoaXMgTWluaW1hcC4gVGhpcyB2YWx1ZSB3aWxsIG92ZXJyaWRlIHRoZVxuICAgKiB2YWx1ZSBmcm9tIHRoZSBjb25maWcgZm9yIHRoaXMgaW5zdGFuY2Ugb25seS4gQSBgZGlkLWNoYW5nZS1jb25maWdgXG4gICAqIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjaGFyV2lkdGggdGhlIG5ldyB3aWR0aCBvZiBhIGNoYXIgaW4gdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLWNvbmZpZ30gd2hlbiB0aGUgdmFsdWUgaXMgY2hhbmdlZFxuICAgKi9cbiAgc2V0Q2hhcldpZHRoIChjaGFyV2lkdGgpIHtcbiAgICB0aGlzLmNoYXJXaWR0aCA9IE1hdGguZmxvb3IoY2hhcldpZHRoKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIGEgY2hhcmFjdGVyIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSBhIGNoYXJhY3RlcidzIGhlaWdodCBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0Q2hhckhlaWdodCAoKSB7XG4gICAgaWYgKHRoaXMuY2hhckhlaWdodCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFySGVpZ2h0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0NoYXJIZWlnaHRcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2hhciBoZWlnaHQgZm9yIHRoaXMgTWluaW1hcC4gVGhpcyB2YWx1ZSB3aWxsIG92ZXJyaWRlIHRoZVxuICAgKiB2YWx1ZSBmcm9tIHRoZSBjb25maWcgZm9yIHRoaXMgaW5zdGFuY2Ugb25seS4gQSBgZGlkLWNoYW5nZS1jb25maWdgXG4gICAqIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjaGFySGVpZ2h0IHRoZSBuZXcgaGVpZ2h0IG9mIGEgY2hhciBpbiB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2UtY29uZmlnfSB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBzZXRDaGFySGVpZ2h0IChjaGFySGVpZ2h0KSB7XG4gICAgdGhpcy5jaGFySGVpZ2h0ID0gTWF0aC5mbG9vcihjaGFySGVpZ2h0KVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIGFuIGludGVybGluZSBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGludGVybGluZSdzIGhlaWdodCBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0SW50ZXJsaW5lICgpIHtcbiAgICBpZiAodGhpcy5pbnRlcmxpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJsaW5lXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0ludGVybGluZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBpbnRlcmxpbmUgaGVpZ2h0IGZvciB0aGlzIE1pbmltYXAuIFRoaXMgdmFsdWUgd2lsbCBvdmVycmlkZSB0aGVcbiAgICogdmFsdWUgZnJvbSB0aGUgY29uZmlnIGZvciB0aGlzIGluc3RhbmNlIG9ubHkuIEEgYGRpZC1jaGFuZ2UtY29uZmlnYFxuICAgKiBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gaW50ZXJsaW5lIHRoZSBuZXcgaGVpZ2h0IG9mIGFuIGludGVybGluZSBpbiB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2UtY29uZmlnfSB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBzZXRJbnRlcmxpbmUgKGludGVybGluZSkge1xuICAgIHRoaXMuaW50ZXJsaW5lID0gTWF0aC5mbG9vcihpbnRlcmxpbmUpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdGF0dXMgb2YgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIGluIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0aGUgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIHN0YXR1cyBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nICgpIHtcbiAgICBpZiAodGhpcy5kZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0RldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgc3RhdHVzIGZvciB0aGlzIE1pbmltYXAuXG4gICAqIFRoaXMgdmFsdWUgd2lsbCBvdmVycmlkZSB0aGUgdmFsdWUgZnJvbSB0aGUgY29uZmlnIGZvciB0aGlzIGluc3RhbmNlIG9ubHkuXG4gICAqIEEgYGRpZC1jaGFuZ2UtY29uZmlnYCBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyB0aGUgbmV3IHN0YXR1cyBvZlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4gdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLWNvbmZpZ30gd2hlbiB0aGUgdmFsdWUgaXMgY2hhbmdlZFxuICAgKi9cbiAgc2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIChkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcpIHtcbiAgICB0aGlzLmRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyA9IGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGV2aWNlUGl4ZWxSYXRpbyBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGRldmljZVBpeGVsUmF0aW8gaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldERldmljZVBpeGVsUmF0aW8gKCkge1xuICAgIHJldHVybiB0aGlzLmdldERldmljZVBpeGVsUmF0aW9Sb3VuZGluZygpXG4gICAgICA/IE1hdGguZmxvb3IoZGV2aWNlUGl4ZWxSYXRpbylcbiAgICAgIDogZGV2aWNlUGl4ZWxSYXRpb1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCB2aXNpYmxlIHJvdyBpbiB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IHZpc2libGUgcm93XG4gICAqL1xuICBnZXRGaXJzdFZpc2libGVTY3JlZW5Sb3cgKCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2V0U2Nyb2xsVG9wKCkgLyB0aGlzLmdldExpbmVIZWlnaHQoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbGFzdCB2aXNpYmxlIHJvdyBpbiB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW5kZXggb2YgdGhlIGxhc3QgdmlzaWJsZSByb3dcbiAgICovXG4gIGdldExhc3RWaXNpYmxlU2NyZWVuUm93ICgpIHtcbiAgICByZXR1cm4gTWF0aC5jZWlsKFxuICAgICAgKHRoaXMuZ2V0U2Nyb2xsVG9wKCkgKyB0aGlzLmdldFNjcmVlbkhlaWdodCgpKSAvIHRoaXMuZ2V0TGluZUhlaWdodCgpXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgc2Nyb2xsIG9mIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBUaGUgTWluaW1hcCBjYW4gc2Nyb2xsIG9ubHkgd2hlbiBpdHMgaGVpZ2h0IGlzIGdyZWF0ZXIgdGhhdCB0aGUgaGVpZ2h0XG4gICAqIG9mIGl0cyBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCB0b3Agb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldFNjcm9sbFRvcCAoKSB7XG4gICAgaWYgKHRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9wXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNYXRoLmFicyhcbiAgICAgICAgdGhpcy5nZXRDYXBlZFRleHRFZGl0b3JTY3JvbGxSYXRpbygpICogdGhpcy5nZXRNYXhTY3JvbGxUb3AoKVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtaW5pbWFwIHNjcm9sbCB0b3AgdmFsdWUgd2hlbiBpbiBzdGFuZC1hbG9uZSBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2Nyb2xsVG9wIHRoZSBuZXcgc2Nyb2xsIHRvcCBmb3IgdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLXNjcm9sbC10b3B9IGlmIHRoZSBNaW5pbWFwJ3Mgc3RhbmQtYWxvbmUgbW9kZSBpcyBlbmFibGVkXG4gICAqL1xuICBzZXRTY3JvbGxUb3AgKHNjcm9sbFRvcCkge1xuICAgIHRoaXMuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wXG4gICAgaWYgKHRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcCcsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1heGltdW0gc2Nyb2xsIHZhbHVlIG9mIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBtYXhpbXVtIHNjcm9sbCB0b3AgZm9yIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRNYXhTY3JvbGxUb3AgKCkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCB0aGlzLmdldEhlaWdodCgpIC0gdGhpcy5nZXRTY3JlZW5IZWlnaHQoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBNaW5pbWFwIGNhbiBzY3JvbGwuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhpcyBNaW5pbWFwIGNhbiBzY3JvbGwgb3Igbm90XG4gICAqL1xuICBjYW5TY3JvbGwgKCkgeyByZXR1cm4gdGhpcy5nZXRNYXhTY3JvbGxUb3AoKSA+IDAgfVxuXG4gIC8qKlxuICAgKiBEZWxlZ2F0ZXMgdG8gYFRleHRFZGl0b3IjZ2V0TWFya2VyYC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBnZXRNYXJrZXIgKGlkKSB7IHJldHVybiB0aGlzLnRleHRFZGl0b3IuZ2V0TWFya2VyKGlkKSB9XG5cbiAgLyoqXG4gICAqIERlbGVnYXRlcyB0byBgVGV4dEVkaXRvciNmaW5kTWFya2Vyc2AuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZmluZE1hcmtlcnMgKG8pIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5maW5kTWFya2VycyhvKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVsZWdhdGVzIHRvIGBUZXh0RWRpdG9yI21hcmtCdWZmZXJSYW5nZWAuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgbWFya0J1ZmZlclJhbmdlIChyYW5nZSkgeyByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyYW5nZSkgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyBhIGNoYW5nZSBldmVudHMgd2l0aCB0aGUgcGFzc2VkLWluIGNoYW5nZXMgYXMgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBjaGFuZ2VzIGEgY2hhbmdlIHRvIGRpc3BhdGNoXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZW1pdENoYW5nZXMgKGNoYW5nZXMpIHsgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UnLCBjaGFuZ2VzKSB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdGhlIGNhY2hlIGF0IHRoZSBhZGFwdGVyIGxldmVsIHRvIGF2b2lkIGNvbnNlY3V0aXZlIGFjY2VzcyB0byB0aGVcbiAgICogdGV4dCBlZGl0b3IgQVBJIGR1cmluZyBhIHJlbmRlciBwaGFzZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBlbmFibGVDYWNoZSAoKSB7IHRoaXMuYWRhcHRlci5lbmFibGVDYWNoZSgpIH1cblxuICAvKipcbiAgICogRGlzYWJsZSB0aGUgYWRhcHRlciBjYWNoZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjbGVhckNhY2hlICgpIHsgdGhpcy5hZGFwdGVyLmNsZWFyQ2FjaGUoKSB9XG5cbn1cbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap.js

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

    /**
     * When in stand-alone or independent scrolling mode, this value can be used
     * instead of the computed scroll.
     *
     * @type {number}
     * @access private
     */
    this.scrollTop = 0;

    var subs = this.subscriptions;
    var configSubscription = this.subscribeToConfig();

    subs.add(configSubscription);

    subs.add(this.textEditor.onDidChangeGrammar(function () {
      subs.remove(configSubscription);
      configSubscription.dispose();

      configSubscription = _this.subscribeToConfig();
      subs.add(configSubscription);
    }));

    subs.add(this.adapter.onDidChangeScrollTop(function () {
      if (!_this.standAlone && !_this.ignoreTextEditorScroll && !_this.inChangeScrollTop) {
        _this.inChangeScrollTop = true;
        _this.updateScrollTop();
        _this.emitter.emit('did-change-scroll-top', _this);
        _this.inChangeScrollTop = false;
      }

      if (_this.ignoreTextEditorScroll) {
        _this.ignoreTextEditorScroll = false;
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
    var tokenizedBuffer = this.textEditor.tokenizedBuffer ? this.textEditor.tokenizedBuffer : this.textEditor.displayBuffer.tokenizedBuffer;

    subs.add(tokenizedBuffer.onDidTokenize(function () {
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
     * Registers to the config changes for the current editor scope.
     *
     * @return {Disposable} the disposable to dispose all the registered events
     * @access private
     */
  }, {
    key: 'subscribeToConfig',
    value: function subscribeToConfig() {
      var _this2 = this;

      var subs = new _atom.CompositeDisposable();
      var opts = { scope: this.textEditor.getRootScopeDescriptor() };

      subs.add(atom.config.observe('editor.scrollPastEnd', opts, function (scrollPastEnd) {
        _this2.scrollPastEnd = scrollPastEnd;
        _this2.adapter.scrollPastEnd = _this2.scrollPastEnd;
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.charHeight', opts, function (configCharHeight) {
        _this2.configCharHeight = configCharHeight;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.charWidth', opts, function (configCharWidth) {
        _this2.configCharWidth = configCharWidth;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.interline', opts, function (configInterline) {
        _this2.configInterline = configInterline;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.independentMinimapScroll', opts, function (independentMinimapScroll) {
        _this2.independentMinimapScroll = independentMinimapScroll;
        _this2.updateScrollTop();
      }));
      subs.add(atom.config.observe('minimap.scrollSensitivity', opts, function (scrollSensitivity) {
        _this2.scrollSensitivity = scrollSensitivity;
      }));
      // cdprr is shorthand for configDevicePixelRatioRounding
      subs.add(atom.config.observe('minimap.devicePixelRatioRounding', opts, function (cdprr) {
        _this2.configDevicePixelRatioRounding = cdprr;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));

      return subs;
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
      var ignoreTextEditorScroll = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.ignoreTextEditorScroll = ignoreTextEditorScroll;
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
      this.updateScrollTop();
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
     * Returns true when the `independentMinimapScroll` setting have been enabled.
     *
     * @return {boolean} whether the minimap can scroll independently
     */
  }, {
    key: 'scrollIndependentlyOnMouseWheel',
    value: function scrollIndependentlyOnMouseWheel() {
      return this.independentMinimapScroll;
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
      return this.standAlone || this.independentMinimapScroll ? this.scrollTop : this.getScrollTopFromEditor();
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
      this.scrollTop = Math.max(0, Math.min(this.getMaxScrollTop(), scrollTop));

      if (this.standAlone || this.independentMinimapScroll) {
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the minimap scroll as a ration between 0 and 1.
     *
     * @return {number} the minimap scroll ratio
     */
  }, {
    key: 'getScrollRatio',
    value: function getScrollRatio() {
      return this.getScrollTop() / this.getMaxScrollTop();
    }

    /**
     * Updates the scroll top value with the one computed from the text editor
     * when the minimap is in the independent scrolling mode.
     *
     * @access private
     */
  }, {
    key: 'updateScrollTop',
    value: function updateScrollTop() {
      if (this.independentMinimapScroll) {
        this.setScrollTop(this.getScrollTopFromEditor());
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the scroll top as computed from the text editor scroll top.
     *
     * @return {number} the computed scroll top value
     */
  }, {
    key: 'getScrollTopFromEditor',
    value: function getScrollTopFromEditor() {
      return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
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
     * Updates the minimap scroll top value using a mouse event when the
     * independent scrolling mode is enabled
     *
     * @param  {MouseEvent} event the mouse wheel event
     * @access private
     */
  }, {
    key: 'onMouseWheel',
    value: function onMouseWheel(event) {
      if (!this.canScroll()) {
        return;
      }

      var wheelDeltaY = event.wheelDeltaY;

      var previousScrollTop = this.getScrollTop();
      var updatedScrollTop = previousScrollTop - Math.round(wheelDeltaY * this.scrollSensitivity);

      event.preventDefault();
      this.setScrollTop(updatedScrollTop);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7aUNBQzdCLHNCQUFzQjs7OzswQ0FDVCxnQ0FBZ0M7Ozs7cUNBQ3hDLDJCQUEyQjs7OztxQ0FDMUIsMkJBQTJCOzs7O0FBTnJELFdBQVcsQ0FBQTs7QUFRWCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUE7Ozs7Ozs7Ozs7O0lBV0UsT0FBTzs7Ozs7Ozs7Ozs7Ozs7QUFhZCxXQWJPLE9BQU8sR0FhQzs7O1FBQWQsT0FBTyx5REFBRyxFQUFFOzs7O0FBQ3ZCLFFBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQ3ZCLFlBQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtLQUM3RDs7Ozs7Ozs7QUFRRCxRQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUE7Ozs7Ozs7QUFPcEMsUUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFBOzs7Ozs7O0FBT3BDLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQTs7Ozs7OztBQU8xQixRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7Ozs7Ozs7QUFPNUIsUUFBSSxDQUFDLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQTs7Ozs7OztBQU92QixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7Ozs7Ozs7QUFPNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7Ozs7Ozs7O0FBUzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBOzs7Ozs7OztBQVFuQixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTs7Ozs7Ozs7QUFRdEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQTs7Ozs7Ozs7QUFRNUIsUUFBSSxD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Ozs7cUJBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvdm1hdWRnYWx5YS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGluY2x1ZGUgZnJvbSAnLi9kZWNvcmF0b3JzL2luY2x1ZGUnXG5pbXBvcnQgRGVjb3JhdGlvbk1hbmFnZW1lbnQgZnJvbSAnLi9taXhpbnMvZGVjb3JhdGlvbi1tYW5hZ2VtZW50J1xuaW1wb3J0IExlZ2FjeUFkYXRlciBmcm9tICcuL2FkYXB0ZXJzL2xlZ2FjeS1hZGFwdGVyJ1xuaW1wb3J0IFN0YWJsZUFkYXB0ZXIgZnJvbSAnLi9hZGFwdGVycy9zdGFibGUtYWRhcHRlcidcblxubGV0IG5leHRNb2RlbElkID0gMVxuXG4vKipcbiAqIFRoZSBNaW5pbWFwIGNsYXNzIGlzIHRoZSB1bmRlcmx5aW5nIG1vZGVsIG9mIGEgPE1pbmltYXBFbGVtZW50Pi5cbiAqIE1vc3QgbWFuaXB1bGF0aW9ucyBvZiB0aGUgbWluaW1hcCBpcyBkb25lIHRocm91Z2ggdGhlIG1vZGVsLlxuICpcbiAqIEFueSBNaW5pbWFwIGluc3RhbmNlIGlzIHRpZWQgdG8gYSBgVGV4dEVkaXRvcmAuXG4gKiBUaGVpciBsaWZlY3ljbGUgZm9sbG93IHRoZSBvbmUgb2YgdGhlaXIgdGFyZ2V0IGBUZXh0RWRpdG9yYCwgc28gdGhleSBhcmVcbiAqIGRlc3Ryb3llZCB3aGVuZXZlciB0aGVpciBgVGV4dEVkaXRvcmAgaXMgZGVzdHJveWVkLlxuICovXG5AaW5jbHVkZShEZWNvcmF0aW9uTWFuYWdlbWVudClcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pbmltYXAge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBNaW5pbWFwIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgYW4gb2JqZWN0IHdpdGggdGhlIG5ldyBNaW5pbWFwIHByb3BlcnRpZXNcbiAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gb3B0aW9ucy50ZXh0RWRpdG9yIHRoZSB0YXJnZXQgdGV4dCBlZGl0b3IgZm9yXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgbWluaW1hcFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBbb3B0aW9ucy5zdGFuZEFsb25lXSB3aGV0aGVyIHRoaXMgbWluaW1hcCBpcyBpblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFuZC1hbG9uZSBtb2RlIG9yIG5vdFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFtvcHRpb25zLndpZHRoXSB0aGUgbWluaW1hcCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbb3B0aW9ucy5oZWlnaHRdIHRoZSBtaW5pbWFwIGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHRocm93cyB7RXJyb3J9IENhbm5vdCBjcmVhdGUgYSBtaW5pbWFwIHdpdGhvdXQgYW4gZWRpdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKCFvcHRpb25zLnRleHRFZGl0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG1pbmltYXAgd2l0aG91dCBhbiBlZGl0b3InKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBNaW5pbWFwJ3MgdGV4dCBlZGl0b3IuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7VGV4dEVkaXRvcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnRleHRFZGl0b3IgPSBvcHRpb25zLnRleHRFZGl0b3JcbiAgICAvKipcbiAgICAgKiBUaGUgc3RhbmQtYWxvbmUgc3RhdGUgb2YgdGhlIGN1cnJlbnQgTWluaW1hcC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc3RhbmRBbG9uZSA9IG9wdGlvbnMuc3RhbmRBbG9uZVxuICAgIC8qKlxuICAgICAqIFRoZSB3aWR0aCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aFxuICAgIC8qKlxuICAgICAqIFRoZSBoZWlnaHQgb2YgdGhlIGN1cnJlbnQgTWluaW1hcC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodFxuICAgIC8qKlxuICAgICAqIFRoZSBpZCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmlkID0gbmV4dE1vZGVsSWQrK1xuICAgIC8qKlxuICAgICAqIFRoZSBldmVudHMgZW1pdHRlciBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge0VtaXR0ZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIC8qKlxuICAgICAqIFRoZSBNaW5pbWFwJ3Mgc3Vic2NyaXB0aW9ucy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtDb21wb3NpdGVEaXNwb3NhYmxlfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAvKipcbiAgICAgKiBUaGUgYWRhcHRlciBvYmplY3QgbGV2ZXJhZ2UgdGhlIGFjY2VzcyB0byBzZXZlcmFsIHByb3BlcnRpZXMgZnJvbVxuICAgICAqIHRoZSBgVGV4dEVkaXRvcmAvYFRleHRFZGl0b3JFbGVtZW50YCB0byBzdXBwb3J0IHRoZSBkaWZmZXJlbnQgQVBJc1xuICAgICAqIGJldHdlZW4gZGlmZmVyZW50IHZlcnNpb24gb2YgQXRvbS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5hZGFwdGVyID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjaGFyIGhlaWdodCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLCB3aWxsIGJlIGB1bmRlZmluZWRgIHVubGVzc1xuICAgICAqIGBzZXRDaGFyV2lkdGhgIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jaGFySGVpZ2h0ID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjaGFyIGhlaWdodCBmcm9tIHRoZSBwYWNrYWdlJ3MgY29uZmlndXJhdGlvbi4gV2lsbCBiZSBvdmVycmlkZW5cbiAgICAgKiBieSB0aGUgaW5zdGFuY2UgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnQ2hhckhlaWdodCA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgY2hhciB3aWR0aCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLCB3aWxsIGJlIGB1bmRlZmluZWRgIHVubGVzc1xuICAgICAqIGBzZXRDaGFyV2lkdGhgIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jaGFyV2lkdGggPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXIgd2lkdGggZnJvbSB0aGUgcGFja2FnZSdzIGNvbmZpZ3VyYXRpb24uIFdpbGwgYmUgb3ZlcnJpZGVuXG4gICAgICogYnkgdGhlIGluc3RhbmNlIHZhbHVlLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZ0NoYXJXaWR0aCA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgaW50ZXJsaW5lIG9mIHRoZSBjdXJyZW50IE1pbmltYXAsIHdpbGwgYmUgYHVuZGVmaW5lZGAgdW5sZXNzXG4gICAgICogYHNldENoYXJXaWR0aGAgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmludGVybGluZSA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgaW50ZXJsaW5lIGZyb20gdGhlIHBhY2thZ2UncyBjb25maWd1cmF0aW9uLiBXaWxsIGJlIG92ZXJyaWRlblxuICAgICAqIGJ5IHRoZSBpbnN0YW5jZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWdJbnRlcmxpbmUgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyBvZiB0aGUgY3VycmVudCBNaW5pbWFwLCB3aWxsIGJlXG4gICAgICogYHVuZGVmaW5lZGAgdW5sZXNzIGBzZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdgIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgZnJvbSB0aGUgcGFja2FnZSdzIGNvbmZpZ3VyYXRpb24uXG4gICAgICogV2lsbCBiZSBvdmVycmlkZW4gYnkgdGhlIGluc3RhbmNlIHZhbHVlLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWdEZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgPSBudWxsXG4gICAgLyoqXG4gICAgLyoqXG4gICAgICogQSBib29sZWFuIHZhbHVlIHRvIHN0b3JlIHdoZXRoZXIgdGhpcyBNaW5pbWFwIGhhdmUgYmVlbiBkZXN0cm95ZWQgb3Igbm90LlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZVxuICAgIC8qKlxuICAgICAqIEEgYm9vbGVhbiB2YWx1ZSB0byBzdG9yZSB3aGV0aGVyIHRoZSBgc2Nyb2xsUGFzdEVuZGAgc2V0dGluZyBpcyBlbmFibGVkXG4gICAgICogb3Igbm90LlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zY3JvbGxQYXN0RW5kID0gZmFsc2VcblxuICAgIHRoaXMuaW5pdGlhbGl6ZURlY29yYXRpb25zKClcblxuICAgIGlmIChhdG9tLnZpZXdzLmdldFZpZXcodGhpcy50ZXh0RWRpdG9yKS5nZXRTY3JvbGxUb3AgIT0gbnVsbCkge1xuICAgICAgdGhpcy5hZGFwdGVyID0gbmV3IFN0YWJsZUFkYXB0ZXIodGhpcy50ZXh0RWRpdG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkYXB0ZXIgPSBuZXcgTGVnYWN5QWRhdGVyKHRoaXMudGV4dEVkaXRvcilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGluIHN0YW5kLWFsb25lIG9yIGluZGVwZW5kZW50IHNjcm9sbGluZyBtb2RlLCB0aGlzIHZhbHVlIGNhbiBiZSB1c2VkXG4gICAgICogaW5zdGVhZCBvZiB0aGUgY29tcHV0ZWQgc2Nyb2xsLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnNjcm9sbFRvcCA9IDBcblxuICAgIGNvbnN0IHN1YnMgPSB0aGlzLnN1YnNjcmlwdGlvbnNcbiAgICBsZXQgY29uZmlnU3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpYmVUb0NvbmZpZygpXG5cbiAgICBzdWJzLmFkZChjb25maWdTdWJzY3JpcHRpb24pXG5cbiAgICBzdWJzLmFkZCh0aGlzLnRleHRFZGl0b3Iub25EaWRDaGFuZ2VHcmFtbWFyKCgpID0+IHtcbiAgICAgIHN1YnMucmVtb3ZlKGNvbmZpZ1N1YnNjcmlwdGlvbilcbiAgICAgIGNvbmZpZ1N1YnNjcmlwdGlvbi5kaXNwb3NlKClcblxuICAgICAgY29uZmlnU3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpYmVUb0NvbmZpZygpXG4gICAgICBzdWJzLmFkZChjb25maWdTdWJzY3JpcHRpb24pXG4gICAgfSkpXG5cbiAgICBzdWJzLmFkZCh0aGlzLmFkYXB0ZXIub25EaWRDaGFuZ2VTY3JvbGxUb3AoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnN0YW5kQWxvbmUgJiYgIXRoaXMuaWdub3JlVGV4dEVkaXRvclNjcm9sbCAmJiAhdGhpcy5pbkNoYW5nZVNjcm9sbFRvcCkge1xuICAgICAgICB0aGlzLmluQ2hhbmdlU2Nyb2xsVG9wID0gdHJ1ZVxuICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNjcm9sbC10b3AnLCB0aGlzKVxuICAgICAgICB0aGlzLmluQ2hhbmdlU2Nyb2xsVG9wID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaWdub3JlVGV4dEVkaXRvclNjcm9sbCkge1xuICAgICAgICB0aGlzLmlnbm9yZVRleHRFZGl0b3JTY3JvbGwgPSBmYWxzZVxuICAgICAgfVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKHRoaXMuYWRhcHRlci5vbkRpZENoYW5nZVNjcm9sbExlZnQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnN0YW5kQWxvbmUpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc2Nyb2xsLWxlZnQnLCB0aGlzKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgc3Vicy5hZGQodGhpcy50ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlKChjaGFuZ2VzKSA9PiB7XG4gICAgICB0aGlzLmVtaXRDaGFuZ2VzKGNoYW5nZXMpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQodGhpcy50ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7IHRoaXMuZGVzdHJveSgpIH0pKVxuXG4gICAgLypcbiAgICBGSVhNRSBTb21lIGNoYW5nZXMgb2NjdXJpbmcgZHVyaW5nIHRoZSB0b2tlbml6YXRpb24gcHJvZHVjZXNcbiAgICByYW5nZXMgdGhhdCBkZWNlaXZlIHRoZSBjYW52YXMgcmVuZGVyaW5nIGJ5IG1ha2luZyBzb21lXG4gICAgbGluZXMgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGludGFjdCB3aGlsZSB0aGV5IGFyZSBpbiBmYWN0IG5vdCxcbiAgICByZXN1bHRpbmcgaW4gZXh0cmEgbGluZXMgYXBwZWFyaW5nIGF0IHRoZSBlbmQgb2YgdGhlIG1pbmltYXAuXG4gICAgRm9yY2luZyBhIHdob2xlIHJlcGFpbnQgdG8gZml4IHRoYXQgYnVnIGlzIHN1Ym9wdGltYWwgYnV0IHdvcmtzLlxuICAgICovXG4gICAgY29uc3QgdG9rZW5pemVkQnVmZmVyID0gdGhpcy50ZXh0RWRpdG9yLnRva2VuaXplZEJ1ZmZlclxuICAgICAgPyB0aGlzLnRleHRFZGl0b3IudG9rZW5pemVkQnVmZmVyXG4gICAgICA6IHRoaXMudGV4dEVkaXRvci5kaXNwbGF5QnVmZmVyLnRva2VuaXplZEJ1ZmZlclxuXG4gICAgc3Vicy5hZGQodG9rZW5pemVkQnVmZmVyLm9uRGlkVG9rZW5pemUoKCkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyB0aGUgbW9kZWwuXG4gICAqL1xuICBkZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMucmVtb3ZlQWxsRGVjb3JhdGlvbnMoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy50ZXh0RWRpdG9yID0gbnVsbFxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhpcyBgTWluaW1hcGAgaGFzIGJlbm4gZGVzdHJveWVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoaXMgTWluaW1hcCBoYXMgYmVlbiBkZXN0cm95ZWQgb3Igbm90XG4gICAqL1xuICBpc0Rlc3Ryb3llZCAoKSB7IHJldHVybiB0aGlzLmRlc3Ryb3llZCB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2VgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIGFuIGV2ZW50IG9iamVjdCB3aXRoXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIHN0YXJ0OiBUaGUgY2hhbmdlJ3Mgc3RhcnQgcm93IG51bWJlclxuICAgKiAtIGVuZDogVGhlIGNoYW5nZSdzIGVuZCByb3cgbnVtYmVyXG4gICAqIC0gc2NyZWVuRGVsdGE6IHRoZSBkZWx0YSBpbiBidWZmZXIgcm93cyBiZXR3ZWVuIHRoZSB2ZXJzaW9ucyBiZWZvcmUgYW5kXG4gICAqICAgYWZ0ZXIgdGhlIGNoYW5nZVxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1jb25maWdgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbigpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBldmVudFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzIHRyaWdnZXJlZC5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VDb25maWcgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1jb25maWcnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLXNjcm9sbC10b3BgIGV2ZW50LlxuICAgKlxuICAgKiBUaGUgZXZlbnQgaXMgZGlzcGF0Y2hlZCB3aGVuIHRoZSB0ZXh0IGVkaXRvciBgc2Nyb2xsVG9wYCB2YWx1ZSBoYXZlIGJlZW5cbiAgICogY2hhbmdlZCBvciB3aGVuIHRoZSBtaW5pbWFwIHNjcm9sbCB0b3AgaGF2ZSBiZWVuIGNoYW5nZWQgaW4gc3RhbmQtYWxvbmVcbiAgICogbW9kZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24obWluaW1hcDpNaW5pbWFwKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGN1cnJlbnQgTWluaW1hcCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlZCBhcyBhcmd1bWVudCB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VTY3JvbGxUb3AgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1zY3JvbGwtbGVmdGAgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKG1pbmltYXA6TWluaW1hcCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjdXJyZW50IE1pbmltYXAgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzZWQgYXMgYXJndW1lbnQgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXNjcm9sbC1sZWZ0JywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1zdGFuZC1hbG9uZWAgZXZlbnQuXG4gICAqXG4gICAqIFRoaXMgZXZlbnQgaXMgZGlzcGF0Y2hlZCB3aGVuIHRoZSBzdGFuZC1hbG9uZSBvZiB0aGUgY3VycmVudCBNaW5pbWFwXG4gICAqIGlzIGVpdGhlciBlbmFibGVkIG9yIGRpc2FibGVkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihtaW5pbWFwOk1pbmltYXApOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY3VycmVudCBNaW5pbWFwIGlzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIGFzIGFyZ3VtZW50IHRvXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZVN0YW5kQWxvbmUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zdGFuZC1hbG9uZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1kZXN0cm95YCBldmVudC5cbiAgICpcbiAgICogVGhpcyBldmVudCBpcyBkaXNwYXRjaGVkIHdoZW4gdGhpcyBNaW5pbWFwIGhhdmUgYmVlbiBkZXN0cm95ZWQuIEl0IGNhblxuICAgKiBvY2N1cnMgZWl0aGVyIGJlY2F1c2UgdGhlIHtAbGluayBkZXN0cm95fSBtZXRob2QgaGF2ZSBiZWVuIGNhbGxlZCBvbiB0aGVcbiAgICogTWluaW1hcCBvciBiZWNhdXNlIHRoZSB0YXJnZXQgdGV4dCBlZGl0b3IgaGF2ZSBiZWVuIGRlc3Ryb3llZC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyB0cmlnZ2VyZWQuXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkRGVzdHJveSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyB0byB0aGUgY29uZmlnIGNoYW5nZXMgZm9yIHRoZSBjdXJyZW50IGVkaXRvciBzY29wZS5cbiAgICpcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gdGhlIGRpc3Bvc2FibGUgdG8gZGlzcG9zZSBhbGwgdGhlIHJlZ2lzdGVyZWQgZXZlbnRzXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgc3Vic2NyaWJlVG9Db25maWcgKCkge1xuICAgIGNvbnN0IHN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgY29uc3Qgb3B0cyA9IHtzY29wZTogdGhpcy50ZXh0RWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKX1cblxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgb3B0cywgKHNjcm9sbFBhc3RFbmQpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsUGFzdEVuZCA9IHNjcm9sbFBhc3RFbmRcbiAgICAgIHRoaXMuYWRhcHRlci5zY3JvbGxQYXN0RW5kID0gdGhpcy5zY3JvbGxQYXN0RW5kXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuY2hhckhlaWdodCcsIG9wdHMsIChjb25maWdDaGFySGVpZ2h0KSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ0NoYXJIZWlnaHQgPSBjb25maWdDaGFySGVpZ2h0XG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuY2hhcldpZHRoJywgb3B0cywgKGNvbmZpZ0NoYXJXaWR0aCkgPT4ge1xuICAgICAgdGhpcy5jb25maWdDaGFyV2lkdGggPSBjb25maWdDaGFyV2lkdGhcbiAgICAgIHRoaXMudXBkYXRlU2Nyb2xsVG9wKClcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5pbnRlcmxpbmUnLCBvcHRzLCAoY29uZmlnSW50ZXJsaW5lKSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ0ludGVybGluZSA9IGNvbmZpZ0ludGVybGluZVxuICAgICAgdGhpcy51cGRhdGVTY3JvbGxUb3AoKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdtaW5pbWFwLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbCcsIG9wdHMsIChpbmRlcGVuZGVudE1pbmltYXBTY3JvbGwpID0+IHtcbiAgICAgIHRoaXMuaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsID0gaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsXG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5zY3JvbGxTZW5zaXRpdml0eScsIG9wdHMsIChzY3JvbGxTZW5zaXRpdml0eSkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxTZW5zaXRpdml0eSA9IHNjcm9sbFNlbnNpdGl2aXR5XG4gICAgfSkpXG4gICAgLy8gY2RwcnIgaXMgc2hvcnRoYW5kIGZvciBjb25maWdEZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdcbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgJ21pbmltYXAuZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nJyxcbiAgICAgIG9wdHMsXG4gICAgICAoY2RwcnIpID0+IHtcbiAgICAgICAgdGhpcy5jb25maWdEZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgPSBjZHByclxuICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgICB9XG4gICAgKSlcblxuICAgIHJldHVybiBzdWJzXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgY3VycmVudCBNaW5pbWFwIGlzIGEgc3RhbmQtYWxvbmUgbWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGlzIE1pbmltYXAgaXMgaW4gc3RhbmQtYWxvbmUgbW9kZSBvciBub3QuXG4gICAqL1xuICBpc1N0YW5kQWxvbmUgKCkgeyByZXR1cm4gdGhpcy5zdGFuZEFsb25lIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3RhbmQtYWxvbmUgbW9kZSBmb3IgdGhpcyBtaW5pbWFwLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0YW5kQWxvbmUgdGhlIG5ldyBzdGF0ZSBvZiB0aGUgc3RhbmQtYWxvbmUgbW9kZSBmb3IgdGhpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2Utc3RhbmQtYWxvbmV9IGlmIHRoZSBzdGFuZC1hbG9uZSBtb2RlIGhhdmUgYmVlbiB0b2dnbGVkXG4gICAqICAgICAgICBvbiBvciBvZmYgYnkgdGhlIGNhbGxcbiAgICovXG4gIHNldFN0YW5kQWxvbmUgKHN0YW5kQWxvbmUpIHtcbiAgICBpZiAoc3RhbmRBbG9uZSAhPT0gdGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICB0aGlzLnN0YW5kQWxvbmUgPSBzdGFuZEFsb25lXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zdGFuZC1hbG9uZScsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCB0aGF0IHRoaXMgbWluaW1hcCByZXByZXNlbnRzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtUZXh0RWRpdG9yfSB0aGlzIE1pbmltYXAncyB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvciAoKSB7IHJldHVybiB0aGlzLnRleHRFZGl0b3IgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIGBUZXh0RWRpdG9yYCBhdCB0aGUgTWluaW1hcCBzY2FsZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2NhbGVkIGhlaWdodCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0SGVpZ2h0KCkgKiB0aGlzLmdldFZlcnRpY2FsU2NhbGVGYWN0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgdG9wIHZhbHVlIGF0IHRoZSBNaW5pbWFwIHNjYWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY2FsZWQgc2Nyb2xsIHRvcCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY2FsZWRTY3JvbGxUb3AgKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsVG9wKCkgKiB0aGlzLmdldFZlcnRpY2FsU2NhbGVGYWN0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgbGVmdCB2YWx1ZSBhdCB0aGUgTWluaW1hcCBzY2FsZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2NhbGVkIHNjcm9sbCBsZWZ0IG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjYWxlZFNjcm9sbExlZnQgKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsTGVmdCgpICogdGhpcy5nZXRIb3Jpem9udGFsU2NhbGVGYWN0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBtYXhpbXVtIHNjcm9sbCB0b3AgdmFsdWUuXG4gICAqXG4gICAqIFdoZW4gdGhlIGBzY3JvbGxQYXN0RW5kYCBzZXR0aW5nIGlzIGVuYWJsZWQsIHRoZSBtZXRob2QgY29tcGVuc2F0ZSB0aGVcbiAgICogZXh0cmEgc2Nyb2xsIGJ5IHJlbW92aW5nIHRoZSBzYW1lIGhlaWdodCBhcyBhZGRlZCBieSB0aGUgZWRpdG9yIGZyb20gdGhlXG4gICAqIGZpbmFsIHZhbHVlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBtYXhpbXVtIHNjcm9sbCB0b3Agb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yTWF4U2Nyb2xsVG9wICgpIHsgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRNYXhTY3JvbGxUb3AoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgdG9wIHZhbHVlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgdG9wIG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjcm9sbFRvcCAoKSB7IHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsVG9wKCkgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzY3JvbGwgdG9wIG9mIHRoZSBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzY3JvbGxUb3AgdGhlIG5ldyBzY3JvbGwgdG9wIHZhbHVlXG4gICAqL1xuICBzZXRUZXh0RWRpdG9yU2Nyb2xsVG9wIChzY3JvbGxUb3AsIGlnbm9yZVRleHRFZGl0b3JTY3JvbGwgPSBmYWxzZSkge1xuICAgIHRoaXMuaWdub3JlVGV4dEVkaXRvclNjcm9sbCA9IGlnbm9yZVRleHRFZGl0b3JTY3JvbGxcbiAgICB0aGlzLmFkYXB0ZXIuc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIGxlZnQgdmFsdWUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCBsZWZ0IG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjcm9sbExlZnQgKCkgeyByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbExlZnQoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBoZWlnaHQgb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9ySGVpZ2h0ICgpIHsgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRIZWlnaHQoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgYXMgYSB2YWx1ZSBub3JtYWxpemVkIGJldHdlZW4gYDBgIGFuZCBgMWAuXG4gICAqXG4gICAqIFdoZW4gdGhlIGBzY3JvbGxQYXN0RW5kYCBzZXR0aW5nIGlzIGVuYWJsZWQgdGhlIHZhbHVlIG1heSBleGNlZWQgYDFgIGFzIHRoZVxuICAgKiBtYXhpbXVtIHNjcm9sbCB2YWx1ZSB1c2VkIHRvIGNvbXB1dGUgdGhpcyByYXRpbyBjb21wZW5zYXRlIGZvciB0aGUgZXh0cmFcbiAgICogaGVpZ2h0IGluIHRoZSBlZGl0b3IuICoqVXNlIHtAbGluayBnZXRDYXBlZFRleHRFZGl0b3JTY3JvbGxSYXRpb30gd2hlblxuICAgKiB5b3UgbmVlZCBhIHZhbHVlIHRoYXQgaXMgc3RyaWN0bHkgYmV0d2VlbiBgMGAgYW5kIGAxYC4qKlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgcmF0aW8gb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8gKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsVG9wKCkgLyAodGhpcy5nZXRUZXh0RWRpdG9yTWF4U2Nyb2xsVG9wKCkgfHwgMSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIGFzIGEgdmFsdWUgbm9ybWFsaXplZCBiZXR3ZWVuIGAwYCBhbmQgYDFgLlxuICAgKlxuICAgKiBUaGUgcmV0dXJuZWQgdmFsdWUgd2lsbCBhbHdheXMgYmUgc3RyaWN0bHkgYmV0d2VlbiBgMGAgYW5kIGAxYC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIHJhdGlvIG9mIHRoZSB0ZXh0IGVkaXRvciBzdHJpY3RseSBiZXR3ZWVuXG4gICAqICAgICAgICAgICAgICAgICAgMCBhbmQgMVxuICAgKi9cbiAgZ2V0Q2FwZWRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8gKCkge1xuICAgIHJldHVybiBNYXRoLm1pbigxLCB0aGlzLmdldFRleHRFZGl0b3JTY3JvbGxSYXRpbygpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgd2hvbGUgbWluaW1hcCBpbiBwaXhlbHMgYmFzZWQgb24gdGhlIGBtaW5pbWFwYFxuICAgKiBzZXR0aW5ncy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaGVpZ2h0IG9mIHRoZSBtaW5pbWFwXG4gICAqL1xuICBnZXRIZWlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiB0aGlzLmdldExpbmVIZWlnaHQoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSB3aG9sZSBtaW5pbWFwIGluIHBpeGVscyBiYXNlZCBvbiB0aGUgYG1pbmltYXBgXG4gICAqIHNldHRpbmdzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB3aWR0aCBvZiB0aGUgbWluaW1hcFxuICAgKi9cbiAgZ2V0V2lkdGggKCkge1xuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3IuZ2V0TWF4U2NyZWVuTGluZUxlbmd0aCgpICogdGhpcy5nZXRDaGFyV2lkdGgoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCB0aGUgTWluaW1hcCBjb250ZW50IHdpbGwgdGFrZSBvbiBzY3JlZW4uXG4gICAqXG4gICAqIFdoZW4gdGhlIE1pbmltYXAgaGVpZ2h0IGlzIGdyZWF0ZXIgdGhhbiB0aGUgYFRleHRFZGl0b3JgIGhlaWdodCwgdGhlXG4gICAqIGBUZXh0RWRpdG9yYCBoZWlnaHQgaXMgcmV0dXJuZWQgaW5zdGVhZC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgdmlzaWJsZSBoZWlnaHQgb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldFZpc2libGVIZWlnaHQgKCkge1xuICAgIHJldHVybiBNYXRoLm1pbih0aGlzLmdldFNjcmVlbkhlaWdodCgpLCB0aGlzLmdldEhlaWdodCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCB0aGUgbWluaW1hcCBzaG91bGQgdGFrZSBvbmNlIGRpc3BsYXllZCwgaXQncyBlaXRoZXJcbiAgICogdGhlIGhlaWdodCBvZiB0aGUgYFRleHRFZGl0b3JgIG9yIHRoZSBwcm92aWRlZCBgaGVpZ2h0YCB3aGVuIGluIHN0YW5kLWFsb25lXG4gICAqIG1vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHRvdGFsIGhlaWdodCBvZiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0U2NyZWVuSGVpZ2h0ICgpIHtcbiAgICBpZiAodGhpcy5pc1N0YW5kQWxvbmUoKSkge1xuICAgICAgaWYgKHRoaXMuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRIZWlnaHQoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldEhlaWdodCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIHRoZSB3aG9sZSBNaW5pbWFwIHdpbGwgdGFrZSBvbiBzY3JlZW4uXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHdpZHRoIG9mIHRoZSBNaW5pbWFwIHdoZW4gZGlzcGxheWVkXG4gICAqL1xuICBnZXRWaXNpYmxlV2lkdGggKCkge1xuICAgIHJldHVybiBNYXRoLm1pbih0aGlzLmdldFNjcmVlbldpZHRoKCksIHRoaXMuZ2V0V2lkdGgoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aWR0aCB0aGUgTWluaW1hcCBzaG91bGQgdGFrZSBvbmNlIGRpc3BsYXllZCwgaXQncyBlaXRoZXIgdGhlXG4gICAqIHdpZHRoIG9mIHRoZSBNaW5pbWFwIGNvbnRlbnQgb3IgdGhlIHByb3ZpZGVkIGB3aWR0aGAgd2hlbiBpbiBzdGFuZEFsb25lXG4gICAqIG1vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIE1pbmltYXAgc2NyZWVuIHdpZHRoXG4gICAqL1xuICBnZXRTY3JlZW5XaWR0aCAoKSB7XG4gICAgaWYgKHRoaXMuaXNTdGFuZEFsb25lKCkgJiYgdGhpcy53aWR0aCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy53aWR0aFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRXaWR0aCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHByZWZlcnJlZCBoZWlnaHQgYW5kIHdpZHRoIHdoZW4gaW4gc3RhbmQtYWxvbmUgbW9kZS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSA8TWluaW1hcEVsZW1lbnQ+IGZvciB0aGlzIE1pbmltYXAgc28gdGhhdFxuICAgKiB0aGUgbW9kZWwgaXMga2VwdCBpbiBzeW5jIHdpdGggdGhlIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgdGhlIG5ldyBoZWlnaHQgb2YgdGhlIE1pbmltYXBcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHRoZSBuZXcgd2lkdGggb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIHNldFNjcmVlbkhlaWdodEFuZFdpZHRoIChoZWlnaHQsIHdpZHRoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmVydGljYWwgc2NhbGluZyBmYWN0b3Igd2hlbiBjb252ZXJ0aW5nIGNvb3JkaW5hdGVzIGZyb20gdGhlXG4gICAqIGBUZXh0RWRpdG9yYCB0byB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgTWluaW1hcCB2ZXJ0aWNhbCBzY2FsaW5nIGZhY3RvclxuICAgKi9cbiAgZ2V0VmVydGljYWxTY2FsZUZhY3RvciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGluZUhlaWdodCgpIC8gdGhpcy50ZXh0RWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaG9yaXpvbnRhbCBzY2FsaW5nIGZhY3RvciB3aGVuIGNvbnZlcnRpbmcgY29vcmRpbmF0ZXMgZnJvbSB0aGVcbiAgICogYFRleHRFZGl0b3JgIHRvIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBNaW5pbWFwIGhvcml6b250YWwgc2NhbGluZyBmYWN0b3JcbiAgICovXG4gIGdldEhvcml6b250YWxTY2FsZUZhY3RvciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hhcldpZHRoKCkgLyB0aGlzLnRleHRFZGl0b3IuZ2V0RGVmYXVsdENoYXJXaWR0aCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIGEgbGluZSBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gYSBsaW5lJ3MgaGVpZ2h0IGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRMaW5lSGVpZ2h0ICgpIHsgcmV0dXJuIHRoaXMuZ2V0Q2hhckhlaWdodCgpICsgdGhpcy5nZXRJbnRlcmxpbmUoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIG9mIGEgY2hhcmFjdGVyIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSBhIGNoYXJhY3RlcidzIHdpZHRoIGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRDaGFyV2lkdGggKCkge1xuICAgIGlmICh0aGlzLmNoYXJXaWR0aCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFyV2lkdGhcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnQ2hhcldpZHRoXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNoYXIgd2lkdGggZm9yIHRoaXMgTWluaW1hcC4gVGhpcyB2YWx1ZSB3aWxsIG92ZXJyaWRlIHRoZVxuICAgKiB2YWx1ZSBmcm9tIHRoZSBjb25maWcgZm9yIHRoaXMgaW5zdGFuY2Ugb25seS4gQSBgZGlkLWNoYW5nZS1jb25maWdgXG4gICAqIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjaGFyV2lkdGggdGhlIG5ldyB3aWR0aCBvZiBhIGNoYXIgaW4gdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLWNvbmZpZ30gd2hlbiB0aGUgdmFsdWUgaXMgY2hhbmdlZFxuICAgKi9cbiAgc2V0Q2hhcldpZHRoIChjaGFyV2lkdGgpIHtcbiAgICB0aGlzLmNoYXJXaWR0aCA9IE1hdGguZmxvb3IoY2hhcldpZHRoKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIGEgY2hhcmFjdGVyIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSBhIGNoYXJhY3RlcidzIGhlaWdodCBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0Q2hhckhlaWdodCAoKSB7XG4gICAgaWYgKHRoaXMuY2hhckhlaWdodCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFySGVpZ2h0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0NoYXJIZWlnaHRcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2hhciBoZWlnaHQgZm9yIHRoaXMgTWluaW1hcC4gVGhpcyB2YWx1ZSB3aWxsIG92ZXJyaWRlIHRoZVxuICAgKiB2YWx1ZSBmcm9tIHRoZSBjb25maWcgZm9yIHRoaXMgaW5zdGFuY2Ugb25seS4gQSBgZGlkLWNoYW5nZS1jb25maWdgXG4gICAqIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjaGFySGVpZ2h0IHRoZSBuZXcgaGVpZ2h0IG9mIGEgY2hhciBpbiB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2UtY29uZmlnfSB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBzZXRDaGFySGVpZ2h0IChjaGFySGVpZ2h0KSB7XG4gICAgdGhpcy5jaGFySGVpZ2h0ID0gTWF0aC5mbG9vcihjaGFySGVpZ2h0KVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIGFuIGludGVybGluZSBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGludGVybGluZSdzIGhlaWdodCBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0SW50ZXJsaW5lICgpIHtcbiAgICBpZiAodGhpcy5pbnRlcmxpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJsaW5lXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0ludGVybGluZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBpbnRlcmxpbmUgaGVpZ2h0IGZvciB0aGlzIE1pbmltYXAuIFRoaXMgdmFsdWUgd2lsbCBvdmVycmlkZSB0aGVcbiAgICogdmFsdWUgZnJvbSB0aGUgY29uZmlnIGZvciB0aGlzIGluc3RhbmNlIG9ubHkuIEEgYGRpZC1jaGFuZ2UtY29uZmlnYFxuICAgKiBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gaW50ZXJsaW5lIHRoZSBuZXcgaGVpZ2h0IG9mIGFuIGludGVybGluZSBpbiB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2UtY29uZmlnfSB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBzZXRJbnRlcmxpbmUgKGludGVybGluZSkge1xuICAgIHRoaXMuaW50ZXJsaW5lID0gTWF0aC5mbG9vcihpbnRlcmxpbmUpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdGF0dXMgb2YgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIGluIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0aGUgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIHN0YXR1cyBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nICgpIHtcbiAgICBpZiAodGhpcy5kZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0RldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgc3RhdHVzIGZvciB0aGlzIE1pbmltYXAuXG4gICAqIFRoaXMgdmFsdWUgd2lsbCBvdmVycmlkZSB0aGUgdmFsdWUgZnJvbSB0aGUgY29uZmlnIGZvciB0aGlzIGluc3RhbmNlIG9ubHkuXG4gICAqIEEgYGRpZC1jaGFuZ2UtY29uZmlnYCBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyB0aGUgbmV3IHN0YXR1cyBvZlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4gdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLWNvbmZpZ30gd2hlbiB0aGUgdmFsdWUgaXMgY2hhbmdlZFxuICAgKi9cbiAgc2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIChkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcpIHtcbiAgICB0aGlzLmRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyA9IGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGV2aWNlUGl4ZWxSYXRpbyBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGRldmljZVBpeGVsUmF0aW8gaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldERldmljZVBpeGVsUmF0aW8gKCkge1xuICAgIHJldHVybiB0aGlzLmdldERldmljZVBpeGVsUmF0aW9Sb3VuZGluZygpXG4gICAgICA/IE1hdGguZmxvb3IoZGV2aWNlUGl4ZWxSYXRpbylcbiAgICAgIDogZGV2aWNlUGl4ZWxSYXRpb1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCB2aXNpYmxlIHJvdyBpbiB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IHZpc2libGUgcm93XG4gICAqL1xuICBnZXRGaXJzdFZpc2libGVTY3JlZW5Sb3cgKCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2V0U2Nyb2xsVG9wKCkgLyB0aGlzLmdldExpbmVIZWlnaHQoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbGFzdCB2aXNpYmxlIHJvdyBpbiB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW5kZXggb2YgdGhlIGxhc3QgdmlzaWJsZSByb3dcbiAgICovXG4gIGdldExhc3RWaXNpYmxlU2NyZWVuUm93ICgpIHtcbiAgICByZXR1cm4gTWF0aC5jZWlsKFxuICAgICAgKHRoaXMuZ2V0U2Nyb2xsVG9wKCkgKyB0aGlzLmdldFNjcmVlbkhlaWdodCgpKSAvIHRoaXMuZ2V0TGluZUhlaWdodCgpXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSB3aGVuIHRoZSBgaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsYCBzZXR0aW5nIGhhdmUgYmVlbiBlbmFibGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoZSBtaW5pbWFwIGNhbiBzY3JvbGwgaW5kZXBlbmRlbnRseVxuICAgKi9cbiAgc2Nyb2xsSW5kZXBlbmRlbnRseU9uTW91c2VXaGVlbCAoKSB7IHJldHVybiB0aGlzLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbCB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgc2Nyb2xsIG9mIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBUaGUgTWluaW1hcCBjYW4gc2Nyb2xsIG9ubHkgd2hlbiBpdHMgaGVpZ2h0IGlzIGdyZWF0ZXIgdGhhdCB0aGUgaGVpZ2h0XG4gICAqIG9mIGl0cyBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCB0b3Agb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldFNjcm9sbFRvcCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhbmRBbG9uZSB8fCB0aGlzLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbFxuICAgICAgPyB0aGlzLnNjcm9sbFRvcFxuICAgICAgOiB0aGlzLmdldFNjcm9sbFRvcEZyb21FZGl0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1pbmltYXAgc2Nyb2xsIHRvcCB2YWx1ZSB3aGVuIGluIHN0YW5kLWFsb25lIG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzY3JvbGxUb3AgdGhlIG5ldyBzY3JvbGwgdG9wIGZvciB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcH0gaWYgdGhlIE1pbmltYXAncyBzdGFuZC1hbG9uZSBtb2RlIGlzIGVuYWJsZWRcbiAgICovXG4gIHNldFNjcm9sbFRvcCAoc2Nyb2xsVG9wKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih0aGlzLmdldE1heFNjcm9sbFRvcCgpLCBzY3JvbGxUb3ApKVxuXG4gICAgaWYgKHRoaXMuc3RhbmRBbG9uZSB8fCB0aGlzLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbCkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcCcsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1pbmltYXAgc2Nyb2xsIGFzIGEgcmF0aW9uIGJldHdlZW4gMCBhbmQgMS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbWluaW1hcCBzY3JvbGwgcmF0aW9cbiAgICovXG4gIGdldFNjcm9sbFJhdGlvICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTY3JvbGxUb3AoKSAvIHRoaXMuZ2V0TWF4U2Nyb2xsVG9wKClcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBzY3JvbGwgdG9wIHZhbHVlIHdpdGggdGhlIG9uZSBjb21wdXRlZCBmcm9tIHRoZSB0ZXh0IGVkaXRvclxuICAgKiB3aGVuIHRoZSBtaW5pbWFwIGlzIGluIHRoZSBpbmRlcGVuZGVudCBzY3JvbGxpbmcgbW9kZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICB1cGRhdGVTY3JvbGxUb3AgKCkge1xuICAgIGlmICh0aGlzLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbCkge1xuICAgICAgdGhpcy5zZXRTY3JvbGxUb3AodGhpcy5nZXRTY3JvbGxUb3BGcm9tRWRpdG9yKCkpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgdGhpcylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc2Nyb2xsIHRvcCBhcyBjb21wdXRlZCBmcm9tIHRoZSB0ZXh0IGVkaXRvciBzY3JvbGwgdG9wLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBjb21wdXRlZCBzY3JvbGwgdG9wIHZhbHVlXG4gICAqL1xuICBnZXRTY3JvbGxUb3BGcm9tRWRpdG9yICgpIHtcbiAgICByZXR1cm4gTWF0aC5hYnMoXG4gICAgICB0aGlzLmdldENhcGVkVGV4dEVkaXRvclNjcm9sbFJhdGlvKCkgKiB0aGlzLmdldE1heFNjcm9sbFRvcCgpXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1heGltdW0gc2Nyb2xsIHZhbHVlIG9mIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBtYXhpbXVtIHNjcm9sbCB0b3AgZm9yIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRNYXhTY3JvbGxUb3AgKCkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCB0aGlzLmdldEhlaWdodCgpIC0gdGhpcy5nZXRTY3JlZW5IZWlnaHQoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBNaW5pbWFwIGNhbiBzY3JvbGwuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhpcyBNaW5pbWFwIGNhbiBzY3JvbGwgb3Igbm90XG4gICAqL1xuICBjYW5TY3JvbGwgKCkgeyByZXR1cm4gdGhpcy5nZXRNYXhTY3JvbGxUb3AoKSA+IDAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBtaW5pbWFwIHNjcm9sbCB0b3AgdmFsdWUgdXNpbmcgYSBtb3VzZSBldmVudCB3aGVuIHRoZVxuICAgKiBpbmRlcGVuZGVudCBzY3JvbGxpbmcgbW9kZSBpcyBlbmFibGVkXG4gICAqXG4gICAqIEBwYXJhbSAge01vdXNlRXZlbnR9IGV2ZW50IHRoZSBtb3VzZSB3aGVlbCBldmVudFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIG9uTW91c2VXaGVlbCAoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuY2FuU2Nyb2xsKCkpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IHt3aGVlbERlbHRhWX0gPSBldmVudFxuICAgIGNvbnN0IHByZXZpb3VzU2Nyb2xsVG9wID0gdGhpcy5nZXRTY3JvbGxUb3AoKVxuICAgIGNvbnN0IHVwZGF0ZWRTY3JvbGxUb3AgPSBwcmV2aW91c1Njcm9sbFRvcCAtIE1hdGgucm91bmQod2hlZWxEZWx0YVkgKiB0aGlzLnNjcm9sbFNlbnNpdGl2aXR5KVxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuc2V0U2Nyb2xsVG9wKHVwZGF0ZWRTY3JvbGxUb3ApXG4gIH1cblxuICAvKipcbiAgICogRGVsZWdhdGVzIHRvIGBUZXh0RWRpdG9yI2dldE1hcmtlcmAuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZ2V0TWFya2VyIChpZCkgeyByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLmdldE1hcmtlcihpZCkgfVxuXG4gIC8qKlxuICAgKiBEZWxlZ2F0ZXMgdG8gYFRleHRFZGl0b3IjZmluZE1hcmtlcnNgLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGZpbmRNYXJrZXJzIChvKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3IuZmluZE1hcmtlcnMobylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlbGVnYXRlcyB0byBgVGV4dEVkaXRvciNtYXJrQnVmZmVyUmFuZ2VgLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIG1hcmtCdWZmZXJSYW5nZSAocmFuZ2UpIHsgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UpIH1cblxuICAvKipcbiAgICogRW1pdHMgYSBjaGFuZ2UgZXZlbnRzIHdpdGggdGhlIHBhc3NlZC1pbiBjaGFuZ2VzIGFzIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gY2hhbmdlcyBhIGNoYW5nZSB0byBkaXNwYXRjaFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVtaXRDaGFuZ2VzIChjaGFuZ2VzKSB7IHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlJywgY2hhbmdlcykgfVxuXG4gIC8qKlxuICAgKiBFbmFibGVzIHRoZSBjYWNoZSBhdCB0aGUgYWRhcHRlciBsZXZlbCB0byBhdm9pZCBjb25zZWN1dGl2ZSBhY2Nlc3MgdG8gdGhlXG4gICAqIHRleHQgZWRpdG9yIEFQSSBkdXJpbmcgYSByZW5kZXIgcGhhc2UuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZW5hYmxlQ2FjaGUgKCkgeyB0aGlzLmFkYXB0ZXIuZW5hYmxlQ2FjaGUoKSB9XG5cbiAgLyoqXG4gICAqIERpc2FibGUgdGhlIGFkYXB0ZXIgY2FjaGUuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY2xlYXJDYWNoZSAoKSB7IHRoaXMuYWRhcHRlci5jbGVhckNhY2hlKCkgfVxuXG59XG4iXX0=
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap.js

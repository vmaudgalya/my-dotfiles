Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _atomUtils = require('atom-utils');

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _decoratorsElement = require('./decorators/element');

var _decoratorsElement2 = _interopRequireDefault(_decoratorsElement);

var _mixinsDomStylesReader = require('./mixins/dom-styles-reader');

var _mixinsDomStylesReader2 = _interopRequireDefault(_mixinsDomStylesReader);

var _mixinsCanvasDrawer = require('./mixins/canvas-drawer');

var _mixinsCanvasDrawer2 = _interopRequireDefault(_mixinsCanvasDrawer);

var _minimapQuickSettingsElement = require('./minimap-quick-settings-element');

var _minimapQuickSettingsElement2 = _interopRequireDefault(_minimapQuickSettingsElement);

'use babel';

var SPEC_MODE = atom.inSpecMode();

/**
 * Public: The MinimapElement is the view meant to render a {@link Minimap}
 * instance in the DOM.
 *
 * You can retrieve the MinimapElement associated to a Minimap
 * using the `atom.views.getView` method.
 *
 * Note that most interactions with the Minimap package is done through the
 * Minimap model so you should never have to access MinimapElement
 * instances.
 *
 * @example
 * let minimapElement = atom.views.getView(minimap)
 */

var MinimapElement = (function () {
  function MinimapElement() {
    _classCallCheck(this, _MinimapElement);
  }

  _createClass(MinimapElement, [{
    key: 'createdCallback',

    //    ##     ##  #######   #######  ##    ##  ######
    //    ##     ## ##     ## ##     ## ##   ##  ##    ##
    //    ##     ## ##     ## ##     ## ##  ##   ##
    //    ######### ##     ## ##     ## #####     ######
    //    ##     ## ##     ## ##     ## ##  ##         ##
    //    ##     ## ##     ## ##     ## ##   ##  ##    ##
    //    ##     ##  #######   #######  ##    ##  ######

    /**
     * DOM callback invoked when a new MinimapElement is created.
     *
     * @access private
     */
    value: function createdCallback() {
      var _this = this;

      // Core properties

      /**
       * @access private
       */
      this.minimap = undefined;
      /**
       * @access private
       */
      this.editorElement = undefined;
      /**
       * @access private
       */
      this.width = undefined;
      /**
       * @access private
       */
      this.height = undefined;

      // Subscriptions

      /**
       * @access private
       */
      this.subscriptions = new _atom.CompositeDisposable();
      /**
       * @access private
       */
      this.visibleAreaSubscription = undefined;
      /**
       * @access private
       */
      this.quickSettingsSubscription = undefined;
      /**
       * @access private
       */
      this.dragSubscription = undefined;
      /**
       * @access private
       */
      this.openQuickSettingSubscription = undefined;

      // Configs

      /**
      * @access private
      */
      this.displayMinimapOnLeft = false;
      /**
      * @access private
      */
      this.minimapScrollIndicator = undefined;
      /**
      * @access private
      */
      this.displayMinimapOnLeft = undefined;
      /**
      * @access private
      */
      this.displayPluginsControls = undefined;
      /**
      * @access private
      */
      this.textOpacity = undefined;
      /**
      * @access private
      */
      this.displayCodeHighlights = undefined;
      /**
      * @access private
      */
      this.adjustToSoftWrap = undefined;
      /**
      * @access private
      */
      this.useHardwareAcceleration = undefined;
      /**
      * @access private
      */
      this.absoluteMode = undefined;

      // Elements

      /**
       * @access private
       */
      this.shadowRoot = undefined;
      /**
       * @access private
       */
      this.visibleArea = undefined;
      /**
       * @access private
       */
      this.controls = undefined;
      /**
       * @access private
       */
      this.scrollIndicator = undefined;
      /**
       * @access private
       */
      this.openQuickSettings = undefined;
      /**
       * @access private
       */
      this.quickSettingsElement = undefined;

      // States

      /**
      * @access private
      */
      this.attached = undefined;
      /**
      * @access private
      */
      this.attachedToTextEditor = undefined;
      /**
      * @access private
      */
      this.standAlone = undefined;
      /**
       * @access private
       */
      this.wasVisible = undefined;

      // Other

      /**
       * @access private
       */
      this.offscreenFirstRow = undefined;
      /**
       * @access private
       */
      this.offscreenLastRow = undefined;
      /**
       * @access private
       */
      this.frameRequested = undefined;
      /**
       * @access private
       */
      this.flexBasis = undefined;

      this.initializeContent();

      return this.observeConfig({
        'minimap.displayMinimapOnLeft': function minimapDisplayMinimapOnLeft(displayMinimapOnLeft) {
          _this.displayMinimapOnLeft = displayMinimapOnLeft;

          _this.updateMinimapFlexPosition();
        },

        'minimap.minimapScrollIndicator': function minimapMinimapScrollIndicator(minimapScrollIndicator) {
          _this.minimapScrollIndicator = minimapScrollIndicator;

          if (_this.minimapScrollIndicator && !(_this.scrollIndicator != null) && !_this.standAlone) {
            _this.initializeScrollIndicator();
          } else if (_this.scrollIndicator != null) {
            _this.disposeScrollIndicator();
          }

          if (_this.attached) {
            _this.requestUpdate();
          }
        },

        'minimap.displayPluginsControls': function minimapDisplayPluginsControls(displayPluginsControls) {
          _this.displayPluginsControls = displayPluginsControls;

          if (_this.displayPluginsControls && !(_this.openQuickSettings != null) && !_this.standAlone) {
            _this.initializeOpenQuickSettings();
          } else if (_this.openQuickSettings != null) {
            _this.disposeOpenQuickSettings();
          }
        },

        'minimap.textOpacity': function minimapTextOpacity(textOpacity) {
          _this.textOpacity = textOpacity;

          if (_this.attached) {
            _this.requestForcedUpdate();
          }
        },

        'minimap.displayCodeHighlights': function minimapDisplayCodeHighlights(displayCodeHighlights) {
          _this.displayCodeHighlights = displayCodeHighlights;

          if (_this.attached) {
            _this.requestForcedUpdate();
          }
        },

        'minimap.smoothScrolling': function minimapSmoothScrolling(smoothScrolling) {
          _this.smoothScrolling = smoothScrolling;

          if (_this.attached) {
            if (!_this.smoothScrolling) {
              _this.backLayer.canvas.style.cssText = '';
              _this.tokensLayer.canvas.style.cssText = '';
              _this.frontLayer.canvas.style.cssText = '';
            } else {
              _this.requestUpdate();
            }
          }
        },

        'minimap.adjustMinimapWidthToSoftWrap': function minimapAdjustMinimapWidthToSoftWrap(adjustToSoftWrap) {
          _this.adjustToSoftWrap = adjustToSoftWrap;

          if (_this.attached) {
            _this.measureHeightAndWidth();
          }
        },

        'minimap.useHardwareAcceleration': function minimapUseHardwareAcceleration(useHardwareAcceleration) {
          _this.useHardwareAcceleration = useHardwareAcceleration;

          if (_this.attached) {
            _this.requestUpdate();
          }
        },

        'minimap.absoluteMode': function minimapAbsoluteMode(absoluteMode) {
          _this.absoluteMode = absoluteMode;

          return _this.classList.toggle('absolute', _this.absoluteMode);
        },

        'editor.preferredLineLength': function editorPreferredLineLength() {
          if (_this.attached) {
            _this.measureHeightAndWidth();
          }
        },

        'editor.softWrap': function editorSoftWrap() {
          if (_this.attached) {
            _this.requestUpdate();
          }
        },

        'editor.softWrapAtPreferredLineLength': function editorSoftWrapAtPreferredLineLength() {
          if (_this.attached) {
            _this.requestUpdate();
          }
        }
      });
    }

    /**
     * DOM callback invoked when a new MinimapElement is attached to the DOM.
     *
     * @access private
     */
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      var _this2 = this;

      this.subscriptions.add(atom.views.pollDocument(function () {
        _this2.pollDOM();
      }));
      this.measureHeightAndWidth();
      this.updateMinimapFlexPosition();
      this.attached = true;
      this.attachedToTextEditor = this.parentNode === this.getTextEditorElementRoot();

      /*
        We use `atom.styles.onDidAddStyleElement` instead of
        `atom.themes.onDidChangeActiveThemes`.
        Why? Currently, The style element will be removed first, and then re-added
        and the `change` event has not be triggered in the process.
      */
      return this.subscriptions.add(atom.styles.onDidAddStyleElement(function () {
        _this2.invalidateDOMStylesCache();
        _this2.requestForcedUpdate();
      }));
    }

    /**
     * DOM callback invoked when a new MinimapElement is detached from the DOM.
     *
     * @access private
     */
  }, {
    key: 'detachedCallback',
    value: function detachedCallback() {
      this.attached = false;
    }

    //       ###    ######## ########    ###     ######  ##     ##
    //      ## ##      ##       ##      ## ##   ##    ## ##     ##
    //     ##   ##     ##       ##     ##   ##  ##       ##     ##
    //    ##     ##    ##       ##    ##     ## ##       #########
    //    #########    ##       ##    ######### ##       ##     ##
    //    ##     ##    ##       ##    ##     ## ##    ## ##     ##
    //    ##     ##    ##       ##    ##     ##  ######  ##     ##

    /**
     * Returns whether the MinimapElement is currently visible on screen or not.
     *
     * The visibility of the minimap is defined by testing the size of the offset
     * width and height of the element.
     *
     * @return {boolean} whether the MinimapElement is currently visible or not
     */
  }, {
    key: 'isVisible',
    value: function isVisible() {
      return this.offsetWidth > 0 || this.offsetHeight > 0;
    }

    /**
     * Attaches the MinimapElement to the DOM.
     *
     * The position at which the element is attached is defined by the
     * `displayMinimapOnLeft` setting.
     *
     * @param  {HTMLElement} [parent] the DOM node where attaching the minimap
     *                                element
     */
  }, {
    key: 'attach',
    value: function attach(parent) {
      if (this.attached) {
        return;
      }
      (parent || this.getTextEditorElementRoot()).appendChild(this);
    }

    /**
     * Detaches the MinimapElement from the DOM.
     */
  }, {
    key: 'detach',
    value: function detach() {
      if (!this.attached || this.parentNode == null) {
        return;
      }
      this.parentNode.removeChild(this);
    }

    /**
     * Toggles the minimap left/right position based on the value of the
     * `displayMinimapOnLeft` setting.
     *
     * @access private
     */
  }, {
    key: 'updateMinimapFlexPosition',
    value: function updateMinimapFlexPosition() {
      this.classList.toggle('left', this.displayMinimapOnLeft);
    }

    /**
     * Destroys this MinimapElement
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      this.subscriptions.dispose();
      this.detach();
      this.minimap = null;
    }

    //     ######   #######  ##    ## ######## ######## ##    ## ########
    //    ##    ## ##     ## ###   ##    ##    ##       ###   ##    ##
    //    ##       ##     ## ####  ##    ##    ##       ####  ##    ##
    //    ##       ##     ## ## ## ##    ##    ######   ## ## ##    ##
    //    ##       ##     ## ##  ####    ##    ##       ##  ####    ##
    //    ##    ## ##     ## ##   ###    ##    ##       ##   ###    ##
    //     ######   #######  ##    ##    ##    ######## ##    ##    ##

    /**
     * Creates the content of the MinimapElement and attaches the mouse control
     * event listeners.
     *
     * @access private
     */
  }, {
    key: 'initializeContent',
    value: function initializeContent() {
      var _this3 = this;

      this.initializeCanvas();

      this.shadowRoot = this.createShadowRoot();
      this.attachCanvases(this.shadowRoot);

      this.createVisibleArea();
      this.createControls();

      this.subscriptions.add(this.subscribeTo(this, {
        'mousewheel': function mousewheel(e) {
          if (!_this3.standAlone) {
            _this3.relayMousewheelEvent(e);
          }
        }
      }));

      this.subscriptions.add(this.subscribeTo(this.getFrontCanvas(), {
        'mousedown': function mousedown(e) {
          _this3.canvasPressed(_this3.extractMouseEventData(e));
        },
        'touchstart': function touchstart(e) {
          _this3.canvasPressed(_this3.extractTouchEventData(e));
        }
      }));
    }

    /**
     * Initializes the visible area div.
     *
     * @access private
     */
  }, {
    key: 'createVisibleArea',
    value: function createVisibleArea() {
      var _this4 = this;

      if (this.visibleArea) {
        return;
      }

      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.visibleAreaSubscription = this.subscribeTo(this.visibleArea, {
        'mousedown': function mousedown(e) {
          _this4.startDrag(_this4.extractMouseEventData(e));
        },
        'touchstart': function touchstart(e) {
          _this4.startDrag(_this4.extractTouchEventData(e));
        }
      });

      this.subscriptions.add(this.visibleAreaSubscription);
    }

    /**
     * Removes the visible area div.
     *
     * @access private
     */
  }, {
    key: 'removeVisibleArea',
    value: function removeVisibleArea() {
      if (!this.visibleArea) {
        return;
      }

      this.subscriptions.remove(this.visibleAreaSubscription);
      this.visibleAreaSubscription.dispose();
      this.shadowRoot.removeChild(this.visibleArea);
      delete this.visibleArea;
    }

    /**
     * Creates the controls container div.
     *
     * @access private
     */
  }, {
    key: 'createControls',
    value: function createControls() {
      if (this.controls || this.standAlone) {
        return;
      }

      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      this.shadowRoot.appendChild(this.controls);
    }

    /**
     * Removes the controls container div.
     *
     * @access private
     */
  }, {
    key: 'removeControls',
    value: function removeControls() {
      if (!this.controls) {
        return;
      }

      this.shadowRoot.removeChild(this.controls);
      delete this.controls;
    }

    /**
     * Initializes the scroll indicator div when the `minimapScrollIndicator`
     * settings is enabled.
     *
     * @access private
     */
  }, {
    key: 'initializeScrollIndicator',
    value: function initializeScrollIndicator() {
      if (this.scrollIndicator || this.standAlone) {
        return;
      }

      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      this.controls.appendChild(this.scrollIndicator);
    }

    /**
     * Disposes the scroll indicator div when the `minimapScrollIndicator`
     * settings is disabled.
     *
     * @access private
     */
  }, {
    key: 'disposeScrollIndicator',
    value: function disposeScrollIndicator() {
      if (!this.scrollIndicator) {
        return;
      }

      this.controls.removeChild(this.scrollIndicator);
      delete this.scrollIndicator;
    }

    /**
     * Initializes the quick settings openener div when the
     * `displayPluginsControls` setting is enabled.
     *
     * @access private
     */
  }, {
    key: 'initializeOpenQuickSettings',
    value: function initializeOpenQuickSettings() {
      var _this5 = this;

      if (this.openQuickSettings || this.standAlone) {
        return;
      }

      this.openQuickSettings = document.createElement('div');
      this.openQuickSettings.classList.add('open-minimap-quick-settings');
      this.controls.appendChild(this.openQuickSettings);

      this.openQuickSettingSubscription = this.subscribeTo(this.openQuickSettings, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          e.stopPropagation();

          if (_this5.quickSettingsElement != null) {
            _this5.quickSettingsElement.destroy();
            _this5.quickSettingsSubscription.dispose();
          } else {
            _this5.quickSettingsElement = new _minimapQuickSettingsElement2['default']();
            _this5.quickSettingsElement.setModel(_this5);
            _this5.quickSettingsSubscription = _this5.quickSettingsElement.onDidDestroy(function () {
              _this5.quickSettingsElement = null;
            });

            var _getFrontCanvas$getBoundingClientRect = _this5.getFrontCanvas().getBoundingClientRect();

            var _top = _getFrontCanvas$getBoundingClientRect.top;
            var left = _getFrontCanvas$getBoundingClientRect.left;
            var right = _getFrontCanvas$getBoundingClientRect.right;

            _this5.quickSettingsElement.style.top = _top + 'px';
            _this5.quickSettingsElement.attach();

            if (_this5.displayMinimapOnLeft) {
              _this5.quickSettingsElement.style.left = right + 'px';
            } else {
              _this5.quickSettingsElement.style.left = left - _this5.quickSettingsElement.clientWidth + 'px';
            }
          }
        }
      });
    }

    /**
     * Disposes the quick settings openener div when the `displayPluginsControls`
     * setting is disabled.
     *
     * @access private
     */
  }, {
    key: 'disposeOpenQuickSettings',
    value: function disposeOpenQuickSettings() {
      if (!this.openQuickSettings) {
        return;
      }

      this.controls.removeChild(this.openQuickSettings);
      this.openQuickSettingSubscription.dispose();
      delete this.openQuickSettings;
    }

    /**
     * Returns the target `TextEditor` of the Minimap.
     *
     * @return {TextEditor} the minimap's text editor
     */
  }, {
    key: 'getTextEditor',
    value: function getTextEditor() {
      return this.minimap.getTextEditor();
    }

    /**
     * Returns the `TextEditorElement` for the Minimap's `TextEditor`.
     *
     * @return {TextEditorElement} the minimap's text editor element
     */
  }, {
    key: 'getTextEditorElement',
    value: function getTextEditorElement() {
      if (this.editorElement) {
        return this.editorElement;
      }

      this.editorElement = atom.views.getView(this.getTextEditor());
      return this.editorElement;
    }

    /**
     * Returns the root of the `TextEditorElement` content.
     *
     * This method is mostly used to ensure compatibility with the `shadowDom`
     * setting.
     *
     * @return {HTMLElement} the root of the `TextEditorElement` content
     */
  }, {
    key: 'getTextEditorElementRoot',
    value: function getTextEditorElementRoot() {
      var editorElement = this.getTextEditorElement();

      if (editorElement.shadowRoot) {
        return editorElement.shadowRoot;
      } else {
        return editorElement;
      }
    }

    /**
     * Returns the root where to inject the dummy node used to read DOM styles.
     *
     * @param  {boolean} shadowRoot whether to use the text editor shadow DOM
     *                              or not
     * @return {HTMLElement} the root node where appending the dummy node
     * @access private
     */
  }, {
    key: 'getDummyDOMRoot',
    value: function getDummyDOMRoot(shadowRoot) {
      if (shadowRoot) {
        return this.getTextEditorElementRoot();
      } else {
        return this.getTextEditorElement();
      }
    }

    //    ##     ##  #######  ########  ######## ##
    //    ###   ### ##     ## ##     ## ##       ##
    //    #### #### ##     ## ##     ## ##       ##
    //    ## ### ## ##     ## ##     ## ######   ##
    //    ##     ## ##     ## ##     ## ##       ##
    //    ##     ## ##     ## ##     ## ##       ##
    //    ##     ##  #######  ########  ######## ########

    /**
     * Returns the Minimap for which this MinimapElement was created.
     *
     * @return {Minimap} this element's Minimap
     */
  }, {
    key: 'getModel',
    value: function getModel() {
      return this.minimap;
    }

    /**
     * Defines the Minimap model for this MinimapElement instance.
     *
     * @param  {Minimap} minimap the Minimap model for this instance.
     * @return {Minimap} this element's Minimap
     */
  }, {
    key: 'setModel',
    value: function setModel(minimap) {
      var _this6 = this;

      this.minimap = minimap;
      this.subscriptions.add(this.minimap.onDidChangeScrollTop(function () {
        _this6.requestUpdate();
      }));
      this.subscriptions.add(this.minimap.onDidChangeScrollLeft(function () {
        _this6.requestUpdate();
      }));
      this.subscriptions.add(this.minimap.onDidDestroy(function () {
        _this6.destroy();
      }));
      this.subscriptions.add(this.minimap.onDidChangeConfig(function () {
        if (_this6.attached) {
          return _this6.requestForcedUpdate();
        }
      }));

      this.subscriptions.add(this.minimap.onDidChangeStandAlone(function () {
        _this6.setStandAlone(_this6.minimap.isStandAlone());
        _this6.requestUpdate();
      }));

      this.subscriptions.add(this.minimap.onDidChange(function (change) {
        _this6.pendingChanges.push(change);
        _this6.requestUpdate();
      }));

      this.subscriptions.add(this.minimap.onDidChangeDecorationRange(function (change) {
        var type = change.type;

        if (type === 'line' || type === 'highlight-under') {
          _this6.pendingBackDecorationChanges.push(change);
        } else {
          _this6.pendingFrontDecorationChanges.push(change);
        }
        _this6.requestUpdate();
      }));

      this.setStandAlone(this.minimap.isStandAlone());

      if (this.width != null && this.height != null) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }

      return this.minimap;
    }

    /**
     * Sets the stand-alone mode for this MinimapElement.
     *
     * @param {boolean} standAlone the new mode for this MinimapElement
     */
  }, {
    key: 'setStandAlone',
    value: function setStandAlone(standAlone) {
      this.standAlone = standAlone;

      if (this.standAlone) {
        this.setAttribute('stand-alone', true);
        this.disposeScrollIndicator();
        this.disposeOpenQuickSettings();
        this.removeControls();
        this.removeVisibleArea();
      } else {
        this.removeAttribute('stand-alone');
        this.createVisibleArea();
        this.createControls();
        if (this.minimapScrollIndicator) {
          this.initializeScrollIndicator();
        }
        if (this.displayPluginsControls) {
          this.initializeOpenQuickSettings();
        }
      }
    }

    //    ##     ## ########  ########     ###    ######## ########
    //    ##     ## ##     ## ##     ##   ## ##      ##    ##
    //    ##     ## ##     ## ##     ##  ##   ##     ##    ##
    //    ##     ## ########  ##     ## ##     ##    ##    ######
    //    ##     ## ##        ##     ## #########    ##    ##
    //    ##     ## ##        ##     ## ##     ##    ##    ##
    //     #######  ##        ########  ##     ##    ##    ########

    /**
     * Requests an update to be performed on the next frame.
     */
  }, {
    key: 'requestUpdate',
    value: function requestUpdate() {
      var _this7 = this;

      if (this.frameRequested) {
        return;
      }

      this.frameRequested = true;
      requestAnimationFrame(function () {
        _this7.update();
        _this7.frameRequested = false;
      });
    }

    /**
     * Requests an update to be performed on the next frame that will completely
     * redraw the minimap.
     */
  }, {
    key: 'requestForcedUpdate',
    value: function requestForcedUpdate() {
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      this.requestUpdate();
    }

    /**
     * Performs the actual MinimapElement update.
     *
     * @access private
     */
  }, {
    key: 'update',
    value: function update() {
      if (!(this.attached && this.isVisible() && this.minimap)) {
        return;
      }
      var minimap = this.minimap;
      minimap.enableCache();
      var canvas = this.getFrontCanvas();

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var visibleAreaLeft = minimap.getTextEditorScaledScrollLeft();
      var visibleAreaTop = minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop();
      var visibleWidth = Math.min(canvas.width / devicePixelRatio, this.width);

      if (this.adjustToSoftWrap && this.flexBasis) {
        this.style.flexBasis = this.flexBasis + 'px';
      } else {
        this.style.flexBasis = null;
      }

      if (SPEC_MODE) {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: minimap.getTextEditorScaledHeight() + 'px',
          top: visibleAreaTop + 'px',
          left: visibleAreaLeft + 'px'
        });
      } else {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: minimap.getTextEditorScaledHeight() + 'px',
          transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
        });
      }

      this.applyStyles(this.controls, { width: visibleWidth + 'px' });

      var canvasTop = minimap.getFirstVisibleScreenRow() * minimap.getLineHeight() - minimap.getScrollTop();

      var canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += ' ' + this.makeScale(1 / devicePixelRatio);
      }

      if (this.smoothScrolling) {
        if (SPEC_MODE) {
          this.applyStyles(this.backLayer.canvas, { top: canvasTop + 'px' });
          this.applyStyles(this.tokensLayer.canvas, { top: canvasTop + 'px' });
          this.applyStyles(this.frontLayer.canvas, { top: canvasTop + 'px' });
        } else {
          this.applyStyles(this.backLayer.canvas, { transform: canvasTransform });
          this.applyStyles(this.tokensLayer.canvas, { transform: canvasTransform });
          this.applyStyles(this.frontLayer.canvas, { transform: canvasTransform });
        }
      }

      if (this.minimapScrollIndicator && minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }

      if (this.scrollIndicator != null) {
        var minimapScreenHeight = minimap.getScreenHeight();
        var indicatorHeight = minimapScreenHeight * (minimapScreenHeight / minimap.getHeight());
        var indicatorScroll = (minimapScreenHeight - indicatorHeight) * minimap.getCapedTextEditorScrollRatio();

        if (SPEC_MODE) {
          this.applyStyles(this.scrollIndicator, {
            height: indicatorHeight + 'px',
            top: indicatorScroll + 'px'
          });
        } else {
          this.applyStyles(this.scrollIndicator, {
            height: indicatorHeight + 'px',
            transform: this.makeTranslate(0, indicatorScroll)
          });
        }

        if (!minimap.canScroll()) {
          this.disposeScrollIndicator();
        }
      }

      this.updateCanvas();
      minimap.clearCache();
    }

    /**
     * Defines whether to render the code highlights or not.
     *
     * @param {Boolean} displayCodeHighlights whether to render the code
     *                                        highlights or not
     */
  }, {
    key: 'setDisplayCodeHighlights',
    value: function setDisplayCodeHighlights(displayCodeHighlights) {
      this.displayCodeHighlights = displayCodeHighlights;
      if (this.attached) {
        this.requestForcedUpdate();
      }
    }

    /**
     * Polling callback used to detect visibility and size changes.
     *
     * @access private
     */
  }, {
    key: 'pollDOM',
    value: function pollDOM() {
      var visibilityChanged = this.checkForVisibilityChange();
      if (this.isVisible()) {
        if (!this.wasVisible) {
          this.requestForcedUpdate();
        }

        this.measureHeightAndWidth(visibilityChanged, false);
      }
    }

    /**
     * A method that checks for visibility changes in the MinimapElement.
     * The method returns `true` when the visibility changed from visible to
     * hidden or from hidden to visible.
     *
     * @return {boolean} whether the visibility changed or not since the last call
     * @access private
     */
  }, {
    key: 'checkForVisibilityChange',
    value: function checkForVisibilityChange() {
      if (this.isVisible()) {
        if (this.wasVisible) {
          return false;
        } else {
          this.wasVisible = true;
          return this.wasVisible;
        }
      } else {
        if (this.wasVisible) {
          this.wasVisible = false;
          return true;
        } else {
          this.wasVisible = false;
          return this.wasVisible;
        }
      }
    }

    /**
     * A method used to measure the size of the MinimapElement and update internal
     * components based on the new size.
     *
     * @param  {boolean} visibilityChanged did the visibility changed since last
     *                                     measurement
     * @param  {[type]} [forceUpdate=true] forces the update even when no changes
     *                                     were detected
     * @access private
     */
  }, {
    key: 'measureHeightAndWidth',
    value: function measureHeightAndWidth(visibilityChanged) {
      var forceUpdate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!this.minimap) {
        return;
      }

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var wasResized = this.width !== this.clientWidth || this.height !== this.clientHeight;

      this.height = this.clientHeight;
      this.width = this.clientWidth;
      var canvasWidth = this.width;

      if (this.minimap != null) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }

      if (wasResized || visibilityChanged || forceUpdate) {
        this.requestForcedUpdate();
      }

      if (!this.isVisible()) {
        return;
      }

      if (wasResized || forceUpdate) {
        if (this.adjustToSoftWrap) {
          var lineLength = atom.config.get('editor.preferredLineLength');
          var softWrap = atom.config.get('editor.softWrap');
          var softWrapAtPreferredLineLength = atom.config.get('editor.softWrapAtPreferredLineLength');
          var width = lineLength * this.minimap.getCharWidth();

          if (softWrap && softWrapAtPreferredLineLength && lineLength && width <= this.width) {
            this.flexBasis = width;
            canvasWidth = width;
          } else {
            delete this.flexBasis;
          }
        } else {
          delete this.flexBasis;
        }

        var canvas = this.getFrontCanvas();
        if (canvasWidth !== canvas.width || this.height !== canvas.height) {
          this.setCanvasesSize(canvasWidth * devicePixelRatio, (this.height + this.minimap.getLineHeight()) * devicePixelRatio);
        }
      }
    }

    //    ######## ##     ## ######## ##    ## ########  ######
    //    ##       ##     ## ##       ###   ##    ##    ##    ##
    //    ##       ##     ## ##       ####  ##    ##    ##
    //    ######   ##     ## ######   ## ## ##    ##     ######
    //    ##        ##   ##  ##       ##  ####    ##          ##
    //    ##         ## ##   ##       ##   ###    ##    ##    ##
    //    ########    ###    ######## ##    ##    ##     ######

    /**
     * Helper method to register config observers.
     *
     * @param  {Object} configs={} an object mapping the config name to observe
     *                             with the function to call back when a change
     *                             occurs
     * @access private
     */
  }, {
    key: 'observeConfig',
    value: function observeConfig() {
      var configs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      for (var config in configs) {
        this.subscriptions.add(atom.config.observe(config, configs[config]));
      }
    }

    /**
     * Callback triggered when the mouse is pressed on the MinimapElement canvas.
     *
     * @param  {number} y the vertical coordinate of the event
     * @param  {boolean} isLeftMouse was the left mouse button pressed?
     * @param  {boolean} isMiddleMouse was the middle mouse button pressed?
     * @access private
     */
  }, {
    key: 'canvasPressed',
    value: function canvasPressed(_ref) {
      var y = _ref.y;
      var isLeftMouse = _ref.isLeftMouse;
      var isMiddleMouse = _ref.isMiddleMouse;

      if (this.minimap.isStandAlone()) {
        return;
      }
      if (isLeftMouse) {
        this.canvasLeftMousePressed(y);
      } else if (isMiddleMouse) {
        this.canvasMiddleMousePressed(y);

        var _visibleArea$getBoundingClientRect = this.visibleArea.getBoundingClientRect();

        var _top2 = _visibleArea$getBoundingClientRect.top;
        var height = _visibleArea$getBoundingClientRect.height;

        this.startDrag({ y: _top2 + height / 2, isLeftMouse: false, isMiddleMouse: true });
      }
    }

    /**
     * Callback triggered when the mouse left button is pressed on the
     * MinimapElement canvas.
     *
     * @param  {MouseEvent} e the mouse event object
     * @param  {number} e.pageY the mouse y position in page
     * @param  {HTMLElement} e.target the source of the event
     * @access private
     */
  }, {
    key: 'canvasLeftMousePressed',
    value: function canvasLeftMousePressed(y) {
      var _this8 = this;

      var deltaY = y - this.getBoundingClientRect().top;
      var row = Math.floor(deltaY / this.minimap.getLineHeight()) + this.minimap.getFirstVisibleScreenRow();

      var textEditor = this.minimap.getTextEditor();

      var scrollTop = row * textEditor.getLineHeightInPixels() - this.minimap.getTextEditorHeight() / 2;

      if (atom.config.get('minimap.scrollAnimation')) {
        var from = this.minimap.getTextEditorScrollTop();
        var to = scrollTop;
        var step = function step(now) {
          return _this8.minimap.setTextEditorScrollTop(now);
        };
        var duration = atom.config.get('minimap.scrollAnimationDuration');
        this.animate({ from: from, to: to, duration: duration, step: step });
      } else {
        this.minimap.setTextEditorScrollTop(scrollTop);
      }
    }

    /**
     * Callback triggered when the mouse middle button is pressed on the
     * MinimapElement canvas.
     *
     * @param  {MouseEvent} e the mouse event object
     * @param  {number} e.pageY the mouse y position in page
     * @access private
     */
  }, {
    key: 'canvasMiddleMousePressed',
    value: function canvasMiddleMousePressed(y) {
      var _getBoundingClientRect = this.getBoundingClientRect();

      var offsetTop = _getBoundingClientRect.top;

      var deltaY = y - offsetTop - this.minimap.getTextEditorScaledHeight() / 2;

      var ratio = deltaY / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());

      this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    }

    /**
     * A method that relays the `mousewheel` events received by the MinimapElement
     * to the `TextEditorElement`.
     *
     * @param  {MouseEvent} e the mouse event object
     * @access private
     */
  }, {
    key: 'relayMousewheelEvent',
    value: function relayMousewheelEvent(e) {
      this.getTextEditorElement().component.onMouseWheel(e);
    }

    /**
     * A method that extracts data from a `MouseEvent` which can then be used to
     * process clicks and drags of the minimap.
     *
     * Used together with `extractTouchEventData` to provide a unified interface
     * for `MouseEvent`s and `TouchEvent`s.
     *
     * @param  {MouseEvent} mouseEvent the mouse event object
     * @access private
     */
  }, {
    key: 'extractMouseEventData',
    value: function extractMouseEventData(mouseEvent) {
      return {
        x: mouseEvent.pageX,
        y: mouseEvent.pageY,
        isLeftMouse: mouseEvent.which === 1,
        isMiddleMouse: mouseEvent.which === 2
      };
    }

    /**
     * A method that extracts data from a `TouchEvent` which can then be used to
     * process clicks and drags of the minimap.
     *
     * Used together with `extractMouseEventData` to provide a unified interface
     * for `MouseEvent`s and `TouchEvent`s.
     *
     * @param  {TouchEvent} touchEvent the touch event object
     * @access private
     */
  }, {
    key: 'extractTouchEventData',
    value: function extractTouchEventData(touchEvent) {
      // Use the first touch on the target area. Other touches will be ignored in
      // case of multi-touch.
      var touch = touchEvent.changedTouches[0];

      return {
        x: touch.pageX,
        y: touch.pageY,
        isLeftMouse: true, // Touch is treated like a left mouse button click
        isMiddleMouse: false
      };
    }

    //    ########    ####    ########
    //    ##     ##  ##  ##   ##     ##
    //    ##     ##   ####    ##     ##
    //    ##     ##  ####     ##     ##
    //    ##     ## ##  ## ## ##     ##
    //    ##     ## ##   ##   ##     ##
    //    ########   ####  ## ########

    /**
     * A method triggered when the mouse is pressed over the visible area that
     * starts the dragging gesture.
     *
     * @param  {number} y the vertical coordinate of the event
     * @param  {boolean} isLeftMouse was the left mouse button pressed?
     * @param  {boolean} isMiddleMouse was the middle mouse button pressed?
     * @access private
     */
  }, {
    key: 'startDrag',
    value: function startDrag(_ref2) {
      var _this9 = this;

      var y = _ref2.y;
      var isLeftMouse = _ref2.isLeftMouse;
      var isMiddleMouse = _ref2.isMiddleMouse;

      if (!this.minimap) {
        return;
      }
      if (!isLeftMouse && !isMiddleMouse) {
        return;
      }

      var _visibleArea$getBoundingClientRect2 = this.visibleArea.getBoundingClientRect();

      var top = _visibleArea$getBoundingClientRect2.top;

      var _getBoundingClientRect2 = this.getBoundingClientRect();

      var offsetTop = _getBoundingClientRect2.top;

      var dragOffset = y - top;

      var initial = { dragOffset: dragOffset, offsetTop: offsetTop };

      var mousemoveHandler = function mousemoveHandler(e) {
        return _this9.drag(_this9.extractMouseEventData(e), initial);
      };
      var mouseupHandler = function mouseupHandler(e) {
        return _this9.endDrag();
      };

      var touchmoveHandler = function touchmoveHandler(e) {
        return _this9.drag(_this9.extractTouchEventData(e), initial);
      };
      var touchendHandler = function touchendHandler(e) {
        return _this9.endDrag();
      };

      document.body.addEventListener('mousemove', mousemoveHandler);
      document.body.addEventListener('mouseup', mouseupHandler);
      document.body.addEventListener('mouseleave', mouseupHandler);

      document.body.addEventListener('touchmove', touchmoveHandler);
      document.body.addEventListener('touchend', touchendHandler);
      document.body.addEventListener('touchcancel', touchendHandler);

      this.dragSubscription = new _atom.Disposable(function () {
        document.body.removeEventListener('mousemove', mousemoveHandler);
        document.body.removeEventListener('mouseup', mouseupHandler);
        document.body.removeEventListener('mouseleave', mouseupHandler);

        document.body.removeEventListener('touchmove', touchmoveHandler);
        document.body.removeEventListener('touchend', touchendHandler);
        document.body.removeEventListener('touchcancel', touchendHandler);
      });
    }

    /**
     * The method called during the drag gesture.
     *
     * @param  {number} y the vertical coordinate of the event
     * @param  {boolean} isLeftMouse was the left mouse button pressed?
     * @param  {boolean} isMiddleMouse was the middle mouse button pressed?
     * @param  {number} initial.dragOffset the mouse offset within the visible
     *                                     area
     * @param  {number} initial.offsetTop the MinimapElement offset at the moment
     *                                    of the drag start
     * @access private
     */
  }, {
    key: 'drag',
    value: function drag(_ref3, initial) {
      var y = _ref3.y;
      var isLeftMouse = _ref3.isLeftMouse;
      var isMiddleMouse = _ref3.isMiddleMouse;

      if (!this.minimap) {
        return;
      }
      if (!isLeftMouse && !isMiddleMouse) {
        return;
      }
      var deltaY = y - initial.offsetTop - initial.dragOffset;

      var ratio = deltaY / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());

      this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    }

    /**
     * The method that ends the drag gesture.
     *
     * @access private
     */
  }, {
    key: 'endDrag',
    value: function endDrag() {
      if (!this.minimap) {
        return;
      }
      this.dragSubscription.dispose();
    }

    //     ######   ######   ######
    //    ##    ## ##    ## ##    ##
    //    ##       ##       ##
    //    ##        ######   ######
    //    ##             ##       ##
    //    ##    ## ##    ## ##    ##
    //     ######   ######   ######

    /**
     * Applies the passed-in styles properties to the specified element
     *
     * @param  {HTMLElement} element the element onto which apply the styles
     * @param  {Object} styles the styles to apply
     * @access private
     */
  }, {
    key: 'applyStyles',
    value: function applyStyles(element, styles) {
      if (!element) {
        return;
      }

      var cssText = '';
      for (var property in styles) {
        cssText += property + ': ' + styles[property] + '; ';
      }

      element.style.cssText = cssText;
    }

    /**
     * Returns a string with a CSS translation tranform value.
     *
     * @param  {number} [x = 0] the x offset of the translation
     * @param  {number} [y = 0] the y offset of the translation
     * @return {string} the CSS translation string
     * @access private
     */
  }, {
    key: 'makeTranslate',
    value: function makeTranslate() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (this.useHardwareAcceleration) {
        return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      } else {
        return 'translate(' + x + 'px, ' + y + 'px)';
      }
    }

    /**
     * Returns a string with a CSS scaling tranform value.
     *
     * @param  {number} [x = 0] the x scaling factor
     * @param  {number} [y = 0] the y scaling factor
     * @return {string} the CSS scaling string
     * @access private
     */
  }, {
    key: 'makeScale',
    value: function makeScale() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? x : arguments[1];
      return (function () {
        if (this.useHardwareAcceleration) {
          return 'scale3d(' + x + ', ' + y + ', 1)';
        } else {
          return 'scale(' + x + ', ' + y + ')';
        }
      }).apply(this, arguments);
    }

    /**
     * A method that return the current time as a Date.
     *
     * That method exist so that we can mock it in tests.
     *
     * @return {Date} the current time as Date
     * @access private
     */
  }, {
    key: 'getTime',
    value: function getTime() {
      return new Date();
    }

    /**
     * A method that mimic the jQuery `animate` method and used to animate the
     * scroll when clicking on the MinimapElement canvas.
     *
     * @param  {Object} param the animation data object
     * @param  {[type]} param.from the start value
     * @param  {[type]} param.to the end value
     * @param  {[type]} param.duration the animation duration
     * @param  {[type]} param.step the easing function for the animation
     * @access private
     */
  }, {
    key: 'animate',
    value: function animate(_ref4) {
      var _this10 = this;

      var from = _ref4.from;
      var to = _ref4.to;
      var duration = _ref4.duration;
      var step = _ref4.step;

      var progress = undefined;
      var start = this.getTime();

      var swing = function swing(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      };

      var update = function update() {
        if (!_this10.minimap) {
          return;
        }

        var passed = _this10.getTime() - start;
        if (duration === 0) {
          progress = 1;
        } else {
          progress = passed / duration;
        }
        if (progress > 1) {
          progress = 1;
        }
        var delta = swing(progress);
        step(from + (to - from) * delta);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      update();
    }
  }], [{
    key: 'registerViewProvider',

    /**
     * The method that registers the MinimapElement factory in the
     * `atom.views` registry with the Minimap model.
     */
    value: function registerViewProvider(Minimap) {
      atom.views.addViewProvider(Minimap, function (model) {
        var element = new MinimapElement();
        element.setModel(model);
        return element;
      });
    }
  }]);

  var _MinimapElement = MinimapElement;
  MinimapElement = (0, _decoratorsInclude2['default'])(_mixinsDomStylesReader2['default'], _mixinsCanvasDrawer2['default'], _atomUtils.EventsDelegation, _atomUtils.AncestorsMethods)(MinimapElement) || MinimapElement;
  MinimapElement = (0, _decoratorsElement2['default'])('atom-text-editor-minimap')(MinimapElement) || MinimapElement;
  return MinimapElement;
})();

exports['default'] = MinimapElement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAtZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUU4QyxNQUFNOzt5QkFDSCxZQUFZOztpQ0FDekMsc0JBQXNCOzs7O2lDQUN0QixzQkFBc0I7Ozs7cUNBQ2QsNEJBQTRCOzs7O2tDQUMvQix3QkFBd0I7Ozs7MkNBQ1Qsa0NBQWtDOzs7O0FBUjFFLFdBQVcsQ0FBQTs7QUFVWCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JkLGNBQWM7V0FBZCxjQUFjOzs7O2VBQWQsY0FBYzs7Ozs7Ozs7Ozs7Ozs7OztXQTJCakIsMkJBQUc7Ozs7Ozs7O0FBTWpCLFVBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBOzs7O0FBSXhCLFVBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFBOzs7O0FBSTlCLFVBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFBOzs7O0FBSXRCLFVBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFBOzs7Ozs7O0FBT3ZCLFVBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7Ozs7QUFJOUMsVUFBSSxDQUFDLHVCQUF1QixHQUFHLFNBQVMsQ0FBQTs7OztBQUl4QyxVQUFJLENBQUMseUJBQXlCLEdBQUcsU0FBUyxDQUFBOzs7O0FBSTFDLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUE7Ozs7QUFJakMsVUFBSSxDQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQTs7Ozs7OztBQU83QyxVQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFBOzs7O0FBSWpDLFVBQUksQ0FBQyxzQkFBc0IsR0FBRyxTQUFTLENBQUE7Ozs7QUFJdkMsVUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQTs7OztBQUlyQyxVQUFJLENBQUMsc0JBQXNCLEdBQUcsU0FB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QUFFLEdBQUcsS0FBSyxDQUFBO0FBQ25DLFlBQUksUUFBUSxLQUFLLENBQUMsRUFBRTtBQUNsQixrQkFBUSxHQUFHLENBQUMsQ0FBQTtTQUNiLE1BQU07QUFDTCxrQkFBUSxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUE7U0FDN0I7QUFDRCxZQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7QUFBRSxrQkFBUSxHQUFHLENBQUMsQ0FBQTtTQUFFO0FBQ2xDLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMzQixZQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQSxHQUFJLEtBQUssQ0FBQyxDQUFBOztBQUVoQyxZQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7QUFBRSwrQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUFFO09BQ3BELENBQUE7O0FBRUQsWUFBTSxFQUFFLENBQUE7S0FDVDs7Ozs7Ozs7V0Foc0MyQiw4QkFBQyxPQUFPLEVBQUU7QUFDcEMsVUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ25ELFlBQUksT0FBTyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUE7QUFDbEMsZUFBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN2QixlQUFPLE9BQU8sQ0FBQTtPQUNmLENBQUMsQ0FBQTtLQUNIOzs7d0JBWmtCLGNBQWM7QUFBZCxnQkFBYyxHQURsQyxrS0FBMEUsQ0FDdEQsY0FBYyxLQUFkLGNBQWM7QUFBZCxnQkFBYyxHQUZsQyxvQ0FBUSwwQkFBMEIsQ0FBQyxDQUVmLGNBQWMsS0FBZCxjQUFjO1NBQWQsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC1lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtFdmVudHNEZWxlZ2F0aW9uLCBBbmNlc3RvcnNNZXRob2RzfSBmcm9tICdhdG9tLXV0aWxzJ1xuaW1wb3J0IGluY2x1ZGUgZnJvbSAnLi9kZWNvcmF0b3JzL2luY2x1ZGUnXG5pbXBvcnQgZWxlbWVudCBmcm9tICcuL2RlY29yYXRvcnMvZWxlbWVudCdcbmltcG9ydCBET01TdHlsZXNSZWFkZXIgZnJvbSAnLi9taXhpbnMvZG9tLXN0eWxlcy1yZWFkZXInXG5pbXBvcnQgQ2FudmFzRHJhd2VyIGZyb20gJy4vbWl4aW5zL2NhbnZhcy1kcmF3ZXInXG5pbXBvcnQgTWluaW1hcFF1aWNrU2V0dGluZ3NFbGVtZW50IGZyb20gJy4vbWluaW1hcC1xdWljay1zZXR0aW5ncy1lbGVtZW50J1xuXG5jb25zdCBTUEVDX01PREUgPSBhdG9tLmluU3BlY01vZGUoKVxuXG4vKipcbiAqIFB1YmxpYzogVGhlIE1pbmltYXBFbGVtZW50IGlzIHRoZSB2aWV3IG1lYW50IHRvIHJlbmRlciBhIHtAbGluayBNaW5pbWFwfVxuICogaW5zdGFuY2UgaW4gdGhlIERPTS5cbiAqXG4gKiBZb3UgY2FuIHJldHJpZXZlIHRoZSBNaW5pbWFwRWxlbWVudCBhc3NvY2lhdGVkIHRvIGEgTWluaW1hcFxuICogdXNpbmcgdGhlIGBhdG9tLnZpZXdzLmdldFZpZXdgIG1ldGhvZC5cbiAqXG4gKiBOb3RlIHRoYXQgbW9zdCBpbnRlcmFjdGlvbnMgd2l0aCB0aGUgTWluaW1hcCBwYWNrYWdlIGlzIGRvbmUgdGhyb3VnaCB0aGVcbiAqIE1pbmltYXAgbW9kZWwgc28geW91IHNob3VsZCBuZXZlciBoYXZlIHRvIGFjY2VzcyBNaW5pbWFwRWxlbWVudFxuICogaW5zdGFuY2VzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBsZXQgbWluaW1hcEVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcobWluaW1hcClcbiAqL1xuQGVsZW1lbnQoJ2F0b20tdGV4dC1lZGl0b3ItbWluaW1hcCcpXG5AaW5jbHVkZShET01TdHlsZXNSZWFkZXIsIENhbnZhc0RyYXdlciwgRXZlbnRzRGVsZWdhdGlvbiwgQW5jZXN0b3JzTWV0aG9kcylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pbmltYXBFbGVtZW50IHtcblxuICAvKipcbiAgICogVGhlIG1ldGhvZCB0aGF0IHJlZ2lzdGVycyB0aGUgTWluaW1hcEVsZW1lbnQgZmFjdG9yeSBpbiB0aGVcbiAgICogYGF0b20udmlld3NgIHJlZ2lzdHJ5IHdpdGggdGhlIE1pbmltYXAgbW9kZWwuXG4gICAqL1xuICBzdGF0aWMgcmVnaXN0ZXJWaWV3UHJvdmlkZXIgKE1pbmltYXApIHtcbiAgICBhdG9tLnZpZXdzLmFkZFZpZXdQcm92aWRlcihNaW5pbWFwLCBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgIGxldCBlbGVtZW50ID0gbmV3IE1pbmltYXBFbGVtZW50KClcbiAgICAgIGVsZW1lbnQuc2V0TW9kZWwobW9kZWwpXG4gICAgICByZXR1cm4gZWxlbWVudFxuICAgIH0pXG4gIH1cblxuICAvLyAgICAjIyAgICAgIyMgICMjIyMjIyMgICAjIyMjIyMjICAjIyAgICAjIyAgIyMjIyMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICMjICAgIyMgICMjICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICMjICAjIyAgICMjXG4gIC8vICAgICMjIyMjIyMjIyAjIyAgICAgIyMgIyMgICAgICMjICMjIyMjICAgICAjIyMjIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMgICMjICAgICAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAjIyAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICAjIyMjIyMjICAgIyMjIyMjIyAgIyMgICAgIyMgICMjIyMjI1xuXG4gIC8qKlxuICAgKiBET00gY2FsbGJhY2sgaW52b2tlZCB3aGVuIGEgbmV3IE1pbmltYXBFbGVtZW50IGlzIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrICgpIHtcbiAgICAvLyBDb3JlIHByb3BlcnRpZXNcblxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMubWluaW1hcCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZWRpdG9yRWxlbWVudCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IHVuZGVmaW5lZFxuXG4gICAgLy8gU3Vic2NyaXB0aW9uc1xuXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMudmlzaWJsZUFyZWFTdWJzY3JpcHRpb24gPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnF1aWNrU2V0dGluZ3NTdWJzY3JpcHRpb24gPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRyYWdTdWJzY3JpcHRpb24gPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLm9wZW5RdWlja1NldHRpbmdTdWJzY3JpcHRpb24gPSB1bmRlZmluZWRcblxuICAgIC8vIENvbmZpZ3NcblxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmRpc3BsYXlNaW5pbWFwT25MZWZ0ID0gZmFsc2VcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy5taW5pbWFwU2Nyb2xsSW5kaWNhdG9yID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAqL1xuICAgIHRoaXMuZGlzcGxheU1pbmltYXBPbkxlZnQgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy5kaXNwbGF5UGx1Z2luc0NvbnRyb2xzID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAqL1xuICAgIHRoaXMudGV4dE9wYWNpdHkgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy5kaXNwbGF5Q29kZUhpZ2hsaWdodHMgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy5hZGp1c3RUb1NvZnRXcmFwID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAqL1xuICAgIHRoaXMudXNlSGFyZHdhcmVBY2NlbGVyYXRpb24gPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy5hYnNvbHV0ZU1vZGUgPSB1bmRlZmluZWRcblxuICAgIC8vIEVsZW1lbnRzXG5cbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnNoYWRvd1Jvb3QgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnZpc2libGVBcmVhID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb250cm9scyA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc2Nyb2xsSW5kaWNhdG9yID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5vcGVuUXVpY2tTZXR0aW5ncyA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQgPSB1bmRlZmluZWRcblxuICAgIC8vIFN0YXRlc1xuXG4gICAgLyoqXG4gICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAqL1xuICAgIHRoaXMuYXR0YWNoZWQgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy5hdHRhY2hlZFRvVGV4dEVkaXRvciA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLnN0YW5kQWxvbmUgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLndhc1Zpc2libGUgPSB1bmRlZmluZWRcblxuICAgIC8vIE90aGVyXG5cbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLm9mZnNjcmVlbkZpcnN0Um93ID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5vZmZzY3JlZW5MYXN0Um93ID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJlcXVlc3RlZCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZmxleEJhc2lzID0gdW5kZWZpbmVkXG5cbiAgICB0aGlzLmluaXRpYWxpemVDb250ZW50KClcblxuICAgIHJldHVybiB0aGlzLm9ic2VydmVDb25maWcoe1xuICAgICAgJ21pbmltYXAuZGlzcGxheU1pbmltYXBPbkxlZnQnOiAoZGlzcGxheU1pbmltYXBPbkxlZnQpID0+IHtcbiAgICAgICAgdGhpcy5kaXNwbGF5TWluaW1hcE9uTGVmdCA9IGRpc3BsYXlNaW5pbWFwT25MZWZ0XG5cbiAgICAgICAgdGhpcy51cGRhdGVNaW5pbWFwRmxleFBvc2l0aW9uKClcbiAgICAgIH0sXG5cbiAgICAgICdtaW5pbWFwLm1pbmltYXBTY3JvbGxJbmRpY2F0b3InOiAobWluaW1hcFNjcm9sbEluZGljYXRvcikgPT4ge1xuICAgICAgICB0aGlzLm1pbmltYXBTY3JvbGxJbmRpY2F0b3IgPSBtaW5pbWFwU2Nyb2xsSW5kaWNhdG9yXG5cbiAgICAgICAgaWYgKHRoaXMubWluaW1hcFNjcm9sbEluZGljYXRvciAmJiAhKHRoaXMuc2Nyb2xsSW5kaWNhdG9yICE9IG51bGwpICYmICF0aGlzLnN0YW5kQWxvbmUpIHtcbiAgICAgICAgICB0aGlzLmluaXRpYWxpemVTY3JvbGxJbmRpY2F0b3IoKVxuICAgICAgICB9IGVsc2UgaWYgKCh0aGlzLnNjcm9sbEluZGljYXRvciAhPSBudWxsKSkge1xuICAgICAgICAgIHRoaXMuZGlzcG9zZVNjcm9sbEluZGljYXRvcigpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyB0aGlzLnJlcXVlc3RVcGRhdGUoKSB9XG4gICAgICB9LFxuXG4gICAgICAnbWluaW1hcC5kaXNwbGF5UGx1Z2luc0NvbnRyb2xzJzogKGRpc3BsYXlQbHVnaW5zQ29udHJvbHMpID0+IHtcbiAgICAgICAgdGhpcy5kaXNwbGF5UGx1Z2luc0NvbnRyb2xzID0gZGlzcGxheVBsdWdpbnNDb250cm9sc1xuXG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMgJiYgISh0aGlzLm9wZW5RdWlja1NldHRpbmdzICE9IG51bGwpICYmICF0aGlzLnN0YW5kQWxvbmUpIHtcbiAgICAgICAgICB0aGlzLmluaXRpYWxpemVPcGVuUXVpY2tTZXR0aW5ncygpXG4gICAgICAgIH0gZWxzZSBpZiAoKHRoaXMub3BlblF1aWNrU2V0dGluZ3MgIT0gbnVsbCkpIHtcbiAgICAgICAgICB0aGlzLmRpc3Bvc2VPcGVuUXVpY2tTZXR0aW5ncygpXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICdtaW5pbWFwLnRleHRPcGFjaXR5JzogKHRleHRPcGFjaXR5KSA9PiB7XG4gICAgICAgIHRoaXMudGV4dE9wYWNpdHkgPSB0ZXh0T3BhY2l0eVxuXG4gICAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7IHRoaXMucmVxdWVzdEZvcmNlZFVwZGF0ZSgpIH1cbiAgICAgIH0sXG5cbiAgICAgICdtaW5pbWFwLmRpc3BsYXlDb2RlSGlnaGxpZ2h0cyc6IChkaXNwbGF5Q29kZUhpZ2hsaWdodHMpID0+IHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Q29kZUhpZ2hsaWdodHMgPSBkaXNwbGF5Q29kZUhpZ2hsaWdodHNcblxuICAgICAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyB0aGlzLnJlcXVlc3RGb3JjZWRVcGRhdGUoKSB9XG4gICAgICB9LFxuXG4gICAgICAnbWluaW1hcC5zbW9vdGhTY3JvbGxpbmcnOiAoc21vb3RoU2Nyb2xsaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuc21vb3RoU2Nyb2xsaW5nID0gc21vb3RoU2Nyb2xsaW5nXG5cbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuc21vb3RoU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tMYXllci5jYW52YXMuc3R5bGUuY3NzVGV4dCA9ICcnXG4gICAgICAgICAgICB0aGlzLnRva2Vuc0xheWVyLmNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gJydcbiAgICAgICAgICAgIHRoaXMuZnJvbnRMYXllci5jYW52YXMuc3R5bGUuY3NzVGV4dCA9ICcnXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFVwZGF0ZSgpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAnbWluaW1hcC5hZGp1c3RNaW5pbWFwV2lkdGhUb1NvZnRXcmFwJzogKGFkanVzdFRvU29mdFdyYXApID0+IHtcbiAgICAgICAgdGhpcy5hZGp1c3RUb1NvZnRXcmFwID0gYWRqdXN0VG9Tb2Z0V3JhcFxuXG4gICAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7IHRoaXMubWVhc3VyZUhlaWdodEFuZFdpZHRoKCkgfVxuICAgICAgfSxcblxuICAgICAgJ21pbmltYXAudXNlSGFyZHdhcmVBY2NlbGVyYXRpb24nOiAodXNlSGFyZHdhcmVBY2NlbGVyYXRpb24pID0+IHtcbiAgICAgICAgdGhpcy51c2VIYXJkd2FyZUFjY2VsZXJhdGlvbiA9IHVzZUhhcmR3YXJlQWNjZWxlcmF0aW9uXG5cbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgdGhpcy5yZXF1ZXN0VXBkYXRlKCkgfVxuICAgICAgfSxcblxuICAgICAgJ21pbmltYXAuYWJzb2x1dGVNb2RlJzogKGFic29sdXRlTW9kZSkgPT4ge1xuICAgICAgICB0aGlzLmFic29sdXRlTW9kZSA9IGFic29sdXRlTW9kZVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2Fic29sdXRlJywgdGhpcy5hYnNvbHV0ZU1vZGUpXG4gICAgICB9LFxuXG4gICAgICAnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnOiAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7IHRoaXMubWVhc3VyZUhlaWdodEFuZFdpZHRoKCkgfVxuICAgICAgfSxcblxuICAgICAgJ2VkaXRvci5zb2Z0V3JhcCc6ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgdGhpcy5yZXF1ZXN0VXBkYXRlKCkgfVxuICAgICAgfSxcblxuICAgICAgJ2VkaXRvci5zb2Z0V3JhcEF0UHJlZmVycmVkTGluZUxlbmd0aCc6ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgdGhpcy5yZXF1ZXN0VXBkYXRlKCkgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogRE9NIGNhbGxiYWNrIGludm9rZWQgd2hlbiBhIG5ldyBNaW5pbWFwRWxlbWVudCBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGF0dGFjaGVkQ2FsbGJhY2sgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS52aWV3cy5wb2xsRG9jdW1lbnQoKCkgPT4geyB0aGlzLnBvbGxET00oKSB9KSlcbiAgICB0aGlzLm1lYXN1cmVIZWlnaHRBbmRXaWR0aCgpXG4gICAgdGhpcy51cGRhdGVNaW5pbWFwRmxleFBvc2l0aW9uKClcbiAgICB0aGlzLmF0dGFjaGVkID0gdHJ1ZVxuICAgIHRoaXMuYXR0YWNoZWRUb1RleHRFZGl0b3IgPSB0aGlzLnBhcmVudE5vZGUgPT09IHRoaXMuZ2V0VGV4dEVkaXRvckVsZW1lbnRSb290KClcblxuICAgIC8qXG4gICAgICBXZSB1c2UgYGF0b20uc3R5bGVzLm9uRGlkQWRkU3R5bGVFbGVtZW50YCBpbnN0ZWFkIG9mXG4gICAgICBgYXRvbS50aGVtZXMub25EaWRDaGFuZ2VBY3RpdmVUaGVtZXNgLlxuICAgICAgV2h5PyBDdXJyZW50bHksIFRoZSBzdHlsZSBlbGVtZW50IHdpbGwgYmUgcmVtb3ZlZCBmaXJzdCwgYW5kIHRoZW4gcmUtYWRkZWRcbiAgICAgIGFuZCB0aGUgYGNoYW5nZWAgZXZlbnQgaGFzIG5vdCBiZSB0cmlnZ2VyZWQgaW4gdGhlIHByb2Nlc3MuXG4gICAgKi9cbiAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLnN0eWxlcy5vbkRpZEFkZFN0eWxlRWxlbWVudCgoKSA9PiB7XG4gICAgICB0aGlzLmludmFsaWRhdGVET01TdHlsZXNDYWNoZSgpXG4gICAgICB0aGlzLnJlcXVlc3RGb3JjZWRVcGRhdGUoKVxuICAgIH0pKVxuICB9XG5cbiAgLyoqXG4gICAqIERPTSBjYWxsYmFjayBpbnZva2VkIHdoZW4gYSBuZXcgTWluaW1hcEVsZW1lbnQgaXMgZGV0YWNoZWQgZnJvbSB0aGUgRE9NLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGRldGFjaGVkQ2FsbGJhY2sgKCkge1xuICAgIHRoaXMuYXR0YWNoZWQgPSBmYWxzZVxuICB9XG5cbiAgLy8gICAgICAgIyMjICAgICMjIyMjIyMjICMjIyMjIyMjICAgICMjIyAgICAgIyMjIyMjICAjIyAgICAgIyNcbiAgLy8gICAgICAjIyAjIyAgICAgICMjICAgICAgICMjICAgICAgIyMgIyMgICAjIyAgICAjIyAjIyAgICAgIyNcbiAgLy8gICAgICMjICAgIyMgICAgICMjICAgICAgICMjICAgICAjIyAgICMjICAjIyAgICAgICAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICAgICMjICAgICAgICMjICAgICMjICAgICAjIyAjIyAgICAgICAjIyMjIyMjIyNcbiAgLy8gICAgIyMjIyMjIyMjICAgICMjICAgICAgICMjICAgICMjIyMjIyMjIyAjIyAgICAgICAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICAgICMjICAgICAgICMjICAgICMjICAgICAjIyAjIyAgICAjIyAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICAgICMjICAgICAgICMjICAgICMjICAgICAjIyAgIyMjIyMjICAjIyAgICAgIyNcblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBNaW5pbWFwRWxlbWVudCBpcyBjdXJyZW50bHkgdmlzaWJsZSBvbiBzY3JlZW4gb3Igbm90LlxuICAgKlxuICAgKiBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgbWluaW1hcCBpcyBkZWZpbmVkIGJ5IHRlc3RpbmcgdGhlIHNpemUgb2YgdGhlIG9mZnNldFxuICAgKiB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoZSBNaW5pbWFwRWxlbWVudCBpcyBjdXJyZW50bHkgdmlzaWJsZSBvciBub3RcbiAgICovXG4gIGlzVmlzaWJsZSAoKSB7IHJldHVybiB0aGlzLm9mZnNldFdpZHRoID4gMCB8fCB0aGlzLm9mZnNldEhlaWdodCA+IDAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgTWluaW1hcEVsZW1lbnQgdG8gdGhlIERPTS5cbiAgICpcbiAgICogVGhlIHBvc2l0aW9uIGF0IHdoaWNoIHRoZSBlbGVtZW50IGlzIGF0dGFjaGVkIGlzIGRlZmluZWQgYnkgdGhlXG4gICAqIGBkaXNwbGF5TWluaW1hcE9uTGVmdGAgc2V0dGluZy5cbiAgICpcbiAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IFtwYXJlbnRdIHRoZSBET00gbm9kZSB3aGVyZSBhdHRhY2hpbmcgdGhlIG1pbmltYXBcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRcbiAgICovXG4gIGF0dGFjaCAocGFyZW50KSB7XG4gICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgcmV0dXJuIH1cbiAgICAocGFyZW50IHx8IHRoaXMuZ2V0VGV4dEVkaXRvckVsZW1lbnRSb290KCkpLmFwcGVuZENoaWxkKHRoaXMpXG4gIH1cblxuICAvKipcbiAgICogRGV0YWNoZXMgdGhlIE1pbmltYXBFbGVtZW50IGZyb20gdGhlIERPTS5cbiAgICovXG4gIGRldGFjaCAoKSB7XG4gICAgaWYgKCF0aGlzLmF0dGFjaGVkIHx8IHRoaXMucGFyZW50Tm9kZSA9PSBudWxsKSB7IHJldHVybiB9XG4gICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpXG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgbWluaW1hcCBsZWZ0L3JpZ2h0IHBvc2l0aW9uIGJhc2VkIG9uIHRoZSB2YWx1ZSBvZiB0aGVcbiAgICogYGRpc3BsYXlNaW5pbWFwT25MZWZ0YCBzZXR0aW5nLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZU1pbmltYXBGbGV4UG9zaXRpb24gKCkge1xuICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnbGVmdCcsIHRoaXMuZGlzcGxheU1pbmltYXBPbkxlZnQpXG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgdGhpcyBNaW5pbWFwRWxlbWVudFxuICAgKi9cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuZGV0YWNoKClcbiAgICB0aGlzLm1pbmltYXAgPSBudWxsXG4gIH1cblxuICAvLyAgICAgIyMjIyMjICAgIyMjIyMjIyAgIyMgICAgIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMgICAgIyMgIyMjIyMjIyNcbiAgLy8gICAgIyMgICAgIyMgIyMgICAgICMjICMjIyAgICMjICAgICMjICAgICMjICAgICAgICMjIyAgICMjICAgICMjXG4gIC8vICAgICMjICAgICAgICMjICAgICAjIyAjIyMjICAjIyAgICAjIyAgICAjIyAgICAgICAjIyMjICAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgIyMgIyMgICAgIyMgICAgIyMjIyMjICAgIyMgIyMgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICAgIyMgICAgICMjICMjICAjIyMjICAgICMjICAgICMjICAgICAgICMjICAjIyMjICAgICMjXG4gIC8vICAgICMjICAgICMjICMjICAgICAjIyAjIyAgICMjIyAgICAjIyAgICAjIyAgICAgICAjIyAgICMjIyAgICAjI1xuICAvLyAgICAgIyMjIyMjICAgIyMjIyMjIyAgIyMgICAgIyMgICAgIyMgICAgIyMjIyMjIyMgIyMgICAgIyMgICAgIyNcblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgTWluaW1hcEVsZW1lbnQgYW5kIGF0dGFjaGVzIHRoZSBtb3VzZSBjb250cm9sXG4gICAqIGV2ZW50IGxpc3RlbmVycy5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBpbml0aWFsaXplQ29udGVudCAoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplQ2FudmFzKClcblxuICAgIHRoaXMuc2hhZG93Um9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpXG4gICAgdGhpcy5hdHRhY2hDYW52YXNlcyh0aGlzLnNoYWRvd1Jvb3QpXG5cbiAgICB0aGlzLmNyZWF0ZVZpc2libGVBcmVhKClcbiAgICB0aGlzLmNyZWF0ZUNvbnRyb2xzKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5zdWJzY3JpYmVUbyh0aGlzLCB7XG4gICAgICAnbW91c2V3aGVlbCc6IChlKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5zdGFuZEFsb25lKSB7IHRoaXMucmVsYXlNb3VzZXdoZWVsRXZlbnQoZSkgfVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnN1YnNjcmliZVRvKHRoaXMuZ2V0RnJvbnRDYW52YXMoKSwge1xuICAgICAgJ21vdXNlZG93bic6IChlKSA9PiB7IHRoaXMuY2FudmFzUHJlc3NlZCh0aGlzLmV4dHJhY3RNb3VzZUV2ZW50RGF0YShlKSkgfSxcbiAgICAgICd0b3VjaHN0YXJ0JzogKGUpID0+IHsgdGhpcy5jYW52YXNQcmVzc2VkKHRoaXMuZXh0cmFjdFRvdWNoRXZlbnREYXRhKGUpKSB9XG4gICAgfSkpXG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIHZpc2libGUgYXJlYSBkaXYuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY3JlYXRlVmlzaWJsZUFyZWEgKCkge1xuICAgIGlmICh0aGlzLnZpc2libGVBcmVhKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLnZpc2libGVBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLnZpc2libGVBcmVhLmNsYXNzTGlzdC5hZGQoJ21pbmltYXAtdmlzaWJsZS1hcmVhJylcbiAgICB0aGlzLnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQodGhpcy52aXNpYmxlQXJlYSlcbiAgICB0aGlzLnZpc2libGVBcmVhU3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpYmVUbyh0aGlzLnZpc2libGVBcmVhLCB7XG4gICAgICAnbW91c2Vkb3duJzogKGUpID0+IHsgdGhpcy5zdGFydERyYWcodGhpcy5leHRyYWN0TW91c2VFdmVudERhdGEoZSkpIH0sXG4gICAgICAndG91Y2hzdGFydCc6IChlKSA9PiB7IHRoaXMuc3RhcnREcmFnKHRoaXMuZXh0cmFjdFRvdWNoRXZlbnREYXRhKGUpKSB9XG4gICAgfSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy52aXNpYmxlQXJlYVN1YnNjcmlwdGlvbilcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSB2aXNpYmxlIGFyZWEgZGl2LlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHJlbW92ZVZpc2libGVBcmVhICgpIHtcbiAgICBpZiAoIXRoaXMudmlzaWJsZUFyZWEpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUodGhpcy52aXNpYmxlQXJlYVN1YnNjcmlwdGlvbilcbiAgICB0aGlzLnZpc2libGVBcmVhU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIHRoaXMuc2hhZG93Um9vdC5yZW1vdmVDaGlsZCh0aGlzLnZpc2libGVBcmVhKVxuICAgIGRlbGV0ZSB0aGlzLnZpc2libGVBcmVhXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgY29udHJvbHMgY29udGFpbmVyIGRpdi5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjcmVhdGVDb250cm9scyAoKSB7XG4gICAgaWYgKHRoaXMuY29udHJvbHMgfHwgdGhpcy5zdGFuZEFsb25lKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLmNvbnRyb2xzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ21pbmltYXAtY29udHJvbHMnKVxuICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGNvbnRyb2xzIGNvbnRhaW5lciBkaXYuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcmVtb3ZlQ29udHJvbHMgKCkge1xuICAgIGlmICghdGhpcy5jb250cm9scykgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5zaGFkb3dSb290LnJlbW92ZUNoaWxkKHRoaXMuY29udHJvbHMpXG4gICAgZGVsZXRlIHRoaXMuY29udHJvbHNcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgc2Nyb2xsIGluZGljYXRvciBkaXYgd2hlbiB0aGUgYG1pbmltYXBTY3JvbGxJbmRpY2F0b3JgXG4gICAqIHNldHRpbmdzIGlzIGVuYWJsZWQuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgaW5pdGlhbGl6ZVNjcm9sbEluZGljYXRvciAoKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsSW5kaWNhdG9yIHx8IHRoaXMuc3RhbmRBbG9uZSkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5zY3JvbGxJbmRpY2F0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuc2Nyb2xsSW5kaWNhdG9yLmNsYXNzTGlzdC5hZGQoJ21pbmltYXAtc2Nyb2xsLWluZGljYXRvcicpXG4gICAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLnNjcm9sbEluZGljYXRvcilcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlcyB0aGUgc2Nyb2xsIGluZGljYXRvciBkaXYgd2hlbiB0aGUgYG1pbmltYXBTY3JvbGxJbmRpY2F0b3JgXG4gICAqIHNldHRpbmdzIGlzIGRpc2FibGVkLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGRpc3Bvc2VTY3JvbGxJbmRpY2F0b3IgKCkge1xuICAgIGlmICghdGhpcy5zY3JvbGxJbmRpY2F0b3IpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuY29udHJvbHMucmVtb3ZlQ2hpbGQodGhpcy5zY3JvbGxJbmRpY2F0b3IpXG4gICAgZGVsZXRlIHRoaXMuc2Nyb2xsSW5kaWNhdG9yXG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIHF1aWNrIHNldHRpbmdzIG9wZW5lbmVyIGRpdiB3aGVuIHRoZVxuICAgKiBgZGlzcGxheVBsdWdpbnNDb250cm9sc2Agc2V0dGluZyBpcyBlbmFibGVkLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGluaXRpYWxpemVPcGVuUXVpY2tTZXR0aW5ncyAoKSB7XG4gICAgaWYgKHRoaXMub3BlblF1aWNrU2V0dGluZ3MgfHwgdGhpcy5zdGFuZEFsb25lKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLm9wZW5RdWlja1NldHRpbmdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLm9wZW5RdWlja1NldHRpbmdzLmNsYXNzTGlzdC5hZGQoJ29wZW4tbWluaW1hcC1xdWljay1zZXR0aW5ncycpXG4gICAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLm9wZW5RdWlja1NldHRpbmdzKVxuXG4gICAgdGhpcy5vcGVuUXVpY2tTZXR0aW5nU3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpYmVUbyh0aGlzLm9wZW5RdWlja1NldHRpbmdzLCB7XG4gICAgICAnbW91c2Vkb3duJzogKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICBpZiAoKHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQgIT0gbnVsbCkpIHtcbiAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LmRlc3Ryb3koKVxuICAgICAgICAgIHRoaXMucXVpY2tTZXR0aW5nc1N1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50ID0gbmV3IE1pbmltYXBRdWlja1NldHRpbmdzRWxlbWVudCgpXG4gICAgICAgICAgdGhpcy5xdWlja1NldHRpbmdzRWxlbWVudC5zZXRNb2RlbCh0aGlzKVxuICAgICAgICAgIHRoaXMucXVpY2tTZXR0aW5nc1N1YnNjcmlwdGlvbiA9IHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQgPSBudWxsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGxldCB7dG9wLCBsZWZ0LCByaWdodH0gPSB0aGlzLmdldEZyb250Q2FudmFzKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LnN0eWxlLnRvcCA9IHRvcCArICdweCdcbiAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LmF0dGFjaCgpXG5cbiAgICAgICAgICBpZiAodGhpcy5kaXNwbGF5TWluaW1hcE9uTGVmdCkge1xuICAgICAgICAgICAgdGhpcy5xdWlja1NldHRpbmdzRWxlbWVudC5zdHlsZS5sZWZ0ID0gKHJpZ2h0KSArICdweCdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5xdWlja1NldHRpbmdzRWxlbWVudC5zdHlsZS5sZWZ0ID0gKGxlZnQgLSB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LmNsaWVudFdpZHRoKSArICdweCdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2VzIHRoZSBxdWljayBzZXR0aW5ncyBvcGVuZW5lciBkaXYgd2hlbiB0aGUgYGRpc3BsYXlQbHVnaW5zQ29udHJvbHNgXG4gICAqIHNldHRpbmcgaXMgZGlzYWJsZWQuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZGlzcG9zZU9wZW5RdWlja1NldHRpbmdzICgpIHtcbiAgICBpZiAoIXRoaXMub3BlblF1aWNrU2V0dGluZ3MpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuY29udHJvbHMucmVtb3ZlQ2hpbGQodGhpcy5vcGVuUXVpY2tTZXR0aW5ncylcbiAgICB0aGlzLm9wZW5RdWlja1NldHRpbmdTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgZGVsZXRlIHRoaXMub3BlblF1aWNrU2V0dGluZ3NcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0YXJnZXQgYFRleHRFZGl0b3JgIG9mIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtUZXh0RWRpdG9yfSB0aGUgbWluaW1hcCdzIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yICgpIHsgcmV0dXJuIHRoaXMubWluaW1hcC5nZXRUZXh0RWRpdG9yKCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvckVsZW1lbnRgIGZvciB0aGUgTWluaW1hcCdzIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHJldHVybiB7VGV4dEVkaXRvckVsZW1lbnR9IHRoZSBtaW5pbWFwJ3MgdGV4dCBlZGl0b3IgZWxlbWVudFxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvckVsZW1lbnQgKCkge1xuICAgIGlmICh0aGlzLmVkaXRvckVsZW1lbnQpIHsgcmV0dXJuIHRoaXMuZWRpdG9yRWxlbWVudCB9XG5cbiAgICB0aGlzLmVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5nZXRUZXh0RWRpdG9yKCkpXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yRWxlbWVudFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3Qgb2YgdGhlIGBUZXh0RWRpdG9yRWxlbWVudGAgY29udGVudC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgbW9zdGx5IHVzZWQgdG8gZW5zdXJlIGNvbXBhdGliaWxpdHkgd2l0aCB0aGUgYHNoYWRvd0RvbWBcbiAgICogc2V0dGluZy5cbiAgICpcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9IHRoZSByb290IG9mIHRoZSBgVGV4dEVkaXRvckVsZW1lbnRgIGNvbnRlbnRcbiAgICovXG4gIGdldFRleHRFZGl0b3JFbGVtZW50Um9vdCAoKSB7XG4gICAgbGV0IGVkaXRvckVsZW1lbnQgPSB0aGlzLmdldFRleHRFZGl0b3JFbGVtZW50KClcblxuICAgIGlmIChlZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3QpIHtcbiAgICAgIHJldHVybiBlZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3RcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGVkaXRvckVsZW1lbnRcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCB3aGVyZSB0byBpbmplY3QgdGhlIGR1bW15IG5vZGUgdXNlZCB0byByZWFkIERPTSBzdHlsZXMuXG4gICAqXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IHNoYWRvd1Jvb3Qgd2hldGhlciB0byB1c2UgdGhlIHRleHQgZWRpdG9yIHNoYWRvdyBET01cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvciBub3RcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9IHRoZSByb290IG5vZGUgd2hlcmUgYXBwZW5kaW5nIHRoZSBkdW1teSBub2RlXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZ2V0RHVtbXlET01Sb290IChzaGFkb3dSb290KSB7XG4gICAgaWYgKHNoYWRvd1Jvb3QpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFRleHRFZGl0b3JFbGVtZW50Um9vdCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFRleHRFZGl0b3JFbGVtZW50KClcbiAgICB9XG4gIH1cblxuICAvLyAgICAjIyAgICAgIyMgICMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMjIyAjI1xuICAvLyAgICAjIyMgICAjIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjI1xuICAvLyAgICAjIyMjICMjIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjI1xuICAvLyAgICAjIyAjIyMgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyMjIyMgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgICMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMjIyAjIyMjIyMjI1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBNaW5pbWFwIGZvciB3aGljaCB0aGlzIE1pbmltYXBFbGVtZW50IHdhcyBjcmVhdGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSB0aGlzIGVsZW1lbnQncyBNaW5pbWFwXG4gICAqL1xuICBnZXRNb2RlbCAoKSB7IHJldHVybiB0aGlzLm1pbmltYXAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBNaW5pbWFwIG1vZGVsIGZvciB0aGlzIE1pbmltYXBFbGVtZW50IGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtNaW5pbWFwfSBtaW5pbWFwIHRoZSBNaW5pbWFwIG1vZGVsIGZvciB0aGlzIGluc3RhbmNlLlxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSB0aGlzIGVsZW1lbnQncyBNaW5pbWFwXG4gICAqL1xuICBzZXRNb2RlbCAobWluaW1hcCkge1xuICAgIHRoaXMubWluaW1hcCA9IG1pbmltYXBcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMubWluaW1hcC5vbkRpZENoYW5nZVNjcm9sbFRvcCgoKSA9PiB7XG4gICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCgoKSA9PiB7XG4gICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmRlc3Ryb3koKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkQ2hhbmdlQ29uZmlnKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7IHJldHVybiB0aGlzLnJlcXVlc3RGb3JjZWRVcGRhdGUoKSB9XG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMubWluaW1hcC5vbkRpZENoYW5nZVN0YW5kQWxvbmUoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGFuZEFsb25lKHRoaXMubWluaW1hcC5pc1N0YW5kQWxvbmUoKSlcbiAgICAgIHRoaXMucmVxdWVzdFVwZGF0ZSgpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMubWluaW1hcC5vbkRpZENoYW5nZSgoY2hhbmdlKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmdDaGFuZ2VzLnB1c2goY2hhbmdlKVxuICAgICAgdGhpcy5yZXF1ZXN0VXBkYXRlKClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkQ2hhbmdlRGVjb3JhdGlvblJhbmdlKChjaGFuZ2UpID0+IHtcbiAgICAgIGNvbnN0IHt0eXBlfSA9IGNoYW5nZVxuICAgICAgaWYgKHR5cGUgPT09ICdsaW5lJyB8fCB0eXBlID09PSAnaGlnaGxpZ2h0LXVuZGVyJykge1xuICAgICAgICB0aGlzLnBlbmRpbmdCYWNrRGVjb3JhdGlvbkNoYW5nZXMucHVzaChjaGFuZ2UpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBlbmRpbmdGcm9udERlY29yYXRpb25DaGFuZ2VzLnB1c2goY2hhbmdlKVxuICAgICAgfVxuICAgICAgdGhpcy5yZXF1ZXN0VXBkYXRlKClcbiAgICB9KSlcblxuICAgIHRoaXMuc2V0U3RhbmRBbG9uZSh0aGlzLm1pbmltYXAuaXNTdGFuZEFsb25lKCkpXG5cbiAgICBpZiAodGhpcy53aWR0aCAhPSBudWxsICYmIHRoaXMuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMubWluaW1hcC5zZXRTY3JlZW5IZWlnaHRBbmRXaWR0aCh0aGlzLmhlaWdodCwgdGhpcy53aWR0aClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5taW5pbWFwXG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3RhbmQtYWxvbmUgbW9kZSBmb3IgdGhpcyBNaW5pbWFwRWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBzdGFuZEFsb25lIHRoZSBuZXcgbW9kZSBmb3IgdGhpcyBNaW5pbWFwRWxlbWVudFxuICAgKi9cbiAgc2V0U3RhbmRBbG9uZSAoc3RhbmRBbG9uZSkge1xuICAgIHRoaXMuc3RhbmRBbG9uZSA9IHN0YW5kQWxvbmVcblxuICAgIGlmICh0aGlzLnN0YW5kQWxvbmUpIHtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdzdGFuZC1hbG9uZScsIHRydWUpXG4gICAgICB0aGlzLmRpc3Bvc2VTY3JvbGxJbmRpY2F0b3IoKVxuICAgICAgdGhpcy5kaXNwb3NlT3BlblF1aWNrU2V0dGluZ3MoKVxuICAgICAgdGhpcy5yZW1vdmVDb250cm9scygpXG4gICAgICB0aGlzLnJlbW92ZVZpc2libGVBcmVhKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3N0YW5kLWFsb25lJylcbiAgICAgIHRoaXMuY3JlYXRlVmlzaWJsZUFyZWEoKVxuICAgICAgdGhpcy5jcmVhdGVDb250cm9scygpXG4gICAgICBpZiAodGhpcy5taW5pbWFwU2Nyb2xsSW5kaWNhdG9yKSB7IHRoaXMuaW5pdGlhbGl6ZVNjcm9sbEluZGljYXRvcigpIH1cbiAgICAgIGlmICh0aGlzLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMpIHsgdGhpcy5pbml0aWFsaXplT3BlblF1aWNrU2V0dGluZ3MoKSB9XG4gICAgfVxuICB9XG5cbiAgLy8gICAgIyMgICAgICMjICMjIyMjIyMjICAjIyMjIyMjIyAgICAgIyMjICAgICMjIyMjIyMjICMjIyMjIyMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICAgIyMgIyMgICAgICAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAgIyMgICAjIyAgICAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjIyMjIyMjICAjIyAgICAgIyMgIyMgICAgICMjICAgICMjICAgICMjIyMjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICAgICMjICAgICAjIyAjIyMjIyMjIyMgICAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAgICAjIyAgICAgIyMgIyMgICAgICMjICAgICMjICAgICMjXG4gIC8vICAgICAjIyMjIyMjICAjIyAgICAgICAgIyMjIyMjIyMgICMjICAgICAjIyAgICAjIyAgICAjIyMjIyMjI1xuXG4gIC8qKlxuICAgKiBSZXF1ZXN0cyBhbiB1cGRhdGUgdG8gYmUgcGVyZm9ybWVkIG9uIHRoZSBuZXh0IGZyYW1lLlxuICAgKi9cbiAgcmVxdWVzdFVwZGF0ZSAoKSB7XG4gICAgaWYgKHRoaXMuZnJhbWVSZXF1ZXN0ZWQpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuZnJhbWVSZXF1ZXN0ZWQgPSB0cnVlXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgIHRoaXMuZnJhbWVSZXF1ZXN0ZWQgPSBmYWxzZVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdHMgYW4gdXBkYXRlIHRvIGJlIHBlcmZvcm1lZCBvbiB0aGUgbmV4dCBmcmFtZSB0aGF0IHdpbGwgY29tcGxldGVseVxuICAgKiByZWRyYXcgdGhlIG1pbmltYXAuXG4gICAqL1xuICByZXF1ZXN0Rm9yY2VkVXBkYXRlICgpIHtcbiAgICB0aGlzLm9mZnNjcmVlbkZpcnN0Um93ID0gbnVsbFxuICAgIHRoaXMub2Zmc2NyZWVuTGFzdFJvdyA9IG51bGxcbiAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIHRoZSBhY3R1YWwgTWluaW1hcEVsZW1lbnQgdXBkYXRlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZSAoKSB7XG4gICAgaWYgKCEodGhpcy5hdHRhY2hlZCAmJiB0aGlzLmlzVmlzaWJsZSgpICYmIHRoaXMubWluaW1hcCkpIHsgcmV0dXJuIH1cbiAgICBsZXQgbWluaW1hcCA9IHRoaXMubWluaW1hcFxuICAgIG1pbmltYXAuZW5hYmxlQ2FjaGUoKVxuICAgIGxldCBjYW52YXMgPSB0aGlzLmdldEZyb250Q2FudmFzKClcblxuICAgIGNvbnN0IGRldmljZVBpeGVsUmF0aW8gPSB0aGlzLm1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpXG4gICAgbGV0IHZpc2libGVBcmVhTGVmdCA9IG1pbmltYXAuZ2V0VGV4dEVkaXRvclNjYWxlZFNjcm9sbExlZnQoKVxuICAgIGxldCB2aXNpYmxlQXJlYVRvcCA9IG1pbmltYXAuZ2V0VGV4dEVkaXRvclNjYWxlZFNjcm9sbFRvcCgpIC0gbWluaW1hcC5nZXRTY3JvbGxUb3AoKVxuICAgIGxldCB2aXNpYmxlV2lkdGggPSBNYXRoLm1pbihjYW52YXMud2lkdGggLyBkZXZpY2VQaXhlbFJhdGlvLCB0aGlzLndpZHRoKVxuXG4gICAgaWYgKHRoaXMuYWRqdXN0VG9Tb2Z0V3JhcCAmJiB0aGlzLmZsZXhCYXNpcykge1xuICAgICAgdGhpcy5zdHlsZS5mbGV4QmFzaXMgPSB0aGlzLmZsZXhCYXNpcyArICdweCdcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdHlsZS5mbGV4QmFzaXMgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKFNQRUNfTU9ERSkge1xuICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLnZpc2libGVBcmVhLCB7XG4gICAgICAgIHdpZHRoOiB2aXNpYmxlV2lkdGggKyAncHgnLFxuICAgICAgICBoZWlnaHQ6IG1pbmltYXAuZ2V0VGV4dEVkaXRvclNjYWxlZEhlaWdodCgpICsgJ3B4JyxcbiAgICAgICAgdG9wOiB2aXNpYmxlQXJlYVRvcCArICdweCcsXG4gICAgICAgIGxlZnQ6IHZpc2libGVBcmVhTGVmdCArICdweCdcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXBwbHlTdHlsZXModGhpcy52aXNpYmxlQXJlYSwge1xuICAgICAgICB3aWR0aDogdmlzaWJsZVdpZHRoICsgJ3B4JyxcbiAgICAgICAgaGVpZ2h0OiBtaW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQoKSArICdweCcsXG4gICAgICAgIHRyYW5zZm9ybTogdGhpcy5tYWtlVHJhbnNsYXRlKHZpc2libGVBcmVhTGVmdCwgdmlzaWJsZUFyZWFUb3ApXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuYXBwbHlTdHlsZXModGhpcy5jb250cm9scywge3dpZHRoOiB2aXNpYmxlV2lkdGggKyAncHgnfSlcblxuICAgIGxldCBjYW52YXNUb3AgPSBtaW5pbWFwLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpICogbWluaW1hcC5nZXRMaW5lSGVpZ2h0KCkgLSBtaW5pbWFwLmdldFNjcm9sbFRvcCgpXG5cbiAgICBsZXQgY2FudmFzVHJhbnNmb3JtID0gdGhpcy5tYWtlVHJhbnNsYXRlKDAsIGNhbnZhc1RvcClcbiAgICBpZiAoZGV2aWNlUGl4ZWxSYXRpbyAhPT0gMSkge1xuICAgICAgY2FudmFzVHJhbnNmb3JtICs9ICcgJyArIHRoaXMubWFrZVNjYWxlKDEgLyBkZXZpY2VQaXhlbFJhdGlvKVxuICAgIH1cblxuICAgIGlmKHRoaXMuc21vb3RoU2Nyb2xsaW5nKSB7XG4gICAgICBpZiAoU1BFQ19NT0RFKSB7XG4gICAgICAgIHRoaXMuYXBwbHlTdHlsZXModGhpcy5iYWNrTGF5ZXIuY2FudmFzLCB7dG9wOiBjYW52YXNUb3AgKyAncHgnfSlcbiAgICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLnRva2Vuc0xheWVyLmNhbnZhcywge3RvcDogY2FudmFzVG9wICsgJ3B4J30pXG4gICAgICAgIHRoaXMuYXBwbHlTdHlsZXModGhpcy5mcm9udExheWVyLmNhbnZhcywge3RvcDogY2FudmFzVG9wICsgJ3B4J30pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMuYmFja0xheWVyLmNhbnZhcywge3RyYW5zZm9ybTogY2FudmFzVHJhbnNmb3JtfSlcbiAgICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLnRva2Vuc0xheWVyLmNhbnZhcywge3RyYW5zZm9ybTogY2FudmFzVHJhbnNmb3JtfSlcbiAgICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLmZyb250TGF5ZXIuY2FudmFzLCB7dHJhbnNmb3JtOiBjYW52YXNUcmFuc2Zvcm19KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1pbmltYXBTY3JvbGxJbmRpY2F0b3IgJiYgbWluaW1hcC5jYW5TY3JvbGwoKSAmJiAhdGhpcy5zY3JvbGxJbmRpY2F0b3IpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjcm9sbEluZGljYXRvcigpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2Nyb2xsSW5kaWNhdG9yICE9IG51bGwpIHtcbiAgICAgIGxldCBtaW5pbWFwU2NyZWVuSGVpZ2h0ID0gbWluaW1hcC5nZXRTY3JlZW5IZWlnaHQoKVxuICAgICAgbGV0IGluZGljYXRvckhlaWdodCA9IG1pbmltYXBTY3JlZW5IZWlnaHQgKiAobWluaW1hcFNjcmVlbkhlaWdodCAvIG1pbmltYXAuZ2V0SGVpZ2h0KCkpXG4gICAgICBsZXQgaW5kaWNhdG9yU2Nyb2xsID0gKG1pbmltYXBTY3JlZW5IZWlnaHQgLSBpbmRpY2F0b3JIZWlnaHQpICogbWluaW1hcC5nZXRDYXBlZFRleHRFZGl0b3JTY3JvbGxSYXRpbygpXG5cbiAgICAgIGlmIChTUEVDX01PREUpIHtcbiAgICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLnNjcm9sbEluZGljYXRvciwge1xuICAgICAgICAgIGhlaWdodDogaW5kaWNhdG9ySGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgICB0b3A6IGluZGljYXRvclNjcm9sbCArICdweCdcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYXBwbHlTdHlsZXModGhpcy5zY3JvbGxJbmRpY2F0b3IsIHtcbiAgICAgICAgICBoZWlnaHQ6IGluZGljYXRvckhlaWdodCArICdweCcsXG4gICAgICAgICAgdHJhbnNmb3JtOiB0aGlzLm1ha2VUcmFuc2xhdGUoMCwgaW5kaWNhdG9yU2Nyb2xsKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAoIW1pbmltYXAuY2FuU2Nyb2xsKCkpIHsgdGhpcy5kaXNwb3NlU2Nyb2xsSW5kaWNhdG9yKCkgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlQ2FudmFzKClcbiAgICBtaW5pbWFwLmNsZWFyQ2FjaGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgd2hldGhlciB0byByZW5kZXIgdGhlIGNvZGUgaGlnaGxpZ2h0cyBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGlzcGxheUNvZGVIaWdobGlnaHRzIHdoZXRoZXIgdG8gcmVuZGVyIHRoZSBjb2RlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodHMgb3Igbm90XG4gICAqL1xuICBzZXREaXNwbGF5Q29kZUhpZ2hsaWdodHMgKGRpc3BsYXlDb2RlSGlnaGxpZ2h0cykge1xuICAgIHRoaXMuZGlzcGxheUNvZGVIaWdobGlnaHRzID0gZGlzcGxheUNvZGVIaWdobGlnaHRzXG4gICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgdGhpcy5yZXF1ZXN0Rm9yY2VkVXBkYXRlKCkgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBvbGxpbmcgY2FsbGJhY2sgdXNlZCB0byBkZXRlY3QgdmlzaWJpbGl0eSBhbmQgc2l6ZSBjaGFuZ2VzLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHBvbGxET00gKCkge1xuICAgIGxldCB2aXNpYmlsaXR5Q2hhbmdlZCA9IHRoaXMuY2hlY2tGb3JWaXNpYmlsaXR5Q2hhbmdlKClcbiAgICBpZiAodGhpcy5pc1Zpc2libGUoKSkge1xuICAgICAgaWYgKCF0aGlzLndhc1Zpc2libGUpIHsgdGhpcy5yZXF1ZXN0Rm9yY2VkVXBkYXRlKCkgfVxuXG4gICAgICB0aGlzLm1lYXN1cmVIZWlnaHRBbmRXaWR0aCh2aXNpYmlsaXR5Q2hhbmdlZCwgZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHRoYXQgY2hlY2tzIGZvciB2aXNpYmlsaXR5IGNoYW5nZXMgaW4gdGhlIE1pbmltYXBFbGVtZW50LlxuICAgKiBUaGUgbWV0aG9kIHJldHVybnMgYHRydWVgIHdoZW4gdGhlIHZpc2liaWxpdHkgY2hhbmdlZCBmcm9tIHZpc2libGUgdG9cbiAgICogaGlkZGVuIG9yIGZyb20gaGlkZGVuIHRvIHZpc2libGUuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhlIHZpc2liaWxpdHkgY2hhbmdlZCBvciBub3Qgc2luY2UgdGhlIGxhc3QgY2FsbFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNoZWNrRm9yVmlzaWJpbGl0eUNoYW5nZSAoKSB7XG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKCkpIHtcbiAgICAgIGlmICh0aGlzLndhc1Zpc2libGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLndhc1Zpc2libGUgPSB0cnVlXG4gICAgICAgIHJldHVybiB0aGlzLndhc1Zpc2libGVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMud2FzVmlzaWJsZSkge1xuICAgICAgICB0aGlzLndhc1Zpc2libGUgPSBmYWxzZVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy53YXNWaXNpYmxlID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMud2FzVmlzaWJsZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB1c2VkIHRvIG1lYXN1cmUgdGhlIHNpemUgb2YgdGhlIE1pbmltYXBFbGVtZW50IGFuZCB1cGRhdGUgaW50ZXJuYWxcbiAgICogY29tcG9uZW50cyBiYXNlZCBvbiB0aGUgbmV3IHNpemUuXG4gICAqXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IHZpc2liaWxpdHlDaGFuZ2VkIGRpZCB0aGUgdmlzaWJpbGl0eSBjaGFuZ2VkIHNpbmNlIGxhc3RcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZW1lbnRcbiAgICogQHBhcmFtICB7W3R5cGVdfSBbZm9yY2VVcGRhdGU9dHJ1ZV0gZm9yY2VzIHRoZSB1cGRhdGUgZXZlbiB3aGVuIG5vIGNoYW5nZXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VyZSBkZXRlY3RlZFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIG1lYXN1cmVIZWlnaHRBbmRXaWR0aCAodmlzaWJpbGl0eUNoYW5nZWQsIGZvcmNlVXBkYXRlID0gdHJ1ZSkge1xuICAgIGlmICghdGhpcy5taW5pbWFwKSB7IHJldHVybiB9XG5cbiAgICBjb25zdCBkZXZpY2VQaXhlbFJhdGlvID0gdGhpcy5taW5pbWFwLmdldERldmljZVBpeGVsUmF0aW8oKVxuICAgIGxldCB3YXNSZXNpemVkID0gdGhpcy53aWR0aCAhPT0gdGhpcy5jbGllbnRXaWR0aCB8fCB0aGlzLmhlaWdodCAhPT0gdGhpcy5jbGllbnRIZWlnaHRcblxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jbGllbnRIZWlnaHRcbiAgICB0aGlzLndpZHRoID0gdGhpcy5jbGllbnRXaWR0aFxuICAgIGxldCBjYW52YXNXaWR0aCA9IHRoaXMud2lkdGhcblxuICAgIGlmICgodGhpcy5taW5pbWFwICE9IG51bGwpKSB7IHRoaXMubWluaW1hcC5zZXRTY3JlZW5IZWlnaHRBbmRXaWR0aCh0aGlzLmhlaWdodCwgdGhpcy53aWR0aCkgfVxuXG4gICAgaWYgKHdhc1Jlc2l6ZWQgfHwgdmlzaWJpbGl0eUNoYW5nZWQgfHwgZm9yY2VVcGRhdGUpIHsgdGhpcy5yZXF1ZXN0Rm9yY2VkVXBkYXRlKCkgfVxuXG4gICAgaWYgKCF0aGlzLmlzVmlzaWJsZSgpKSB7IHJldHVybiB9XG5cbiAgICBpZiAod2FzUmVzaXplZCB8fCBmb3JjZVVwZGF0ZSkge1xuICAgICAgaWYgKHRoaXMuYWRqdXN0VG9Tb2Z0V3JhcCkge1xuICAgICAgICBsZXQgbGluZUxlbmd0aCA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnKVxuICAgICAgICBsZXQgc29mdFdyYXAgPSBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5zb2Z0V3JhcCcpXG4gICAgICAgIGxldCBzb2Z0V3JhcEF0UHJlZmVycmVkTGluZUxlbmd0aCA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLnNvZnRXcmFwQXRQcmVmZXJyZWRMaW5lTGVuZ3RoJylcbiAgICAgICAgbGV0IHdpZHRoID0gbGluZUxlbmd0aCAqIHRoaXMubWluaW1hcC5nZXRDaGFyV2lkdGgoKVxuXG4gICAgICAgIGlmIChzb2Z0V3JhcCAmJiBzb2Z0V3JhcEF0UHJlZmVycmVkTGluZUxlbmd0aCAmJiBsaW5lTGVuZ3RoICYmIHdpZHRoIDw9IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICB0aGlzLmZsZXhCYXNpcyA9IHdpZHRoXG4gICAgICAgICAgY2FudmFzV2lkdGggPSB3aWR0aFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmZsZXhCYXNpc1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgdGhpcy5mbGV4QmFzaXNcbiAgICAgIH1cblxuICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuZ2V0RnJvbnRDYW52YXMoKVxuICAgICAgaWYgKGNhbnZhc1dpZHRoICE9PSBjYW52YXMud2lkdGggfHwgdGhpcy5oZWlnaHQgIT09IGNhbnZhcy5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zZXRDYW52YXNlc1NpemUoXG4gICAgICAgICAgY2FudmFzV2lkdGggKiBkZXZpY2VQaXhlbFJhdGlvLFxuICAgICAgICAgICh0aGlzLmhlaWdodCArIHRoaXMubWluaW1hcC5nZXRMaW5lSGVpZ2h0KCkpICogZGV2aWNlUGl4ZWxSYXRpb1xuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gICAgIyMjIyMjIyMgIyMgICAgICMjICMjIyMjIyMjICMjICAgICMjICMjIyMjIyMjICAjIyMjIyNcbiAgLy8gICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICMjIyAgICMjICAgICMjICAgICMjICAgICMjXG4gIC8vICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyMjICAjIyAgICAjIyAgICAjI1xuICAvLyAgICAjIyMjIyMgICAjIyAgICAgIyMgIyMjIyMjICAgIyMgIyMgIyMgICAgIyMgICAgICMjIyMjI1xuICAvLyAgICAjIyAgICAgICAgIyMgICAjIyAgIyMgICAgICAgIyMgICMjIyMgICAgIyMgICAgICAgICAgIyNcbiAgLy8gICAgIyMgICAgICAgICAjIyAjIyAgICMjICAgICAgICMjICAgIyMjICAgICMjICAgICMjICAgICMjXG4gIC8vICAgICMjIyMjIyMjICAgICMjIyAgICAjIyMjIyMjIyAjIyAgICAjIyAgICAjIyAgICAgIyMjIyMjXG5cbiAgLyoqXG4gICAqIEhlbHBlciBtZXRob2QgdG8gcmVnaXN0ZXIgY29uZmlnIG9ic2VydmVycy5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBjb25maWdzPXt9IGFuIG9iamVjdCBtYXBwaW5nIHRoZSBjb25maWcgbmFtZSB0byBvYnNlcnZlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBmdW5jdGlvbiB0byBjYWxsIGJhY2sgd2hlbiBhIGNoYW5nZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2NjdXJzXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgb2JzZXJ2ZUNvbmZpZyAoY29uZmlncyA9IHt9KSB7XG4gICAgZm9yIChsZXQgY29uZmlnIGluIGNvbmZpZ3MpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShjb25maWcsIGNvbmZpZ3NbY29uZmlnXSkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRyaWdnZXJlZCB3aGVuIHRoZSBtb3VzZSBpcyBwcmVzc2VkIG9uIHRoZSBNaW5pbWFwRWxlbWVudCBjYW52YXMuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0geSB0aGUgdmVydGljYWwgY29vcmRpbmF0ZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaXNMZWZ0TW91c2Ugd2FzIHRoZSBsZWZ0IG1vdXNlIGJ1dHRvbiBwcmVzc2VkP1xuICAgKiBAcGFyYW0gIHtib29sZWFufSBpc01pZGRsZU1vdXNlIHdhcyB0aGUgbWlkZGxlIG1vdXNlIGJ1dHRvbiBwcmVzc2VkP1xuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNhbnZhc1ByZXNzZWQgKHt5LCBpc0xlZnRNb3VzZSwgaXNNaWRkbGVNb3VzZX0pIHtcbiAgICBpZiAodGhpcy5taW5pbWFwLmlzU3RhbmRBbG9uZSgpKSB7IHJldHVybiB9XG4gICAgaWYgKGlzTGVmdE1vdXNlKSB7XG4gICAgICB0aGlzLmNhbnZhc0xlZnRNb3VzZVByZXNzZWQoeSlcbiAgICB9IGVsc2UgaWYgKGlzTWlkZGxlTW91c2UpIHtcbiAgICAgIHRoaXMuY2FudmFzTWlkZGxlTW91c2VQcmVzc2VkKHkpXG4gICAgICBsZXQge3RvcCwgaGVpZ2h0fSA9IHRoaXMudmlzaWJsZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIHRoaXMuc3RhcnREcmFnKHt5OiB0b3AgKyBoZWlnaHQgLyAyLCBpc0xlZnRNb3VzZTogZmFsc2UsIGlzTWlkZGxlTW91c2U6IHRydWV9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0cmlnZ2VyZWQgd2hlbiB0aGUgbW91c2UgbGVmdCBidXR0b24gaXMgcHJlc3NlZCBvbiB0aGVcbiAgICogTWluaW1hcEVsZW1lbnQgY2FudmFzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtNb3VzZUV2ZW50fSBlIHRoZSBtb3VzZSBldmVudCBvYmplY3RcbiAgICogQHBhcmFtICB7bnVtYmVyfSBlLnBhZ2VZIHRoZSBtb3VzZSB5IHBvc2l0aW9uIGluIHBhZ2VcbiAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGUudGFyZ2V0IHRoZSBzb3VyY2Ugb2YgdGhlIGV2ZW50XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY2FudmFzTGVmdE1vdXNlUHJlc3NlZCAoeSkge1xuICAgIGxldCBkZWx0YVkgPSB5IC0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICBsZXQgcm93ID0gTWF0aC5mbG9vcihkZWx0YVkgLyB0aGlzLm1pbmltYXAuZ2V0TGluZUhlaWdodCgpKSArIHRoaXMubWluaW1hcC5nZXRGaXJzdFZpc2libGVTY3JlZW5Sb3coKVxuXG4gICAgbGV0IHRleHRFZGl0b3IgPSB0aGlzLm1pbmltYXAuZ2V0VGV4dEVkaXRvcigpXG5cbiAgICBsZXQgc2Nyb2xsVG9wID0gcm93ICogdGV4dEVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKSAtIHRoaXMubWluaW1hcC5nZXRUZXh0RWRpdG9ySGVpZ2h0KCkgLyAyXG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLnNjcm9sbEFuaW1hdGlvbicpKSB7XG4gICAgICBsZXQgZnJvbSA9IHRoaXMubWluaW1hcC5nZXRUZXh0RWRpdG9yU2Nyb2xsVG9wKClcbiAgICAgIGxldCB0byA9IHNjcm9sbFRvcFxuICAgICAgbGV0IHN0ZXAgPSAobm93KSA9PiB0aGlzLm1pbmltYXAuc2V0VGV4dEVkaXRvclNjcm9sbFRvcChub3cpXG4gICAgICBsZXQgZHVyYXRpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAuc2Nyb2xsQW5pbWF0aW9uRHVyYXRpb24nKVxuICAgICAgdGhpcy5hbmltYXRlKHtmcm9tOiBmcm9tLCB0bzogdG8sIGR1cmF0aW9uOiBkdXJhdGlvbiwgc3RlcDogc3RlcH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWluaW1hcC5zZXRUZXh0RWRpdG9yU2Nyb2xsVG9wKHNjcm9sbFRvcClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdHJpZ2dlcmVkIHdoZW4gdGhlIG1vdXNlIG1pZGRsZSBidXR0b24gaXMgcHJlc3NlZCBvbiB0aGVcbiAgICogTWluaW1hcEVsZW1lbnQgY2FudmFzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtNb3VzZUV2ZW50fSBlIHRoZSBtb3VzZSBldmVudCBvYmplY3RcbiAgICogQHBhcmFtICB7bnVtYmVyfSBlLnBhZ2VZIHRoZSBtb3VzZSB5IHBvc2l0aW9uIGluIHBhZ2VcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjYW52YXNNaWRkbGVNb3VzZVByZXNzZWQgKHkpIHtcbiAgICBsZXQge3RvcDogb2Zmc2V0VG9wfSA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBsZXQgZGVsdGFZID0geSAtIG9mZnNldFRvcCAtIHRoaXMubWluaW1hcC5nZXRUZXh0RWRpdG9yU2NhbGVkSGVpZ2h0KCkgLyAyXG5cbiAgICBsZXQgcmF0aW8gPSBkZWx0YVkgLyAodGhpcy5taW5pbWFwLmdldFZpc2libGVIZWlnaHQoKSAtIHRoaXMubWluaW1hcC5nZXRUZXh0RWRpdG9yU2NhbGVkSGVpZ2h0KCkpXG5cbiAgICB0aGlzLm1pbmltYXAuc2V0VGV4dEVkaXRvclNjcm9sbFRvcChyYXRpbyAqIHRoaXMubWluaW1hcC5nZXRUZXh0RWRpdG9yTWF4U2Nyb2xsVG9wKCkpXG4gIH1cblxuICAvKipcbiAgICogQSBtZXRob2QgdGhhdCByZWxheXMgdGhlIGBtb3VzZXdoZWVsYCBldmVudHMgcmVjZWl2ZWQgYnkgdGhlIE1pbmltYXBFbGVtZW50XG4gICAqIHRvIHRoZSBgVGV4dEVkaXRvckVsZW1lbnRgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtNb3VzZUV2ZW50fSBlIHRoZSBtb3VzZSBldmVudCBvYmplY3RcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICByZWxheU1vdXNld2hlZWxFdmVudCAoZSkge1xuICAgIHRoaXMuZ2V0VGV4dEVkaXRvckVsZW1lbnQoKS5jb21wb25lbnQub25Nb3VzZVdoZWVsKGUpXG4gIH1cblxuICAvKipcbiAgICogQSBtZXRob2QgdGhhdCBleHRyYWN0cyBkYXRhIGZyb20gYSBgTW91c2VFdmVudGAgd2hpY2ggY2FuIHRoZW4gYmUgdXNlZCB0b1xuICAgKiBwcm9jZXNzIGNsaWNrcyBhbmQgZHJhZ3Mgb2YgdGhlIG1pbmltYXAuXG4gICAqXG4gICAqIFVzZWQgdG9nZXRoZXIgd2l0aCBgZXh0cmFjdFRvdWNoRXZlbnREYXRhYCB0byBwcm92aWRlIGEgdW5pZmllZCBpbnRlcmZhY2VcbiAgICogZm9yIGBNb3VzZUV2ZW50YHMgYW5kIGBUb3VjaEV2ZW50YHMuXG4gICAqXG4gICAqIEBwYXJhbSAge01vdXNlRXZlbnR9IG1vdXNlRXZlbnQgdGhlIG1vdXNlIGV2ZW50IG9iamVjdFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGV4dHJhY3RNb3VzZUV2ZW50RGF0YSAobW91c2VFdmVudCkge1xuICAgIHJldHVybiB7XG4gICAgICB4OiBtb3VzZUV2ZW50LnBhZ2VYLFxuICAgICAgeTogbW91c2VFdmVudC5wYWdlWSxcbiAgICAgIGlzTGVmdE1vdXNlOiBtb3VzZUV2ZW50LndoaWNoID09PSAxLFxuICAgICAgaXNNaWRkbGVNb3VzZTogbW91c2VFdmVudC53aGljaCA9PT0gMlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB0aGF0IGV4dHJhY3RzIGRhdGEgZnJvbSBhIGBUb3VjaEV2ZW50YCB3aGljaCBjYW4gdGhlbiBiZSB1c2VkIHRvXG4gICAqIHByb2Nlc3MgY2xpY2tzIGFuZCBkcmFncyBvZiB0aGUgbWluaW1hcC5cbiAgICpcbiAgICogVXNlZCB0b2dldGhlciB3aXRoIGBleHRyYWN0TW91c2VFdmVudERhdGFgIHRvIHByb3ZpZGUgYSB1bmlmaWVkIGludGVyZmFjZVxuICAgKiBmb3IgYE1vdXNlRXZlbnRgcyBhbmQgYFRvdWNoRXZlbnRgcy5cbiAgICpcbiAgICogQHBhcmFtICB7VG91Y2hFdmVudH0gdG91Y2hFdmVudCB0aGUgdG91Y2ggZXZlbnQgb2JqZWN0XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZXh0cmFjdFRvdWNoRXZlbnREYXRhICh0b3VjaEV2ZW50KSB7XG4gICAgLy8gVXNlIHRoZSBmaXJzdCB0b3VjaCBvbiB0aGUgdGFyZ2V0IGFyZWEuIE90aGVyIHRvdWNoZXMgd2lsbCBiZSBpZ25vcmVkIGluXG4gICAgLy8gY2FzZSBvZiBtdWx0aS10b3VjaC5cbiAgICBsZXQgdG91Y2ggPSB0b3VjaEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdXG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogdG91Y2gucGFnZVgsXG4gICAgICB5OiB0b3VjaC5wYWdlWSxcbiAgICAgIGlzTGVmdE1vdXNlOiB0cnVlLCAvLyBUb3VjaCBpcyB0cmVhdGVkIGxpa2UgYSBsZWZ0IG1vdXNlIGJ1dHRvbiBjbGlja1xuICAgICAgaXNNaWRkbGVNb3VzZTogZmFsc2VcbiAgICB9XG4gIH1cblxuICAvLyAgICAjIyMjIyMjIyAgICAjIyMjICAgICMjIyMjIyMjXG4gIC8vICAgICMjICAgICAjIyAgIyMgICMjICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAgICMjIyMgICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAgIyMjIyAgICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgIyMgIyMgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICMjICAgIyMgICAgICMjXG4gIC8vICAgICMjIyMjIyMjICAgIyMjIyAgIyMgIyMjIyMjIyNcblxuICAvKipcbiAgICogQSBtZXRob2QgdHJpZ2dlcmVkIHdoZW4gdGhlIG1vdXNlIGlzIHByZXNzZWQgb3ZlciB0aGUgdmlzaWJsZSBhcmVhIHRoYXRcbiAgICogc3RhcnRzIHRoZSBkcmFnZ2luZyBnZXN0dXJlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHkgdGhlIHZlcnRpY2FsIGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50XG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGlzTGVmdE1vdXNlIHdhcyB0aGUgbGVmdCBtb3VzZSBidXR0b24gcHJlc3NlZD9cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaXNNaWRkbGVNb3VzZSB3YXMgdGhlIG1pZGRsZSBtb3VzZSBidXR0b24gcHJlc3NlZD9cbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBzdGFydERyYWcgKHt5LCBpc0xlZnRNb3VzZSwgaXNNaWRkbGVNb3VzZX0pIHtcbiAgICBpZiAoIXRoaXMubWluaW1hcCkgeyByZXR1cm4gfVxuICAgIGlmICghaXNMZWZ0TW91c2UgJiYgIWlzTWlkZGxlTW91c2UpIHsgcmV0dXJuIH1cblxuICAgIGxldCB7dG9wfSA9IHRoaXMudmlzaWJsZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBsZXQge3RvcDogb2Zmc2V0VG9wfSA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGxldCBkcmFnT2Zmc2V0ID0geSAtIHRvcFxuXG4gICAgbGV0IGluaXRpYWwgPSB7ZHJhZ09mZnNldCwgb2Zmc2V0VG9wfVxuXG4gICAgbGV0IG1vdXNlbW92ZUhhbmRsZXIgPSAoZSkgPT4gdGhpcy5kcmFnKHRoaXMuZXh0cmFjdE1vdXNlRXZlbnREYXRhKGUpLCBpbml0aWFsKVxuICAgIGxldCBtb3VzZXVwSGFuZGxlciA9IChlKSA9PiB0aGlzLmVuZERyYWcoKVxuXG4gICAgbGV0IHRvdWNobW92ZUhhbmRsZXIgPSAoZSkgPT4gdGhpcy5kcmFnKHRoaXMuZXh0cmFjdFRvdWNoRXZlbnREYXRhKGUpLCBpbml0aWFsKVxuICAgIGxldCB0b3VjaGVuZEhhbmRsZXIgPSAoZSkgPT4gdGhpcy5lbmREcmFnKClcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlSGFuZGxlcilcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZXVwSGFuZGxlcilcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBtb3VzZXVwSGFuZGxlcilcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdG91Y2htb3ZlSGFuZGxlcilcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdG91Y2hlbmRIYW5kbGVyKVxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0b3VjaGVuZEhhbmRsZXIpXG5cbiAgICB0aGlzLmRyYWdTdWJzY3JpcHRpb24gPSBuZXcgRGlzcG9zYWJsZShmdW5jdGlvbiAoKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZUhhbmRsZXIpXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZXVwSGFuZGxlcilcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIG1vdXNldXBIYW5kbGVyKVxuXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRvdWNobW92ZUhhbmRsZXIpXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdG91Y2hlbmRIYW5kbGVyKVxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRvdWNoZW5kSGFuZGxlcilcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgY2FsbGVkIGR1cmluZyB0aGUgZHJhZyBnZXN0dXJlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHkgdGhlIHZlcnRpY2FsIGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50XG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGlzTGVmdE1vdXNlIHdhcyB0aGUgbGVmdCBtb3VzZSBidXR0b24gcHJlc3NlZD9cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaXNNaWRkbGVNb3VzZSB3YXMgdGhlIG1pZGRsZSBtb3VzZSBidXR0b24gcHJlc3NlZD9cbiAgICogQHBhcmFtICB7bnVtYmVyfSBpbml0aWFsLmRyYWdPZmZzZXQgdGhlIG1vdXNlIG9mZnNldCB3aXRoaW4gdGhlIHZpc2libGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGluaXRpYWwub2Zmc2V0VG9wIHRoZSBNaW5pbWFwRWxlbWVudCBvZmZzZXQgYXQgdGhlIG1vbWVudFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIHRoZSBkcmFnIHN0YXJ0XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhZyAoe3ksIGlzTGVmdE1vdXNlLCBpc01pZGRsZU1vdXNlfSwgaW5pdGlhbCkge1xuICAgIGlmICghdGhpcy5taW5pbWFwKSB7IHJldHVybiB9XG4gICAgaWYgKCFpc0xlZnRNb3VzZSAmJiAhaXNNaWRkbGVNb3VzZSkgeyByZXR1cm4gfVxuICAgIGxldCBkZWx0YVkgPSB5IC0gaW5pdGlhbC5vZmZzZXRUb3AgLSBpbml0aWFsLmRyYWdPZmZzZXRcblxuICAgIGxldCByYXRpbyA9IGRlbHRhWSAvICh0aGlzLm1pbmltYXAuZ2V0VmlzaWJsZUhlaWdodCgpIC0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQoKSlcblxuICAgIHRoaXMubWluaW1hcC5zZXRUZXh0RWRpdG9yU2Nyb2xsVG9wKHJhdGlvICogdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JNYXhTY3JvbGxUb3AoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHRoYXQgZW5kcyB0aGUgZHJhZyBnZXN0dXJlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVuZERyYWcgKCkge1xuICAgIGlmICghdGhpcy5taW5pbWFwKSB7IHJldHVybiB9XG4gICAgdGhpcy5kcmFnU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICB9XG5cbiAgLy8gICAgICMjIyMjIyAgICMjIyMjIyAgICMjIyMjI1xuICAvLyAgICAjIyAgICAjIyAjIyAgICAjIyAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgICAjI1xuICAvLyAgICAjIyAgICAgICAgIyMjIyMjICAgIyMjIyMjXG4gIC8vICAgICMjICAgICAgICAgICAgICMjICAgICAgICMjXG4gIC8vICAgICMjICAgICMjICMjICAgICMjICMjICAgICMjXG4gIC8vICAgICAjIyMjIyMgICAjIyMjIyMgICAjIyMjIyNcblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgcGFzc2VkLWluIHN0eWxlcyBwcm9wZXJ0aWVzIHRvIHRoZSBzcGVjaWZpZWQgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCB0aGUgZWxlbWVudCBvbnRvIHdoaWNoIGFwcGx5IHRoZSBzdHlsZXNcbiAgICogQHBhcmFtICB7T2JqZWN0fSBzdHlsZXMgdGhlIHN0eWxlcyB0byBhcHBseVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGFwcGx5U3R5bGVzIChlbGVtZW50LCBzdHlsZXMpIHtcbiAgICBpZiAoIWVsZW1lbnQpIHsgcmV0dXJuIH1cblxuICAgIGxldCBjc3NUZXh0ID0gJydcbiAgICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBzdHlsZXMpIHtcbiAgICAgIGNzc1RleHQgKz0gYCR7cHJvcGVydHl9OiAke3N0eWxlc1twcm9wZXJ0eV19OyBgXG4gICAgfVxuXG4gICAgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gY3NzVGV4dFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgd2l0aCBhIENTUyB0cmFuc2xhdGlvbiB0cmFuZm9ybSB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbeCA9IDBdIHRoZSB4IG9mZnNldCBvZiB0aGUgdHJhbnNsYXRpb25cbiAgICogQHBhcmFtICB7bnVtYmVyfSBbeSA9IDBdIHRoZSB5IG9mZnNldCBvZiB0aGUgdHJhbnNsYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgQ1NTIHRyYW5zbGF0aW9uIHN0cmluZ1xuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIG1ha2VUcmFuc2xhdGUgKHggPSAwLCB5ID0gMCkge1xuICAgIGlmICh0aGlzLnVzZUhhcmR3YXJlQWNjZWxlcmF0aW9uKSB7XG4gICAgICByZXR1cm4gYHRyYW5zbGF0ZTNkKCR7eH1weCwgJHt5fXB4LCAwKWBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHt4fXB4LCAke3l9cHgpYFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHdpdGggYSBDU1Mgc2NhbGluZyB0cmFuZm9ybSB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbeCA9IDBdIHRoZSB4IHNjYWxpbmcgZmFjdG9yXG4gICAqIEBwYXJhbSAge251bWJlcn0gW3kgPSAwXSB0aGUgeSBzY2FsaW5nIGZhY3RvclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBDU1Mgc2NhbGluZyBzdHJpbmdcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBtYWtlU2NhbGUgKHggPSAwLCB5ID0geCkge1xuICAgIGlmICh0aGlzLnVzZUhhcmR3YXJlQWNjZWxlcmF0aW9uKSB7XG4gICAgICByZXR1cm4gYHNjYWxlM2QoJHt4fSwgJHt5fSwgMSlgXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgc2NhbGUoJHt4fSwgJHt5fSlgXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHRoYXQgcmV0dXJuIHRoZSBjdXJyZW50IHRpbWUgYXMgYSBEYXRlLlxuICAgKlxuICAgKiBUaGF0IG1ldGhvZCBleGlzdCBzbyB0aGF0IHdlIGNhbiBtb2NrIGl0IGluIHRlc3RzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtEYXRlfSB0aGUgY3VycmVudCB0aW1lIGFzIERhdGVcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBnZXRUaW1lICgpIHsgcmV0dXJuIG5ldyBEYXRlKCkgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB0aGF0IG1pbWljIHRoZSBqUXVlcnkgYGFuaW1hdGVgIG1ldGhvZCBhbmQgdXNlZCB0byBhbmltYXRlIHRoZVxuICAgKiBzY3JvbGwgd2hlbiBjbGlja2luZyBvbiB0aGUgTWluaW1hcEVsZW1lbnQgY2FudmFzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtIHRoZSBhbmltYXRpb24gZGF0YSBvYmplY3RcbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbS5mcm9tIHRoZSBzdGFydCB2YWx1ZVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHBhcmFtLnRvIHRoZSBlbmQgdmFsdWVcbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbS5kdXJhdGlvbiB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW0uc3RlcCB0aGUgZWFzaW5nIGZ1bmN0aW9uIGZvciB0aGUgYW5pbWF0aW9uXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgYW5pbWF0ZSAoe2Zyb20sIHRvLCBkdXJhdGlvbiwgc3RlcH0pIHtcbiAgICBsZXQgcHJvZ3Jlc3NcbiAgICBsZXQgc3RhcnQgPSB0aGlzLmdldFRpbWUoKVxuXG4gICAgbGV0IHN3aW5nID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICByZXR1cm4gMC41IC0gTWF0aC5jb3MocHJvZ3Jlc3MgKiBNYXRoLlBJKSAvIDJcbiAgICB9XG5cbiAgICBsZXQgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLm1pbmltYXApIHsgcmV0dXJuIH1cblxuICAgICAgbGV0IHBhc3NlZCA9IHRoaXMuZ2V0VGltZSgpIC0gc3RhcnRcbiAgICAgIGlmIChkdXJhdGlvbiA9PT0gMCkge1xuICAgICAgICBwcm9ncmVzcyA9IDFcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2dyZXNzID0gcGFzc2VkIC8gZHVyYXRpb25cbiAgICAgIH1cbiAgICAgIGlmIChwcm9ncmVzcyA+IDEpIHsgcHJvZ3Jlc3MgPSAxIH1cbiAgICAgIGxldCBkZWx0YSA9IHN3aW5nKHByb2dyZXNzKVxuICAgICAgc3RlcChmcm9tICsgKHRvIC0gZnJvbSkgKiBkZWx0YSlcblxuICAgICAgaWYgKHByb2dyZXNzIDwgMSkgeyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKSB9XG4gICAgfVxuXG4gICAgdXBkYXRlKClcbiAgfVxufVxuIl19
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap-element.js

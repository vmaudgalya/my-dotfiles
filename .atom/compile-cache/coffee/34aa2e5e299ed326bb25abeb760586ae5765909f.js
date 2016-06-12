(function() {
  var AncestorsMethods, CanvasDrawer, CompositeDisposable, DOMStylesReader, Disposable, EventsDelegation, MinimapElement, MinimapQuickSettingsElement, SPEC_MODE, debounce, registerOrUpdateElement, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  debounce = require('underscore-plus').debounce;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  _ref1 = require('atom-utils'), registerOrUpdateElement = _ref1.registerOrUpdateElement, EventsDelegation = _ref1.EventsDelegation, AncestorsMethods = _ref1.AncestorsMethods;

  DOMStylesReader = require('./mixins/dom-styles-reader');

  CanvasDrawer = require('./mixins/canvas-drawer');

  MinimapQuickSettingsElement = null;

  SPEC_MODE = atom.inSpecMode();

  MinimapElement = (function() {
    function MinimapElement() {
      this.relayMousewheelEvent = __bind(this.relayMousewheelEvent, this);
    }

    DOMStylesReader.includeInto(MinimapElement);

    CanvasDrawer.includeInto(MinimapElement);

    EventsDelegation.includeInto(MinimapElement);

    AncestorsMethods.includeInto(MinimapElement);


    /* Public */

    MinimapElement.prototype.displayMinimapOnLeft = false;

    MinimapElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.initializeContent();
      return this.observeConfig({
        'minimap.displayMinimapOnLeft': (function(_this) {
          return function(displayMinimapOnLeft) {
            var swapPosition;
            swapPosition = (_this.minimap != null) && displayMinimapOnLeft !== _this.displayMinimapOnLeft;
            _this.displayMinimapOnLeft = displayMinimapOnLeft;
            return _this.updateMinimapFlexPosition();
          };
        })(this),
        'minimap.minimapScrollIndicator': (function(_this) {
          return function(minimapScrollIndicator) {
            _this.minimapScrollIndicator = minimapScrollIndicator;
            if (_this.minimapScrollIndicator && (_this.scrollIndicator == null) && !_this.standAlone) {
              _this.initializeScrollIndicator();
            } else if (_this.scrollIndicator != null) {
              _this.disposeScrollIndicator();
            }
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.displayPluginsControls': (function(_this) {
          return function(displayPluginsControls) {
            _this.displayPluginsControls = displayPluginsControls;
            if (_this.displayPluginsControls && (_this.openQuickSettings == null) && !_this.standAlone) {
              return _this.initializeOpenQuickSettings();
            } else if (_this.openQuickSettings != null) {
              return _this.disposeOpenQuickSettings();
            }
          };
        })(this),
        'minimap.textOpacity': (function(_this) {
          return function(textOpacity) {
            _this.textOpacity = textOpacity;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.displayCodeHighlights': (function(_this) {
          return function(displayCodeHighlights) {
            _this.displayCodeHighlights = displayCodeHighlights;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.adjustMinimapWidthToSoftWrap': (function(_this) {
          return function(adjustToSoftWrap) {
            _this.adjustToSoftWrap = adjustToSoftWrap;
            if (_this.attached) {
              return _this.measureHeightAndWidth();
            }
          };
        })(this),
        'minimap.useHardwareAcceleration': (function(_this) {
          return function(useHardwareAcceleration) {
            _this.useHardwareAcceleration = useHardwareAcceleration;
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.absoluteMode': (function(_this) {
          return function(absoluteMode) {
            _this.absoluteMode = absoluteMode;
            return _this.classList.toggle('absolute', _this.absoluteMode);
          };
        })(this),
        'editor.preferredLineLength': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.measureHeightAndWidth();
            }
          };
        })(this),
        'editor.softWrap': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'editor.softWrapAtPreferredLineLength': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.attachedCallback = function() {
      this.subscriptions.add(atom.views.pollDocument((function(_this) {
        return function() {
          return _this.pollDOM();
        };
      })(this)));
      this.measureHeightAndWidth();
      this.updateMinimapFlexPosition();
      this.attached = true;
      this.attachedToTextEditor = this.parentNode === this.getTextEditorElementRoot();
      return this.subscriptions.add(atom.styles.onDidAddStyleElement((function(_this) {
        return function() {
          _this.invalidateCache();
          return _this.requestForcedUpdate();
        };
      })(this)));
    };

    MinimapElement.prototype.detachedCallback = function() {
      return this.attached = false;
    };

    MinimapElement.prototype.isVisible = function() {
      return this.offsetWidth > 0 || this.offsetHeight > 0;
    };

    MinimapElement.prototype.attach = function(parent) {
      if (this.attached) {
        return;
      }
      return (parent != null ? parent : this.getTextEditorElementRoot()).appendChild(this);
    };

    MinimapElement.prototype.detach = function() {
      if (!this.attached) {
        return;
      }
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    MinimapElement.prototype.updateMinimapFlexPosition = function() {
      return this.classList.toggle('left', this.displayMinimapOnLeft);
    };

    MinimapElement.prototype.destroy = function() {
      this.subscriptions.dispose();
      this.detach();
      return this.minimap = null;
    };

    MinimapElement.prototype.initializeContent = function() {
      this.initializeCanvas();
      this.shadowRoot = this.createShadowRoot();
      this.shadowRoot.appendChild(this.canvas);
      this.createVisibleArea();
      this.createControls();
      this.subscriptions.add(this.subscribeTo(this, {
        'mousewheel': (function(_this) {
          return function(e) {
            if (!_this.standAlone) {
              return _this.relayMousewheelEvent(e);
            }
          };
        })(this)
      }));
      return this.subscriptions.add(this.subscribeTo(this.canvas, {
        'mousedown': (function(_this) {
          return function(e) {
            return _this.mousePressedOverCanvas(e);
          };
        })(this)
      }));
    };

    MinimapElement.prototype.createVisibleArea = function() {
      if (this.visibleArea != null) {
        return;
      }
      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.visibleAreaSubscription = this.subscribeTo(this.visibleArea, {
        'mousedown': (function(_this) {
          return function(e) {
            return _this.startDrag(e);
          };
        })(this),
        'touchstart': (function(_this) {
          return function(e) {
            return _this.startDrag(e);
          };
        })(this)
      });
      return this.subscriptions.add(this.visibleAreaSubscription);
    };

    MinimapElement.prototype.removeVisibleArea = function() {
      if (this.visibleArea == null) {
        return;
      }
      this.subscriptions.remove(this.visibleAreaSubscription);
      this.visibleAreaSubscription.dispose();
      this.shadowRoot.removeChild(this.visibleArea);
      return delete this.visibleArea;
    };

    MinimapElement.prototype.createControls = function() {
      if ((this.controls != null) || this.standAlone) {
        return;
      }
      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      return this.shadowRoot.appendChild(this.controls);
    };

    MinimapElement.prototype.removeControls = function() {
      if (this.controls == null) {
        return;
      }
      this.shadowRoot.removeChild(this.controls);
      return delete this.controls;
    };

    MinimapElement.prototype.initializeScrollIndicator = function() {
      if ((this.scrollIndicator != null) || this.standAlone) {
        return;
      }
      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      return this.controls.appendChild(this.scrollIndicator);
    };

    MinimapElement.prototype.disposeScrollIndicator = function() {
      if (this.scrollIndicator == null) {
        return;
      }
      this.controls.removeChild(this.scrollIndicator);
      return delete this.scrollIndicator;
    };

    MinimapElement.prototype.initializeOpenQuickSettings = function() {
      if ((this.openQuickSettings != null) || this.standAlone) {
        return;
      }
      this.openQuickSettings = document.createElement('div');
      this.openQuickSettings.classList.add('open-minimap-quick-settings');
      this.controls.appendChild(this.openQuickSettings);
      return this.openQuickSettingSubscription = this.subscribeTo(this.openQuickSettings, {
        'mousedown': (function(_this) {
          return function(e) {
            var left, right, top, _ref2;
            e.preventDefault();
            e.stopPropagation();
            if (_this.quickSettingsElement != null) {
              _this.quickSettingsElement.destroy();
              return _this.quickSettingsSubscription.dispose();
            } else {
              if (MinimapQuickSettingsElement == null) {
                MinimapQuickSettingsElement = require('./minimap-quick-settings-element');
              }
              _this.quickSettingsElement = new MinimapQuickSettingsElement;
              _this.quickSettingsElement.setModel(_this);
              _this.quickSettingsSubscription = _this.quickSettingsElement.onDidDestroy(function() {
                return _this.quickSettingsElement = null;
              });
              _ref2 = _this.canvas.getBoundingClientRect(), top = _ref2.top, left = _ref2.left, right = _ref2.right;
              _this.quickSettingsElement.style.top = top + 'px';
              _this.quickSettingsElement.attach();
              if (_this.displayMinimapOnLeft) {
                return _this.quickSettingsElement.style.left = right + 'px';
              } else {
                return _this.quickSettingsElement.style.left = (left - _this.quickSettingsElement.clientWidth) + 'px';
              }
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.disposeOpenQuickSettings = function() {
      if (this.openQuickSettings == null) {
        return;
      }
      this.controls.removeChild(this.openQuickSettings);
      this.openQuickSettingSubscription.dispose();
      return this.openQuickSettings = void 0;
    };

    MinimapElement.prototype.getTextEditor = function() {
      return this.minimap.getTextEditor();
    };

    MinimapElement.prototype.getTextEditorElement = function() {
      return this.editorElement != null ? this.editorElement : this.editorElement = atom.views.getView(this.getTextEditor());
    };

    MinimapElement.prototype.getTextEditorElementRoot = function() {
      var editorElement, _ref2;
      editorElement = this.getTextEditorElement();
      return (_ref2 = editorElement.shadowRoot) != null ? _ref2 : editorElement;
    };

    MinimapElement.prototype.getDummyDOMRoot = function(shadowRoot) {
      if (shadowRoot) {
        return this.getTextEditorElementRoot();
      } else {
        return this.getTextEditorElement();
      }
    };

    MinimapElement.prototype.getModel = function() {
      return this.minimap;
    };

    MinimapElement.prototype.setModel = function(minimap) {
      this.minimap = minimap;
      this.subscriptions.add(this.minimap.onDidChangeScrollTop((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeScrollLeft((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeConfig((function(_this) {
        return function() {
          if (_this.attached) {
            return _this.requestForcedUpdate();
          }
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeStandAlone((function(_this) {
        return function() {
          _this.setStandAlone(_this.minimap.isStandAlone());
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChange((function(_this) {
        return function(change) {
          _this.pendingChanges.push(change);
          return _this.requestUpdate();
        };
      })(this)));
      this.setStandAlone(this.minimap.isStandAlone());
      if ((this.width != null) && (this.height != null)) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }
      return this.minimap;
    };

    MinimapElement.prototype.setStandAlone = function(standAlone) {
      this.standAlone = standAlone;
      if (this.standAlone) {
        this.setAttribute('stand-alone', true);
        this.disposeScrollIndicator();
        this.disposeOpenQuickSettings();
        this.removeControls();
        return this.removeVisibleArea();
      } else {
        this.removeAttribute('stand-alone');
        this.createVisibleArea();
        this.createControls();
        if (this.minimapScrollIndicator) {
          this.initializeScrollIndicator();
        }
        if (this.displayPluginsControls) {
          return this.initializeOpenQuickSettings();
        }
      }
    };

    MinimapElement.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.update();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapElement.prototype.requestForcedUpdate = function() {
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      return this.requestUpdate();
    };

    MinimapElement.prototype.update = function() {
      var canvasTop, canvasTransform, indicatorHeight, indicatorScroll, minimap, minimapScreenHeight, visibleAreaLeft, visibleAreaTop, visibleWidth;
      if (!(this.attached && this.isVisible() && (this.minimap != null))) {
        return;
      }
      minimap = this.minimap;
      minimap.enableCache();
      visibleAreaLeft = minimap.getTextEditorScaledScrollLeft();
      visibleAreaTop = minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop();
      visibleWidth = Math.min(this.canvas.width / devicePixelRatio, this.width);
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
      this.applyStyles(this.controls, {
        width: visibleWidth + 'px'
      });
      canvasTop = minimap.getFirstVisibleScreenRow() * minimap.getLineHeight() - minimap.getScrollTop();
      canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += " " + this.makeScale(1 / devicePixelRatio);
      }
      if (SPEC_MODE) {
        this.applyStyles(this.canvas, {
          top: canvasTop + 'px'
        });
      } else {
        this.applyStyles(this.canvas, {
          transform: canvasTransform
        });
      }
      if (this.minimapScrollIndicator && minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }
      if (this.scrollIndicator != null) {
        minimapScreenHeight = minimap.getScreenHeight();
        indicatorHeight = minimapScreenHeight * (minimapScreenHeight / minimap.getHeight());
        indicatorScroll = (minimapScreenHeight - indicatorHeight) * minimap.getCapedTextEditorScrollRatio();
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
      return minimap.clearCache();
    };

    MinimapElement.prototype.setDisplayCodeHighlights = function(displayCodeHighlights) {
      this.displayCodeHighlights = displayCodeHighlights;
      if (this.attached) {
        return this.requestForcedUpdate();
      }
    };

    MinimapElement.prototype.pollDOM = function() {
      var visibilityChanged;
      visibilityChanged = this.checkForVisibilityChange();
      if (this.isVisible()) {
        if (!this.wasVisible) {
          this.requestForcedUpdate();
        }
        return this.measureHeightAndWidth(visibilityChanged, false);
      }
    };

    MinimapElement.prototype.checkForVisibilityChange = function() {
      if (this.isVisible()) {
        if (this.wasVisible) {
          return false;
        } else {
          return this.wasVisible = true;
        }
      } else {
        if (this.wasVisible) {
          this.wasVisible = false;
          return true;
        } else {
          return this.wasVisible = false;
        }
      }
    };

    MinimapElement.prototype.measureHeightAndWidth = function(visibilityChanged, forceUpdate) {
      var canvasWidth, lineLength, softWrap, softWrapAtPreferredLineLength, wasResized, width;
      if (forceUpdate == null) {
        forceUpdate = true;
      }
      if (this.minimap == null) {
        return;
      }
      wasResized = this.width !== this.clientWidth || this.height !== this.clientHeight;
      this.height = this.clientHeight;
      this.width = this.clientWidth;
      canvasWidth = this.width;
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
          lineLength = atom.config.get('editor.preferredLineLength');
          softWrap = atom.config.get('editor.softWrap');
          softWrapAtPreferredLineLength = atom.config.get('editor.softWrapAtPreferredLineLength');
          width = lineLength * this.minimap.getCharWidth();
          if (softWrap && softWrapAtPreferredLineLength && lineLength && width <= this.width) {
            this.flexBasis = width;
            canvasWidth = width;
          } else {
            delete this.flexBasis;
          }
        } else {
          delete this.flexBasis;
        }
        if (canvasWidth !== this.canvas.width || this.height !== this.canvas.height) {
          this.canvas.width = canvasWidth * devicePixelRatio;
          return this.canvas.height = (this.height + this.minimap.getLineHeight()) * devicePixelRatio;
        }
      }
    };

    MinimapElement.prototype.observeConfig = function(configs) {
      var callback, config, _results;
      if (configs == null) {
        configs = {};
      }
      _results = [];
      for (config in configs) {
        callback = configs[config];
        _results.push(this.subscriptions.add(atom.config.observe(config, callback)));
      }
      return _results;
    };

    MinimapElement.prototype.mousePressedOverCanvas = function(e) {
      var height, top, _ref2;
      if (this.minimap.isStandAlone()) {
        return;
      }
      if (e.which === 1) {
        return this.leftMousePressedOverCanvas(e);
      } else if (e.which === 2) {
        this.middleMousePressedOverCanvas(e);
        _ref2 = this.visibleArea.getBoundingClientRect(), top = _ref2.top, height = _ref2.height;
        return this.startDrag({
          which: 2,
          pageY: top + height / 2
        });
      } else {

      }
    };

    MinimapElement.prototype.leftMousePressedOverCanvas = function(_arg) {
      var duration, from, pageY, row, scrollTop, step, target, textEditor, to, y;
      pageY = _arg.pageY, target = _arg.target;
      y = pageY - target.getBoundingClientRect().top;
      row = Math.floor(y / this.minimap.getLineHeight()) + this.minimap.getFirstVisibleScreenRow();
      textEditor = this.minimap.getTextEditor();
      scrollTop = row * textEditor.getLineHeightInPixels() - this.minimap.getTextEditorHeight() / 2;
      if (atom.config.get('minimap.scrollAnimation')) {
        from = this.minimap.getTextEditorScrollTop();
        to = scrollTop;
        step = (function(_this) {
          return function(now) {
            return _this.minimap.setTextEditorScrollTop(now);
          };
        })(this);
        duration = atom.config.get('minimap.scrollAnimationDuration');
        return this.animate({
          from: from,
          to: to,
          duration: duration,
          step: step
        });
      } else {
        return this.minimap.setTextEditorScrollTop(scrollTop);
      }
    };

    MinimapElement.prototype.middleMousePressedOverCanvas = function(_arg) {
      var offsetTop, pageY, ratio, y;
      pageY = _arg.pageY;
      offsetTop = this.getBoundingClientRect().top;
      y = pageY - offsetTop - this.minimap.getTextEditorScaledHeight() / 2;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.relayMousewheelEvent = function(e) {
      var editorElement;
      editorElement = atom.views.getView(this.minimap.textEditor);
      return editorElement.component.onMouseWheel(e);
    };

    MinimapElement.prototype.startDrag = function(e) {
      var dragOffset, initial, mousemoveHandler, mouseupHandler, offsetTop, pageY, top, which;
      which = e.which, pageY = e.pageY;
      if (!this.minimap) {
        return;
      }
      if (which !== 1 && which !== 2 && (e.touches == null)) {
        return;
      }
      top = this.visibleArea.getBoundingClientRect().top;
      offsetTop = this.getBoundingClientRect().top;
      dragOffset = pageY - top;
      initial = {
        dragOffset: dragOffset,
        offsetTop: offsetTop
      };
      mousemoveHandler = (function(_this) {
        return function(e) {
          return _this.drag(e, initial);
        };
      })(this);
      mouseupHandler = (function(_this) {
        return function(e) {
          return _this.endDrag(e, initial);
        };
      })(this);
      document.body.addEventListener('mousemove', mousemoveHandler);
      document.body.addEventListener('mouseup', mouseupHandler);
      document.body.addEventListener('mouseleave', mouseupHandler);
      document.body.addEventListener('touchmove', mousemoveHandler);
      document.body.addEventListener('touchend', mouseupHandler);
      return this.dragSubscription = new Disposable(function() {
        document.body.removeEventListener('mousemove', mousemoveHandler);
        document.body.removeEventListener('mouseup', mouseupHandler);
        document.body.removeEventListener('mouseleave', mouseupHandler);
        document.body.removeEventListener('touchmove', mousemoveHandler);
        return document.body.removeEventListener('touchend', mouseupHandler);
      });
    };

    MinimapElement.prototype.drag = function(e, initial) {
      var ratio, y;
      if (!this.minimap) {
        return;
      }
      if (e.which !== 1 && e.which !== 2 && (e.touches == null)) {
        return;
      }
      y = e.pageY - initial.offsetTop - initial.dragOffset;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.endDrag = function(e, initial) {
      if (!this.minimap) {
        return;
      }
      return this.dragSubscription.dispose();
    };

    MinimapElement.prototype.applyStyles = function(element, styles) {
      var cssText, property, value;
      if (element == null) {
        return;
      }
      cssText = '';
      for (property in styles) {
        value = styles[property];
        cssText += "" + property + ": " + value + "; ";
      }
      return element.style.cssText = cssText;
    };

    MinimapElement.prototype.makeTranslate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (this.useHardwareAcceleration) {
        return "translate3d(" + x + "px, " + y + "px, 0)";
      } else {
        return "translate(" + x + "px, " + y + "px)";
      }
    };

    MinimapElement.prototype.makeScale = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = x;
      }
      if (this.useHardwareAcceleration) {
        return "scale3d(" + x + ", " + y + ", 1)";
      } else {
        return "scale(" + x + ", " + y + ")";
      }
    };

    MinimapElement.prototype.getTime = function() {
      return new Date();
    };

    MinimapElement.prototype.animate = function(_arg) {
      var duration, from, start, step, swing, to, update;
      from = _arg.from, to = _arg.to, duration = _arg.duration, step = _arg.step;
      start = this.getTime();
      swing = function(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      };
      update = (function(_this) {
        return function() {
          var delta, passed, progress;
          passed = _this.getTime() - start;
          if (duration === 0) {
            progress = 1;
          } else {
            progress = passed / duration;
          }
          if (progress > 1) {
            progress = 1;
          }
          delta = swing(progress);
          step(from + (to - from) * delta);
          if (progress < 1) {
            return requestAnimationFrame(update);
          }
        };
      })(this);
      return update();
    };

    return MinimapElement;

  })();

  module.exports = MinimapElement = registerOrUpdateElement('atom-text-editor-minimap', MinimapElement.prototype);

  MinimapElement.registerViewProvider = function() {
    return atom.views.addViewProvider(require('./minimap'), function(model) {
      var element;
      element = new MinimapElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwTUFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUMsV0FBWSxPQUFBLENBQVEsaUJBQVIsRUFBWixRQUFELENBQUE7O0FBQUEsRUFDQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBRHRCLENBQUE7O0FBQUEsRUFFQSxRQUFnRSxPQUFBLENBQVEsWUFBUixDQUFoRSxFQUFDLGdDQUFBLHVCQUFELEVBQTBCLHlCQUFBLGdCQUExQixFQUE0Qyx5QkFBQSxnQkFGNUMsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDRCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQU1BLDJCQUFBLEdBQThCLElBTjlCLENBQUE7O0FBQUEsRUFRQSxTQUFBLEdBQVksSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQVJaLENBQUE7O0FBQUEsRUFzQk07OztLQUNKOztBQUFBLElBQUEsZUFBZSxDQUFDLFdBQWhCLENBQTRCLGNBQTVCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLFlBQVksQ0FBQyxXQUFiLENBQXlCLGNBQXpCLENBREEsQ0FBQTs7QUFBQSxJQUVBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLGNBQTdCLENBRkEsQ0FBQTs7QUFBQSxJQUdBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLGNBQTdCLENBSEEsQ0FBQTs7QUFLQTtBQUFBLGdCQUxBOztBQUFBLDZCQU9BLG9CQUFBLEdBQXNCLEtBUHRCLENBQUE7O0FBQUEsNkJBa0JBLGVBQUEs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap-element.coffee

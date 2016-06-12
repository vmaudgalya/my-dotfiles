(function() {
  var AncestorsMethods, CanvasDrawer, CompositeDisposable, DOMStylesReader, Disposable, EventsDelegation, MinimapElement, MinimapQuickSettingsElement, debounce, registerOrUpdateElement, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  debounce = require('underscore-plus').debounce;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  _ref1 = require('atom-utils'), registerOrUpdateElement = _ref1.registerOrUpdateElement, EventsDelegation = _ref1.EventsDelegation, AncestorsMethods = _ref1.AncestorsMethods;

  DOMStylesReader = require('./mixins/dom-styles-reader');

  CanvasDrawer = require('./mixins/canvas-drawer');

  MinimapQuickSettingsElement = null;

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
      var canvasTop, canvasTransform, indicatorHeight, indicatorScroll, minimapScreenHeight, visibleAreaLeft, visibleAreaTop, visibleWidth;
      if (!(this.attached && this.isVisible() && (this.minimap != null))) {
        return;
      }
      visibleAreaLeft = this.minimap.getTextEditorScaledScrollLeft();
      visibleAreaTop = this.minimap.getTextEditorScaledScrollTop() - this.minimap.getScrollTop();
      visibleWidth = Math.min(this.canvas.width / devicePixelRatio, this.width);
      if (this.adjustToSoftWrap && this.flexBasis) {
        this.style.flexBasis = this.flexBasis + 'px';
      } else {
        this.style.flexBasis = null;
      }
      if (atom.inSpecMode()) {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: this.minimap.getTextEditorScaledHeight() + 'px',
          top: visibleAreaTop + 'px',
          left: visibleAreaLeft + 'px'
        });
      } else {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: this.minimap.getTextEditorScaledHeight() + 'px',
          transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
        });
      }
      this.applyStyles(this.controls, {
        width: visibleWidth + 'px'
      });
      canvasTop = this.minimap.getFirstVisibleScreenRow() * this.minimap.getLineHeight() - this.minimap.getScrollTop();
      canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += " " + this.makeScale(1 / devicePixelRatio);
      }
      if (atom.inSpecMode()) {
        this.applyStyles(this.canvas, {
          top: canvasTop + 'px'
        });
      } else {
        this.applyStyles(this.canvas, {
          transform: canvasTransform
        });
      }
      if (this.minimapScrollIndicator && this.minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }
      if (this.scrollIndicator != null) {
        minimapScreenHeight = this.minimap.getScreenHeight();
        indicatorHeight = minimapScreenHeight * (minimapScreenHeight / this.minimap.getHeight());
        indicatorScroll = (minimapScreenHeight - indicatorHeight) * this.minimap.getCapedTextEditorScrollRatio();
        if (atom.inSpecMode()) {
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
        if (!this.minimap.canScroll()) {
          this.disposeScrollIndicator();
        }
      }
      return this.updateCanvas();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrTEFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUMsV0FBWSxPQUFBLENBQVEsaUJBQVIsRUFBWixRQUFELENBQUE7O0FBQUEsRUFDQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBRHRCLENBQUE7O0FBQUEsRUFFQSxRQUFnRSxPQUFBLENBQVEsWUFBUixDQUFoRSxFQUFDLGdDQUFBLHVCQUFELEVBQTBCLHlCQUFBLGdCQUExQixFQUE0Qyx5QkFBQSxnQkFGNUMsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDRCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQU1BLDJCQUFBLEdBQThCLElBTjlCLENBQUE7O0FBQUEsRUFvQk07OztLQUNKOztBQUFBLElBQUEsZUFBZSxDQUFDLFdBQWhCLENBQTRCLGNBQTVCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLFlBQVksQ0FBQyxXQUFiLENBQXlCLGNBQXpCLENBREEsQ0FBQTs7QUFBQSxJQUVBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLGNBQTdCLENBRkEsQ0FBQTs7QUFBQSxJQUdBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLGNBQTdCLENBSEEsQ0FBQTs7QUFLQTtBQUFBLGdCQUxBOztBQUFBLDZCQU9BLG9CQUFBLEdBQXNCLEtBUHRCLENBQUE7O0FBQUEsNkJBa0JBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap-element.coffee

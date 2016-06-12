(function() {
  var AncestorsMethods, CanvasDrawer, CompositeDisposable, DOMStylesReader, Disposable, EventsDelegation, MinimapElement, MinimapQuickSettingsElement, debounce, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  debounce = require('underscore-plus').debounce;

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  _ref1 = require('atom-utils'), EventsDelegation = _ref1.EventsDelegation, AncestorsMethods = _ref1.AncestorsMethods;

  DOMStylesReader = require('./mixins/dom-styles-reader');

  CanvasDrawer = require('./mixins/canvas-drawer');

  MinimapQuickSettingsElement = null;

  MinimapElement = (function(_super) {
    __extends(MinimapElement, _super);

    function MinimapElement() {
      this.relayMousewheelEvent = __bind(this.relayMousewheelEvent, this);
      return MinimapElement.__super__.constructor.apply(this, arguments);
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
            if (_this.minimapScrollIndicator && (_this.scrollIndicator == null)) {
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
            if (_this.displayPluginsControls && (_this.openQuickSettings == null)) {
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
              return _this.requestUpdate();
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
      var canvasMousedown, elementMousewheel, visibleAreaMousedown;
      this.initializeCanvas();
      this.shadowRoot = this.createShadowRoot();
      this.shadowRoot.appendChild(this.canvas);
      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      this.shadowRoot.appendChild(this.controls);
      elementMousewheel = (function(_this) {
        return function(e) {
          return _this.relayMousewheelEvent(e);
        };
      })(this);
      canvasMousedown = (function(_this) {
        return function(e) {
          return _this.mousePressedOverCanvas(e);
        };
      })(this);
      visibleAreaMousedown = (function(_this) {
        return function(e) {
          return _this.startDrag(e);
        };
      })(this);
      this.addEventListener('mousewheel', elementMousewheel);
      this.canvas.addEventListener('mousedown', canvasMousedown);
      this.visibleArea.addEventListener('mousedown', visibleAreaMousedown);
      this.visibleArea.addEventListener('touchstart', visibleAreaMousedown);
      return this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          _this.removeEventListener('mousewheel', elementMousewheel);
          _this.canvas.removeEventListener('mousedown', canvasMousedown);
          _this.visibleArea.removeEventListener('mousedown', visibleAreaMousedown);
          return _this.visibleArea.removeEventListener('touchstart', visibleAreaMousedown);
        };
      })(this)));
    };

    MinimapElement.prototype.initializeScrollIndicator = function() {
      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      return this.controls.appendChild(this.scrollIndicator);
    };

    MinimapElement.prototype.disposeScrollIndicator = function() {
      this.controls.removeChild(this.scrollIndicator);
      return this.scrollIndicator = void 0;
    };

    MinimapElement.prototype.initializeOpenQuickSettings = function() {
      if (this.openQuickSettings != null) {
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
          if (_this.minimap.isStandAlone()) {
            _this.setAttribute('stand-alone', true);
          } else {
            _this.removeAttribute('stand-alone');
          }
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChange((function(_this) {
        return function(change) {
          _this.pendingChanges.push(change);
          return _this.requestUpdate();
        };
      })(this)));
      if (this.minimap.isStandAlone()) {
        this.setAttribute('stand-alone', true);
      }
      if ((this.width != null) && (this.height != null)) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }
      return this.minimap;
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
      if (this.adjustToSoftWrap && (this.marginRight != null)) {
        this.style.marginRight = this.marginRight + 'px';
      } else {
        this.style.marginRight = null;
      }
      visibleAreaLeft = this.minimap.getTextEditorScaledScrollLeft();
      visibleAreaTop = this.minimap.getTextEditorScaledScrollTop() - this.minimap.getScrollTop();
      visibleWidth = Math.min(this.canvas.width / devicePixelRatio, this.width);
      this.applyStyles(this.visibleArea, {
        width: visibleWidth + 'px',
        height: this.minimap.getTextEditorScaledHeight() + 'px',
        transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
      });
      this.applyStyles(this.controls, {
        width: visibleWidth + 'px'
      });
      canvasTop = this.minimap.getFirstVisibleScreenRow() * this.minimap.getLineHeight() - this.minimap.getScrollTop();
      canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += " " + this.makeScale(1 / devicePixelRatio);
      }
      this.applyStyles(this.canvas, {
        transform: canvasTransform
      });
      if (this.minimapScrollIndicator && this.minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }
      if (this.scrollIndicator != null) {
        minimapScreenHeight = this.minimap.getScreenHeight();
        indicatorHeight = minimapScreenHeight * (minimapScreenHeight / this.minimap.getHeight());
        indicatorScroll = (minimapScreenHeight - indicatorHeight) * this.minimap.getCapedTextEditorScrollRatio();
        this.applyStyles(this.scrollIndicator, {
          height: indicatorHeight + 'px',
          transform: this.makeTranslate(0, indicatorScroll)
        });
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
          if (softWrap && softWrapAtPreferredLineLength && lineLength && width < this.width) {
            this.marginRight = width - this.width;
            canvasWidth = width;
          } else {
            this.marginRight = null;
          }
        } else {
          delete this.marginRight;
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
      scrollTop = row * textEditor.getLineHeightInPixels() - textEditor.getHeight() / 2;
      if (atom.config.get('minimap.scrollAnimation')) {
        from = textEditor.getScrollTop();
        to = scrollTop;
        step = function(now) {
          return textEditor.setScrollTop(now);
        };
        duration = atom.config.get('minimap.scrollAnimationDuration');
        return this.animate({
          from: from,
          to: to,
          duration: duration,
          step: step
        });
      } else {
        return textEditor.setScrollTop(scrollTop);
      }
    };

    MinimapElement.prototype.middleMousePressedOverCanvas = function(_arg) {
      var offsetTop, pageY, ratio, y;
      pageY = _arg.pageY;
      offsetTop = this.getBoundingClientRect().top;
      y = pageY - offsetTop - this.minimap.getTextEditorScaledHeight() / 2;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.textEditor.setScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
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
      return this.minimap.textEditor.setScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.endDrag = function(e, initial) {
      if (!this.minimap) {
        return;
      }
      return this.dragSubscription.dispose();
    };

    MinimapElement.prototype.applyStyles = function(element, styles) {
      var cssText, property, value;
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

  })(HTMLElement);

  module.exports = MinimapElement = document.registerElement('atom-text-editor-minimap', {
    prototype: MinimapElement.prototype
  });

  MinimapElement.registerViewProvider = function() {
    return atom.views.addViewProvider(require('./minimap'), function(model) {
      var element;
      element = new MinimapElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzS0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLFdBQVksT0FBQSxDQUFRLGlCQUFSLEVBQVosUUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixrQkFBQSxVQUR0QixDQUFBOztBQUFBLEVBRUEsUUFBdUMsT0FBQSxDQUFRLFlBQVIsQ0FBdkMsRUFBQyx5QkFBQSxnQkFBRCxFQUFtQix5QkFBQSxnQkFGbkIsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDRCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQU1BLDJCQUFBLEdBQThCLElBTjlCLENBQUE7O0FBQUEsRUFvQk07QUFDSixxQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsZUFBZSxDQUFDLFdBQWhCLENBQTRCLGNBQTVCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLFlBQVksQ0FBQyxXQUFiLENBQXlCLGNBQXpCLENBREEsQ0FBQTs7QUFBQSxJQUVBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLGNBQTdCLENBRkEsQ0FBQTs7QUFBQSxJQUdBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLGNBQTdCLENBSEEsQ0FBQTs7QUFLQTtBQUFBLGdCQUxBOztBQUFBLDZCQU9BLG9CQUFBLEdBQXNCLEtBUHRCLENBQUE7O0FBQUEsNkJBa0JBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap-element.coffee

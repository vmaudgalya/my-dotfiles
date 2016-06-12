(function() {
  var ColorBufferElement, ColorMarkerElement, CompositeDisposable, Emitter, EventsDelegation, nextHighlightId, registerOrUpdateElement, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-utils'), registerOrUpdateElement = _ref1.registerOrUpdateElement, EventsDelegation = _ref1.EventsDelegation;

  ColorMarkerElement = require('./color-marker-element');

  nextHighlightId = 0;

  ColorBufferElement = (function(_super) {
    __extends(ColorBufferElement, _super);

    function ColorBufferElement() {
      return ColorBufferElement.__super__.constructor.apply(this, arguments);
    }

    EventsDelegation.includeInto(ColorBufferElement);

    ColorBufferElement.prototype.createdCallback = function() {
      var _ref2;
      _ref2 = [0, 0], this.editorScrollLeft = _ref2[0], this.editorScrollTop = _ref2[1];
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.shadowRoot = this.createShadowRoot();
      this.displayedMarkers = [];
      this.usedMarkers = [];
      this.unusedMarkers = [];
      return this.viewsByMarkers = new WeakMap;
    };

    ColorBufferElement.prototype.attachedCallback = function() {
      this.attached = true;
      return this.update();
    };

    ColorBufferElement.prototype.detachedCallback = function() {
      return this.attached = false;
    };

    ColorBufferElement.prototype.onDidUpdate = function(callback) {
      return this.emitter.on('did-update', callback);
    };

    ColorBufferElement.prototype.getModel = function() {
      return this.colorBuffer;
    };

    ColorBufferElement.prototype.setModel = function(colorBuffer) {
      var scrollLeftListener, scrollTopListener;
      this.colorBuffer = colorBuffer;
      this.editor = this.colorBuffer.editor;
      if (this.editor.isDestroyed()) {
        return;
      }
      this.editorElement = atom.views.getView(this.editor);
      this.colorBuffer.initialize().then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
      this.subscriptions.add(this.colorBuffer.onDidUpdateColorMarkers((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
      this.subscriptions.add(this.colorBuffer.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      scrollLeftListener = (function(_this) {
        return function(editorScrollLeft) {
          _this.editorScrollLeft = editorScrollLeft;
          return _this.updateScroll();
        };
      })(this);
      scrollTopListener = (function(_this) {
        return function(editorScrollTop) {
          _this.editorScrollTop = editorScrollTop;
          if (_this.useNativeDecorations()) {
            return;
          }
          _this.updateScroll();
          return requestAnimationFrame(function() {
            return _this.updateMarkers();
          });
        };
      })(this);
      if (this.editorElement.onDidChangeScrollLeft != null) {
        this.subscriptions.add(this.editorElement.onDidChangeScrollLeft(scrollLeftListener));
        this.subscriptions.add(this.editorElement.onDidChangeScrollTop(scrollTopListener));
      } else {
        this.subscriptions.add(this.editor.onDidChangeScrollLeft(scrollLeftListener));
        this.subscriptions.add(this.editor.onDidChangeScrollTop(scrollTopListener));
      }
      this.subscriptions.add(this.editor.onDidChange((function(_this) {
        return function() {
          return _this.usedMarkers.forEach(function(marker) {
            var _ref2;
            if ((_ref2 = marker.colorMarker) != null) {
              _ref2.invalidateScreenRangeCache();
            }
            return marker.checkScreenRange();
          });
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidAddCursor((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidRemoveCursor((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidAddSelection((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidRemoveSelection((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeSelectionRange((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      if (this.editor.onDidTokenize != null) {
        this.subscriptions.add(this.editor.onDidTokenize((function(_this) {
          return function() {
            return _this.editorConfigChanged();
          };
        })(this)));
      } else {
        this.subscriptions.add(this.editor.displayBuffer.onDidTokenize((function(_this) {
          return function() {
            return _this.editorConfigChanged();
          };
        })(this)));
      }
      this.subscriptions.add(atom.config.observe('editor.fontSize', (function(_this) {
        return function() {
          return _this.editorConfigChanged();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('editor.lineHeight', (function(_this) {
        return function() {
          return _this.editorConfigChanged();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.markerType', (function(_this) {
        return function(type) {
          if (ColorMarkerElement.prototype.rendererType !== type) {
            ColorMarkerElement.setMarkerType(type);
          }
          if (_this.isNativeDecorationType(type)) {
            _this.initializeNativeDecorations(type);
          } else {
            if (type === 'background') {
              _this.classList.add('above-editor-content');
            } else {
              _this.classList.remove('above-editor-content');
            }
            _this.destroyNativeDecorations();
            _this.updateMarkers(type);
          }
          return _this.previousType = type;
        };
      })(this)));
      this.subscriptions.add(atom.styles.onDidAddStyleElement((function(_this) {
        return function() {
          return _this.editorConfigChanged();
        };
      })(this)));
      this.subscriptions.add(this.editorElement.onDidAttach((function(_this) {
        return function() {
          return _this.attach();
        };
      })(this)));
      return this.subscriptions.add(this.editorElement.onDidDetach((function(_this) {
        return function() {
          return _this.detach();
        };
      })(this)));
    };

    ColorBufferElement.prototype.attach = function() {
      var _ref2;
      if (this.parentNode != null) {
        return;
      }
      if (this.editorElement == null) {
        return;
      }
      return (_ref2 = this.getEditorRoot().querySelector('.lines')) != null ? _ref2.appendChild(this) : void 0;
    };

    ColorBufferElement.prototype.detach = function() {
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    ColorBufferElement.prototype.destroy = function() {
      this.detach();
      this.subscriptions.dispose();
      this.releaseAllMarkerViews();
      return this.colorBuffer = null;
    };

    ColorBufferElement.prototype.update = function() {
      if (this.useNativeDecorations()) {
        if (this.isGutterType()) {
          return this.updateGutterDecorations();
        } else {
          return this.updateHighlightDecorations(this.previousType);
        }
      } else {
        return this.updateMarkers();
      }
    };

    ColorBufferElement.prototype.updateScroll = function() {
      if (this.editorElement.hasTiledRendering && !this.useNativeDecorations()) {
        return this.style.webkitTransform = "translate3d(" + (-this.editorScrollLeft) + "px, " + (-this.editorScrollTop) + "px, 0)";
      }
    };

    ColorBufferElement.prototype.getEditorRoot = function() {
      var _ref2;
      return (_ref2 = this.editorElement.shadowRoot) != null ? _ref2 : this.editorElement;
    };

    ColorBufferElement.prototype.editorConfigChanged = function() {
      if ((this.parentNode == null) || this.useNativeDecorations()) {
        return;
      }
      this.usedMarkers.forEach((function(_this) {
        return function(marker) {
          if (marker.colorMarker != null) {
            return marker.render();
          } else {
            console.warn("A marker view was found in the used instance pool while having a null model", marker);
            return _this.releaseMarkerElement(marker);
          }
        };
      })(this));
      return this.updateMarkers();
    };

    ColorBufferElement.prototype.isGutterType = function(type) {
      if (type == null) {
        type = this.previousType;
      }
      return type === 'gutter' || type === 'native-dot' || type === 'native-square-dot';
    };

    ColorBufferElement.prototype.isDotType = function(type) {
      if (type == null) {
        type = this.previousType;
      }
      return type === 'native-dot' || type === 'native-square-dot';
    };

    ColorBufferElement.prototype.useNativeDecorations = function() {
      return this.isNativeDecorationType(this.previousType);
    };

    ColorBufferElement.prototype.isNativeDecorationType = function(type) {
      return ColorMarkerElement.isNativeDecorationType(type);
    };

    ColorBufferElement.prototype.initializeNativeDecorations = function(type) {
      this.releaseAllMarkerViews();
      this.destroyNativeDecorations();
      if (this.isGutterType(type)) {
        return this.initializeGutter(type);
      } else {
        return this.updateHighlightDecorations(type);
      }
    };

    ColorBufferElement.prototype.destroyNativeDecorations = function() {
      if (this.isGutterType()) {
        return this.destroyGutter();
      } else {
        return this.destroyHighlightDecorations();
      }
    };

    ColorBufferElement.prototype.updateHighlightDecorations = function(type) {
      var className, m, markers, markersByRows, maxRowLength, style, _i, _j, _len, _len1, _ref2, _ref3, _ref4, _ref5;
      if (this.editor.isDestroyed()) {
        return;
      }
      if (this.styleByMarkerId == null) {
        this.styleByMarkerId = {};
      }
      if (this.decorationByMarkerId == null) {
        this.decorationByMarkerId = {};
      }
      markers = this.colorBuffer.getValidColorMarkers();
      _ref2 = this.displayedMarkers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        m = _ref2[_i];
        if (!(__indexOf.call(markers, m) < 0)) {
          continue;
        }
        if ((_ref3 = this.decorationByMarkerId[m.id]) != null) {
          _ref3.destroy();
        }
        this.removeChild(this.styleByMarkerId[m.id]);
        delete this.styleByMarkerId[m.id];
        delete this.decorationByMarkerId[m.id];
      }
      markersByRows = {};
      maxRowLength = 0;
      for (_j = 0, _len1 = markers.length; _j < _len1; _j++) {
        m = markers[_j];
        if (((_ref4 = m.color) != null ? _ref4.isValid() : void 0) && __indexOf.call(this.displayedMarkers, m) < 0) {
          _ref5 = this.getHighlighDecorationCSS(m, type), className = _ref5.className, style = _ref5.style;
          this.appendChild(style);
          this.styleByMarkerId[m.id] = style;
          this.decorationByMarkerId[m.id] = this.editor.decorateMarker(m.marker, {
            type: 'highlight',
            "class": "pigments-" + type + " " + className,
            includeMarkerText: type === 'highlight'
          });
        }
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.destroyHighlightDecorations = function() {
      var deco, id, _ref2;
      _ref2 = this.decorationByMarkerId;
      for (id in _ref2) {
        deco = _ref2[id];
        if (this.styleByMarkerId[id] != null) {
          this.removeChild(this.styleByMarkerId[id]);
        }
        deco.destroy();
      }
      delete this.decorationByMarkerId;
      delete this.styleByMarkerId;
      return this.displayedMarkers = [];
    };

    ColorBufferElement.prototype.getHighlighDecorationCSS = function(marker, type) {
      var className, l, style;
      className = "pigments-highlight-" + (nextHighlightId++);
      style = document.createElement('style');
      l = marker.color.luma;
      if (type === 'native-background') {
        style.innerHTML = "." + className + " .region {\n  background-color: " + (marker.color.toCSS()) + ";\n  color: " + (l > 0.43 ? 'black' : 'white') + ";\n}";
      } else if (type === 'native-underline') {
        style.innerHTML = "." + className + " .region {\n  background-color: " + (marker.color.toCSS()) + ";\n}";
      } else if (type === 'native-outline') {
        style.innerHTML = "." + className + " .region {\n  border-color: " + (marker.color.toCSS()) + ";\n}";
      }
      return {
        className: className,
        style: style
      };
    };

    ColorBufferElement.prototype.initializeGutter = function(type) {
      var gutterContainer, options;
      options = {
        name: "pigments-" + type
      };
      if (type !== 'gutter') {
        options.priority = 1000;
      }
      this.gutter = this.editor.addGutter(options);
      this.displayedMarkers = [];
      if (this.decorationByMarkerId == null) {
        this.decorationByMarkerId = {};
      }
      gutterContainer = this.getEditorRoot().querySelector('.gutter-container');
      this.gutterSubscription = new CompositeDisposable;
      this.gutterSubscription.add(this.subscribeTo(gutterContainer, {
        mousedown: (function(_this) {
          return function(e) {
            var colorMarker, markerId, targetDecoration;
            targetDecoration = e.path[0];
            if (!targetDecoration.matches('span')) {
              targetDecoration = targetDecoration.querySelector('span');
            }
            if (targetDecoration == null) {
              return;
            }
            markerId = targetDecoration.dataset.markerId;
            colorMarker = _this.displayedMarkers.filter(function(m) {
              return m.id === Number(markerId);
            })[0];
            if (!((colorMarker != null) && (_this.colorBuffer != null))) {
              return;
            }
            return _this.colorBuffer.selectColorMarkerAndOpenPicker(colorMarker);
          };
        })(this)
      }));
      if (this.isDotType(type)) {
        this.gutterSubscription.add(this.editor.onDidChange((function(_this) {
          return function(changes) {
            if (Array.isArray(changes)) {
              return changes != null ? changes.forEach(function(change) {
                return _this.updateDotDecorationsOffsets(change.start.row);
              }) : void 0;
            } else {
              return _this.updateDotDecorationsOffsets(changes.start.row);
            }
          };
        })(this)));
      }
      return this.updateGutterDecorations(type);
    };

    ColorBufferElement.prototype.destroyGutter = function() {
      var decoration, id, _ref2;
      this.gutter.destroy();
      this.gutterSubscription.dispose();
      this.displayedMarkers = [];
      _ref2 = this.decorationByMarkerId;
      for (id in _ref2) {
        decoration = _ref2[id];
        decoration.destroy();
      }
      delete this.decorationByMarkerId;
      return delete this.gutterSubscription;
    };

    ColorBufferElement.prototype.updateGutterDecorations = function(type) {
      var deco, decoWidth, m, markers, markersByRows, maxRowLength, row, rowLength, _i, _j, _len, _len1, _ref2, _ref3, _ref4;
      if (type == null) {
        type = this.previousType;
      }
      if (this.editor.isDestroyed()) {
        return;
      }
      markers = this.colorBuffer.getValidColorMarkers();
      _ref2 = this.displayedMarkers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        m = _ref2[_i];
        if (!(__indexOf.call(markers, m) < 0)) {
          continue;
        }
        if ((_ref3 = this.decorationByMarkerId[m.id]) != null) {
          _ref3.destroy();
        }
        delete this.decorationByMarkerId[m.id];
      }
      markersByRows = {};
      maxRowLength = 0;
      for (_j = 0, _len1 = markers.length; _j < _len1; _j++) {
        m = markers[_j];
        if (((_ref4 = m.color) != null ? _ref4.isValid() : void 0) && __indexOf.call(this.displayedMarkers, m) < 0) {
          this.decorationByMarkerId[m.id] = this.gutter.decorateMarker(m.marker, {
            type: 'gutter',
            "class": 'pigments-gutter-marker',
            item: this.getGutterDecorationItem(m)
          });
        }
        deco = this.decorationByMarkerId[m.id];
        row = m.marker.getStartScreenPosition().row;
        if (markersByRows[row] == null) {
          markersByRows[row] = 0;
        }
        rowLength = 0;
        if (type !== 'gutter') {
          rowLength = this.editorElement.pixelPositionForScreenPosition([row, Infinity]).left;
        }
        decoWidth = 14;
        deco.properties.item.style.left = "" + (rowLength + markersByRows[row] * decoWidth) + "px";
        markersByRows[row]++;
        maxRowLength = Math.max(maxRowLength, markersByRows[row]);
      }
      if (type === 'gutter') {
        atom.views.getView(this.gutter).style.minWidth = "" + (maxRowLength * decoWidth) + "px";
      } else {
        atom.views.getView(this.gutter).style.width = "0px";
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.updateDotDecorationsOffsets = function(row) {
      var deco, decoWidth, m, markerRow, markersByRows, rowLength, _i, _len, _ref2, _results;
      markersByRows = {};
      _ref2 = this.displayedMarkers;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        m = _ref2[_i];
        deco = this.decorationByMarkerId[m.id];
        if (m.marker == null) {
          continue;
        }
        markerRow = m.marker.getStartScreenPosition().row;
        if (row !== markerRow) {
          continue;
        }
        if (markersByRows[row] == null) {
          markersByRows[row] = 0;
        }
        rowLength = this.editorElement.pixelPositionForScreenPosition([row, Infinity]).left;
        decoWidth = 14;
        deco.properties.item.style.left = "" + (rowLength + markersByRows[row] * decoWidth) + "px";
        _results.push(markersByRows[row]++);
      }
      return _results;
    };

    ColorBufferElement.prototype.getGutterDecorationItem = function(marker) {
      var div;
      div = document.createElement('div');
      div.innerHTML = "<span style='background-color: " + (marker.color.toCSS()) + ";' data-marker-id='" + marker.id + "'></span>";
      return div;
    };

    ColorBufferElement.prototype.requestMarkerUpdate = function(markers) {
      if (this.frameRequested) {
        this.dirtyMarkers = this.dirtyMarkers.concat(markers);
        return;
      } else {
        this.dirtyMarkers = markers.slice();
        this.frameRequested = true;
      }
      return requestAnimationFrame((function(_this) {
        return function() {
          var dirtyMarkers, m, _i, _len, _ref2;
          dirtyMarkers = [];
          _ref2 = _this.dirtyMarkers;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            m = _ref2[_i];
            if (__indexOf.call(dirtyMarkers, m) < 0) {
              dirtyMarkers.push(m);
            }
          }
          delete _this.frameRequested;
          delete _this.dirtyMarkers;
          if (_this.colorBuffer == null) {
            return;
          }
          return dirtyMarkers.forEach(function(marker) {
            return marker.render();
          });
        };
      })(this));
    };

    ColorBufferElement.prototype.updateMarkers = function(type) {
      var m, markers, _base, _base1, _i, _j, _len, _len1, _ref2, _ref3, _ref4;
      if (type == null) {
        type = this.previousType;
      }
      if (this.editor.isDestroyed()) {
        return;
      }
      markers = this.colorBuffer.findValidColorMarkers({
        intersectsScreenRowRange: (_ref2 = typeof (_base = this.editorElement).getVisibleRowRange === "function" ? _base.getVisibleRowRange() : void 0) != null ? _ref2 : typeof (_base1 = this.editor).getVisibleRowRange === "function" ? _base1.getVisibleRowRange() : void 0
      });
      _ref3 = this.displayedMarkers;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        m = _ref3[_i];
        if (__indexOf.call(markers, m) < 0) {
          this.releaseMarkerView(m);
        }
      }
      for (_j = 0, _len1 = markers.length; _j < _len1; _j++) {
        m = markers[_j];
        if (((_ref4 = m.color) != null ? _ref4.isValid() : void 0) && __indexOf.call(this.displayedMarkers, m) < 0) {
          this.requestMarkerView(m);
        }
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.requestMarkerView = function(marker) {
      var view;
      if (this.unusedMarkers.length) {
        view = this.unusedMarkers.shift();
      } else {
        view = new ColorMarkerElement;
        view.setContainer(this);
        view.onDidRelease((function(_this) {
          return function(_arg) {
            var marker;
            marker = _arg.marker;
            _this.displayedMarkers.splice(_this.displayedMarkers.indexOf(marker), 1);
            return _this.releaseMarkerView(marker);
          };
        })(this));
        this.shadowRoot.appendChild(view);
      }
      view.setModel(marker);
      this.hideMarkerIfInSelectionOrFold(marker, view);
      this.usedMarkers.push(view);
      this.viewsByMarkers.set(marker, view);
      return view;
    };

    ColorBufferElement.prototype.releaseMarkerView = function(markerOrView) {
      var marker, view;
      marker = markerOrView;
      view = this.viewsByMarkers.get(markerOrView);
      if (view != null) {
        if (marker != null) {
          this.viewsByMarkers["delete"](marker);
        }
        return this.releaseMarkerElement(view);
      }
    };

    ColorBufferElement.prototype.releaseMarkerElement = function(view) {
      this.usedMarkers.splice(this.usedMarkers.indexOf(view), 1);
      if (!view.isReleased()) {
        view.release(false);
      }
      return this.unusedMarkers.push(view);
    };

    ColorBufferElement.prototype.releaseAllMarkerViews = function() {
      var view, _i, _j, _len, _len1, _ref2, _ref3;
      _ref2 = this.usedMarkers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        view = _ref2[_i];
        view.destroy();
      }
      _ref3 = this.unusedMarkers;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        view = _ref3[_j];
        view.destroy();
      }
      this.usedMarkers = [];
      this.unusedMarkers = [];
      return Array.prototype.forEach.call(this.shadowRoot.querySelectorAll('pigments-color-marker'), function(el) {
        return el.parentNode.removeChild(el);
      });
    };

    ColorBufferElement.prototype.requestSelectionUpdate = function() {
      if (this.updateRequested) {
        return;
      }
      this.updateRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.updateRequested = false;
          if (_this.editor.getBuffer().isDestroyed()) {
            return;
          }
          return _this.updateSelections();
        };
      })(this));
    };

    ColorBufferElement.prototype.updateSelections = function() {
      var decoration, marker, view, _i, _j, _len, _len1, _ref2, _ref3, _results, _results1;
      if (this.editor.isDestroyed()) {
        return;
      }
      if (this.useNativeDecorations()) {
        _ref2 = this.displayedMarkers;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          marker = _ref2[_i];
          decoration = this.decorationByMarkerId[marker.id];
          if (decoration != null) {
            _results.push(this.hideDecorationIfInSelection(marker, decoration));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else {
        _ref3 = this.displayedMarkers;
        _results1 = [];
        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
          marker = _ref3[_j];
          view = this.viewsByMarkers.get(marker);
          if (view != null) {
            view.classList.remove('hidden');
            view.classList.remove('in-fold');
            _results1.push(this.hideMarkerIfInSelectionOrFold(marker, view));
          } else {
            _results1.push(console.warn("A color marker was found in the displayed markers array without an associated view", marker));
          }
        }
        return _results1;
      }
    };

    ColorBufferElement.prototype.hideDecorationIfInSelection = function(marker, decoration) {
      var classes, markerRange, props, range, selection, selections, _i, _len;
      selections = this.editor.getSelections();
      props = decoration.getProperties();
      classes = props["class"].split(/\s+/g);
      for (_i = 0, _len = selections.length; _i < _len; _i++) {
        selection = selections[_i];
        range = selection.getScreenRange();
        markerRange = marker.getScreenRange();
        if (!((markerRange != null) && (range != null))) {
          continue;
        }
        if (markerRange.intersectsWith(range)) {
          if (classes[0].match(/-in-selection$/) == null) {
            classes[0] += '-in-selection';
          }
          props["class"] = classes.join(' ');
          decoration.setProperties(props);
          return;
        }
      }
      classes = classes.map(function(cls) {
        return cls.replace('-in-selection', '');
      });
      props["class"] = classes.join(' ');
      return decoration.setProperties(props);
    };

    ColorBufferElement.prototype.hideMarkerIfInSelectionOrFold = function(marker, view) {
      var markerRange, range, selection, selections, _i, _len, _results;
      selections = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = selections.length; _i < _len; _i++) {
        selection = selections[_i];
        range = selection.getScreenRange();
        markerRange = marker.getScreenRange();
        if (!((markerRange != null) && (range != null))) {
          continue;
        }
        if (markerRange.intersectsWith(range)) {
          view.classList.add('hidden');
        }
        if (this.editor.isFoldedAtBufferRow(marker.getBufferRange().start.row)) {
          _results.push(view.classList.add('in-fold'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ColorBufferElement.prototype.colorMarkerForMouseEvent = function(event) {
      var bufferPosition, position;
      position = this.screenPositionForMouseEvent(event);
      bufferPosition = this.colorBuffer.editor.bufferPositionForScreenPosition(position);
      return this.colorBuffer.getColorMarkerAtBufferPosition(bufferPosition);
    };

    ColorBufferElement.prototype.screenPositionForMouseEvent = function(event) {
      var pixelPosition;
      pixelPosition = this.pixelPositionForMouseEvent(event);
      if (this.editorElement.screenPositionForPixelPosition != null) {
        return this.editorElement.screenPositionForPixelPosition(pixelPosition);
      } else {
        return this.editor.screenPositionForPixelPosition(pixelPosition);
      }
    };

    ColorBufferElement.prototype.pixelPositionForMouseEvent = function(event) {
      var clientX, clientY, left, rootElement, scrollTarget, top, _ref2;
      clientX = event.clientX, clientY = event.clientY;
      scrollTarget = this.editorElement.getScrollTop != null ? this.editorElement : this.editor;
      rootElement = this.getEditorRoot();
      _ref2 = rootElement.querySelector('.lines').getBoundingClientRect(), top = _ref2.top, left = _ref2.left;
      top = clientY - top + scrollTarget.getScrollTop();
      left = clientX - left + scrollTarget.getScrollLeft();
      return {
        top: top,
        left: left
      };
    };

    return ColorBufferElement;

  })(HTMLElement);

  module.exports = ColorBufferElement = registerOrUpdateElement('pigments-markers', ColorBufferElement.prototype);

  ColorBufferElement.registerViewProvider = function(modelClass) {
    return atom.views.addViewProvider(modelClass, function(model) {
      var element;
      element = new ColorBufferElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWJ1ZmZlci1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2SUFBQTtJQUFBOzt5SkFBQTs7QUFBQSxFQUFBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsZUFBQSxPQUFELEVBQVUsMkJBQUEsbUJBQVYsQ0FBQTs7QUFBQSxFQUNBLFFBQThDLE9BQUEsQ0FBUSxZQUFSLENBQTlDLEVBQUMsZ0NBQUEsdUJBQUQsRUFBMEIseUJBQUEsZ0JBRDFCLENBQUE7O0FBQUEsRUFFQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FGckIsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0IsQ0FKbEIsQ0FBQTs7QUFBQSxFQU1NO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsa0JBQTdCLENBQUEsQ0FBQTs7QUFBQSxpQ0FFQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsS0FBQTtBQUFBLE1BQUEsUUFBd0MsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF4QyxFQUFDLElBQUMsQ0FBQSwyQkFBRixFQUFvQixJQUFDLENBQUEsMEJBQXJCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BRFgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUZqQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBSGQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLEVBSnBCLENBQUE7QUFBQSxNQUtBLElBQUMs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-buffer-element.coffee

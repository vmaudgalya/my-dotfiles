(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      control: null,
      canvas: null,
      getHue: function() {
        if ((this.control && this.control.selection) && this.element) {
          return this.control.selection.y / this.element.getHeight() * 360;
        } else {
          return 0;
        }
      },
      emitSelectionChanged: function() {
        return this.Emitter.emit('selectionChanged', this.control.selection);
      },
      onSelectionChanged: function(callback) {
        return this.Emitter.on('selectionChanged', callback);
      },
      emitColorChanged: function() {
        return this.Emitter.emit('colorChanged', this.control.selection.color);
      },
      onColorChanged: function(callback) {
        return this.Emitter.on('colorChanged', callback);
      },
      activate: function() {
        var Body;
        Body = colorPicker.getExtension('Body');
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = Body.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-hue");
            return _el;
          })(),
          width: 0,
          height: 0,
          getWidth: function() {
            return this.width || this.el.offsetWidth;
          },
          getHeight: function() {
            return this.height || this.el.offsetHeight;
          },
          rect: null,
          getRect: function() {
            return this.rect || this.updateRect();
          },
          updateRect: function() {
            return this.rect = this.el.getClientRects()[0];
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        Body.element.add(this.element.el, 2);
        colorPicker.onOpen((function(_this) {
          return function() {
            var _rect;
            if (!(_this.element.updateRect() && (_rect = _this.element.getRect()))) {
              return;
            }
            _this.width = _rect.width;
            return _this.height = _rect.height;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Hue, _context, _elementHeight, _elementWidth, _gradient, _hex, _hexes, _i, _j, _len, _step;
            Hue = _this;
            _elementWidth = _this.element.getWidth();
            _elementHeight = _this.element.getHeight();
            _hexes = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#f00'];
            _this.canvas = {
              el: (function() {
                var _el;
                _el = document.createElement('canvas');
                _el.width = _elementWidth;
                _el.height = _elementHeight;
                _el.classList.add("" + Hue.element.el.className + "-canvas");
                return _el;
              })(),
              context: null,
              getContext: function() {
                return this.context || (this.context = this.el.getContext('2d'));
              },
              getColorAtPosition: function(y) {
                return colorPicker.SmartColor.HSVArray([y / Hue.element.getHeight() * 360, 100, 100]);
              }
            };
            _context = _this.canvas.getContext();
            _step = 1 / (_hexes.length - 1);
            _gradient = _context.createLinearGradient(0, 0, 1, _elementHeight);
            for (_i = _j = 0, _len = _hexes.length; _j < _len; _i = ++_j) {
              _hex = _hexes[_i];
              _gradient.addColorStop(_step * _i, _hex);
            }
            _context.fillStyle = _gradient;
            _context.fillRect(0, 0, _elementWidth, _elementHeight);
            return _this.element.add(_this.canvas.el);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Hue, hasChild;
            hasChild = function(element, child) {
              var _parent;
              if (child && (_parent = child.parentNode)) {
                if (child === element) {
                  return true;
                } else {
                  return hasChild(element, _parent);
                }
              }
              return false;
            };
            Hue = _this;
            _this.control = {
              el: (function() {
                var _el;
                _el = document.createElement('div');
                _el.classList.add("" + Hue.element.el.className + "-control");
                return _el;
              })(),
              isGrabbing: false,
              selection: {
                y: 0,
                color: null
              },
              setSelection: function(e, y, offset) {
                var _height, _position, _rect, _width, _y;
                if (y == null) {
                  y = null;
                }
                if (offset == null) {
                  offset = null;
                }
                if (!(Hue.canvas && (_rect = Hue.element.getRect()))) {
                  return;
                }
                _width = Hue.element.getWidth();
                _height = Hue.element.getHeight();
                if (e) {
                  _y = e.pageY - _rect.top;
                } else if (typeof y === 'number') {
                  _y = y;
                } else if (typeof offset === 'number') {
                  _y = this.selection.y + offset;
                } else {
                  _y = this.selection.y;
                }
                _y = this.selection.y = Math.max(0, Math.min(_height, _y));
                this.selection.color = Hue.canvas.getColorAtPosition(_y);
                _position = {
                  y: Math.max(3, Math.min(_height - 6, _y))
                };
                requestAnimationFrame((function(_this) {
                  return function() {
                    return _this.el.style.top = "" + _position.y + "px";
                  };
                })(this));
                return Hue.emitSelectionChanged();
              },
              refreshSelection: function() {
                return this.setSelection();
              }
            };
            _this.control.refreshSelection();
            colorPicker.onInputColor(function(smartColor) {
              var _hue;
              _hue = smartColor.toHSVArray()[0];
              return _this.control.setSelection(null, (_this.element.getHeight() / 360) * _hue);
            });
            Hue.onSelectionChanged(function() {
              return Hue.emitColorChanged();
            });
            colorPicker.onOpen(function() {
              return _this.control.refreshSelection();
            });
            colorPicker.onOpen(function() {
              return _this.control.isGrabbing = false;
            });
            colorPicker.onClose(function() {
              return _this.control.isGrabbing = false;
            });
            colorPicker.onMouseDown(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Hue.element.el, e.target))) {
                return;
              }
              e.preventDefault();
              _this.control.isGrabbing = true;
              return _this.control.setSelection(e);
            });
            colorPicker.onMouseMove(function(e) {
              if (!_this.control.isGrabbing) {
                return;
              }
              return _this.control.setSelection(e);
            });
            colorPicker.onMouseUp(function(e) {
              if (!_this.control.isGrabbing) {
                return;
              }
              _this.control.isGrabbing = false;
              return _this.control.setSelection(e);
            });
            colorPicker.onMouseWheel(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Hue.element.el, e.target))) {
                return;
              }
              e.preventDefault();
              return _this.control.setSelection(null, null, e.wheelDeltaY * .33);
            });
            return _this.element.add(_this.control.el);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9leHRlbnNpb25zL0h1ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFLSTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxXQUFELEdBQUE7V0FDYjtBQUFBLE1BQUEsT0FBQSxFQUFTLENBQUMsT0FBQSxDQUFRLG9CQUFSLENBQUQsQ0FBQSxDQUFBLENBQVQ7QUFBQSxNQUVBLE9BQUEsRUFBUyxJQUZUO0FBQUEsTUFHQSxPQUFBLEVBQVMsSUFIVDtBQUFBLE1BSUEsTUFBQSxFQUFRLElBSlI7QUFBQSxNQVNBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDSixRQUFBLElBQUcsQ0FBQyxJQUFDLENBQUEsT0FBRCxJQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBdkIsQ0FBQSxJQUFzQyxJQUFDLENBQUEsT0FBMUM7QUFDSSxpQkFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFuQixHQUF1QixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBQSxDQUF2QixHQUE4QyxHQUFyRCxDQURKO1NBQUEsTUFBQTtBQUVLLGlCQUFPLENBQVAsQ0FGTDtTQURJO01BQUEsQ0FUUjtBQUFBLE1Ba0JBLG9CQUFBLEVBQXNCLFNBQUEsR0FBQTtlQUNsQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxrQkFBZCxFQUFrQyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQTNDLEVBRGtCO01BQUEsQ0FsQnRCO0FBQUEsTUFvQkEsa0JBQUEsRUFBb0IsU0FBQyxRQUFELEdBQUE7ZUFDaEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksa0JBQVosRUFBZ0MsUUFBaEMsRUFEZ0I7TUFBQSxDQXBCcEI7QUFBQSxNQXdCQSxnQkFBQSxF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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/extensions/Hue.coffee

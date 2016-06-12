(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      control: null,
      canvas: null,
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
            _el.classList.add("" + _classPrefix + "-saturation");
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
        Body.element.add(this.element.el, 0);
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
            var Hue, Saturation, _elementHeight, _elementWidth;
            Saturation = _this;
            Hue = colorPicker.getExtension('Hue');
            _elementWidth = _this.element.getWidth();
            _elementHeight = _this.element.getHeight();
            _this.canvas = {
              el: (function() {
                var _el;
                _el = document.createElement('canvas');
                _el.width = _elementWidth;
                _el.height = _elementHeight;
                _el.classList.add("" + Saturation.element.el.className + "-canvas");
                return _el;
              })(),
              context: null,
              getContext: function() {
                return this.context || (this.context = this.el.getContext('2d'));
              },
              getColorAtPosition: function(x, y) {
                return colorPicker.SmartColor.HSVArray([Hue.getHue(), x / Saturation.element.getWidth() * 100, 100 - (y / Saturation.element.getHeight() * 100)]);
              },
              previousRender: null,
              render: function(smartColor) {
                var _context, _gradient, _hslArray, _joined;
                _hslArray = ((function() {
                  if (!smartColor) {
                    return colorPicker.SmartColor.HEX('#f00');
                  } else {
                    return smartColor;
                  }
                })()).toHSLArray();
                _joined = _hslArray.join(',');
                if (this.previousRender && this.previousRender === _joined) {
                  return;
                }
                _context = this.getContext();
                _context.clearRect(0, 0, _elementWidth, _elementHeight);
                _gradient = _context.createLinearGradient(0, 0, _elementWidth, 1);
                _gradient.addColorStop(.01, 'hsl(0,100%,100%)');
                _gradient.addColorStop(.99, "hsl(" + _hslArray[0] + ",100%,50%)");
                _context.fillStyle = _gradient;
                _context.fillRect(0, 0, _elementWidth, _elementHeight);
                _gradient = _context.createLinearGradient(0, 0, 1, _elementHeight);
                _gradient.addColorStop(.01, 'rgba(0,0,0,0)');
                _gradient.addColorStop(.99, 'rgba(0,0,0,1)');
                _context.fillStyle = _gradient;
                _context.fillRect(0, 0, _elementWidth, _elementHeight);
                return this.previousRender = _joined;
              }
            };
            Hue.onColorChanged(function(smartColor) {
              return _this.canvas.render(smartColor);
            });
            _this.canvas.render();
            return _this.element.add(_this.canvas.el);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Hue, Saturation, hasChild;
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
            Saturation = _this;
            Hue = colorPicker.getExtension('Hue');
            _this.control = {
              el: (function() {
                var _el;
                _el = document.createElement('div');
                _el.classList.add("" + Saturation.element.el.className + "-control");
                return _el;
              })(),
              isGrabbing: false,
              previousControlPosition: null,
              updateControlPosition: function(x, y) {
                var _joined;
                _joined = "" + x + "," + y;
                if (this.previousControlPosition && this.previousControlPosition === _joined) {
                  return;
                }
                requestAnimationFrame((function(_this) {
                  return function() {
                    _this.el.style.left = "" + x + "px";
                    return _this.el.style.top = "" + y + "px";
                  };
                })(this));
                return this.previousControlPosition = _joined;
              },
              selection: {
                x: null,
                y: 0,
                color: null
              },
              setSelection: function(e, saturation, key) {
                var _height, _position, _rect, _width, _x, _y;
                if (saturation == null) {
                  saturation = null;
                }
                if (key == null) {
                  key = null;
                }
                if (!(Saturation.canvas && (_rect = Saturation.element.getRect()))) {
                  return;
                }
                _width = Saturation.element.getWidth();
                _height = Saturation.element.getHeight();
                if (e) {
                  _x = e.pageX - _rect.left;
                  _y = e.pageY - _rect.top;
                } else if ((typeof saturation === 'number') && (typeof key === 'number')) {
                  _x = _width * saturation;
                  _y = _height * key;
                } else {
                  if (typeof this.selection.x !== 'number') {
                    this.selection.x = _width;
                  }
                  _x = this.selection.x;
                  _y = this.selection.y;
                }
                _x = this.selection.x = Math.max(0, Math.min(_width, Math.round(_x)));
                _y = this.selection.y = Math.max(0, Math.min(_height, Math.round(_y)));
                _position = {
                  x: Math.max(6, Math.min(_width - 7, _x)),
                  y: Math.max(6, Math.min(_height - 7, _y))
                };
                this.selection.color = Saturation.canvas.getColorAtPosition(_x, _y);
                this.updateControlPosition(_position.x, _position.y);
                return Saturation.emitSelectionChanged();
              },
              refreshSelection: function() {
                return this.setSelection();
              }
            };
            _this.control.refreshSelection();
            colorPicker.onInputColor(function(smartColor) {
              var h, s, v, _ref;
              _ref = smartColor.toHSVArray(), h = _ref[0], s = _ref[1], v = _ref[2];
              return _this.control.setSelection(null, s, 1 - v);
            });
            Saturation.onSelectionChanged(function() {
              return Saturation.emitColorChanged();
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
            Hue.onColorChanged(function() {
              return _this.control.refreshSelection();
            });
            colorPicker.onMouseDown(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Saturation.element.el, e.target))) {
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
            return _this.element.add(_this.control.el);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9leHRlbnNpb25zL1NhdHVyYXRpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBS0k7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsV0FBRCxHQUFBO1dBQ2I7QUFBQSxNQUFBLE9BQUEsRUFBUyxDQUFDLE9BQUEsQ0FBUSxvQkFBUixDQUFELENBQUEsQ0FBQSxDQUFUO0FBQUEsTUFFQSxPQUFBLEVBQVMsSUFGVDtBQUFBLE1BR0EsT0FBQSxFQUFTLElBSFQ7QUFBQSxNQUlBLE1BQUEsRUFBUSxJQUpSO0FBQUEsTUFVQSxvQkFBQSxFQUFzQixTQUFBLEdBQUE7ZUFDbEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsa0JBQWQsRUFBa0MsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUEzQyxFQURrQjtNQUFBLENBVnRCO0FBQUEsTUFZQSxrQkFBQSxFQUFvQixTQUFDLFFBQUQsR0FBQTtlQUNoQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxRQUFoQyxFQURnQjtNQUFBLENBWnBCO0FBQUEsTUFnQkEsZ0JBQUEsRUFBa0IsU0FBQSxHQUFBO2VBQ2QsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsY0FBZCxFQUE4QixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFqRCxFQURjO01BQUEsQ0FoQmxCO0FBQUEsTUFrQkEsY0FBQSxFQUFnQixTQUFDLFFBQUQsR0FBQTtlQUNaLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGNBQVosRUFBNEIsUUFBNUIsRUFEWTtNQUFBLENBbEJoQjtBQUFBLE1Bd0JBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixZQUFBLElBQUE7QUFBQSxR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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/extensions/Saturation.coffee

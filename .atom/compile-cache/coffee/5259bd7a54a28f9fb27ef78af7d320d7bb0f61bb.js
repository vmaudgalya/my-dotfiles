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
            _el.classList.add("" + _classPrefix + "-alpha");
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
        Body.element.add(this.element.el, 1);
        colorPicker.onOpen((function(_this) {
          return function() {
            return _this.element.updateRect();
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha, Saturation, _elementHeight, _elementWidth;
            Alpha = _this;
            Saturation = colorPicker.getExtension('Saturation');
            _elementWidth = _this.element.getWidth();
            _elementHeight = _this.element.getHeight();
            _this.canvas = {
              el: (function() {
                var _el;
                _el = document.createElement('canvas');
                _el.width = _elementWidth;
                _el.height = _elementHeight;
                _el.classList.add("" + Alpha.element.el.className + "-canvas");
                return _el;
              })(),
              context: null,
              getContext: function() {
                return this.context || (this.context = this.el.getContext('2d'));
              },
              previousRender: null,
              render: function(smartColor) {
                var _context, _gradient, _rgb;
                _rgb = ((function() {
                  if (!smartColor) {
                    return colorPicker.SmartColor.HEX('#f00');
                  } else {
                    return smartColor;
                  }
                })()).toRGBArray().join(',');
                if (this.previousRender && this.previousRender === _rgb) {
                  return;
                }
                _context = this.getContext();
                _context.clearRect(0, 0, _elementWidth, _elementHeight);
                _gradient = _context.createLinearGradient(0, 0, 1, _elementHeight);
                _gradient.addColorStop(.01, "rgba(" + _rgb + ",1)");
                _gradient.addColorStop(.99, "rgba(" + _rgb + ",0)");
                _context.fillStyle = _gradient;
                _context.fillRect(0, 0, _elementWidth, _elementHeight);
                return this.previousRender = _rgb;
              }
            };
            Saturation.onColorChanged(function(smartColor) {
              return _this.canvas.render(smartColor);
            });
            _this.canvas.render();
            return _this.element.add(_this.canvas.el);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha, Saturation, hasChild;
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
            Alpha = _this;
            Saturation = colorPicker.getExtension('Saturation');
            _this.control = {
              el: (function() {
                var _el;
                _el = document.createElement('div');
                _el.classList.add("" + Alpha.element.el.className + "-control");
                return _el;
              })(),
              isGrabbing: false,
              previousControlPosition: null,
              updateControlPosition: function(y) {
                var _joined;
                _joined = "," + y;
                if (this.previousControlPosition && this.previousControlPosition === _joined) {
                  return;
                }
                requestAnimationFrame((function(_this) {
                  return function() {
                    return _this.el.style.top = "" + y + "px";
                  };
                })(this));
                return this.previousControlPosition = _joined;
              },
              selection: {
                y: 0,
                color: null,
                alpha: null
              },
              setSelection: function(e, alpha, offset) {
                var _RGBAArray, _alpha, _height, _position, _rect, _smartColor, _width, _y;
                if (alpha == null) {
                  alpha = null;
                }
                if (offset == null) {
                  offset = null;
                }
                _rect = Alpha.element.getRect();
                _width = Alpha.element.getWidth();
                _height = Alpha.element.getHeight();
                if (e) {
                  _y = e.pageY - _rect.top;
                } else if (typeof alpha === 'number') {
                  _y = _height - (alpha * _height);
                } else if (typeof offset === 'number') {
                  _y = this.selection.y + offset;
                } else {
                  _y = this.selection.y;
                }
                _y = this.selection.y = Math.max(0, Math.min(_height, _y));
                _alpha = 1 - (_y / _height);
                this.selection.alpha = (Math.round(_alpha * 100)) / 100;
                if (_smartColor = this.selection.color) {
                  _RGBAArray = _smartColor.toRGBAArray();
                  _RGBAArray[3] = this.selection.alpha;
                  this.selection.color = colorPicker.SmartColor.RGBAArray(_RGBAArray);
                  Alpha.emitColorChanged();
                } else {
                  this.selection.color = colorPicker.SmartColor.RGBAArray([255, 0, 0, this.selection.alpha]);
                }
                _position = {
                  y: Math.max(3, Math.min(_height - 6, _y))
                };
                this.updateControlPosition(_position.y);
                return Alpha.emitSelectionChanged();
              },
              refreshSelection: function() {
                return this.setSelection();
              }
            };
            _this.control.refreshSelection();
            colorPicker.onInputColor(function(smartColor) {
              return _this.control.setSelection(null, smartColor.getAlpha());
            });
            colorPicker.onOpen(function() {
              return _this.control.isGrabbing = false;
            });
            colorPicker.onClose(function() {
              return _this.control.isGrabbing = false;
            });
            Saturation.onColorChanged(function(smartColor) {
              _this.control.selection.color = smartColor;
              return _this.control.refreshSelection();
            });
            colorPicker.onMouseDown(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Alpha.element.el, e.target))) {
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
              if (!(isOnPicker && hasChild(Alpha.element.el, e.target))) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9leHRlbnNpb25zL0FscGhhLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUtJO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFdBQUQsR0FBQTtXQUNiO0FBQUEsTUFBQSxPQUFBLEVBQVMsQ0FBQyxPQUFBLENBQVEsb0JBQVIsQ0FBRCxDQUFBLENBQUEsQ0FBVDtBQUFBLE1BRUEsT0FBQSxFQUFTLElBRlQ7QUFBQSxNQUdBLE9BQUEsRUFBUyxJQUhUO0FBQUEsTUFJQSxNQUFBLEVBQVEsSUFKUjtBQUFBLE1BVUEsb0JBQUEsRUFBc0IsU0FBQSxHQUFBO2VBQ2xCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGtCQUFkLEVBQWtDLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBM0MsRUFEa0I7TUFBQSxDQVZ0QjtBQUFBLE1BWUEsa0JBQUEsRUFBb0IsU0FBQyxRQUFELEdBQUE7ZUFDaEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksa0JBQVosRUFBZ0MsUUFBaEMsRUFEZ0I7TUFBQSxDQVpwQjtBQUFBLE1BZ0JBLGdCQUFBLEVBQWtCLFNBQUEsR0FBQTtlQUNkLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGNBQWQsRUFBOEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBakQsRUFEYztNQUFBLENBaEJsQjtBQUFBLE1Ba0JBLGNBQUEsRUFBZ0IsU0FBQyxRQUFELEdBQUE7ZUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxjQUFaLEVBQTRCLFFBQTVCLEVBRFk7TUFBQSxDQWxCaEI7QUFBQSxNQXdCQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sWUFBQSxJQUFBO0FBQUEsUUFBQSxJ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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/extensions/Alpha.coffee

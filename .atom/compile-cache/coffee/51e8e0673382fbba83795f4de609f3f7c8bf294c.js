(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitOutputFormat: function(format) {
        return this.Emitter.emit('outputFormat', format);
      },
      onOutputFormat: function(callback) {
        return this.Emitter.on('outputFormat', callback);
      },
      activate: function() {
        var hasChild, _isClicking;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-color");
            return _el;
          })(),
          addClass: function(className) {
            this.el.classList.add(className);
            return this;
          },
          removeClass: function(className) {
            this.el.classList.remove(className);
            return this;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          },
          previousColor: null,
          setColor: function(smartColor) {
            var _color;
            _color = smartColor.toRGBA();
            if (this.previousColor && this.previousColor === _color) {
              return;
            }
            this.el.style.backgroundColor = _color;
            return this.previousColor = _color;
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            var _newHeight;
            _newHeight = colorPicker.element.height() + _this.element.height();
            return colorPicker.element.setHeight(_newHeight);
          };
        })(this));
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
        _isClicking = false;
        colorPicker.onMouseDown((function(_this) {
          return function(e, isOnPicker) {
            if (!(isOnPicker && hasChild(_this.element.el, e.target))) {
              return;
            }
            e.preventDefault();
            return _isClicking = true;
          };
        })(this));
        colorPicker.onMouseMove(function(e) {
          return _isClicking = false;
        });
        colorPicker.onMouseUp((function(_this) {
          return function(e) {
            if (!_isClicking) {
              return;
            }
            colorPicker.replace(_this.color);
            return colorPicker.element.close();
          };
        })(this));
        colorPicker.onKeyDown((function(_this) {
          return function(e) {
            if (e.which !== 13) {
              return;
            }
            e.stopPropagation();
            return colorPicker.replace(_this.color);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha;
            Alpha = colorPicker.getExtension('Alpha');
            Alpha.onColorChanged(function(smartColor) {
              _this.element.setColor((function() {
                if (smartColor) {
                  return smartColor;
                } else {
                  return colorPicker.SmartColor.HEX('#f00');
                }
              })());
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha, Format, Return, setColor, _currentColor, _formatFormat, _inputColor, _text;
            Alpha = colorPicker.getExtension('Alpha');
            Return = colorPicker.getExtension('Return');
            Format = colorPicker.getExtension('Format');
            _text = document.createElement('p');
            _text.classList.add("" + _this.element.el.className + "-text");
            colorPicker.onBeforeOpen(function() {
              return _this.color = null;
            });
            _inputColor = null;
            colorPicker.onInputColor(function(smartColor, wasFound) {
              return _inputColor = wasFound ? smartColor : null;
            });
            _formatFormat = null;
            Format.onFormatChanged(function(format) {
              return _formatFormat = format;
            });
            colorPicker.onInputColor(function() {
              return _formatFormat = null;
            });
            setColor = function(smartColor) {
              var _format, _function, _outputColor, _preferredFormat;
              _preferredFormat = atom.config.get('color-picker.preferredFormat');
              _format = _formatFormat || (_inputColor != null ? _inputColor.format : void 0) || _preferredFormat || 'RGB';
              _function = smartColor.getAlpha() < 1 ? smartColor["to" + _format + "A"] || smartColor["to" + _format] : smartColor["to" + _format];
              _outputColor = (function() {
                if (_inputColor && (_inputColor.format === _format || _inputColor.format === ("" + _format + "A"))) {
                  if (smartColor.equals(_inputColor)) {
                    return _inputColor.value;
                  }
                }
                return _function.call(smartColor);
              })();
              if (_outputColor === _this.color) {
                return;
              }
              if (_inputColor && atom.config.get('color-picker.automaticReplace')) {
                colorPicker.replace(_outputColor);
              }
              _this.color = _outputColor;
              _text.innerText = _outputColor;
              return _this.emitOutputFormat(_format);
            };
            _currentColor = null;
            Alpha.onColorChanged(function(smartColor) {
              setColor(_currentColor = (function() {
                if (smartColor) {
                  return smartColor;
                } else {
                  return colorPicker.SmartColor.HEX('#f00');
                }
              })());
            });
            Format.onFormatChanged(function() {
              return setColor(_currentColor);
            });
            Return.onVisibility(function(visibility) {
              if (visibility) {
                return _this.element.addClass('is--returnVisible');
              } else {
                return _this.element.removeClass('is--returnVisible');
              }
            });
            return _this.element.add(_text);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9leHRlbnNpb25zL0NvbG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUtJO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFdBQUQsR0FBQTtXQUNiO0FBQUEsTUFBQSxPQUFBLEVBQVMsQ0FBQyxPQUFBLENBQVEsb0JBQVIsQ0FBRCxDQUFBLENBQUEsQ0FBVDtBQUFBLE1BRUEsT0FBQSxFQUFTLElBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxJQUhQO0FBQUEsTUFTQSxnQkFBQSxFQUFrQixTQUFDLE1BQUQsR0FBQTtlQUNkLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGNBQWQsRUFBOEIsTUFBOUIsRUFEYztNQUFBLENBVGxCO0FBQUEsTUFXQSxjQUFBLEVBQWdCLFNBQUMsUUFBRCxHQUFBO2VBQ1osSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksY0FBWixFQUE0QixRQUE1QixFQURZO01BQUEsQ0FYaEI7QUFBQSxNQWlCQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sWUFBQSxxQkFBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FDSTtBQUFBLFVBQUEsRUFBQSxFQUFPLENBQUEsU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsaUJBQUE7QUFBQSxZQUFBLFlBQUEsR0FBZSxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUF0QyxDQUFBO0FBQUEsWUFDQSxHQUFBLEdBQU0sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FETixDQUFBO0FBQUEsWUFFQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsRUFBQSxHQUFyQyxZQUFxQyxHQUFrQixRQUFwQyxDQUZBLENBQUE7QUFJQSxtQkFBTyxHQUFQ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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/extensions/Color.coffee

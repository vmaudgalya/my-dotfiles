(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitVisibility: function(visible) {
        if (visible == null) {
          visible = true;
        }
        return this.Emitter.emit('visible', visible);
      },
      onVisibility: function(callback) {
        return this.Emitter.on('visible', callback);
      },
      activate: function() {
        var View, hasChild, _isClicking;
        View = this;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-return");
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
          hasClass: function(className) {
            return this.el.classList.contains(className);
          },
          hide: function() {
            this.removeClass('is--visible');
            return View.emitVisibility(false);
          },
          show: function() {
            this.addClass('is--visible');
            return View.emitVisibility(true);
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          },
          setColor: function(smartColor) {
            return this.el.style.backgroundColor = smartColor.toRGBA();
          }
        };
        colorPicker.element.add(this.element.el);
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
            if (!(_isClicking && _this.color)) {
              return;
            }
            return colorPicker.emitInputColor(_this.color);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha;
            Alpha = colorPicker.getExtension('Alpha');
            colorPicker.onBeforeOpen(function() {
              return _this.color = null;
            });
            colorPicker.onInputColor(function(smartColor, wasFound) {
              if (wasFound) {
                return _this.color = smartColor;
              }
            });
            Alpha.onColorChanged(function(smartColor) {
              if (!_this.color) {
                return _this.element.hide();
              }
              if (smartColor.equals(_this.color)) {
                return _this.element.hide();
              } else {
                return _this.element.show();
              }
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            colorPicker.onInputColor(function(smartColor, wasFound) {
              if (wasFound) {
                return _this.element.setColor(smartColor);
              }
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var setColor, _text;
            _text = document.createElement('p');
            _text.classList.add("" + _this.element.el.className + "-text");
            setColor = function(smartColor) {
              return _text.innerText = smartColor.value;
            };
            colorPicker.onInputColor(function(smartColor, wasFound) {
              if (wasFound) {
                return setColor(smartColor);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9leHRlbnNpb25zL1JldHVybi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFNSTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxXQUFELEdBQUE7V0FDYjtBQUFBLE1BQUEsT0FBQSxFQUFTLENBQUMsT0FBQSxDQUFRLG9CQUFSLENBQUQsQ0FBQSxDQUFBLENBQVQ7QUFBQSxNQUVBLE9BQUEsRUFBUyxJQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sSUFIUDtBQUFBLE1BU0EsY0FBQSxFQUFnQixTQUFDLE9BQUQsR0FBQTs7VUFBQyxVQUFRO1NBQ3JCO2VBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsU0FBZCxFQUF5QixPQUF6QixFQURZO01BQUEsQ0FUaEI7QUFBQSxNQVdBLFlBQUEsRUFBYyxTQUFDLFFBQUQsR0FBQTtlQUNWLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFNBQVosRUFBdUIsUUFBdkIsRUFEVTtNQUFBLENBWGQ7QUFBQSxNQWlCQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sWUFBQSwyQkFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLE9BQUQsR0FDSTtBQUFBLFVBQUEsRUFBQSxFQUFPLENBQUEsU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsaUJBQUE7QUFBQSxZQUFBLFlBQUEsR0FBZSxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUF0QyxDQUFBO0FBQUEsWUFDQSxHQUFBLEdBQU0sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FETixDQUFBO0FBQUEsWUFFQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsRUFBQSxHQUFy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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/extensions/Return.coffee

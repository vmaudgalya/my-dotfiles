(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitFormatChanged: function(format) {
        return this.Emitter.emit('formatChanged', format);
      },
      onFormatChanged: function(callback) {
        return this.Emitter.on('formatChanged', callback);
      },
      activate: function() {
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-format");
            return _el;
          })(),
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            var Color, _activeButton, _buttons, _format, _i, _len, _ref, _results;
            Color = colorPicker.getExtension('Color');
            _buttons = [];
            _activeButton = null;
            colorPicker.onBeforeOpen(function() {
              var _button, _i, _len, _results;
              _results = [];
              for (_i = 0, _len = _buttons.length; _i < _len; _i++) {
                _button = _buttons[_i];
                _results.push(_button.deactivate());
              }
              return _results;
            });
            Color.onOutputFormat(function(format) {
              var _button, _i, _len, _results;
              _results = [];
              for (_i = 0, _len = _buttons.length; _i < _len; _i++) {
                _button = _buttons[_i];
                if (format === _button.format || format === ("" + _button.format + "A")) {
                  _button.activate();
                  _results.push(_activeButton = _button);
                } else {
                  _results.push(_button.deactivate());
                }
              }
              return _results;
            });
            _ref = ['RGB', 'HEX', 'HSL', 'HSV', 'VEC'];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              _format = _ref[_i];
              _results.push((function(_format) {
                var Format, hasChild, _button, _isClicking;
                Format = _this;
                _button = {
                  el: (function() {
                    var _el;
                    _el = document.createElement('button');
                    _el.classList.add("" + Format.element.el.className + "-button");
                    _el.innerHTML = _format;
                    return _el;
                  })(),
                  format: _format,
                  addClass: function(className) {
                    this.el.classList.add(className);
                    return this;
                  },
                  removeClass: function(className) {
                    this.el.classList.remove(className);
                    return this;
                  },
                  activate: function() {
                    return this.addClass('is--active');
                  },
                  deactivate: function() {
                    return this.removeClass('is--active');
                  }
                };
                _buttons.push(_button);
                if (!_activeButton) {
                  if (_format === atom.config.get('color-picker.preferredFormat')) {
                    _activeButton = _button;
                    _button.activate();
                  }
                }
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
                colorPicker.onMouseDown(function(e, isOnPicker) {
                  if (!(isOnPicker && hasChild(_button.el, e.target))) {
                    return;
                  }
                  e.preventDefault();
                  return _isClicking = true;
                });
                colorPicker.onMouseMove(function(e) {
                  return _isClicking = false;
                });
                colorPicker.onMouseUp(function(e) {
                  if (!_isClicking) {
                    return;
                  }
                  if (_activeButton) {
                    _activeButton.deactivate();
                  }
                  _button.activate();
                  _activeButton = _button;
                  return _this.emitFormatChanged(_format);
                });
                return _this.element.add(_button.el);
              })(_format));
            }
            return _results;
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9leHRlbnNpb25zL0Zvcm1hdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFLSTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxXQUFELEdBQUE7V0FDYjtBQUFBLE1BQUEsT0FBQSxFQUFTLENBQUMsT0FBQSxDQUFRLG9CQUFSLENBQUQsQ0FBQSxDQUFBLENBQVQ7QUFBQSxNQUVBLE9BQUEsRUFBUyxJQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sSUFIUDtBQUFBLE1BU0EsaUJBQUEsRUFBbUIsU0FBQyxNQUFELEdBQUE7ZUFDZixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxlQUFkLEVBQStCLE1BQS9CLEVBRGU7TUFBQSxDQVRuQjtBQUFBLE1BV0EsZUFBQSxFQUFpQixTQUFDLFFBQUQsR0FBQTtlQUNiLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGVBQVosRUFBNkIsUUFBN0IsRUFEYTtNQUFBLENBWGpCO0FBQUEsTUFpQkEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNOLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FDSTtBQUFBLFVBQUEsRUFBQSxFQUFPLENBQUEsU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsaUJBQUE7QUFBQSxZQUFBLFlBQUEsR0FBZSxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUF0QyxDQUFBO0FBQUEsWUFDQSxHQUFBLEdBQU0sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FETixDQUFBO0FBQUEsWUFFQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsRUFBQSxHQUFyQyxZQUFxQyxHQUFrQixTQUFwQyxDQUZBLENBQUE7QUFJQSxtQkFBTyxHQUFQLENBTEc7VUFBQSxDQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/extensions/Format.coffee

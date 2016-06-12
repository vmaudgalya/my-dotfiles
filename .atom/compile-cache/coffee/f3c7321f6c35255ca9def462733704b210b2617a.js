(function() {
  module.exports = function(colorPicker) {
    return {
      element: null,
      pointer: null,
      activate: function() {
        var hasChild, _isClicking;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-definition");
            return _el;
          })(),
          height: function() {
            return this.el.offsetHeight;
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
        setTimeout((function(_this) {
          return function() {
            var $colorPicker, Arrow;
            Arrow = colorPicker.getExtension('Arrow');
            $colorPicker = colorPicker.element;
            colorPicker.onInputVariable(function() {
              var onClose, _newHeight, _oldHeight;
              _oldHeight = $colorPicker.height();
              $colorPicker.addClass('view--definition');
              _newHeight = _this.element.height() + Arrow.element.height();
              $colorPicker.setHeight(_newHeight);
              _this.element.setColor(colorPicker.SmartColor.RGBAArray([0, 0, 0, 0]));
              onClose = function() {
                var onTransitionEnd;
                colorPicker.canOpen = false;
                onTransitionEnd = function() {
                  $colorPicker.setHeight(_oldHeight);
                  $colorPicker.el.removeEventListener('transitionend', onTransitionEnd);
                  $colorPicker.removeClass('view--definition');
                  return colorPicker.canOpen = true;
                };
                $colorPicker.el.addEventListener('transitionend', onTransitionEnd);
                return colorPicker.Emitter.off('close', onClose);
              };
              return colorPicker.onClose(onClose);
            });
            colorPicker.onInputColor(function() {
              return $colorPicker.removeClass('view--definition');
            });
          };
        })(this));
        colorPicker.onInputVariableColor((function(_this) {
          return function(smartColor) {
            if (!smartColor) {
              return;
            }
            return _this.element.setColor(smartColor);
          };
        })(this));
        colorPicker.onInputVariableColor((function(_this) {
          return function() {
            var pointer;
            pointer = arguments[arguments.length - 1];
            return _this.pointer = pointer;
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
            if (!(_isClicking && _this.pointer)) {
              return;
            }
            atom.workspace.open(_this.pointer.filePath).then(function() {
              var Editor;
              Editor = atom.workspace.getActiveTextEditor();
              Editor.clearSelections();
              Editor.setSelectedBufferRange(_this.pointer.range);
              Editor.scrollToCursorPosition();
              return colorPicker.close();
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _definition;
            _definition = document.createElement('p');
            _definition.classList.add("" + _this.element.el.className + "-definition");
            colorPicker.onInputVariable(function() {
              return _definition.innerText = '';
            });
            colorPicker.onInputVariableColor(function(color) {
              if (color) {
                return _definition.innerText = color.value;
              } else {
                return _definition.innerText = 'No color found.';
              }
            });
            return _this.element.add(_definition);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _variable;
            _variable = document.createElement('p');
            _variable.classList.add("" + _this.element.el.className + "-variable");
            colorPicker.onInputVariable(function(match) {
              return _variable.innerText = match.match;
            });
            return _this.element.add(_variable);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9leHRlbnNpb25zL0RlZmluaXRpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBS0k7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsV0FBRCxHQUFBO1dBQ2I7QUFBQSxNQUFBLE9BQUEsRUFBUyxJQUFUO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtBQUFBLE1BTUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNOLFlBQUEscUJBQUE7QUFBQSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQ0k7QUFBQSxVQUFBLEVBQUEsRUFBTyxDQUFBLFNBQUEsR0FBQTtBQUNILGdCQUFBLGlCQUFBO0FBQUEsWUFBQSxZQUFBLEdBQWUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBdEMsQ0FBQTtBQUFBLFlBQ0EsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRE4sQ0FBQTtBQUFBLFlBRUEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQWtCLEVBQUEsR0FBckMsWUFBcUMsR0FBa0IsYUFBcEMsQ0FGQSxDQUFBO0FBSUEsbUJBQU8sR0FBUCxDQUxHO1VBQUEsQ0FBQSxDQUFILENBQUEsQ0FBSjtBQUFBLFVBT0EsTUFBQSxFQUFRLFNBQUEsR0FBQTttQkFBRyxJQUFDLENBQUEsRUFBRSxDQUFDLGFBQVA7VUFBQSxDQVBSO0FBQUEsVUFVQSxHQUFBLEVBQUssU0FBQyxPQUFELEdBQUE7QUFDRCxZQUFBLElBQUMsQ0FBQSxFQUFFLENBQUMsV0FBSixDQUFnQixPQUFoQixDQUFBLENBQUE7QUFDQSxtQkFBTyxJQUFQLENBRkM7VUFBQSxDQVZMO0FBQUEsVUFlQSxRQUFBLEVBQVUsU0FBQyxVQUFELEdBQUE7bUJBQ04s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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/extensions/Definition.coffee

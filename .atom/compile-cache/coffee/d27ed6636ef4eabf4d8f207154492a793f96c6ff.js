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
                colorPicker.canOpen = true;
                $colorPicker.setHeight(_oldHeight);
                $colorPicker.removeClass('view--definition');
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

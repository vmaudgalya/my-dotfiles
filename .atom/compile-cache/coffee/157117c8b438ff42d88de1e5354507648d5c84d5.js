(function() {
  module.exports = function(colorPicker) {
    return {
      element: null,
      activate: function() {
        var _halfArrowWidth;
        _halfArrowWidth = null;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-arrow");
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
          width: function() {
            return this.el.offsetWidth;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          setPosition: function(x) {
            this.el.style.left = "" + x + "px";
            return this;
          },
          previousColor: null,
          setColor: function(smartColor) {
            var _color;
            _color = (typeof smartColor.toRGBA === "function" ? smartColor.toRGBA() : void 0) || 'none';
            if (this.previousColor && this.previousColor === _color) {
              return;
            }
            this.el.style.borderTopColor = _color;
            this.el.style.borderBottomColor = _color;
            return this.previousColor = _color;
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            return _halfArrowWidth = (_this.element.width() / 2) << 0;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _newHeight;
            _newHeight = colorPicker.element.height() + _this.element.height();
            return colorPicker.element.setHeight(_newHeight);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha;
            Alpha = colorPicker.getExtension('Alpha');
            Alpha.onColorChanged(function(smartColor) {
              if (smartColor) {
                return _this.element.setColor(smartColor);
              } else {
                return colorPicker.SmartColor.HEX('#f00');
              }
            });
          };
        })(this));
        colorPicker.onInputVariable((function(_this) {
          return function() {
            return _this.element.setColor(colorPicker.SmartColor.RGBAArray([0, 0, 0, 0]));
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
        colorPicker.onPositionChange((function(_this) {
          return function(position, colorPickerPosition) {
            return _this.element.setPosition(position.x - colorPickerPosition.x);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9leHRlbnNpb25zL0Fycm93LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUtJO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFdBQUQsR0FBQTtXQUNiO0FBQUEsTUFBQSxPQUFBLEVBQVMsSUFBVDtBQUFBLE1BS0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNOLFlBQUEsZUFBQTtBQUFBLFFBQUEsZUFBQSxHQUFrQixJQUFsQixDQUFBO0FBQUEsUUFJQSxJQUFDLENBQUEsT0FBRCxHQUNJO0FBQUEsVUFBQSxFQUFBLEVBQU8sQ0FBQSxTQUFBLEdBQUE7QUFDSCxnQkFBQSxpQkFBQTtBQUFBLFlBQUEsWUFBQSxHQUFlLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQXRDLENBQUE7QUFBQSxZQUNBLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUROLENBQUE7QUFBQSxZQUVBLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixFQUFBLEdBQXJDLFlBQXFDLEdBQWtCLFFBQXBDLENBRkEsQ0FBQTtBQUlBLG1CQUFPLEdBQVAsQ0FMRztVQUFBLENBQUEsQ0FBSCxDQUFBLENBQUo7QUFBQSxVQU9BLFFBQUEsRUFBVSxTQUFDLFNBQUQsR0FBQTtBQUFlLFlBQUEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixTQUFsQixDQUFBLENBQUE7QUFBNkIsbUJBQU8sSUFBUCxDQUE1QztVQUFBLENBUFY7QUFBQSxVQVFBLFdBQUEsRUFBYSxTQUFDLFNBQUQsR0FBQTtBQUFlLFlBQUEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBZCxDQUFxQixTQUFyQixDQUFBLENB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/extensions/Arrow.coffee

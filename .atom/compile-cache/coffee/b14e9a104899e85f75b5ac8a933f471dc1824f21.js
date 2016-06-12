(function() {
  module.exports = function(colorPicker) {
    return {
      element: null,
      activate: function() {
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-body");
            return _el;
          })(),
          height: function() {
            return this.el.offsetHeight;
          },
          add: function(element, weight) {
            if (weight) {
              if (weight > this.el.children.length) {
                this.el.appendChild(element);
              } else {
                this.el.insertBefore(element, this.el.children[weight]);
              }
            } else {
              this.el.appendChild(element);
            }
            return this;
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
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9leHRlbnNpb25zL0JvZHkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBS0k7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsV0FBRCxHQUFBO1dBQ2I7QUFBQSxNQUFBLE9BQUEsRUFBUyxJQUFUO0FBQUEsTUFLQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sUUFBQSxJQUFDLENBQUEsT0FBRCxHQUNJO0FBQUEsVUFBQSxFQUFBLEVBQU8sQ0FBQSxTQUFBLEdBQUE7QUFDSCxnQkFBQSxpQkFBQTtBQUFBLFlBQUEsWUFBQSxHQUFlLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQXRDLENBQUE7QUFBQSxZQUNBLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUROLENBQUE7QUFBQSxZQUVBLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixFQUFBLEdBQXJDLFlBQXFDLEdBQWtCLE9BQXBDLENBRkEsQ0FBQTtBQUlBLG1CQUFPLEdBQVAsQ0FMRztVQUFBLENBQUEsQ0FBSCxDQUFBLENBQUo7QUFBQSxVQU9BLE1BQUEsRUFBUSxTQUFBLEdBQUE7bUJBQUcsSUFBQyxDQUFBLEVBQUUsQ0FBQyxhQUFQO1VBQUEsQ0FQUjtBQUFBLFVBVUEsR0FBQSxFQUFLLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNELFlBQUEsSUFBRyxNQUFIO0FBQ0ksY0FBQSxJQUFHLE1BQUEsR0FBUyxJQUFDLENBQUEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUF6QjtBQUNJLGdCQUFBLElBQUMsQ0FBQSxFQUFFLENBQUMsV0FBSixDQUFnQixPQUFoQixDQUFBLENBREo7ZUFBQSxNQUFBO0FBRUssZ0JBQUEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxZQUFKLENBQWlCLE9BQWpCLEVBQTBCLElBQUMsQ0FBQSxFQUFFLENBQUMsUUFBUyxDQUFBLE1BQUEsQ0FBdkMsQ0FBQSxDQUZMO2VBREo7YUFBQSxNQUFBO0FBSUssY0FBQSxJQUFDLENBQUEsRUFBRSxDQUFDLFdBQUosQ0FBZ0IsT0FBaEIsQ0FBQSxDQUpMO2FBQUE7QUFNQSxtQkFBTyxJQUFQLENBUEM7VUFBQSxDQVZMO1NBREosQ0FBQTtBQUFBLFFBbUJBLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBcEIsQ0FBd0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFqQyxDQW5CQSxDQUFBO0FBQUEsUUF1QkEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsVUFBQTtBQUFBLFlBQUEsVUFBQSxHQUFhLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBcEIsQ0FBQSxDQUFBLEdBQStCLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFBLENBQTVDLENBQUE7bUJBQ0EsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFwQixDQUE4QixVQUE5QixFQUZPO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxDQXZCQSxDQUFBO0FBMkJBLGVBQU8sSUFBUCxDQTVCTTtNQUFBLENBTFY7TUFEYTtFQUFBLENBQWpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/extensions/Body.coffee

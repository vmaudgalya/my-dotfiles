(function() {
  var DotRenderer, SquareDotRenderer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  DotRenderer = require('./dot');

  module.exports = SquareDotRenderer = (function(_super) {
    __extends(SquareDotRenderer, _super);

    function SquareDotRenderer() {
      return SquareDotRenderer.__super__.constructor.apply(this, arguments);
    }

    SquareDotRenderer.prototype.render = function(colorMarker) {
      var properties;
      properties = SquareDotRenderer.__super__.render.apply(this, arguments);
      properties["class"] += ' square';
      return properties;
    };

    return SquareDotRenderer;

  })(DotRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9zcXVhcmUtZG90LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxPQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix3Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsZ0NBQUEsTUFBQSxHQUFRLFNBQUMsV0FBRCxHQUFBO0FBQ04sVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsK0NBQUEsU0FBQSxDQUFiLENBQUE7QUFBQSxNQUNBLFVBQVUsQ0FBQyxPQUFELENBQVYsSUFBb0IsU0FEcEIsQ0FBQTthQUVBLFdBSE07SUFBQSxDQUFSLENBQUE7OzZCQUFBOztLQUQ4QixZQUhoQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/square-dot.coffee

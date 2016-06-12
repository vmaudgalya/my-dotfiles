(function() {
  var BackgroundRenderer, RegionRenderer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RegionRenderer = require('./region-renderer');

  module.exports = BackgroundRenderer = (function(_super) {
    __extends(BackgroundRenderer, _super);

    function BackgroundRenderer() {
      return BackgroundRenderer.__super__.constructor.apply(this, arguments);
    }

    BackgroundRenderer.prototype.includeTextInRegion = true;

    BackgroundRenderer.prototype.render = function(colorMarker) {
      var color, colorText, l, region, regions, _i, _len;
      color = colorMarker != null ? colorMarker.color : void 0;
      if (color == null) {
        return {};
      }
      regions = this.renderRegions(colorMarker);
      l = color.luma;
      colorText = l > 0.43 ? 'black' : 'white';
      for (_i = 0, _len = regions.length; _i < _len; _i++) {
        region = regions[_i];
        if (region != null) {
          this.styleRegion(region, color.toCSS(), colorText);
        }
      }
      return {
        regions: regions
      };
    };

    BackgroundRenderer.prototype.styleRegion = function(region, color, textColor) {
      region.classList.add('background');
      region.style.backgroundColor = color;
      return region.style.color = textColor;
    };

    return BackgroundRenderer;

  })(RegionRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9iYWNrZ3JvdW5kLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsaUNBQUEsbUJBQUEsR0FBcUIsSUFBckIsQ0FBQTs7QUFBQSxpQ0FDQSxNQUFBLEdBQVEsU0FBQyxXQUFELEdBQUE7QUFDTixVQUFBLDhDQUFBO0FBQUEsTUFBQSxLQUFBLHlCQUFRLFdBQVcsQ0FBRSxjQUFyQixDQUFBO0FBRUEsTUFBQSxJQUFpQixhQUFqQjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BRkE7QUFBQSxNQUlBLE9BQUEsR0FBVSxJQUFDLENBQUEsYUFBRCxDQUFlLFdBQWYsQ0FKVixDQUFBO0FBQUEsTUFNQSxDQUFBLEdBQUksS0FBSyxDQUFDLElBTlYsQ0FBQTtBQUFBLE1BUUEsU0FBQSxHQUFlLENBQUEsR0FBSSxJQUFQLEdBQWlCLE9BQWpCLEdBQThCLE9BUjFDLENBQUE7QUFTQSxXQUFBLDhDQUFBOzZCQUFBO1lBQTBFO0FBQTFFLFVBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBQXFCLEtBQUssQ0FBQyxLQUFOLENBQUEsQ0FBckIsRUFBb0MsU0FBcEMsQ0FBQTtTQUFBO0FBQUEsT0FUQTthQVVBO0FBQUEsUUFBQyxTQUFBLE9BQUQ7UUFYTTtJQUFBLENBRFIsQ0FBQTs7QUFBQSxpQ0FjQSxXQUFBLEdBQWEsU0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixTQUFoQixHQUFBO0FBQ1gsTUFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQWpCLENBQXFCLFlBQXJCLENBQUEsQ0FBQTtBQUFBLE1BRUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFiLEdBQStCLEtBRi9CLENBQUE7YUFHQSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsR0FBcUIsVUFKVjtJQUFBLENBZGIsQ0FBQTs7OEJBQUE7O0tBRCtCLGVBSGpDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/background.coffee

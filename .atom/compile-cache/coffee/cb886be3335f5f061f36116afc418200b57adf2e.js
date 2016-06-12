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
      color = colorMarker.color.toCSS();
      regions = this.renderRegions(colorMarker);
      l = colorMarker.color.luma;
      colorText = l > 0.43 ? 'black' : 'white';
      for (_i = 0, _len = regions.length; _i < _len; _i++) {
        region = regions[_i];
        this.styleRegion(region, color, colorText);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9iYWNrZ3JvdW5kLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsaUNBQUEsbUJBQUEsR0FBcUIsSUFBckIsQ0FBQTs7QUFBQSxpQ0FDQSxNQUFBLEdBQVEsU0FBQyxXQUFELEdBQUE7QUFFTixVQUFBLDhDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFsQixDQUFBLENBQVIsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxhQUFELENBQWUsV0FBZixDQUZWLENBQUE7QUFBQSxNQUlBLENBQUEsR0FBSSxXQUFXLENBQUMsS0FBSyxDQUFDLElBSnRCLENBQUE7QUFBQSxNQU1BLFNBQUEsR0FBZSxDQUFBLEdBQUksSUFBUCxHQUFpQixPQUFqQixHQUE4QixPQU4xQyxDQUFBO0FBT0EsV0FBQSw4Q0FBQTs2QkFBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBQXFCLEtBQXJCLEVBQTRCLFNBQTVCLENBQUEsQ0FBQTtBQUFBLE9BUEE7YUFRQTtBQUFBLFFBQUMsU0FBQSxPQUFEO1FBVk07SUFBQSxDQURSLENBQUE7O0FBQUEsaUNBYUEsV0FBQSxHQUFhLFNBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsU0FBaEIsR0FBQTtBQUNYLE1BQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFqQixDQUFxQixZQUFyQixDQUFBLENBQUE7QUFBQSxNQUVBLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBYixHQUErQixLQUYvQixDQUFBO2FBR0EsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFiLEdBQXFCLFVBSlY7SUFBQSxDQWJiLENBQUE7OzhCQUFBOztLQUQrQixlQUhqQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/background.coffee

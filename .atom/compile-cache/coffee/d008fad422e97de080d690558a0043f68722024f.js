(function() {
  var OutlineRenderer, RegionRenderer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RegionRenderer = require('./region-renderer');

  module.exports = OutlineRenderer = (function(_super) {
    __extends(OutlineRenderer, _super);

    function OutlineRenderer() {
      return OutlineRenderer.__super__.constructor.apply(this, arguments);
    }

    OutlineRenderer.prototype.render = function(colorMarker) {
      var color, range, region, regions, rowSpan, _i, _len;
      range = colorMarker.getScreenRange();
      color = colorMarker.color;
      if (range.isEmpty() || (color == null)) {
        return {};
      }
      rowSpan = range.end.row - range.start.row;
      regions = this.renderRegions(colorMarker);
      for (_i = 0, _len = regions.length; _i < _len; _i++) {
        region = regions[_i];
        if (region != null) {
          this.styleRegion(region, color.toCSS());
        }
      }
      return {
        regions: regions
      };
    };

    OutlineRenderer.prototype.styleRegion = function(region, color) {
      region.classList.add('outline');
      return region.style.borderColor = color;
    };

    return OutlineRenderer;

  })(RegionRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9vdXRsaW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsOEJBQUEsTUFBQSxHQUFRLFNBQUMsV0FBRCxHQUFBO0FBQ04sVUFBQSxnREFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLFdBQVcsQ0FBQyxjQUFaLENBQUEsQ0FBUixDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVEsV0FBVyxDQUFDLEtBRHBCLENBQUE7QUFFQSxNQUFBLElBQWEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFBLElBQXVCLGVBQXBDO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FGQTtBQUFBLE1BSUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVixHQUFnQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBSnRDLENBQUE7QUFBQSxNQUtBLE9BQUEsR0FBVSxJQUFDLENBQUEsYUFBRCxDQUFlLFdBQWYsQ0FMVixDQUFBO0FBT0EsV0FBQSw4Q0FBQTs2QkFBQTtZQUErRDtBQUEvRCxVQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixFQUFxQixLQUFLLENBQUMsS0FBTixDQUFBLENBQXJCLENBQUE7U0FBQTtBQUFBLE9BUEE7YUFRQTtBQUFBLFFBQUMsU0FBQSxPQUFEO1FBVE07SUFBQSxDQUFSLENBQUE7O0FBQUEsOEJBV0EsV0FBQSxHQUFhLFNBQUMsTUFBRCxFQUFTLEtBQVQsR0FBQTtBQUNYLE1BQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFqQixDQUFxQixTQUFyQixDQUFBLENBQUE7YUFDQSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQWIsR0FBMkIsTUFGaEI7SUFBQSxDQVhiLENBQUE7OzJCQUFBOztLQUQ0QixlQUg5QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/outline.coffee

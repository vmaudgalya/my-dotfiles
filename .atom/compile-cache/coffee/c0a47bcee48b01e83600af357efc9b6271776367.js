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
      if (range.isEmpty()) {
        return [];
      }
      color = colorMarker.color.toCSS();
      rowSpan = range.end.row - range.start.row;
      regions = this.renderRegions(colorMarker);
      for (_i = 0, _len = regions.length; _i < _len; _i++) {
        region = regions[_i];
        this.styleRegion(region, color);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy9vdXRsaW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsOEJBQUEsTUFBQSxHQUFRLFNBQUMsV0FBRCxHQUFBO0FBQ04sVUFBQSxnREFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLFdBQVcsQ0FBQyxjQUFaLENBQUEsQ0FBUixDQUFBO0FBQ0EsTUFBQSxJQUFhLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBYjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BREE7QUFBQSxNQUdBLEtBQUEsR0FBUSxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQWxCLENBQUEsQ0FIUixDQUFBO0FBQUEsTUFLQSxPQUFBLEdBQVUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFWLEdBQWdCLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FMdEMsQ0FBQTtBQUFBLE1BTUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxhQUFELENBQWUsV0FBZixDQU5WLENBQUE7QUFRQSxXQUFBLDhDQUFBOzZCQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFBcUIsS0FBckIsQ0FBQSxDQUFBO0FBQUEsT0FSQTthQVNBO0FBQUEsUUFBQyxTQUFBLE9BQUQ7UUFWTTtJQUFBLENBQVIsQ0FBQTs7QUFBQSw4QkFZQSxXQUFBLEdBQWEsU0FBQyxNQUFELEVBQVMsS0FBVCxHQUFBO0FBQ1gsTUFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQWpCLENBQXFCLFNBQXJCLENBQUEsQ0FBQTthQUNBLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBYixHQUEyQixNQUZoQjtJQUFBLENBWmIsQ0FBQTs7MkJBQUE7O0tBRDRCLGVBSDlCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/outline.coffee

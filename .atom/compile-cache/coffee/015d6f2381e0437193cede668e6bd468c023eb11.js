(function() {
  var RegionRenderer, UnderlineRenderer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RegionRenderer = require('./region-renderer');

  module.exports = UnderlineRenderer = (function(_super) {
    __extends(UnderlineRenderer, _super);

    function UnderlineRenderer() {
      return UnderlineRenderer.__super__.constructor.apply(this, arguments);
    }

    UnderlineRenderer.prototype.render = function(colorMarker) {
      var color, region, regions, _i, _len;
      color = colorMarker != null ? colorMarker.color : void 0;
      if (color == null) {
        return {};
      }
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

    UnderlineRenderer.prototype.styleRegion = function(region, color) {
      region.classList.add('underline');
      return region.style.backgroundColor = color;
    };

    return UnderlineRenderer;

  })(RegionRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy91bmRlcmxpbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxnQ0FBQSxNQUFBLEdBQVEsU0FBQyxXQUFELEdBQUE7QUFDTixVQUFBLGdDQUFBO0FBQUEsTUFBQSxLQUFBLHlCQUFRLFdBQVcsQ0FBRSxjQUFyQixDQUFBO0FBQ0EsTUFBQSxJQUFpQixhQUFqQjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BREE7QUFBQSxNQUdBLE9BQUEsR0FBVSxJQUFDLENBQUEsYUFBRCxDQUFlLFdBQWYsQ0FIVixDQUFBO0FBS0EsV0FBQSw4Q0FBQTs2QkFBQTtZQUErRDtBQUEvRCxVQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixFQUFxQixLQUFLLENBQUMsS0FBTixDQUFBLENBQXJCLENBQUE7U0FBQTtBQUFBLE9BTEE7YUFNQTtBQUFBLFFBQUMsU0FBQSxPQUFEO1FBUE07SUFBQSxDQUFSLENBQUE7O0FBQUEsZ0NBU0EsV0FBQSxHQUFhLFNBQUMsTUFBRCxFQUFTLEtBQVQsR0FBQTtBQUNYLE1BQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFqQixDQUFxQixXQUFyQixDQUFBLENBQUE7YUFFQSxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWIsR0FBK0IsTUFIcEI7SUFBQSxDQVRiLENBQUE7OzZCQUFBOztLQUQ4QixlQUhoQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/underline.coffee

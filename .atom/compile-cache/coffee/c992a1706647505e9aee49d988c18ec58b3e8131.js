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
      color = colorMarker.color.toCSS();
      regions = this.renderRegions(colorMarker);
      for (_i = 0, _len = regions.length; _i < _len; _i++) {
        region = regions[_i];
        this.styleRegion(region, color);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlbmRlcmVycy91bmRlcmxpbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxnQ0FBQSxNQUFBLEdBQVEsU0FBQyxXQUFELEdBQUE7QUFDTixVQUFBLGdDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFsQixDQUFBLENBQVIsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLElBQUMsQ0FBQSxhQUFELENBQWUsV0FBZixDQURWLENBQUE7QUFHQSxXQUFBLDhDQUFBOzZCQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFBcUIsS0FBckIsQ0FBQSxDQUFBO0FBQUEsT0FIQTthQUlBO0FBQUEsUUFBQyxTQUFBLE9BQUQ7UUFMTTtJQUFBLENBQVIsQ0FBQTs7QUFBQSxnQ0FPQSxXQUFBLEdBQWEsU0FBQyxNQUFELEVBQVMsS0FBVCxHQUFBO0FBQ1gsTUFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQWpCLENBQXFCLFdBQXJCLENBQUEsQ0FBQTthQUVBLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBYixHQUErQixNQUhwQjtJQUFBLENBUGIsQ0FBQTs7NkJBQUE7O0tBRDhCLGVBSGhDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/renderers/underline.coffee

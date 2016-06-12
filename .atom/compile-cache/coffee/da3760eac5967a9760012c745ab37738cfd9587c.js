(function() {
  var Palette;

  module.exports = Palette = (function() {
    Palette.deserialize = function(state) {
      return new Palette(state.variables);
    };

    function Palette(variables) {
      this.variables = variables != null ? variables : [];
    }

    Palette.prototype.getTitle = function() {
      return 'Palette';
    };

    Palette.prototype.getURI = function() {
      return 'pigments://palette';
    };

    Palette.prototype.getIconName = function() {
      return "pigments";
    };

    Palette.prototype.sortedByColor = function() {
      return this.variables.slice().sort((function(_this) {
        return function(_arg, _arg1) {
          var a, b;
          a = _arg.color;
          b = _arg1.color;
          return _this.compareColors(a, b);
        };
      })(this));
    };

    Palette.prototype.sortedByName = function() {
      var collator;
      collator = new Intl.Collator("en-US", {
        numeric: true
      });
      return this.variables.slice().sort(function(_arg, _arg1) {
        var a, b;
        a = _arg.name;
        b = _arg1.name;
        return collator.compare(a, b);
      });
    };

    Palette.prototype.getColorsNames = function() {
      return this.variables.map(function(v) {
        return v.name;
      });
    };

    Palette.prototype.getColorsCount = function() {
      return this.variables.length;
    };

    Palette.prototype.eachColor = function(iterator) {
      var v, _i, _len, _ref, _results;
      _ref = this.variables;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _results.push(iterator(v));
      }
      return _results;
    };

    Palette.prototype.compareColors = function(a, b) {
      var aHue, aLightness, aSaturation, bHue, bLightness, bSaturation, _ref, _ref1;
      _ref = a.hsl, aHue = _ref[0], aSaturation = _ref[1], aLightness = _ref[2];
      _ref1 = b.hsl, bHue = _ref1[0], bSaturation = _ref1[1], bLightness = _ref1[2];
      if (aHue < bHue) {
        return -1;
      } else if (aHue > bHue) {
        return 1;
      } else if (aSaturation < bSaturation) {
        return -1;
      } else if (aSaturation > bSaturation) {
        return 1;
      } else if (aLightness < bLightness) {
        return -1;
      } else if (aLightness > bLightness) {
        return 1;
      } else {
        return 0;
      }
    };

    Palette.prototype.serialize = function() {
      return {
        deserializer: 'Palette',
        variables: this.variables
      };
    };

    return Palette;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BhbGV0dGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxPQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsS0FBRCxHQUFBO2FBQWUsSUFBQSxPQUFBLENBQVEsS0FBSyxDQUFDLFNBQWQsRUFBZjtJQUFBLENBQWQsQ0FBQTs7QUFFYSxJQUFBLGlCQUFFLFNBQUYsR0FBQTtBQUFpQixNQUFoQixJQUFDLENBQUEsZ0NBQUEsWUFBVSxFQUFLLENBQWpCO0lBQUEsQ0FGYjs7QUFBQSxzQkFJQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsVUFBSDtJQUFBLENBSlYsQ0FBQTs7QUFBQSxzQkFNQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQUcscUJBQUg7SUFBQSxDQU5SLENBQUE7O0FBQUEsc0JBUUEsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUFHLFdBQUg7SUFBQSxDQVJiLENBQUE7O0FBQUEsc0JBVUEsYUFBQSxHQUFlLFNBQUEsR0FBQTthQUNiLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxFQUFZLEtBQVosR0FBQTtBQUEwQixjQUFBLElBQUE7QUFBQSxVQUFsQixJQUFQLEtBQUMsS0FBd0IsQ0FBQTtBQUFBLFVBQVAsSUFBUCxNQUFDLEtBQWEsQ0FBQTtpQkFBQSxLQUFDLENBQUEsYUFBRCxDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBMUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQURhO0lBQUEsQ0FWZixDQUFBOztBQUFBLHNCQWFBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixVQUFBLFFBQUE7QUFBQSxNQUFBLFFBQUEsR0FBZSxJQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsT0FBZCxFQUF1QjtBQUFBLFFBQUEsT0FBQSxFQUFTLElBQVQ7T0FBdkIsQ0FBZixDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQUEsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixTQUFDLElBQUQsRUFBVyxLQUFYLEdBQUE7QUFBd0IsWUFBQSxJQUFBO0FBQUEsUUFBakIsSUFBTixLQUFDLElBQXNCLENBQUE7QUFBQSxRQUFQLElBQU4sTUFBQyxJQUFZLENBQUE7ZUFBQSxRQUFRLENBQUMsT0FBVCxDQUFpQixDQUFqQixFQUFtQixDQUFuQixFQUF4QjtNQUFBLENBQXhCLEVBRlk7SUFBQSxDQWJkLENBQUE7O0FBQUEsc0JBaUJBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsU0FBQyxDQUFELEdBQUE7ZUFBTyxDQUFDLENBQUMsS0FBVDtNQUFBLENBQWYsRUFBSDtJQUFBLENBakJoQixDQUFBOztBQUFBLHNCQW1CQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBZDtJQUFBLENBbkJoQixDQUFBOztBQUFBLHNCQXFCQSxTQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFBYyxVQUFBLDJCQUFBO0FBQUE7QUFBQTtXQUFBLDJDQUFBO3FCQUFBO0FBQUEsc0JBQUEsUUFBQSxDQUFTLENBQVQsRUFBQSxDQUFBO0FBQUE7c0JBQWQ7SUFBQSxDQXJCWCxDQUFBOztBQUFBLHNCQXVCQSxhQUFBLEdBQWUsU0FBQyxDQUFELEVBQUcsQ0FBSCxHQUFBO0FBQ2IsVUFBQSx5RUFBQTtBQUFBLE1BQUEsT0FBa0MsQ0FBQyxDQUFDLEdBQXBDLEVBQUMsY0FBRCxFQUFPLHFCQUFQLEVBQW9CLG9CQUFwQixDQUFBO0FBQUEsTUFDQSxRQUFrQyxDQUFDLENBQUMsR0FBcEMsRUFBQyxlQUFELEVBQU8sc0JBQVAsRUFBb0IscUJBRHBCLENBQUE7QUFFQSxNQUFBLElBQUcsSUFBQSxHQUFPLElBQVY7ZUFDRSxDQUFBLEVBREY7T0FBQSxNQUVLLElBQUcsSUFBQSxHQUFPLElBQVY7ZUFDSCxFQURHO09BQUEsTUFFQSxJQUFHLFdBQUEsR0FBYyxXQUFqQjtlQUNILENBQUEsRUFERztPQUFBLE1BRUEsSUFBRyxXQUFBLEdBQWMsV0FBakI7ZUFDSCxFQURHO09BQUEsTUFFQSxJQUFHLFVBQUEsR0FBYSxVQUFoQjtlQUNILENBQUEsRUFERztPQUFBLE1BRUEsSUFBRyxVQUFBLEdBQWEsVUFBaEI7ZUFDSCxFQURHO09BQUEsTUFBQTtlQUdILEVBSEc7T0FiUTtJQUFBLENBdkJmLENBQUE7O0FBQUEsc0JBeUNBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQ0UsWUFBQSxFQUFjLFNBRGhCO0FBQUEsUUFFRyxXQUFELElBQUMsQ0FBQSxTQUZIO1FBRFM7SUFBQSxDQXpDWCxDQUFBOzttQkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/palette.coffee

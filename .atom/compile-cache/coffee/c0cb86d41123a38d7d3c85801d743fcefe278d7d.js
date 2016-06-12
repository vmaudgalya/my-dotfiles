(function() {
  var Palette;

  module.exports = Palette = (function() {
    function Palette(variables) {
      this.variables = variables != null ? variables : [];
    }

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

    return Palette;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BhbGV0dGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxpQkFBRSxTQUFGLEdBQUE7QUFBaUIsTUFBaEIsSUFBQyxDQUFBLGdDQUFBLFlBQVUsRUFBSyxDQUFqQjtJQUFBLENBQWI7O0FBQUEsc0JBRUEsYUFBQSxHQUFlLFNBQUEsR0FBQTthQUNiLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxFQUFZLEtBQVosR0FBQTtBQUEwQixjQUFBLElBQUE7QUFBQSxVQUFsQixJQUFQLEtBQUMsS0FBd0IsQ0FBQTtBQUFBLFVBQVAsSUFBUCxNQUFDLEtBQWEsQ0FBQTtpQkFBQSxLQUFDLENBQUEsYUFBRCxDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBMUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQURhO0lBQUEsQ0FGZixDQUFBOztBQUFBLHNCQUtBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixVQUFBLFFBQUE7QUFBQSxNQUFBLFFBQUEsR0FBZSxJQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsT0FBZCxFQUF1QjtBQUFBLFFBQUEsT0FBQSxFQUFTLElBQVQ7T0FBdkIsQ0FBZixDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQUEsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixTQUFDLElBQUQsRUFBVyxLQUFYLEdBQUE7QUFBd0IsWUFBQSxJQUFBO0FBQUEsUUFBakIsSUFBTixLQUFDLElBQXNCLENBQUE7QUFBQSxRQUFQLElBQU4sTUFBQyxJQUFZLENBQUE7ZUFBQSxRQUFRLENBQUMsT0FBVCxDQUFpQixDQUFqQixFQUFtQixDQUFuQixFQUF4QjtNQUFBLENBQXhCLEVBRlk7SUFBQSxDQUxkLENBQUE7O0FBQUEsc0JBU0EsY0FBQSxHQUFnQixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxTQUFDLENBQUQsR0FBQTtlQUFPLENBQUMsQ0FBQyxLQUFUO01BQUEsQ0FBZixFQUFIO0lBQUEsQ0FUaEIsQ0FBQTs7QUFBQSxzQkFXQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBZDtJQUFBLENBWGhCLENBQUE7O0FBQUEsc0JBYUEsU0FBQSxHQUFXLFNBQUMsUUFBRCxHQUFBO0FBQWMsVUFBQSwyQkFBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTtxQkFBQTtBQUFBLHNCQUFBLFFBQUEsQ0FBUyxDQUFULEVBQUEsQ0FBQTtBQUFBO3NCQUFkO0lBQUEsQ0FiWCxDQUFBOztBQUFBLHNCQWVBLGFBQUEsR0FBZSxTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7QUFDYixVQUFBLHlFQUFBO0FBQUEsTUFBQSxPQUFrQyxDQUFDLENBQUMsR0FBcEMsRUFBQyxjQUFELEVBQU8scUJBQVAsRUFBb0Isb0JBQXBCLENBQUE7QUFBQSxNQUNBLFFBQWtDLENBQUMsQ0FBQyxHQUFwQyxFQUFDLGVBQUQsRUFBTyxzQkFBUCxFQUFvQixxQkFEcEIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFBLEdBQU8sSUFBVjtlQUNFLENBQUEsRUFERjtPQUFBLE1BRUssSUFBRyxJQUFBLEdBQU8sSUFBVjtlQUNILEVBREc7T0FBQSxNQUVBLElBQUcsV0FBQSxHQUFjLFdBQWpCO2VBQ0gsQ0FBQSxFQURHO09BQUEsTUFFQSxJQUFHLFdBQUEsR0FBYyxXQUFqQjtlQUNILEVBREc7T0FBQSxNQUVBLElBQUcsVUFBQSxHQUFhLFVBQWhCO2VBQ0gsQ0FBQSxFQURHO09BQUEsTUFFQSxJQUFHLFVBQUEsR0FBYSxVQUFoQjtlQUNILEVBREc7T0FBQSxNQUFBO2VBR0gsRUFIRztPQWJRO0lBQUEsQ0FmZixDQUFBOzttQkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/palette.coffee

(function() {
  beforeEach(function() {
    var compare;
    compare = function(a, b, p) {
      return Math.abs(b - a) < (Math.pow(10, -p) / 2);
    };
    return this.addMatchers({
      toBeComponentArrayCloseTo: function(arr, precision) {
        var notText;
        if (precision == null) {
          precision = 0;
        }
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be an array whose values are close to " + (jasmine.pp(arr)) + " with a precision of " + precision;
          };
        })(this);
        if (this.actual.length !== arr.length) {
          return false;
        }
        return this.actual.every(function(value, i) {
          return compare(value, arr[i], precision);
        });
      },
      toBeValid: function() {
        var notText;
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be a valid color";
          };
        })(this);
        return this.actual.isValid();
      },
      toBeColor: function(colorOrRed, green, blue, alpha) {
        var color, hex, notText, red;
        if (green == null) {
          green = 0;
        }
        if (blue == null) {
          blue = 0;
        }
        if (alpha == null) {
          alpha = 1;
        }
        color = (function() {
          switch (typeof colorOrRed) {
            case 'object':
              return colorOrRed;
            case 'number':
              return {
                red: colorOrRed,
                green: green,
                blue: blue,
                alpha: alpha
              };
            case 'string':
              colorOrRed = colorOrRed.replace(/#|0x/, '');
              hex = parseInt(colorOrRed, 16);
              switch (colorOrRed.length) {
                case 8:
                  alpha = (hex >> 24 & 0xff) / 255;
                  red = hex >> 16 & 0xff;
                  green = hex >> 8 & 0xff;
                  blue = hex & 0xff;
                  break;
                case 6:
                  red = hex >> 16 & 0xff;
                  green = hex >> 8 & 0xff;
                  blue = hex & 0xff;
                  break;
                case 3:
                  red = (hex >> 8 & 0xf) * 17;
                  green = (hex >> 4 & 0xf) * 17;
                  blue = (hex & 0xf) * 17;
                  break;
                default:
                  red = 0;
                  green = 0;
                  blue = 0;
                  alpha = 1;
              }
              return {
                red: red,
                green: green,
                blue: blue,
                alpha: alpha
              };
            default:
              return {
                red: 0,
                green: 0,
                blue: 0,
                alpha: 1
              };
          }
        })();
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be a color equal to " + (jasmine.pp(color));
          };
        })(this);
        return Math.round(this.actual.red) === color.red && Math.round(this.actual.green) === color.green && Math.round(this.actual.blue) === color.blue && compare(this.actual.alpha, color.alpha, 1);
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9oZWxwZXJzL21hdGNoZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsRUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsU0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsR0FBQTthQUFXLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxHQUFJLENBQWIsQ0FBQSxHQUFrQixDQUFDLElBQUksQ0FBQyxHQUFMLENBQVMsRUFBVCxFQUFhLENBQUEsQ0FBYixDQUFBLEdBQW1CLENBQXBCLEVBQTdCO0lBQUEsQ0FBVixDQUFBO1dBRUEsSUFBQyxDQUFBLFdBQUQsQ0FDRTtBQUFBLE1BQUEseUJBQUEsRUFBMkIsU0FBQyxHQUFELEVBQU0sU0FBTixHQUFBO0FBQ3pCLFlBQUEsT0FBQTs7VUFEK0IsWUFBVTtTQUN6QztBQUFBLFFBQUEsT0FBQSxHQUFhLElBQUMsQ0FBQSxLQUFKLEdBQWUsTUFBZixHQUEyQixFQUFyQyxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsT0FBTCxHQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFJLFdBQUEsR0FBVSxDQUFDLE9BQU8sQ0FBQyxFQUFSLENBQVcsS0FBQyxDQUFBLE1BQVosQ0FBRCxDQUFWLEdBQStCLEtBQS9CLEdBQW9DLE9BQXBDLEdBQTRDLHlDQUE1QyxHQUFvRixDQUFDLE9BQU8sQ0FBQyxFQUFSLENBQVcsR0FBWCxDQUFELENBQXBGLEdBQXFHLHVCQUFyRyxHQUE0SCxVQUFoSTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGYsQ0FBQTtBQUdBLFFBQUEsSUFBZ0IsSUFBQyxDQUFBLE1B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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/helpers/matchers.coffee

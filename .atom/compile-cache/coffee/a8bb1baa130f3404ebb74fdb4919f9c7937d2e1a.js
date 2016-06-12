(function() {
  var Color, SVGColors, hexARGBToRGB, hexRGBAToRGB, hexToRGB, hslToRGB, hsvToHWB, hsvToRGB, hwbToHSV, hwbToRGB, rgbToHSL, rgbToHSV, rgbToHWB, rgbToHex, rgbToHexARGB, rgbToHexRGBA, _ref;

  _ref = require('./color-conversions'), hexARGBToRGB = _ref.hexARGBToRGB, hexRGBAToRGB = _ref.hexRGBAToRGB, hexToRGB = _ref.hexToRGB, hslToRGB = _ref.hslToRGB, hsvToHWB = _ref.hsvToHWB, hsvToRGB = _ref.hsvToRGB, hwbToHSV = _ref.hwbToHSV, hwbToRGB = _ref.hwbToRGB, rgbToHSL = _ref.rgbToHSL, rgbToHSV = _ref.rgbToHSV, rgbToHWB = _ref.rgbToHWB, rgbToHex = _ref.rgbToHex, rgbToHexARGB = _ref.rgbToHexARGB, rgbToHexRGBA = _ref.rgbToHexRGBA;

  SVGColors = require('./svg-colors');

  module.exports = Color = (function() {
    Color.colorComponents = [['red', 0], ['green', 1], ['blue', 2], ['alpha', 3]];

    function Color(r, g, b, a) {
      var expr, i, k, v, _i, _len, _ref1;
      if (r == null) {
        r = 0;
      }
      if (g == null) {
        g = 0;
      }
      if (b == null) {
        b = 0;
      }
      if (a == null) {
        a = 1;
      }
      if (typeof r === 'object') {
        if (Array.isArray(r)) {
          for (i = _i = 0, _len = r.length; _i < _len; i = ++_i) {
            v = r[i];
            this[i] = v;
          }
        } else {
          for (k in r) {
            v = r[k];
            this[k] = v;
          }
        }
      } else if (typeof r === 'string') {
        if (r in SVGColors.allCases) {
          this.name = r;
          r = SVGColors.allCases[r];
        }
        expr = r.replace(/\#|0x/, '');
        if (expr.length === 6) {
          this.hex = expr;
          this.alpha = 1;
        } else {
          this.hexARGB = expr;
        }
      } else {
        _ref1 = [r, g, b, a], this.red = _ref1[0], this.green = _ref1[1], this.blue = _ref1[2], this.alpha = _ref1[3];
      }
    }

    Color.colorComponents.forEach(function(_arg) {
      var component, index;
      component = _arg[0], index = _arg[1];
      return Object.defineProperty(Color.prototype, component, {
        enumerable: true,
        get: function() {
          return this[index];
        },
        set: function(component) {
          return this[index] = component;
        }
      });
    });

    Object.defineProperty(Color.prototype, 'rgb', {
      enumerable: true,
      get: function() {
        return [this.red, this.green, this.blue];
      },
      set: function(_arg) {
        this.red = _arg[0], this.green = _arg[1], this.blue = _arg[2];
      }
    });

    Object.defineProperty(Color.prototype, 'rgba', {
      enumerable: true,
      get: function() {
        return [this.red, this.green, this.blue, this.alpha];
      },
      set: function(_arg) {
        this.red = _arg[0], this.green = _arg[1], this.blue = _arg[2], this.alpha = _arg[3];
      }
    });

    Object.defineProperty(Color.prototype, 'argb', {
      enumerable: true,
      get: function() {
        return [this.alpha, this.red, this.green, this.blue];
      },
      set: function(_arg) {
        this.alpha = _arg[0], this.red = _arg[1], this.green = _arg[2], this.blue = _arg[3];
      }
    });

    Object.defineProperty(Color.prototype, 'hsv', {
      enumerable: true,
      get: function() {
        return rgbToHSV(this.red, this.green, this.blue);
      },
      set: function(hsv) {
        var _ref1;
        return _ref1 = hsvToRGB.apply(this.constructor, hsv), this.red = _ref1[0], this.green = _ref1[1], this.blue = _ref1[2], _ref1;
      }
    });

    Object.defineProperty(Color.prototype, 'hsva', {
      enumerable: true,
      get: function() {
        return this.hsv.concat(this.alpha);
      },
      set: function(hsva) {
        var h, s, v, _ref1;
        h = hsva[0], s = hsva[1], v = hsva[2], this.alpha = hsva[3];
        return _ref1 = hsvToRGB.apply(this.constructor, [h, s, v]), this.red = _ref1[0], this.green = _ref1[1], this.blue = _ref1[2], _ref1;
      }
    });

    Object.defineProperty(Color.prototype, 'hsl', {
      enumerable: true,
      get: function() {
        return rgbToHSL(this.red, this.green, this.blue);
      },
      set: function(hsl) {
        var _ref1;
        return _ref1 = hslToRGB.apply(this.constructor, hsl), this.red = _ref1[0], this.green = _ref1[1], this.blue = _ref1[2], _ref1;
      }
    });

    Object.defineProperty(Color.prototype, 'hsla', {
      enumerable: true,
      get: function() {
        return this.hsl.concat(this.alpha);
      },
      set: function(hsl) {
        var h, l, s, _ref1;
        h = hsl[0], s = hsl[1], l = hsl[2], this.alpha = hsl[3];
        return _ref1 = hslToRGB.apply(this.constructor, [h, s, l]), this.red = _ref1[0], this.green = _ref1[1], this.blue = _ref1[2], _ref1;
      }
    });

    Object.defineProperty(Color.prototype, 'hwb', {
      enumerable: true,
      get: function() {
        return rgbToHWB(this.red, this.green, this.blue);
      },
      set: function(hwb) {
        var _ref1;
        return _ref1 = hwbToRGB.apply(this.constructor, hwb), this.red = _ref1[0], this.green = _ref1[1], this.blue = _ref1[2], _ref1;
      }
    });

    Object.defineProperty(Color.prototype, 'hwba', {
      enumerable: true,
      get: function() {
        return this.hwb.concat(this.alpha);
      },
      set: function(hwb) {
        var b, h, w, _ref1;
        h = hwb[0], w = hwb[1], b = hwb[2], this.alpha = hwb[3];
        return _ref1 = hwbToRGB.apply(this.constructor, [h, w, b]), this.red = _ref1[0], this.green = _ref1[1], this.blue = _ref1[2], _ref1;
      }
    });

    Object.defineProperty(Color.prototype, 'hex', {
      enumerable: true,
      get: function() {
        return rgbToHex(this.red, this.green, this.blue);
      },
      set: function(hex) {
        var _ref1;
        return _ref1 = hexToRGB(hex), this.red = _ref1[0], this.green = _ref1[1], this.blue = _ref1[2], _ref1;
      }
    });

    Object.defineProperty(Color.prototype, 'hexARGB', {
      enumerable: true,
      get: function() {
        return rgbToHexARGB(this.red, this.green, this.blue, this.alpha);
      },
      set: function(hex) {
        var _ref1;
        return _ref1 = hexARGBToRGB(hex), this.red = _ref1[0], this.green = _ref1[1], this.blue = _ref1[2], this.alpha = _ref1[3], _ref1;
      }
    });

    Object.defineProperty(Color.prototype, 'hexRGBA', {
      enumerable: true,
      get: function() {
        return rgbToHexRGBA(this.red, this.green, this.blue, this.alpha);
      },
      set: function(hex) {
        var _ref1;
        return _ref1 = hexRGBAToRGB(hex), this.red = _ref1[0], this.green = _ref1[1], this.blue = _ref1[2], this.alpha = _ref1[3], _ref1;
      }
    });

    Object.defineProperty(Color.prototype, 'length', {
      enumerable: true,
      get: function() {
        return 4;
      }
    });

    Object.defineProperty(Color.prototype, 'hue', {
      enumerable: true,
      get: function() {
        return this.hsl[0];
      },
      set: function(hue) {
        var hsl;
        hsl = this.hsl;
        hsl[0] = hue;
        return this.hsl = hsl;
      }
    });

    Object.defineProperty(Color.prototype, 'saturation', {
      enumerable: true,
      get: function() {
        return this.hsl[1];
      },
      set: function(saturation) {
        var hsl;
        hsl = this.hsl;
        hsl[1] = saturation;
        return this.hsl = hsl;
      }
    });

    Object.defineProperty(Color.prototype, 'lightness', {
      enumerable: true,
      get: function() {
        return this.hsl[2];
      },
      set: function(lightness) {
        var hsl;
        hsl = this.hsl;
        hsl[2] = lightness;
        return this.hsl = hsl;
      }
    });

    Object.defineProperty(Color.prototype, 'luma', {
      enumerable: true,
      get: function() {
        var b, g, r;
        r = this[0] / 255;
        g = this[1] / 255;
        b = this[2] / 255;
        r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }
    });

    Color.prototype.isValid = function() {
      return !this.invalid && (this.red != null) && (this.green != null) && (this.blue != null) && (this.alpha != null) && !isNaN(this.red) && !isNaN(this.green) && !isNaN(this.blue) && !isNaN(this.alpha);
    };

    Color.prototype.clone = function() {
      return new Color(this.red, this.green, this.blue, this.alpha);
    };

    Color.prototype.isEqual = function(color) {
      return color.red === this.red && color.green === this.green && color.blue === this.blue && color.alpha === this.alpha;
    };

    Color.prototype.interpolate = function(col, ratio, preserveAlpha) {
      var iratio;
      if (preserveAlpha == null) {
        preserveAlpha = true;
      }
      iratio = 1 - ratio;
      if (col == null) {
        return clone();
      }
      return new Color(Math.floor(this.red * iratio + col.red * ratio), Math.floor(this.green * iratio + col.green * ratio), Math.floor(this.blue * iratio + col.blue * ratio), Math.floor(preserveAlpha ? this.alpha : this.alpha * iratio + col.alpha * ratio));
    };

    Color.prototype.transparentize = function(alpha) {
      return new Color(this.red, this.green, this.blue, alpha);
    };

    Color.prototype.blend = function(color, method, preserveAlpha) {
      var a, b, g, r;
      if (preserveAlpha == null) {
        preserveAlpha = true;
      }
      r = method(this.red, color.red);
      g = method(this.green, color.green);
      b = method(this.blue, color.blue);
      a = preserveAlpha ? this.alpha : method(this.alpha, color.alpha);
      return new Color(r, g, b, a);
    };

    Color.prototype.toCSS = function() {
      var rnd;
      rnd = Math.round;
      if (this.alpha === 1) {
        return "rgb(" + (rnd(this.red)) + "," + (rnd(this.green)) + "," + (rnd(this.blue)) + ")";
      } else {
        return "rgba(" + (rnd(this.red)) + "," + (rnd(this.green)) + "," + (rnd(this.blue)) + "," + this.alpha + ")";
      }
    };

    Color.prototype.serialize = function() {
      return [this.red, this.green, this.blue, this.alpha];
    };

    return Color;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrTEFBQTs7QUFBQSxFQUFBLE9BZUksT0FBQSxDQUFRLHFCQUFSLENBZkosRUFDRSxvQkFBQSxZQURGLEVBRUUsb0JBQUEsWUFGRixFQUdFLGdCQUFBLFFBSEYsRUFJRSxnQkFBQSxRQUpGLEVBS0UsZ0JBQUEsUUFMRixFQU1FLGdCQUFBLFFBTkYsRUFPRSxnQkFBQSxRQVBGLEVBUUUsZ0JBQUEsUUFSRixFQVNFLGdCQUFBLFFBVEYsRUFVRSxnQkFBQSxRQVZGLEVBV0UsZ0JBQUEsUUFYRixFQVlFLGdCQUFBLFFBWkYsRUFhRSxvQkFBQSxZQWJGLEVBY0Usb0JBQUEsWUFkRixDQUFBOztBQUFBLEVBZ0JBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQWhCWixDQUFBOztBQUFBLEVBa0JBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixJQUFBLEtBQUMsQ0FBQSxlQUFELEdBQWtCLENBQ2hCLENBQUMsS0FBRCxFQUFVLENBQVYsQ0FEZ0IsRUFFaEIsQ0FBQyxPQUFELEVBQVUsQ0FBVixDQUZnQixFQUdoQixDQUFDLE1BQUQsRUFBVSxDQUFWLENBSGdCLEVBSWhCLENBQUMsT0FBRCxFQUFVLENBQVYsQ0FKZ0IsQ0FBbEIsQ0FBQTs7QUFPYSxJQUFBLGVBQUMsQ0FBRCxFQUFLLENBQUwsRUFBUyxDQUFULEVBQWEsQ0FBYixHQUFBO0FBQ1gsVUFBQSw4QkFBQTs7UUFEWSxJQUFFO09BQ2Q7O1FBRGdCLElBQUU7T0FDbEI7O1FBRG9CLElBQUU7T0FDdEI7O1FBRHdCLElBQUU7T0FDMUI7QUFBQSxNQUFBLElBQUcsTUFBQSxDQUFBLENBQUEsS0FBWSxRQUFmO0FBQ0UsUUFBQSxJQUFH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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color.coffee

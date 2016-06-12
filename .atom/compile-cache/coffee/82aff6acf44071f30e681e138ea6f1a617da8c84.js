(function() {
  var ColorMarker, CompositeDisposable, fill;

  CompositeDisposable = require('atom').CompositeDisposable;

  fill = require('./utils').fill;

  module.exports = ColorMarker = (function() {
    function ColorMarker(_arg) {
      this.marker = _arg.marker, this.color = _arg.color, this.text = _arg.text, this.invalid = _arg.invalid, this.colorBuffer = _arg.colorBuffer;
      this.id = this.marker.id;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.markerWasDestroyed();
        };
      })(this)));
      this.subscriptions.add(this.marker.onDidChange((function(_this) {
        return function() {
          if (_this.marker.isValid()) {
            _this.invalidateScreenRangeCache();
            return _this.checkMarkerScope();
          } else {
            return _this.destroy();
          }
        };
      })(this)));
      this.checkMarkerScope();
    }

    ColorMarker.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      return this.marker.destroy();
    };

    ColorMarker.prototype.markerWasDestroyed = function() {
      var _ref;
      if (this.destroyed) {
        return;
      }
      this.subscriptions.dispose();
      _ref = {}, this.marker = _ref.marker, this.color = _ref.color, this.text = _ref.text, this.colorBuffer = _ref.colorBuffer;
      return this.destroyed = true;
    };

    ColorMarker.prototype.match = function(properties) {
      var bool;
      if (this.destroyed) {
        return false;
      }
      bool = true;
      if (properties.bufferRange != null) {
        bool && (bool = this.marker.getBufferRange().isEqual(properties.bufferRange));
      }
      if (properties.color != null) {
        bool && (bool = properties.color.isEqual(this.color));
      }
      if (properties.match != null) {
        bool && (bool = properties.match === this.text);
      }
      if (properties.text != null) {
        bool && (bool = properties.text === this.text);
      }
      return bool;
    };

    ColorMarker.prototype.serialize = function() {
      var out;
      if (this.destroyed) {
        return;
      }
      out = {
        markerId: String(this.marker.id),
        bufferRange: this.marker.getBufferRange().serialize(),
        color: this.color.serialize(),
        text: this.text,
        variables: this.color.variables
      };
      if (!this.color.isValid()) {
        out.invalid = true;
      }
      return out;
    };

    ColorMarker.prototype.checkMarkerScope = function(forceEvaluation) {
      var e, range, scope, scopeChain, _ref;
      if (forceEvaluation == null) {
        forceEvaluation = false;
      }
      if (this.destroyed || (this.colorBuffer == null)) {
        return;
      }
      range = this.marker.getBufferRange();
      try {
        scope = this.colorBuffer.editor.scopeDescriptorForBufferPosition != null ? this.colorBuffer.editor.scopeDescriptorForBufferPosition(range.start) : this.colorBuffer.editor.displayBuffer.scopeDescriptorForBufferPosition(range.start);
        scopeChain = scope.getScopeChain();
        if (!scopeChain || (!forceEvaluation && scopeChain === this.lastScopeChain)) {
          return;
        }
        this.ignored = ((_ref = this.colorBuffer.ignoredScopes) != null ? _ref : []).some(function(scopeRegExp) {
          return scopeChain.match(scopeRegExp);
        });
        return this.lastScopeChain = scopeChain;
      } catch (_error) {
        e = _error;
        return console.error(e);
      }
    };

    ColorMarker.prototype.isIgnored = function() {
      return this.ignored;
    };

    ColorMarker.prototype.getBufferRange = function() {
      return this.marker.getBufferRange();
    };

    ColorMarker.prototype.getScreenRange = function() {
      var _ref;
      return this.screenRangeCache != null ? this.screenRangeCache : this.screenRangeCache = (_ref = this.marker) != null ? _ref.getScreenRange() : void 0;
    };

    ColorMarker.prototype.invalidateScreenRangeCache = function() {
      return this.screenRangeCache = null;
    };

    ColorMarker.prototype.convertContentToHex = function() {
      var hex;
      hex = '#' + fill(this.color.hex, 6);
      return this.colorBuffer.editor.getBuffer().setTextInRange(this.marker.getBufferRange(), hex);
    };

    ColorMarker.prototype.convertContentToRGB = function() {
      var rgba;
      rgba = "rgb(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ")";
      return this.colorBuffer.editor.getBuffer().setTextInRange(this.marker.getBufferRange(), rgba);
    };

    ColorMarker.prototype.convertContentToRGBA = function() {
      var rgba;
      rgba = "rgba(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ", " + this.color.alpha + ")";
      return this.colorBuffer.editor.getBuffer().setTextInRange(this.marker.getBufferRange(), rgba);
    };

    ColorMarker.prototype.convertContentToHSL = function() {
      var hsl;
      hsl = "hsl(" + (Math.round(this.color.hue)) + ", " + (Math.round(this.color.saturation)) + "%, " + (Math.round(this.color.lightness)) + "%)";
      return this.colorBuffer.editor.getBuffer().setTextInRange(this.marker.getBufferRange(), hsl);
    };

    ColorMarker.prototype.convertContentToHSLA = function() {
      var hsla;
      hsla = "hsla(" + (Math.round(this.color.hue)) + ", " + (Math.round(this.color.saturation)) + "%, " + (Math.round(this.color.lightness)) + "%, " + this.color.alpha + ")";
      return this.colorBuffer.editor.getBuffer().setTextInRange(this.marker.getBufferRange(), hsla);
    };

    return ColorMarker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLW1hcmtlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLFNBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBQyxJQUFELEdBQUE7QUFDWCxNQURhLElBQUMsQ0FBQSxjQUFBLFFBQVEsSUFBQyxDQUFBLGFBQUEsT0FBTyxJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxlQUFBLFNBQVMsSUFBQyxDQUFBLG1CQUFBLFdBQ2hELENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFkLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxrQkFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQixDQUFuQixDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyQyxVQUFBLElBQUcsS0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-marker.coffee

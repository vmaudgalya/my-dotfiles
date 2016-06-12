(function() {
  var ColorMarkerElement, CompositeDisposable, Emitter, RENDERERS, registerOrUpdateElement, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  registerOrUpdateElement = require('atom-utils').registerOrUpdateElement;

  RENDERERS = {
    'background': require('./renderers/background'),
    'outline': require('./renderers/outline'),
    'underline': require('./renderers/underline'),
    'dot': require('./renderers/dot'),
    'square-dot': require('./renderers/square-dot')
  };

  ColorMarkerElement = (function(_super) {
    __extends(ColorMarkerElement, _super);

    function ColorMarkerElement() {
      return ColorMarkerElement.__super__.constructor.apply(this, arguments);
    }

    ColorMarkerElement.prototype.renderer = new RENDERERS.background;

    ColorMarkerElement.prototype.createdCallback = function() {
      this.emitter = new Emitter;
      return this.released = true;
    };

    ColorMarkerElement.prototype.attachedCallback = function() {};

    ColorMarkerElement.prototype.detachedCallback = function() {};

    ColorMarkerElement.prototype.onDidRelease = function(callback) {
      return this.emitter.on('did-release', callback);
    };

    ColorMarkerElement.prototype.getModel = function() {
      return this.colorMarker;
    };

    ColorMarkerElement.prototype.setModel = function(colorMarker) {
      this.colorMarker = colorMarker;
      if (!this.released) {
        return;
      }
      this.released = false;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.colorMarker.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.release();
        };
      })(this)));
      this.subscriptions.add(this.colorMarker.marker.onDidChange((function(_this) {
        return function(data) {
          var isValid;
          isValid = data.isValid;
          if (isValid) {
            return _this.render();
          } else {
            return _this.release();
          }
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('pigments.markerType', (function(_this) {
        return function(type) {
          if (type !== 'gutter') {
            return _this.render();
          }
        };
      })(this)));
    };

    ColorMarkerElement.prototype.destroy = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.parentNode) != null) {
        _ref1.removeChild(this);
      }
      if ((_ref2 = this.subscriptions) != null) {
        _ref2.dispose();
      }
      return this.clear();
    };

    ColorMarkerElement.prototype.render = function() {
      var cls, k, region, regions, style, v, _i, _len, _ref1;
      if (this.colorMarker.marker.displayBuffer.isDestroyed()) {
        return;
      }
      this.innerHTML = '';
      _ref1 = this.renderer.render(this.colorMarker), style = _ref1.style, regions = _ref1.regions, cls = _ref1["class"];
      if (regions != null) {
        for (_i = 0, _len = regions.length; _i < _len; _i++) {
          region = regions[_i];
          this.appendChild(region);
        }
      }
      if (cls != null) {
        this.className = cls;
      } else {
        this.className = '';
      }
      if (style != null) {
        for (k in style) {
          v = style[k];
          this.style[k] = v;
        }
      } else {
        this.style.cssText = '';
      }
      return this.lastMarkerScreenRange = this.colorMarker.getScreenRange();
    };

    ColorMarkerElement.prototype.checkScreenRange = function() {
      if (this.colorMarker == null) {
        return;
      }
      if (!this.lastMarkerScreenRange.isEqual(this.colorMarker.getScreenRange())) {
        return this.render();
      }
    };

    ColorMarkerElement.prototype.isReleased = function() {
      return this.released;
    };

    ColorMarkerElement.prototype.release = function(dispatchEvent) {
      var marker;
      if (dispatchEvent == null) {
        dispatchEvent = true;
      }
      if (this.released) {
        return;
      }
      this.subscriptions.dispose();
      marker = this.colorMarker;
      this.clear();
      if (dispatchEvent) {
        return this.emitter.emit('did-release', {
          marker: marker,
          view: this
        });
      }
    };

    ColorMarkerElement.prototype.clear = function() {
      this.subscriptions = null;
      this.colorMarker = null;
      this.released = true;
      this.innerHTML = '';
      this.className = '';
      return this.style.cssText = '';
    };

    return ColorMarkerElement;

  })(HTMLElement);

  module.exports = ColorMarkerElement = registerOrUpdateElement('pigments-color-marker', ColorMarkerElement.prototype);

  ColorMarkerElement.setMarkerType = function(markerType) {
    if (markerType === 'gutter') {
      return;
    }
    return this.prototype.renderer = new RENDERERS[markerType];
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLW1hcmtlci1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwRkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixlQUFBLE9BQXRCLENBQUE7O0FBQUEsRUFDQywwQkFBMkIsT0FBQSxDQUFRLFlBQVIsRUFBM0IsdUJBREQsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FDRTtBQUFBLElBQUEsWUFBQSxFQUFjLE9BQUEsQ0FBUSx3QkFBUixDQUFkO0FBQUEsSUFDQSxTQUFBLEVBQVcsT0FBQSxDQUFRLHFCQUFSLENBRFg7QUFBQSxJQUVBLFdBQUEsRUFBYSxPQUFBLENBQVEsdUJBQVIsQ0FGYjtBQUFBLElBR0EsS0FBQSxFQUFPLE9BQUEsQ0FBUSxpQkFBUixDQUhQO0FBQUEsSUFJQSxZQUFBLEVBQWMsT0FBQSxDQUFRLHdCQUFSLENBSmQ7R0FKRixDQUFBOztBQUFBLEVBVU07QUFDSix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsaUNBQUEsUUFBQSxHQUFVLEdBQUEsQ0FBQSxTQUFhLENBQUMsVUFBeEIsQ0FBQTs7QUFBQSxpQ0FFQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUZHO0lBQUEsQ0FGakIsQ0FBQTs7QUFBQSxpQ0FNQSxnQkFBQSxHQUFrQixTQUFBLEdBQUEsQ0FObEIsQ0FBQTs7QUFBQSxpQ0FRQSxnQkFBQSxHQUFrQixTQUFBLEdBQUEsQ0FSbEIsQ0FBQTs7QUFBQSxpQ0FVQSxZQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7YUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxhQUFaLEVBQTJCLFFBQTNCLEVBRFk7SUFBQSxDQVZkLENBQUE7O0FBQUEsaUNBYUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxZQUFKO0lBQUEsQ0FiVixDQUFBOztBQUFBLGlDQWVBLFFBQUEsR0FBVSxTQUFFLFdBQUYsR0FBQTtBQUNSLE1BRFMsSUFBQyxDQUFBLGNBQUEsV0FDVixDQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLFFBQWY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQURaLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFGakIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBTSxDQUFDLFlBQXBCLENBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakMsQ0FBbkIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBcEIsQ0FBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ2pELGNBQUEsT0FBQTtBQUFBLFVBQUMsVUFBVyxLQUFYLE9BQUQsQ0FBQTtBQUNBLFVBQUEsSUFBRyxPQUFIO21CQUFnQixLQUFDLENBQUEsTUFBRCxDQUFBLEVBQWhCO1dBQUEsTUFBQTttQkFBK0IsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUEvQjtXQUZpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDLENBQW5CLENBSkEsQ0FBQTthQVFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IscUJBQXBCLEVBQTJDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUM1RCxVQUFBLElBQWlCLElBQUEsS0FBUSxRQUF6QjttQkFBQSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUE7V0FENEQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQyxDQUFuQixFQVRRO0lBQUEsQ0FmVixDQUFBOztBQUFBLGlDQTJCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxZQUFBOzthQUFXLENBQUUsV0FBYixDQUF5QixJQUF6QjtPQUFBOzthQUNjLENBQUUsT0FBaEIsQ0FBQTtPQURBO2FBRUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQUhPO0lBQUEsQ0EzQlQsQ0FBQTs7QUFBQSxpQ0FnQ0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsa0RBQUE7QUFBQSxNQUFBLElBQVUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQWxDLENBQUEsQ0FBVjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBRGIsQ0FBQTtBQUFBLE1BRUEsUUFBK0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWlCLElBQUMsQ0FBQSxXQUFsQixDQUEvQixFQUFDLGNBQUEsS0FBRCxFQUFRLGdCQUFBLE9BQVIsRUFBd0IsWUFBUCxRQUZqQixDQUFBO0FBSUEsTUFBQSxJQUE4QyxlQUE5QztBQUFBLGFBQUEsOENBQUE7K0JBQUE7QUFBQSxVQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixDQUFBLENBQUE7QUFBQSxTQUFBO09BSkE7QUFLQSxNQUFBLElBQUcsV0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxHQUFiLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBQWIsQ0FIRjtPQUxBO0FBVUEsTUFBQSxJQUFHLGFBQUg7QUFDRSxhQUFBLFVBQUE7dUJBQUE7QUFBQSxVQUFBLElBQUMsQ0FBQSxLQUFNLENBQUEsQ0FBQSxDQUFQLEdBQVksQ0FBWixDQUFBO0FBQUEsU0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxHQUFpQixFQUFqQixDQUhGO09BVkE7YUFlQSxJQUFDLENBQUEscUJBQUQsR0FBeUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxjQUFiLENBQUEsRUFoQm5CO0lBQUEsQ0FoQ1IsQ0FBQTs7QUFBQSxpQ0FrREEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsSUFBYyx3QkFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsSUFBUSxDQUFBLHFCQUFxQixDQUFDLE9BQXZCLENBQStCLElBQUMsQ0FBQSxXQUFXLENBQUMsY0FBYixDQUFBLENBQS9CLENBQVA7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FGZ0I7SUFBQSxDQWxEbEIsQ0FBQTs7QUFBQSxpQ0F1REEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxTQUFKO0lBQUEsQ0F2RFosQ0FBQTs7QUFBQSxpQ0F5REEsT0FBQSxHQUFTLFNBQUMsYUFBRCxHQUFBO0FBQ1AsVUFBQSxNQUFBOztRQURRLGdCQUFjO09BQ3RCO0FBQUEsTUFBQSxJQUFVLElBQUMsQ0FBQSxRQUFYO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxXQUZWLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FIQSxDQUFBO0FBSUEsTUFBQSxJQUFzRCxhQUF0RDtlQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGFBQWQsRUFBNkI7QUFBQSxVQUFDLFFBQUEsTUFBRDtBQUFBLFVBQVMsSUFBQSxFQUFNLElBQWY7U0FBN0IsRUFBQTtPQUxPO0lBQUEsQ0F6RFQsQ0FBQTs7QUFBQSxpQ0FnRUEsS0FBQSxHQUFPLFNBQUEsR0FBQTtBQUNMLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQURmLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFGWixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBSGIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxFQUpiLENBQUE7YUFLQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsR0FBaUIsR0FOWjtJQUFBLENBaEVQLENBQUE7OzhCQUFBOztLQUQrQixZQVZqQyxDQUFBOztBQUFBLEVBbUZBLE1BQU0sQ0FBQyxPQUFQLEdBQ0Esa0JBQUEsR0FDQSx1QkFBQSxDQUF3Qix1QkFBeEIsRUFBaUQsa0JBQWtCLENBQUMsU0FBcEUsQ0FyRkEsQ0FBQTs7QUFBQSxFQXVGQSxrQkFBa0IsQ0FBQyxhQUFuQixHQUFtQyxTQUFDLFVBQUQsR0FBQTtBQUNqQyxJQUFBLElBQVUsVUFBQSxLQUFjLFFBQXhCO0FBQUEsWUFBQSxDQUFBO0tBQUE7V0FDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVgsR0FBc0IsR0FBQSxDQUFBLFNBQWMsQ0FBQSxVQUFBLEVBRkg7RUFBQSxDQXZGbkMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-marker-element.coffee

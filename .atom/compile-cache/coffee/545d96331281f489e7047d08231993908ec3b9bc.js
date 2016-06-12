(function() {
  var Decoration, Emitter, idCounter, nextId, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore-plus');

  Emitter = require('atom').Emitter;

  idCounter = 0;

  nextId = function() {
    return idCounter++;
  };

  module.exports = Decoration = (function() {
    Decoration.isType = function(decorationProperties, type) {
      if (_.isArray(decorationProperties.type)) {
        if (__indexOf.call(decorationProperties.type, type) >= 0) {
          return true;
        }
        return false;
      } else {
        return type === decorationProperties.type;
      }
    };


    /*
    Section: Construction and Destruction
     */

    function Decoration(marker, minimap, properties) {
      this.marker = marker;
      this.minimap = minimap;
      this.emitter = new Emitter;
      this.id = nextId();
      this.setProperties(properties);
      this.properties.id = this.id;
      this.destroyed = false;
      this.markerDestroyDisposable = this.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
    }

    Decoration.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      this.markerDestroyDisposable.dispose();
      this.markerDestroyDisposable = null;
      this.destroyed = true;
      this.emitter.emit('did-destroy');
      return this.emitter.dispose();
    };

    Decoration.prototype.isDestroyed = function() {
      return this.destroyed;
    };


    /*
    Section: Event Subscription
     */

    Decoration.prototype.onDidChangeProperties = function(callback) {
      return this.emitter.on('did-change-properties', callback);
    };

    Decoration.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };


    /*
    Section: Decoration Details
     */

    Decoration.prototype.getId = function() {
      return this.id;
    };

    Decoration.prototype.getMarker = function() {
      return this.marker;
    };

    Decoration.prototype.isType = function(type) {
      return Decoration.isType(this.properties, type);
    };


    /*
    Section: Properties
     */

    Decoration.prototype.getProperties = function() {
      return this.properties;
    };

    Decoration.prototype.setProperties = function(newProperties) {
      var oldProperties;
      if (this.destroyed) {
        return;
      }
      oldProperties = this.properties;
      this.properties = newProperties;
      this.properties.id = this.id;
      if (newProperties.type != null) {
        this.minimap.decorationDidChangeType(this);
      }
      return this.emitter.emit('did-change-properties', {
        oldProperties: oldProperties,
        newProperties: newProperties
      });
    };


    /*
    Section: Private methods
     */

    Decoration.prototype.matchesPattern = function(decorationPattern) {
      var key, value;
      if (decorationPattern == null) {
        return false;
      }
      for (key in decorationPattern) {
        value = decorationPattern[key];
        if (this.properties[key] !== value) {
          return false;
        }
      }
      return true;
    };

    return Decoration;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvZGVjb3JhdGlvbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0MsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BREQsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxDQUhaLENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQVMsU0FBQSxHQUFBO1dBQUcsU0FBQSxHQUFIO0VBQUEsQ0FKVCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQVlKLElBQUEsVUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFDLG9CQUFELEVBQXVCLElBQXZCLEdBQUE7QUFFUCxNQUFBLElBQUcsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxvQkFBb0IsQ0FBQyxJQUEvQixDQUFIO0FBQ0UsUUFBQSxJQUFlLGVBQVEsb0JBQW9CLENBQUMsSUFBN0IsRUFBQSxJQUFBLE1BQWY7QUFBQSxpQkFBTyxJQUFQLENBQUE7U0FBQTtBQUNBLGVBQU8sS0FBUCxDQUZGO09BQUEsTUFBQTtlQUlFLElBQUEsS0FBUSxvQkFBb0IsQ0FBQyxLQUovQjtPQUZPO0lBQUEsQ0FBVCxDQUFBOztBQVFBO0FBQUE7O09BUkE7O0FBWWEsSUFBQSxvQkFBRSxNQUFGLEVBQVcsT0FBWCxFQUFvQixVQUFwQixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsVUFBQSxPQUN0QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/decoration.coffee

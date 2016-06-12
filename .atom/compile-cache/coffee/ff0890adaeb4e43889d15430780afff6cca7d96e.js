(function() {
  var __slice = [].slice;

  module.exports = function() {
    return {
      bindings: {},
      emit: function() {
        var args, event, _bindings, _callback, _i, _len;
        event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (!(_bindings = this.bindings[event])) {
          return;
        }
        for (_i = 0, _len = _bindings.length; _i < _len; _i++) {
          _callback = _bindings[_i];
          _callback.apply(null, args);
        }
      },
      on: function(event, callback) {
        if (!this.bindings[event]) {
          this.bindings[event] = [];
        }
        this.bindings[event].push(callback);
        return callback;
      },
      off: function(event, callback) {
        var _binding, _bindings, _i;
        if (!(_bindings = this.bindings[event])) {
          return;
        }
        _i = _bindings.length;
        while (_i-- && (_binding = _bindings[_i])) {
          if (_binding === callback) {
            _bindings.splice(_i, 1);
          }
        }
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL0VtaXR0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBS0k7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQSxHQUFBO1dBQ2I7QUFBQSxNQUFBLFFBQUEsRUFBVSxFQUFWO0FBQUEsTUFFQSxJQUFBLEVBQU0sU0FBQSxHQUFBO0FBQ0YsWUFBQSwyQ0FBQTtBQUFBLFFBREcsc0JBQU8sOERBQ1YsQ0FBQTtBQUFBLFFBQUEsSUFBQSxDQUFBLENBQWMsU0FBQSxHQUFZLElBQUMsQ0FBQSxRQUFTLENBQUEsS0FBQSxDQUF0QixDQUFkO0FBQUEsZ0JBQUEsQ0FBQTtTQUFBO0FBQ0EsYUFBQSxnREFBQTtvQ0FBQTtBQUFBLFVBQUEsU0FBUyxDQUFDLEtBQVYsQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBQSxDQUFBO0FBQUEsU0FGRTtNQUFBLENBRk47QUFBQSxNQU9BLEVBQUEsRUFBSSxTQUFDLEtBQUQsRUFBUSxRQUFSLEdBQUE7QUFDQSxRQUFBLElBQUEsQ0FBQSxJQUE4QixDQUFBLFFBQVMsQ0FBQSxLQUFBLENBQXZDO0FBQUEsVUFBQSxJQUFDLENBQUEsUUFBUyxDQUFBLEtBQUEsQ0FBVixHQUFtQixFQUFuQixDQUFBO1NBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxRQUFTLENBQUEsS0FBQSxDQUFNLENBQUMsSUFBakIsQ0FBc0IsUUFBdEIsQ0FEQSxDQUFBO0FBRUEsZUFBTyxRQUFQLENBSEE7TUFBQSxDQVBKO0FBQUEsTUFZQSxHQUFBLEVBQUssU0FBQyxLQUFELEVBQVEsUUFBUixHQUFBO0FBQ0QsWUFBQSx1QkFBQTtBQUFBLFFBQUEsSUFBQSxDQUFBLENBQWMsU0FBQSxHQUFZLElBQUMsQ0FBQSxRQUFTLENBQUEsS0FBQSxDQUF0QixDQUFkO0FBQUEsZ0JBQUEsQ0FBQTtTQUFBO0FBQUEsUUFFQSxFQUFBLEdBQUssU0FBUyxDQUFDLE1BRmYsQ0FBQTtBQUV1QixlQUFNLEVBQUEsRUFBQSxJQUFTLENBQUEsUUFBQSxHQUFXLFNBQVUsQ0FBQSxFQUFBLENBQXJCLENBQWYsR0FBQTtBQUNuQixVQUFBLElBQUcsUUFBQSxLQUFZLFFBQWY7QUFBNkIsWUFBQSxTQUFTLENBQUMsTUFBVixDQUFpQixFQUFqQixFQUFxQixDQUFyQixDQUFBLENBQTdCO1dBRG1CO1FBQUEsQ0FIdEI7TUFBQSxDQVpMO01BRGE7RUFBQSxDQUFqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/modules/Emitter.coffee

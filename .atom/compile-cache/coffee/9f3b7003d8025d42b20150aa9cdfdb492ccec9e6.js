(function() {
  var Helpers, Range, child_process, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Range = require('atom').Range;

  path = require('path');

  child_process = require('child_process');

  Helpers = module.exports = {
    error: function(e) {
      return atom.notifications.addError(e.toString(), {
        detail: e.stack || '',
        dismissable: true
      });
    },
    shouldTriggerLinter: function(linter, bufferModifying, onChange, scopes) {
      if (onChange && !linter.lintOnFly) {
        return false;
      }
      if (!scopes.some(function(entry) {
        return __indexOf.call(linter.grammarScopes, entry) >= 0;
      })) {
        return false;
      }
      if (linter.modifiesBuffer !== bufferModifying) {
        return false;
      }
      return true;
    },
    requestUpdateFrame: function(callback) {
      return setTimeout(callback, 100);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9oZWxwZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQ0FBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxlQUFSLENBRmhCLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsTUFBTSxDQUFDLE9BQVAsR0FDUjtBQUFBLElBQUEsS0FBQSxFQUFPLFNBQUMsQ0FBRCxHQUFBO2FBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixDQUFDLENBQUMsUUFBRixDQUFBLENBQTVCLEVBQTBDO0FBQUEsUUFBQyxNQUFBLEVBQVEsQ0FBQyxDQUFDLEtBQUYsSUFBVyxFQUFwQjtBQUFBLFFBQXdCLFdBQUEsRUFBYSxJQUFyQztPQUExQyxFQURLO0lBQUEsQ0FBUDtBQUFBLElBRUEsbUJBQUEsRUFBcUIsU0FBQyxNQUFELEVBQVMsZUFBVCxFQUEwQixRQUExQixFQUFvQyxNQUFwQyxHQUFBO0FBSW5CLE1BQUEsSUFBZ0IsUUFBQSxJQUFhLENBQUEsTUFBVSxDQUFDLFNBQXhDO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLE1BQTBCLENBQUMsSUFBUCxDQUFZLFNBQUMsS0FBRCxHQUFBO2VBQVcsZUFBUyxNQUFNLENBQUMsYUFBaEIsRUFBQSxLQUFBLE9BQVg7TUFBQSxDQUFaLENBQXBCO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBZ0IsTUFBTSxDQUFDLGNBQVAsS0FBMkIsZUFBM0M7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUZBO0FBR0EsYUFBTyxJQUFQLENBUG1CO0lBQUEsQ0FGckI7QUFBQSxJQVVBLGtCQUFBLEVBQW9CLFNBQUMsUUFBRCxHQUFBO2FBQ2xCLFVBQUEsQ0FBVyxRQUFYLEVBQXFCLEdBQXJCLEVBRGtCO0lBQUEsQ0FWcEI7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/helpers.coffee

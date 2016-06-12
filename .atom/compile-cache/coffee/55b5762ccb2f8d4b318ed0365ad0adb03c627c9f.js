(function() {
  "use strict";
  var Beautifier, TypeScriptFormatter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = TypeScriptFormatter = (function(_super) {
    __extends(TypeScriptFormatter, _super);

    function TypeScriptFormatter() {
      return TypeScriptFormatter.__super__.constructor.apply(this, arguments);
    }

    TypeScriptFormatter.prototype.name = "TypeScript Formatter";

    TypeScriptFormatter.prototype.options = {
      TypeScript: true
    };

    TypeScriptFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var e, format, formatterUtils, opts, result;
          format = require("typescript-formatter/lib/formatter");
          formatterUtils = require("typescript-formatter/lib/utils");
          opts = formatterUtils.createDefaultFormatCodeOptions();
          opts.TabSize = options.tab_width || options.indent_size;
          opts.IndentSize = options.indent_size;
          opts.IndentStyle = 'space';
          opts.convertTabsToSpaces = true;
          _this.verbose('typescript', text, opts);
          try {
            result = format(text, opts);
            _this.verbose(result);
            return resolve(result);
          } catch (_error) {
            e = _error;
            return reject(e);
          }
        };
      })(this));
    };

    return TypeScriptFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdHlwZXNjcmlwdC1mb3JtYXR0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsK0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQiwwQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsa0NBQUEsSUFBQSxHQUFNLHNCQUFOLENBQUE7O0FBQUEsa0NBQ0EsT0FBQSxHQUFTO0FBQUEsTUFDUCxVQUFBLEVBQVksSUFETDtLQURULENBQUE7O0FBQUEsa0NBS0EsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFFbEIsY0FBQSx1Q0FBQTtBQUFBLFVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxvQ0FBUixDQUFULENBQUE7QUFBQSxVQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGdDQUFSLENBRGpCLENBQUE7QUFBQSxVQUdBLElBQUEsR0FBTyxjQUFjLENBQUMsOEJBQWYsQ0FBQSxDQUhQLENBQUE7QUFBQSxVQUlBLElBQUksQ0FBQyxPQUFMLEdBQWUsT0FBTyxDQUFDLFNBQVIsSUFBcUIsT0FBTyxDQUFDLFdBSjVDLENBQUE7QUFBQSxVQUtBLElBQUksQ0FBQyxVQUFMLEdBQWtCLE9BQU8sQ0FBQyxXQUwxQixDQUFBO0FBQUEsVUFNQSxJQUFJLENBQUMsV0FBTCxHQUFtQixPQU5uQixDQUFBO0FBQUEsVUFPQSxJQUFJLENBQUMsbUJBQUwsR0FBMkIsSUFQM0IsQ0FBQTtBQUFBLFVBUUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLENBUkEsQ0FBQTtBQVNBO0FBQ0UsWUFBQSxNQUFBLEdBQVMsTUFBQSxDQUFPLElBQVAsRUFBYSxJQUFiLENBQVQsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxNQUFULENBREEsQ0FBQTttQkFFQSxPQUFBLENBQVEsTUFBUixFQUhGO1dBQUEsY0FBQTtBQUtFLFlBREksVUFDSixDQUFBO0FBQUEsbUJBQU8sTUFBQSxDQUFPLENBQVAsQ0FBUCxDQUxGO1dBWGtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVCxDQUFYLENBRFE7SUFBQSxDQUxWLENBQUE7OytCQUFBOztLQURpRCxXQUhuRCxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/typescript-formatter.coffee

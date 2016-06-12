
/*
Requires https://github.com/andialbrecht/sqlparse
 */

(function() {
  "use strict";
  var Beautifier, Sqlformat,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Sqlformat = (function(_super) {
    __extends(Sqlformat, _super);

    function Sqlformat() {
      return Sqlformat.__super__.constructor.apply(this, arguments);
    }

    Sqlformat.prototype.name = "sqlformat";

    Sqlformat.prototype.options = {
      SQL: true
    };

    Sqlformat.prototype.beautify = function(text, language, options) {
      return this.run("sqlformat", [this.tempFile("input", text), "--reindent", options.indent_size != null ? "--indent_width=" + options.indent_size : void 0, (options.keywords != null) && options.keywords !== 'unchanged' ? "--keywords=" + options.keywords : void 0, (options.identifiers != null) && options.identifiers !== 'unchanged' ? "--identifiers=" + options.identifiers : void 0], {
        help: {
          link: "https://github.com/andialbrecht/sqlparse"
        }
      });
    };

    return Sqlformat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvc3FsZm9ybWF0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQSxZQUpBLENBQUE7QUFBQSxNQUFBLHFCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FMYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsZ0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHdCQUFBLElBQUEsR0FBTSxXQUFOLENBQUE7O0FBQUEsd0JBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxHQUFBLEVBQUssSUFERTtLQUZULENBQUE7O0FBQUEsd0JBTUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssV0FBTCxFQUFrQixDQUNoQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEZ0IsRUFFaEIsWUFGZ0IsRUFHMkIsMkJBQTNDLEdBQUMsaUJBQUEsR0FBaUIsT0FBTyxDQUFDLFdBQTFCLEdBQUEsTUFIZ0IsRUFJcUIsMEJBQUEsSUFBcUIsT0FBTyxDQUFDLFFBQVIsS0FBb0IsV0FBOUUsR0FBQyxhQUFBLEdBQWEsT0FBTyxDQUFDLFFBQXRCLEdBQUEsTUFKZ0IsRUFLMkIsNkJBQUEsSUFBd0IsT0FBTyxDQUFDLFdBQVIsS0FBdUIsV0FBMUYsR0FBQyxnQkFBQSxHQUFnQixPQUFPLENBQUMsV0FBekIsR0FBQSxNQUxnQixDQUFsQixFQU1LO0FBQUEsUUFBQSxJQUFBLEVBQU07QUFBQSxVQUNQLElBQUEsRUFBTSwwQ0FEQztTQUFOO09BTkwsRUFEUTtJQUFBLENBTlYsQ0FBQTs7cUJBQUE7O0tBRHVDLFdBUHpDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/sqlformat.coffee

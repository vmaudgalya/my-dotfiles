
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Autopep8, Beautifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Autopep8 = (function(_super) {
    __extends(Autopep8, _super);

    function Autopep8() {
      return Autopep8.__super__.constructor.apply(this, arguments);
    }

    Autopep8.prototype.name = "autopep8";

    Autopep8.prototype.options = {
      Python: true
    };

    Autopep8.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("autopep8", [tempFile = this.tempFile("input", text), "-i", options.max_line_length != null ? ["--max-line-length", "" + options.max_line_length] : void 0, options.indent_size != null ? ["--indent-size", "" + options.indent_size] : void 0, options.ignore != null ? ["--ignore", "" + (options.ignore.join(','))] : void 0], {
        help: {
          link: "https://github.com/hhatto/autopep8"
        }
      }).then((function(_this) {
        return function() {
          if (options.sort_imports) {
            return _this.run("isort", [tempFile], {
              help: {
                link: "https://github.com/timothycrosley/isort"
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.readFile(tempFile);
          }
        };
      })(this));
    };

    return Autopep8;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYXV0b3BlcDguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFlBSkEsQ0FBQTtBQUFBLE1BQUEsb0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsdUJBQUEsSUFBQSxHQUFNLFVBQU4sQ0FBQTs7QUFBQSx1QkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLE1BQUEsRUFBUSxJQUREO0tBRlQsQ0FBQTs7QUFBQSx1QkFNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsVUFBQSxRQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMLEVBQWlCLENBQ2YsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQURJLEVBRWYsSUFGZSxFQUd3QywrQkFBdkQsR0FBQSxDQUFDLG1CQUFELEVBQXNCLEVBQUEsR0FBRyxPQUFPLENBQUMsZUFBakMsQ0FBQSxHQUFBLE1BSGUsRUFJK0IsMkJBQTlDLEdBQUEsQ0FBQyxlQUFELEVBQWlCLEVBQUEsR0FBRyxPQUFPLENBQUMsV0FBNUIsQ0FBQSxHQUFBLE1BSmUsRUFLK0Isc0JBQTlDLEdBQUEsQ0FBQyxVQUFELEVBQVksRUFBQSxHQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFmLENBQW9CLEdBQXBCLENBQUQsQ0FBZCxDQUFBLEdBQUEsTUFMZSxDQUFqQixFQU1LO0FBQUEsUUFBQSxJQUFBLEVBQU07QUFBQSxVQUNQLElBQUEsRUFBTSxvQ0FEQztTQUFOO09BTkwsQ0FTRSxDQUFDLElBVEgsQ0FTUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ0osVUFBQSxJQUFHLE9BQU8sQ0FBQyxZQUFYO21CQUNFLEtBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUNFLENBQUMsUUFBRCxDQURGLEVBRUU7QUFBQSxjQUFBLElBQUEsRUFBTTtBQUFBLGdCQUNKLElBQUEsRUFBTSx5Q0FERjtlQUFOO2FBRkYsQ0FLQSxDQUFDLElBTEQsQ0FLTSxTQUFBLEdBQUE7cUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLEVBREk7WUFBQSxDQUxOLEVBREY7V0FBQSxNQUFBO21CQVVFLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQVZGO1dBREk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVRSLEVBRFE7SUFBQSxDQU5WLENBQUE7O29CQUFBOztLQUZzQyxXQVB4QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/autopep8.coffee

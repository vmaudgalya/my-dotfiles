(function() {
  "use strict";
  var Beautifier, CoffeeFmt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = CoffeeFmt = (function(_super) {
    __extends(CoffeeFmt, _super);

    function CoffeeFmt() {
      return CoffeeFmt.__super__.constructor.apply(this, arguments);
    }

    CoffeeFmt.prototype.name = "coffee-fmt";

    CoffeeFmt.prototype.options = {
      CoffeeScript: {
        tab: [
          "indent_size", "indent_char", "indent_with_tabs", function(indentSize, indentChar, indentWithTabs) {
            if (indentWithTabs) {
              return "\t";
            }
            return Array(indentSize + 1).join(indentChar);
          }
        ]
      }
    };

    CoffeeFmt.prototype.beautify = function(text, language, options) {
      this.verbose('beautify', language, options);
      return new this.Promise(function(resolve, reject) {
        var e, fmt, results;
        options.newLine = "\n";
        fmt = require('coffee-fmt');
        try {
          results = fmt.format(text, options);
          return resolve(results);
        } catch (_error) {
          e = _error;
          return reject(e);
        }
      });
    };

    return CoffeeFmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY29mZmVlLWZtdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxxQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx3QkFBQSxJQUFBLEdBQU0sWUFBTixDQUFBOztBQUFBLHdCQUVBLE9BQUEsR0FBUztBQUFBLE1BRVAsWUFBQSxFQUNFO0FBQUEsUUFBQSxHQUFBLEVBQUs7VUFBQyxhQUFELEVBQ0gsYUFERyxFQUNZLGtCQURaLEVBRUgsU0FBQyxVQUFELEVBQWEsVUFBYixFQUF5QixjQUF6QixHQUFBO0FBQ0UsWUFBQSxJQUFlLGNBQWY7QUFBQSxxQkFBTyxJQUFQLENBQUE7YUFBQTttQkFDQSxLQUFBLENBQU0sVUFBQSxHQUFXLENBQWpCLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsVUFBekIsRUFGRjtVQUFBLENBRkc7U0FBTDtPQUhLO0tBRlQsQ0FBQTs7QUFBQSx3QkFhQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFVBQVQsRUFBcUIsUUFBckIsRUFBK0IsT0FBL0IsQ0FBQSxDQUFBO0FBQ0EsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBRWxCLFlBQUEsZUFBQTtBQUFBLFFBQUEsT0FBTyxDQUFDLE9BQVIsR0FBa0IsSUFBbEIsQ0FBQTtBQUFBLFFBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxZQUFSLENBRk4sQ0FBQTtBQUlBO0FBQ0UsVUFBQSxPQUFBLEdBQVUsR0FBRyxDQUFDLE1BQUosQ0FBVyxJQUFYLEVBQWlCLE9BQWpCLENBQVYsQ0FBQTtpQkFFQSxPQUFBLENBQVEsT0FBUixFQUhGO1NBQUEsY0FBQTtBQUtFLFVBREksVUFDSixDQUFBO2lCQUFBLE1BQUEsQ0FBTyxDQUFQLEVBTEY7U0FOa0I7TUFBQSxDQUFULENBQVgsQ0FGUTtJQUFBLENBYlYsQ0FBQTs7cUJBQUE7O0tBRHVDLFdBSHpDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/coffee-fmt.coffee

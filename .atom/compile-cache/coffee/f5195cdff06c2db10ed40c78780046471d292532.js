(function() {
  "use strict";
  var Beautifier, PugBeautify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PugBeautify = (function(_super) {
    __extends(PugBeautify, _super);

    function PugBeautify() {
      return PugBeautify.__super__.constructor.apply(this, arguments);
    }

    PugBeautify.prototype.name = "Pug Beautify";

    PugBeautify.prototype.options = {
      Jade: {
        fill_tab: [
          'indent_char', function(indent_char) {
            return indent_char === "\t";
          }
        ],
        omit_div: true,
        tab_size: "indent_size"
      }
    };

    PugBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var error, pugBeautify;
        pugBeautify = require("pug-beautify");
        try {
          return resolve(pugBeautify(text, options));
        } catch (_error) {
          error = _error;
          return reject(error);
        }
      });
    };

    return PugBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHVnLWJlYXV0aWZ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDBCQUFBLElBQUEsR0FBTSxjQUFOLENBQUE7O0FBQUEsMEJBQ0EsT0FBQSxHQUFTO0FBQUEsTUFFUCxJQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVTtVQUFDLGFBQUQsRUFBZ0IsU0FBQyxXQUFELEdBQUE7QUFFeEIsbUJBQVEsV0FBQSxLQUFlLElBQXZCLENBRndCO1VBQUEsQ0FBaEI7U0FBVjtBQUFBLFFBSUEsUUFBQSxFQUFVLElBSlY7QUFBQSxRQUtBLFFBQUEsRUFBVSxhQUxWO09BSEs7S0FEVCxDQUFBOztBQUFBLDBCQVlBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFFUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDbEIsWUFBQSxrQkFBQTtBQUFBLFFBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSLENBQWQsQ0FBQTtBQUNBO2lCQUNFLE9BQUEsQ0FBUSxXQUFBLENBQVksSUFBWixFQUFrQixPQUFsQixDQUFSLEVBREY7U0FBQSxjQUFBO0FBSUUsVUFGSSxjQUVKLENBQUE7aUJBQUEsTUFBQSxDQUFPLEtBQVAsRUFKRjtTQUZrQjtNQUFBLENBQVQsQ0FBWCxDQUZRO0lBQUEsQ0FaVixDQUFBOzt1QkFBQTs7S0FEeUMsV0FIM0MsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/pug-beautify.coffee

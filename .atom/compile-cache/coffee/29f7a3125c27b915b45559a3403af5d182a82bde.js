(function() {
  "use strict";
  var Beautifier, CoffeeFormatter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = CoffeeFormatter = (function(_super) {
    __extends(CoffeeFormatter, _super);

    function CoffeeFormatter() {
      return CoffeeFormatter.__super__.constructor.apply(this, arguments);
    }

    CoffeeFormatter.prototype.name = "Coffee Formatter";

    CoffeeFormatter.prototype.options = {
      CoffeeScript: true
    };

    CoffeeFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CF, curr, i, len, lines, p, result, resultArr;
        CF = require("coffee-formatter");
        lines = text.split("\n");
        resultArr = [];
        i = 0;
        len = lines.length;
        while (i < len) {
          curr = lines[i];
          p = CF.formatTwoSpaceOperator(curr);
          p = CF.formatOneSpaceOperator(p);
          p = CF.shortenSpaces(p);
          resultArr.push(p);
          i++;
        }
        result = resultArr.join("\n");
        return resolve(result);
      });
    };

    return CoffeeFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY29mZmVlLWZvcm1hdHRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSwyQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRXJCLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw4QkFBQSxJQUFBLEdBQU0sa0JBQU4sQ0FBQTs7QUFBQSw4QkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLFlBQUEsRUFBYyxJQURQO0tBRlQsQ0FBQTs7QUFBQSw4QkFNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBRVIsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBRWxCLFlBQUEsNkNBQUE7QUFBQSxRQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsa0JBQVIsQ0FBTCxDQUFBO0FBQUEsUUFDQSxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBRFIsQ0FBQTtBQUFBLFFBRUEsU0FBQSxHQUFZLEVBRlosQ0FBQTtBQUFBLFFBR0EsQ0FBQSxHQUFJLENBSEosQ0FBQTtBQUFBLFFBSUEsR0FBQSxHQUFNLEtBQUssQ0FBQyxNQUpaLENBQUE7QUFNQSxlQUFNLENBQUEsR0FBSSxHQUFWLEdBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxLQUFNLENBQUEsQ0FBQSxDQUFiLENBQUE7QUFBQSxVQUNBLENBQUEsR0FBSSxFQUFFLENBQUMsc0JBQUgsQ0FBMEIsSUFBMUIsQ0FESixDQUFBO0FBQUEsVUFFQSxDQUFBLEdBQUksRUFBRSxDQUFDLHNCQUFILENBQTBCLENBQTFCLENBRkosQ0FBQTtBQUFBLFVBR0EsQ0FBQSxHQUFJLEVBQUUsQ0FBQyxhQUFILENBQWlCLENBQWpCLENBSEosQ0FBQTtBQUFBLFVBSUEsU0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFmLENBSkEsQ0FBQTtBQUFBLFVBS0EsQ0FBQSxFQUxBLENBREY7UUFBQSxDQU5BO0FBQUEsUUFhQSxNQUFBLEdBQVMsU0FBUyxDQUFDLElBQVYsQ0FBZSxJQUFmLENBYlQsQ0FBQTtlQWNBLE9BQUEsQ0FBUSxNQUFSLEVBaEJrQjtNQUFBLENBQVQsQ0FBWCxDQUZRO0lBQUEsQ0FOVixDQUFBOzsyQkFBQTs7S0FGNkMsV0FIL0MsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/coffee-formatter.coffee

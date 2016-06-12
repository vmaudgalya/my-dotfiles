
/*
Requires http://golang.org/cmd/gofmt/
 */

(function() {
  "use strict";
  var Beautifier, Gofmt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Gofmt = (function(_super) {
    __extends(Gofmt, _super);

    function Gofmt() {
      return Gofmt.__super__.constructor.apply(this, arguments);
    }

    Gofmt.prototype.name = "gofmt";

    Gofmt.prototype.options = {
      Go: true
    };

    Gofmt.prototype.beautify = function(text, language, options) {
      return this.run("gofmt", [this.tempFile("input", text)]);
    };

    return Gofmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZ29mbXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFlBSkEsQ0FBQTtBQUFBLE1BQUEsaUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQiw0QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsb0JBQUEsSUFBQSxHQUFNLE9BQU4sQ0FBQTs7QUFBQSxvQkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLEVBQUEsRUFBSSxJQURHO0tBRlQsQ0FBQTs7QUFBQSxvQkFNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsQ0FDWixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEWSxDQUFkLEVBRFE7SUFBQSxDQU5WLENBQUE7O2lCQUFBOztLQURtQyxXQVByQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/gofmt.coffee

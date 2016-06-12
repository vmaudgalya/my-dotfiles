
/*
Requires https://github.com/jaspervdj/stylish-haskell
 */

(function() {
  "use strict";
  var Beautifier, StylishHaskell,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = StylishHaskell = (function(_super) {
    __extends(StylishHaskell, _super);

    function StylishHaskell() {
      return StylishHaskell.__super__.constructor.apply(this, arguments);
    }

    StylishHaskell.prototype.name = "stylish-haskell";

    StylishHaskell.prototype.options = {
      Haskell: true
    };

    StylishHaskell.prototype.beautify = function(text, language, options) {
      return this.run("stylish-haskell", [this.tempFile("input", text)]);
    };

    return StylishHaskell;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvc3R5bGlzaC1oYXNrZWxsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQSxZQUpBLENBQUE7QUFBQSxNQUFBLDBCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FMYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIscUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDZCQUFBLElBQUEsR0FBTSxpQkFBTixDQUFBOztBQUFBLDZCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsT0FBQSxFQUFTLElBREY7S0FGVCxDQUFBOztBQUFBLDZCQU1BLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLGlCQUFMLEVBQXdCLENBQ3RCLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQURzQixDQUF4QixFQURRO0lBQUEsQ0FOVixDQUFBOzswQkFBQTs7S0FENEMsV0FQOUMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/stylish-haskell.coffee

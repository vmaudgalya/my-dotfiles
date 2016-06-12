
/*
Requires https://github.com/bbatsov/rubocop
 */

(function() {
  "use strict";
  var Beautifier, Rubocop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Rubocop = (function(_super) {
    __extends(Rubocop, _super);

    function Rubocop() {
      return Rubocop.__super__.constructor.apply(this, arguments);
    }

    Rubocop.prototype.name = "Rubocop";

    Rubocop.prototype.options = {
      Ruby: {
        indent_size: true
      }
    };

    Rubocop.prototype.beautify = function(text, language, options) {
      var config, configFile, fs, path, tempFile, yaml;
      path = require('path');
      fs = require('fs');
      configFile = path.join(atom.project.getPaths()[0], ".rubocop.yml");
      if (fs.existsSync(configFile)) {
        this.debug("rubocop", config, fs.readFileSync(configFile, 'utf8'));
      } else {
        yaml = require("yaml-front-matter");
        config = {
          "Style/IndentationWidth": {
            "Width": options.indent_size
          }
        };
        configFile = this.tempFile("rubocop-config", yaml.safeDump(config));
        this.debug("rubocop", config, configFile);
      }
      return this.run("rubocop", ["--auto-correct", "--config", configFile, tempFile = this.tempFile("temp", text)], {
        ignoreReturnCode: true
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return Rubocop;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcnVib2NvcC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsWUFKQSxDQUFBO0FBQUEsTUFBQSxtQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxJQUFBLEdBQU0sU0FBTixDQUFBOztBQUFBLHNCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsSUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsSUFBYjtPQUZLO0tBRlQsQ0FBQTs7QUFBQSxzQkFPQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBRVIsVUFBQSw0Q0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTtBQUFBLE1BQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTtBQUFBLE1BR0EsVUFBQSxHQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLGNBQXRDLENBSGIsQ0FBQTtBQUtBLE1BQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQsQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxTQUFQLEVBQWtCLE1BQWxCLEVBQTBCLEVBQUUsQ0FBQyxZQUFILENBQWdCLFVBQWhCLEVBQTRCLE1BQTVCLENBQTFCLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsbUJBQVIsQ0FBUCxDQUFBO0FBQUEsUUFFQSxNQUFBLEdBQVM7QUFBQSxVQUNQLHdCQUFBLEVBQ0U7QUFBQSxZQUFBLE9BQUEsRUFBUyxPQUFPLENBQUMsV0FBakI7V0FGSztTQUZULENBQUE7QUFBQSxRQU9BLFVBQUEsR0FBYSxJQUFDLENBQUEsUUFBRCxDQUFVLGdCQUFWLEVBQTRCLElBQUksQ0FBQyxRQUFMLENBQWMsTUFBZCxDQUE1QixDQVBiLENBQUE7QUFBQSxRQVFBLElBQUMsQ0FBQSxLQUFELENBQU8sU0FBUCxFQUFrQixNQUFsQixFQUEwQixVQUExQixDQVJBLENBSEY7T0FMQTthQWtCQSxJQUFDLENBQUEsR0FBRCxDQUFLLFNBQUwsRUFBZ0IsQ0FDZCxnQkFEYyxFQUVkLFVBRmMsRUFFRixVQUZFLEVBR2QsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixJQUFsQixDQUhHLENBQWhCLEVBSUs7QUFBQSxRQUFDLGdCQUFBLEVBQWtCLElBQW5CO09BSkwsQ0FLRSxDQUFDLElBTEgsQ0FLUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQURJO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FMUixFQXBCUTtJQUFBLENBUFYsQ0FBQTs7bUJBQUE7O0tBRHFDLFdBUHZDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/rubocop.coffee


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
        indent_size: true,
        rubocop_path: true
      }
    };

    Rubocop.prototype.beautify = function(text, language, options) {
      return this.Promise.all([options.rubocop_path ? this.which(options.rubocop_path) : void 0, this.which('rubocop')]).then((function(_this) {
        return function(paths) {
          var config, configFile, fs, path, rubocopPath, tempFile, yaml, _;
          _this.debug('rubocop paths', paths);
          _ = require('lodash');
          path = require('path');
          rubocopPath = _.find(paths, function(p) {
            return p && path.isAbsolute(p);
          });
          _this.verbose('rubocopPath', rubocopPath);
          _this.debug('rubocopPath', rubocopPath, paths);
          configFile = path.join(atom.project.getPaths()[0], ".rubocop.yml");
          fs = require('fs');
          if (fs.existsSync(configFile)) {
            _this.debug("rubocop", config, fs.readFileSync(configFile, 'utf8'));
          } else {
            yaml = require("yaml-front-matter");
            config = {
              "Style/IndentationWidth": {
                "Width": options.indent_size
              }
            };
            configFile = _this.tempFile("rubocop-config", yaml.safeDump(config));
            _this.debug("rubocop", config, configFile);
          }
          if (rubocopPath != null) {
            return _this.run(rubocopPath, ["--auto-correct", "--config", configFile, tempFile = _this.tempFile("temp", text)], {
              ignoreReturnCode: true
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.run("rubocop", ["--auto-correct", "--config", configFile, tempFile = _this.tempFile("temp", text)], {
              ignoreReturnCode: true
            }).then(function() {
              return _this.readFile(tempFile);
            });
          }
        };
      })(this));
    };

    return Rubocop;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcnVib2NvcC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsWUFKQSxDQUFBO0FBQUEsTUFBQSxtQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxJQUFBLEdBQU0sU0FBTixDQUFBOztBQUFBLHNCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsSUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsSUFBYjtBQUFBLFFBQ0EsWUFBQSxFQUFjLElBRGQ7T0FGSztLQUZULENBQUE7O0FBQUEsc0JBUUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTthQUNSLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLENBQ3FCLE9BQU8sQ0FBQyxZQUF4QyxHQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBTyxDQUFDLFlBQWYsQ0FBQSxHQUFBLE1BRFcsRUFFWCxJQUFDLENBQUEsS0FBRCxDQUFPLFNBQVAsQ0FGVyxDQUFiLENBR0UsQ0FBQyxJQUhILENBR1EsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ04sY0FBQSw0REFBQTtBQUFBLFVBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxlQUFQLEVBQXdCLEtBQXhCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTtBQUFBLFVBRUEs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/rubocop.coffee

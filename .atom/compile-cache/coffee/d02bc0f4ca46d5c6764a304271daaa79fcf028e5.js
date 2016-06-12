
/*
Requires https://github.com/FriendsOfPHP/phpcbf
 */

(function() {
  "use strict";
  var Beautifier, PHPCBF,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PHPCBF = (function(_super) {
    __extends(PHPCBF, _super);

    function PHPCBF() {
      return PHPCBF.__super__.constructor.apply(this, arguments);
    }

    PHPCBF.prototype.name = "PHPCBF";

    PHPCBF.prototype.options = {
      _: {
        standard: [
          "standard", function(standard) {
            if (standard) {
              return standard;
            } else {
              return "PEAR";
            }
          }
        ]
      },
      PHP: true
    };

    PHPCBF.prototype.beautify = function(text, language, options) {
      var isWin, tempFile;
      this.debug('phpcbf', options);
      isWin = this.isWindows;
      if (isWin) {
        return this.Promise.all([options.phpcbf_path ? this.which(options.phpcbf_path) : void 0, this.which('phpcbf')]).then((function(_this) {
          return function(paths) {
            var path, phpcbfPath, tempFile, _;
            _this.debug('phpcbf paths', paths);
            _ = require('lodash');
            path = require('path');
            phpcbfPath = _.find(paths, function(p) {
              return p && path.isAbsolute(p);
            });
            _this.verbose('phpcbfPath', phpcbfPath);
            _this.debug('phpcbfPath', phpcbfPath, paths);
            if (phpcbfPath != null) {
              return _this.run("php", [phpcbfPath, "--no-patch", options.standard ? "--standard=" + options.standard : void 0, tempFile = _this.tempFile("temp", text)], {
                ignoreReturnCode: true,
                help: {
                  link: "http://php.net/manual/en/install.php"
                }
              }).then(function() {
                return _this.readFile(tempFile);
              });
            } else {
              _this.verbose('phpcbf not found!');
              return _this.Promise.reject(_this.commandNotFoundError('phpcbf', {
                link: "https://github.com/squizlabs/PHP_CodeSniffer",
                program: "phpcbf.phar",
                pathOption: "PHPCBF Path"
              }));
            }
          };
        })(this));
      } else {
        return this.run("phpcbf", ["--no-patch", options.standard ? "--standard=" + options.standard : void 0, tempFile = this.tempFile("temp", text)], {
          ignoreReturnCode: true,
          help: {
            link: "https://github.com/squizlabs/PHP_CodeSniffer"
          }
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return PHPCBF;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcGhwY2JmLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQSxZQUpBLENBQUE7QUFBQSxNQUFBLGtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FMYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLElBQUEsR0FBTSxRQUFOLENBQUE7O0FBQUEscUJBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxDQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVTtVQUFDLFVBQUQsRUFBYSxTQUFDLFFBQUQsR0FBQTtBQUNyQixZQUFBLElBQUksUUFBSjtxQkFDRSxTQURGO2FBQUEsTUFBQTtxQkFDZ0IsT0FEaEI7YUFEcUI7VUFBQSxDQUFiO1NBQVY7T0FGSztBQUFBLE1BTVAsR0FBQSxFQUFLLElBTkU7S0FGVCxDQUFBOztBQUFBLHFCQVdBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixVQUFBLGVBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sUUFBUCxFQUFpQixPQUFqQixDQUFBLENBQUE7QUFBQSxNQUVBLEtBQUEsR0FBUSxJQUFDLENBQUEsU0FGVCxDQUFBO0FBR0EsTUFBQSxJQUFHLEtBQUg7ZUFFRSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUNvQixPQUFPLENBQUMsV0FBdkMsR0FBQSxJQUFDLENBQUEsS0FBRCxDQUFPLE9BQU8sQ0FBQyxXQUFmLENBQUEsR0FBQSxN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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/phpcbf.coffee

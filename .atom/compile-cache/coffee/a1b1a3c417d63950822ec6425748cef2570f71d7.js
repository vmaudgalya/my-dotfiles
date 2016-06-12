
/*
Requires https://github.com/FriendsOfPHP/PHP-CS-Fixer
 */

(function() {
  "use strict";
  var Beautifier, PHPCSFixer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PHPCSFixer = (function(_super) {
    __extends(PHPCSFixer, _super);

    function PHPCSFixer() {
      return PHPCSFixer.__super__.constructor.apply(this, arguments);
    }

    PHPCSFixer.prototype.name = "PHP-CS-Fixer";

    PHPCSFixer.prototype.options = {
      PHP: true
    };

    PHPCSFixer.prototype.beautify = function(text, language, options) {
      var isWin, tempFile;
      this.debug('php-cs-fixer', options);
      isWin = this.isWindows;
      if (isWin) {
        return this.Promise.all([options.cs_fixer_path ? this.which(options.cs_fixer_path) : void 0, this.which('php-cs-fixer')]).then((function(_this) {
          return function(paths) {
            var path, phpCSFixerPath, tempFile, _;
            _this.debug('php-cs-fixer paths', paths);
            _ = require('lodash');
            path = require('path');
            phpCSFixerPath = _.find(paths, function(p) {
              return p && path.isAbsolute(p);
            });
            _this.verbose('phpCSFixerPath', phpCSFixerPath);
            _this.debug('phpCSFixerPath', phpCSFixerPath, paths);
            if (phpCSFixerPath != null) {
              return _this.run("php", [phpCSFixerPath, "fix", options.level ? "--level=" + options.level : void 0, options.fixers ? "--fixers=" + options.fixers : void 0, tempFile = _this.tempFile("temp", text)], {
                ignoreReturnCode: true,
                help: {
                  link: "http://php.net/manual/en/install.php"
                }
              }).then(function() {
                return _this.readFile(tempFile);
              });
            } else {
              _this.verbose('php-cs-fixer not found!');
              return _this.Promise.reject(_this.commandNotFoundError('php-cs-fixer', {
                link: "https://github.com/FriendsOfPHP/PHP-CS-Fixer",
                program: "php-cs-fixer.phar",
                pathOption: "PHP - CS Fixer Path"
              }));
            }
          };
        })(this));
      } else {
        return this.run("php-cs-fixer", ["fix", options.level ? "--level=" + options.level : void 0, options.fixers ? "--fixers=" + options.fixers : void 0, tempFile = this.tempFile("temp", text)], {
          ignoreReturnCode: true,
          help: {
            link: "https://github.com/FriendsOfPHP/PHP-CS-Fixer"
          }
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return PHPCSFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcGhwLWNzLWZpeGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQSxZQUpBLENBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FMYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLElBQUEsR0FBTSxjQUFOLENBQUE7O0FBQUEseUJBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxHQUFBLEVBQUssSUFERTtLQUZULENBQUE7O0FBQUEseUJBTUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLFVBQUEsZUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxjQUFQLEVBQXVCLE9BQXZCLENBQUEsQ0FBQTtBQUFBLE1BRUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxTQUZULENBQUE7QUFHQSxNQUFBLElBQUcsS0FBSDtlQUVFLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLENBQ3NCLE9BQU8sQ0FBQyxhQUF6QyxHQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBTyxDQUFDLGFBQWYsQ0FBQSxHQUFBLE1BRFcsRUFFWCxJQUFDLENBQUEsS0FBRCxDQUFPLGNBQVAsQ0FGVyxDQUFiLENBR0UsQ0FBQyxJQUhILENBR1EsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEtBQUQsR0FBQTtBQUNOLGdCQUFBLGlDQUFBO0FBQUEsWUFBQSxLQUFDLENBQUEsS0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/php-cs-fixer.coffee

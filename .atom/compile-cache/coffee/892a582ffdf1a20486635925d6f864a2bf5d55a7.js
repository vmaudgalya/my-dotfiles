(function() {
  "use strict";
  var Beautifier, LatexBeautify, fs, path, temp,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require("fs");

  temp = require("temp").track();

  module.exports = LatexBeautify = (function(_super) {
    __extends(LatexBeautify, _super);

    function LatexBeautify() {
      return LatexBeautify.__super__.constructor.apply(this, arguments);
    }

    LatexBeautify.prototype.name = "Latex Beautify";

    LatexBeautify.prototype.options = {
      LaTeX: true
    };

    LatexBeautify.prototype.buildConfigFile = function(options) {
      var config, delim, indentChar, _i, _len, _ref;
      indentChar = options.indent_char;
      if (options.indent_with_tabs) {
        indentChar = "\\t";
      }
      config = "defaultIndent: \"" + indentChar + "\"\nalwaysLookforSplitBraces: " + (+options.always_look_for_split_braces) + "\nalwaysLookforSplitBrackets: " + (+options.always_look_for_split_brackets) + "\nindentPreamble: " + (+options.indent_preamble) + "\nremoveTrailingWhitespace: " + (+options.remove_trailing_whitespace) + "\nlookForAlignDelims:\n";
      _ref = options.align_columns_in_environments;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        delim = _ref[_i];
        config += "\t" + delim + ": 1\n";
      }
      return config;
    };

    LatexBeautify.prototype.setUpDir = function(dirPath, text, config) {
      this.texFile = path.join(dirPath, "latex.tex");
      fs.writeFile(this.texFile, text, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.configFile = path.join(dirPath, "localSettings.yaml");
      fs.writeFile(this.configFile, config, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.logFile = path.join(dirPath, "indent.log");
      return fs.writeFile(this.logFile, "", function(err) {
        if (err) {
          return reject(err);
        }
      });
    };

    LatexBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        return temp.mkdir("latex", function(err, dirPath) {
          if (err) {
            return reject(err);
          }
          return resolve(dirPath);
        });
      }).then((function(_this) {
        return function(dirPath) {
          var run;
          _this.setUpDir(dirPath, text, _this.buildConfigFile(options));
          return run = _this.run("latexindent", ["-o", "-s", "-l", "-c=" + dirPath, _this.texFile, _this.texFile], {
            help: {
              link: "https://github.com/cmhughes/latexindent.pl"
            }
          });
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(_this.texFile);
        };
      })(this));
    };

    return LatexBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvbGF0ZXgtYmVhdXRpZnkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEseUNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUpQLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixvQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNEJBQUEsSUFBQSxHQUFNLGdCQUFOLENBQUE7O0FBQUEsNEJBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxLQUFBLEVBQU8sSUFEQTtLQUZULENBQUE7O0FBQUEsNEJBUUEsZUFBQSxHQUFpQixTQUFDLE9BQUQsR0FBQTtBQUNmLFVBQUEseUNBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxPQUFPLENBQUMsV0FBckIsQ0FBQTtBQUNBLE1BQUEsSUFBRyxPQUFPLENBQUMsZ0JBQVg7QUFDRSxRQUFBLFVBQUEsR0FBYSxLQUFiLENBREY7T0FEQTtBQUFBLE1BSUEsTUFBQSxHQUNKLG1CQUFBLEdBQW1CLFVBQW5CLEdBQThCLGdDQUE5QixHQUNjLENBQUMsQ0FBQSxPQUFRLENBQUMsNEJBQVYsQ0FEZCxHQUNxRCxnQ0FEckQsR0FFRyxDQUFDLENBQUEsT0FBUSxDQUFDLDhCQUFWLENBRkgsR0FFNEMs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/latex-beautify.coffee


/*
Requires https://github.com/google/yapf
 */

(function() {
  "use strict";
  var Beautifier, Yapf,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Yapf = (function(_super) {
    __extends(Yapf, _super);

    function Yapf() {
      return Yapf.__super__.constructor.apply(this, arguments);
    }

    Yapf.prototype.name = "yapf";

    Yapf.prototype.options = {
      Python: false
    };

    Yapf.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("yapf", ["-i", tempFile = this.tempFile("input", text)], {
        help: {
          link: "https://github.com/google/yapf"
        },
        ignoreReturnCode: true
      }).then((function(_this) {
        return function() {
          if (options.sort_imports) {
            return _this.run("isort", [tempFile], {
              help: {
                link: "https://github.com/timothycrosley/isort"
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.readFile(tempFile);
          }
        };
      })(this));
    };

    return Yapf;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMveWFwZi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsWUFKQSxDQUFBO0FBQUEsTUFBQSxnQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRXJCLDJCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxtQkFBQSxJQUFBLEdBQU0sTUFBTixDQUFBOztBQUFBLG1CQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsTUFBQSxFQUFRLEtBREQ7S0FGVCxDQUFBOztBQUFBLG1CQU1BLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixVQUFBLFFBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLE1BQUwsRUFBYSxDQUNYLElBRFcsRUFFWCxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRkEsQ0FBYixFQUdLO0FBQUEsUUFBQSxJQUFBLEVBQU07QUFBQSxVQUNQLElBQUEsRUFBTSxnQ0FEQztTQUFOO0FBQUEsUUFFQSxnQkFBQSxFQUFrQixJQUZsQjtPQUhMLENBTUUsQ0FBQyxJQU5ILENBTVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNKLFVBQUEsSUFBRyxPQUFPLENBQUMsWUFBWDttQkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFDRSxDQUFDLFFBQUQsQ0FERixFQUVFO0FBQUEsY0FBQSxJQUFBLEVBQU07QUFBQSxnQkFDSixJQUFBLEVBQU0seUNBREY7ZUFBTjthQUZGLENBS0EsQ0FBQyxJQUxELENBS00sU0FBQSxHQUFBO3FCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQURJO1lBQUEsQ0FMTixFQURGO1dBQUEsTUFBQTttQkFVRSxLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVYsRUFWRjtXQURJO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOUixFQURRO0lBQUEsQ0FOVixDQUFBOztnQkFBQTs7S0FGa0MsV0FQcEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/yapf.coffee

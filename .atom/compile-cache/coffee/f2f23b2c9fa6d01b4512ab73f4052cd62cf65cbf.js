
/*
Requires https://github.com/nrc/rustfmt
 */

(function() {
  "use strict";
  var Beautifier, Rustfmt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Rustfmt = (function(_super) {
    __extends(Rustfmt, _super);

    function Rustfmt() {
      return Rustfmt.__super__.constructor.apply(this, arguments);
    }

    Rustfmt.prototype.name = "rustfmt";

    Rustfmt.prototype.options = {
      Rust: true
    };

    Rustfmt.prototype.beautify = function(text, language, options) {
      var program, tmpFile;
      program = options.rustfmt_path || "rustfmt";
      return this.run(program, [tmpFile = this.tempFile("tmp", text)], {
        help: {
          link: "https://github.com/nrc/rustfmt",
          program: "rustfmt",
          pathOption: "Rust - Rustfmt Path"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tmpFile);
        };
      })(this));
    };

    return Rustfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcnVzdGZtdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsWUFKQSxDQUFBO0FBQUEsTUFBQSxtQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRXJCLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxJQUFBLEdBQU0sU0FBTixDQUFBOztBQUFBLHNCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsSUFBQSxFQUFNLElBREM7S0FGVCxDQUFBOztBQUFBLHNCQU1BLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixVQUFBLGdCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLFlBQVIsSUFBd0IsU0FBbEMsQ0FBQTthQUNBLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLENBQ1osT0FBQSxHQUFVLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQUFpQixJQUFqQixDQURFLENBQWQsRUFFSztBQUFBLFFBQUEsSUFBQSxFQUFNO0FBQUEsVUFDUCxJQUFBLEVBQU0sZ0NBREM7QUFBQSxVQUVQLE9BQUEsRUFBUyxTQUZGO0FBQUEsVUFHUCxVQUFBLEVBQVkscUJBSEw7U0FBTjtPQUZMLENBT0UsQ0FBQyxJQVBILENBT1EsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFESTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUFIsRUFGUTtJQUFBLENBTlYsQ0FBQTs7bUJBQUE7O0tBRnFDLFdBUHZDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/rustfmt.coffee


/*
Requires https://www.gnu.org/software/emacs/
 */

(function() {
  "use strict";
  var Beautifier, FortranBeautifier, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('../beautifier');

  path = require("path");

  module.exports = FortranBeautifier = (function(_super) {
    __extends(FortranBeautifier, _super);

    function FortranBeautifier() {
      return FortranBeautifier.__super__.constructor.apply(this, arguments);
    }

    FortranBeautifier.prototype.name = "Fortran Beautifier";

    FortranBeautifier.prototype.options = {
      Fortran: true
    };

    FortranBeautifier.prototype.beautify = function(text, language, options) {
      var args, emacs_path, emacs_script_path, tempFile;
      this.debug('fortran-beautifier', options);
      emacs_path = options.emacs_path;
      emacs_script_path = options.emacs_script_path;
      if (!emacs_script_path) {
        emacs_script_path = path.resolve(__dirname, "emacs-fortran-formating-script.lisp");
      }
      this.debug('fortran-beautifier', 'emacs script path: ' + emacs_script_path);
      args = ['--batch', '-l', emacs_script_path, '-f', 'f90-batch-indent-region', tempFile = this.tempFile("temp", text)];
      if (emacs_path) {
        return this.run(emacs_path, args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      } else {
        return this.run("emacs", args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return FortranBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZm9ydHJhbi1iZWF1dGlmaWVyL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQSxZQUpBLENBQUE7QUFBQSxNQUFBLG1DQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FMYixDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTlAsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxnQ0FBQSxJQUFBLEdBQU0sb0JBQU4sQ0FBQTs7QUFBQSxnQ0FFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLE9BQUEsRUFBUyxJQURGO0tBRlQsQ0FBQTs7QUFBQSxnQ0FNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsVUFBQSw2Q0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxvQkFBUCxFQUE2QixPQUE3QixDQUFBLENBQUE7QUFBQSxNQUVBLFVBQUEsR0FBYSxPQUFPLENBQUMsVUFGckIsQ0FBQTtBQUFBLE1BR0EsaUJBQUEsR0FBb0IsT0FBTyxDQUFDLGlCQUg1QixDQUFBO0FBS0EsTUFBQSxJQUFHLENBQUEsaUJBQUg7QUFDRSxRQUFBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixxQ0FBeEIsQ0FBcEIsQ0FERjtPQUxBO0FBQUEsTUFRQSxJQUFDLENBQUEsS0FBRCxDQUFPLG9CQUFQLEVBQTZCLHFCQUFBLEdBQXdCLGlCQUFyRCxDQVJBLENBQUE7QUFBQSxNQVVBLElBQUEsR0FBTyxDQUNMLFNBREssRUFFTCxJQUZLLEVBR0wsaUJBSEssRUFJTCxJQUpLLEVBS0wseUJBTEssRUFNTCxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLEVBQWtCLElBQWxCLENBTk4sQ0FWUCxDQUFBO0FBbUJBLE1BQUEsSUFBRyxVQUFIO2VBQ0UsSUFBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMLEVBQWlCLElBQWpCLEVBQXVCO0FBQUEsVUFBQyxnQkFBQSxFQUFrQixLQUFuQjtTQUF2QixDQUNFLENBQUMsSUFESCxDQUNRLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQURJO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUixFQURGO09BQUEsTUFBQTtlQU1FLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLElBQWQsRUFBb0I7QUFBQSxVQUFDLGdCQUFBLEVBQWtCLEtBQW5CO1NBQXBCLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLEVBREk7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURSLEVBTkY7T0FwQlE7SUFBQSxDQU5WLENBQUE7OzZCQUFBOztLQUQrQyxXQVJqRCxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/fortran-beautifier/index.coffee

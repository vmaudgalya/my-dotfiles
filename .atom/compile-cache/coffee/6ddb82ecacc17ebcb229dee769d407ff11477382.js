(function() {
  "use strict";
  var Beautifier, Checker, JSCSFixer, checker, cliConfig,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  Checker = null;

  cliConfig = null;

  checker = null;

  module.exports = JSCSFixer = (function(_super) {
    __extends(JSCSFixer, _super);

    function JSCSFixer() {
      return JSCSFixer.__super__.constructor.apply(this, arguments);
    }

    JSCSFixer.prototype.name = "JSCS Fixer";

    JSCSFixer.prototype.options = {
      JavaScript: false
    };

    JSCSFixer.prototype.beautify = function(text, language, options) {
      this.verbose("JSCS Fixer language " + language);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var config, editor, err, path, result;
          try {
            if (checker == null) {
              cliConfig = require('jscs/lib/cli-config');
              Checker = require('jscs');
              checker = new Checker();
              checker.registerDefaultRules();
            }
            editor = atom.workspace.getActiveTextEditor();
            path = editor != null ? editor.getPath() : void 0;
            config = path != null ? cliConfig.load(void 0, atom.project.relativizePath(path)[0]) : void 0;
            if (config == null) {
              throw new Error("No JSCS config found.");
            }
            checker.configure(config);
            result = checker.fixString(text, path);
            if (result.errors.getErrorCount() > 0) {
              _this.error(result.errors.getErrorList().reduce(function(res, err) {
                return "" + res + "<br> Line " + err.line + ": " + err.message;
              }, "JSCS Fixer error:"));
            }
            return resolve(result.output);
          } catch (_error) {
            err = _error;
            _this.error("JSCS Fixer error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSCSFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvanNjcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxrREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxJQUhWLENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksSUFKWixDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFVLElBTFYsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx3QkFBQSxJQUFBLEdBQU0sWUFBTixDQUFBOztBQUFBLHdCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsVUFBQSxFQUFZLEtBREw7S0FGVCxDQUFBOztBQUFBLHdCQU1BLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxPQUFELENBQVUsc0JBQUEsR0FBc0IsUUFBaEMsQ0FBQSxDQUFBO0FBQ0EsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNsQixjQUFBLGlDQUFBO0FBQUE7QUFDRSxZQUFBLElBQUksZUFBSjtBQUNFLGNBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxxQkFBUixDQUFaLENBQUE7QUFBQSxjQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsTUFBUixDQURWLENBQUE7QUFBQSxjQUVBLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBQSxDQUZkLENBQUE7QUFBQSxjQUdBLE9BQU8sQ0FBQyxvQkFBUixDQUFBLENBSEEsQ0FERjthQUFBO0FBQUEsWUFLQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBTFQsQ0FBQTtBQUFBLFlBTUEsSUFBQSxHQUFVLGNBQUgsR0FBZ0IsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFoQixHQUFzQyxNQU43QyxDQUFBO0FBQUEsWUFPQSxNQUFBLEdBQVksWUFBSCxHQUFjLFNBQVMsQ0FBQyxJQUFWLENBQWUsTUFBZixFQUEwQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsSUFBNUIsQ0FBa0MsQ0FBQSxDQUFBLENBQTVELENBQWQsR0FBbUYsTUFQNUYsQ0FBQTtBQVFBLFlBQUEsSUFBSSxjQUFKO0FBQ0Usb0JBQVUsSUFBQSxLQUFBLENBQU0sdUJBQU4sQ0FBVixDQURGO2FBUkE7QUFBQSxZQVVBLE9BQU8sQ0FBQyxTQUFSLENBQWtCLE1BQWxCLENBVkEsQ0FBQTtBQUFBLFlBV0EsTUFBQSxHQUFTLE9BQU8sQ0FBQyxTQUFSLENBQWtCLElBQWxCLEVBQXdCLElBQXhCLENBWFQsQ0FBQTtBQVlBLFlBQUEsSUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWQsQ0FBQSxDQUFBLEdBQWdDLENBQW5DO0FBQ0UsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBZCxDQUFBLENBQTRCLENBQUMsTUFBN0IsQ0FBb0MsU0FBQyxHQUFELEVBQU0sR0FBTixHQUFBO3VCQUN6QyxFQUFBLEdBQUcsR0FBSCxHQUFPLFlBQVAsR0FBbUIsR0FBRyxDQUFDLElBQXZCLEdBQTRCLElBQTVCLEdBQWdDLEdBQUcsQ0FBQyxRQURLO2NBQUEsQ0FBcEMsRUFFTCxtQkFGSyxDQUFQLENBQUEsQ0FERjthQVpBO21CQWlCQSxPQUFBLENBQVEsTUFBTSxDQUFDLE1BQWYsRUFsQkY7V0FBQSxjQUFBO0FBcUJFLFlBREksWUFDSixDQUFBO0FBQUEsWUFBQSxLQUFDLENBQUEsS0FBRCxDQUFRLG9CQUFBLEdBQW9CLEdBQTVCLENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sR0FBUCxFQXRCRjtXQURrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQsQ0FBWCxDQUZRO0lBQUEsQ0FOVixDQUFBOztxQkFBQTs7S0FEdUMsV0FQekMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/jscs.coffee

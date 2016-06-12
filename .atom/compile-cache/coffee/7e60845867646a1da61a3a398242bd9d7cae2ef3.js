
/*
Requires [perltidy](http://perltidy.sourceforge.net)
 */

(function() {
  "use strict";
  var Beautifier, PerlTidy,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PerlTidy = (function(_super) {
    __extends(PerlTidy, _super);

    function PerlTidy() {
      return PerlTidy.__super__.constructor.apply(this, arguments);
    }

    PerlTidy.prototype.name = "Perltidy";

    PerlTidy.prototype.options = {
      Perl: true
    };

    PerlTidy.prototype.cli = function(options) {
      if (options.perltidy_path == null) {
        return new Error("'Perl Perltidy Path' not set!" + " Please set this in the Atom Beautify package settings.");
      } else {
        return options.perltidy_path;
      }
    };

    PerlTidy.prototype.beautify = function(text, language, options) {
      var _ref;
      return this.run("perltidy", ['--standard-output', '--standard-error-output', '--quiet', ((_ref = options.perltidy_profile) != null ? _ref.length : void 0) ? "--profile=" + options.perltidy_profile : void 0, this.tempFile("input", text)], {
        help: {
          link: "http://perltidy.sourceforge.net/"
        }
      });
    };

    return PerlTidy;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcGVybHRpZHkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUdBLFlBSEEsQ0FBQTtBQUFBLE1BQUEsb0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUpiLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsdUJBQUEsSUFBQSxHQUFNLFVBQU4sQ0FBQTs7QUFBQSx1QkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLElBQUEsRUFBTSxJQURDO0tBRlQsQ0FBQTs7QUFBQSx1QkFNQSxHQUFBLEdBQUssU0FBQyxPQUFELEdBQUE7QUFDSCxNQUFBLElBQU8sNkJBQVA7QUFDRSxlQUFXLElBQUEsS0FBQSxDQUFNLCtCQUFBLEdBQ2YseURBRFMsQ0FBWCxDQURGO09BQUEsTUFBQTtBQUlFLGVBQU8sT0FBTyxDQUFDLGFBQWYsQ0FKRjtPQURHO0lBQUEsQ0FOTCxDQUFBOztBQUFBLHVCQWFBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixVQUFBLElBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLFVBQUwsRUFBaUIsQ0FDZixtQkFEZSxFQUVmLHlCQUZlLEVBR2YsU0FIZSxtREFJb0QsQ0FBRSxnQkFBckUsR0FBQyxZQUFBLEdBQVksT0FBTyxDQUFDLGdCQUFyQixHQUFBLE1BSmUsRUFLZixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FMZSxDQUFqQixFQU1LO0FBQUEsUUFBQSxJQUFBLEVBQU07QUFBQSxVQUNQLElBQUEsRUFBTSxrQ0FEQztTQUFOO09BTkwsRUFEUTtJQUFBLENBYlYsQ0FBQTs7b0JBQUE7O0tBRHNDLFdBTnhDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/perltidy.coffee

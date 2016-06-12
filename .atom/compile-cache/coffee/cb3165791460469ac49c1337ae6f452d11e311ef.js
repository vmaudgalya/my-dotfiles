
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Autopep8, Beautifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Autopep8 = (function(_super) {
    __extends(Autopep8, _super);

    function Autopep8() {
      return Autopep8.__super__.constructor.apply(this, arguments);
    }

    Autopep8.prototype.name = "autopep8";

    Autopep8.prototype.options = {
      Python: true
    };

    Autopep8.prototype.beautify = function(text, language, options) {
      return this.run("autopep8", [this.tempFile("input", text), options.max_line_length != null ? ["--max-line-length", "" + options.max_line_length] : void 0, options.indent_size != null ? ["--indent-size", "" + options.indent_size] : void 0, options.ignore != null ? ["--ignore", "" + (options.ignore.join(','))] : void 0], {
        help: {
          link: "https://github.com/hhatto/autopep8"
        }
      });
    };

    return Autopep8;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYXV0b3BlcDguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFlBSkEsQ0FBQTtBQUFBLE1BQUEsb0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsdUJBQUEsSUFBQSxHQUFNLFVBQU4sQ0FBQTs7QUFBQSx1QkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLE1BQUEsRUFBUSxJQUREO0tBRlQsQ0FBQTs7QUFBQSx1QkFNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO2FBRVIsSUFBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMLEVBQWlCLENBQ2YsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRGUsRUFFd0MsK0JBQXZELEdBQUEsQ0FBQyxtQkFBRCxFQUFzQixFQUFBLEdBQUcsT0FBTyxDQUFDLGVBQWpDLENBQUEsR0FBQSxNQUZlLEVBRytCLDJCQUE5QyxHQUFBLENBQUMsZUFBRCxFQUFpQixFQUFBLEdBQUcsT0FBTyxDQUFDLFdBQTVCLENBQUEsR0FBQSxNQUhlLEVBSStCLHNCQUE5QyxHQUFBLENBQUMsVUFBRCxFQUFZLEVBQUEsR0FBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBZixDQUFvQixHQUFwQixDQUFELENBQWQsQ0FBQSxHQUFBLE1BSmUsQ0FBakIsRUFLSztBQUFBLFFBQUEsSUFBQSxFQUFNO0FBQUEsVUFDVCxJQUFBLEVBQU0sb0NBREc7U0FBTjtPQUxMLEVBRlE7SUFBQSxDQU5WLENBQUE7O29CQUFBOztLQUZzQyxXQVB4QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/autopep8.coffee


/*
Requires https://github.com/threedaymonk/htmlbeautifier
 */

(function() {
  "use strict";
  var Beautifier, HTMLBeautifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = HTMLBeautifier = (function(_super) {
    __extends(HTMLBeautifier, _super);

    function HTMLBeautifier() {
      return HTMLBeautifier.__super__.constructor.apply(this, arguments);
    }

    HTMLBeautifier.prototype.name = "HTML Beautifier";

    HTMLBeautifier.prototype.options = {
      ERB: {
        indent_size: true
      }
    };

    HTMLBeautifier.prototype.beautify = function(text, language, options) {
      var tempFile;
      console.log('erb', options);
      return this.run("htmlbeautifier", ["--tab-stops", options.indent_size, tempFile = this.tempFile("temp", text)]).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return HTMLBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvaHRtbGJlYXV0aWZpZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFlBSkEsQ0FBQTtBQUFBLE1BQUEsMEJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNkJBQUEsSUFBQSxHQUFNLGlCQUFOLENBQUE7O0FBQUEsNkJBQ0EsT0FBQSxHQUFTO0FBQUEsTUFDUCxHQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSxJQUFiO09BRks7S0FEVCxDQUFBOztBQUFBLDZCQU1BLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixVQUFBLFFBQUE7QUFBQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBWixFQUFtQixPQUFuQixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsR0FBRCxDQUFLLGdCQUFMLEVBQXVCLENBQ3JCLGFBRHFCLEVBQ04sT0FBTyxDQUFDLFdBREYsRUFFckIsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixJQUFsQixDQUZVLENBQXZCLENBSUUsQ0FBQyxJQUpILENBSVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVYsRUFESTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSlIsRUFGUTtJQUFBLENBTlYsQ0FBQTs7MEJBQUE7O0tBRDRDLFdBUDlDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/htmlbeautifier.coffee

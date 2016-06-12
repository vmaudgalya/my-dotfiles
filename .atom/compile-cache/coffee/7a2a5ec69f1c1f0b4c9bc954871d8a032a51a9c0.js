(function() {
  "use strict";
  var Beautifier, JSBeautify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(_super) {
    __extends(JSBeautify, _super);

    function JSBeautify() {
      return JSBeautify.__super__.constructor.apply(this, arguments);
    }

    JSBeautify.prototype.name = "JS Beautify";

    JSBeautify.prototype.options = {
      HTML: true,
      XML: true,
      Handlebars: true,
      Mustache: true,
      Marko: true,
      JavaScript: true,
      JSON: true,
      CSS: {
        indent_size: true,
        indent_char: true,
        selector_separator_newline: true,
        newline_between_rules: true,
        preserve_newlines: true,
        wrap_line_length: true
      }
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      this.verbose("JS Beautify language " + language);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var beautifyCSS, beautifyHTML, beautifyJS, err;
          try {
            switch (language) {
              case "JSON":
              case "JavaScript":
                beautifyJS = require("js-beautify");
                text = beautifyJS(text, options);
                return resolve(text);
              case "Handlebars":
              case "Mustache":
                options.indent_handlebars = true;
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                return resolve(text);
              case "HTML (Liquid)":
              case "HTML":
              case "XML":
              case "Marko":
              case "Web Form/Control (C#)":
              case "Web Handler (C#)":
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                _this.debug("Beautified HTML: " + text);
                return resolve(text);
              case "CSS":
                beautifyCSS = require("js-beautify").css;
                text = beautifyCSS(text, options);
                return resolve(text);
            }
          } catch (_error) {
            err = _error;
            _this.error("JS Beautify error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvanMtYmVhdXRpZnkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsSUFBQSxHQUFNLGFBQU4sQ0FBQTs7QUFBQSx5QkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLElBQUEsRUFBTSxJQURDO0FBQUEsTUFFUCxHQUFBLEVBQUssSUFGRTtBQUFBLE1BR1AsVUFBQSxFQUFZLElBSEw7QUFBQSxNQUlQLFFBQUEsRUFBVSxJQUpIO0FBQUEsTUFLUCxLQUFBLEVBQU8sSUFMQTtBQUFBLE1BTVAsVUFBQSxFQUFZLElBTkw7QUFBQSxNQU9QLElBQUEsRUFBTSxJQVBDO0FBQUEsTUFRUCxHQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSxJQUFiO0FBQUEsUUFDQSxXQUFBLEVBQWEsSUFEYjtBQUFBLFFBRUEsMEJBQUEsRUFBNEIsSUFGNUI7QUFBQSxRQUdBLHFCQUFBLEVBQXVCLElBSHZCO0FBQUEsUUFJQSxpQkFBQSxFQUFtQixJQUpuQjtBQUFBLFFBS0EsZ0JBQUEsRUFBa0IsSUFMbEI7T0FUSztLQUZULENBQUE7O0FBQUEseUJBbUJBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxPQUFELENBQVUsdUJBQUEsR0FBdUIsUUFBakMsQ0FBQSxDQUFBO0FBQ0EsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNsQixjQUFBLDBDQUFBO0FBQUE7QUFDRSxvQkFBTyxRQUFQO0FBQUEsbUJBQ08sTUFEUDtBQUFBLG1CQUNlLFlBRGY7QUFFSSxnQkFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVIsQ0FBYixDQUFBO0FBQUEsZ0JBQ0EsSUFBQSxHQUFPLFVBQUEsQ0FBVyxJQUFYLEVBQWlCLE9BQWpCLENBRFAsQ0FBQTt1QkFFQSxPQUFBLENBQVEsSUFBUixFQUpKO0FBQUEsbUJBS08sWUFMUDtBQUFBLG1CQUtxQixVQUxyQjtBQU9JLGdCQUFBLE9BQU8sQ0FBQyxpQkFBUixHQUE0QixJQUE1QixDQUFBO0FBQUEsZ0JBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUMsSUFGdEMsQ0FBQTtBQUFBLGdCQUdBLElBQUEsR0FBTyxZQUFBLENBQWEsSUFBYixFQUFtQixPQUFuQixDQUhQLENBQUE7dUJBSUEsT0FBQSxDQUFRLElBQVIsRUFYSjtBQUFBLG1CQVlPLGVBWlA7QUFBQSxtQkFZd0IsTUFaeEI7QUFBQSxtQkFZZ0MsS0FaaEM7QUFBQSxtQkFZdUMsT0FadkM7QUFBQSxtQkFZZ0QsdUJBWmhEO0FBQUEsbUJBWXlFLGtCQVp6RTtBQWFJLGdCQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDLElBQXRDLENBQUE7QUFBQSxnQkFDQSxJQUFBLEdBQU8sWUFBQSxDQUFhLElBQWIsRUFBbUIsT0FBbkIsQ0FEUCxDQUFBO0FBQUEsZ0JBRUEsS0FBQyxDQUFBLEtBQUQsQ0FBUSxtQkFBQSxHQUFtQixJQUEzQixDQUZBLENBQUE7dUJBR0EsT0FBQSxDQUFRLElBQVIsRUFoQko7QUFBQSxtQkFpQk8sS0FqQlA7QUFrQkksZ0JBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUMsR0FBckMsQ0FBQTtBQUFBLGdCQUNBLElBQUEsR0FBTyxXQUFBLENBQVksSUFBWixFQUFrQixPQUFsQixDQURQLENBQUE7dUJBRUEsT0FBQSxDQUFRLElBQVIsRUFwQko7QUFBQSxhQURGO1dBQUEsY0FBQTtBQXVCRSxZQURJLFlBQ0osQ0FBQTtBQUFBLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBUSxxQkFBQSxHQUFxQixHQUE3QixDQUFBLENBQUE7bUJBQ0EsTUFBQSxDQUFPLEdBQVAsRUF4QkY7V0FEa0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFULENBQVgsQ0FGUTtJQUFBLENBbkJWLENBQUE7O3NCQUFBOztLQUR3QyxXQUgxQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/js-beautify.coffee

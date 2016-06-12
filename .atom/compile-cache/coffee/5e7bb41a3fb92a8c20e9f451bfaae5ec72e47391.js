(function() {
  "use strict";
  var Beautifier, JSBeautify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(_super) {
    var getDefaultLineEnding;

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
      var _ref;
      this.verbose("JS Beautify language " + language);
      this.info("JS Beautify Options: " + (JSON.stringify(options, null, 4)));
      options.eol = (_ref = getDefaultLineEnding()) != null ? _ref : options.eol;
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

    getDefaultLineEnding = function() {
      switch (atom.config.get('line-ending-selector.defaultLineEnding')) {
        case 'LF':
          return '\n';
        case 'CRLF':
          return '\r\n';
        case 'OS Default':
          if (process.platform === 'win32') {
            return '\r\n';
          } else {
            return '\n';
          }
        default:
          return null;
      }
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvanMtYmVhdXRpZnkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixRQUFBLG9CQUFBOztBQUFBLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxJQUFBLEdBQU0sYUFBTixDQUFBOztBQUFBLHlCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsSUFBQSxFQUFNLElBREM7QUFBQSxNQUVQLEdBQUEsRUFBSyxJQUZFO0FBQUEsTUFHUCxVQUFBLEVBQVksSUFITDtBQUFBLE1BSVAsUUFBQSxFQUFVLElBSkg7QUFBQSxNQUtQLEtBQUEsRUFBTyxJQUxBO0FBQUEsTUFNUCxVQUFBLEVBQVksSUFOTDtBQUFBLE1BT1AsSUFBQSxFQUFNLElBUEM7QUFBQSxNQVFQLEdBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLElBQWI7QUFBQSxRQUNBLFdBQUEsRUFBYSxJQURiO0FBQUEsUUFFQSwwQkFBQSxFQUE0QixJQUY1QjtBQUFBLFFBR0EscUJBQUEsRUFBdUIsSUFIdkI7QUFBQSxRQUlBLGlCQUFBLEVBQW1CLElBSm5CO0FBQUEsUUFLQSxnQkFBQSxFQUFrQixJQUxsQjtPQVRLO0tBRlQsQ0FBQTs7QUFBQSx5QkFtQkEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBVSx1QkFBQSxH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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/js-beautify.coffee

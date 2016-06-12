(function() {
  "use strict";
  var Beautifier, PrettyDiff,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PrettyDiff = (function(_super) {
    __extends(PrettyDiff, _super);

    function PrettyDiff() {
      return PrettyDiff.__super__.constructor.apply(this, arguments);
    }

    PrettyDiff.prototype.name = "Pretty Diff";

    PrettyDiff.prototype.options = {
      _: {
        inchar: "indent_char",
        insize: "indent_size",
        objsort: function(objsort) {
          return objsort || false;
        },
        preserve: [
          'preserve_newlines', function(preserve_newlines) {
            if (preserve_newlines === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        cssinsertlines: "newline_between_rules",
        comments: [
          "indent_comments", function(indent_comments) {
            if (indent_comments === false) {
              return "noindent";
            } else {
              return "indent";
            }
          }
        ],
        force: "force_indentation",
        quoteConvert: "convert_quotes",
        vertical: [
          'align_assignments', function(align_assignments) {
            if (align_assignments === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        wrap: "wrap_line_length",
        space: "space_after_anon_function",
        noleadzero: "no_lead_zero",
        endcomma: "end_with_comma"
      },
      CSV: true,
      ERB: true,
      EJS: true,
      HTML: true,
      XML: true,
      SVG: true,
      Spacebars: true,
      JSX: true,
      JavaScript: true,
      CSS: true,
      SCSS: true,
      Sass: true,
      JSON: true,
      TSS: true,
      Twig: true,
      LESS: true,
      Swig: true,
      Visualforce: true
    };

    PrettyDiff.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var args, lang, output, prettydiff, result, _;
          prettydiff = require("prettydiff");
          _ = require('lodash');
          lang = "auto";
          switch (language) {
            case "CSV":
              lang = "csv";
              break;
            case "EJS":
            case "Twig":
              lang = "ejs";
              break;
            case "ERB":
              lang = "html_ruby";
              break;
            case "Handlebars":
            case "Mustache":
            case "Spacebars":
            case "Swig":
              lang = "handlebars";
              break;
            case "SGML":
              lang = "markup";
              break;
            case "XML":
            case "Visualforce":
            case "SVG":
              lang = "xml";
              break;
            case "HTML":
              lang = "html";
              break;
            case "JavaScript":
              lang = "javascript";
              break;
            case "JSON":
              lang = "json";
              break;
            case "JSX":
              lang = "jsx";
              break;
            case "JSTL":
              lang = "jsp";
              break;
            case "CSS":
              lang = "css";
              break;
            case "LESS":
              lang = "less";
              break;
            case "SCSS":
            case "Sass":
              lang = "scss";
              break;
            case "TSS":
              lang = "tss";
              break;
            default:
              lang = "auto";
          }
          args = {
            source: text,
            lang: lang,
            mode: "beautify"
          };
          _.merge(options, args);
          _this.verbose('prettydiff', options);
          output = prettydiff.api(options);
          result = output[0];
          return resolve(result);
        };
      })(this));
    };

    return PrettyDiff;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHJldHR5ZGlmZi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxJQUFBLEdBQU0sYUFBTixDQUFBOztBQUFBLHlCQUNBLE9BQUEsR0FBUztBQUFBLE1BRVAsQ0FBQSxFQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsYUFBUjtBQUFBLFFBQ0EsTUFBQSxFQUFRLGFBRFI7QUFBQSxRQUVBLE9BQUEsRUFBUyxTQUFDLE9BQUQsR0FBQTtpQkFDUCxPQUFBLElBQVcsTUFESjtRQUFBLENBRlQ7QUFBQSxRQUlBLFFBQUEsRUFBVTtVQUFDLG1CQUFELEVBQXNCLFNBQUMsaUJBQUQsR0FBQTtBQUM5QixZQUFBLElBQUksaUJBQUEsS0FBcUIsSUFBekI7cUJBQ0UsTUFERjthQUFBLE1BQUE7cUJBQ2EsT0FEYjthQUQ4QjtVQUFBLENBQXRCO1NBSlY7QUFBQSxRQVFBLGNBQUEsRUFBZ0IsdUJBUmhCO0FBQUEsUUFTQSxRQUFBLEVBQVU7VUFBQyxpQkFBRCxFQUFvQixTQUFDLGVBQUQsR0FBQTtBQUM1QixZQUFBLElBQUksZUFBQSxLQUFtQixLQUF2QjtxQkFDRSxXQURGO2FBQUEsTUFBQTtxQkFDa0IsU0FEbEI7YUFENEI7VUFBQSxDQUFwQjtTQVRWO0FBQUEsUUFhQSxLQUFBLEVBQU8sbUJBYlA7QUFBQSxRQWNBLFlBQUEsRUFBYyxnQkFkZDtBQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/prettydiff.coffee

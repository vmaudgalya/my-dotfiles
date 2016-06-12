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
        endcomma: "end_with_comma",
        methodchain: [
          'break_chained_methods', function(break_chained_methods) {
            if (break_chained_methods === true) {
              return false;
            } else {
              return true;
            }
          }
        ]
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

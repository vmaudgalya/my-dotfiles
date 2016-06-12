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
        inchar: [
          "indent_with_tabs", "indent_char", function(indent_with_tabs, indent_char) {
            if (indent_with_tabs === true) {
              return "\t";
            } else {
              return indent_char;
            }
          }
        ],
        insize: [
          "indent_with_tabs", "indent_size", function(indent_with_tabs, indent_size) {
            if (indent_with_tabs === true) {
              return 1;
            } else {
              return indent_size;
            }
          }
        ],
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
        ],
        ternaryline: "preserve_ternary_lines"
      },
      CSV: true,
      Coldfusion: true,
      ERB: true,
      EJS: true,
      HTML: true,
      Handlebars: true,
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
      Visualforce: true,
      "Riot.js": true,
      XTemplate: true
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
            case "Coldfusion":
              lang = "html";
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
            case "Riot.js":
            case "XTemplate":
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHJldHR5ZGlmZi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxJQUFBLEdBQU0sYUFBTixDQUFBOztBQUFBLHlCQUNBLE9BQUEsR0FBUztBQUFBLE1BRVAsQ0FBQSxFQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVE7VUFBQyxrQkFBRCxFQUFxQixhQUFyQixFQUFvQyxTQUFDLGdCQUFELEVBQW1CLFdBQW5CLEdBQUE7QUFDMUMsWUFBQSxJQUFJLGdCQUFBLEtBQW9CLElBQXhCO3FCQUNFLEtBREY7YUFBQSxNQUFBO3FCQUNZLFlBRFo7YUFEMEM7VUFBQSxDQUFwQztTQUFSO0FBQUEsUUFJQSxNQUFBLEVBQVE7VUFBQyxrQkFBRCxFQUFxQixhQUFyQixFQUFvQyxTQUFDLGdCQUFELEVBQW1CLFdBQW5CLEdBQUE7QUFDMUMsWUFBQSxJQUFJLGdCQUFBLEtBQW9CLElBQXhCO3FCQUNFLEVBREY7YUFBQSxNQUFBO3FCQUNTLFlBRFQ7YUFEMEM7VUFBQSxDQUFwQztTQUpSO0FBQUEsUUFRQSxPQUFBLEVBQVMsU0FBQyxPQUFELEdBQUE7aUJBQ1AsT0FBQSxJQUFXLE1BREo7UUFBQSxDQVJUO0FBQUEsUUFVQSxRQUFBLEVBQVU7VUFBQyxtQkFBRCxFQUFzQixTQUFDLGlCQUFELEdBQUE7QUFDOUIsWUFBQSxJQUFJLGlCQUFBLEtBQXFCLElBQXpC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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/prettydiff.coffee

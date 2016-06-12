
/*
 */

(function() {
  "use strict";
  var Beautifier, Gherkin, Lexer, logger,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  Lexer = require('gherkin').Lexer('en');

  logger = require('../logger')(__filename);

  module.exports = Gherkin = (function(_super) {
    __extends(Gherkin, _super);

    function Gherkin() {
      return Gherkin.__super__.constructor.apply(this, arguments);
    }

    Gherkin.prototype.name = "Gherkin formatter";

    Gherkin.prototype.options = {
      gherkin: true
    };

    Gherkin.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var lexer, line, loggerLevel, recorder, _i, _len, _ref;
        recorder = {
          lines: [],
          tags: [],
          comments: [],
          last_obj: null,
          indent_to: function(indent_level) {
            if (indent_level == null) {
              indent_level = 0;
            }
            return options.indent_char.repeat(options.indent_size * indent_level);
          },
          write_blank: function() {
            return this.lines.push('');
          },
          write_indented: function(content, indent) {
            var line, _i, _len, _ref, _results;
            if (indent == null) {
              indent = 0;
            }
            _ref = content.trim().split("\n");
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              line = _ref[_i];
              _results.push(this.lines.push("" + (this.indent_to(indent)) + (line.trim())));
            }
            return _results;
          },
          write_comments: function(indent) {
            var comment, _i, _len, _ref, _results;
            if (indent == null) {
              indent = 0;
            }
            _ref = this.comments.splice(0, this.comments.length);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              comment = _ref[_i];
              _results.push(this.write_indented(comment, indent));
            }
            return _results;
          },
          write_tags: function(indent) {
            if (indent == null) {
              indent = 0;
            }
            if (this.tags.length > 0) {
              return this.write_indented(this.tags.splice(0, this.tags.length).join(' '), indent);
            }
          },
          comment: function(value, line) {
            logger.verbose({
              token: 'comment',
              value: value.trim(),
              line: line
            });
            return this.comments.push(value);
          },
          tag: function(value, line) {
            logger.verbose({
              token: 'tag',
              value: value,
              line: line
            });
            return this.tags.push(value);
          },
          feature: function(keyword, name, description, line) {
            logger.verbose({
              token: 'feature',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_comments(0);
            this.write_tags(0);
            this.write_indented("" + keyword + ": " + name, '');
            if (description) {
              return this.write_indented(description, 1);
            }
          },
          background: function(keyword, name, description, line) {
            logger.verbose({
              token: 'background',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_indented("" + keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario: function(keyword, name, description, line) {
            logger.verbose({
              token: 'scenario',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented("" + keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario_outline: function(keyword, name, description, line) {
            logger.verbose({
              token: 'outline',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented("" + keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          examples: function(keyword, name, description, line) {
            logger.verbose({
              token: 'examples',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(2);
            this.write_tags(2);
            this.write_indented("" + keyword + ": " + name, 2);
            if (description) {
              return this.write_indented(description, 3);
            }
          },
          step: function(keyword, name, line) {
            logger.verbose({
              token: 'step',
              keyword: keyword,
              name: name,
              line: line
            });
            this.write_comments(2);
            return this.write_indented("" + keyword + name, 2);
          },
          doc_string: function(content_type, string, line) {
            var three_quotes;
            logger.verbose({
              token: 'doc_string',
              content_type: content_type,
              string: string,
              line: line
            });
            three_quotes = '"""';
            this.write_comments(2);
            return this.write_indented("" + three_quotes + content_type + "\n" + string + "\n" + three_quotes, 3);
          },
          row: function(cells, line) {
            logger.verbose({
              token: 'row',
              cells: cells,
              line: line
            });
            this.write_comments(3);
            return this.write_indented("| " + (cells.join(' | ')) + " |", 3);
          },
          eof: function() {
            logger.verbose({
              token: 'eof'
            });
            return this.write_comments(2);
          }
        };
        lexer = new Lexer(recorder);
        lexer.scan(text);
        loggerLevel = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify._loggerLevel') : void 0;
        if (loggerLevel === 'verbose') {
          _ref = recorder.lines;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            line = _ref[_i];
            logger.verbose("> " + line);
          }
        }
        return resolve(recorder.lines.join("\n"));
      });
    };

    return Gherkin;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvZ2hlcmtpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBO0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFHQSxZQUhBLENBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FKYixDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBQWtCLENBQUMsS0FBbkIsQ0FBeUIsSUFBekIsQ0FMUixDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBQUEsQ0FBcUIsVUFBckIsQ0FOVCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHNCQUFBLElBQUEsR0FBTSxtQkFBTixDQUFBOztBQUFBLHNCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsT0FBQSxFQUFTLElBREY7S0FGVCxDQUFBOztBQUFBLHNCQU1BLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDbEIsWUFBQSxrREFBQTtBQUFBLFFBQUEsUUFBQSxHQUFXO0FBQUEsVUFDVCxLQUFBLEVBQU8sRUFERTtBQUFBLFVBRVQsSUFBQSxFQUFNLEVBRkc7QUFBQSxVQUdULFFBQUEsRUFBVSxFQUhEO0FBQUEsVUFLVCxRQUFBLEVBQVUsSUFMRDtBQUFBLFVBT1QsU0FBQSxFQUFXLFNBQUMsWUFBRCxHQUFBOztjQUFDLGVBQWU7YUFDekI7QUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/gherkin.coffee

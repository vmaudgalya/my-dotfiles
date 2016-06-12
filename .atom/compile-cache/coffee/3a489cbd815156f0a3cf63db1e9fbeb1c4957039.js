(function() {
  "use strict";
  var Beautifier, TidyMarkdown,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = TidyMarkdown = (function(_super) {
    __extends(TidyMarkdown, _super);

    function TidyMarkdown() {
      return TidyMarkdown.__super__.constructor.apply(this, arguments);
    }

    TidyMarkdown.prototype.name = "Tidy Markdown";

    TidyMarkdown.prototype.options = {
      Markdown: false
    };

    TidyMarkdown.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, tidyMarkdown;
        tidyMarkdown = require('tidy-markdown');
        cleanMarkdown = tidyMarkdown(text);
        return resolve(cleanMarkdown);
      });
    };

    return TidyMarkdown;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdGlkeS1tYXJrZG93bi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLG1DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwyQkFBQSxJQUFBLEdBQU0sZUFBTixDQUFBOztBQUFBLDJCQUNBLE9BQUEsR0FBUztBQUFBLE1BQ1AsUUFBQSxFQUFVLEtBREg7S0FEVCxDQUFBOztBQUFBLDJCQUtBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDbEIsWUFBQSwyQkFBQTtBQUFBLFFBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxlQUFSLENBQWYsQ0FBQTtBQUFBLFFBQ0EsYUFBQSxHQUFnQixZQUFBLENBQWEsSUFBYixDQURoQixDQUFBO2VBRUEsT0FBQSxDQUFRLGFBQVIsRUFIa0I7TUFBQSxDQUFULENBQVgsQ0FEUTtJQUFBLENBTFYsQ0FBQTs7d0JBQUE7O0tBRDBDLFdBSDVDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/tidy-markdown.coffee

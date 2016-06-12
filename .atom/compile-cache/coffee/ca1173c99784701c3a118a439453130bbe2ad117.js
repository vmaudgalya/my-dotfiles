(function() {
  "use strict";
  var Beautifier, Remark,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Remark = (function(_super) {
    __extends(Remark, _super);

    function Remark() {
      return Remark.__super__.constructor.apply(this, arguments);
    }

    Remark.prototype.name = "Remark";

    Remark.prototype.options = {
      _: {
        gfm: true,
        yaml: true,
        commonmark: true,
        footnotes: true,
        pedantic: true,
        breaks: true,
        entities: true,
        setext: true,
        closeAtx: true,
        looseTable: true,
        spacedTable: true,
        fence: true,
        fences: true,
        bullet: true,
        listItemIndent: true,
        incrementListMarker: true,
        rule: true,
        ruleRepetition: true,
        ruleSpaces: true,
        strong: true,
        emphasis: true,
        position: true
      },
      Markdown: true
    };

    Remark.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, err, remark;
        try {
          remark = require('remark');
          cleanMarkdown = remark.process(text, options);
          return resolve(cleanMarkdown);
        } catch (_error) {
          err = _error;
          this.error("Remark error: " + err);
          return reject(err);
        }
      });
    };

    return Remark;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcmVtYXJrLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLGtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLElBQUEsR0FBTSxRQUFOLENBQUE7O0FBQUEscUJBQ0EsT0FBQSxHQUFTO0FBQUEsTUFDUCxDQUFBLEVBQUc7QUFBQSxRQUNELEdBQUEsRUFBSyxJQURKO0FBQUEsUUFFRCxJQUFBLEVBQU0sSUFGTDtBQUFBLFFBR0QsVUFBQSxFQUFZLElBSFg7QUFBQSxRQUlELFNBQUEsRUFBVyxJQUpWO0FBQUEsUUFLRCxRQUFBLEVBQVUsSUFMVDtBQUFBLFFBTUQsTUFBQSxFQUFRLElBTlA7QUFBQSxRQU9ELFFBQUEsRUFBVSxJQVBUO0FBQUEsUUFRRCxNQUFBLEVBQVEsSUFSUDtBQUFBLFFBU0QsUUFBQSxFQUFVLElBVFQ7QUFBQSxRQVVELFVBQUEsRUFBWSxJQVZYO0FBQUEsUUFXRCxXQUFBLEVBQWEsSUFYWjtBQUFBLFFBWUQsS0FBQSxFQUFPLElBWk47QUFBQSxRQWFELE1BQUEsRUFBUSxJQWJQO0FBQUEsUUFjRCxNQUFBLEVBQVEsSUFkUDtBQUFBLFFBZUQsY0FBQSxFQUFnQixJQWZmO0FBQUEsUUFnQkQsbUJBQUEsRUFBcUIsSUFoQnBCO0FBQUEsUUFpQkQsSUFBQSxFQUFNLElBakJMO0FBQUEsUUFrQkQsY0FBQSxFQUFnQixJQWxCZjtBQUFBLFFBbUJELFVBQUEsRUFBWSxJQW5CWDtBQUFBLFFBb0JELE1BQUEsRUFBUSxJQXBCUDtBQUFBLFFBcUJELFFBQUEsRUFBVSxJQXJCVDtBQUFBLFFBc0JELFFBQUEsRUFBVSxJQXRCVDtPQURJO0FBQUEsTUF5QlAsUUFBQSxFQUFVLElBekJIO0tBRFQsQ0FBQTs7QUFBQSxxQkE2QkEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNsQixZQUFBLDBCQUFBO0FBQUE7QUFDRSxVQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUFULENBQUE7QUFBQSxVQUNBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLENBRGhCLENBQUE7aUJBRUEsT0FBQSxDQUFRLGFBQVIsRUFIRjtTQUFBLGNBQUE7QUFLRSxVQURJLFlBQ0osQ0FBQTtBQUFBLFVBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBUSxnQkFBQSxHQUFnQixHQUF4QixDQUFBLENBQUE7aUJBQ0EsTUFBQSxDQUFPLEdBQVAsRUFORjtTQURrQjtNQUFBLENBQVQsQ0FBWCxDQURRO0lBQUEsQ0E3QlYsQ0FBQTs7a0JBQUE7O0tBRG9DLFdBSHRDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/remark.coffee

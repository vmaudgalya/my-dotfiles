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

    JSBeautify.prototype.name = "CSScomb";

    JSBeautify.prototype.options = {
      CSS: false,
      LESS: false,
      Sass: false,
      SCSS: false
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var Comb, comb, config, e, processedCSS, projectConfigPath, syntax, _ref, _ref1;
        Comb = require('csscomb');
        config = null;
        try {
          projectConfigPath = (_ref = atom.project.getDirectories()) != null ? (_ref1 = _ref[0]) != null ? _ref1.resolve('.csscomb.json') : void 0 : void 0;
          config = require(projectConfigPath);
        } catch (_error) {
          e = _error;
          config = Comb.getConfig('csscomb');
        }
        comb = new Comb(config);
        syntax = "css";
        switch (language) {
          case "LESS":
            syntax = "less";
            break;
          case "SCSS":
            syntax = "scss";
            break;
          case "Sass":
            syntax = "sass";
        }
        processedCSS = comb.processString(text, {
          syntax: syntax
        });
        return resolve(processedCSS);
      });
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY3NzY29tYi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxJQUFBLEdBQU0sU0FBTixDQUFBOztBQUFBLHlCQUVBLE9BQUEsR0FBUztBQUFBLE1BRVAsR0FBQSxFQUFLLEtBRkU7QUFBQSxNQUdQLElBQUEsRUFBTSxLQUhDO0FBQUEsTUFJUCxJQUFBLEVBQU0sS0FKQztBQUFBLE1BS1AsSUFBQSxFQUFNLEtBTEM7S0FGVCxDQUFBOztBQUFBLHlCQVVBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFJbEIsWUFBQSwyRUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBQVAsQ0FBQTtBQUFBLFFBRUEsTUFBQSxHQUFTLElBRlQsQ0FBQTtBQUdBO0FBRUUsVUFBQSxpQkFBQSxxRkFBcUQsQ0FBRSxPQUFuQyxDQUEyQyxlQUEzQyxtQkFBcEIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxpQkFBUixDQURULENBRkY7U0FBQSxjQUFBO0FBTUUsVUFGSSxVQUVKLENBQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBTCxDQUFlLFNBQWYsQ0FBVCxDQU5GO1NBSEE7QUFBQSxRQWFBLElBQUEsR0FBVyxJQUFBLElBQUEsQ0FBSyxNQUFMLENBYlgsQ0FBQTtBQUFBLFFBZ0JBLE1BQUEsR0FBUyxLQWhCVCxDQUFBO0FBaUJBLGdCQUFPLFFBQVA7QUFBQSxlQUNPLE1BRFA7QUFFSSxZQUFBLE1BQUEsR0FBUyxNQUFULENBRko7QUFDTztBQURQLGVBR08sTUFIUDtBQUlJLFlBQUEsTUFBQSxHQUFTLE1BQVQsQ0FKSjtBQUdPO0FBSFAsZUFLTyxNQUxQO0FBTUksWUFBQSxNQUFBLEdBQVMsTUFBVCxDQU5KO0FBQUEsU0FqQkE7QUFBQSxRQXlCQSxZQUFBLEdBQWUsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsSUFBbkIsRUFBeUI7QUFBQSxVQUN0QyxNQUFBLEVBQVEsTUFEOEI7U0FBekIsQ0F6QmYsQ0FBQTtlQThCQSxPQUFBLENBQVEsWUFBUixFQWxDa0I7TUFBQSxDQUFULENBQVgsQ0FEUTtJQUFBLENBVlYsQ0FBQTs7c0JBQUE7O0tBRHdDLFdBSDFDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/csscomb.coffee

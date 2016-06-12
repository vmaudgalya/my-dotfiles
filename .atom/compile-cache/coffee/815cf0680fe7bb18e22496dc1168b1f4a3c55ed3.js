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
      _: {
        configPath: true,
        predefinedConfig: true
      },
      CSS: true,
      LESS: true,
      Sass: true,
      SCSS: true
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CSON, Comb, comb, config, expandHomeDir, processedCSS, project, syntax, _ref;
        Comb = require('csscomb');
        expandHomeDir = require('expand-home-dir');
        CSON = require('season');
        config = null;
        try {
          project = (_ref = atom.project.getDirectories()) != null ? _ref[0] : void 0;
          try {
            config = CSON.readFileSync(project != null ? project.resolve('.csscomb.cson') : void 0);
          } catch (_error) {
            config = require(project != null ? project.resolve('.csscomb.json') : void 0);
          }
        } catch (_error) {
          try {
            config = CSON.readFileSync(expandHomeDir(options.configPath));
          } catch (_error) {
            config = Comb.getConfig(options.predefinedConfig);
          }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY3NzY29tYi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxJQUFBLEdBQU0sU0FBTixDQUFBOztBQUFBLHlCQUVBLE9BQUEsR0FBUztBQUFBLE1BRVAsQ0FBQSxFQUNFO0FBQUEsUUFBQSxVQUFBLEVBQVksSUFBWjtBQUFBLFFBQ0EsZ0JBQUEsRUFBa0IsSUFEbEI7T0FISztBQUFBLE1BS1AsR0FBQSxFQUFLLElBTEU7QUFBQSxNQU1QLElBQUEsRUFBTSxJQU5DO0FBQUEsTUFPUCxJQUFBLEVBQU0sSUFQQztBQUFBLE1BUVAsSUFBQSxFQUFNLElBUkM7S0FGVCxDQUFBOztBQUFBLHlCQWFBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFJbEIsWUFBQSw0RUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBQVAsQ0FBQTtBQUFBLFFBQ0EsYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVIsQ0FEaEIsQ0FBQTtBQUFBLFFBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRlAsQ0FBQTtBQUFBLFFBSUEsTUFBQSxHQUFTLElBSlQsQ0FBQTtBQUtBO0FBQ0UsVUFBQSxPQUFBLHdEQUF5QyxDQUFBLENBQUEsVUFBekMsQ0FBQTtBQUNBO0FBQ0UsWUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFlBQUwsbUJBQWtCLE9BQU8sQ0FBRSxPQUFULENBQWlCLGVBQWpCLFVBQWxCLENBQVQsQ0FERjtXQUFBLGNBQUE7QUFHRSxZQUFBLE1BQUEsR0FBUyxPQUFBLG1CQUFRLE9BQU8sQ0FBRSxPQUFULENBQWlCLGVBQWpCLFVBQVIsQ0FBVCxDQUhGO1dBRkY7U0FBQSxjQUFBO0FBT0U7QUFDRSxZQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsWUFBTCxDQUFrQixhQUFBLENBQWMsT0FBTyxDQUFDLFVBQXRCLENBQWxCLENBQVQsQ0FERjtXQUFBLGNBQUE7QUFJRSxZQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBTCxDQUFlLE9BQU8sQ0FBQyxnQkFBdkIsQ0FBVCxDQUpGO1dBUEY7U0FMQTtBQUFBLFFBbUJBLElBQUEsR0FBVyxJQUFBLElBQUEsQ0FBSyxNQUFMLENBbkJYLENBQUE7QUFBQSxRQXNCQSxNQUFBLEdBQVMsS0F0QlQsQ0FBQTtBQXVCQSxnQkFBTyxRQUFQO0FBQUEsZUFDTyxNQURQO0FBRUksWUFBQSxNQUFBLEdBQVMsTUFBVCxDQUZKO0FBQ087QUFEUCxlQUdPLE1BSFA7QUFJSSxZQUFBLE1BQUEsR0FBUyxNQUFULENBSko7QUFHTztBQUhQLGVBS08sTUFMUDtBQU1JLFlBQUEsTUFBQSxHQUFTLE1BQVQsQ0FOSjtBQUFBLFNBdkJBO0FBQUEsUUErQkEsWUFBQSxHQUFlLElBQUksQ0FBQyxhQUFMLENBQW1CLElBQW5CLEVBQXlCO0FBQUEsVUFDdEMsTUFBQSxFQUFRLE1BRDhCO1NBQXpCLENBL0JmLENBQUE7ZUFvQ0EsT0FBQSxDQUFRLFlBQVIsRUF4Q2tCO01BQUEsQ0FBVCxDQUFYLENBRFE7SUFBQSxDQWJWLENBQUE7O3NCQUFBOztLQUR3QyxXQUgxQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/csscomb.coffee

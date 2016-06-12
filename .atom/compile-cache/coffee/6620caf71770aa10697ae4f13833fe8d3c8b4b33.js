
/*
Requires http://uncrustify.sourceforge.net/
 */

(function() {
  "use strict";
  var Beautifier, Uncrustify, cfg, expandHomeDir, path, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('../beautifier');

  cfg = require("./cfg");

  path = require("path");

  expandHomeDir = require('expand-home-dir');

  _ = require('lodash');

  module.exports = Uncrustify = (function(_super) {
    __extends(Uncrustify, _super);

    function Uncrustify() {
      return Uncrustify.__super__.constructor.apply(this, arguments);
    }

    Uncrustify.prototype.name = "Uncrustify";

    Uncrustify.prototype.options = {
      C: true,
      "C++": true,
      "C#": true,
      "Objective-C": true,
      D: true,
      Pawn: true,
      Vala: true,
      Java: true,
      Arduino: true
    };

    Uncrustify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var basePath, configPath, editor;
        configPath = options.configPath;
        if (!configPath) {
          return cfg(options, function(error, cPath) {
            if (error) {
              throw error;
            }
            return resolve(cPath);
          });
        } else {
          editor = atom.workspace.getActiveTextEditor();
          if (editor != null) {
            basePath = path.dirname(editor.getPath());
            configPath = path.resolve(basePath, configPath);
            return resolve(configPath);
          } else {
            return reject(new Error("No Uncrustify Config Path set! Please configure Uncrustify with Atom Beautify."));
          }
        }
      }).then((function(_this) {
        return function(configPath) {
          var lang, outputFile;
          configPath = expandHomeDir(configPath);
          lang = "C";
          switch (language) {
            case "C":
              lang = "C";
              break;
            case "C++":
              lang = "CPP";
              break;
            case "C#":
              lang = "CS";
              break;
            case "Objective-C":
            case "Objective-C++":
              lang = "OC+";
              break;
            case "D":
              lang = "D";
              break;
            case "Pawn":
              lang = "PAWN";
              break;
            case "Vala":
              lang = "VALA";
              break;
            case "Java":
              lang = "JAVA";
              break;
            case "Arduino":
              lang = "CPP";
          }
          return _this.run("uncrustify", ["-c", configPath, "-f", _this.tempFile("input", text), "-o", outputFile = _this.tempFile("output", text), "-l", lang], {
            help: {
              link: "http://sourceforge.net/projects/uncrustify/"
            }
          }).then(function() {
            return _this.readFile(outputFile);
          });
        };
      })(this));
    };

    return Uncrustify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdW5jcnVzdGlmeS9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBR0EsWUFIQSxDQUFBO0FBQUEsTUFBQSxtREFBQTtJQUFBO21TQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUxOLENBQUE7O0FBQUEsRUFNQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FOUCxDQUFBOztBQUFBLEVBT0EsYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVIsQ0FQaEIsQ0FBQTs7QUFBQSxFQVFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQVJKLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsSUFBQSxHQUFNLFlBQU4sQ0FBQTs7QUFBQSx5QkFDQSxPQUFBLEdBQVM7QUFBQSxNQUNQLENBQUEsRUFBRyxJQURJO0FBQUEsTUFFUCxLQUFBLEVBQU8sSUFGQTtBQUFBLE1BR1AsSUFBQSxFQUFNLElBSEM7QUFBQSxNQUlQLGFBQUEsRUFBZSxJQUpSO0FBQUEsTUFLUCxDQUFBLEVBQUcsSUFMSTtBQUFBLE1BTVAsSUFBQSxFQUFNLElBTkM7QUFBQSxNQU9QLElBQUEsRUFBTSxJQVBDO0FBQUEsTUFRUCxJQUFBLEVBQU0sSUFSQztBQUFBLE1BU1AsT0FBQSxFQUFTLElBVEY7S0FEVCxDQUFBOztBQUFBLHlCQWFBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpC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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/uncrustify/index.coffee

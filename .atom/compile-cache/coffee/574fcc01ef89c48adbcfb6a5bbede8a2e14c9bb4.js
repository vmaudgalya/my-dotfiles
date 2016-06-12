
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
      Apex: true,
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
            case "Apex":
              lang = "Apex";
              break;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdW5jcnVzdGlmeS9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBR0EsWUFIQSxDQUFBO0FBQUEsTUFBQSxtREFBQTtJQUFBO21TQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUxOLENBQUE7O0FBQUEsRUFNQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FOUCxDQUFBOztBQUFBLEVBT0EsYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVIsQ0FQaEIsQ0FBQTs7QUFBQSxFQVFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQVJKLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsSUFBQSxHQUFNLFlBQU4sQ0FBQTs7QUFBQSx5QkFDQSxPQUFBLEdBQVM7QUFBQSxNQUNQLElBQUEsRUFBTSxJQURDO0FBQUEsTUFFUCxDQUFBLEVBQUcsSUFGSTtBQUFBLE1BR1AsS0FBQSxFQUFPLElBSEE7QUFBQSxNQUlQLElBQUEsRUFBTSxJQUpDO0FBQUEsTUFLUCxhQUFBLEVBQWUsSUFMUjtBQUFBLE1BTVAsQ0FBQSxFQUFHLElBTkk7QUFBQSxNQU9QLElBQUEsRUFBTSxJQVBDO0FBQUEsTUFRUCxJQUFBLEVBQU0sSUFSQztBQUFBLE1BU1AsSUFBQSxFQUFNLElBVEM7QUFBQSxNQVVQLE9BQUEsRUFBUyxJQVZGO0tBRFQsQ0FBQTs7QUFBQSx5QkFjQSxRQUFBLEdBQVUsU0FBQyxJ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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/uncrustify/index.coffee

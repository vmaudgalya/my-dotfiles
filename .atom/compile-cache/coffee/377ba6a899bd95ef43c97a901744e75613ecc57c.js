
/*
Requires clang-format (https://clang.llvm.org)
 */

(function() {
  "use strict";
  var Beautifier, ClangFormat, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require('fs');

  module.exports = ClangFormat = (function(_super) {
    __extends(ClangFormat, _super);

    function ClangFormat() {
      return ClangFormat.__super__.constructor.apply(this, arguments);
    }

    ClangFormat.prototype.name = "clang-format";

    ClangFormat.prototype.options = {
      "C++": false,
      "C": false,
      "Objective-C": false
    };


    /*
      Dump contents to a given file
     */

    ClangFormat.prototype.dumpToFile = function(name, contents) {
      if (name == null) {
        name = "atom-beautify-dump";
      }
      if (contents == null) {
        contents = "";
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return fs.open(name, "w", function(err, fd) {
            _this.debug('dumpToFile', name, err, fd);
            if (err) {
              return reject(err);
            }
            return fs.write(fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(name);
              });
            });
          });
        };
      })(this));
    };

    ClangFormat.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var currDir, currFile, dumpFile, editor, fullPath, _ref;
        editor = typeof atom !== "undefined" && atom !== null ? (_ref = atom.workspace) != null ? _ref.getActiveTextEditor() : void 0 : void 0;
        if (editor != null) {
          fullPath = editor.getPath();
          currDir = path.dirname(fullPath);
          currFile = path.basename(fullPath);
          dumpFile = path.join(currDir, ".atom-beautify." + currFile);
          return resolve(dumpFile);
        } else {
          return reject(new Error("No active editor found!"));
        }
      }).then((function(_this) {
        return function(dumpFile) {
          return _this.run("clang-format", [_this.dumpToFile(dumpFile, text), ["--style=file"]], {
            help: {
              link: "https://clang.llvm.org/docs/ClangFormat.html"
            }
          })["finally"](function() {
            return fs.unlink(dumpFile);
          });
        };
      })(this));
    };

    return ClangFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY2xhbmctZm9ybWF0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQSxZQUpBLENBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FMYixDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTlAsQ0FBQTs7QUFBQSxFQU9BLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQVBMLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQixrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsMEJBQUEsSUFBQSxHQUFNLGNBQU4sQ0FBQTs7QUFBQSwwQkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLEtBQUEsRUFBTyxLQURBO0FBQUEsTUFFUCxHQUFBLEVBQUssS0FGRTtBQUFBLE1BR1AsYUFBQSxFQUFlLEtBSFI7S0FGVCxDQUFBOztBQVFBO0FBQUE7O09BUkE7O0FBQUEsMEJBV0EsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUE4QixRQUE5QixHQUFBOztRQUFDLE9BQU87T0FDbEI7O1FBRHdDLFdBQVc7T0FDbkQ7QUFBQSxhQUFXLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7aUJBQ2pCLEVBQUUsQ0FBQyxJQUFILENBQVEsSUFBUixFQUFjLEdBQWQsRUFBbUIsU0FBQyxHQUFELEVBQU0sRUFBTixHQUFBO0FBQ2pCLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxZQUFQLEVBQXFCLElBQXJCLEVBQTJCLEdBQTNCLEVBQWdDLEVBQWhDLENBQUEsQ0FBQTtBQUNBLFlBQUEsSUFBc0IsR0FBdEI7QUFBQSxxQkFBTyxNQUFBLENBQU8sR0FBUCxDQUFQLENBQUE7YUFEQTttQkFFQSxFQUFFLENBQUMsS0FBSCxDQUFTLEVBQVQsRUFBYSxRQUFiLEVBQXVCLFNBQUMsR0FBRCxHQUFBO0FBQ3JCLGNBQUEsSUFBc0IsR0FBdEI7QUFBQSx1QkFBTyxNQUFBLENBQU8sR0FBUCxDQUFQLENBQUE7ZUFBQTtxQkFDQSxFQUFFLENBQUMsS0FBSCxDQUFTLEVBQVQsRUFBYSxTQUFDLEdBQUQsR0FBQTtBQUNYLGdCQUFBLElBQXNCLEdBQXRCO0FBQUEseUJBQU8sTUFBQSxDQUFPLEdBQVAsQ0FBUCxDQUFBO2lCQUFBO3VCQUNBLE9BQUEsQ0FBUSxJQUFSLEVBRlc7Y0FBQSxDQUFiLEVBRnFCO1lBQUEsQ0FBdkIsRUFIaUI7VUFBQSxDQUFuQixFQURpQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsQ0FBWCxDQURVO0lBQUEsQ0FYWixDQUFBOztBQUFBLDBCQTBCQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBYVIsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ2xCLFlBQUEsbURBQUE7QUFBQSxRQUFBLE1BQUEsd0ZBQXdCLENBQUUsbUJBQWpCLENBQUEsbUJBQVQsQ0FBQTtBQUNBLFFBQUEsSUFBRyxjQUFIO0FBQ0UsVUFBQSxRQUFBLEdBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFYLENBQUE7QUFBQSxVQUNBLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FEVixDQUFBO0FBQUEsVUFFQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxRQUFkLENBRlgsQ0FBQTtBQUFBLFVBR0EsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFvQixpQkFBQSxHQUFpQixRQUFyQyxDQUhYLENBQUE7aUJBSUEsT0FBQSxDQUFRLFFBQVIsRUFMRjtTQUFBLE1BQUE7aUJBT0UsTUFBQSxDQUFXLElBQUEsS0FBQSxDQUFNLHlCQUFOLENBQVgsRUFQRjtTQUZrQjtNQUFBLENBQVQsQ0FXWCxDQUFDLElBWFUsQ0FXTCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxRQUFELEdBQUE7QUFFSixpQkFBTyxLQUFDLENBQUEsR0FBRCxDQUFLLGNBQUwsRUFBcUIsQ0FDMUIsS0FBQyxDQUFBLFVBQUQsQ0FBWSxRQUFaLEVBQXNCLElBQXRCLENBRDBCLEVBRTFCLENBQUMsY0FBRCxDQUYwQixDQUFyQixFQUdGO0FBQUEsWUFBQSxJQUFBLEVBQU07QUFBQSxjQUNQLElBQUEsRUFBTSw4Q0FEQzthQUFOO1dBSEUsQ0FLSCxDQUFDLFNBQUQsQ0FMRyxDQUtPLFNBQUEsR0FBQTttQkFDVixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFEVTtVQUFBLENBTFAsQ0FBUCxDQUZJO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FYSyxDQUFYLENBYlE7SUFBQSxDQTFCVixDQUFBOzt1QkFBQTs7S0FGeUMsV0FUM0MsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/clang-format.coffee


/*
Requires http://pear.php.net/package/PHP_Beautifier
 */

(function() {
  "use strict";
  var fs, possibleOptions, temp;

  fs = require("fs");

  temp = require("temp").track();

  possibleOptions = require("./possible-options.json");

  module.exports = function(options, cb) {
    var ic, isPossible, k, text, v, vs;
    text = "";
    options.output_tab_size = options.output_tab_size || options.indent_size;
    options.input_tab_size = options.input_tab_size || options.indent_size;
    delete options.indent_size;
    ic = options.indent_char;
    if (options.indent_with_tabs === 0 || options.indent_with_tabs === 1 || options.indent_with_tabs === 2) {

    } else if (ic === " ") {
      options.indent_with_tabs = 0;
    } else if (ic === "\t") {
      options.indent_with_tabs = 2;
    } else {
      options.indent_with_tabs = 1;
    }
    delete options.indent_char;
    delete options.languageOverride;
    delete options.configPath;
    for (k in options) {
      isPossible = possibleOptions.indexOf(k) !== -1;
      if (isPossible) {
        v = options[k];
        vs = v;
        if (typeof vs === "boolean") {
          if (vs === true) {
            vs = "True";
          } else {
            vs = "False";
          }
        }
        text += k + " = " + vs + "\n";
      } else {
        delete options[k];
      }
    }
    return temp.open({
      suffix: ".cfg"
    }, function(err, info) {
      if (!err) {
        return fs.write(info.fd, text || "", function(err) {
          if (err) {
            return cb(err);
          }
          return fs.close(info.fd, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, info.path);
          });
        });
      } else {
        return cb(err);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdW5jcnVzdGlmeS9jZmcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUdBLFlBSEEsQ0FBQTtBQUFBLE1BQUEseUJBQUE7O0FBQUEsRUFJQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FKTCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBLENBTFAsQ0FBQTs7QUFBQSxFQU1BLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHlCQUFSLENBTmxCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLE9BQUQsRUFBVSxFQUFWLEdBQUE7QUFDZixRQUFBLDhCQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sRUFBUCxDQUFBO0FBQUEsSUFHQSxPQUFPLENBQUMsZUFBUixHQUEwQixPQUFPLENBQUMsZUFBUixJQUEyQixPQUFPLENBQUMsV0FIN0QsQ0FBQTtBQUFBLElBSUEsT0FBTyxDQUFDLGNBQVIsR0FBeUIsT0FBTyxDQUFDLGNBQVIsSUFBMEIsT0FBTyxDQUFDLFdBSjNELENBQUE7QUFBQSxJQUtBLE1BQUEsQ0FBQSxPQUFjLENBQUMsV0FMZixDQUFBO0FBQUEsSUFhQSxFQUFBLEdBQUssT0FBTyxDQUFDLFdBYmIsQ0FBQTtBQWNBLElBQUEsSUFBRyxPQUFPLENBQUMsZ0JBQVIsS0FBNEIsQ0FBNUIsSUFBaUMsT0FBTyxDQUFDLGdCQUFSLEtBQTRCLENBQTdELElBQWtFLE9BQU8sQ0FBQyxnQkFBUixLQUE0QixDQUFqRztBQUFBO0tBQUEsTUFJSyxJQUFHLEVBQUEsS0FBTSxHQUFUO0FBQ0gsTUFBQSxPQUFPLENBQUMsZ0JBQVIsR0FBMkIsQ0FBM0IsQ0FERztLQUFBLE1BRUEsSUFBRyxFQUFBLEtBQU0sSUFBVDtBQUNILE1BQUEsT0FBTyxDQUFDLGdCQUFSLEdBQTJCLENBQTNCLENBREc7S0FBQSxNQUFBO0FBR0gsTUFBQSxPQUFPLENBQUMsZ0JBQVIsR0FBMkIsQ0FBM0IsQ0FIRztLQXBCTDtBQUFBLElBd0JBLE1BQUEsQ0FBQSxPQUFjLENBQUMsV0F4QmYsQ0FBQTtBQUFBLElBNkJBLE1BQUEsQ0FBQSxPQUFjLENBQUMsZ0JBN0JmLENBQUE7QUFBQSxJQThCQSxNQUFBLENBQUEsT0FBYyxDQUFDLFVBOUJmLENBQUE7QUFpQ0EsU0FBQSxZQUFBLEdBQUE7QUFFRSxNQUFBLFVBQUEsR0FBYSxlQUFlLENBQUMsT0FBaEIsQ0FBd0IsQ0FBeEIsQ0FBQSxLQUFnQyxDQUFBLENBQTdDLENBQUE7QUFDQSxNQUFBLElBQUcsVUFBSDtBQUNFLFFBQUEsQ0FBQSxHQUFJLE9BQVEsQ0FBQSxDQUFBLENBQVosQ0FBQTtBQUFBLFFBQ0EsRUFBQSxHQUFLLENBREwsQ0FBQTtBQUVBLFFBQUEsSUFBRyxNQUFBLENBQUEsRUFBQSxLQUFhLFNBQWhCO0FBQ0UsVUFBQSxJQUFHLEVBQUEsS0FBTSxJQUFUO0FBQ0UsWUFBQSxFQUFBLEdBQUssTUFBTCxDQURGO1dBQUEsTUFBQTtBQUdFLFlBQUEsRUFBQSxHQUFLLE9BQUwsQ0FIRjtXQURGO1NBRkE7QUFBQSxRQU9BLElBQUEsSUFBUSxDQUFBLEdBQUksS0FBSixHQUFZLEVBQVosR0FBaUIsSUFQekIsQ0FERjtPQUFBLE1BQUE7QUFXRSxRQUFBLE1BQUEsQ0FBQSxPQUFlLENBQUEsQ0FBQSxDQUFmLENBWEY7T0FIRjtBQUFBLEtBakNBO1dBa0RBLElBQUksQ0FBQyxJQUFMLENBQ0U7QUFBQSxNQUFBLE1BQUEsRUFBUSxNQUFSO0tBREYsRUFFRSxTQUFDLEdBQUQsRUFBTSxJQUFOLEdBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxHQUFBO2VBR0UsRUFBRSxDQUFDLEtBQUgsQ0FBUyxJQUFJLENBQUMsRUFBZCxFQUFrQixJQUFBLElBQVEsRUFBMUIsRUFBOEIsU0FBQyxHQUFELEdBQUE7QUFHNUIsVUFBQSxJQUFrQixHQUFsQjtBQUFBLG1CQUFPLEVBQUEsQ0FBRyxHQUFILENBQVAsQ0FBQTtXQUFBO2lCQUNBLEVBQUUsQ0FBQyxLQUFILENBQVMsSUFBSSxDQUFDLEVBQWQsRUFBa0IsU0FBQyxHQUFELEdBQUE7QUFHaEIsWUFBQSxJQUFrQixHQUFsQjtBQUFBLHFCQUFPLEVBQUEsQ0FBRyxHQUFILENBQVAsQ0FBQTthQUFBO21CQUNBLEVBQUEsQ0FBRyxJQUFILEVBQVMsSUFBSSxDQUFDLElBQWQsRUFKZ0I7VUFBQSxDQUFsQixFQUo0QjtRQUFBLENBQTlCLEVBSEY7T0FBQSxNQUFBO2VBZUUsRUFBQSxDQUFHLEdBQUgsRUFmRjtPQURBO0lBQUEsQ0FGRixFQW5EZTtFQUFBLENBUGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/uncrustify/cfg.coffee

(function() {
  var decimal, float, int, namePrefixes, percent, variables;

  int = '\\d+';

  decimal = "\\." + int;

  float = "(?:" + int + decimal + "|" + int + "|" + decimal + ")";

  percent = "" + float + "%";

  variables = '(?:@[a-zA-Z0-9\\-_]+|\\$[a-zA-Z0-9\\-_]+|[a-zA-Z_][a-zA-Z0-9\\-_]*)';

  namePrefixes = '^| |\\t|:|=|,|\\n|\'|"|\\(|\\[|\\{|>';

  module.exports = {
    int: int,
    float: float,
    percent: percent,
    optionalPercent: "" + float + "%?",
    intOrPercent: "(?:" + percent + "|" + int + ")",
    floatOrPercent: "(?:" + percent + "|" + float + ")",
    comma: '\\s*,\\s*',
    notQuote: "[^\"'\\n\\r]+",
    hexadecimal: '[\\da-fA-F]',
    ps: '\\(\\s*',
    pe: '\\s*\\)',
    variables: variables,
    namePrefixes: namePrefixes,
    createVariableRegExpString: function(variables) {
      var res, v, variableNamesWithPrefix, variableNamesWithoutPrefix, withPrefixes, withoutPrefixes, _i, _j, _len, _len1;
      variableNamesWithPrefix = [];
      variableNamesWithoutPrefix = [];
      withPrefixes = variables.filter(function(v) {
        return !v.noNamePrefix;
      });
      withoutPrefixes = variables.filter(function(v) {
        return v.noNamePrefix;
      });
      res = [];
      if (withPrefixes.length > 0) {
        for (_i = 0, _len = withPrefixes.length; _i < _len; _i++) {
          v = withPrefixes[_i];
          variableNamesWithPrefix.push(v.name.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
        }
        res.push("((?:" + namePrefixes + ")(" + (variableNamesWithPrefix.join('|')) + ")(\\s+!default)?(?!_|-|\\w|\\d|[ \\t]*[\\.:=]))");
      }
      if (withoutPrefixes.length > 0) {
        for (_j = 0, _len1 = withoutPrefixes.length; _j < _len1; _j++) {
          v = withoutPrefixes[_j];
          variableNamesWithoutPrefix.push(v.name.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
        }
        res.push("(" + (variableNamesWithoutPrefix.join('|')) + ")");
      }
      return res.join('|');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlZ2V4ZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE1BQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVyxLQUFBLEdBQUssR0FEaEIsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUyxLQUFBLEdBQUssR0FBTCxHQUFXLE9BQVgsR0FBbUIsR0FBbkIsR0FBc0IsR0FBdEIsR0FBMEIsR0FBMUIsR0FBNkIsT0FBN0IsR0FBcUMsR0FGOUMsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxFQUFBLEdBQUcsS0FBSCxHQUFTLEdBSG5CLENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVkscUVBSlosQ0FBQTs7QUFBQSxFQUtBLFlBQUEsR0FBZSxzQ0FMZixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsR0FBQSxFQUFLLEdBQUw7QUFBQSxJQUNBLEtBQUEsRUFBTyxLQURQO0FBQUEsSUFFQSxPQUFBLEVBQVMsT0FGVDtBQUFBLElBR0EsZUFBQSxFQUFpQixFQUFBLEdBQUcsS0FBSCxHQUFTLElBSDFCO0FBQUEsSUFJQSxZQUFBLEVBQWUsS0FBQSxHQUFLLE9BQUwsR0FBYSxHQUFiLEdBQWdCLEdBQWhCLEdBQW9CLEdBSm5DO0FBQUEsSUFLQSxjQUFBLEVBQWlCLEtBQUEsR0FBSyxPQUFMLEdBQWEsR0FBYixHQUFnQixLQUFoQixHQUFzQixHQUx2QztBQUFBLElBTUEsS0FBQSxFQUFPLFdBTlA7QUFBQSxJQU9BLFFBQUEsRUFBVSxlQVBWO0FBQUEsSUFRQSxXQUFBLEVBQWEsYUFSYjtBQUFBLElBU0EsRUFBQSxFQUFJLFNBVEo7QUFBQSxJQVVBLEVBQUEsRUFBSSxTQVZKO0FBQUEsSUFXQSxTQUFBLEVBQVcsU0FYWDtBQUFBLElBWUEsWUFBQSxFQUFjLFlBWmQ7QUFBQSxJQWFBLDBCQUFBLEVBQTRCLFNBQUMsU0FBRCxHQUFBO0FBQzFCLFVBQUEsK0dBQUE7QUFBQSxNQUFBLHVCQUFBLEdBQTBCLEVBQTFCLENBQUE7QUFBQSxNQUNBLDBCQUFBLEdBQTZCLEVBRDdCLENBQUE7QUFBQSxNQUVBLFlBQUEsR0FBZSxTQUFTLENBQUMsTUFBVixDQUFpQixTQUFDLENBQUQsR0FBQTtlQUFPLENBQUEsQ0FBSyxDQUFDLGFBQWI7TUFBQSxDQUFqQixDQUZmLENBQUE7QUFBQSxNQUdBLGVBQUEsR0FBa0IsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsU0FBQyxDQUFELEdBQUE7ZUFBTyxDQUFDLENBQUMsYUFBVDtNQUFBLENBQWpCLENBSGxCLENBQUE7QUFBQSxNQUtBLEdBQUEsR0FBTSxFQUxOLENBQUE7QUFPQSxNQUFBLElBQUcsWUFBWSxDQUFDLE1BQWIsR0FBc0IsQ0FBekI7QUFDRSxhQUFBLG1EQUFBOytCQUFBO0FBQ0UsVUFBQSx1QkFBdUIsQ0FBQyxJQUF4QixDQUE2QixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQVAsQ0FBZSxvQ0FBZixFQUFxRCxNQUFyRCxDQUE3QixDQUFBLENBREY7QUFBQSxTQUFBO0FBQUEsUUFHQSxHQUFHLENBQUMsSUFBSixDQUFVLE1BQUEsR0FBTSxZQUFOLEdBQW1CLElBQW5CLEdBQXNCLENBQUMsdUJBQXVCLENBQUMsSUFBeEIsQ0FBNkIsR0FBN0IsQ0FBRCxDQUF0QixHQUF5RCxpREFBbkUsQ0FIQSxDQURGO09BUEE7QUFhQSxNQUFBLElBQUcsZUFBZSxDQUFDLE1BQWhCLEdBQXlCLENBQTVCO0FBQ0UsYUFBQSx3REFBQTtrQ0FBQTtBQUNFLFVBQUEsMEJBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsb0NBQWYsRUFBcUQsTUFBckQsQ0FBaEMsQ0FBQSxDQURGO0FBQUEsU0FBQTtBQUFBLFFBR0EsR0FBRyxDQUFDLElBQUosQ0FBVSxHQUFBLEdBQUUsQ0FBQywwQkFBMEIsQ0FBQyxJQUEzQixDQUFnQyxHQUFoQyxDQUFELENBQUYsR0FBd0MsR0FBbEQsQ0FIQSxDQURGO09BYkE7YUFtQkEsR0FBRyxDQUFDLElBQUosQ0FBUyxHQUFULEVBcEIwQjtJQUFBLENBYjVCO0dBUkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/regexes.coffee

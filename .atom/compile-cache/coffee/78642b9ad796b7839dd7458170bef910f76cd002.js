(function() {
  var decimal, float, int, namePrefixes, percent, variables;

  int = '\\d+';

  decimal = "\\." + int;

  float = "(?:" + int + decimal + "|" + int + "|" + decimal + ")";

  percent = "" + float + "%";

  variables = '(?:@[a-zA-Z0-9\\-_]+|\\$[a-zA-Z0-9\\-_]+|[a-zA-Z_][a-zA-Z0-9\\-_]*)';

  namePrefixes = '^| |:|=|,|\\n|\'|"|\\(|\\[|\\{';

  module.exports = {
    int: int,
    float: float,
    percent: percent,
    optionalPercent: "" + float + "%?",
    intOrPercent: "(?:" + percent + "|" + int + ")",
    floatOrPercent: "(?:" + percent + "|" + float + ")",
    comma: '\\s*,\\s*',
    notQuote: "[^\"'\\n]+",
    hexadecimal: '[\\da-fA-F]',
    ps: '\\(\\s*',
    pe: '\\s*\\)',
    variables: variables,
    namePrefixes: namePrefixes,
    createVariableRegExpString: function(variables) {
      var v, variableNames, _i, _len;
      variableNames = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        v = variables[_i];
        variableNames.push(v.name.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
      }
      variableNames = variableNames.join('|');
      return "(?:" + namePrefixes + ")(" + variableNames + ")(?!_|-|\\w|\\d|[ \\t]*[\\.:=])";
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlZ2V4ZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE1BQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVyxLQUFBLEdBQUssR0FEaEIsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUyxLQUFBLEdBQUssR0FBTCxHQUFXLE9BQVgsR0FBbUIsR0FBbkIsR0FBc0IsR0FBdEIsR0FBMEIsR0FBMUIsR0FBNkIsT0FBN0IsR0FBcUMsR0FGOUMsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxFQUFBLEdBQUcsS0FBSCxHQUFTLEdBSG5CLENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVkscUVBSlosQ0FBQTs7QUFBQSxFQUtBLFlBQUEsR0FBZSxnQ0FMZixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsR0FBQSxFQUFLLEdBQUw7QUFBQSxJQUNBLEtBQUEsRUFBTyxLQURQO0FBQUEsSUFFQSxPQUFBLEVBQVMsT0FGVDtBQUFBLElBR0EsZUFBQSxFQUFpQixFQUFBLEdBQUcsS0FBSCxHQUFTLElBSDFCO0FBQUEsSUFJQSxZQUFBLEVBQWUsS0FBQSxHQUFLLE9BQUwsR0FBYSxHQUFiLEdBQWdCLEdBQWhCLEdBQW9CLEdBSm5DO0FBQUEsSUFLQSxjQUFBLEVBQWlCLEtBQUEsR0FBSyxPQUFMLEdBQWEsR0FBYixHQUFnQixLQUFoQixHQUFzQixHQUx2QztBQUFBLElBTUEsS0FBQSxFQUFPLFdBTlA7QUFBQSxJQU9BLFFBQUEsRUFBVSxZQVBWO0FBQUEsSUFRQSxXQUFBLEVBQWEsYUFSYjtBQUFBLElBU0EsRUFBQSxFQUFJLFNBVEo7QUFBQSxJQVVBLEVBQUEsRUFBSSxTQVZKO0FBQUEsSUFXQSxTQUFBLEVBQVcsU0FYWDtBQUFBLElBWUEsWUFBQSxFQUFjLFlBWmQ7QUFBQSxJQWFBLDBCQUFBLEVBQTRCLFNBQUMsU0FBRCxHQUFBO0FBQzFCLFVBQUEsMEJBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsRUFBaEIsQ0FBQTtBQUNBLFdBQUEsZ0RBQUE7MEJBQUE7QUFDRSxRQUFBLGFBQWEsQ0FBQyxJQUFkLENBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBUCxDQUFlLG9DQUFmLEVBQXFELE1BQXJELENBQW5CLENBQUEsQ0FERjtBQUFBLE9BREE7QUFBQSxNQUdBLGFBQUEsR0FBZ0IsYUFBYSxDQUFDLElBQWQsQ0FBbUIsR0FBbkIsQ0FIaEIsQ0FBQTthQUtDLEtBQUEsR0FBSyxZQUFMLEdBQWtCLElBQWxCLEdBQXNCLGFBQXRCLEdBQW9DLGtDQU5YO0lBQUEsQ0FiNUI7R0FSRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/regexes.coffee

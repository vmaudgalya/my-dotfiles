(function() {
  var ColorParser, ColorScanner, countLines, getRegistry;

  countLines = require('./utils').countLines;

  getRegistry = require('./color-expressions').getRegistry;

  ColorParser = require('./color-parser');

  module.exports = ColorScanner = (function() {
    function ColorScanner(_arg) {
      this.context = (_arg != null ? _arg : {}).context;
      this.parser = this.context.parser;
      this.registry = this.context.registry;
    }

    ColorScanner.prototype.getRegExp = function() {
      return new RegExp(this.registry.getRegExp(), 'g');
    };

    ColorScanner.prototype.getRegExpForScope = function(scope) {
      return new RegExp(this.registry.getRegExpForScope(scope), 'g');
    };

    ColorScanner.prototype.search = function(text, scope, start) {
      var color, index, lastIndex, match, matchText, regexp;
      if (start == null) {
        start = 0;
      }
      regexp = this.getRegExpForScope(scope);
      regexp.lastIndex = start;
      if (match = regexp.exec(text)) {
        matchText = match[0];
        lastIndex = regexp.lastIndex;
        color = this.parser.parse(matchText, scope);
        if ((index = matchText.indexOf(color.colorExpression)) > 0) {
          lastIndex += -matchText.length + index + color.colorExpression.length;
          matchText = color.colorExpression;
        }
        return {
          color: color,
          match: matchText,
          lastIndex: lastIndex,
          range: [lastIndex - matchText.length, lastIndex],
          line: countLines(text.slice(0, +(lastIndex - matchText.length) + 1 || 9e9)) - 1
        };
      }
    };

    return ColorScanner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXNjYW5uZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsU0FBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNDLGNBQWUsT0FBQSxDQUFRLHFCQUFSLEVBQWYsV0FERCxDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUZkLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxzQkFBQyxJQUFELEdBQUE7QUFDWCxNQURhLElBQUMsQ0FBQSwwQkFBRixPQUFXLElBQVQsT0FDZCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBbkIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBRHJCLENBRFc7SUFBQSxDQUFiOztBQUFBLDJCQUlBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDTCxJQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVYsQ0FBQSxDQUFQLEVBQThCLEdBQTlCLEVBREs7SUFBQSxDQUpYLENBQUE7O0FBQUEsMkJBT0EsaUJBQUEsR0FBbUIsU0FBQyxLQUFELEdBQUE7YUFDYixJQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsUUFBUSxDQUFDLGlCQUFWLENBQTRCLEtBQTVCLENBQVAsRUFBMkMsR0FBM0MsRUFEYTtJQUFBLENBUG5CLENBQUE7O0FBQUEsMkJBVUEsTUFBQSxHQUFRLFNBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxLQUFkLEdBQUE7QUFDTixVQUFBLGlEQUFBOztRQURvQixRQUFNO09BQzFCO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLGlCQUFELENBQW1CLEtBQW5CLENBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLFNBQVAsR0FBbUIsS0FEbkIsQ0FBQTtBQUdBLE1BQUEsSUFBRyxLQUFBLEdBQVEsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFaLENBQVg7QUFDRSxRQUFDLFlBQWEsUUFBZCxDQUFBO0FBQUEsUUFDQyxZQUFhLE9BQWIsU0FERCxDQUFBO0FBQUEsUUFHQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsU0FBZCxFQUF5QixLQUF6QixDQUhSLENBQUE7QUFPQSxRQUFBLElBQUcsQ0FBQyxLQUFBLEdBQVEsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsS0FBSyxDQUFDLGVBQXhCLENBQVQsQ0FBQSxHQUFxRCxDQUF4RDtBQUNFLFVBQUEsU0FBQSxJQUFhLENBQUEsU0FBVSxDQUFDLE1BQVgsR0FBb0IsS0FBcEIsR0FBNEIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxNQUEvRCxDQUFBO0FBQUEsVUFDQSxTQUFBLEdBQVksS0FBSyxDQUFDLGVBRGxCLENBREY7U0FQQTtlQVdBO0FBQUEsVUFBQSxLQUFBLEVBQU8sS0FBUDtBQUFBLFVBQ0EsS0FBQSxFQUFPLFNBRFA7QUFBQSxVQUVBLFNBQUEsRUFBVyxTQUZYO0FBQUEsVUFHQSxLQUFBLEVBQU8sQ0FDTCxTQUFBLEdBQVksU0FBUyxDQUFDLE1BRGpCLEVBRUwsU0FGSyxDQUhQO0FBQUEsVUFPQSxJQUFBLEVBQU0sVUFBQSxDQUFXLElBQUsscURBQWhCLENBQUEsR0FBb0QsQ0FQMUQ7VUFaRjtPQUpNO0lBQUEsQ0FWUixDQUFBOzt3QkFBQTs7TUFORixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-scanner.coffee

(function() {
  var VariableParser;

  module.exports = VariableParser = (function() {
    function VariableParser(registry) {
      this.registry = registry;
    }

    VariableParser.prototype.parse = function(expression) {
      var e, _i, _len, _ref;
      _ref = this.registry.getExpressions();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.match(expression)) {
          return e.parse(expression);
        }
      }
    };

    return VariableParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlLXBhcnNlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsY0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHdCQUFFLFFBQUYsR0FBQTtBQUFhLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFiO0lBQUEsQ0FBYjs7QUFBQSw2QkFDQSxLQUFBLEdBQU8sU0FBQyxVQUFELEdBQUE7QUFDTCxVQUFBLGlCQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3FCQUFBO0FBQ0UsUUFBQSxJQUE4QixDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsQ0FBOUI7QUFBQSxpQkFBTyxDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsQ0FBUCxDQUFBO1NBREY7QUFBQSxPQURLO0lBQUEsQ0FEUCxDQUFBOzswQkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/variable-parser.coffee

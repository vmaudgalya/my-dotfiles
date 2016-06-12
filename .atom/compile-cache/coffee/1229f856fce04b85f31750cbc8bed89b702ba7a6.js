(function() {
  var findClosingIndex, split, _ref;

  _ref = require('../lib/utils'), findClosingIndex = _ref.findClosingIndex, split = _ref.split;

  describe('split', function() {
    return it('does not fail when there is parenthesis after', function() {
      var res, string;
      string = "a,)(";
      res = split(string);
      return expect(res).toEqual(['a', '']);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy91dGlscy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2QkFBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxjQUFSLENBQTVCLEVBQUMsd0JBQUEsZ0JBQUQsRUFBbUIsYUFBQSxLQUFuQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO1dBQ2hCLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsVUFBQSxXQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsTUFBVCxDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQU0sS0FBQSxDQUFNLE1BQU4sQ0FGTixDQUFBO2FBSUEsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLE9BQVosQ0FBb0IsQ0FBQyxHQUFELEVBQUssRUFBTCxDQUFwQixFQUxrRDtJQUFBLENBQXBELEVBRGdCO0VBQUEsQ0FBbEIsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/utils-spec.coffee

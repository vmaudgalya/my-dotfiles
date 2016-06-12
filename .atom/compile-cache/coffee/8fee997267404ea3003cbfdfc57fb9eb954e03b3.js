(function() {
  var VariableParser, registry;

  VariableParser = require('../lib/variable-parser');

  registry = require('../lib/variable-expressions');

  describe('VariableParser', function() {
    var itParses, parser;
    parser = [][0];
    itParses = function(expression) {
      return {
        description: '',
        as: function(variables) {
          it("parses the '" + expression + "' as variables " + (jasmine.pp(variables)), function() {
            var expected, name, range, results, value, _i, _len, _ref, _results;
            results = parser.parse(expression);
            expect(results.length).toEqual(Object.keys(variables).length);
            _results = [];
            for (_i = 0, _len = results.length; _i < _len; _i++) {
              _ref = results[_i], name = _ref.name, value = _ref.value, range = _ref.range;
              expected = variables[name];
              if (expected.value != null) {
                _results.push(expect(value).toEqual(expected.value));
              } else if (expected.range != null) {
                _results.push(expect(range).toEqual(expected.range));
              } else {
                _results.push(expect(value).toEqual(expected));
              }
            }
            return _results;
          });
          return this;
        }
      };
    };
    beforeEach(function() {
      return parser = new VariableParser(registry);
    });
    itParses('color = white').as({
      'color': 'white'
    });
    itParses('non-color = 10px').as({
      'non-color': '10px'
    });
    itParses('$color: white;').as({
      '$color': 'white'
    });
    itParses('$color: white').as({
      '$color': 'white'
    });
    itParses('$non-color: 10px;').as({
      '$non-color': '10px'
    });
    itParses('$non-color: 10px').as({
      '$non-color': '10px'
    });
    itParses('@color: white;').as({
      '@color': 'white'
    });
    itParses('@non-color: 10px;').as({
      '@non-color': '10px'
    });
    return itParses("colors = {\n  red: rgb(255,0,0),\n  green: rgb(0,255,0),\n  blue: rgb(0,0,255)\n  value: 10px\n  light: {\n    base: lightgrey\n  }\n  dark: {\n    base: slategrey\n  }\n}").as({
      'colors.red': {
        value: 'rgb(255,0,0)',
        range: [[1, 2], [1, 14]]
      },
      'colors.green': {
        value: 'rgb(0,255,0)',
        range: [[2, 2], [2, 16]]
      },
      'colors.blue': {
        value: 'rgb(0,0,255)',
        range: [[3, 2], [3, 15]]
      },
      'colors.value': {
        value: '10px',
        range: [[4, 2], [4, 13]]
      },
      'colors.light.base': {
        value: 'lightgrey',
        range: [[9, 4], [9, 17]]
      },
      'colors.dark.base': {
        value: 'slategrey',
        range: [[12, 4], [12, 14]]
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy92YXJpYWJsZS1wYXJzZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUFqQixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSw2QkFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsZ0JBQUE7QUFBQSxJQUFDLFNBQVUsS0FBWCxDQUFBO0FBQUEsSUFFQSxRQUFBLEdBQVcsU0FBQyxVQUFELEdBQUE7YUFDVDtBQUFBLFFBQUEsV0FBQSxFQUFhLEVBQWI7QUFBQSxRQUNBLEVBQUEsRUFBSSxTQUFDLFNBQUQsR0FBQTtBQUNGLFVBQUEsRUFBQSxDQUFJLGNBQUEsR0FBYyxVQUFkLEdBQXlCLGlCQUF6QixHQUF5QyxDQUFDLE9BQU8sQ0FBQyxFQUFSLENBQVcsU0FBWCxDQUFELENBQTdDLEVBQXVFLFNBQUEsR0FBQTtBQUNyRSxnQkFBQSwrREFBQTtBQUFBLFlBQUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxLQUFQLENBQWEsVUFBYixDQUFWLENBQUE7QUFBQSxZQUVBLE1BQUEsQ0FBTyxPQUFPLENBQUMsTUFBZixDQUFzQixDQUFDLE9BQXZCLENBQStCLE1BQU0sQ0FBQyxJQUFQLENBQVksU0FBWixDQUFzQixDQUFDLE1BQXRELENBRkEsQ0FBQTtBQUdBO2lCQUFBLDhDQUFBLEdBQUE7QUFDRSxrQ0FERyxZQUFBLE1BQU0sYUFBQSxPQUFPLGFBQUEsS0FDaEIsQ0FBQTtBQUFBLGNBQUEsUUFBQSxHQUFXLFNBQVUsQ0FBQSxJQUFBLENBQXJCLENBQUE7QUFDQSxj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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/variable-parser-spec.coffee

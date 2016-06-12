(function() {
  var VariableScanner, registry;

  VariableScanner = require('../lib/variable-scanner');

  registry = require('../lib/variable-expressions');

  describe('VariableScanner', function() {
    var editor, scanner, text, withScannerForTextEditor, withTextEditor, _ref;
    _ref = [], scanner = _ref[0], editor = _ref[1], text = _ref[2];
    withTextEditor = function(fixture, block) {
      return describe("with " + fixture + " buffer", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(fixture);
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            return text = editor.getText();
          });
        });
        afterEach(function() {
          return editor = null;
        });
        return block();
      });
    };
    withScannerForTextEditor = function(fixture, block) {
      return withTextEditor(fixture, function() {
        beforeEach(function() {
          return scanner = new VariableScanner({
            registry: registry
          });
        });
        afterEach(function() {
          return scanner = null;
        });
        return block();
      });
    };
    return describe('::search', function() {
      var result;
      result = [][0];
      withScannerForTextEditor('four-variables.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        it('returns the first match', function() {
          return expect(result).toBeDefined();
        });
        describe('the result object', function() {
          it('has a match string', function() {
            return expect(result.match).toEqual('base-color = #fff');
          });
          it('has a lastIndex property', function() {
            return expect(result.lastIndex).toEqual(17);
          });
          it('has a range property', function() {
            return expect(result.range).toEqual([0, 17]);
          });
          return it('has a variable result', function() {
            expect(result[0].name).toEqual('base-color');
            expect(result[0].value).toEqual('#fff');
            expect(result[0].range).toEqual([0, 17]);
            return expect(result[0].line).toEqual(0);
          });
        });
        describe('the second result object', function() {
          beforeEach(function() {
            return result = scanner.search(text, result.lastIndex);
          });
          it('has a match string', function() {
            return expect(result.match).toEqual('other-color = transparentize(base-color, 50%)');
          });
          it('has a lastIndex property', function() {
            return expect(result.lastIndex).toEqual(64);
          });
          it('has a range property', function() {
            return expect(result.range).toEqual([19, 64]);
          });
          return it('has a variable result', function() {
            expect(result[0].name).toEqual('other-color');
            expect(result[0].value).toEqual('transparentize(base-color, 50%)');
            expect(result[0].range).toEqual([19, 64]);
            return expect(result[0].line).toEqual(2);
          });
        });
        return describe('successive searches', function() {
          return it('returns a result for each match and then undefined', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, result.lastIndex);
            };
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            return expect(doSearch()).toBeUndefined();
          });
        });
      });
      withScannerForTextEditor('incomplete-stylus-hash.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('does not find any variables', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('variables-in-arguments.scss', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('does not find any variables', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('attribute-selectors.scss', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('does not find any variables', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('variables-in-conditions.scss', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          doSearch();
          return doSearch();
        });
        return it('does not find the variable in the if clause', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('variables-after-mixins.scss', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          return doSearch();
        });
        return it('finds the variable after the mixin', function() {
          return expect(result).toBeDefined();
        });
      });
      return withScannerForTextEditor('variables-from-other-process.less', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          return doSearch();
        });
        return it('finds the variable with an interpolation tag', function() {
          return expect(result).toBeDefined();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy92YXJpYWJsZS1zY2FubmVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEseUJBQVIsQ0FBbEIsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsNkJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLHFFQUFBO0FBQUEsSUFBQSxPQUEwQixFQUExQixFQUFDLGlCQUFELEVBQVUsZ0JBQVYsRUFBa0IsY0FBbEIsQ0FBQTtBQUFBLElBRUEsY0FBQSxHQUFpQixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7YUFDZixRQUFBLENBQVUsT0FBQSxHQUFPLE9BQVAsR0FBZSxTQUF6QixFQUFtQyxTQUFBLEdBQUE7QUFDakMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTttQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsT0FBcEIsRUFBSDtVQUFBLENBQWhCLENBQUEsQ0FBQTtpQkFDQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTttQkFDQSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxFQUZKO1VBQUEsQ0FBTCxFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQU1BLFNBQUEsQ0FBVSxTQUFBLEdBQUE7aUJBQUcsTUFBQSxHQUFTLEtBQVo7UUFBQSxDQUFWLENBTkEsQ0FBQTtlQVFHLEtBQUgs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/variable-scanner-spec.coffee

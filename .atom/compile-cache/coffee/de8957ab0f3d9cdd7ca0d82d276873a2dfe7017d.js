(function() {
  var VariableScanner, path, registry, scopeFromFileName;

  path = require('path');

  VariableScanner = require('../lib/variable-scanner');

  registry = require('../lib/variable-expressions');

  scopeFromFileName = require('../lib/scope-from-file-name');

  describe('VariableScanner', function() {
    var editor, scanner, scope, text, withScannerForTextEditor, withTextEditor, _ref;
    _ref = [], scanner = _ref[0], editor = _ref[1], text = _ref[2], scope = _ref[3];
    withTextEditor = function(fixture, block) {
      return describe("with " + fixture + " buffer", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(fixture);
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            text = editor.getText();
            return scope = scopeFromFileName(editor.getPath());
          });
        });
        afterEach(function() {
          editor = null;
          return scope = null;
        });
        return block();
      });
    };
    withScannerForTextEditor = function(fixture, block) {
      return withTextEditor(fixture, function() {
        beforeEach(function() {
          return scanner = new VariableScanner({
            registry: registry,
            scope: scope
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
      withScannerForTextEditor('variables-from-other-process.less', function() {
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
      return withScannerForTextEditor('crlf.styl', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          doSearch();
          return doSearch();
        });
        return it('finds all the variables even with crlf mode', function() {
          return expect(result).toBeDefined();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy92YXJpYWJsZS1zY2FubmVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHlCQUFSLENBRGxCLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDZCQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSw2QkFBUixDQUhwQixDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLDRFQUFBO0FBQUEsSUFBQSxPQUFpQyxFQUFqQyxFQUFDLGlCQUFELEVBQVUsZ0JBQVYsRUFBa0IsY0FBbEIsRUFBd0IsZUFBeEIsQ0FBQTtBQUFBLElBRUEsY0FBQSxHQUFpQixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7YUFDZixRQUFBLENBQVUsT0FBQSxHQUFPLE9BQVAsR0FBZSxTQUF6QixFQUFtQyxTQUFBLEdBQUE7QUFDakMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTttQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsT0FBcEIsRUFBSDtVQUFBLENBQWhCLENBQUEsQ0FBQTtpQkFDQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLFlBQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FEUCxDQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/variable-scanner-spec.coffee

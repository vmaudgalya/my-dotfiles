(function() {
  var ColorContext, ColorScanner, registry;

  ColorScanner = require('../lib/color-scanner');

  ColorContext = require('../lib/color-context');

  registry = require('../lib/color-expressions');

  describe('ColorScanner', function() {
    var editor, lastIndex, result, scanner, text, withScannerForTextEditor, withTextEditor, _ref;
    _ref = [], scanner = _ref[0], editor = _ref[1], text = _ref[2], result = _ref[3], lastIndex = _ref[4];
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
          var context;
          context = new ColorContext({
            registry: registry
          });
          return scanner = new ColorScanner({
            context: context
          });
        });
        afterEach(function() {
          return scanner = null;
        });
        return block();
      });
    };
    return describe('::search', function() {
      withScannerForTextEditor('html-entities.html', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'html');
        });
        return it('returns nothing', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('css-color-with-prefix.less', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'less');
        });
        return it('returns nothing', function() {
          return expect(result).toBeUndefined();
        });
      });
      return withScannerForTextEditor('four-variables.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'styl');
        });
        it('returns the first buffer color match', function() {
          return expect(result).toBeDefined();
        });
        describe('the resulting buffer color', function() {
          it('has a text range', function() {
            return expect(result.range).toEqual([13, 17]);
          });
          it('has a color', function() {
            return expect(result.color).toBeColor('#ffffff');
          });
          it('stores the matched text', function() {
            return expect(result.match).toEqual('#fff');
          });
          it('stores the last index', function() {
            return expect(result.lastIndex).toEqual(17);
          });
          return it('stores match line', function() {
            return expect(result.line).toEqual(0);
          });
        });
        describe('successive searches', function() {
          it('returns a buffer color for each match and then undefined', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, 'styl', result.lastIndex);
            };
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            return expect(doSearch()).toBeUndefined();
          });
          return it('stores the line of successive matches', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, 'styl', result.lastIndex);
            };
            expect(doSearch().line).toEqual(2);
            expect(doSearch().line).toEqual(4);
            return expect(doSearch().line).toEqual(6);
          });
        });
        withScannerForTextEditor('class-after-color.sass', function() {
          beforeEach(function() {
            return result = scanner.search(text, 'sass');
          });
          it('returns the first buffer color match', function() {
            return expect(result).toBeDefined();
          });
          return describe('the resulting buffer color', function() {
            it('has a text range', function() {
              return expect(result.range).toEqual([15, 20]);
            });
            return it('has a color', function() {
              return expect(result.color).toBeColor('#ffffff');
            });
          });
        });
        withScannerForTextEditor('project/styles/variables.styl', function() {
          beforeEach(function() {
            return result = scanner.search(text, 'styl');
          });
          it('returns the first buffer color match', function() {
            return expect(result).toBeDefined();
          });
          return describe('the resulting buffer color', function() {
            it('has a text range', function() {
              return expect(result.range).toEqual([18, 25]);
            });
            return it('has a color', function() {
              return expect(result.color).toBeColor('#BF616A');
            });
          });
        });
        withScannerForTextEditor('crlf.styl', function() {
          beforeEach(function() {
            return result = scanner.search(text, 'styl');
          });
          it('returns the first buffer color match', function() {
            return expect(result).toBeDefined();
          });
          describe('the resulting buffer color', function() {
            it('has a text range', function() {
              return expect(result.range).toEqual([7, 11]);
            });
            return it('has a color', function() {
              return expect(result.color).toBeColor('#ffffff');
            });
          });
          return it('finds the second color', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, 'styl', result.lastIndex);
            };
            doSearch();
            return expect(result.color).toBeDefined();
          });
        });
        return withScannerForTextEditor('color-in-tag-content.html', function() {
          return it('finds both colors', function() {
            var doSearch;
            result = {
              lastIndex: 0
            };
            doSearch = function() {
              return result = scanner.search(text, 'css', result.lastIndex);
            };
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            return expect(doSearch()).toBeUndefined();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1zY2FubmVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQUFmLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsMEJBQVIsQ0FGWCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsd0ZBQUE7QUFBQSxJQUFBLE9BQTZDLEVBQTdDLEVBQUMsaUJBQUQsRUFBVSxnQkFBVixFQUFrQixjQUFsQixFQUF3QixnQkFBeEIsRUFBZ0MsbUJBQWhDLENBQUE7QUFBQSxJQUVBLGNBQUEsR0FBaUIsU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO2FBQ2YsUUFBQSxDQUFVLE9BQUEsR0FBTyxPQUFQLEdBQWUsU0FBekIsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLE9BQXBCLEVBQUg7VUFBQSxDQUFoQixDQUFBLENBQUE7aUJBQ0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7bUJBQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsRUFGSjtVQUFBLENBQUwsRUFGUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFNQSxTQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-scanner-spec.coffee

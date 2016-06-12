(function() {
  describe('linter-registry', function() {
    var EditorLinter, LinterRegistry, getLinter, getMessage, linterRegistry, _ref;
    LinterRegistry = require('../lib/linter-registry');
    EditorLinter = require('../lib/editor-linter');
    linterRegistry = null;
    _ref = require('./common'), getLinter = _ref.getLinter, getMessage = _ref.getMessage;
    beforeEach(function() {
      waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('file.txt');
      });
      if (linterRegistry != null) {
        linterRegistry.dispose();
      }
      return linterRegistry = new LinterRegistry;
    });
    describe('::addLinter', function() {
      it('adds error notification if linter is invalid', function() {
        linterRegistry.addLinter({});
        return expect(atom.notifications.getNotifications().length).toBe(1);
      });
      it('pushes linter into registry when valid', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linterRegistry.linters.size).toBe(1);
      });
      return it('set deactivated to false on linter', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linter.deactivated).toBe(false);
      });
    });
    describe('::hasLinter', function() {
      it('returns true if present', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linterRegistry.hasLinter(linter)).toBe(true);
      });
      return it('returns false if not', function() {
        var linter;
        linter = getLinter();
        return expect(linterRegistry.hasLinter(linter)).toBe(false);
      });
    });
    describe('::deleteLinter', function() {
      it('deletes the linter from registry', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        expect(linterRegistry.hasLinter(linter)).toBe(true);
        linterRegistry.deleteLinter(linter);
        return expect(linterRegistry.hasLinter(linter)).toBe(false);
      });
      return it('sets deactivated to true on linter', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        linterRegistry.deleteLinter(linter);
        return expect(linter.deactivated).toBe(true);
      });
    });
    describe('::lint', function() {
      it("doesn't lint if textEditor isn't active one", function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          modifiesBuffer: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        return waitsForPromise(function() {
          return atom.workspace.open('test2.txt').then(function() {
            return expect(linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            })).toBeUndefined();
          });
        });
      });
      it("doesn't lint if textEditor doesn't have a path", function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        return waitsForPromise(function() {
          return atom.workspace.open('someNonExistingFile.txt').then(function() {
            return expect(linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            })).toBeUndefined();
          });
        });
      });
      return it('disallows two co-current lints of same type', function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        expect(linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        })).toBeDefined();
        return expect(linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        })).toBeUndefined();
      });
    });
    return describe('::onDidUpdateMessages', function() {
      return it('is triggered whenever messages change', function() {
        var editorLinter, info, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          scope: 'file',
          lint: function() {
            return [
              {
                type: 'Error',
                text: 'Something'
              }
            ];
          }
        };
        info = void 0;
        linterRegistry.addLinter(linter);
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          return info = linterInfo;
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(info).toBeDefined();
            return expect(info.messages.length).toBe(1);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvbGludGVyLXJlZ2lzdHJ5LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSx5RUFBQTtBQUFBLElBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FBakIsQ0FBQTtBQUFBLElBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQURmLENBQUE7QUFBQSxJQUVBLGNBQUEsR0FBaUIsSUFGakIsQ0FBQTtBQUFBLElBR0EsT0FBMEIsT0FBQSxDQUFRLFVBQVIsQ0FBMUIsRUFBQyxpQkFBQSxTQUFELEVBQVksa0JBQUEsVUFIWixDQUFBO0FBQUEsSUFLQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtBQUNkLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBZixDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixVQUFwQixFQUZjO01BQUEsQ0FBaEIsQ0FBQSxDQUFBOztRQUdBLGNBQWMsQ0FBRSxPQUFoQixDQUFBO09BSEE7YUFJQSxjQUFBLEdBQWlCLEdBQUEsQ0FBQSxlQUxSO0lBQUEsQ0FBWCxDQUxBLENBQUE7QUFBQSxJQVlBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixNQUFBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBLEdBQUE7QUFDakQsUUFBQSxjQUFjLENBQUMsU0FBZixDQUF5QixFQUF6QixDQUFBLENBQUE7ZUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBbkIsQ0FBQSxDQUFxQyxDQUFDLE1B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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/linter-registry-spec.coffee

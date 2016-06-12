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
        return expect(linterRegistry.linters.length).toBe(1);
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
          modifiesBuffer: false,
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
      it('disallows two co-current lints of same type', function() {
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
        expect(linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        })).toBeDefined();
        return expect(linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        })).toBeUndefined();
      });
      return describe('buffer modifying linter', function() {
        it('triggers before other linters', function() {
          var bufferModifying, editorLinter, last, normalLinter;
          last = null;
          normalLinter = {
            grammarScopes: ['*'],
            lintOnFly: false,
            modifiesBuffer: false,
            scope: 'file',
            lint: function() {
              return last = 'normal';
            }
          };
          bufferModifying = {
            grammarScopes: ['*'],
            lintOnFly: false,
            modifiesBuffer: true,
            scope: 'file',
            lint: function() {
              return last = 'bufferModifying';
            }
          };
          editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
          linterRegistry.addLinter(normalLinter);
          linterRegistry.addLinter(bufferModifying);
          return waitsForPromise(function() {
            return linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            }).then(function() {
              return expect(last).toBe('normal');
            });
          });
        });
        return it('runs in sequence', function() {
          var editorLinter, first, order, second, third;
          order = [];
          first = {
            grammarScopes: ['*'],
            lintOnFly: false,
            modifiesBuffer: true,
            scope: 'file',
            lint: function() {
              return order.push('first');
            }
          };
          second = {
            grammarScopes: ['*'],
            lintOnFly: false,
            modifiesBuffer: true,
            scope: 'file',
            lint: function() {
              return order.push('second');
            }
          };
          third = {
            grammarScopes: ['*'],
            lintOnFly: false,
            modifiesBuffer: true,
            scope: 'file',
            lint: function() {
              return order.push('third');
            }
          };
          editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
          linterRegistry.addLinter(first);
          linterRegistry.addLinter(second);
          linterRegistry.addLinter(third);
          return waitsForPromise(function() {
            return linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            }).then(function() {
              expect(order[0]).toBe('first');
              expect(order[1]).toBe('second');
              return expect(order[2]).toBe('third');
            });
          });
        });
      });
    });
    return describe('::onDidUpdateMessages', function() {
      return it('is triggered whenever messages change', function() {
        var editorLinter, info, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          modifiesBuffer: false,
          scope: 'file',
          lint: function() {
            return [
              {
                type: "Error",
                text: "Something"
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

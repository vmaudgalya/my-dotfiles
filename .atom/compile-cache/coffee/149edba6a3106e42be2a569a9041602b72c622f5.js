(function() {
  describe('validate', function() {
    var getLinter, validate;
    validate = require('../lib/validate');
    getLinter = require('./common').getLinter;
    describe('::linter', function() {
      it('throws error if grammarScopes is not an array', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          linter.grammarScopes = false;
          return validate.linter(linter);
        }).toThrow('grammarScopes is not an Array. Got: false');
      });
      it('throws if lint is missing', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          delete linter.lint;
          return validate.linter(linter);
        }).toThrow();
      });
      it('throws if lint is not a function', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          linter.lint = 'woah';
          return validate.linter(linter);
        }).toThrow();
      });
      it('works well with name attribute', function() {
        var linter;
        expect(function() {
          var linter;
          linter = getLinter();
          linter.name = 1;
          return validate.linter(linter);
        }).toThrow('Linter.name must be a string');
        linter = getLinter();
        linter.name = null;
        return validate.linter(linter);
      });
      it('works well with scope attribute', function() {
        var linter;
        expect(function() {
          var linter;
          linter = getLinter();
          linter.scope = null;
          return validate.linter(linter);
        }).toThrow('Linter.scope must be either `file` or `project`');
        expect(function() {
          var linter;
          linter = getLinter();
          linter.scope = 'a';
          return validate.linter(linter);
        }).toThrow('Linter.scope must be either `file` or `project`');
        linter = getLinter();
        linter.scope = 'Project';
        return validate.linter(linter);
      });
      return it('works overall', function() {
        validate.linter(getLinter());
        return expect(true).toBe(true);
      });
    });
    return describe('::messages', function() {
      it('throws if messages is not an array', function() {
        expect(function() {
          return validate.messages();
        }).toThrow('Expected messages to be array, provided: undefined');
        return expect(function() {
          return validate.messages(true);
        }).toThrow('Expected messages to be array, provided: boolean');
      });
      it('throws if type field is not present', function() {
        return expect(function() {
          return validate.messages([{}], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if type field is invalid', function() {
        return expect(function() {
          return validate.messages([
            {
              type: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it("throws if there's no html/text field on message", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 'Error'
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if html/text is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: false
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: false
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: []
            }
          ], {
            name: ''
          });
        }).toThrow();
        return expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: []
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if trace is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 'a',
              trace: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            html: 'a',
            trace: false
          }
        ], {
          name: ''
        });
      });
      it('throws if class is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": []
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error'
          }
        ], {
          name: ''
        });
      });
      it('throws if filePath is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": 'error',
              filePath: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
      });
      return it('throws if both text and html are provided', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              html: 'a',
              "class": 'error',
              filePath: '/'
            }
          ], {
            name: ''
          });
        }).toThrow();
        validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
        validate.messages([
          {
            type: 'Error',
            html: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
        return validate.messages([
          {
            type: 'Error',
            html: document.createElement('div'),
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvdmFsaWRhdGUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFFBQUEsbUJBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FBWCxDQUFBO0FBQUEsSUFDQyxZQUFhLE9BQUEsQ0FBUSxVQUFSLEVBQWIsU0FERCxDQUFBO0FBQUEsSUFFQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsTUFBQSxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO2VBQ2xELE1BQUEsQ0FBTyxTQUFBLEdBQUE7QUFDTCxjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxTQUFBLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsYUFBUCxHQUF1QixLQUR2QixDQUFBO2lCQUVBLFFBQVEsQ0FBQyxNQUFULENBQWdCLE1BQWhCLEVBSEs7UUFBQSxDQUFQLENBSUEsQ0FBQyxPQUpELENBSVMsMkNBSlQsRUFEa0Q7TUFBQSxDQUFwRCxDQUFBLENBQUE7QUFBQSxNQU1BLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7ZUFDOUIsTUFBQSxDQUFPLFNBQUEsR0FBQTtBQUNMLGNBQUEsTUFBQTtBQUFBLFVBQUEsTUFBQSxHQUFTLFNBQUEsQ0FBQSxDQUFULENBQUE7QUFBQSxVQUNBLE1BQUEsQ0FBQSxNQUFhLENBQUMsSUFEZCxDQUFBO2lCQUVBLFFBQVEsQ0FBQyxNQUFULENBQWdCLE1BQWhCLEVBSEs7UUFBQSxDQUFQLENBSUEsQ0FBQyxPQUpELENBQUEsRUFEOEI7TUFBQSxDQUFoQyxDQU5BLENBQUE7QUFBQSxN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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/validate-spec.coffee

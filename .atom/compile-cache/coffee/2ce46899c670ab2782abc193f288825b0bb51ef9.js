(function() {
  describe('validate', function() {
    var validate;
    validate = require('../lib/validate');
    describe('::linter', function() {
      it('throws error if grammarScopes is not an array', function() {
        return expect(function() {
          return validate.linter({
            lint: function() {}
          });
        }).toThrow("grammarScopes is not an Array. Got: undefined");
      });
      it('throws if lint is missing', function() {
        return expect(function() {
          return validate.linter({
            grammarScopes: []
          });
        }).toThrow();
      });
      return it('throws if lint is not a function', function() {
        return expect(function() {
          return validate.linter({
            grammarScopes: [],
            lint: true
          });
        }).toThrow();
      });
    });
    return describe('::messages', function() {
      it('throws if messages is not an array', function() {
        expect(function() {
          return validate.messages();
        }).toThrow("Expected messages to be array, provided: undefined");
        return expect(function() {
          return validate.messages(true);
        }).toThrow("Expected messages to be array, provided: boolean");
      });
      it('throws if type field is not present', function() {
        return expect(function() {
          return validate.messages([{}]);
        }).toThrow();
      });
      it("throws if type field is invalid", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 1
            }
          ]);
        }).toThrow();
      });
      it("throws if there's no html/text field on message", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 'Error'
            }
          ]);
        }).toThrow();
      });
      it("throws if html/text is invalid", function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 1
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 1
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: false
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: false
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: []
            }
          ]);
        }).toThrow();
        return expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: []
            }
          ]);
        }).toThrow();
      });
      return it('throws if trace is invalid', function() {
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
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvdmFsaWRhdGUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFFBQUEsUUFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQUFYLENBQUE7QUFBQSxJQUNBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7ZUFDbEQsTUFBQSxDQUFPLFNBQUEsR0FBQTtpQkFDTCxRQUFRLENBQUMsTUFBVCxDQUFnQjtBQUFBLFlBQUMsSUFBQSxFQUFNLFNBQUEsR0FBQSxDQUFQO1dBQWhCLEVBREs7UUFBQSxDQUFQLENBRUEsQ0FBQyxPQUZELENBRVMsK0NBRlQsRUFEa0Q7TUFBQSxDQUFwRCxDQUFBLENBQUE7QUFBQSxNQUlBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7ZUFDOUIsTUFBQSxDQUFPLFNBQUEsR0FBQTtpQkFDTCxRQUFRLENBQUMsTUFBVCxDQUFnQjtBQUFBLFlBQUMsYUFBQSxFQUFlLEVBQWhCO1dBQWhCLEVBREs7UUFBQSxDQUFQLENBRUEsQ0FBQyxPQUZELENBQUEsRUFEOEI7TUFBQSxDQUFoQyxDQUpBLENBQUE7YUFRQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO2VBQ3JDLE1BQUEsQ0FBTyxTQUFBLEdBQUE7aUJBQ0wsUUFBUSxDQUFDLE1BQVQsQ0FBZ0I7QUFBQSxZQUFDLGFBQUEsRUFBZSxFQUFoQjtBQUFBLFlBQW9CLElBQUEsRUFBTSxJQUExQjtXQUFoQixFQURLO1FBQUEsQ0FBUCxDQUVBLENBQUMsT0FGRCxDQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/validate-spec.coffee

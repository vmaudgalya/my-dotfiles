(function() {
  var ExpressionsRegistry;

  ExpressionsRegistry = require('../lib/expressions-registry');

  describe('ExpressionsRegistry', function() {
    var Dummy, registry, _ref;
    _ref = [], registry = _ref[0], Dummy = _ref[1];
    beforeEach(function() {
      Dummy = (function() {
        function Dummy(_arg) {
          this.name = _arg.name, this.regexpString = _arg.regexpString, this.priority = _arg.priority, this.scopes = _arg.scopes, this.handle = _arg.handle;
        }

        return Dummy;

      })();
      return registry = new ExpressionsRegistry(Dummy);
    });
    describe('::createExpression', function() {
      return describe('called with enough data', function() {
        return it('creates a new expression of this registry expressions type', function() {
          var expression;
          expression = registry.createExpression('dummy', 'foo');
          expect(expression.constructor).toBe(Dummy);
          return expect(registry.getExpressions()).toEqual([expression]);
        });
      });
    });
    describe('::addExpression', function() {
      return it('adds a previously created expression in the registry', function() {
        var expression;
        expression = new Dummy({
          name: 'bar'
        });
        registry.addExpression(expression);
        expect(registry.getExpression('bar')).toBe(expression);
        return expect(registry.getExpressions()).toEqual([expression]);
      });
    });
    describe('::getExpressions', function() {
      return it('returns the expression based on their priority', function() {
        var expression1, expression2, expression3;
        expression1 = registry.createExpression('dummy1', '', 2);
        expression2 = registry.createExpression('dummy2', '', 0);
        expression3 = registry.createExpression('dummy3', '', 1);
        return expect(registry.getExpressions()).toEqual([expression1, expression3, expression2]);
      });
    });
    describe('::removeExpression', function() {
      return it('removes an expression with its name', function() {
        registry.createExpression('dummy', 'foo');
        registry.removeExpression('dummy');
        return expect(registry.getExpressions()).toEqual([]);
      });
    });
    describe('::serialize', function() {
      return it('serializes the registry with the function content', function() {
        var serialized;
        registry.createExpression('dummy', 'foo');
        registry.createExpression('dummy2', 'bar', function(a, b, c) {
          return a + b - c;
        });
        serialized = registry.serialize();
        expect(serialized.regexpString).toEqual('(foo)|(bar)');
        expect(serialized.expressions.dummy).toEqual({
          name: 'dummy',
          regexpString: 'foo',
          handle: void 0,
          priority: 0,
          scopes: ['*']
        });
        return expect(serialized.expressions.dummy2).toEqual({
          name: 'dummy2',
          regexpString: 'bar',
          handle: registry.getExpression('dummy2').handle.toString(),
          priority: 0,
          scopes: ['*']
        });
      });
    });
    return describe('.deserialize', function() {
      return it('deserializes the provided expressions using the specified model', function() {
        var deserialized, serialized;
        serialized = {
          regexpString: 'foo|bar',
          expressions: {
            dummy: {
              name: 'dummy',
              regexpString: 'foo',
              handle: 'function (a,b,c) { return a + b - c; }',
              priority: 0,
              scopes: ['*']
            }
          }
        };
        deserialized = ExpressionsRegistry.deserialize(serialized, Dummy);
        expect(deserialized.getRegExp()).toEqual('foo|bar');
        expect(deserialized.getExpression('dummy').name).toEqual('dummy');
        expect(deserialized.getExpression('dummy').regexpString).toEqual('foo');
        return expect(deserialized.getExpression('dummy').handle(1, 2, 3)).toEqual(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9leHByZXNzaW9ucy1yZWdpc3RyeS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSw2QkFBUixDQUF0QixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixRQUFBLHFCQUFBO0FBQUEsSUFBQSxPQUFvQixFQUFwQixFQUFDLGtCQUFELEVBQVcsZUFBWCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBTTtBQUNTLFFBQUEsZUFBQyxJQUFELEdBQUE7QUFBdUQsVUFBckQsSUFBQyxDQUFBLFlBQUEsTUFBTSxJQUFDLENBQUEsb0JBQUEsY0FBYyxJQUFDLENBQUEsZ0JBQUEsVUFBVSxJQUFDLENBQUEsY0FBQSxRQUFRLElBQUMsQ0FBQSxjQUFBLE1BQVUsQ0FBdkQ7UUFBQSxDQUFiOztxQkFBQTs7VUFERixDQUFBO2FBR0EsUUFBQSxHQUFlLElBQUEsbUJBQUEsQ0FBb0IsS0FBcEIsRUFKTjtJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFRQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO2FBQzdCLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBLEdBQUE7ZUFDbEMsRUFBQSxDQUFHLDREQUFILEVBQWlFLFNBQUEsR0FBQTtBQUMvRCxjQUFBLFVBQUE7QUFBQSxVQUFBLFVBQUEsR0FBYSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsS0FBbkMsQ0FBYixDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sVUFBVSxDQUFDLFdBQWxCLENBQThCLENBQUMsSUFBL0Is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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/expressions-registry-spec.coffee

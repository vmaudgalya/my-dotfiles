(function() {
  var ExpressionsRegistry, VariableExpression, registry;

  ExpressionsRegistry = require('./expressions-registry');

  VariableExpression = require('./variable-expression');

  module.exports = registry = new ExpressionsRegistry(VariableExpression);

  registry.createExpression('pigments:less', '^[ \\t]*(@[a-zA-Z0-9\\-_]+)\\s*:\\s*([^;\\n]+);?', ['*']);

  registry.createExpression('pigments:scss_params', '^[ \\t]*@(mixin|include|function)\\s+[a-zA-Z0-9\\-_]+\\s*\\([^\\)]+\\)', ['*'], function(match, solver) {
    match = match[0];
    return solver.endParsing(match.length - 1);
  });

  registry.createExpression('pigments:scss', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*(.*?)(\\s*!default)?;', ['*']);

  registry.createExpression('pigments:sass', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+):\\s*([^\\{]*?)(\\s*!default)?$', ['*']);

  registry.createExpression('pigments:stylus_hash', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=\\s*\\{([^=]*)\\}', ['*'], function(match, solver) {
    var buffer, char, commaSensitiveBegin, commaSensitiveEnd, content, current, inCommaSensitiveContext, key, name, scope, scopeBegin, scopeEnd, value, _i, _len, _ref, _ref1;
    buffer = '';
    _ref = match, match = _ref[0], name = _ref[1], content = _ref[2];
    current = match.indexOf(content);
    scope = [name];
    scopeBegin = /\{/;
    scopeEnd = /\}/;
    commaSensitiveBegin = /\(|\[/;
    commaSensitiveEnd = /\)|\]/;
    inCommaSensitiveContext = false;
    for (_i = 0, _len = content.length; _i < _len; _i++) {
      char = content[_i];
      if (scopeBegin.test(char)) {
        scope.push(buffer.replace(/[\s:]/g, ''));
        buffer = '';
      } else if (scopeEnd.test(char)) {
        scope.pop();
        if (scope.length === 0) {
          return solver.endParsing(current);
        }
      } else if (commaSensitiveBegin.test(char)) {
        buffer += char;
        inCommaSensitiveContext = true;
      } else if (inCommaSensitiveContext) {
        buffer += char;
        inCommaSensitiveContext = !commaSensitiveEnd.test(char);
      } else if (/[,\n]/.test(char)) {
        buffer = buffer.replace(/\s+/g, '');
        if (buffer.length) {
          _ref1 = buffer.split(/\s*:\s*/), key = _ref1[0], value = _ref1[1];
          solver.appendResult([scope.concat(key).join('.'), value, current - buffer.length - 1, current]);
        }
        buffer = '';
      } else {
        buffer += char;
      }
      current++;
    }
    scope.pop();
    if (scope.length === 0) {
      return solver.endParsing(current + 1);
    } else {
      return solver.abortParsing();
    }
  });

  registry.createExpression('pigments:stylus', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=(?!=)\\s*([^\\n;]*);?$', ['*']);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlLWV4cHJlc3Npb25zLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTs7QUFBQSxFQUFBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx3QkFBUixDQUF0QixDQUFBOztBQUFBLEVBQ0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHVCQUFSLENBRHJCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFBLEdBQWUsSUFBQSxtQkFBQSxDQUFvQixrQkFBcEIsQ0FIaEMsQ0FBQTs7QUFBQSxFQUtBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixlQUExQixFQUEyQyxrREFBM0MsRUFBK0YsQ0FBQyxHQUFELENBQS9GLENBTEEsQ0FBQTs7QUFBQSxFQVFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixzQkFBMUIsRUFBa0Qsd0VBQWxELEVBQTRILENBQUMsR0FBRCxDQUE1SCxFQUFtSSxTQUFDLEtBQUQsRUFBUSxNQUFSLEdBQUE7QUFDakksSUFBQyxRQUFTLFFBQVYsQ0FBQTtXQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBakMsRUFGaUk7RUFBQSxDQUFuSSxDQVJBLENBQUE7O0FBQUEsRUFZQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsZUFBMUIsRUFBMkMsNkRBQTNDLEVBQTBHLENBQUMsR0FBRCxDQUExRyxDQVpBLENBQUE7O0FBQUEsRUFjQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsZUFBMUIsRUFBMkMsOERBQTNDLEVBQTJHLENBQUMsR0FBRCxDQUEzRyxDQWRBLENBQUE7O0FBQUEsRUFnQkEsUUFBUSxDQUFDLGdCQUFULENBQTBCLHNCQUExQixFQUFrRCw0REFBbEQsRUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/variable-expressions.coffee

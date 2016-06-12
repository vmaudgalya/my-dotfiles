(function() {
  var ExpressionsRegistry, VariableExpression, registry, sass_handler;

  ExpressionsRegistry = require('./expressions-registry');

  VariableExpression = require('./variable-expression');

  module.exports = registry = new ExpressionsRegistry(VariableExpression);

  registry.createExpression('pigments:less', '^[ \\t]*(@[a-zA-Z0-9\\-_]+)\\s*:\\s*([^;\\n\\r]+);?', ['less']);

  registry.createExpression('pigments:scss_params', '^[ \\t]*@(mixin|include|function)\\s+[a-zA-Z0-9\\-_]+\\s*\\([^\\)]+\\)', ['scss', 'sass', 'haml'], function(match, solver) {
    match = match[0];
    return solver.endParsing(match.length - 1);
  });

  sass_handler = function(match, solver) {
    var all_hyphen, all_underscore;
    solver.appendResult([match[1], match[2], 0, match[0].length]);
    if (match[1].match(/[-_]/)) {
      all_underscore = match[1].replace(/-/g, '_');
      all_hyphen = match[1].replace(/_/g, '-');
      if (match[1] !== all_underscore) {
        solver.appendResult([all_underscore, match[2], 0, match[0].length, true]);
      }
      if (match[1] !== all_hyphen) {
        solver.appendResult([all_hyphen, match[2], 0, match[0].length, true]);
      }
    }
    return solver.endParsing(match[0].length);
  };

  registry.createExpression('pigments:scss', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*(.*?)(\\s*!default)?\\s*;', ['scss', 'haml'], sass_handler);

  registry.createExpression('pigments:sass', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*([^\\{]*?)(\\s*!default)?\\s*(?:$|\\/)', ['sass', 'haml'], sass_handler);

  registry.createExpression('pigments:css_vars', '(--[^\\s:]+):\\s*([^\\n;]+);', ['css'], function(match, solver) {
    solver.appendResult(["var(" + match[1] + ")", match[2], 0, match[0].length]);
    return solver.endParsing(match[0].length);
  });

  registry.createExpression('pigments:stylus_hash', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=\\s*\\{([^=]*)\\}', ['styl', 'stylus'], function(match, solver) {
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

  registry.createExpression('pigments:stylus', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=(?!=)\\s*([^\\n\\r;]*);?$', ['styl', 'stylus']);

  registry.createExpression('pigments:latex', '\\\\definecolor(\\{[^\\}]+\\})\\{([^\\}]+)\\}\\{([^\\}]+)\\}', ['tex'], function(match, solver) {
    var mode, name, value, values, _;
    _ = match[0], name = match[1], mode = match[2], value = match[3];
    value = (function() {
      switch (mode) {
        case 'RGB':
          return "rgb(" + value + ")";
        case 'gray':
          return "gray(" + (Math.round(parseFloat(value) * 100)) + "%)";
        case 'rgb':
          values = value.split(',').map(function(n) {
            return Math.floor(n * 255);
          });
          return "rgb(" + (values.join(',')) + ")";
        case 'cmyk':
          return "cmyk(" + value + ")";
        case 'HTML':
          return "#" + value;
        default:
          return value;
      }
    })();
    solver.appendResult([name, value, 0, _.length, false, true]);
    return solver.endParsing(_.length);
  });

  registry.createExpression('pigments:latex_mix', '\\\\definecolor(\\{[^\\}]+\\})(\\{[^\\}\\n!]+[!][^\\}\\n]+\\})', ['tex'], function(match, solver) {
    var name, value, _;
    _ = match[0], name = match[1], value = match[2];
    solver.appendResult([name, value, 0, _.length, false, true]);
    return solver.endParsing(_.length);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlLWV4cHJlc3Npb25zLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrREFBQTs7QUFBQSxFQUFBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx3QkFBUixDQUF0QixDQUFBOztBQUFBLEVBQ0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHVCQUFSLENBRHJCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFBLEdBQWUsSUFBQSxtQkFBQSxDQUFvQixrQkFBcEIsQ0FIaEMsQ0FBQTs7QUFBQSxFQUtBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixlQUExQixFQUEyQyxxREFBM0MsRUFBa0csQ0FBQyxNQUFELENBQWxHLENBTEEsQ0FBQTs7QUFBQSxFQVFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixzQkFBMUIsRUFBa0Qsd0VBQWxELEVBQTRILENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsTUFBakIsQ0FBNUgsRUFBc0osU0FBQyxLQUFELEVBQVEsTUFBUixHQUFBO0FBQ3BKLElBQUMsUUFBUyxRQUFWLENBQUE7V0FDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFLLENBQUMsTUFBTixHQUFlLENBQWpDLEVBRm9KO0VBQUEsQ0FBdEosQ0FSQSxDQUFBOztBQUFBLEVBWUEsWUFBQSxHQUFlLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNiLFFBQUEsMEJBQUE7QUFBQSxJQUFBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLENBQ2xCLEtBQU0sQ0FBQSxDQUFBLENBRFksRUFFbEIsS0FBTSxDQUFBLENBQUEsQ0FGWSxFQUdsQixDQUhrQixFQUlsQixLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFKUyxDQUFwQixDQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/variable-expressions.coffee

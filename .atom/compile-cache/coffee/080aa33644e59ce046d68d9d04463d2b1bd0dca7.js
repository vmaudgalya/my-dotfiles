(function() {
  var CompositeDisposable, PigmentsProvider, Range, variablesRegExp, _, _ref;

  _ = require('underscore-plus');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Range = _ref.Range;

  variablesRegExp = require('./regexes').variables;

  module.exports = PigmentsProvider = (function() {
    function PigmentsProvider(pigments) {
      this.pigments = pigments;
      this.subscriptions = new CompositeDisposable;
      this.selector = atom.config.get('pigments.autocompleteScopes').join(',');
      this.subscriptions.add(atom.config.observe('pigments.autocompleteScopes', (function(_this) {
        return function(scopes) {
          return _this.selector = scopes.join(',');
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.extendAutocompleteToVariables', (function(_this) {
        return function(extendAutocompleteToVariables) {
          _this.extendAutocompleteToVariables = extendAutocompleteToVariables;
        };
      })(this)));
    }

    PigmentsProvider.prototype.dispose = function() {
      this.disposed = true;
      this.subscriptions.dispose();
      return this.pigments = null;
    };

    PigmentsProvider.prototype.getProject = function() {
      if (this.disposed) {
        return;
      }
      return this.pigments.getProject();
    };

    PigmentsProvider.prototype.getSuggestions = function(_arg) {
      var bufferPosition, editor, prefix, project, suggestions, variables;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
      if (this.disposed) {
        return;
      }
      prefix = this.getPrefix(editor, bufferPosition);
      project = this.getProject();
      if (!(prefix != null ? prefix.length : void 0)) {
        return;
      }
      if (project == null) {
        return;
      }
      if (this.extendAutocompleteToVariables) {
        variables = project.getVariables();
      } else {
        variables = project.getColorVariables();
      }
      suggestions = this.findSuggestionsForPrefix(variables, prefix);
      return suggestions;
    };

    PigmentsProvider.prototype.getPrefix = function(editor, bufferPosition) {
      var line, _ref1;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((_ref1 = line.match(new RegExp(variablesRegExp + '$'))) != null ? _ref1[0] : void 0) || '';
    };

    PigmentsProvider.prototype.findSuggestionsForPrefix = function(variables, prefix) {
      var matchedVariables, suggestions;
      if (variables == null) {
        return [];
      }
      suggestions = [];
      matchedVariables = variables.filter(function(v) {
        return RegExp("^" + (_.escapeRegExp(prefix))).test(v.name);
      });
      matchedVariables.forEach(function(v) {
        if (v.isColor) {
          return suggestions.push({
            text: v.name,
            rightLabelHTML: "<span class='color-suggestion-preview' style='background: " + (v.color.toCSS()) + "'></span>",
            replacementPrefix: prefix,
            className: 'color-suggestion'
          });
        } else {
          return suggestions.push({
            text: v.name,
            rightLabel: v.value,
            replacementPrefix: prefix,
            className: 'pigments-suggestion'
          });
        }
      });
      return suggestions;
    };

    return PigmentsProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BpZ21lbnRzLXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzRUFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsT0FBZ0MsT0FBQSxDQUFRLE1BQVIsQ0FBaEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixhQUFBLEtBRHRCLENBQUE7O0FBQUEsRUFFWSxrQkFBbUIsT0FBQSxDQUFRLFdBQVIsRUFBOUIsU0FGRCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsMEJBQUUsUUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsV0FBQSxRQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQThDLENBQUMsSUFBL0MsQ0FBb0QsR0FBcEQsQ0FEWixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDZCQUFwQixFQUFtRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQ3BFLEtBQUMsQ0FBQSxRQUFELEdBQVksTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLEVBRHdEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkQsQ0FBbkIsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/pigments-provider.coffee

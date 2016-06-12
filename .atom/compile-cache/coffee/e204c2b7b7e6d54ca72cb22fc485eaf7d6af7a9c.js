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
      this.subscriptions.dispose();
      return this.pigments = null;
    };

    PigmentsProvider.prototype.getProject = function() {
      return this.pigments.getProject();
    };

    PigmentsProvider.prototype.getSuggestions = function(_arg) {
      var bufferPosition, editor, prefix, project, suggestions, variables;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
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

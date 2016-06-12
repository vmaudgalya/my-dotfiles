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
      this.subscriptions.add(atom.config.observe('pigments.extendAutocompleteToColorValue', (function(_this) {
        return function(extendAutocompleteToColorValue) {
          _this.extendAutocompleteToColorValue = extendAutocompleteToColorValue;
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
        return !v.isAlternate && RegExp("^" + (_.escapeRegExp(prefix))).test(v.name);
      });
      matchedVariables.forEach((function(_this) {
        return function(v) {
          var color, rightLabelHTML;
          if (v.isColor) {
            color = v.color.alpha === 1 ? '#' + v.color.hex : v.color.toCSS();
            rightLabelHTML = "<span class='color-suggestion-preview' style='background: " + (v.color.toCSS()) + "'></span>";
            if (_this.extendAutocompleteToColorValue) {
              rightLabelHTML = "" + color + " " + rightLabelHTML;
            }
            return suggestions.push({
              text: v.name,
              rightLabelHTML: rightLabelHTML,
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
        };
      })(this));
      return suggestions;
    };

    return PigmentsProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BpZ21lbnRzLXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzRUFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsT0FBZ0MsT0FBQSxDQUFRLE1BQVIsQ0FBaEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixhQUFBLEtBRHRCLENBQUE7O0FBQUEsRUFFWSxrQkFBbUIsT0FBQSxDQUFRLFdBQVIsRUFBOUIsU0FGRCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsMEJBQUUsUUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsV0FBQSxRQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQThDLENBQUMsSUFBL0MsQ0FBb0QsR0FBcEQsQ0FEWixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDZCQUFwQixFQUFtRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQ3BFLEtBQUMsQ0FBQSxRQUFELEdBQVksTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLEVBRHdEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkQsQ0FBbkIsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/pigments-provider.coffee

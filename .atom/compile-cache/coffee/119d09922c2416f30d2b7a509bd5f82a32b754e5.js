(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter) {
      linter.modifiesBuffer = Boolean(linter.modifiesBuffer);
      if (!(linter.grammarScopes instanceof Array)) {
        throw new Error("grammarScopes is not an Array. Got: " + linter.grammarScopes);
      }
      if (linter.lint) {
        if (typeof linter.lint !== 'function') {
          throw new Error("linter.lint isn't a function on provider");
        }
      } else {
        throw new Error('Missing linter.lint on provider');
      }
      if (linter.name) {
        if (typeof linter.name !== 'string') {
          throw new Error('Linter.name must be a string');
        }
      } else {
        linter.name = null;
      }
      return true;
    },
    messages: function(messages, linter) {
      if (!(messages instanceof Array)) {
        throw new Error("Expected messages to be array, provided: " + (typeof messages));
      }
      if (!linter) {
        throw new Error('No linter provided');
      }
      messages.forEach(function(result) {
        if (result.type) {
          if (typeof result.type !== 'string') {
            throw new Error('Invalid type field on Linter Response');
          }
        } else {
          throw new Error('Missing type field on Linter Response');
        }
        if (result.html) {
          if (typeof result.html !== 'string') {
            throw new Error('Invalid html field on Linter Response');
          }
        } else if (result.text) {
          if (typeof result.text !== 'string') {
            throw new Error('Invalid text field on Linter Response');
          }
        } else {
          throw new Error('Missing html/text field on Linter Response');
        }
        if (result.trace) {
          if (!(result.trace instanceof Array)) {
            throw new Error('Invalid trace field on Linter Response');
          }
        } else {
          result.trace = null;
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result.key = JSON.stringify(result);
        result["class"] = result.type.toLowerCase().replace(' ', '-');
        result.linter = linter.name;
        if (result.trace && result.trace.length) {
          return Validate.messages(result.trace, linter);
        }
      });
      return void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92YWxpZGF0ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQUEsR0FFZjtBQUFBLElBQUEsTUFBQSxFQUFRLFNBQUMsTUFBRCxHQUFBO0FBRU4sTUFBQSxNQUFNLENBQUMsY0FBUCxHQUF3QixPQUFBLENBQVEsTUFBTSxDQUFDLGNBQWYsQ0FBeEIsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsWUFBZ0MsS0FBdkMsQ0FBQTtBQUNFLGNBQVUsSUFBQSxLQUFBLENBQU8sc0NBQUEsR0FBc0MsTUFBTSxDQUFDLGFBQXBELENBQVYsQ0FERjtPQURBO0FBR0EsTUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO0FBQ0UsUUFBQSxJQUErRCxNQUFBLENBQUEsTUFBYSxDQUFDLElBQWQsS0FBd0IsVUFBdkY7QUFBQSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSwwQ0FBTixDQUFWLENBQUE7U0FERjtPQUFBLE1BQUE7QUFHRSxjQUFVLElBQUEsS0FBQSxDQUFNLGlDQUFOLENBQVYsQ0FIRjtPQUhBO0FBT0EsTUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO0FBQ0UsUUFBQSxJQUFtRCxNQUFBLENBQUEsTUFBYSxDQUFDLElBQWQsS0FBd0IsUUFBM0U7QUFBQSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSw4QkFBTixDQUFWLENBQUE7U0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE1BQU0sQ0FBQyxJQUFQ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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/validate.coffee

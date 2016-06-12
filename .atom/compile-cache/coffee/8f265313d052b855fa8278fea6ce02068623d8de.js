(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter, indie) {
      if (indie == null) {
        indie = false;
      }
      if (!indie) {
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
        if (linter.scope && typeof linter.scope === 'string') {
          linter.scope = linter.scope.toLowerCase();
        }
        if (linter.scope !== 'file' && linter.scope !== 'project') {
          throw new Error('Linter.scope must be either `file` or `project`');
        }
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
          if (typeof result.text === 'string') {
            throw new Error('Got both html and text fields on Linter Response, expecting only one');
          }
          if (typeof result.html !== 'string' && !(result.html instanceof HTMLElement)) {
            throw new Error('Invalid html field on Linter Response');
          }
          result.text = null;
        } else if (result.text) {
          if (typeof result.text !== 'string') {
            throw new Error('Invalid text field on Linter Response');
          }
          result.html = null;
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
        if (result["class"]) {
          if (typeof result["class"] !== 'string') {
            throw new Error('Invalid class field on Linter Response');
          }
        } else {
          result["class"] = result.type.toLowerCase().replace(' ', '-');
        }
        if (result.filePath) {
          if (typeof result.filePath !== 'string') {
            throw new Error('Invalid filePath field on Linter response');
          }
        } else {
          result.filePath = null;
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result.key = JSON.stringify(result);
        result.linter = linter.name;
        if (result.trace && result.trace.length) {
          return Validate.messages(result.trace, linter);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92YWxpZGF0ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQUEsR0FFZjtBQUFBLElBQUEsTUFBQSxFQUFRLFNBQUMsTUFBRCxFQUFTLEtBQVQsR0FBQTs7UUFBUyxRQUFRO09BQ3ZCO0FBQUEsTUFBQSxJQUFBLENBQUEsS0FBQTtBQUNFLFFBQUEsSUFBQSxDQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsWUFBZ0MsS0FBdkMsQ0FBQTtBQUNFLGdCQUFVLElBQUEsS0FBQSxDQUFPLHNDQUFBLEdBQXNDLE1BQU0sQ0FBQyxhQUFwRCxDQUFWLENBREY7U0FBQTtBQUVBLFFBQUEsSUFBRyxNQUFNLENBQUMsSUFBVjtBQUNFLFVBQUEsSUFBK0QsTUFBQSxDQUFBLE1BQWEsQ0FBQyxJQUFkLEtBQXdCLFVBQXZGO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0sMENBQU4sQ0FBVixDQUFBO1dBREY7U0FBQSxNQUFBO0FBR0UsZ0JBQVUsSUFBQSxLQUFBLENBQU0saUNBQU4sQ0FBVixDQUhGO1NBRkE7QUFNQSxRQUFBLElBQUcsTUFBTSxDQUFDLEtBQVAsSUFBaUIsTUFBQSxDQUFBLE1BQWEsQ0FBQyxLQUFkLEtBQXVCLFFBQTNDO0FBQ0UsVUFBQSxNQUFNLENBQUMsS0FBUCxHQUFlLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBYixDQUFBLENBQWYsQ0FERjtTQU5BO0FBUUEsUUFBQSxJQUFzRSxNQUFNLENBQUMsS0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/validate.coffee

(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter) {
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
      if (linter.scope && typeof linter.scope === 'string') {
        linter.scope = linter.scope.toLowerCase();
      }
      if (linter.scope !== 'file' && linter.scope !== 'project') {
        throw new Error('Linter.scope must be either `file` or `project`');
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
          if (typeof result.text === 'string') {
            throw new Error('Got both html and text fields on Linter Response, expecting only one');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92YWxpZGF0ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQUEsR0FFZjtBQUFBLElBQUEsTUFBQSxFQUFRLFNBQUMsTUFBRCxHQUFBO0FBQ04sTUFBQSxJQUFBLENBQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxZQUFnQyxLQUF2QyxDQUFBO0FBQ0UsY0FBVSxJQUFBLEtBQUEsQ0FBTyxzQ0FBQSxHQUFzQyxNQUFNLENBQUMsYUFBcEQsQ0FBVixDQURGO09BQUE7QUFFQSxNQUFBLElBQUcsTUFBTSxDQUFDLElBQVY7QUFDRSxRQUFBLElBQStELE1BQUEsQ0FBQSxNQUFhLENBQUMsSUFBZCxLQUF3QixVQUF2RjtBQUFBLGdCQUFVLElBQUEsS0FBQSxDQUFNLDBDQUFOLENBQVYsQ0FBQTtTQURGO09BQUEsTUFBQTtBQUdFLGNBQVUsSUFBQSxLQUFBLENBQU0saUNBQU4sQ0FBVixDQUhGO09BRkE7QUFNQSxNQUFBLElBQUcsTUFBTSxDQUFDLElBQVY7QUFDRSxRQUFBLElBQW1ELE1BQUEsQ0FBQSxNQUFhLENBQUMsSUFBZCxLQUF3QixRQUEzRTtBQUFBLGdCQUFVLElBQUEsS0FBQSxDQUFNLDhCQUFOLENBQVYsQ0FBQTtTQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsTUFBTSxDQUFDLElBQVAsR0FBYyxJQUFkLENBSEY7T0FOQTtBQVVBLE1BQUEsSUFBRyxNQUFNLENBQUMsS0FBUCxJQUFpQixNQUFBLENBQUEsTUFBYSxDQUFDLEtBQWQsS0FBdUIsUUFBM0M7QUFDRSxRQUFBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFiLENBQUEsQ0FBZixDQURGO09BVkE7QUFZQSxNQUFBLElBQXNFLE1BQU0sQ0FBQyxLQUFQLEtBQWtCLE1BQWxCLElBQTZCLE1BQU0sQ0FBQyxLQUFQLEtBQWtCLFNBQXJIO0FBQUEsY0FBVSxJQUFBLEtBQUEsQ0FBTSxpREFBTixDQUFWLENBQUE7T0FaQTtBQWFBLGFBQU8sSUFBUCxDQWRNO0lBQUEsQ0FBUjtBQUFBLElBZ0JBLFFBQUEsRUFBVSxTQUFDLFFBQUQsRUFBVyxNQUFYLEdBQUE7QUFDUixNQUFBLElBQUEsQ0FBQSxDQUFPLFFBQUEsWUFBb0IsS0FBM0IsQ0FBQTtBQUNFLGNBQVUsSUFBQSxLQUFBLENBQU8sMkNBQUEsR0FBMEMsQ0FBQyxNQUFBLENBQUEsUUFBRCxDQUFqRCxDQUFWLENBREY7T0FBQTtBQUVBLE1BQUEsSUFBQSxDQUFBLE1BQUE7QUFBQSxjQUFVLElBQUEsS0FBQSxDQUFNLG9CQUFOLENBQVYsQ0FBQTtPQUZBO0FBQUEsTUFHQSxRQUFRLENBQUMsT0FBVCxDQUFpQixTQUFDLE1BQUQsR0FBQTtBQUNmLFFBQUEsSUFBRyxNQUFNLENBQUMsSUFBVjtBQUNFLFVBQUEsSUFBMkQsTUFBQSxDQUFBLE1BQWEsQ0FBQyxJQUFkLEtBQXdCLFFBQW5GO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0sdUNBQU4sQ0FBVixDQUFBO1dBREY7U0FBQSxNQUFBO0FBR0UsZ0JBQVUsSUFBQSxLQUFBLENBQU0sdUNBQU4sQ0FBVixDQUhGO1NBQUE7QUFJQSxRQUFBLElBQUcsTUFBTSxDQUFDLElBQVY7QUFDRSxVQUFBLElBQTJELE1BQUEsQ0FBQSxNQUFhLENBQUMsSUFBZCxLQUF3QixRQUFuRjtBQUFBLGtCQUFVLElBQUEsS0FBQSxDQUFNLHVDQUFOLENBQVYsQ0FBQTtXQUFBO0FBQ0EsVUFBQSxJQUEwRixNQUFBLENBQUEsTUFBYSxDQUFDLElBQWQsS0FBc0IsUUFBaEg7QUFBQSxrQkFBVSxJQUFBLEtBQUEsQ0FBTSxzRUFBTixDQUFWLENBQUE7V0FEQTtBQUFBLFVBRUEsTUFBTSxDQUFDLElBQVAsR0FBYyxJQUZkLENBREY7U0FBQSxNQUlLLElBQUcsTUFBTSxDQUFDLElBQVY7QUFDSCxVQUFBLElBQTJELE1BQUEsQ0FBQSxNQUFhLENBQUMsSUFBZCxLQUF3QixRQUFuRjtBQUFBLGtCQUFVLElBQUEsS0FBQSxDQUFNLHVDQUFOLENBQVYsQ0FBQTtXQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsSUFBUCxHQUFjLElBRGQsQ0FERztTQUFBLE1BQUE7QUFJSCxnQkFBVSxJQUFBLEtBQUEsQ0FBTSw0Q0FBTixDQUFWLENBSkc7U0FSTDtBQWFBLFFBQUEsSUFBRyxNQUFNLENBQUMsS0FBVjtBQUNFLFVBQUEsSUFBQSxDQUFBLENBQWdFLE1BQU0sQ0FBQyxLQUFQLFlBQXdCLEtBQXhGLENBQUE7QUFBQSxrQkFBVSxJQUFBLEtBQUEsQ0FBTSx3Q0FBTixDQUFWLENBQUE7V0FERjtTQUFBLE1BQUE7QUFFSyxVQUFBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBZixDQUZMO1NBYkE7QUFnQkEsUUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFELENBQVQ7QUFDRSxVQUFBLElBQTRELE1BQUEsQ0FBQSxNQUFhLENBQUMsT0FBRCxDQUFiLEtBQXlCLFFBQXJGO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0sd0NBQU4sQ0FBVixDQUFBO1dBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxNQUFNLENBQUMsT0FBRCxDQUFOLEdBQWUsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFaLENBQUEsQ0FBeUIsQ0FBQyxPQUExQixDQUFrQyxHQUFsQyxFQUF1QyxHQUF2QyxDQUFmLENBSEY7U0FoQkE7QUFvQkEsUUFBQSxJQUFHLE1BQU0sQ0FBQyxRQUFWO0FBQ0UsVUFBQSxJQUFnRSxNQUFBLENBQUEsTUFBYSxDQUFDLFFBQWQsS0FBNEIsUUFBNUY7QUFBQSxrQkFBVSxJQUFBLEtBQUEsQ0FBTSwyQ0FBTixDQUFWLENBQUE7V0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLElBQWxCLENBSEY7U0FwQkE7QUF3QkEsUUFBQSxJQUFnRCxvQkFBaEQ7QUFBQSxVQUFBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsTUFBTSxDQUFDLEtBQXhCLENBQWYsQ0FBQTtTQXhCQTtBQUFBLFFBeUJBLE1BQU0sQ0FBQyxHQUFQLEdBQWEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxNQUFmLENBekJiLENBQUE7QUFBQSxRQTBCQSxNQUFNLENBQUMsTUFBUCxHQUFnQixNQUFNLENBQUMsSUExQnZCLENBQUE7QUEyQkEsUUFBQSxJQUEyQyxNQUFNLENBQUMsS0FBUCxJQUFpQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQXpFO2lCQUFBLFFBQVEsQ0FBQyxRQUFULENBQWtCLE1BQU0sQ0FBQyxLQUF6QixFQUFnQyxNQUFoQyxFQUFBO1NBNUJlO01BQUEsQ0FBakIsQ0FIQSxDQURRO0lBQUEsQ0FoQlY7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/validate.coffee

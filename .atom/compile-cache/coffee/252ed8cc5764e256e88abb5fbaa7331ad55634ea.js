(function() {
  var VariableExpression;

  module.exports = VariableExpression = (function() {
    VariableExpression.DEFAULT_HANDLE = function(match, solver) {
      var end, name, start, value, _;
      _ = match[0], name = match[1], value = match[2];
      start = _.indexOf(name);
      end = _.indexOf(value) + value.length;
      solver.appendResult([name, value, start, end]);
      return solver.endParsing(end);
    };

    function VariableExpression(_arg) {
      this.name = _arg.name, this.regexpString = _arg.regexpString, this.scopes = _arg.scopes, this.priority = _arg.priority, this.handle = _arg.handle;
      this.regexp = new RegExp("" + this.regexpString, 'm');
      if (this.handle == null) {
        this.handle = this.constructor.DEFAULT_HANDLE;
      }
    }

    VariableExpression.prototype.match = function(expression) {
      return this.regexp.test(expression);
    };

    VariableExpression.prototype.parse = function(expression) {
      var lastIndex, match, matchText, parsingAborted, results, solver, startIndex;
      parsingAborted = false;
      results = [];
      match = this.regexp.exec(expression);
      if (match != null) {
        matchText = match[0];
        lastIndex = this.regexp.lastIndex;
        startIndex = lastIndex - matchText.length;
        solver = {
          endParsing: function(end) {
            var start;
            start = expression.indexOf(matchText);
            results.lastIndex = end;
            results.range = [start, end];
            return results.match = matchText.slice(start, end);
          },
          abortParsing: function() {
            return parsingAborted = true;
          },
          appendResult: function(_arg) {
            var end, name, range, reName, start, value;
            name = _arg[0], value = _arg[1], start = _arg[2], end = _arg[3];
            range = [start, end];
            reName = name.replace('$', '\\$');
            if (!RegExp("" + reName + "(?![-_])").test(value)) {
              return results.push({
                name: name,
                value: value,
                range: range
              });
            }
          }
        };
        this.handle(match, solver);
      }
      if (parsingAborted) {
        return void 0;
      } else {
        return results;
      }
    };

    return VariableExpression;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlLWV4cHJlc3Npb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsa0JBQUMsQ0FBQSxjQUFELEdBQWlCLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNmLFVBQUEsMEJBQUE7QUFBQSxNQUFDLFlBQUQsRUFBSSxlQUFKLEVBQVUsZ0JBQVYsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLENBQUMsQ0FBQyxPQUFGLENBQVUsSUFBVixDQURSLENBQUE7QUFBQSxNQUVBLEdBQUEsR0FBTSxDQUFDLENBQUMsT0FBRixDQUFVLEtBQVYsQ0FBQSxHQUFtQixLQUFLLENBQUMsTUFGL0IsQ0FBQTtBQUFBLE1BR0EsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLEtBQWQsRUFBcUIsR0FBckIsQ0FBcEIsQ0FIQSxDQUFBO2FBSUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsRUFMZTtJQUFBLENBQWpCLENBQUE7O0FBT2EsSUFBQSw0QkFBQyxJQUFELEdBQUE7QUFDWCxNQURhLElBQUMsQ0FBQSxZQUFBLE1BQU0sSUFBQyxDQUFBLG9CQUFBLGNBQWMsSUFBQyxDQUFBLGNBQUEsUUFBUSxJQUFDLENBQUEsZ0JBQUEsVUFBVSxJQUFDLENBQUEsY0FBQSxNQUN4RCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsTUFBQSxDQUFPLEVBQUEsR0FBRyxJQUFDLENBQUEsWUFBWCxFQUEyQixHQUEzQixDQUFkLENBQUE7O1FBQ0EsSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFdBQVcsQ0FBQztPQUZiO0lBQUEsQ0FQYjs7QUFBQSxpQ0FXQSxLQUFBLEdBQU8sU0FBQyxVQUFELEdBQUE7YUFBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsVUFBYixFQUFoQjtJQUFBLENBWFAsQ0FBQTs7QUFBQSxpQ0FhQSxLQUFBLEdBQU8sU0FBQyxVQUFELEdBQUE7QUFDTCxVQUFBLHdFQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLEtBQWpCLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxFQURWLENBQUE7QUFBQSxNQUdBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxVQUFiLENBSFIsQ0FBQTtBQUlBLE1BQUEsSUFBRyxhQUFIO0FBRUUsUUFBQyxZQUFhLFFBQWQsQ0FBQTtBQUFBLFFBQ0MsWUFBYSxJQUFDLENBQUEsT0FBZCxTQURELENBQUE7QUFBQSxRQUVBLFVBQUEsR0FBYSxTQUFBLEdBQVksU0FBUyxDQUFDLE1BRm5DLENBQUE7QUFBQSxRQUlBLE1BQUEsR0FDRTtBQUFBLFVBQUEsVUFBQSxFQUFZLFNBQUMsR0FBRCxHQUFBO0FBQ1YsZ0JBQUEsS0FBQTtBQUFBLFlBQUEsS0FBQSxHQUFRLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFNBQW5CLENBQVIsQ0FBQTtBQUFBLFlBQ0EsT0FBTyxDQUFDLFNBQVIsR0FBb0IsR0FEcEIsQ0FBQTtBQUFBLFlBRUEsT0FBTyxDQUFDLEtBQVIsR0FBZ0IsQ0FBQyxLQUFELEVBQU8sR0FBUCxDQUZoQixDQUFBO21CQUdBLE9BQU8sQ0FBQyxLQUFSLEdBQWdCLFNBQVUsbUJBSmhCO1VBQUEsQ0FBWjtBQUFBLFVBS0EsWUFBQSxFQUFjLFNBQUEsR0FBQTttQkFDWixjQUFBLEdBQWlCLEtBREw7VUFBQSxDQUxkO0FBQUEsVUFPQSxZQUFBLEVBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixnQkFBQSxzQ0FBQTtBQUFBLFlBRGMsZ0JBQU0saUJBQU8saUJBQU8sYUFDbEMsQ0FBQTtBQUFBLFlBQUEsS0FBQSxHQUFRLENBQUMsS0FBRCxFQUFRLEdBQVIsQ0FBUixDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLEVBQWtCLEtBQWxCLENBRFQsQ0FBQTtBQUVBLFlBQUEsSUFBQSxDQUFBLE1BQU8sQ0FBQSxFQUFBLEdBQUssTUFBTCxHQUFZLFVBQVosQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixLQUE3QixDQUFQO3FCQUNFLE9BQU8sQ0FBQyxJQUFSLENBQWE7QUFBQSxnQkFBQyxNQUFBLElBQUQ7QUFBQSxnQkFBTyxPQUFBLEtBQVA7QUFBQSxnQkFBYyxPQUFBLEtBQWQ7ZUFBYixFQURGO2FBSFk7VUFBQSxDQVBkO1NBTEYsQ0FBQTtBQUFBLFFBa0JBLElBQUMsQ0FBQSxNQUFELENBQVEsS0FBUixFQUFlLE1BQWYsQ0FsQkEsQ0FGRjtPQUpBO0FBMEJBLE1BQUEsSUFBRyxjQUFIO2VBQXVCLE9BQXZCO09BQUEsTUFBQTtlQUFzQyxRQUF0QztPQTNCSztJQUFBLENBYlAsQ0FBQTs7OEJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/variable-expression.coffee

(function() {
  var EditorLinter, LinterRegistry, Validators;

  LinterRegistry = require('../lib/linter-registry');

  EditorLinter = require('../lib/editor-linter');

  Validators = require('../lib/validate');

  module.exports = {
    wait: function(timeout) {
      return new Promise(function(resolve) {
        return setTimeout(resolve, timeout);
      });
    },
    getLinter: function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        scope: 'project',
        lint: function() {}
      };
    },
    getMessage: function(type, filePath, range) {
      var message;
      message = {
        type: type,
        text: 'Some Message',
        filePath: filePath,
        range: range
      };
      Validators.messages([message], {
        name: 'Some Linter'
      });
      return message;
    },
    getLinterRegistry: function() {
      var editorLinter, linter, linterRegistry;
      linterRegistry = new LinterRegistry;
      editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
      linter = {
        grammarScopes: ['*'],
        lintOnFly: false,
        scope: 'project',
        lint: function() {
          return [
            {
              type: 'Error',
              text: 'Something'
            }
          ];
        }
      };
      linterRegistry.addLinter(linter);
      return {
        linterRegistry: linterRegistry,
        editorLinter: editorLinter,
        linter: linter
      };
    },
    trigger: function(el, name) {
      var event;
      event = document.createEvent('HTMLEvents');
      event.initEvent(name, true, false);
      return el.dispatchEvent(event);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvY29tbW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsaUJBQVIsQ0FGYixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsT0FBRCxHQUFBO0FBQ0osYUFBVyxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsR0FBQTtlQUNqQixVQUFBLENBQVcsT0FBWCxFQUFvQixPQUFwQixFQURpQjtNQUFBLENBQVIsQ0FBWCxDQURJO0lBQUEsQ0FBTjtBQUFBLElBR0EsU0FBQSxFQUFXLFNBQUEsR0FBQTtBQUNULGFBQU87QUFBQSxRQUFDLGFBQUEsRUFBZSxDQUFDLEdBQUQsQ0FBaEI7QUFBQSxRQUF1QixTQUFBLEVBQVcsS0FBbEM7QUFBQSxRQUF5QyxLQUFBLEVBQU8sU0FBaEQ7QUFBQSxRQUEyRCxJQUFBLEVBQU0sU0FBQSxHQUFBLENBQWpFO09BQVAsQ0FEUztJQUFBLENBSFg7QUFBQSxJQUtBLFVBQUEsRUFBWSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLEtBQWpCLEdBQUE7QUFDVixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVTtBQUFBLFFBQUMsTUFBQSxJQUFEO0FBQUEsUUFBTyxJQUFBLEVBQU0sY0FBYjtBQUFBLFFBQTZCLFVBQUEsUUFBN0I7QUFBQSxRQUF1QyxPQUFBLEtBQXZDO09BQVYsQ0FBQTtBQUFBLE1BQ0EsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsQ0FBQyxPQUFELENBQXBCLEVBQStCO0FBQUEsUUFBQyxJQUFBLEVBQU0sYUFBUDtPQUEvQixDQURBLENBQUE7QUFFQSxhQUFPLE9BQVAsQ0FIVTtJQUFBLENBTFo7QUFBQSxJQVNBLGlCQUFBLEVBQW1CLFNBQUEsR0FBQTtBQUNqQixVQUFBLG9DQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLEdBQUEsQ0FBQSxjQUFqQixDQUFBO0FBQUEsTUFDQSxZQUFBLEdBQW1CLElBQUEsWUFBQSxDQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFiLENBRG5CLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUztBQUFBLFFBQ1AsYUFBQSxFQUFlLENBQUMsR0FBRCxDQURSO0FBQUEsUUFFUCxTQUFBLEVBQVcsS0FGSjtBQUFBLFFBR1AsS0FBQSxFQUFPLFNBSEE7QUFBQSxRQUlQLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFBRyxpQkFBTztZQUFDO0FBQUEsY0FBQyxJQUFBLEVBQU0sT0FBUDtBQUFBLGNBQWdCLElBQUEsRUFBTSxXQUF0QjthQUFEO1dBQVAsQ0FBSDtRQUFBLENBSkM7T0FGVCxDQUFBO0FBQUEsTUFRQSxjQUFjLENBQUMsU0FBZixDQUF5QixNQUF6QixDQVJBLENBQUE7QUFTQSxhQUFPO0FBQUEsUUFBQyxnQkFBQSxjQUFEO0FBQUEsUUFBaUIsY0FBQSxZQUFqQjtBQUFBLFFBQStCLFFBQUEsTUFBL0I7T0FBUCxDQVZpQjtJQUFBLENBVG5CO0FBQUEsSUFvQkEsT0FBQSxFQUFTLFNBQUMsRUFBRCxFQUFLLElBQUwsR0FBQTtBQUNQLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLFFBQVEsQ0FBQyxXQUFULENBQXFCLFlBQXJCLENBQVIsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsRUFBNEIsS0FBNUIsQ0FEQSxDQUFBO2FBRUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsS0FBakIsRUFITztJQUFBLENBcEJUO0dBTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/common.coffee

(function() {
  var EditorLinter, LinterRegistry;

  LinterRegistry = require('../lib/linter-registry');

  EditorLinter = require('../lib/editor-linter');

  module.exports = {
    getLinter: function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'project',
        lint: function() {}
      };
    },
    getMessage: function(type, filePath, range) {
      return {
        type: type,
        text: "Some Message",
        filePath: filePath,
        range: range
      };
    },
    getLinterRegistry: function() {
      var editorLinter, linter, linterRegistry;
      linterRegistry = new LinterRegistry;
      editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
      linter = {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'project',
        lint: function() {
          return [
            {
              type: "Error",
              text: "Something"
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
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvY29tbW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0QkFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxTQUFBLEdBQUE7QUFDVCxhQUFPO0FBQUEsUUFBQyxhQUFBLEVBQWUsQ0FBQyxHQUFELENBQWhCO0FBQUEsUUFBdUIsU0FBQSxFQUFXLEtBQWxDO0FBQUEsUUFBeUMsY0FBQSxFQUFnQixLQUF6RDtBQUFBLFFBQWdFLEtBQUEsRUFBTyxTQUF2RTtBQUFBLFFBQWtGLElBQUEsRUFBTSxTQUFBLEdBQUEsQ0FBeEY7T0FBUCxDQURTO0lBQUEsQ0FBWDtBQUFBLElBRUEsVUFBQSxFQUFZLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsS0FBakIsR0FBQTtBQUNWLGFBQU87QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sSUFBQSxFQUFNLGNBQWI7QUFBQSxRQUE2QixVQUFBLFFBQTdCO0FBQUEsUUFBdUMsT0FBQSxLQUF2QztPQUFQLENBRFU7SUFBQSxDQUZaO0FBQUEsSUFJQSxpQkFBQSxFQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxvQ0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixHQUFBLENBQUEsY0FBakIsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFtQixJQUFBLFlBQUEsQ0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBYixDQURuQixDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVM7QUFBQSxRQUNQLGFBQUEsRUFBZSxDQUFDLEdBQUQsQ0FEUjtBQUFBLFFBRVAsU0FBQSxFQUFXLEtBRko7QUFBQSxRQUdQLGNBQUEsRUFBZ0IsS0FIVDtBQUFBLFFBSVAsS0FBQSxFQUFPLFNBSkE7QUFBQSxRQUtQLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFBRyxpQkFBTztZQUFDO0FBQUEsY0FBQyxJQUFBLEVBQU0sT0FBUDtBQUFBLGNBQWdCLElBQUEsRUFBTSxXQUF0QjthQUFEO1dBQVAsQ0FBSDtRQUFBLENBTEM7T0FGVCxDQUFBO0FBQUEsTUFTQSxjQUFjLENBQUMsU0FBZixDQUF5QixNQUF6QixDQVRBLENBQUE7QUFVQSxhQUFPO0FBQUEsUUFBQyxnQkFBQSxjQUFEO0FBQUEsUUFBaUIsY0FBQSxZQUFqQjtBQUFBLFFBQStCLFFBQUEsTUFBL0I7T0FBUCxDQVhpQjtJQUFBLENBSm5CO0dBSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/common.coffee

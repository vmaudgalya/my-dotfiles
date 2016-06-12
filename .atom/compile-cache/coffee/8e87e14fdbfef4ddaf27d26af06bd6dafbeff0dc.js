(function() {
  var path, stylesheet, stylesheetPath;

  path = require('path');

  stylesheetPath = path.resolve(__dirname, '../../styles/minimap.less');

  stylesheet = atom.themes.loadStylesheet(stylesheetPath);

  module.exports = {
    stylesheet: stylesheet
  };

  beforeEach(function() {
    var TextEditor, jasmineContent, styleNode;
    if (atom.workspace.buildTextEditor == null) {
      TextEditor = require('atom').TextEditor;
      atom.workspace.buildTextEditor = function(opts) {
        return new TextEditor(opts);
      };
    }
    jasmineContent = document.body.querySelector('#jasmine-content');
    styleNode = document.createElement('style');
    styleNode.textContent = "" + stylesheet + "\n\natom-text-editor-minimap[stand-alone] {\n  width: 100px;\n  height: 100px;\n}\n\natom-text-editor, atom-text-editor::shadow {\n  line-height: 17px;\n}\n\natom-text-editor atom-text-editor-minimap, atom-text-editor::shadow atom-text-editor-minimap {\n  background: rgba(255,0,0,0.3);\n}\n\natom-text-editor atom-text-editor-minimap::shadow .minimap-scroll-indicator, atom-text-editor::shadow atom-text-editor-minimap::shadow .minimap-scroll-indicator {\n  background: rgba(0,0,255,0.3);\n}\n\natom-text-editor atom-text-editor-minimap::shadow .minimap-visible-area, atom-text-editor::shadow atom-text-editor-minimap::shadow .minimap-visible-area {\n  background: rgba(0,255,0,0.3);\n  opacity: 1;\n}\n\natom-text-editor::shadow atom-text-editor-minimap::shadow .open-minimap-quick-settings {\n  opacity: 1 !important;\n}";
    return jasmineContent.appendChild(styleNode);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL2hlbHBlcnMvd29ya3NwYWNlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQ0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QiwyQkFBeEIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQVosQ0FBMkIsY0FBM0IsQ0FGYixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUFDLFlBQUEsVUFBRDtHQUpqQixDQUFBOztBQUFBLEVBTUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEscUNBQUE7QUFBQSxJQUFBLElBQU8sc0NBQVA7QUFDRSxNQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixHQUFpQyxTQUFDLElBQUQsR0FBQTtlQUFjLElBQUEsVUFBQSxDQUFXLElBQVgsRUFBZDtNQUFBLENBRGpDLENBREY7S0FBQTtBQUFBLElBSUEsY0FBQSxHQUFpQixRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWQsQ0FBNEIsa0JBQTVCLENBSmpCLENBQUE7QUFBQSxJQUtBLFNBQUEsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixPQUF2QixDQUxaLENBQUE7QUFBQSxJQU1BLFNBQVMsQ0FBQyxXQUFWLEdBQXdCLEVBQUEsR0FDeEIsVUFEd0IsR0FDYix5ekJBUFgsQ0FBQTtXQW9DQSxjQUFjLENBQUMsV0FBZixDQUEyQixTQUEzQixFQXJDUztFQUFBLENBQVgsQ0FOQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/helpers/workspace.coffee

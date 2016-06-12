(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, softTabs, tabLength, _ref, _ref1;

  tabLength = (_ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.tabLength') : void 0) != null ? _ref : 4;

  softTabs = (_ref1 = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.softTabs') : void 0) != null ? _ref1 : true;

  defaultIndentSize = (softTabs ? tabLength : 1);

  defaultIndentChar = (softTabs ? " " : "\t");

  defaultIndentWithTabs = !softTabs;

  module.exports = {
    name: "gherkin",
    namespace: "gherkin",
    grammars: ["Gherkin"],
    extensions: ["feature"],
    options: {
      indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indentation size/length"
      },
      indent_char: {
        type: 'string',
        "default": defaultIndentChar,
        minimum: 0,
        description: "Indentation character"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL2doZXJraW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDZGQUFBOztBQUFBLEVBQUEsU0FBQSx5SEFBbUQsQ0FBbkQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsMEhBQWlELElBRGpELENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixDQUFJLFFBQUgsR0FBaUIsU0FBakIsR0FBZ0MsQ0FBakMsQ0FGcEIsQ0FBQTs7QUFBQSxFQUdBLGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixHQUFqQixHQUEwQixJQUEzQixDQUhwQixDQUFBOztBQUFBLEVBSUEscUJBQUEsR0FBd0IsQ0FBQSxRQUp4QixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUVmLElBQUEsRUFBTSxTQUZTO0FBQUEsSUFHZixTQUFBLEVBQVcsU0FISTtBQUFBLElBS2YsUUFBQSxFQUFVLENBQ1IsU0FEUSxDQUxLO0FBQUEsSUFTZixVQUFBLEVBQVksQ0FDVixTQURVLENBVEc7QUFBQSxJQWFmLE9BQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLGlCQURUO0FBQUEsUUFFQSxPQUFBLEVBQVMsQ0FGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLHlCQUhiO09BREY7QUFBQSxNQUtBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxpQkFEVDtBQUFBLFFBRUEsT0FBQSxFQUFTLENBRlQ7QUFBQSxRQUdBLFdBQUEsRUFBYSx1QkFIYjtPQU5GO0tBZGE7R0FOakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/languages/gherkin.coffee

(function() {
  var Fs, Path, readFile;

  Path = require("path");

  Fs = require("fs");

  readFile = function(path) {
    return Fs.readFileSync(Path.join(__dirname, "./fixtures/", path), "utf8");
  };

  describe("Emmet", function() {
    var editor, editorElement, simulateTabKeyEvent, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1];
    console.log(atom.keymaps.onDidMatchBinding(function(event) {
      return console.log('Matched keybinding', event);
    }));
    simulateTabKeyEvent = function() {
      var event;
      event = keydownEvent("tab", {
        target: editorElement
      });
      return atom.keymaps.handleKeyboardEvent(event.originalEvent);
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("tabbing.html");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("emmet");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("snippets");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-css", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-sass", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-php", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-html", {
          sync: true
        });
      });
      return runs(function() {
        var _ref1, _ref2;
        if ((_ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
          if ((_ref2 = _ref1.mainModule) != null) {
            _ref2.getEmitter();
          }
        }
        editor = atom.workspace.getActiveTextEditor();
        return editorElement = atom.views.getView(editor);
      });
    });
    describe("tabbing", function() {
      beforeEach(function() {
        atom.workspace.open('tabbing.html');
        return editor.setCursorScreenPosition([1, 4]);
      });
      return it("moves the cursor along", function() {
        var cursorPos;
        simulateTabKeyEvent();
        cursorPos = editor.getCursorScreenPosition();
        return expect(cursorPos.column).toBe(6);
      });
    });
    return describe("emmet:expand-abbreviation", function() {
      var expansion;
      expansion = null;
      return describe("for normal HTML", function() {
        beforeEach(function() {
          editor.setText(readFile("abbreviation/before/html-abbrv.html"));
          editor.moveToEndOfLine();
          return expansion = readFile("abbreviation/after/html-abbrv.html");
        });
        it("expands HTML abbreviations via commands", function() {
          atom.commands.dispatch(editorElement, "emmet:expand-abbreviation");
          return expect(editor.getText()).toBe(expansion);
        });
        it("expands HTML abbreviations via keybindings", function() {
          var event;
          event = keydownEvent('e', {
            shiftKey: true,
            metaKey: true,
            target: editorElement
          });
          atom.keymaps.handleKeyboardEvent(event.originalEvent);
          return expect(editor.getText()).toBe(expansion);
        });
        return it("expands HTML abbreviations via Tab", function() {
          console.log(atom.keymaps.findKeyBindings({
            keystrokes: 'tab'
          }));
          simulateTabKeyEvent();
          return expect(editor.getText()).toBe(expansion);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvZW1tZXQvc3BlYy9lbW1ldC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO1dBQ1QsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGFBQXJCLEVBQW9DLElBQXBDLENBQWhCLEVBQTJELE1BQTNELEVBRFM7RUFBQSxDQUhYLENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsUUFBQSxnREFBQTtBQUFBLElBQUEsT0FBMEIsRUFBMUIsRUFBQyxnQkFBRCxFQUFTLHVCQUFULENBQUE7QUFBQSxJQUVBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBYixDQUErQixTQUFDLEtBQUQsR0FBQTthQUN6QyxPQUFPLENBQUMsR0FBUixDQUFZLG9CQUFaLEVBQWtDLEtBQWxDLEVBRHlDO0lBQUEsQ0FBL0IsQ0FBWixDQUZBLENBQUE7QUFBQSxJQU1BLG1CQUFBLEdBQXNCLFNBQUEsR0FBQTtBQUNwQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxZQUFBLENBQWEsS0FBYixFQUFvQjtBQUFBLFFBQUMsTUFBQSxFQUFRLGFBQVQ7T0FBcEIsQ0FBUixDQUFBO2FBQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBYixDQUFpQyxLQUFLLENBQUMsYUFBdkMsRUFGb0I7SUFBQSxDQU50QixDQUFBO0FBQUEsSUFVQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFwQixFQURjO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO0FBQUEsTUFHQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixPQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FIQSxDQUFBO0FBQUEsTUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixVQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FOQSxDQUFBO0FBQUEsTUFTQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixjQUE5QixFQUE4QztBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47U0FBOUMsRUFEYztNQUFBLENBQWhCLENBVEEsQ0FBQTtBQUFBLE1BWUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZUFBOUIsRUFBK0M7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQS9DLEVBRGM7TUFBQSxDQUFoQixDQVpBLENBQUE7QUFBQSxNQWVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGNBQTlCLEVBQThDO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE5QyxFQURjO01BQUEsQ0FBaEIsQ0FmQSxDQUFBO0FBQUEsTUFrQkEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZUFBOUIsRUFBK0M7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQS9DLEVBRGM7TUFBQSxDQUFoQixDQWxCQSxDQUFBO2FBcUJBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFFSCxZQUFBLFlBQUE7OztpQkFBc0QsQ0FBRSxVQUF4RCxDQUFBOztTQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtlQUVBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLEVBSmI7TUFBQSxDQUFMLEVBdEJTO0lBQUEsQ0FBWCxDQVZBLENBQUE7QUFBQSxJQXNDQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsY0FBcEIsQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixZQUFBLFNBQUE7QUFBQSxRQUFBLG1CQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxTQUFBLEdBQVksTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FEWixDQUFBO2VBRUEsTUFBQSxDQUFPLFNBQVMsQ0FBQyxNQUFqQixDQUF3QixDQUFDLElBQXpCLENBQThCLENBQTlCLEVBSDJCO01BQUEsQ0FBN0IsRUFMa0I7SUFBQSxDQUFwQixDQXRDQSxDQUFBO1dBZ0RBLFFBQUEsQ0FBUywyQkFBVCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsVUFBQSxTQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBWixDQUFBO2FBRUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsUUFBQSxDQUFTLHFDQUFULENBQWYsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsZUFBUCxDQUFBLENBREEsQ0FBQTtpQkFHQSxTQUFBLEdBQVksUUFBQSxDQUFTLG9DQUFULEVBSkg7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBTUEsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtBQUM1QyxVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixhQUF2QixFQUFzQywyQkFBdEMsQ0FBQSxDQUFBO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixFQUY0QztRQUFBLENBQTlDLENBTkEsQ0FBQTtBQUFBLFFBVUEsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxjQUFBLEtBQUE7QUFBQSxVQUFBLEtBQUEsR0FBUSxZQUFBLENBQWEsR0FBYixFQUFrQjtBQUFBLFlBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxZQUFnQixPQUFBLEVBQVMsSUFBekI7QUFBQSxZQUErQixNQUFBLEVBQVEsYUFBdkM7V0FBbEIsQ0FBUixDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFiLENBQWlDLEtBQUssQ0FBQyxhQUF2QyxDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLEVBSCtDO1FBQUEsQ0FBakQsQ0FWQSxDQUFBO2VBZUEsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQTZCO0FBQUEsWUFBQSxVQUFBLEVBQVksS0FBWjtXQUE3QixDQUFaLENBQUEsQ0FBQTtBQUFBLFVBQ0EsbUJBQUEsQ0FBQSxDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLEVBSHVDO1FBQUEsQ0FBekMsRUFoQjBCO01BQUEsQ0FBNUIsRUFIb0M7SUFBQSxDQUF0QyxFQWpEZ0I7RUFBQSxDQUFsQixDQU5BLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/emmet/spec/emmet-spec.coffee

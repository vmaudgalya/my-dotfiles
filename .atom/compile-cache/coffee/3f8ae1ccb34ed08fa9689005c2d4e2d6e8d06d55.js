(function() {
  describe('message-registry', function() {
    var EditorLinter, LinterRegistry, MessageRegistry, getLinterRegistry, getMessage, messageRegistry, objectSize, _ref;
    messageRegistry = null;
    MessageRegistry = require('../lib/message-registry');
    EditorLinter = require('../lib/editor-linter');
    LinterRegistry = require('../lib/linter-registry');
    objectSize = function(obj) {
      var size, value;
      size = 0;
      for (value in obj) {
        size++;
      }
      return size;
    };
    _ref = require('./common'), getLinterRegistry = _ref.getLinterRegistry, getMessage = _ref.getMessage;
    beforeEach(function() {
      return waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('test.txt').then(function() {
          if (messageRegistry != null) {
            messageRegistry.dispose();
          }
          return messageRegistry = new MessageRegistry();
        });
      });
    });
    describe('::set', function() {
      it('accepts info from LinterRegistry::lint', function() {
        var editorLinter, linterRegistry, wasUpdated, _ref1;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        wasUpdated = false;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          wasUpdated = true;
          messageRegistry.set(linterInfo);
          return expect(messageRegistry.hasChanged).toBe(true);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
      return it('ignores deactivated linters', function() {
        var editorLinter, linter, linterRegistry, _ref1;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter, linter = _ref1.linter;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        messageRegistry.updatePublic();
        expect(messageRegistry.publicMessages.length).toBe(2);
        linter.deactivated = true;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error')]
        });
        messageRegistry.updatePublic();
        expect(messageRegistry.publicMessages.length).toBe(2);
        linter.deactivated = false;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error')]
        });
        messageRegistry.updatePublic();
        return expect(messageRegistry.publicMessages.length).toBe(1);
      });
    });
    describe('::onDidUpdateMessages', function() {
      it('is triggered asyncly with results and provides a diff', function() {
        var editorLinter, linterRegistry, wasUpdated, _ref1;
        wasUpdated = false;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          expect(messageRegistry.hasChanged).toBe(true);
          return messageRegistry.updatePublic();
        });
        messageRegistry.onDidUpdateMessages(function(_arg) {
          var added, messages, removed;
          added = _arg.added, removed = _arg.removed, messages = _arg.messages;
          wasUpdated = true;
          expect(added.length).toBe(1);
          expect(removed.length).toBe(0);
          return expect(messages.length).toBe(1);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
      return it('provides the same objects when they dont change', function() {
        var disposable, editorLinter, linterRegistry, wasUpdated, _ref1;
        wasUpdated = false;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          return messageRegistry.updatePublic();
        });
        disposable = messageRegistry.onDidUpdateMessages(function(_arg) {
          var added, obj;
          added = _arg.added;
          expect(added.length).toBe(1);
          obj = added[0];
          disposable.dispose();
          return messageRegistry.onDidUpdateMessages(function(_arg1) {
            var messages;
            messages = _arg1.messages;
            wasUpdated = true;
            return expect(messages[0]).toBe(obj);
          });
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            return linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            });
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
    });
    return describe('::deleteEditorMessages', function() {
      return it('removes messages for that editor', function() {
        var editor, editorLinter, linterRegistry, wasUpdated, _ref1;
        wasUpdated = 0;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        editor = editorLinter.editor;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          expect(messageRegistry.hasChanged).toBe(true);
          return messageRegistry.updatePublic();
        });
        messageRegistry.onDidUpdateMessages(function(_arg) {
          var messages;
          messages = _arg.messages;
          wasUpdated = 1;
          expect(objectSize(messages)).toBe(1);
          return messageRegistry.deleteEditorMessages(editor);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(1);
            return linterRegistry.dispose();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvbWVzc2FnZS1yZWdpc3RyeS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsK0dBQUE7QUFBQSxJQUFBLGVBQUEsR0FBa0IsSUFBbEIsQ0FBQTtBQUFBLElBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEseUJBQVIsQ0FEbEIsQ0FBQTtBQUFBLElBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQUZmLENBQUE7QUFBQSxJQUdBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBSGpCLENBQUE7QUFBQSxJQUlBLFVBQUEsR0FBYSxTQUFDLEdBQUQsR0FBQTtBQUNYLFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLENBQVAsQ0FBQTtBQUNBLFdBQUEsWUFBQSxHQUFBO0FBQUEsUUFBQSxJQUFBLEVBQUEsQ0FBQTtBQUFBLE9BREE7QUFFQSxhQUFPLElBQVAsQ0FIVztJQUFBLENBSmIsQ0FBQTtBQUFBLElBUUEsT0FBa0MsT0FBQSxDQUFRLFVBQVIsQ0FBbEMsRUFBQyx5QkFBQSxpQkFBRCxFQUFvQixrQkFBQSxVQVJwQixDQUFBO0FBQUEsSUFVQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7QUFDZCxRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxTQUFBLEdBQUE7O1lBQ25DLGVBQWUsQ0FBRSxPQUFqQixDQUFBO1dBQUE7aUJBQ0EsZUFBQSxHQUFzQixJQUFBLGVBQUEsQ0FBQSxFQUZhO1FBQUEsQ0FBckMsRUFGYztNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBVkEsQ0FBQTtBQUFBLElBaUJBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsWUFBQSwrQ0FBQTtBQUFBLFFBQUEsUUFBaUMsaUJBQUEsQ0FBQSxDQUFqQyxFQUFDLHVCQUFBLGNBQUQsRUFBaUIscUJBQUEsWUFBakIsQ0FBQTtBQUFBLFFBQ0EsVUFBQSxHQUFhLEtBRGIsQ0FBQTtBQUFBLFFBRUEsY0FBYyxDQUFDLG1CQUFmLENBQW1DLFNBQUMsVUFBRCxHQUFBO0FBQ2pDLFVBQUEsVUFBQSxHQUFhLElBQWIsQ0FBQTtBQUFBLFVBQ0EsZUFBZSxDQUFDLEdBQWhCLENBQW9CLFVBQXBCLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sZUFBZSxDQUFDLFVBQXZCLENBQWtDLENBQUMsSUFBbkMsQ0FBd0MsSUFBeEMsRUFIaUM7UUFBQSxDQUFuQyxDQUZBLENBQUE7ZUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxjQUFjLENBQUMsSUFBZixDQUFvQjtBQUFBLFlBQUMsUUFBQSxFQUFVLEtBQVg7QUFBQSxZQUFrQixjQUFBLFlBQWxCO1dBQXBCLENBQW9ELENBQUMsSUFBckQsQ0FBMEQsU0FBQSxHQUFBO0FBQ3hELFlBQUEsTUFBQSxDQUFPLFVBQVAsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixJQUF4QixDQUFBLENBQUE7bUJBQ0EsY0FBYyxDQUFDLE9BQWYsQ0FBQSxFQUZ3RDtVQUFBLENBQTFELEVBRGM7UUFBQSxDQUFoQixFQVAyQztNQUFBLENBQTdDLENBQUEsQ0FBQTthQVdBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsWUFBQSwyQ0FBQTtBQUFBLFFBQUEsUUFBeUMsaUJBQUEsQ0FBQSxDQUF6QyxFQUFDLHVCQUFBLGNBQUQsRUFBaUIscUJBQUEsWUFBakIsRUFBK0IsZUFBQSxNQUEvQixDQUFBO0FBQUEsUUFDQSxlQUFlLENBQUMsR0FBaEIsQ0FBb0I7QUFBQSxVQUFDLFFBQUEsTUFBRDtBQUFBLFVBQVMsUUFBQSxFQUFVLENBQUMsVUFBQSxDQUFXLE9BQVgsQ0FBRCxFQUFzQixVQUFBLENBQVcsU0FBWCxDQUF0QixDQUFuQjtTQUFwQixDQURBLENBQUE7QUFBQSxRQUVBLGVBQWUsQ0FBQyxZQUFoQixDQUFBLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLGVBQWUsQ0FBQyxjQUFjLENBQUMsTUFBdEMsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxDQUFuRCxDQUhBLENBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLElBSnJCLENBQUE7QUFBQSxRQUtBLGVBQWUsQ0FBQyxHQUFoQixDQUFvQjtBQUFBLFVBQUMsUUFBQSxNQUFEO0FBQUEsVUFBUyxRQUFBLEVBQVUsQ0FBQyxVQUFBLENBQVcsT0FBWCxDQUFELENBQW5CO1NBQXBCLENBTEEsQ0FBQTtBQUFBLFFBTUEsZUFBZSxDQUFDLFlBQWhCLENBQUEsQ0FOQSxDQUFBO0FBQUEsUUFPQSxNQUFBLENBQU8sZUFBZSxDQUFDLGNBQWMsQ0FBQyxNQUF0QyxDQUE2QyxDQUFDLElBQTlDLENBQW1ELENBQW5ELENBUEEsQ0FBQTtBQUFBLFFBUUEsTUFBTSxDQUFDLFdBQVAsR0FBcUIsS0FSckIsQ0FBQTtBQUFBLFFBU0EsZUFBZSxDQUFDLEdBQWhCLENBQW9CO0FBQUEsVUFBQyxRQUFBLE1BQUQ7QUFBQSxVQUFTLFFBQUEsRUFBVSxDQUFDLFVBQUEsQ0FBVyxPQUFYLENBQUQsQ0FBbkI7U0FBcEIsQ0FUQSxDQUFBO0FBQUEsUUFVQSxlQUFlLENBQUMsWUFBaEIsQ0FBQSxDQVZBLENBQUE7ZUFXQSxNQUFBLENBQU8sZUFBZSxDQUFDLGNBQWMsQ0FBQyxNQUF0QyxDQUE2QyxDQUFDLElBQTlDLENBQW1ELENBQW5ELEVBWmdDO01BQUEsQ0FBbEMsRUFaZ0I7SUFBQSxDQUFsQixDQWpCQSxDQUFBO0FBQUEsSUEyQ0EsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxNQUFBLEVBQUEsQ0FBRyx1REFBSCxFQUE0RCxTQUFBLEdBQUE7QUFDMUQsWUFBQSwrQ0FBQTtBQUFBLFFBQUEsVUFBQSxHQUFhLEtBQWIsQ0FBQTtBQUFBLFFBQ0EsUUFBaUMsaUJBQUEsQ0FBQSxDQUFqQyxFQUFDLHVCQUFBLGNBQUQsRUFBaUIscUJBQUEsWUFEakIsQ0FBQTtBQUFBLFFBRUEsY0FBYyxDQUFDLG1CQUFmLENBQW1DLFNBQUMsVUFBRCxHQUFBO0FBQ2pDLFVBQUEsZUFBZSxDQUFDLEdBQWhCLENBQW9CLFVBQXBCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLGVBQWUsQ0FBQyxVQUF2QixDQUFrQyxDQUFDLElBQW5DLENBQXdDLElBQXhDLENBREEsQ0FBQTtpQkFFQSxlQUFlLENBQUMsWUFBaEIsQ0FBQSxFQUhpQztRQUFBLENBQW5DLENBRkEsQ0FBQTtBQUFBLFFBTUEsZUFBZSxDQUFDLG1CQUFoQixDQUFvQyxTQUFDLElBQUQsR0FBQTtBQUNsQyxjQUFBLHdCQUFBO0FBQUEsVUFEb0MsYUFBQSxPQUFPLGVBQUEsU0FBUyxnQkFBQSxRQUNwRCxDQUFBO0FBQUEsVUFBQSxVQUFBLEdBQWEsSUFBYixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLE1BQWIsQ0FBb0IsQ0FBQyxJQUFyQixDQUEwQixDQUExQixDQURBLENBQUE7QUFBQSxVQUVBLE1BQUEsQ0FBTyxPQUFPLENBQUMsTUFBZixDQUFzQixDQUFDLElBQXZCLENBQTRCLENBQTVCLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sUUFBUSxDQUFDLE1BQWhCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsQ0FBN0IsRUFKa0M7UUFBQSxDQUFwQyxDQU5BLENBQUE7ZUFXQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxjQUFjLENBQUMsSUFBZixDQUFvQjtBQUFBLFlBQUMsUUFBQSxFQUFVLEtBQVg7QUFBQSxZQUFrQixjQUFBLFlBQWxCO1dBQXBCLENBQW9ELENBQUMsSUFBckQsQ0FBMEQsU0FBQSxHQUFBO0FBQ3hELFlBQUEsTUFBQSxDQUFPLFVBQVAsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixJQUF4QixDQUFBLENBQUE7bUJBQ0EsY0FBYyxDQUFDLE9BQWYsQ0FBQSxFQUZ3RDtVQUFBLENBQTFELEVBRGM7UUFBQSxDQUFoQixFQVowRDtNQUFBLENBQTVELENBQUEsQ0FBQTthQWdCQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFlBQUEsMkRBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxLQUFiLENBQUE7QUFBQSxRQUNBLFFBQWlDLGlCQUFBLENBQUEsQ0FBakMsRUFBQyx1QkFBQSxjQUFELEVBQWlCLHFCQUFBLFlBRGpCLENBQUE7QUFBQSxRQUVBLGNBQWMsQ0FBQyxtQkFBZixDQUFtQyxTQUFDLFVBQUQsR0FBQTtBQUNqQyxVQUFBLGVBQWUsQ0FBQyxHQUFoQixDQUFvQixVQUFwQixDQUFBLENBQUE7aUJBQ0EsZUFBZSxDQUFDLFlBQWhCLENBQUEsRUFGaUM7UUFBQSxDQUFuQyxDQUZBLENBQUE7QUFBQSxRQUtBLFVBQUEsR0FBYSxlQUFlLENBQUMsbUJBQWhCLENBQW9DLFNBQUMsSUFBRCxHQUFBO0FBQy9DLGNBQUEsVUFBQTtBQUFBLFVBRGlELFFBQUQsS0FBQyxLQUNqRCxDQUFBO0FBQUEsVUFBQSxNQUFBLENBQU8sS0FBSyxDQUFDLE1BQWIsQ0FBb0IsQ0FBQyxJQUFyQixDQUEwQixDQUExQixDQUFBLENBQUE7QUFBQSxVQUNBLEdBQUEsR0FBTSxLQUFNLENBQUEsQ0FBQSxDQURaLENBQUE7QUFBQSxVQUVBLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FGQSxDQUFBO2lCQUdBLGVBQWUsQ0FBQyxtQkFBaEIsQ0FBb0MsU0FBQyxLQUFELEdBQUE7QUFDbEMsZ0JBQUEsUUFBQTtBQUFBLFlBRG9DLFdBQUQsTUFBQyxRQUNwQyxDQUFBO0FBQUEsWUFBQSxVQUFBLEdBQWEsSUFBYixDQUFBO21CQUNBLE1BQUEsQ0FBTyxRQUFTLENBQUEsQ0FBQSxDQUFoQixDQUFtQixDQUFDLElBQXBCLENBQXlCLEdBQXpCLEVBRmtDO1VBQUEsQ0FBcEMsRUFKK0M7UUFBQSxDQUFwQyxDQUxiLENBQUE7ZUFZQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxjQUFjLENBQUMsSUFBZixDQUFvQjtBQUFBLFlBQUMsUUFBQSxFQUFVLEtBQVg7QUFBQSxZQUFrQixjQUFBLFlBQWxCO1dBQXBCLENBQW9ELENBQUMsSUFBckQsQ0FBMkQsU0FBQSxHQUFBO0FBQ3pELG1CQUFPLGNBQWMsQ0FBQyxJQUFmLENBQW9CO0FBQUEsY0FBQyxRQUFBLEVBQVUsS0FBWDtBQUFBLGNBQWtCLGNBQUEsWUFBbEI7YUFBcEIsQ0FBUCxDQUR5RDtVQUFBLENBQTNELENBRUMsQ0FBQyxJQUZGLENBRU8sU0FBQSxHQUFBO0FBQ0wsWUFBQSxNQUFBLENBQU8sVUFBUCxDQUFrQixDQUFDLElBQW5CLENBQXdCLElBQXhCLENBQUEsQ0FBQTttQkFDQSxjQUFjLENBQUMsT0FBZixDQUFBLEVBRks7VUFBQSxDQUZQLEVBRGM7UUFBQSxDQUFoQixFQWJvRDtNQUFBLENBQXRELEVBakJnQztJQUFBLENBQWxDLENBM0NBLENBQUE7V0FnRkEsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTthQUNqQyxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLFlBQUEsdURBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxDQUFiLENBQUE7QUFBQSxRQUNBLFFBQWlDLGlCQUFBLENBQUEsQ0FBakMsRUFBQyx1QkFBQSxjQUFELEVBQWlCLHFCQUFBLFlBRGpCLENBQUE7QUFBQSxRQUVBLE1BQUEsR0FBUyxZQUFZLENBQUMsTUFGdEIsQ0FBQTtBQUFBLFFBR0EsY0FBYyxDQUFDLG1CQUFmLENBQW1DLFNBQUMsVUFBRCxHQUFBO0FBQ2pDLFVBQUEsZUFBZSxDQUFDLEdBQWhCLENBQW9CLFVBQXBCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLGVBQWUsQ0FBQyxVQUF2QixDQUFrQyxDQUFDLElBQW5DLENBQXdDLElBQXhDLENBREEsQ0FBQTtpQkFFQSxlQUFlLENBQUMsWUFBaEIsQ0FBQSxFQUhpQztRQUFBLENBQW5DLENBSEEsQ0FBQTtBQUFBLFFBT0EsZUFBZSxDQUFDLG1CQUFoQixDQUFvQyxTQUFDLElBQUQsR0FBQTtBQUNsQyxjQUFBLFFBQUE7QUFBQSxVQURvQyxXQUFELEtBQUMsUUFDcEMsQ0FBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLENBQWIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLFVBQUEsQ0FBVyxRQUFYLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxDQUFsQyxDQURBLENBQUE7aUJBRUEsZUFBZSxDQUFDLG9CQUFoQixDQUFxQyxNQUFyQyxFQUhrQztRQUFBLENBQXBDLENBUEEsQ0FBQTtlQVdBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGNBQWMsQ0FBQyxJQUFmLENBQW9CO0FBQUEsWUFBQyxRQUFBLEVBQVUsS0FBWDtBQUFBLFlBQWtCLGNBQUEsWUFBbEI7V0FBcEIsQ0FBb0QsQ0FBQyxJQUFyRCxDQUEwRCxTQUFBLEdBQUE7QUFDeEQsWUFBQSxNQUFBLENBQU8sVUFBUCxDQUFrQixDQUFDLElBQW5CLENBQXdCLENBQXhCLENBQUEsQ0FBQTttQkFDQSxjQUFjLENBQUMsT0FBZixDQUFBLEVBRndEO1VBQUEsQ0FBMUQsRUFEYztRQUFBLENBQWhCLEVBWnFDO01BQUEsQ0FBdkMsRUFEaUM7SUFBQSxDQUFuQyxFQWpGMkI7RUFBQSxDQUE3QixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/message-registry-spec.coffee

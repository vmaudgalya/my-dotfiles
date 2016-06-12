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
    describe('::deleteEditorMessages', function() {
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
    return describe('handles multiple panes resulting in multiple editors', function() {
      var leftEditorLinter, leftPane, linter, linterRegistry, messageUpdateDetails, rightEditorLinter, rightPane, runLint;
      leftPane = rightPane = linterRegistry = linter = null;
      leftEditorLinter = rightEditorLinter = messageUpdateDetails = null;
      beforeEach(function() {
        var lintCount, _ref1;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, linter = _ref1.linter, leftEditorLinter = _ref1.editorLinter;
        linter.scope = 'file';
        lintCount = 0;
        linter.lint = function() {
          var lintId;
          lintId = lintCount++;
          return [
            {
              key: lintId,
              type: "Error " + lintId,
              text: "Something"
            }
          ];
        };
        leftPane = atom.workspace.getActivePane();
        rightPane = leftPane.splitRight({
          copyActiveItem: true
        });
        rightEditorLinter = new EditorLinter(rightPane.getActiveItem());
        expect(leftEditorLinter.editor).not.toBe(rightEditorLinter.editor);
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          return messageRegistry.updatePublic();
        });
        return messageRegistry.onDidUpdateMessages(function(updateDetails) {
          return messageUpdateDetails = updateDetails;
        });
      });
      afterEach(function() {
        return linterRegistry.dispose();
      });
      runLint = function(editorLinter) {
        atom.workspace.paneForItem(editorLinter.editor).activate();
        return linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        }).then(function() {
          var returnDetails;
          returnDetails = messageUpdateDetails;
          messageUpdateDetails = null;
          return returnDetails;
        });
      };
      return it('stores messages on a per-buffer basis', function() {
        expect(messageRegistry.publicMessages.length).toBe(0);
        return waitsForPromise(function() {
          return runLint(leftEditorLinter).then(function(_arg) {
            var added, removed;
            added = _arg.added, removed = _arg.removed;
            expect(added.length).toBe(1);
            expect(removed.length).toBe(0);
            expect(messageRegistry.publicMessages.length).toBe(1);
            return runLint(rightEditorLinter);
          }).then(function(_arg) {
            var added, removed;
            added = _arg.added, removed = _arg.removed;
            expect(added.length).toBe(1);
            expect(removed.length).toBe(1);
            return expect(messageRegistry.publicMessages.length).toBe(1);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvbWVzc2FnZS1yZWdpc3RyeS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsK0dBQUE7QUFBQSxJQUFBLGVBQUEsR0FBa0IsSUFBbEIsQ0FBQTtBQUFBLElBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEseUJBQVIsQ0FEbEIsQ0FBQTtBQUFBLElBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQUZmLENBQUE7QUFBQSxJQUdBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBSGpCLENBQUE7QUFBQSxJQUlBLFVBQUEsR0FBYSxTQUFDLEdBQUQsR0FBQTtBQUNYLFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLENBQVAsQ0FBQTtBQUNBLFdBQUEsWUFBQSxHQUFBO0FBQUEsUUFBQSxJQUFBLEVBQUEsQ0FBQTtBQUFBLE9BREE7QUFFQSxhQUFPLElBQVAsQ0FIVztJQUFBLENBSmIsQ0FBQTtBQUFBLElBUUEsT0FBa0MsT0FBQSxDQUFRLFVBQVIsQ0FBbEMsRUFBQyx5QkFBQSxpQkFBRCxFQUFvQixrQkFBQSxVQVJwQixDQUFBO0FBQUEsSUFVQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7QUFDZCxRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxTQUFBLEdBQUE7O1lBQ25DLGVBQWUsQ0FBRSxPQUFqQixDQUFBO1dBQUE7aUJBQ0EsZUFBQSxHQUFzQixJ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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/message-registry-spec.coffee

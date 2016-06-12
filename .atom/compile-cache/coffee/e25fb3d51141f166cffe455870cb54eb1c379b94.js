(function() {
  var CompositeDisposable, EditorLinter, EditorRegistry, Emitter, _ref;

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  EditorLinter = require('./editor-linter');

  EditorRegistry = (function() {
    function EditorRegistry() {
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.emitter);
      this.editorLinters = new Map();
      this.editorLintersByPath = new Map();
    }

    EditorRegistry.prototype.create = function(textEditor) {
      var currentPath, editorLinter;
      editorLinter = new EditorLinter(textEditor);
      if (currentPath = textEditor.getPath()) {
        this.editorLintersByPath.set(currentPath, editorLinter);
      }
      textEditor.onDidChangePath((function(_this) {
        return function(path) {
          _this.editorLintersByPath["delete"](currentPath);
          return _this.editorLintersByPath.set(currentPath = path, editorLinter);
        };
      })(this));
      this.editorLinters.set(textEditor, editorLinter);
      editorLinter.onDidDestroy((function(_this) {
        return function() {
          return _this.editorLinters["delete"](textEditor);
        };
      })(this));
      this.emitter.emit('observe', editorLinter);
      return editorLinter;
    };

    EditorRegistry.prototype.forEach = function(callback) {
      return this.editorLinters.forEach(callback);
    };

    EditorRegistry.prototype.ofPath = function(path) {
      return this.editorLintersByPath.get(path);
    };

    EditorRegistry.prototype.ofTextEditor = function(editor) {
      return this.editorLinters.get(editor);
    };

    EditorRegistry.prototype.ofActiveTextEditor = function() {
      return this.ofTextEditor(atom.workspace.getActiveTextEditor());
    };

    EditorRegistry.prototype.observe = function(callback) {
      this.forEach(callback);
      return this.emitter.on('observe', callback);
    };

    EditorRegistry.prototype.dispose = function() {
      this.subscriptions.dispose();
      this.editorLinters.forEach(function(editorLinter) {
        return editorLinter.dispose();
      });
      return this.editorLinters.clear();
    };

    return EditorRegistry;

  })();

  module.exports = EditorRegistry;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9lZGl0b3ItcmVnaXN0cnkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdFQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQURmLENBQUE7O0FBQUEsRUFHTTtBQUNTLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBcEIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBRCxHQUFxQixJQUFBLEdBQUEsQ0FBQSxDQUhyQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsbUJBQUQsR0FBMkIsSUFBQSxHQUFBLENBQUEsQ0FKM0IsQ0FEVztJQUFBLENBQWI7O0FBQUEsNkJBT0EsTUFBQSxHQUFRLFNBQUMsVUFBRCxHQUFBO0FBQ04sVUFBQSx5QkFBQTtBQUFBLE1BQUEsWUFBQSxHQUFtQixJQUFBLFlBQUEsQ0FBYSxVQUFiLENBQW5CLENBQUE7QUFDQSxNQUFBLElBQUcsV0FBQSxHQUFjLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBakI7QUFDRSxRQUFBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxHQUFyQixDQUF5QixXQUF6QixFQUFzQyxZQUF0QyxDQUFBLENBREY7T0FEQTtBQUFBLE1BR0EsVUFBVSxDQUFDLGVB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/editor-registry.coffee

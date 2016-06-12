(function() {
  var CompositeDisposable, Emitter, LinterRegistry, helpers, validate, _ref;

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  validate = require('./validate');

  helpers = require('./helpers');

  LinterRegistry = (function() {
    function LinterRegistry() {
      this.linters = [];
      this.locks = {
        Regular: new WeakSet,
        Fly: new WeakSet
      };
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.emitter);
    }

    LinterRegistry.prototype.getLinters = function() {
      return this.linters.slice();
    };

    LinterRegistry.prototype.hasLinter = function(linter) {
      return this.linters.indexOf(linter) !== -1;
    };

    LinterRegistry.prototype.addLinter = function(linter) {
      var e;
      try {
        validate.linter(linter);
        linter.deactivated = false;
        return this.linters.push(linter);
      } catch (_error) {
        e = _error;
        return helpers.error(e);
      }
    };

    LinterRegistry.prototype.deleteLinter = function(linter) {
      if (!this.hasLinter(linter)) {
        return;
      }
      linter.deactivated = true;
      return this.linters.splice(this.linters.indexOf(linter), 1);
    };

    LinterRegistry.prototype.lint = function(_arg) {
      var editor, editorLinter, lockKey, onChange, scopes;
      onChange = _arg.onChange, editorLinter = _arg.editorLinter;
      editor = editorLinter.editor;
      lockKey = onChange ? 'Fly' : 'Regular';
      if (onChange && !atom.config.get('linter.lintOnFly')) {
        return;
      }
      if (editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if (!editor.getPath()) {
        return;
      }
      if (this.locks[lockKey].has(editorLinter)) {
        return;
      }
      this.locks[lockKey].add(editorLinter);
      scopes = editor.scopeDescriptorForBufferPosition(editor.getCursorBufferPosition()).scopes;
      scopes.push('*');
      return this.linters.reduce((function(_this) {
        return function(promise, linter) {
          if (!helpers.shouldTriggerLinter(linter, true, onChange, scopes)) {
            return promise;
          }
          return promise.then(function() {
            return _this.triggerLinter(linter, editor, scopes);
          });
        };
      })(this), Promise.resolve()).then((function(_this) {
        return function() {
          var Promises;
          Promises = _this.linters.map(function(linter) {
            if (!helpers.shouldTriggerLinter(linter, false, onChange, scopes)) {
              return;
            }
            return _this.triggerLinter(linter, editor, scopes);
          });
          return Promise.all(Promises);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.locks[lockKey]["delete"](editorLinter);
        };
      })(this));
    };

    LinterRegistry.prototype.triggerLinter = function(linter, editor, scopes) {
      return new Promise(function(resolve) {
        return resolve(linter.lint(editor));
      }).then((function(_this) {
        return function(results) {
          if (results) {
            return _this.emitter.emit('did-update-messages', {
              linter: linter,
              messages: results,
              editor: editor
            });
          }
        };
      })(this))["catch"](function(e) {
        return helpers.error(e);
      });
    };

    LinterRegistry.prototype.onDidUpdateMessages = function(callback) {
      return this.emitter.on('did-update-messages', callback);
    };

    LinterRegistry.prototype.dispose = function() {
      this.subscriptions.dispose();
      return this.linters = [];
    };

    return LinterRegistry;

  })();

  module.exports = LinterRegistry;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItcmVnaXN0cnkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFFQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUZWLENBQUE7O0FBQUEsRUFJTTtBQUNTLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBUyxHQUFBLENBQUEsT0FBVDtBQUFBLFFBQ0EsR0FBQSxFQUFLLEdBQUEsQ0FBQSxPQURMO09BRkYsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FKWCxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBTGpCLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBcEIsQ0FOQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSw2QkFTQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsYUFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQVQsQ0FBQSxDQUFQLENBRFU7SUFBQSxDQVRaLENBQUE7O0FBQUEsNkJBWUEsU0FBQSxHQUFXLFNBQUMsTUFBRCxHQUFBO2FBQ1QsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQWlCLE1BQWpC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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/linter-registry.coffee

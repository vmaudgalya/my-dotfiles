(function() {
  var CompositeDisposable, actionDecorator, atomActionName, editorProxy, emmet, emmetActions, fs, getUserHome, isValidTabContext, loadExtensions, multiSelectionActionDecorator, path, registerInteractiveActions, resources, runAction, singleSelectionActions, toggleCommentSyntaxes;

  path = require('path');

  fs = require('fs');

  CompositeDisposable = require('atom').CompositeDisposable;

  emmet = require('emmet');

  emmetActions = require('emmet/lib/action/main');

  resources = require('emmet/lib/assets/resources');

  editorProxy = require('./editor-proxy');

  singleSelectionActions = ['prev_edit_point', 'next_edit_point', 'merge_lines', 'reflect_css_value', 'select_next_item', 'select_previous_item', 'wrap_with_abbreviation', 'update_tag'];

  toggleCommentSyntaxes = ['html', 'css', 'less', 'scss'];

  getUserHome = function() {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE;
    }
    return process.env.HOME;
  };

  isValidTabContext = function() {
    var contains, scopes;
    if (editorProxy.getGrammar() === 'html') {
      scopes = editorProxy.getCurrentScope();
      contains = function(regexp) {
        return scopes.filter(function(s) {
          return regexp.test(s);
        }).length;
      };
      if (contains(/\.js\.embedded\./)) {
        return contains(/^string\./);
      }
    }
    return true;
  };

  actionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return runAction(action, evt);
        };
      })(this));
    };
  };

  multiSelectionActionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return editorProxy.exec(function(i) {
            runAction(action, evt);
            if (evt.keyBindingAborted) {
              return false;
            }
          });
        };
      })(this));
    };
  };

  runAction = function(action, evt) {
    var activeEditor, result, se, syntax;
    syntax = editorProxy.getSyntax();
    if (action === 'expand_abbreviation_with_tab') {
      activeEditor = editorProxy.editor;
      if (!isValidTabContext() || !activeEditor.getLastSelection().isEmpty()) {
        return evt.abortKeyBinding();
      }
      if (activeEditor.snippetExpansion) {
        se = activeEditor.snippetExpansion;
        if (se.tabStopIndex + 1 >= se.tabStopMarkers.length) {
          se.destroy();
        } else {
          return evt.abortKeyBinding();
        }
      }
    }
    if (action === 'toggle_comment' && (toggleCommentSyntaxes.indexOf(syntax) === -1 || !atom.config.get('emmet.useEmmetComments'))) {
      return evt.abortKeyBinding();
    }
    if (action === 'insert_formatted_line_break_only') {
      if (syntax !== 'html' || !atom.config.get('emmet.formatLineBreaks')) {
        return evt.abortKeyBinding();
      }
      result = emmet.run(action, editorProxy);
      if (!result) {
        return evt.abortKeyBinding();
      } else {
        return true;
      }
    }
    return emmet.run(action, editorProxy);
  };

  atomActionName = function(name) {
    return 'emmet:' + name.replace(/_/g, '-');
  };

  registerInteractiveActions = function(actions) {
    var name, _i, _len, _ref, _results;
    _ref = ['wrap_with_abbreviation', 'update_tag', 'interactive_expand_abbreviation'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _results.push((function(name) {
        var atomAction;
        atomAction = atomActionName(name);
        return actions[atomAction] = function(evt) {
          var interactive;
          editorProxy.setup(this.getModel());
          interactive = require('./interactive');
          return interactive.run(name, editorProxy);
        };
      })(name));
    }
    return _results;
  };

  loadExtensions = function() {
    var extPath, files;
    extPath = atom.config.get('emmet.extensionsPath');
    console.log('Loading Emmet extensions from', extPath);
    if (!extPath) {
      return;
    }
    if (extPath[0] === '~') {
      extPath = getUserHome() + extPath.substr(1);
    }
    if (fs.existsSync(extPath)) {
      emmet.resetUserData();
      files = fs.readdirSync(extPath);
      files = files.map(function(item) {
        return path.join(extPath, item);
      }).filter(function(file) {
        return !fs.statSync(file).isDirectory();
      });
      return emmet.loadExtensions(files);
    } else {
      return console.warn('Emmet: no such extension folder:', extPath);
    }
  };

  module.exports = {
    config: {
      extensionsPath: {
        type: 'string',
        "default": '~/emmet'
      },
      formatLineBreaks: {
        type: 'boolean',
        "default": true
      },
      useEmmetComments: {
        type: 'boolean',
        "default": false,
        description: 'disable to use atom native commenting system'
      }
    },
    activate: function(state) {
      var action, atomAction, cmd, _i, _len, _ref;
      this.state = state;
      this.subscriptions = new CompositeDisposable;
      if (!this.actions) {
        this.subscriptions.add(atom.config.observe('emmet.extensionsPath', loadExtensions));
        this.actions = {};
        registerInteractiveActions(this.actions);
        _ref = emmetActions.getList();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          action = _ref[_i];
          atomAction = atomActionName(action.name);
          if (this.actions[atomAction] != null) {
            continue;
          }
          cmd = singleSelectionActions.indexOf(action.name) !== -1 ? actionDecorator(action.name) : multiSelectionActionDecorator(action.name);
          this.actions[atomAction] = cmd;
        }
      }
      return this.subscriptions.add(atom.commands.add('atom-text-editor', this.actions));
    },
    deactivate: function() {
      return atom.config.transact((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvZW1tZXQvbGliL2VtbWV0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnUkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFJQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FKUixDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSx1QkFBUixDQUxmLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQVksT0FBQSxDQUFRLDRCQUFSLENBTlosQ0FBQTs7QUFBQSxFQVFBLFdBQUEsR0FBZSxPQUFBLENBQVEsZ0JBQVIsQ0FSZixDQUFBOztBQUFBLEVBV0Esc0JBQUEsR0FBeUIsQ0FDdkIsaUJBRHVCLEVBQ0osaUJBREksRUFDZSxhQURmLEVBRXZCLG1CQUZ1QixFQUVGLGtCQUZFLEVBRWtCLHNCQUZsQixFQUd2Qix3QkFIdUIsRUFHRyxZQUhILENBWHpCLENBQUE7O0FBQUEsRUFpQkEscUJBQUEsR0FBd0IsQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixNQUFoQixFQUF3QixNQUF4QixDQWpCeEIsQ0FBQTs7QUFBQSxFQW1CQSxXQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osSUFBQSxJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXZCO0FBQ0UsYUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQW5CLENBREY7S0FBQTtXQUdBLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FKQTtFQUFBLENBbkJkLENBQUE7O0FBQUEsRUF5QkEs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/emmet/lib/emmet.coffee

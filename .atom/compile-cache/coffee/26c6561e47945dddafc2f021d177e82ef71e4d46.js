(function() {
  var BottomContainer, BottomPanel, BottomStatus, CompositeDisposable, LinterViews, Message;

  CompositeDisposable = require('atom').CompositeDisposable;

  BottomPanel = require('./ui/bottom-panel').BottomPanel;

  BottomContainer = require('./ui/bottom-container');

  BottomStatus = require('./ui/bottom-status');

  Message = require('./ui/message-element').Message;

  LinterViews = (function() {
    function LinterViews(linter) {
      this.linter = linter;
      this.state = this.linter.state;
      this.subscriptions = new CompositeDisposable;
      this.messages = [];
      this.panel = new BottomPanel(this.state.scope);
      this.bottomContainer = new BottomContainer().prepare(this.linter.state);
      this.bottomBar = null;
      this.bubble = null;
      this.count = {
        File: 0,
        Line: 0,
        Project: 0
      };
      this.subscriptions.add(this.panel);
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showBubble) {
          return _this.showBubble = showBubble;
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.classifyMessages(_this.messages);
          _this.renderBubble();
          _this.renderCount();
          return _this.panel.refresh(_this.state.scope);
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onDidChangeTab((function(_this) {
        return function() {
          atom.config.set('linter.showErrorPanel', true);
          return _this.panel.refresh(_this.state.scope);
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onShouldTogglePanel((function(_this) {
        return function() {
          return atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
        };
      })(this)));
    }

    LinterViews.prototype.render = function(_arg) {
      var added, messages, removed;
      added = _arg.added, removed = _arg.removed, messages = _arg.messages;
      this.messages = this.classifyMessages(messages);
      this.panel.setMessages({
        added: added,
        removed: removed
      });
      this.renderBubble();
      this.renderCount();
      return this.notifyEditors({
        added: added,
        removed: removed
      });
    };

    LinterViews.prototype.notifyEditors = function(_arg) {
      var added, removed;
      added = _arg.added, removed = _arg.removed;
      removed.forEach((function(_this) {
        return function(message) {
          var editorLinter;
          if (!(message.filePath && message.range)) {
            return;
          }
          if (!(editorLinter = _this.linter.getEditorLinterByPath(message.filePath))) {
            return;
          }
          return editorLinter.deleteMessage(message);
        };
      })(this));
      return added.forEach((function(_this) {
        return function(message) {
          var editorLinter;
          if (!(message.filePath && message.range)) {
            return;
          }
          if (!(editorLinter = _this.linter.getEditorLinterByPath(message.filePath))) {
            return;
          }
          return editorLinter.addMessage(message);
        };
      })(this));
    };

    LinterViews.prototype.notifyEditor = function(editorLinter) {
      var editorPath;
      editorPath = editorLinter.editor.getPath();
      return this.messages.forEach(function(message) {
        if (!(message.filePath && message.range && message.filePath === editorPath)) {
          return;
        }
        return editorLinter.addMessage(message);
      });
    };

    LinterViews.prototype.renderLineMessages = function(render) {
      if (render == null) {
        render = false;
      }
      this.classifyMessagesByLine(this.messages);
      if (render) {
        this.renderCount();
        return this.panel.refresh(this.state.scope);
      }
    };

    LinterViews.prototype.classifyMessages = function(messages) {
      var filePath, key, message, _ref;
      filePath = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      this.count.File = 0;
      this.count.Project = 0;
      for (key in messages) {
        message = messages[key];
        if (message.currentFile = filePath && message.filePath === filePath) {
          this.count.File++;
        }
        this.count.Project++;
      }
      return this.classifyMessagesByLine(messages);
    };

    LinterViews.prototype.classifyMessagesByLine = function(messages) {
      var key, message, row, _ref;
      row = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getCursorBufferPosition().row : void 0;
      this.count.Line = 0;
      for (key in messages) {
        message = messages[key];
        if (message.currentLine = message.currentFile && message.range && message.range.intersectsRow(row)) {
          this.count.Line++;
        }
      }
      return messages;
    };

    LinterViews.prototype.renderBubble = function() {
      var activeEditor, message, point, _i, _len, _ref, _results;
      this.removeBubble();
      if (!this.showBubble) {
        return;
      }
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!(activeEditor != null ? typeof activeEditor.getPath === "function" ? activeEditor.getPath() : void 0 : void 0)) {
        return;
      }
      point = activeEditor.getCursorBufferPosition();
      _ref = this.messages;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        if (!message.currentLine) {
          continue;
        }
        if (!message.range.containsPoint(point)) {
          continue;
        }
        this.bubble = activeEditor.markBufferRange([point, point], {
          invalidate: 'inside'
        });
        activeEditor.decorateMarker(this.bubble, {
          type: 'overlay',
          position: 'tail',
          item: this.renderBubbleContent(message)
        });
        break;
      }
      return _results;
    };

    LinterViews.prototype.renderBubbleContent = function(message) {
      var bubble;
      bubble = document.createElement('div');
      bubble.id = 'linter-inline';
      bubble.appendChild(Message.fromMessage(message, false));
      if (message.trace) {
        message.trace.forEach(function(trace) {
          var element;
          element = Message.fromMessage(trace);
          bubble.appendChild(element);
          return element.updateVisibility('Project');
        });
      }
      return bubble;
    };

    LinterViews.prototype.renderCount = function() {
      return this.bottomContainer.setCount(this.count);
    };

    LinterViews.prototype.attachBottom = function(statusBar) {
      this.subscriptions.add(atom.config.observe('linter.statusIconPosition', (function(_this) {
        return function(statusIconPosition) {
          var _ref;
          if ((_ref = _this.bottomBar) != null) {
            _ref.destroy();
          }
          return _this.bottomBar = statusBar["add" + statusIconPosition + "Tile"]({
            item: _this.bottomContainer,
            priority: statusIconPosition === 'Left' ? -100 : 100
          });
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter.displayLinterInfo', (function(_this) {
        return function(displayLinterInfo) {
          return _this.bottomContainer.setVisibility(displayLinterInfo);
        };
      })(this)));
    };

    LinterViews.prototype.removeBubble = function() {
      var _ref;
      if ((_ref = this.bubble) != null) {
        _ref.destroy();
      }
      return this.bubble = null;
    };

    LinterViews.prototype.dispose = function() {
      var _ref;
      this.notifyEditors({
        added: [],
        removed: this.messages
      });
      this.removeBubble();
      this.subscriptions.dispose();
      return (_ref = this.bottomBar) != null ? _ref.destroy() : void 0;
    };

    return LinterViews;

  })();

  module.exports = LinterViews;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItdmlld3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFGQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQyxjQUFlLE9BQUEsQ0FBUSxtQkFBUixFQUFmLFdBRkQsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHVCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLG9CQUFSLENBSmYsQ0FBQTs7QUFBQSxFQUtDLFVBQVcsT0FBQSxDQUFRLHNCQUFSLEVBQVgsT0FMRCxDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLHFCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBRlosQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQW5CLENBSGIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGVBQUQsR0FBdUIsSUFBQSxlQUFBLENBQUEsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQWxDLENBSnZCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFMYixDQUFBO0FBQUEsTUFNQSxJQUFD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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/linter-views.coffee

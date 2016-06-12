Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _uiBottomPanel = require('./ui/bottom-panel');

var _uiBottomPanel2 = _interopRequireDefault(_uiBottomPanel);

var _uiBottomContainer = require('./ui/bottom-container');

var _uiBottomContainer2 = _interopRequireDefault(_uiBottomContainer);

var _uiMessageElement = require('./ui/message-element');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _uiMessageBubble = require('./ui/message-bubble');

'use babel';

var LinterViews = (function () {
  function LinterViews(scope, editorRegistry) {
    var _this = this;

    _classCallCheck(this, LinterViews);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.bottomPanel = new _uiBottomPanel2['default'](scope);
    this.bottomContainer = _uiBottomContainer2['default'].create(scope);
    this.editors = editorRegistry;
    this.bottomBar = null; // To be added when status-bar service is consumed
    this.bubble = null;
    this.bubbleRange = null;

    this.subscriptions.add(this.bottomPanel);
    this.subscriptions.add(this.bottomContainer);
    this.subscriptions.add(this.emitter);

    this.count = {
      Line: 0,
      File: 0,
      Project: 0
    };
    this.messages = [];
    this.subscriptions.add(atom.config.observe('linter.showErrorInline', function (showBubble) {
      return _this.showBubble = showBubble;
    }));
    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(function (paneItem) {
      var isEditor = false;
      _this.editors.forEach(function (editorLinter) {
        isEditor = (editorLinter.active = editorLinter.editor === paneItem) || isEditor;
      });
      _this.updateCounts();
      _this.bottomPanel.refresh();
      _this.bottomContainer.visibility = isEditor;
    }));
    this.subscriptions.add(this.bottomContainer.onDidChangeTab(function (scope) {
      _this.emitter.emit('did-update-scope', scope);
      atom.config.set('linter.showErrorPanel', true);
      _this.bottomPanel.refresh(scope);
    }));
    this.subscriptions.add(this.bottomContainer.onShouldTogglePanel(function () {
      atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
    }));

    this._renderBubble = this.renderBubble;
    this.subscriptions.add(atom.config.observe('linter.inlineTooltipInterval', function (bubbleInterval) {
      return _this.renderBubble = _helpers2['default'].debounce(_this._renderBubble, bubbleInterval);
    }));
  }

  _createClass(LinterViews, [{
    key: 'render',
    value: function render(_ref) {
      var added = _ref.added;
      var removed = _ref.removed;
      var messages = _ref.messages;

      this.messages = messages;
      this.notifyEditorLinters({ added: added, removed: removed });
      this.bottomPanel.setMessages({ added: added, removed: removed });
      this.updateCounts();
    }
  }, {
    key: 'updateCounts',
    value: function updateCounts() {
      var activeEditorLinter = this.editors.ofActiveTextEditor();

      this.count.Project = this.messages.length;
      this.count.File = activeEditorLinter ? activeEditorLinter.getMessages().size : 0;
      this.count.Line = activeEditorLinter ? activeEditorLinter.countLineMessages : 0;
      this.bottomContainer.setCount(this.count);
    }
  }, {
    key: 'renderBubble',
    value: function renderBubble(editorLinter) {
      if (!this.showBubble || !editorLinter.messages.size) {
        this.removeBubble();
        return;
      }
      var point = editorLinter.editor.getCursorBufferPosition();
      if (this.bubbleRange && this.bubbleRange.containsPoint(point)) {
        return; // The marker remains the same
      }
      this.removeBubble();
      for (var message of editorLinter.messages) {
        if (message.range && message.range.containsPoint(point)) {
          this.bubbleRange = _atom.Range.fromObject([point, point]);
          this.bubble = editorLinter.editor.markBufferRange(this.bubbleRange, { invalidate: 'never' });
          editorLinter.editor.decorateMarker(this.bubble, {
            type: 'overlay',
            item: (0, _uiMessageBubble.create)(message)
          });
          return;
        }
      }
      this.bubbleRange = null;
    }
  }, {
    key: 'removeBubble',
    value: function removeBubble() {
      if (this.bubble) {
        this.bubble.destroy();
        this.bubble = null;
      }
    }
  }, {
    key: 'notifyEditorLinters',
    value: function notifyEditorLinters(_ref2) {
      var _this2 = this;

      var added = _ref2.added;
      var removed = _ref2.removed;

      var editorLinter = undefined;
      removed.forEach(function (message) {
        if (message.filePath && (editorLinter = _this2.editors.ofPath(message.filePath))) {
          editorLinter.deleteMessage(message);
        }
      });
      added.forEach(function (message) {
        if (message.filePath && (editorLinter = _this2.editors.ofPath(message.filePath))) {
          editorLinter.addMessage(message);
        }
      });
      editorLinter = this.editors.ofActiveTextEditor();
      if (editorLinter) {
        editorLinter.calculateLineMessages(null);
        this.renderBubble(editorLinter);
      } else {
        this.removeBubble();
      }
    }
  }, {
    key: 'notifyEditorLinter',
    value: function notifyEditorLinter(editorLinter) {
      var path = editorLinter.editor.getPath();
      if (!path) return;
      this.messages.forEach(function (message) {
        if (message.filePath && message.filePath === path) {
          editorLinter.addMessage(message);
        }
      });
    }
  }, {
    key: 'attachBottom',
    value: function attachBottom(statusBar) {
      var _this3 = this;

      this.subscriptions.add(atom.config.observe('linter.statusIconPosition', function (position) {
        if (_this3.bottomBar) {
          _this3.bottomBar.destroy();
        }
        _this3.bottomBar = statusBar['add' + position + 'Tile']({
          item: _this3.bottomContainer,
          priority: position === 'Left' ? -100 : 100
        });
      }));
    }
  }, {
    key: 'onDidUpdateScope',
    value: function onDidUpdateScope(callback) {
      return this.emitter.on('did-update-scope', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      // No need to notify editors of this, we're being disposed means the package is
      // being deactivated. They'll be disposed automatically by the registry.
      this.subscriptions.dispose();
      if (this.bottomBar) {
        this.bottomBar.destroy();
      }
      if (this.bubble) {
        this.bubble.destroy();
        this.bubbleRange = null;
      }
    }
  }]);

  return LinterViews;
})();

exports['default'] = LinterViews;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXZpZXdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWtELE1BQU07OzZCQUNoQyxtQkFBbUI7Ozs7aUNBQ2YsdUJBQXVCOzs7O2dDQUM3QixzQkFBc0I7O3VCQUN4QixXQUFXOzs7OytCQUNNLHFCQUFxQjs7QUFQMUQsV0FBVyxDQUFBOztJQVNVLFdBQVc7QUFDbkIsV0FEUSxXQUFXLENBQ2xCLEtBQUssRUFBRSxjQUFjLEVBQUU7OzswQkFEaEIsV0FBVzs7QUFFNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBZ0IsS0FBSyxDQUFDLENBQUE7QUFDekMsUUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBZ0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3BELFFBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFBO0FBQzdCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBOztBQUV2QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDeEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFcEMsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFVBQUksRUFBRSxDQUFDO0FBQ1AsVUFBSSxFQUFFLENBQUM7QUFDUCxhQUFPLEVBQUUsQ0FBQztLQUNYLENBQUE7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QUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbEIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN6QjtBQUNELFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDckIsWUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7T0FDeEI7S0FDRjs7O1NBakprQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvdm1hdWRnYWx5YS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci12aWV3cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgUmFuZ2V9IGZyb20gJ2F0b20nXG5pbXBvcnQgQm90dG9tUGFuZWwgZnJvbSAnLi91aS9ib3R0b20tcGFuZWwnXG5pbXBvcnQgQm90dG9tQ29udGFpbmVyIGZyb20gJy4vdWkvYm90dG9tLWNvbnRhaW5lcidcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi91aS9tZXNzYWdlLWVsZW1lbnQnXG5pbXBvcnQgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQge2NyZWF0ZSBhcyBjcmVhdGVCdWJibGV9IGZyb20gJy4vdWkvbWVzc2FnZS1idWJibGUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlclZpZXdzIHtcbiAgY29uc3RydWN0b3Ioc2NvcGUsIGVkaXRvclJlZ2lzdHJ5KSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmJvdHRvbVBhbmVsID0gbmV3IEJvdHRvbVBhbmVsKHNjb3BlKVxuICAgIHRoaXMuYm90dG9tQ29udGFpbmVyID0gQm90dG9tQ29udGFpbmVyLmNyZWF0ZShzY29wZSlcbiAgICB0aGlzLmVkaXRvcnMgPSBlZGl0b3JSZWdpc3RyeVxuICAgIHRoaXMuYm90dG9tQmFyID0gbnVsbCAvLyBUbyBiZSBhZGRlZCB3aGVuIHN0YXR1cy1iYXIgc2VydmljZSBpcyBjb25zdW1lZFxuICAgIHRoaXMuYnViYmxlID0gbnVsbFxuICAgIHRoaXMuYnViYmxlUmFuZ2UgPSBudWxsXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYm90dG9tUGFuZWwpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbUNvbnRhaW5lcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcblxuICAgIHRoaXMuY291bnQgPSB7XG4gICAgICBMaW5lOiAwLFxuICAgICAgRmlsZTogMCxcbiAgICAgIFByb2plY3Q6IDBcbiAgICB9XG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuc2hvd0Vycm9ySW5saW5lJywgc2hvd0J1YmJsZSA9PlxuICAgICAgdGhpcy5zaG93QnViYmxlID0gc2hvd0J1YmJsZVxuICAgICkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKHBhbmVJdGVtID0+IHtcbiAgICAgIGxldCBpc0VkaXRvciA9IGZhbHNlXG4gICAgICB0aGlzLmVkaXRvcnMuZm9yRWFjaChmdW5jdGlvbihlZGl0b3JMaW50ZXIpIHtcbiAgICAgICAgaXNFZGl0b3IgPSAoZWRpdG9yTGludGVyLmFjdGl2ZSA9IGVkaXRvckxpbnRlci5lZGl0b3IgPT09IHBhbmVJdGVtKSB8fCBpc0VkaXRvclxuICAgICAgfSlcbiAgICAgIHRoaXMudXBkYXRlQ291bnRzKClcbiAgICAgIHRoaXMuYm90dG9tUGFuZWwucmVmcmVzaCgpXG4gICAgICB0aGlzLmJvdHRvbUNvbnRhaW5lci52aXNpYmlsaXR5ID0gaXNFZGl0b3JcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYm90dG9tQ29udGFpbmVyLm9uRGlkQ2hhbmdlVGFiKHNjb3BlID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLXNjb3BlJywgc2NvcGUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5zaG93RXJyb3JQYW5lbCcsIHRydWUpXG4gICAgICB0aGlzLmJvdHRvbVBhbmVsLnJlZnJlc2goc2NvcGUpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbUNvbnRhaW5lci5vblNob3VsZFRvZ2dsZVBhbmVsKGZ1bmN0aW9uKCkge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCAhYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnKSlcbiAgICB9KSlcblxuICAgIHRoaXMuX3JlbmRlckJ1YmJsZSA9IHRoaXMucmVuZGVyQnViYmxlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuaW5saW5lVG9vbHRpcEludGVydmFsJywgYnViYmxlSW50ZXJ2YWwgPT5cbiAgICAgIHRoaXMucmVuZGVyQnViYmxlID0gSGVscGVycy5kZWJvdW5jZSh0aGlzLl9yZW5kZXJCdWJibGUsIGJ1YmJsZUludGVydmFsKVxuICAgICkpXG4gIH1cbiAgcmVuZGVyKHthZGRlZCwgcmVtb3ZlZCwgbWVzc2FnZXN9KSB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgdGhpcy5ub3RpZnlFZGl0b3JMaW50ZXJzKHthZGRlZCwgcmVtb3ZlZH0pXG4gICAgdGhpcy5ib3R0b21QYW5lbC5zZXRNZXNzYWdlcyh7YWRkZWQsIHJlbW92ZWR9KVxuICAgIHRoaXMudXBkYXRlQ291bnRzKClcbiAgfVxuICB1cGRhdGVDb3VudHMoKSB7XG4gICAgY29uc3QgYWN0aXZlRWRpdG9yTGludGVyID0gdGhpcy5lZGl0b3JzLm9mQWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICB0aGlzLmNvdW50LlByb2plY3QgPSB0aGlzLm1lc3NhZ2VzLmxlbmd0aFxuICAgIHRoaXMuY291bnQuRmlsZSA9IGFjdGl2ZUVkaXRvckxpbnRlciA/IGFjdGl2ZUVkaXRvckxpbnRlci5nZXRNZXNzYWdlcygpLnNpemUgOiAwXG4gICAgdGhpcy5jb3VudC5MaW5lID0gYWN0aXZlRWRpdG9yTGludGVyID8gYWN0aXZlRWRpdG9yTGludGVyLmNvdW50TGluZU1lc3NhZ2VzIDogMFxuICAgIHRoaXMuYm90dG9tQ29udGFpbmVyLnNldENvdW50KHRoaXMuY291bnQpXG4gIH1cbiAgcmVuZGVyQnViYmxlKGVkaXRvckxpbnRlcikge1xuICAgIGlmICghdGhpcy5zaG93QnViYmxlIHx8ICFlZGl0b3JMaW50ZXIubWVzc2FnZXMuc2l6ZSkge1xuICAgICAgdGhpcy5yZW1vdmVCdWJibGUoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHBvaW50ID0gZWRpdG9yTGludGVyLmVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgaWYgKHRoaXMuYnViYmxlUmFuZ2UgJiYgdGhpcy5idWJibGVSYW5nZS5jb250YWluc1BvaW50KHBvaW50KSkge1xuICAgICAgcmV0dXJuIC8vIFRoZSBtYXJrZXIgcmVtYWlucyB0aGUgc2FtZVxuICAgIH1cbiAgICB0aGlzLnJlbW92ZUJ1YmJsZSgpXG4gICAgZm9yIChsZXQgbWVzc2FnZSBvZiBlZGl0b3JMaW50ZXIubWVzc2FnZXMpIHtcbiAgICAgIGlmIChtZXNzYWdlLnJhbmdlICYmIG1lc3NhZ2UucmFuZ2UuY29udGFpbnNQb2ludChwb2ludCkpIHtcbiAgICAgICAgdGhpcy5idWJibGVSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW3BvaW50LCBwb2ludF0pXG4gICAgICAgIHRoaXMuYnViYmxlID0gZWRpdG9yTGludGVyLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UodGhpcy5idWJibGVSYW5nZSwge2ludmFsaWRhdGU6ICduZXZlcid9KVxuICAgICAgICBlZGl0b3JMaW50ZXIuZWRpdG9yLmRlY29yYXRlTWFya2VyKHRoaXMuYnViYmxlLCB7XG4gICAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICAgIGl0ZW06IGNyZWF0ZUJ1YmJsZShtZXNzYWdlKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5idWJibGVSYW5nZSA9IG51bGxcbiAgfVxuICByZW1vdmVCdWJibGUoKSB7XG4gICAgaWYgKHRoaXMuYnViYmxlKSB7XG4gICAgICB0aGlzLmJ1YmJsZS5kZXN0cm95KClcbiAgICAgIHRoaXMuYnViYmxlID0gbnVsbFxuICAgIH1cbiAgfVxuICBub3RpZnlFZGl0b3JMaW50ZXJzKHthZGRlZCwgcmVtb3ZlZH0pIHtcbiAgICBsZXQgZWRpdG9yTGludGVyXG4gICAgcmVtb3ZlZC5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZmlsZVBhdGggJiYgKGVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZlBhdGgobWVzc2FnZS5maWxlUGF0aCkpKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5kZWxldGVNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcbiAgICBhZGRlZC5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZmlsZVBhdGggJiYgKGVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZlBhdGgobWVzc2FnZS5maWxlUGF0aCkpKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5hZGRNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcbiAgICBlZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvcnMub2ZBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoZWRpdG9yTGludGVyKSB7XG4gICAgICBlZGl0b3JMaW50ZXIuY2FsY3VsYXRlTGluZU1lc3NhZ2VzKG51bGwpXG4gICAgICB0aGlzLnJlbmRlckJ1YmJsZShlZGl0b3JMaW50ZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlQnViYmxlKClcbiAgICB9XG4gIH1cbiAgbm90aWZ5RWRpdG9yTGludGVyKGVkaXRvckxpbnRlcikge1xuICAgIGNvbnN0IHBhdGggPSBlZGl0b3JMaW50ZXIuZWRpdG9yLmdldFBhdGgoKVxuICAgIGlmICghcGF0aCkgcmV0dXJuXG4gICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGlmIChtZXNzYWdlLmZpbGVQYXRoICYmIG1lc3NhZ2UuZmlsZVBhdGggPT09IHBhdGgpIHtcbiAgICAgICAgZWRpdG9yTGludGVyLmFkZE1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGF0dGFjaEJvdHRvbShzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5zdGF0dXNJY29uUG9zaXRpb24nLCBwb3NpdGlvbiA9PiB7XG4gICAgICBpZiAodGhpcy5ib3R0b21CYXIpIHtcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuZGVzdHJveSgpXG4gICAgICB9XG4gICAgICB0aGlzLmJvdHRvbUJhciA9IHN0YXR1c0JhcltgYWRkJHtwb3NpdGlvbn1UaWxlYF0oe1xuICAgICAgICBpdGVtOiB0aGlzLmJvdHRvbUNvbnRhaW5lcixcbiAgICAgICAgcHJpb3JpdHk6IHBvc2l0aW9uID09PSAnTGVmdCcgPyAtMTAwIDogMTAwXG4gICAgICB9KVxuICAgIH0pKVxuICB9XG5cbiAgb25EaWRVcGRhdGVTY29wZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtc2NvcGUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIC8vIE5vIG5lZWQgdG8gbm90aWZ5IGVkaXRvcnMgb2YgdGhpcywgd2UncmUgYmVpbmcgZGlzcG9zZWQgbWVhbnMgdGhlIHBhY2thZ2UgaXNcbiAgICAvLyBiZWluZyBkZWFjdGl2YXRlZC4gVGhleSdsbCBiZSBkaXNwb3NlZCBhdXRvbWF0aWNhbGx5IGJ5IHRoZSByZWdpc3RyeS5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuYm90dG9tQmFyKSB7XG4gICAgICB0aGlzLmJvdHRvbUJhci5kZXN0cm95KClcbiAgICB9XG4gICAgaWYgKHRoaXMuYnViYmxlKSB7XG4gICAgICB0aGlzLmJ1YmJsZS5kZXN0cm95KClcbiAgICAgIHRoaXMuYnViYmxlUmFuZ2UgPSBudWxsXG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/linter-views.js

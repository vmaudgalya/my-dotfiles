Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var EditorLinter = (function () {
  function EditorLinter(editor) {
    var _this = this;

    _classCallCheck(this, EditorLinter);

    if (!(editor instanceof _atom.TextEditor)) {
      throw new Error('Given editor is not really an editor');
    }

    this.editor = editor;
    this.emitter = new _atom.Emitter();
    this.messages = new Set();
    this.markers = new WeakMap();
    this.gutter = null;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter.underlineIssues', function (underlineIssues) {
      return _this.underlineIssues = underlineIssues;
    }));
    this.subscriptions.add(this.editor.onDidDestroy(function () {
      return _this.dispose();
    }));
    this.subscriptions.add(this.editor.onDidSave(function () {
      return _this.emitter.emit('should-lint', false);
    }));
    this.subscriptions.add(this.editor.onDidChangeCursorPosition(function (_ref) {
      var oldBufferPosition = _ref.oldBufferPosition;
      var newBufferPosition = _ref.newBufferPosition;

      if (newBufferPosition.row !== oldBufferPosition.row) {
        _this.emitter.emit('should-update-line-messages');
      }
      _this.emitter.emit('should-update-bubble');
    }));
    this.subscriptions.add(atom.config.observe('linter.gutterEnabled', function (gutterEnabled) {
      _this.gutterEnabled = gutterEnabled;
      _this.handleGutter();
    }));
    // Using onDidChange instead of observe here 'cause the same function is invoked above
    this.subscriptions.add(atom.config.onDidChange('linter.gutterPosition', function () {
      return _this.handleGutter();
    }));
    this.subscriptions.add(this.onDidMessageAdd(function (message) {
      if (!_this.underlineIssues && !_this.gutterEnabled) {
        return; // No-Op
      }
      var marker = _this.editor.markBufferRange(message.range, { invalidate: 'inside' });
      _this.markers.set(message, marker);
      if (_this.underlineIssues) {
        _this.editor.decorateMarker(marker, {
          type: 'highlight',
          'class': 'linter-highlight ' + message['class']
        });
      }
      if (_this.gutterEnabled) {
        var item = document.createElement('span');
        item.className = 'linter-gutter linter-highlight ' + message['class'];
        _this.gutter.decorateMarker(marker, {
          'class': 'linter-row',
          item: item
        });
      }
    }));
    this.subscriptions.add(this.onDidMessageDelete(function (message) {
      if (_this.markers.has(message)) {
        _this.markers.get(message).destroy();
        _this.markers['delete'](message);
      }
    }));

    // Atom invokes the onDidStopChanging callback immediately on Editor creation. So we wait a moment
    setImmediate(function () {
      _this.subscriptions.add(_this.editor.onDidStopChanging(function () {
        return _this.emitter.emit('should-lint', true);
      }));
    });
  }

  _createClass(EditorLinter, [{
    key: 'handleGutter',
    value: function handleGutter() {
      if (this.gutter !== null) {
        this.removeGutter();
      }
      if (this.gutterEnabled) {
        this.addGutter();
      }
    }
  }, {
    key: 'addGutter',
    value: function addGutter() {
      var position = atom.config.get('linter.gutterPosition');
      this.gutter = this.editor.addGutter({
        name: 'linter',
        priority: position === 'Left' ? -100 : 100
      });
    }
  }, {
    key: 'removeGutter',
    value: function removeGutter() {
      if (this.gutter !== null) {
        try {
          this.gutter.destroy();
          // Atom throws when we try to remove a gutter container from a closed text editor
        } catch (err) {}
        this.gutter = null;
      }
    }
  }, {
    key: 'getMessages',
    value: function getMessages() {
      return this.messages;
    }
  }, {
    key: 'addMessage',
    value: function addMessage(message) {
      if (!this.messages.has(message)) {
        this.messages.add(message);
        this.emitter.emit('did-message-add', message);
        this.emitter.emit('did-message-change', { message: message, type: 'add' });
      }
    }
  }, {
    key: 'deleteMessage',
    value: function deleteMessage(message) {
      if (this.messages.has(message)) {
        this.messages['delete'](message);
        this.emitter.emit('did-message-delete', message);
        this.emitter.emit('did-message-change', { message: message, type: 'delete' });
      }
    }
  }, {
    key: 'lint',
    value: function lint() {
      var onChange = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.emitter.emit('should-lint', onChange);
    }
  }, {
    key: 'onDidMessageAdd',
    value: function onDidMessageAdd(callback) {
      return this.emitter.on('did-message-add', callback);
    }
  }, {
    key: 'onDidMessageDelete',
    value: function onDidMessageDelete(callback) {
      return this.emitter.on('did-message-delete', callback);
    }
  }, {
    key: 'onDidMessageChange',
    value: function onDidMessageChange(callback) {
      return this.emitter.on('did-message-change', callback);
    }
  }, {
    key: 'onShouldUpdateBubble',
    value: function onShouldUpdateBubble(callback) {
      return this.emitter.on('should-update-bubble', callback);
    }
  }, {
    key: 'onShouldUpdateLineMessages',
    value: function onShouldUpdateLineMessages(callback) {
      return this.emitter.on('should-update-line-messages', callback);
    }
  }, {
    key: 'onShouldLint',
    value: function onShouldLint(callback) {
      return this.emitter.on('should-lint', callback);
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      if (this.markers.size) {
        this.markers.forEach(function (marker) {
          return marker.destroy();
        });
        this.markers.clear();
      }
      this.removeGutter();
      this.subscriptions.dispose();
      this.messages.clear();
      this.emitter.dispose();
    }
  }]);

  return EditorLinter;
})();

exports['default'] = EditorLinter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLWxpbnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFdUQsTUFBTTs7QUFGN0QsV0FBVyxDQUFBOztJQUdVLFlBQVk7QUFDcEIsV0FEUSxZQUFZLENBQ25CLE1BQU0sRUFBRTs7OzBCQURELFlBQVk7O0FBRTdCLFFBQUksRUFBRSxNQUFNLDZCQUFzQixBQUFDLEVBQUU7QUFDbkMsWUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFBO0tBQ3hEOztBQUVELFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXVCLENBQUE7O0FBRTVDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLFVBQUEsZUFBZTthQUNsRixNQUFLLGVBQWUsR0FBRyxlQUFlO0tBQUEsQ0FDdkMsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7YUFDOUMsTUFBSyxPQUFPLEVBQUU7S0FBQSxDQUNmLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO2FBQzNDLE1BQUssT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDO0tBQUEsQ0FDeEMs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UUFBUSxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FFVyxzQkFBQyxRQUFRLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDaEMsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtBQUNyQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07aUJBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtTQUFBLENBQUMsQ0FBQTtBQUNoRCxZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO09BQ3JCO0FBQ0QsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0FBQ25CLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3ZCOzs7U0FqS2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLWxpbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7VGV4dEVkaXRvciwgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvckxpbnRlciB7XG4gIGNvbnN0cnVjdG9yKGVkaXRvcikge1xuICAgIGlmICghKGVkaXRvciBpbnN0YW5jZW9mIFRleHRFZGl0b3IpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dpdmVuIGVkaXRvciBpcyBub3QgcmVhbGx5IGFuIGVkaXRvcicpXG4gICAgfVxuXG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMubWFya2VycyA9IG5ldyBXZWFrTWFwKClcbiAgICB0aGlzLmd1dHRlciA9IG51bGxcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIudW5kZXJsaW5lSXNzdWVzJywgdW5kZXJsaW5lSXNzdWVzID0+XG4gICAgICB0aGlzLnVuZGVybGluZUlzc3VlcyA9IHVuZGVybGluZUlzc3Vlc1xuICAgICkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT5cbiAgICAgIHRoaXMuZGlzcG9zZSgpXG4gICAgKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWRpdG9yLm9uRGlkU2F2ZSgoKSA9PlxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1saW50JywgZmFsc2UpXG4gICAgKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oKHtvbGRCdWZmZXJQb3NpdGlvbiwgbmV3QnVmZmVyUG9zaXRpb259KSA9PiB7XG4gICAgICBpZiAobmV3QnVmZmVyUG9zaXRpb24ucm93ICE9PSBvbGRCdWZmZXJQb3NpdGlvbi5yb3cpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC11cGRhdGUtbGluZS1tZXNzYWdlcycpXG4gICAgICB9XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLXVwZGF0ZS1idWJibGUnKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmd1dHRlckVuYWJsZWQnLCBndXR0ZXJFbmFibGVkID0+IHtcbiAgICAgIHRoaXMuZ3V0dGVyRW5hYmxlZCA9IGd1dHRlckVuYWJsZWRcbiAgICAgIHRoaXMuaGFuZGxlR3V0dGVyKClcbiAgICB9KSlcbiAgICAvLyBVc2luZyBvbkRpZENoYW5nZSBpbnN0ZWFkIG9mIG9ic2VydmUgaGVyZSAnY2F1c2UgdGhlIHNhbWUgZnVuY3Rpb24gaXMgaW52b2tlZCBhYm92ZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xpbnRlci5ndXR0ZXJQb3NpdGlvbicsICgpID0+XG4gICAgICB0aGlzLmhhbmRsZUd1dHRlcigpXG4gICAgKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMub25EaWRNZXNzYWdlQWRkKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKCF0aGlzLnVuZGVybGluZUlzc3VlcyAmJiAhdGhpcy5ndXR0ZXJFbmFibGVkKSB7XG4gICAgICAgIHJldHVybiAvLyBOby1PcFxuICAgICAgfVxuICAgICAgY29uc3QgbWFya2VyID0gdGhpcy5lZGl0b3IubWFya0J1ZmZlclJhbmdlKG1lc3NhZ2UucmFuZ2UsIHtpbnZhbGlkYXRlOiAnaW5zaWRlJ30pXG4gICAgICB0aGlzLm1hcmtlcnMuc2V0KG1lc3NhZ2UsIG1hcmtlcilcbiAgICAgIGlmICh0aGlzLnVuZGVybGluZUlzc3Vlcykge1xuICAgICAgICB0aGlzLmVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgICB0eXBlOiAnaGlnaGxpZ2h0JyxcbiAgICAgICAgICBjbGFzczogYGxpbnRlci1oaWdobGlnaHQgJHttZXNzYWdlLmNsYXNzfWBcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmd1dHRlckVuYWJsZWQpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9IGBsaW50ZXItZ3V0dGVyIGxpbnRlci1oaWdobGlnaHQgJHttZXNzYWdlLmNsYXNzfWBcbiAgICAgICAgdGhpcy5ndXR0ZXIuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgICAgY2xhc3M6ICdsaW50ZXItcm93JyxcbiAgICAgICAgICBpdGVtXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLm9uRGlkTWVzc2FnZURlbGV0ZShtZXNzYWdlID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlcnMuaGFzKG1lc3NhZ2UpKSB7XG4gICAgICAgIHRoaXMubWFya2Vycy5nZXQobWVzc2FnZSkuZGVzdHJveSgpXG4gICAgICAgIHRoaXMubWFya2Vycy5kZWxldGUobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIC8vIEF0b20gaW52b2tlcyB0aGUgb25EaWRTdG9wQ2hhbmdpbmcgY2FsbGJhY2sgaW1tZWRpYXRlbHkgb24gRWRpdG9yIGNyZWF0aW9uLiBTbyB3ZSB3YWl0IGEgbW9tZW50XG4gICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcoKCkgPT5cbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1saW50JywgdHJ1ZSlcbiAgICAgICkpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUd1dHRlcigpIHtcbiAgICBpZiAodGhpcy5ndXR0ZXIgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVtb3ZlR3V0dGVyKClcbiAgICB9XG4gICAgaWYgKHRoaXMuZ3V0dGVyRW5hYmxlZCkge1xuICAgICAgdGhpcy5hZGRHdXR0ZXIoKVxuICAgIH1cbiAgfVxuXG4gIGFkZEd1dHRlcigpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLmd1dHRlclBvc2l0aW9uJylcbiAgICB0aGlzLmd1dHRlciA9IHRoaXMuZWRpdG9yLmFkZEd1dHRlcih7XG4gICAgICBuYW1lOiAnbGludGVyJyxcbiAgICAgIHByaW9yaXR5OiBwb3NpdGlvbiA9PT0gJ0xlZnQnID8gLTEwMCA6IDEwMFxuICAgIH0pXG4gIH1cblxuICByZW1vdmVHdXR0ZXIoKSB7XG4gICAgaWYgKHRoaXMuZ3V0dGVyICE9PSBudWxsKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmd1dHRlci5kZXN0cm95KClcbiAgICAgICAgLy8gQXRvbSB0aHJvd3Mgd2hlbiB3ZSB0cnkgdG8gcmVtb3ZlIGEgZ3V0dGVyIGNvbnRhaW5lciBmcm9tIGEgY2xvc2VkIHRleHQgZWRpdG9yXG4gICAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgICB0aGlzLmd1dHRlciA9IG51bGxcbiAgICB9XG4gIH1cblxuICBnZXRNZXNzYWdlcygpIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdlc1xuICB9XG5cbiAgYWRkTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgaWYgKCF0aGlzLm1lc3NhZ2VzLmhhcyhtZXNzYWdlKSkge1xuICAgICAgdGhpcy5tZXNzYWdlcy5hZGQobWVzc2FnZSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtbWVzc2FnZS1hZGQnLCBtZXNzYWdlKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1tZXNzYWdlLWNoYW5nZScsIHttZXNzYWdlLCB0eXBlOiAnYWRkJ30pXG4gICAgfVxuICB9XG5cbiAgZGVsZXRlTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgaWYgKHRoaXMubWVzc2FnZXMuaGFzKG1lc3NhZ2UpKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzLmRlbGV0ZShtZXNzYWdlKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1tZXNzYWdlLWRlbGV0ZScsIG1lc3NhZ2UpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW1lc3NhZ2UtY2hhbmdlJywge21lc3NhZ2UsIHR5cGU6ICdkZWxldGUnfSlcbiAgICB9XG4gIH1cblxuICBsaW50KG9uQ2hhbmdlID0gZmFsc2UpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLWxpbnQnLCBvbkNoYW5nZSlcbiAgfVxuXG4gIG9uRGlkTWVzc2FnZUFkZChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1tZXNzYWdlLWFkZCcsIGNhbGxiYWNrKVxuICB9XG5cbiAgb25EaWRNZXNzYWdlRGVsZXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLW1lc3NhZ2UtZGVsZXRlJywgY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZE1lc3NhZ2VDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtbWVzc2FnZS1jaGFuZ2UnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uU2hvdWxkVXBkYXRlQnViYmxlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLXVwZGF0ZS1idWJibGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uU2hvdWxkVXBkYXRlTGluZU1lc3NhZ2VzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLXVwZGF0ZS1saW5lLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cblxuICBvblNob3VsZExpbnQoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtbGludCcsIGNhbGxiYWNrKVxuICB9XG5cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICBpZiAodGhpcy5tYXJrZXJzLnNpemUpIHtcbiAgICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKG1hcmtlciA9PiBtYXJrZXIuZGVzdHJveSgpKVxuICAgICAgdGhpcy5tYXJrZXJzLmNsZWFyKClcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVHdXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKClcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/editor-linter.js

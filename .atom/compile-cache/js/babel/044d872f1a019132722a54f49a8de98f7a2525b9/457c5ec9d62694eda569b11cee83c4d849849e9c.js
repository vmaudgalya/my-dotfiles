var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var Validate = require('./validate');
var Helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    var _this = this;

    _classCallCheck(this, MessageRegistry);

    this.hasChanged = false;
    this.shouldRefresh = true;
    this.publicMessages = [];
    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.linterResponses = new Map();
    // We track messages by the underlying TextBuffer the lint was run against
    // rather than the TextEditor because there may be multiple TextEditors per
    // TextBuffer when multiple panes are in use.  For each buffer, we store a
    // map whose values are messages and whose keys are the linter that produced
    // the messages.  (Note that we are talking about linter instances, not
    // EditorLinter instances.  EditorLinter instances are per-TextEditor and
    // could result in duplicated sets of messages.)
    this.bufferMessages = new Map();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.ignoredMessageTypes', function (value) {
      return _this.ignoredMessageTypes = value || [];
    }));

    var UpdateMessages = function UpdateMessages() {
      if (_this.shouldRefresh) {
        if (_this.hasChanged) {
          _this.hasChanged = false;
          _this.updatePublic();
        }
        Helpers.requestUpdateFrame(UpdateMessages);
      }
    };
    Helpers.requestUpdateFrame(UpdateMessages);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var _this2 = this;

      var linter = _ref.linter;
      var messages = _ref.messages;
      var editor = _ref.editor;

      if (linter.deactivated) return;
      try {
        Validate.messages(messages, linter);
      } catch (e) {
        return Helpers.error(e);
      }
      messages = messages.filter(function (i) {
        return _this2.ignoredMessageTypes.indexOf(i.type) === -1;
      });
      if (linter.scope === 'file') {
        if (!editor.alive) return;
        if (!(editor instanceof _atom.TextEditor)) throw new Error("Given editor isn't really an editor");
        var buffer = editor.getBuffer();
        if (!this.bufferMessages.has(buffer)) this.bufferMessages.set(buffer, new Map());
        this.bufferMessages.get(buffer).set(linter, messages);
      } else {
        // It's project
        this.linterResponses.set(linter, messages);
      }
      this.hasChanged = true;
    }
  }, {
    key: 'updatePublic',
    value: function updatePublic() {
      var latestMessages = [];
      var publicMessages = [];
      var added = [];
      var removed = [];
      var currentKeys = undefined;
      var lastKeys = undefined;

      this.linterResponses.forEach(function (messages) {
        return latestMessages = latestMessages.concat(messages);
      });
      this.bufferMessages.forEach(function (bufferMessages) {
        return bufferMessages.forEach(function (messages) {
          return latestMessages = latestMessages.concat(messages);
        });
      });

      currentKeys = latestMessages.map(function (i) {
        return i.key;
      });
      lastKeys = this.publicMessages.map(function (i) {
        return i.key;
      });

      for (var i of latestMessages) {
        if (lastKeys.indexOf(i.key) === -1) {
          added.push(i);
          publicMessages.push(i);
        }
      }

      for (var i of this.publicMessages) {
        if (currentKeys.indexOf(i.key) === -1) removed.push(i);else publicMessages.push(i);
      }this.publicMessages = publicMessages;
      this.emitter.emit('did-update-messages', { added: added, removed: removed, messages: publicMessages });
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteMessages',
    value: function deleteMessages(linter) {
      if (linter.scope === 'file') {
        this.bufferMessages.forEach(function (r) {
          return r['delete'](linter);
        });
        this.hasChanged = true;
      } else if (this.linterResponses.has(linter)) {
        this.linterResponses['delete'](linter);
        this.hasChanged = true;
      }
    }
  }, {
    key: 'deleteEditorMessages',
    value: function deleteEditorMessages(editor) {
      // Caveat: in the event that there are multiple TextEditor instances open
      // referring to the same underlying buffer and those instances are not also
      // closed, the linting results for this buffer will be temporarily removed
      // until such time as a lint is re-triggered by one of the other
      // corresponding EditorLinter instances.  There are ways to mitigate this,
      // but they all involve some complexity that does not yet seem justified.
      var buffer = editor.getBuffer();
      if (!this.bufferMessages.has(buffer)) return;
      this.bufferMessages['delete'](buffer);
      this.hasChanged = true;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.shouldRefresh = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      this.bufferMessages.clear();
    }
  }]);

  return MessageRegistry;
})();

module.exports = MessageRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWVzc2FnZS1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUN1RCxNQUFNOztBQUQ3RCxXQUFXLENBQUE7O0FBR1gsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3RDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTs7SUFFOUIsZUFBZTtBQUNSLFdBRFAsZUFBZSxHQUNMOzs7MEJBRFYsZUFBZTs7QUFFakIsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7QUFDdkIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUE7QUFDeEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOzs7Ozs7OztBQVFoQyxRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRS9CLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsRUFBRSxVQUFBLEtBQUs7YUFBSSxNQUFLLG1CQUFtQixHQUFJLEtBQUssSUFBSSxFQUFFLEFBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQTs7QUFFNUgsUUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxHQUFTO0FBQzNCLFVBQUksTUFBSyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxNQUFLLFVBQVUsRUFBRTtBQUNuQixnQkFBSyxVQUFVLEdBQUcsS0FBSyxDQUFB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Q0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO09BQ3ZCO0tBQ0Y7OztXQUNtQiw4QkFBQyxNQUFNLEVBQUU7Ozs7Ozs7QUFPM0IsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFNO0FBQzVDLFVBQUksQ0FBQyxjQUFjLFVBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNsQyxVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtLQUN2Qjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQTtBQUMxQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUM1Qjs7O1NBOUdHLGVBQWU7OztBQWlIckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUEiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9tZXNzYWdlLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbmltcG9ydCB7RW1pdHRlciwgVGV4dEVkaXRvciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcblxuY29uc3QgVmFsaWRhdGUgPSByZXF1aXJlKCcuL3ZhbGlkYXRlJylcbmNvbnN0IEhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKVxuXG5jbGFzcyBNZXNzYWdlUmVnaXN0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmhhc0NoYW5nZWQgPSBmYWxzZVxuICAgIHRoaXMuc2hvdWxkUmVmcmVzaCA9IHRydWVcbiAgICB0aGlzLnB1YmxpY01lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubGludGVyUmVzcG9uc2VzID0gbmV3IE1hcCgpXG4gICAgLy8gV2UgdHJhY2sgbWVzc2FnZXMgYnkgdGhlIHVuZGVybHlpbmcgVGV4dEJ1ZmZlciB0aGUgbGludCB3YXMgcnVuIGFnYWluc3RcbiAgICAvLyByYXRoZXIgdGhhbiB0aGUgVGV4dEVkaXRvciBiZWNhdXNlIHRoZXJlIG1heSBiZSBtdWx0aXBsZSBUZXh0RWRpdG9ycyBwZXJcbiAgICAvLyBUZXh0QnVmZmVyIHdoZW4gbXVsdGlwbGUgcGFuZXMgYXJlIGluIHVzZS4gIEZvciBlYWNoIGJ1ZmZlciwgd2Ugc3RvcmUgYVxuICAgIC8vIG1hcCB3aG9zZSB2YWx1ZXMgYXJlIG1lc3NhZ2VzIGFuZCB3aG9zZSBrZXlzIGFyZSB0aGUgbGludGVyIHRoYXQgcHJvZHVjZWRcbiAgICAvLyB0aGUgbWVzc2FnZXMuICAoTm90ZSB0aGF0IHdlIGFyZSB0YWxraW5nIGFib3V0IGxpbnRlciBpbnN0YW5jZXMsIG5vdFxuICAgIC8vIEVkaXRvckxpbnRlciBpbnN0YW5jZXMuICBFZGl0b3JMaW50ZXIgaW5zdGFuY2VzIGFyZSBwZXItVGV4dEVkaXRvciBhbmRcbiAgICAvLyBjb3VsZCByZXN1bHQgaW4gZHVwbGljYXRlZCBzZXRzIG9mIG1lc3NhZ2VzLilcbiAgICB0aGlzLmJ1ZmZlck1lc3NhZ2VzID0gbmV3IE1hcCgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5pZ25vcmVkTWVzc2FnZVR5cGVzJywgdmFsdWUgPT4gdGhpcy5pZ25vcmVkTWVzc2FnZVR5cGVzID0gKHZhbHVlIHx8IFtdKSkpXG5cbiAgICBjb25zdCBVcGRhdGVNZXNzYWdlcyA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnNob3VsZFJlZnJlc2gpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQ2hhbmdlZCkge1xuICAgICAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IGZhbHNlXG4gICAgICAgICAgdGhpcy51cGRhdGVQdWJsaWMoKVxuICAgICAgICB9XG4gICAgICAgIEhlbHBlcnMucmVxdWVzdFVwZGF0ZUZyYW1lKFVwZGF0ZU1lc3NhZ2VzKVxuICAgICAgfVxuICAgIH1cbiAgICBIZWxwZXJzLnJlcXVlc3RVcGRhdGVGcmFtZShVcGRhdGVNZXNzYWdlcylcbiAgfVxuICBzZXQoe2xpbnRlciwgbWVzc2FnZXMsIGVkaXRvcn0pIHtcbiAgICBpZiAobGludGVyLmRlYWN0aXZhdGVkKSByZXR1cm5cbiAgICB0cnkge1xuICAgICAgVmFsaWRhdGUubWVzc2FnZXMobWVzc2FnZXMsIGxpbnRlcilcbiAgICB9IGNhdGNoIChlKSB7IHJldHVybiBIZWxwZXJzLmVycm9yKGUpIH1cbiAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcihpID0+IHRoaXMuaWdub3JlZE1lc3NhZ2VUeXBlcy5pbmRleE9mKGkudHlwZSkgPT09IC0xKVxuICAgIGlmIChsaW50ZXIuc2NvcGUgPT09ICdmaWxlJykge1xuICAgICAgaWYgKCFlZGl0b3IuYWxpdmUpIHJldHVyblxuICAgICAgaWYgKCEoZWRpdG9yIGluc3RhbmNlb2YgVGV4dEVkaXRvcikpIHRocm93IG5ldyBFcnJvcihcIkdpdmVuIGVkaXRvciBpc24ndCByZWFsbHkgYW4gZWRpdG9yXCIpXG4gICAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBpZiAoIXRoaXMuYnVmZmVyTWVzc2FnZXMuaGFzKGJ1ZmZlcikpXG4gICAgICAgIHRoaXMuYnVmZmVyTWVzc2FnZXMuc2V0KGJ1ZmZlciwgbmV3IE1hcCgpKVxuICAgICAgdGhpcy5idWZmZXJNZXNzYWdlcy5nZXQoYnVmZmVyKS5zZXQobGludGVyLCBtZXNzYWdlcylcbiAgICB9IGVsc2UgeyAvLyBJdCdzIHByb2plY3RcbiAgICAgIHRoaXMubGludGVyUmVzcG9uc2VzLnNldChsaW50ZXIsIG1lc3NhZ2VzKVxuICAgIH1cbiAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlXG4gIH1cbiAgdXBkYXRlUHVibGljKCkge1xuICAgIGxldCBsYXRlc3RNZXNzYWdlcyA9IFtdXG4gICAgbGV0IHB1YmxpY01lc3NhZ2VzID0gW11cbiAgICBsZXQgYWRkZWQgPSBbXVxuICAgIGxldCByZW1vdmVkID0gW11cbiAgICBsZXQgY3VycmVudEtleXNcbiAgICBsZXQgbGFzdEtleXNcblxuICAgIHRoaXMubGludGVyUmVzcG9uc2VzLmZvckVhY2gobWVzc2FnZXMgPT4gbGF0ZXN0TWVzc2FnZXMgPSBsYXRlc3RNZXNzYWdlcy5jb25jYXQobWVzc2FnZXMpKVxuICAgIHRoaXMuYnVmZmVyTWVzc2FnZXMuZm9yRWFjaChidWZmZXJNZXNzYWdlcyA9PlxuICAgICAgYnVmZmVyTWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlcyA9PiBsYXRlc3RNZXNzYWdlcyA9IGxhdGVzdE1lc3NhZ2VzLmNvbmNhdChtZXNzYWdlcykpXG4gICAgKVxuXG4gICAgY3VycmVudEtleXMgPSBsYXRlc3RNZXNzYWdlcy5tYXAoaSA9PiBpLmtleSlcbiAgICBsYXN0S2V5cyA9IHRoaXMucHVibGljTWVzc2FnZXMubWFwKGkgPT4gaS5rZXkpXG5cbiAgICBmb3IgKGxldCBpIG9mIGxhdGVzdE1lc3NhZ2VzKSB7XG4gICAgICBpZiAobGFzdEtleXMuaW5kZXhPZihpLmtleSkgPT09IC0xKSB7XG4gICAgICAgIGFkZGVkLnB1c2goaSlcbiAgICAgICAgcHVibGljTWVzc2FnZXMucHVzaChpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgb2YgdGhpcy5wdWJsaWNNZXNzYWdlcylcbiAgICAgIGlmIChjdXJyZW50S2V5cy5pbmRleE9mKGkua2V5KSA9PT0gLTEpXG4gICAgICAgIHJlbW92ZWQucHVzaChpKVxuICAgICAgZWxzZVxuICAgICAgICBwdWJsaWNNZXNzYWdlcy5wdXNoKGkpXG5cbiAgICB0aGlzLnB1YmxpY01lc3NhZ2VzID0gcHVibGljTWVzc2FnZXNcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHthZGRlZCwgcmVtb3ZlZCwgbWVzc2FnZXM6IHB1YmxpY01lc3NhZ2VzfSlcbiAgfVxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG4gIGRlbGV0ZU1lc3NhZ2VzKGxpbnRlcikge1xuICAgIGlmIChsaW50ZXIuc2NvcGUgPT09ICdmaWxlJykge1xuICAgICAgdGhpcy5idWZmZXJNZXNzYWdlcy5mb3JFYWNoKHIgPT4gci5kZWxldGUobGludGVyKSlcbiAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgICB9IGVsc2UgaWYodGhpcy5saW50ZXJSZXNwb25zZXMuaGFzKGxpbnRlcikpIHtcbiAgICAgIHRoaXMubGludGVyUmVzcG9uc2VzLmRlbGV0ZShsaW50ZXIpXG4gICAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRlbGV0ZUVkaXRvck1lc3NhZ2VzKGVkaXRvcikge1xuICAgIC8vIENhdmVhdDogaW4gdGhlIGV2ZW50IHRoYXQgdGhlcmUgYXJlIG11bHRpcGxlIFRleHRFZGl0b3IgaW5zdGFuY2VzIG9wZW5cbiAgICAvLyByZWZlcnJpbmcgdG8gdGhlIHNhbWUgdW5kZXJseWluZyBidWZmZXIgYW5kIHRob3NlIGluc3RhbmNlcyBhcmUgbm90IGFsc29cbiAgICAvLyBjbG9zZWQsIHRoZSBsaW50aW5nIHJlc3VsdHMgZm9yIHRoaXMgYnVmZmVyIHdpbGwgYmUgdGVtcG9yYXJpbHkgcmVtb3ZlZFxuICAgIC8vIHVudGlsIHN1Y2ggdGltZSBhcyBhIGxpbnQgaXMgcmUtdHJpZ2dlcmVkIGJ5IG9uZSBvZiB0aGUgb3RoZXJcbiAgICAvLyBjb3JyZXNwb25kaW5nIEVkaXRvckxpbnRlciBpbnN0YW5jZXMuICBUaGVyZSBhcmUgd2F5cyB0byBtaXRpZ2F0ZSB0aGlzLFxuICAgIC8vIGJ1dCB0aGV5IGFsbCBpbnZvbHZlIHNvbWUgY29tcGxleGl0eSB0aGF0IGRvZXMgbm90IHlldCBzZWVtIGp1c3RpZmllZC5cbiAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuICAgIGlmICghdGhpcy5idWZmZXJNZXNzYWdlcy5oYXMoYnVmZmVyKSkgcmV0dXJuXG4gICAgdGhpcy5idWZmZXJNZXNzYWdlcy5kZWxldGUoYnVmZmVyKVxuICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc2hvdWxkUmVmcmVzaCA9IGZhbHNlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMubGludGVyUmVzcG9uc2VzLmNsZWFyKClcbiAgICB0aGlzLmJ1ZmZlck1lc3NhZ2VzLmNsZWFyKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VSZWdpc3RyeVxuIl19
//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/message-registry.js

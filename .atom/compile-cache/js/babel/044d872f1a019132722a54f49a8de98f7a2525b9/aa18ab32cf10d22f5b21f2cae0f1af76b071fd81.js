Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var BottomPanel = (function () {
  function BottomPanel(scope) {
    var _this = this;

    _classCallCheck(this, BottomPanel);

    this.subscriptions = new _atom.CompositeDisposable();
    this.element = document.createElement('linter-panel'); // TODO(steelbrain): Make this a `div`
    this.panel = atom.workspace.addBottomPanel({ item: this.element, visible: false, priority: 500 });
    this.visibility = false;
    this.scope = scope;
    this.messages = new Map();

    this.subscriptions.add(atom.config.observe('linter.showErrorPanel', function (value) {
      _this.configVisibility = value;
      _this.setVisibility(true);
    }));
    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.paneVisibility = paneItem === atom.workspace.getActiveTextEditor();
      _this.setVisibility(true);
    }));
  }

  _createClass(BottomPanel, [{
    key: 'refresh',
    value: function refresh(scope) {
      this.scope = scope;
      for (var message of this.messages) {
        message[1].updateVisibility(scope);
      }
    }
  }, {
    key: 'setMessages',
    value: function setMessages(_ref) {
      var added = _ref.added;
      var removed = _ref.removed;

      if (removed.length) this.removeMessages(removed);
      for (var message of added) {
        var messageElement = _messageElement.Message.fromMessage(message);
        this.element.appendChild(messageElement);
        messageElement.updateVisibility(this.scope);
        this.messages.set(message, messageElement);
      }
    }
  }, {
    key: 'removeMessages',
    value: function removeMessages(removed) {
      for (var message of removed) {
        if (this.messages.has(message)) {
          this.element.removeChild(this.messages.get(message));
          this.messages['delete'](message);
        }
      }
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'setVisibility',
    value: function setVisibility(value) {
      this.visibility = value && this.configVisibility && this.paneVisibility;
      if (this.visibility) {
        this.panel.show();
      } else {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.messages.clear();
      this.panel.destroy();
    }
  }]);

  return BottomPanel;
})();

exports.BottomPanel = BottomPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVrQyxNQUFNOzs4QkFDbEIsbUJBQW1COztBQUh6QyxXQUFXLENBQUE7O0lBS0UsV0FBVztBQUNYLFdBREEsV0FBVyxDQUNWLEtBQUssRUFBRTs7OzBCQURSLFdBQVc7O0FBRXBCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXVCLENBQUE7QUFDNUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3JELFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFBO0FBQy9GLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFekIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsVUFBQSxLQUFLLEVBQUk7QUFDM0UsWUFBSyxnQkFBZ0IsR0FBRyxLQUFLLENBQUE7QUFDN0IsWUFBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekIsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ3RFLFlBQUssY0FBYyxHQUFHLFFBQVEsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDdkUsWUFBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekIsQ0FBQyxDQUFDLENBQUE7R0FDSjs7ZUFqQlUsV0FBVzs7V0FrQmYsaUJBQUMsS0FBSyxFQUFFO0FBQ2IsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7QUFDbEIsV0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pDLGVBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUNuQztLQUNGOzs7V0FDVSxxQkFBQyxJQUFnQixFQUFFO1VBQWpCLEtBQUssR0FBTixJQUFnQixDQUFmLEtBQUs7VUFBRSxPQUFPLEdBQWYsSUFBZ0IsQ0FBUixPQUFPOztBQUN6QixVQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQ2hCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDOUIsV0FBSyxJQUFJLE9BQU8sSUFBSSxLQUFLLEVBQUU7QUFDekIsWUFBTSxjQUFjLEdBQUcsd0JBQVEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ25ELFlBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3hDLHNCQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzNDLFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQTtPQUMzQztLQUNGOzs7V0FDYSx3QkFBQyxPQUFPLEVBQUU7QUFDdEIsV0FBSyxJQUFJLE9BQU8sSUFBSSxPQUFPLEVBQUU7QUFDM0IsWUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUM5QixjQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQ3BELGNBQUksQ0FBQyxRQUFRLFVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUM5QjtPQUNGO0tBQ0Y7OztXQUNZLHlCQUFHO0FBQ2QsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFBO0tBQ3ZCOzs7V0FDWSx1QkFBQyxLQUFLLEVBQUU7QUFDbkIsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUE7QUFDdkUsVUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ25CLFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDbEIsTUFBTTtBQUNMLFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDbEI7S0FDRjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDckIsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNyQjs7O1NBekRVLFdBQVciLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJy4vbWVzc2FnZS1lbGVtZW50J1xuXG5leHBvcnQgY2xhc3MgQm90dG9tUGFuZWwge1xuICBjb25zdHJ1Y3RvcihzY29wZSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLXBhbmVsJykgLy8gVE9ETyhzdGVlbGJyYWluKTogTWFrZSB0aGlzIGEgYGRpdmBcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe2l0ZW06IHRoaXMuZWxlbWVudCwgdmlzaWJsZTogZmFsc2UsIHByaW9yaXR5OiA1MDB9KVxuICAgIHRoaXMudmlzaWJpbGl0eSA9IGZhbHNlXG4gICAgdGhpcy5zY29wZSA9IHNjb3BlXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNYXAoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCB2YWx1ZSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ1Zpc2liaWxpdHkgPSB2YWx1ZVxuICAgICAgdGhpcy5zZXRWaXNpYmlsaXR5KHRydWUpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0ocGFuZUl0ZW0gPT4ge1xuICAgICAgdGhpcy5wYW5lVmlzaWJpbGl0eSA9IHBhbmVJdGVtID09PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHRoaXMuc2V0VmlzaWJpbGl0eSh0cnVlKVxuICAgIH0pKVxuICB9XG4gIHJlZnJlc2goc2NvcGUpIHtcbiAgICB0aGlzLnNjb3BlID0gc2NvcGVcbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIHRoaXMubWVzc2FnZXMpIHtcbiAgICAgIG1lc3NhZ2VbMV0udXBkYXRlVmlzaWJpbGl0eShzY29wZSlcbiAgICB9XG4gIH1cbiAgc2V0TWVzc2FnZXMoe2FkZGVkLCByZW1vdmVkfSkge1xuICAgIGlmIChyZW1vdmVkLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTWVzc2FnZXMocmVtb3ZlZClcbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIGFkZGVkKSB7XG4gICAgICBjb25zdCBtZXNzYWdlRWxlbWVudCA9IE1lc3NhZ2UuZnJvbU1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudClcbiAgICAgIG1lc3NhZ2VFbGVtZW50LnVwZGF0ZVZpc2liaWxpdHkodGhpcy5zY29wZSlcbiAgICAgIHRoaXMubWVzc2FnZXMuc2V0KG1lc3NhZ2UsIG1lc3NhZ2VFbGVtZW50KVxuICAgIH1cbiAgfVxuICByZW1vdmVNZXNzYWdlcyhyZW1vdmVkKSB7XG4gICAgZm9yIChsZXQgbWVzc2FnZSBvZiByZW1vdmVkKSB7XG4gICAgICBpZiAodGhpcy5tZXNzYWdlcy5oYXMobWVzc2FnZSkpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMubWVzc2FnZXMuZ2V0KG1lc3NhZ2UpKVxuICAgICAgICB0aGlzLm1lc3NhZ2VzLmRlbGV0ZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXRWaXNpYmlsaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnZpc2liaWxpdHlcbiAgfVxuICBzZXRWaXNpYmlsaXR5KHZhbHVlKSB7XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gdmFsdWUgJiYgdGhpcy5jb25maWdWaXNpYmlsaXR5ICYmIHRoaXMucGFuZVZpc2liaWxpdHlcbiAgICBpZiAodGhpcy52aXNpYmlsaXR5KSB7XG4gICAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhbmVsLmhpZGUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKClcbiAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/ui/bottom-panel.js

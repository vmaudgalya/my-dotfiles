'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewLine = /\r?\n/;

var Message = (function (_HTMLElement) {
  _inherits(Message, _HTMLElement);

  function Message() {
    _classCallCheck(this, Message);

    _get(Object.getPrototypeOf(Message.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Message, [{
    key: 'initialize',
    value: function initialize(message) {
      var includeLink = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.message = message;
      this.includeLink = includeLink;
      return this;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility(scope) {
      var status = true;
      if (scope === 'Line') status = this.message.currentLine;else if (scope === 'File') status = this.message.currentFile;

      if (this.children.length && this.message.filePath) {
        var link = this.querySelector('.linter-message-link');
        if (link) {
          if (scope === 'Project') {
            link.querySelector('span').removeAttribute('hidden');
          } else {
            link.querySelector('span').setAttribute('hidden', true);
          }
        }
      }

      if (status) {
        this.removeAttribute('hidden');
      } else this.setAttribute('hidden', true);
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      if (atom.config.get('linter.showProviderName') && this.message.linter) {
        this.appendChild(Message.getName(this.message));
      }
      this.appendChild(Message.getRibbon(this.message));
      this.appendChild(Message.getMessage(this.message, this.includeLink));
    }
  }], [{
    key: 'getLink',
    value: function getLink(message) {
      var el = document.createElement('a');
      var pathEl = document.createElement('span');
      var displayFile = message.filePath;

      el.className = 'linter-message-link';

      for (var path of atom.project.getPaths()) {
        if (displayFile.indexOf(path) === 0) {
          displayFile = displayFile.substr(path.length + 1); // Path + Path Separator
          break;
        }
      }if (message.range) {
        el.textContent = 'at line ' + (message.range.start.row + 1) + ' col ' + (message.range.start.column + 1);
      }
      pathEl.textContent = ' in ' + displayFile;
      el.appendChild(pathEl);
      el.addEventListener('click', function () {
        atom.workspace.open(message.filePath).then(function () {
          if (message.range) {
            atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
          }
        });
      });
      return el;
    }
  }, {
    key: 'getMessage',
    value: function getMessage(message, includeLink) {
      if (message.multiline || message.html && message.html.match(NewLine) || message.text && message.text.match(NewLine)) {
        return Message.getMultiLineMessage(message, includeLink);
      }

      var el = document.createElement('span');
      var messageEl = document.createElement('span');

      el.className = 'linter-message-item';

      if (includeLink && message.filePath) {
        el.appendChild(Message.getLink(message));
      }

      el.appendChild(messageEl);

      if (message.html && typeof message.html !== 'string') {
        messageEl.appendChild(message.html.cloneNode(true));
      } else if (message.html) {
        messageEl.innerHTML = message.html;
      } else if (message.text) {
        messageEl.textContent = message.text;
      }

      return el;
    }
  }, {
    key: 'getMultiLineMessage',
    value: function getMultiLineMessage(message, includeLink) {
      var container = document.createElement('linter-multiline-message');
      var messageText = message.text || message.html;
      for (var line of messageText.split(NewLine)) {
        if (!line) continue;
        var el = document.createElement('linter-message-line');
        el.textContent = line;
        container.appendChild(el);
      }
      if (includeLink && message.filePath) {
        container.appendChild(Message.getLink(message));
      }
      return container;
    }
  }, {
    key: 'getName',
    value: function getName(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight';
      el.textContent = message.linter;
      return el;
    }
  }, {
    key: 'getRibbon',
    value: function getRibbon(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight ' + message['class'];
      el.textContent = message.type;
      return el;
    }
  }, {
    key: 'fromMessage',
    value: function fromMessage(message, includeLink) {
      return new MessageElement().initialize(message, includeLink);
    }
  }]);

  return Message;
})(HTMLElement);

exports.Message = Message;
var MessageElement = document.registerElement('linter-message', {
  prototype: Message.prototype
});
exports.MessageElement = MessageElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvbWVzc2FnZS1lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7QUFFWCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUE7O0lBRVYsT0FBTztZQUFQLE9BQU87O1dBQVAsT0FBTzswQkFBUCxPQUFPOzsrQkFBUCxPQUFPOzs7ZUFBUCxPQUFPOztXQUNSLG9CQUFDLE9BQU8sRUFBc0I7VUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUNwQyxVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixVQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUM5QixhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0FDZSwwQkFBQyxLQUFLLEVBQUU7QUFDdEIsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLFVBQUksS0FBSyxLQUFLLE1BQU0sRUFDbEIsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBLEtBQzlCLElBQUksS0FBSyxLQUFLLE1BQU0sRUFDdkIsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBOztBQUVuQyxVQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQ2pELFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtBQUN2RCxZQUFJLElBQUksRUFBRTtBQUNSLGNBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUN2QixnQkFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7V0FDckQsTUFBTTtBQUNMLGdCQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVB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Y2thZ2VzL2xpbnRlci9saWIvdWkvbWVzc2FnZS1lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuY29uc3QgTmV3TGluZSA9IC9cXHI/XFxuL1xuXG5leHBvcnQgY2xhc3MgTWVzc2FnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgaW5pdGlhbGl6ZShtZXNzYWdlLCBpbmNsdWRlTGluayA9IHRydWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5pbmNsdWRlTGluayA9IGluY2x1ZGVMaW5rXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1cGRhdGVWaXNpYmlsaXR5KHNjb3BlKSB7XG4gICAgbGV0IHN0YXR1cyA9IHRydWVcbiAgICBpZiAoc2NvcGUgPT09ICdMaW5lJylcbiAgICAgIHN0YXR1cyA9IHRoaXMubWVzc2FnZS5jdXJyZW50TGluZVxuICAgIGVsc2UgaWYgKHNjb3BlID09PSAnRmlsZScpXG4gICAgICBzdGF0dXMgPSB0aGlzLm1lc3NhZ2UuY3VycmVudEZpbGVcblxuICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCAmJiB0aGlzLm1lc3NhZ2UuZmlsZVBhdGgpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5saW50ZXItbWVzc2FnZS1saW5rJylcbiAgICAgIGlmIChsaW5rKSB7XG4gICAgICAgIGlmIChzY29wZSA9PT0gJ1Byb2plY3QnKSB7XG4gICAgICAgICAgbGluay5xdWVyeVNlbGVjdG9yKCdzcGFuJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpbmsucXVlcnlTZWxlY3Rvcignc3BhbicpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgIH0gZWxzZSB0aGlzLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgfVxuICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5zaG93UHJvdmlkZXJOYW1lJykgJiYgdGhpcy5tZXNzYWdlLmxpbnRlcikge1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmdldE5hbWUodGhpcy5tZXNzYWdlKSlcbiAgICB9XG4gICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmdldFJpYmJvbih0aGlzLm1lc3NhZ2UpKVxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXRNZXNzYWdlKHRoaXMubWVzc2FnZSwgdGhpcy5pbmNsdWRlTGluaykpXG4gIH1cbiAgc3RhdGljIGdldExpbmsobWVzc2FnZSkge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgY29uc3QgcGF0aEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgbGV0IGRpc3BsYXlGaWxlID0gbWVzc2FnZS5maWxlUGF0aFxuXG4gICAgZWwuY2xhc3NOYW1lID0gJ2xpbnRlci1tZXNzYWdlLWxpbmsnXG5cbiAgICBmb3IgKGxldCBwYXRoIG9mIGF0b20ucHJvamVjdC5nZXRQYXRocygpKVxuICAgICAgaWYgKGRpc3BsYXlGaWxlLmluZGV4T2YocGF0aCkgPT09IDApIHtcbiAgICAgICAgZGlzcGxheUZpbGUgPSBkaXNwbGF5RmlsZS5zdWJzdHIocGF0aC5sZW5ndGggKyAxKSAvLyBQYXRoICsgUGF0aCBTZXBhcmF0b3JcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgIGlmIChtZXNzYWdlLnJhbmdlKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IGBhdCBsaW5lICR7bWVzc2FnZS5yYW5nZS5zdGFydC5yb3cgKyAxfSBjb2wgJHttZXNzYWdlLnJhbmdlLnN0YXJ0LmNvbHVtbiArIDF9YFxuICAgIH1cbiAgICBwYXRoRWwudGV4dENvbnRlbnQgPSAnIGluICcgKyBkaXNwbGF5RmlsZVxuICAgIGVsLmFwcGVuZENoaWxkKHBhdGhFbClcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihtZXNzYWdlLmZpbGVQYXRoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAobWVzc2FnZS5yYW5nZSkge1xuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihtZXNzYWdlLnJhbmdlLnN0YXJ0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGdldE1lc3NhZ2UobWVzc2FnZSwgaW5jbHVkZUxpbmspIHtcbiAgICBpZiAoXG4gICAgICBtZXNzYWdlLm11bHRpbGluZSB8fFxuICAgICAgKG1lc3NhZ2UuaHRtbCAmJiBtZXNzYWdlLmh0bWwubWF0Y2goTmV3TGluZSkpIHx8XG4gICAgICAobWVzc2FnZS50ZXh0ICYmIG1lc3NhZ2UudGV4dC5tYXRjaChOZXdMaW5lKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBNZXNzYWdlLmdldE11bHRpTGluZU1lc3NhZ2UobWVzc2FnZSwgaW5jbHVkZUxpbmspXG4gICAgfVxuXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBjb25zdCBtZXNzYWdlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcblxuICAgIGVsLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1pdGVtJ1xuXG4gICAgaWYgKGluY2x1ZGVMaW5rICYmIG1lc3NhZ2UuZmlsZVBhdGgpIHtcbiAgICAgIGVsLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TGluayhtZXNzYWdlKSlcbiAgICB9XG5cbiAgICBlbC5hcHBlbmRDaGlsZChtZXNzYWdlRWwpXG5cbiAgICBpZiAobWVzc2FnZS5odG1sICYmIHR5cGVvZiBtZXNzYWdlLmh0bWwgIT09ICdzdHJpbmcnKSB7XG4gICAgICBtZXNzYWdlRWwuYXBwZW5kQ2hpbGQobWVzc2FnZS5odG1sLmNsb25lTm9kZSh0cnVlKSlcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuaHRtbCkge1xuICAgICAgbWVzc2FnZUVsLmlubmVySFRNTCA9IG1lc3NhZ2UuaHRtbFxuICAgIH0gZWxzZSBpZiAobWVzc2FnZS50ZXh0KSB7XG4gICAgICBtZXNzYWdlRWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLnRleHRcbiAgICB9XG5cbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZ2V0TXVsdGlMaW5lTWVzc2FnZShtZXNzYWdlLCBpbmNsdWRlTGluaykge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1tdWx0aWxpbmUtbWVzc2FnZScpXG4gICAgY29uc3QgbWVzc2FnZVRleHQgPSBtZXNzYWdlLnRleHQgfHwgbWVzc2FnZS5odG1sXG4gICAgZm9yIChsZXQgbGluZSBvZiBtZXNzYWdlVGV4dC5zcGxpdChOZXdMaW5lKSkge1xuICAgICAgaWYgKCFsaW5lKSBjb250aW51ZVxuICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbWVzc2FnZS1saW5lJylcbiAgICAgIGVsLnRleHRDb250ZW50ID0gbGluZVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsKVxuICAgIH1cbiAgICBpZiAoaW5jbHVkZUxpbmsgJiYgbWVzc2FnZS5maWxlUGF0aCkge1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TGluayhtZXNzYWdlKSlcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRhaW5lclxuICB9XG4gIHN0YXRpYyBnZXROYW1lKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGVsLmNsYXNzTmFtZSA9IGBsaW50ZXItbWVzc2FnZS1pdGVtIGJhZGdlIGJhZGdlLWZsZXhpYmxlIGxpbnRlci1oaWdobGlnaHRgXG4gICAgZWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLmxpbnRlclxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBnZXRSaWJib24obWVzc2FnZSkge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgZWwuY2xhc3NOYW1lID0gYGxpbnRlci1tZXNzYWdlLWl0ZW0gYmFkZ2UgYmFkZ2UtZmxleGlibGUgbGludGVyLWhpZ2hsaWdodCAke21lc3NhZ2UuY2xhc3N9YFxuICAgIGVsLnRleHRDb250ZW50ID0gbWVzc2FnZS50eXBlXG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGZyb21NZXNzYWdlKG1lc3NhZ2UsIGluY2x1ZGVMaW5rKSB7XG4gICAgcmV0dXJuIG5ldyBNZXNzYWdlRWxlbWVudCgpLmluaXRpYWxpemUobWVzc2FnZSwgaW5jbHVkZUxpbmspXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE1lc3NhZ2VFbGVtZW50ID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItbWVzc2FnZScsIHtcbiAgcHJvdG90eXBlOiBNZXNzYWdlLnByb3RvdHlwZVxufSlcbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/ui/message-element.js

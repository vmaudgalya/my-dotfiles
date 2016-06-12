Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var EditorLinter = require('./editor-linter');

var EditorRegistry = (function () {
  function EditorRegistry() {
    _classCallCheck(this, EditorRegistry);

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();
    this.editorLinters = new Map();

    this.subscriptions.add(this.emitter);
  }

  _createClass(EditorRegistry, [{
    key: 'create',
    value: function create(textEditor) {
      var _this = this;

      var editorLinter = new EditorLinter(textEditor);
      this.editorLinters.set(textEditor, editorLinter);
      this.emitter.emit('observe', editorLinter);
      editorLinter.onDidDestroy(function () {
        return _this.editorLinters['delete'](textEditor);
      });
      return editorLinter;
    }
  }, {
    key: 'has',
    value: function has(textEditor) {
      return this.editorLinters.has(textEditor);
    }
  }, {
    key: 'forEach',
    value: function forEach(textEditor) {
      this.editorLinters.forEach(textEditor);
    }
  }, {
    key: 'ofPath',
    value: function ofPath(path) {
      for (var editorLinter of this.editorLinters) {
        if (editorLinter[0].getPath() === path) {
          return editorLinter[1];
        }
      }
    }
  }, {
    key: 'ofTextEditor',
    value: function ofTextEditor(textEditor) {
      return this.editorLinters.get(textEditor);
    }
  }, {
    key: 'ofActiveTextEditor',
    value: function ofActiveTextEditor() {
      return this.ofTextEditor(atom.workspace.getActiveTextEditor());
    }
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.forEach(callback);
      return this.emitter.on('observe', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.editorLinters.forEach(function (editorLinter) {
        editorLinter.dispose();
      });
      this.editorLinters.clear();
    }
  }]);

  return EditorRegistry;
})();

exports['default'] = EditorRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUUyQyxNQUFNOztBQUZqRCxXQUFXLENBQUE7O0FBR1gsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7O0lBRTFCLGNBQWM7QUFDdEIsV0FEUSxjQUFjLEdBQ25COzBCQURLLGNBQWM7O0FBRS9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFOUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQVBrQixjQUFjOztXQVMzQixnQkFBQyxVQUFVLEVBQUU7OztBQUNqQixVQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNqRCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDaEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBQzFDLGtCQUFZLENBQUMsWUFBWSxDQUFDO2VBQ3hCLE1BQUssYUFBYSxVQUFPLENBQUMsVUFBVSxDQUFDO09BQUEsQ0FDdEMsQ0FBQTtBQUNELGFBQU8sWUFBWSxDQUFBO0tBQ3BCOzs7V0FFRSxhQUFDLFVBQVUsRUFBRTtBQUNkLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDMUM7OztXQUVNLGlCQUFDLFVBQVUsRUFBRTtBQUNsQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUN2Qzs7O1dBRUssZ0JBQUMsSUFBSSxFQUFFO0FBQ1gsV0FBSyxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQzNDLFlBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtBQUN0QyxpQkFBTyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDdkI7T0FDRjtLQUNGOzs7V0FFVyxzQkFBQyxVQUFVLEVBQUU7QUFDdkIsYUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUMxQzs7O1dBRWlCLDhCQUFHO0FBQ25CLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQTtLQUMvRDs7O1dBRU0saUJBQUMsUUFBUSxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDdEIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDNUM7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFTLFlBQVksRUFBRTtBQUNoRCxvQkFBWSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3ZCLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDM0I7OztTQXREa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9lZGl0b3ItcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5jb25zdCBFZGl0b3JMaW50ZXIgPSByZXF1aXJlKCcuL2VkaXRvci1saW50ZXInKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0b3JSZWdpc3RyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lZGl0b3JMaW50ZXJzID0gbmV3IE1hcCgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuXG4gIGNyZWF0ZSh0ZXh0RWRpdG9yKSB7XG4gICAgY29uc3QgZWRpdG9yTGludGVyID0gbmV3IEVkaXRvckxpbnRlcih0ZXh0RWRpdG9yKVxuICAgIHRoaXMuZWRpdG9yTGludGVycy5zZXQodGV4dEVkaXRvciwgZWRpdG9yTGludGVyKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdvYnNlcnZlJywgZWRpdG9yTGludGVyKVxuICAgIGVkaXRvckxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT5cbiAgICAgIHRoaXMuZWRpdG9yTGludGVycy5kZWxldGUodGV4dEVkaXRvcilcbiAgICApXG4gICAgcmV0dXJuIGVkaXRvckxpbnRlclxuICB9XG5cbiAgaGFzKHRleHRFZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JMaW50ZXJzLmhhcyh0ZXh0RWRpdG9yKVxuICB9XG5cbiAgZm9yRWFjaCh0ZXh0RWRpdG9yKSB7XG4gICAgdGhpcy5lZGl0b3JMaW50ZXJzLmZvckVhY2godGV4dEVkaXRvcilcbiAgfVxuXG4gIG9mUGF0aChwYXRoKSB7XG4gICAgZm9yIChsZXQgZWRpdG9yTGludGVyIG9mIHRoaXMuZWRpdG9yTGludGVycykge1xuICAgICAgaWYgKGVkaXRvckxpbnRlclswXS5nZXRQYXRoKCkgPT09IHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIGVkaXRvckxpbnRlclsxXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9mVGV4dEVkaXRvcih0ZXh0RWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yTGludGVycy5nZXQodGV4dEVkaXRvcilcbiAgfVxuXG4gIG9mQWN0aXZlVGV4dEVkaXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5vZlRleHRFZGl0b3IoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICB9XG5cbiAgb2JzZXJ2ZShjYWxsYmFjaykge1xuICAgIHRoaXMuZm9yRWFjaChjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdvYnNlcnZlJywgY2FsbGJhY2spXG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLmVkaXRvckxpbnRlcnMuZm9yRWFjaChmdW5jdGlvbihlZGl0b3JMaW50ZXIpIHtcbiAgICAgIGVkaXRvckxpbnRlci5kaXNwb3NlKClcbiAgICB9KVxuICAgIHRoaXMuZWRpdG9yTGludGVycy5jbGVhcigpXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/editor-registry.js

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _indie = require('./indie');

var _indie2 = _interopRequireDefault(_indie);

'use babel';

var IndieRegistry = (function () {
  function IndieRegistry() {
    _classCallCheck(this, IndieRegistry);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();

    this.indieLinters = new Set();
    this.subscriptions.add(this.emitter);
  }

  _createClass(IndieRegistry, [{
    key: 'register',
    value: function register(linter) {
      var _this = this;

      _validate2['default'].linter(linter, true);
      var indieLinter = new _indie2['default'](linter);

      this.subscriptions.add(indieLinter);
      this.indieLinters.add(indieLinter);

      indieLinter.onDidDestroy(function () {
        _this.indieLinters['delete'](indieLinter);
      });
      indieLinter.onDidUpdateMessages(function (messages) {
        _this.emitter.emit('did-update-messages', { linter: indieLinter, messages: messages });
      });
      this.emit('observe', indieLinter);

      return indieLinter;
    }
  }, {
    key: 'has',
    value: function has(indieLinter) {
      return this.indieLinters.has(indieLinter);
    }
  }, {
    key: 'unregister',
    value: function unregister(indieLinter) {
      if (this.indieLinters.has(indieLinter)) {
        indieLinter.dispose();
      }
    }

    // Private method
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.indieLinters.forEach(callback);
      return this.emitter.on('observe', callback);
    }

    // Private method
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return IndieRegistry;
})();

exports['default'] = IndieRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaW5kaWUtcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7d0JBQzVCLFlBQVk7Ozs7cUJBQ2YsU0FBUzs7OztBQUozQixXQUFXLENBQUE7O0lBTVUsYUFBYTtBQUNyQixXQURRLGFBQWEsR0FDbEI7MEJBREssYUFBYTs7QUFFOUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7O0FBRTVCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM3QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7O2VBUGtCLGFBQWE7O1dBU3hCLGtCQUFDLE1BQU0sRUFBRTs7O0FBQ2YsNEJBQVMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUM3QixVQUFNLFdBQVcsR0FBRyx1QkFBVSxNQUFNLENBQUMsQ0FBQTs7QUFFckMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDbkMsVUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7O0FBRWxDLGlCQUFXLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDN0IsY0FBSyxZQUFZLFVBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtPQUN0QyxDQUFDLENBQUE7QUFDRixpQkFBVyxDQUFDLG1CQUFtQixDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQzFDLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBQyxDQUFDLENBQUE7T0FDMUUsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7O0FBRWpDLGFBQU8sV0FBVyxDQUFBO0tBQ25COzs7V0FDRSxhQUFDLFdBQVcsRUFBRTtBQUNmLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7S0FDMUM7OztXQUNTLG9CQUFDLFdBQVcsRUFBRTtBQUN0QixVQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ3RDLG1CQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDdEI7S0FDRjs7Ozs7V0FHTSxpQkFBQyxRQUFRLEVBQUU7QUFDaEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDbkMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDNUM7Ozs7O1dBRWtCLDZCQUFDLFFBQVEsRUFBRTtBQUM1QixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3hEOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQS9Da0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9pbmRpZS1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBWYWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IEluZGllIGZyb20gJy4vaW5kaWUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGllUmVnaXN0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuXG4gICAgdGhpcy5pbmRpZUxpbnRlcnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuXG4gIHJlZ2lzdGVyKGxpbnRlcikge1xuICAgIFZhbGlkYXRlLmxpbnRlcihsaW50ZXIsIHRydWUpXG4gICAgY29uc3QgaW5kaWVMaW50ZXIgPSBuZXcgSW5kaWUobGludGVyKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChpbmRpZUxpbnRlcilcbiAgICB0aGlzLmluZGllTGludGVycy5hZGQoaW5kaWVMaW50ZXIpXG5cbiAgICBpbmRpZUxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5pbmRpZUxpbnRlcnMuZGVsZXRlKGluZGllTGludGVyKVxuICAgIH0pXG4gICAgaW5kaWVMaW50ZXIub25EaWRVcGRhdGVNZXNzYWdlcyhtZXNzYWdlcyA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHtsaW50ZXI6IGluZGllTGludGVyLCBtZXNzYWdlc30pXG4gICAgfSlcbiAgICB0aGlzLmVtaXQoJ29ic2VydmUnLCBpbmRpZUxpbnRlcilcblxuICAgIHJldHVybiBpbmRpZUxpbnRlclxuICB9XG4gIGhhcyhpbmRpZUxpbnRlcikge1xuICAgIHJldHVybiB0aGlzLmluZGllTGludGVycy5oYXMoaW5kaWVMaW50ZXIpXG4gIH1cbiAgdW5yZWdpc3RlcihpbmRpZUxpbnRlcikge1xuICAgIGlmICh0aGlzLmluZGllTGludGVycy5oYXMoaW5kaWVMaW50ZXIpKSB7XG4gICAgICBpbmRpZUxpbnRlci5kaXNwb3NlKClcbiAgICB9XG4gIH1cblxuICAvLyBQcml2YXRlIG1ldGhvZFxuICBvYnNlcnZlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5pbmRpZUxpbnRlcnMuZm9yRWFjaChjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdvYnNlcnZlJywgY2FsbGJhY2spXG4gIH1cbiAgLy8gUHJpdmF0ZSBtZXRob2RcbiAgb25EaWRVcGRhdGVNZXNzYWdlcyhjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/indie-registry.js

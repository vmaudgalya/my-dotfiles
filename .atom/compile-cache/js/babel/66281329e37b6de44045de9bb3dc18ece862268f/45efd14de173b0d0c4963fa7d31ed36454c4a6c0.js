Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _atomUtils = require('atom-utils');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _decoratorsElement = require('./decorators/element');

var _decoratorsElement2 = _interopRequireDefault(_decoratorsElement);

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

/**
 * @access private
 */
'use babel';

var MinimapQuickSettingsElement = (function () {
  function MinimapQuickSettingsElement() {
    _classCallCheck(this, _MinimapQuickSettingsElement);
  }

  _createClass(MinimapQuickSettingsElement, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.buildContent();
    }
  }, {
    key: 'setModel',
    value: function setModel(minimap) {
      var _this = this;

      this.selectedItem = null;
      this.minimap = minimap;
      this.emitter = new _atom.Emitter();
      this.subscriptions = new _atom.CompositeDisposable();
      this.plugins = {};
      this.itemsActions = new WeakMap();

      var subs = this.subscriptions;

      subs.add(_main2['default'].onDidAddPlugin(function (_ref) {
        var name = _ref.name;
        var plugin = _ref.plugin;

        return _this.addItemFor(name, plugin);
      }));
      subs.add(_main2['default'].onDidRemovePlugin(function (_ref2) {
        var name = _ref2.name;
        var plugin = _ref2.plugin;

        return _this.removeItemFor(name, plugin);
      }));
      subs.add(_main2['default'].onDidActivatePlugin(function (_ref3) {
        var name = _ref3.name;
        var plugin = _ref3.plugin;

        return _this.activateItem(name, plugin);
      }));
      subs.add(_main2['default'].onDidDeactivatePlugin(function (_ref4) {
        var name = _ref4.name;
        var plugin = _ref4.plugin;

        return _this.deactivateItem(name, plugin);
      }));

      subs.add(atom.commands.add('minimap-quick-settings', {
        'core:move-up': function coreMoveUp() {
          _this.selectPreviousItem();
        },
        'core:move-down': function coreMoveDown() {
          _this.selectNextItem();
        },
        'core:move-left': function coreMoveLeft() {
          atom.config.set('minimap.displayMinimapOnLeft', true);
        },
        'core:move-right': function coreMoveRight() {
          atom.config.set('minimap.displayMinimapOnLeft', false);
        },
        'core:cancel': function coreCancel() {
          _this.destroy();
        },
        'core:confirm': function coreConfirm() {
          _this.toggleSelectedItem();
        }
      }));

      this.codeHighlights.classList.toggle('active', this.minimap.displayCodeHighlights);

      subs.add(this.subscribeTo(this.codeHighlights, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          atom.config.set('minimap.displayCodeHighlights', !_this.minimap.displayCodeHighlights);
        }
      }));

      this.itemsActions.set(this.codeHighlights, function () {
        atom.config.set('minimap.displayCodeHighlights', !_this.minimap.displayCodeHighlights);
      });

      subs.add(this.subscribeTo(this.absoluteMode, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          atom.config.set('minimap.absoluteMode', !atom.config.get('minimap.absoluteMode'));
        }
      }));

      this.itemsActions.set(this.absoluteMode, function () {
        atom.config.set('minimap.absoluteMode', !atom.config.get('minimap.absoluteMode'));
      });

      subs.add(this.subscribeTo(this.hiddenInput, {
        'focusout': function focusout(e) {
          _this.destroy();
        }
      }));

      subs.add(this.subscribeTo(this.onLeftButton, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          atom.config.set('minimap.displayMinimapOnLeft', true);
        }
      }));

      subs.add(this.subscribeTo(this.onRightButton, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          atom.config.set('minimap.displayMinimapOnLeft', false);
        }
      }));

      subs.add(atom.config.observe('minimap.displayCodeHighlights', function (bool) {
        _this.codeHighlights.classList.toggle('active', bool);
      }));

      subs.add(atom.config.observe('minimap.absoluteMode', function (bool) {
        _this.absoluteMode.classList.toggle('active', bool);
      }));

      subs.add(atom.config.observe('minimap.displayMinimapOnLeft', function (bool) {
        _this.onLeftButton.classList.toggle('selected', bool);
        _this.onRightButton.classList.toggle('selected', !bool);
      }));

      this.initList();
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'attach',
    value: function attach() {
      var workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.appendChild(this);
      this.hiddenInput.focus();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      this.parentNode.removeChild(this);
    }
  }, {
    key: 'initList',
    value: function initList() {
      this.itemsDisposables = new WeakMap();
      for (var _name in _main2['default'].plugins) {
        this.addItemFor(_name, _main2['default'].plugins[_name]);
      }
    }
  }, {
    key: 'toggleSelectedItem',
    value: function toggleSelectedItem() {
      var fn = this.itemsActions.get(this.selectedItem);
      if (typeof fn === 'function') {
        fn();
      }
    }
  }, {
    key: 'selectNextItem',
    value: function selectNextItem() {
      this.selectedItem.classList.remove('selected');
      if (this.selectedItem.nextSibling != null) {
        this.selectedItem = this.selectedItem.nextSibling;
        if (this.selectedItem.matches('.separator')) {
          this.selectedItem = this.selectedItem.nextSibling;
        }
      } else {
        this.selectedItem = this.list.firstChild;
      }
      this.selectedItem.classList.add('selected');
    }
  }, {
    key: 'selectPreviousItem',
    value: function selectPreviousItem() {
      this.selectedItem.classList.remove('selected');
      if (this.selectedItem.previousSibling != null) {
        this.selectedItem = this.selectedItem.previousSibling;
        if (this.selectedItem.matches('.separator')) {
          this.selectedItem = this.selectedItem.previousSibling;
        }
      } else {
        this.selectedItem = this.list.lastChild;
      }
      this.selectedItem.classList.add('selected');
    }
  }, {
    key: 'addItemFor',
    value: function addItemFor(name, plugin) {
      var item = document.createElement('li');
      var action = function action() {
        _main2['default'].togglePluginActivation(name);
      };

      if (plugin.isActive()) {
        item.classList.add('active');
      }

      item.textContent = name;

      this.itemsActions.set(item, action);
      this.itemsDisposables.set(item, this.addDisposableEventListener(item, 'mousedown', function (e) {
        e.preventDefault();
        action();
      }));

      this.plugins[name] = item;
      this.list.insertBefore(item, this.separator);

      if (!(this.selectedItem != null)) {
        this.selectedItem = item;
        this.selectedItem.classList.add('selected');
      }
    }
  }, {
    key: 'removeItemFor',
    value: function removeItemFor(name, plugin) {
      try {
        this.list.removeChild(this.plugins[name]);
      } catch (error) {}

      delete this.plugins[name];
    }
  }, {
    key: 'activateItem',
    value: function activateItem(name, plugin) {
      this.plugins[name].classList.add('active');
    }
  }, {
    key: 'deactivateItem',
    value: function deactivateItem(name, plugin) {
      this.plugins[name].classList.remove('active');
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this2 = this;

      this.div({ 'class': 'select-list popover-list minimap-quick-settings' }, function () {
        _this2.input({ type: 'text', 'class': 'hidden-input', outlet: 'hiddenInput' });
        _this2.ol({ 'class': 'list-group mark-active', outlet: 'list' }, function () {
          _this2.li({ 'class': 'separator', outlet: 'separator' });
          _this2.li({ 'class': 'code-highlights', outlet: 'codeHighlights' }, 'code-highlights');
          _this2.li({ 'class': 'absolute-mode', outlet: 'absoluteMode' }, 'absolute-mode');
        });
        _this2.div({ 'class': 'btn-group' }, function () {
          _this2.button({ 'class': 'btn btn-default', outlet: 'onLeftButton' }, 'On Left');
          _this2.button({ 'class': 'btn btn-default', outlet: 'onRightButton' }, 'On Right');
        });
      });
    }
  }]);

  var _MinimapQuickSettingsElement = MinimapQuickSettingsElement;
  MinimapQuickSettingsElement = (0, _decoratorsInclude2['default'])(_atomUtils.EventsDelegation, _atomUtils.SpacePenDSL.Babel)(MinimapQuickSettingsElement) || MinimapQuickSettingsElement;
  MinimapQuickSettingsElement = (0, _decoratorsElement2['default'])('minimap-quick-settings')(MinimapQuickSettingsElement) || MinimapQuickSettingsElement;
  return MinimapQuickSettingsElement;
})();

exports['default'] = MinimapQuickSettingsElement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAtcXVpY2stc2V0dGluZ3MtZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUUyQyxNQUFNOzt5QkFDTCxZQUFZOztvQkFFdkMsUUFBUTs7OztpQ0FDTCxzQkFBc0I7Ozs7aUNBQ3RCLHNCQUFzQjs7Ozs7OztBQVAxQyxXQUFXLENBQUE7O0lBY1UsMkJBQTJCO1dBQTNCLDJCQUEyQjs7OztlQUEzQiwyQkFBMkI7O1dBaUI5QiwyQkFBRztBQUNqQixVQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7S0FDcEI7OztXQUVRLGtCQUFDLE9BQU8sRUFBRTs7O0FBQ2pCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO0FBQ3hCLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixVQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFVBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO0FBQ2pCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQTs7QUFFakMsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQTs7QUFFN0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBSyxjQUFjLENBQUMsVUFBQyxJQUFjLEVBQUs7WUFBbEIsSUFBSSxHQUFMLElBQWMsQ0FBYixJQUFJO1lBQUUsTUFBTSxHQUFiLElBQWMsQ0FBUCxNQUFNOztBQUN6QyxlQUFPLE1BQUssVUFBVSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtPQUNyQyxDQUFDLENBQUMsQ0FBQTtBQUNILFVBQUksQ0FBQyxHQUFHLENBQUMsa0JBQUssaUJBQWlCLENBQUMsVUFBQyxLQUFjLEVBQUs7WUFBbEIsSUFBSSxHQUFMLEtBQWMsQ0FBYixJQUFJ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QUFDLEVBQUMsU0FBTyxXQUFXLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUE7QUFDbEQsaUJBQUssRUFBRSxDQUFDLEVBQUMsU0FBTyxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFBO0FBQ2hGLGlCQUFLLEVBQUUsQ0FBQyxFQUFDLFNBQU8sZUFBZSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQTtTQUMzRSxDQUFDLENBQUE7QUFDRixlQUFLLEdBQUcsQ0FBQyxFQUFDLFNBQU8sV0FBVyxFQUFDLEVBQUUsWUFBTTtBQUNuQyxpQkFBSyxNQUFNLENBQUMsRUFBQyxTQUFPLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUMxRSxpQkFBSyxNQUFNLENBQUMsRUFBQyxTQUFPLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQTtTQUM3RSxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSDs7O3FDQWZrQiwyQkFBMkI7QUFBM0IsNkJBQTJCLEdBRC9DLGlFQUEwQix1QkFBWSxLQUFLLENBQUMsQ0FDeEIsMkJBQTJCLEtBQTNCLDJCQUEyQjtBQUEzQiw2QkFBMkIsR0FGL0Msb0NBQVEsd0JBQXdCLENBQUMsQ0FFYiwyQkFBMkIsS0FBM0IsMkJBQTJCO1NBQTNCLDJCQUEyQjs7O3FCQUEzQiwyQkFBMkIiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC1xdWljay1zZXR0aW5ncy1lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtFdmVudHNEZWxlZ2F0aW9uLCBTcGFjZVBlbkRTTH0gZnJvbSAnYXRvbS11dGlscydcblxuaW1wb3J0IE1haW4gZnJvbSAnLi9tYWluJ1xuaW1wb3J0IGVsZW1lbnQgZnJvbSAnLi9kZWNvcmF0b3JzL2VsZW1lbnQnXG5pbXBvcnQgaW5jbHVkZSBmcm9tICcuL2RlY29yYXRvcnMvaW5jbHVkZSdcblxuLyoqXG4gKiBAYWNjZXNzIHByaXZhdGVcbiAqL1xuQGVsZW1lbnQoJ21pbmltYXAtcXVpY2stc2V0dGluZ3MnKVxuQGluY2x1ZGUoRXZlbnRzRGVsZWdhdGlvbiwgU3BhY2VQZW5EU0wuQmFiZWwpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaW5pbWFwUXVpY2tTZXR0aW5nc0VsZW1lbnQge1xuXG4gIHN0YXRpYyBjb250ZW50ICgpIHtcbiAgICB0aGlzLmRpdih7Y2xhc3M6ICdzZWxlY3QtbGlzdCBwb3BvdmVyLWxpc3QgbWluaW1hcC1xdWljay1zZXR0aW5ncyd9LCAoKSA9PiB7XG4gICAgICB0aGlzLmlucHV0KHt0eXBlOiAndGV4dCcsIGNsYXNzOiAnaGlkZGVuLWlucHV0Jywgb3V0bGV0OiAnaGlkZGVuSW5wdXQnfSlcbiAgICAgIHRoaXMub2woe2NsYXNzOiAnbGlzdC1ncm91cCBtYXJrLWFjdGl2ZScsIG91dGxldDogJ2xpc3QnfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmxpKHtjbGFzczogJ3NlcGFyYXRvcicsIG91dGxldDogJ3NlcGFyYXRvcid9KVxuICAgICAgICB0aGlzLmxpKHtjbGFzczogJ2NvZGUtaGlnaGxpZ2h0cycsIG91dGxldDogJ2NvZGVIaWdobGlnaHRzJ30sICdjb2RlLWhpZ2hsaWdodHMnKVxuICAgICAgICB0aGlzLmxpKHtjbGFzczogJ2Fic29sdXRlLW1vZGUnLCBvdXRsZXQ6ICdhYnNvbHV0ZU1vZGUnfSwgJ2Fic29sdXRlLW1vZGUnKVxuICAgICAgfSlcbiAgICAgIHRoaXMuZGl2KHtjbGFzczogJ2J0bi1ncm91cCd9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnV0dG9uKHtjbGFzczogJ2J0biBidG4tZGVmYXVsdCcsIG91dGxldDogJ29uTGVmdEJ1dHRvbid9LCAnT24gTGVmdCcpXG4gICAgICAgIHRoaXMuYnV0dG9uKHtjbGFzczogJ2J0biBidG4tZGVmYXVsdCcsIG91dGxldDogJ29uUmlnaHRCdXR0b24nfSwgJ09uIFJpZ2h0JylcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZWRDYWxsYmFjayAoKSB7XG4gICAgdGhpcy5idWlsZENvbnRlbnQoKVxuICB9XG5cbiAgc2V0TW9kZWwgKG1pbmltYXApIHtcbiAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IG51bGxcbiAgICB0aGlzLm1pbmltYXAgPSBtaW5pbWFwXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnBsdWdpbnMgPSB7fVxuICAgIHRoaXMuaXRlbXNBY3Rpb25zID0gbmV3IFdlYWtNYXAoKVxuXG4gICAgbGV0IHN1YnMgPSB0aGlzLnN1YnNjcmlwdGlvbnNcblxuICAgIHN1YnMuYWRkKE1haW4ub25EaWRBZGRQbHVnaW4oKHtuYW1lLCBwbHVnaW59KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRJdGVtRm9yKG5hbWUsIHBsdWdpbilcbiAgICB9KSlcbiAgICBzdWJzLmFkZChNYWluLm9uRGlkUmVtb3ZlUGx1Z2luKCh7bmFtZSwgcGx1Z2lufSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlSXRlbUZvcihuYW1lLCBwbHVnaW4pXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoTWFpbi5vbkRpZEFjdGl2YXRlUGx1Z2luKCh7bmFtZSwgcGx1Z2lufSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVJdGVtKG5hbWUsIHBsdWdpbilcbiAgICB9KSlcbiAgICBzdWJzLmFkZChNYWluLm9uRGlkRGVhY3RpdmF0ZVBsdWdpbigoe25hbWUsIHBsdWdpbn0pID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmRlYWN0aXZhdGVJdGVtKG5hbWUsIHBsdWdpbilcbiAgICB9KSlcblxuICAgIHN1YnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdtaW5pbWFwLXF1aWNrLXNldHRpbmdzJywge1xuICAgICAgJ2NvcmU6bW92ZS11cCc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3RQcmV2aW91c0l0ZW0oKVxuICAgICAgfSxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6ICgpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3ROZXh0SXRlbSgpXG4gICAgICB9LFxuICAgICAgJ2NvcmU6bW92ZS1sZWZ0JzogKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuZGlzcGxheU1pbmltYXBPbkxlZnQnLCB0cnVlKVxuICAgICAgfSxcbiAgICAgICdjb3JlOm1vdmUtcmlnaHQnOiAoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5kaXNwbGF5TWluaW1hcE9uTGVmdCcsIGZhbHNlKVxuICAgICAgfSxcbiAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5kZXN0cm95KClcbiAgICAgIH0sXG4gICAgICAnY29yZTpjb25maXJtJzogKCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZVNlbGVjdGVkSXRlbSgpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICB0aGlzLmNvZGVIaWdobGlnaHRzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsIHRoaXMubWluaW1hcC5kaXNwbGF5Q29kZUhpZ2hsaWdodHMpXG5cbiAgICBzdWJzLmFkZCh0aGlzLnN1YnNjcmliZVRvKHRoaXMuY29kZUhpZ2hsaWdodHMsIHtcbiAgICAgICdtb3VzZWRvd24nOiAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmRpc3BsYXlDb2RlSGlnaGxpZ2h0cycsICF0aGlzLm1pbmltYXAuZGlzcGxheUNvZGVIaWdobGlnaHRzKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5pdGVtc0FjdGlvbnMuc2V0KHRoaXMuY29kZUhpZ2hsaWdodHMsICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5kaXNwbGF5Q29kZUhpZ2hsaWdodHMnLCAhdGhpcy5taW5pbWFwLmRpc3BsYXlDb2RlSGlnaGxpZ2h0cylcbiAgICB9KVxuXG4gICAgc3Vicy5hZGQodGhpcy5zdWJzY3JpYmVUbyh0aGlzLmFic29sdXRlTW9kZSwge1xuICAgICAgJ21vdXNlZG93bic6IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuYWJzb2x1dGVNb2RlJywgIWF0b20uY29uZmlnLmdldCgnbWluaW1hcC5hYnNvbHV0ZU1vZGUnKSlcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHRoaXMuaXRlbXNBY3Rpb25zLnNldCh0aGlzLmFic29sdXRlTW9kZSwgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmFic29sdXRlTW9kZScsICFhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAuYWJzb2x1dGVNb2RlJykpXG4gICAgfSlcblxuICAgIHN1YnMuYWRkKHRoaXMuc3Vic2NyaWJlVG8odGhpcy5oaWRkZW5JbnB1dCwge1xuICAgICAgJ2ZvY3Vzb3V0JzogKGUpID0+IHsgdGhpcy5kZXN0cm95KCkgfVxuICAgIH0pKVxuXG4gICAgc3Vicy5hZGQodGhpcy5zdWJzY3JpYmVUbyh0aGlzLm9uTGVmdEJ1dHRvbiwge1xuICAgICAgJ21vdXNlZG93bic6IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuZGlzcGxheU1pbmltYXBPbkxlZnQnLCB0cnVlKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgc3Vicy5hZGQodGhpcy5zdWJzY3JpYmVUbyh0aGlzLm9uUmlnaHRCdXR0b24sIHtcbiAgICAgICdtb3VzZWRvd24nOiAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmRpc3BsYXlNaW5pbWFwT25MZWZ0JywgZmFsc2UpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdtaW5pbWFwLmRpc3BsYXlDb2RlSGlnaGxpZ2h0cycsIChib29sKSA9PiB7XG4gICAgICB0aGlzLmNvZGVIaWdobGlnaHRzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsIGJvb2wpXG4gICAgfSkpXG5cbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdtaW5pbWFwLmFic29sdXRlTW9kZScsIChib29sKSA9PiB7XG4gICAgICB0aGlzLmFic29sdXRlTW9kZS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBib29sKVxuICAgIH0pKVxuXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5kaXNwbGF5TWluaW1hcE9uTGVmdCcsIChib29sKSA9PiB7XG4gICAgICB0aGlzLm9uTGVmdEJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKCdzZWxlY3RlZCcsIGJvb2wpXG4gICAgICB0aGlzLm9uUmlnaHRCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZSgnc2VsZWN0ZWQnLCAhYm9vbClcbiAgICB9KSlcblxuICAgIHRoaXMuaW5pdExpc3QoKVxuICB9XG5cbiAgb25EaWREZXN0cm95IChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cblxuICBhdHRhY2ggKCkge1xuICAgIGxldCB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIHdvcmtzcGFjZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcylcbiAgICB0aGlzLmhpZGRlbklucHV0LmZvY3VzKClcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKVxuICB9XG5cbiAgaW5pdExpc3QgKCkge1xuICAgIHRoaXMuaXRlbXNEaXNwb3NhYmxlcyA9IG5ldyBXZWFrTWFwKClcbiAgICBmb3IgKGxldCBuYW1lIGluIE1haW4ucGx1Z2lucykge1xuICAgICAgdGhpcy5hZGRJdGVtRm9yKG5hbWUsIE1haW4ucGx1Z2luc1tuYW1lXSlcbiAgICB9XG4gIH1cblxuICB0b2dnbGVTZWxlY3RlZEl0ZW0gKCkge1xuICAgIGxldCBmbiA9IHRoaXMuaXRlbXNBY3Rpb25zLmdldCh0aGlzLnNlbGVjdGVkSXRlbSlcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7IGZuKCkgfVxuICB9XG5cbiAgc2VsZWN0TmV4dEl0ZW0gKCkge1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICBpZiAoKHRoaXMuc2VsZWN0ZWRJdGVtLm5leHRTaWJsaW5nICE9IG51bGwpKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IHRoaXMuc2VsZWN0ZWRJdGVtLm5leHRTaWJsaW5nXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEl0ZW0ubWF0Y2hlcygnLnNlcGFyYXRvcicpKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gdGhpcy5zZWxlY3RlZEl0ZW0ubmV4dFNpYmxpbmdcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSB0aGlzLmxpc3QuZmlyc3RDaGlsZFxuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkSXRlbS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gIH1cblxuICBzZWxlY3RQcmV2aW91c0l0ZW0gKCkge1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICBpZiAoKHRoaXMuc2VsZWN0ZWRJdGVtLnByZXZpb3VzU2libGluZyAhPSBudWxsKSkge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSB0aGlzLnNlbGVjdGVkSXRlbS5wcmV2aW91c1NpYmxpbmdcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkSXRlbS5tYXRjaGVzKCcuc2VwYXJhdG9yJykpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSB0aGlzLnNlbGVjdGVkSXRlbS5wcmV2aW91c1NpYmxpbmdcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSB0aGlzLmxpc3QubGFzdENoaWxkXG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgfVxuXG4gIGFkZEl0ZW1Gb3IgKG5hbWUsIHBsdWdpbikge1xuICAgIGxldCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgIGxldCBhY3Rpb24gPSAoKSA9PiB7IE1haW4udG9nZ2xlUGx1Z2luQWN0aXZhdGlvbihuYW1lKSB9XG5cbiAgICBpZiAocGx1Z2luLmlzQWN0aXZlKCkpIHsgaXRlbS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSB9XG5cbiAgICBpdGVtLnRleHRDb250ZW50ID0gbmFtZVxuXG4gICAgdGhpcy5pdGVtc0FjdGlvbnMuc2V0KGl0ZW0sIGFjdGlvbilcbiAgICB0aGlzLml0ZW1zRGlzcG9zYWJsZXMuc2V0KGl0ZW0sIHRoaXMuYWRkRGlzcG9zYWJsZUV2ZW50TGlzdGVuZXIoaXRlbSwgJ21vdXNlZG93bicsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGFjdGlvbigpXG4gICAgfSkpXG5cbiAgICB0aGlzLnBsdWdpbnNbbmFtZV0gPSBpdGVtXG4gICAgdGhpcy5saXN0Lmluc2VydEJlZm9yZShpdGVtLCB0aGlzLnNlcGFyYXRvcilcblxuICAgIGlmICghKHRoaXMuc2VsZWN0ZWRJdGVtICE9IG51bGwpKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IGl0ZW1cbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgICB9XG4gIH1cblxuICByZW1vdmVJdGVtRm9yIChuYW1lLCBwbHVnaW4pIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5saXN0LnJlbW92ZUNoaWxkKHRoaXMucGx1Z2luc1tuYW1lXSlcbiAgICB9IGNhdGNoIChlcnJvcikge31cblxuICAgIGRlbGV0ZSB0aGlzLnBsdWdpbnNbbmFtZV1cbiAgfVxuXG4gIGFjdGl2YXRlSXRlbSAobmFtZSwgcGx1Z2luKSB7XG4gICAgdGhpcy5wbHVnaW5zW25hbWVdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gIH1cblxuICBkZWFjdGl2YXRlSXRlbSAobmFtZSwgcGx1Z2luKSB7XG4gICAgdGhpcy5wbHVnaW5zW25hbWVdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap-quick-settings-element.js

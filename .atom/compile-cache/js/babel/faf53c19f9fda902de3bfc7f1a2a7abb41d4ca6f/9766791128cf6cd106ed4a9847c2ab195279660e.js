Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mixto = require('mixto');

var _mixto2 = _interopRequireDefault(_mixto);

var _atom = require('atom');

/**
 * Provides methods to manage minimap plugins.
 * Minimap plugins are Atom packages that will augment the minimap.
 * They have a secondary activation cycle going on constrained by the minimap
 * package activation. A minimap plugin life cycle will generally look
 * like this:
 *
 * 1. The plugin module is activated by Atom through the `activate` method
 * 2. The plugin then register itself as a minimap plugin using `registerPlugin`
 * 3. The plugin is activated/deactivated according to the minimap settings.
 * 4. On the plugin module deactivation, the plugin must unregisters itself
 *    from the minimap using the `unregisterPlugin`.
 *
 * @access public
 */
'use babel';

var PluginManagement = (function (_Mixin) {
  _inherits(PluginManagement, _Mixin);

  function PluginManagement() {
    _classCallCheck(this, PluginManagement);

    _get(Object.getPrototypeOf(PluginManagement.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PluginManagement, [{
    key: 'provideMinimapServiceV1',

    /**
     * Returns the Minimap main module instance.
     *
     * @return {Main} The Minimap main module instance.
     */
    value: function provideMinimapServiceV1() {
      return this;
    }

    /**
     * Initializes the properties for plugins' management.
     *
     * @access private
     */
  }, {
    key: 'initializePlugins',
    value: function initializePlugins() {
      /**
       * The registered Minimap plugins stored using their name as key.
       *
       * @type {Object}
       * @access private
       */
      this.plugins = {};
      /**
       * The plugins' subscriptions stored using the plugin names as keys.
       *
       * @type {Object}
       * @access private
       */
      this.pluginsSubscriptions = {};
    }

    /**
     * Registers a minimap `plugin` with the given `name`.
     *
     * @param {string} name The identifying name of the plugin.
     *                      It will be used as activation settings name
     *                      as well as the key to unregister the module.
     * @param {MinimapPlugin} plugin The plugin to register.
     * @emits {did-add-plugin} with the name and a reference to the added plugin.
     * @emits {did-activate-plugin} if the plugin was activated during
     *                              the registration.
     */
  }, {
    key: 'registerPlugin',
    value: function registerPlugin(name, plugin) {
      this.plugins[name] = plugin;
      this.pluginsSubscriptions[name] = new _atom.CompositeDisposable();

      var event = { name: name, plugin: plugin };
      this.emitter.emit('did-add-plugin', event);

      if (atom.config.get('minimap.displayPluginsControls')) {
        this.registerPluginControls(name, plugin);
      }

      this.updatesPluginActivationState(name);
    }

    /**
     * Unregisters a plugin from the minimap.
     *
     * @param {string} name The identifying name of the plugin to unregister.
     * @emits {did-remove-plugin} with the name and a reference
     *        to the added plugin.
     */
  }, {
    key: 'unregisterPlugin',
    value: function unregisterPlugin(name) {
      var plugin = this.plugins[name];

      if (atom.config.get('minimap.displayPluginsControls')) {
        this.unregisterPluginControls(name);
      }

      delete this.plugins[name];

      var event = { name: name, plugin: plugin };
      this.emitter.emit('did-remove-plugin', event);
    }

    /**
     * Toggles the specified plugin activation state.
     *
     * @param  {string} name     The name of the plugin.
     * @param  {boolean} boolean An optional boolean to set the activation
     *                           state of the plugin. If ommitted the new plugin
     *                           state will be the the inverse of its current
     *                           state.
     * @emits {did-activate-plugin} if the plugin was activated by the call.
     * @emits {did-deactivate-plugin} if the plugin was deactivated by the call.
     */
  }, {
    key: 'togglePluginActivation',
    value: function togglePluginActivation(name, boolean) {
      var settingsKey = 'minimap.plugins.' + name;

      if (boolean !== undefined && boolean !== null) {
        atom.config.set(settingsKey, boolean);
      } else {
        atom.config.set(settingsKey, !atom.config.get(settingsKey));
      }

      this.updatesPluginActivationState(name);
    }

    /**
     * Deactivates all the plugins registered in the minimap package so far.
     *
     * @emits {did-deactivate-plugin} for each plugin deactivated by the call.
     */
  }, {
    key: 'deactivateAllPlugins',
    value: function deactivateAllPlugins() {
      for (var _ref3 of this.eachPlugin()) {
        var _ref2 = _slicedToArray(_ref3, 2);

        var _name = _ref2[0];
        var plugin = _ref2[1];

        plugin.deactivatePlugin();
        this.emitter.emit('did-deactivate-plugin', { name: _name, plugin: plugin });
      }
    }

    /**
     * A generator function to iterate over registered plugins.
     *
     * @return An iterable that yield the name and reference to every plugin
     *         as an array in each iteration.
     */
  }, {
    key: 'eachPlugin',
    value: function* eachPlugin() {
      for (var _name2 in this.plugins) {
        yield [_name2, this.plugins[_name2]];
      }
    }

    /**
     * Updates the plugin activation state according to the current config.
     *
     * @param {string} name The identifying name of the plugin to update.
     * @emits {did-activate-plugin} if the plugin was activated by the call.
     * @emits {did-deactivate-plugin} if the plugin was deactivated by the call.
     * @access private
     */
  }, {
    key: 'updatesPluginActivationState',
    value: function updatesPluginActivationState(name) {
      var plugin = this.plugins[name];
      var pluginActive = plugin.isActive();
      var settingActive = atom.config.get('minimap.plugins.' + name);
      var event = { name: name, plugin: plugin };

      if (settingActive && !pluginActive) {
        plugin.activatePlugin();
        this.emitter.emit('did-activate-plugin', event);
      } else if (pluginActive && !settingActive) {
        plugin.deactivatePlugin();
        this.emitter.emit('did-deactivate-plugin', event);
      }
    }

    /**
     * When the `minimap.displayPluginsControls` setting is toggled,
     * this function will register the commands and setting to manage the plugin
     * activation from the minimap settings.
     *
     * @param {string} name The identifying name of the plugin.
     * @param {MinimapPlugin} plugin The plugin instance to register
     *        controls for.
     * @listens {minimap.plugins.${name}} listen to the setting to update
     *          the plugin state accordingly.
     * @listens {minimap:toggle-${name}} listen to the command on `atom-workspace`
     *          to toggle the plugin state.
     * @access private
     */
  }, {
    key: 'registerPluginControls',
    value: function registerPluginControls(name, plugin) {
      var _this = this;

      var settingsKey = 'minimap.plugins.' + name;

      this.config.plugins.properties[name] = {
        type: 'boolean',
        'default': true
      };

      if (atom.config.get(settingsKey) === undefined) {
        atom.config.set(settingsKey, true);
      }

      this.pluginsSubscriptions[name].add(atom.config.observe(settingsKey, function () {
        _this.updatesPluginActivationState(name);
      }));

      this.pluginsSubscriptions[name].add(atom.commands.add('atom-workspace', _defineProperty({}, 'minimap:toggle-' + name, function () {
        _this.togglePluginActivation(name);
      })));
    }

    /**
     * When the `minimap.displayPluginsControls` setting is toggled,
     * this function will unregister the commands and setting that
     * was created previously.
     *
     * @param {string} name The identifying name of the plugin.
     * @access private
     */
  }, {
    key: 'unregisterPluginControls',
    value: function unregisterPluginControls(name) {
      this.pluginsSubscriptions[name].dispose();
      delete this.pluginsSubscriptions[name];
      delete this.config.plugins.properties[name];
    }
  }]);

  return PluginManagement;
})(_mixto2['default']);

exports['default'] = PluginManagement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21peGlucy9wbHVnaW4tbWFuYWdlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7b0JBQ1csTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFIMUMsV0FBVyxDQUFBOztJQW9CVSxnQkFBZ0I7WUFBaEIsZ0JBQWdCOztXQUFoQixnQkFBZ0I7MEJBQWhCLGdCQUFnQjs7K0JBQWhCLGdCQUFnQjs7O2VBQWhCLGdCQUFnQjs7Ozs7Ozs7V0FNWCxtQ0FBRztBQUFFLGFBQU8sSUFBSSxDQUFBO0tBQUU7Ozs7Ozs7OztXQU94Qiw2QkFBRzs7Ozs7OztBQU9uQixVQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTs7Ozs7OztBQU9qQixVQUFJLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFBO0tBQy9COzs7Ozs7Ozs7Ozs7Ozs7V0FhYyx3QkFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQzVCLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFBO0FBQzNCLFVBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRywrQkFBeUIsQ0FBQTs7QUFFM0QsVUFBSSxLQUFLLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQTtBQUMxQyxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQTs7QUFFMUMsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxFQUFFO0FBQ3JELFlBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7T0FDMUM7O0FBRUQsVUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3hDOzs7Ozs7Ozs7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QUFJLENBQUMsR0FBRztBQUNyQyxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLElBQUk7T0FDZCxDQUFBOztBQUVELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQzlDLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUNuQzs7QUFFRCxVQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxZQUFNO0FBQ3pFLGNBQUssNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDeEMsQ0FBQyxDQUFDLENBQUE7O0FBRUgsVUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsMENBQ2pELElBQUksRUFBSyxZQUFNO0FBQ2hDLGNBQUssc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDbEMsRUFDRCxDQUFDLENBQUE7S0FDSjs7Ozs7Ozs7Ozs7O1dBVXdCLGtDQUFDLElBQUksRUFBRTtBQUM5QixVQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDekMsYUFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdEMsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDNUM7OztTQWxNa0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiIvVXNlcnMvdm1hdWRnYWx5YS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taXhpbnMvcGx1Z2luLW1hbmFnZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgTWl4aW4gZnJvbSAnbWl4dG8nXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuLyoqXG4gKiBQcm92aWRlcyBtZXRob2RzIHRvIG1hbmFnZSBtaW5pbWFwIHBsdWdpbnMuXG4gKiBNaW5pbWFwIHBsdWdpbnMgYXJlIEF0b20gcGFja2FnZXMgdGhhdCB3aWxsIGF1Z21lbnQgdGhlIG1pbmltYXAuXG4gKiBUaGV5IGhhdmUgYSBzZWNvbmRhcnkgYWN0aXZhdGlvbiBjeWNsZSBnb2luZyBvbiBjb25zdHJhaW5lZCBieSB0aGUgbWluaW1hcFxuICogcGFja2FnZSBhY3RpdmF0aW9uLiBBIG1pbmltYXAgcGx1Z2luIGxpZmUgY3ljbGUgd2lsbCBnZW5lcmFsbHkgbG9va1xuICogbGlrZSB0aGlzOlxuICpcbiAqIDEuIFRoZSBwbHVnaW4gbW9kdWxlIGlzIGFjdGl2YXRlZCBieSBBdG9tIHRocm91Z2ggdGhlIGBhY3RpdmF0ZWAgbWV0aG9kXG4gKiAyLiBUaGUgcGx1Z2luIHRoZW4gcmVnaXN0ZXIgaXRzZWxmIGFzIGEgbWluaW1hcCBwbHVnaW4gdXNpbmcgYHJlZ2lzdGVyUGx1Z2luYFxuICogMy4gVGhlIHBsdWdpbiBpcyBhY3RpdmF0ZWQvZGVhY3RpdmF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBtaW5pbWFwIHNldHRpbmdzLlxuICogNC4gT24gdGhlIHBsdWdpbiBtb2R1bGUgZGVhY3RpdmF0aW9uLCB0aGUgcGx1Z2luIG11c3QgdW5yZWdpc3RlcnMgaXRzZWxmXG4gKiAgICBmcm9tIHRoZSBtaW5pbWFwIHVzaW5nIHRoZSBgdW5yZWdpc3RlclBsdWdpbmAuXG4gKlxuICogQGFjY2VzcyBwdWJsaWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGx1Z2luTWFuYWdlbWVudCBleHRlbmRzIE1peGluIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIE1pbmltYXAgbWFpbiBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEByZXR1cm4ge01haW59IFRoZSBNaW5pbWFwIG1haW4gbW9kdWxlIGluc3RhbmNlLlxuICAgKi9cbiAgcHJvdmlkZU1pbmltYXBTZXJ2aWNlVjEgKCkgeyByZXR1cm4gdGhpcyB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBwcm9wZXJ0aWVzIGZvciBwbHVnaW5zJyBtYW5hZ2VtZW50LlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGluaXRpYWxpemVQbHVnaW5zICgpIHtcbiAgICAvKipcbiAgICAgKiBUaGUgcmVnaXN0ZXJlZCBNaW5pbWFwIHBsdWdpbnMgc3RvcmVkIHVzaW5nIHRoZWlyIG5hbWUgYXMga2V5LlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnBsdWdpbnMgPSB7fVxuICAgIC8qKlxuICAgICAqIFRoZSBwbHVnaW5zJyBzdWJzY3JpcHRpb25zIHN0b3JlZCB1c2luZyB0aGUgcGx1Z2luIG5hbWVzIGFzIGtleXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucGx1Z2luc1N1YnNjcmlwdGlvbnMgPSB7fVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIG1pbmltYXAgYHBsdWdpbmAgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgaWRlbnRpZnlpbmcgbmFtZSBvZiB0aGUgcGx1Z2luLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICBJdCB3aWxsIGJlIHVzZWQgYXMgYWN0aXZhdGlvbiBzZXR0aW5ncyBuYW1lXG4gICAqICAgICAgICAgICAgICAgICAgICAgIGFzIHdlbGwgYXMgdGhlIGtleSB0byB1bnJlZ2lzdGVyIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7TWluaW1hcFBsdWdpbn0gcGx1Z2luIFRoZSBwbHVnaW4gdG8gcmVnaXN0ZXIuXG4gICAqIEBlbWl0cyB7ZGlkLWFkZC1wbHVnaW59IHdpdGggdGhlIG5hbWUgYW5kIGEgcmVmZXJlbmNlIHRvIHRoZSBhZGRlZCBwbHVnaW4uXG4gICAqIEBlbWl0cyB7ZGlkLWFjdGl2YXRlLXBsdWdpbn0gaWYgdGhlIHBsdWdpbiB3YXMgYWN0aXZhdGVkIGR1cmluZ1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByZWdpc3RyYXRpb24uXG4gICAqL1xuICByZWdpc3RlclBsdWdpbiAobmFtZSwgcGx1Z2luKSB7XG4gICAgdGhpcy5wbHVnaW5zW25hbWVdID0gcGx1Z2luXG4gICAgdGhpcy5wbHVnaW5zU3Vic2NyaXB0aW9uc1tuYW1lXSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIGxldCBldmVudCA9IHsgbmFtZTogbmFtZSwgcGx1Z2luOiBwbHVnaW4gfVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtYWRkLXBsdWdpbicsIGV2ZW50KVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnbWluaW1hcC5kaXNwbGF5UGx1Z2luc0NvbnRyb2xzJykpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJQbHVnaW5Db250cm9scyhuYW1lLCBwbHVnaW4pXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVzUGx1Z2luQWN0aXZhdGlvblN0YXRlKG5hbWUpXG4gIH1cblxuICAvKipcbiAgICogVW5yZWdpc3RlcnMgYSBwbHVnaW4gZnJvbSB0aGUgbWluaW1hcC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIGlkZW50aWZ5aW5nIG5hbWUgb2YgdGhlIHBsdWdpbiB0byB1bnJlZ2lzdGVyLlxuICAgKiBAZW1pdHMge2RpZC1yZW1vdmUtcGx1Z2lufSB3aXRoIHRoZSBuYW1lIGFuZCBhIHJlZmVyZW5jZVxuICAgKiAgICAgICAgdG8gdGhlIGFkZGVkIHBsdWdpbi5cbiAgICovXG4gIHVucmVnaXN0ZXJQbHVnaW4gKG5hbWUpIHtcbiAgICBsZXQgcGx1Z2luID0gdGhpcy5wbHVnaW5zW25hbWVdXG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMnKSkge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyUGx1Z2luQ29udHJvbHMobmFtZSlcbiAgICB9XG5cbiAgICBkZWxldGUgdGhpcy5wbHVnaW5zW25hbWVdXG5cbiAgICBsZXQgZXZlbnQgPSB7IG5hbWU6IG5hbWUsIHBsdWdpbjogcGx1Z2luIH1cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXJlbW92ZS1wbHVnaW4nLCBldmVudClcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBzcGVjaWZpZWQgcGx1Z2luIGFjdGl2YXRpb24gc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSAgICAgVGhlIG5hbWUgb2YgdGhlIHBsdWdpbi5cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gYm9vbGVhbiBBbiBvcHRpb25hbCBib29sZWFuIHRvIHNldCB0aGUgYWN0aXZhdGlvblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlIG9mIHRoZSBwbHVnaW4uIElmIG9tbWl0dGVkIHRoZSBuZXcgcGx1Z2luXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUgd2lsbCBiZSB0aGUgdGhlIGludmVyc2Ugb2YgaXRzIGN1cnJlbnRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5cbiAgICogQGVtaXRzIHtkaWQtYWN0aXZhdGUtcGx1Z2lufSBpZiB0aGUgcGx1Z2luIHdhcyBhY3RpdmF0ZWQgYnkgdGhlIGNhbGwuXG4gICAqIEBlbWl0cyB7ZGlkLWRlYWN0aXZhdGUtcGx1Z2lufSBpZiB0aGUgcGx1Z2luIHdhcyBkZWFjdGl2YXRlZCBieSB0aGUgY2FsbC5cbiAgICovXG4gIHRvZ2dsZVBsdWdpbkFjdGl2YXRpb24gKG5hbWUsIGJvb2xlYW4pIHtcbiAgICBsZXQgc2V0dGluZ3NLZXkgPSBgbWluaW1hcC5wbHVnaW5zLiR7bmFtZX1gXG5cbiAgICBpZiAoYm9vbGVhbiAhPT0gdW5kZWZpbmVkICYmIGJvb2xlYW4gIT09IG51bGwpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldChzZXR0aW5nc0tleSwgYm9vbGVhbilcbiAgICB9IGVsc2Uge1xuICAgICAgYXRvbS5jb25maWcuc2V0KHNldHRpbmdzS2V5LCAhYXRvbS5jb25maWcuZ2V0KHNldHRpbmdzS2V5KSlcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZXNQbHVnaW5BY3RpdmF0aW9uU3RhdGUobmFtZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWFjdGl2YXRlcyBhbGwgdGhlIHBsdWdpbnMgcmVnaXN0ZXJlZCBpbiB0aGUgbWluaW1hcCBwYWNrYWdlIHNvIGZhci5cbiAgICpcbiAgICogQGVtaXRzIHtkaWQtZGVhY3RpdmF0ZS1wbHVnaW59IGZvciBlYWNoIHBsdWdpbiBkZWFjdGl2YXRlZCBieSB0aGUgY2FsbC5cbiAgICovXG4gIGRlYWN0aXZhdGVBbGxQbHVnaW5zICgpIHtcbiAgICBmb3IgKGxldCBbbmFtZSwgcGx1Z2luXSBvZiB0aGlzLmVhY2hQbHVnaW4oKSkge1xuICAgICAgcGx1Z2luLmRlYWN0aXZhdGVQbHVnaW4oKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZWFjdGl2YXRlLXBsdWdpbicsIHsgbmFtZTogbmFtZSwgcGx1Z2luOiBwbHVnaW4gfSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBnZW5lcmF0b3IgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIHJlZ2lzdGVyZWQgcGx1Z2lucy5cbiAgICpcbiAgICogQHJldHVybiBBbiBpdGVyYWJsZSB0aGF0IHlpZWxkIHRoZSBuYW1lIGFuZCByZWZlcmVuY2UgdG8gZXZlcnkgcGx1Z2luXG4gICAqICAgICAgICAgYXMgYW4gYXJyYXkgaW4gZWFjaCBpdGVyYXRpb24uXG4gICAqL1xuICAqIGVhY2hQbHVnaW4gKCkge1xuICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5wbHVnaW5zKSB7XG4gICAgICB5aWVsZCBbbmFtZSwgdGhpcy5wbHVnaW5zW25hbWVdXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwbHVnaW4gYWN0aXZhdGlvbiBzdGF0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgY29uZmlnLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgaWRlbnRpZnlpbmcgbmFtZSBvZiB0aGUgcGx1Z2luIHRvIHVwZGF0ZS5cbiAgICogQGVtaXRzIHtkaWQtYWN0aXZhdGUtcGx1Z2lufSBpZiB0aGUgcGx1Z2luIHdhcyBhY3RpdmF0ZWQgYnkgdGhlIGNhbGwuXG4gICAqIEBlbWl0cyB7ZGlkLWRlYWN0aXZhdGUtcGx1Z2lufSBpZiB0aGUgcGx1Z2luIHdhcyBkZWFjdGl2YXRlZCBieSB0aGUgY2FsbC5cbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICB1cGRhdGVzUGx1Z2luQWN0aXZhdGlvblN0YXRlIChuYW1lKSB7XG4gICAgbGV0IHBsdWdpbiA9IHRoaXMucGx1Z2luc1tuYW1lXVxuICAgIGxldCBwbHVnaW5BY3RpdmUgPSBwbHVnaW4uaXNBY3RpdmUoKVxuICAgIGxldCBzZXR0aW5nQWN0aXZlID0gYXRvbS5jb25maWcuZ2V0KGBtaW5pbWFwLnBsdWdpbnMuJHtuYW1lfWApXG4gICAgbGV0IGV2ZW50ID0geyBuYW1lOiBuYW1lLCBwbHVnaW46IHBsdWdpbiB9XG5cbiAgICBpZiAoc2V0dGluZ0FjdGl2ZSAmJiAhcGx1Z2luQWN0aXZlKSB7XG4gICAgICBwbHVnaW4uYWN0aXZhdGVQbHVnaW4oKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1hY3RpdmF0ZS1wbHVnaW4nLCBldmVudClcbiAgICB9IGVsc2UgaWYgKHBsdWdpbkFjdGl2ZSAmJiAhc2V0dGluZ0FjdGl2ZSkge1xuICAgICAgcGx1Z2luLmRlYWN0aXZhdGVQbHVnaW4oKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZWFjdGl2YXRlLXBsdWdpbicsIGV2ZW50KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBgbWluaW1hcC5kaXNwbGF5UGx1Z2luc0NvbnRyb2xzYCBzZXR0aW5nIGlzIHRvZ2dsZWQsXG4gICAqIHRoaXMgZnVuY3Rpb24gd2lsbCByZWdpc3RlciB0aGUgY29tbWFuZHMgYW5kIHNldHRpbmcgdG8gbWFuYWdlIHRoZSBwbHVnaW5cbiAgICogYWN0aXZhdGlvbiBmcm9tIHRoZSBtaW5pbWFwIHNldHRpbmdzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgaWRlbnRpZnlpbmcgbmFtZSBvZiB0aGUgcGx1Z2luLlxuICAgKiBAcGFyYW0ge01pbmltYXBQbHVnaW59IHBsdWdpbiBUaGUgcGx1Z2luIGluc3RhbmNlIHRvIHJlZ2lzdGVyXG4gICAqICAgICAgICBjb250cm9scyBmb3IuXG4gICAqIEBsaXN0ZW5zIHttaW5pbWFwLnBsdWdpbnMuJHtuYW1lfX0gbGlzdGVuIHRvIHRoZSBzZXR0aW5nIHRvIHVwZGF0ZVxuICAgKiAgICAgICAgICB0aGUgcGx1Z2luIHN0YXRlIGFjY29yZGluZ2x5LlxuICAgKiBAbGlzdGVucyB7bWluaW1hcDp0b2dnbGUtJHtuYW1lfX0gbGlzdGVuIHRvIHRoZSBjb21tYW5kIG9uIGBhdG9tLXdvcmtzcGFjZWBcbiAgICogICAgICAgICAgdG8gdG9nZ2xlIHRoZSBwbHVnaW4gc3RhdGUuXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcmVnaXN0ZXJQbHVnaW5Db250cm9scyAobmFtZSwgcGx1Z2luKSB7XG4gICAgbGV0IHNldHRpbmdzS2V5ID0gYG1pbmltYXAucGx1Z2lucy4ke25hbWV9YFxuXG4gICAgdGhpcy5jb25maWcucGx1Z2lucy5wcm9wZXJ0aWVzW25hbWVdID0ge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoc2V0dGluZ3NLZXkpID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldChzZXR0aW5nc0tleSwgdHJ1ZSlcbiAgICB9XG5cbiAgICB0aGlzLnBsdWdpbnNTdWJzY3JpcHRpb25zW25hbWVdLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKHNldHRpbmdzS2V5LCAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZXNQbHVnaW5BY3RpdmF0aW9uU3RhdGUobmFtZSlcbiAgICB9KSlcblxuICAgIHRoaXMucGx1Z2luc1N1YnNjcmlwdGlvbnNbbmFtZV0uYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgIFtgbWluaW1hcDp0b2dnbGUtJHtuYW1lfWBdOiAoKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlUGx1Z2luQWN0aXZhdGlvbihuYW1lKVxuICAgICAgfVxuICAgIH0pKVxuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIGBtaW5pbWFwLmRpc3BsYXlQbHVnaW5zQ29udHJvbHNgIHNldHRpbmcgaXMgdG9nZ2xlZCxcbiAgICogdGhpcyBmdW5jdGlvbiB3aWxsIHVucmVnaXN0ZXIgdGhlIGNvbW1hbmRzIGFuZCBzZXR0aW5nIHRoYXRcbiAgICogd2FzIGNyZWF0ZWQgcHJldmlvdXNseS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIGlkZW50aWZ5aW5nIG5hbWUgb2YgdGhlIHBsdWdpbi5cbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICB1bnJlZ2lzdGVyUGx1Z2luQ29udHJvbHMgKG5hbWUpIHtcbiAgICB0aGlzLnBsdWdpbnNTdWJzY3JpcHRpb25zW25hbWVdLmRpc3Bvc2UoKVxuICAgIGRlbGV0ZSB0aGlzLnBsdWdpbnNTdWJzY3JpcHRpb25zW25hbWVdXG4gICAgZGVsZXRlIHRoaXMuY29uZmlnLnBsdWdpbnMucHJvcGVydGllc1tuYW1lXVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/mixins/plugin-management.js

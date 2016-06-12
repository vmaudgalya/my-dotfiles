(function() {
  var CompositeDisposable, Mixin, PluginManagement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  CompositeDisposable = require('event-kit').CompositeDisposable;

  module.exports = PluginManagement = (function(_super) {
    __extends(PluginManagement, _super);

    function PluginManagement() {
      return PluginManagement.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    PluginManagement.prototype.provideMinimapServiceV1 = function() {
      return this;
    };

    PluginManagement.prototype.plugins = {};

    PluginManagement.prototype.pluginsSubscriptions = {};

    PluginManagement.prototype.registerPlugin = function(name, plugin) {
      var event;
      this.plugins[name] = plugin;
      this.pluginsSubscriptions[name] = new CompositeDisposable;
      event = {
        name: name,
        plugin: plugin
      };
      this.emitter.emit('did-add-plugin', event);
      if (atom.config.get('minimap.displayPluginsControls')) {
        this.registerPluginControls(name, plugin);
      }
      return this.updatesPluginActivationState(name);
    };

    PluginManagement.prototype.unregisterPlugin = function(name) {
      var event, plugin;
      plugin = this.plugins[name];
      if (atom.config.get('minimap.displayPluginsControls')) {
        this.unregisterPluginControls(name);
      }
      delete this.plugins[name];
      event = {
        name: name,
        plugin: plugin
      };
      return this.emitter.emit('did-remove-plugin', event);
    };

    PluginManagement.prototype.togglePluginActivation = function(name, boolean) {
      var settingsKey;
      if (boolean == null) {
        boolean = void 0;
      }
      settingsKey = "minimap.plugins." + name;
      if (boolean != null) {
        atom.config.set(settingsKey, boolean);
      } else {
        atom.config.set(settingsKey, !atom.config.get(settingsKey));
      }
      return this.updatesPluginActivationState(name);
    };

    PluginManagement.prototype.deactivateAllPlugins = function() {
      var name, plugin, _ref, _results;
      _ref = this.plugins;
      _results = [];
      for (name in _ref) {
        plugin = _ref[name];
        _results.push(plugin.deactivatePlugin());
      }
      return _results;
    };

    PluginManagement.prototype.updatesPluginActivationState = function(name) {
      var event, plugin, pluginActive, settingActive;
      plugin = this.plugins[name];
      pluginActive = plugin.isActive();
      settingActive = atom.config.get("minimap.plugins." + name);
      event = {
        name: name,
        plugin: plugin
      };
      if (settingActive && !pluginActive) {
        plugin.activatePlugin();
        return this.emitter.emit('did-activate-plugin', event);
      } else if (pluginActive && !settingActive) {
        plugin.deactivatePlugin();
        return this.emitter.emit('did-deactivate-plugin', event);
      }
    };

    PluginManagement.prototype.registerPluginControls = function(name, plugin) {
      var commands, settingsKey;
      settingsKey = "minimap.plugins." + name;
      this.config.plugins.properties[name] = {
        type: 'boolean',
        "default": true
      };
      if (atom.config.get(settingsKey) == null) {
        atom.config.set(settingsKey, true);
      }
      this.pluginsSubscriptions[name].add(atom.config.observe(settingsKey, (function(_this) {
        return function() {
          return _this.updatesPluginActivationState(name);
        };
      })(this)));
      commands = {};
      commands["minimap:toggle-" + name] = (function(_this) {
        return function() {
          return _this.togglePluginActivation(name);
        };
      })(this);
      return this.pluginsSubscriptions[name].add(atom.commands.add('atom-workspace', commands));
    };

    PluginManagement.prototype.unregisterPluginControls = function(name) {
      this.pluginsSubscriptions[name].dispose();
      delete this.pluginsSubscriptions[name];
      return delete this.config.plugins.properties[name];
    };

    return PluginManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWl4aW5zL3BsdWdpbi1tYW5hZ2VtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQTtBQUFBLGdCQUFBOztBQUFBLCtCQUdBLHVCQUFBLEdBQXlCLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQUh6QixDQUFBOztBQUFBLCtCQU1BLE9BQUEsR0FBUyxFQU5ULENBQUE7O0FBQUEsK0JBU0Esb0JBQUEsR0FBc0IsRUFUdEIsQ0FBQTs7QUFBQSwrQkFpQkEsY0FBQSxHQUFnQixTQUFDLElBQUQsRUFBTyxNQUFQLEdBQUE7QUFDZCxVQUFBLEtBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQSxDQUFULEdBQWlCLE1BQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxvQkFBcUIsQ0FBQSxJQUFBLENBQXRCLEdBQThCLEdBQUEsQ0FBQSxtQkFEOUIsQ0FBQTtBQUFBLE1BR0EsS0FBQSxHQUFRO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLFFBQUEsTUFBUDtPQUhSLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGdCQUFkLEVBQWdDLEtBQWhDLENBSkEsQ0FBQTtBQU1BLE1BQUEsSUFBeUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixDQUF6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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/mixins/plugin-management.coffee

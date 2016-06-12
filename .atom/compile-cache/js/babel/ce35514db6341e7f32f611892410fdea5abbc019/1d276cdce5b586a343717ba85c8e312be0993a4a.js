Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
  The following hack clears the require cache of all the paths to the minimap when this file is laoded. It should prevents errors of partial reloading after an update.
 */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _mixinsPluginManagement = require('./mixins/plugin-management');

var _mixinsPluginManagement2 = _interopRequireDefault(_mixinsPluginManagement);

'use babel';

if (!atom.inSpecMode()) {
  Object.keys(require.cache).filter(function (p) {
    return p !== __filename && p.indexOf(_path2['default'].resolve(__dirname, '..') + _path2['default'].sep) > -1;
  }).forEach(function (p) {
    delete require.cache[p];
  });
}

var Minimap = undefined,
    MinimapElement = undefined,
    MinimapPluginGeneratorElement = undefined;

/**
 * The `Minimap` package provides an eagle-eye view of text buffers.
 *
 * It also provides API for plugin packages that want to interact with the
 * minimap and be available to the user through the minimap settings.
 */

var Main = (function () {
  /**
   * Used only at export time.
   *
   * @access private
   */

  function Main() {
    _classCallCheck(this, _Main);

    /**
     * The activation state of the package.
     *
     * @type {boolean}
     * @access private
     */
    this.active = false;
    /**
     * The toggle state of the package.
     *
     * @type {boolean}
     * @access private
     */
    this.toggled = false;
    /**
     * The `Map` where Minimap instances are stored with the text editor they
     * target as key.
     *
     * @type {Map}
     * @access private
     */
    this.editorsMinimaps = null;
    /**
     * The composite disposable that stores the package's subscriptions.
     *
     * @type {CompositeDisposable}
     * @access private
     */
    this.subscriptions = null;
    /**
     * The disposable that stores the package's commands subscription.
     *
     * @type {Disposable}
     * @access private
     */
    this.subscriptionsOfCommands = null;
    /**
     * The package's config object.
     *
     * @type {Object}
     * @access private
     */
    this.config = require('./config-schema.json');
    /**
     * The package's events emitter.
     *
     * @type {Emitter}
     * @access private
     */
    this.emitter = new _atom.Emitter();

    this.initializePlugins();
  }

  /**
   * The exposed instance of the `Main` class.
   *
   * @access private
   */

  /**
   * Activates the minimap package.
   */

  _createClass(Main, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      if (this.active) {
        return;
      }

      if (!Minimap) {
        Minimap = require('./minimap');
      }
      if (!MinimapElement) {
        MinimapElement = require('./minimap-element');
      }

      MinimapElement.registerViewProvider(Minimap);

      this.subscriptionsOfCommands = atom.commands.add('atom-workspace', {
        'minimap:toggle': function minimapToggle() {
          _this.toggle();
        },
        'minimap:generate-coffee-plugin': function minimapGenerateCoffeePlugin() {
          _this.generatePlugin('coffee');
        },
        'minimap:generate-javascript-plugin': function minimapGenerateJavascriptPlugin() {
          _this.generatePlugin('javascript');
        },
        'minimap:generate-babel-plugin': function minimapGenerateBabelPlugin() {
          _this.generatePlugin('babel');
        }
      });

      this.editorsMinimaps = new Map();
      this.subscriptions = new _atom.CompositeDisposable();
      this.active = true;

      if (atom.config.get('minimap.autoToggle')) {
        this.toggle();
      }
    }

    /**
     * Deactivates the minimap package.
     */
  }, {
    key: 'deactivate',
    value: function deactivate() {
      var _this2 = this;

      if (!this.active) {
        return;
      }

      this.deactivateAllPlugins();

      if (this.editorsMinimaps) {
        this.editorsMinimaps.forEach(function (value, key) {
          value.destroy();
          _this2.editorsMinimaps['delete'](key);
        });
      }

      this.subscriptions.dispose();
      this.subscriptions = null;
      this.subscriptionsOfCommands.dispose();
      this.subscriptionsOfCommands = null;
      this.editorsMinimaps = undefined;
      this.toggled = false;
      this.active = false;
    }

    /**
     * Toggles the minimap display.
     */
  }, {
    key: 'toggle',
    value: function toggle() {
      var _this3 = this;

      if (!this.active) {
        return;
      }

      if (this.toggled) {
        this.toggled = false;

        if (this.editorsMinimaps) {
          this.editorsMinimaps.forEach(function (value, key) {
            value.destroy();
            _this3.editorsMinimaps['delete'](key);
          });
        }
        this.subscriptions.dispose();
      } else {
        this.toggled = true;
        this.initSubscriptions();
      }
    }

    /**
     * Opens the plugin generation view.
     *
     * @param  {string} template the name of the template to use
     */
  }, {
    key: 'generatePlugin',
    value: function generatePlugin(template) {
      if (!MinimapPluginGeneratorElement) {
        MinimapPluginGeneratorElement = require('./minimap-plugin-generator-element');
      }
      var view = new MinimapPluginGeneratorElement();
      view.template = template;
      view.attach();
    }

    /**
     * Registers a callback to listen to the `did-activate` event of the package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidActivate',
    value: function onDidActivate(callback) {
      return this.emitter.on('did-activate', callback);
    }

    /**
     * Registers a callback to listen to the `did-deactivate` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDeactivate',
    value: function onDidDeactivate(callback) {
      return this.emitter.on('did-deactivate', callback);
    }

    /**
     * Registers a callback to listen to the `did-create-minimap` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidCreateMinimap',
    value: function onDidCreateMinimap(callback) {
      return this.emitter.on('did-create-minimap', callback);
    }

    /**
     * Registers a callback to listen to the `did-add-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidAddPlugin',
    value: function onDidAddPlugin(callback) {
      return this.emitter.on('did-add-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-remove-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidRemovePlugin',
    value: function onDidRemovePlugin(callback) {
      return this.emitter.on('did-remove-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-activate-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidActivatePlugin',
    value: function onDidActivatePlugin(callback) {
      return this.emitter.on('did-activate-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-deactivate-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDeactivatePlugin',
    value: function onDidDeactivatePlugin(callback) {
      return this.emitter.on('did-deactivate-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-change-plugin-order` event of
     * the package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangePluginOrder',
    value: function onDidChangePluginOrder(callback) {
      return this.emitter.on('did-change-plugin-order', callback);
    }

    /**
     * Returns the `Minimap` class
     *
     * @return {Function} the `Minimap` class constructor
     */
  }, {
    key: 'minimapClass',
    value: function minimapClass() {
      return Minimap;
    }

    /**
     * Returns the `Minimap` object associated to the passed-in
     * `TextEditorElement`.
     *
     * @param  {TextEditorElement} editorElement a text editor element
     * @return {Minimap} the associated minimap
     */
  }, {
    key: 'minimapForEditorElement',
    value: function minimapForEditorElement(editorElement) {
      if (!editorElement) {
        return;
      }
      return this.minimapForEditor(editorElement.getModel());
    }

    /**
     * Returns the `Minimap` object associated to the passed-in
     * `TextEditor`.
     *
     * @param  {TextEditor} textEditor a text editor
     * @return {Minimap} the associated minimap
     */
  }, {
    key: 'minimapForEditor',
    value: function minimapForEditor(textEditor) {
      var _this4 = this;

      if (!textEditor) {
        return;
      }

      var minimap = this.editorsMinimaps.get(textEditor);

      if (!minimap) {
        minimap = new Minimap({ textEditor: textEditor });
        this.editorsMinimaps.set(textEditor, minimap);

        var editorSubscription = textEditor.onDidDestroy(function () {
          var minimaps = _this4.editorsMinimaps;
          if (minimaps) {
            minimaps['delete'](textEditor);
          }
          editorSubscription.dispose();
        });
      }

      return minimap;
    }

    /**
     * Returns a new stand-alone {Minimap} for the passed-in `TextEditor`.
     *
     * @param  {TextEditor} textEditor a text editor instance to create
     *                                 a minimap for
     * @return {Minimap} a new stand-alone Minimap for the passed-in editor
     */
  }, {
    key: 'standAloneMinimapForEditor',
    value: function standAloneMinimapForEditor(textEditor) {
      if (!textEditor) {
        return;
      }

      return new Minimap({
        textEditor: textEditor,
        standAlone: true
      });
    }

    /**
     * Returns the `Minimap` associated to the active `TextEditor`.
     *
     * @return {Minimap} the active Minimap
     */
  }, {
    key: 'getActiveMinimap',
    value: function getActiveMinimap() {
      return this.minimapForEditor(atom.workspace.getActiveTextEditor());
    }

    /**
     * Calls a function for each present and future minimaps.
     *
     * @param  {function(minimap:Minimap):void} iterator a function to call with
     *                                                   the existing and future
     *                                                   minimaps
     * @return {Disposable} a disposable to unregister the observer
     */
  }, {
    key: 'observeMinimaps',
    value: function observeMinimaps(iterator) {
      if (!iterator) {
        return;
      }

      if (this.editorsMinimaps) {
        this.editorsMinimaps.forEach(function (minimap) {
          iterator(minimap);
        });
      }
      return this.onDidCreateMinimap(function (minimap) {
        iterator(minimap);
      });
    }

    /**
     * Registers to the `observeTextEditors` method.
     *
     * @access private
     */
  }, {
    key: 'initSubscriptions',
    value: function initSubscriptions() {
      var _this5 = this;

      this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
        var minimap = _this5.minimapForEditor(textEditor);
        var minimapElement = atom.views.getView(minimap);

        _this5.emitter.emit('did-create-minimap', minimap);

        minimapElement.attach();
      }));
    }
  }]);

  var _Main = Main;
  Main = (0, _decoratorsInclude2['default'])(_mixinsPluginManagement2['default'])(Main) || Main;
  return Main;
})();

exports['default'] = new Main();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBS2lCLE1BQU07Ozs7b0JBVW9CLE1BQU07O2lDQUM3QixzQkFBc0I7Ozs7c0NBQ2IsNEJBQTRCOzs7O0FBakJ6RCxXQUFXLENBQUE7O0FBT1gsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN0QixRQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDdkMsV0FBTyxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQUssT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxrQkFBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtHQUNwRixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2hCLFdBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUN4QixDQUFDLENBQUE7Q0FDSDs7QUFNRCxJQUFJLE9BQU8sWUFBQTtJQUFFLGNBQWMsWUFBQTtJQUFFLDZCQUE2QixZQUFBLENBQUE7Ozs7Ozs7OztJQVNwRCxJQUFJOzs7Ozs7O0FBTUksV0FOUixJQUFJLEdBTU87Ozs7Ozs7OztBQU9iLFFBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBOzs7Ozs7O0FBT25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBOzs7Ozs7OztBQVFwQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQTs7Ozs7OztBQU8zQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTs7Ozs7OztBQU96QixRQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFBOzs7Ozs7O0FBT25DLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FB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QU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFaEQsZUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFBOztBQUVoRCxzQkFBYyxDQUFDLE1BQU0sRUFBRSxDQUFBO09BQ3hCLENBQUMsQ0FBQyxDQUFBO0tBQ0o7OztjQXRWRyxJQUFJO0FBQUosTUFBSSxHQURULHdFQUF5QixDQUNwQixJQUFJLEtBQUosSUFBSTtTQUFKLElBQUk7OztxQkE4VkssSUFBSSxJQUFJLEVBQUUiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbi8qXG4gIFRoZSBmb2xsb3dpbmcgaGFjayBjbGVhcnMgdGhlIHJlcXVpcmUgY2FjaGUgb2YgYWxsIHRoZSBwYXRocyB0byB0aGUgbWluaW1hcCB3aGVuIHRoaXMgZmlsZSBpcyBsYW9kZWQuIEl0IHNob3VsZCBwcmV2ZW50cyBlcnJvcnMgb2YgcGFydGlhbCByZWxvYWRpbmcgYWZ0ZXIgYW4gdXBkYXRlLlxuICovXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5pZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gIE9iamVjdC5rZXlzKHJlcXVpcmUuY2FjaGUpLmZpbHRlcigocCkgPT4ge1xuICAgIHJldHVybiBwICE9PSBfX2ZpbGVuYW1lICYmIHAuaW5kZXhPZihwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nKSArIHBhdGguc2VwKSA+IC0xXG4gIH0pLmZvckVhY2goKHApID0+IHtcbiAgICBkZWxldGUgcmVxdWlyZS5jYWNoZVtwXVxuICB9KVxufVxuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgaW5jbHVkZSBmcm9tICcuL2RlY29yYXRvcnMvaW5jbHVkZSdcbmltcG9ydCBQbHVnaW5NYW5hZ2VtZW50IGZyb20gJy4vbWl4aW5zL3BsdWdpbi1tYW5hZ2VtZW50J1xuXG5sZXQgTWluaW1hcCwgTWluaW1hcEVsZW1lbnQsIE1pbmltYXBQbHVnaW5HZW5lcmF0b3JFbGVtZW50XG5cbi8qKlxuICogVGhlIGBNaW5pbWFwYCBwYWNrYWdlIHByb3ZpZGVzIGFuIGVhZ2xlLWV5ZSB2aWV3IG9mIHRleHQgYnVmZmVycy5cbiAqXG4gKiBJdCBhbHNvIHByb3ZpZGVzIEFQSSBmb3IgcGx1Z2luIHBhY2thZ2VzIHRoYXQgd2FudCB0byBpbnRlcmFjdCB3aXRoIHRoZVxuICogbWluaW1hcCBhbmQgYmUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIHRocm91Z2ggdGhlIG1pbmltYXAgc2V0dGluZ3MuXG4gKi9cbkBpbmNsdWRlKFBsdWdpbk1hbmFnZW1lbnQpXG5jbGFzcyBNYWluIHtcbiAgLyoqXG4gICAqIFVzZWQgb25seSBhdCBleHBvcnQgdGltZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgLyoqXG4gICAgICogVGhlIGFjdGl2YXRpb24gc3RhdGUgb2YgdGhlIHBhY2thZ2UuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgLyoqXG4gICAgICogVGhlIHRvZ2dsZSBzdGF0ZSBvZiB0aGUgcGFja2FnZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMudG9nZ2xlZCA9IGZhbHNlXG4gICAgLyoqXG4gICAgICogVGhlIGBNYXBgIHdoZXJlIE1pbmltYXAgaW5zdGFuY2VzIGFyZSBzdG9yZWQgd2l0aCB0aGUgdGV4dCBlZGl0b3IgdGhleVxuICAgICAqIHRhcmdldCBhcyBrZXkuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZWRpdG9yc01pbmltYXBzID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjb21wb3NpdGUgZGlzcG9zYWJsZSB0aGF0IHN0b3JlcyB0aGUgcGFja2FnZSdzIHN1YnNjcmlwdGlvbnMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Q29tcG9zaXRlRGlzcG9zYWJsZX1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGRpc3Bvc2FibGUgdGhhdCBzdG9yZXMgdGhlIHBhY2thZ2UncyBjb21tYW5kcyBzdWJzY3JpcHRpb24uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RGlzcG9zYWJsZX1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnNPZkNvbW1hbmRzID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBwYWNrYWdlJ3MgY29uZmlnIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy1zY2hlbWEuanNvbicpXG4gICAgLyoqXG4gICAgICogVGhlIHBhY2thZ2UncyBldmVudHMgZW1pdHRlci5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtFbWl0dGVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuICAgIHRoaXMuaW5pdGlhbGl6ZVBsdWdpbnMoKVxuICB9XG5cbiAgLyoqXG4gICAqIEFjdGl2YXRlcyB0aGUgbWluaW1hcCBwYWNrYWdlLlxuICAgKi9cbiAgYWN0aXZhdGUgKCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZSkgeyByZXR1cm4gfVxuXG4gICAgaWYgKCFNaW5pbWFwKSB7IE1pbmltYXAgPSByZXF1aXJlKCcuL21pbmltYXAnKSB9XG4gICAgaWYgKCFNaW5pbWFwRWxlbWVudCkgeyBNaW5pbWFwRWxlbWVudCA9IHJlcXVpcmUoJy4vbWluaW1hcC1lbGVtZW50JykgfVxuXG4gICAgTWluaW1hcEVsZW1lbnQucmVnaXN0ZXJWaWV3UHJvdmlkZXIoTWluaW1hcClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9uc09mQ29tbWFuZHMgPSBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnbWluaW1hcDp0b2dnbGUnOiAoKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlKClcbiAgICAgIH0sXG4gICAgICAnbWluaW1hcDpnZW5lcmF0ZS1jb2ZmZWUtcGx1Z2luJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmdlbmVyYXRlUGx1Z2luKCdjb2ZmZWUnKVxuICAgICAgfSxcbiAgICAgICdtaW5pbWFwOmdlbmVyYXRlLWphdmFzY3JpcHQtcGx1Z2luJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmdlbmVyYXRlUGx1Z2luKCdqYXZhc2NyaXB0JylcbiAgICAgIH0sXG4gICAgICAnbWluaW1hcDpnZW5lcmF0ZS1iYWJlbC1wbHVnaW4nOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQbHVnaW4oJ2JhYmVsJylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5lZGl0b3JzTWluaW1hcHMgPSBuZXcgTWFwKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlXG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLmF1dG9Ub2dnbGUnKSkgeyB0aGlzLnRvZ2dsZSgpIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWFjdGl2YXRlcyB0aGUgbWluaW1hcCBwYWNrYWdlLlxuICAgKi9cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5kZWFjdGl2YXRlQWxsUGx1Z2lucygpXG5cbiAgICBpZiAodGhpcy5lZGl0b3JzTWluaW1hcHMpIHtcbiAgICAgIHRoaXMuZWRpdG9yc01pbmltYXBzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgdmFsdWUuZGVzdHJveSgpXG4gICAgICAgIHRoaXMuZWRpdG9yc01pbmltYXBzLmRlbGV0ZShrZXkpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zT2ZDb21tYW5kcy5kaXNwb3NlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnNPZkNvbW1hbmRzID0gbnVsbFxuICAgIHRoaXMuZWRpdG9yc01pbmltYXBzID0gdW5kZWZpbmVkXG4gICAgdGhpcy50b2dnbGVkID0gZmFsc2VcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgbWluaW1hcCBkaXNwbGF5LlxuICAgKi9cbiAgdG9nZ2xlICgpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlKSB7IHJldHVybiB9XG5cbiAgICBpZiAodGhpcy50b2dnbGVkKSB7XG4gICAgICB0aGlzLnRvZ2dsZWQgPSBmYWxzZVxuXG4gICAgICBpZiAodGhpcy5lZGl0b3JzTWluaW1hcHMpIHtcbiAgICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgIHZhbHVlLmRlc3Ryb3koKVxuICAgICAgICAgIHRoaXMuZWRpdG9yc01pbmltYXBzLmRlbGV0ZShrZXkpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9nZ2xlZCA9IHRydWVcbiAgICAgIHRoaXMuaW5pdFN1YnNjcmlwdGlvbnMoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgcGx1Z2luIGdlbmVyYXRpb24gdmlldy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0ZW1wbGF0ZSB0aGUgbmFtZSBvZiB0aGUgdGVtcGxhdGUgdG8gdXNlXG4gICAqL1xuICBnZW5lcmF0ZVBsdWdpbiAodGVtcGxhdGUpIHtcbiAgICBpZiAoIU1pbmltYXBQbHVnaW5HZW5lcmF0b3JFbGVtZW50KSB7XG4gICAgICBNaW5pbWFwUGx1Z2luR2VuZXJhdG9yRWxlbWVudCA9IHJlcXVpcmUoJy4vbWluaW1hcC1wbHVnaW4tZ2VuZXJhdG9yLWVsZW1lbnQnKVxuICAgIH1cbiAgICB2YXIgdmlldyA9IG5ldyBNaW5pbWFwUGx1Z2luR2VuZXJhdG9yRWxlbWVudCgpXG4gICAgdmlldy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdmlldy5hdHRhY2goKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1hY3RpdmF0ZWAgZXZlbnQgb2YgdGhlIHBhY2thZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQWN0aXZhdGUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWFjdGl2YXRlJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWRlYWN0aXZhdGVgIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZERlYWN0aXZhdGUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlYWN0aXZhdGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBsaXN0ZW4gdG8gdGhlIGBkaWQtY3JlYXRlLW1pbmltYXBgIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENyZWF0ZU1pbmltYXAgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNyZWF0ZS1taW5pbWFwJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWFkZC1wbHVnaW5gIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZEFkZFBsdWdpbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYWRkLXBsdWdpbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1yZW1vdmUtcGx1Z2luYCBldmVudCBvZiB0aGVcbiAgICogcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRSZW1vdmVQbHVnaW4gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXJlbW92ZS1wbHVnaW4nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBsaXN0ZW4gdG8gdGhlIGBkaWQtYWN0aXZhdGUtcGx1Z2luYCBldmVudCBvZiB0aGVcbiAgICogcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRBY3RpdmF0ZVBsdWdpbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYWN0aXZhdGUtcGx1Z2luJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWRlYWN0aXZhdGUtcGx1Z2luYCBldmVudCBvZiB0aGVcbiAgICogcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWREZWFjdGl2YXRlUGx1Z2luIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZWFjdGl2YXRlLXBsdWdpbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1jaGFuZ2UtcGx1Z2luLW9yZGVyYCBldmVudCBvZlxuICAgKiB0aGUgcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VQbHVnaW5PcmRlciAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXBsdWdpbi1vcmRlcicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBNaW5pbWFwYCBjbGFzc1xuICAgKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGBNaW5pbWFwYCBjbGFzcyBjb25zdHJ1Y3RvclxuICAgKi9cbiAgbWluaW1hcENsYXNzICgpIHsgcmV0dXJuIE1pbmltYXAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgTWluaW1hcGAgb2JqZWN0IGFzc29jaWF0ZWQgdG8gdGhlIHBhc3NlZC1pblxuICAgKiBgVGV4dEVkaXRvckVsZW1lbnRgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yRWxlbWVudH0gZWRpdG9yRWxlbWVudCBhIHRleHQgZWRpdG9yIGVsZW1lbnRcbiAgICogQHJldHVybiB7TWluaW1hcH0gdGhlIGFzc29jaWF0ZWQgbWluaW1hcFxuICAgKi9cbiAgbWluaW1hcEZvckVkaXRvckVsZW1lbnQgKGVkaXRvckVsZW1lbnQpIHtcbiAgICBpZiAoIWVkaXRvckVsZW1lbnQpIHsgcmV0dXJuIH1cbiAgICByZXR1cm4gdGhpcy5taW5pbWFwRm9yRWRpdG9yKGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgTWluaW1hcGAgb2JqZWN0IGFzc29jaWF0ZWQgdG8gdGhlIHBhc3NlZC1pblxuICAgKiBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSAge1RleHRFZGl0b3J9IHRleHRFZGl0b3IgYSB0ZXh0IGVkaXRvclxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSB0aGUgYXNzb2NpYXRlZCBtaW5pbWFwXG4gICAqL1xuICBtaW5pbWFwRm9yRWRpdG9yICh0ZXh0RWRpdG9yKSB7XG4gICAgaWYgKCF0ZXh0RWRpdG9yKSB7IHJldHVybiB9XG5cbiAgICBsZXQgbWluaW1hcCA9IHRoaXMuZWRpdG9yc01pbmltYXBzLmdldCh0ZXh0RWRpdG9yKVxuXG4gICAgaWYgKCFtaW5pbWFwKSB7XG4gICAgICBtaW5pbWFwID0gbmV3IE1pbmltYXAoe3RleHRFZGl0b3J9KVxuICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuc2V0KHRleHRFZGl0b3IsIG1pbmltYXApXG5cbiAgICAgIHZhciBlZGl0b3JTdWJzY3JpcHRpb24gPSB0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIGxldCBtaW5pbWFwcyA9IHRoaXMuZWRpdG9yc01pbmltYXBzXG4gICAgICAgIGlmIChtaW5pbWFwcykgeyBtaW5pbWFwcy5kZWxldGUodGV4dEVkaXRvcikgfVxuICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBtaW5pbWFwXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIG5ldyBzdGFuZC1hbG9uZSB7TWluaW1hcH0gZm9yIHRoZSBwYXNzZWQtaW4gYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSB0ZXh0RWRpdG9yIGEgdGV4dCBlZGl0b3IgaW5zdGFuY2UgdG8gY3JlYXRlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBtaW5pbWFwIGZvclxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSBhIG5ldyBzdGFuZC1hbG9uZSBNaW5pbWFwIGZvciB0aGUgcGFzc2VkLWluIGVkaXRvclxuICAgKi9cbiAgc3RhbmRBbG9uZU1pbmltYXBGb3JFZGl0b3IgKHRleHRFZGl0b3IpIHtcbiAgICBpZiAoIXRleHRFZGl0b3IpIHsgcmV0dXJuIH1cblxuICAgIHJldHVybiBuZXcgTWluaW1hcCh7XG4gICAgICB0ZXh0RWRpdG9yOiB0ZXh0RWRpdG9yLFxuICAgICAgc3RhbmRBbG9uZTogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYE1pbmltYXBgIGFzc29jaWF0ZWQgdG8gdGhlIGFjdGl2ZSBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEByZXR1cm4ge01pbmltYXB9IHRoZSBhY3RpdmUgTWluaW1hcFxuICAgKi9cbiAgZ2V0QWN0aXZlTWluaW1hcCAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWluaW1hcEZvckVkaXRvcihhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgYSBmdW5jdGlvbiBmb3IgZWFjaCBwcmVzZW50IGFuZCBmdXR1cmUgbWluaW1hcHMuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKG1pbmltYXA6TWluaW1hcCk6dm9pZH0gaXRlcmF0b3IgYSBmdW5jdGlvbiB0byBjYWxsIHdpdGhcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXhpc3RpbmcgYW5kIGZ1dHVyZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltYXBzXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byB1bnJlZ2lzdGVyIHRoZSBvYnNlcnZlclxuICAgKi9cbiAgb2JzZXJ2ZU1pbmltYXBzIChpdGVyYXRvcikge1xuICAgIGlmICghaXRlcmF0b3IpIHsgcmV0dXJuIH1cblxuICAgIGlmICh0aGlzLmVkaXRvcnNNaW5pbWFwcykge1xuICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuZm9yRWFjaCgobWluaW1hcCkgPT4geyBpdGVyYXRvcihtaW5pbWFwKSB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vbkRpZENyZWF0ZU1pbmltYXAoKG1pbmltYXApID0+IHsgaXRlcmF0b3IobWluaW1hcCkgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgdG8gdGhlIGBvYnNlcnZlVGV4dEVkaXRvcnNgIG1ldGhvZC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBpbml0U3Vic2NyaXB0aW9ucyAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKHRleHRFZGl0b3IpID0+IHtcbiAgICAgIGxldCBtaW5pbWFwID0gdGhpcy5taW5pbWFwRm9yRWRpdG9yKHRleHRFZGl0b3IpXG4gICAgICBsZXQgbWluaW1hcEVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcobWluaW1hcClcblxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jcmVhdGUtbWluaW1hcCcsIG1pbmltYXApXG5cbiAgICAgIG1pbmltYXBFbGVtZW50LmF0dGFjaCgpXG4gICAgfSkpXG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgZXhwb3NlZCBpbnN0YW5jZSBvZiB0aGUgYE1haW5gIGNsYXNzLlxuICpcbiAqIEBhY2Nlc3MgcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBuZXcgTWFpbigpXG4iXX0=
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/main.js

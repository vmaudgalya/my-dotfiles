(function() {
  var CompositeDisposable, Emitter, Main, Minimap, MinimapElement, MinimapPluginGeneratorElement, PluginManagement, deprecate, semver, _ref, _ref1;

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  PluginManagement = require('./mixins/plugin-management');

  _ref1 = [], Minimap = _ref1[0], MinimapElement = _ref1[1], MinimapPluginGeneratorElement = _ref1[2], deprecate = _ref1[3], semver = _ref1[4];

  Main = (function() {
    PluginManagement.includeInto(Main);


    /* Public */

    Main.prototype.config = {
      plugins: {
        type: 'object',
        properties: {}
      },
      autoToggle: {
        type: 'boolean',
        "default": true
      },
      displayMinimapOnLeft: {
        type: 'boolean',
        "default": false
      },
      displayCodeHighlights: {
        type: 'boolean',
        "default": true,
        description: 'Toggles the render of the buffer tokens in the minimap.'
      },
      displayPluginsControls: {
        type: 'boolean',
        "default": true,
        description: 'You need to restart Atom for this setting to be effective.'
      },
      minimapScrollIndicator: {
        type: 'boolean',
        "default": true,
        description: 'Toggles the display of a side line showing which part of the buffer is currently displayed by the minimap. This side line will only appear if the minimap is taller than the editor view height.'
      },
      useHardwareAcceleration: {
        type: 'boolean',
        "default": true
      },
      adjustMinimapWidthToSoftWrap: {
        type: 'boolean',
        "default": true,
        description: 'If this option is enabled and Soft Wrap is checked then the Minimap max width is set to the Preferred Line Length value.'
      },
      charWidth: {
        type: 'number',
        "default": 1,
        minimum: .5
      },
      charHeight: {
        type: 'number',
        "default": 2,
        minimum: .5
      },
      interline: {
        type: 'number',
        "default": 1,
        minimum: 0,
        description: 'The space between lines in the minimap in pixels.'
      },
      textOpacity: {
        type: 'number',
        "default": 0.6,
        minimum: 0,
        maximum: 1,
        description: "The opacity used to render the line's text in the minimap."
      },
      scrollAnimation: {
        type: 'boolean',
        "default": false,
        description: 'Enables animations when scrolling by clicking on the minimap.'
      },
      scrollAnimationDuration: {
        type: 'integer',
        "default": 300,
        description: 'The duration of scrolling animations when clicking on the minimap.'
      },
      createPluginInDevMode: {
        type: 'boolean',
        "default": false
      },
      absoluteMode: {
        type: 'boolean',
        "default": false,
        description: 'When enabled the text editor content will be able to flow below the minimap.'
      }
    };

    Main.prototype.active = false;

    function Main() {
      this.emitter = new Emitter;
    }

    Main.prototype.activate = function() {
      if (this.active) {
        return;
      }
      if (MinimapElement == null) {
        MinimapElement = require('./minimap-element');
      }
      MinimapElement.registerViewProvider();
      this.subscriptionsOfCommands = atom.commands.add('atom-workspace', {
        'minimap:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'minimap:generate-coffee-plugin': (function(_this) {
          return function() {
            return _this.generatePlugin('coffee');
          };
        })(this),
        'minimap:generate-javascript-plugin': (function(_this) {
          return function() {
            return _this.generatePlugin('javascript');
          };
        })(this),
        'minimap:generate-babel-plugin': (function(_this) {
          return function() {
            return _this.generatePlugin('babel');
          };
        })(this)
      });
      this.subscriptions = new CompositeDisposable;
      this.active = true;
      if (atom.config.get('minimap.autoToggle')) {
        return this.toggle();
      }
    };

    Main.prototype.deactivate = function() {
      var _ref2;
      if (!this.active) {
        return;
      }
      this.deactivateAllPlugins();
      if ((_ref2 = this.editorsMinimaps) != null) {
        _ref2.forEach((function(_this) {
          return function(value, key) {
            value.destroy();
            return _this.editorsMinimaps["delete"](key);
          };
        })(this));
      }
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.subscriptionsOfCommands.dispose();
      this.subscriptionsOfCommands = null;
      this.editorsMinimaps = void 0;
      this.toggled = false;
      return this.active = false;
    };

    Main.prototype.toggle = function() {
      var _ref2;
      if (!this.active) {
        return;
      }
      if (this.toggled) {
        this.toggled = false;
        if ((_ref2 = this.editorsMinimaps) != null) {
          _ref2.forEach((function(_this) {
            return function(value, key) {
              value.destroy();
              return _this.editorsMinimaps["delete"](key);
            };
          })(this));
        }
        return this.subscriptions.dispose();
      } else {
        this.toggled = true;
        return this.initSubscriptions();
      }
    };

    Main.prototype.generatePlugin = function(template) {
      var view;
      if (MinimapPluginGeneratorElement == null) {
        MinimapPluginGeneratorElement = require('./minimap-plugin-generator-element');
      }
      view = new MinimapPluginGeneratorElement();
      view.template = template;
      return view.attach();
    };

    Main.prototype.onDidActivate = function(callback) {
      return this.emitter.on('did-activate', callback);
    };

    Main.prototype.onDidDeactivate = function(callback) {
      return this.emitter.on('did-deactivate', callback);
    };

    Main.prototype.onDidCreateMinimap = function(callback) {
      return this.emitter.on('did-create-minimap', callback);
    };

    Main.prototype.onDidAddPlugin = function(callback) {
      return this.emitter.on('did-add-plugin', callback);
    };

    Main.prototype.onDidRemovePlugin = function(callback) {
      return this.emitter.on('did-remove-plugin', callback);
    };

    Main.prototype.onDidActivatePlugin = function(callback) {
      return this.emitter.on('did-activate-plugin', callback);
    };

    Main.prototype.onDidDeactivatePlugin = function(callback) {
      return this.emitter.on('did-deactivate-plugin', callback);
    };

    Main.prototype.minimapClass = function() {
      return Minimap != null ? Minimap : Minimap = require('./minimap');
    };

    Main.prototype.minimapForEditorElement = function(editorElement) {
      if (editorElement == null) {
        return;
      }
      return this.minimapForEditor(editorElement.getModel());
    };

    Main.prototype.minimapForEditor = function(textEditor) {
      var editorSubscription, minimap;
      if (textEditor == null) {
        return;
      }
      if (Minimap == null) {
        Minimap = require('./minimap');
      }
      if (this.editorsMinimaps == null) {
        this.editorsMinimaps = new Map;
      }
      minimap = this.editorsMinimaps.get(textEditor);
      if (minimap == null) {
        minimap = new Minimap({
          textEditor: textEditor
        });
        this.editorsMinimaps.set(textEditor, minimap);
        editorSubscription = textEditor.onDidDestroy((function(_this) {
          return function() {
            var _ref2;
            if ((_ref2 = _this.editorsMinimaps) != null) {
              _ref2["delete"](textEditor);
            }
            return editorSubscription.dispose();
          };
        })(this));
      }
      return minimap;
    };

    Main.prototype.standAloneMinimapForEditor = function(textEditor) {
      if (textEditor == null) {
        return;
      }
      if (Minimap == null) {
        Minimap = require('./minimap');
      }
      return new Minimap({
        textEditor: textEditor,
        standAlone: true
      });
    };

    Main.prototype.getActiveMinimap = function() {
      return this.minimapForEditor(atom.workspace.getActiveTextEditor());
    };

    Main.prototype.observeMinimaps = function(iterator) {
      var createdCallback, _ref2;
      if (iterator == null) {
        return;
      }
      if ((_ref2 = this.editorsMinimaps) != null) {
        _ref2.forEach(function(minimap) {
          return iterator(minimap);
        });
      }
      createdCallback = function(minimap) {
        return iterator(minimap);
      };
      return this.onDidCreateMinimap(createdCallback);
    };

    Main.prototype.initSubscriptions = function() {
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          var editorElement, minimap, minimapElement;
          minimap = _this.minimapForEditor(textEditor);
          editorElement = atom.views.getView(textEditor);
          minimapElement = atom.views.getView(minimap);
          _this.emitter.emit('did-create-minimap', minimap);
          return minimapElement.attach();
        };
      })(this)));
    };

    return Main;

  })();

  module.exports = new Main();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNElBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLGVBQUEsT0FBRCxFQUFVLDJCQUFBLG1CQUFWLENBQUE7O0FBQUEsRUFFQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsNEJBQVIsQ0FGbkIsQ0FBQTs7QUFBQSxFQUlBLFFBQThFLEVBQTlFLEVBQUMsa0JBQUQsRUFBVSx5QkFBVixFQUEwQix3Q0FBMUIsRUFBeUQsb0JBQXpELEVBQW9FLGlCQUpwRSxDQUFBOztBQUFBLEVBcUJNO0FBQ0osSUFBQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixJQUE3QixDQUFBLENBQUE7O0FBRUE7QUFBQSxnQkFGQTs7QUFBQSxtQkFLQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLE9BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFVBQUEsRUFBWSxFQURaO09BREY7QUFBQSxNQUdBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BSkY7QUFBQSxNQU1BLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQVBGO0FBQUEsTUFTQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx5REFGYjtPQVZGO0FBQUEsTUFhQSxzQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/main.coffee

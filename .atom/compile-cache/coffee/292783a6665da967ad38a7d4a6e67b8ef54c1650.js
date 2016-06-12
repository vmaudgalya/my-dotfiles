(function() {
  var CompositeDisposable, Emitter, EventsDelegation, Main, MinimapQuickSettingsElement, SpacePenDSL, registerOrUpdateElement, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom-utils'), registerOrUpdateElement = _ref.registerOrUpdateElement, EventsDelegation = _ref.EventsDelegation, SpacePenDSL = _ref.SpacePenDSL;

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Emitter = _ref1.Emitter;

  Main = require('./main');

  MinimapQuickSettingsElement = (function() {
    function MinimapQuickSettingsElement() {
      this.toggleSelectedItem = __bind(this.toggleSelectedItem, this);
    }

    SpacePenDSL.includeInto(MinimapQuickSettingsElement);

    EventsDelegation.includeInto(MinimapQuickSettingsElement);

    MinimapQuickSettingsElement.content = function() {
      return this.div({
        "class": 'select-list popover-list minimap-quick-settings'
      }, (function(_this) {
        return function() {
          _this.input({
            type: 'text',
            "class": 'hidden-input',
            outlet: 'hiddenInput'
          });
          _this.ol({
            "class": 'list-group mark-active',
            outlet: 'list'
          }, function() {
            _this.li({
              "class": 'separator',
              outlet: 'separator'
            });
            _this.li({
              "class": 'code-highlights',
              outlet: 'codeHighlights'
            }, 'code-highlights');
            return _this.li({
              "class": 'absolute-mode',
              outlet: 'absoluteMode'
            }, 'absolute-mode');
          });
          return _this.div({
            "class": 'btn-group'
          }, function() {
            _this.button({
              "class": 'btn btn-default',
              outlet: 'onLeftButton'
            }, 'On Left');
            return _this.button({
              "class": 'btn btn-default',
              outlet: 'onRightButton'
            }, 'On Right');
          });
        };
      })(this));
    };

    MinimapQuickSettingsElement.prototype.selectedItem = null;

    MinimapQuickSettingsElement.prototype.setModel = function(minimap) {
      this.minimap = minimap;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.plugins = {};
      this.itemsActions = new WeakMap;
      this.subscriptions.add(Main.onDidAddPlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.addItemFor(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Main.onDidRemovePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.removeItemFor(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Main.onDidActivatePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.activateItem(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Main.onDidDeactivatePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.deactivateItem(name, plugin);
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('minimap-quick-settings', {
        'core:move-up': (function(_this) {
          return function() {
            return _this.selectPreviousItem();
          };
        })(this),
        'core:move-down': (function(_this) {
          return function() {
            return _this.selectNextItem();
          };
        })(this),
        'core:move-left': function() {
          return atom.config.set('minimap.displayMinimapOnLeft', true);
        },
        'core:move-right': function() {
          return atom.config.set('minimap.displayMinimapOnLeft', false);
        },
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this),
        'core:confirm': (function(_this) {
          return function() {
            return _this.toggleSelectedItem();
          };
        })(this)
      }));
      this.codeHighlights.classList.toggle('active', this.minimap.displayCodeHighlights);
      this.subscriptions.add(this.subscribeTo(this.codeHighlights, {
        'mousedown': (function(_this) {
          return function(e) {
            e.preventDefault();
            return atom.config.set('minimap.displayCodeHighlights', !_this.minimap.displayCodeHighlights);
          };
        })(this)
      }));
      this.itemsActions.set(this.codeHighlights, (function(_this) {
        return function() {
          return atom.config.set('minimap.displayCodeHighlights', !_this.minimap.displayCodeHighlights);
        };
      })(this));
      this.subscriptions.add(this.subscribeTo(this.absoluteMode, {
        'mousedown': (function(_this) {
          return function(e) {
            e.preventDefault();
            return atom.config.set('minimap.absoluteMode', !atom.config.get('minimap.absoluteMode'));
          };
        })(this)
      }));
      this.itemsActions.set(this.absoluteMode, (function(_this) {
        return function() {
          return atom.config.set('minimap.absoluteMode', !atom.config.get('minimap.absoluteMode'));
        };
      })(this));
      this.subscriptions.add(this.subscribeTo(this.hiddenInput, {
        'focusout': (function(_this) {
          return function(e) {
            return _this.destroy();
          };
        })(this)
      }));
      this.subscriptions.add(this.subscribeTo(this.onLeftButton, {
        'mousedown': function(e) {
          e.preventDefault();
          return atom.config.set('minimap.displayMinimapOnLeft', true);
        }
      }));
      this.subscriptions.add(this.subscribeTo(this.onRightButton, {
        'mousedown': function(e) {
          e.preventDefault();
          return atom.config.set('minimap.displayMinimapOnLeft', false);
        }
      }));
      this.subscriptions.add(atom.config.observe('minimap.displayCodeHighlights', (function(_this) {
        return function(bool) {
          return _this.codeHighlights.classList.toggle('active', bool);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.absoluteMode', (function(_this) {
        return function(bool) {
          return _this.absoluteMode.classList.toggle('active', bool);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.displayMinimapOnLeft', (function(_this) {
        return function(bool) {
          _this.onLeftButton.classList.toggle('selected', bool);
          return _this.onRightButton.classList.toggle('selected', !bool);
        };
      })(this)));
      return this.initList();
    };

    MinimapQuickSettingsElement.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    MinimapQuickSettingsElement.prototype.attach = function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.appendChild(this);
      return this.hiddenInput.focus();
    };

    MinimapQuickSettingsElement.prototype.destroy = function() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      return this.parentNode.removeChild(this);
    };

    MinimapQuickSettingsElement.prototype.initList = function() {
      var name, plugin, _ref2, _results;
      this.itemsDisposables = new WeakMap;
      _ref2 = Main.plugins;
      _results = [];
      for (name in _ref2) {
        plugin = _ref2[name];
        _results.push(this.addItemFor(name, plugin));
      }
      return _results;
    };

    MinimapQuickSettingsElement.prototype.toggleSelectedItem = function() {
      var _base;
      return typeof (_base = this.itemsActions.get(this.selectedItem)) === "function" ? _base() : void 0;
    };

    MinimapQuickSettingsElement.prototype.selectNextItem = function() {
      this.selectedItem.classList.remove('selected');
      if (this.selectedItem.nextSibling != null) {
        this.selectedItem = this.selectedItem.nextSibling;
        if (this.selectedItem.matches('.separator')) {
          this.selectedItem = this.selectedItem.nextSibling;
        }
      } else {
        this.selectedItem = this.list.firstChild;
      }
      return this.selectedItem.classList.add('selected');
    };

    MinimapQuickSettingsElement.prototype.selectPreviousItem = function() {
      this.selectedItem.classList.remove('selected');
      if (this.selectedItem.previousSibling != null) {
        this.selectedItem = this.selectedItem.previousSibling;
        if (this.selectedItem.matches('.separator')) {
          this.selectedItem = this.selectedItem.previousSibling;
        }
      } else {
        this.selectedItem = this.list.lastChild;
      }
      return this.selectedItem.classList.add('selected');
    };

    MinimapQuickSettingsElement.prototype.addItemFor = function(name, plugin) {
      var action, item;
      item = document.createElement('li');
      if (plugin.isActive()) {
        item.classList.add('active');
      }
      item.textContent = name;
      action = (function(_this) {
        return function() {
          return Main.togglePluginActivation(name);
        };
      })(this);
      this.itemsActions.set(item, action);
      this.itemsDisposables.set(item, this.addDisposableEventListener(item, 'mousedown', (function(_this) {
        return function(e) {
          e.preventDefault();
          return action();
        };
      })(this)));
      this.plugins[name] = item;
      this.list.insertBefore(item, this.separator);
      if (this.selectedItem == null) {
        this.selectedItem = item;
        return this.selectedItem.classList.add('selected');
      }
    };

    MinimapQuickSettingsElement.prototype.removeItemFor = function(name, plugin) {
      try {
        this.list.removeChild(this.plugins[name]);
      } catch (_error) {}
      return delete this.plugins[name];
    };

    MinimapQuickSettingsElement.prototype.activateItem = function(name, plugin) {
      return this.plugins[name].classList.add('active');
    };

    MinimapQuickSettingsElement.prototype.deactivateItem = function(name, plugin) {
      return this.plugins[name].classList.remove('active');
    };

    return MinimapQuickSettingsElement;

  })();

  module.exports = MinimapQuickSettingsElement = registerOrUpdateElement('minimap-quick-settings', MinimapQuickSettingsElement.prototype);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC1xdWljay1zZXR0aW5ncy1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvSUFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsT0FBMkQsT0FBQSxDQUFRLFlBQVIsQ0FBM0QsRUFBQywrQkFBQSx1QkFBRCxFQUEwQix3QkFBQSxnQkFBMUIsRUFBNEMsbUJBQUEsV0FBNUMsQ0FBQTs7QUFBQSxFQUNBLFFBQWlDLE9BQUEsQ0FBUSxXQUFSLENBQWpDLEVBQUMsNEJBQUEsbUJBQUQsRUFBc0IsZ0JBQUEsT0FEdEIsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUhQLENBQUE7O0FBQUEsRUFPTTs7O0tBQ0o7O0FBQUEsSUFBQSxXQUFXLENBQUMsV0FBWixDQUF3QiwyQkFBeEIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsMkJBQTdCLENBREEsQ0FBQTs7QUFBQSxJQUdBLDJCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxpREFBUDtPQUFMLEVBQStELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDN0QsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsWUFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLFlBQWMsT0FBQSxFQUFPLGNBQXJCO0FBQUEsWUFBcUMsTUFBQSxFQUFRLGFBQTdDO1dBQVAsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxPQUFBLEVBQU8sd0JBQVA7QUFBQSxZQUFpQyxNQUFBLEVB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap-quick-settings-element.coffee

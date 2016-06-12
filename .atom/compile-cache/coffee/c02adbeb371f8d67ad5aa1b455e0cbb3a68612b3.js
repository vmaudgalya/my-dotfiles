(function() {
  var CompositeDisposable, Emitter, EventsDelegation, Main, MinimapQuickSettingsElement, SpacePenDSL, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-utils'), EventsDelegation = _ref.EventsDelegation, SpacePenDSL = _ref.SpacePenDSL;

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Emitter = _ref1.Emitter;

  Main = require('./main');

  module.exports = MinimapQuickSettingsElement = (function(_super) {
    __extends(MinimapQuickSettingsElement, _super);

    function MinimapQuickSettingsElement() {
      this.toggleSelectedItem = __bind(this.toggleSelectedItem, this);
      return MinimapQuickSettingsElement.__super__.constructor.apply(this, arguments);
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

  })(HTMLElement);

  module.exports = MinimapQuickSettingsElement = document.registerElement('minimap-quick-settings', {
    prototype: MinimapQuickSettingsElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC1xdWljay1zZXR0aW5ncy1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyR0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQWtDLE9BQUEsQ0FBUSxZQUFSLENBQWxDLEVBQUMsd0JBQUEsZ0JBQUQsRUFBbUIsbUJBQUEsV0FBbkIsQ0FBQTs7QUFBQSxFQUNBLFFBQWlDLE9BQUEsQ0FBUSxXQUFSLENBQWpDLEVBQUMsNEJBQUEsbUJBQUQsRUFBc0IsZ0JBQUEsT0FEdEIsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUhQLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0RBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQVcsQ0FBQyxXQUFaLENBQXdCLDJCQUF4QixDQUFBLENBQUE7O0FBQUEsSUFDQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QiwyQkFBN0IsQ0FEQSxDQUFBOztBQUFBLElBR0EsMkJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGlEQUFQO09BQUwsRUFBK0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM3RCxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxZQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsWUFBYyxPQUFBLEVBQU8sY0FBckI7QUFBQSxZQUFxQyxNQUFBLEVBQVEsYUFBN0M7V0FBUCxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLE9BQUEsRUFBTyx3QkFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap-quick-settings-element.coffee

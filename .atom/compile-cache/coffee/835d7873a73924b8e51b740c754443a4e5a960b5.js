(function() {
  var BottomContainer, BottomStatus, BottomTab, CompositeDisposable, Emitter, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  BottomTab = require('./bottom-tab');

  BottomStatus = require('./bottom-status');

  BottomContainer = (function(_super) {
    __extends(BottomContainer, _super);

    function BottomContainer() {
      return BottomContainer.__super__.constructor.apply(this, arguments);
    }

    BottomContainer.prototype.prepare = function(state) {
      this.state = state;
      return this;
    };

    BottomContainer.prototype.createdCallback = function() {
      var Me, emitter, name, tab, _ref1;
      this.subscriptions = new CompositeDisposable;
      this.emitter = emitter = new Emitter;
      this.tabs = {
        Line: new BottomTab().prepare('Line'),
        File: new BottomTab().prepare('File'),
        Project: new BottomTab().prepare('Project')
      };
      this.status = new BottomStatus();
      Me = this;
      this.subscriptions.add(atom.config.observe('linter.statusIconScope', (function(_this) {
        return function(statusIconScope) {
          _this.statusIconScope = statusIconScope;
          return _this.status.count = _this.tabs[_this.statusIconScope].count;
        };
      })(this)));
      _ref1 = this.tabs;
      for (name in _ref1) {
        tab = _ref1[name];
        this.subscriptions.add(atom.config.onDidChange("linter.showErrorTab" + name, (function(_this) {
          return function() {
            return _this.updateTabs();
          };
        })(this)));
        tab.addEventListener('click', function() {
          if (Me.state.scope === this.name) {
            return emitter.emit('should-toggle-panel');
          } else {
            return emitter.emit('did-change-tab', this.name);
          }
        });
      }
      return this.onDidChangeTab((function(_this) {
        return function(activeName) {
          var _ref2, _results;
          _this.state.scope = activeName;
          _ref2 = _this.tabs;
          _results = [];
          for (name in _ref2) {
            tab = _ref2[name];
            _results.push(tab.active = name === activeName);
          }
          return _results;
        };
      })(this));
    };

    BottomContainer.prototype.attachedCallback = function() {
      return this.updateTabs();
    };

    BottomContainer.prototype.detachedCallback = function() {
      this.subscriptions.dispose();
      return this.emitter.dispose();
    };

    BottomContainer.prototype.setVisibility = function(value) {
      if (value) {
        return this.removeAttribute('hidden');
      } else {
        return this.setAttribute('hidden', true);
      }
    };

    BottomContainer.prototype.getVisibility = function() {
      return !this.hasAttribute('hidden');
    };

    BottomContainer.prototype.getTab = function(name) {
      return this.tabs[name];
    };

    BottomContainer.prototype.onDidChangeTab = function(callback) {
      return this.emitter.on('did-change-tab', callback);
    };

    BottomContainer.prototype.onShouldTogglePanel = function(callback) {
      return this.emitter.on('should-toggle-panel', callback);
    };

    BottomContainer.prototype.setCount = function(_arg) {
      var File, Line, Project;
      Project = _arg.Project, File = _arg.File, Line = _arg.Line;
      this.tabs.File.count = File;
      this.tabs.Project.count = Project;
      this.tabs.Line.count = Line;
      return this.status.count = this.tabs[this.statusIconScope].count;
    };

    BottomContainer.prototype.updateTabs = function() {
      var active, name, tab, _ref1;
      active = this.state.scope;
      _ref1 = this.tabs;
      for (name in _ref1) {
        tab = _ref1[name];
        if (tab.attached) {
          this.removeChild(tab);
        }
        tab.active = false;
        if (!atom.config.get("linter.showErrorTab" + name)) {
          continue;
        }
        this.appendChild(tab);
        if (active !== name) {
          continue;
        }
        tab.active = true;
        active = null;
      }
      this.appendChild(this.status);
      if (active === this.state.scope && this.firstChild && this.firstChild.name) {
        this.firstChild.active = true;
        return this.state.scope = this.firstChild.name;
      }
    };

    return BottomContainer;

  })(HTMLElement);

  module.exports = document.registerElement('linter-bottom-container', {
    prototype: BottomContainer.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tY29udGFpbmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSw0RUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixlQUFBLE9BQXRCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUhmLENBQUE7O0FBQUEsRUFLTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw4QkFBQSxPQUFBLEdBQVMsU0FBRSxLQUFGLEdBQUE7QUFDUCxNQURRLElBQUMsQ0FBQSxRQUFBLEtBQ1QsQ0FBQTtBQUFBLGFBQU8sSUFBUCxDQURPO0lBQUEsQ0FBVCxDQUFBOztBQUFBLDhCQUdBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSw2QkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLE9BQUEsR0FBVSxHQUFBLENBQUEsT0FEckIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUQsR0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFVLElBQUEsU0FBQSxDQUFBLENBQVcsQ0FBQyxPQUFaLENBQW9CLE1BQXBCLENBQVY7QUFBQSxRQUNBLElBQUEsRUFBVSxJQUFBLFNBQUEsQ0FBQSxDQUFXLENBQUMsT0FBWixDQUFvQixNQUFwQixDQURWO0FBQUEsUUFFQSxPQUFBLEVBQWEsSUFBQSxTQUFBLENBQUEsQ0FBVyxDQUFDLE9BQVos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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/ui/bottom-container.coffee

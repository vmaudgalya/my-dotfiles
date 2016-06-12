(function() {
  var TabsToSpaces;

  TabsToSpaces = null;

  module.exports = {
    config: {
      onSave: {
        type: 'string',
        "default": 'none',
        "enum": ['none', 'tabify', 'untabify'],
        description: 'Setting this to anything other than `none` can **significantly** impact the time it takes to save large files.'
      }
    },
    activate: function() {
      this.commands = atom.commands.add('atom-workspace', {
        'tabs-to-spaces:tabify': (function(_this) {
          return function() {
            _this.loadModule();
            return TabsToSpaces.tabify();
          };
        })(this),
        'tabs-to-spaces:untabify': (function(_this) {
          return function() {
            _this.loadModule();
            return TabsToSpaces.untabify();
          };
        })(this),
        'tabs-to-spaces:untabify-all': (function(_this) {
          return function() {
            _this.loadModule();
            return TabsToSpaces.untabifyAll();
          };
        })(this)
      });
      return this.editorObserver = atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.handleEvents(editor);
        };
      })(this));
    },
    deactivate: function() {
      this.commands.dispose();
      this.editorObserver.dispose();
      return TabsToSpaces = null;
    },
    handleEvents: function(editor) {
      return editor.getBuffer().onWillSave((function(_this) {
        return function() {
          if (editor.getPath() === atom.config.getUserConfigPath()) {
            return;
          }
          switch (atom.config.get('tabs-to-spaces.onSave', {
                scope: editor.getRootScopeDescriptor()
              })) {
            case 'untabify':
              _this.loadModule();
              return TabsToSpaces.untabify();
            case 'tabify':
              _this.loadModule();
              return TabsToSpaces.tabify();
          }
        };
      })(this));
    },
    loadModule: function() {
      return TabsToSpaces != null ? TabsToSpaces : TabsToSpaces = require('./tabs-to-spaces');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvdGFicy10by1zcGFjZXMvbGliL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLElBQWYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLE1BRFQ7QUFBQSxRQUVBLE1BQUEsRUFBTSxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLFVBQW5CLENBRk47QUFBQSxRQUdBLFdBQUEsRUFBYSxnSEFIYjtPQURGO0tBREY7QUFBQSxJQVFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNWO0FBQUEsUUFBQSx1QkFBQSxFQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUN2QixZQUFBLEtBQUMsQ0FBQSxVQUFELENBQUEsQ0FBQSxDQUFBO21CQUNBLFlBQVksQ0FBQyxNQUFiLENBQUEsRUFGdUI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QjtBQUFBLFFBSUEseUJBQUEsRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDekIsWUFBQSxLQUFDLENBQUEsVUFBRCxDQUFBLENBQUEsQ0FBQTttQkFDQSxZQUFZLENBQUMsUUFBYixDQUFBLEVBRnlCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKM0I7QUFBQSxRQVFBLDZCQUFBLEVBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQzdCLFlBQUEsS0FBQyxDQUFBLFVBQUQsQ0FBQSxDQUFBLENBQUE7bUJBQ0EsWUFBWSxDQUFDLFdBQWIsQ0FBQSxFQUY2QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUi9CO09BRFUsQ0FBWixDQUFBO2FBYUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQ2xELEtBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxFQURrRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBZFY7SUFBQSxDQVJWO0FBQUEsSUEwQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBYyxDQUFDLE9BQWhCLENBQUEsQ0FEQSxDQUFBO2FBSUEsWUFBQSxHQUFlLEtBTEw7SUFBQSxDQTFCWjtBQUFBLElBb0NBLFlBQUEsRUFBYyxTQUFDLE1BQUQsR0FBQTthQUNaLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxVQUFuQixDQUE4QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzVCLFVBQUEsSUFBVSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQUEsS0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBWixDQUFBLENBQTlCO0FBQUEsa0JBQUEsQ0FBQTtXQUFBO0FBRUEsa0JBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QztBQUFBLGdCQUFBLEtBQUEsRUFBTyxNQUFNLENBQUMsc0JBQVAsQ0FBQSxDQUFQO2VBQXpDLENBQVA7QUFBQSxpQkFDTyxVQURQO0FBRUksY0FBQSxLQUFDLENBQUEsVUFBRCxDQUFBLENBQUEsQ0FBQTtxQkFDQSxZQUFZLENBQUMsUUFBYixDQUFBLEVBSEo7QUFBQSxpQkFJTyxRQUpQO0FBS0ksY0FBQSxLQUFDLENBQUEsVUFBRCxDQUFBLENBQUEsQ0FBQTtxQkFDQSxZQUFZLENBQUMsTUFBYixDQUFBLEVBTko7QUFBQSxXQUg0QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLEVBRFk7SUFBQSxDQXBDZDtBQUFBLElBaURBLFVBQUEsRUFBWSxTQUFBLEdBQUE7b0NBQ1YsZUFBQSxlQUFnQixPQUFBLENBQVEsa0JBQVIsRUFETjtJQUFBLENBakRaO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/tabs-to-spaces/lib/index.coffee

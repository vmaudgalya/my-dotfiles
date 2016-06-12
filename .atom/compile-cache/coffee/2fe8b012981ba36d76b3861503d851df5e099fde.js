(function() {
  module.exports = {
    config: {
      colourlessIcons: {
        type: 'boolean',
        "default": true,
        description: "Tick to force colourless tab icons"
      }
    },
    activate: function(state) {
      var self, varKey;
      varKey = 'predawn-ui.colourlessIcons';
      self = this;
      atom.config.onDidChange(varKey, function(_arg) {
        var newValue, oldValue;
        newValue = _arg.newValue, oldValue = _arg.oldValue;
        return self.setColoured(newValue);
      });
      return this.setColoured(atom.config.get(varKey));
    },
    setColoured: function(enable) {
      var tabBar;
      tabBar = document.querySelector('.tab-bar');
      if (!enable) {
        return tabBar.className = tabBar.className.replace(/\scolourless-icons/, '');
      } else {
        return tabBar.className = tabBar.className + " " + 'colourless-icons';
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcHJlZGF3bi11aS9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLG9DQUZiO09BREY7S0FERjtBQUFBLElBS0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxZQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsNEJBQVQsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLElBRFAsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLE1BQXhCLEVBQWdDLFNBQUMsSUFBRCxHQUFBO0FBQzlCLFlBQUEsa0JBQUE7QUFBQSxRQURnQyxnQkFBQSxVQUFVLGdCQUFBLFFBQzFDLENBQUE7ZUFBQSxJQUFJLENBQUMsV0FBTCxDQUFpQixRQUFqQixFQUQ4QjtNQUFBLENBQWhDLENBRkEsQ0FBQTthQUlBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLE1BQWhCLENBQWIsRUFMUTtJQUFBLENBTFY7QUFBQSxJQVdBLFdBQUEsRUFBYSxTQUFDLE1BQUQsR0FBQTtBQUNYLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLFFBQVEsQ0FBQyxhQUFULENBQXVCLFVBQXZCLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFBLE1BQUg7ZUFDRSxNQUFNLENBQUMsU0FBUCxHQUFtQixNQUFNLENBQUMsU0FBUyxDQUFDLE9BQWpCLENBQXlCLG9CQUF6QixFQUErQyxFQUEvQyxFQURyQjtPQUFBLE1BQUE7ZUFHRSxNQUFNLENBQUMsU0FBUCxHQUFtQixNQUFNLENBQUMsU0FBUCxHQUFtQixHQUFuQixHQUF5QixtQkFIOUM7T0FGVztJQUFBLENBWGI7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/predawn-ui/index.coffee

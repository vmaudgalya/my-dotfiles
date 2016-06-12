(function() {
  module.exports = {
    view: null,
    activate: function() {
      var _TriggerKey, _command, _commands, _keymap, _linuxSelector, _macSelector, _triggerKey, _windowsSelector;
      this.view = (require('./ColorPicker-view'))();
      _command = 'color-picker:open';
      _triggerKey = (atom.config.get('color-picker.triggerKey')).toLowerCase();
      _TriggerKey = _triggerKey.toUpperCase();
      _macSelector = '.platform-darwin atom-workspace';
      _windowsSelector = '.platform-win32 atom-workspace';
      _linuxSelector = '.platform-linux atom-workspace';
      _keymap = {};
      _keymap["" + _macSelector] = {};
      _keymap["" + _macSelector]["cmd-" + _TriggerKey] = _command;
      _keymap["" + _windowsSelector] = {};
      _keymap["" + _windowsSelector]["ctrl-alt-" + _triggerKey] = _command;
      _keymap["" + _linuxSelector] = {};
      _keymap["" + _linuxSelector]["ctrl-alt-" + _triggerKey] = _command;
      atom.keymaps.add('color-picker:trigger', _keymap);
      atom.contextMenu.add({
        'atom-text-editor': [
          {
            label: 'Color Picker',
            command: _command
          }
        ]
      });
      _commands = {};
      _commands["" + _command] = (function(_this) {
        return function() {
          var _ref;
          if (!((_ref = _this.view) != null ? _ref.canOpen : void 0)) {
            return;
          }
          return _this.view.open();
        };
      })(this);
      atom.commands.add('atom-text-editor', _commands);
      return this.view.activate();
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.view) != null ? _ref.destroy() : void 0;
    },
    provideColorPicker: function() {
      return {
        open: (function(_this) {
          return function(Editor, Cursor) {
            var _ref;
            if (!((_ref = _this.view) != null ? _ref.canOpen : void 0)) {
              return;
            }
            return _this.view.open(Editor, Cursor);
          };
        })(this)
      };
    },
    config: {
      randomColor: {
        title: 'Serve a random color on open',
        description: 'If the Color Picker doesn\'t get an input color, it serves a completely random color.',
        type: 'boolean',
        "default": true
      },
      automaticReplace: {
        title: 'Automatically Replace Color',
        description: 'Replace selected color automatically on change. Works well with as-you-type CSS reloaders.',
        type: 'boolean',
        "default": false
      },
      abbreviateValues: {
        title: 'Abbreviate Color Values',
        description: 'If possible, abbreviate color values, like for example “0.3” to “.3”,  “#ffffff” to “#fff” and “rgb(0, 0, 0)” to “rgb(0,0,0)”.',
        type: 'boolean',
        "default": false
      },
      uppercaseColorValues: {
        title: 'Uppercase Color Values',
        description: 'If sensible, uppercase the color value. For example, “#aaa” becomes “#AAA”.',
        type: 'boolean',
        "default": false
      },
      preferredFormat: {
        title: 'Preferred Color Format',
        description: 'On open, the Color Picker will show a color in this format.',
        type: 'string',
        "enum": ['RGB', 'HEX', 'HSL', 'HSV', 'VEC'],
        "default": 'RGB'
      },
      triggerKey: {
        title: 'Trigger key',
        description: 'Decide what trigger key should open the Color Picker. `CMD-SHIFT-{TRIGGER_KEY}` and `CTRL-ALT-{TRIGGER_KEY}`. Requires a restart.',
        type: 'string',
        "enum": ['C', 'E', 'H', 'K'],
        "default": 'C'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9Db2xvclBpY2tlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFJSTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixVQUFBLHNHQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLENBQUMsT0FBQSxDQUFRLG9CQUFSLENBQUQsQ0FBQSxDQUFBLENBQVIsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLG1CQURYLENBQUE7QUFBQSxNQUtBLFdBQUEsR0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBRCxDQUEyQyxDQUFDLFdBQTVDLENBQUEsQ0FMZCxDQUFBO0FBQUEsTUFNQSxXQUFBLEdBQWMsV0FBVyxDQUFDLFdBQVosQ0FBQSxDQU5kLENBQUE7QUFBQSxNQVNBLFlBQUEsR0FBZSxpQ0FUZixDQUFBO0FBQUEsTUFVQSxnQkFBQSxHQUFtQixnQ0FWbkIsQ0FBQTtBQUFBLE1BV0EsY0FBQSxHQUFpQixnQ0FYakIsQ0FBQTtBQUFBLE1BYUEsT0FBQSxHQUFVLEVBYlYsQ0FBQTtBQUFBLE1BZ0JBLE9BQVEsQ0FBQSxFQUFBLEdBQW5CLFlBQW1CLENBQVIsR0FBK0IsRUFoQi9CLENBQUE7QUFBQSxNQWlCQSxPQUFRLENBQUEsRUFBQSxHQUFuQixZQUFtQixDQUFxQixDQUFDLE1BQUEsR0FBekMsV0FBd0MsQ0FBN0IsR0FBdUQsUUFqQnZELENBQUE7QUFBQSxNQW1CQSxPQUFRLENBQUEsRUFBQSxHQUFuQixnQkFBbUIsQ0FBUixHQUFtQyxFQW5CbkMsQ0FBQTtBQUFBLE1Bb0JBLE9BQVEsQ0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/ColorPicker.coffee

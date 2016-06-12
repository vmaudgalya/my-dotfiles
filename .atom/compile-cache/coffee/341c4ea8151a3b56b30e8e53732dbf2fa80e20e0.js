(function() {
  module.exports = {
    analytics: {
      title: 'Anonymous Analytics',
      type: 'boolean',
      "default": true,
      description: "There is [Segment.io](https://segment.io/) which forwards data to [Google Analytics](http://www.google.com/analytics/) to track what languages are being used the most, as well as other stats. Everything is anonymized and no personal information, such as source code, is sent. See https://github.com/Glavin001/atom-beautify/issues/47 for more details."
    },
    _analyticsUserId: {
      title: 'Analytics User Id',
      type: 'string',
      "default": "",
      description: "Unique identifier for this user for tracking usage analytics"
    },
    _loggerLevel: {
      title: "Logger Level",
      type: 'string',
      "default": 'warn',
      description: 'Set the level for the logger',
      "enum": ['verbose', 'debug', 'info', 'warn', 'error']
    },
    beautifyEntireFileOnSave: {
      title: "Beautify Entire File On Save",
      type: 'boolean',
      "default": true,
      description: "When beautifying on save, use the entire file, even if there is selected text in the editor"
    },
    muteUnsupportedLanguageErrors: {
      title: "Mute Unsupported Language Errors",
      type: 'boolean',
      "default": false,
      description: "Do not show \"Unsupported Language\" errors when they occur"
    },
    muteAllErrors: {
      title: "Mute All Errors",
      type: 'boolean',
      "default": false,
      description: "Do not show any/all errors when they occur"
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvY29uZmlnLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQ2YsU0FBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8scUJBQVA7QUFBQSxNQUNBLElBQUEsRUFBTyxTQURQO0FBQUEsTUFFQSxTQUFBLEVBQVUsSUFGVjtBQUFBLE1BR0EsV0FBQSxFQUFjLGdXQUhkO0tBRmE7QUFBQSxJQVVmLGdCQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxtQkFBUDtBQUFBLE1BQ0EsSUFBQSxFQUFPLFFBRFA7QUFBQSxNQUVBLFNBQUEsRUFBVSxFQUZWO0FBQUEsTUFHQSxXQUFBLEVBQWMsOERBSGQ7S0FYYTtBQUFBLElBZWYsWUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sY0FBUDtBQUFBLE1BQ0EsSUFBQSxFQUFPLFFBRFA7QUFBQSxNQUVBLFNBQUEsRUFBVSxNQUZWO0FBQUEsTUFHQSxXQUFBLEVBQWMsOEJBSGQ7QUFBQSxNQUlBLE1BQUEsRUFBTyxDQUFDLFNBQUQsRUFBWSxPQUFaLEVBQXFCLE1BQXJCLEVBQTZCLE1BQTdCLEVBQXFDLE9BQXJDLENBSlA7S0FoQmE7QUFBQSxJQXFCZix3QkFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sOEJBQVA7QUFBQSxNQUNBLElBQUEsRUFBTyxTQURQO0FBQUEsTUFFQSxTQUFBLEVBQVUsSUFGVjtBQUFBLE1BR0EsV0FBQSxFQUFjLDZGQUhkO0tBdEJhO0FBQUEsSUEwQmYsNkJBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLGtDQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU8sU0FEUDtBQUFBLE1BRUEsU0FBQSxFQUFVLEtBRlY7QUFBQSxNQUdBLFdBQUEsRUFBYyw2REFIZDtLQTNCYTtBQUFBLElBK0JmLGFBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU8sU0FEUDtBQUFBLE1BRUEsU0FBQSxFQUFVLEtBRlY7QUFBQSxNQUdBLFdBQUEsRUFBYyw0Q0FIZDtLQWhDYTtHQUFqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/config.coffee

(function() {
  module.exports = {
    config: {
      additionalGrammars: {
        title: 'Additional Grammars',
        description: 'Comma delimited list of grammar names, other than HTML and PHP, to apply this plugin to. Use "*" to run for all grammars.',
        type: 'array',
        "default": []
      },
      forceInline: {
        title: 'Force Inline',
        description: 'Elements in this comma delimited list will render their closing tags on the same line, even if they are block by default',
        type: 'array',
        "default": ['title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      },
      forceBlock: {
        title: 'Force Block',
        description: 'Elements in this comma delimited list will render their closing tags after a tabbed line, even if they are inline by default',
        type: 'array',
        "default": ['head']
      },
      neverClose: {
        title: 'Never Close Elements',
        description: 'Comma delimited list of elements to never close',
        type: 'array',
        "default": ['br', 'hr', 'img', 'input', 'link', 'meta', 'area', 'base', 'col', 'command', 'embed', 'keygen', 'param', 'source', 'track', 'wbr']
      },
      makNeverCloseeSelfClosing: {
        title: 'Make Never Close Elements Self-Closing',
        description: 'Closes elements with " />" (ie <br> becomes <br />)',
        type: 'boolean',
        "default": true
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXV0b2Nsb3NlLWh0bWwvbGliL2NvbmZpZ3VyYXRpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLE1BQUEsRUFDSTtBQUFBLE1BQUEsa0JBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLHFCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsMkhBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsRUFIVDtPQURKO0FBQUEsTUFNQSxXQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsMEhBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsQ0FBQyxPQUFELEVBQVUsSUFBVixFQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUFrQyxJQUFsQyxFQUF3QyxJQUF4QyxDQUhUO09BUEo7QUFBQSxNQVdBLFVBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLGFBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSw4SEFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxDQUFDLE1BQUQsQ0FIVDtPQVpKO0FBQUEsTUFnQkEsVUFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8sc0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxpREFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsS0FBYixFQUFvQixPQUFwQixFQUE2QixNQUE3QixFQUFxQyxNQUFyQyxFQUE2QyxNQUE3QyxFQUFxRCxNQUFyRCxFQUE2RCxLQUE3RCxFQUFvRSxTQUFwRSxFQUErRSxPQUEvRSxFQUF3RixRQUF4RixFQUFrRyxPQUFsRyxFQUEyRyxRQUEzRyxFQUFxSCxPQUFySCxFQUE4SCxLQUE5SCxDQUhUO09BakJKO0FBQUEsTUFxQkEseUJBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLHdDQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEscURBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsSUFIVDtPQXRCSjtLQURKO0dBREosQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/autoclose-html/lib/configuration.coffee

(function() {
  module.exports = {
    allowLocalOverride: {
      description: 'Allow .languagebabel files to overide the settings below. Useful for project based configurations.',
      type: 'boolean',
      "default": false,
      order: 30
    },
    transpileOnSave: {
      description: 'Check source code validity on file save. Use "Create Transpiled Code" option below to save file.',
      type: 'boolean',
      "default": false,
      order: 40
    },
    createTranspiledCode: {
      description: 'Save transpiled code to Babel Transpile Path below.',
      type: 'boolean',
      "default": false,
      order: 50
    },
    disableWhenNoBabelrcFileInPath: {
      description: 'Suppress transpile when no .babelrc file is in source file path.',
      type: 'boolean',
      "default": true,
      order: 60
    },
    suppressTranspileOnSaveMessages: {
      description: 'Suppress non-error notification messages on each save.',
      type: 'boolean',
      "default": true,
      order: 70
    },
    suppressSourcePathMessages: {
      description: 'Suppress messages about file not being inside Babel Source Path.',
      type: 'boolean',
      "default": true,
      order: 75
    },
    createMap: {
      description: 'Create seperate map file.',
      type: 'boolean',
      "default": false,
      order: 80
    },
    babelMapsAddUrl: {
      description: 'Append map file name to transpiled output if "Create seperate map file" is set.',
      type: 'boolean',
      "default": true,
      order: 90
    },
    babelSourcePath: {
      description: 'Babel Source Root based on Project root.',
      type: 'string',
      "default": '',
      order: 100
    },
    babelTranspilePath: {
      description: 'Babel Transpile Root based on Project root.',
      type: 'string',
      "default": '',
      order: 120
    },
    babelMapsPath: {
      description: 'Babel Maps Root based on Project root.',
      type: 'string',
      "default": '',
      order: 130
    },
    createTargetDirectories: {
      description: 'Create transpile output target directories.',
      type: 'boolean',
      "default": true,
      order: 140
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsa0JBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLG9HQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxFQUhQO0tBREY7QUFBQSxJQUtBLGVBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLGtHQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxFQUhQO0tBTkY7QUFBQSxJQVVBLG9CQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSxxREFBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtLQVhGO0FBQUEsSUFlQSw4QkFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsa0VBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsSUFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7S0FoQkY7QUFBQSxJQW9CQSwrQkFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsd0RBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsSUFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7S0FyQkY7QUFBQSxJQXlCQSwwQkFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsa0VBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsSUFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7S0ExQkY7QUFBQSxJQThCQSxTQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSwyQkFBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtLQS9CRjtBQUFBLElBbUNBLGVBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLGlGQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLElBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxFQUhQO0tBcENGO0FBQUEsSUF3Q0EsZUFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsMENBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsRUFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEdBSFA7S0F6Q0Y7QUFBQSxJQTZDQSxrQkFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsNkNBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsRUFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEdBSFA7S0E5Q0Y7QUFBQSxJQWtEQSxhQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSx3Q0FBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxFQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sR0FIUDtLQW5ERjtBQUFBLElBdURBLHVCQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSw2Q0FBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxJQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sR0FIUDtLQXhERjtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/config.coffee

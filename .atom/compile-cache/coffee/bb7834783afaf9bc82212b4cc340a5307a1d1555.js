(function() {
  var ColorContext, ColorParser, ColorSearch, Emitter, Minimatch, path, registry;

  path = require('path');

  Emitter = require('atom').Emitter;

  Minimatch = require('minimatch').Minimatch;

  registry = require('./color-expressions');

  ColorParser = require('./color-parser');

  ColorContext = require('./color-context');

  module.exports = ColorSearch = (function() {
    function ColorSearch(options) {
      var error, ignore, ignoredNames, _i, _len;
      if (options == null) {
        options = {};
      }
      this.sourceNames = options.sourceNames, ignoredNames = options.ignoredNames, this.context = options.context;
      this.emitter = new Emitter;
      if (this.context == null) {
        this.context = new ColorContext({
          registry: registry
        });
      }
      this.parser = this.context.parser;
      this.variables = this.context.getVariables();
      if (this.sourceNames == null) {
        this.sourceNames = [];
      }
      if (ignoredNames == null) {
        ignoredNames = [];
      }
      this.ignoredNames = [];
      for (_i = 0, _len = ignoredNames.length; _i < _len; _i++) {
        ignore = ignoredNames[_i];
        if (ignore != null) {
          try {
            this.ignoredNames.push(new Minimatch(ignore, {
              matchBase: true,
              dot: true
            }));
          } catch (_error) {
            error = _error;
            console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
          }
        }
      }
    }

    ColorSearch.prototype.onDidFindMatches = function(callback) {
      return this.emitter.on('did-find-matches', callback);
    };

    ColorSearch.prototype.onDidCompleteSearch = function(callback) {
      return this.emitter.on('did-complete-search', callback);
    };

    ColorSearch.prototype.search = function() {
      var promise, re, results;
      re = new RegExp(registry.getRegExp());
      results = [];
      promise = atom.workspace.scan(re, {
        paths: this.sourceNames
      }, (function(_this) {
        return function(m) {
          var newMatches, relativePath, result, scope, _i, _len, _ref, _ref1;
          relativePath = atom.project.relativize(m.filePath);
          scope = path.extname(relativePath);
          if (_this.isIgnored(relativePath)) {
            return;
          }
          newMatches = [];
          _ref = m.matches;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            result = _ref[_i];
            result.color = _this.parser.parse(result.matchText, scope);
            if (!((_ref1 = result.color) != null ? _ref1.isValid() : void 0)) {
              continue;
            }
            if (result.range[0] == null) {
              console.warn("Color search returned a result with an invalid range", result);
              continue;
            }
            result.range[0][1] += result.matchText.indexOf(result.color.colorExpression);
            result.matchText = result.color.colorExpression;
            results.push(result);
            newMatches.push(result);
          }
          m.matches = newMatches;
          if (m.matches.length > 0) {
            return _this.emitter.emit('did-find-matches', m);
          }
        };
      })(this));
      return promise.then((function(_this) {
        return function() {
          _this.results = results;
          return _this.emitter.emit('did-complete-search', results);
        };
      })(this));
    };

    ColorSearch.prototype.isIgnored = function(relativePath) {
      var ignoredName, _i, _len, _ref;
      _ref = this.ignoredNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ignoredName = _ref[_i];
        if (ignoredName.match(relativePath)) {
          return true;
        }
      }
    };

    return ColorSearch;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXNlYXJjaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEVBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0MsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BREQsQ0FBQTs7QUFBQSxFQUVDLFlBQWEsT0FBQSxDQUFRLFdBQVIsRUFBYixTQUZELENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHFCQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FKZCxDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUxmLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBQyxPQUFELEdBQUE7QUFDWCxVQUFBLHFDQUFBOztRQURZLFVBQVE7T0FDcEI7QUFBQSxNQUFDLElBQUMsQ0FBQSxzQkFBQSxXQUFGLEVBQWUsdUJBQUEsWUFBZixFQUE2QixJQUFDLENBQUEsa0JBQUEsT0FBOUIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FEWCxDQUFBOztRQUVBLElBQUMsQ0FBQSxVQUFlLElBQUEsWUFBQSxDQUFhO0FBQUEsVUFBQyxVQUFBLFFBQUQ7U0FBYjtPQUZoQjtBQUFBLE1BR0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BSG5CLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsQ0FKYixDQUFBOztRQUtBLElB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-search.coffee

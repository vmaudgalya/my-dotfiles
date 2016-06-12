(function() {
  var ColorContext, ColorParser, ColorSearch, Emitter, Minimatch, registry, scopeFromFileName;

  Emitter = require('atom').Emitter;

  Minimatch = require('minimatch').Minimatch;

  registry = require('./color-expressions');

  ColorParser = require('./color-parser');

  ColorContext = require('./color-context');

  scopeFromFileName = require('./scope-from-file-name');

  module.exports = ColorSearch = (function() {
    ColorSearch.deserialize = function(state) {
      return new ColorSearch(state.options);
    };

    function ColorSearch(options) {
      var error, ignore, ignoredNames, _i, _len, _ref;
      this.options = options != null ? options : {};
      _ref = this.options, this.sourceNames = _ref.sourceNames, ignoredNames = _ref.ignoredNames, this.context = _ref.context;
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

    ColorSearch.prototype.getTitle = function() {
      return 'Pigments Find Results';
    };

    ColorSearch.prototype.getURI = function() {
      return 'pigments://search';
    };

    ColorSearch.prototype.getIconName = function() {
      return "pigments";
    };

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
          scope = scopeFromFileName(relativePath);
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

    ColorSearch.prototype.serialize = function() {
      return {
        deserializer: 'ColorSearch',
        options: this.options
      };
    };

    return ColorSearch;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXNlYXJjaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUZBQUE7O0FBQUEsRUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBQ0MsWUFBYSxPQUFBLENBQVEsV0FBUixFQUFiLFNBREQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEscUJBQVIsQ0FGWCxDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUhkLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQUxwQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsV0FBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEtBQUQsR0FBQTthQUFlLElBQUEsV0FBQSxDQUFZLEtBQUssQ0FBQyxPQUFsQixFQUFmO0lBQUEsQ0FBZCxDQUFBOztBQUVhLElBQUEscUJBQUUsT0FBRixHQUFBO0FBQ1gsVUFBQSwyQ0FBQTtBQUFBLE1BRFksSUFBQyxDQUFBLDRCQUFBLFVBQVEsRUFDckIsQ0FBQTtBQUFBLE1BQUEsT0FBeUMsSUFBQyxDQUFBLE9BQTFDLEVBQUMsSUFBQyxDQUFBLG1CQUFBLFdBQUYsRUFBZSxvQkFBQSxZQUFmLEVBQTZCLElBQUMsQ0FBQSxlQUFBLE9BQTlCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BRFgsQ0FBQTs7UUFFQSxJQUFDLENBQUEsVUFBZSxJQUFBLFlBQUEsQ0FBYTtBQUFBLFVBQUMsVUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-search.coffee

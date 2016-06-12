(function() {
  var GitRepository, Minimatch, PathLoader, PathsChunkSize, async, fs, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  async = require('async');

  fs = require('fs');

  path = require('path');

  GitRepository = require('atom').GitRepository;

  Minimatch = require('minimatch').Minimatch;

  PathsChunkSize = 100;

  PathLoader = (function() {
    function PathLoader(rootPath, config) {
      var ignoreVcsIgnores, repo;
      this.rootPath = rootPath;
      this.timestamp = config.timestamp, this.sourceNames = config.sourceNames, ignoreVcsIgnores = config.ignoreVcsIgnores, this.traverseSymlinkDirectories = config.traverseSymlinkDirectories, this.ignoredNames = config.ignoredNames, this.knownPaths = config.knownPaths;
      if (this.knownPaths == null) {
        this.knownPaths = [];
      }
      this.paths = [];
      this.lostPaths = [];
      this.scannedPaths = [];
      this.repo = null;
      if (ignoreVcsIgnores) {
        repo = GitRepository.open(this.rootPath, {
          refreshOnWindowFocus: false
        });
        if ((repo != null ? repo.relativize(path.join(this.rootPath, 'test')) : void 0) === 'test') {
          this.repo = repo;
        }
      }
    }

    PathLoader.prototype.load = function(done) {
      return this.loadPath(this.rootPath, (function(_this) {
        return function() {
          var p, _i, _len, _ref, _ref1;
          _ref = _this.knownPaths;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            p = _ref[_i];
            if (__indexOf.call(_this.scannedPaths, p) < 0 && p.indexOf(_this.rootPath) === 0) {
              _this.lostPaths.push(p);
            }
          }
          _this.flushPaths();
          if ((_ref1 = _this.repo) != null) {
            _ref1.destroy();
          }
          return done();
        };
      })(this));
    };

    PathLoader.prototype.isSource = function(loadedPath) {
      var relativePath, sourceName, _i, _len, _ref;
      relativePath = path.relative(this.rootPath, loadedPath);
      _ref = this.sourceNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sourceName = _ref[_i];
        if (sourceName.match(relativePath)) {
          return true;
        }
      }
    };

    PathLoader.prototype.isIgnored = function(loadedPath, stats) {
      var ignoredName, relativePath, _i, _len, _ref, _ref1;
      relativePath = path.relative(this.rootPath, loadedPath);
      if ((_ref = this.repo) != null ? _ref.isPathIgnored(relativePath) : void 0) {
        return true;
      } else {
        _ref1 = this.ignoredNames;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ignoredName = _ref1[_i];
          if (ignoredName.match(relativePath)) {
            return true;
          }
        }
        return false;
      }
    };

    PathLoader.prototype.isKnown = function(loadedPath) {
      return __indexOf.call(this.knownPaths, loadedPath) >= 0;
    };

    PathLoader.prototype.hasChanged = function(loadedPath, stats) {
      if (stats && (this.timestamp != null)) {
        return stats.ctime >= this.timestamp;
      } else {
        return false;
      }
    };

    PathLoader.prototype.pathLoaded = function(loadedPath, stats, done) {
      this.scannedPaths.push(loadedPath);
      if (this.isSource(loadedPath) && !this.isIgnored(loadedPath, stats)) {
        if (this.isKnown(loadedPath)) {
          if (this.hasChanged(loadedPath, stats)) {
            this.paths.push(loadedPath);
          }
        } else {
          this.paths.push(loadedPath);
        }
      } else {
        if (__indexOf.call(this.knownPaths, loadedPath) >= 0) {
          this.lostPaths.push(loadedPath);
        }
      }
      if (this.paths.length + this.lostPaths.length === PathsChunkSize) {
        this.flushPaths();
      }
      return done();
    };

    PathLoader.prototype.flushPaths = function() {
      if (this.paths.length) {
        emit('load-paths:paths-found', this.paths);
      }
      if (this.lostPaths.length) {
        emit('load-paths:paths-lost', this.lostPaths);
      }
      this.paths = [];
      return this.lostPaths = [];
    };

    PathLoader.prototype.loadPath = function(pathToLoad, done) {
      if (this.isIgnored(pathToLoad)) {
        return done();
      }
      return fs.lstat(pathToLoad, (function(_this) {
        return function(error, stats) {
          if (error != null) {
            return done();
          }
          if (stats.isSymbolicLink()) {
            return fs.stat(pathToLoad, function(error, stats) {
              if (error != null) {
                return done();
              }
              if (stats.isFile()) {
                return _this.pathLoaded(pathToLoad, stats, done);
              } else if (stats.isDirectory()) {
                if (_this.traverseSymlinkDirectories) {
                  return _this.loadFolder(pathToLoad, done);
                } else {
                  return done();
                }
              }
            });
          } else if (stats.isDirectory()) {
            return _this.loadFolder(pathToLoad, done);
          } else if (stats.isFile()) {
            return _this.pathLoaded(pathToLoad, stats, done);
          } else {
            return done();
          }
        };
      })(this));
    };

    PathLoader.prototype.loadFolder = function(folderPath, done) {
      return fs.readdir(folderPath, (function(_this) {
        return function(error, children) {
          if (children == null) {
            children = [];
          }
          return async.each(children, function(childName, next) {
            return _this.loadPath(path.join(folderPath, childName), next);
          }, done);
        };
      })(this));
    };

    return PathLoader;

  })();

  module.exports = function(config) {
    var error, ignore, newConf, source, _i, _j, _len, _len1, _ref, _ref1;
    newConf = {
      ignoreVcsIgnores: config.ignoreVcsIgnores,
      traverseSymlinkDirectories: config.traverseSymlinkDirectories,
      knownPaths: config.knownPaths,
      ignoredNames: [],
      sourceNames: []
    };
    if (config.timestamp != null) {
      newConf.timestamp = new Date(Date.parse(config.timestamp));
    }
    _ref = config.sourceNames;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      source = _ref[_i];
      if (source) {
        try {
          newConf.sourceNames.push(new Minimatch(source, {
            matchBase: true,
            dot: true
          }));
        } catch (_error) {
          error = _error;
          console.warn("Error parsing source pattern (" + source + "): " + error.message);
        }
      }
    }
    _ref1 = config.ignoredNames;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      ignore = _ref1[_j];
      if (ignore) {
        try {
          newConf.ignoredNames.push(new Minimatch(ignore, {
            matchBase: true,
            dot: true
          }));
        } catch (_error) {
          error = _error;
          console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
        }
      }
    }
    return async.each(config.paths, function(rootPath, next) {
      return new PathLoader(rootPath, newConf).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL2xvYWQtcGF0aHMtaGFuZGxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUVBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdDLGdCQUFpQixPQUFBLENBQVEsTUFBUixFQUFqQixhQUhELENBQUE7O0FBQUEsRUFJQyxZQUFhLE9BQUEsQ0FBUSxXQUFSLEVBQWIsU0FKRCxDQUFBOztBQUFBLEVBTUEsY0FBQSxHQUFpQixHQU5qQixDQUFBOztBQUFBLEVBUU07QUFDVSxJQUFBLG9CQUFFLFFBQUYsRUFBWSxNQUFaLEdBQUE7QUFDWixVQUFBLHNCQUFBO0FBQUEsTUFEYSxJQUFDLENBQUEsV0FBQSxRQUNkLENBQUE7QUFBQSxNQUFDLElBQUMsQ0FBQSxtQkFBQSxTQUFGLEVBQWEsSUFBQyxDQUFBLHFCQUFBLFdBQWQsRUFBMkIsMEJBQUEsZ0JBQTNCLEVBQTZDLElBQUMsQ0FBQSxvQ0FBQSwwQkFBOUMsRUFBMEUsSUFBQyxDQUFBLHNCQUFBLFlBQTNFLEVBQXlGLElBQUMsQ0FBQSxvQkFBQSxVQUExRixDQUFBOztRQUVBLElBQUMsQ0FBQSxhQUFjO09BRmY7QUFBQSxNQUdBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFIVCxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBSmIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsRUFMaEIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQVBSLENBQUE7QUFRQSxNQUFBLElBQUcsZ0JBQUg7QUFDRSxRQUFBLElBQUEsR0FBTyxhQUFhLENBQUMsSUFBZCxDQUFtQixJQUFDLENBQUEsUUFBcEIsRUFBOEI7QUFBQSxVQUFBLG9CQUFBLEVBQXNCLEtBQXRCO1NBQTlCLENBQVAsQ0FBQTtBQUNBLFFBQUEsb0JBQWdCLElBQUksQ0FBRSxVQUFOLENBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLFFBQVgsRUFBcUIsTUFBckIsQ0FBakIsV0FBQSxLQUFrRCxNQUFsRTtBQUFBLFVBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFSLENBQUE7U0FGRjtPQVRZO0lBQUEsQ0FBZDs7QUFBQSx5QkFhQSxJQUFBLEdBQU0sU0FBQyxJQUFELEdBQUE7YUFDSixJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxRQUFYLEVBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDbkIsY0FBQSx3QkFBQTtBQUFBO0FBQUEsZUFBQSwyQ0FBQTt5QkFBQTtBQUNFLFlBQUEsSUFBRyxlQUFTLEtBQUMsQ0FBQSxZQUFWLEVBQUEsQ0FBQSxLQUFBLElBQTJCLENBQUMsQ0FBQyxPQUFGLENBQVUsS0FBQyxDQUFBLFFBQVgsQ0FBQSxLQUF3QixDQUF0RDtBQUNFLGNBQUEsS0FBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLENBQWhCLENBQUEsQ0FERjthQURGO0FBQUEsV0FBQTtBQUFBLFVBSUEsS0FBQyxDQUFBLFVBQUQsQ0FBQSxDQUpBLENBQUE7O2lCQUtLLENBQUUsT0FBUCxDQUFBO1dBTEE7aUJBTUEsSUFBQSxDQUFBLEVBUG1CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsRUFESTtJQUFBLENBYk4sQ0FBQTs7QUFBQSx5QkF1QkEsUUFBQSxHQUFVLFNBQUMsVUFBRCxHQUFBO0FBQ1IsVUFBQSx3Q0FBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLFFBQWYsRUFBeUIsVUFBekIsQ0FBZixDQUFBO0FBQ0E7QUFBQSxXQUFBLDJDQUFBOzhCQUFBO0FBQ0UsUUFBQSxJQUFlLFVBQVUsQ0FBQyxLQUFYLENBQWlCLFlBQWpCLENBQWY7QUFBQSxpQkFBTyxJQUFQLENBQUE7U0FERjtBQUFBLE9BRlE7SUFBQSxDQXZCVixDQUFBOztBQUFBLHlCQTRCQSxTQUFBLEdBQVcsU0FBQyxVQUFELEVBQWEsS0FBYixHQUFBO0FBQ1QsVUFBQSxnREFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLFFBQWYsRUFBeUIsVUFBekIsQ0FBZixDQUFBO0FBQ0EsTUFBQSxxQ0FBUSxDQUFFLGFBQVAsQ0FBcUIsWUFBckIsVUFBSDtlQUNFLEtBREY7T0FBQSxNQUFBO0FBR0U7QUFBQSxhQUFBLDRDQUFBO2tDQUFBO0FBQ0UsVUFBQSxJQUFlLFdBQVcsQ0FBQyxLQUFaLENBQWtCLFlBQWxCLENBQWY7QUFBQSxtQkFBTyxJQUFQLENBQUE7V0FERjtBQUFBLFNBQUE7QUFHQSxlQUFPLEtBQVAsQ0FORjtPQUZTO0lBQUEsQ0E1QlgsQ0FBQTs7QUFBQSx5QkFzQ0EsT0FBQSxHQUFTLFNBQUMsVUFBRCxHQUFBO2FBQWdCLGVBQWMsSUFBQyxDQUFBLFVBQWYsRUFBQSxVQUFBLE9BQWhCO0lBQUEsQ0F0Q1QsQ0FBQTs7QUFBQSx5QkF3Q0EsVUFBQSxHQUFZLFNBQUMsVUFBRCxFQUFhLEtBQWIsR0FBQTtBQUNWLE1BQUEsSUFBRyxLQUFBLElBQVUsd0JBQWI7ZUFDRSxLQUFLLENBQUMsS0FBTixJQUFlLElBQUMsQ0FBQSxVQURsQjtPQUFBLE1BQUE7ZUFHRSxNQUhGO09BRFU7SUFBQSxDQXhDWixDQUFBOztBQUFBLHlCQThDQSxVQUFBLEdBQVksU0FBQyxVQUFELEVBQWEsS0FBYixFQUFvQixJQUFwQixHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsVUFBbkIsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFELENBQVUsVUFBVixDQUFBLElBQTBCLENBQUEsSUFBRSxDQUFBLFNBQUQsQ0FBVyxVQUFYLEVBQXVCLEtBQXZCLENBQTlCO0FBQ0UsUUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFELENBQVMsVUFBVCxDQUFIO0FBQ0UsVUFBQSxJQUEyQixJQUFDLENBQUEsVUFBRCxDQUFZLFVBQVosRUFBd0IsS0FBeEIsQ0FBM0I7QUFBQSxZQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLFVBQVosQ0FBQSxDQUFBO1dBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxVQUFaLENBQUEsQ0FIRjtTQURGO09BQUEsTUFBQTtBQU1FLFFBQUEsSUFBK0IsZUFBYyxJQUFDLENBQUEsVUFBZixFQUFBLFVBQUEsTUFBL0I7QUFBQSxVQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixVQUFoQixDQUFBLENBQUE7U0FORjtPQURBO0FBU0EsTUFBQSxJQUFpQixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBZ0IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUEzQixLQUFxQyxjQUF0RDtBQUFBLFFBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFBLENBQUE7T0FUQTthQVVBLElBQUEsQ0FBQSxFQVhVO0lBQUEsQ0E5Q1osQ0FBQTs7QUFBQSx5QkEyREEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBMEMsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFqRDtBQUFBLFFBQUEsSUFBQSxDQUFLLHdCQUFMLEVBQStCLElBQUMsQ0FBQSxLQUFoQyxDQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBNkMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUF4RDtBQUFBLFFBQUEsSUFBQSxDQUFLLHVCQUFMLEVBQThCLElBQUMsQ0FBQSxTQUEvQixDQUFBLENBQUE7T0FEQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUZULENBQUE7YUFHQSxJQUFDLENBQUEsU0FBRCxHQUFhLEdBSkg7SUFBQSxDQTNEWixDQUFBOztBQUFBLHlCQWlFQSxRQUFBLEdBQVUsU0FBQyxVQUFELEVBQWEsSUFBYixHQUFBO0FBQ1IsTUFBQSxJQUFpQixJQUFDLENBQUEsU0FBRCxDQUFXLFVBQVgsQ0FBakI7QUFBQSxlQUFPLElBQUEsQ0FBQSxDQUFQLENBQUE7T0FBQTthQUNBLEVBQUUsQ0FBQyxLQUFILENBQVMsVUFBVCxFQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsS0FBUixHQUFBO0FBQ25CLFVBQUEsSUFBaUIsYUFBakI7QUFBQSxtQkFBTyxJQUFBLENBQUEsQ0FBUCxDQUFBO1dBQUE7QUFDQSxVQUFBLElBQUcsS0FBSyxDQUFDLGNBQU4sQ0FBQSxDQUFIO21CQUNFLEVBQUUsQ0FBQyxJQUFILENBQVEsVUFBUixFQUFvQixTQUFDLEtBQUQsRUFBUSxLQUFSLEdBQUE7QUFDbEIsY0FBQSxJQUFpQixhQUFqQjtBQUFBLHVCQUFPLElBQUEsQ0FBQSxDQUFQLENBQUE7ZUFBQTtBQUNBLGNBQUEsSUFBRyxLQUFLLENBQUMsTUFBTixDQUFBLENBQUg7dUJBQ0UsS0FBQyxDQUFBLFVBQUQsQ0FBWSxVQUFaLEVBQXdCLEtBQXhCLEVBQStCLElBQS9CLEVBREY7ZUFBQSxNQUVLLElBQUcsS0FBSyxDQUFDLFdBQU4sQ0FBQSxDQUFIO0FBQ0gsZ0JBQUEsSUFBRyxLQUFDLENBQUEsMEJBQUo7eUJBQ0UsS0FBQyxDQUFBLFVBQUQsQ0FBWSxVQUFaLEVBQXdCLElBQXhCLEVBREY7aUJBQUEsTUFBQTt5QkFHRSxJQUFBLENBQUEsRUFIRjtpQkFERztlQUphO1lBQUEsQ0FBcEIsRUFERjtXQUFBLE1BVUssSUFBRyxLQUFLLENBQUMsV0FBTixDQUFBLENBQUg7bUJBQ0gsS0FBQyxDQUFBLFVBQUQsQ0FBWSxVQUFaLEVBQXdCLElBQXhCLEVBREc7V0FBQSxNQUVBLElBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBQSxDQUFIO21CQUNILEtBQUMsQ0FBQSxVQUFELENBQVksVUFBWixFQUF3QixLQUF4QixFQUErQixJQUEvQixFQURHO1dBQUEsTUFBQTttQkFHSCxJQUFBLENBQUEsRUFIRztXQWRjO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsRUFGUTtJQUFBLENBakVWLENBQUE7O0FBQUEseUJBc0ZBLFVBQUEsR0FBWSxTQUFDLFVBQUQsRUFBYSxJQUFiLEdBQUE7YUFDVixFQUFFLENBQUMsT0FBSCxDQUFXLFVBQVgsRUFBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLFFBQVIsR0FBQTs7WUFBUSxXQUFTO1dBQ3RDO2lCQUFBLEtBQUssQ0FBQyxJQUFOLENBQ0UsUUFERixFQUVFLFNBQUMsU0FBRCxFQUFZLElBQVosR0FBQTttQkFDRSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxJQUFMLENBQVUsVUFBVixFQUFzQixTQUF0QixDQUFWLEVBQTRDLElBQTVDLEVBREY7VUFBQSxDQUZGLEVBSUUsSUFKRixFQURxQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCLEVBRFU7SUFBQSxDQXRGWixDQUFBOztzQkFBQTs7TUFURixDQUFBOztBQUFBLEVBd0dBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsTUFBRCxHQUFBO0FBQ2YsUUFBQSxnRUFBQTtBQUFBLElBQUEsT0FBQSxHQUNFO0FBQUEsTUFBQSxnQkFBQSxFQUFrQixNQUFNLENBQUMsZ0JBQXpCO0FBQUEsTUFDQSwwQkFBQSxFQUE0QixNQUFNLENBQUMsMEJBRG5DO0FBQUEsTUFFQSxVQUFBLEVBQVksTUFBTSxDQUFDLFVBRm5CO0FBQUEsTUFHQSxZQUFBLEVBQWMsRUFIZDtBQUFBLE1BSUEsV0FBQSxFQUFhLEVBSmI7S0FERixDQUFBO0FBT0EsSUFBQSxJQUFHLHdCQUFIO0FBQ0UsTUFBQSxPQUFPLENBQUMsU0FBUixHQUF3QixJQUFBLElBQUEsQ0FBSyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FBQyxTQUFsQixDQUFMLENBQXhCLENBREY7S0FQQTtBQVVBO0FBQUEsU0FBQSwyQ0FBQTt3QkFBQTtVQUFzQztBQUNwQztBQUNFLFVBQUEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFwQixDQUE2QixJQUFBLFNBQUEsQ0FBVSxNQUFWLEVBQWtCO0FBQUEsWUFBQSxTQUFBLEVBQVcsSUFBWDtBQUFBLFlBQWlCLEdBQUEsRUFBSyxJQUF0QjtXQUFsQixDQUE3QixDQUFBLENBREY7U0FBQSxjQUFBO0FBR0UsVUFESSxjQUNKLENBQUE7QUFBQSxVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWMsZ0NBQUEsR0FBZ0MsTUFBaEMsR0FBdUMsS0FBdkMsR0FBNEMsS0FBSyxDQUFDLE9BQWhFLENBQUEsQ0FIRjs7T0FERjtBQUFBLEtBVkE7QUFnQkE7QUFBQSxTQUFBLDhDQUFBO3lCQUFBO1VBQXVDO0FBQ3JDO0FBQ0UsVUFBQSxPQUFPLENBQUMsWUFBWSxDQUFDLElBQXJCLENBQThCLElBQUEsU0FBQSxDQUFVLE1BQVYsRUFBa0I7QUFBQSxZQUFBLFNBQUEsRUFBVyxJQUFYO0FBQUEsWUFBaUIsR0FBQSxFQUFLLElBQXRCO1dBQWxCLENBQTlCLENBQUEsQ0FERjtTQUFBLGNBQUE7QUFHRSxVQURJLGNBQ0osQ0FBQTtBQUFBLFVBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYyxnQ0FBQSxHQUFnQyxNQUFoQyxHQUF1QyxLQUF2QyxHQUE0QyxLQUFLLENBQUMsT0FBaEUsQ0FBQSxDQUhGOztPQURGO0FBQUEsS0FoQkE7V0FzQkEsS0FBSyxDQUFDLElBQU4sQ0FDRSxNQUFNLENBQUMsS0FEVCxFQUVFLFNBQUMsUUFBRCxFQUFXLElBQVgsR0FBQTthQUNNLElBQUEsVUFBQSxDQUFXLFFBQVgsRUFBcUIsT0FBckIsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxJQUFuQyxFQUROO0lBQUEsQ0FGRixFQUlFLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FKRixFQXZCZTtFQUFBLENBeEdqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/tasks/load-paths-handler.coffee

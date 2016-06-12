(function() {
  var Task, Transpiler, fs, languagebabelSchema, path, pathIsInside;

  Task = require('atom').Task;

  fs = require('fs-plus');

  path = require('path');

  pathIsInside = require('../node_modules/path-is-inside');

  languagebabelSchema = {
    type: 'object',
    properties: {
      babelMapsPath: {
        type: 'string'
      },
      babelMapsAddUrl: {
        type: 'boolean'
      },
      babelSourcePath: {
        type: 'string'
      },
      babelTranspilePath: {
        type: 'string'
      },
      createMap: {
        type: 'boolean'
      },
      createTargetDirectories: {
        type: 'boolean'
      },
      createTranspiledCode: {
        type: 'boolean'
      },
      disableWhenNoBabelrcFileInPath: {
        type: 'boolean'
      },
      suppressSourcePathMessages: {
        type: 'boolean'
      },
      suppressTranspileOnSaveMessages: {
        type: 'boolean'
      },
      transpileOnSave: {
        type: 'boolean'
      }
    },
    additionalProperties: false
  };

  Transpiler = (function() {
    function Transpiler() {
      this.reqId = 0;
      this.babelTranspilerTasks = {};
      this.babelTransformerPath = require.resolve('./transformer-task');
      this.transpileErrorNotifications = {};
      this.deprecateConfig();
    }

    Transpiler.prototype.transpile = function(sourceFile, textEditor) {
      var babelOptions, config, localConfig, msgObject, pathTo, reqId, _base, _name;
      this.stopUnusedTasks();
      config = this.getConfig();
      pathTo = this.getPaths(sourceFile, config);
      if (pathTo.sourceFileInProject !== true) {
        return;
      }
      if (config.allowLocalOverride) {
        if (this.jsonSchema == null) {
          this.jsonSchema = (require('../node_modules/jjv'))();
          this.jsonSchema.addSchema('localConfig', languagebabelSchema);
        }
        localConfig = this.getLocalConfig(pathTo.sourceFileDir, pathTo.projectPath, {});
        this.merge(config, localConfig);
        pathTo = this.getPaths(sourceFile, config);
      }
      if (config.transpileOnSave !== true) {
        return;
      }
      if (config.disableWhenNoBabelrcFileInPath) {
        if (!this.isBabelrcInPath(pathTo.sourceFileDir)) {
          return;
        }
      }
      if (!pathIsInside(pathTo.sourceFile, pathTo.sourceRoot)) {
        if (!config.suppressSourcePathMessages) {
          atom.notifications.addWarning('LB: Babel file is not inside the "Babel Source Path" directory.', {
            dismissable: false,
            detail: "No transpiled code output for file \n" + pathTo.sourceFile + " \n\nTo suppress these 'invalid source path' messages use language-babel package settings"
          });
        }
        return;
      }
      babelOptions = this.getBabelOptions(config);
      this.cleanNotifications(pathTo);
      if ((_base = this.babelTranspilerTasks)[_name = pathTo.projectPath] == null) {
        _base[_name] = Task.once(this.babelTransformerPath, pathTo.projectPath, (function(_this) {
          return function() {
            return delete _this.babelTranspilerTasks[pathTo.projectPath];
          };
        })(this));
      }
      if (this.babelTranspilerTasks[pathTo.projectPath] != null) {
        reqId = this.reqId++;
        msgObject = {
          reqId: reqId,
          command: 'transpile',
          pathTo: pathTo,
          babelOptions: babelOptions
        };
        this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
        return this.babelTranspilerTasks[pathTo.projectPath].once("transpile:" + reqId, (function(_this) {
          return function(msgRet) {
            var mapJson, xssiProtection, _ref;
            if (msgRet.ignored) {
              return;
            }
            if (msgRet.err) {
              _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel v" + msgRet.babelVersion + " Transpiler Error", {
                dismissable: true,
                detail: "" + msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.codeFrame
              });
              if ((msgRet.err.loc != null) && (textEditor != null)) {
                return textEditor.setCursorBufferPosition([msgRet.err.loc.line - 1, msgRet.err.loc.column - 1]);
              }
            } else {
              if (!config.suppressTranspileOnSaveMessages) {
                atom.notifications.addInfo("LB: Babel v" + msgRet.babelVersion + " Transpiler Success", {
                  detail: pathTo.sourceFile
                });
              }
              if (!config.createTranspiledCode) {
                if (!config.suppressTranspileOnSaveMessages) {
                  atom.notifications.addInfo('LB: No transpiled output configured');
                }
                return;
              }
              if (pathTo.sourceFile === pathTo.transpiledFile) {
                atom.notifications.addWarning('LB: Transpiled file would overwrite source file. Aborted!', {
                  dismissable: true,
                  detail: pathTo.sourceFile
                });
                return;
              }
              if (config.createTargetDirectories) {
                fs.makeTreeSync(path.parse(pathTo.transpiledFile).dir);
              }
              if (config.babelMapsAddUrl) {
                msgRet.result.code = msgRet.result.code + '\n' + '//# sourceMappingURL=' + pathTo.mapFile;
              }
              fs.writeFileSync(pathTo.transpiledFile, msgRet.result.code);
              if (config.createMap && ((_ref = msgRet.result.map) != null ? _ref.version : void 0)) {
                if (config.createTargetDirectories) {
                  fs.makeTreeSync(path.parse(pathTo.mapFile).dir);
                }
                mapJson = {
                  version: msgRet.result.map.version,
                  sources: pathTo.sourceFile,
                  file: pathTo.transpiledFile,
                  sourceRoot: '',
                  names: msgRet.result.map.names,
                  mappings: msgRet.result.map.mappings
                };
                xssiProtection = ')]}\n';
                return fs.writeFileSync(pathTo.mapFile, xssiProtection + JSON.stringify(mapJson, null, ' '));
              }
            }
          };
        })(this));
      }
    };

    Transpiler.prototype.cleanNotifications = function(pathTo) {
      var i, n, sf, _ref, _results;
      if (this.transpileErrorNotifications[pathTo.sourceFile] != null) {
        this.transpileErrorNotifications[pathTo.sourceFile].dismiss();
        delete this.transpileErrorNotifications[pathTo.sourceFile];
      }
      _ref = this.transpileErrorNotifications;
      for (sf in _ref) {
        n = _ref[sf];
        if (n.dismissed) {
          delete this.transpileErrorNotifications[sf];
        }
      }
      i = atom.notifications.notifications.length - 1;
      _results = [];
      while (i >= 0) {
        if (atom.notifications.notifications[i].dismissed && atom.notifications.notifications[i].message.substring(0, 3) === "LB:") {
          atom.notifications.notifications.splice(i, 1);
        }
        _results.push(i--);
      }
      return _results;
    };

    Transpiler.prototype.deprecateConfig = function() {
      if (atom.config.get('language-babel.supressTranspileOnSaveMessages') != null) {
        atom.config.set('language-babel.suppressTranspileOnSaveMessages', atom.config.get('language-babel.supressTranspileOnSaveMessages'));
      }
      if (atom.config.get('language-babel.supressSourcePathMessages') != null) {
        atom.config.set('language-babel.suppressSourcePathMessages', atom.config.get('language-babel.supressSourcePathMessages'));
      }
      atom.config.unset('language-babel.supressTranspileOnSaveMessages');
      atom.config.unset('language-babel.supressSourcePathMessages');
      atom.config.unset('language-babel.useInternalScanner');
      atom.config.unset('language-babel.stopAtProjectDirectory');
      atom.config.unset('language-babel.babelStage');
      atom.config.unset('language-babel.externalHelpers');
      atom.config.unset('language-babel.moduleLoader');
      atom.config.unset('language-babel.blacklistTransformers');
      atom.config.unset('language-babel.whitelistTransformers');
      atom.config.unset('language-babel.looseTransformers');
      atom.config.unset('language-babel.optionalTransformers');
      atom.config.unset('language-babel.plugins');
      return atom.config.unset('language-babel.presets');
    };

    Transpiler.prototype.getBabelOptions = function(config) {
      var babelOptions;
      return babelOptions = {
        sourceMaps: config.createMap,
        plugins: config.plugins,
        presets: config.presets,
        code: true
      };
    };

    Transpiler.prototype.getConfig = function() {
      return atom.config.get('language-babel');
    };

    Transpiler.prototype.getLocalConfig = function(fromDir, toDir, localConfig) {
      var err, fileContent, jsonContent, languageBabelCfgFile, localConfigFile, schemaErrors;
      localConfigFile = '.languagebabel';
      languageBabelCfgFile = path.join(fromDir, localConfigFile);
      if (fs.existsSync(languageBabelCfgFile)) {
        fileContent = fs.readFileSync(languageBabelCfgFile, 'utf8');
        try {
          jsonContent = JSON.parse(fileContent);
        } catch (_error) {
          err = _error;
          atom.notifications.addError("LB: " + localConfigFile + " " + err.message, {
            dismissable: true,
            detail: "File = " + languageBabelCfgFile + "\n\n" + fileContent
          });
          return;
        }
        schemaErrors = this.jsonSchema.validate('localConfig', jsonContent);
        if (schemaErrors) {
          atom.notifications.addError("LB: " + localConfigFile + " configuration error", {
            dismissable: true,
            detail: "File = " + languageBabelCfgFile + "\n\n" + fileContent
          });
        } else {
          this.merge(jsonContent, localConfig);
          localConfig = jsonContent;
        }
      }
      if (fromDir !== toDir) {
        if (fromDir === path.dirname(fromDir)) {
          return localConfig;
        }
        return this.getLocalConfig(path.dirname(fromDir), toDir, localConfig);
      } else {
        return localConfig;
      }
    };

    Transpiler.prototype.getPaths = function(sourceFile, config) {
      var absMapFile, absMapsRoot, absProjectPath, absSourceRoot, absTranspileRoot, absTranspiledFile, parsedSourceFile, projectContainingSource, relMapsPath, relSourcePath, relSourceRootToSourceFile, relTranspilePath, sourceFileInProject;
      projectContainingSource = atom.project.relativizePath(sourceFile);
      if (projectContainingSource[0] === null) {
        absProjectPath = path.parse(sourceFile).root;
        sourceFileInProject = false;
      } else {
        absProjectPath = path.normalize(projectContainingSource[0]);
        sourceFileInProject = true;
      }
      relSourcePath = path.normalize(config.babelSourcePath);
      relTranspilePath = path.normalize(config.babelTranspilePath);
      relMapsPath = path.normalize(config.babelMapsPath);
      absSourceRoot = path.join(absProjectPath, relSourcePath);
      absTranspileRoot = path.join(absProjectPath, relTranspilePath);
      absMapsRoot = path.join(absProjectPath, relMapsPath);
      parsedSourceFile = path.parse(sourceFile);
      relSourceRootToSourceFile = path.relative(absSourceRoot, parsedSourceFile.dir);
      absTranspiledFile = path.join(absTranspileRoot, relSourceRootToSourceFile, parsedSourceFile.name + '.js');
      absMapFile = path.join(absMapsRoot, relSourceRootToSourceFile, parsedSourceFile.name + '.js.map');
      return {
        sourceFileInProject: sourceFileInProject,
        sourceFile: sourceFile,
        sourceFileDir: parsedSourceFile.dir,
        mapFile: absMapFile,
        transpiledFile: absTranspiledFile,
        sourceRoot: absSourceRoot,
        projectPath: absProjectPath
      };
    };

    Transpiler.prototype.isBabelrcInPath = function(fromDir) {
      var babelrc, babelrcFile;
      babelrc = '.babelrc';
      babelrcFile = path.join(fromDir, babelrc);
      if (fs.existsSync(babelrcFile)) {
        return true;
      }
      if (fromDir !== path.dirname(fromDir)) {
        return this.isBabelrcInPath(path.dirname(fromDir));
      } else {
        return false;
      }
    };

    Transpiler.prototype.merge = function(targetObj, sourceObj) {
      var prop, val, _results;
      _results = [];
      for (prop in sourceObj) {
        val = sourceObj[prop];
        _results.push(targetObj[prop] = val);
      }
      return _results;
    };

    Transpiler.prototype.stopTranspilerTask = function(projectPath) {
      var msgObject;
      msgObject = {
        command: 'stop'
      };
      return this.babelTranspilerTasks[projectPath].send(msgObject);
    };

    Transpiler.prototype.stopAllTranspilerTask = function() {
      var projectPath, v, _ref, _results;
      _ref = this.babelTranspilerTasks;
      _results = [];
      for (projectPath in _ref) {
        v = _ref[projectPath];
        _results.push(this.stopTranspilerTask(projectPath));
      }
      return _results;
    };

    Transpiler.prototype.stopUnusedTasks = function() {
      var projectLoaded, projectPath, v, _ref, _results;
      _ref = this.babelTranspilerTasks;
      _results = [];
      for (projectPath in _ref) {
        v = _ref[projectPath];
        projectLoaded = (atom.project.relativizePath(projectPath))[0];
        if (projectLoaded == null) {
          _results.push(this.stopTranspilerTask(projectPath));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Transpiler;

  })();

  module.exports = Transpiler;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL3RyYW5zcGlsZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxnQ0FBUixDQUhmLENBQUE7O0FBQUEsRUFLQSxtQkFBQSxHQUFzQjtBQUFBLElBQ3BCLElBQUEsRUFBTSxRQURjO0FBQUEsSUFFcEIsVUFBQSxFQUFZO0FBQUEsTUFDVixhQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sUUFBUjtPQUR4QjtBQUFBLE1BRVYsZUFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFNBQVI7T0FGeEI7QUFBQSxNQUdWLGVBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxRQUFSO09BSHhCO0FBQUEsTUFJVixrQkFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFFBQVI7T0FKeEI7QUFBQSxNQUtWLFNBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxTQUFSO09BTHhCO0FBQUEsTUFNVix1QkFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFNBQVI7T0FOeEI7QUFBQSxNQU9WLG9CQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sU0FBUjtPQVB4QjtBQUFBLE1BUVYsOEJBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxTQUFSO09BUnhCO0FBQUEsTUFTViwwQkFBQSxFQUFrQztBQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/transpiler.coffee

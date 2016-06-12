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
      projectRoot: {
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
      this.babelTransformerPath = require.resolve('./transpiler-task');
      this.transpileErrorNotifications = {};
      this.deprecateConfig();
    }

    Transpiler.prototype.transpile = function(sourceFile, textEditor) {
      var babelOptions, config, err, localConfig, msgObject, pathTo, reqId;
      config = this.getConfig();
      pathTo = this.getPaths(sourceFile, config);
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
      this.createTask(pathTo.projectPath);
      if (this.babelTranspilerTasks[pathTo.projectPath]) {
        reqId = this.reqId++;
        msgObject = {
          reqId: reqId,
          command: 'transpile',
          pathTo: pathTo,
          babelOptions: babelOptions
        };
        try {
          this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
        } catch (_error) {
          err = _error;
          console.log("Error " + err + " sending to transpile task with PID " + this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          delete this.babelTranspilerTasks[pathTo.projectPath];
          this.createTask(pathTo.projectPath);
          console.log("Restarted transpile task with PID " + this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
        }
        return this.babelTranspilerTasks[pathTo.projectPath].once("transpile:" + reqId, (function(_this) {
          return function(msgRet) {
            var mapJson, xssiProtection, _ref, _ref1, _ref2;
            if ((_ref = msgRet.result) != null ? _ref.ignored : void 0) {
              return;
            }
            if (msgRet.err) {
              if (msgRet.err.stack) {
                return _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel Transpiler Error", {
                  dismissable: true,
                  detail: "" + msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.stack
                });
              } else {
                _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel v" + msgRet.babelVersion + " Transpiler Error", {
                  dismissable: true,
                  detail: "" + msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.codeFrame
                });
                if ((((_ref1 = msgRet.err.loc) != null ? _ref1.line : void 0) != null) && (textEditor != null)) {
                  return textEditor.setCursorBufferPosition([msgRet.err.loc.line - 1, msgRet.err.loc.column]);
                }
              }
            } else {
              if (!config.suppressTranspileOnSaveMessages) {
                atom.notifications.addInfo("LB: Babel v" + msgRet.babelVersion + " Transpiler Success", {
                  detail: "" + pathTo.sourceFile + "\n \n" + msgRet.babelCoreUsed
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
              if (config.createMap && ((_ref2 = msgRet.result.map) != null ? _ref2.version : void 0)) {
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

    Transpiler.prototype.createTask = function(projectPath) {
      var _base;
      return (_base = this.babelTranspilerTasks)[projectPath] != null ? _base[projectPath] : _base[projectPath] = Task.once(this.babelTransformerPath, projectPath, (function(_this) {
        return function() {
          return delete _this.babelTranspilerTasks[projectPath];
        };
      })(this));
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
        code: true
      };
    };

    Transpiler.prototype.getConfig = function() {
      return atom.config.get('language-babel');
    };

    Transpiler.prototype.getLocalConfig = function(fromDir, toDir, localConfig) {
      var err, fileContent, isProjectRoot, jsonContent, languageBabelCfgFile, localConfigFile, schemaErrors;
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
          isProjectRoot = jsonContent.projectRoot;
          this.merge(jsonContent, localConfig);
          if (isProjectRoot) {
            jsonContent.projectRootDir = fromDir;
          }
          localConfig = jsonContent;
        }
      }
      if (fromDir !== toDir) {
        if (fromDir === path.dirname(fromDir)) {
          return localConfig;
        }
        if (isProjectRoot) {
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
        sourceFileInProject = false;
      } else {
        sourceFileInProject = true;
      }
      if (config.projectRootDir != null) {
        absProjectPath = path.normalize(config.projectRootDir);
      } else if (projectContainingSource[0] === null) {
        absProjectPath = path.parse(sourceFile).root;
      } else {
        absProjectPath = path.normalize(projectContainingSource[0]);
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
      var atomProjectPath, atomProjectPaths, isTaskInCurrentProject, projectTaskPath, v, _i, _len, _ref, _results;
      atomProjectPaths = atom.project.getPaths();
      _ref = this.babelTranspilerTasks;
      _results = [];
      for (projectTaskPath in _ref) {
        v = _ref[projectTaskPath];
        isTaskInCurrentProject = false;
        for (_i = 0, _len = atomProjectPaths.length; _i < _len; _i++) {
          atomProjectPath = atomProjectPaths[_i];
          if (pathIsInside(projectTaskPath, atomProjectPath)) {
            isTaskInCurrentProject = true;
            break;
          }
        }
        if (!isTaskInCurrentProject) {
          _results.push(this.stopTranspilerTask(projectTaskPath));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL3RyYW5zcGlsZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxnQ0FBUixDQUhmLENBQUE7O0FBQUEsRUFLQSxtQkFBQSxHQUFzQjtBQUFBLElBQ3BCLElBQUEsRUFBTSxRQURjO0FBQUEsSUFFcEIsVUFBQSxFQUFZO0FBQUEsTUFDVixhQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sUUFBUjtPQUR4QjtBQUFBLE1BRVYsZUFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFNBQVI7T0FGeEI7QUFBQSxNQUdWLGVBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxRQUFSO09BSHhCO0FBQUEsTUFJVixrQkFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFFBQVI7T0FKeEI7QUFBQSxNQUtWLFNBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxTQUFSO09BTHhCO0FBQUEsTUFNVix1QkFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFNBQVI7T0FOeEI7QUFBQSxNQU9WLG9CQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sU0FBUjtPQVB4QjtBQUFBLE1BUVYsOEJBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxTQUFSO09BUnhCO0FBQUEsTUFTVixXQUFBLEVBQWtDO0FBQUEs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/transpiler.coffee

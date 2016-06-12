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
      var babelOptions, config, localConfig, msgObject, pathTo, reqId, _base, _name;
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
            var mapJson, xssiProtection, _ref, _ref1;
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
                if ((msgRet.err.loc != null) && (textEditor != null)) {
                  return textEditor.setCursorBufferPosition([msgRet.err.loc.line - 1, msgRet.err.loc.column - 1]);
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
              if (config.createMap && ((_ref1 = msgRet.result.map) != null ? _ref1.version : void 0)) {
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

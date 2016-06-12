(function() {
  var Beautifier, Promise, fs, readFile, spawn, temp, which, _;

  Promise = require("bluebird");

  _ = require('lodash');

  fs = require("fs");

  temp = require("temp").track();

  spawn = require('cross-spawn');

  readFile = Promise.promisify(fs.readFile);

  which = require('which');

  module.exports = Beautifier = (function() {

    /*
    Promise
     */
    Beautifier.prototype.Promise = Promise;


    /*
    Name of Beautifier
     */

    Beautifier.prototype.name = 'Beautifier';


    /*
    Supported Options
    
    Enable options for supported languages.
    - <string:language>:<boolean:all_options_enabled>
    - <string:language>:<string:option_key>:<boolean:enabled>
    - <string:language>:<string:option_key>:<string:rename>
    - <string:language>:<string:option_key>:<function:transform>
    - <string:language>:<string:option_key>:<array:mapper>
     */

    Beautifier.prototype.options = {};


    /*
    Supported languages by this Beautifier
    
    Extracted from the keys of the `options` field.
     */

    Beautifier.prototype.languages = null;


    /*
    Beautify text
    
    Override this method in subclasses
     */

    Beautifier.prototype.beautify = null;


    /*
    Show deprecation warning to user.
     */

    Beautifier.prototype.deprecate = function(warning) {
      var _ref;
      return (_ref = atom.notifications) != null ? _ref.addWarning(warning) : void 0;
    };


    /*
    Create temporary file
     */

    Beautifier.prototype.tempFile = function(name, contents) {
      if (name == null) {
        name = "atom-beautify-temp";
      }
      if (contents == null) {
        contents = "";
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return temp.open(name, function(err, info) {
            _this.debug('tempFile', name, err, info);
            if (err) {
              return reject(err);
            }
            return fs.write(info.fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(info.fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(info.path);
              });
            });
          });
        };
      })(this));
    };


    /*
    Read file
     */

    Beautifier.prototype.readFile = function(filePath) {
      return Promise.resolve(filePath).then(function(filePath) {
        return readFile(filePath, "utf8");
      });
    };


    /*
    If platform is Windows
     */

    Beautifier.prototype.isWindows = (function() {
      return new RegExp('^win').test(process.platform);
    })();


    /*
    Get Shell Environment variables
    
    Special thank you to @ioquatix
    See https://github.com/ioquatix/script-runner/blob/v1.5.0/lib/script-runner.coffee#L45-L63
     */

    Beautifier.prototype._envCache = null;

    Beautifier.prototype._envCacheDate = null;

    Beautifier.prototype._envCacheExpiry = 10000;

    Beautifier.prototype.getShellEnvironment = function() {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var buffer, child;
          if ((_this._envCache != null) && (_this._envCacheDate != null)) {
            if ((new Date() - _this._envCacheDate) < _this._envCacheExpiry) {
              return resolve(_this._envCache);
            }
          }
          if (_this.isWindows) {
            return resolve(process.env);
          } else {
            child = spawn(process.env.SHELL, ['-ilc', 'env'], {
              detached: true,
              stdio: ['ignore', 'pipe', process.stderr]
            });
            buffer = '';
            child.stdout.on('data', function(data) {
              return buffer += data;
            });
            return child.on('close', function(code, signal) {
              var definition, environment, key, value, _i, _len, _ref, _ref1;
              if (code !== 0) {
                return reject(new Error("Could not get Shell Environment. Exit code: " + code + ", Signal: " + signal));
              }
              environment = {};
              _ref = buffer.split('\n');
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                definition = _ref[_i];
                _ref1 = definition.split('=', 2), key = _ref1[0], value = _ref1[1];
                if (key !== '') {
                  environment[key] = value;
                }
              }
              _this._envCache = environment;
              _this._envCacheDate = new Date();
              return resolve(environment);
            });
          }
        };
      })(this));
    };


    /*
    Like the unix which utility.
    
    Finds the first instance of a specified executable in the PATH environment variable.
    Does not cache the results,
    so hash -r is not needed when the PATH changes.
    See https://github.com/isaacs/node-which
     */

    Beautifier.prototype.which = function(exe, options) {
      if (options == null) {
        options = {};
      }
      return this.getShellEnvironment().then((function(_this) {
        return function(env) {
          return new Promise(function(resolve, reject) {
            var _ref;
            if (options.path == null) {
              options.path = env.PATH;
            }
            if (_this.isWindows) {
              if (options.pathExt == null) {
                options.pathExt = "" + ((_ref = process.env.PATHEXT) != null ? _ref : '.EXE') + ";";
              }
            }
            return which(exe, options, function(err, path) {
              if (err) {
                resolve(exe);
              }
              return resolve(path);
            });
          });
        };
      })(this));
    };


    /*
    Add help to error.description
    
    Note: error.description is not officially used in JavaScript,
    however it is used internally for Atom Beautify when displaying errors.
     */

    Beautifier.prototype.commandNotFoundError = function(exe, help) {
      var docsLink, er, helpStr, issueSearchLink, message;
      message = "Could not find '" + exe + "'. The program may not be installed.";
      er = new Error(message);
      er.code = 'CommandNotFound';
      er.errno = er.code;
      er.syscall = 'beautifier::run';
      er.file = exe;
      if (help != null) {
        if (typeof help === "object") {
          helpStr = "See " + help.link + " for program installation instructions.\n";
          if (help.pathOption) {
            helpStr += "You can configure Atom Beautify with the absolute path to '" + (help.program || exe) + "' by setting '" + help.pathOption + "' in the Atom Beautify package settings.\n";
          }
          if (help.additional) {
            helpStr += help.additional;
          }
          issueSearchLink = "https://github.com/Glavin001/atom-beautify/search?q=" + exe + "&type=Issues";
          docsLink = "https://github.com/Glavin001/atom-beautify/tree/master/docs";
          helpStr += "Your program is properly installed if running '" + (this.isWindows ? 'where.exe' : 'which') + " " + exe + "' in your " + (this.isWindows ? 'CMD prompt' : 'Terminal') + " returns an absolute path to the executable. If this does not work then you have not installed the program correctly and so Atom Beautify will not find the program. Atom Beautify requires that the program be found in your PATH environment variable. \nNote that this is not an Atom Beautify issue if beautification does not work and the above command also does not work: this is expected behaviour, since you have not properly installed your program. Please properly setup the program and search through existing Atom Beautify issues before creating a new issue. See " + issueSearchLink + " for related Issues and " + docsLink + " for documentation. If you are still unable to resolve this issue on your own then please create a new issue and ask for help.\n";
          er.description = helpStr;
        } else {
          er.description = help;
        }
      }
      return er;
    };


    /*
    Run command-line interface command
     */

    Beautifier.prototype.run = function(executable, args, _arg) {
      var help, ignoreReturnCode, _ref;
      _ref = _arg != null ? _arg : {}, ignoreReturnCode = _ref.ignoreReturnCode, help = _ref.help;
      args = _.flatten(args);
      return Promise.all([executable, Promise.all(args)]).then((function(_this) {
        return function(_arg1) {
          var args, exeName;
          exeName = _arg1[0], args = _arg1[1];
          _this.debug('exeName, args:', exeName, args);
          return new Promise(function(resolve, reject) {
            args = _.without(args, void 0);
            args = _.without(args, null);
            return Promise.all([_this.getShellEnvironment(), _this.which(exeName)]).then(function(_arg2) {
              var cmd, env, exe, exePath, options;
              env = _arg2[0], exePath = _arg2[1];
              _this.debug('exePath, env:', exePath, env);
              exe = exePath != null ? exePath : exeName;
              options = {
                env: env
              };
              return cmd = _this.spawn(exe, args, options).then(function(_arg3) {
                var err, returnCode, stderr, stdout, windowsProgramNotFoundMsg;
                returnCode = _arg3.returnCode, stdout = _arg3.stdout, stderr = _arg3.stderr;
                _this.verbose('spawn result', returnCode, stdout, stderr);
                if (!ignoreReturnCode && returnCode !== 0) {
                  err = new Error(stderr);
                  windowsProgramNotFoundMsg = 'is not recognized as an internal or external command';
                  _this.verbose(stderr, windowsProgramNotFoundMsg);
                  if (_this.isWindows && returnCode === 1 && stderr.indexOf(windowsProgramNotFoundMsg) !== -1) {
                    err = _this.commandNotFoundError(exeName, help);
                  }
                  return reject(err);
                } else {
                  return resolve(stdout);
                }
              })["catch"](function(err) {
                _this.debug('error', err);
                if (err.code === 'ENOENT' || err.errno === 'ENOENT') {
                  return reject(_this.commandNotFoundError(exeName, help));
                } else {
                  return reject(err);
                }
              });
            });
          });
        };
      })(this));
    };


    /*
    Spawn
     */

    Beautifier.prototype.spawn = function(exe, args, options) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var cmd, stderr, stdout;
          _this.debug('spawn', exe, args);
          cmd = spawn(exe, args, options);
          stdout = "";
          stderr = "";
          cmd.stdout.on('data', function(data) {
            return stdout += data;
          });
          cmd.stderr.on('data', function(data) {
            return stderr += data;
          });
          cmd.on('exit', function(returnCode) {
            _this.debug('spawn done', returnCode, stderr, stdout);
            return resolve({
              returnCode: returnCode,
              stdout: stdout,
              stderr: stderr
            });
          });
          return cmd.on('error', function(err) {
            _this.debug('error', err);
            return reject(err);
          });
        };
      })(this));
    };


    /*
    Logger instance
     */

    Beautifier.prototype.logger = null;


    /*
    Initialize and configure Logger
     */

    Beautifier.prototype.setupLogger = function() {
      var key, method, _ref;
      this.logger = require('../logger')(__filename);
      _ref = this.logger;
      for (key in _ref) {
        method = _ref[key];
        this[key] = method;
      }
      return this.verbose("Beautifier logger has been initialized.");
    };


    /*
    Constructor to setup beautifer
     */

    function Beautifier() {
      var globalOptions, lang, options, _ref;
      this.setupLogger();
      if (this.options._ != null) {
        globalOptions = this.options._;
        delete this.options._;
        if (typeof globalOptions === "object") {
          _ref = this.options;
          for (lang in _ref) {
            options = _ref[lang];
            if (typeof options === "boolean") {
              if (options === true) {
                this.options[lang] = globalOptions;
              }
            } else if (typeof options === "object") {
              this.options[lang] = _.merge(globalOptions, options);
            } else {
              this.warn(("Unsupported options type " + (typeof options) + " for language " + lang + ": ") + options);
            }
          }
        }
      }
      this.verbose("Options for " + this.name + ":", this.options);
      this.languages = _.keys(this.options);
    }

    return Beautifier;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYmVhdXRpZmllci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0RBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FIUCxDQUFBOztBQUFBLEVBSUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxhQUFSLENBSlIsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFPLENBQUMsU0FBUixDQUFrQixFQUFFLENBQUMsUUFBckIsQ0FMWCxDQUFBOztBQUFBLEVBTUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBTlIsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRXJCO0FBQUE7O09BQUE7QUFBQSx5QkFHQSxPQUFBLEdBQVMsT0FIVCxDQUFBOztBQUtBO0FBQUE7O09BTEE7O0FBQUEseUJBUUEsSUFBQSxHQUFNLFlBUk4sQ0FBQTs7QUFVQTtBQUFBOzs7Ozs7Ozs7T0FWQTs7QUFBQSx5QkFxQkEsT0FBQSxHQUFTLEVBckJULENBQUE7O0FBdUJBO0FBQUE7Ozs7T0F2QkE7O0FBQUEseUJBNEJBLFNBQUEsR0FBVyxJQTVCWCxDQUFBOztBQThCQTtBQUFBOzs7O09BOUJBOztBQUFBLHlCQW1DQSxRQUFBLEdBQVUsSUFuQ1YsQ0FBQTs7QUFxQ0E7QUFBQTs7T0FyQ0E7O0FBQUEseUJB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/beautifier.coffee

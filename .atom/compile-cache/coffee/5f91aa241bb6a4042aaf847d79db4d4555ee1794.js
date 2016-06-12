(function() {
  var Beautifier, Promise, err, fs, readFile, spawn, temp, which, _;

  Promise = require("bluebird");

  _ = require('lodash');

  fs = require("fs");

  temp = require("temp").track();

  readFile = Promise.promisify(fs.readFile);

  which = require('which');

  spawn = null;

  try {
    spawn = require('cross-spawn');
  } catch (_error) {
    err = _error;
    spawn = require('child_process').spawn;
  }

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

    Beautifier.prototype.tempFile = function(name, contents, ext) {
      if (name == null) {
        name = "atom-beautify-temp";
      }
      if (contents == null) {
        contents = "";
      }
      if (ext == null) {
        ext = "";
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return temp.open({
            prefix: name,
            suffix: ext
          }, function(err, info) {
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
                var returnCode, stderr, stdout, windowsProgramNotFoundMsg;
                returnCode = _arg3.returnCode, stdout = _arg3.stdout, stderr = _arg3.stderr;
                _this.verbose('spawn result', returnCode, stdout, stderr);
                if (!ignoreReturnCode && returnCode !== 0) {
                  err = new Error(stderr);
                  windowsProgramNotFoundMsg = "is not recognized as an internal or external command";
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
      return this.verbose("" + this.name + " beautifier logger has been initialized.");
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvYmVhdXRpZmllci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkRBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FIUCxDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxTQUFSLENBQWtCLEVBQUUsQ0FBQyxRQUFyQixDQUpYLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FMUixDQUFBOztBQUFBLEVBT0EsS0FBQSxHQUFRLElBUFIsQ0FBQTs7QUFRQTtBQUNFLElBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxhQUFSLENBQVIsQ0FERjtHQUFBLGNBQUE7QUFHRSxJQURJLFlBQ0osQ0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsS0FBakMsQ0FIRjtHQVJBOztBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFFckI7QUFBQTs7T0FBQTtBQUFBLHlCQUdBLE9BQUEsR0FBUyxPQUhULENBQUE7O0FBS0E7QUFBQTs7T0FMQTs7QUFBQSx5QkFRQSxJQUFBLEdBQU0sWUFSTixDQUFBOztBQVVBO0FBQUE7Ozs7Ozs7OztPQVZBOztBQUFBLHlCQXFCQSxPQUFBLEdBQVMsRUFyQlQsQ0FBQTs7QUF1QkE7QUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/beautifier.coffee

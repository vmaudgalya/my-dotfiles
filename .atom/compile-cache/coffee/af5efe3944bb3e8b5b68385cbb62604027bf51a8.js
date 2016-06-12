(function() {
  "use strict";
  var $, Beautifiers, CompositeDisposable, LoadingView, Promise, Subscriber, async, beautifier, beautify, beautifyDirectory, beautifyFile, beautifyFilePath, debug, defaultLanguageOptions, dir, fs, getCursors, handleSaveEvent, loadingView, logger, path, pkg, plugin, setCursors, showError, strip, yaml, _;

  pkg = require('../package.json');

  plugin = module.exports;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require("lodash");

  Beautifiers = require("./beautifiers");

  beautifier = new Beautifiers();

  defaultLanguageOptions = beautifier.options;

  logger = require('./logger')(__filename);

  Promise = require('bluebird');

  fs = null;

  path = require("path");

  strip = null;

  yaml = null;

  async = null;

  dir = null;

  LoadingView = null;

  loadingView = null;

  $ = null;

  getCursors = function(editor) {
    var bufferPosition, cursor, cursors, posArray, _i, _len;
    cursors = editor.getCursors();
    posArray = [];
    for (_i = 0, _len = cursors.length; _i < _len; _i++) {
      cursor = cursors[_i];
      bufferPosition = cursor.getBufferPosition();
      posArray.push([bufferPosition.row, bufferPosition.column]);
    }
    return posArray;
  };

  setCursors = function(editor, posArray) {
    var bufferPosition, i, _i, _len;
    for (i = _i = 0, _len = posArray.length; _i < _len; i = ++_i) {
      bufferPosition = posArray[i];
      if (i === 0) {
        editor.setCursorBufferPosition(bufferPosition);
        continue;
      }
      editor.addCursorAtBufferPosition(bufferPosition);
    }
  };

  beautifier.on('beautify::start', function() {
    if (LoadingView == null) {
      LoadingView = require("./views/loading-view");
    }
    if (loadingView == null) {
      loadingView = new LoadingView();
    }
    return loadingView.show();
  });

  beautifier.on('beautify::end', function() {
    return loadingView != null ? loadingView.hide() : void 0;
  });

  showError = function(error) {
    var detail, stack, _ref;
    if (!atom.config.get("atom-beautify.muteAllErrors")) {
      stack = error.stack;
      detail = error.description || error.message;
      return (_ref = atom.notifications) != null ? _ref.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0;
    }
  };

  beautify = function(_arg) {
    var allOptions, beautifyCompleted, detail, e, editedFilePath, editor, forceEntireFile, grammarName, isSelection, oldText, onSave, text;
    onSave = _arg.onSave;
    if (atom.config.get("atom-beautify.beautifyOnSave") === true) {
      detail = "See issue https://github.com/Glavin001/atom-beautify/issues/308\n\nTo stop seeing this message:\n- Uncheck (disable) the deprecated \"Beautify On Save\" option\n\nTo enable Beautify on Save for a particular language:\n- Go to Atom Beautify's package settings\n- Find option for \"Language Config - <Your Language> - Beautify On Save\"\n- Check (enable) Beautify On Save option for that particular language\n";
      if (typeof atom !== "undefined" && atom !== null) {
        atom.notifications.addWarning("The option \"atom-beautify.beautifyOnSave\" has been deprecated", {
          detail: detail,
          dismissable: true
        });
      }
    }
    if (path == null) {
      path = require("path");
    }
    forceEntireFile = onSave && atom.config.get("atom-beautify.beautifyEntireFileOnSave");
    beautifyCompleted = function(text) {
      var origScrollTop, posArray, selectedBufferRange;
      if (text == null) {

      } else if (text instanceof Error) {
        showError(text);
      } else if (typeof text === "string") {
        if (oldText !== text) {
          posArray = getCursors(editor);
          origScrollTop = editor.getScrollTop();
          if (!forceEntireFile && isSelection) {
            selectedBufferRange = editor.getSelectedBufferRange();
            editor.setTextInBufferRange(selectedBufferRange, text);
          } else {
            editor.setText(text);
          }
          setCursors(editor, posArray);
          setTimeout((function() {
            editor.setScrollTop(origScrollTop);
          }), 0);
        }
      } else {
        showError(new Error("Unsupported beautification result '" + text + "'."));
      }
    };
    editor = atom.workspace.getActiveTextEditor();
    if (editor == null) {
      return showError(new Error("Active Editor not found. ", "Please select a Text Editor first to beautify."));
    }
    isSelection = !!editor.getSelectedText();
    editedFilePath = editor.getPath();
    allOptions = beautifier.getOptionsForPath(editedFilePath, editor);
    text = void 0;
    if (!forceEntireFile && isSelection) {
      text = editor.getSelectedText();
    } else {
      text = editor.getText();
    }
    oldText = text;
    grammarName = editor.getGrammar().name;
    try {
      beautifier.beautify(text, allOptions, grammarName, editedFilePath, {
        onSave: onSave
      }).then(beautifyCompleted)["catch"](beautifyCompleted);
    } catch (_error) {
      e = _error;
      showError(e);
    }
  };

  beautifyFilePath = function(filePath, callback) {
    var $el, cb;
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
    $el.addClass('beautifying');
    cb = function(err, result) {
      $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
      $el.removeClass('beautifying');
      return callback(err, result);
    };
    if (fs == null) {
      fs = require("fs");
    }
    return fs.readFile(filePath, function(err, data) {
      var allOptions, completionFun, e, grammar, grammarName, input;
      if (err) {
        return cb(err);
      }
      input = data != null ? data.toString() : void 0;
      grammar = atom.grammars.selectGrammar(filePath, input);
      grammarName = grammar.name;
      allOptions = beautifier.getOptionsForPath(filePath);
      completionFun = function(output) {
        if (output instanceof Error) {
          return cb(output, null);
        } else if (typeof output === "string") {
          if (output === '') {
            return cb(null, output);
          }
          return fs.writeFile(filePath, output, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, output);
          });
        } else {
          return cb(new Error("Unknown beautification result " + output + "."), output);
        }
      };
      try {
        return beautifier.beautify(input, allOptions, grammarName, filePath).then(completionFun)["catch"](completionFun);
      } catch (_error) {
        e = _error;
        return cb(e);
      }
    });
  };

  beautifyFile = function(_arg) {
    var filePath, target;
    target = _arg.target;
    filePath = target.dataset.path;
    if (!filePath) {
      return;
    }
    beautifyFilePath(filePath, function(err, result) {
      if (err) {
        return showError(err);
      }
    });
  };

  beautifyDirectory = function(_arg) {
    var $el, dirPath, target;
    target = _arg.target;
    dirPath = target.dataset.path;
    if (!dirPath) {
      return;
    }
    if ((typeof atom !== "undefined" && atom !== null ? atom.confirm({
      message: "This will beautify all of the files found recursively in this directory, '" + dirPath + "'. Do you want to continue?",
      buttons: ['Yes, continue!', 'No, cancel!']
    }) : void 0) !== 0) {
      return;
    }
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
    $el.addClass('beautifying');
    if (dir == null) {
      dir = require("node-dir");
    }
    if (async == null) {
      async = require("async");
    }
    dir.files(dirPath, function(err, files) {
      if (err) {
        return showError(err);
      }
      return async.each(files, function(filePath, callback) {
        return beautifyFilePath(filePath, function() {
          return callback();
        });
      }, function(err) {
        $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
        return $el.removeClass('beautifying');
      });
    });
  };

  debug = function() {
    var addHeader, addInfo, allOptions, codeBlockSyntax, debugInfo, editor, filePath, grammarName, language, text;
    editor = atom.workspace.getActiveTextEditor();
    if (editor == null) {
      return confirm("Active Editor not found.\n" + "Please select a Text Editor first to beautify.");
    }
    if (!confirm('Are you ready to debug Atom Beautify?\n\n' + 'Warning: This will change your current clipboard contents.')) {
      return;
    }
    debugInfo = "";
    addInfo = function(key, val) {
      return debugInfo += "**" + key + "**: " + val + "\n\n";
    };
    addHeader = function(level, title) {
      return debugInfo += "" + (Array(level + 1).join('#')) + " " + title + "\n\n";
    };
    addHeader(1, "Atom Beautify - Debugging information");
    debugInfo += "The following debugging information was " + ("generated by `Atom Beautify` on `" + (new Date()) + "`.") + "\n\n---\n\n";
    addInfo('Platform', process.platform);
    addHeader(2, "Versions");
    addInfo('Atom Version', atom.appVersion);
    addInfo('Atom Beautify Version', pkg.version);
    addHeader(2, "Original file to be beautified");
    filePath = editor.getPath();
    addInfo('Original File Path', "`" + filePath + "`");
    grammarName = editor.getGrammar().name;
    addInfo('Original File Grammar', grammarName);
    language = beautifier.getLanguage(grammarName, filePath);
    addInfo('Original File Language', language != null ? language.name : void 0);
    text = editor.getText();
    codeBlockSyntax = grammarName.toLowerCase().split(' ')[0];
    addInfo('Original File Contents', "\n```" + codeBlockSyntax + "\n" + text + "\n```");
    addHeader(2, "Beautification options");
    allOptions = beautifier.getOptionsForPath(filePath, editor);
    return Promise.all(allOptions).then(function(allOptions) {
      var cb, configOptions, e, editorConfigOptions, editorOptions, finalOptions, homeOptions, logs, projectOptions, subscription;
      editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
      projectOptions = allOptions.slice(4);
      finalOptions = beautifier.getOptionsForLanguage(allOptions, language != null);
      addInfo('Editor Options', "\n" + "Options from Atom Editor settings\n" + ("```json\n" + (JSON.stringify(editorOptions, void 0, 4)) + "\n```"));
      addInfo('Config Options', "\n" + "Options from Atom Beautify package settings\n" + ("```json\n" + (JSON.stringify(configOptions, void 0, 4)) + "\n```"));
      addInfo('Home Options', "\n" + ("Options from `" + (path.resolve(beautifier.getUserHome(), '.jsbeautifyrc')) + "`\n") + ("```json\n" + (JSON.stringify(homeOptions, void 0, 4)) + "\n```"));
      addInfo('EditorConfig Options', "\n" + "Options from [EditorConfig](http://editorconfig.org/) file\n" + ("```json\n" + (JSON.stringify(editorConfigOptions, void 0, 4)) + "\n```"));
      addInfo('Project Options', "\n" + ("Options from `.jsbeautifyrc` files starting from directory `" + (path.dirname(filePath)) + "` and going up to root\n") + ("```json\n" + (JSON.stringify(projectOptions, void 0, 4)) + "\n```"));
      addInfo('Final Options', "\n" + "Final combined options that are used\n" + ("```json\n" + (JSON.stringify(finalOptions, void 0, 4)) + "\n```"));
      addInfo('Package Settings', "\n" + "The raw package settings options\n" + ("```json\n" + (JSON.stringify(atom.config.get('atom-beautify'), void 0, 4)) + "\n```"));
      logs = "";
      subscription = logger.onLogging(function(msg) {
        return logs += msg;
      });
      cb = function(result) {
        subscription.dispose();
        addHeader(2, "Results");
        addInfo('Beautified File Contents', "\n```" + codeBlockSyntax + "\n" + result + "\n```");
        addInfo('Logs', "\n```\n" + logs + "\n```");
        atom.clipboard.write(debugInfo);
        return confirm('Atom Beautify debugging information is now in your clipboard.\n' + 'You can now paste this into an Issue you are reporting here\n' + 'https://github.com/Glavin001/atom-beautify/issues/ \n\n' + 'Warning: Be sure to look over the debug info before you send it, to ensure you are not sharing undesirable private information.');
      };
      try {
        return beautifier.beautify(text, allOptions, grammarName, filePath).then(cb)["catch"](cb);
      } catch (_error) {
        e = _error;
        return cb(e);
      }
    });
  };

  handleSaveEvent = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      var buffer, disposable;
      buffer = editor.getBuffer();
      disposable = buffer.onDidSave(function(_arg) {
        var beautifyOnSave, fileExtension, filePath, grammar, key, language, languages, origScrollTop, posArray;
        filePath = _arg.path;
        if (path == null) {
          path = require('path');
        }
        grammar = editor.getGrammar().name;
        fileExtension = path.extname(filePath);
        fileExtension = fileExtension.substr(1);
        languages = beautifier.languages.getLanguages({
          grammar: grammar,
          extension: fileExtension
        });
        if (languages.length < 1) {
          return;
        }
        language = languages[0];
        key = "atom-beautify.language_" + language.namespace + "_beautify_on_save";
        beautifyOnSave = atom.config.get(key);
        logger.verbose('save editor positions', key, beautifyOnSave);
        if (beautifyOnSave) {
          posArray = getCursors(editor);
          origScrollTop = editor.getScrollTop();
          return beautifyFilePath(filePath, function() {
            buffer.reload();
            logger.verbose('restore editor positions', posArray, origScrollTop);
            return setTimeout((function() {
              setCursors(editor, posArray);
              editor.setScrollTop(origScrollTop);
            }), 0);
          });
        }
      });
      return plugin.subscribe(disposable);
    });
  };

  Subscriber = require(path.join(atom.packages.resourcePath, 'node_modules', 'emissary')).Subscriber;

  Subscriber.extend(plugin);

  plugin.config = _.merge(require('./config.coffee'), defaultLanguageOptions);

  plugin.activate = function() {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(handleSaveEvent());
    this.subscriptions.add(plugin.subscribe(atom.config.observe("atom-beautify.beautifyOnSave", handleSaveEvent)));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-editor", beautify));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:help-debug-editor", debug));
    this.subscriptions.add(atom.commands.add(".tree-view .file .name", "atom-beautify:beautify-file", beautifyFile));
    return this.subscriptions.add(atom.commands.add(".tree-view .directory .name", "atom-beautify:beautify-directory", beautifyDirectory));
  };

  plugin.deactivate = function() {
    return this.subscriptions.dispose();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZnkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEseVNBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGlCQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FKaEIsQ0FBQTs7QUFBQSxFQUtDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFMRCxDQUFBOztBQUFBLEVBTUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBTkosQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUixDQVBkLENBQUE7O0FBQUEsRUFRQSxVQUFBLEdBQWlCLElBQUEsV0FBQSxDQUFBLENBUmpCLENBQUE7O0FBQUEsRUFTQSxzQkFBQSxHQUF5QixVQUFVLENBQUMsT0FUcEMsQ0FBQTs7QUFBQSxFQVVBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFBLENBQW9CLFVBQXBCLENBVlQsQ0FBQTs7QUFBQSxFQVdBLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUixDQVhWLENBQUE7O0FBQUEsRUFjQSxFQUFBLEdBQUssSUFkTCxDQUFBOztBQUFBLEVBZUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBZlAsQ0FBQTs7QUFBQSxFQWdCQSxLQUFBLEdBQVEsSUFoQlIsQ0FBQTs7QUFBQSxFQWlCQSxJQUFBLEdBQU8sSUFqQlAsQ0FBQTs7QUFBQSxFQWtCQSxLQUFBLEdBQVEsSUFsQlIsQ0FBQTs7QUFBQSxFQW1CQSxHQUFBLEdBQU0sSUFuQk4sQ0FBQTs7QUFBQSxFQW9CQSxXQUFBLEdBQWMsSUFwQmQsQ0FBQTs7QUFBQSxFQXFC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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautify.coffee

(function() {
  "use strict";
  var $, Beautifiers, CompositeDisposable, LoadingView, Promise, async, beautifier, beautify, beautifyDirectory, beautifyFile, beautifyFilePath, debug, defaultLanguageOptions, dir, fs, getCursors, getScrollTop, getUnsupportedOptions, handleSaveEvent, loadingView, logger, path, pkg, plugin, setCursors, setScrollTop, showError, strip, yaml, _;

  pkg = require('../package.json');

  plugin = module.exports;

  CompositeDisposable = require('event-kit').CompositeDisposable;

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

  getScrollTop = function(editor) {
    var view;
    view = editor.viewRegistry.getView(editor);
    return view.getScrollTop();
  };

  setScrollTop = function(editor, value) {
    var view;
    view = editor.viewRegistry.getView(editor);
    return view.setScrollTop(value);
  };

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
    if (!atom.config.get("atom-beautify.general.muteAllErrors")) {
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
    var editor, onSave;
    editor = _arg.editor, onSave = _arg.onSave;
    return new Promise(function(resolve, reject) {
      var allOptions, beautifyCompleted, e, editedFilePath, forceEntireFile, grammarName, isSelection, oldText, text;
      plugin.checkUnsupportedOptions();
      if (path == null) {
        path = require("path");
      }
      forceEntireFile = onSave && atom.config.get("atom-beautify.general.beautifyEntireFileOnSave");
      beautifyCompleted = function(text) {
        var error, origScrollTop, posArray, selectedBufferRange;
        if (text == null) {

        } else if (text instanceof Error) {
          showError(text);
          return reject(text);
        } else if (typeof text === "string") {
          if (oldText !== text) {
            posArray = getCursors(editor);
            origScrollTop = getScrollTop(editor);
            if (!forceEntireFile && isSelection) {
              selectedBufferRange = editor.getSelectedBufferRange();
              editor.setTextInBufferRange(selectedBufferRange, text);
            } else {
              editor.setText(text);
            }
            setCursors(editor, posArray);
            setTimeout((function() {
              setScrollTop(editor, origScrollTop);
              return resolve(text);
            }), 0);
          }
        } else {
          error = new Error("Unsupported beautification result '" + text + "'.");
          showError(error);
          return reject(error);
        }
      };
      editor = editor != null ? editor : atom.workspace.getActiveTextEditor();
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
    });
  };

  beautifyFilePath = function(filePath, callback) {
    var $el, cb;
    logger.verbose('beautifyFilePath', filePath);
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
    $el.addClass('beautifying');
    cb = function(err, result) {
      logger.verbose('Cleanup beautifyFilePath', err, result);
      $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
      $el.removeClass('beautifying');
      return callback(err, result);
    };
    if (fs == null) {
      fs = require("fs");
    }
    logger.verbose('readFile', filePath);
    return fs.readFile(filePath, function(err, data) {
      var allOptions, completionFun, e, grammar, grammarName, input;
      logger.verbose('readFile completed', err, filePath);
      if (err) {
        return cb(err);
      }
      input = data != null ? data.toString() : void 0;
      grammar = atom.grammars.selectGrammar(filePath, input);
      grammarName = grammar.name;
      allOptions = beautifier.getOptionsForPath(filePath);
      logger.verbose('beautifyFilePath allOptions', allOptions);
      completionFun = function(output) {
        logger.verbose('beautifyFilePath completionFun', output);
        if (output instanceof Error) {
          return cb(output, null);
        } else if (typeof output === "string") {
          if (output.trim() === '') {
            logger.verbose('beautifyFilePath, output was empty string!');
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
        logger.verbose('beautify', input, allOptions, grammarName, filePath);
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
    var addHeader, addInfo, allOptions, beautifiers, codeBlockSyntax, debugInfo, editor, filePath, grammarName, headers, language, linkifyTitle, selectedBeautifier, text, tocEl, _ref;
    plugin.checkUnsupportedOptions();
    editor = atom.workspace.getActiveTextEditor();
    linkifyTitle = function(title) {
      var p, sep;
      title = title.toLowerCase();
      p = title.split(/[\s,+#;,\/?:@&=+$]+/);
      sep = "-";
      return p.join(sep);
    };
    if (editor == null) {
      return confirm("Active Editor not found.\n" + "Please select a Text Editor first to beautify.");
    }
    if (!confirm('Are you ready to debug Atom Beautify?\n\n' + 'Warning: This will change your current clipboard contents.')) {
      return;
    }
    debugInfo = "";
    headers = [];
    tocEl = "<TABLEOFCONTENTS/>";
    addInfo = function(key, val) {
      if (key != null) {
        return debugInfo += "**" + key + "**: " + val + "\n\n";
      } else {
        return debugInfo += "" + val + "\n\n";
      }
    };
    addHeader = function(level, title) {
      debugInfo += "" + (Array(level + 1).join('#')) + " " + title + "\n\n";
      return headers.push({
        level: level,
        title: title
      });
    };
    addHeader(1, "Atom Beautify - Debugging information");
    debugInfo += "The following debugging information was " + ("generated by `Atom Beautify` on `" + (new Date()) + "`.") + "\n\n---\n\n" + tocEl + "\n\n---\n\n";
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
    addInfo('Language namespace', language != null ? language.namespace : void 0);
    beautifiers = beautifier.getBeautifiers(language.name);
    addInfo('Supported Beautifiers', _.map(beautifiers, 'name').join(', '));
    selectedBeautifier = beautifier.getBeautifierForLanguage(language);
    addInfo('Selected Beautifier', selectedBeautifier.name);
    text = editor.getText();
    codeBlockSyntax = ((_ref = language != null ? language.name : void 0) != null ? _ref : grammarName).toLowerCase().split(' ')[0];
    addHeader(3, 'Original File Contents');
    addInfo(null, "\n```" + codeBlockSyntax + "\n" + text + "\n```");
    addHeader(3, 'Package Settings');
    addInfo(null, "The raw package settings options\n" + ("```json\n" + (JSON.stringify(atom.config.get('atom-beautify'), void 0, 4)) + "\n```"));
    addHeader(2, "Beautification options");
    allOptions = beautifier.getOptionsForPath(filePath, editor);
    return Promise.all(allOptions).then(function(allOptions) {
      var cb, configOptions, e, editorConfigOptions, editorOptions, finalOptions, homeOptions, logFilePathRegex, logs, preTransformedOptions, projectOptions, subscription;
      editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
      projectOptions = allOptions.slice(4);
      preTransformedOptions = beautifier.getOptionsForLanguage(allOptions, language);
      if (selectedBeautifier) {
        finalOptions = beautifier.transformOptions(selectedBeautifier, language.name, preTransformedOptions);
      }
      addInfo('Editor Options', "\n" + "Options from Atom Editor settings\n" + ("```json\n" + (JSON.stringify(editorOptions, void 0, 4)) + "\n```"));
      addInfo('Config Options', "\n" + "Options from Atom Beautify package settings\n" + ("```json\n" + (JSON.stringify(configOptions, void 0, 4)) + "\n```"));
      addInfo('Home Options', "\n" + ("Options from `" + (path.resolve(beautifier.getUserHome(), '.jsbeautifyrc')) + "`\n") + ("```json\n" + (JSON.stringify(homeOptions, void 0, 4)) + "\n```"));
      addInfo('EditorConfig Options', "\n" + "Options from [EditorConfig](http://editorconfig.org/) file\n" + ("```json\n" + (JSON.stringify(editorConfigOptions, void 0, 4)) + "\n```"));
      addInfo('Project Options', "\n" + ("Options from `.jsbeautifyrc` files starting from directory `" + (path.dirname(filePath)) + "` and going up to root\n") + ("```json\n" + (JSON.stringify(projectOptions, void 0, 4)) + "\n```"));
      addInfo('Pre-Transformed Options', "\n" + "Combined options before transforming them given a beautifier's specifications\n" + ("```json\n" + (JSON.stringify(preTransformedOptions, void 0, 4)) + "\n```"));
      if (selectedBeautifier) {
        addHeader(3, 'Final Options');
        addInfo(null, "Final combined and transformed options that are used\n" + ("```json\n" + (JSON.stringify(finalOptions, void 0, 4)) + "\n```"));
      }
      logs = "";
      logFilePathRegex = new RegExp('\\: \\[(.*)\\]');
      subscription = logger.onLogging(function(msg) {
        var sep;
        sep = path.sep;
        return logs += msg.replace(logFilePathRegex, function(a, b) {
          var i, p, s;
          s = b.split(sep);
          i = s.indexOf('atom-beautify');
          p = s.slice(i + 2).join(sep);
          return ': [' + p + ']';
        });
      });
      cb = function(result) {
        var JsDiff, bullet, diff, header, indent, indentNum, toc, _i, _len;
        subscription.dispose();
        addHeader(2, "Results");
        addInfo('Beautified File Contents', "\n```" + codeBlockSyntax + "\n" + result + "\n```");
        JsDiff = require('diff');
        diff = JsDiff.createPatch(filePath, text, result, "original", "beautified");
        addInfo('Original vs. Beautified Diff', "\n```" + codeBlockSyntax + "\n" + diff + "\n```");
        addHeader(3, "Logs");
        addInfo(null, "```\n" + logs + "\n```");
        toc = "## Table Of Contents\n";
        for (_i = 0, _len = headers.length; _i < _len; _i++) {
          header = headers[_i];

          /*
          - Heading 1
            - Heading 1.1
           */
          indent = "  ";
          bullet = "-";
          indentNum = header.level - 2;
          if (indentNum >= 0) {
            toc += "" + (Array(indentNum + 1).join(indent)) + bullet + " [" + header.title + "](\#" + (linkifyTitle(header.title)) + ")\n";
          }
        }
        debugInfo = debugInfo.replace(tocEl, toc);
        atom.clipboard.write(debugInfo);
        return confirm('Atom Beautify debugging information is now in your clipboard.\n' + 'You can now paste this into an Issue you are reporting here\n' + 'https://github.com/Glavin001/atom-beautify/issues/\n\n' + 'Please follow the contribution guidelines found at\n' + 'https://github.com/Glavin001/atom-beautify/blob/master/CONTRIBUTING.md\n\n' + 'Warning: Be sure to look over the debug info before you send it, ' + 'to ensure you are not sharing undesirable private information.');
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
      var beautifyOnSaveHandler, disposable, pendingPaths;
      pendingPaths = {};
      beautifyOnSaveHandler = function(_arg) {
        var beautifyOnSave, buffer, fileExtension, filePath, grammar, key, language, languages;
        filePath = _arg.path;
        logger.verbose('Should beautify on this save?');
        if (pendingPaths[filePath]) {
          logger.verbose("Editor with file path " + filePath + " already beautified!");
          return;
        }
        buffer = editor.getBuffer();
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
        key = "atom-beautify." + language.namespace + ".beautify_on_save";
        beautifyOnSave = atom.config.get(key);
        logger.verbose('save editor positions', key, beautifyOnSave);
        if (beautifyOnSave) {
          logger.verbose('Beautifying file', filePath);
          return beautify({
            editor: editor,
            onSave: true
          }).then(function() {
            logger.verbose('Done beautifying file', filePath);
            if (editor.isAlive() === true) {
              logger.verbose('Saving TextEditor...');
              pendingPaths[filePath] = true;
              editor.save();
              delete pendingPaths[filePath];
              return logger.verbose('Saved TextEditor.');
            }
          })["catch"](function(error) {
            return showError(error);
          });
        }
      };
      disposable = editor.onDidSave(function(_arg) {
        var filePath;
        filePath = _arg.path;
        return beautifyOnSaveHandler({
          path: filePath
        });
      });
      return plugin.subscriptions.add(disposable);
    });
  };

  getUnsupportedOptions = function() {
    var schema, settings, unsupportedOptions;
    settings = atom.config.get('atom-beautify');
    schema = atom.config.getSchema('atom-beautify');
    unsupportedOptions = _.filter(_.keys(settings), function(key) {
      return schema.properties[key] === void 0;
    });
    return unsupportedOptions;
  };

  plugin.checkUnsupportedOptions = function() {
    var unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    if (unsupportedOptions.length !== 0) {
      return atom.notifications.addWarning("Please run Atom command 'Atom-Beautify: Migrate Settings'.", {
        detail: "You have unsupported options: " + (unsupportedOptions.join(', ')),
        dismissable: true
      });
    }
  };

  plugin.migrateSettings = function() {
    var namespaces, rename, rex, unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    namespaces = beautifier.languages.namespaces;
    if (unsupportedOptions.length === 0) {
      return atom.notifications.addSuccess("No options to migrate.");
    } else {
      rex = new RegExp("(" + (namespaces.join('|')) + ")_(.*)");
      rename = _.toPairs(_.zipObject(unsupportedOptions, _.map(unsupportedOptions, function(key) {
        var m;
        m = key.match(rex);
        if (m === null) {
          return "general." + key;
        } else {
          return "" + m[1] + "." + m[2];
        }
      })));
      _.each(rename, function(_arg) {
        var key, newKey, val;
        key = _arg[0], newKey = _arg[1];
        val = atom.config.get("atom-beautify." + key);
        atom.config.set("atom-beautify." + newKey, val);
        return atom.config.set("atom-beautify." + key, void 0);
      });
      return atom.notifications.addSuccess("Successfully migrated options: " + (unsupportedOptions.join(', ')));
    }
  };

  plugin.config = _.merge(require('./config.coffee'), defaultLanguageOptions);

  plugin.activate = function() {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(handleSaveEvent());
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-editor", beautify));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:help-debug-editor", debug));
    this.subscriptions.add(atom.commands.add(".tree-view .file .name", "atom-beautify:beautify-file", beautifyFile));
    this.subscriptions.add(atom.commands.add(".tree-view .directory .name", "atom-beautify:beautify-directory", beautifyDirectory));
    return this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:migrate-settings", plugin.migrateSettings));
  };

  plugin.deactivate = function() {
    return this.subscriptions.dispose();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZnkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsZ1ZBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGlCQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FKaEIsQ0FBQTs7QUFBQSxFQUtDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFMRCxDQUFBOztBQUFBLEVBTUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBTkosQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUixDQVBkLENBQUE7O0FBQUEsRUFRQSxVQUFBLEdBQWlCLElBQUEsV0FBQSxDQUFBLENBUmpCLENBQUE7O0FBQUEsRUFTQSxzQkFBQSxHQUF5QixVQUFVLENBQUMsT0FUcEMsQ0FBQTs7QUFBQSxFQVVBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFBLENBQW9CLFVBQXBCLENBVlQsQ0FBQTs7QUFBQSxFQVdBLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUixDQVhWLENBQUE7O0FBQUEsRUFjQSxFQUFBLEdBQUssSUFkTCxDQUFBOztBQUFBLEVBZUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBZlAsQ0FBQTs7QUFBQSxFQWdCQSxLQUFBLEdBQVEsSUFoQlIsQ0FBQTs7QUFBQSxFQWlCQSxJQUFBLEdBQU8sSUFqQlAsQ0FBQTs7QUFBQSxFQWtCQSxLQUFBLEdBQVEsSUFsQlIsQ0FBQTs7QUFBQSxFQW1CQSxHQUFBLEdBQU0sSUFuQk4sQ0FBQTs7QUFBQSxFQW9CQSxXQUFBLEdBQWMsSUFwQmQsQ0FBQTs7QUFBQSxFQXFC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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautify.coffee

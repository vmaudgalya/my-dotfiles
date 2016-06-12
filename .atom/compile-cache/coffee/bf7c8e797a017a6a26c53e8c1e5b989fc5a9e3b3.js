(function() {
  var Beautifier, Beautifiers, Languages, Promise, beautifiers, fs, isWindows, path, temp, _;

  Beautifiers = require("../src/beautifiers");

  beautifiers = new Beautifiers();

  Beautifier = require("../src/beautifiers/beautifier");

  Languages = require('../src/languages/');

  _ = require('lodash');

  fs = require('fs');

  path = require('path');

  Promise = require("bluebird");

  temp = require('temp');

  temp.track();

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("Atom-Beautify", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        return activationPromise;
      });
    });
    afterEach(function() {
      return temp.cleanupSync();
    });
    describe("Beautifiers", function() {
      var beautifier;
      beautifier = null;
      beforeEach(function() {
        return beautifier = new Beautifier();
      });
      return describe("Beautifier::run", function() {
        it("should error when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, p;
            p = beautifier.run("program", []);
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).toBe(void 0, 'Error should not have a description.');
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        it("should error with help description when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, help, p;
            help = {
              link: "http://test.com",
              program: "test-program",
              pathOption: "Lang - Test Program Path"
            };
            p = beautifier.run("program", [], {
              help: help
            });
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).not.toBe(null);
              expect(v.description.indexOf(help.link)).not.toBe(-1);
              expect(v.description.indexOf(help.program)).not.toBe(-1);
              expect(v.description.indexOf(help.pathOption)).not.toBe(-1, "Error should have a description.");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        it("should error with Windows-specific help description when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, help, p, terminal, whichCmd;
            help = {
              link: "http://test.com",
              program: "test-program",
              pathOption: "Lang - Test Program Path"
            };
            beautifier.isWindows = true;
            terminal = 'CMD prompt';
            whichCmd = "where.exe";
            p = beautifier.run("program", [], {
              help: help
            });
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).not.toBe(null);
              expect(v.description.indexOf(help.link)).not.toBe(-1);
              expect(v.description.indexOf(help.program)).not.toBe(-1);
              expect(v.description.indexOf(help.pathOption)).not.toBe(-1, "Error should have a description.");
              expect(v.description.indexOf(terminal)).not.toBe(-1, "Error should have a description including '" + terminal + "' in message.");
              expect(v.description.indexOf(whichCmd)).not.toBe(-1, "Error should have a description including '" + whichCmd + "' in message.");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        if (!isWindows) {
          return it("should error with Mac/Linux-specific help description when beautifier's program not found", function() {
            expect(beautifier).not.toBe(null);
            expect(beautifier instanceof Beautifier).toBe(true);
            return waitsForPromise({
              shouldReject: true
            }, function() {
              var cb, help, p, terminal, whichCmd;
              help = {
                link: "http://test.com",
                program: "test-program",
                pathOption: "Lang - Test Program Path"
              };
              beautifier.isWindows = false;
              terminal = "Terminal";
              whichCmd = "which";
              p = beautifier.run("program", [], {
                help: help
              });
              expect(p).not.toBe(null);
              expect(p instanceof beautifier.Promise).toBe(true);
              cb = function(v) {
                expect(v).not.toBe(null);
                expect(v instanceof Error).toBe(true);
                expect(v.code).toBe("CommandNotFound");
                expect(v.description).not.toBe(null);
                expect(v.description.indexOf(help.link)).not.toBe(-1);
                expect(v.description.indexOf(help.program)).not.toBe(-1);
                expect(v.description.indexOf(terminal)).not.toBe(-1, "Error should have a description including '" + terminal + "' in message.");
                expect(v.description.indexOf(whichCmd)).not.toBe(-1, "Error should have a description including '" + whichCmd + "' in message.");
                return v;
              };
              p.then(cb, cb);
              return p;
            });
          });
        }
      });
    });
    return describe("Options", function() {
      var beautifier, beautifyEditor, editor, workspaceElement;
      editor = null;
      beautifier = null;
      workspaceElement = atom.views.getView(atom.workspace);
      beforeEach(function() {
        beautifier = new Beautifiers();
        return waitsForPromise(function() {
          return atom.workspace.open().then(function(e) {
            editor = e;
            return expect(editor.getText()).toEqual("");
          });
        });
      });
      describe("Migrate Settings", function() {
        var migrateSettings;
        migrateSettings = function(beforeKey, afterKey, val) {
          atom.config.set("atom-beautify." + beforeKey, val);
          atom.commands.dispatch(workspaceElement, "atom-beautify:migrate-settings");
          expect(_.has(atom.config.get('atom-beautify'), beforeKey)).toBe(false);
          return expect(atom.config.get("atom-beautify." + afterKey)).toBe(val);
        };
        it("should migrate js_indent_size to js.indent_size", function() {
          migrateSettings("js_indent_size", "js.indent_size", 1);
          return migrateSettings("js_indent_size", "js.indent_size", 10);
        });
        it("should migrate analytics to general.analytics", function() {
          migrateSettings("analytics", "general.analytics", true);
          return migrateSettings("analytics", "general.analytics", false);
        });
        it("should migrate _analyticsUserId to general._analyticsUserId", function() {
          migrateSettings("_analyticsUserId", "general._analyticsUserId", "userid");
          return migrateSettings("_analyticsUserId", "general._analyticsUserId", "userid2");
        });
        it("should migrate language_js_disabled to js.disabled", function() {
          migrateSettings("language_js_disabled", "js.disabled", false);
          return migrateSettings("language_js_disabled", "js.disabled", true);
        });
        it("should migrate language_js_default_beautifier to js.default_beautifier", function() {
          migrateSettings("language_js_default_beautifier", "js.default_beautifier", "Pretty Diff");
          return migrateSettings("language_js_default_beautifier", "js.default_beautifier", "JS Beautify");
        });
        return it("should migrate language_js_beautify_on_save to js.beautify_on_save", function() {
          migrateSettings("language_js_beautify_on_save", "js.beautify_on_save", true);
          return migrateSettings("language_js_beautify_on_save", "js.beautify_on_save", false);
        });
      });
      beautifyEditor = function(callback) {
        var beforeText, delay, isComplete;
        isComplete = false;
        beforeText = null;
        delay = 500;
        runs(function() {
          beforeText = editor.getText();
          atom.commands.dispatch(workspaceElement, "atom-beautify:beautify-editor");
          return setTimeout(function() {
            return isComplete = true;
          }, delay);
        });
        waitsFor(function() {
          return isComplete;
        });
        return runs(function() {
          var afterText;
          afterText = editor.getText();
          expect(typeof beforeText).toBe('string');
          expect(typeof afterText).toBe('string');
          return callback(beforeText, afterText);
        });
      };
      return describe("JavaScript", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            var packName;
            packName = 'language-javascript';
            return atom.packages.activatePackage(packName);
          });
          return runs(function() {
            var code, grammar;
            code = "var hello='world';function(){console.log('hello '+hello)}";
            editor.setText(code);
            grammar = atom.grammars.selectGrammar('source.js');
            expect(grammar.name).toBe('JavaScript');
            editor.setGrammar(grammar);
            expect(editor.getGrammar().name).toBe('JavaScript');
            return jasmine.unspy(window, 'setTimeout');
          });
        });
        describe(".jsbeautifyrc", function() {
          return it("should look at directories above file", function() {
            var cb, isDone;
            isDone = false;
            cb = function(err) {
              isDone = true;
              return expect(err).toBe(void 0);
            };
            runs(function() {
              var err;
              try {
                return temp.mkdir('dir1', function(err, dirPath) {
                  var myData, myData1, rcPath;
                  if (err) {
                    return cb(err);
                  }
                  rcPath = path.join(dirPath, '.jsbeautifyrc');
                  myData1 = {
                    indent_size: 1,
                    indent_char: '\t'
                  };
                  myData = JSON.stringify(myData1);
                  return fs.writeFile(rcPath, myData, function(err) {
                    if (err) {
                      return cb(err);
                    }
                    dirPath = path.join(dirPath, 'dir2');
                    return fs.mkdir(dirPath, function(err) {
                      var myData2;
                      if (err) {
                        return cb(err);
                      }
                      rcPath = path.join(dirPath, '.jsbeautifyrc');
                      myData2 = {
                        indent_size: 2,
                        indent_char: ' '
                      };
                      myData = JSON.stringify(myData2);
                      return fs.writeFile(rcPath, myData, function(err) {
                        if (err) {
                          return cb(err);
                        }
                        return Promise.all(beautifier.getOptionsForPath(rcPath, null)).then(function(allOptions) {
                          var config1, config2, configOptions, editorConfigOptions, editorOptions, homeOptions, projectOptions, _ref;
                          editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
                          projectOptions = allOptions.slice(4);
                          _ref = projectOptions.slice(-2), config1 = _ref[0], config2 = _ref[1];
                          expect(_.get(config1, '_default.indent_size')).toBe(myData1.indent_size);
                          expect(_.get(config2, '_default.indent_size')).toBe(myData2.indent_size);
                          expect(_.get(config1, '_default.indent_char')).toBe(myData1.indent_char);
                          expect(_.get(config2, '_default.indent_char')).toBe(myData2.indent_char);
                          return cb();
                        });
                      });
                    });
                  });
                });
              } catch (_error) {
                err = _error;
                return cb(err);
              }
            });
            return waitsFor(function() {
              return isDone;
            });
          });
        });
        return describe("Package settings", function() {
          var getOptions;
          getOptions = function(callback) {
            var options;
            options = null;
            waitsForPromise(function() {
              var allOptions;
              allOptions = beautifier.getOptionsForPath(null, null);
              return Promise.all(allOptions).then(function(allOptions) {
                return options = allOptions;
              });
            });
            return runs(function() {
              return callback(options);
            });
          };
          it("should change indent_size to 1", function() {
            atom.config.set('atom-beautify.js.indent_size', 1);
            return getOptions(function(allOptions) {
              var configOptions;
              expect(typeof allOptions).toBe('object');
              configOptions = allOptions[1];
              expect(typeof configOptions).toBe('object');
              expect(configOptions.js.indent_size).toBe(1);
              return beautifyEditor(function(beforeText, afterText) {
                return expect(afterText).toBe("var hello = 'world';\n\nfunction() {\n console.log('hello ' + hello)\n}");
              });
            });
          });
          return it("should change indent_size to 10", function() {
            atom.config.set('atom-beautify.js.indent_size', 10);
            return getOptions(function(allOptions) {
              var configOptions;
              expect(typeof allOptions).toBe('object');
              configOptions = allOptions[1];
              expect(typeof configOptions).toBe('object');
              expect(configOptions.js.indent_size).toBe(10);
              return beautifyEditor(function(beforeText, afterText) {
                return expect(afterText).toBe("var hello = 'world';\n\nfunction() {\n          console.log('hello ' + hello)\n}");
              });
            });
          });
        });
      });
    });
  });

  describe("Languages", function() {
    var languages;
    languages = null;
    beforeEach(function() {
      return languages = new Languages();
    });
    return describe("Languages::namespace", function() {
      return it("should verify that multiple languages do not share the same namespace", function() {
        var namespaceGroups, namespaceOverlap, namespacePairs;
        namespaceGroups = _.groupBy(languages.languages, "namespace");
        namespacePairs = _.toPairs(namespaceGroups);
        namespaceOverlap = _.filter(namespacePairs, function(_arg) {
          var group, namespace;
          namespace = _arg[0], group = _arg[1];
          return group.length > 1;
        });
        return expect(namespaceOverlap.length).toBe(0, "Language namespaces are overlapping.\nNamespaces are unique: only one language for each namespace.\n" + _.map(namespaceOverlap, function(_arg) {
          var group, namespace;
          namespace = _arg[0], group = _arg[1];
          return "- '" + namespace + "': Check languages " + (_.map(group, 'name').join(', ')) + " for using namespace '" + namespace + "'.";
        }).join('\n'));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcGVjL2F0b20tYmVhdXRpZnktc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0ZBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLG9CQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBa0IsSUFBQSxXQUFBLENBQUEsQ0FEbEIsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsK0JBQVIsQ0FGYixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUhaLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FKSixDQUFBOztBQUFBLEVBS0EsRUFBQSxHQUFPLE9BQUEsQ0FBUSxJQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQU5QLENBQUE7O0FBQUEsRUFPQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVIsQ0FQVixDQUFBOztBQUFBLEVBUUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBUlAsQ0FBQTs7QUFBQSxFQVNBLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FUQSxDQUFBOztBQUFBLEVBaUJBLFNBQUEsR0FBWSxPQUFPLENBQUMsUUFBUixLQUFvQixPQUFwQixJQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBWixLQUFzQixRQURaLElBRVYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFaLEtBQXNCLE1BbkJ4QixDQUFBOztBQUFBLEVBcUJBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUV4QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFHVCxlQUFBLENBQWdCLFNBQUEs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/spec/atom-beautify-spec.coffee

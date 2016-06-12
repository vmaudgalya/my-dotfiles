(function() {
  var Beautifiers, JsDiff, beautifier, fs, isWindows, path;

  Beautifiers = require("../src/beautifiers");

  beautifier = new Beautifiers();

  fs = require("fs");

  path = require("path");

  JsDiff = require('diff');

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("BeautifyLanguages", function() {
    var allLanguages, config, configs, dependentPackages, lang, optionsDir, _fn, _i, _j, _len, _len1, _results;
    optionsDir = path.resolve(__dirname, "../examples");
    allLanguages = ["c", "coffee-script", "css", "html", "java", "javascript", "json", "less", "mustache", "objective-c", "perl", "php", "python", "ruby", "sass", "sql", "svg", "xml", "csharp", "gfm", "marko", "tss", "go", "html-swig"];
    dependentPackages = ['autocomplete-plus'];
    _fn = function(lang) {
      return dependentPackages.push("language-" + lang);
    };
    for (_i = 0, _len = allLanguages.length; _i < _len; _i++) {
      lang = allLanguages[_i];
      _fn(lang);
    }
    beforeEach(function() {
      var packageName, _fn1, _j, _len1;
      _fn1 = function(packageName) {
        return waitsForPromise(function() {
          return atom.packages.activatePackage(packageName);
        });
      };
      for (_j = 0, _len1 = dependentPackages.length; _j < _len1; _j++) {
        packageName = dependentPackages[_j];
        _fn1(packageName);
      }
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        if (isWindows) {
          atom.config.set('atom-beautify._loggerLevel', 'verbose');
        }
        return activationPromise;
      });
    });

    /*
    Directory structure:
     - examples
       - config1
         - lang1
           - original
             - 1 - test.ext
           - expected
             - 1 - test.ext
         - lang2
       - config2
     */
    configs = fs.readdirSync(optionsDir);
    _results = [];
    for (_j = 0, _len1 = configs.length; _j < _len1; _j++) {
      config = configs[_j];
      _results.push((function(config) {
        var langsDir, optionStats;
        langsDir = path.resolve(optionsDir, config);
        optionStats = fs.lstatSync(langsDir);
        if (optionStats.isDirectory()) {
          return describe("when using configuration '" + config + "'", function() {
            var langNames, _k, _len2, _results1;
            langNames = fs.readdirSync(langsDir);
            _results1 = [];
            for (_k = 0, _len2 = langNames.length; _k < _len2; _k++) {
              lang = langNames[_k];
              _results1.push((function(lang) {
                var expectedDir, langStats, originalDir, testsDir;
                testsDir = path.resolve(langsDir, lang);
                langStats = fs.lstatSync(testsDir);
                if (langStats.isDirectory()) {
                  originalDir = path.resolve(testsDir, "original");
                  if (!fs.existsSync(originalDir)) {
                    console.warn("Directory for test originals/inputs not found." + (" Making it at " + originalDir + "."));
                    fs.mkdirSync(originalDir);
                  }
                  expectedDir = path.resolve(testsDir, "expected");
                  if (!fs.existsSync(expectedDir)) {
                    console.warn("Directory for test expected/results not found." + ("Making it at " + expectedDir + "."));
                    fs.mkdirSync(expectedDir);
                  }
                  return describe("when beautifying language '" + lang + "'", function() {
                    var testFileName, testNames, _l, _len3, _results2;
                    testNames = fs.readdirSync(originalDir);
                    _results2 = [];
                    for (_l = 0, _len3 = testNames.length; _l < _len3; _l++) {
                      testFileName = testNames[_l];
                      _results2.push((function(testFileName) {
                        var ext, testName;
                        ext = path.extname(testFileName);
                        testName = path.basename(testFileName, ext);
                        if (testFileName[0] === '_') {
                          return;
                        }
                        return it("" + testName + " " + testFileName, function() {
                          var allOptions, beautifyCompleted, completionFun, expectedContents, expectedTestPath, grammar, grammarName, language, originalContents, originalTestPath, _ref, _ref1;
                          originalTestPath = path.resolve(originalDir, testFileName);
                          expectedTestPath = path.resolve(expectedDir, testFileName);
                          originalContents = (_ref = fs.readFileSync(originalTestPath)) != null ? _ref.toString() : void 0;
                          if (!fs.existsSync(expectedTestPath)) {
                            throw new Error(("No matching expected test result found for '" + testName + "' ") + ("at '" + expectedTestPath + "'."));
                          }
                          expectedContents = (_ref1 = fs.readFileSync(expectedTestPath)) != null ? _ref1.toString() : void 0;
                          grammar = atom.grammars.selectGrammar(originalTestPath, originalContents);
                          grammarName = grammar.name;
                          allOptions = beautifier.getOptionsForPath(originalTestPath);
                          language = beautifier.getLanguage(grammarName, testFileName);
                          beautifyCompleted = false;
                          completionFun = function(text) {
                            var diff, fileName, newHeader, newStr, oldHeader, oldStr, opts;
                            expect(text instanceof Error).not.toEqual(true, text);
                            if (text instanceof Error) {
                              return beautifyCompleted = true;
                            }
                            expect(text).not.toEqual(null, "Language or Beautifier not found");
                            if (text === null) {
                              return beautifyCompleted = true;
                            }
                            expect(typeof text).toEqual("string", "Text: " + text);
                            if (typeof text !== "string") {
                              return beautifyCompleted = true;
                            }
                            text = text.replace(/(?:\r\n|\r|\n)/g, '⏎\n');
                            expectedContents = expectedContents.replace(/(?:\r\n|\r|\n)/g, '⏎\n');
                            text = text.replace(/(?:\t)/g, '↹');
                            expectedContents = expectedContents.replace(/(?:\t)/g, '↹');
                            text = text.replace(/(?:\ )/g, '␣');
                            expectedContents = expectedContents.replace(/(?:\ )/g, '␣');
                            if (text !== expectedContents) {
                              fileName = expectedTestPath;
                              oldStr = text;
                              newStr = expectedContents;
                              oldHeader = "beautified";
                              newHeader = "expected";
                              diff = JsDiff.createPatch(fileName, oldStr, newStr, oldHeader, newHeader);
                              opts = beautifier.getOptionsForLanguage(allOptions, language);
                              expect(text).toEqual(expectedContents, "Beautifier output does not match expected output:\n" + diff + "\n\nWith options:\n" + (JSON.stringify(opts, void 0, 4)));
                            }
                            return beautifyCompleted = true;
                          };
                          runs(function() {
                            var e;
                            try {
                              return beautifier.beautify(originalContents, allOptions, grammarName, testFileName).then(completionFun)["catch"](completionFun);
                            } catch (_error) {
                              e = _error;
                              return beautifyCompleted = e;
                            }
                          });
                          return waitsFor(function() {
                            if (beautifyCompleted instanceof Error) {
                              throw beautifyCompleted;
                            } else {
                              return beautifyCompleted;
                            }
                          }, "Waiting for beautification to complete", 60000);
                        });
                      })(testFileName));
                    }
                    return _results2;
                  });
                }
              })(lang));
            }
            return _results1;
          });
        }
      })(config));
    }
    return _results;
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcGVjL2JlYXV0aWZ5LWxhbmd1YWdlcy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxvREFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsb0JBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFpQixJQUFBLFdBQUEsQ0FBQSxDQURqQixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQVMsT0FBQSxDQUFRLE1BQVIsQ0FKVCxDQUFBOztBQUFBLEVBWUEsU0FBQSxHQUFZLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXBCLElBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFaLEtBQXNCLFFBRFosSUFFVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosS0FBc0IsTUFkeEIsQ0FBQTs7QUFBQSxFQWdCQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBRTVCLFFBQUEsc0dBQUE7QUFBQSxJQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsYUFBeEIsQ0FBYixDQUFBO0FBQUEsSUFHQSxZQUFBLEdBQWUsQ0FDYixHQURhLEVBQ1IsZUFEUSxFQUNTLEtBRFQsRUFDZ0IsTUFEaEIsRUFFYixNQUZhLEVBRUwsWUFGSyxFQUVTLE1BRlQsRUFFaUIsTUFGakIsRUFHYixVQUhhLEVBR0QsYUFIQyxFQUdjLE1BSGQsRUFHc0IsS0FIdEIsRUFJYixRQUphLEVBSUgsTUFKRyxFQUlLLE1BSkwsRUFJYSxLQUpiLEVBSW9C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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/spec/beautify-languages-spec.coffee

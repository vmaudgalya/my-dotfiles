(function() {
  var Beautifier, PHPCSFixer, isWindows, path;

  PHPCSFixer = require("../src/beautifiers/php-cs-fixer");

  Beautifier = require("../src/beautifiers/beautifier");

  path = require('path');

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("PHP-CS-Fixer Beautifier", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        return activationPromise;
      });
    });
    return describe("Beautifier::beautify", function() {
      var OSSpecificSpecs, beautifier;
      beautifier = null;
      beforeEach(function() {
        return beautifier = new PHPCSFixer();
      });
      OSSpecificSpecs = function() {
        var failWhichProgram, text;
        text = "<?php echo \"test\"; ?>";
        it("should error when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, language, options, p;
            language = "PHP";
            options = {
              fixers: "",
              levels: ""
            };
            beautifier.spawn = function(exe, args, options) {
              var er;
              er = new Error('ENOENT');
              er.code = 'ENOENT';
              return beautifier.Promise.reject(er);
            };
            p = beautifier.beautify(text, language, options);
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
              expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        failWhichProgram = function(failingProgram) {
          return it("should error when '" + failingProgram + "' not found", function() {
            expect(beautifier).not.toBe(null);
            expect(beautifier instanceof Beautifier).toBe(true);
            if (!beautifier.isWindows && failingProgram === "php") {
              return;
            }
            return waitsForPromise({
              shouldReject: true
            }, function() {
              var cb, language, oldSpawn, options, p;
              language = "PHP";
              options = {
                fixers: "",
                levels: ""
              };
              cb = function(v) {
                expect(v).not.toBe(null);
                expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
                expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
                expect(v.file).toBe(failingProgram);
                return v;
              };
              beautifier.which = function(exe, options) {
                if (exe == null) {
                  return beautifier.Promise.resolve(null);
                }
                if (exe === failingProgram) {
                  return beautifier.Promise.resolve(failingProgram);
                } else {
                  return beautifier.Promise.resolve("/" + exe);
                }
              };
              oldSpawn = beautifier.spawn.bind(beautifier);
              beautifier.spawn = function(exe, args, options) {
                var er;
                if (exe === failingProgram) {
                  er = new Error('ENOENT');
                  er.code = 'ENOENT';
                  return beautifier.Promise.reject(er);
                } else {
                  return beautifier.Promise.resolve({
                    returnCode: 0,
                    stdout: 'stdout',
                    stderr: ''
                  });
                }
              };
              p = beautifier.beautify(text, language, options);
              expect(p).not.toBe(null);
              expect(p instanceof beautifier.Promise).toBe(true);
              p.then(cb, cb);
              return p;
            });
          });
        };
        return failWhichProgram('php-cs-fixer');
      };
      if (!isWindows) {
        describe("Mac/Linux", function() {
          beforeEach(function() {
            return beautifier.isWindows = false;
          });
          return OSSpecificSpecs();
        });
      }
      return describe("Windows", function() {
        beforeEach(function() {
          return beautifier.isWindows = true;
        });
        return OSSpecificSpecs();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcGVjL2JlYXV0aWZpZXItcGhwLWNzLWZpeGVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVDQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxpQ0FBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLCtCQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFVQSxTQUFBLEdBQVksT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBcEIsSUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosS0FBc0IsUUFEWixJQUVWLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBWixLQUFzQixNQVp4QixDQUFBOztBQUFBLEVBY0EsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtBQUVsQyxJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFHVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtBQUNkLFlBQUEsdUJBQUE7QUFBQSxRQUFBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixlQUE5QixDQUFwQixDQUFBO0FBQUEsUUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixlQUEvQixDQUZQLENBQUE7QUFBQSxRQUdBLElBQUksQ0FBQyxXQUFMLENBQUEsQ0FIQSxDQUFBO0FBT0EsZUFBTyxpQkFBUCxDQVJjO01BQUEsQ0FBaEIsRUFIUztJQUFBLENBQVgsQ0FBQSxDQUFBO1dBYUEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUUvQixVQUFBLDJCQUFBO0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/spec/beautifier-php-cs-fixer-spec.coffee

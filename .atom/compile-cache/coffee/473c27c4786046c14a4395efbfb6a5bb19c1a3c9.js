(function() {
  var LB, PU, PW, chai, defaultConfig, expect, fs, path;

  chai = require('../node_modules/chai');

  expect = chai.expect;

  fs = require('fs-plus');

  path = require('path');

  defaultConfig = require('./default-config');

  LB = 'language-babel';

  PU = '/dir199a99231';

  PW = 'C:\\dir199a99231';

  jasmine.getEnv().defaultTimeoutInterval = 15000;

  describe('language-babel', function() {
    var config, lb;
    lb = null;
    config = {};
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage(LB);
      });
      config = JSON.parse(JSON.stringify(defaultConfig));
      return runs(function() {
        return lb = atom.packages.getActivePackage(LB).mainModule.transpiler;
      });
    });
    describe('Reading real config', function() {
      return it('should read all possible configuration keys', function() {
        var key, realConfig, value, _results;
        realConfig = lb.getConfig();
        _results = [];
        for (key in config) {
          value = config[key];
          _results.push(expect(realConfig).to.contain.all.keys(key));
        }
        return _results;
      });
    });
    describe(':getPaths', function() {
      if (!process.platform.match(/^win/)) {
        it('returns paths for a named sourcefile with default config', function() {
          var ret;
          atom.project.setPaths([PU + '/Project1', PU + '/Project2']);
          ret = lb.getPaths(PU + '/Project1/source/dira/fauxfile.js', config);
          expect(ret.sourceFile).to.equal(PU + '/Project1/source/dira/fauxfile.js');
          expect(ret.sourceFileDir).to.equal(PU + '/Project1/source/dira');
          expect(ret.mapFile).to.equal(PU + '/Project1/source/dira/fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(PU + '/Project1/source/dira/fauxfile.js');
          expect(ret.sourceRoot).to.equal(PU + '/Project1');
          return expect(ret.projectPath).to.equal(PU + '/Project1');
        });
        it('returns paths config with target & source paths set', function() {
          var ret;
          atom.project.setPaths([PU + '/Project1', PU + '/Project2']);
          config.babelSourcePath = '/source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = '/transpath';
          ret = lb.getPaths(PU + '/Project1/source/dira/fauxfile.js', config);
          expect(ret.sourceFile).to.equal(PU + '/Project1/source/dira/fauxfile.js');
          expect(ret.sourceFileDir).to.equal(PU + '/Project1/source/dira');
          expect(ret.mapFile).to.equal(PU + '/Project1/mapspath/dira/fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(PU + '/Project1/transpath/dira/fauxfile.js');
          expect(ret.sourceRoot).to.equal(PU + '/Project1/source');
          return expect(ret.projectPath).to.equal(PU + '/Project1');
        });
        it('returns correct paths with project in root directory', function() {
          var ret;
          atom.project.setPaths(['/']);
          config.babelSourcePath = 'source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = 'transpath';
          ret = lb.getPaths('/source/dira/fauxfile.js', config);
          expect(ret.sourceFile).to.equal('/source/dira/fauxfile.js');
          expect(ret.sourceFileDir).to.equal('/source/dira');
          expect(ret.mapFile).to.equal('/mapspath/dira/fauxfile.js.map');
          expect(ret.transpiledFile).to.equal('/transpath/dira/fauxfile.js');
          expect(ret.sourceRoot).to.equal('/source');
          return expect(ret.projectPath).to.equal('/');
        });
      }
      if (process.platform.match(/^win/)) {
        it('returns paths for a named sourcefile with default config', function() {
          var ret;
          atom.project.setPaths([PW + '\\Project1', PW + '\\Project2']);
          ret = lb.getPaths(PW + '\\Project1\\source\\dira\\fauxfile.js', config);
          expect(ret.sourceFile).to.equal(PW + '\\Project1\\source\\dira\\fauxfile.js');
          expect(ret.sourceFileDir).to.equal(PW + '\\Project1\\source\\dira');
          expect(ret.mapFile).to.equal(PW + '\\Project1\\source\\dira\\fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(PW + '\\Project1\\source\\dira\\fauxfile.js');
          expect(ret.sourceRoot).to.equal(PW + '\\Project1');
          return expect(ret.projectPath).to.equal(PW + '\\Project1');
        });
        it('returns paths config with target & source paths set', function() {
          var ret;
          atom.project.setPaths([PW + '\\Project1', PW + '\\Project2']);
          config.babelSourcePath = '\\source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = '\\transpath';
          ret = lb.getPaths(PW + '\\Project1\\source\\dira\\fauxfile.js', config);
          expect(ret.sourceFile).to.equal(PW + '\\Project1\\source\\dira\\fauxfile.js');
          expect(ret.sourceFileDir).to.equal(PW + '\\Project1\\source\\dira');
          expect(ret.mapFile).to.equal(PW + '\\Project1\\mapspath\\dira\\fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(PW + '\\Project1\\transpath\\dira\\fauxfile.js');
          expect(ret.sourceRoot).to.equal(PW + '\\Project1\\source');
          return expect(ret.projectPath).to.equal(PW + '\\Project1');
        });
        return it('returns correct paths with project in root directory', function() {
          var ret;
          atom.project.setPaths(['C:\\']);
          config.babelSourcePath = 'source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = 'transpath';
          ret = lb.getPaths('C:\\source\\dira\\fauxfile.js', config);
          expect(ret.sourceFile).to.equal('C:\\source\\dira\\fauxfile.js');
          expect(ret.sourceFileDir).to.equal('C:\\source\\dira');
          expect(ret.mapFile).to.equal('C:\\mapspath\\dira\\fauxfile.js.map');
          expect(ret.transpiledFile).to.equal('C:\\transpath\\dira\\fauxfile.js');
          expect(ret.sourceRoot).to.equal('C:\\source');
          return expect(ret.projectPath).to.equal('C:\\');
        });
      }
    });
    return describe(':transpile', function() {
      var notification, notificationSpy, writeFileName, writeFileStub;
      notificationSpy = null;
      notification = null;
      writeFileStub = null;
      writeFileName = null;
      beforeEach(function() {
        notificationSpy = jasmine.createSpy('notificationSpy');
        notification = atom.notifications.onDidAddNotification(notificationSpy);
        writeFileName = null;
        return writeFileStub = spyOn(fs, 'writeFileSync').andCallFake(function(path) {
          return writeFileName = path;
        });
      });
      afterEach(function() {
        return notification.dispose();
      });
      describe('when transpileOnSave is false', function() {
        return it('does nothing', function() {
          config.transpileOnSave = false;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile('somefilename');
          expect(notificationSpy.callCount).to.equal(0);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a source file is outside the "babelSourcePath" & suppress msgs false', function() {
        return it('notifies sourcefile is not inside sourcepath', function() {
          var msg, type;
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(__dirname + '/fake.js');
          expect(notificationSpy.callCount).to.equal(1);
          msg = notificationSpy.calls[0].args[0].message;
          type = notificationSpy.calls[0].args[0].type;
          expect(msg).to.match(/^LB: Babel file is not inside/);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a source file is outside the "babelSourcePath" & suppress msgs true', function() {
        return it('exects no notifications', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.suppressSourcePathMessages = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(__dirname + '/fake.js');
          expect(notificationSpy.callCount).to.equal(0);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a js files is transpiled and gets an error', function() {
        return it('it issues a notification error message', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/bad.js'));
          waitsFor(function() {
            return notificationSpy.callCount;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(1);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Error/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a js file saved but no output is set', function() {
        return it('calls the transpiler but doesnt save output', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.createTranspiledCode = false;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/react.jsx'));
          waitsFor(function() {
            return notificationSpy.callCount > 1;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(2);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            msg = notificationSpy.calls[1].args[0].message;
            expect(msg).to.match(/^LB: No transpiled output configured/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a js file saved but no transpile path is set', function() {
        return it('calls the transpiler and transpiles OK but doesnt save and issues msg', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/good.js'));
          waitsFor(function() {
            return notificationSpy.callCount > 1;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(2);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            msg = notificationSpy.calls[1].args[0].message;
            expect(msg).to.match(/^LB: Transpiled file would overwrite source file/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a jsx file saved,transpile path is set, source maps enabled', function() {
        return it('calls the transpiler and transpiles OK, saves as .js and issues msg', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures-transpiled';
          config.babelMapsPath = 'fixtures-maps';
          config.createMap = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/react.jsx'));
          waitsFor(function() {
            return writeFileStub.callCount;
          });
          return runs(function() {
            var expectedFileName, msg, savedFilename;
            expect(notificationSpy.callCount).to.equal(1);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            expect(writeFileStub.callCount).to.equal(2);
            savedFilename = writeFileStub.calls[0].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-transpiled/dira/dira.1/dira.2/react.js');
            expect(savedFilename).to.equal(expectedFileName);
            savedFilename = writeFileStub.calls[1].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-maps/dira/dira.1/dira.2/react.js.map');
            return expect(savedFilename).to.equal(expectedFileName);
          });
        });
      });
      describe('When a jsx file saved,transpile path is set, source maps enabled, success suppressed', function() {
        return it('calls the transpiler and transpiles OK, saves as .js and issues msg', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures-transpiled';
          config.babelMapsPath = 'fixtures-maps';
          config.createMap = true;
          config.suppressTranspileOnSaveMessages = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/react.jsx'));
          waitsFor(function() {
            return writeFileStub.callCount;
          });
          return runs(function() {
            var expectedFileName, savedFilename;
            expect(notificationSpy.callCount).to.equal(0);
            expect(writeFileStub.callCount).to.equal(2);
            savedFilename = writeFileStub.calls[0].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-transpiled/dira/dira.1/dira.2/react.js');
            expect(savedFilename).to.equal(expectedFileName);
            savedFilename = writeFileStub.calls[1].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-maps/dira/dira.1/dira.2/react.js.map');
            return expect(savedFilename).to.equal(expectedFileName);
          });
        });
      });
      describe('When a js file saved , babelrc in path and flag disableWhenNoBabelrcFileInPath is set', function() {
        return it('calls the transpiler', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.createTranspiledCode = false;
          config.disableWhenNoBabelrcFileInPath = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/good.js'));
          waitsFor(function() {
            return notificationSpy.callCount;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(2);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            msg = notificationSpy.calls[1].args[0].message;
            expect(msg).to.match(/^LB: No transpiled output configured/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a js file saved , babelrc in not in path and flag disableWhenNoBabelrcFileInPath is set', function() {
        return it('does nothing', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.createTranspiledCode = false;
          config.disableWhenNoBabelrcFileInPath = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dirb/good.js'));
          expect(notificationSpy.callCount).to.equal(0);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      return describe('When a js file saved in a nested project', function() {
        return it('creates a file in the correct location based upon .languagebabel', function() {
          var sourceFile, targetFile;
          atom.project.setPaths([__dirname]);
          config.allowLocalOverride = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          sourceFile = path.resolve(__dirname, 'fixtures/projectRoot/src/test.js');
          targetFile = path.resolve(__dirname, 'fixtures/projectRoot/test.js');
          lb.transpile(sourceFile);
          waitsFor(function() {
            return writeFileStub.callCount;
          });
          return runs(function() {
            return expect(writeFileName).to.equal(targetFile);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvc3BlYy9sYW5ndWFnZS1iYWJlbC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsc0JBQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxNQURkLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBSmhCLENBQUE7O0FBQUEsRUFNQSxFQUFBLEdBQUssZ0JBTkwsQ0FBQTs7QUFBQSxFQWFBLEVBQUEsR0FBSyxlQWJMLENBQUE7O0FBQUEsRUFjQSxFQUFBLEdBQUssa0JBZEwsQ0FBQTs7QUFBQSxFQWdCQSxPQUFPLENBQUMsTUFBUixDQUFBLENBQWdCLENBQUMsc0JBQWpCLEdBQTBDLEtBaEIxQyxDQUFBOztBQUFBLEVBa0JBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSxVQUFBO0FBQUEsSUFBQSxFQUFBLEdBQUssSUFBTCxDQUFBO0FBQUEsSUFDQSxNQUFBLEdBQVUsRUFEVixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixFQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/spec/language-babel-spec.coffee

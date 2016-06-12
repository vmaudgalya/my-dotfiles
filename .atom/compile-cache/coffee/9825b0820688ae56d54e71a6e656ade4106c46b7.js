(function() {
  var ColorBuffer, ColorProject, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, TOTAL_COLORS_VARIABLES_IN_PROJECT, TOTAL_VARIABLES_IN_PROJECT, click, fs, jsonFixture, os, path, temp, _ref;

  os = require('os');

  fs = require('fs-plus');

  path = require('path');

  temp = require('temp');

  _ref = require('../lib/versions'), SERIALIZE_VERSION = _ref.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = _ref.SERIALIZE_MARKERS_VERSION;

  ColorProject = require('../lib/color-project');

  ColorBuffer = require('../lib/color-buffer');

  jsonFixture = require('./helpers/fixtures').jsonFixture(__dirname, 'fixtures');

  click = require('./helpers/events').click;

  TOTAL_VARIABLES_IN_PROJECT = 12;

  TOTAL_COLORS_VARIABLES_IN_PROJECT = 10;

  describe('ColorProject', function() {
    var eventSpy, paths, project, promise, rootPath, _ref1;
    _ref1 = [], project = _ref1[0], promise = _ref1[1], rootPath = _ref1[2], paths = _ref1[3], eventSpy = _ref1[4];
    beforeEach(function() {
      var fixturesPath;
      atom.config.set('pigments.sourceNames', ['*.styl']);
      atom.config.set('pigments.ignoredNames', []);
      fixturesPath = atom.project.getPaths()[0];
      rootPath = "" + fixturesPath + "/project";
      atom.project.setPaths([rootPath]);
      return project = new ColorProject({
        ignoredNames: ['vendor/*'],
        sourceNames: ['*.less'],
        ignoredScopes: ['\\.comment']
      });
    });
    afterEach(function() {
      return project.destroy();
    });
    describe('.deserialize', function() {
      return it('restores the project in its previous state', function() {
        var data, json;
        data = {
          root: rootPath,
          timestamp: new Date().toJSON(),
          version: SERIALIZE_VERSION,
          markersVersion: SERIALIZE_MARKERS_VERSION
        };
        json = jsonFixture('base-project.json', data);
        project = ColorProject.deserialize(json);
        expect(project).toBeDefined();
        expect(project.getPaths()).toEqual(["" + rootPath + "/styles/buttons.styl", "" + rootPath + "/styles/variables.styl"]);
        expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        return expect(project.getColorVariables().length).toEqual(TOTAL_COLORS_VARIABLES_IN_PROJECT);
      });
    });
    describe('::initialize', function() {
      beforeEach(function() {
        eventSpy = jasmine.createSpy('did-initialize');
        project.onDidInitialize(eventSpy);
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      it('loads the paths to scan in the project', function() {
        return expect(project.getPaths()).toEqual(["" + rootPath + "/styles/buttons.styl", "" + rootPath + "/styles/variables.styl"]);
      });
      it('scans the loaded paths to retrieve the variables', function() {
        expect(project.getVariables()).toBeDefined();
        return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
      });
      return it('dispatches a did-initialize event', function() {
        return expect(eventSpy).toHaveBeenCalled();
      });
    });
    describe('::findAllColors', function() {
      return it('returns all the colors in the legibles files of the project', function() {
        var search;
        search = project.findAllColors();
        return expect(search).toBeDefined();
      });
    });
    describe('when the variables have not been loaded yet', function() {
      describe('::serialize', function() {
        return it('returns an object without paths nor variables', function() {
          var date, expected;
          date = new Date;
          spyOn(project, 'getTimestamp').andCallFake(function() {
            return date;
          });
          expected = {
            deserializer: 'ColorProject',
            timestamp: date,
            version: SERIALIZE_VERSION,
            markersVersion: SERIALIZE_MARKERS_VERSION,
            globalSourceNames: ['*.styl'],
            globalIgnoredNames: [],
            ignoredNames: ['vendor/*'],
            sourceNames: ['*.less'],
            ignoredScopes: ['\\.comment'],
            buffers: {}
          };
          return expect(project.serialize()).toEqual(expected);
        });
      });
      describe('::getVariablesForPath', function() {
        return it('returns undefined', function() {
          return expect(project.getVariablesForPath("" + rootPath + "/styles/variables.styl")).toEqual([]);
        });
      });
      describe('::getVariableByName', function() {
        return it('returns undefined', function() {
          return expect(project.getVariableByName("foo")).toBeUndefined();
        });
      });
      describe('::getVariableById', function() {
        return it('returns undefined', function() {
          return expect(project.getVariableById(0)).toBeUndefined();
        });
      });
      describe('::getContext', function() {
        return it('returns an empty context', function() {
          expect(project.getContext()).toBeDefined();
          return expect(project.getContext().getVariablesCount()).toEqual(0);
        });
      });
      describe('::getPalette', function() {
        return it('returns an empty palette', function() {
          expect(project.getPalette()).toBeDefined();
          return expect(project.getPalette().getColorsCount()).toEqual(0);
        });
      });
      describe('::reloadVariablesForPath', function() {
        beforeEach(function() {
          spyOn(project, 'initialize').andCallThrough();
          return waitsForPromise(function() {
            return project.reloadVariablesForPath("" + rootPath + "/styles/variables.styl");
          });
        });
        return it('returns a promise hooked on the initialize promise', function() {
          return expect(project.initialize).toHaveBeenCalled();
        });
      });
      describe('::setIgnoredNames', function() {
        beforeEach(function() {
          project.setIgnoredNames([]);
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('initializes the project with the new paths', function() {
          return expect(project.getVariables().length).toEqual(32);
        });
      });
      return describe('::setSourceNames', function() {
        beforeEach(function() {
          project.setSourceNames([]);
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('initializes the project with the new paths', function() {
          return expect(project.getVariables().length).toEqual(12);
        });
      });
    });
    describe('when the project has no variables source files', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        rootPath = "" + fixturesPath + "-no-sources";
        atom.project.setPaths([rootPath]);
        project = new ColorProject({});
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      it('initializes the paths with an empty array', function() {
        return expect(project.getPaths()).toEqual([]);
      });
      return it('initializes the variables with an empty array', function() {
        return expect(project.getVariables()).toEqual([]);
      });
    });
    describe('when the project has custom source names defined', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        project = new ColorProject({
          sourceNames: ['*.styl']
        });
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      it('initializes the paths with an empty array', function() {
        return expect(project.getPaths().length).toEqual(2);
      });
      return it('initializes the variables with an empty array', function() {
        expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        return expect(project.getColorVariables().length).toEqual(TOTAL_COLORS_VARIABLES_IN_PROJECT);
      });
    });
    describe('when the project has looping variable definition', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        rootPath = "" + fixturesPath + "-with-recursion";
        atom.project.setPaths([rootPath]);
        project = new ColorProject({});
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      return it('ignores the looping definition', function() {
        expect(project.getVariables().length).toEqual(4);
        return expect(project.getColorVariables().length).toEqual(4);
      });
    });
    describe('when the variables have been loaded', function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      describe('::serialize', function() {
        return it('returns an object with project properties', function() {
          var date;
          date = new Date;
          spyOn(project, 'getTimestamp').andCallFake(function() {
            return date;
          });
          return expect(project.serialize()).toEqual({
            deserializer: 'ColorProject',
            ignoredNames: ['vendor/*'],
            sourceNames: ['*.less'],
            ignoredScopes: ['\\.comment'],
            timestamp: date,
            version: SERIALIZE_VERSION,
            markersVersion: SERIALIZE_MARKERS_VERSION,
            paths: ["" + rootPath + "/styles/buttons.styl", "" + rootPath + "/styles/variables.styl"],
            globalSourceNames: ['*.styl'],
            globalIgnoredNames: [],
            buffers: {},
            variables: project.variables.serialize()
          });
        });
      });
      describe('::getVariablesForPath', function() {
        it('returns the variables defined in the file', function() {
          return expect(project.getVariablesForPath("" + rootPath + "/styles/variables.styl").length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
        return describe('for a file that was ignored in the scanning process', function() {
          return it('returns undefined', function() {
            return expect(project.getVariablesForPath("" + rootPath + "/vendor/css/variables.less")).toEqual([]);
          });
        });
      });
      describe('::deleteVariablesForPath', function() {
        return it('removes all the variables coming from the specified file', function() {
          project.deleteVariablesForPath("" + rootPath + "/styles/variables.styl");
          return expect(project.getVariablesForPath("" + rootPath + "/styles/variables.styl")).toEqual([]);
        });
      });
      describe('::getContext', function() {
        return it('returns a context with the project variables', function() {
          expect(project.getContext()).toBeDefined();
          return expect(project.getContext().getVariablesCount()).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
      });
      describe('::getPalette', function() {
        return it('returns a palette with the colors from the project', function() {
          expect(project.getPalette()).toBeDefined();
          return expect(project.getPalette().getColorsCount()).toEqual(10);
        });
      });
      describe('::showVariableInFile', function() {
        return it('opens the file where is located the variable', function() {
          var spy;
          spy = jasmine.createSpy('did-add-text-editor');
          atom.workspace.onDidAddTextEditor(spy);
          project.showVariableInFile(project.getVariables()[0]);
          waitsFor(function() {
            return spy.callCount > 0;
          });
          return runs(function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            return expect(editor.getSelectedBufferRange()).toEqual([[1, 2], [1, 14]]);
          });
        });
      });
      describe('::reloadVariablesForPath', function() {
        return describe('for a file that is part of the loaded paths', function() {
          describe('where the reload finds new variables', function() {
            beforeEach(function() {
              project.deleteVariablesForPath("" + rootPath + "/styles/variables.styl");
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPath("" + rootPath + "/styles/variables.styl");
              });
            });
            it('scans again the file to find variables', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('dispatches a did-update-variables event', function() {
              return expect(eventSpy).toHaveBeenCalled();
            });
          });
          return describe('where the reload finds nothing new', function() {
            beforeEach(function() {
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPath("" + rootPath + "/styles/variables.styl");
              });
            });
            it('leaves the file variables intact', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('does not dispatch a did-update-variables event', function() {
              return expect(eventSpy).not.toHaveBeenCalled();
            });
          });
        });
      });
      describe('::reloadVariablesForPaths', function() {
        describe('for a file that is part of the loaded paths', function() {
          describe('where the reload finds new variables', function() {
            beforeEach(function() {
              project.deleteVariablesForPaths(["" + rootPath + "/styles/variables.styl", "" + rootPath + "/styles/buttons.styl"]);
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPaths(["" + rootPath + "/styles/variables.styl", "" + rootPath + "/styles/buttons.styl"]);
              });
            });
            it('scans again the file to find variables', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('dispatches a did-update-variables event', function() {
              return expect(eventSpy).toHaveBeenCalled();
            });
          });
          return describe('where the reload finds nothing new', function() {
            beforeEach(function() {
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPaths(["" + rootPath + "/styles/variables.styl", "" + rootPath + "/styles/buttons.styl"]);
              });
            });
            it('leaves the file variables intact', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('does not dispatch a did-update-variables event', function() {
              return expect(eventSpy).not.toHaveBeenCalled();
            });
          });
        });
        return describe('for a file that is not part of the loaded paths', function() {
          beforeEach(function() {
            spyOn(project, 'loadVariablesForPath').andCallThrough();
            return waitsForPromise(function() {
              return project.reloadVariablesForPath("" + rootPath + "/vendor/css/variables.less");
            });
          });
          return it('does nothing', function() {
            return expect(project.loadVariablesForPath).not.toHaveBeenCalled();
          });
        });
      });
      describe('when a buffer with variables is open', function() {
        var colorBuffer, editor, _ref2;
        _ref2 = [], editor = _ref2[0], colorBuffer = _ref2[1];
        beforeEach(function() {
          eventSpy = jasmine.createSpy('did-update-variables');
          project.onDidUpdateVariables(eventSpy);
          waitsForPromise(function() {
            return atom.workspace.open('styles/variables.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            colorBuffer = project.colorBufferForEditor(editor);
            return spyOn(colorBuffer, 'scanBufferForVariables').andCallThrough();
          });
          waitsForPromise(function() {
            return project.initialize();
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('updates the project variable with the buffer ranges', function() {
          var variable, _i, _len, _ref3, _results;
          _ref3 = project.getVariables();
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            variable = _ref3[_i];
            _results.push(expect(variable.bufferRange).toBeDefined());
          }
          return _results;
        });
        describe('when a color is modified that does not affect other variables ranges', function() {
          var variablesTextRanges;
          variablesTextRanges = [][0];
          beforeEach(function() {
            variablesTextRanges = {};
            project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
              return variablesTextRanges[variable.name] = variable.range;
            });
            editor.setSelectedBufferRange([[1, 7], [1, 14]]);
            editor.insertText('#336');
            editor.getBuffer().emitter.emit('did-stop-changing');
            return waitsFor(function() {
              return eventSpy.callCount > 0;
            });
          });
          it('reloads the variables with the buffer instead of the file', function() {
            expect(colorBuffer.scanBufferForVariables).toHaveBeenCalled();
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
          });
          it('uses the buffer ranges to detect which variables were really changed', function() {
            expect(eventSpy.argsForCall[0][0].destroyed).toBeUndefined();
            expect(eventSpy.argsForCall[0][0].created).toBeUndefined();
            return expect(eventSpy.argsForCall[0][0].updated.length).toEqual(1);
          });
          it('updates the text range of the other variables', function() {
            return project.getVariablesForPath("" + rootPath + "/styles/variables.styl").forEach(function(variable) {
              if (variable.name !== 'colors.red') {
                expect(variable.range[0]).toEqual(variablesTextRanges[variable.name][0] - 3);
                return expect(variable.range[1]).toEqual(variablesTextRanges[variable.name][1] - 3);
              }
            });
          });
          return it('dispatches a did-update-variables event', function() {
            return expect(eventSpy).toHaveBeenCalled();
          });
        });
        describe('when a text is inserted that affects other variables ranges', function() {
          var variablesBufferRanges, variablesTextRanges, _ref3;
          _ref3 = [], variablesTextRanges = _ref3[0], variablesBufferRanges = _ref3[1];
          beforeEach(function() {
            runs(function() {
              variablesTextRanges = {};
              variablesBufferRanges = {};
              project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
                variablesTextRanges[variable.name] = variable.range;
                return variablesBufferRanges[variable.name] = variable.bufferRange;
              });
              spyOn(project.variables, 'addMany').andCallThrough();
              editor.setSelectedBufferRange([[0, 0], [0, 0]]);
              editor.insertText('\n\n');
              return editor.getBuffer().emitter.emit('did-stop-changing');
            });
            return waitsFor(function() {
              return project.variables.addMany.callCount > 0;
            });
          });
          it('does not trigger a change event', function() {
            return expect(eventSpy.callCount).toEqual(0);
          });
          return it('updates the range of the updated variables', function() {
            return project.getVariablesForPath("" + rootPath + "/styles/variables.styl").forEach(function(variable) {
              if (variable.name !== 'colors.red') {
                expect(variable.range[0]).toEqual(variablesTextRanges[variable.name][0] + 2);
                expect(variable.range[1]).toEqual(variablesTextRanges[variable.name][1] + 2);
                return expect(variable.bufferRange.isEqual(variablesBufferRanges[variable.name])).toBeFalsy();
              }
            });
          });
        });
        describe('when a color is removed', function() {
          var variablesTextRanges;
          variablesTextRanges = [][0];
          beforeEach(function() {
            runs(function() {
              variablesTextRanges = {};
              project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
                return variablesTextRanges[variable.name] = variable.range;
              });
              editor.setSelectedBufferRange([[1, 0], [2, 0]]);
              editor.insertText('');
              return editor.getBuffer().emitter.emit('did-stop-changing');
            });
            return waitsFor(function() {
              return eventSpy.callCount > 0;
            });
          });
          it('reloads the variables with the buffer instead of the file', function() {
            expect(colorBuffer.scanBufferForVariables).toHaveBeenCalled();
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT - 1);
          });
          it('uses the buffer ranges to detect which variables were really changed', function() {
            expect(eventSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            expect(eventSpy.argsForCall[0][0].created).toBeUndefined();
            return expect(eventSpy.argsForCall[0][0].updated).toBeUndefined();
          });
          it('can no longer be found in the project variables', function() {
            expect(project.getVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
            return expect(project.getColorVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
          });
          return it('dispatches a did-update-variables event', function() {
            return expect(eventSpy).toHaveBeenCalled();
          });
        });
        return describe('when all the colors are removed', function() {
          var variablesTextRanges;
          variablesTextRanges = [][0];
          beforeEach(function() {
            runs(function() {
              variablesTextRanges = {};
              project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
                return variablesTextRanges[variable.name] = variable.range;
              });
              editor.setSelectedBufferRange([[0, 0], [Infinity, Infinity]]);
              editor.insertText('');
              return editor.getBuffer().emitter.emit('did-stop-changing');
            });
            return waitsFor(function() {
              return eventSpy.callCount > 0;
            });
          });
          it('removes every variable from the file', function() {
            expect(colorBuffer.scanBufferForVariables).toHaveBeenCalled();
            expect(project.getVariables().length).toEqual(0);
            expect(eventSpy.argsForCall[0][0].destroyed.length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            expect(eventSpy.argsForCall[0][0].created).toBeUndefined();
            return expect(eventSpy.argsForCall[0][0].updated).toBeUndefined();
          });
          it('can no longer be found in the project variables', function() {
            expect(project.getVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
            return expect(project.getColorVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
          });
          return it('dispatches a did-update-variables event', function() {
            return expect(eventSpy).toHaveBeenCalled();
          });
        });
      });
      describe('::setIgnoredNames', function() {
        describe('with an empty array', function() {
          beforeEach(function() {
            var spy;
            expect(project.getVariables().length).toEqual(12);
            spy = jasmine.createSpy('did-update-variables');
            project.onDidUpdateVariables(spy);
            project.setIgnoredNames([]);
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          return it('reloads the variables from the new paths', function() {
            return expect(project.getVariables().length).toEqual(32);
          });
        });
        return describe('with a more restrictive array', function() {
          beforeEach(function() {
            var spy;
            expect(project.getVariables().length).toEqual(12);
            spy = jasmine.createSpy('did-update-variables');
            project.onDidUpdateVariables(spy);
            project.setIgnoredNames(['vendor/*', '**/*.styl']);
            return waitsFor(function() {
              return project.getVariables().length < 12;
            });
          });
          return it('clears all the variables as there is no legible paths', function() {
            expect(project.getPaths().length).toEqual(0);
            return expect(project.getVariables().length).toEqual(0);
          });
        });
      });
      describe('when the project has multiple root directory', function() {
        beforeEach(function() {
          var fixturesPath;
          atom.config.set('pigments.sourceNames', ['**/*.sass', '**/*.styl']);
          fixturesPath = atom.project.getPaths()[0];
          atom.project.setPaths(["" + fixturesPath, "" + fixturesPath + "-with-recursion"]);
          project = new ColorProject({});
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('finds the variables from the two directories', function() {
          return expect(project.getVariables().length).toEqual(16);
        });
      });
      describe('when the project has VCS ignored files', function() {
        var projectPath;
        projectPath = [][0];
        beforeEach(function() {
          var dotGit, dotGitFixture, fixture;
          atom.config.set('pigments.sourceNames', ['*.sass']);
          fixture = path.join(__dirname, 'fixtures', 'project-with-gitignore');
          projectPath = temp.mkdirSync('pigments-project');
          dotGitFixture = path.join(fixture, 'git.git');
          dotGit = path.join(projectPath, '.git');
          fs.copySync(dotGitFixture, dotGit);
          fs.writeFileSync(path.join(projectPath, '.gitignore'), fs.readFileSync(path.join(fixture, 'git.gitignore')));
          fs.writeFileSync(path.join(projectPath, 'base.sass'), fs.readFileSync(path.join(fixture, 'base.sass')));
          fs.writeFileSync(path.join(projectPath, 'ignored.sass'), fs.readFileSync(path.join(fixture, 'ignored.sass')));
          fs.mkdirSync(path.join(projectPath, 'bower_components'));
          fs.writeFileSync(path.join(projectPath, 'bower_components', 'some-ignored-file.sass'), fs.readFileSync(path.join(fixture, 'bower_components', 'some-ignored-file.sass')));
          return atom.project.setPaths([projectPath]);
        });
        describe('when the ignoreVcsIgnoredPaths setting is enabled', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoreVcsIgnoredPaths', true);
            project = new ColorProject({});
            return waitsForPromise(function() {
              return project.initialize();
            });
          });
          it('finds the variables from the three files', function() {
            expect(project.getVariables().length).toEqual(3);
            return expect(project.getPaths().length).toEqual(1);
          });
          return describe('and then disabled', function() {
            beforeEach(function() {
              var spy;
              spy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(spy);
              atom.config.set('pigments.ignoreVcsIgnoredPaths', false);
              return waitsFor(function() {
                return spy.callCount > 0;
              });
            });
            it('reloads the paths', function() {
              return expect(project.getPaths().length).toEqual(3);
            });
            return it('reloads the variables', function() {
              return expect(project.getVariables().length).toEqual(7);
            });
          });
        });
        return describe('when the ignoreVcsIgnoredPaths setting is disabled', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoreVcsIgnoredPaths', false);
            project = new ColorProject({});
            return waitsForPromise(function() {
              return project.initialize();
            });
          });
          it('finds the variables from the three files', function() {
            expect(project.getVariables().length).toEqual(7);
            return expect(project.getPaths().length).toEqual(3);
          });
          return describe('and then enabled', function() {
            beforeEach(function() {
              var spy;
              spy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(spy);
              atom.config.set('pigments.ignoreVcsIgnoredPaths', true);
              return waitsFor(function() {
                return spy.callCount > 0;
              });
            });
            it('reloads the paths', function() {
              return expect(project.getPaths().length).toEqual(1);
            });
            return it('reloads the variables', function() {
              return expect(project.getVariables().length).toEqual(3);
            });
          });
        });
      });
      describe('when the sourceNames setting is changed', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          var originalPaths;
          originalPaths = project.getPaths();
          atom.config.set('pigments.sourceNames', []);
          return waitsFor(function() {
            return project.getPaths().join(',') !== originalPaths.join(',');
          });
        });
        it('updates the variables using the new pattern', function() {
          return expect(project.getVariables().length).toEqual(0);
        });
        return describe('so that new paths are found', function() {
          beforeEach(function() {
            var originalPaths;
            updateSpy = jasmine.createSpy('did-update-variables');
            originalPaths = project.getPaths();
            project.onDidUpdateVariables(updateSpy);
            atom.config.set('pigments.sourceNames', ['**/*.styl']);
            waitsFor(function() {
              return project.getPaths().join(',') !== originalPaths.join(',');
            });
            return waitsFor(function() {
              return updateSpy.callCount > 0;
            });
          });
          return it('loads the variables from these new paths', function() {
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
          });
        });
      });
      describe('when the ignoredNames setting is changed', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          var originalPaths;
          originalPaths = project.getPaths();
          atom.config.set('pigments.ignoredNames', ['**/*.styl']);
          return waitsFor(function() {
            return project.getPaths().join(',') !== originalPaths.join(',');
          });
        });
        it('updates the found using the new pattern', function() {
          return expect(project.getVariables().length).toEqual(0);
        });
        return describe('so that new paths are found', function() {
          beforeEach(function() {
            var originalPaths;
            updateSpy = jasmine.createSpy('did-update-variables');
            originalPaths = project.getPaths();
            project.onDidUpdateVariables(updateSpy);
            atom.config.set('pigments.ignoredNames', []);
            waitsFor(function() {
              return project.getPaths().join(',') !== originalPaths.join(',');
            });
            return waitsFor(function() {
              return updateSpy.callCount > 0;
            });
          });
          return it('loads the variables from these new paths', function() {
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
          });
        });
      });
      describe('when the extendedSearchNames setting is changed', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          return project.setSearchNames(['*.foo']);
        });
        it('updates the search names', function() {
          return expect(project.getSearchNames().length).toEqual(3);
        });
        return it('serializes the setting', function() {
          return expect(project.serialize().searchNames).toEqual(['*.foo']);
        });
      });
      describe('when the ignore global config settings are enabled', function() {
        describe('for the sourceNames field', function() {
          beforeEach(function() {
            project.sourceNames = ['*.foo'];
            return waitsForPromise(function() {
              return project.setIgnoreGlobalSourceNames(true);
            });
          });
          it('ignores the content of the global config', function() {
            return expect(project.getSourceNames()).toEqual(['.pigments', '*.foo']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalSourceNames).toBeTruthy();
          });
        });
        describe('for the ignoredNames field', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredNames', ['*.foo']);
            project.ignoredNames = ['*.bar'];
            return project.setIgnoreGlobalIgnoredNames(true);
          });
          it('ignores the content of the global config', function() {
            return expect(project.getIgnoredNames()).toEqual(['*.bar']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalIgnoredNames).toBeTruthy();
          });
        });
        describe('for the ignoredScopes field', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredScopes', ['\\.comment']);
            project.ignoredScopes = ['\\.source'];
            return project.setIgnoreGlobalIgnoredScopes(true);
          });
          it('ignores the content of the global config', function() {
            return expect(project.getIgnoredScopes()).toEqual(['\\.source']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalIgnoredScopes).toBeTruthy();
          });
        });
        return describe('for the searchNames field', function() {
          beforeEach(function() {
            atom.config.set('pigments.extendedSearchNames', ['*.css']);
            project.searchNames = ['*.foo'];
            return project.setIgnoreGlobalSearchNames(true);
          });
          it('ignores the content of the global config', function() {
            return expect(project.getSearchNames()).toEqual(['*.less', '*.foo']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalSearchNames).toBeTruthy();
          });
        });
      });
      describe('::loadThemesVariables', function() {
        beforeEach(function() {
          atom.packages.activatePackage('atom-light-ui');
          atom.packages.activatePackage('atom-light-syntax');
          atom.config.set('core.themes', ['atom-light-ui', 'atom-light-syntax']);
          waitsForPromise(function() {
            return atom.themes.activateThemes();
          });
          return waitsForPromise(function() {
            return atom.packages.activatePackage('pigments');
          });
        });
        afterEach(function() {
          atom.themes.deactivateThemes();
          return atom.themes.unwatchUserStylesheet();
        });
        return it('returns an array of 62 variables', function() {
          var themeVariables;
          themeVariables = project.loadThemesVariables();
          return expect(themeVariables.length).toEqual(62);
        });
      });
      return describe('when the includeThemes setting is enabled', function() {
        var spy, _ref2;
        _ref2 = [], paths = _ref2[0], spy = _ref2[1];
        beforeEach(function() {
          paths = project.getPaths();
          expect(project.getColorVariables().length).toEqual(10);
          atom.packages.activatePackage('atom-light-ui');
          atom.packages.activatePackage('atom-light-syntax');
          atom.packages.activatePackage('atom-dark-ui');
          atom.packages.activatePackage('atom-dark-syntax');
          atom.config.set('core.themes', ['atom-light-ui', 'atom-light-syntax']);
          waitsForPromise(function() {
            return atom.themes.activateThemes();
          });
          waitsForPromise(function() {
            return atom.packages.activatePackage('pigments');
          });
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            spy = jasmine.createSpy('did-change-active-themes');
            atom.themes.onDidChangeActiveThemes(spy);
            return project.setIncludeThemes(true);
          });
        });
        afterEach(function() {
          atom.themes.deactivateThemes();
          return atom.themes.unwatchUserStylesheet();
        });
        it('includes the variables set for ui and syntax themes in the palette', function() {
          return expect(project.getColorVariables().length).toEqual(72);
        });
        it('still includes the paths from the project', function() {
          var p, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            p = paths[_i];
            _results.push(expect(project.getPaths().indexOf(p)).not.toEqual(-1));
          }
          return _results;
        });
        it('serializes the setting with the project', function() {
          var serialized;
          serialized = project.serialize();
          return expect(serialized.includeThemes).toEqual(true);
        });
        describe('and then disabled', function() {
          beforeEach(function() {
            return project.setIncludeThemes(false);
          });
          it('removes all the paths to the themes stylesheets', function() {
            return expect(project.getColorVariables().length).toEqual(10);
          });
          return describe('when the core.themes setting is modified', function() {
            beforeEach(function() {
              spyOn(project, 'loadThemesVariables').andCallThrough();
              atom.config.set('core.themes', ['atom-dark-ui', 'atom-dark-syntax']);
              return waitsFor(function() {
                return spy.callCount > 0;
              });
            });
            return it('does not trigger a paths update', function() {
              return expect(project.loadThemesVariables).not.toHaveBeenCalled();
            });
          });
        });
        return describe('when the core.themes setting is modified', function() {
          beforeEach(function() {
            spyOn(project, 'loadThemesVariables').andCallThrough();
            atom.config.set('core.themes', ['atom-dark-ui', 'atom-dark-syntax']);
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          return it('triggers a paths update', function() {
            return expect(project.loadThemesVariables).toHaveBeenCalled();
          });
        });
      });
    });
    return describe('when restored', function() {
      var createProject;
      createProject = function(params) {
        var stateFixture;
        if (params == null) {
          params = {};
        }
        stateFixture = params.stateFixture;
        delete params.stateFixture;
        if (params.root == null) {
          params.root = rootPath;
        }
        if (params.timestamp == null) {
          params.timestamp = new Date().toJSON();
        }
        if (params.variableMarkers == null) {
          params.variableMarkers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
        if (params.colorMarkers == null) {
          params.colorMarkers = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        }
        if (params.version == null) {
          params.version = SERIALIZE_VERSION;
        }
        if (params.markersVersion == null) {
          params.markersVersion = SERIALIZE_MARKERS_VERSION;
        }
        return ColorProject.deserialize(jsonFixture(stateFixture, params));
      };
      describe('with a timestamp more recent than the files last modification date', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "empty-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('does not rescans the files', function() {
          return expect(project.getVariables().length).toEqual(1);
        });
      });
      describe('with a version different that the current one', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "empty-project.json",
            version: "0.0.0"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('drops the whole serialized state and rescans all the project', function() {
          return expect(project.getVariables().length).toEqual(12);
        });
      });
      describe('with a serialized path that no longer exist', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "rename-file-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        it('drops drops the non-existing and reload the paths', function() {
          return expect(project.getPaths()).toEqual(["" + rootPath + "/styles/buttons.styl", "" + rootPath + "/styles/variables.styl"]);
        });
        it('drops the variables from the removed paths', function() {
          return expect(project.getVariablesForPath("" + rootPath + "/styles/foo.styl").length).toEqual(0);
        });
        return it('loads the variables from the new file', function() {
          return expect(project.getVariablesForPath("" + rootPath + "/styles/variables.styl").length).toEqual(12);
        });
      });
      describe('with a sourceNames setting value different than when serialized', function() {
        beforeEach(function() {
          atom.config.set('pigments.sourceNames', []);
          project = createProject({
            stateFixture: "empty-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('drops the whole serialized state and rescans all the project', function() {
          return expect(project.getVariables().length).toEqual(0);
        });
      });
      describe('with a markers version different that the current one', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "empty-project.json",
            markersVersion: "0.0.0"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        it('keeps the project related data', function() {
          expect(project.ignoredNames).toEqual(['vendor/*']);
          return expect(project.getPaths()).toEqual(["" + rootPath + "/styles/buttons.styl", "" + rootPath + "/styles/variables.styl"]);
        });
        return it('drops the variables and buffers data', function() {
          return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
      });
      describe('with a timestamp older than the files last modification date', function() {
        beforeEach(function() {
          project = createProject({
            timestamp: new Date(0).toJSON(),
            stateFixture: "empty-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('scans again all the files that have a more recent modification date', function() {
          return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
      });
      describe('with some files not saved in the project state', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "partial-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('detects the new files and scans them', function() {
          return expect(project.getVariables().length).toEqual(12);
        });
      });
      describe('with an open editor and the corresponding buffer state', function() {
        var colorBuffer, editor, _ref2;
        _ref2 = [], editor = _ref2[0], colorBuffer = _ref2[1];
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('variables.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            project = createProject({
              stateFixture: "open-buffer-project.json",
              id: editor.id
            });
            return spyOn(ColorBuffer.prototype, 'variablesAvailable').andCallThrough();
          });
          return runs(function() {
            return colorBuffer = project.colorBuffersByEditorId[editor.id];
          });
        });
        it('restores the color buffer in its previous state', function() {
          expect(colorBuffer).toBeDefined();
          return expect(colorBuffer.getColorMarkers().length).toEqual(TOTAL_COLORS_VARIABLES_IN_PROJECT);
        });
        return it('does not wait for the project variables', function() {
          return expect(colorBuffer.variablesAvailable).not.toHaveBeenCalled();
        });
      });
      return describe('with an open editor, the corresponding buffer state and a old timestamp', function() {
        var colorBuffer, editor, _ref2;
        _ref2 = [], editor = _ref2[0], colorBuffer = _ref2[1];
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('variables.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            spyOn(ColorBuffer.prototype, 'updateVariableRanges').andCallThrough();
            return project = createProject({
              timestamp: new Date(0).toJSON(),
              stateFixture: "open-buffer-project.json",
              id: editor.id
            });
          });
          runs(function() {
            return colorBuffer = project.colorBuffersByEditorId[editor.id];
          });
          return waitsFor(function() {
            return colorBuffer.updateVariableRanges.callCount > 0;
          });
        });
        return it('invalidates the color buffer markers as soon as the dirty paths have been determined', function() {
          return expect(colorBuffer.updateVariableRanges).toHaveBeenCalled();
        });
      });
    });
  });

  describe('ColorProject', function() {
    var project, rootPath, _ref1;
    _ref1 = [], project = _ref1[0], rootPath = _ref1[1];
    return describe('when the project has a pigments defaults file', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        rootPath = "" + fixturesPath + "/project-with-defaults";
        atom.project.setPaths([rootPath]);
        project = new ColorProject({});
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      return it('loads the defaults file content', function() {
        return expect(project.getColorVariables().length).toEqual(6);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1wcm9qZWN0LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9MQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLE9BQWlELE9BQUEsQ0FBUSxpQkFBUixDQUFqRCxFQUFDLHlCQUFBLGlCQUFELEVBQW9CLGlDQUFBLHlCQUxwQixDQUFBOztBQUFBLEVBTUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQU5mLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBUGQsQ0FBQTs7QUFBQSxFQVFBLFdBQUEsR0FBYyxPQUFBLENBQVEsb0JBQVIsQ0FBNkIsQ0FBQyxXQUE5QixDQUEwQyxTQUExQyxFQUFxRCxVQUFyRCxDQVJkLENBQUE7O0FBQUEsRUFTQyxRQUFTLE9BQUEsQ0FBUSxrQkFBUixFQUFULEtBVEQsQ0FBQTs7QUFBQSxFQVdBLDBCQUFBLEdBQTZCLEVBWDdCLENBQUE7O0FBQUEsRUFZQSxpQ0FBQSxHQUFvQyxFQVpwQyxDQUFBOztBQUFBLEVBY0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsa0RBQUE7QUFBQSxJQUFBLFFBQWdELEVBQWhELEVBQUMsa0JBQUQsRUFBVSxrQkFBVixFQUFtQixtQkFBbkIsRUFBNkIsZ0JBQTdCLEVBQW9DLG1C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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-project-spec.coffee

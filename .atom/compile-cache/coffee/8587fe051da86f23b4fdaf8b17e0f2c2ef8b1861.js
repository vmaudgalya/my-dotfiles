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
      atom.config.set('pigments.extendedFiletypesForColorWords', ['*']);
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
        expect(project.getVariables().length).toEqual(5);
        return expect(project.getColorVariables().length).toEqual(5);
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
            return waitsForPromise(function() {
              return project.setIgnoredNames(['vendor/*', '**/*.styl']);
            });
          });
          return it('clears all the paths as there is no legible paths', function() {
            return expect(project.getPaths().length).toEqual(0);
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
          return expect(project.getVariables().length).toEqual(17);
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
              return expect(project.getVariables().length).toEqual(10);
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
            expect(project.getVariables().length).toEqual(10);
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
        return expect(project.getColorVariables().length).toEqual(12);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1wcm9qZWN0LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9MQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLE9BQWlELE9BQUEsQ0FBUSxpQkFBUixDQUFqRCxFQUFDLHlCQUFBLGlCQUFELEVBQW9CLGlDQUFBLHlCQUxwQixDQUFBOztBQUFBLEVBTUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQU5mLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBUGQsQ0FBQTs7QUFBQSxFQVFBLFdBQUEsR0FBYyxPQUFBLENBQVEsb0JBQVIsQ0FBNkIsQ0FBQyxXQUE5QixDQUEwQyxTQUExQyxFQUFxRCxVQUFyRCxDQVJkLENBQUE7O0FBQUEsRUFTQyxRQUFTLE9BQUEsQ0FBUSxrQkFBUixFQUFULEtBVEQsQ0FBQTs7QUFBQSxFQVdBLDBCQUFBLEdBQTZCLEVBWDdCLENBQUE7O0FBQUEsRUFZQSxpQ0FBQSxHQUFvQyxFQVpwQyxDQUFBOztBQUFBLEVBY0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsa0RBQUE7QUFBQSxJQUFBLFFBQWdELEVBQWhELEVBQUMsa0JBQUQsRUFBVSxrQkFBVixFQUFtQixtQkFBbkIsRUFBNkIsZ0JBQTdCLEVBQW9DLG1C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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-project-spec.coffee

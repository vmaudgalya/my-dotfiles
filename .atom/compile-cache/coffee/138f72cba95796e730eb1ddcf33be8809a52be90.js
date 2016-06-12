(function() {
  var ColorBuffer, jsonFixture, path, registry,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  ColorBuffer = require('../lib/color-buffer');

  registry = require('../lib/color-expressions');

  jsonFixture = require('./helpers/fixtures').jsonFixture(__dirname, 'fixtures');

  describe('ColorBuffer', function() {
    var colorBuffer, editBuffer, editor, pigments, project, sleep, _ref;
    _ref = [], editor = _ref[0], colorBuffer = _ref[1], pigments = _ref[2], project = _ref[3];
    sleep = function(ms) {
      var start;
      start = new Date;
      return function() {
        return new Date - start >= ms;
      };
    };
    editBuffer = function(text, options) {
      var range;
      if (options == null) {
        options = {};
      }
      if (options.start != null) {
        if (options.end != null) {
          range = [options.start, options.end];
        } else {
          range = [options.start, options.start];
        }
        editor.setSelectedBufferRange(range);
      }
      editor.insertText(text);
      if (!options.noEvent) {
        return advanceClock(500);
      }
    };
    beforeEach(function() {
      atom.config.set('pigments.delayBeforeScan', 0);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      atom.config.set('pigments.ignoredNames', ['project/vendor/**']);
      waitsForPromise(function() {
        return atom.workspace.open('four-variables.styl').then(function(o) {
          return editor = o;
        });
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
    });
    afterEach(function() {
      return colorBuffer != null ? colorBuffer.destroy() : void 0;
    });
    it('creates a color buffer for each editor in the workspace', function() {
      return expect(project.colorBuffersByEditorId[editor.id]).toBeDefined();
    });
    describe('when an editor without path is opened', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open().then(function(o) {
            editor = o;
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('does not fails when updating the colorBuffer', function() {
        return expect(function() {
          return colorBuffer.update();
        }).not.toThrow();
      });
      return describe('when the file is saved and aquires a path', function() {
        describe('that is legible', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('new-path.styl');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('adds the path to the project paths', function() {
            return expect(__indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeTruthy();
          });
        });
        describe('that is not legible', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('new-path.sass');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('does not add the path to the project paths', function() {
            return expect(__indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeFalsy();
          });
        });
        return describe('that is ignored', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('project/vendor/new-path.styl');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('does not add the path to the project paths', function() {
            return expect(__indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeFalsy();
          });
        });
      });
    });
    describe('with rapid changes that triggers a rescan', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        waitsFor(function() {
          return colorBuffer.initialized && colorBuffer.variableInitialized;
        });
        runs(function() {
          spyOn(colorBuffer, 'terminateRunningTask').andCallThrough();
          spyOn(colorBuffer, 'updateColorMarkers').andCallThrough();
          spyOn(colorBuffer, 'scanBufferForVariables').andCallThrough();
          editor.moveToBottom();
          editor.insertText('#fff\n');
          return editor.getBuffer().emitter.emit('did-stop-changing');
        });
        waitsFor(function() {
          return colorBuffer.scanBufferForVariables.callCount > 0;
        });
        return runs(function() {
          editor.insertText(' ');
          editor.emitter.emit('did-change');
          return editor.getBuffer().emitter.emit('did-stop-changing');
        });
      });
      return it('terminates the currently running task', function() {
        return expect(colorBuffer.terminateRunningTask).toHaveBeenCalled();
      });
    });
    describe('when created without a previous state', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        return waitsForPromise(function() {
          return colorBuffer.initialize();
        });
      });
      it('scans the buffer for colors without waiting for the project variables', function() {
        expect(colorBuffer.getColorMarkers().length).toEqual(4);
        return expect(colorBuffer.getValidColorMarkers().length).toEqual(3);
      });
      it('creates the corresponding markers in the text editor', function() {
        return expect(editor.findMarkers({
          type: 'pigments-color'
        }).length).toEqual(4);
      });
      it('knows that it is legible as a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      describe('when the editor is destroyed', function() {
        return it('destroys the color buffer at the same time', function() {
          editor.destroy();
          return expect(project.colorBuffersByEditorId[editor.id]).toBeUndefined();
        });
      });
      describe('::getColorMarkerAtBufferPosition', function() {
        describe('when the buffer position is contained in a marker range', function() {
          return it('returns the corresponding color marker', function() {
            var colorMarker;
            colorMarker = colorBuffer.getColorMarkerAtBufferPosition([2, 15]);
            return expect(colorMarker).toEqual(colorBuffer.colorMarkers[1]);
          });
        });
        return describe('when the buffer position is not contained in a marker range', function() {
          return it('returns undefined', function() {
            return expect(colorBuffer.getColorMarkerAtBufferPosition([1, 15])).toBeUndefined();
          });
        });
      });
      describe('when the project variables becomes available', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          updateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(updateSpy);
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('replaces the invalid markers that are now valid', function() {
          expect(colorBuffer.getValidColorMarkers().length).toEqual(4);
          expect(updateSpy.argsForCall[0][0].created.length).toEqual(1);
          return expect(updateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
        });
        it('destroys the text editor markers', function() {
          return expect(editor.findMarkers({
            type: 'pigments-color'
          }).length).toEqual(4);
        });
        describe('when a variable is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
            return editBuffer('#336699', {
              start: [0, 13],
              end: [0, 17]
            });
          });
          return it('updates the modified colors', function() {
            waitsFor(function() {
              return colorsUpdateSpy.callCount > 0;
            });
            return runs(function() {
              expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(2);
              return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(2);
            });
          });
        });
        describe('when a new variable is added', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              updateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(updateSpy);
              editor.moveToBottom();
              editBuffer('\nfoo = base-color');
              return waitsFor(function() {
                return updateSpy.callCount > 0;
              });
            });
          });
          return it('dispatches the new marker in a did-update-color-markers event', function() {
            expect(updateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(updateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        describe('when a variable is removed', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
            editBuffer('', {
              start: [0, 0],
              end: [0, 17]
            });
            return waitsFor(function() {
              return colorsUpdateSpy.callCount > 0;
            });
          });
          return it('invalidates colors that were relying on the deleted variables', function() {
            expect(colorBuffer.getColorMarkers().length).toEqual(3);
            return expect(colorBuffer.getValidColorMarkers().length).toEqual(2);
          });
        });
        return describe('::serialize', function() {
          beforeEach(function() {
            return waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
          });
          return it('returns the whole buffer data', function() {
            var expected;
            expected = jsonFixture("four-variables-buffer.json", {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: colorBuffer.getColorMarkers().map(function(m) {
                return m.marker.id;
              })
            });
            return expect(colorBuffer.serialize()).toEqual(expected);
          });
        });
      });
      describe('with a buffer with only colors', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('buttons.styl').then(function(o) {
              return editor = o;
            });
          });
          return runs(function() {
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        it('creates the color markers for the variables used in the buffer', function() {
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(0);
          });
        });
        it('creates the color markers for the variables used in the buffer', function() {
          waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(3);
          });
        });
        describe('when a color marker is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('#336699', {
                start: [1, 13],
                end: [1, 23]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('updates the modified color marker', function() {
            var marker, markers;
            markers = colorBuffer.getColorMarkers();
            marker = markers[markers.length - 1];
            return expect(marker.color).toBeColor('#336699');
          });
          it('updates only the affected marker', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
          return it('removes the previous editor markers', function() {
            return expect(editor.findMarkers({
              type: 'pigments-color'
            }).length).toEqual(3);
          });
        });
        describe('when new lines changes the markers range', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('#fff\n\n', {
                start: [0, 0],
                end: [0, 0]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          return it('does not destroys the previous markers', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        describe('when a new color is added', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editor.moveToBottom();
              editBuffer('\n#336699');
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('adds a marker for the new color', function() {
            var marker, markers;
            markers = colorBuffer.getColorMarkers();
            marker = markers[markers.length - 1];
            expect(markers.length).toEqual(4);
            expect(marker.color).toBeColor('#336699');
            return expect(editor.findMarkers({
              type: 'pigments-color'
            }).length).toEqual(4);
          });
          return it('dispatches the new marker in a did-update-color-markers event', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        return describe('when a color marker is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('', {
                start: [1, 2],
                end: [1, 23]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('updates the modified color marker', function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(2);
          });
          it('updates only the affected marker', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(0);
          });
          return it('removes the previous editor markers', function() {
            return expect(editor.findMarkers({
              type: 'pigments-color'
            }).length).toEqual(2);
          });
        });
      });
      return describe('with a buffer whose scope is not one of source files', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('project/lib/main.coffee').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            return colorBuffer = project.colorBufferForEditor(editor);
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        return it('does not renders colors from variables', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(4);
        });
      });
    });
    describe('with a buffer part of the global ignored files', function() {
      beforeEach(function() {
        project.setIgnoredNames([]);
        atom.config.set('pigments.ignoredNames', ['project/vendor/*']);
        waitsForPromise(function() {
          return atom.workspace.open('project/vendor/css/variables.less').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeTruthy();
      });
      it('knows that it is a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      return it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(20);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(20);
      });
    });
    describe('with a buffer part of the project ignored files', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('project/vendor/css/variables.less').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeTruthy();
      });
      it('knows that it is a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(20);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(20);
      });
      return describe('when the buffer is edited', function() {
        beforeEach(function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
          editor.moveToBottom();
          editBuffer('\n\n@new-color: @base0;\n');
          return waitsFor(function() {
            return colorsUpdateSpy.callCount > 0;
          });
        });
        return it('finds the newly added color', function() {
          var validMarkers;
          expect(colorBuffer.getColorMarkers().length).toEqual(21);
          validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
            return m.color.isValid();
          });
          return expect(validMarkers.length).toEqual(21);
        });
      });
    });
    describe('with a buffer not being a variable source', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('project/lib/main.coffee').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is not part of the source files', function() {
        return expect(colorBuffer.isVariablesSource()).toBeFalsy();
      });
      it('knows that it is not part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeFalsy();
      });
      it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(4);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(4);
      });
      return describe('when the buffer is edited', function() {
        beforeEach(function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
          spyOn(project, 'reloadVariablesForPath').andCallThrough();
          colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
          editor.moveToBottom();
          editBuffer('\n\n@new-color = red;\n');
          return waitsFor(function() {
            return colorsUpdateSpy.callCount > 0;
          });
        });
        it('finds the newly added color', function() {
          var validMarkers;
          expect(colorBuffer.getColorMarkers().length).toEqual(5);
          validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
            return m.color.isValid();
          });
          return expect(validMarkers.length).toEqual(5);
        });
        return it('does not ask the project to reload the variables', function() {
          return expect(project.reloadVariablesForPath.mostRecentCall.args[0]).not.toEqual(colorBuffer.editor.getPath());
        });
      });
    });
    return describe('when created with a previous state', function() {
      describe('with variables and colors', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            var state;
            project.colorBufferForEditor(editor).destroy();
            state = jsonFixture('four-variables-buffer.json', {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: [-1, -2, -3, -4]
            });
            state.editor = editor;
            state.project = project;
            return colorBuffer = new ColorBuffer(state);
          });
        });
        it('creates markers from the state object', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(4);
        });
        it('restores the markers properties', function() {
          var colorMarker;
          colorMarker = colorBuffer.getColorMarkers()[3];
          expect(colorMarker.color).toBeColor(255, 255, 255, 0.5);
          return expect(colorMarker.color.variables).toEqual(['base-color']);
        });
        it('restores the editor markers', function() {
          return expect(editor.findMarkers({
            type: 'pigments-color'
          }).length).toEqual(4);
        });
        return it('restores the ability to fetch markers', function() {
          var marker, _i, _len, _ref1, _results;
          expect(colorBuffer.findColorMarkers().length).toEqual(4);
          _ref1 = colorBuffer.findColorMarkers();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            marker = _ref1[_i];
            _results.push(expect(marker).toBeDefined());
          }
          return _results;
        });
      });
      return describe('with an invalid color', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('invalid-color.styl').then(function(o) {
              return editor = o;
            });
          });
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            var state;
            state = jsonFixture('invalid-color-buffer.json', {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: [-1]
            });
            state.editor = editor;
            state.project = project;
            return colorBuffer = new ColorBuffer(state);
          });
        });
        return it('creates markers from the state object', function() {
          expect(colorBuffer.getColorMarkers().length).toEqual(1);
          return expect(colorBuffer.getValidColorMarkers().length).toEqual(0);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1idWZmZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsMEJBQVIsQ0FGWCxDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixDQUFDLFdBQTlCLENBQTBDLFNBQTFDLEVBQXFELFVBQXJELENBSGQsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLCtEQUFBO0FBQUEsSUFBQSxPQUEyQyxFQUEzQyxFQUFDLGdCQUFELEVBQVMscUJBQVQsRUFBc0Isa0JBQXRCLEVBQWdDLGlCQUFoQyxDQUFBO0FBQUEsSUFFQSxLQUFBLEdBQVEsU0FBQyxFQUFELEdBQUE7QUFDTixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsSUFBUixDQUFBO2FBQ0EsU0FBQSxHQUFBO2VBQUcsR0FBQSxDQUFBLElBQUEsR0FBVyxLQUFYLElBQW9CLEdBQXZCO01BQUEsRUFGTTtJQUFBLENBRlIsQ0FBQTtBQUFBLElBTUEsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtBQUNYLFVBQUEsS0FBQTs7UUFEa0IsVUFBUTtPQUMxQjtBQUFBLE1BQUEsSUFBRyxxQkFBSDtBQUNFLFFBQUEsSUFBRyxtQkFBSDtBQUNFLFVBQUEsS0FBQSxHQUFRLENBQUMsT0FBTyxDQUFD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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-buffer-spec.coffee

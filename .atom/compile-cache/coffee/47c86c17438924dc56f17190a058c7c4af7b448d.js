(function() {
  var ColorBufferElement, ColorMarkerElement, path, sleep;

  path = require('path');

  require('./helpers/spec-helper');

  ColorBufferElement = require('../lib/color-buffer-element');

  ColorMarkerElement = require('../lib/color-marker-element');

  sleep = function(duration) {
    var t;
    t = new Date();
    return waitsFor(function() {
      return new Date() - t > duration;
    });
  };

  describe('ColorBufferElement', function() {
    var colorBuffer, colorBufferElement, editBuffer, editor, editorElement, isVisible, jasmineContent, jsonFixture, pigments, project, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], colorBuffer = _ref[2], pigments = _ref[3], project = _ref[4], colorBufferElement = _ref[5], jasmineContent = _ref[6];
    isVisible = function(node) {
      return !node.classList.contains('hidden');
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
    jsonFixture = function(fixture, data) {
      var json, jsonPath;
      jsonPath = path.resolve(__dirname, 'fixtures', fixture);
      json = fs.readFileSync(jsonPath).toString();
      json = json.replace(/#\{(\w+)\}/g, function(m, w) {
        return data[w];
      });
      return JSON.parse(json);
    };
    beforeEach(function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmineContent = document.body.querySelector('#jasmine-content');
      jasmineContent.appendChild(workspaceElement);
      atom.config.set('editor.softWrap', true);
      atom.config.set('editor.softWrapAtPreferredLineLength', true);
      atom.config.set('editor.preferredLineLength', 40);
      atom.config.set('pigments.delayBeforeScan', 0);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      waitsForPromise(function() {
        return atom.workspace.open('four-variables.styl').then(function(o) {
          editor = o;
          return editorElement = atom.views.getView(editor);
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
      if (colorBuffer != null) {
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      }
    });
    return describe('when an editor is opened', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        colorBufferElement = atom.views.getView(colorBuffer);
        return colorBufferElement.attach();
      });
      it('is associated to the ColorBuffer model', function() {
        expect(colorBufferElement).toBeDefined();
        return expect(colorBufferElement.getModel()).toBe(colorBuffer);
      });
      it('attaches itself in the target text editor element', function() {
        expect(colorBufferElement.parentNode).toExist();
        return expect(editorElement.shadowRoot.querySelector('.lines pigments-markers')).toExist();
      });
      describe('when the editor shadow dom setting is not enabled', function() {
        beforeEach(function() {
          editor.destroy();
          atom.config.set('editor.useShadowDOM', false);
          waitsForPromise(function() {
            return atom.workspace.open('four-variables.styl').then(function(o) {
              return editor = o;
            });
          });
          return runs(function() {
            editorElement = atom.views.getView(editor);
            colorBuffer = project.colorBufferForEditor(editor);
            colorBufferElement = atom.views.getView(colorBuffer);
            return colorBufferElement.attach();
          });
        });
        return it('attaches itself in the target text editor element', function() {
          expect(colorBufferElement.parentNode).toExist();
          return expect(editorElement.querySelector('.lines pigments-markers')).toExist();
        });
      });
      describe('when the color buffer is initialized', function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return colorBuffer.initialize();
          });
        });
        it('creates markers views for every visible buffer marker', function() {
          var marker, markersElements, _i, _len, _results;
          markersElements = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
          expect(markersElements.length).toEqual(3);
          _results = [];
          for (_i = 0, _len = markersElements.length; _i < _len; _i++) {
            marker = markersElements[_i];
            _results.push(expect(marker.getModel()).toBeDefined());
          }
          return _results;
        });
        describe('when the project variables are initialized', function() {
          return it('creates markers for the new valid colors', function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(4);
            });
          });
        });
        describe('when a selection intersects a marker range', function() {
          beforeEach(function() {
            return spyOn(colorBufferElement, 'updateSelections').andCallThrough();
          });
          describe('after the markers views was created', function() {
            beforeEach(function() {
              waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
              runs(function() {
                return editor.setSelectedBufferRange([[2, 12], [2, 14]]);
              });
              return waitsFor(function() {
                return colorBufferElement.updateSelections.callCount > 0;
              });
            });
            return it('hides the intersected marker', function() {
              var markers;
              markers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
              expect(isVisible(markers[0])).toBeTruthy();
              expect(isVisible(markers[1])).toBeTruthy();
              expect(isVisible(markers[2])).toBeTruthy();
              return expect(isVisible(markers[3])).toBeFalsy();
            });
          });
          return describe('before all the markers views was created', function() {
            beforeEach(function() {
              runs(function() {
                return editor.setSelectedBufferRange([[0, 0], [2, 14]]);
              });
              return waitsFor(function() {
                return colorBufferElement.updateSelections.callCount > 0;
              });
            });
            it('hides the existing markers', function() {
              var markers;
              markers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
              expect(isVisible(markers[0])).toBeFalsy();
              expect(isVisible(markers[1])).toBeTruthy();
              return expect(isVisible(markers[2])).toBeTruthy();
            });
            return describe('and the markers are updated', function() {
              beforeEach(function() {
                waitsForPromise(function() {
                  return colorBuffer.variablesAvailable();
                });
                return sleep(100);
              });
              return it('hides the created markers', function() {
                var markers;
                markers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
                expect(isVisible(markers[0])).toBeFalsy();
                expect(isVisible(markers[1])).toBeTruthy();
                expect(isVisible(markers[2])).toBeTruthy();
                return expect(isVisible(markers[3])).toBeFalsy();
              });
            });
          });
        });
        describe('when a line is edited and gets wrapped', function() {
          var marker;
          marker = null;
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            runs(function() {
              marker = colorBufferElement.usedMarkers[colorBufferElement.usedMarkers.length - 1];
              spyOn(marker, 'render').andCallThrough();
              return editBuffer(new Array(20).join("foo "), {
                start: [1, 0],
                end: [1, 0]
              });
            });
            return waitsFor(function() {
              return marker.render.callCount > 0;
            });
          });
          return it('updates the markers whose screen range have changed', function() {
            return expect(marker.render).toHaveBeenCalled();
          });
        });
        describe('when some markers are destroyed', function() {
          var spy;
          spy = [][0];
          beforeEach(function() {
            var el, _i, _len, _ref1;
            _ref1 = colorBufferElement.usedMarkers;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              el = _ref1[_i];
              spyOn(el, 'release').andCallThrough();
            }
            spy = jasmine.createSpy('did-update');
            colorBufferElement.onDidUpdate(spy);
            editBuffer('', {
              start: [4, 0],
              end: [8, 0]
            });
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          it('releases the unused markers', function() {
            var marker, _i, _len, _ref1, _results;
            expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
            expect(colorBufferElement.usedMarkers.length).toEqual(2);
            expect(colorBufferElement.unusedMarkers.length).toEqual(1);
            _ref1 = colorBufferElement.unusedMarkers;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              marker = _ref1[_i];
              _results.push(expect(marker.release).toHaveBeenCalled());
            }
            return _results;
          });
          return describe('and then a new marker is created', function() {
            beforeEach(function() {
              editor.moveToBottom();
              editBuffer('\nfoo = #123456\n');
              return waitsFor(function() {
                return colorBufferElement.unusedMarkers.length === 0;
              });
            });
            return it('reuses the previously released marker element', function() {
              expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
              expect(colorBufferElement.usedMarkers.length).toEqual(3);
              return expect(colorBufferElement.unusedMarkers.length).toEqual(0);
            });
          });
        });
        describe('when the current pane is splitted to the right', function() {
          beforeEach(function() {
            atom.commands.dispatch(editorElement, 'pane:split-right');
            editor = atom.workspace.getTextEditors()[1];
            colorBufferElement = atom.views.getView(project.colorBufferForEditor(editor));
            return waitsFor(function() {
              return colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length;
            });
          });
          return it('should keep all the buffer elements attached', function() {
            var editors;
            editors = atom.workspace.getTextEditors();
            return editors.forEach(function(editor) {
              editorElement = atom.views.getView(editor);
              colorBufferElement = editorElement.shadowRoot.querySelector('pigments-markers');
              expect(colorBufferElement).toExist();
              expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:empty').length).toEqual(0);
            });
          });
        });
        return describe('when the marker type is set to gutter', function() {
          var gutter;
          gutter = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.initialize();
            });
            return runs(function() {
              atom.config.set('pigments.markerType', 'gutter');
              return gutter = editorElement.shadowRoot.querySelector('[gutter-name="pigments"]');
            });
          });
          it('removes the markers', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(0);
          });
          it('adds a custom gutter to the text editor', function() {
            return expect(gutter).toExist();
          });
          it('sets the size of the gutter based on the number of markers in the same row', function() {
            return expect(gutter.style.minWidth).toEqual('14px');
          });
          it('adds a gutter decoration for each color marker', function() {
            var decorations;
            decorations = editor.getDecorations().filter(function(d) {
              return d.properties.type === 'gutter';
            });
            return expect(decorations.length).toEqual(3);
          });
          describe('when the variables become available', function() {
            beforeEach(function() {
              return waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
            });
            it('creates decorations for the new valid colors', function() {
              var decorations;
              decorations = editor.getDecorations().filter(function(d) {
                return d.properties.type === 'gutter';
              });
              return expect(decorations.length).toEqual(4);
            });
            return describe('when many markers are added on the same line', function() {
              beforeEach(function() {
                var updateSpy;
                updateSpy = jasmine.createSpy('did-update');
                colorBufferElement.onDidUpdate(updateSpy);
                editor.moveToBottom();
                editBuffer('\nlist = #123456, #987654, #abcdef\n');
                return waitsFor(function() {
                  return updateSpy.callCount > 0;
                });
              });
              it('adds the new decorations to the gutter', function() {
                var decorations;
                decorations = editor.getDecorations().filter(function(d) {
                  return d.properties.type === 'gutter';
                });
                return expect(decorations.length).toEqual(7);
              });
              return it('sets the size of the gutter based on the number of markers in the same row', function() {
                return expect(gutter.style.minWidth).toEqual('42px');
              });
            });
          });
          describe('when the marker is changed again', function() {
            beforeEach(function() {
              return atom.config.set('pigments.markerType', 'background');
            });
            it('removes the gutter', function() {
              return expect(editorElement.shadowRoot.querySelector('[gutter-name="pigments"]')).not.toExist();
            });
            return it('recreates the markers', function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
            });
          });
          return describe('when a new buffer is opened', function() {
            beforeEach(function() {
              waitsForPromise(function() {
                return atom.workspace.open('project/styles/variables.styl').then(function(e) {
                  editor = e;
                  editorElement = atom.views.getView(editor);
                  colorBuffer = project.colorBufferForEditor(editor);
                  return colorBufferElement = atom.views.getView(colorBuffer);
                });
              });
              waitsForPromise(function() {
                return colorBuffer.initialize();
              });
              waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
              return runs(function() {
                return gutter = editorElement.shadowRoot.querySelector('[gutter-name="pigments"]');
              });
            });
            return it('creates the decorations in the new buffer gutter', function() {
              var decorations;
              decorations = editor.getDecorations().filter(function(d) {
                return d.properties.type === 'gutter';
              });
              return expect(decorations.length).toEqual(10);
            });
          });
        });
      });
      describe('when the editor is moved to another pane', function() {
        var newPane, pane, _ref1;
        _ref1 = [], pane = _ref1[0], newPane = _ref1[1];
        beforeEach(function() {
          pane = atom.workspace.getActivePane();
          newPane = pane.splitDown({
            copyActiveItem: false
          });
          colorBuffer = project.colorBufferForEditor(editor);
          colorBufferElement = atom.views.getView(colorBuffer);
          expect(atom.workspace.getPanes().length).toEqual(2);
          pane.moveItemToPane(editor, newPane, 0);
          return waitsFor(function() {
            return colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length;
          });
        });
        return it('moves the editor with the buffer to the new pane', function() {
          expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
          return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:empty').length).toEqual(0);
        });
      });
      describe('when pigments.supportedFiletypes settings is defined', function() {
        var loadBuffer;
        loadBuffer = function(filePath) {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function(o) {
              editor = o;
              editorElement = atom.views.getView(editor);
              colorBuffer = project.colorBufferForEditor(editor);
              colorBufferElement = atom.views.getView(colorBuffer);
              return colorBufferElement.attach();
            });
          });
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        };
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-coffee-script');
          });
          return waitsForPromise(function() {
            return atom.packages.activatePackage('language-less');
          });
        });
        describe('with the default wildcard', function() {
          beforeEach(function() {
            return atom.config.set('pigments.supportedFiletypes', ['*']);
          });
          return it('supports every filetype', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
            });
          });
        });
        describe('with a filetype', function() {
          beforeEach(function() {
            return atom.config.set('pigments.supportedFiletypes', ['coffee']);
          });
          return it('supports the specified file type', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
            });
          });
        });
        return describe('with many filetypes', function() {
          beforeEach(function() {
            atom.config.set('pigments.supportedFiletypes', ['coffee']);
            return project.setSupportedFiletypes(['less']);
          });
          it('supports the specified file types', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
            });
            loadBuffer('four-variables.styl');
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
            });
          });
          return describe('with global file types ignored', function() {
            beforeEach(function() {
              atom.config.set('pigments.supportedFiletypes', ['coffee']);
              project.setIgnoreGlobalSupportedFiletypes(true);
              return project.setSupportedFiletypes(['less']);
            });
            return it('supports the specified file types', function() {
              loadBuffer('scope-filter.coffee');
              runs(function() {
                return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
              });
              loadBuffer('project/vendor/css/variables.less');
              runs(function() {
                return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
              });
              loadBuffer('four-variables.styl');
              return runs(function() {
                return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
              });
            });
          });
        });
      });
      describe('when pigments.ignoredScopes settings is defined', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-coffee-script');
          });
          waitsForPromise(function() {
            return atom.workspace.open('scope-filter.coffee').then(function(o) {
              editor = o;
              editorElement = atom.views.getView(editor);
              colorBuffer = project.colorBufferForEditor(editor);
              colorBufferElement = atom.views.getView(colorBuffer);
              return colorBufferElement.attach();
            });
          });
          return waitsForPromise(function() {
            return colorBuffer.initialize();
          });
        });
        describe('with one filter', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(1);
          });
        });
        describe('with two filters', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\.string', '\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
          });
        });
        describe('with an invalid filter', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\']);
          });
          return it('ignores the filter', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
          });
        });
        return describe('when the project ignoredScopes is defined', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredScopes', ['\\.string']);
            return project.setIgnoredScopes(['\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
          });
        });
      });
      return describe('when a text editor settings is modified', function() {
        var originalMarkers;
        originalMarkers = [][0];
        beforeEach(function() {
          waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
          return runs(function() {
            originalMarkers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)');
            spyOn(colorBufferElement, 'updateMarkers').andCallThrough();
            return spyOn(ColorMarkerElement.prototype, 'render').andCallThrough();
          });
        });
        describe('editor.fontSize', function() {
          beforeEach(function() {
            return atom.config.set('editor.fontSize', 20);
          });
          return it('forces an update and a re-render of existing markers', function() {
            var marker, _i, _len, _results;
            expect(colorBufferElement.updateMarkers).toHaveBeenCalled();
            _results = [];
            for (_i = 0, _len = originalMarkers.length; _i < _len; _i++) {
              marker = originalMarkers[_i];
              _results.push(expect(marker.render).toHaveBeenCalled());
            }
            return _results;
          });
        });
        return describe('editor.lineHeight', function() {
          beforeEach(function() {
            return atom.config.set('editor.lineHeight', 20);
          });
          return it('forces an update and a re-render of existing markers', function() {
            var marker, _i, _len, _results;
            expect(colorBufferElement.updateMarkers).toHaveBeenCalled();
            _results = [];
            for (_i = 0, _len = originalMarkers.length; _i < _len; _i++) {
              marker = originalMarkers[_i];
              _results.push(expect(marker.render).toHaveBeenCalled());
            }
            return _results;
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1idWZmZXItZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxPQUFBLENBQVEsdUJBQVIsQ0FEQSxDQUFBOztBQUFBLEVBR0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDZCQUFSLENBSHJCLENBQUE7O0FBQUEsRUFJQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsNkJBQVIsQ0FKckIsQ0FBQTs7QUFBQSxFQU1BLEtBQUEsR0FBUSxTQUFDLFFBQUQsR0FBQTtBQUNOLFFBQUEsQ0FBQTtBQUFBLElBQUEsQ0FBQSxHQUFRLElBQUEsSUFBQSxDQUFBLENBQVIsQ0FBQTtXQUNBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7YUFBTyxJQUFBLElBQUEsQ0FBQSxDQUFKLEdBQWEsQ0FBYixHQUFpQixTQUFwQjtJQUFBLENBQVQsRUFGTTtFQUFBLENBTlIsQ0FBQTs7QUFBQSxFQVVBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7QUFDN0IsUUFBQSxtSUFBQTtBQUFBLElBQUEsT0FBOEYsRUFBOUYsRUFBQyxnQkFBRCxFQUFTLHVCQUFULEVBQXdCLHFCQUF4QixFQUFxQyxrQkFBckMsRUFBK0MsaUJBQS9DLEVBQXdELDRCQUF4RCxFQUE0RSx3QkFBNUUsQ0FBQTtBQUFBLElBRUEsU0FBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO2FBQVUsQ0FBQSxJQUFRLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBd0IsUUFBeEIsRUFBZDtJQUFBLENBRlosQ0FBQTtBQUFBLElBSUEsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFP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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-buffer-element-spec.coffee

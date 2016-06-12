(function() {
  var Disposable, Pigments, PigmentsAPI, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, registry, _ref;

  Disposable = require('atom').Disposable;

  Pigments = require('../lib/pigments');

  PigmentsAPI = require('../lib/pigments-api');

  registry = require('../lib/variable-expressions');

  _ref = require('../lib/versions'), SERIALIZE_VERSION = _ref.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = _ref.SERIALIZE_MARKERS_VERSION;

  describe("Pigments", function() {
    var pigments, project, workspaceElement, _ref1;
    _ref1 = [], workspaceElement = _ref1[0], pigments = _ref1[1], project = _ref1[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      atom.config.set('pigments.sourceNames', ['**/*.sass', '**/*.styl']);
      atom.config.set('pigments.ignoredNames', []);
      atom.config.set('pigments.ignoredScopes', []);
      atom.config.set('pigments.autocompleteScopes', []);
      registry.createExpression('pigments:txt_vars', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=(?!=)\\s*([^\\n\\r;]*);?$', ['txt']);
      return waitsForPromise({
        label: 'pigments activation'
      }, function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
    });
    afterEach(function() {
      registry.removeExpression('pigments:txt_vars');
      return project != null ? project.destroy() : void 0;
    });
    it('instanciates a ColorProject instance', function() {
      return expect(pigments.getProject()).toBeDefined();
    });
    it('serializes the project', function() {
      var date;
      date = new Date;
      spyOn(pigments.getProject(), 'getTimestamp').andCallFake(function() {
        return date;
      });
      return expect(pigments.serialize()).toEqual({
        project: {
          deserializer: 'ColorProject',
          timestamp: date,
          version: SERIALIZE_VERSION,
          markersVersion: SERIALIZE_MARKERS_VERSION,
          globalSourceNames: ['**/*.sass', '**/*.styl'],
          globalIgnoredNames: [],
          buffers: {}
        }
      });
    });
    describe('when deactivated', function() {
      var colorBuffer, editor, editorElement, _ref2;
      _ref2 = [], editor = _ref2[0], editorElement = _ref2[1], colorBuffer = _ref2[2];
      beforeEach(function() {
        waitsForPromise({
          label: 'text-editor opened'
        }, function() {
          return atom.workspace.open('four-variables.styl').then(function(e) {
            editor = e;
            editorElement = atom.views.getView(e);
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        waitsFor('pigments markers appended to the DOM', function() {
          return editorElement.shadowRoot.querySelector('pigments-markers');
        });
        return runs(function() {
          spyOn(project, 'destroy').andCallThrough();
          spyOn(colorBuffer, 'destroy').andCallThrough();
          return pigments.deactivate();
        });
      });
      it('destroys the pigments project', function() {
        return expect(project.destroy).toHaveBeenCalled();
      });
      it('destroys all the color buffers that were created', function() {
        expect(project.colorBufferForEditor(editor)).toBeUndefined();
        expect(project.colorBuffersByEditorId).toBeNull();
        return expect(colorBuffer.destroy).toHaveBeenCalled();
      });
      return it('destroys the color buffer element that were added to the DOM', function() {
        return expect(editorElement.shadowRoot.querySelector('pigments-markers')).not.toExist();
      });
    });
    describe('pigments:project-settings', function() {
      var item;
      item = null;
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'pigments:project-settings');
        return waitsFor('active pane item', function() {
          item = atom.workspace.getActivePaneItem();
          return item != null;
        });
      });
      return it('opens a settings view in the active pane', function() {
        return item.matches('pigments-color-project');
      });
    });
    describe('API provider', function() {
      var buffer, editor, editorElement, service, _ref2;
      _ref2 = [], service = _ref2[0], editor = _ref2[1], editorElement = _ref2[2], buffer = _ref2[3];
      beforeEach(function() {
        waitsForPromise({
          label: 'text-editor opened'
        }, function() {
          return atom.workspace.open('four-variables.styl').then(function(e) {
            editor = e;
            editorElement = atom.views.getView(e);
            return buffer = project.colorBufferForEditor(editor);
          });
        });
        runs(function() {
          return service = pigments.provideAPI();
        });
        return waitsForPromise({
          label: 'project initialized'
        }, function() {
          return project.initialize();
        });
      });
      it('returns an object conforming to the API', function() {
        expect(service instanceof PigmentsAPI).toBeTruthy();
        expect(service.getProject()).toBe(project);
        expect(service.getPalette()).toEqual(project.getPalette());
        expect(service.getPalette()).not.toBe(project.getPalette());
        expect(service.getVariables()).toEqual(project.getVariables());
        return expect(service.getColorVariables()).toEqual(project.getColorVariables());
      });
      return describe('::observeColorBuffers', function() {
        var spy;
        spy = [][0];
        beforeEach(function() {
          spy = jasmine.createSpy('did-create-color-buffer');
          return service.observeColorBuffers(spy);
        });
        it('calls the callback for every existing color buffer', function() {
          expect(spy).toHaveBeenCalled();
          return expect(spy.calls.length).toEqual(1);
        });
        return it('calls the callback on every new buffer creation', function() {
          waitsForPromise({
            label: 'text-editor opened'
          }, function() {
            return atom.workspace.open('buttons.styl');
          });
          return runs(function() {
            return expect(spy.calls.length).toEqual(2);
          });
        });
      });
    });
    describe('color expression consumer', function() {
      var colorBuffer, colorBufferElement, colorProvider, consumerDisposable, editor, editorElement, otherConsumerDisposable, _ref2;
      _ref2 = [], colorProvider = _ref2[0], consumerDisposable = _ref2[1], editor = _ref2[2], editorElement = _ref2[3], colorBuffer = _ref2[4], colorBufferElement = _ref2[5], otherConsumerDisposable = _ref2[6];
      beforeEach(function() {
        return colorProvider = {
          name: 'todo',
          regexpString: 'TODO',
          scopes: ['*'],
          priority: 0,
          handle: function(match, expression, context) {
            return this.red = 255;
          }
        };
      });
      afterEach(function() {
        if (consumerDisposable != null) {
          consumerDisposable.dispose();
        }
        return otherConsumerDisposable != null ? otherConsumerDisposable.dispose() : void 0;
      });
      describe('when consumed before opening a text editor', function() {
        beforeEach(function() {
          consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          waitsForPromise({
            label: 'text-editor opened'
          }, function() {
            return atom.workspace.open('color-consumer-sample.txt').then(function(e) {
              editor = e;
              editorElement = atom.views.getView(e);
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          waitsForPromise({
            label: 'color buffer initialized'
          }, function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise({
            label: 'color buffer variables available'
          }, function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('parses the new expression and renders a color', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(1);
        });
        it('returns a Disposable instance', function() {
          return expect(consumerDisposable instanceof Disposable).toBeTruthy();
        });
        return describe('the returned disposable', function() {
          it('removes the provided expression from the registry', function() {
            consumerDisposable.dispose();
            return expect(project.getColorExpressionsRegistry().getExpression('todo')).toBeUndefined();
          });
          return it('triggers an update in the opened editors', function() {
            var updateSpy;
            updateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(updateSpy);
            consumerDisposable.dispose();
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 0;
            });
            return runs(function() {
              return expect(colorBuffer.getColorMarkers().length).toEqual(0);
            });
          });
        });
      });
      describe('when consumed after opening a text editor', function() {
        beforeEach(function() {
          waitsForPromise({
            label: 'text-editor opened'
          }, function() {
            return atom.workspace.open('color-consumer-sample.txt').then(function(e) {
              editor = e;
              editorElement = atom.views.getView(e);
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          waitsForPromise({
            label: 'color buffer initialized'
          }, function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise({
            label: 'color buffer variables available'
          }, function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('triggers an update in the opened editors', function() {
          var updateSpy;
          updateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(updateSpy);
          consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          waitsFor('did-update-color-markers event dispatched', function() {
            return updateSpy.callCount > 0;
          });
          runs(function() {
            expect(colorBuffer.getColorMarkers().length).toEqual(1);
            return consumerDisposable.dispose();
          });
          waitsFor('did-update-color-markers event dispatched', function() {
            return updateSpy.callCount > 1;
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(0);
          });
        });
        return describe('when an array of expressions is passed', function() {
          return it('triggers an update in the opened editors', function() {
            var updateSpy;
            updateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(updateSpy);
            consumerDisposable = pigments.consumeColorExpressions({
              expressions: [colorProvider]
            });
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 0;
            });
            runs(function() {
              expect(colorBuffer.getColorMarkers().length).toEqual(1);
              return consumerDisposable.dispose();
            });
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 1;
            });
            return runs(function() {
              return expect(colorBuffer.getColorMarkers().length).toEqual(0);
            });
          });
        });
      });
      return describe('when the expression matches a variable value', function() {
        beforeEach(function() {
          return waitsForPromise({
            label: 'project initialized'
          }, function() {
            return project.initialize();
          });
        });
        it('detects the new variable as a color variable', function() {
          var variableSpy;
          variableSpy = jasmine.createSpy('did-update-variables');
          project.onDidUpdateVariables(variableSpy);
          atom.config.set('pigments.sourceNames', ['**/*.txt']);
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 1;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(6);
            expect(project.getColorVariables().length).toEqual(4);
            return consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          });
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 2;
          });
          return runs(function() {
            expect(project.getVariables().length).toEqual(6);
            return expect(project.getColorVariables().length).toEqual(5);
          });
        });
        return describe('and there was an expression that could not be resolved before', function() {
          return it('updates the invalid color as a now valid color', function() {
            var variableSpy;
            variableSpy = jasmine.createSpy('did-update-variables');
            project.onDidUpdateVariables(variableSpy);
            atom.config.set('pigments.sourceNames', ['**/*.txt']);
            waitsFor('variables updated', function() {
              return variableSpy.callCount > 1;
            });
            return runs(function() {
              otherConsumerDisposable = pigments.consumeColorExpressions({
                name: 'bar',
                regexpString: 'baz\\s+(\\w+)',
                handle: function(match, expression, context) {
                  var color, expr, _;
                  _ = match[0], expr = match[1];
                  color = context.readColor(expr);
                  if (context.isInvalid(color)) {
                    return this.invalid = true;
                  }
                  return this.rgba = color.rgba;
                }
              });
              consumerDisposable = pigments.consumeColorExpressions(colorProvider);
              waitsFor('variables updated', function() {
                return variableSpy.callCount > 2;
              });
              runs(function() {
                expect(project.getVariables().length).toEqual(6);
                expect(project.getColorVariables().length).toEqual(6);
                expect(project.getVariableByName('bar').color.invalid).toBeFalsy();
                return consumerDisposable.dispose();
              });
              waitsFor('variables updated', function() {
                return variableSpy.callCount > 3;
              });
              return runs(function() {
                expect(project.getVariables().length).toEqual(6);
                expect(project.getColorVariables().length).toEqual(5);
                return expect(project.getVariableByName('bar').color.invalid).toBeTruthy();
              });
            });
          });
        });
      });
    });
    return describe('variable expression consumer', function() {
      var colorBuffer, colorBufferElement, consumerDisposable, editor, editorElement, variableProvider, _ref2;
      _ref2 = [], variableProvider = _ref2[0], consumerDisposable = _ref2[1], editor = _ref2[2], editorElement = _ref2[3], colorBuffer = _ref2[4], colorBufferElement = _ref2[5];
      beforeEach(function() {
        variableProvider = {
          name: 'todo',
          regexpString: '(TODO):\\s*([^;\\n]+)'
        };
        return waitsForPromise({
          label: 'project initialized'
        }, function() {
          return project.initialize();
        });
      });
      afterEach(function() {
        return consumerDisposable != null ? consumerDisposable.dispose() : void 0;
      });
      it('updates the project variables when consumed', function() {
        var variableSpy;
        variableSpy = jasmine.createSpy('did-update-variables');
        project.onDidUpdateVariables(variableSpy);
        atom.config.set('pigments.sourceNames', ['**/*.txt']);
        waitsFor('variables updated', function() {
          return variableSpy.callCount > 1;
        });
        runs(function() {
          expect(project.getVariables().length).toEqual(6);
          expect(project.getColorVariables().length).toEqual(4);
          return consumerDisposable = pigments.consumeVariableExpressions(variableProvider);
        });
        waitsFor('variables updated after service consumed', function() {
          return variableSpy.callCount > 2;
        });
        runs(function() {
          expect(project.getVariables().length).toEqual(7);
          expect(project.getColorVariables().length).toEqual(4);
          return consumerDisposable.dispose();
        });
        waitsFor('variables updated after service disposed', function() {
          return variableSpy.callCount > 3;
        });
        return runs(function() {
          expect(project.getVariables().length).toEqual(6);
          return expect(project.getColorVariables().length).toEqual(4);
        });
      });
      return describe('when an array of expressions is passed', function() {
        return it('updates the project variables when consumed', function() {
          var previousVariablesCount;
          previousVariablesCount = null;
          atom.config.set('pigments.sourceNames', ['**/*.txt']);
          waitsFor('variables initialized', function() {
            return project.getVariables().length === 45;
          });
          runs(function() {
            return previousVariablesCount = project.getVariables().length;
          });
          waitsFor('variables updated', function() {
            return project.getVariables().length === 6;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(6);
            expect(project.getColorVariables().length).toEqual(4);
            previousVariablesCount = project.getVariables().length;
            return consumerDisposable = pigments.consumeVariableExpressions({
              expressions: [variableProvider]
            });
          });
          waitsFor('variables updated after service consumed', function() {
            return project.getVariables().length !== previousVariablesCount;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(7);
            expect(project.getColorVariables().length).toEqual(4);
            previousVariablesCount = project.getVariables().length;
            return consumerDisposable.dispose();
          });
          waitsFor('variables updated after service disposed', function() {
            return project.getVariables().length !== previousVariablesCount;
          });
          return runs(function() {
            expect(project.getVariables().length).toEqual(6);
            return expect(project.getColorVariables().length).toEqual(4);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9hY3RpdmF0aW9uLWFuZC1hcGktc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0ZBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsNkJBQVIsQ0FIWCxDQUFBOztBQUFBLEVBS0EsT0FBaUQsT0FBQSxDQUFRLGlCQUFSLENBQWpELEVBQUMseUJBQUEsaUJBQUQsRUFBb0IsaUNBQUEseUJBTHBCLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsUUFBQSwwQ0FBQTtBQUFBLElBQUEsUUFBd0MsRUFBeEMsRUFBQywyQkFBRCxFQUFtQixtQkFBbkIsRUFBNkIsa0JBQTdCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxDQUFDLFdBQUQsRUFBYyxXQUFkLENBQXhDLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxF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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/activation-and-api-spec.coffee

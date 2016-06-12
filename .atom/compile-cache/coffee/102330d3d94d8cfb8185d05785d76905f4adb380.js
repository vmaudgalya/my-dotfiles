(function() {
  var Disposable, Pigments, PigmentsAPI, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, _ref;

  Disposable = require('atom').Disposable;

  Pigments = require('../lib/pigments');

  PigmentsAPI = require('../lib/pigments-api');

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
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
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
        waitsForPromise(function() {
          return atom.workspace.open('four-variables.styl').then(function(e) {
            editor = e;
            editorElement = atom.views.getView(e);
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        waitsFor(function() {
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
        return waitsFor(function() {
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
        waitsForPromise(function() {
          return atom.workspace.open('four-variables.styl').then(function(e) {
            editor = e;
            editorElement = atom.views.getView(e);
            return buffer = project.colorBufferForEditor(editor);
          });
        });
        runs(function() {
          return service = pigments.provideAPI();
        });
        return waitsForPromise(function() {
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
          waitsForPromise(function() {
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
          waitsForPromise(function() {
            return atom.workspace.open('color-consumer-sample.txt').then(function(e) {
              editor = e;
              editorElement = atom.views.getView(e);
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise(function() {
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
          waitsForPromise(function() {
            return atom.workspace.open('color-consumer-sample.txt').then(function(e) {
              editor = e;
              editorElement = atom.views.getView(e);
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise(function() {
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
          return waitsForPromise(function() {
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
            expect(project.getVariables().length).toEqual(4);
            expect(project.getColorVariables().length).toEqual(2);
            return consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          });
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 2;
          });
          return runs(function() {
            expect(project.getVariables().length).toEqual(4);
            return expect(project.getColorVariables().length).toEqual(3);
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
                expect(project.getVariables().length).toEqual(4);
                expect(project.getColorVariables().length).toEqual(4);
                expect(project.getVariableByName('bar').color.invalid).toBeFalsy();
                return consumerDisposable.dispose();
              });
              waitsFor('variables updated', function() {
                return variableSpy.callCount > 3;
              });
              return runs(function() {
                expect(project.getVariables().length).toEqual(4);
                expect(project.getColorVariables().length).toEqual(3);
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
        return waitsForPromise(function() {
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
          expect(project.getVariables().length).toEqual(4);
          expect(project.getColorVariables().length).toEqual(2);
          return consumerDisposable = pigments.consumeVariableExpressions(variableProvider);
        });
        waitsFor('variables updated after service consumed', function() {
          return variableSpy.callCount > 2;
        });
        runs(function() {
          expect(project.getVariables().length).toEqual(5);
          expect(project.getColorVariables().length).toEqual(2);
          return consumerDisposable.dispose();
        });
        waitsFor('variables updated after service disposed', function() {
          return variableSpy.callCount > 3;
        });
        return runs(function() {
          expect(project.getVariables().length).toEqual(4);
          return expect(project.getColorVariables().length).toEqual(2);
        });
      });
      return describe('when an array of expressions is passed', function() {
        return it('updates the project variables when consumed', function() {
          var variableSpy;
          variableSpy = jasmine.createSpy('did-update-variables');
          project.onDidUpdateVariables(variableSpy);
          atom.config.set('pigments.sourceNames', ['**/*.txt']);
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 1;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(4);
            expect(project.getColorVariables().length).toEqual(2);
            return consumerDisposable = pigments.consumeVariableExpressions({
              expressions: [variableProvider]
            });
          });
          waitsFor('variables updated after service consumed', function() {
            return variableSpy.callCount > 2;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(5);
            expect(project.getColorVariables().length).toEqual(2);
            return consumerDisposable.dispose();
          });
          waitsFor('variables updated after service disposed', function() {
            return variableSpy.callCount > 3;
          });
          return runs(function() {
            expect(project.getVariables().length).toEqual(4);
            return expect(project.getColorVariables().length).toEqual(2);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9waWdtZW50cy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxRkFBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVIsQ0FGZCxDQUFBOztBQUFBLEVBSUEsT0FBaUQsT0FBQSxDQUFRLGlCQUFSLENBQWpELEVBQUMseUJBQUEsaUJBQUQsRUFBb0IsaUNBQUEseUJBSnBCLENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsUUFBQSwwQ0FBQTtBQUFBLElBQUEsUUFBd0MsRUFBeEMsRUFBQywyQkFBRCxFQUFtQixtQkFBbkIsRUFBNkIsa0JBQTdCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxDQUFDLFdBQUQsRUFBYyxXQUFkLENBQXhDLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxFQUF6QyxDQUpBLENBQUE7QUFBQSxNQUtBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/pigments-spec.coffee

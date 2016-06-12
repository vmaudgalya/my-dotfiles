function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./helpers/workspace');

var _libMinimap = require('../lib/minimap');

var _libMinimap2 = _interopRequireDefault(_libMinimap);

var _libMinimapElement = require('../lib/minimap-element');

var _libMinimapElement2 = _interopRequireDefault(_libMinimapElement);

'use babel';

describe('Minimap package', function () {
  var _ref = [];
  var editor = _ref[0];
  var minimap = _ref[1];
  var editorElement = _ref[2];
  var minimapElement = _ref[3];
  var workspaceElement = _ref[4];
  var minimapPackage = _ref[5];

  beforeEach(function () {
    atom.config.set('minimap.autoToggle', true);

    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    _libMinimapElement2['default'].registerViewProvider(_libMinimap2['default']);

    waitsForPromise(function () {
      return atom.workspace.open('sample.coffee');
    });

    waitsForPromise(function () {
      return atom.packages.activatePackage('minimap').then(function (pkg) {
        minimapPackage = pkg.mainModule;
      });
    });

    waitsFor(function () {
      return workspaceElement.querySelector('atom-text-editor');
    });

    runs(function () {
      editor = atom.workspace.getActiveTextEditor();
      editorElement = atom.views.getView(editor);
    });

    waitsFor(function () {
      return workspaceElement.querySelector('atom-text-editor::shadow atom-text-editor-minimap');
    });
  });

  it('registers the minimap views provider', function () {
    var textEditor = atom.workspace.buildTextEditor({});
    minimap = new _libMinimap2['default']({ textEditor: textEditor });
    minimapElement = atom.views.getView(minimap);

    expect(minimapElement).toExist();
  });

  describe('when an editor is opened', function () {
    it('creates a minimap model for the editor', function () {
      expect(minimapPackage.minimapForEditor(editor)).toBeDefined();
    });

    it('attaches a minimap element to the editor view', function () {
      expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).toExist();
    });
  });

  describe('::observeMinimaps', function () {
    var _ref2 = [];
    var spy = _ref2[0];

    beforeEach(function () {
      spy = jasmine.createSpy('observeMinimaps');
      minimapPackage.observeMinimaps(spy);
    });

    it('calls the callback with the existing minimaps', function () {
      expect(spy).toHaveBeenCalled();
    });

    it('calls the callback when a new editor is opened', function () {
      waitsForPromise(function () {
        return atom.workspace.open('other-sample.js');
      });

      runs(function () {
        expect(spy.calls.length).toEqual(2);
      });
    });
  });

  describe('::deactivate', function () {
    beforeEach(function () {
      minimapPackage.deactivate();
    });

    it('destroys all the minimap models', function () {
      expect(minimapPackage.editorsMinimaps).toBeUndefined();
    });

    it('destroys all the minimap elements', function () {
      expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).not.toExist();
    });
  });

  describe('service', function () {
    it('returns the minimap main module', function () {
      expect(minimapPackage.provideMinimapServiceV1()).toEqual(minimapPackage);
    });

    it('creates standalone minimap with provided text editor', function () {
      var textEditor = atom.workspace.buildTextEditor({});
      var standaloneMinimap = minimapPackage.standAloneMinimapForEditor(textEditor);
      expect(standaloneMinimap.getTextEditor()).toEqual(textEditor);
    });
  });

  //    ########  ##       ##     ##  ######   #### ##    ##  ######
  //    ##     ## ##       ##     ## ##    ##   ##  ###   ## ##    ##
  //    ##     ## ##       ##     ## ##         ##  ####  ## ##
  //    ########  ##       ##     ## ##   ####  ##  ## ## ##  ######
  //    ##        ##       ##     ## ##    ##   ##  ##  ####       ##
  //    ##        ##       ##     ## ##    ##   ##  ##   ### ##    ##
  //    ##        ########  #######   ######   #### ##    ##  ######

  describe('plugins', function () {
    var _ref3 = [];
    var registerHandler = _ref3[0];
    var unregisterHandler = _ref3[1];
    var plugin = _ref3[2];

    describe('when the displayPluginsControls setting is enabled', function () {
      beforeEach(function () {
        atom.config.set('minimap.displayPluginsControls', true);
        atom.config.set('minimap.plugins.dummy', undefined);

        plugin = {
          active: false,
          activatePlugin: function activatePlugin() {
            this.active = true;
          },
          deactivatePlugin: function deactivatePlugin() {
            this.active = false;
          },
          isActive: function isActive() {
            return this.active;
          }
        };

        spyOn(plugin, 'activatePlugin').andCallThrough();
        spyOn(plugin, 'deactivatePlugin').andCallThrough();

        registerHandler = jasmine.createSpy('register handler');
        unregisterHandler = jasmine.createSpy('unregister handler');
      });

      describe('when registered', function () {
        beforeEach(function () {
          minimapPackage.onDidAddPlugin(registerHandler);
          minimapPackage.onDidRemovePlugin(unregisterHandler);
          minimapPackage.registerPlugin('dummy', plugin);
        });

        it('makes the plugin available in the minimap', function () {
          expect(minimapPackage.plugins['dummy']).toBe(plugin);
        });

        it('emits an event', function () {
          expect(registerHandler).toHaveBeenCalled();
        });

        it('creates a default config for the plugin', function () {
          expect(minimapPackage.config.plugins.properties.dummy).toBeDefined();
          expect(minimapPackage.config.plugins.properties.dummyDecorationsZIndex).toBeDefined();
        });

        it('sets the corresponding config', function () {
          expect(atom.config.get('minimap.plugins.dummy')).toBeTruthy();
          expect(atom.config.get('minimap.plugins.dummyDecorationsZIndex')).toEqual(0);
        });

        describe('triggering the corresponding plugin command', function () {
          beforeEach(function () {
            atom.commands.dispatch(workspaceElement, 'minimap:toggle-dummy');
          });

          it('receives a deactivation call', function () {
            expect(plugin.deactivatePlugin).toHaveBeenCalled();
          });
        });

        describe('and then unregistered', function () {
          beforeEach(function () {
            minimapPackage.unregisterPlugin('dummy');
          });

          it('has been unregistered', function () {
            expect(minimapPackage.plugins['dummy']).toBeUndefined();
          });

          it('emits an event', function () {
            expect(unregisterHandler).toHaveBeenCalled();
          });

          describe('when the config is modified', function () {
            beforeEach(function () {
              atom.config.set('minimap.plugins.dummy', false);
            });

            it('does not activates the plugin', function () {
              expect(plugin.deactivatePlugin).not.toHaveBeenCalled();
            });
          });
        });

        describe('on minimap deactivation', function () {
          beforeEach(function () {
            expect(plugin.active).toBeTruthy();
            minimapPackage.deactivate();
          });

          it('deactivates all the plugins', function () {
            expect(plugin.active).toBeFalsy();
          });
        });
      });

      describe('when the config for it is false', function () {
        beforeEach(function () {
          atom.config.set('minimap.plugins.dummy', false);
          minimapPackage.registerPlugin('dummy', plugin);
        });

        it('does not receive an activation call', function () {
          expect(plugin.activatePlugin).not.toHaveBeenCalled();
        });
      });

      describe('the registered plugin', function () {
        beforeEach(function () {
          minimapPackage.registerPlugin('dummy', plugin);
        });

        it('receives an activation call', function () {
          expect(plugin.activatePlugin).toHaveBeenCalled();
        });

        it('activates the plugin', function () {
          expect(plugin.active).toBeTruthy();
        });

        describe('when the config is modified after registration', function () {
          beforeEach(function () {
            atom.config.set('minimap.plugins.dummy', false);
          });

          it('receives a deactivation call', function () {
            expect(plugin.deactivatePlugin).toHaveBeenCalled();
          });
        });
      });
    });

    describe('when the displayPluginsControls setting is disabled', function () {
      beforeEach(function () {
        atom.config.set('minimap.displayPluginsControls', false);
        atom.config.set('minimap.plugins.dummy', undefined);

        plugin = {
          active: false,
          activatePlugin: function activatePlugin() {
            this.active = true;
          },
          deactivatePlugin: function deactivatePlugin() {
            this.active = false;
          },
          isActive: function isActive() {
            return this.active;
          }
        };

        spyOn(plugin, 'activatePlugin').andCallThrough();
        spyOn(plugin, 'deactivatePlugin').andCallThrough();

        registerHandler = jasmine.createSpy('register handler');
        unregisterHandler = jasmine.createSpy('unregister handler');
      });

      describe('when registered', function () {
        beforeEach(function () {
          minimapPackage.onDidAddPlugin(registerHandler);
          minimapPackage.onDidRemovePlugin(unregisterHandler);
          minimapPackage.registerPlugin('dummy', plugin);
        });

        it('makes the plugin available in the minimap', function () {
          expect(minimapPackage.plugins['dummy']).toBe(plugin);
        });

        it('emits an event', function () {
          expect(registerHandler).toHaveBeenCalled();
        });

        it('still activates the package', function () {
          expect(plugin.isActive()).toBeTruthy();
        });

        describe('and then unregistered', function () {
          beforeEach(function () {
            minimapPackage.unregisterPlugin('dummy');
          });

          it('has been unregistered', function () {
            expect(minimapPackage.plugins['dummy']).toBeUndefined();
          });

          it('emits an event', function () {
            expect(unregisterHandler).toHaveBeenCalled();
          });
        });

        describe('on minimap deactivation', function () {
          beforeEach(function () {
            expect(plugin.active).toBeTruthy();
            minimapPackage.deactivate();
          });

          it('deactivates all the plugins', function () {
            expect(plugin.active).toBeFalsy();
          });
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9taW5pbWFwLW1haW4tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztRQUVPLHFCQUFxQjs7MEJBQ1IsZ0JBQWdCOzs7O2lDQUNULHdCQUF3Qjs7OztBQUpuRCxXQUFXLENBQUE7O0FBTVgsUUFBUSxDQUFDLGlCQUFpQixFQUFFLFlBQU07YUFDeUQsRUFBRTtNQUF0RixNQUFNO01BQUUsT0FBTztNQUFFLGFBQWE7TUFBRSxjQUFjO01BQUUsZ0JBQWdCO01BQUUsY0FBYzs7QUFFckYsWUFBVSxDQUFDLFlBQU07QUFDZixRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFM0Msb0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3JELFdBQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTs7QUFFckMsbUNBQWUsb0JBQW9CLHlCQUFTLENBQUE7O0FBRTVDLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0tBQzVDLENBQUMsQ0FBQTs7QUFFRixtQkFBZSxDQUFDLFlBQU07QUFDcEIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDNUQsc0JBQWMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFBO09BQ2hDLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTs7QUFFRixZQUFRLENBQUMsWUFBTTtBQUNiLGFBQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUE7S0FDMUQsQ0FBQyxDQUFBOztBQUVGLFFBQUksQ0FBQyxZQUFNO0FBQ1QsWUFB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V0FDekMsQ0FBQyxDQUFBOztBQUVGLFlBQUUsQ0FBQyx1QkFBdUIsRUFBRSxZQUFNO0FBQ2hDLGtCQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1dBQ3hELENBQUMsQ0FBQTs7QUFFRixZQUFFLENBQUMsZ0JBQWdCLEVBQUUsWUFBTTtBQUN6QixrQkFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtXQUM3QyxDQUFDLENBQUE7U0FDSCxDQUFDLENBQUE7O0FBRUYsZ0JBQVEsQ0FBQyx5QkFBeUIsRUFBRSxZQUFNO0FBQ3hDLG9CQUFVLENBQUMsWUFBTTtBQUNmLGtCQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQ2xDLDBCQUFjLENBQUMsVUFBVSxFQUFFLENBQUE7V0FDNUIsQ0FBQyxDQUFBOztBQUVGLFlBQUUsQ0FBQyw2QkFBNkIsRUFBRSxZQUFNO0FBQ3RDLGtCQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBO1dBQ2xDLENBQUMsQ0FBQTtTQUNILENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvdm1hdWRnYWx5YS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL3NwZWMvbWluaW1hcC1tYWluLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgJy4vaGVscGVycy93b3Jrc3BhY2UnXG5pbXBvcnQgTWluaW1hcCBmcm9tICcuLi9saWIvbWluaW1hcCdcbmltcG9ydCBNaW5pbWFwRWxlbWVudCBmcm9tICcuLi9saWIvbWluaW1hcC1lbGVtZW50J1xuXG5kZXNjcmliZSgnTWluaW1hcCBwYWNrYWdlJywgKCkgPT4ge1xuICBsZXQgW2VkaXRvciwgbWluaW1hcCwgZWRpdG9yRWxlbWVudCwgbWluaW1hcEVsZW1lbnQsIHdvcmtzcGFjZUVsZW1lbnQsIG1pbmltYXBQYWNrYWdlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmF1dG9Ub2dnbGUnLCB0cnVlKVxuXG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG5cbiAgICBNaW5pbWFwRWxlbWVudC5yZWdpc3RlclZpZXdQcm92aWRlcihNaW5pbWFwKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUuY29mZmVlJylcbiAgICB9KVxuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbWluaW1hcCcpLnRoZW4oKHBrZykgPT4ge1xuICAgICAgICBtaW5pbWFwUGFja2FnZSA9IHBrZy5tYWluTW9kdWxlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhdG9tLXRleHQtZWRpdG9yJylcbiAgICB9KVxuXG4gICAgcnVucygoKSA9PiB7XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgIH0pXG5cbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhdG9tLXRleHQtZWRpdG9yOjpzaGFkb3cgYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwJylcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdyZWdpc3RlcnMgdGhlIG1pbmltYXAgdmlld3MgcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgbGV0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3Ioe30pXG4gICAgbWluaW1hcCA9IG5ldyBNaW5pbWFwKHt0ZXh0RWRpdG9yfSlcbiAgICBtaW5pbWFwRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhtaW5pbWFwKVxuXG4gICAgZXhwZWN0KG1pbmltYXBFbGVtZW50KS50b0V4aXN0KClcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBhbiBlZGl0b3IgaXMgb3BlbmVkJywgKCkgPT4ge1xuICAgIGl0KCdjcmVhdGVzIGEgbWluaW1hcCBtb2RlbCBmb3IgdGhlIGVkaXRvcicsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5taW5pbWFwRm9yRWRpdG9yKGVkaXRvcikpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ2F0dGFjaGVzIGEgbWluaW1hcCBlbGVtZW50IHRvIHRoZSBlZGl0b3IgdmlldycsICgpID0+IHtcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwJykpLnRvRXhpc3QoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJzo6b2JzZXJ2ZU1pbmltYXBzJywgKCkgPT4ge1xuICAgIGxldCBbc3B5XSA9IFtdXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnb2JzZXJ2ZU1pbmltYXBzJylcbiAgICAgIG1pbmltYXBQYWNrYWdlLm9ic2VydmVNaW5pbWFwcyhzcHkpXG4gICAgfSlcblxuICAgIGl0KCdjYWxscyB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgZXhpc3RpbmcgbWluaW1hcHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ2NhbGxzIHRoZSBjYWxsYmFjayB3aGVuIGEgbmV3IGVkaXRvciBpcyBvcGVuZWQnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4geyByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbignb3RoZXItc2FtcGxlLmpzJykgfSlcblxuICAgICAgcnVucygoKSA9PiB7IGV4cGVjdChzcHkuY2FsbHMubGVuZ3RoKS50b0VxdWFsKDIpIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnOjpkZWFjdGl2YXRlJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgbWluaW1hcFBhY2thZ2UuZGVhY3RpdmF0ZSgpXG4gICAgfSlcblxuICAgIGl0KCdkZXN0cm95cyBhbGwgdGhlIG1pbmltYXAgbW9kZWxzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLmVkaXRvcnNNaW5pbWFwcykudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdkZXN0cm95cyBhbGwgdGhlIG1pbmltYXAgZWxlbWVudHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ2F0b20tdGV4dC1lZGl0b3ItbWluaW1hcCcpKS5ub3QudG9FeGlzdCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2VydmljZScsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0aGUgbWluaW1hcCBtYWluIG1vZHVsZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5wcm92aWRlTWluaW1hcFNlcnZpY2VWMSgpKS50b0VxdWFsKG1pbmltYXBQYWNrYWdlKVxuICAgIH0pXG5cbiAgICBpdCgnY3JlYXRlcyBzdGFuZGFsb25lIG1pbmltYXAgd2l0aCBwcm92aWRlZCB0ZXh0IGVkaXRvcicsICgpID0+IHtcbiAgICAgIGxldCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHt9KVxuICAgICAgbGV0IHN0YW5kYWxvbmVNaW5pbWFwID0gbWluaW1hcFBhY2thZ2Uuc3RhbmRBbG9uZU1pbmltYXBGb3JFZGl0b3IodGV4dEVkaXRvcilcbiAgICAgIGV4cGVjdChzdGFuZGFsb25lTWluaW1hcC5nZXRUZXh0RWRpdG9yKCkpLnRvRXF1YWwodGV4dEVkaXRvcilcbiAgICB9KVxuICB9KVxuXG4gIC8vICAgICMjIyMjIyMjICAjIyAgICAgICAjIyAgICAgIyMgICMjIyMjIyAgICMjIyMgIyMgICAgIyMgICMjIyMjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICMjICAgIyMgICMjIyAgICMjICMjICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgICAjIyAgIyMjIyAgIyMgIyNcbiAgLy8gICAgIyMjIyMjIyMgICMjICAgICAgICMjICAgICAjIyAjIyAgICMjIyMgICMjICAjIyAjIyAjIyAgIyMjIyMjXG4gIC8vICAgICMjICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyMgICAjIyAgIyMgICMjIyMgICAgICAgIyNcbiAgLy8gICAgIyMgICAgICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAjIyAgICMjICAjIyAgICMjIyAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgICAgIyMjIyMjIyMgICMjIyMjIyMgICAjIyMjIyMgICAjIyMjICMjICAgICMjICAjIyMjIyNcblxuICBkZXNjcmliZSgncGx1Z2lucycsICgpID0+IHtcbiAgICBsZXQgW3JlZ2lzdGVySGFuZGxlciwgdW5yZWdpc3RlckhhbmRsZXIsIHBsdWdpbl0gPSBbXVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlIGRpc3BsYXlQbHVnaW5zQ29udHJvbHMgc2V0dGluZyBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5kaXNwbGF5UGx1Z2luc0NvbnRyb2xzJywgdHJ1ZSlcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLnBsdWdpbnMuZHVtbXknLCB1bmRlZmluZWQpXG5cbiAgICAgICAgcGx1Z2luID0ge1xuICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgYWN0aXZhdGVQbHVnaW4gKCkgeyB0aGlzLmFjdGl2ZSA9IHRydWUgfSxcbiAgICAgICAgICBkZWFjdGl2YXRlUGx1Z2luICgpIHsgdGhpcy5hY3RpdmUgPSBmYWxzZSB9LFxuICAgICAgICAgIGlzQWN0aXZlICgpIHsgcmV0dXJuIHRoaXMuYWN0aXZlIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNweU9uKHBsdWdpbiwgJ2FjdGl2YXRlUGx1Z2luJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICBzcHlPbihwbHVnaW4sICdkZWFjdGl2YXRlUGx1Z2luJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgIHJlZ2lzdGVySGFuZGxlciA9IGphc21pbmUuY3JlYXRlU3B5KCdyZWdpc3RlciBoYW5kbGVyJylcbiAgICAgICAgdW5yZWdpc3RlckhhbmRsZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgndW5yZWdpc3RlciBoYW5kbGVyJylcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCd3aGVuIHJlZ2lzdGVyZWQnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIG1pbmltYXBQYWNrYWdlLm9uRGlkQWRkUGx1Z2luKHJlZ2lzdGVySGFuZGxlcilcbiAgICAgICAgICBtaW5pbWFwUGFja2FnZS5vbkRpZFJlbW92ZVBsdWdpbih1bnJlZ2lzdGVySGFuZGxlcilcbiAgICAgICAgICBtaW5pbWFwUGFja2FnZS5yZWdpc3RlclBsdWdpbignZHVtbXknLCBwbHVnaW4pXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ21ha2VzIHRoZSBwbHVnaW4gYXZhaWxhYmxlIGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5wbHVnaW5zWydkdW1teSddKS50b0JlKHBsdWdpbilcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnZW1pdHMgYW4gZXZlbnQnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHJlZ2lzdGVySGFuZGxlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ2NyZWF0ZXMgYSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIHBsdWdpbicsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QobWluaW1hcFBhY2thZ2UuY29uZmlnLnBsdWdpbnMucHJvcGVydGllcy5kdW1teSkudG9CZURlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5jb25maWcucGx1Z2lucy5wcm9wZXJ0aWVzLmR1bW15RGVjb3JhdGlvbnNaSW5kZXgpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnc2V0cyB0aGUgY29ycmVzcG9uZGluZyBjb25maWcnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCgnbWluaW1hcC5wbHVnaW5zLmR1bW15JykpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgIGV4cGVjdChhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teURlY29yYXRpb25zWkluZGV4JykpLnRvRXF1YWwoMClcbiAgICAgICAgfSlcblxuICAgICAgICBkZXNjcmliZSgndHJpZ2dlcmluZyB0aGUgY29ycmVzcG9uZGluZyBwbHVnaW4gY29tbWFuZCcsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ21pbmltYXA6dG9nZ2xlLWR1bW15JylcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaXQoJ3JlY2VpdmVzIGEgZGVhY3RpdmF0aW9uIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QocGx1Z2luLmRlYWN0aXZhdGVQbHVnaW4pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgZGVzY3JpYmUoJ2FuZCB0aGVuIHVucmVnaXN0ZXJlZCcsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIG1pbmltYXBQYWNrYWdlLnVucmVnaXN0ZXJQbHVnaW4oJ2R1bW15JylcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaXQoJ2hhcyBiZWVuIHVucmVnaXN0ZXJlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5wbHVnaW5zWydkdW1teSddKS50b0JlVW5kZWZpbmVkKClcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaXQoJ2VtaXRzIGFuIGV2ZW50JywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KHVucmVnaXN0ZXJIYW5kbGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgZGVzY3JpYmUoJ3doZW4gdGhlIGNvbmZpZyBpcyBtb2RpZmllZCcsICgpID0+IHtcbiAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScsIGZhbHNlKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IGFjdGl2YXRlcyB0aGUgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgICAgICAgICBleHBlY3QocGx1Z2luLmRlYWN0aXZhdGVQbHVnaW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICBkZXNjcmliZSgnb24gbWluaW1hcCBkZWFjdGl2YXRpb24nLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QocGx1Z2luLmFjdGl2ZSkudG9CZVRydXRoeSgpXG4gICAgICAgICAgICBtaW5pbWFwUGFja2FnZS5kZWFjdGl2YXRlKClcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaXQoJ2RlYWN0aXZhdGVzIGFsbCB0aGUgcGx1Z2lucycsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZlKS50b0JlRmFsc3koKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZSgnd2hlbiB0aGUgY29uZmlnIGZvciBpdCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLnBsdWdpbnMuZHVtbXknLCBmYWxzZSlcbiAgICAgICAgICBtaW5pbWFwUGFja2FnZS5yZWdpc3RlclBsdWdpbignZHVtbXknLCBwbHVnaW4pXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IHJlY2VpdmUgYW4gYWN0aXZhdGlvbiBjYWxsJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZhdGVQbHVnaW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCd0aGUgcmVnaXN0ZXJlZCBwbHVnaW4nLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIG1pbmltYXBQYWNrYWdlLnJlZ2lzdGVyUGx1Z2luKCdkdW1teScsIHBsdWdpbilcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgncmVjZWl2ZXMgYW4gYWN0aXZhdGlvbiBjYWxsJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZhdGVQbHVnaW4pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdhY3RpdmF0ZXMgdGhlIHBsdWdpbicsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QocGx1Z2luLmFjdGl2ZSkudG9CZVRydXRoeSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgZGVzY3JpYmUoJ3doZW4gdGhlIGNvbmZpZyBpcyBtb2RpZmllZCBhZnRlciByZWdpc3RyYXRpb24nLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScsIGZhbHNlKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpdCgncmVjZWl2ZXMgYSBkZWFjdGl2YXRpb24gY2FsbCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChwbHVnaW4uZGVhY3RpdmF0ZVBsdWdpbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBkaXNwbGF5UGx1Z2luc0NvbnRyb2xzIHNldHRpbmcgaXMgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMnLCBmYWxzZSlcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLnBsdWdpbnMuZHVtbXknLCB1bmRlZmluZWQpXG5cbiAgICAgICAgcGx1Z2luID0ge1xuICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgYWN0aXZhdGVQbHVnaW4gKCkgeyB0aGlzLmFjdGl2ZSA9IHRydWUgfSxcbiAgICAgICAgICBkZWFjdGl2YXRlUGx1Z2luICgpIHsgdGhpcy5hY3RpdmUgPSBmYWxzZSB9LFxuICAgICAgICAgIGlzQWN0aXZlICgpIHsgcmV0dXJuIHRoaXMuYWN0aXZlIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNweU9uKHBsdWdpbiwgJ2FjdGl2YXRlUGx1Z2luJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICBzcHlPbihwbHVnaW4sICdkZWFjdGl2YXRlUGx1Z2luJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgIHJlZ2lzdGVySGFuZGxlciA9IGphc21pbmUuY3JlYXRlU3B5KCdyZWdpc3RlciBoYW5kbGVyJylcbiAgICAgICAgdW5yZWdpc3RlckhhbmRsZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgndW5yZWdpc3RlciBoYW5kbGVyJylcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCd3aGVuIHJlZ2lzdGVyZWQnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIG1pbmltYXBQYWNrYWdlLm9uRGlkQWRkUGx1Z2luKHJlZ2lzdGVySGFuZGxlcilcbiAgICAgICAgICBtaW5pbWFwUGFja2FnZS5vbkRpZFJlbW92ZVBsdWdpbih1bnJlZ2lzdGVySGFuZGxlcilcbiAgICAgICAgICBtaW5pbWFwUGFja2FnZS5yZWdpc3RlclBsdWdpbignZHVtbXknLCBwbHVnaW4pXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ21ha2VzIHRoZSBwbHVnaW4gYXZhaWxhYmxlIGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5wbHVnaW5zWydkdW1teSddKS50b0JlKHBsdWdpbilcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnZW1pdHMgYW4gZXZlbnQnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHJlZ2lzdGVySGFuZGxlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ3N0aWxsIGFjdGl2YXRlcyB0aGUgcGFja2FnZScsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QocGx1Z2luLmlzQWN0aXZlKCkpLnRvQmVUcnV0aHkoKVxuICAgICAgICB9KVxuXG4gICAgICAgIGRlc2NyaWJlKCdhbmQgdGhlbiB1bnJlZ2lzdGVyZWQnLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBtaW5pbWFwUGFja2FnZS51bnJlZ2lzdGVyUGx1Z2luKCdkdW1teScpXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGl0KCdoYXMgYmVlbiB1bnJlZ2lzdGVyZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QobWluaW1hcFBhY2thZ2UucGx1Z2luc1snZHVtbXknXSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGl0KCdlbWl0cyBhbiBldmVudCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdCh1bnJlZ2lzdGVySGFuZGxlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICBkZXNjcmliZSgnb24gbWluaW1hcCBkZWFjdGl2YXRpb24nLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QocGx1Z2luLmFjdGl2ZSkudG9CZVRydXRoeSgpXG4gICAgICAgICAgICBtaW5pbWFwUGFja2FnZS5kZWFjdGl2YXRlKClcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaXQoJ2RlYWN0aXZhdGVzIGFsbCB0aGUgcGx1Z2lucycsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZlKS50b0JlRmFsc3koKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/minimap-main-spec.js

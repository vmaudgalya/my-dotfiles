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
      });

      it('sets the corresponding config', function () {
        expect(atom.config.get('minimap.plugins.dummy')).toBeTruthy();
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9taW5pbWFwLW1haW4tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztRQUVPLHFCQUFxQjs7MEJBQ1IsZ0JBQWdCOzs7O2lDQUNULHdCQUF3Qjs7OztBQUpuRCxXQUFXLENBQUE7O0FBTVgsUUFBUSxDQUFDLGlCQUFpQixFQUFFLFlBQU07YUFDeUQsRUFBRTtNQUF0RixNQUFNO01BQUUsT0FBTztNQUFFLGFBQWE7TUFBRSxjQUFjO01BQUUsZ0JBQWdCO01BQUUsY0FBYzs7QUFFckYsWUFBVSxDQUFDLFlBQU07QUFDZixRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFM0Msb0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3JELFdBQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTs7QUFFckMsbUNBQWUsb0JBQW9CLHlCQUFTLENBQUE7O0FBRTVDLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0tBQzVDLENBQUMsQ0FBQTs7QUFFRixtQkFBZSxDQUFDLFlBQU07QUFDcEIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDNUQsc0JBQWMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFBO09BQ2hDLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTs7QUFFRixZQUFRLENBQUMsWUFBTTtBQUNiLGFBQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUE7S0FDMUQsQ0FBQyxDQUFBOztBQUVGLFFBQUksQ0FBQyxZQUFNO0FBQ1QsWUFB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WUFBTTtBQUMvRCxrQkFBVSxDQUFDLFlBQU07QUFDZixjQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQTtTQUNoRCxDQUFDLENBQUE7O0FBRUYsVUFBRSxDQUFDLDhCQUE4QixFQUFFLFlBQU07QUFDdkMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1NBQ25ELENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvdm1hdWRnYWx5YS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL3NwZWMvbWluaW1hcC1tYWluLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgJy4vaGVscGVycy93b3Jrc3BhY2UnXG5pbXBvcnQgTWluaW1hcCBmcm9tICcuLi9saWIvbWluaW1hcCdcbmltcG9ydCBNaW5pbWFwRWxlbWVudCBmcm9tICcuLi9saWIvbWluaW1hcC1lbGVtZW50J1xuXG5kZXNjcmliZSgnTWluaW1hcCBwYWNrYWdlJywgKCkgPT4ge1xuICBsZXQgW2VkaXRvciwgbWluaW1hcCwgZWRpdG9yRWxlbWVudCwgbWluaW1hcEVsZW1lbnQsIHdvcmtzcGFjZUVsZW1lbnQsIG1pbmltYXBQYWNrYWdlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmF1dG9Ub2dnbGUnLCB0cnVlKVxuXG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG5cbiAgICBNaW5pbWFwRWxlbWVudC5yZWdpc3RlclZpZXdQcm92aWRlcihNaW5pbWFwKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUuY29mZmVlJylcbiAgICB9KVxuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbWluaW1hcCcpLnRoZW4oKHBrZykgPT4ge1xuICAgICAgICBtaW5pbWFwUGFja2FnZSA9IHBrZy5tYWluTW9kdWxlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhdG9tLXRleHQtZWRpdG9yJylcbiAgICB9KVxuXG4gICAgcnVucygoKSA9PiB7XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgIH0pXG5cbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhdG9tLXRleHQtZWRpdG9yOjpzaGFkb3cgYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwJylcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdyZWdpc3RlcnMgdGhlIG1pbmltYXAgdmlld3MgcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgbGV0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3Ioe30pXG4gICAgbWluaW1hcCA9IG5ldyBNaW5pbWFwKHt0ZXh0RWRpdG9yfSlcbiAgICBtaW5pbWFwRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhtaW5pbWFwKVxuXG4gICAgZXhwZWN0KG1pbmltYXBFbGVtZW50KS50b0V4aXN0KClcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBhbiBlZGl0b3IgaXMgb3BlbmVkJywgKCkgPT4ge1xuICAgIGl0KCdjcmVhdGVzIGEgbWluaW1hcCBtb2RlbCBmb3IgdGhlIGVkaXRvcicsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5taW5pbWFwRm9yRWRpdG9yKGVkaXRvcikpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ2F0dGFjaGVzIGEgbWluaW1hcCBlbGVtZW50IHRvIHRoZSBlZGl0b3IgdmlldycsICgpID0+IHtcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwJykpLnRvRXhpc3QoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJzo6b2JzZXJ2ZU1pbmltYXBzJywgKCkgPT4ge1xuICAgIGxldCBbc3B5XSA9IFtdXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnb2JzZXJ2ZU1pbmltYXBzJylcbiAgICAgIG1pbmltYXBQYWNrYWdlLm9ic2VydmVNaW5pbWFwcyhzcHkpXG4gICAgfSlcblxuICAgIGl0KCdjYWxscyB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgZXhpc3RpbmcgbWluaW1hcHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ2NhbGxzIHRoZSBjYWxsYmFjayB3aGVuIGEgbmV3IGVkaXRvciBpcyBvcGVuZWQnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4geyByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbignb3RoZXItc2FtcGxlLmpzJykgfSlcblxuICAgICAgcnVucygoKSA9PiB7IGV4cGVjdChzcHkuY2FsbHMubGVuZ3RoKS50b0VxdWFsKDIpIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnOjpkZWFjdGl2YXRlJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgbWluaW1hcFBhY2thZ2UuZGVhY3RpdmF0ZSgpXG4gICAgfSlcblxuICAgIGl0KCdkZXN0cm95cyBhbGwgdGhlIG1pbmltYXAgbW9kZWxzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLmVkaXRvcnNNaW5pbWFwcykudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdkZXN0cm95cyBhbGwgdGhlIG1pbmltYXAgZWxlbWVudHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ2F0b20tdGV4dC1lZGl0b3ItbWluaW1hcCcpKS5ub3QudG9FeGlzdCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2VydmljZScsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0aGUgbWluaW1hcCBtYWluIG1vZHVsZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5wcm92aWRlTWluaW1hcFNlcnZpY2VWMSgpKS50b0VxdWFsKG1pbmltYXBQYWNrYWdlKVxuICAgIH0pXG5cbiAgICBpdCgnY3JlYXRlcyBzdGFuZGFsb25lIG1pbmltYXAgd2l0aCBwcm92aWRlZCB0ZXh0IGVkaXRvcicsICgpID0+IHtcbiAgICAgIGxldCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHt9KVxuICAgICAgbGV0IHN0YW5kYWxvbmVNaW5pbWFwID0gbWluaW1hcFBhY2thZ2Uuc3RhbmRBbG9uZU1pbmltYXBGb3JFZGl0b3IodGV4dEVkaXRvcilcbiAgICAgIGV4cGVjdChzdGFuZGFsb25lTWluaW1hcC5nZXRUZXh0RWRpdG9yKCkpLnRvRXF1YWwodGV4dEVkaXRvcilcbiAgICB9KVxuICB9KVxuXG4gIC8vICAgICMjIyMjIyMjICAjIyAgICAgICAjIyAgICAgIyMgICMjIyMjIyAgICMjIyMgIyMgICAgIyMgICMjIyMjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICMjICAgIyMgICMjIyAgICMjICMjICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgICAjIyAgIyMjIyAgIyMgIyNcbiAgLy8gICAgIyMjIyMjIyMgICMjICAgICAgICMjICAgICAjIyAjIyAgICMjIyMgICMjICAjIyAjIyAjIyAgIyMjIyMjXG4gIC8vICAgICMjICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyMgICAjIyAgIyMgICMjIyMgICAgICAgIyNcbiAgLy8gICAgIyMgICAgICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAjIyAgICMjICAjIyAgICMjIyAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgICAgIyMjIyMjIyMgICMjIyMjIyMgICAjIyMjIyMgICAjIyMjICMjICAgICMjICAjIyMjIyNcblxuICBkZXNjcmliZSgncGx1Z2lucycsICgpID0+IHtcbiAgICBsZXQgW3JlZ2lzdGVySGFuZGxlciwgdW5yZWdpc3RlckhhbmRsZXIsIHBsdWdpbl0gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuZGlzcGxheVBsdWdpbnNDb250cm9scycsIHRydWUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScsIHVuZGVmaW5lZClcblxuICAgICAgcGx1Z2luID0ge1xuICAgICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgICBhY3RpdmF0ZVBsdWdpbiAoKSB7IHRoaXMuYWN0aXZlID0gdHJ1ZSB9LFxuICAgICAgICBkZWFjdGl2YXRlUGx1Z2luICgpIHsgdGhpcy5hY3RpdmUgPSBmYWxzZSB9LFxuICAgICAgICBpc0FjdGl2ZSAoKSB7IHJldHVybiB0aGlzLmFjdGl2ZSB9XG4gICAgICB9XG5cbiAgICAgIHNweU9uKHBsdWdpbiwgJ2FjdGl2YXRlUGx1Z2luJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgc3B5T24ocGx1Z2luLCAnZGVhY3RpdmF0ZVBsdWdpbicpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgcmVnaXN0ZXJIYW5kbGVyID0gamFzbWluZS5jcmVhdGVTcHkoJ3JlZ2lzdGVyIGhhbmRsZXInKVxuICAgICAgdW5yZWdpc3RlckhhbmRsZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgndW5yZWdpc3RlciBoYW5kbGVyJylcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gcmVnaXN0ZXJlZCcsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBtaW5pbWFwUGFja2FnZS5vbkRpZEFkZFBsdWdpbihyZWdpc3RlckhhbmRsZXIpXG4gICAgICAgIG1pbmltYXBQYWNrYWdlLm9uRGlkUmVtb3ZlUGx1Z2luKHVucmVnaXN0ZXJIYW5kbGVyKVxuICAgICAgICBtaW5pbWFwUGFja2FnZS5yZWdpc3RlclBsdWdpbignZHVtbXknLCBwbHVnaW4pXG4gICAgICB9KVxuXG4gICAgICBpdCgnbWFrZXMgdGhlIHBsdWdpbiBhdmFpbGFibGUgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5wbHVnaW5zWydkdW1teSddKS50b0JlKHBsdWdpbilcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdlbWl0cyBhbiBldmVudCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlZ2lzdGVySGFuZGxlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnY3JlYXRlcyBhIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWluaW1hcFBhY2thZ2UuY29uZmlnLnBsdWdpbnMucHJvcGVydGllcy5kdW1teSkudG9CZURlZmluZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3NldHMgdGhlIGNvcnJlc3BvbmRpbmcgY29uZmlnJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLnBsdWdpbnMuZHVtbXknKSkudG9CZVRydXRoeSgpXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZSgndHJpZ2dlcmluZyB0aGUgY29ycmVzcG9uZGluZyBwbHVnaW4gY29tbWFuZCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnbWluaW1hcDp0b2dnbGUtZHVtbXknKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdyZWNlaXZlcyBhIGRlYWN0aXZhdGlvbiBjYWxsJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChwbHVnaW4uZGVhY3RpdmF0ZVBsdWdpbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZSgnYW5kIHRoZW4gdW5yZWdpc3RlcmVkJywgKCkgPT4ge1xuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICBtaW5pbWFwUGFja2FnZS51bnJlZ2lzdGVyUGx1Z2luKCdkdW1teScpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ2hhcyBiZWVuIHVucmVnaXN0ZXJlZCcsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QobWluaW1hcFBhY2thZ2UucGx1Z2luc1snZHVtbXknXSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ2VtaXRzIGFuIGV2ZW50JywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdCh1bnJlZ2lzdGVySGFuZGxlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgZGVzY3JpYmUoJ3doZW4gdGhlIGNvbmZpZyBpcyBtb2RpZmllZCcsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5wbHVnaW5zLmR1bW15JywgZmFsc2UpXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGl0KCdkb2VzIG5vdCBhY3RpdmF0ZXMgdGhlIHBsdWdpbicsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChwbHVnaW4uZGVhY3RpdmF0ZVBsdWdpbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZSgnb24gbWluaW1hcCBkZWFjdGl2YXRpb24nLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZlKS50b0JlVHJ1dGh5KClcbiAgICAgICAgICBtaW5pbWFwUGFja2FnZS5kZWFjdGl2YXRlKClcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnZGVhY3RpdmF0ZXMgYWxsIHRoZSBwbHVnaW5zJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZlKS50b0JlRmFsc3koKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlIGNvbmZpZyBmb3IgaXQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLnBsdWdpbnMuZHVtbXknLCBmYWxzZSlcbiAgICAgICAgbWluaW1hcFBhY2thZ2UucmVnaXN0ZXJQbHVnaW4oJ2R1bW15JywgcGx1Z2luKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2RvZXMgbm90IHJlY2VpdmUgYW4gYWN0aXZhdGlvbiBjYWxsJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QocGx1Z2luLmFjdGl2YXRlUGx1Z2luKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgndGhlIHJlZ2lzdGVyZWQgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIG1pbmltYXBQYWNrYWdlLnJlZ2lzdGVyUGx1Z2luKCdkdW1teScsIHBsdWdpbilcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdyZWNlaXZlcyBhbiBhY3RpdmF0aW9uIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZhdGVQbHVnaW4pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2FjdGl2YXRlcyB0aGUgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QocGx1Z2luLmFjdGl2ZSkudG9CZVRydXRoeSgpXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZSgnd2hlbiB0aGUgY29uZmlnIGlzIG1vZGlmaWVkIGFmdGVyIHJlZ2lzdHJhdGlvbicsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLnBsdWdpbnMuZHVtbXknLCBmYWxzZSlcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgncmVjZWl2ZXMgYSBkZWFjdGl2YXRpb24gY2FsbCcsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QocGx1Z2luLmRlYWN0aXZhdGVQbHVnaW4pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/spec/minimap-main-spec.js

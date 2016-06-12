(function() {
  var Color, Palette, THEME_VARIABLES, change, click, _ref;

  Color = require('../lib/color');

  Palette = require('../lib/palette');

  THEME_VARIABLES = require('../lib/uris').THEME_VARIABLES;

  _ref = require('./helpers/events'), change = _ref.change, click = _ref.click;

  describe('PaletteElement', function() {
    var createVar, nextID, palette, paletteElement, pigments, project, workspaceElement, _ref1;
    _ref1 = [0], nextID = _ref1[0], palette = _ref1[1], paletteElement = _ref1[2], workspaceElement = _ref1[3], pigments = _ref1[4], project = _ref1[5];
    createVar = function(name, color, path, line) {
      return {
        name: name,
        color: color,
        path: path,
        line: line,
        id: nextID++
      };
    };
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
      return waitsForPromise(function() {
        return project.initialize();
      });
    });
    afterEach(function() {
      return project.destroy();
    });
    describe('as a view provider', function() {
      beforeEach(function() {
        palette = new Palette([createVar('red', new Color('#ff0000'), 'file.styl', 0), createVar('green', new Color('#00ff00'), 'file.styl', 1), createVar('blue', new Color('#0000ff'), 'file.styl', 2), createVar('redCopy', new Color('#ff0000'), 'file.styl', 3), createVar('red', new Color('#ff0000'), THEME_VARIABLES, 0)]);
        paletteElement = atom.views.getView(palette);
        return jasmine.attachToDOM(paletteElement);
      });
      it('is associated with the Palette model', function() {
        return expect(paletteElement).toBeDefined();
      });
      return it('does not render the file link when the variable comes from a theme', function() {
        return expect(paletteElement.querySelectorAll('li')[4].querySelector(' [data-variable-id]')).not.toExist();
      });
    });
    describe('when pigments:show-palette commands is triggered', function() {
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'pigments:show-palette');
        waitsFor(function() {
          return paletteElement = workspaceElement.querySelector('pigments-palette');
        });
        return runs(function() {
          palette = paletteElement.getModel();
          return jasmine.attachToDOM(paletteElement);
        });
      });
      it('opens a palette element', function() {
        return expect(paletteElement).toBeDefined();
      });
      it('creates as many list item as there is colors in the project', function() {
        expect(paletteElement.querySelectorAll('li').length).not.toEqual(0);
        return expect(paletteElement.querySelectorAll('li').length).toEqual(palette.variables.length);
      });
      it('binds colors with project variables', function() {
        var li, projectVariables;
        projectVariables = project.getColorVariables();
        li = paletteElement.querySelector('li');
        return expect(li.querySelector('.path').textContent).toEqual(atom.project.relativize(projectVariables[0].path));
      });
      describe('clicking on a result path', function() {
        return it('shows the variable in its file', function() {
          var pathElement;
          spyOn(project, 'showVariableInFile');
          pathElement = paletteElement.querySelector('[data-variable-id]');
          click(pathElement);
          return waitsFor(function() {
            return project.showVariableInFile.callCount > 0;
          });
        });
      });
      describe('when the sortPaletteColors settings is set to color', function() {
        beforeEach(function() {
          return atom.config.set('pigments.sortPaletteColors', 'by color');
        });
        return it('reorders the colors', function() {
          var i, lis, name, sortedColors, _i, _len, _results;
          sortedColors = project.getPalette().sortedByColor();
          lis = paletteElement.querySelectorAll('li');
          _results = [];
          for (i = _i = 0, _len = sortedColors.length; _i < _len; i = ++_i) {
            name = sortedColors[i].name;
            _results.push(expect(lis[i].querySelector('.name').textContent).toEqual(name));
          }
          return _results;
        });
      });
      describe('when the sortPaletteColors settings is set to name', function() {
        beforeEach(function() {
          return atom.config.set('pigments.sortPaletteColors', 'by name');
        });
        return it('reorders the colors', function() {
          var i, lis, name, sortedColors, _i, _len, _results;
          sortedColors = project.getPalette().sortedByName();
          lis = paletteElement.querySelectorAll('li');
          _results = [];
          for (i = _i = 0, _len = sortedColors.length; _i < _len; i = ++_i) {
            name = sortedColors[i].name;
            _results.push(expect(lis[i].querySelector('.name').textContent).toEqual(name));
          }
          return _results;
        });
      });
      describe('when the groupPaletteColors setting is set to file', function() {
        beforeEach(function() {
          return atom.config.set('pigments.groupPaletteColors', 'by file');
        });
        it('renders the list with sublists for each files', function() {
          var ols;
          ols = paletteElement.querySelectorAll('ol ol');
          return expect(ols.length).toEqual(5);
        });
        it('adds a header with the file path for each sublist', function() {
          var ols;
          ols = paletteElement.querySelectorAll('.pigments-color-group-header');
          return expect(ols.length).toEqual(5);
        });
        describe('and the sortPaletteColors is set to name', function() {
          beforeEach(function() {
            return atom.config.set('pigments.sortPaletteColors', 'by name');
          });
          return it('sorts the nested list items', function() {
            var file, i, lis, n, name, ol, ols, palettes, sortedColors, _results;
            palettes = paletteElement.getFilesPalettes();
            ols = paletteElement.querySelectorAll('.pigments-color-group');
            n = 0;
            _results = [];
            for (file in palettes) {
              palette = palettes[file];
              ol = ols[n++];
              lis = ol.querySelectorAll('li');
              sortedColors = palette.sortedByName();
              _results.push((function() {
                var _i, _len, _results1;
                _results1 = [];
                for (i = _i = 0, _len = sortedColors.length; _i < _len; i = ++_i) {
                  name = sortedColors[i].name;
                  _results1.push(expect(lis[i].querySelector('.name').textContent).toEqual(name));
                }
                return _results1;
              })());
            }
            return _results;
          });
        });
        return describe('when the mergeColorDuplicates', function() {
          beforeEach(function() {
            return atom.config.set('pigments.mergeColorDuplicates', true);
          });
          return it('groups identical colors together', function() {
            var lis;
            lis = paletteElement.querySelectorAll('li');
            return expect(lis.length).toEqual(40);
          });
        });
      });
      describe('sorting selector', function() {
        var sortSelect;
        sortSelect = [][0];
        return describe('when changed', function() {
          beforeEach(function() {
            sortSelect = paletteElement.querySelector('#sort-palette-colors');
            sortSelect.querySelector('option[value="by name"]').setAttribute('selected', 'selected');
            return change(sortSelect);
          });
          return it('changes the settings value', function() {
            return expect(atom.config.get('pigments.sortPaletteColors')).toEqual('by name');
          });
        });
      });
      return describe('grouping selector', function() {
        var groupSelect;
        groupSelect = [][0];
        return describe('when changed', function() {
          beforeEach(function() {
            groupSelect = paletteElement.querySelector('#group-palette-colors');
            groupSelect.querySelector('option[value="by file"]').setAttribute('selected', 'selected');
            return change(groupSelect);
          });
          return it('changes the settings value', function() {
            return expect(atom.config.get('pigments.groupPaletteColors')).toEqual('by file');
          });
        });
      });
    });
    describe('when the palette settings differs from defaults', function() {
      beforeEach(function() {
        atom.config.set('pigments.sortPaletteColors', 'by name');
        atom.config.set('pigments.groupPaletteColors', 'by file');
        return atom.config.set('pigments.mergeColorDuplicates', true);
      });
      return describe('when pigments:show-palette commands is triggered', function() {
        beforeEach(function() {
          atom.commands.dispatch(workspaceElement, 'pigments:show-palette');
          waitsFor(function() {
            return paletteElement = workspaceElement.querySelector('pigments-palette');
          });
          return runs(function() {
            return palette = paletteElement.getModel();
          });
        });
        describe('the sorting selector', function() {
          return it('selects the current value', function() {
            var sortSelect;
            sortSelect = paletteElement.querySelector('#sort-palette-colors');
            return expect(sortSelect.querySelector('option[selected]').value).toEqual('by name');
          });
        });
        describe('the grouping selector', function() {
          return it('selects the current value', function() {
            var groupSelect;
            groupSelect = paletteElement.querySelector('#group-palette-colors');
            return expect(groupSelect.querySelector('option[selected]').value).toEqual('by file');
          });
        });
        return it('checks the merge checkbox', function() {
          var mergeCheckBox;
          mergeCheckBox = paletteElement.querySelector('#merge-duplicates');
          return expect(mergeCheckBox.checked).toBeTruthy();
        });
      });
    });
    return describe('when the project variables are modified', function() {
      var initialColorCount, spy, _ref2;
      _ref2 = [], spy = _ref2[0], initialColorCount = _ref2[1];
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'pigments:show-palette');
        waitsFor(function() {
          return paletteElement = workspaceElement.querySelector('pigments-palette');
        });
        runs(function() {
          palette = paletteElement.getModel();
          initialColorCount = palette.getColorsCount();
          spy = jasmine.createSpy('onDidUpdateVariables');
          project.onDidUpdateVariables(spy);
          return atom.config.set('pigments.sourceNames', ['*.styl', '*.less', '*.sass']);
        });
        return waitsFor(function() {
          return spy.callCount > 0;
        });
      });
      return it('updates the palette', function() {
        var lis;
        expect(palette.getColorsCount()).not.toEqual(initialColorCount);
        lis = paletteElement.querySelectorAll('li');
        return expect(lis.length).not.toEqual(initialColorCount);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9wYWxldHRlLWVsZW1lbnQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0RBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxnQkFBUixDQURWLENBQUE7O0FBQUEsRUFFQyxrQkFBbUIsT0FBQSxDQUFRLGFBQVIsRUFBbkIsZUFGRCxDQUFBOztBQUFBLEVBR0EsT0FBa0IsT0FBQSxDQUFRLGtCQUFSLENBQWxCLEVBQUMsY0FBQSxNQUFELEVBQVMsYUFBQSxLQUhULENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsc0ZBQUE7QUFBQSxJQUFBLFFBQXlFLENBQUMsQ0FBRCxDQUF6RSxFQUFDLGlCQUFELEVBQVMsa0JBQVQsRUFBa0IseUJBQWxCLEVBQWtDLDJCQUFsQyxFQUFvRCxtQkFBcEQsRUFBOEQsa0JBQTlELENBQUE7QUFBQSxJQUVBLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsSUFBZCxFQUFvQixJQUFwQixHQUFBO2FBQ1Y7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sT0FBQSxLQUFQO0FBQUEsUUFBYyxNQUFBLElBQWQ7QUFBQSxRQUFvQixNQUFBLElBQXBCO0FBQUEsUUFBMEIsRUFBQSxFQUFJLE1BQUEsRUFBOUI7UUFEVTtJQUFBLENBRlosQ0FBQTtBQUFBLElBS0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFu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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/palette-element-spec.coffee

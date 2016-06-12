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
          return expect(ols.length).toEqual(4);
        });
        it('adds a header with the file path for each sublist', function() {
          var ols;
          ols = paletteElement.querySelectorAll('.pigments-color-group-header');
          return expect(ols.length).toEqual(4);
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
            return expect(lis.length).toEqual(37);
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
    return describe('when the palette settings differs from defaults', function() {
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
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9wYWxldHRlLWVsZW1lbnQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0RBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxnQkFBUixDQURWLENBQUE7O0FBQUEsRUFFQyxrQkFBbUIsT0FBQSxDQUFRLGFBQVIsRUFBbkIsZUFGRCxDQUFBOztBQUFBLEVBR0EsT0FBa0IsT0FBQSxDQUFRLGtCQUFSLENBQWxCLEVBQUMsY0FBQSxNQUFELEVBQVMsYUFBQSxLQUhULENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsc0ZBQUE7QUFBQSxJQUFBLFFBQXlFLENBQUMsQ0FBRCxDQUF6RSxFQUFDLGlCQUFELEVBQVMsa0JBQVQsRUFBa0IseUJBQWxCLEVBQWtDLDJCQUFsQyxFQUFvRCxtQkFBcEQsRUFBOEQsa0JBQTlELENBQUE7QUFBQSxJQUVBLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsSUFBZCxFQUFvQixJQUFwQixHQUFBO2FBQ1Y7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sT0FBQSxLQUFQO0FBQUEsUUFBYyxNQUFBLElBQWQ7QUFBQSxRQUFvQixNQUFBLElBQXBCO0FBQUEsUUFBMEIsRUFBQSxFQUFJLE1BQUEsRUFBOUI7UUFEVTtJQUFBLENBRlosQ0FBQTtBQUFBLElBS0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFu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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/palette-element-spec.coffee

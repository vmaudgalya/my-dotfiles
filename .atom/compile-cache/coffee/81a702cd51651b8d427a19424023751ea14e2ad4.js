(function() {
  describe('autocomplete provider', function() {
    var autocompleteMain, autocompleteManager, completionDelay, editor, editorView, jasmineContent, pigments, project, _ref;
    _ref = [], completionDelay = _ref[0], editor = _ref[1], editorView = _ref[2], pigments = _ref[3], autocompleteMain = _ref[4], autocompleteManager = _ref[5], jasmineContent = _ref[6], project = _ref[7];
    beforeEach(function() {
      runs(function() {
        var workspaceElement;
        jasmineContent = document.body.querySelector('#jasmine-content');
        atom.config.set('pigments.autocompleteScopes', ['*']);
        atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        return jasmineContent.appendChild(workspaceElement);
      });
      waitsForPromise('autocomplete-plus activation', function() {
        return atom.packages.activatePackage('autocomplete-plus').then(function(pkg) {
          return autocompleteMain = pkg.mainModule;
        });
      });
      waitsForPromise('pigments activation', function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          return pigments = pkg.mainModule;
        });
      });
      runs(function() {
        spyOn(autocompleteMain, 'consumeProvider').andCallThrough();
        return spyOn(pigments, 'provideAutocomplete').andCallThrough();
      });
      waitsForPromise('open sample file', function() {
        return atom.workspace.open('sample.styl').then(function(e) {
          editor = e;
          return editorView = atom.views.getView(editor);
        });
      });
      waitsForPromise('pigments project initialized', function() {
        project = pigments.getProject();
        return project.initialize();
      });
      return runs(function() {
        autocompleteManager = autocompleteMain.autocompleteManager;
        spyOn(autocompleteManager, 'findSuggestions').andCallThrough();
        return spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
      });
    });
    describe('writing the name of a color', function() {
      it('returns suggestions for the matching colors', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('b');
          editor.insertText('a');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          var popup, preview;
          popup = editorView.querySelector('.autocomplete-plus');
          expect(popup).toExist();
          expect(popup.querySelector('span.word').textContent).toEqual('base-color');
          preview = popup.querySelector('.color-suggestion-preview');
          expect(preview).toExist();
          return expect(preview.style.background).toEqual('rgb(255, 255, 255)');
        });
      });
      it('replaces the prefix even when it contains a @', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('@');
          editor.insertText('b');
          editor.insertText('a');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          return expect(editor.getText()).not.toContain('@@');
        });
      });
      it('replaces the prefix even when it contains a $', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('$');
          editor.insertText('o');
          editor.insertText('t');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          expect(editor.getText()).toContain('$other-color');
          return expect(editor.getText()).not.toContain('$$');
        });
      });
      return describe('when the extendAutocompleteToColorValue setting is enabled', function() {
        beforeEach(function() {
          return atom.config.set('pigments.extendAutocompleteToColorValue', true);
        });
        describe('with an opaque color', function() {
          return it('displays the color hexadecimal code in the completion item', function() {
            runs(function() {
              expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
              editor.moveToBottom();
              editor.insertText('b');
              editor.insertText('a');
              editor.insertText('s');
              return advanceClock(completionDelay);
            });
            waitsFor(function() {
              return autocompleteManager.displaySuggestions.calls.length === 1;
            });
            waitsFor(function() {
              return editorView.querySelector('.autocomplete-plus li') != null;
            });
            return runs(function() {
              var popup;
              popup = editorView.querySelector('.autocomplete-plus');
              expect(popup).toExist();
              expect(popup.querySelector('span.word').textContent).toEqual('base-color');
              return expect(popup.querySelector('span.right-label').textContent).toContain('#ffffff');
            });
          });
        });
        return describe('with a transparent color', function() {
          return it('displays the color hexadecimal code in the completion item', function() {
            runs(function() {
              expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
              editor.moveToBottom();
              editor.insertText('$');
              editor.insertText('o');
              editor.insertText('t');
              return advanceClock(completionDelay);
            });
            waitsFor(function() {
              return autocompleteManager.displaySuggestions.calls.length === 1;
            });
            waitsFor(function() {
              return editorView.querySelector('.autocomplete-plus li') != null;
            });
            return runs(function() {
              var popup;
              popup = editorView.querySelector('.autocomplete-plus');
              expect(popup).toExist();
              expect(popup.querySelector('span.word').textContent).toEqual('$other-color');
              return expect(popup.querySelector('span.right-label').textContent).toContain('rgba(255,0,0,0.5)');
            });
          });
        });
      });
    });
    describe('writing the name of a non-color variable', function() {
      return it('returns suggestions for the matching variable', function() {
        atom.config.set('pigments.extendAutocompleteToVariables', false);
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('f');
          editor.insertText('o');
          editor.insertText('o');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
    });
    return describe('when extendAutocompleteToVariables is true', function() {
      beforeEach(function() {
        return atom.config.set('pigments.extendAutocompleteToVariables', true);
      });
      return describe('writing the name of a non-color variable', function() {
        return it('returns suggestions for the matching variable', function() {
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            editor.moveToBottom();
            editor.insertText('b');
            editor.insertText('u');
            editor.insertText('t');
            editor.insertText('t');
            editor.insertText('o');
            editor.insertText('n');
            editor.insertText('-');
            editor.insertText('p');
            return advanceClock(completionDelay);
          });
          waitsFor(function() {
            return autocompleteManager.displaySuggestions.calls.length === 1;
          });
          waitsFor(function() {
            return editorView.querySelector('.autocomplete-plus li') != null;
          });
          return runs(function() {
            var popup;
            popup = editorView.querySelector('.autocomplete-plus');
            expect(popup).toExist();
            expect(popup.querySelector('span.word').textContent).toEqual('button-padding');
            return expect(popup.querySelector('span.right-label').textContent).toEqual('6px 8px');
          });
        });
      });
    });
  });

  describe('autocomplete provider', function() {
    var autocompleteMain, autocompleteManager, completionDelay, editor, editorView, jasmineContent, pigments, project, _ref;
    _ref = [], completionDelay = _ref[0], editor = _ref[1], editorView = _ref[2], pigments = _ref[3], autocompleteMain = _ref[4], autocompleteManager = _ref[5], jasmineContent = _ref[6], project = _ref[7];
    return describe('for sass files', function() {
      beforeEach(function() {
        runs(function() {
          var workspaceElement;
          jasmineContent = document.body.querySelector('#jasmine-content');
          atom.config.set('pigments.autocompleteScopes', ['*']);
          atom.config.set('pigments.sourceNames', ['**/*.sass', '**/*.scss']);
          atom.config.set('autocomplete-plus.enableAutoActivation', true);
          completionDelay = 100;
          atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
          completionDelay += 100;
          workspaceElement = atom.views.getView(atom.workspace);
          return jasmineContent.appendChild(workspaceElement);
        });
        waitsForPromise('autocomplete-plus activation', function() {
          return atom.packages.activatePackage('autocomplete-plus').then(function(pkg) {
            return autocompleteMain = pkg.mainModule;
          });
        });
        waitsForPromise('pigments activation', function() {
          return atom.packages.activatePackage('pigments').then(function(pkg) {
            return pigments = pkg.mainModule;
          });
        });
        runs(function() {
          spyOn(autocompleteMain, 'consumeProvider').andCallThrough();
          return spyOn(pigments, 'provideAutocomplete').andCallThrough();
        });
        waitsForPromise('open sample file', function() {
          return atom.workspace.open('sample.styl').then(function(e) {
            editor = e;
            return editorView = atom.views.getView(editor);
          });
        });
        waitsForPromise('pigments project initialized', function() {
          project = pigments.getProject();
          return project.initialize();
        });
        return runs(function() {
          autocompleteManager = autocompleteMain.autocompleteManager;
          spyOn(autocompleteManager, 'findSuggestions').andCallThrough();
          return spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
        });
      });
      return it('does not display the alternate sass version', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('$');
          editor.insertText('b');
          editor.insertText('a');
          return advanceClock(completionDelay);
        });
        waitsFor('suggestions displayed callback', function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor('autocomplete lis', function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          var hasAlternate, lis;
          lis = editorView.querySelectorAll('.autocomplete-plus li');
          hasAlternate = Array.prototype.some.call(lis, function(li) {
            return li.querySelector('span.word').textContent === '$base_color';
          });
          return expect(hasAlternate).toBeFalsy();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9waWdtZW50cy1wcm92aWRlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsRUFBQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFFBQUEsbUhBQUE7QUFBQSxJQUFBLE9BQWtILEVBQWxILEVBQUMseUJBQUQsRUFBa0IsZ0JBQWxCLEVBQTBCLG9CQUExQixFQUFzQyxrQkFBdEMsRUFBZ0QsMEJBQWhELEVBQWtFLDZCQUFsRSxFQUF1Rix3QkFBdkYsRUFBdUcsaUJBQXZHLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxZQUFBLGdCQUFBO0FBQUEsUUFBQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBZCxDQUE0QixrQkFBNUIsQ0FBakIsQ0FBQTtBQUFBLFFBRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixFQUErQyxDQUFDLEdBQUQsQ0FBL0MsQ0FGQSxDQUFBO0FBQUEsUUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLENBQ3RDLFdBRHNDLEVBRXRDLFdBRnNDLENBQXhDLENBSEEsQ0FBQTtBQUFBLFFBU0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixFQUEwRCxJQUExRCxDQVRBLENBQUE7QUFBQSxRQVdBLGVBQUEsR0FBa0IsR0FYbEIsQ0FBQTtBQUFBLFFBWUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVDQUFoQixFQUF5RCxlQUF6RCxDQVpBLENBQUE7QUFBQSxRQWFBLGVBQUEsSUFBbUIsR0FibkIsQ0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/pigments-provider-spec.coffee

(function() {
  var fs, helper, path, temp;

  fs = require('fs');

  path = require('path');

  temp = require('temp');

  helper = require('./spec-helper');

  describe('Tabs to Spaces', function() {
    var buffer, directory, editor, filePath, workspaceElement, _ref;
    _ref = [], buffer = _ref[0], directory = _ref[1], editor = _ref[2], filePath = _ref[3], workspaceElement = _ref[4];
    beforeEach(function() {
      directory = temp.mkdirSync();
      atom.project.setPaths(directory);
      workspaceElement = atom.views.getView(atom.workspace);
      filePath = path.join(directory, 'tabs-to-spaces.txt');
      fs.writeFileSync(filePath, '');
      atom.config.set('editor.tabLength', 4);
      waitsForPromise(function() {
        return atom.workspace.open(filePath).then(function(e) {
          return editor = e;
        });
      });
      runs(function() {
        return buffer = editor.getBuffer();
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('tabs-to-spaces');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
    });
    describe('activate', function() {
      return it('creates the commands', function() {
        expect(helper.hasCommand(workspaceElement, 'tabs-to-spaces:tabify')).toBeTruthy();
        expect(helper.hasCommand(workspaceElement, 'tabs-to-spaces:untabify')).toBeTruthy();
        return expect(helper.hasCommand(workspaceElement, 'tabs-to-spaces:untabify-all')).toBeTruthy();
      });
    });
    describe('deactivate', function() {
      beforeEach(function() {
        return atom.packages.deactivatePackage('tabs-to-spaces');
      });
      return it('destroys the commands', function() {
        expect(helper.hasCommand(workspaceElement, 'tabs-to-spaces:tabify')).toBeFalsy();
        expect(helper.hasCommand(workspaceElement, 'tabs-to-spaces:untabify')).toBeFalsy();
        return expect(helper.hasCommand(workspaceElement, 'tabs-to-spaces:untabify-all')).toBeFalsy();
      });
    });
    describe('tabify', function() {
      beforeEach(function() {
        return editor.setTabLength(3);
      });
      it('does not change an empty file', function() {
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:tabify');
        return expect(editor.getText()).toBe('');
      });
      it('does not change spaces at the end of a line', function() {
        buffer.setText('foobarbaz     ');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:tabify');
        return expect(editor.getText()).toBe('foobarbaz     ');
      });
      it('does not change spaces in the middle of a line', function() {
        buffer.setText('foo  bar  baz');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:tabify');
        return expect(editor.getText()).toBe('foo  bar  baz');
      });
      it('converts one tab worth of spaces to a tab', function() {
        editor.setTabLength(2);
        buffer.setText('  foo');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:tabify');
        return expect(editor.getText()).toBe('\tfoo');
      });
      it('converts almost two tabs worth of spaces to one tab and some spaces', function() {
        editor.setTabLength(4);
        buffer.setText('       foo');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:tabify');
        return expect(editor.getText()).toBe('\t   foo');
      });
      it('changes multiple lines of leading spaces to tabs', function() {
        editor.setTabLength(4);
        buffer.setText('    foo\n       bar');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:tabify');
        return expect(editor.getText()).toBe('\tfoo\n\t   bar');
      });
      it('leaves successive newlines alone', function() {
        editor.setTabLength(2);
        buffer.setText('  foo\n\n  bar\n\n  baz\n\n');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:tabify');
        return expect(editor.getText()).toBe('\tfoo\n\n\tbar\n\n\tbaz\n\n');
      });
      return it('changes mixed spaces and tabs to uniform whitespace', function() {
        editor.setTabLength(2);
        buffer.setText('\t \tfoo\n');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:tabify');
        return expect(editor.getText()).toBe('\t\t foo\n');
      });
    });
    describe('untabify', function() {
      beforeEach(function() {
        return editor.setTabLength(3);
      });
      it('does not change an empty file', function() {
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify');
        return expect(editor.getText()).toBe('');
      });
      it('does not change tabs at the end of a string', function() {
        buffer.setText('foobarbaz\t');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify');
        return expect(editor.getText()).toBe('foobarbaz\t');
      });
      it('does not change tabs in the middle of a string', function() {
        buffer.setText('foo\tbar\tbaz');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify');
        return expect(editor.getText()).toBe('foo\tbar\tbaz');
      });
      it('changes one tab to the correct number of spaces', function() {
        editor.setTabLength(2);
        buffer.setText('\tfoo');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify');
        return expect(editor.getText()).toBe('  foo');
      });
      it('changes two tabs to the correct number of spaces', function() {
        editor.setTabLength(2);
        buffer.setText('\t\tfoo');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify');
        return expect(editor.getText()).toBe('    foo');
      });
      it('changes multiple lines of leading tabs to spaces', function() {
        editor.setTabLength(2);
        buffer.setText('\t\tfoo\n\t\tbar\n\n');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify');
        return expect(editor.getText()).toBe('    foo\n    bar\n\n');
      });
      return it('changes mixed spaces and tabs to uniform whitespace', function() {
        editor.setTabLength(2);
        buffer.setText(' \t foo\n');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify');
        return expect(editor.getText()).toBe('    foo\n');
      });
    });
    describe('untabify all', function() {
      beforeEach(function() {
        return editor.setTabLength(3);
      });
      it('does not change an empty file', function() {
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify-all');
        return expect(editor.getText()).toBe('');
      });
      it('does change tabs at the end of a string', function() {
        buffer.setText('foobarbaz\t');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify-all');
        return expect(editor.getText()).toBe('foobarbaz   ');
      });
      it('does change tabs in the middle of a string', function() {
        buffer.setText('foo\tbar\tbaz');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify-all');
        return expect(editor.getText()).toBe('foo   bar   baz');
      });
      it('changes one tab to the correct number of spaces', function() {
        editor.setTabLength(2);
        buffer.setText('\tfoo');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify-all');
        return expect(editor.getText()).toBe('  foo');
      });
      it('changes two tabs to the correct number of spaces', function() {
        editor.setTabLength(2);
        buffer.setText('\t\tfoo');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify-all');
        return expect(editor.getText()).toBe('    foo');
      });
      it('changes multiple lines of leading tabs to spaces', function() {
        editor.setTabLength(2);
        buffer.setText('\t\tfoo\n\t\tbar\n\n');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify-all');
        return expect(editor.getText()).toBe('    foo\n    bar\n\n');
      });
      return it('changes mixed spaces and tabs to uniform whitespace', function() {
        editor.setTabLength(2);
        buffer.setText(' \t foo\n');
        atom.commands.dispatch(workspaceElement, 'tabs-to-spaces:untabify-all');
        return expect(editor.getText()).toBe('    foo\n');
      });
    });
    return describe('on save', function() {
      beforeEach(function() {
        return atom.config.set('tabs-to-spaces.onSave', 'none');
      });
      it('will untabify before an editor saves a buffer', function() {
        atom.config.set('tabs-to-spaces.onSave', 'untabify');
        buffer.setText('\t\tfoo\n\t\tbar\n\n');
        editor.save();
        return expect(editor.getText()).toBe('        foo\n        bar\n\n');
      });
      it('will tabify before an editor saves a buffer', function() {
        atom.config.set('tabs-to-spaces.onSave', 'tabify');
        buffer.setText('        foo\n        bar\n\n');
        editor.save();
        return expect(editor.getText()).toBe('\t\tfoo\n\t\tbar\n\n');
      });
      return describe('with scope-specific configuration', function() {
        beforeEach(function() {
          atom.config.set('editor.tabLength', 2, {
            scope: '.text.plain'
          });
          atom.config.set('tabs-to-spaces.onSave', 'tabify', {
            scope: '.text.plain'
          });
          filePath = path.join(directory, 'sample.txt');
          fs.writeFileSync(filePath, 'Some text.\n');
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function(e) {
              return editor = e;
            });
          });
          return runs(function() {
            return buffer = editor.getBuffer();
          });
        });
        it('respects the overridden configuration', function() {
          buffer.setText('    foo\n    bar\n\n');
          editor.save();
          return expect(editor.getText()).toBe('\t\tfoo\n\t\tbar\n\n');
        });
        return it('does not modify the contents of the user configuration file', function() {
          spyOn(atom.config, 'getUserConfigPath').andReturn(filePath);
          spyOn(editor, 'getPath').andReturn(filePath);
          buffer.setText('    foo\n    bar\n\n');
          editor.save();
          return expect(editor.getText()).toBe('    foo\n    bar\n\n');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvdGFicy10by1zcGFjZXMvc3BlYy90YWJzLXRvLXNwYWNlcy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBa0IsT0FBQSxDQUFRLElBQVIsQ0FBbEIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBa0IsT0FBQSxDQUFRLE1BQVIsQ0FEbEIsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBa0IsT0FBQSxDQUFRLE1BQVIsQ0FGbEIsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQUpULENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsMkRBQUE7QUFBQSxJQUFBLE9BQTBELEVBQTFELEVBQUMsZ0JBQUQsRUFBUyxtQkFBVCxFQUFvQixnQkFBcEIsRUFBNEIsa0JBQTVCLEVBQXNDLDBCQUF0QyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUFaLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixTQUF0QixDQURBLENBQUE7QUFBQSxNQUVBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FGbkIsQ0FBQTtBQUFBLE1BR0EsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixvQkFBckIsQ0FIWCxDQUFBO0FBQUEsTUFJQSxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQixFQUEzQixDQUpBLENBQUE7QUFBQSxNQUtB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/tabs-to-spaces/spec/tabs-to-spaces-spec.coffee

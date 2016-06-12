(function() {
  var TabsToSpaces, fs, helper, path, temp;

  fs = require('fs');

  path = require('path');

  temp = require('temp');

  TabsToSpaces = require('../lib/tabs-to-spaces');

  helper = require('./spec-helper');

  describe('Tabs to Spaces', function() {
    var directory, editor, filePath, workspaceElement, _ref;
    _ref = [], directory = _ref[0], editor = _ref[1], filePath = _ref[2], workspaceElement = _ref[3];
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
        TabsToSpaces.tabify(editor);
        return expect(editor.getText()).toBe('');
      });
      it('does not change spaces at the end of a line', function() {
        editor.setText('foobarbaz     ');
        TabsToSpaces.tabify(editor);
        return expect(editor.getText()).toBe('foobarbaz     ');
      });
      it('does not change spaces in the middle of a line', function() {
        editor.setText('foo  bar  baz');
        TabsToSpaces.tabify(editor);
        return expect(editor.getText()).toBe('foo  bar  baz');
      });
      it('converts one tab worth of spaces to a tab', function() {
        editor.setTabLength(2);
        editor.setText('  foo');
        TabsToSpaces.tabify(editor);
        return expect(editor.getText()).toBe('\tfoo');
      });
      it('converts almost two tabs worth of spaces to one tab and some spaces', function() {
        editor.setTabLength(4);
        editor.setText('       foo');
        TabsToSpaces.tabify(editor);
        return expect(editor.getText()).toBe('\t   foo');
      });
      it('changes multiple lines of leading spaces to tabs', function() {
        editor.setTabLength(4);
        editor.setText('    foo\n       bar');
        TabsToSpaces.tabify(editor);
        return expect(editor.getText()).toBe('\tfoo\n\t   bar');
      });
      it('leaves successive newlines alone', function() {
        editor.setTabLength(2);
        editor.setText('  foo\n\n  bar\n\n  baz\n\n');
        TabsToSpaces.tabify(editor);
        return expect(editor.getText()).toBe('\tfoo\n\n\tbar\n\n\tbaz\n\n');
      });
      return it('changes mixed spaces and tabs to uniform whitespace', function() {
        editor.setTabLength(2);
        editor.setText('\t \tfoo\n');
        TabsToSpaces.tabify(editor);
        return expect(editor.getText()).toBe('\t\t foo\n');
      });
    });
    describe('untabify', function() {
      beforeEach(function() {
        return editor.setTabLength(3);
      });
      it('does not change an empty file', function() {
        TabsToSpaces.untabify(editor);
        return expect(editor.getText()).toBe('');
      });
      it('does not change tabs at the end of a string', function() {
        editor.setText('foobarbaz\t');
        TabsToSpaces.untabify(editor);
        return expect(editor.getText()).toBe('foobarbaz\t');
      });
      it('does not change tabs in the middle of a string', function() {
        editor.setText('foo\tbar\tbaz');
        TabsToSpaces.untabify(editor);
        return expect(editor.getText()).toBe('foo\tbar\tbaz');
      });
      it('changes one tab to the correct number of spaces', function() {
        editor.setTabLength(2);
        editor.setText('\tfoo');
        TabsToSpaces.untabify(editor);
        return expect(editor.getText()).toBe('  foo');
      });
      it('changes two tabs to the correct number of spaces', function() {
        editor.setTabLength(2);
        editor.setText('\t\tfoo');
        TabsToSpaces.untabify(editor);
        return expect(editor.getText()).toBe('    foo');
      });
      it('changes multiple lines of leading tabs to spaces', function() {
        editor.setTabLength(2);
        editor.setText('\t\tfoo\n\t\tbar\n\n');
        TabsToSpaces.untabify(editor);
        return expect(editor.getText()).toBe('    foo\n    bar\n\n');
      });
      return it('changes mixed spaces and tabs to uniform whitespace', function() {
        editor.setTabLength(2);
        editor.setText(' \t foo\n');
        TabsToSpaces.untabify(editor);
        return expect(editor.getText()).toBe('    foo\n');
      });
    });
    describe('untabify all', function() {
      beforeEach(function() {
        return editor.setTabLength(3);
      });
      it('does not change an empty file', function() {
        TabsToSpaces.untabifyAll(editor);
        return expect(editor.getText()).toBe('');
      });
      it('does change tabs at the end of a string', function() {
        editor.setText('foobarbaz\t');
        TabsToSpaces.untabifyAll(editor);
        return expect(editor.getText()).toBe('foobarbaz   ');
      });
      it('does change tabs in the middle of a string', function() {
        editor.setText('foo\tbar\tbaz');
        TabsToSpaces.untabifyAll(editor);
        return expect(editor.getText()).toBe('foo   bar   baz');
      });
      it('changes one tab to the correct number of spaces', function() {
        editor.setTabLength(2);
        editor.setText('\tfoo');
        TabsToSpaces.untabifyAll(editor);
        return expect(editor.getText()).toBe('  foo');
      });
      it('changes two tabs to the correct number of spaces', function() {
        editor.setTabLength(2);
        editor.setText('\t\tfoo');
        TabsToSpaces.untabifyAll(editor);
        return expect(editor.getText()).toBe('    foo');
      });
      it('changes multiple lines of leading tabs to spaces', function() {
        editor.setTabLength(2);
        editor.setText('\t\tfoo\n\t\tbar\n\n');
        TabsToSpaces.untabifyAll(editor);
        return expect(editor.getText()).toBe('    foo\n    bar\n\n');
      });
      return it('changes mixed spaces and tabs to uniform whitespace', function() {
        editor.setTabLength(2);
        editor.setText(' \t foo\n');
        TabsToSpaces.untabifyAll(editor);
        return expect(editor.getText()).toBe('    foo\n');
      });
    });
    describe('on save', function() {
      beforeEach(function() {
        return atom.config.set('tabs-to-spaces.onSave', 'none');
      });
      it('will untabify before an editor saves a buffer', function() {
        atom.config.set('tabs-to-spaces.onSave', 'untabify');
        editor.setText('\t\tfoo\n\t\tbar\n\n');
        editor.save();
        return expect(editor.getText()).toBe('        foo\n        bar\n\n');
      });
      it('will tabify before an editor saves a buffer', function() {
        atom.config.set('tabs-to-spaces.onSave', 'tabify');
        editor.setText('        foo\n        bar\n\n');
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
            var buffer;
            return buffer = editor.getBuffer();
          });
        });
        it('respects the overridden configuration', function() {
          editor.setText('    foo\n    bar\n\n');
          editor.save();
          return expect(editor.getText()).toBe('\t\tfoo\n\t\tbar\n\n');
        });
        return it('does not modify the contents of the user configuration file', function() {
          spyOn(atom.config, 'getUserConfigPath').andReturn(filePath);
          spyOn(editor, 'getPath').andReturn(filePath);
          editor.setText('    foo\n    bar\n\n');
          editor.save();
          return expect(editor.getText()).toBe('    foo\n    bar\n\n');
        });
      });
    });
    return describe('invariants', function() {
      beforeEach(function() {
        return editor.setText(fs.readFileSync(__filename, 'utf8'));
      });
      return it('does not move the position of the cursor', function() {
        var pos;
        editor.setCursorBufferPosition([0, 5]);
        TabsToSpaces.tabify(editor);
        TabsToSpaces.untabify(editor);
        pos = editor.getCursorBufferPosition();
        expect(pos.row).toBe(0);
        return expect(pos.column).toBe(5);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvdGFicy10by1zcGFjZXMvc3BlYy90YWJzLXRvLXNwYWNlcy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvQ0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLFlBQUEsR0FBZSxPQUFBLENBQVEsdUJBQVIsQ0FKZixDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxlQUFSLENBTlQsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSxtREFBQTtBQUFBLElBQUEsT0FBa0QsRUFBbEQsRUFBQyxtQkFBRCxFQUFZLGdCQUFaLEVBQW9CLGtCQUFwQixFQUE4QiwwQkFBOUIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FBWixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsU0FBdEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBRm5CLENBQUE7QUFBQSxNQUdBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsb0JBQXJCLENBSFgsQ0FBQTtBQUFBLE1BSUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/tabs-to-spaces/spec/tabs-to-spaces-spec.coffee

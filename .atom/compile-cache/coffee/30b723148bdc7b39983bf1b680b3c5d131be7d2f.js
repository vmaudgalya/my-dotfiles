(function() {
  var AutoIndent, Point, Range, fs, path, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  fs = require('fs-plus');

  path = require('path');

  AutoIndent = require('../lib/auto-indent');

  describe('auto-indent', function() {
    var autoIndent, editor, notifications, sourceCode, sourceCodeRange, _ref1;
    _ref1 = [], autoIndent = _ref1[0], editor = _ref1[1], notifications = _ref1[2], sourceCode = _ref1[3], sourceCodeRange = _ref1[4];
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-babel');
      });
    });
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('non-existent.js').then(function(o) {
          return editor = o;
        });
      });
      return runs(function() {
        autoIndent = new AutoIndent(editor);
        return notifications = atom.notifications;
      });
    });
    describe('::constructor', function() {
      return it(' should setup some valid indentation defaults', function() {
        var expectedResult;
        expectedResult = {
          jsxIndent: [1, 1],
          jsxIndentProps: [1, 1],
          jsxClosingBracketLocation: [
            1, {
              selfClosing: 'tag-aligned',
              nonEmpty: 'tag-aligned'
            }
          ]
        };
        return expect(autoIndent.eslintIndentOptions).toEqual(expectedResult);
      });
    });
    describe('::getEslintrcFilename', function() {
      it('returns a correct project path for the source file', function() {
        return expect(path.dirname(autoIndent.getEslintrcFilename())).toEqual(path.dirname(editor.getPath()));
      });
      return it('returns a .eslintrc file name', function() {
        return expect(path.basename(autoIndent.getEslintrcFilename())).toEqual('.eslintrc');
      });
    });
    return describe('::readEslintrcOptions', function() {
      it('returns an empty object on a missing .eslintrc', function() {
        return expect(autoIndent.readEslintrcOptions('.missing')).toEqual({});
      });
      it('returns and empty Object and a notification message on bad eslint', function() {
        var obj;
        spyOn(fs, 'existsSync').andReturn(true);
        spyOn(fs, 'readFileSync').andReturn('{');
        spyOn(notifications, 'addError').andCallThrough();
        obj = autoIndent.readEslintrcOptions();
        expect(notifications.addError).toHaveBeenCalled();
        return expect(obj).toEqual({});
      });
      it('returns an empty Object when eslint with no rules is read', function() {
        var obj;
        spyOn(fs, 'existsSync').andReturn(true);
        spyOn(fs, 'readFileSync').andReturn('{}');
        spyOn(notifications, 'addError').andCallThrough();
        obj = autoIndent.readEslintrcOptions();
        expect(notifications.addError).not.toHaveBeenCalled();
        return expect(obj).toEqual({});
      });
      describe('::translateIndentOptions', function() {
        it('should return expected defaults when no object is input', function() {
          var expectedResult, result;
          result = autoIndent.translateIndentOptions();
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return expected defaults when no valid object is input', function() {
          var expectedResult, result;
          result = autoIndent.translateIndentOptions({});
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return two tab markers for jsx and props when an indent of 4 spaces is found', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return one tab markers for jsx and props when an indent "tab" is found', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, "tab"]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 3', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [1, 3],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 2', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 2, line-aligned', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4],
            'react/jsx-closing-bracket-location': [1, 'line-aligned']
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'line-aligned',
                nonEmpty: 'line-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        return it('should return jsxIndent of 2 tabs and jsxIndentProps of 2, line-aligned and props-aligned', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4],
            "react/jsx-closing-bracket-location": [
              1, {
                "nonEmpty": "props-aligned",
                "selfClosing": "line-aligned"
              }
            ]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'line-aligned',
                nonEmpty: 'props-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
      });
      describe('::indentJSX', function() {
        beforeEach(function() {
          sourceCode = "<div className={rootClass}>\n{this._renderPlaceholder()}\n<div\nclassName={cx('DraftEditor/editorContainer')}\nkey={'editor' + this.state.containerKey}\nref=\"editorContainer\"\n>\n<div\naria-activedescendant={\nreadOnly ? null : this.props.ariaActiveDescendantID\n}\naria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n>\n{this._renderPlaceholder()}\n<Component p1\np2\n/>\n</div>\n</div>\n</div>";
          editor.insertText(sourceCode);
          return sourceCodeRange = new Range(new Point(0, 0), new Point(19, 6));
        });
        it('should indent JSX according to eslint rules', function() {
          var indentedCode;
          indentedCode = "<div className={rootClass}>\n    {this._renderPlaceholder()}\n    <div\n        className={cx('DraftEditor/editorContainer')}\n        key={'editor' + this.state.containerKey}\n        ref=\"editorContainer\"\n    >\n        <div\n            aria-activedescendant={\n                readOnly ? null : this.props.ariaActiveDescendantID\n            }\n            aria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n        >\n            {this._renderPlaceholder()}\n            <Component p1\n                p2\n            />\n        </div>\n    </div>\n</div>";
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          autoIndent.indentJSX(sourceCodeRange);
          return expect(editor.getTextInBufferRange(sourceCodeRange)).toEqual(indentedCode);
        });
        return it('should indent JSX according to eslint rules and tag closing alignment', function() {
          var indentedCode;
          indentedCode = "<div className={rootClass}>\n    {this._renderPlaceholder()}\n    <div\n        className={cx('DraftEditor/editorContainer')}\n        key={'editor' + this.state.containerKey}\n        ref=\"editorContainer\"\n        >\n        <div\n            aria-activedescendant={\n                readOnly ? null : this.props.ariaActiveDescendantID\n            }\n            aria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n            >\n            {this._renderPlaceholder()}\n            <Component p1\n                p2\n                />\n        </div>\n    </div>\n</div>";
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'props-aligned',
                nonEmpty: 'props-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          autoIndent.indentJSX(sourceCodeRange);
          return expect(editor.getTextInBufferRange(sourceCodeRange)).toEqual(indentedCode);
        });
      });
      return describe('insert-nl-jsx', function() {
        return it('should insert two new lines and position cursor between JSX tags', function() {
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tabs-aligned',
                nonEmpty: 'tabs-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          editor.insertText('<div></div>');
          editor.setCursorBufferPosition([0, 5]);
          editor.insertText('\n');
          expect(editor.getTextInBufferRange([[0, 0], [0, 5]])).toEqual("<div>");
          expect(editor.getTextInBufferRange([[1, 0], [1, 2]])).toEqual("  ");
          expect(editor.getTextInBufferRange([[2, 0], [2, 6]])).toEqual("</div>");
          return expect(editor.getCursorBufferPosition()).toEqual([1, 2]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvc3BlYy9hdXRvLWluZGVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUVBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUFSLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsb0JBQVIsQ0FIYixDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEscUVBQUE7QUFBQSxJQUFBLFFBQW1FLEVBQW5FLEVBQUMscUJBQUQsRUFBYSxpQkFBYixFQUFxQix3QkFBckIsRUFBb0MscUJBQXBDLEVBQWdELDBCQUFoRCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZ0JBQTlCLEVBRGM7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQU1BLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGlCQUFwQixDQUFzQyxDQUFDLElBQXZDLENBQTRDLFNBQUMsQ0FBRCxHQUFBO2lCQUFPLE1BQUEsR0FBUyxFQUFoQjtRQUFBLENBQTVDLEVBRGM7TUFBQSxDQUFoQixDQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/spec/auto-indent-spec.coffee

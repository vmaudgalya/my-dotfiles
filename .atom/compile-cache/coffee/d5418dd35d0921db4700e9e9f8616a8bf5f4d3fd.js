(function() {
  var AFTERPROPS, AutoIndent, BRACE_CLOSE, BRACE_OPEN, CompositeDisposable, File, InsertNlJsx, JSXBRACE_CLOSE, JSXBRACE_OPEN, JSXTAG_CLOSE, JSXTAG_CLOSE_ATTRS, JSXTAG_OPEN, JSXTAG_SELFCLOSE_END, JSXTAG_SELFCLOSE_START, LINEALIGNED, NO_TOKEN, PROPSALIGNED, Point, Range, TAGALIGNED, TERNARY_ELSE, TERNARY_IF, YAML, autoCompleteJSX, fs, path, stripJsonComments, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, File = _ref.File, Range = _ref.Range, Point = _ref.Point;

  fs = require('fs-plus');

  path = require('path');

  autoCompleteJSX = require('./auto-complete-jsx');

  InsertNlJsx = require('./insert-nl-jsx');

  stripJsonComments = require('strip-json-comments');

  YAML = require('js-yaml');

  NO_TOKEN = 0;

  JSXTAG_SELFCLOSE_START = 1;

  JSXTAG_SELFCLOSE_END = 2;

  JSXTAG_OPEN = 3;

  JSXTAG_CLOSE_ATTRS = 4;

  JSXTAG_CLOSE = 5;

  JSXBRACE_OPEN = 6;

  JSXBRACE_CLOSE = 7;

  BRACE_OPEN = 8;

  BRACE_CLOSE = 9;

  TERNARY_IF = 10;

  TERNARY_ELSE = 11;

  TAGALIGNED = 'tag-aligned';

  LINEALIGNED = 'line-aligned';

  AFTERPROPS = 'after-props';

  PROPSALIGNED = 'props-aligned';

  module.exports = AutoIndent = (function() {
    function AutoIndent(editor) {
      this.editor = editor;
      this.onMouseUp = __bind(this.onMouseUp, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.changedCursorPosition = __bind(this.changedCursorPosition, this);
      this.insertNlJsx = new InsertNlJsx(this.editor);
      this.autoJsx = atom.config.get('language-babel').autoIndentJSX;
      this.JSXREGEXP = /(<)([$_A-Za-z](?:[$_.:\-A-Za-z0-9])*)|(\/>)|(<\/)([$_A-Za-z](?:[$._:\-A-Za-z0-9])*)(>)|(>)|({)|(})|(\?)|(:)/g;
      this.mouseUp = true;
      this.multipleCursorTrigger = 1;
      this.disposables = new CompositeDisposable();
      this.eslintIndentOptions = this.getIndentOptions();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:auto-indent-jsx-on': (function(_this) {
          return function(event) {
            _this.autoJsx = true;
            return _this.eslintIndentOptions = _this.getIndentOptions();
          };
        })(this)
      }));
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:auto-indent-jsx-off': (function(_this) {
          return function(event) {
            return _this.autoJsx = false;
          };
        })(this)
      }));
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:toggle-auto-indent-jsx': (function(_this) {
          return function(event) {
            _this.autoJsx = !_this.autoJsx;
            if (_this.autoJsx) {
              return _this.eslintIndentOptions = _this.getIndentOptions();
            }
          };
        })(this)
      }));
      document.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mouseup', this.onMouseUp);
      this.disposables.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(event) {
          return _this.changedCursorPosition(event);
        };
      })(this)));
      this.disposables.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          return _this.didStopChanging();
        };
      })(this)));
    }

    AutoIndent.prototype.destroy = function() {
      this.disposables.dispose();
      document.removeEventListener('mousedown', this.onMouseDown);
      return document.removeEventListener('mouseup', this.onMouseUp);
    };

    AutoIndent.prototype.changedCursorPosition = function(event) {
      var blankLineEndPos, bufferRow, columnToMoveTo, cursorPosition, cursorPositions, endPointOfJsx, previousRow, startPointOfJsx, _i, _len, _ref1, _ref2;
      if (!this.autoJsx) {
        return;
      }
      if (!this.mouseUp) {
        return;
      }
      if (event.oldBufferPosition.row === event.newBufferPosition.row) {
        return;
      }
      bufferRow = event.newBufferPosition.row;
      if (this.editor.hasMultipleCursors()) {
        cursorPositions = this.editor.getCursorBufferPositions();
        if (cursorPositions.length === this.multipleCursorTrigger) {
          this.multipleCursorTrigger = 1;
          bufferRow = 0;
          for (_i = 0, _len = cursorPositions.length; _i < _len; _i++) {
            cursorPosition = cursorPositions[_i];
            if (cursorPosition.row > bufferRow) {
              bufferRow = cursorPosition.row;
            }
          }
        } else {
          this.multipleCursorTrigger++;
          return;
        }
      } else {
        cursorPosition = event.newBufferPosition;
      }
      previousRow = event.oldBufferPosition.row;
      if (this.jsxInScope(previousRow)) {
        blankLineEndPos = (_ref1 = /^\s*$/.exec(this.editor.lineTextForBufferRow(previousRow))) != null ? _ref1[0].length : void 0;
        if (blankLineEndPos != null) {
          this.indentRow({
            row: previousRow,
            blockIndent: 0
          });
        }
      }
      if (!this.jsxInScope(bufferRow)) {
        return;
      }
      endPointOfJsx = new Point(bufferRow, 0);
      startPointOfJsx = autoCompleteJSX.getStartOfJSX(this.editor, cursorPosition);
      this.indentJSX(new Range(startPointOfJsx, endPointOfJsx));
      columnToMoveTo = (_ref2 = /^\s*$/.exec(this.editor.lineTextForBufferRow(bufferRow))) != null ? _ref2[0].length : void 0;
      if (columnToMoveTo != null) {
        return this.editor.setCursorBufferPosition([bufferRow, columnToMoveTo]);
      }
    };

    AutoIndent.prototype.didStopChanging = function() {
      var endPointOfJsx, highestRow, selectedRange, startPointOfJsx;
      if (!this.autoJsx) {
        return;
      }
      if (!this.mouseUp) {
        return;
      }
      selectedRange = this.editor.getSelectedBufferRange();
      if (selectedRange.start.row === selectedRange.end.row && selectedRange.start.column === selectedRange.end.column && __indexOf.call(this.editor.scopeDescriptorForBufferPosition([selectedRange.start.row, selectedRange.start.column]).getScopesArray(), 'JSXStartTagEnd') >= 0) {
        return;
      }
      highestRow = Math.max(selectedRange.start.row, selectedRange.end.row);
      if (this.jsxInScope(highestRow)) {
        endPointOfJsx = new Point(highestRow, 0);
        startPointOfJsx = autoCompleteJSX.getStartOfJSX(this.editor, endPointOfJsx);
        return this.indentJSX(new Range(startPointOfJsx, endPointOfJsx));
      }
    };

    AutoIndent.prototype.jsxInScope = function(bufferRow) {
      var scopes;
      scopes = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]).getScopesArray();
      return __indexOf.call(scopes, 'meta.tag.jsx') >= 0;
    };

    AutoIndent.prototype.indentJSX = function(range) {
      var blankLineEndPos, firstCharIndentation, firstTagInLineIndentation, idxOfToken, indent, indentRecalc, isFirstTagOfBlock, isFirstTokenOfLine, line, match, matchColumn, matchPointEnd, matchPointStart, matchRange, parentTokenIdx, row, stackOfTokensStillOpen, tagIndentation, token, tokenOnThisLine, tokenStack, _i, _ref1, _ref2, _ref3, _results;
      tokenStack = [];
      idxOfToken = 0;
      stackOfTokensStillOpen = [];
      indent = 0;
      isFirstTagOfBlock = true;
      this.JSXREGEXP.lastIndex = 0;
      _results = [];
      for (row = _i = _ref1 = range.start.row, _ref2 = range.end.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; row = _ref1 <= _ref2 ? ++_i : --_i) {
        isFirstTokenOfLine = true;
        tokenOnThisLine = false;
        indentRecalc = false;
        line = this.editor.lineTextForBufferRow(row);
        while ((match = this.JSXREGEXP.exec(line)) !== null) {
          matchColumn = match.index;
          matchPointStart = new Point(row, matchColumn);
          matchPointEnd = new Point(row, matchColumn + match[0].length - 1);
          matchRange = new Range(matchPointStart, matchPointEnd);
          if (!(token = this.getToken(row, match))) {
            continue;
          }
          firstCharIndentation = this.editor.indentationForBufferRow(row);
          if (this.editor.getSoftTabs()) {
            tagIndentation = matchColumn / this.editor.getTabLength();
          } else {
            tagIndentation = (function() {
              var hardTabsFound, i, _j;
              hardTabsFound = 0;
              for (i = _j = 0; 0 <= matchColumn ? _j < matchColumn : _j > matchColumn; i = 0 <= matchColumn ? ++_j : --_j) {
                hardTabsFound += (line.substr(i, 1)) === '\t';
              }
              return hardTabsFound;
            })();
          }
          if (isFirstTokenOfLine) {
            firstTagInLineIndentation = tagIndentation;
          }
          switch (token) {
            case JSXTAG_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (isFirstTagOfBlock && (parentTokenIdx != null) && tokenStack[parentTokenIdx].type === BRACE_OPEN && tokenStack[parentTokenIdx].row === (row - 1)) {
                  tagIndentation = firstCharIndentation = firstTagInLineIndentation = this.eslintIndentOptions.jsxIndent[1] + this.getIndentOfPreviousRow(row);
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: firstCharIndentation
                  });
                } else if (isFirstTagOfBlock && (parentTokenIdx != null)) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: this.getIndentOfPreviousRow(row),
                    jsxIndent: 1
                  });
                } else if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                    jsxIndent: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              isFirstTagOfBlock = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXTAG_OPEN,
                name: match[2],
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tagIndentation: tagIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case JSXTAG_CLOSE:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                indentRecalc = this.indentRow({
                  row: row,
                  blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                });
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              isFirstTagOfBlock = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXTAG_CLOSE,
                name: match[5],
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXTAG_SELFCLOSE_END:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (firstTagInLineIndentation === firstCharIndentation) {
                  indentRecalc = this.indentForClosingBracket(row, tokenStack[parentTokenIdx], this.eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing);
                } else {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstTagInLineIndentation,
                    jsxIndentProps: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXTAG_SELFCLOSE_END,
                name: tokenStack[parentTokenIdx].name,
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagsAttributesIdx = idxOfToken;
                tokenStack[parentTokenIdx].type = JSXTAG_SELFCLOSE_START;
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXTAG_CLOSE_ATTRS:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (firstTagInLineIndentation === firstCharIndentation) {
                  indentRecalc = this.indentForClosingBracket(row, tokenStack[parentTokenIdx], this.eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty);
                } else {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstTagInLineIndentation,
                    jsxIndentProps: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXTAG_CLOSE_ATTRS,
                name: tokenStack[parentTokenIdx].name,
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagsAttributesIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXBRACE_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (parentTokenIdx != null) {
                  if (tokenStack[parentTokenIdx].type === JSXTAG_OPEN && tokenStack[parentTokenIdx].termsThisTagsAttributesIdx === null) {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                      jsxIndentProps: 1
                    });
                  } else {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                      jsxIndent: 1
                    });
                  }
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = true;
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXBRACE_OPEN,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tagIndentation: tagIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case JSXBRACE_CLOSE:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                indentRecalc = this.indentRow({
                  row: row,
                  blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                });
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXBRACE_CLOSE,
                name: '',
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case BRACE_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (isFirstTagOfBlock && (parentTokenIdx != null) && tokenStack[parentTokenIdx].type === BRACE_OPEN && tokenStack[parentTokenIdx].row === (row - 1)) {
                  tagIndentation = firstCharIndentation = this.eslintIndentOptions.jsxIndent[1] + this.getIndentOfPreviousRow(row);
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: firstCharIndentation
                  });
                } else if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                    jsxIndent: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: BRACE_OPEN,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tagIndentation: tagIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case BRACE_CLOSE:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              if (parentTokenIdx != null) {
                tokenStack.push({
                  type: BRACE_CLOSE,
                  name: '',
                  row: row,
                  parentTokenIdx: parentTokenIdx
                });
                if (parentTokenIdx >= 0) {
                  tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
                }
                idxOfToken++;
              }
              break;
            case TERNARY_IF:
            case TERNARY_ELSE:
              isFirstTagOfBlock = true;
          }
        }
        if (idxOfToken && !tokenOnThisLine) {
          if (row !== range.end.row) {
            blankLineEndPos = (_ref3 = /^\s*$/.exec(this.editor.lineTextForBufferRow(row))) != null ? _ref3[0].length : void 0;
            if (blankLineEndPos != null) {
              _results.push(this.indentRow({
                row: row,
                blockIndent: 0
              }));
            } else {
              _results.push(this.indentUntokenisedLine(row, tokenStack, stackOfTokensStillOpen));
            }
          } else {
            _results.push(this.indentUntokenisedLine(row, tokenStack, stackOfTokensStillOpen));
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AutoIndent.prototype.indentUntokenisedLine = function(row, tokenStack, stackOfTokensStillOpen) {
      var parentTokenIdx, token;
      stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
      token = tokenStack[parentTokenIdx];
      switch (token.type) {
        case JSXTAG_OPEN:
        case JSXTAG_SELFCLOSE_START:
          if (token.termsThisTagsAttributesIdx === null) {
            return this.indentRow({
              row: row,
              blockIndent: token.firstCharIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: token.firstCharIndentation,
              jsxIndent: 1
            });
          }
          break;
        case JSXBRACE_OPEN:
          return this.indentRow({
            row: row,
            blockIndent: token.firstCharIndentation,
            jsxIndent: 1
          });
        case BRACE_OPEN:
          return this.indentRow({
            row: row,
            blockIndent: token.firstCharIndentation,
            jsxIndent: 1
          });
        case JSXTAG_SELFCLOSE_END:
        case JSXBRACE_CLOSE:
        case JSXTAG_CLOSE_ATTRS:
          return this.indentRow({
            row: row,
            blockIndent: tokenStack[token.parentTokenIdx].firstCharIndentation,
            jsxIndentProps: 1
          });
        case BRACE_CLOSE:
          return this.indentRow({
            row: row,
            blockIndent: tokenStack[token.parentTokenIdx].firstCharIndentation,
            jsxIndent: 1
          });
      }
    };

    AutoIndent.prototype.getToken = function(bufferRow, match) {
      var scope;
      scope = this.editor.scopeDescriptorForBufferPosition([bufferRow, match.index]).getScopesArray().pop();
      if ('punctuation.definition.tag.jsx' === scope) {
        if (match[1] != null) {
          return JSXTAG_OPEN;
        } else if (match[3] != null) {
          return JSXTAG_SELFCLOSE_END;
        }
      } else if ('JSXEndTagStart' === scope) {
        if (match[4] != null) {
          return JSXTAG_CLOSE;
        }
      } else if ('JSXStartTagEnd' === scope) {
        if (match[7] != null) {
          return JSXTAG_CLOSE_ATTRS;
        }
      } else if (match[8] != null) {
        if ('punctuation.section.embedded.begin.jsx' === scope) {
          return JSXBRACE_OPEN;
        } else if ('meta.brace.curly.js' === scope) {
          return BRACE_OPEN;
        }
      } else if (match[9] != null) {
        if ('punctuation.section.embedded.end.jsx' === scope) {
          return JSXBRACE_CLOSE;
        } else if ('meta.brace.curly.js' === scope) {
          return BRACE_CLOSE;
        }
      } else if (match[10] != null) {
        if ('keyword.operator.ternary.js' === scope) {
          return TERNARY_IF;
        }
      } else if (match[11] != null) {
        if ('keyword.operator.ternary.js' === scope) {
          return TERNARY_ELSE;
        }
      }
      return NO_TOKEN;
    };

    AutoIndent.prototype.getIndentOfPreviousRow = function(row) {
      var line, _i, _ref1;
      if (!row) {
        return 0;
      }
      for (row = _i = _ref1 = row - 1; _ref1 <= 0 ? _i < 0 : _i > 0; row = _ref1 <= 0 ? ++_i : --_i) {
        line = this.editor.lineTextForBufferRow(row);
        if (/.*\S/.test(line)) {
          return this.editor.indentationForBufferRow(row);
        }
      }
      return 0;
    };

    AutoIndent.prototype.getIndentOptions = function() {
      var eslintrcFilename;
      if (!this.autoJsx) {
        return this.translateIndentOptions();
      }
      if (eslintrcFilename = this.getEslintrcFilename()) {
        eslintrcFilename = new File(eslintrcFilename);
        return this.translateIndentOptions(this.readEslintrcOptions(eslintrcFilename.getPath()));
      } else {
        return this.translateIndentOptions({});
      }
    };

    AutoIndent.prototype.getEslintrcFilename = function() {
      var projectContainingSource;
      projectContainingSource = atom.project.relativizePath(this.editor.getPath());
      if (projectContainingSource[0] != null) {
        return path.join(projectContainingSource[0], '.eslintrc');
      }
    };

    AutoIndent.prototype.onMouseDown = function() {
      return this.mouseUp = false;
    };

    AutoIndent.prototype.onMouseUp = function() {
      return this.mouseUp = true;
    };

    AutoIndent.prototype.readEslintrcOptions = function(eslintrcFile) {
      var err, eslintRules, fileContent;
      if (fs.existsSync(eslintrcFile)) {
        fileContent = stripJsonComments(fs.readFileSync(eslintrcFile, 'utf8'));
        try {
          eslintRules = (YAML.safeLoad(fileContent)).rules;
          if (eslintRules) {
            return eslintRules;
          }
        } catch (_error) {
          err = _error;
          atom.notifications.addError("LB: Error reading .eslintrc at " + eslintrcFile, {
            dismissable: true,
            detail: "" + err.message
          });
        }
      }
      return {};
    };

    AutoIndent.prototype.translateIndentOptions = function(eslintRules) {
      var ES_DEFAULT_INDENT, defaultIndent, eslintIndentOptions, rule;
      eslintIndentOptions = {
        jsxIndent: [1, 1],
        jsxIndentProps: [1, 1],
        jsxClosingBracketLocation: [
          1, {
            selfClosing: TAGALIGNED,
            nonEmpty: TAGALIGNED
          }
        ]
      };
      if (typeof eslintRules !== "object") {
        return eslintIndentOptions;
      }
      ES_DEFAULT_INDENT = 4;
      rule = eslintRules['indent'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        defaultIndent = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        if (typeof rule[1] === 'number') {
          defaultIndent = rule[1] / this.editor.getTabLength();
        } else {
          defaultIndent = 1;
        }
      } else {
        defaultIndent = 1;
      }
      rule = eslintRules['react/jsx-indent'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxIndent[0] = rule;
        eslintIndentOptions.jsxIndent[1] = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxIndent[0] = rule[0];
        if (typeof rule[1] === 'number') {
          eslintIndentOptions.jsxIndent[1] = rule[1] / this.editor.getTabLength();
        } else {
          eslintIndentOptions.jsxIndent[1] = 1;
        }
      } else {
        eslintIndentOptions.jsxIndent[1] = defaultIndent;
      }
      rule = eslintRules['react/jsx-indent-props'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxIndentProps[0] = rule;
        eslintIndentOptions.jsxIndentProps[1] = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxIndentProps[0] = rule[0];
        if (typeof rule[1] === 'number') {
          eslintIndentOptions.jsxIndentProps[1] = rule[1] / this.editor.getTabLength();
        } else {
          eslintIndentOptions.jsxIndentProps[1] = 1;
        }
      } else {
        eslintIndentOptions.jsxIndentProps[1] = defaultIndent;
      }
      rule = eslintRules['react/jsx-closing-bracket-location'];
      eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = TAGALIGNED;
      eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = TAGALIGNED;
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxClosingBracketLocation[0] = rule;
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxClosingBracketLocation[0] = rule[0];
        if (typeof rule[1] === 'string') {
          eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = rule[1];
        } else {
          if (rule[1].selfClosing != null) {
            eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = rule[1].selfClosing;
          }
          if (rule[1].nonEmpty != null) {
            eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = rule[1].nonEmpty;
          }
        }
      }
      return eslintIndentOptions;
    };

    AutoIndent.prototype.indentForClosingBracket = function(row, parentTag, closingBracketRule) {
      if (this.eslintIndentOptions.jsxClosingBracketLocation[0]) {
        if (closingBracketRule === TAGALIGNED) {
          return this.indentRow({
            row: row,
            blockIndent: parentTag.tagIndentation
          });
        } else if (closingBracketRule === LINEALIGNED) {
          return this.indentRow({
            row: row,
            blockIndent: parentTag.firstCharIndentation
          });
        } else if (closingBracketRule === AFTERPROPS) {
          if (this.eslintIndentOptions.jsxIndentProps[0]) {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.tagIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.tagIndentation
            });
          }
        } else if (closingBracketRule === PROPSALIGNED) {
          if (this.eslintIndentOptions.jsxIndentProps[0]) {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.firstTagInLineIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.firstTagInLineIndentation
            });
          }
        }
      }
    };

    AutoIndent.prototype.indentRow = function(options) {
      var allowAdditionalIndents, blockIndent, jsxIndent, jsxIndentProps, row;
      row = options.row, allowAdditionalIndents = options.allowAdditionalIndents, blockIndent = options.blockIndent, jsxIndent = options.jsxIndent, jsxIndentProps = options.jsxIndentProps;
      if (jsxIndent) {
        if (this.eslintIndentOptions.jsxIndent[0]) {
          if (this.eslintIndentOptions.jsxIndent[1]) {
            blockIndent += jsxIndent * this.eslintIndentOptions.jsxIndent[1];
          }
        }
      }
      if (jsxIndentProps) {
        if (this.eslintIndentOptions.jsxIndentProps[0]) {
          if (this.eslintIndentOptions.jsxIndentProps[1]) {
            blockIndent += jsxIndentProps * this.eslintIndentOptions.jsxIndentProps[1];
          }
        }
      }
      if (allowAdditionalIndents) {
        if (this.editor.indentationForBufferRow(row) < blockIndent) {
          this.editor.setIndentationForBufferRow(row, blockIndent, {
            preserveLeadingWhitespace: false
          });
          return true;
        }
      } else {
        if (this.editor.indentationForBufferRow(row) !== blockIndent) {
          this.editor.setIndentationForBufferRow(row, blockIndent, {
            preserveLeadingWhitespace: false
          });
          return true;
        }
      }
      return false;
    };

    return AutoIndent;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL2F1dG8taW5kZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzV0FBQTtJQUFBO3lKQUFBOztBQUFBLEVBQUEsT0FBNEMsT0FBQSxDQUFRLE1BQVIsQ0FBNUMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixZQUFBLElBQXRCLEVBQTRCLGFBQUEsS0FBNUIsRUFBbUMsYUFBQSxLQUFuQyxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUpkLENBQUE7O0FBQUEsRUFLQSxpQkFBQSxHQUFvQixPQUFBLENBQVEscUJBQVIsQ0FMcEIsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUixDQU5QLENBQUE7O0FBQUEsRUFTQSxRQUFBLEdBQTBCLENBVDFCLENBQUE7O0FBQUEsRUFVQSxzQkFBQSxHQUEwQixDQVYxQixDQUFBOztBQUFBLEVBV0Esb0JBQUEsR0FBMEIsQ0FYMUIsQ0FBQTs7QUFBQSxFQVlBLFdBQUEsR0FBMEIsQ0FaMUIsQ0FBQTs7QUFBQSxFQWFBLGtCQUFBLEdBQTBCLENBYjFCLENBQUE7O0FBQUEsRUFjQSxZQUFBLEdBQTBCLENBZDFCLENBQUE7O0FBQUEsRUFlQSxhQUFBLEdBQTBCLENBZjFCLENBQUE7O0FBQUEsRUFnQkEsY0FBQSxHQUEwQixDQWhCMUIsQ0FBQTs7QUFBQSxFQWlCQSxVQUFBLEdBQTBCLENBakIxQixDQUFBOztBQUFBLEVBa0JBLFdBQUEsR0FBMEIsQ0FsQjFCLENBQUE7O0FBQUEsRUFtQkEsVUFBQSxHQUEwQixFQW5CMUIsQ0FBQTs7QUFBQSxFQW9CQSxZQUFBLEdBQTBCLEVBcEIxQixDQUFBOztBQUFBLEVBdUJBLFVBQUEsR0FBZ0IsYUF2QmhCLENBQUE7O0FBQUEsRUF3QkEsV0FBQSxHQUFnQixjQXhCaEIsQ0FBQTs7QUFBQSxFQXlCQSxVQUFBLEdBQWdCLGFBekJoQixDQUFBOztBQUFBLEVBMEJBLFlBQUEsR0FBZ0IsZUExQmhCLENBQUE7O0FBQUEsRUE0QkEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsb0JBQUUsTUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxtREFBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLDJFQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxNQUFiLENBQW5CLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdCQUFoQixDQUFpQyxDQUFDLGFBRDdDLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFELEdBQWEsOEdBSGIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUpYLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixDQUx6QixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLG1CQUFBLENBQUEsQ0FObkIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBUHZCLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ2Y7QUFBQSxRQUFBLG1DQUFBLEVBQXFDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7QUFDbkMsWUFBQSxLQUFDLENBQUEsT0FBRCxHQUFXLElBQVgsQ0FBQTttQkFDQSxLQUFDLENBQUEsbUJBQUQsR0FBdUIsS0FBQyxDQUFBLGdCQUFELENBQUEsRUFGWTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDO09BRGUsQ0FBakIsQ0FUQSxDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNmO0FBQUEsUUFBQSxvQ0FBQSxFQUFzQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxHQUFBO21CQUFZLEtBQUMsQ0FBQSxPQUFELEdBQVcsTUFBdkI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QztPQURlLENBQWpCLENBZEEsQ0FBQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ2Y7QUFBQSxRQUFBLHVDQUFBLEVBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7QUFDdkMsWUFBQSxLQUFDLENBQUEsT0FBRCxHQUFXLENBQUEsS0FBSyxDQUFBLE9BQWhCLENBQUE7QUFDQSxZQUFBLElBQUcsS0FBQyxDQUFBLE9BQUo7cUJBQWlCLEtBQUMsQ0FBQSxtQkFBRCxHQUF1QixLQUFDLENBQUEsZ0JBQUQsQ0FBQSxFQUF4QzthQUZ1QztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDO09BRGUsQ0FBakIsQ0FqQkEsQ0FBQTtBQUFBLE1Bc0JBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxJQUFDLENBQUEsV0FBeEMsQ0F0QkEsQ0FBQTtBQUFBLE1BdUJBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxJQUFDLENBQUEsU0FBdEMsQ0F2QkEsQ0FBQTtBQUFBLE1BeUJBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLHlCQUFSLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFBVyxLQUFDLENBQUEscUJBQUQsQ0FBdUIsS0FBdkIsRUFBWDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQWpCLENBekJBLENBQUE7QUFBQSxNQTBCQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFNLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFBTjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLENBQWpCLENBMUJBLENBRFc7SUFBQSxDQUFiOztBQUFBLHlCQTZCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLFFBQVEsQ0FBQyxtQkFBVCxDQUE2QixXQUE3QixFQUEwQyxJQUFDLENBQUEsV0FBM0MsQ0FEQSxDQUFBO2FBRUEsUUFBUSxDQUFDLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDLElBQUMsQ0FBQSxTQUF6QyxFQUhPO0lBQUEsQ0E3QlQsQ0FBQTs7QUFBQSx5QkFtQ0EscUJBQUEsR0FBdUIsU0FBQyxLQUFELEdBQUE7QUFDckIsVUFBQSxnSkFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxPQUFmO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsT0FBZjtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBRUEsTUFBQSxJQUFjLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUF4QixLQUFpQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBdkU7QUFBQSxjQUFBLENBQUE7T0FGQTtBQUFBLE1BR0EsU0FBQSxHQUFZLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUhwQyxDQUFBO0FBTUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsd0JBQVIsQ0FBQSxDQUFsQixDQUFBO0FBQ0EsUUFBQSxJQUFHLGVBQWUsQ0FBQyxNQUFoQixLQUEwQixJQUFDLENBQUEscUJBQTlCO0FBQ0UsVUFBQSxJQUFDLENBQUEscUJBQUQsR0FBeUIsQ0FBekIsQ0FBQTtBQUFBLFVBQ0EsU0FBQSxHQUFZLENBRFosQ0FBQTtBQUVBLGVBQUEsc0RBQUE7aURBQUE7QUFDRSxZQUFBLElBQUcsY0FBYyxDQUFDLEdBQWYsR0FBcUIsU0FBeEI7QUFBdUMsY0FBQSxTQUFBLEdBQVksY0FBYyxDQUFDLEdBQTNCLENBQXZDO2FBREY7QUFBQSxXQUhGO1NBQUEsTUFBQTtBQU1FLFVBQUEsSUFBQyxDQUFBLHFCQUFELEVBQUEsQ0FBQTtBQUNBLGdCQUFBLENBUEY7U0FGRjtPQUFBLE1BQUE7QUFVSyxRQUFBLGNBQUEsR0FBaUIsS0FBSyxDQUFDLGlCQUF2QixDQVZMO09BTkE7QUFBQSxNQW1CQSxXQUFBLEdBQWMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBbkJ0QyxDQUFBO0FBb0JBLE1BQUEsSUFBRyxJQUFDLENBQUEsVUFBRCxDQUFZLFdBQVosQ0FBSDtBQUNFLFFBQUEsZUFBQSx3RkFBMkUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxlQUE5RSxDQUFBO0FBQ0EsUUFBQSxJQUFHLHVCQUFIO0FBQ0UsVUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsWUFBQyxHQUFBLEVBQUssV0FBTjtBQUFBLFlBQW9CLFdBQUEsRUFBYSxDQUFqQztXQUFYLENBQUEsQ0FERjtTQUZGO09BcEJBO0FBeUJBLE1BQUEsSUFBVSxDQUFBLElBQUssQ0FBQSxVQUFELENBQVksU0FBWixDQUFkO0FBQUEsY0FBQSxDQUFBO09BekJBO0FBQUEsTUEyQkEsYUFBQSxHQUFvQixJQUFBLEtBQUEsQ0FBTSxTQUFOLEVBQWdCLENBQWhCLENBM0JwQixDQUFBO0FBQUEsTUE0QkEsZUFBQSxHQUFtQixlQUFlLENBQUMsYUFBaEIsQ0FBOEIsSUFBQyxDQUFBLE1BQS9CLEVBQXVDLGNBQXZDLENBNUJuQixDQUFBO0FBQUEsTUE2QkEsSUFBQyxDQUFBLFNBQUQsQ0FBZSxJQUFBLEtBQUEsQ0FBTSxlQUFOLEVBQXVCLGFBQXZCLENBQWYsQ0E3QkEsQ0FBQTtBQUFBLE1BOEJBLGNBQUEsc0ZBQXdFLENBQUEsQ0FBQSxDQUFFLENBQUMsZUE5QjNFLENBQUE7QUErQkEsTUFBQSxJQUFHLHNCQUFIO2VBQXdCLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsQ0FBQyxTQUFELEVBQVksY0FBWixDQUFoQyxFQUF4QjtPQWhDcUI7SUFBQSxDQW5DdkIsQ0FBQTs7QUFBQSx5QkF1RUEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLHlEQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLE9BQWY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxPQUFmO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUVBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUFBLENBRmhCLENBQUE7QUFLQSxNQUFBLElBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFwQixLQUEyQixhQUFhLENBQUMsR0FBRyxDQUFDLEdBQTdDLElBQ0QsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFwQixLQUErQixhQUFhLENBQUMsR0FBRyxDQUFDLE1BRGhELElBRUQsZUFBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQ0FBUixDQUF5QyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBckIsRUFBMEIsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUE5QyxDQUF6QyxDQUErRixDQUFDLGNBQWhHLENBQUEsQ0FBcEIsRUFBQSxnQkFBQSxNQUZGO0FBR0ksY0FBQSxDQUhKO09BTEE7QUFBQSxNQVVBLFVBQUEsR0FBYSxJQUFJLENBQUMsR0FBTCxDQUFTLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBN0IsRUFBa0MsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFwRCxDQVZiLENBQUE7QUFXQSxNQUFBLElBQUcsSUFBQyxDQUFBLFVBQUQsQ0FBWSxVQUFaLENBQUg7QUFDRSxRQUFBLGFBQUEsR0FBb0IsSUFBQSxLQUFBLENBQU0sVUFBTixFQUFpQixDQUFqQixDQUFwQixDQUFBO0FBQUEsUUFDQSxlQUFBLEdBQW1CLGVBQWUsQ0FBQyxhQUFoQixDQUE4QixJQUFDLENBQUEsTUFBL0IsRUFBdUMsYUFBdkMsQ0FEbkIsQ0FBQTtlQUVBLElBQUMsQ0FBQSxTQUFELENBQWUsSUFBQSxLQUFBLENBQU0sZUFBTixFQUF1QixhQUF2QixDQUFmLEVBSEY7T0FaZTtJQUFBLENBdkVqQixDQUFBOztBQUFBLHlCQXlGQSxVQUFBLEdBQVksU0FBQyxTQUFELEdBQUE7QUFDVixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLGdDQUFSLENBQXlDLENBQUMsU0FBRCxFQUFZLENBQVosQ0FBekMsQ0FBd0QsQ0FBQyxjQUF6RCxDQUFBLENBQVQsQ0FBQTtBQUNBLGFBQU8sZUFBa0IsTUFBbEIsRUFBQSxjQUFBLE1BQVAsQ0FGVTtJQUFBLENBekZaLENBQUE7O0FBQUEseUJBcUdBLFNBQUEsR0FBVyxTQUFDLEtBQUQsR0FBQTtBQUNULFVBQUEsbVZBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxFQUFiLENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBYSxDQURiLENBQUE7QUFBQSxNQUVBLHNCQUFBLEdBQXlCLEVBRnpCLENBQUE7QUFBQSxNQUdBLE1BQUEsR0FBVSxDQUhWLENBQUE7QUFBQSxNQUlBLGlCQUFBLEdBQW9CLElBSnBCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxHQUF1QixDQUx2QixDQUFBO0FBT0E7V0FBVyx5SUFBWCxHQUFBO0FBQ0UsUUFBQSxrQkFBQSxHQUFxQixJQUFyQixDQUFBO0FBQUEsUUFDQSxlQUFBLEdBQWtCLEtBRGxCLENBQUE7QUFBQSxRQUVBLFlBQUEsR0FBZSxLQUZmLENBQUE7QUFBQSxRQUdBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEdBQTdCLENBSFAsQ0FBQTtBQU1BLGVBQU8sQ0FBRSxLQUFBLEdBQVEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLElBQWhCLENBQVYsQ0FBQSxLQUFzQyxJQUE3QyxHQUFBO0FBQ0UsVUFBQSxXQUFBLEdBQWMsS0FBSyxDQUFDLEtBQXBCLENBQUE7QUFBQSxVQUNBLGVBQUEsR0FBc0IsSUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLFdBQVgsQ0FEdEIsQ0FBQTtBQUFBLFVBRUEsYUFBQSxHQUFvQixJQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsV0FBQSxHQUFjLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUF2QixHQUFnQyxDQUEzQyxDQUZwQixDQUFBO0FBQUEsVUFHQSxVQUFBLEdBQWlCLElBQUEsS0FBQSxDQUFNLGVBQU4sRUFBdUIsYUFBdkIsQ0FIakIsQ0FBQTtBQUtBLFVBQUEsSUFBRyxDQUFBLENBQUksS0FBQSxHQUFTLElBQUMsQ0FBQSxRQUFELENBQVUsR0FBVixFQUFlLEtBQWYsQ0FBVCxDQUFQO0FBQTJDLHFCQUEzQztXQUxBO0FBQUEsVUFPQSxvQkFBQSxHQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLEdBQWhDLENBUHhCLENBQUE7QUFTQSxVQUFBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQUEsQ0FBSDtBQUNFLFlBQUEsY0FBQSxHQUFrQixXQUFBLEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQUEsQ0FBaEMsQ0FERjtXQUFBLE1BQUE7QUFFSyxZQUFBLGNBQUEsR0FDQSxDQUFBLFNBQUEsR0FBQTtBQUNELGtCQUFBLG9CQUFBO0FBQUEsY0FBQSxhQUFBLEdBQWdCLENBQWhCLENBQUE7QUFDQSxtQkFBUyxzR0FBVCxHQUFBO0FBQ0UsZ0JBQUEsYUFBQSxJQUFrQixDQUFDLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBWixFQUFlLENBQWYsQ0FBRCxDQUFBLEtBQXNCLElBQXhDLENBREY7QUFBQSxlQURBO3FCQUdBLGNBSkM7WUFBQSxDQUFBLENBQUgsQ0FBQSxDQURHLENBRkw7V0FUQTtBQWtCQSxVQUFBLElBQUcsa0JBQUg7QUFDRSxZQUFBLHlCQUFBLEdBQTZCLGNBQTdCLENBREY7V0FsQkE7QUF3QkEsa0JBQVEsS0FBUjtBQUFBLGlCQUVPLFdBRlA7QUFHSSxjQUFBLGVBQUEsR0FBa0IsSUFBbEIsQ0FBQTtBQUVBLGNBQUEsSUFBRyxrQkFBSDtBQUNFLGdCQUFBLHNCQUFzQixDQUFDLElBQXZCLENBQTRCLGNBQUEsR0FBaUIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBQSxDQUE3QyxDQUFBLENBQUE7QUFhQSxnQkFBQSxJQUFHLGlCQUFBLElBQ0Msd0JBREQsSUFFQyxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsSUFBM0IsS0FBbUMsVUFGcEMsSUFHQyxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsR0FBM0IsS0FBa0MsQ0FBRSxHQUFBLEdBQU0sQ0FBUixDQUh0QztBQUlNLGtCQUFBLGNBQUEsR0FBaUIsb0JBQUEsR0FBdUIseUJBQUEsR0FDdEMsSUFBQyxDQUFBLG1CQUFtQixDQUFDLFNBQVUsQ0FBQSxDQUFBLENBQS9CLEdBQW9DLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixHQUF4QixDQUR0QyxDQUFBO0FBQUEsa0JBRUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxTQUFELENBQVc7QUFBQSxvQkFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLG9CQUFZLFdBQUEsRUFBYSxvQkFBekI7bUJBQVgsQ0FGZixDQUpOO2lCQUFBLE1BT0ssSUFBRyxpQkFBQSxJQUFzQix3QkFBekI7QUFDSCxrQkFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLFNBQUQsQ0FBVztBQUFBLG9CQUFDLEdBQUEsRUFBSyxHQUFOO0FBQUEsb0JBQVksV0FBQSxFQUFhLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixHQUF4QixDQUF6QjtBQUFBLG9CQUF1RCxTQUFBLEVBQVcsQ0FBbEU7bUJBQVgsQ0FBZixDQURHO2lCQUFBLE1BRUEsSUFBRyxzQkFBSDtBQUNILGtCQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsb0JBQUMsR0FBQSxFQUFLLEdBQU47QUFBQSxvQkFBWSxXQUFBLEVBQWEsVUFBVyxDQUFBLGNBQUEsQ0FBZSxDQUFDLG9CQUFwRDtBQUFBLG9CQUEwRSxTQUFBLEVBQVcsQ0FBckY7bUJBQVgsQ0FBZixDQURHO2lCQXZCUDtlQUZBO0FBNkJBLGNBQUEsSUFBRyxZQUFIO0FBQ0UsZ0JBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsR0FBN0IsQ0FBUCxDQUFBO0FBQUEsZ0JBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLENBRHZCLENBQUE7QUFFQSx5QkFIRjtlQTdCQTtBQUFBLGNBa0NBLGtCQUFBLEdBQXFCLEtBbENyQixDQUFBO0FBQUEsY0FtQ0EsaUJBQUEsR0FBb0IsS0FuQ3BCLENBQUE7QUFBQSxjQXFDQSxzQkFBc0IsQ0FBQyxJQUF2QixDQUE0QixjQUFBLEdBQWlCLHNCQUFzQixDQUFDLEdBQXZCLENBQUEsQ0FBN0MsQ0FyQ0EsQ0FBQTtBQUFBLGNBc0NBLFVBQVUsQ0FBQyxJQUFYLENBQ0U7QUFBQSxnQkFBQSxJQUFBLEVBQU0sV0FBTjtBQUFBLGdCQUNBLElBQUEsRUFBTSxLQUFNLENBQUEsQ0FBQSxDQURaO0FBQUEsZ0JBRUEsR0FBQSxFQUFLLEdBRkw7QUFBQSxnQkFHQSx5QkFBQSxFQUEyQix5QkFIM0I7QUFBQSxnQkFJQSxjQUFBLEVBQWdCLGNBSmhCO0FBQUEsZ0JBS0Esb0JBQUEsRUFBc0Isb0JBTHRCO0FBQUEsZ0JBTUEsY0FBQSxFQUFnQixjQU5oQjtBQUFBLGdCQU9BLDBCQUFBLEVBQTRCLElBUDVCO0FBQUEsZ0JBUUEsZUFBQSxFQUFpQixJQVJqQjtlQURGLENBdENBLENBQUE7QUFBQSxjQWlEQSxzQkFBc0IsQ0FBQyxJQUF2QixDQUE0QixVQUE1QixDQWpEQSxDQUFBO0FBQUEsY0FrREEsVUFBQSxFQWxEQSxDQUhKO0FBRU87QUFGUCxpQkF3RE8sWUF4RFA7QUF5REksY0FBQSxlQUFBLEdBQWtCLElBQWxCLENBQUE7QUFDQSxjQUFBLElBQUcsa0JBQUg7QUFDRSxnQkFBQSxzQkFBc0IsQ0FBQyxJQUF2QixDQUE0QixjQUFBLEdBQWlCLHNCQUFzQixDQUFDLEdBQXZCLENBQUEsQ0FBN0MsQ0FBQSxDQUFBO0FBQUEsZ0JBQ0EsWUFBQSxHQUFlLElBQUMsQ0FBQSxTQUFELENBQVc7QUFBQSxrQkFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLGtCQUFXLFdBQUEsRUFBYSxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsb0JBQW5EO2lCQUFYLENBRGYsQ0FERjtlQURBO0FBTUEsY0FBQSxJQUFHLFlBQUg7QUFDRSxnQkFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixHQUE3QixDQUFQLENBQUE7QUFBQSxnQkFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsR0FBdUIsQ0FEdkIsQ0FBQTtBQUVBLHlCQUhGO2VBTkE7QUFBQSxjQVdBLGtCQUFBLEdBQXFCLEtBWHJCLENBQUE7QUFBQSxjQVlBLGlCQUFBLEdBQW9CLEtBWnBCLENBQUE7QUFBQSxjQWNBLGNBQUEsR0FBaUIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBQSxDQWRqQixDQUFBO0FBQUEsY0FlQSxVQUFVLENBQUMsSUFBWCxDQUNFO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLFlBQU47QUFBQSxnQkFDQSxJQUFBLEVBQU0sS0FBTSxDQUFBLENBQUEsQ0FEWjtBQUFBLGdCQUVBLEdBQUEsRUFBSyxHQUZMO0FBQUEsZ0JBR0EsY0FBQSxFQUFnQixjQUhoQjtlQURGLENBZkEsQ0FBQTtBQW9CQSxjQUFBLElBQUcsY0FBQSxJQUFpQixDQUFwQjtBQUEyQixnQkFBQSxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsZUFBM0IsR0FBNkMsVUFBN0MsQ0FBM0I7ZUFwQkE7QUFBQSxjQXFCQSxVQUFBLEVBckJBLENBekRKO0FBd0RPO0FBeERQLGlCQWlGTyxvQkFqRlA7QUFrRkksY0FBQSxlQUFBLEdBQWtCLElBQWxCLENBQUE7QUFDQSxjQUFBLElBQUcsa0JBQUg7QUFDRSxnQkFBQSxzQkFBc0IsQ0FBQyxJQUF2QixDQUE0QixjQUFBLEdBQWlCLHNCQUFzQixDQUFDLEdBQXZCLENBQUEsQ0FBN0MsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsSUFBRyx5QkFBQSxLQUE2QixvQkFBaEM7QUFDRSxrQkFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLHVCQUFELENBQTBCLEdBQTFCLEVBQ2IsVUFBVyxDQUFBLGNBQUEsQ0FERSxFQUViLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyx5QkFBMEIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUZyQyxDQUFmLENBREY7aUJBQUEsTUFBQTtBQUtFLGtCQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsb0JBQUMsR0FBQSxFQUFLLEdBQU47QUFBQSxvQkFDdkIsV0FBQSxFQUFhLFVBQVcsQ0FBQSxjQUFBLENBQWUsQ0FBQyx5QkFEakI7QUFBQSxvQkFDNEMsY0FBQSxFQUFnQixDQUQ1RDttQkFBWCxDQUFmLENBTEY7aUJBRkY7ZUFEQTtBQVlBLGNBQUEsSUFBRyxZQUFIO0FBQ0UsZ0JBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsR0FBN0IsQ0FBUCxDQUFBO0FBQUEsZ0JBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLENBRHZCLENBQUE7QUFFQSx5QkFIRjtlQVpBO0FBQUEsY0FpQkEsaUJBQUEsR0FBb0IsS0FqQnBCLENBQUE7QUFBQSxjQWtCQSxrQkFBQSxHQUFxQixLQWxCckIsQ0FBQTtBQUFBLGNBb0JBLGNBQUEsR0FBaUIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBQSxDQXBCakIsQ0FBQTtBQUFBLGNBcUJBLFVBQVUsQ0FBQyxJQUFYLENBQ0U7QUFBQSxnQkFBQSxJQUFBLEVBQU0sb0JBQU47QUFBQSxnQkFDQSxJQUFBLEVBQU0sVUFBVyxDQUFBLGNBQUEsQ0FBZSxDQUFDLElBRGpDO0FBQUEsZ0JBRUEsR0FBQSxFQUFLLEdBRkw7QUFBQSxnQkFHQSxjQUFBLEVBQWdCLGNBSGhCO2VBREYsQ0FyQkEsQ0FBQTtBQTBCQSxjQUFBLElBQUcsY0FBQSxJQUFrQixDQUFyQjtBQUNFLGdCQUFBLFVBQVcsQ0FBQSxjQUFBLENBQWUsQ0FBQywwQkFBM0IsR0FBd0QsVUFBeEQsQ0FBQTtBQUFBLGdCQUNBLFVBQVcsQ0FBQSxjQUFBLENBQWUsQ0FBQyxJQUEzQixHQUFrQyxzQkFEbEMsQ0FBQTtBQUFBLGdCQUVBLFVBQVcsQ0FBQSxjQUFBLENBQWUsQ0FBQyxlQUEzQixHQUE2QyxVQUY3QyxDQURGO2VBMUJBO0FBQUEsY0E4QkEsVUFBQSxFQTlCQSxDQWxGSjtBQWlGTztBQWpGUCxpQkFtSE8sa0JBbkhQO0FBb0hJLGNBQUEsZUFBQSxHQUFrQixJQUFsQixDQUFBO0FBQ0EsY0FBQSxJQUFHLGtCQUFIO0FBQ0UsZ0JBQUEsc0JBQXNCLENBQUMsSUFBdkIsQ0FBNEIsY0FBQSxHQUFpQixzQkFBc0IsQ0FBQyxHQUF2QixDQUFBLENBQTdDLENBQUEsQ0FBQTtBQUNBLGdCQUFBLElBQUcseUJBQUEsS0FBNkIsb0JBQWhDO0FBQ0Usa0JBQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSx1QkFBRCxDQUEwQixHQUExQixFQUNiLFVBQVcsQ0FBQSxjQUFBLENBREUsRUFFYixJQUFDLENBQUEsbUJBQW1CLENBQUMseUJBQTBCLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFGckMsQ0FBZixDQURGO2lCQUFBLE1BQUE7QUFLRSxrQkFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLFNBQUQsQ0FBVztBQUFBLG9CQUFDLEdBQUEsRUFBSyxHQUFOO0FBQUEsb0JBQVcsV0FBQSxFQUFhLFVBQVcsQ0FBQSxjQUFBLENBQWUsQ0FBQyx5QkFBbkQ7QUFBQSxvQkFBOEUsY0FBQSxFQUFnQixDQUE5RjttQkFBWCxDQUFmLENBTEY7aUJBRkY7ZUFEQTtBQVdBLGNBQUEsSUFBRyxZQUFIO0FBQ0UsZ0JBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsR0FBN0IsQ0FBUCxDQUFBO0FBQUEsZ0JBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLENBRHZCLENBQUE7QUFFQSx5QkFIRjtlQVhBO0FBQUEsY0FnQkEsaUJBQUEsR0FBb0IsS0FoQnBCLENBQUE7QUFBQSxjQWlCQSxrQkFBQSxHQUFxQixLQWpCckIsQ0FBQTtBQUFBLGNBbUJBLHNCQUFzQixDQUFDLElBQXZCLENBQTRCLGNBQUEsR0FBaUIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBQSxDQUE3QyxDQW5CQSxDQUFBO0FBQUEsY0FvQkEsVUFBVSxDQUFDLElBQVgsQ0FDRTtBQUFBLGdCQUFBLElBQUEsRUFBTSxrQkFBTjtBQUFBLGdCQUNBLElBQUEsRUFBTSxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsSUFEakM7QUFBQSxnQkFFQSxHQUFBLEVBQUssR0FGTDtBQUFBLGdCQUdBLGNBQUEsRUFBZ0IsY0FIaEI7ZUFERixDQXBCQSxDQUFBO0FBeUJBLGNBQUEsSUFBRyxjQUFBLElBQWtCLENBQXJCO0FBQTRCLGdCQUFBLFVBQVcsQ0FBQSxjQUFBLENBQWUsQ0FBQywwQkFBM0IsR0FBd0QsVUFBeEQsQ0FBNUI7ZUF6QkE7QUFBQSxjQTBCQSxVQUFBLEVBMUJBLENBcEhKO0FBbUhPO0FBbkhQLGlCQWlKTyxhQWpKUDtBQWtKSSxjQUFBLGVBQUEsR0FBa0IsSUFBbEIsQ0FBQTtBQUNBLGNBQUEsSUFBRyxrQkFBSDtBQUNFLGdCQUFBLHNCQUFzQixDQUFDLElBQXZCLENBQTRCLGNBQUEsR0FBaUIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBQSxDQUE3QyxDQUFBLENBQUE7QUFDQSxnQkFBQSxJQUFHLHNCQUFIO0FBQ0Usa0JBQUEsSUFBRyxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsSUFBM0IsS0FBbUMsV0FBbkMsSUFBbUQsVUFBVyxDQUFBLGNBQUEsQ0FBZSxDQUFDLDBCQUEzQixLQUF5RCxJQUEvRztBQUNFLG9CQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsc0JBQUMsR0FBQSxFQUFLLEdBQU47QUFBQSxzQkFBVyxXQUFBLEVBQWEsVUFBVyxDQUFBLGNBQUEsQ0FBZSxDQUFDLG9CQUFuRDtBQUFBLHNCQUF5RSxjQUFBLEVBQWdCLENBQXpGO3FCQUFYLENBQWYsQ0FERjttQkFBQSxNQUFBO0FBR0Usb0JBQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxTQUFELENBQVc7QUFBQSxzQkFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLHNCQUFXLFdBQUEsRUFBYSxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsb0JBQW5EO0FBQUEsc0JBQXlFLFNBQUEsRUFBVyxDQUFwRjtxQkFBWCxDQUFmLENBSEY7bUJBREY7aUJBRkY7ZUFEQTtBQVVBLGNBQUEsSUFBRyxZQUFIO0FBQ0UsZ0JBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsR0FBN0IsQ0FBUCxDQUFBO0FBQUEsZ0JBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLENBRHZCLENBQUE7QUFFQSx5QkFIRjtlQVZBO0FBQUEsY0FlQSxpQkFBQSxHQUFvQixJQWZwQixDQUFBO0FBQUEsY0FnQkEsa0JBQUEsR0FBcUIsS0FoQnJCLENBQUE7QUFBQSxjQWtCQSxzQkFBc0IsQ0FBQyxJQUF2QixDQUE0QixjQUFBLEdBQWlCLHNCQUFzQixDQUFDLEdBQXZCLENBQUEsQ0FBN0MsQ0FsQkEsQ0FBQTtBQUFBLGNBbUJBLFVBQVUsQ0FBQyxJQUFYLENBQ0U7QUFBQSxnQkFBQSxJQUFBLEVBQU0sYUFBTjtBQUFBLGdCQUNBLElBQUEsRUFBTSxFQUROO0FBQUEsZ0JBRUEsR0FBQSxFQUFLLEdBRkw7QUFBQSxnQkFHQSx5QkFBQSxFQUEyQix5QkFIM0I7QUFBQSxnQkFJQSxjQUFBLEVBQWdCLGNBSmhCO0FBQUEsZ0JBS0Esb0JBQUEsRUFBc0Isb0JBTHRCO0FBQUEsZ0JBTUEsY0FBQSxFQUFnQixjQU5oQjtBQUFBLGdCQU9BLDBCQUFBLEVBQTRCLElBUDVCO0FBQUEsZ0JBUUEsZUFBQSxFQUFpQixJQVJqQjtlQURGLENBbkJBLENBQUE7QUFBQSxjQThCQSxzQkFBc0IsQ0FBQyxJQUF2QixDQUE0QixVQUE1QixDQTlCQSxDQUFBO0FBQUEsY0ErQkEsVUFBQSxFQS9CQSxDQWxKSjtBQWlKTztBQWpKUCxpQkFvTE8sY0FwTFA7QUFxTEksY0FBQSxlQUFBLEdBQWtCLElBQWxCLENBQUE7QUFDQSxjQUFBLElBQUcsa0JBQUg7QUFDRSxnQkFBQSxzQkFBc0IsQ0FBQyxJQUF2QixDQUE0QixjQUFBLEdBQWlCLHNCQUFzQixDQUFDLEdBQXZCLENBQUEsQ0FBN0MsQ0FBQSxDQUFBO0FBQUEsZ0JBQ0EsWUFBQSxHQUFlLElBQUMsQ0FBQSxTQUFELENBQVc7QUFBQSxrQkFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLGtCQUFXLFdBQUEsRUFBYSxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsb0JBQW5EO2lCQUFYLENBRGYsQ0FERjtlQURBO0FBTUEsY0FBQSxJQUFHLFlBQUg7QUFDRSxnQkFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixHQUE3QixDQUFQLENBQUE7QUFBQSxnQkFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsR0FBdUIsQ0FEdkIsQ0FBQTtBQUVBLHlCQUhGO2VBTkE7QUFBQSxjQVdBLGlCQUFBLEdBQW9CLEtBWHBCLENBQUE7QUFBQSxjQVlBLGtCQUFBLEdBQXFCLEtBWnJCLENBQUE7QUFBQSxjQWNBLGNBQUEsR0FBaUIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBQSxDQWRqQixDQUFBO0FBQUEsY0FlQSxVQUFVLENBQUMsSUFBWCxDQUNFO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLGNBQU47QUFBQSxnQkFDQSxJQUFBLEVBQU0sRUFETjtBQUFBLGdCQUVBLEdBQUEsRUFBSyxHQUZMO0FBQUEsZ0JBR0EsY0FBQSxFQUFnQixjQUhoQjtlQURGLENBZkEsQ0FBQTtBQW9CQSxjQUFBLElBQUcsY0FBQSxJQUFpQixDQUFwQjtBQUEyQixnQkFBQSxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsZUFBM0IsR0FBNkMsVUFBN0MsQ0FBM0I7ZUFwQkE7QUFBQSxjQXFCQSxVQUFBLEVBckJBLENBckxKO0FBb0xPO0FBcExQLGlCQTZNTyxVQTdNUDtBQThNSSxjQUFBLGVBQUEsR0FBa0IsSUFBbEIsQ0FBQTtBQUNBLGNBQUEsSUFBRyxrQkFBSDtBQUNFLGdCQUFBLHNCQUFzQixDQUFDLElBQXZCLENBQTRCLGNBQUEsR0FBaUIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBQSxDQUE3QyxDQUFBLENBQUE7QUFDQSxnQkFBQSxJQUFHLGlCQUFBLElBQ0Msd0JBREQsSUFFQyxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsSUFBM0IsS0FBbUMsVUFGcEMsSUFHQyxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsR0FBM0IsS0FBa0MsQ0FBRSxHQUFBLEdBQU0sQ0FBUixDQUh0QztBQUlNLGtCQUFBLGNBQUEsR0FBaUIsb0JBQUEsR0FDZixJQUFDLENBQUEsbUJBQW1CLENBQUMsU0FBVSxDQUFBLENBQUEsQ0FBL0IsR0FBb0MsSUFBQyxDQUFBLHNCQUFELENBQXdCLEdBQXhCLENBRHRDLENBQUE7QUFBQSxrQkFFQSxZQUFBLEdBQWUsSUFBQyxDQUFBLFNBQUQsQ0FBVztBQUFBLG9CQUFDLEdBQUEsRUFBSyxHQUFOO0FBQUEsb0JBQVcsV0FBQSxFQUFhLG9CQUF4QjttQkFBWCxDQUZmLENBSk47aUJBQUEsTUFPSyxJQUFHLHNCQUFIO0FBQ0gsa0JBQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxTQUFELENBQVc7QUFBQSxvQkFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLG9CQUFXLFdBQUEsRUFBYSxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsb0JBQW5EO0FBQUEsb0JBQXlFLFNBQUEsRUFBVyxDQUFwRjttQkFBWCxDQUFmLENBREc7aUJBVFA7ZUFEQTtBQWNBLGNBQUEsSUFBRyxZQUFIO0FBQ0UsZ0JBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsR0FBN0IsQ0FBUCxDQUFBO0FBQUEsZ0JBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLENBRHZCLENBQUE7QUFFQSx5QkFIRjtlQWRBO0FBQUEsY0FtQkEsa0JBQUEsR0FBcUIsS0FuQnJCLENBQUE7QUFBQSxjQXFCQSxzQkFBc0IsQ0FBQyxJQUF2QixDQUE0QixjQUFBLEdBQWlCLHNCQUFzQixDQUFDLEdBQXZCLENBQUEsQ0FBN0MsQ0FyQkEsQ0FBQTtBQUFBLGNBc0JBLFVBQVUsQ0FBQyxJQUFYLENBQ0U7QUFBQSxnQkFBQSxJQUFBLEVBQU0sVUFBTjtBQUFBLGdCQUNBLElBQUEsRUFBTSxFQUROO0FBQUEsZ0JBRUEsR0FBQSxFQUFLLEdBRkw7QUFBQSxnQkFHQSx5QkFBQSxFQUEyQix5QkFIM0I7QUFBQSxnQkFJQSxjQUFBLEVBQWdCLGNBSmhCO0FBQUEsZ0JBS0Esb0JBQUEsRUFBc0Isb0JBTHRCO0FBQUEsZ0JBTUEsY0FBQSxFQUFnQixjQU5oQjtBQUFBLGdCQU9BLDBCQUFBLEVBQTRCLElBUDVCO0FBQUEsZ0JBUUEsZUFBQSxFQUFpQixJQVJqQjtlQURGLENBdEJBLENBQUE7QUFBQSxjQWlDQSxzQkFBc0IsQ0FBQyxJQUF2QixDQUE0QixVQUE1QixDQWpDQSxDQUFBO0FBQUEsY0FrQ0EsVUFBQSxFQWxDQSxDQTlNSjtBQTZNTztBQTdNUCxpQkFtUE8sV0FuUFA7QUFvUEksY0FBQSxlQUFBLEdBQWtCLElBQWxCLENBQUE7QUFDQSxjQUFBLElBQUcsa0JBQUg7QUFDRSxnQkFBQSxzQkFBc0IsQ0FBQyxJQUF2QixDQUE0QixjQUFBLEdBQWlCLHNCQUFzQixDQUFDLEdBQXZCLENBQUEsQ0FBN0MsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsSUFBRyxzQkFBSDtBQUNFLGtCQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsb0JBQUMsR0FBQSxFQUFLLEdBQU47QUFBQSxvQkFBVyxXQUFBLEVBQWEsVUFBVyxDQUFBLGNBQUEsQ0FBZSxDQUFDLG9CQUFuRDttQkFBWCxDQUFmLENBREY7aUJBRkY7ZUFEQTtBQU9BLGNBQUEsSUFBRyxZQUFIO0FBQ0UsZ0JBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsR0FBN0IsQ0FBUCxDQUFBO0FBQUEsZ0JBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLENBRHZCLENBQUE7QUFFQSx5QkFIRjtlQVBBO0FBQUEsY0FZQSxrQkFBQSxHQUFxQixLQVpyQixDQUFBO0FBQUEsY0FjQSxjQUFBLEdBQWlCLHNCQUFzQixDQUFDLEdBQXZCLENBQUEsQ0FkakIsQ0FBQTtBQWVBLGNBQUEsSUFBRyxzQkFBSDtBQUNFLGdCQUFBLFVBQVUsQ0FBQyxJQUFYLENBQ0U7QUFBQSxrQkFBQSxJQUFBLEVBQU0sV0FBTjtBQUFBLGtCQUNBLElBQUEsRUFBTSxFQUROO0FBQUEsa0JBRUEsR0FBQSxFQUFLLEdBRkw7QUFBQSxrQkFHQSxjQUFBLEVBQWdCLGNBSGhCO2lCQURGLENBQUEsQ0FBQTtBQUtBLGdCQUFBLElBQUcsY0FBQSxJQUFpQixDQUFwQjtBQUEyQixrQkFBQSxVQUFXLENBQUEsY0FBQSxDQUFlLENBQUMsZUFBM0IsR0FBNkMsVUFBN0MsQ0FBM0I7aUJBTEE7QUFBQSxnQkFNQSxVQUFBLEVBTkEsQ0FERjtlQW5RSjtBQW1QTztBQW5QUCxpQkE2UU8sVUE3UVA7QUFBQSxpQkE2UW9CLFlBN1FwQjtBQThRSSxjQUFBLGlCQUFBLEdBQW9CLElBQXBCLENBOVFKO0FBQUEsV0F6QkY7UUFBQSxDQU5BO0FBZ1RBLFFBQUEsSUFBRyxVQUFBLElBQWUsQ0FBQSxlQUFsQjtBQUVFLFVBQUEsSUFBRyxHQUFBLEtBQVMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUF0QjtBQUNFLFlBQUEsZUFBQSxnRkFBbUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxlQUF0RSxDQUFBO0FBQ0EsWUFBQSxJQUFHLHVCQUFIOzRCQUNFLElBQUMsQ0FBQSxTQUFELENBQVc7QUFBQSxnQkFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLGdCQUFZLFdBQUEsRUFBYSxDQUF6QjtlQUFYLEdBREY7YUFBQSxNQUFBOzRCQUdFLElBQUMsQ0FBQSxxQkFBRCxDQUF1QixHQUF2QixFQUE0QixVQUE1QixFQUF3QyxzQkFBeEMsR0FIRjthQUZGO1dBQUEsTUFBQTswQkFPRSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsR0FBdkIsRUFBNEIsVUFBNUIsRUFBd0Msc0JBQXhDLEdBUEY7V0FGRjtTQUFBLE1BQUE7Z0NBQUE7U0FqVEY7QUFBQTtzQkFSUztJQUFBLENBckdYLENBQUE7O0FBQUEseUJBMmFBLHFCQUFBLEdBQXVCLFNBQUMsR0FBRCxFQUFNLFVBQU4sRUFBa0Isc0JBQWxCLEdBQUE7QUFDckIsVUFBQSxxQkFBQTtBQUFBLE1BQUEsc0JBQXNCLENBQUMsSUFBdkIsQ0FBNEIsY0FBQSxHQUFpQixzQkFBc0IsQ0FBQyxHQUF2QixDQUFBLENBQTdDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLFVBQVcsQ0FBQSxjQUFBLENBRG5CLENBQUE7QUFFQSxjQUFPLEtBQUssQ0FBQyxJQUFiO0FBQUEsYUFDTyxXQURQO0FBQUEsYUFDb0Isc0JBRHBCO0FBRUksVUFBQSxJQUFJLEtBQUssQ0FBQywwQkFBTixLQUFvQyxJQUF4QzttQkFDRSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsY0FBQyxHQUFBLEVBQUssR0FBTjtBQUFBLGNBQVcsV0FBQSxFQUFhLEtBQUssQ0FBQyxvQkFBOUI7QUFBQSxjQUFvRCxjQUFBLEVBQWdCLENBQXBFO2FBQVgsRUFERjtXQUFBLE1BQUE7bUJBRUssSUFBQyxDQUFBLFNBQUQsQ0FBVztBQUFBLGNBQUMsR0FBQSxFQUFLLEdBQU47QUFBQSxjQUFXLFdBQUEsRUFBYSxLQUFLLENBQUMsb0JBQTlCO0FBQUEsY0FBb0QsU0FBQSxFQUFXLENBQS9EO2FBQVgsRUFGTDtXQUZKO0FBQ29CO0FBRHBCLGFBS08sYUFMUDtpQkFNSSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsWUFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLFlBQVcsV0FBQSxFQUFhLEtBQUssQ0FBQyxvQkFBOUI7QUFBQSxZQUFvRCxTQUFBLEVBQVcsQ0FBL0Q7V0FBWCxFQU5KO0FBQUEsYUFPTyxVQVBQO2lCQVFJLElBQUMsQ0FBQSxTQUFELENBQVc7QUFBQSxZQUFDLEdBQUEsRUFBSyxHQUFOO0FBQUEsWUFBVyxXQUFBLEVBQWEsS0FBSyxDQUFDLG9CQUE5QjtBQUFBLFlBQW9ELFNBQUEsRUFBVyxDQUEvRDtXQUFYLEVBUko7QUFBQSxhQVNPLG9CQVRQO0FBQUEsYUFTNkIsY0FUN0I7QUFBQSxhQVM2QyxrQkFUN0M7aUJBVUksSUFBQyxDQUFBLFNBQUQsQ0FBVztBQUFBLFlBQUMsR0FBQSxFQUFLLEdBQU47QUFBQSxZQUFXLFdBQUEsRUFBYSxVQUFXLENBQUEsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsQ0FBQyxvQkFBekQ7QUFBQSxZQUErRSxjQUFBLEVBQWdCLENBQS9GO1dBQVgsRUFWSjtBQUFBLGFBV08sV0FYUDtpQkFZSSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsWUFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLFlBQVcsV0FBQSxFQUFhLFVBQVcsQ0FBQSxLQUFLLENBQUMsY0FBTixDQUFxQixDQUFDLG9CQUF6RDtBQUFBLFlBQStFLFNBQUEsRUFBVyxDQUExRjtXQUFYLEVBWko7QUFBQSxPQUhxQjtJQUFBLENBM2F2QixDQUFBOztBQUFBLHlCQTZiQSxRQUFBLEdBQVUsU0FBQyxTQUFELEVBQVksS0FBWixHQUFBO0FBQ1IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQ0FBUixDQUF5QyxDQUFDLFNBQUQsRUFBWSxLQUFLLENBQUMsS0FBbEIsQ0FBekMsQ0FBa0UsQ0FBQyxjQUFuRSxDQUFBLENBQW1GLENBQUMsR0FBcEYsQ0FBQSxDQUFSLENBQUE7QUFDQSxNQUFBLElBQUcsZ0NBQUEsS0FBb0MsS0FBdkM7QUFDRSxRQUFBLElBQVEsZ0JBQVI7QUFBdUIsaUJBQU8sV0FBUCxDQUF2QjtTQUFBLE1BQ0ssSUFBRyxnQkFBSDtBQUFrQixpQkFBTyxvQkFBUCxDQUFsQjtTQUZQO09BQUEsTUFHSyxJQUFHLGdCQUFBLEtBQW9CLEtBQXZCO0FBQ0gsUUFBQSxJQUFHLGdCQUFIO0FBQWtCLGlCQUFPLFlBQVAsQ0FBbEI7U0FERztPQUFBLE1BRUEsSUFBRyxnQkFBQSxLQUFvQixLQUF2QjtBQUNILFFBQUEsSUFBRyxnQkFBSDtBQUFrQixpQkFBTyxrQkFBUCxDQUFsQjtTQURHO09BQUEsTUFFQSxJQUFHLGdCQUFIO0FBQ0gsUUFBQSxJQUFHLHdDQUFBLEtBQTRDLEtBQS9DO0FBQ0UsaUJBQU8sYUFBUCxDQURGO1NBQUEsTUFFSyxJQUFHLHFCQUFBLEtBQXlCLEtBQTVCO0FBQ0gsaUJBQU8sVUFBUCxDQURHO1NBSEY7T0FBQSxNQUtBLElBQUcsZ0JBQUg7QUFDSCxRQUFBLElBQUcsc0NBQUEsS0FBMEMsS0FBN0M7QUFDRSxpQkFBTyxjQUFQLENBREY7U0FBQSxNQUVLLElBQUcscUJBQUEsS0FBeUIsS0FBNUI7QUFDSCxpQkFBTyxXQUFQLENBREc7U0FIRjtPQUFBLE1BS0EsSUFBRyxpQkFBSDtBQUNILFFBQUEsSUFBRyw2QkFBQSxLQUFpQyxLQUFwQztBQUNFLGlCQUFPLFVBQVAsQ0FERjtTQURHO09BQUEsTUFHQSxJQUFHLGlCQUFIO0FBQ0gsUUFBQSxJQUFHLDZCQUFBLEtBQWlDLEtBQXBDO0FBQ0UsaUJBQU8sWUFBUCxDQURGO1NBREc7T0FyQkw7QUF3QkEsYUFBTyxRQUFQLENBekJRO0lBQUEsQ0E3YlYsQ0FBQTs7QUFBQSx5QkEwZEEsc0JBQUEsR0FBd0IsU0FBQyxHQUFELEdBQUE7QUFDdEIsVUFBQSxlQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsR0FBQTtBQUFBLGVBQU8sQ0FBUCxDQUFBO09BQUE7QUFDQSxXQUFXLHdGQUFYLEdBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEdBQTdCLENBQVAsQ0FBQTtBQUNBLFFBQUEsSUFBK0MsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFaLENBQS9DO0FBQUEsaUJBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxHQUFoQyxDQUFQLENBQUE7U0FGRjtBQUFBLE9BREE7QUFJQSxhQUFPLENBQVAsQ0FMc0I7SUFBQSxDQTFkeEIsQ0FBQTs7QUFBQSx5QkFrZUEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO0FBQ2hCLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLElBQUcsQ0FBQSxJQUFLLENBQUEsT0FBUjtBQUFxQixlQUFPLElBQUMsQ0FBQSxzQkFBRCxDQUFBLENBQVAsQ0FBckI7T0FBQTtBQUNBLE1BQUEsSUFBRyxnQkFBQSxHQUFtQixJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUF0QjtBQUNFLFFBQUEsZ0JBQUEsR0FBdUIsSUFBQSxJQUFBLENBQUssZ0JBQUwsQ0FBdkIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixJQUFDLENBQUEsbUJBQUQsQ0FBcUIsZ0JBQWdCLENBQUMsT0FBakIsQ0FBQSxDQUFyQixDQUF4QixFQUZGO09BQUEsTUFBQTtlQUlFLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixFQUF4QixFQUpGO09BRmdCO0lBQUEsQ0FsZWxCLENBQUE7O0FBQUEseUJBMmVBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTtBQUNuQixVQUFBLHVCQUFBO0FBQUEsTUFBQSx1QkFBQSxHQUEwQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsQ0FBNUIsQ0FBMUIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxrQ0FBSDtlQUNFLElBQUksQ0FBQyxJQUFMLENBQVUsdUJBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxXQUF0QyxFQURGO09BSG1CO0lBQUEsQ0EzZXJCLENBQUE7O0FBQUEseUJBa2ZBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLE1BREE7SUFBQSxDQWxmYixDQUFBOztBQUFBLHlCQXNmQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQURGO0lBQUEsQ0F0ZlgsQ0FBQTs7QUFBQSx5QkEwZkEsbUJBQUEsR0FBcUIsU0FBQyxZQUFELEdBQUE7QUFFbkIsVUFBQSw2QkFBQTtBQUFBLE1BQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFlBQWQsQ0FBSDtBQUNFLFFBQUEsV0FBQSxHQUFjLGlCQUFBLENBQWtCLEVBQUUsQ0FBQyxZQUFILENBQWdCLFlBQWhCLEVBQThCLE1BQTlCLENBQWxCLENBQWQsQ0FBQTtBQUNBO0FBQ0UsVUFBQSxXQUFBLEdBQWMsQ0FBQyxJQUFJLENBQUMsUUFBTCxDQUFjLFdBQWQsQ0FBRCxDQUEyQixDQUFDLEtBQTFDLENBQUE7QUFDQSxVQUFBLElBQUcsV0FBSDtBQUFvQixtQkFBTyxXQUFQLENBQXBCO1dBRkY7U0FBQSxjQUFBO0FBSUUsVUFESSxZQUNKLENBQUE7QUFBQSxVQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNkIsaUNBQUEsR0FBaUMsWUFBOUQsRUFDRTtBQUFBLFlBQUEsV0FBQSxFQUFhLElBQWI7QUFBQSxZQUNBLE1BQUEsRUFBUSxFQUFBLEdBQUcsR0FBRyxDQUFDLE9BRGY7V0FERixDQUFBLENBSkY7U0FGRjtPQUFBO0FBU0EsYUFBTyxFQUFQLENBWG1CO0lBQUEsQ0ExZnJCLENBQUE7O0FBQUEseUJBMGdCQSxzQkFBQSxHQUF3QixTQUFDLFdBQUQsR0FBQTtBQU10QixVQUFBLDJEQUFBO0FBQUEsTUFBQSxtQkFBQSxHQUNFO0FBQUEsUUFBQSxTQUFBLEVBQVcsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFYO0FBQUEsUUFDQSxjQUFBLEVBQWdCLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FEaEI7QUFBQSxRQUVBLHlCQUFBLEVBQTJCO1VBQ3pCLENBRHlCLEVBRXpCO0FBQUEsWUFBQSxXQUFBLEVBQWEsVUFBYjtBQUFBLFlBQ0EsUUFBQSxFQUFVLFVBRFY7V0FGeUI7U0FGM0I7T0FERixDQUFBO0FBU0EsTUFBQSxJQUFrQyxNQUFBLENBQUEsV0FBQSxLQUFzQixRQUF4RDtBQUFBLGVBQU8sbUJBQVAsQ0FBQTtPQVRBO0FBQUEsTUFXQSxpQkFBQSxHQUFvQixDQVhwQixDQUFBO0FBQUEsTUFjQSxJQUFBLEdBQU8sV0FBWSxDQUFBLFFBQUEsQ0FkbkIsQ0FBQTtBQWVBLE1BQUEsSUFBRyxNQUFBLENBQUEsSUFBQSxLQUFlLFFBQWYsSUFBMkIsTUFBQSxDQUFBLElBQUEsS0FBZSxRQUE3QztBQUNFLFFBQUEsYUFBQSxHQUFpQixpQkFBQSxHQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBQSxDQUFyQyxDQURGO09BQUEsTUFFSyxJQUFHLE1BQUEsQ0FBQSxJQUFBLEtBQWUsUUFBbEI7QUFDSCxRQUFBLElBQUcsTUFBQSxDQUFBLElBQVksQ0FBQSxDQUFBLENBQVosS0FBa0IsUUFBckI7QUFDRSxVQUFBLGFBQUEsR0FBaUIsSUFBSyxDQUFBLENBQUEsQ0FBTCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFBLENBQTNCLENBREY7U0FBQSxNQUFBO0FBRUssVUFBQSxhQUFBLEdBQWlCLENBQWpCLENBRkw7U0FERztPQUFBLE1BQUE7QUFJQSxRQUFBLGFBQUEsR0FBaUIsQ0FBakIsQ0FKQTtPQWpCTDtBQUFBLE1BdUJBLElBQUEsR0FBTyxXQUFZLENBQUEsa0JBQUEsQ0F2Qm5CLENBQUE7QUF3QkEsTUFBQSxJQUFHLE1BQUEsQ0FBQSxJQUFBLEtBQWUsUUFBZixJQUEyQixNQUFBLENBQUEsSUFBQSxLQUFlLFFBQTdDO0FBQ0UsUUFBQSxtQkFBbUIsQ0FBQyxTQUFVLENBQUEsQ0FBQSxDQUE5QixHQUFtQyxJQUFuQyxDQUFBO0FBQUEsUUFDQSxtQkFBbUIsQ0FBQyxTQUFVLENBQUEsQ0FBQSxDQUE5QixHQUFtQyxpQkFBQSxHQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBQSxDQUR2RCxDQURGO09BQUEsTUFHSyxJQUFHLE1BQUEsQ0FBQSxJQUFBLEtBQWUsUUFBbEI7QUFDSCxRQUFBLG1CQUFtQixDQUFDLFNBQVUsQ0FBQSxDQUFBLENBQTlCLEdBQW1DLElBQUssQ0FBQSxDQUFBLENBQXhDLENBQUE7QUFDQSxRQUFBLElBQUcsTUFBQSxDQUFBLElBQVksQ0FBQSxDQUFBLENBQVosS0FBa0IsUUFBckI7QUFDRSxVQUFBLG1CQUFtQixDQUFDLFNBQVUsQ0FBQSxDQUFBLENBQTlCLEdBQW1DLElBQUssQ0FBQSxDQUFBLENBQUwsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBQSxDQUE3QyxDQURGO1NBQUEsTUFBQTtBQUVLLFVBQUEsbUJBQW1CLENBQUMsU0FBVSxDQUFBLENBQUEsQ0FBOUIsR0FBbUMsQ0FBbkMsQ0FGTDtTQUZHO09BQUEsTUFBQTtBQUtBLFFBQUEsbUJBQW1CLENBQUMsU0FBVSxDQUFBLENBQUEsQ0FBOUIsR0FBbUMsYUFBbkMsQ0FMQTtPQTNCTDtBQUFBLE1Ba0NBLElBQUEsR0FBTyxXQUFZLENBQUEsd0JBQUEsQ0FsQ25CLENBQUE7QUFtQ0EsTUFBQSxJQUFHLE1BQUEsQ0FBQSxJQUFBLEtBQWUsUUFBZixJQUEyQixNQUFBLENBQUEsSUFBQSxLQUFlLFFBQTdDO0FBQ0UsUUFBQSxtQkFBbUIsQ0FBQyxjQUFlLENBQUEsQ0FBQSxDQUFuQyxHQUF3QyxJQUF4QyxDQUFBO0FBQUEsUUFDQSxtQkFBbUIsQ0FBQyxjQUFlLENBQUEsQ0FBQSxDQUFuQyxHQUF3QyxpQkFBQSxHQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBQSxDQUQ1RCxDQURGO09BQUEsTUFHSyxJQUFHLE1BQUEsQ0FBQSxJQUFBLEtBQWUsUUFBbEI7QUFDSCxRQUFBLG1CQUFtQixDQUFDLGNBQWUsQ0FBQSxDQUFBLENBQW5DLEdBQXdDLElBQUssQ0FBQSxDQUFBLENBQTdDLENBQUE7QUFDQSxRQUFBLElBQUcsTUFBQSxDQUFBLElBQVksQ0FBQSxDQUFBLENBQVosS0FBa0IsUUFBckI7QUFDRSxVQUFBLG1CQUFtQixDQUFDLGNBQWUsQ0FBQSxDQUFBLENBQW5DLEdBQXdDLElBQUssQ0FBQSxDQUFBLENBQUwsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBQSxDQUFsRCxDQURGO1NBQUEsTUFBQTtBQUVLLFVBQUEsbUJBQW1CLENBQUMsY0FBZSxDQUFBLENBQUEsQ0FBbkMsR0FBd0MsQ0FBeEMsQ0FGTDtTQUZHO09BQUEsTUFBQTtBQUtBLFFBQUEsbUJBQW1CLENBQUMsY0FBZSxDQUFBLENBQUEsQ0FBbkMsR0FBd0MsYUFBeEMsQ0FMQTtPQXRDTDtBQUFBLE1BNkNBLElBQUEsR0FBTyxXQUFZLENBQUEsb0NBQUEsQ0E3Q25CLENBQUE7QUFBQSxNQThDQSxtQkFBbUIsQ0FBQyx5QkFBMEIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFqRCxHQUErRCxVQTlDL0QsQ0FBQTtBQUFBLE1BK0NBLG1CQUFtQixDQUFDLHlCQUEwQixDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQWpELEdBQTRELFVBL0M1RCxDQUFBO0FBZ0RBLE1BQUEsSUFBRyxNQUFBLENBQUEsSUFBQSxLQUFlLFFBQWYsSUFBMkIsTUFBQSxDQUFBLElBQUEsS0FBZSxRQUE3QztBQUNFLFFBQUEsbUJBQW1CLENBQUMseUJBQTBCLENBQUEsQ0FBQSxDQUE5QyxHQUFtRCxJQUFuRCxDQURGO09BQUEsTUFFSyxJQUFHLE1BQUEsQ0FBQSxJQUFBLEtBQWUsUUFBbEI7QUFDSCxRQUFBLG1CQUFtQixDQUFDLHlCQUEwQixDQUFBLENBQUEsQ0FBOUMsR0FBbUQsSUFBSyxDQUFBLENBQUEsQ0FBeEQsQ0FBQTtBQUNBLFFBQUEsSUFBRyxNQUFBLENBQUEsSUFBWSxDQUFBLENBQUEsQ0FBWixLQUFrQixRQUFyQjtBQUNFLFVBQUEsbUJBQW1CLENBQUMseUJBQTBCLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBakQsR0FDRSxtQkFBbUIsQ0FBQyx5QkFBMEIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFqRCxHQUNFLElBQUssQ0FBQSxDQUFBLENBRlQsQ0FERjtTQUFBLE1BQUE7QUFLRSxVQUFBLElBQUcsMkJBQUg7QUFDRSxZQUFBLG1CQUFtQixDQUFDLHlCQUEwQixDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQWpELEdBQStELElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUF2RSxDQURGO1dBQUE7QUFFQSxVQUFBLElBQUcsd0JBQUg7QUFDRSxZQUFBLG1CQUFtQixDQUFDLHlCQUEwQixDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQWpELEdBQTRELElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFwRSxDQURGO1dBUEY7U0FGRztPQWxETDtBQThEQSxhQUFPLG1CQUFQLENBcEVzQjtJQUFBLENBMWdCeEIsQ0FBQTs7QUFBQSx5QkFtbEJBLHVCQUFBLEdBQXlCLFNBQUUsR0FBRixFQUFPLFNBQVAsRUFBa0Isa0JBQWxCLEdBQUE7QUFDdkIsTUFBQSxJQUFHLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyx5QkFBMEIsQ0FBQSxDQUFBLENBQWxEO0FBQ0UsUUFBQSxJQUFHLGtCQUFBLEtBQXNCLFVBQXpCO2lCQUNFLElBQUMsQ0FBQSxTQUFELENBQVc7QUFBQSxZQUFDLEdBQUEsRUFBSyxHQUFOO0FBQUEsWUFBVyxXQUFBLEVBQWEsU0FBUyxDQUFDLGNBQWxDO1dBQVgsRUFERjtTQUFBLE1BRUssSUFBRyxrQkFBQSxLQUFzQixXQUF6QjtpQkFDSCxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsWUFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLFlBQVcsV0FBQSxFQUFhLFNBQVMsQ0FBQyxvQkFBbEM7V0FBWCxFQURHO1NBQUEsTUFFQSxJQUFHLGtCQUFBLEtBQXNCLFVBQXpCO0FBQ0gsVUFBQSxJQUFHLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxjQUFlLENBQUEsQ0FBQSxDQUF2QzttQkFDRSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsY0FBQyxHQUFBLEVBQUssR0FBTjtBQUFBLGNBQVksV0FBQSxFQUFhLFNBQVMsQ0FBQyxjQUFuQztBQUFBLGNBQW1ELGNBQUEsRUFBZ0IsQ0FBbkU7YUFBWCxFQURGO1dBQUEsTUFBQTttQkFHRSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsY0FBQyxHQUFBLEVBQUssR0FBTjtBQUFBLGNBQVksV0FBQSxFQUFhLFNBQVMsQ0FBQyxjQUFuQzthQUFYLEVBSEY7V0FERztTQUFBLE1BS0EsSUFBRyxrQkFBQSxLQUFzQixZQUF6QjtBQUNILFVBQUEsSUFBRyxJQUFDLENBQUEsbUJBQW1CLENBQUMsY0FBZSxDQUFBLENBQUEsQ0FBdkM7bUJBQ0UsSUFBQyxDQUFBLFNBQUQsQ0FBVztBQUFBLGNBQUMsR0FBQSxFQUFLLEdBQU47QUFBQSxjQUFZLFdBQUEsRUFBYSxTQUFTLENBQUMseUJBQW5DO0FBQUEsY0FBNkQsY0FBQSxFQUFnQixDQUE3RTthQUFYLEVBREY7V0FBQSxNQUFBO21CQUdFLElBQUMsQ0FBQSxTQUFELENBQVc7QUFBQSxjQUFDLEdBQUEsRUFBSyxHQUFOO0FBQUEsY0FBWSxXQUFBLEVBQWEsU0FBUyxDQUFDLHlCQUFuQzthQUFYLEVBSEY7V0FERztTQVZQO09BRHVCO0lBQUEsQ0FubEJ6QixDQUFBOztBQUFBLHlCQTBtQkEsU0FBQSxHQUFXLFNBQUMsT0FBRCxHQUFBO0FBQ1QsVUFBQSxtRUFBQTtBQUFBLE1BQUUsY0FBQSxHQUFGLEVBQU8saUNBQUEsc0JBQVAsRUFBK0Isc0JBQUEsV0FBL0IsRUFBNEMsb0JBQUEsU0FBNUMsRUFBdUQseUJBQUEsY0FBdkQsQ0FBQTtBQUVBLE1BQUEsSUFBRyxTQUFIO0FBQ0UsUUFBQSxJQUFHLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxTQUFVLENBQUEsQ0FBQSxDQUFsQztBQUNFLFVBQUEsSUFBRyxJQUFDLENBQUEsbUJBQW1CLENBQUMsU0FBVSxDQUFBLENBQUEsQ0FBbEM7QUFDRSxZQUFBLFdBQUEsSUFBZSxTQUFBLEdBQVksSUFBQyxDQUFBLG1CQUFtQixDQUFDLFNBQVUsQ0FBQSxDQUFBLENBQTFELENBREY7V0FERjtTQURGO09BRkE7QUFNQSxNQUFBLElBQUcsY0FBSDtBQUNFLFFBQUEsSUFBRyxJQUFDLENBQUEsbUJBQW1CLENBQUMsY0FBZSxDQUFBLENBQUEsQ0FBdkM7QUFDRSxVQUFBLElBQUcsSUFBQyxDQUFBLG1CQUFtQixDQUFDLGNBQWUsQ0FBQSxDQUFBLENBQXZDO0FBQ0UsWUFBQSxXQUFBLElBQWUsY0FBQSxHQUFpQixJQUFDLENBQUEsbUJBQW1CLENBQUMsY0FBZSxDQUFBLENBQUEsQ0FBcEUsQ0FERjtXQURGO1NBREY7T0FOQTtBQWFBLE1BQUEsSUFBRyxzQkFBSDtBQUNFLFFBQUEsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLEdBQWhDLENBQUEsR0FBdUMsV0FBMUM7QUFDRSxVQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBbUMsR0FBbkMsRUFBd0MsV0FBeEMsRUFBcUQ7QUFBQSxZQUFFLHlCQUFBLEVBQTJCLEtBQTdCO1dBQXJELENBQUEsQ0FBQTtBQUNBLGlCQUFPLElBQVAsQ0FGRjtTQURGO09BQUEsTUFBQTtBQUtFLFFBQUEsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLEdBQWhDLENBQUEsS0FBMEMsV0FBN0M7QUFDRSxVQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBbUMsR0FBbkMsRUFBd0MsV0FBeEMsRUFBcUQ7QUFBQSxZQUFFLHlCQUFBLEVBQTJCLEtBQTdCO1dBQXJELENBQUEsQ0FBQTtBQUNBLGlCQUFPLElBQVAsQ0FGRjtTQUxGO09BYkE7QUFxQkEsYUFBTyxLQUFQLENBdEJTO0lBQUEsQ0ExbUJYLENBQUE7O3NCQUFBOztNQTlCRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/auto-indent.coffee

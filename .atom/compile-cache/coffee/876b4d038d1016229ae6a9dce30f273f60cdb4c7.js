(function() {
  var COMPLETIONS, JSXATTRIBUTE, JSXENDTAGSTART, JSXREGEXP, JSXSTARTTAGEND, JSXTAG, Point, REACTURL, Range, TAGREGEXP, filter, score, _ref, _ref1,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require("atom"), Range = _ref.Range, Point = _ref.Point;

  _ref1 = require("fuzzaldrin"), filter = _ref1.filter, score = _ref1.score;

  JSXSTARTTAGEND = 0;

  JSXENDTAGSTART = 1;

  JSXTAG = 2;

  JSXATTRIBUTE = 3;

  JSXREGEXP = /(?:(<)|(<\/))([$_A-Za-z](?:[$._:\-a-zA-Z0-9])*)|(?:(\/>)|(>))/g;

  TAGREGEXP = /<([$_a-zA-Z][$._:\-a-zA-Z0-9]*)($|\s|\/>|>)/g;

  COMPLETIONS = require("./completions-jsx");

  REACTURL = "http://facebook.github.io/react/docs/tags-and-attributes.html";

  module.exports = {
    selector: ".meta.tag.jsx",
    inclusionPriority: 10000,
    excludeLowerPriority: false,
    getSuggestions: function(opts) {
      var attribute, bufferPosition, editor, elementObj, filteredAttributes, htmlElement, htmlElements, jsxRange, jsxTag, prefix, scopeDescriptor, startOfJSX, suggestions, tagName, tagNameStack, _i, _j, _k, _len, _len1, _len2, _ref2;
      editor = opts.editor, bufferPosition = opts.bufferPosition, scopeDescriptor = opts.scopeDescriptor, prefix = opts.prefix;
      if (editor.getGrammar().packageName !== "language-babel") {
        return;
      }
      jsxTag = this.getTriggerTag(editor, bufferPosition);
      if (jsxTag == null) {
        return;
      }
      suggestions = [];
      if (jsxTag === JSXSTARTTAGEND) {
        startOfJSX = this.getStartOfJSX(editor, bufferPosition);
        jsxRange = new Range(startOfJSX, bufferPosition);
        tagNameStack = this.buildTagStack(editor, jsxRange);
        while ((tagName = tagNameStack.pop()) != null) {
          suggestions.push({
            snippet: "$1</" + tagName + ">",
            type: "tag",
            description: "language-babel tag closer"
          });
        }
      } else if (jsxTag === JSXENDTAGSTART) {
        startOfJSX = this.getStartOfJSX(editor, bufferPosition);
        jsxRange = new Range(startOfJSX, bufferPosition);
        tagNameStack = this.buildTagStack(editor, jsxRange);
        while ((tagName = tagNameStack.pop()) != null) {
          suggestions.push({
            snippet: "" + tagName + ">",
            type: "tag",
            description: "language-babel tag closer"
          });
        }
      } else if (jsxTag === JSXTAG) {
        if (!/^[a-z]/g.exec(prefix)) {
          return;
        }
        htmlElements = filter(COMPLETIONS.htmlElements, prefix, {
          key: "name"
        });
        for (_i = 0, _len = htmlElements.length; _i < _len; _i++) {
          htmlElement = htmlElements[_i];
          if (score(htmlElement.name, prefix) < 0.07) {
            continue;
          }
          suggestions.push({
            snippet: htmlElement.name,
            type: "tag",
            description: "language-babel JSX supported elements",
            descriptionMoreURL: REACTURL
          });
        }
      } else if (jsxTag === JSXATTRIBUTE) {
        tagName = this.getThisTagName(editor, bufferPosition);
        if (tagName == null) {
          return;
        }
        _ref2 = COMPLETIONS.htmlElements;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          elementObj = _ref2[_j];
          if (elementObj.name === tagName) {
            break;
          }
        }
        elementObj.attributes = elementObj.attributes.concat(COMPLETIONS.globalAttributes);
        elementObj.attributes = elementObj.attributes.concat(COMPLETIONS.events);
        filteredAttributes = filter(elementObj.attributes, prefix, {
          key: "name"
        });
        for (_k = 0, _len2 = filteredAttributes.length; _k < _len2; _k++) {
          attribute = filteredAttributes[_k];
          if (score(attribute.name, prefix) < 0.07) {
            continue;
          }
          suggestions.push({
            snippet: attribute.name,
            type: "attribute",
            rightLabel: "<" + tagName + ">",
            description: "language-babel JSXsupported attributes/events",
            descriptionMoreURL: REACTURL
          });
        }
      } else {
        return;
      }
      return suggestions;
    },
    getThisTagName: function(editor, bufferPosition) {
      var column, match, matches, row, rowText, scopes;
      row = bufferPosition.row;
      column = null;
      while (row >= 0) {
        rowText = editor.lineTextForBufferRow(row);
        if (column == null) {
          rowText = rowText.substr(0, column = bufferPosition.column);
        }
        matches = [];
        while ((match = TAGREGEXP.exec(rowText)) !== null) {
          scopes = editor.scopeDescriptorForBufferPosition([row, match.index + 1]).getScopesArray();
          if (__indexOf.call(scopes, "entity.name.tag.open.jsx") >= 0) {
            matches.push(match[1]);
          }
        }
        if (matches.length) {
          return matches.pop();
        } else {
          row--;
        }
      }
    },
    getTriggerTag: function(editor, bufferPosition) {
      var column, scopes;
      column = bufferPosition.column - 1;
      if (column >= 0) {
        scopes = editor.scopeDescriptorForBufferPosition([bufferPosition.row, column]).getScopesArray();
        if (__indexOf.call(scopes, "entity.other.attribute-name.jsx") >= 0) {
          return JSXATTRIBUTE;
        }
        if (__indexOf.call(scopes, "entity.name.tag.open.jsx") >= 0) {
          return JSXTAG;
        }
        if (__indexOf.call(scopes, "JSXStartTagEnd") >= 0) {
          return JSXSTARTTAGEND;
        }
        if (__indexOf.call(scopes, "JSXEndTagStart") >= 0) {
          return JSXENDTAGSTART;
        }
      }
    },
    getStartOfJSX: function(editor, bufferPosition) {
      var column, columnLen, row;
      row = bufferPosition.row;
      while (row >= 0) {
        if (__indexOf.call(editor.scopeDescriptorForBufferPosition([row, 0]).getScopesArray(), "meta.tag.jsx") < 0) {
          break;
        }
        row--;
      }
      if (row < 0) {
        row = 0;
      }
      columnLen = editor.lineTextForBufferRow(row).length;
      column = 0;
      while (column < columnLen) {
        if (__indexOf.call(editor.scopeDescriptorForBufferPosition([row, column]).getScopesArray(), "meta.tag.jsx") >= 0) {
          break;
        }
        column++;
      }
      if (column === columnLen) {
        row++;
        column = 0;
      }
      return new Point(row, column);
    },
    buildTagStack: function(editor, range) {
      var closedtag, line, match, matchColumn, matchPointEnd, matchPointStart, matchRange, row, scopes, tagNameStack;
      tagNameStack = [];
      row = range.start.row;
      while (row <= range.end.row) {
        line = editor.lineTextForBufferRow(row);
        while ((match = JSXREGEXP.exec(line)) !== null) {
          matchColumn = match.index;
          matchPointStart = new Point(row, matchColumn);
          matchPointEnd = new Point(row, matchColumn + match[0].length - 1);
          matchRange = new Range(matchPointStart, matchPointEnd);
          if (range.intersectsWith(matchRange)) {
            scopes = editor.scopeDescriptorForBufferPosition([row, match.index]).getScopesArray();
            if (__indexOf.call(scopes, "punctuation.definition.tag.jsx") < 0) {
              continue;
            }
            if (match[1] != null) {
              tagNameStack.push(match[3]);
            } else if (match[2] != null) {
              closedtag = tagNameStack.pop();
              if (closedtag !== match[3]) {
                tagNameStack.push(closedtag);
              }
            } else if (match[4] != null) {
              tagNameStack.pop();
            }
          }
        }
        row++;
      }
      return tagNameStack;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL2F1dG8tY29tcGxldGUtanN4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwySUFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLFFBQWtCLE9BQUEsQ0FBUSxZQUFSLENBQWxCLEVBQUMsZUFBQSxNQUFELEVBQVMsY0FBQSxLQURULENBQUE7O0FBQUEsRUFJQSxjQUFBLEdBQWlCLENBSmpCLENBQUE7O0FBQUEsRUFLQSxjQUFBLEdBQWlCLENBTGpCLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsQ0FOVCxDQUFBOztBQUFBLEVBT0EsWUFBQSxHQUFlLENBUGYsQ0FBQTs7QUFBQSxFQVNBLFNBQUEsR0FBWSxnRUFUWixDQUFBOztBQUFBLEVBVUEsU0FBQSxHQUFhLDhDQVZiLENBQUE7O0FBQUEsRUFXQSxXQUFBLEdBQWMsT0FBQSxDQUFRLG1CQUFSLENBWGQsQ0FBQTs7QUFBQSxFQVlBLFFBQUEsR0FBVywrREFaWCxDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLGVBQVY7QUFBQSxJQUNBLGlCQUFBLEVBQW1CLEtBRG5CO0FBQUEsSUFFQSxvQkFBQSxFQUFzQixLQUZ0QjtBQUFBLElBS0EsY0FBQSxFQUFnQixTQUFDLElBQUQsR0FBQTtBQUNkLFVBQUEsOE5BQUE7QUFBQSxNQUFDLGNBQUEsTUFBRCxFQUFTLHNCQUFBLGNBQVQsRUFBeUIsdUJBQUEsZUFBekIsRUFBMEMsY0FBQSxNQUExQyxDQUFBO0FBQ0EsTUFBQSxJQUFVLE1BQU0sQ0FBQyxV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

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/auto-complete-jsx.coffee

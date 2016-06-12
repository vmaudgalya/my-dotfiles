(function() {
  var AncestorsMethods, ColorResultsElement, CompositeDisposable, EventsDelegation, Range, SpacePenDSL, fs, path, removeLeadingWhitespace, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  fs = require('fs-plus');

  path = require('path');

  _ref = require('atom'), Range = _ref.Range, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-utils'), SpacePenDSL = _ref1.SpacePenDSL, EventsDelegation = _ref1.EventsDelegation, AncestorsMethods = _ref1.AncestorsMethods;

  removeLeadingWhitespace = function(string) {
    return string.replace(/^\s+/, '');
  };

  ColorResultsElement = (function(_super) {
    __extends(ColorResultsElement, _super);

    function ColorResultsElement() {
      return ColorResultsElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(ColorResultsElement);

    EventsDelegation.includeInto(ColorResultsElement);

    ColorResultsElement.content = function() {
      return this.tag('atom-panel', {
        outlet: 'pane',
        "class": 'preview-pane pane-item'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            _this.span({
              outlet: 'previewCount',
              "class": 'preview-count inline-block'
            });
            return _this.div({
              outlet: 'loadingMessage',
              "class": 'inline-block'
            }, function() {
              _this.div({
                "class": 'loading loading-spinner-tiny inline-block'
              });
              return _this.div({
                outlet: 'searchedCountBlock',
                "class": 'inline-block'
              }, function() {
                _this.span({
                  outlet: 'searchedCount',
                  "class": 'searched-count'
                });
                return _this.span(' paths searched');
              });
            });
          });
          return _this.ol({
            outlet: 'resultsList',
            "class": 'search-colors-results results-view list-tree focusable-panel has-collapsable-children native-key-bindings',
            tabindex: -1
          });
        };
      })(this));
    };

    ColorResultsElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.pathMapping = {};
      this.files = 0;
      this.colors = 0;
      this.loadingMessage.style.display = 'none';
      this.subscriptions.add(this.subscribeTo(this, '.list-nested-item > .list-item', {
        click: function(e) {
          var fileItem;
          e.stopPropagation();
          fileItem = AncestorsMethods.parents(e.target, '.list-nested-item')[0];
          return fileItem.classList.toggle('collapsed');
        }
      }));
      return this.subscriptions.add(this.subscribeTo(this, '.search-result', {
        click: (function(_this) {
          return function(e) {
            var fileItem, matchItem, pathAttribute, range;
            e.stopPropagation();
            matchItem = e.target.matches('.search-result') ? e.target : AncestorsMethods.parents(e.target, '.search-result')[0];
            fileItem = AncestorsMethods.parents(matchItem, '.list-nested-item')[0];
            range = Range.fromObject([matchItem.dataset.start.split(',').map(Number), matchItem.dataset.end.split(',').map(Number)]);
            pathAttribute = fileItem.dataset.path;
            return atom.workspace.open(_this.pathMapping[pathAttribute]).then(function(editor) {
              return editor.setSelectedBufferRange(range, {
                autoscroll: true
              });
            });
          };
        })(this)
      }));
    };

    ColorResultsElement.prototype.setModel = function(colorSearch) {
      this.colorSearch = colorSearch;
      this.subscriptions.add(this.colorSearch.onDidFindMatches((function(_this) {
        return function(result) {
          return _this.addFileResult(result);
        };
      })(this)));
      this.subscriptions.add(this.colorSearch.onDidCompleteSearch((function(_this) {
        return function() {
          return _this.searchComplete();
        };
      })(this)));
      return this.colorSearch.search();
    };

    ColorResultsElement.prototype.addFileResult = function(result) {
      this.files += 1;
      this.colors += result.matches.length;
      this.resultsList.innerHTML += this.createFileResult(result);
      return this.updateMessage();
    };

    ColorResultsElement.prototype.searchComplete = function() {
      this.updateMessage();
      if (this.colors === 0) {
        this.pane.classList.add('no-results');
        return this.pane.appendChild("<ul class='centered background-message no-results-overlay'>\n  <li>No Results</li>\n</ul>");
      }
    };

    ColorResultsElement.prototype.updateMessage = function() {
      var filesString;
      filesString = this.files === 1 ? 'file' : 'files';
      return this.previewCount.innerHTML = this.colors > 0 ? "<span class='text-info'>\n  " + this.colors + " colors\n</span>\nfound in\n<span class='text-info'>\n  " + this.files + " " + filesString + "\n</span>" : "No colors found in " + this.files + " " + filesString;
    };

    ColorResultsElement.prototype.createFileResult = function(fileResult) {
      var fileBasename, filePath, matches, pathAttribute, pathName;
      filePath = fileResult.filePath, matches = fileResult.matches;
      fileBasename = path.basename(filePath);
      pathAttribute = _.escapeAttribute(filePath);
      this.pathMapping[pathAttribute] = filePath;
      pathName = atom.project.relativize(filePath);
      return "<li class=\"path list-nested-item\" data-path=\"" + pathAttribute + "\">\n  <div class=\"path-details list-item\">\n    <span class=\"disclosure-arrow\"></span>\n    <span class=\"icon icon-file-text\" data-name=\"" + fileBasename + "\"></span>\n    <span class=\"path-name bright\">" + pathName + "</span>\n    <span class=\"path-match-number\">(" + matches.length + ")</span></div>\n  </div>\n  <ul class=\"matches list-tree\">\n    " + (matches.map((function(_this) {
        return function(match) {
          return _this.createMatchResult(match);
        };
      })(this)).join('')) + "\n  </ul>\n</li>";
    };

    ColorResultsElement.prototype.createMatchResult = function(match) {
      var filePath, lineNumber, matchEnd, matchStart, prefix, range, style, suffix, textColor;
      textColor = match.color.luma > 0.43 ? 'black' : 'white';
      filePath = match.filePath, range = match.range;
      range = Range.fromObject(range);
      matchStart = range.start.column - match.lineTextOffset;
      matchEnd = range.end.column - match.lineTextOffset;
      prefix = removeLeadingWhitespace(match.lineText.slice(0, matchStart));
      suffix = match.lineText.slice(matchEnd);
      lineNumber = range.start.row + 1;
      style = '';
      style += "background: " + (match.color.toCSS()) + ";";
      style += "color: " + textColor + ";";
      return "<li class=\"search-result list-item\" data-start=\"" + range.start.row + "," + range.start.column + "\" data-end=\"" + range.end.row + "," + range.end.column + "\">\n  <span class=\"line-number text-subtle\">" + lineNumber + "</span>\n  <span class=\"preview\">\n    " + prefix + "\n    <span class='match color-match' style='" + style + "'>" + match.matchText + "</span>\n    " + suffix + "\n  </span>\n</li>";
    };

    return ColorResultsElement;

  })(HTMLElement);

  module.exports = ColorResultsElement = document.registerElement('pigments-color-results', {
    prototype: ColorResultsElement.prototype
  });

  ColorResultsElement.registerViewProvider = function(modelClass) {
    return atom.views.addViewProvider(modelClass, function(model) {
      var element;
      element = new ColorResultsElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXJlc3VsdHMtZWxlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUpBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxPQUErQixPQUFBLENBQVEsTUFBUixDQUEvQixFQUFDLGFBQUEsS0FBRCxFQUFRLDJCQUFBLG1CQUhSLENBQUE7O0FBQUEsRUFJQSxRQUFvRCxPQUFBLENBQVEsWUFBUixDQUFwRCxFQUFDLG9CQUFBLFdBQUQsRUFBYyx5QkFBQSxnQkFBZCxFQUFnQyx5QkFBQSxnQkFKaEMsQ0FBQTs7QUFBQSxFQU1BLHVCQUFBLEdBQTBCLFNBQUMsTUFBRCxHQUFBO1dBQVksTUFBTSxDQUFDLE9BQVAsQ0FBZSxNQUFmLEVBQXVCLEVBQXZCLEVBQVo7RUFBQSxDQU4xQixDQUFBOztBQUFBLEVBUU07QUFDSiwwQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxXQUFXLENBQUMsV0FBWixDQUF3QixtQkFBeEIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsbUJBQTdCLENBREEsQ0FBQTs7QUFBQSxJQUdBLG1CQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssWUFBTCxFQUFtQjtBQUFBLFFBQUEsTUFBQSxFQUFRLE1BQVI7QUFBQSxRQUFnQixPQUFBLEVBQU8sd0JBQXZCO09BQW5CLEVB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-results-element.coffee

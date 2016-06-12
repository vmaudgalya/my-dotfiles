(function() {
  module.exports = function() {
    return {
      Parent: null,
      SmartColor: (require('./modules/SmartColor'))(),
      SmartVariable: (require('./modules/SmartVariable'))(),
      Emitter: (require('./modules/Emitter'))(),
      extensions: {},
      getExtension: function(extensionName) {
        return this.extensions[extensionName];
      },
      isFirstOpen: true,
      canOpen: true,
      element: null,
      selection: null,
      listeners: [],
      activate: function() {
        var onMouseDown, onMouseMove, onMouseUp, onMouseWheel, onResize, _workspace, _workspaceView;
        _workspace = atom.workspace;
        _workspaceView = atom.views.getView(_workspace);
        this.element = {
          el: (function() {
            var _el;
            _el = document.createElement('div');
            _el.classList.add('ColorPicker');
            return _el;
          })(),
          remove: function() {
            return this.el.parentNode.removeChild(this.el);
          },
          addClass: function(className) {
            this.el.classList.add(className);
            return this;
          },
          removeClass: function(className) {
            this.el.classList.remove(className);
            return this;
          },
          hasClass: function(className) {
            return this.el.classList.contains(className);
          },
          width: function() {
            return this.el.offsetWidth;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          setHeight: function(height) {
            return this.el.style.height = "" + height + "px";
          },
          hasChild: function(child) {
            var _parent;
            if (child && (_parent = child.parentNode)) {
              if (child === this.el) {
                return true;
              } else {
                return this.hasChild(_parent);
              }
            }
            return false;
          },
          isOpen: function() {
            return this.hasClass('is--open');
          },
          open: function() {
            return this.addClass('is--open');
          },
          close: function() {
            return this.removeClass('is--open');
          },
          isFlipped: function() {
            return this.hasClass('is--flipped');
          },
          flip: function() {
            return this.addClass('is--flipped');
          },
          unflip: function() {
            return this.removeClass('is--flipped');
          },
          setPosition: function(x, y) {
            this.el.style.left = "" + x + "px";
            this.el.style.top = "" + y + "px";
            return this;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        this.loadExtensions();
        this.listeners.push([
          'mousedown', onMouseDown = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              _this.emitMouseDown(e, _isPickerEvent);
              if (!_isPickerEvent) {
                return _this.close();
              }
            };
          })(this)
        ]);
        window.addEventListener('mousedown', onMouseDown, true);
        this.listeners.push([
          'mousemove', onMouseMove = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseMove(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mousemove', onMouseMove, true);
        this.listeners.push([
          'mouseup', onMouseUp = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseUp(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mouseup', onMouseUp, true);
        this.listeners.push([
          'mousewheel', onMouseWheel = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseWheel(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mousewheel', onMouseWheel);
        _workspaceView.addEventListener('keydown', (function(_this) {
          return function(e) {
            var _isPickerEvent;
            if (!_this.element.isOpen()) {
              return;
            }
            _isPickerEvent = _this.element.hasChild(e.target);
            _this.emitKeyDown(e, _isPickerEvent);
            return _this.close();
          };
        })(this));
        atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            var _editorView, _subscriptionLeft, _subscriptionTop;
            _editorView = atom.views.getView(editor);
            _subscriptionTop = _editorView.onDidChangeScrollTop(function() {
              return _this.close();
            });
            _subscriptionLeft = _editorView.onDidChangeScrollLeft(function() {
              return _this.close();
            });
            editor.onDidDestroy(function() {
              _subscriptionTop.dispose();
              return _subscriptionLeft.dispose();
            });
            _this.onBeforeDestroy(function() {
              _subscriptionTop.dispose();
              return _subscriptionLeft.dispose();
            });
          };
        })(this));
        this.listeners.push([
          'resize', onResize = (function(_this) {
            return function() {
              return _this.close();
            };
          })(this)
        ]);
        window.addEventListener('resize', onResize);
        _workspace.getActivePane().onDidChangeActiveItem((function(_this) {
          return function() {
            return _this.close();
          };
        })(this));
        this.close();
        this.canOpen = true;
        (this.Parent = (atom.views.getView(atom.workspace)).querySelector('.vertical')).appendChild(this.element.el);
        return this;
      },
      destroy: function() {
        var _event, _i, _len, _listener, _ref, _ref1;
        this.emitBeforeDestroy();
        _ref = this.listeners;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _ref1 = _ref[_i], _event = _ref1[0], _listener = _ref1[1];
          window.removeEventListener(_event, _listener);
        }
        this.element.remove();
        return this.canOpen = false;
      },
      loadExtensions: function() {
        var _extension, _i, _len, _ref, _requiredExtension;
        _ref = ['Arrow', 'Color', 'Body', 'Saturation', 'Alpha', 'Hue', 'Definition', 'Return', 'Format'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _extension = _ref[_i];
          _requiredExtension = (require("./extensions/" + _extension))(this);
          this.extensions[_extension] = _requiredExtension;
          if (typeof _requiredExtension.activate === "function") {
            _requiredExtension.activate();
          }
        }
      },
      emitMouseDown: function(e, isOnPicker) {
        return this.Emitter.emit('mouseDown', e, isOnPicker);
      },
      onMouseDown: function(callback) {
        return this.Emitter.on('mouseDown', callback);
      },
      emitMouseMove: function(e, isOnPicker) {
        return this.Emitter.emit('mouseMove', e, isOnPicker);
      },
      onMouseMove: function(callback) {
        return this.Emitter.on('mouseMove', callback);
      },
      emitMouseUp: function(e, isOnPicker) {
        return this.Emitter.emit('mouseUp', e, isOnPicker);
      },
      onMouseUp: function(callback) {
        return this.Emitter.on('mouseUp', callback);
      },
      emitMouseWheel: function(e, isOnPicker) {
        return this.Emitter.emit('mouseWheel', e, isOnPicker);
      },
      onMouseWheel: function(callback) {
        return this.Emitter.on('mouseWheel', callback);
      },
      emitKeyDown: function(e, isOnPicker) {
        return this.Emitter.emit('keyDown', e, isOnPicker);
      },
      onKeyDown: function(callback) {
        return this.Emitter.on('keyDown', callback);
      },
      emitPositionChange: function(position, colorPickerPosition) {
        return this.Emitter.emit('positionChange', position, colorPickerPosition);
      },
      onPositionChange: function(callback) {
        return this.Emitter.on('positionChange', callback);
      },
      emitOpen: function() {
        return this.Emitter.emit('open');
      },
      onOpen: function(callback) {
        return this.Emitter.on('open', callback);
      },
      emitBeforeOpen: function() {
        return this.Emitter.emit('beforeOpen');
      },
      onBeforeOpen: function(callback) {
        return this.Emitter.on('beforeOpen', callback);
      },
      emitClose: function() {
        return this.Emitter.emit('close');
      },
      onClose: function(callback) {
        return this.Emitter.on('close', callback);
      },
      emitBeforeDestroy: function() {
        return this.Emitter.emit('beforeDestroy');
      },
      onBeforeDestroy: function(callback) {
        return this.Emitter.on('beforeDestroy', callback);
      },
      emitInputColor: function(smartColor, wasFound) {
        if (wasFound == null) {
          wasFound = true;
        }
        return this.Emitter.emit('inputColor', smartColor, wasFound);
      },
      onInputColor: function(callback) {
        return this.Emitter.on('inputColor', callback);
      },
      emitInputVariable: function(match) {
        return this.Emitter.emit('inputVariable', match);
      },
      onInputVariable: function(callback) {
        return this.Emitter.on('inputVariable', callback);
      },
      emitInputVariableColor: function(smartColor, pointer) {
        return this.Emitter.emit('inputVariableColor', smartColor, pointer);
      },
      onInputVariableColor: function(callback) {
        return this.Emitter.on('inputVariableColor', callback);
      },
      open: function(Editor, Cursor) {
        var EditorRoot, EditorView, PaneView, _colorMatches, _colorPickerPosition, _convertedColor, _cursorBufferRow, _cursorColumn, _cursorPosition, _cursorScreenRow, _editorOffsetLeft, _editorOffsetTop, _editorScrollTop, _lineContent, _lineHeight, _lineOffsetLeft, _match, _matches, _paneOffsetLeft, _paneOffsetTop, _position, _preferredFormat, _randomColor, _rect, _redColor, _right, _selection, _totalOffsetLeft, _totalOffsetTop, _variableMatches, _visibleRowRange;
        if (Editor == null) {
          Editor = null;
        }
        if (Cursor == null) {
          Cursor = null;
        }
        if (!this.canOpen) {
          return;
        }
        this.emitBeforeOpen();
        if (!Editor) {
          Editor = atom.workspace.getActiveTextEditor();
        }
        EditorView = atom.views.getView(Editor);
        if (!EditorView) {
          return;
        }
        EditorRoot = EditorView.shadowRoot || EditorView;
        this.selection = null;
        if (!Cursor) {
          Cursor = Editor.getLastCursor();
        }
        _visibleRowRange = EditorView.getVisibleRowRange();
        _cursorScreenRow = Cursor.getScreenRow();
        _cursorBufferRow = Cursor.getBufferRow();
        if ((_cursorScreenRow < _visibleRowRange[0]) || (_cursorScreenRow > _visibleRowRange[1])) {
          return;
        }
        _lineContent = Cursor.getCurrentBufferLine();
        _colorMatches = this.SmartColor.find(_lineContent);
        _variableMatches = this.SmartVariable.find(_lineContent, Editor.getPath());
        _matches = _colorMatches.concat(_variableMatches);
        _cursorColumn = Cursor.getBufferColumn();
        _match = (function() {
          var _i, _len;
          for (_i = 0, _len = _matches.length; _i < _len; _i++) {
            _match = _matches[_i];
            if (_match.start <= _cursorColumn && _match.end >= _cursorColumn) {
              return _match;
            }
          }
        })();
        if (_match) {
          Editor.clearSelections();
          _selection = Editor.addSelectionForBufferRange([[_cursorBufferRow, _match.start], [_cursorBufferRow, _match.end]]);
          this.selection = {
            match: _match,
            row: _cursorBufferRow
          };
        } else {
          _cursorPosition = Cursor.getPixelRect();
          this.selection = {
            column: Cursor.getBufferColumn(),
            row: _cursorBufferRow
          };
        }
        if (_match) {
          if (_match.isVariable != null) {
            _match.getDefinition().then((function(_this) {
              return function(definition) {
                var _smartColor;
                _smartColor = (_this.SmartColor.find(definition.value))[0].getSmartColor();
                return _this.emitInputVariableColor(_smartColor, definition.pointer);
              };
            })(this))["catch"]((function(_this) {
              return function(error) {
                return _this.emitInputVariableColor(false);
              };
            })(this));
            this.emitInputVariable(_match);
          } else {
            this.emitInputColor(_match.getSmartColor());
          }
        } else if (atom.config.get('color-picker.randomColor')) {
          _randomColor = this.SmartColor.RGBArray([((Math.random() * 255) + .5) << 0, ((Math.random() * 255) + .5) << 0, ((Math.random() * 255) + .5) << 0]);
          _preferredFormat = atom.config.get('color-picker.preferredFormat');
          _convertedColor = _randomColor["to" + _preferredFormat]();
          _randomColor = this.SmartColor[_preferredFormat](_convertedColor);
          this.emitInputColor(_randomColor, false);
        } else if (this.isFirstOpen) {
          _redColor = this.SmartColor.HEX('#f00');
          _preferredFormat = atom.config.get('color-picker.preferredFormat');
          if (_redColor.format !== _preferredFormat) {
            _convertedColor = _redColor["to" + _preferredFormat]();
            _redColor = this.SmartColor[_preferredFormat](_convertedColor);
          }
          this.isFirstOpen = false;
          this.emitInputColor(_redColor, false);
        }
        PaneView = atom.views.getView(atom.workspace.getActivePane());
        _paneOffsetTop = PaneView.offsetTop;
        _paneOffsetLeft = PaneView.offsetLeft;
        _editorOffsetTop = EditorView.parentNode.offsetTop;
        _editorOffsetLeft = EditorRoot.querySelector('.scroll-view').offsetLeft;
        _editorScrollTop = EditorView.getScrollTop();
        _lineHeight = Editor.getLineHeightInPixels();
        _lineOffsetLeft = EditorRoot.querySelector('.line').offsetLeft;
        if (_match) {
          _rect = EditorView.pixelRectForScreenRange(_selection.getScreenRange());
          _right = _rect.left + _rect.width;
          _cursorPosition = Cursor.getPixelRect();
          _cursorPosition.left = _right - (_rect.width / 2);
        }
        _totalOffsetTop = _paneOffsetTop + _cursorPosition.height - _editorScrollTop + _editorOffsetTop;
        _totalOffsetLeft = _paneOffsetLeft + _editorOffsetLeft + _lineOffsetLeft;
        _position = {
          x: _cursorPosition.left + _totalOffsetLeft,
          y: _cursorPosition.top + _totalOffsetTop
        };
        _colorPickerPosition = {
          x: (function(_this) {
            return function() {
              var _colorPickerWidth, _halfColorPickerWidth, _x;
              _colorPickerWidth = _this.element.width();
              _halfColorPickerWidth = (_colorPickerWidth / 2) << 0;
              _x = Math.max(10, _position.x - _halfColorPickerWidth);
              _x = Math.min(_this.Parent.offsetWidth - _colorPickerWidth - 10, _x);
              return _x;
            };
          })(this)(),
          y: (function(_this) {
            return function() {
              _this.element.unflip();
              if (_this.element.height() + _position.y > _this.Parent.offsetHeight - 32) {
                _this.element.flip();
                return _position.y - _lineHeight - _this.element.height();
              } else {
                return _position.y;
              }
            };
          })(this)()
        };
        this.element.setPosition(_colorPickerPosition.x, _colorPickerPosition.y);
        this.emitPositionChange(_position, _colorPickerPosition);
        requestAnimationFrame((function(_this) {
          return function() {
            _this.element.open();
            return _this.emitOpen();
          };
        })(this));
        return true;
      },
      canReplace: true,
      replace: function(color) {
        var Editor, _cursorEnd, _cursorStart;
        if (!this.canReplace) {
          return;
        }
        this.canReplace = false;
        Editor = atom.workspace.getActiveTextEditor();
        Editor.clearSelections();
        if (this.selection.match) {
          _cursorStart = this.selection.match.start;
          _cursorEnd = this.selection.match.end;
        } else {
          _cursorStart = _cursorEnd = this.selection.column;
        }
        Editor.addSelectionForBufferRange([[this.selection.row, _cursorStart], [this.selection.row, _cursorEnd]]);
        Editor.replaceSelectedText(null, (function(_this) {
          return function() {
            return color;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _ref;
            Editor.setCursorBufferPosition([_this.selection.row, _cursorStart]);
            Editor.clearSelections();
            if ((_ref = _this.selection.match) != null) {
              _ref.end = _cursorStart + color.length;
            }
            Editor.addSelectionForBufferRange([[_this.selection.row, _cursorStart], [_this.selection.row, _cursorStart + color.length]]);
            return setTimeout((function() {
              return _this.canReplace = true;
            }), 100);
          };
        })(this));
      },
      close: function() {
        this.element.close();
        return this.emitClose();
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9Db2xvclBpY2tlci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUlJO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQUE7V0FDYjtBQUFBLE1BQUEsTUFBQSxFQUFRLElBQVI7QUFBQSxNQUVBLFVBQUEsRUFBWSxDQUFDLE9BQUEsQ0FBUSxzQkFBUixDQUFELENBQUEsQ0FBQSxDQUZaO0FBQUEsTUFHQSxhQUFBLEVBQWUsQ0FBQyxPQUFBLENBQVEseUJBQVIsQ0FBRCxDQUFBLENBQUEsQ0FIZjtBQUFBLE1BSUEsT0FBQSxFQUFTLENBQUMsT0FBQSxDQUFRLG1CQUFSLENBQUQsQ0FBQSxDQUFBLENBSlQ7QUFBQSxNQU1BLFVBQUEsRUFBWSxFQU5aO0FBQUEsTUFPQSxZQUFBLEVBQWMsU0FBQyxhQUFELEdBQUE7ZUFBbUIsSUFBQyxDQUFBLFVBQVcsQ0FBQSxhQUFBLEVBQS9CO01BQUEsQ0FQZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7QUFBQSxNQVVBLE9BQUEsRUFBUyxJQVZUO0FBQUEsTUFXQSxPQUFBLEVBQVMsSUFYVDtBQUFBLE1BWUEsU0FBQSxFQUFXLElBWlg7QUFBQSxNQWNBLFNBQUEsRUFBVyxFQWRYO0FBQUEsTUFtQkEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNOLFlBQUEsdUZBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsU0FBbEIsQ0FBQTtBQUFBLFFBQ0EsY0FBQSxHQUFpQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsVUFBbkIsQ0FEakIsQ0FBQTtBQUFBLFFBS0EsSUFBQyxDQUFBLE9BQUQsR0FDSTtBQUFBLFVBQUEsRUFBQSxFQUFPLENBQUEsU0FBQSxHQUFBO0FBQ0gs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/ColorPicker-view.coffee

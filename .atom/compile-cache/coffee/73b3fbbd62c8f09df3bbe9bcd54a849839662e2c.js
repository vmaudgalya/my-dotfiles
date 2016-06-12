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
        return this.element.remove();
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
      open: function() {
        var Cursor, Editor, EditorRoot, EditorView, PaneView, _colorMatches, _colorPickerPosition, _convertedColor, _cursorBufferRow, _cursorColumn, _cursorPosition, _cursorScreenRow, _editorOffsetLeft, _editorOffsetTop, _editorScrollTop, _lineContent, _lineHeight, _lineOffsetLeft, _match, _matches, _paneOffsetLeft, _paneOffsetTop, _position, _preferredFormat, _randomColor, _rect, _redColor, _right, _selection, _totalOffsetLeft, _totalOffsetTop, _variableMatches, _visibleRowRange;
        if (!this.canOpen) {
          return;
        }
        this.emitBeforeOpen();
        Editor = atom.workspace.getActiveTextEditor();
        EditorView = atom.views.getView(Editor);
        if (!EditorView) {
          return;
        }
        EditorRoot = EditorView.shadowRoot || EditorView;
        this.selection = null;
        Cursor = Editor.getLastCursor();
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

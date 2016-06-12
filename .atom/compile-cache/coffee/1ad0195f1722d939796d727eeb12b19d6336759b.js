(function() {
  var BetaAdater, CompositeDisposable, DecorationManagement, Emitter, LegacyAdater, Minimap, nextModelId, _ref;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  DecorationManagement = require('./mixins/decoration-management');

  LegacyAdater = require('./adapters/legacy-adapter');

  BetaAdater = require('./adapters/beta-adapter');

  nextModelId = 1;

  module.exports = Minimap = (function() {
    DecorationManagement.includeInto(Minimap);


    /* Public */

    function Minimap(options) {
      var subs;
      if (options == null) {
        options = {};
      }
      this.textEditor = options.textEditor, this.standAlone = options.standAlone, this.width = options.width, this.height = options.height;
      if (this.textEditor == null) {
        throw new Error('Cannot create a minimap without an editor');
      }
      this.id = nextModelId++;
      this.emitter = new Emitter;
      this.subscriptions = subs = new CompositeDisposable;
      this.initializeDecorations();
      if (atom.views.getView(this.textEditor).getScrollTop != null) {
        this.adapter = new BetaAdater(this.textEditor);
      } else {
        this.adapter = new LegacyAdater(this.textEditor);
      }
      if (this.standAlone) {
        this.scrollTop = 0;
      }
      subs.add(atom.config.observe('editor.scrollPastEnd', (function(_this) {
        return function(scrollPastEnd) {
          _this.scrollPastEnd = scrollPastEnd;
          _this.adapter.scrollPastEnd = _this.scrollPastEnd;
          return _this.emitter.emit('did-change-config', {
            config: 'editor.scrollPastEnd',
            value: _this.scrollPastEnd
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charHeight', (function(_this) {
        return function(configCharHeight) {
          _this.configCharHeight = configCharHeight;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charHeight',
            value: _this.getCharHeight()
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(configCharWidth) {
          _this.configCharWidth = configCharWidth;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charWidth',
            value: _this.getCharWidth()
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.interline', (function(_this) {
        return function(configInterline) {
          _this.configInterline = configInterline;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.interline',
            value: _this.getInterline()
          });
        };
      })(this)));
      subs.add(this.adapter.onDidChangeScrollTop((function(_this) {
        return function() {
          if (!_this.standAlone) {
            return _this.emitter.emit('did-change-scroll-top', _this);
          }
        };
      })(this)));
      subs.add(this.adapter.onDidChangeScrollLeft((function(_this) {
        return function() {
          if (!_this.standAlone) {
            return _this.emitter.emit('did-change-scroll-left', _this);
          }
        };
      })(this)));
      subs.add(this.textEditor.onDidChange((function(_this) {
        return function(changes) {
          return _this.emitChanges(changes);
        };
      })(this)));
      subs.add(this.textEditor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      subs.add(this.textEditor.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          return _this.emitter.emit('did-change-config');
        };
      })(this)));
    }

    Minimap.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      this.removeAllDecorations();
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.textEditor = null;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      return this.destroyed = true;
    };

    Minimap.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    Minimap.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    Minimap.prototype.onDidChangeConfig = function(callback) {
      return this.emitter.on('did-change-config', callback);
    };

    Minimap.prototype.onDidChangeScrollTop = function(callback) {
      return this.emitter.on('did-change-scroll-top', callback);
    };

    Minimap.prototype.onDidChangeScrollLeft = function(callback) {
      return this.emitter.on('did-change-scroll-left', callback);
    };

    Minimap.prototype.onDidChangeStandAlone = function(callback) {
      return this.emitter.on('did-change-stand-alone', callback);
    };

    Minimap.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    Minimap.prototype.isStandAlone = function() {
      return this.standAlone;
    };

    Minimap.prototype.setStandAlone = function(standAlone) {
      if (standAlone !== this.standAlone) {
        this.standAlone = standAlone;
        return this.emitter.emit('did-change-stand-alone', this);
      }
    };

    Minimap.prototype.getTextEditor = function() {
      return this.textEditor;
    };

    Minimap.prototype.getTextEditorScaledHeight = function() {
      return this.adapter.getHeight() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollTop = function() {
      return this.adapter.getScrollTop() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollLeft = function() {
      return this.adapter.getScrollLeft() * this.getHorizontalScaleFactor();
    };

    Minimap.prototype.getTextEditorMaxScrollTop = function() {
      return this.adapter.getMaxScrollTop();
    };

    Minimap.prototype.getTextEditorScrollTop = function() {
      return this.adapter.getScrollTop();
    };

    Minimap.prototype.setTextEditorScrollTop = function(scrollTop) {
      return this.adapter.setScrollTop(scrollTop);
    };

    Minimap.prototype.getTextEditorScrollLeft = function() {
      return this.adapter.getScrollLeft();
    };

    Minimap.prototype.getTextEditorHeight = function() {
      return this.adapter.getHeight();
    };

    Minimap.prototype.getTextEditorScrollRatio = function() {
      return this.adapter.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
    };

    Minimap.prototype.getCapedTextEditorScrollRatio = function() {
      return Math.min(1, this.getTextEditorScrollRatio());
    };

    Minimap.prototype.getHeight = function() {
      return this.textEditor.getScreenLineCount() * this.getLineHeight();
    };

    Minimap.prototype.getWidth = function() {
      return this.textEditor.getMaxScreenLineLength() * this.getCharWidth();
    };

    Minimap.prototype.getVisibleHeight = function() {
      return Math.min(this.getScreenHeight(), this.getHeight());
    };

    Minimap.prototype.getScreenHeight = function() {
      if (this.isStandAlone()) {
        if (this.height != null) {
          return this.height;
        } else {
          return this.getHeight();
        }
      } else {
        return this.adapter.getHeight();
      }
    };

    Minimap.prototype.getVisibleWidth = function() {
      return Math.min(this.getScreenWidth(), this.getWidth());
    };

    Minimap.prototype.getScreenWidth = function() {
      if (this.isStandAlone() && (this.width != null)) {
        return this.width;
      } else {
        return this.getWidth();
      }
    };

    Minimap.prototype.setScreenHeightAndWidth = function(height, width) {
      this.height = height;
      this.width = width;
    };

    Minimap.prototype.getVerticalScaleFactor = function() {
      return this.getLineHeight() / this.textEditor.getLineHeightInPixels();
    };

    Minimap.prototype.getHorizontalScaleFactor = function() {
      return this.getCharWidth() / this.textEditor.getDefaultCharWidth();
    };

    Minimap.prototype.getLineHeight = function() {
      return this.getCharHeight() + this.getInterline();
    };

    Minimap.prototype.getCharWidth = function() {
      var _ref1;
      return (_ref1 = this.charWidth) != null ? _ref1 : this.configCharWidth;
    };

    Minimap.prototype.setCharWidth = function(charWidth) {
      this.charWidth = Math.floor(charWidth);
      return this.emitter.emit('did-change-config');
    };

    Minimap.prototype.getCharHeight = function() {
      var _ref1;
      return (_ref1 = this.charHeight) != null ? _ref1 : this.configCharHeight;
    };

    Minimap.prototype.setCharHeight = function(charHeight) {
      this.charHeight = Math.floor(charHeight);
      return this.emitter.emit('did-change-config');
    };

    Minimap.prototype.getInterline = function() {
      var _ref1;
      return (_ref1 = this.interline) != null ? _ref1 : this.configInterline;
    };

    Minimap.prototype.setInterline = function(interline) {
      this.interline = Math.floor(interline);
      return this.emitter.emit('did-change-config');
    };

    Minimap.prototype.getFirstVisibleScreenRow = function() {
      return Math.floor(this.getScrollTop() / this.getLineHeight());
    };

    Minimap.prototype.getLastVisibleScreenRow = function() {
      return Math.ceil((this.getScrollTop() + this.getScreenHeight()) / this.getLineHeight());
    };

    Minimap.prototype.getScrollTop = function() {
      if (this.standAlone) {
        return this.scrollTop;
      } else {
        return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
      }
    };

    Minimap.prototype.setScrollTop = function(scrollTop) {
      this.scrollTop = scrollTop;
      if (this.standAlone) {
        return this.emitter.emit('did-change-scroll-top', this);
      }
    };

    Minimap.prototype.getMaxScrollTop = function() {
      return Math.max(0, this.getHeight() - this.getScreenHeight());
    };

    Minimap.prototype.canScroll = function() {
      return this.getMaxScrollTop() > 0;
    };

    Minimap.prototype.getMarker = function(id) {
      return this.textEditor.getMarker(id);
    };

    Minimap.prototype.findMarkers = function(o) {
      try {
        return this.textEditor.findMarkers(o);
      } catch (_error) {
        return [];
      }
    };

    Minimap.prototype.markBufferRange = function(range) {
      return this.textEditor.markBufferRange(range);
    };

    Minimap.prototype.emitChanges = function(changes) {
      return this.emitter.emit('did-change', changes);
    };

    Minimap.prototype.enableCache = function() {
      return this.adapter.enableCache();
    };

    Minimap.prototype.clearCache = function() {
      return this.adapter.clearCache();
    };

    return Minimap;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0dBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsV0FBUixDQUFqQyxFQUFDLGVBQUEsT0FBRCxFQUFVLDJCQUFBLG1CQUFWLENBQUE7O0FBQUEsRUFDQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsZ0NBQVIsQ0FEdkIsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsMkJBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSx5QkFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxXQUFBLEdBQWMsQ0FMZCxDQUFBOztBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsb0JBQW9CLENBQUMsV0FBckIsQ0FBaUMsT0FBakMsQ0FBQSxDQUFBOztBQUVBO0FBQUEsZ0JBRkE7O0FBUWEsSUFBQSxpQkFBQyxPQUFELEdBQUE7QUFDWCxVQUFBLElBQUE7O1FBRFksVUFBUTtPQUNwQjtBQUFBLE1BQUMsSUFBQyxDQUFBLHFCQUFBLFVBQUYsRUFBYyxJQUFDLENBQUEscUJBQUEsVUFBZixFQUEyQixJQUFDLENBQUEsZ0JBQUEsS0FBNUIsRUFBbUMsSUFBQyxDQUFBLGlCQUFBLE1BQXBDLENBQUE7QUFFQSxNQUFBLElBQU8sdUJBQVA7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFNLDJDQUFOLENBQVYsQ0FERjtPQUZBO0FBQUEsTUFLQSxJQUFDLENBQUEsRUFBRCxHQUFNLFdBQUEsRUFMTixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQU5YLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFE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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap.coffee

(function() {
  var CompositeDisposable, DecorationManagement, Emitter, Minimap, nextModelId, _ref;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  DecorationManagement = require('./mixins/decoration-management');

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
      if (this.standAlone) {
        this.scrollTop = 0;
      }
      subs.add(atom.config.observe('editor.scrollPastEnd', (function(_this) {
        return function(scrollPastEnd) {
          _this.scrollPastEnd = scrollPastEnd;
          return _this.emitter.emit('did-change-config', {
            config: 'editor.scrollPastEnd',
            value: _this.scrollPastEnd
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charHeight', (function(_this) {
        return function(charHeight) {
          _this.charHeight = charHeight;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charHeight',
            value: _this.charHeight
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(charWidth) {
          _this.charWidth = charWidth;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charWidth',
            value: _this.charWidth
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.interline', (function(_this) {
        return function(interline) {
          _this.interline = interline;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.interline',
            value: _this.interline
          });
        };
      })(this)));
      subs.add(this.textEditor.onDidChange((function(_this) {
        return function(changes) {
          return _this.emitChanges(changes);
        };
      })(this)));
      subs.add(this.textEditor.onDidChangeScrollTop((function(_this) {
        return function() {
          if (!_this.standAlone) {
            return _this.emitter.emit('did-change-scroll-top', _this);
          }
        };
      })(this)));
      subs.add(this.textEditor.onDidChangeScrollLeft((function(_this) {
        return function() {
          if (!_this.standAlone) {
            return _this.emitter.emit('did-change-scroll-left', _this);
          }
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
      return this.textEditor.getHeight() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollTop = function() {
      return this.textEditor.getScrollTop() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollLeft = function() {
      return this.textEditor.getScrollLeft() * this.getHorizontalScaleFactor();
    };

    Minimap.prototype.getTextEditorMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      maxScrollTop = this.textEditor.displayBuffer.getMaxScrollTop();
      lineHeight = this.textEditor.displayBuffer.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.textEditor.getHeight() - 3 * lineHeight;
      }
      return maxScrollTop;
    };

    Minimap.prototype.getTextEditorScrollRatio = function() {
      return this.textEditor.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
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
        return this.textEditor.getHeight();
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
      return this.charHeight + this.interline;
    };

    Minimap.prototype.getCharWidth = function() {
      return this.charWidth;
    };

    Minimap.prototype.getCharHeight = function() {
      return this.charHeight;
    };

    Minimap.prototype.getInterline = function() {
      return this.interline;
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

    return Minimap;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEVBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsV0FBUixDQUFqQyxFQUFDLGVBQUEsT0FBRCxFQUFVLDJCQUFBLG1CQUFWLENBQUE7O0FBQUEsRUFDQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsZ0NBQVIsQ0FEdkIsQ0FBQTs7QUFBQSxFQUdBLFdBQUEsR0FBYyxDQUhkLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxvQkFBb0IsQ0FBQyxXQUFyQixDQUFpQyxPQUFqQyxDQUFBLENBQUE7O0FBRUE7QUFBQSxnQkFGQTs7QUFRYSxJQUFBLGlCQUFDLE9BQUQsR0FBQTtBQUNYLFVBQUEsSUFBQTs7UUFEWSxVQUFRO09BQ3BCO0FBQUEsTUFBQyxJQUFDLENBQUEscUJBQUEsVUFBRixFQUFjLElBQUMsQ0FBQSxxQkFBQSxVQUFmLEVBQTJCLElBQUMsQ0FBQSxnQkFBQSxLQUE1QixFQUFtQyxJQUFDLENBQUEsaUJBQUEsTUFBcEMsQ0FBQTtBQUNBLE1BQUEsSUFBTyx1QkFBUDtBQUNFLGNBQVUsSUFBQSxLQUFBLENBQU0sMkNBQU4sQ0FBVixDQURGO09BREE7QUFBQSxNQUlBLElBQUMsQ0FBQSxFQUFELEdBQU0sV0FBQSxFQUpOLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BTFgsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQSxHQUFPLEdBQUEsQ0FBQSxtQkFOeEIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLHFCQUFELENBQUEsQ0FQQSxDQUFBO0FBU0EsTUFBQSxJQUFH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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap.coffee

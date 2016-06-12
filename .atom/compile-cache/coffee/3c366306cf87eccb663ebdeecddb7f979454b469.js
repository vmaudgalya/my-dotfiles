(function() {
  var Decoration, DecorationManagement, Emitter, Mixin, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  path = require('path');

  Emitter = require('event-kit').Emitter;

  Decoration = null;

  module.exports = DecorationManagement = (function(_super) {
    __extends(DecorationManagement, _super);

    function DecorationManagement() {
      return DecorationManagement.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    DecorationManagement.prototype.initializeDecorations = function() {
      if (this.emitter == null) {
        this.emitter = new Emitter;
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      this.decorationDestroyedSubscriptions = {};
      return Decoration != null ? Decoration : Decoration = require('../decoration');
    };

    DecorationManagement.prototype.onDidAddDecoration = function(callback) {
      return this.emitter.on('did-add-decoration', callback);
    };

    DecorationManagement.prototype.onDidRemoveDecoration = function(callback) {
      return this.emitter.on('did-remove-decoration', callback);
    };

    DecorationManagement.prototype.onDidChangeDecoration = function(callback) {
      return this.emitter.on('did-change-decoration', callback);
    };

    DecorationManagement.prototype.onDidUpdateDecoration = function(callback) {
      return this.emitter.on('did-update-decoration', callback);
    };

    DecorationManagement.prototype.decorationForId = function(id) {
      return this.decorationsById[id];
    };

    DecorationManagement.prototype.decorationsForScreenRowRange = function(startScreenRow, endScreenRow) {
      var decorations, decorationsByMarkerId, marker, _i, _len, _ref;
      decorationsByMarkerId = {};
      _ref = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (decorations = this.decorationsByMarkerId[marker.id]) {
          decorationsByMarkerId[marker.id] = decorations;
        }
      }
      return decorationsByMarkerId;
    };

    DecorationManagement.prototype.decorationsByTypeThenRows = function(startScreenRow, endScreenRow) {
      var cache, decoration, id, range, row, rows, type, _base, _i, _j, _len, _ref, _ref1, _ref2, _results;
      if (this.decorationsByTypeThenRowsCache != null) {
        return this.decorationsByTypeThenRowsCache;
      }
      cache = {};
      _ref = this.decorationsById;
      for (id in _ref) {
        decoration = _ref[id];
        range = decoration.marker.getScreenRange();
        rows = (function() {
          _results = [];
          for (var _i = _ref1 = range.start.row, _ref2 = range.end.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref1 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
        type = decoration.getProperties().type;
        if (cache[type] == null) {
          cache[type] = {};
        }
        for (_j = 0, _len = rows.length; _j < _len; _j++) {
          row = rows[_j];
          if ((_base = cache[type])[row] == null) {
            _base[row] = [];
          }
          cache[type][row].push(decoration);
        }
      }
      return this.decorationsByTypeThenRowsCache = cache;
    };

    DecorationManagement.prototype.invalidateDecorationForScreenRowsCache = function() {
      return this.decorationsByTypeThenRowsCache = null;
    };

    DecorationManagement.prototype.decorateMarker = function(marker, decorationParams) {
      var cls, decoration, _base, _base1, _base2, _base3, _base4, _name, _name1, _name2, _name3, _name4;
      if (this.destroyed) {
        return;
      }
      if (marker == null) {
        return;
      }
      marker = this.getMarker(marker.id);
      if (marker == null) {
        return;
      }
      if (decorationParams.type === 'highlight') {
        decorationParams.type = 'highlight-over';
      }
      if ((decorationParams.scope == null) && (decorationParams["class"] != null)) {
        cls = decorationParams["class"].split(' ').join('.');
        decorationParams.scope = ".minimap ." + cls;
      }
      if ((_base = this.decorationMarkerDestroyedSubscriptions)[_name = marker.id] == null) {
        _base[_name] = marker.onDidDestroy((function(_this) {
          return function() {
            return _this.removeAllDecorationsForMarker(marker);
          };
        })(this));
      }
      if ((_base1 = this.decorationMarkerChangedSubscriptions)[_name1 = marker.id] == null) {
        _base1[_name1] = marker.onDidChange((function(_this) {
          return function(event) {
            var decoration, decorations, end, newEnd, newStart, oldEnd, oldStart, rangesDiffs, start, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
            decorations = _this.decorationsByMarkerId[marker.id];
            _this.invalidateDecorationForScreenRowsCache();
            if (decorations != null) {
              for (_i = 0, _len = decorations.length; _i < _len; _i++) {
                decoration = decorations[_i];
                _this.emitter.emit('did-change-decoration', {
                  marker: marker,
                  decoration: decoration,
                  event: event
                });
              }
            }
            oldStart = event.oldTailScreenPosition;
            oldEnd = event.oldHeadScreenPosition;
            newStart = event.newTailScreenPosition;
            newEnd = event.newHeadScreenPosition;
            if (oldStart.row > oldEnd.row) {
              _ref = [oldEnd, oldStart], oldStart = _ref[0], oldEnd = _ref[1];
            }
            if (newStart.row > newEnd.row) {
              _ref1 = [newEnd, newStart], newStart = _ref1[0], newEnd = _ref1[1];
            }
            rangesDiffs = _this.computeRangesDiffs(oldStart, oldEnd, newStart, newEnd);
            _results = [];
            for (_j = 0, _len1 = rangesDiffs.length; _j < _len1; _j++) {
              _ref2 = rangesDiffs[_j], start = _ref2[0], end = _ref2[1];
              _results.push(_this.emitRangeChanges({
                start: start,
                end: end
              }, 0));
            }
            return _results;
          };
        })(this));
      }
      decoration = new Decoration(marker, this, decorationParams);
      if ((_base2 = this.decorationsByMarkerId)[_name2 = marker.id] == null) {
        _base2[_name2] = [];
      }
      this.decorationsByMarkerId[marker.id].push(decoration);
      this.decorationsById[decoration.id] = decoration;
      if ((_base3 = this.decorationUpdatedSubscriptions)[_name3 = decoration.id] == null) {
        _base3[_name3] = decoration.onDidChangeProperties((function(_this) {
          return function(event) {
            return _this.emitDecorationChanges(decoration);
          };
        })(this));
      }
      if ((_base4 = this.decorationDestroyedSubscriptions)[_name4 = decoration.id] == null) {
        _base4[_name4] = decoration.onDidDestroy((function(_this) {
          return function(event) {
            return _this.removeDecoration(decoration);
          };
        })(this));
      }
      this.emitDecorationChanges(decoration);
      this.emitter.emit('did-add-decoration', {
        marker: marker,
        decoration: decoration
      });
      return decoration;
    };

    DecorationManagement.prototype.computeRangesDiffs = function(oldStart, oldEnd, newStart, newEnd) {
      var diffs;
      diffs = [];
      if (oldStart.isLessThan(newStart)) {
        diffs.push([oldStart, newStart]);
      } else if (newStart.isLessThan(oldStart)) {
        diffs.push([newStart, oldStart]);
      }
      if (oldEnd.isLessThan(newEnd)) {
        diffs.push([oldEnd, newEnd]);
      } else if (newEnd.isLessThan(oldEnd)) {
        diffs.push([newEnd, oldEnd]);
      }
      return diffs;
    };

    DecorationManagement.prototype.emitDecorationChanges = function(decoration) {
      var range;
      if (decoration.marker.displayBuffer.isDestroyed()) {
        return;
      }
      this.invalidateDecorationForScreenRowsCache();
      range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }
      return this.emitRangeChanges(range, 0);
    };

    DecorationManagement.prototype.emitRangeChanges = function(range, screenDelta) {
      var changeEvent, endScreenRow, firstRenderedScreenRow, lastRenderedScreenRow, startScreenRow;
      startScreenRow = range.start.row;
      endScreenRow = range.end.row;
      lastRenderedScreenRow = this.getLastVisibleScreenRow();
      firstRenderedScreenRow = this.getFirstVisibleScreenRow();
      if (screenDelta == null) {
        screenDelta = (lastRenderedScreenRow - firstRenderedScreenRow) - (endScreenRow - startScreenRow);
      }
      changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta
      };
      return this.emitChanges(changeEvent);
    };

    DecorationManagement.prototype.removeDecoration = function(decoration) {
      var decorations, index, marker, _ref, _ref1;
      if (decoration == null) {
        return;
      }
      marker = decoration.marker;
      delete this.decorationsById[decoration.id];
      if ((_ref = this.decorationUpdatedSubscriptions[decoration.id]) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.decorationDestroyedSubscriptions[decoration.id]) != null) {
        _ref1.dispose();
      }
      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];
      if (!(decorations = this.decorationsByMarkerId[marker.id])) {
        return;
      }
      this.emitDecorationChanges(decoration);
      index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        if (decorations.length === 0) {
          return this.removedAllMarkerDecorations(marker);
        }
      }
    };

    DecorationManagement.prototype.removeAllDecorationsForMarker = function(marker) {
      var decoration, decorations, _i, _len, _ref;
      if (marker == null) {
        return;
      }
      decorations = (_ref = this.decorationsByMarkerId[marker.id]) != null ? _ref.slice() : void 0;
      if (!decorations) {
        return;
      }
      for (_i = 0, _len = decorations.length; _i < _len; _i++) {
        decoration = decorations[_i];
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        this.emitDecorationChanges(decoration);
      }
      return this.removedAllMarkerDecorations(marker);
    };

    DecorationManagement.prototype.removedAllMarkerDecorations = function(marker) {
      if (marker == null) {
        return;
      }
      this.decorationMarkerChangedSubscriptions[marker.id].dispose();
      this.decorationMarkerDestroyedSubscriptions[marker.id].dispose();
      delete this.decorationsByMarkerId[marker.id];
      delete this.decorationMarkerChangedSubscriptions[marker.id];
      return delete this.decorationMarkerDestroyedSubscriptions[marker.id];
    };

    DecorationManagement.prototype.removeAllDecorations = function() {
      var decoration, id, sub, _ref, _ref1, _ref2, _ref3, _ref4;
      _ref = this.decorationMarkerChangedSubscriptions;
      for (id in _ref) {
        sub = _ref[id];
        sub.dispose();
      }
      _ref1 = this.decorationMarkerDestroyedSubscriptions;
      for (id in _ref1) {
        sub = _ref1[id];
        sub.dispose();
      }
      _ref2 = this.decorationUpdatedSubscriptions;
      for (id in _ref2) {
        sub = _ref2[id];
        sub.dispose();
      }
      _ref3 = this.decorationDestroyedSubscriptions;
      for (id in _ref3) {
        sub = _ref3[id];
        sub.dispose();
      }
      _ref4 = this.decorationsById;
      for (id in _ref4) {
        decoration = _ref4[id];
        decoration.destroy();
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      return this.decorationDestroyedSubscriptions = {};
    };

    DecorationManagement.prototype.decorationDidChangeType = function(decoration) {};

    DecorationManagement.prototype.decorationUpdated = function(decoration) {
      return this.emitter.emit('did-update-decoration', decoration);
    };

    return DecorationManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWl4aW5zL2RlY29yYXRpb24tbWFuYWdlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0RBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsVUFBVyxPQUFBLENBQVEsV0FBUixFQUFYLE9BRkQsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxJQUhiLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMkNBQUEsQ0FBQTs7OztLQUFBOztBQUFBO0FBQUEsZ0JBQUE7O0FBQUEsbUNBR0EscUJBQUEsR0FBdUIsU0FBQSxHQUFBOztRQUNyQixJQUFDLENBQUEsVUFBVyxHQUFBLENBQUE7T0FBWjtBQUFBLE1BQ0EsSUFBQyxDQUFBLGVBQUQsR0FBbUIsRUFEbkIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLHFCQUFELEdBQXlCLEVBRnpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxvQ0FBRCxHQUF3QyxFQUh4QyxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsc0NBQUQsR0FBMEMsRUFKMUMsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLDhCQUFELEdBQWtDLEVBTGxDLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxnQ0FBRCxHQUFvQyxFQU5wQyxDQUFBO2tDQVFBLGFBQUEsYUFBYyxPQUFBLENBQVEsZUFBUixFQVRPO0lBQUEsQ0FIdkIsQ0FBQTs7QUFBQSxtQ0FxQkEsa0JBQUEsR0FBb0IsU0FBQyxRQUFELEdBQUE7YUFDbEIsSUFBQyxDQUFBLE9B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

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/mixins/decoration-management.coffee

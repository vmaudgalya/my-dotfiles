'use babel';

/**
 * @access private
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var LegacyAdater = (function () {
  function LegacyAdater(textEditor) {
    _classCallCheck(this, LegacyAdater);

    this.textEditor = textEditor;
  }

  _createClass(LegacyAdater, [{
    key: 'enableCache',
    value: function enableCache() {
      this.useCache = true;
    }
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this.useCache = false;
      delete this.heightCache;
      delete this.scrollTopCache;
      delete this.scrollLeftCache;
      delete this.maxScrollTopCache;
    }
  }, {
    key: 'onDidChangeScrollTop',
    value: function onDidChangeScrollTop(callback) {
      return this.textEditor.onDidChangeScrollTop(callback);
    }
  }, {
    key: 'onDidChangeScrollLeft',
    value: function onDidChangeScrollLeft(callback) {
      return this.textEditor.onDidChangeScrollLeft(callback);
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      if (this.useCache) {
        if (!this.heightCache) {
          this.heightCache = this.textEditor.getHeight();
        }
        return this.heightCache;
      }
      return this.textEditor.getHeight();
    }
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      if (this.useCache) {
        if (!this.scrollTopCache) {
          this.scrollTopCache = this.textEditor.getScrollTop();
        }
        return this.scrollTopCache;
      }
      return this.textEditor.getScrollTop();
    }
  }, {
    key: 'setScrollTop',
    value: function setScrollTop(scrollTop) {
      return this.textEditor.setScrollTop(scrollTop);
    }
  }, {
    key: 'getScrollLeft',
    value: function getScrollLeft() {
      if (this.useCache) {
        if (!this.scrollLeftCache) {
          this.scrollLeftCache = this.textEditor.getScrollLeft();
        }
        return this.scrollLeftCache;
      }

      return this.textEditor.getScrollLeft();
    }
  }, {
    key: 'getMaxScrollTop',
    value: function getMaxScrollTop() {
      if (this.maxScrollTopCache != null && this.useCache) {
        return this.maxScrollTopCache;
      }
      var maxScrollTop = this.textEditor.displayBuffer.getMaxScrollTop();
      var lineHeight = this.textEditor.getLineHeightInPixels();

      if (this.scrollPastEnd) {
        maxScrollTop -= this.getHeight() - 3 * lineHeight;
      }
      if (this.useCache) {
        this.maxScrollTopCache = maxScrollTop;
      }
      return maxScrollTop;
    }
  }]);

  return LegacyAdater;
})();

exports['default'] = LegacyAdater;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2FkYXB0ZXJzL2xlZ2FjeS1hZGFwdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7OztJQUtVLFlBQVk7QUFDbkIsV0FETyxZQUFZLENBQ2xCLFVBQVUsRUFBRTswQkFETixZQUFZOztBQUNKLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0dBQUU7O2VBRHRDLFlBQVk7O1dBR25CLHVCQUFHO0FBQUUsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7S0FBRTs7O1dBRTVCLHNCQUFHO0FBQ1osVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDckIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFBO0FBQ3ZCLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQTtBQUMxQixhQUFPLElBQUksQ0FBQyxlQUFlLENBQUE7QUFDM0IsYUFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUE7S0FDOUI7OztXQUVvQiw4QkFBQyxRQUFRLEVBQUU7QUFDOUIsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ3REOzs7V0FFcUIsK0JBQUMsUUFBUSxFQUFFO0FBQy9CLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUN2RDs7O1dBRVMscUJBQUc7QUFDWCxVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsWUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDckIsY0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFBO1NBQy9DO0FBQ0QsZUFBTyxJQUFJLENBQUMsV0FBVyxDQUFBO09BQ3hCO0FBQ0QsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFBO0tBQ25DOzs7V0FFWSx3QkFBRztBQUNkLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN4QixjQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUE7U0FDckQ7QUFDRCxlQUFPLElBQUksQ0FBQyxjQUFjLENBQUE7T0FDM0I7QUFDRCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUE7S0FDdEM7OztXQUVZLHNCQUFDLFNBQVMsRUFBRTtBQUN2QixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQy9DOzs7V0FFYSx5QkFBRztBQUNmLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUN6QixjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUE7U0FDdkQ7QUFDRCxlQUFPLElBQUksQ0FBQyxlQUFlLENBQUE7T0FDNUI7O0FBRUQsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFBO0tBQ3ZDOzs7V0FFZSwyQkFBRztBQUNqQixVQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNuRCxlQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQTtPQUM5QjtBQUNELFVBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQ2xFLFVBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUsQ0FBQTs7QUFFeEQsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLG9CQUFZLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUE7T0FDbEQ7QUFDRCxVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFBRSxZQUFJLENBQUMsaUJBQWlCLEdBQUcsWUFBWSxDQUFBO09BQUU7QUFDNUQsYUFBTyxZQUFZLENBQUE7S0FDcEI7OztTQXBFa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvYWRhcHRlcnMvbGVnYWN5LWFkYXB0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG4vKipcbiAqIEBhY2Nlc3MgcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZWdhY3lBZGF0ZXIge1xuICBjb25zdHJ1Y3RvciAodGV4dEVkaXRvcikgeyB0aGlzLnRleHRFZGl0b3IgPSB0ZXh0RWRpdG9yIH1cblxuICBlbmFibGVDYWNoZSAoKSB7IHRoaXMudXNlQ2FjaGUgPSB0cnVlIH1cblxuICBjbGVhckNhY2hlICgpIHtcbiAgICB0aGlzLnVzZUNhY2hlID0gZmFsc2VcbiAgICBkZWxldGUgdGhpcy5oZWlnaHRDYWNoZVxuICAgIGRlbGV0ZSB0aGlzLnNjcm9sbFRvcENhY2hlXG4gICAgZGVsZXRlIHRoaXMuc2Nyb2xsTGVmdENhY2hlXG4gICAgZGVsZXRlIHRoaXMubWF4U2Nyb2xsVG9wQ2FjaGVcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlU2Nyb2xsVG9wIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3Iub25EaWRDaGFuZ2VTY3JvbGxUb3AoY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZENoYW5nZVNjcm9sbExlZnQgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5vbkRpZENoYW5nZVNjcm9sbExlZnQoY2FsbGJhY2spXG4gIH1cblxuICBnZXRIZWlnaHQgKCkge1xuICAgIGlmICh0aGlzLnVzZUNhY2hlKSB7XG4gICAgICBpZiAoIXRoaXMuaGVpZ2h0Q2FjaGUpIHtcbiAgICAgICAgdGhpcy5oZWlnaHRDYWNoZSA9IHRoaXMudGV4dEVkaXRvci5nZXRIZWlnaHQoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0Q2FjaGVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5nZXRIZWlnaHQoKVxuICB9XG5cbiAgZ2V0U2Nyb2xsVG9wICgpIHtcbiAgICBpZiAodGhpcy51c2VDYWNoZSkge1xuICAgICAgaWYgKCF0aGlzLnNjcm9sbFRvcENhY2hlKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9wQ2FjaGUgPSB0aGlzLnRleHRFZGl0b3IuZ2V0U2Nyb2xsVG9wKClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNjcm9sbFRvcENhY2hlXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3IuZ2V0U2Nyb2xsVG9wKClcbiAgfVxuXG4gIHNldFNjcm9sbFRvcCAoc2Nyb2xsVG9wKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5zZXRTY3JvbGxUb3Aoc2Nyb2xsVG9wKVxuICB9XG5cbiAgZ2V0U2Nyb2xsTGVmdCAoKSB7XG4gICAgaWYgKHRoaXMudXNlQ2FjaGUpIHtcbiAgICAgIGlmICghdGhpcy5zY3JvbGxMZWZ0Q2FjaGUpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxMZWZ0Q2FjaGUgPSB0aGlzLnRleHRFZGl0b3IuZ2V0U2Nyb2xsTGVmdCgpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5zY3JvbGxMZWZ0Q2FjaGVcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLmdldFNjcm9sbExlZnQoKVxuICB9XG5cbiAgZ2V0TWF4U2Nyb2xsVG9wICgpIHtcbiAgICBpZiAodGhpcy5tYXhTY3JvbGxUb3BDYWNoZSAhPSBudWxsICYmIHRoaXMudXNlQ2FjaGUpIHtcbiAgICAgIHJldHVybiB0aGlzLm1heFNjcm9sbFRvcENhY2hlXG4gICAgfVxuICAgIHZhciBtYXhTY3JvbGxUb3AgPSB0aGlzLnRleHRFZGl0b3IuZGlzcGxheUJ1ZmZlci5nZXRNYXhTY3JvbGxUb3AoKVxuICAgIHZhciBsaW5lSGVpZ2h0ID0gdGhpcy50ZXh0RWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG5cbiAgICBpZiAodGhpcy5zY3JvbGxQYXN0RW5kKSB7XG4gICAgICBtYXhTY3JvbGxUb3AgLT0gdGhpcy5nZXRIZWlnaHQoKSAtIDMgKiBsaW5lSGVpZ2h0XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZUNhY2hlKSB7IHRoaXMubWF4U2Nyb2xsVG9wQ2FjaGUgPSBtYXhTY3JvbGxUb3AgfVxuICAgIHJldHVybiBtYXhTY3JvbGxUb3BcbiAgfVxufVxuIl19
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/adapters/legacy-adapter.js

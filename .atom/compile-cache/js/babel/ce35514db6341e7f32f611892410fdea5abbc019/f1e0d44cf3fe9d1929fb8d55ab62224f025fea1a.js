'use babel';

/**
 * @access private
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var StableAdapter = (function () {
  function StableAdapter(textEditor) {
    _classCallCheck(this, StableAdapter);

    this.textEditor = textEditor;
    this.textEditorElement = atom.views.getView(this.textEditor);
  }

  _createClass(StableAdapter, [{
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
      return this.textEditorElement.onDidChangeScrollTop(callback);
    }
  }, {
    key: 'onDidChangeScrollLeft',
    value: function onDidChangeScrollLeft(callback) {
      return this.textEditorElement.onDidChangeScrollLeft(callback);
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      if (this.useCache) {
        if (!this.heightCache) {
          this.heightCache = this.textEditorElement.getHeight();
        }
        return this.heightCache;
      }
      return this.textEditorElement.getHeight();
    }
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      if (this.useCache) {
        if (!this.scrollTopCache) {
          this.scrollTopCache = this.computeScrollTop();
        }
        return this.scrollTopCache;
      }
      return this.computeScrollTop();
    }
  }, {
    key: 'computeScrollTop',
    value: function computeScrollTop() {
      var scrollTop = this.textEditorElement.getScrollTop();
      var lineHeight = this.textEditor.getLineHeightInPixels();
      var firstRow = this.textEditorElement.getFirstVisibleScreenRow();
      var lineTop = this.textEditorElement.pixelPositionForScreenPosition([firstRow, 0]).top;

      if (lineTop > scrollTop) {
        firstRow -= 1;
        lineTop = this.textEditorElement.pixelPositionForScreenPosition([firstRow, 0]).top;
      }

      var lineY = firstRow * lineHeight;
      var offset = Math.min(scrollTop - lineTop, lineHeight);
      return lineY + offset;
    }
  }, {
    key: 'setScrollTop',
    value: function setScrollTop(scrollTop) {
      this.textEditorElement.setScrollTop(scrollTop);
    }
  }, {
    key: 'getScrollLeft',
    value: function getScrollLeft() {
      if (this.useCache) {
        if (!this.scrollLeftCache) {
          this.scrollLeftCache = this.textEditorElement.getScrollLeft();
        }
        return this.scrollLeftCache;
      }
      return this.textEditorElement.getScrollLeft();
    }
  }, {
    key: 'getMaxScrollTop',
    value: function getMaxScrollTop() {
      if (this.maxScrollTopCache != null && this.useCache) {
        return this.maxScrollTopCache;
      }

      var maxScrollTop = this.textEditorElement.getScrollHeight() - this.getHeight();
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

  return StableAdapter;
})();

exports['default'] = StableAdapter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2FkYXB0ZXJzL3N0YWJsZS1hZGFwdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7OztJQUtVLGFBQWE7QUFDcEIsV0FETyxhQUFhLENBQ25CLFVBQVUsRUFBRTswQkFETixhQUFhOztBQUU5QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0dBQzdEOztlQUprQixhQUFhOztXQU1wQix1QkFBRztBQUFFLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0tBQUU7OztXQUU1QixzQkFBRztBQUNaLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtBQUN2QixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUE7QUFDMUIsYUFBTyxJQUFJLENBQUMsZUFBZSxDQUFBO0FBQzNCLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFBO0tBQzlCOzs7V0FFb0IsOEJBQUMsUUFBUSxFQUFFO0FBQzlCLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQzdEOzs7V0FFcUIsK0JBQUMsUUFBUSxFQUFFO0FBQy9CLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQzlEOzs7V0FFUyxxQkFBRztBQUNYLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNyQixjQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtTQUN0RDtBQUNELGVBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtPQUN4QjtBQUNELGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxDQUFBO0tBQzFDOzs7V0FFWSx3QkFBRztBQUNkLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN4QixjQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1NBQzlDO0FBQ0QsZUFBTyxJQUFJLENBQUMsY0FBYyxDQUFBO09BQzNCO0FBQ0QsYUFBTyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtLQUMvQjs7O1dBRWdCLDRCQUFHO0FBQ2xCLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUN2RCxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDMUQsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHdCQUF3QixFQUFFLENBQUE7QUFDaEUsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLDhCQUE4QixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBOztBQUV0RixVQUFJLE9BQU8sR0FBRyxTQUFTLEVBQUU7QUFDdkIsZ0JBQVEsSUFBSSxDQUFDLENBQUE7QUFDYixlQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLDhCQUE4QixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBO09BQ25GOztBQUVELFVBQU0sS0FBSyxHQUFHLFFBQVEsR0FBRyxVQUFVLENBQUE7QUFDbkMsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQ3hELGFBQU8sS0FBSyxHQUFHLE1BQU0sQ0FBQTtLQUN0Qjs7O1dBRVksc0JBQUMsU0FBUyxFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUE7S0FDL0M7OztXQUVhLHlCQUFHO0FBQ2YsVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3pCLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxDQUFBO1NBQzlEO0FBQ0QsZUFBTyxJQUFJLENBQUMsZUFBZSxDQUFBO09BQzVCO0FBQ0QsYUFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLENBQUE7S0FDOUM7OztXQUVlLDJCQUFHO0FBQ2pCLFVBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ25ELGVBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFBO09BQzlCOztBQUVELFVBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDOUUsVUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBOztBQUV4RCxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsb0JBQVksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQTtPQUNsRDs7QUFFRCxVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsWUFBSSxDQUFDLGlCQUFpQixHQUFHLFlBQVksQ0FBQTtPQUN0Qzs7QUFFRCxhQUFPLFlBQVksQ0FBQTtLQUNwQjs7O1NBM0ZrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvVXNlcnMvdm1hdWRnYWx5YS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9hZGFwdGVycy9zdGFibGUtYWRhcHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbi8qKlxuICogQGFjY2VzcyBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWJsZUFkYXB0ZXIge1xuICBjb25zdHJ1Y3RvciAodGV4dEVkaXRvcikge1xuICAgIHRoaXMudGV4dEVkaXRvciA9IHRleHRFZGl0b3JcbiAgICB0aGlzLnRleHRFZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMudGV4dEVkaXRvcilcbiAgfVxuXG4gIGVuYWJsZUNhY2hlICgpIHsgdGhpcy51c2VDYWNoZSA9IHRydWUgfVxuXG4gIGNsZWFyQ2FjaGUgKCkge1xuICAgIHRoaXMudXNlQ2FjaGUgPSBmYWxzZVxuICAgIGRlbGV0ZSB0aGlzLmhlaWdodENhY2hlXG4gICAgZGVsZXRlIHRoaXMuc2Nyb2xsVG9wQ2FjaGVcbiAgICBkZWxldGUgdGhpcy5zY3JvbGxMZWZ0Q2FjaGVcbiAgICBkZWxldGUgdGhpcy5tYXhTY3JvbGxUb3BDYWNoZVxuICB9XG5cbiAgb25EaWRDaGFuZ2VTY3JvbGxUb3AgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvckVsZW1lbnQub25EaWRDaGFuZ2VTY3JvbGxUb3AoY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZENoYW5nZVNjcm9sbExlZnQgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvckVsZW1lbnQub25EaWRDaGFuZ2VTY3JvbGxMZWZ0KGNhbGxiYWNrKVxuICB9XG5cbiAgZ2V0SGVpZ2h0ICgpIHtcbiAgICBpZiAodGhpcy51c2VDYWNoZSkge1xuICAgICAgaWYgKCF0aGlzLmhlaWdodENhY2hlKSB7XG4gICAgICAgIHRoaXMuaGVpZ2h0Q2FjaGUgPSB0aGlzLnRleHRFZGl0b3JFbGVtZW50LmdldEhlaWdodCgpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5oZWlnaHRDYWNoZVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yRWxlbWVudC5nZXRIZWlnaHQoKVxuICB9XG5cbiAgZ2V0U2Nyb2xsVG9wICgpIHtcbiAgICBpZiAodGhpcy51c2VDYWNoZSkge1xuICAgICAgaWYgKCF0aGlzLnNjcm9sbFRvcENhY2hlKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9wQ2FjaGUgPSB0aGlzLmNvbXB1dGVTY3JvbGxUb3AoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9wQ2FjaGVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29tcHV0ZVNjcm9sbFRvcCgpXG4gIH1cblxuICBjb21wdXRlU2Nyb2xsVG9wICgpIHtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSB0aGlzLnRleHRFZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpXG4gICAgY29uc3QgbGluZUhlaWdodCA9IHRoaXMudGV4dEVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuICAgIGxldCBmaXJzdFJvdyA9IHRoaXMudGV4dEVkaXRvckVsZW1lbnQuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KClcbiAgICBsZXQgbGluZVRvcCA9IHRoaXMudGV4dEVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKFtmaXJzdFJvdywgMF0pLnRvcFxuXG4gICAgaWYgKGxpbmVUb3AgPiBzY3JvbGxUb3ApIHtcbiAgICAgIGZpcnN0Um93IC09IDFcbiAgICAgIGxpbmVUb3AgPSB0aGlzLnRleHRFZGl0b3JFbGVtZW50LnBpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihbZmlyc3RSb3csIDBdKS50b3BcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lWSA9IGZpcnN0Um93ICogbGluZUhlaWdodFxuICAgIGNvbnN0IG9mZnNldCA9IE1hdGgubWluKHNjcm9sbFRvcCAtIGxpbmVUb3AsIGxpbmVIZWlnaHQpXG4gICAgcmV0dXJuIGxpbmVZICsgb2Zmc2V0XG4gIH1cblxuICBzZXRTY3JvbGxUb3AgKHNjcm9sbFRvcCkge1xuICAgIHRoaXMudGV4dEVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcClcbiAgfVxuXG4gIGdldFNjcm9sbExlZnQgKCkge1xuICAgIGlmICh0aGlzLnVzZUNhY2hlKSB7XG4gICAgICBpZiAoIXRoaXMuc2Nyb2xsTGVmdENhY2hlKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsTGVmdENhY2hlID0gdGhpcy50ZXh0RWRpdG9yRWxlbWVudC5nZXRTY3JvbGxMZWZ0KClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNjcm9sbExlZnRDYWNoZVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yRWxlbWVudC5nZXRTY3JvbGxMZWZ0KClcbiAgfVxuXG4gIGdldE1heFNjcm9sbFRvcCAoKSB7XG4gICAgaWYgKHRoaXMubWF4U2Nyb2xsVG9wQ2FjaGUgIT0gbnVsbCAmJiB0aGlzLnVzZUNhY2hlKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXhTY3JvbGxUb3BDYWNoZVxuICAgIH1cblxuICAgIGxldCBtYXhTY3JvbGxUb3AgPSB0aGlzLnRleHRFZGl0b3JFbGVtZW50LmdldFNjcm9sbEhlaWdodCgpIC0gdGhpcy5nZXRIZWlnaHQoKVxuICAgIGxldCBsaW5lSGVpZ2h0ID0gdGhpcy50ZXh0RWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG5cbiAgICBpZiAodGhpcy5zY3JvbGxQYXN0RW5kKSB7XG4gICAgICBtYXhTY3JvbGxUb3AgLT0gdGhpcy5nZXRIZWlnaHQoKSAtIDMgKiBsaW5lSGVpZ2h0XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudXNlQ2FjaGUpIHtcbiAgICAgIHRoaXMubWF4U2Nyb2xsVG9wQ2FjaGUgPSBtYXhTY3JvbGxUb3BcbiAgICB9XG5cbiAgICByZXR1cm4gbWF4U2Nyb2xsVG9wXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/adapters/stable-adapter.js

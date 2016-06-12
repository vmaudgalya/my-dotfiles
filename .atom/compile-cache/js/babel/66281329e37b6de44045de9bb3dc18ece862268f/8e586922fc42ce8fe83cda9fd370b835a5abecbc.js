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
          this.scrollTopCache = this.textEditorElement.getScrollTop();
        }
        return this.scrollTopCache;
      }
      return this.textEditorElement.getScrollTop();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2FkYXB0ZXJzL3N0YWJsZS1hZGFwdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7OztJQUtVLGFBQWE7QUFDcEIsV0FETyxhQUFhLENBQ25CLFVBQVUsRUFBRTswQkFETixhQUFhOztBQUU5QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0dBQzdEOztlQUprQixhQUFhOztXQU1wQix1QkFBRztBQUFFLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0tBQUU7OztXQUU1QixzQkFBRztBQUNaLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtBQUN2QixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUE7QUFDMUIsYUFBTyxJQUFJLENBQUMsZUFBZSxDQUFBO0FBQzNCLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFBO0tBQzlCOzs7V0FFb0IsOEJBQUMsUUFBUSxFQUFFO0FBQzlCLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQzdEOzs7V0FFcUIsK0JBQUMsUUFBUSxFQUFFO0FBQy9CLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQzlEOzs7V0FFUyxxQkFBRztBQUNYLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNyQixjQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtTQUN0RDtBQUNELGVBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtPQUN4QjtBQUNELGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxDQUFBO0tBQzFDOzs7V0FFWSx3QkFBRztBQUNkLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN4QixjQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtTQUM1RDtBQUNELGVBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQTtPQUMzQjtBQUNELGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxDQUFBO0tBQzdDOzs7V0FFWSxzQkFBQyxTQUFTLEVBQUU7QUFDdkIsVUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQTtLQUMvQzs7O1dBRWEseUJBQUc7QUFDZixVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsWUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDekIsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLENBQUE7U0FDOUQ7QUFDRCxlQUFPLElBQUksQ0FBQyxlQUFlLENBQUE7T0FDNUI7QUFDRCxhQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtLQUM5Qzs7O1dBRWUsMkJBQUc7QUFDakIsVUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDbkQsZUFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUE7T0FDOUI7O0FBRUQsVUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUM5RSxVQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUE7O0FBRXhELFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixvQkFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFBO09BQ2xEOztBQUVELFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsaUJBQWlCLEdBQUcsWUFBWSxDQUFBO09BQ3RDOztBQUVELGFBQU8sWUFBWSxDQUFBO0tBQ3BCOzs7U0EzRWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2FkYXB0ZXJzL3N0YWJsZS1hZGFwdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuLyoqXG4gKiBAYWNjZXNzIHByaXZhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhYmxlQWRhcHRlciB7XG4gIGNvbnN0cnVjdG9yICh0ZXh0RWRpdG9yKSB7XG4gICAgdGhpcy50ZXh0RWRpdG9yID0gdGV4dEVkaXRvclxuICAgIHRoaXMudGV4dEVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy50ZXh0RWRpdG9yKVxuICB9XG5cbiAgZW5hYmxlQ2FjaGUgKCkgeyB0aGlzLnVzZUNhY2hlID0gdHJ1ZSB9XG5cbiAgY2xlYXJDYWNoZSAoKSB7XG4gICAgdGhpcy51c2VDYWNoZSA9IGZhbHNlXG4gICAgZGVsZXRlIHRoaXMuaGVpZ2h0Q2FjaGVcbiAgICBkZWxldGUgdGhpcy5zY3JvbGxUb3BDYWNoZVxuICAgIGRlbGV0ZSB0aGlzLnNjcm9sbExlZnRDYWNoZVxuICAgIGRlbGV0ZSB0aGlzLm1heFNjcm9sbFRvcENhY2hlXG4gIH1cblxuICBvbkRpZENoYW5nZVNjcm9sbFRvcCAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yRWxlbWVudC5vbkRpZENoYW5nZVNjcm9sbFRvcChjYWxsYmFjaylcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yRWxlbWVudC5vbkRpZENoYW5nZVNjcm9sbExlZnQoY2FsbGJhY2spXG4gIH1cblxuICBnZXRIZWlnaHQgKCkge1xuICAgIGlmICh0aGlzLnVzZUNhY2hlKSB7XG4gICAgICBpZiAoIXRoaXMuaGVpZ2h0Q2FjaGUpIHtcbiAgICAgICAgdGhpcy5oZWlnaHRDYWNoZSA9IHRoaXMudGV4dEVkaXRvckVsZW1lbnQuZ2V0SGVpZ2h0KClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmhlaWdodENhY2hlXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3JFbGVtZW50LmdldEhlaWdodCgpXG4gIH1cblxuICBnZXRTY3JvbGxUb3AgKCkge1xuICAgIGlmICh0aGlzLnVzZUNhY2hlKSB7XG4gICAgICBpZiAoIXRoaXMuc2Nyb2xsVG9wQ2FjaGUpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUb3BDYWNoZSA9IHRoaXMudGV4dEVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNjcm9sbFRvcENhY2hlXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpXG4gIH1cblxuICBzZXRTY3JvbGxUb3AgKHNjcm9sbFRvcCkge1xuICAgIHRoaXMudGV4dEVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcClcbiAgfVxuXG4gIGdldFNjcm9sbExlZnQgKCkge1xuICAgIGlmICh0aGlzLnVzZUNhY2hlKSB7XG4gICAgICBpZiAoIXRoaXMuc2Nyb2xsTGVmdENhY2hlKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsTGVmdENhY2hlID0gdGhpcy50ZXh0RWRpdG9yRWxlbWVudC5nZXRTY3JvbGxMZWZ0KClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNjcm9sbExlZnRDYWNoZVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yRWxlbWVudC5nZXRTY3JvbGxMZWZ0KClcbiAgfVxuXG4gIGdldE1heFNjcm9sbFRvcCAoKSB7XG4gICAgaWYgKHRoaXMubWF4U2Nyb2xsVG9wQ2FjaGUgIT0gbnVsbCAmJiB0aGlzLnVzZUNhY2hlKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXhTY3JvbGxUb3BDYWNoZVxuICAgIH1cblxuICAgIGxldCBtYXhTY3JvbGxUb3AgPSB0aGlzLnRleHRFZGl0b3JFbGVtZW50LmdldFNjcm9sbEhlaWdodCgpIC0gdGhpcy5nZXRIZWlnaHQoKVxuICAgIGxldCBsaW5lSGVpZ2h0ID0gdGhpcy50ZXh0RWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG5cbiAgICBpZiAodGhpcy5zY3JvbGxQYXN0RW5kKSB7XG4gICAgICBtYXhTY3JvbGxUb3AgLT0gdGhpcy5nZXRIZWlnaHQoKSAtIDMgKiBsaW5lSGVpZ2h0XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudXNlQ2FjaGUpIHtcbiAgICAgIHRoaXMubWF4U2Nyb2xsVG9wQ2FjaGUgPSBtYXhTY3JvbGxUb3BcbiAgICB9XG5cbiAgICByZXR1cm4gbWF4U2Nyb2xsVG9wXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/adapters/stable-adapter.js

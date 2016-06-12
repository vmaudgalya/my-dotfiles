(function() {
  var CompositeDisposable, EventsDelegation, StickyTitle;

  CompositeDisposable = require('atom').CompositeDisposable;

  EventsDelegation = require('atom-utils').EventsDelegation;

  module.exports = StickyTitle = (function() {
    EventsDelegation.includeInto(StickyTitle);

    function StickyTitle(stickies, scrollContainer) {
      this.stickies = stickies;
      this.scrollContainer = scrollContainer;
      this.subscriptions = new CompositeDisposable;
      Array.prototype.forEach.call(this.stickies, function(sticky) {
        sticky.parentNode.style.height = sticky.offsetHeight + 'px';
        return sticky.style.width = sticky.offsetWidth + 'px';
      });
      this.subscriptions.add(this.subscribeTo(this.scrollContainer, {
        'scroll': (function(_this) {
          return function(e) {
            return _this.scroll(e);
          };
        })(this)
      }));
    }

    StickyTitle.prototype.dispose = function() {
      this.subscriptions.dispose();
      this.stickies = null;
      return this.scrollContainer = null;
    };

    StickyTitle.prototype.scroll = function(e) {
      var delta;
      delta = this.lastScrollTop ? this.lastScrollTop - this.scrollContainer.scrollTop : 0;
      Array.prototype.forEach.call(this.stickies, (function(_this) {
        return function(sticky, i) {
          var nextSticky, nextTop, parentTop, prevSticky, prevTop, scrollTop, top;
          nextSticky = _this.stickies[i + 1];
          prevSticky = _this.stickies[i - 1];
          scrollTop = _this.scrollContainer.getBoundingClientRect().top;
          parentTop = sticky.parentNode.getBoundingClientRect().top;
          top = sticky.getBoundingClientRect().top;
          if (parentTop < scrollTop) {
            if (!sticky.classList.contains('absolute')) {
              sticky.classList.add('fixed');
              sticky.style.top = scrollTop + 'px';
              if (nextSticky != null) {
                nextTop = nextSticky.parentNode.getBoundingClientRect().top;
                if (top + sticky.offsetHeight >= nextTop) {
                  sticky.classList.add('absolute');
                  return sticky.style.top = _this.scrollContainer.scrollTop + 'px';
                }
              }
            }
          } else {
            sticky.classList.remove('fixed');
            if ((prevSticky != null) && prevSticky.classList.contains('absolute')) {
              prevTop = prevSticky.getBoundingClientRect().top;
              if (delta < 0) {
                prevTop -= prevSticky.offsetHeight;
              }
              if (scrollTop <= prevTop) {
                prevSticky.classList.remove('absolute');
                return prevSticky.style.top = scrollTop + 'px';
              }
            }
          }
        };
      })(this));
      return this.lastScrollTop = this.scrollContainer.scrollTop;
    };

    return StickyTitle;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3N0aWNreS10aXRsZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0RBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLG1CQUFvQixPQUFBLENBQVEsWUFBUixFQUFwQixnQkFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FFTTtBQUNKLElBQUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsV0FBN0IsQ0FBQSxDQUFBOztBQUVhLElBQUEscUJBQUUsUUFBRixFQUFhLGVBQWIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFdBQUEsUUFDYixDQUFBO0FBQUEsTUFEdUIsSUFBQyxDQUFBLGtCQUFBLGVBQ3hCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFBLFNBQUUsQ0FBQSxPQUFPLENBQUMsSUFBZixDQUFvQixJQUFDLENBQUEsUUFBckIsRUFBK0IsU0FBQyxNQUFELEdBQUE7QUFDN0IsUUFBQSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUF4QixHQUFpQyxNQUFNLENBQUMsWUFBUCxHQUFzQixJQUF2RCxDQUFBO2VBQ0EsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFiLEdBQXFCLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLEtBRmI7TUFBQSxDQUEvQixDQURBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxlQUFkLEVBQStCO0FBQUEsUUFBQSxRQUFBLEVBQVUsQ0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/sticky-title.coffee

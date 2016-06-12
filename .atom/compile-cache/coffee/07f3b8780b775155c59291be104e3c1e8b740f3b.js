(function() {
  var StatusBarView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = StatusBarView = (function() {
    function StatusBarView() {
      this.removeElement = __bind(this.removeElement, this);
      this.getElement = __bind(this.getElement, this);
      this.element = document.createElement('div');
      this.element.classList.add("highlight-selected-status");
    }

    StatusBarView.prototype.updateCount = function(count) {
      this.element.textContent = "Highlighted: " + count;
      if (count === 0) {
        return this.element.classList.add("highlight-selected-hidden");
      } else {
        return this.element.classList.remove("highlight-selected-hidden");
      }
    };

    StatusBarView.prototype.getElement = function() {
      return this.element;
    };

    StatusBarView.prototype.removeElement = function() {
      this.element.parentNode.removeChild(this.element);
      return this.element = null;
    };

    return StatusBarView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LXNlbGVjdGVkL2xpYi9zdGF0dXMtYmFyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHVCQUFBLEdBQUE7QUFDWCwyREFBQSxDQUFBO0FBQUEscURBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLDJCQUF2QixDQURBLENBRFc7SUFBQSxDQUFiOztBQUFBLDRCQUlBLFdBQUEsR0FBYSxTQUFDLEtBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULEdBQXVCLGVBQUEsR0FBa0IsS0FBekMsQ0FBQTtBQUNBLE1BQUEsSUFBRyxLQUFBLEtBQVMsQ0FBWjtlQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLDJCQUF2QixFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQW5CLENBQTBCLDJCQUExQixFQUhGO09BRlc7SUFBQSxDQUpiLENBQUE7O0FBQUEsNEJBV0EsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxRQURTO0lBQUEsQ0FYWixDQUFBOztBQUFBLDRCQWNBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQXBCLENBQWdDLElBQUMsQ0FBQSxPQUFqQyxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBRkU7SUFBQSxDQWRmLENBQUE7O3lCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/highlight-selected/lib/status-bar-view.coffee

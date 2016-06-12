(function() {
  describe('Bottom Status Element', function() {
    var BottomStatus, bottomStatus;
    BottomStatus = require('../../lib/ui/bottom-status');
    bottomStatus = null;
    beforeEach(function() {
      return bottomStatus = new BottomStatus;
    });
    return describe('::visibility', function() {
      it('adds and removes the hidden attribute', function() {
        expect(bottomStatus.hasAttribute('hidden')).toBe(false);
        bottomStatus.visibility = true;
        expect(bottomStatus.hasAttribute('hidden')).toBe(false);
        bottomStatus.visibility = false;
        expect(bottomStatus.hasAttribute('hidden')).toBe(true);
        bottomStatus.visibility = true;
        return expect(bottomStatus.hasAttribute('hidden')).toBe(false);
      });
      return it('reports the visibility when getter is invoked', function() {
        expect(bottomStatus.visibility).toBe(true);
        bottomStatus.visibility = true;
        expect(bottomStatus.visibility).toBe(true);
        bottomStatus.visibility = false;
        expect(bottomStatus.visibility).toBe(false);
        bottomStatus.visibility = true;
        return expect(bottomStatus.visibility).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvdWkvYm90dG9tLXN0YXR1cy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFFBQUEsMEJBQUE7QUFBQSxJQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsNEJBQVIsQ0FBZixDQUFBO0FBQUEsSUFDQSxZQUFBLEdBQWUsSUFEZixDQUFBO0FBQUEsSUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsWUFBQSxHQUFlLEdBQUEsQ0FBQSxhQUROO0lBQUEsQ0FBWCxDQUhBLENBQUE7V0FNQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLFFBQUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxZQUFiLENBQTBCLFFBQTFCLENBQVAsQ0FBMkMsQ0FBQyxJQUE1QyxDQUFpRCxLQUFqRCxDQUFBLENBQUE7QUFBQSxRQUNBLFlBQVksQ0FBQyxVQUFiLEdBQTBCLElBRDFCLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxZQUFZLENBQUMsWUFBYixDQUEwQixRQUExQixDQUFQLENBQTJDLENBQUMsSUFBNUMsQ0FBaUQsS0FBakQsQ0FGQSxDQUFBO0FBQUEsUUFHQSxZQUFZLENBQUMsVUFBYixHQUEwQixLQUgxQixDQUFBO0FBQUEsUUFJQSxNQUFBLENBQU8sWUFBWSxDQUFDLFlBQWIsQ0FBMEIsUUFBMUIsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELElBQWpELENBSkEsQ0FBQTtBQUFBLFFBS0EsWUFBWSxDQUFDLFVBQWIsR0FBMEIsSUFMMUIsQ0FBQTtlQU1BLE1BQUEsQ0FBTyxZQUFZLENBQUMsWUFBYixDQUEwQixRQUExQixDQUFQLENBQTJDLENBQUMsSUFBNUMsQ0FBaUQsS0FBakQsRUFQMEM7TUFBQSxDQUE1QyxDQUFBLENBQUE7YUFTQSxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELFFBQUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLElBQXJDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsWUFBWSxDQUFDLFVBQWIsR0FBMEIsSUFEMUIsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLElBQXJDLENBRkEsQ0FBQTtBQUFBLFFBR0EsWUFBWSxDQUFDLFVBQWIsR0FBMEIsS0FIMUIsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLEtBQXJDLENBSkEsQ0FBQTtBQUFBLFFBS0EsWUFBWSxDQUFDLFVBQWIsR0FBMEIsSUFMMUIsQ0FBQTtlQU1BLE1BQUEsQ0FBTyxZQUFZLENBQUMsVUFBcEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxJQUFyQyxFQVBrRDtNQUFBLENBQXBELEVBVnVCO0lBQUEsQ0FBekIsRUFQZ0M7RUFBQSxDQUFsQyxDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/ui/bottom-status-spec.coffee

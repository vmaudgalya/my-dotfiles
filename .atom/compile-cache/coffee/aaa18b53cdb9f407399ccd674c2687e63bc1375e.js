(function() {
  describe('IndieRegistry', function() {
    var IndieRegistry, indieRegistry;
    IndieRegistry = require('../lib/indie-registry');
    indieRegistry = null;
    beforeEach(function() {
      if (indieRegistry != null) {
        indieRegistry.dispose();
      }
      return indieRegistry = new IndieRegistry();
    });
    describe('register', function() {
      return it('validates the args', function() {
        expect(function() {
          return indieRegistry.register({
            name: 2
          });
        }).toThrow();
        indieRegistry.register({});
        return indieRegistry.register({
          name: 'wow'
        });
      });
    });
    return describe('all of it', function() {
      return it('works', function() {
        var indie, listener, messages, observeListener;
        indie = indieRegistry.register({
          name: 'Wow'
        });
        expect(indieRegistry.has(indie)).toBe(false);
        expect(indieRegistry.has(0)).toBe(false);
        listener = jasmine.createSpy('linter.indie.messaging');
        observeListener = jasmine.createSpy('linter.indie.observe');
        messages = [{}];
        indieRegistry.onDidUpdateMessages(listener);
        indieRegistry.observe(observeListener);
        indie.setMessages(messages);
        expect(observeListener).toHaveBeenCalled();
        expect(observeListener).toHaveBeenCalledWith(indie);
        expect(listener).toHaveBeenCalled();
        expect(listener.mostRecentCall.args[0].linter.toBe(indie));
        expect(listener.mostRecentCall.args[0].messages.toBe(messages));
        indie.dispose();
        return expect(indieRegistry.has(indie)).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvaW5kaWUtcmVnaXN0cnkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLDRCQUFBO0FBQUEsSUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSx1QkFBUixDQUFoQixDQUFBO0FBQUEsSUFDQSxhQUFBLEdBQWdCLElBRGhCLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7O1FBQ1QsYUFBYSxDQUFFLE9BQWYsQ0FBQTtPQUFBO2FBQ0EsYUFBQSxHQUFvQixJQUFBLGFBQUEsQ0FBQSxFQUZYO0lBQUEsQ0FBWCxDQUhBLENBQUE7QUFBQSxJQU9BLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTthQUNuQixFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsTUFBQSxDQUFPLFNBQUEsR0FBQTtpQkFDTCxhQUFhLENBQUMsUUFBZCxDQUF1QjtBQUFBLFlBQUMsSUFBQSxFQUFNLENBQVA7V0FBdkIsRUFESztRQUFBLENBQVAsQ0FFQSxDQUFDLE9BRkQsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUdBLGFBQWEsQ0FBQyxRQUFkLENBQXVCLEVBQXZCLENBSEEsQ0FBQTtlQUlBLGFBQWEsQ0FBQyxRQUFkLENBQXVCO0FBQUEsVUFBQyxJQUFBLEVBQU0sS0FBUDtTQUF2QixFQUx1QjtNQUFBLENBQXpCLEVBRG1CO0lBQUEsQ0FBckIsQ0FQQSxDQUFBO1dBZUEsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO2FBQ3BCLEVBQUEsQ0FBRyxPQUFILEVBQVksU0FBQSxHQUFBO0FBQ1YsWUFBQSwwQ0FBQTtBQUFBLFFBQUEsS0FBQSxHQUFRLGFBQWEsQ0FBQyxRQUFkLENBQXVCO0FBQUEsVUFBQyxJQUFBLEVBQU0sS0FBUDtTQUF2QixDQUFSLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsR0FBZCxDQUFrQixLQUFsQixDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsS0FBdEMsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLEdBQWQsQ0FBa0IsQ0FBbEIsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBRkEsQ0FBQTtBQUFBLFFBSUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxTQUFSLENBQWtCLHdCQUFsQixDQUpYLENBQUE7QUFBQSxRQUtBLGVBQUEsR0FBa0IsT0FBTyxDQUFDLFNBQVIsQ0FBa0Isc0JBQWxCLENBTGxCLENBQUE7QUFBQSxRQU1BLFFBQUEsR0FBVyxDQUFDLEVBQUQsQ0FOWCxDQUFBO0FBQUEsUUFPQSxhQUFhLENBQUMsbUJBQWQsQ0FBa0MsUUFBbEMsQ0FQQSxDQUFBO0FBQUEsUUFRQSxhQUFhLENBQUMsT0FBZCxDQUFzQixlQUF0QixDQVJBLENBQUE7QUFBQSxRQVNBLEtBQUssQ0FBQyxXQUFOLENBQWtCLFFBQWxCLENBVEEsQ0FBQTtBQUFBLFFBVUEsTUFBQSxDQUFPLGVBQVAsQ0FBdUIsQ0FBQyxnQkFBeEIsQ0FBQSxDQVZBLENBQUE7QUFBQSxRQVdBLE1BQUEsQ0FBTyxlQUFQLENBQXVCLENBQUMsb0JBQXhCLENBQTZDLEtBQTdDLENBWEEsQ0FBQTtBQUFBLFFBWUEsTUFBQSxDQUFPLFFBQVAsQ0FBZ0IsQ0FBQyxnQkFBakIsQ0FBQSxDQVpBLENBQUE7QUFBQSxRQWFBLE1BQUEsQ0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFNLENBQUMsSUFBdkMsQ0FBNEMsS0FBNUMsQ0FBUCxDQWJBLENBQUE7QUFBQSxRQWNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFRLENBQUMsSUFBekMsQ0FBOEMsUUFBOUMsQ0FBUCxDQWRBLENBQUE7QUFBQSxRQWVBLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FmQSxDQUFBO2VBZ0JBLE1BQUEsQ0FBTyxhQUFhLENBQUMsR0FBZCxDQUFrQixLQUFsQixDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsS0FBdEMsRUFqQlU7TUFBQSxDQUFaLEVBRG9CO0lBQUEsQ0FBdEIsRUFoQndCO0VBQUEsQ0FBMUIsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/spec/indie-registry.coffee

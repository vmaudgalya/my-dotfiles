(function() {
  var PigmentsAPI;

  module.exports = PigmentsAPI = (function() {
    function PigmentsAPI(project) {
      this.project = project;
    }

    PigmentsAPI.prototype.getProject = function() {
      return this.project;
    };

    PigmentsAPI.prototype.getPalette = function() {
      return this.project.getPalette();
    };

    PigmentsAPI.prototype.getVariables = function() {
      return this.project.getVariables();
    };

    PigmentsAPI.prototype.getColorVariables = function() {
      return this.project.getColorVariables();
    };

    PigmentsAPI.prototype.observeColorBuffers = function(callback) {
      return this.project.observeColorBuffers(callback);
    };

    return PigmentsAPI;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BpZ21lbnRzLWFwaS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHFCQUFFLE9BQUYsR0FBQTtBQUFZLE1BQVgsSUFBQyxDQUFBLFVBQUEsT0FBVSxDQUFaO0lBQUEsQ0FBYjs7QUFBQSwwQkFFQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFFBQUo7SUFBQSxDQUZaLENBQUE7O0FBQUEsMEJBSUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxDQUFBLEVBQUg7SUFBQSxDQUpaLENBQUE7O0FBQUEsMEJBTUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFBLEVBQUg7SUFBQSxDQU5kLENBQUE7O0FBQUEsMEJBUUEsaUJBQUEsR0FBbUIsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxpQkFBVCxDQUFBLEVBQUg7SUFBQSxDQVJuQixDQUFBOztBQUFBLDBCQVVBLG1CQUFBLEdBQXFCLFNBQUMsUUFBRCxHQUFBO2FBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxtQkFBVCxDQUE2QixRQUE3QixFQUFkO0lBQUEsQ0FWckIsQ0FBQTs7dUJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/pigments-api.coffee

(function() {
  var Pigments, registry;

  registry = require('../../lib/color-expressions');

  Pigments = require('../../lib/pigments');

  beforeEach(function() {
    Pigments.loadDeserializersAndRegisterViews();
    return registry.removeExpression('pigments:variables');
  });

  afterEach(function() {
    return registry.removeExpression('pigments:variables');
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9oZWxwZXJzL3NwZWMtaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsNkJBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxvQkFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsSUFBQSxRQUFRLENBQUMsaUNBQVQsQ0FBQSxDQUFBLENBQUE7V0FDQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsb0JBQTFCLEVBRlM7RUFBQSxDQUFYLENBSEEsQ0FBQTs7QUFBQSxFQU9BLFNBQUEsQ0FBVSxTQUFBLEdBQUE7V0FDUixRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsb0JBQTFCLEVBRFE7RUFBQSxDQUFWLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/helpers/spec-helper.coffee

(function() {
  var path;

  path = require('path');

  module.exports = function(p) {
    if (p.match(/\/\.pigments$/)) {
      return 'pigments';
    }
    return path.extname(p).slice(1);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Njb3BlLWZyb20tZmlsZS1uYW1lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsQ0FBRCxHQUFBO0FBQ2YsSUFBQSxJQUFxQixDQUFDLENBQUMsS0FBRixDQUFRLGVBQVIsQ0FBckI7QUFBQSxhQUFPLFVBQVAsQ0FBQTtLQUFBO1dBQ0EsSUFBSSxDQUFDLE9BQUwsQ0FBYSxDQUFiLENBQWdCLFVBRkQ7RUFBQSxDQURqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/scope-from-file-name.coffee

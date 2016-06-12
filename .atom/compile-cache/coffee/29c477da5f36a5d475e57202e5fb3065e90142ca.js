(function() {
  var fs, path,
    __slice = [].slice;

  fs = require('fs');

  path = require('path');

  module.exports = {
    jsonFixture: function() {
      var paths;
      paths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return function(fixture, data) {
        var json, jsonPath;
        jsonPath = path.resolve.apply(path, __slice.call(paths).concat([fixture]));
        json = fs.readFileSync(jsonPath).toString();
        json = json.replace(/#\{([\w\[\]]+)\}/g, function(m, w) {
          var match, _;
          if (match = /^\[(\w+)\]$/.exec(w)) {
            _ = match[0], w = match[1];
            return data[w].shift();
          } else {
            return data[w];
          }
        });
        return JSON.parse(json);
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9oZWxwZXJzL2ZpeHR1cmVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxRQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFdBQUEsRUFBYSxTQUFBLEdBQUE7QUFBYyxVQUFBLEtBQUE7QUFBQSxNQUFiLCtEQUFhLENBQUE7YUFBQSxTQUFDLE9BQUQsRUFBVSxJQUFWLEdBQUE7QUFDekIsWUFBQSxjQUFBO0FBQUEsUUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQUwsYUFBYSxhQUFBLEtBQUEsQ0FBQSxRQUFVLENBQUEsT0FBQSxDQUFWLENBQWIsQ0FBWCxDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsUUFBaEIsQ0FBeUIsQ0FBQyxRQUExQixDQUFBLENBRFAsQ0FBQTtBQUFBLFFBRUEsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsbUJBQWIsRUFBa0MsU0FBQyxDQUFELEVBQUcsQ0FBSCxHQUFBO0FBQ3ZDLGNBQUEsUUFBQTtBQUFBLFVBQUEsSUFBRyxLQUFBLEdBQVEsYUFBYSxDQUFDLElBQWQsQ0FBbUIsQ0FBbkIsQ0FBWDtBQUNFLFlBQUMsWUFBRCxFQUFHLFlBQUgsQ0FBQTttQkFDQSxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBUixDQUFBLEVBRkY7V0FBQSxNQUFBO21CQUlFLElBQUssQ0FBQSxDQUFBLEVBSlA7V0FEdUM7UUFBQSxDQUFsQyxDQUZQLENBQUE7ZUFTQSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsRUFWeUI7TUFBQSxFQUFkO0lBQUEsQ0FBYjtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/helpers/fixtures.coffee

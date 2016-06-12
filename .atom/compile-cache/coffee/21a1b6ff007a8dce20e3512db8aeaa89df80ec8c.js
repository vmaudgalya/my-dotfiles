(function() {
  var Beautifiers, Handlebars, beautifier, beautifierName, beautifierOptions, beautifiers, context, exampleConfig, fs, languageOptions, linkifyTitle, optionDef, optionName, optionTemplate, optionTemplatePath, optionsPath, optionsTemplate, optionsTemplatePath, packageOptions, result, template, _i, _len, _ref;

  Handlebars = require('handlebars');

  Beautifiers = require("../src/beautifiers");

  fs = require('fs');

  console.log('Generating options...');

  beautifier = new Beautifiers();

  languageOptions = beautifier.options;

  packageOptions = require('../src/config.coffee');

  beautifierOptions = {};

  for (optionName in languageOptions) {
    optionDef = languageOptions[optionName];
    beautifiers = (_ref = optionDef.beautifiers) != null ? _ref : [];
    for (_i = 0, _len = beautifiers.length; _i < _len; _i++) {
      beautifierName = beautifiers[_i];
      if (beautifierOptions[beautifierName] == null) {
        beautifierOptions[beautifierName] = {};
      }
      beautifierOptions[beautifierName][optionName] = optionDef;
    }
  }

  console.log('Loading options template...');

  optionsTemplatePath = __dirname + '/options-template.md';

  optionTemplatePath = __dirname + '/option-template.md';

  optionsPath = __dirname + '/options.md';

  optionsTemplate = fs.readFileSync(optionsTemplatePath).toString();

  optionTemplate = fs.readFileSync(optionTemplatePath).toString();

  console.log('Building documentation from template and options...');

  Handlebars.registerPartial('option', optionTemplate);

  template = Handlebars.compile(optionsTemplate);

  linkifyTitle = function(title) {
    var p, sep;
    title = title.toLowerCase();
    p = title.split(/[\s,+#;,\/?:@&=+$]+/);
    sep = "-";
    return p.join(sep);
  };

  Handlebars.registerHelper('linkify', function(title, options) {
    return new Handlebars.SafeString("[" + (options.fn(this)) + "](\#" + (linkifyTitle(title)) + ")");
  });

  exampleConfig = function(option) {
    var c, d, json, k, namespace, t;
    t = option.type;
    d = (function() {
      switch (false) {
        case option["default"] == null:
          return option["default"];
        case t !== "string":
          return "";
        case t !== "integer":
          return 0;
        case t !== "boolean":
          return false;
        default:
          return null;
      }
    })();
    json = {};
    namespace = option.language.namespace;
    k = option.key;
    c = {};
    c[k] = d;
    json[namespace] = c;
    return "```json\n" + (JSON.stringify(json, void 0, 4)) + "\n```";
  };

  Handlebars.registerHelper('example-config', function(key, option, options) {
    var results;
    results = exampleConfig(key, option);
    return new Handlebars.SafeString(results);
  });

  context = {
    packageOptions: packageOptions,
    languageOptions: languageOptions,
    beautifierOptions: beautifierOptions
  };

  result = template(context);

  console.log('Writing documentation to file...');

  fs.writeFileSync(optionsPath, result);

  console.log('Done.');

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9kb2NzL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUdBO0FBQUEsTUFBQSw4U0FBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLG9CQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxPQUFPLENBQUMsR0FBUixDQUFZLHVCQUFaLENBSkEsQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBaUIsSUFBQSxXQUFBLENBQUEsQ0FMakIsQ0FBQTs7QUFBQSxFQU1BLGVBQUEsR0FBa0IsVUFBVSxDQUFDLE9BTjdCLENBQUE7O0FBQUEsRUFPQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxzQkFBUixDQVBqQixDQUFBOztBQUFBLEVBU0EsaUJBQUEsR0FBb0IsRUFUcEIsQ0FBQTs7QUFVQSxPQUFBLDZCQUFBOzRDQUFBO0FBQ0ksSUFBQSxXQUFBLG1EQUFzQyxFQUF0QyxDQUFBO0FBQ0EsU0FBQSxrREFBQTt1Q0FBQTs7UUFDSSxpQkFBa0IsQ0FBQSxjQUFBLElBQW1CO09BQXJDO0FBQUEsTUFDQSxpQkFBa0IsQ0FBQSxjQUFBLENBQWdCLENBQUEsVUFBQSxDQUFsQyxHQUFnRCxTQURoRCxDQURKO0FBQUEsS0FGSjtBQUFBLEdBVkE7O0FBQUEsRUFnQkEsT0FBTyxDQUFDLEdBQVIsQ0FBWSw2QkFBWixDQWhCQSxDQUFBOztBQUFBLEVBaUJBLG1CQUFBLEdBQXNCLFNBQUEsR0FBWSxzQkFqQmxDLENBQUE7O0FBQUEsRUFrQkEsa0JBQUEsR0FBcUIsU0FBQSxHQUFZLHFCQWxCakMsQ0FBQTs7QUFBQSxFQW1CQSxXQUFBLEdBQWMsU0FBQSxHQUFZLGFBbkIxQixDQUFBOztBQUFBLEVBb0JBLGVBQUEsR0FBa0IsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsbUJBQWhCLENBQW9DLENBQUMsUUFBckMsQ0FBQSxDQXBCbEIsQ0FBQTs7QUFBQSxFQXFCQSxjQUFBLEdBQWlCLEVBQUUsQ0FBQyxZQUFILENBQWdCLGtCQUFoQixDQUFtQyxDQUFDLFFBQXBDLENBQUEsQ0FyQmpCLENBQUE7O0FBQUEsRUF1QkEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxxREFBWixDQXZCQSxDQUFBOztBQUFBLEVBd0JBLFVBQVUsQ0FBQyxlQUFYLENBQTJCLFFBQTNCLEVBQXFDLGNBQXJDLENBeEJBLENBQUE7O0FBQUEsRUF5QkEsUUFBQSxHQUFXLFVBQVUsQ0FBQyxPQUFYLENBQW1CLGVBQW5CLENBekJYLENBQUE7O0FBQUEsRUEyQkEsWUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ1gsUUFBQSxNQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLFdBQU4sQ0FBQSxDQUFSLENBQUE7QUFBQSxJQUNBLENBQUEsR0FBSSxLQUFLLENBQUMsS0FBTixDQUFZLHFCQUFaLENBREosQ0FBQTtBQUFBLElBRUEsR0FBQSxHQUFNLEdBRk4sQ0FBQTtXQUdBLENBQUMsQ0FBQyxJQUFGLENBQU8sR0FBUCxFQUpXO0VBQUEsQ0EzQmYsQ0FBQTs7QUFBQSxFQWlDQSxVQUFVLENBQUMsY0FBWCxDQUEwQixTQUExQixFQUFxQyxTQUFDLEtBQUQsRUFBUSxPQUFSLEdBQUE7QUFDakMsV0FBVyxJQUFBLFVBQVUsQ0FBQyxVQUFYLENBQ04sR0FBQSxHQUFFLENBQUMsT0FBTyxDQUFDLEVBQVIsQ0FBVyxJQUFYLENBQUQsQ0FBRixHQUFvQixNQUFwQixHQUF5QixDQUFDLFlBQUEsQ0FBYSxLQUFiLENBQUQsQ0FBekIsR0FBOEMsR0FEeEMsQ0FBWCxDQURpQztFQUFBLENBQXJDLENBakNBLENBQUE7O0FBQUEsRUF1Q0EsYUFBQSxHQUFnQixTQUFDLE1BQUQsR0FBQTtBQUVkLFFBQUEsMkJBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxNQUFNLENBQUMsSUFBWCxDQUFBO0FBQUEsSUFDQSxDQUFBO0FBQUksY0FBQSxLQUFBO0FBQUEsYUFDRyx5QkFESDtpQkFDd0IsTUFBTSxDQUFDLFNBQUQsRUFEOUI7QUFBQSxhQUVHLENBQUEsS0FBSyxRQUZSO2lCQUVzQixHQUZ0QjtBQUFBLGFBR0csQ0FBQSxLQUFLLFNBSFI7aUJBR3VCLEVBSHZCO0FBQUEsYUFJRyxDQUFBLEtBQUssU0FKUjtpQkFJdUIsTUFKdkI7QUFBQTtpQkFLRyxLQUxIO0FBQUE7UUFESixDQUFBO0FBQUEsSUFRQSxJQUFBLEdBQU8sRUFSUCxDQUFBO0FBQUEsSUFTQSxTQUFBLEdBQVksTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQVQ1QixDQUFBO0FBQUEsSUFVQSxDQUFBLEdBQUksTUFBTSxDQUFDLEdBVlgsQ0FBQTtBQUFBLElBV0EsQ0FBQSxHQUFJLEVBWEosQ0FBQTtBQUFBLElBWUEsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLENBWlAsQ0FBQTtBQUFBLElBYUEsSUFBSyxDQUFBLFNBQUEsQ0FBTCxHQUFrQixDQWJsQixDQUFBO0FBY0EsV0FBVSxXQUFBLEdBQ1gsQ0FBQyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBZ0MsQ0FBaEMsQ0FBRCxDQURXLEdBQ3lCLE9BRG5DLENBaEJjO0VBQUEsQ0F2Q2hCLENBQUE7O0FBQUEsRUEyREEsVUFBVSxDQUFDLGNBQVgsQ0FBMEIsZ0JBQTFCLEVBQTRDLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxPQUFkLEdBQUE7QUFDMUMsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsYUFBQSxDQUFjLEdBQWQsRUFBbUIsTUFBbkIsQ0FBVixDQUFBO0FBRUEsV0FBVyxJQUFBLFVBQVUsQ0FBQyxVQUFYLENBQXNCLE9BQXRCLENBQVgsQ0FIMEM7RUFBQSxDQUE1QyxDQTNEQSxDQUFBOztBQUFBLEVBaUVBLE9BQUEsR0FBVTtBQUFBLElBQ04sY0FBQSxFQUFnQixjQURWO0FBQUEsSUFFTixlQUFBLEVBQWlCLGVBRlg7QUFBQSxJQUdOLGlCQUFBLEVBQW1CLGlCQUhiO0dBakVWLENBQUE7O0FBQUEsRUFzRUEsTUFBQSxHQUFTLFFBQUEsQ0FBUyxPQUFULENBdEVULENBQUE7O0FBQUEsRUF3RUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQ0FBWixDQXhFQSxDQUFBOztBQUFBLEVBeUVBLEVBQUUsQ0FBQyxhQUFILENBQWlCLFdBQWpCLEVBQThCLE1BQTlCLENBekVBLENBQUE7O0FBQUEsRUEyRUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaLENBM0VBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/docs/index.coffee

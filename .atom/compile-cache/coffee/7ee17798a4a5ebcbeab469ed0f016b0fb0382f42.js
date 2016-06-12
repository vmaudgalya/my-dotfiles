(function() {
  var Beautifiers, Handlebars, beautifier, beautifierName, beautifierOptions, beautifiers, context, exampleConfig, fs, languageOptions, linkifyTitle, lo, optionDef, optionGroup, optionGroupTemplate, optionGroupTemplatePath, optionName, optionTemplate, optionTemplatePath, optionsPath, optionsTemplate, optionsTemplatePath, packageOptions, result, sortKeysBy, sortSettings, template, _, _i, _len, _ref, _ref1;

  Handlebars = require('handlebars');

  Beautifiers = require("../src/beautifiers");

  fs = require('fs');

  _ = require('lodash');

  console.log('Generating options...');

  beautifier = new Beautifiers();

  languageOptions = beautifier.options;

  packageOptions = require('../src/config.coffee');

  beautifierOptions = {};

  for (lo in languageOptions) {
    optionGroup = languageOptions[lo];
    _ref = optionGroup.properties;
    for (optionName in _ref) {
      optionDef = _ref[optionName];
      beautifiers = (_ref1 = optionDef.beautifiers) != null ? _ref1 : [];
      for (_i = 0, _len = beautifiers.length; _i < _len; _i++) {
        beautifierName = beautifiers[_i];
        if (beautifierOptions[beautifierName] == null) {
          beautifierOptions[beautifierName] = {};
        }
        beautifierOptions[beautifierName][optionName] = optionDef;
      }
    }
  }

  console.log('Loading options template...');

  optionsTemplatePath = __dirname + '/options-template.md';

  optionTemplatePath = __dirname + '/option-template.md';

  optionGroupTemplatePath = __dirname + '/option-group-template.md';

  optionsPath = __dirname + '/options.md';

  optionsTemplate = fs.readFileSync(optionsTemplatePath).toString();

  optionGroupTemplate = fs.readFileSync(optionGroupTemplatePath).toString();

  optionTemplate = fs.readFileSync(optionTemplatePath).toString();

  console.log('Building documentation from template and options...');

  Handlebars.registerPartial('option', optionTemplate);

  Handlebars.registerPartial('option-group', optionGroupTemplate);

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

  sortKeysBy = function(obj, comparator) {
    var keys;
    keys = _.sortBy(_.keys(obj), function(key) {
      if (comparator) {
        return comparator(obj[key], key);
      } else {
        return key;
      }
    });
    return _.zipObject(keys, _.map(keys, function(key) {
      return obj[key];
    }));
  };

  sortSettings = function(settings) {
    var r;
    r = _.mapValues(settings, function(op) {
      if (op.type === "object" && op.properties) {
        op.properties = sortSettings(op.properties);
      }
      return op;
    });
    r = sortKeysBy(sortKeysBy(r), function(op) {
      return op.order;
    });
    return r;
  };

  context = {
    packageOptions: sortSettings(packageOptions),
    languageOptions: sortSettings(languageOptions),
    beautifierOptions: sortSettings(beautifierOptions)
  };

  result = template(context);

  console.log('Writing documentation to file...');

  fs.writeFileSync(optionsPath, result);

  console.log('Done.');

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9kb2NzL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUdBO0FBQUEsTUFBQSxpWkFBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLG9CQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FISixDQUFBOztBQUFBLEVBS0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSx1QkFBWixDQUxBLENBQUE7O0FBQUEsRUFNQSxVQUFBLEdBQWlCLElBQUEsV0FBQSxDQUFBLENBTmpCLENBQUE7O0FBQUEsRUFPQSxlQUFBLEdBQWtCLFVBQVUsQ0FBQyxPQVA3QixDQUFBOztBQUFBLEVBUUEsY0FBQSxHQUFpQixPQUFBLENBQVEsc0JBQVIsQ0FSakIsQ0FBQTs7QUFBQSxFQVVBLGlCQUFBLEdBQW9CLEVBVnBCLENBQUE7O0FBV0EsT0FBQSxxQkFBQTtzQ0FBQTtBQUNFO0FBQUEsU0FBQSxrQkFBQTttQ0FBQTtBQUNFLE1BQUEsV0FBQSxxREFBc0MsRUFBdEMsQ0FBQTtBQUNBLFdBQUEsa0RBQUE7eUNBQUE7O1VBQ0UsaUJBQWtCLENBQUEsY0FBQSxJQUFtQjtTQUFyQztBQUFBLFFBQ0EsaUJBQWtCLENBQUEsY0FBQSxDQUFnQixDQUFBLFVBQUEsQ0FBbEMsR0FBZ0QsU0FEaEQsQ0FERjtBQUFBLE9BRkY7QUFBQSxLQURGO0FBQUEsR0FYQTs7QUFBQSxFQWtCQSxPQUFPLENBQUMsR0FBUixDQUFZLDZCQUFaLENBbEJBLENBQUE7O0FBQUEsRUFtQkEsbUJB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/docs/index.coffee

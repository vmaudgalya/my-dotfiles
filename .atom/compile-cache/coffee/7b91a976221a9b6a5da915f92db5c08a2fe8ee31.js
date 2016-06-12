(function() {
  var ColorProjectElement, CompositeDisposable, EventsDelegation, SpacePenDSL, capitalize, registerOrUpdateElement, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-utils'), SpacePenDSL = _ref.SpacePenDSL, EventsDelegation = _ref.EventsDelegation, registerOrUpdateElement = _ref.registerOrUpdateElement;

  capitalize = function(s) {
    return s.replace(/^./, function(m) {
      return m.toUpperCase();
    });
  };

  ColorProjectElement = (function(_super) {
    __extends(ColorProjectElement, _super);

    function ColorProjectElement() {
      return ColorProjectElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(ColorProjectElement);

    EventsDelegation.includeInto(ColorProjectElement);

    ColorProjectElement.content = function() {
      var arrayField, booleanField;
      arrayField = (function(_this) {
        return function(name, label, setting, description) {
          var settingName;
          settingName = "pigments." + name;
          return _this.div({
            "class": 'control-group array'
          }, function() {
            return _this.div({
              "class": 'controls'
            }, function() {
              _this.label({
                "class": 'control-label'
              }, function() {
                return _this.span({
                  "class": 'setting-title'
                }, label);
              });
              return _this.div({
                "class": 'control-wrapper'
              }, function() {
                _this.tag('atom-text-editor', {
                  mini: true,
                  outlet: name,
                  type: 'array',
                  property: name
                });
                return _this.div({
                  "class": 'setting-description'
                }, function() {
                  _this.div(function() {
                    _this.raw("Global config: <code>" + (atom.config.get(setting != null ? setting : settingName).join(', ')) + "</code>");
                    if (description != null) {
                      return _this.p(function() {
                        return _this.raw(description);
                      });
                    }
                  });
                  return booleanField("ignoreGlobal" + (capitalize(name)), 'Ignore Global', null, true);
                });
              });
            });
          });
        };
      })(this);
      booleanField = (function(_this) {
        return function(name, label, description, nested) {
          return _this.div({
            "class": 'control-group boolean'
          }, function() {
            return _this.div({
              "class": 'controls'
            }, function() {
              _this.input({
                type: 'checkbox',
                id: "pigments-" + name,
                outlet: name
              });
              _this.label({
                "class": 'control-label',
                "for": "pigments-" + name
              }, function() {
                return _this.span({
                  "class": (nested ? 'setting-description' : 'setting-title')
                }, label);
              });
              if (description != null) {
                return _this.div({
                  "class": 'setting-description'
                }, function() {
                  return _this.raw(description);
                });
              }
            });
          });
        };
      })(this);
      return this.section({
        "class": 'settings-view pane-item'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'settings-wrapper'
          }, function() {
            _this.div({
              "class": 'header'
            }, function() {
              _this.div({
                "class": 'logo'
              }, function() {
                return _this.img({
                  src: 'atom://pigments/resources/logo.svg',
                  width: 140,
                  height: 35
                });
              });
              return _this.p({
                "class": 'setting-description'
              }, "These settings apply on the current project only and are complementary\nto the package settings.");
            });
            return _this.div({
              "class": 'fields'
            }, function() {
              var themes;
              themes = atom.themes.getActiveThemeNames();
              arrayField('sourceNames', 'Source Names');
              arrayField('ignoredNames', 'Ignored Names');
              arrayField('supportedFiletypes', 'Supported Filetypes');
              arrayField('ignoredScopes', 'Ignored Scopes');
              arrayField('searchNames', 'Extended Search Names', 'pigments.extendedSearchNames');
              return booleanField('includeThemes', 'Include Atom Themes Stylesheets', "The variables from <code>" + themes[0] + "</code> and\n<code>" + themes[1] + "</code> themes will be automatically added to the\nproject palette.");
            });
          });
        };
      })(this));
    };

    ColorProjectElement.prototype.createdCallback = function() {
      return this.subscriptions = new CompositeDisposable;
    };

    ColorProjectElement.prototype.setModel = function(project) {
      this.project = project;
      return this.initializeBindings();
    };

    ColorProjectElement.prototype.initializeBindings = function() {
      var grammar;
      grammar = atom.grammars.grammarForScopeName('source.js.regexp');
      this.ignoredScopes.getModel().setGrammar(grammar);
      this.initializeTextEditor('sourceNames');
      this.initializeTextEditor('searchNames');
      this.initializeTextEditor('ignoredNames');
      this.initializeTextEditor('ignoredScopes');
      this.initializeTextEditor('supportedFiletypes');
      this.initializeCheckbox('includeThemes');
      this.initializeCheckbox('ignoreGlobalSourceNames');
      this.initializeCheckbox('ignoreGlobalIgnoredNames');
      this.initializeCheckbox('ignoreGlobalIgnoredScopes');
      this.initializeCheckbox('ignoreGlobalSearchNames');
      return this.initializeCheckbox('ignoreGlobalSupportedFiletypes');
    };

    ColorProjectElement.prototype.initializeTextEditor = function(name) {
      var capitalizedName, editor, _ref1;
      capitalizedName = capitalize(name);
      editor = this[name].getModel();
      editor.setText(((_ref1 = this.project[name]) != null ? _ref1 : []).join(', '));
      return this.subscriptions.add(editor.onDidStopChanging((function(_this) {
        return function() {
          var array;
          array = editor.getText().split(/\s*,\s*/g).filter(function(s) {
            return s.length > 0;
          });
          return _this.project["set" + capitalizedName](array);
        };
      })(this)));
    };

    ColorProjectElement.prototype.initializeCheckbox = function(name) {
      var capitalizedName, checkbox;
      capitalizedName = capitalize(name);
      checkbox = this[name];
      checkbox.checked = this.project[name];
      return this.subscriptions.add(this.subscribeTo(checkbox, {
        change: (function(_this) {
          return function() {
            return _this.project["set" + capitalizedName](checkbox.checked);
          };
        })(this)
      }));
    };

    ColorProjectElement.prototype.getTitle = function() {
      return 'Project Settings';
    };

    ColorProjectElement.prototype.getURI = function() {
      return 'pigments://settings';
    };

    ColorProjectElement.prototype.getIconName = function() {
      return "pigments";
    };

    ColorProjectElement.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name
      };
    };

    return ColorProjectElement;

  })(HTMLElement);

  module.exports = ColorProjectElement = registerOrUpdateElement('pigments-color-project', ColorProjectElement.prototype);

  ColorProjectElement.deserialize = function(state) {
    var element;
    element = new ColorProjectElement;
    element.setModel(atom.packages.getActivePackage('pigments').mainModule.getProject());
    return element;
  };

  ColorProjectElement.registerViewProvider = function(modelClass) {
    return atom.views.addViewProvider(modelClass, function(model) {
      var element;
      element = new ColorProjectElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXByb2plY3QtZWxlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0hBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBMkQsT0FBQSxDQUFRLFlBQVIsQ0FBM0QsRUFBQyxtQkFBQSxXQUFELEVBQWMsd0JBQUEsZ0JBQWQsRUFBZ0MsK0JBQUEsdUJBRGhDLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsU0FBQyxDQUFELEdBQUE7V0FBTyxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsU0FBQyxDQUFELEdBQUE7YUFBTyxDQUFDLENBQUMsV0FBRixDQUFBLEVBQVA7SUFBQSxDQUFoQixFQUFQO0VBQUEsQ0FIYixDQUFBOztBQUFBLEVBS007QUFDSiwwQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxXQUFXLENBQUMsV0FBWixDQUF3QixtQkFBeEIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsbUJBQTdCLENBREEsQ0FBQTs7QUFBQSxJQUdBLG1CQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsd0JBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLE9BQWQsRUFBdUIsV0FBdkIsR0FBQTtBQUNYLGNBQUEsV0FBQTtBQUFBLFVBQUEsV0FBQSxHQUFlLFdBQUEsR0FBVyxJQUExQixDQUFBO2lCQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxxQkFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-project-element.coffee

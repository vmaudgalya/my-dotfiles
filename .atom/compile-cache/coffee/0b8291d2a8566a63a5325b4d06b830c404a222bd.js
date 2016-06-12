(function() {
  var BufferedProcess, CompositeDisposable, MinimapPluginGeneratorElement, TextEditor, fs, path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  fs = require('fs-plus');

  path = require('path');

  _ref = require('atom'), TextEditor = _ref.TextEditor, BufferedProcess = _ref.BufferedProcess;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  module.exports = MinimapPluginGeneratorElement = (function(_super) {
    __extends(MinimapPluginGeneratorElement, _super);

    function MinimapPluginGeneratorElement() {
      return MinimapPluginGeneratorElement.__super__.constructor.apply(this, arguments);
    }

    MinimapPluginGeneratorElement.prototype.previouslyFocusedElement = null;

    MinimapPluginGeneratorElement.prototype.mode = null;

    MinimapPluginGeneratorElement.prototype.createdCallback = function() {
      this.classList.add('minimap-plugin-generator');
      this.classList.add('overlay');
      this.classList.add('from-top');
      this.editor = new TextEditor({
        mini: true
      });
      this.editorElement = atom.views.getView(this.editor);
      this.error = document.createElement('div');
      this.error.classList.add('error');
      this.message = document.createElement('div');
      this.message.classList.add('message');
      this.appendChild(this.editorElement);
      this.appendChild(this.error);
      return this.appendChild(this.message);
    };

    MinimapPluginGeneratorElement.prototype.attachedCallback = function() {
      this.previouslyFocusedElement = document.activeElement;
      this.message.textContent = "Enter plugin path";
      this.setPathText("my-minimap-plugin");
      return this.editorElement.focus();
    };

    MinimapPluginGeneratorElement.prototype.attach = function() {
      return atom.views.getView(atom.workspace).appendChild(this);
    };

    MinimapPluginGeneratorElement.prototype.setPathText = function(placeholderName, rangeToSelect) {
      var endOfDirectoryIndex, packagesDirectory, pathLength;
      if (rangeToSelect == null) {
        rangeToSelect = [0, placeholderName.length];
      }
      packagesDirectory = this.getPackagesDirectory();
      this.editor.setText(path.join(packagesDirectory, placeholderName));
      pathLength = this.editor.getText().length;
      endOfDirectoryIndex = pathLength - placeholderName.length;
      return this.editor.setSelectedBufferRange([[0, endOfDirectoryIndex + rangeToSelect[0]], [0, endOfDirectoryIndex + rangeToSelect[1]]]);
    };

    MinimapPluginGeneratorElement.prototype.detach = function() {
      var _ref1;
      if (this.parentNode == null) {
        return;
      }
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return this.parentNode.removeChild(this);
    };

    MinimapPluginGeneratorElement.prototype.confirm = function() {
      if (this.validPackagePath()) {
        this.removeChild(this.editorElement);
        this.message.innerHTML = "<span class='loading loading-spinner-tiny inline-block'></span>\nGenerate plugin at <span class=\"text-primary\">" + (this.getPackagePath()) + "</span>";
        return this.createPackageFiles((function(_this) {
          return function() {
            var packagePath;
            packagePath = _this.getPackagePath();
            atom.open({
              pathsToOpen: [packagePath],
              devMode: atom.config.get('minimap.createPluginInDevMode')
            });
            _this.message.innerHTML = "<span class=\"text-success\">Plugin successfully generated, opening it now...</span>";
            return setTimeout(function() {
              return _this.detach();
            }, 2000);
          };
        })(this));
      }
    };

    MinimapPluginGeneratorElement.prototype.getPackagePath = function() {
      var packageName, packagePath;
      packagePath = this.editor.getText();
      packageName = _.dasherize(path.basename(packagePath));
      return path.join(path.dirname(packagePath), packageName);
    };

    MinimapPluginGeneratorElement.prototype.getPackagesDirectory = function() {
      return atom.config.get('core.projectHome') || process.env.ATOM_REPOS_HOME || path.join(fs.getHomeDirectory(), 'github');
    };

    MinimapPluginGeneratorElement.prototype.validPackagePath = function() {
      if (fs.existsSync(this.getPackagePath())) {
        this.error.textContent = "Path already exists at '" + (this.getPackagePath()) + "'";
        this.error.style.display = 'block';
        return false;
      } else {
        return true;
      }
    };

    MinimapPluginGeneratorElement.prototype.initPackage = function(packagePath, callback) {
      var templatePath;
      templatePath = path.resolve(__dirname, path.join('..', 'templates', "plugin-" + this.template));
      return this.runCommand(atom.packages.getApmPath(), ['init', "-p", "" + packagePath, "--template", templatePath], callback);
    };

    MinimapPluginGeneratorElement.prototype.linkPackage = function(packagePath, callback) {
      var args;
      args = ['link'];
      if (atom.config.get('minimap.createPluginInDevMode')) {
        args.push('--dev');
      }
      args.push(packagePath.toString());
      return this.runCommand(atom.packages.getApmPath(), args, callback);
    };

    MinimapPluginGeneratorElement.prototype.installPackage = function(packagePath, callback) {
      var args;
      args = ['install'];
      return this.runCommand(atom.packages.getApmPath(), args, callback, {
        cwd: packagePath
      });
    };

    MinimapPluginGeneratorElement.prototype.isStoredInDotAtom = function(packagePath) {
      var devPackagesPath, packagesPath;
      packagesPath = path.join(atom.getConfigDirPath(), 'packages', path.sep);
      if (packagePath.indexOf(packagesPath) === 0) {
        return true;
      }
      devPackagesPath = path.join(atom.getConfigDirPath(), 'dev', 'packages', path.sep);
      return packagePath.indexOf(devPackagesPath) === 0;
    };

    MinimapPluginGeneratorElement.prototype.createPackageFiles = function(callback) {
      var packagePath, packagesDirectory;
      packagePath = this.getPackagePath();
      packagesDirectory = this.getPackagesDirectory();
      if (this.isStoredInDotAtom(packagePath)) {
        return this.initPackage(packagePath, (function(_this) {
          return function() {
            return _this.installPackage(packagePath, callback);
          };
        })(this));
      } else {
        return this.initPackage(packagePath, (function(_this) {
          return function() {
            return _this.linkPackage(packagePath, function() {
              return _this.installPackage(packagePath, callback);
            });
          };
        })(this));
      }
    };

    MinimapPluginGeneratorElement.prototype.runCommand = function(command, args, exit, options) {
      if (options == null) {
        options = {};
      }
      return new BufferedProcess({
        command: command,
        args: args,
        exit: exit,
        options: options
      });
    };

    return MinimapPluginGeneratorElement;

  })(HTMLElement);

  module.exports = MinimapPluginGeneratorElement = document.registerElement('minimap-plugin-generator', {
    prototype: MinimapPluginGeneratorElement.prototype
  });

  atom.commands.add('minimap-plugin-generator', {
    'core:confirm': function() {
      return this.confirm();
    },
    'core:cancel': function() {
      return this.detach();
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC1wbHVnaW4tZ2VuZXJhdG9yLWVsZW1lbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsT0FBZ0MsT0FBQSxDQUFRLE1BQVIsQ0FBaEMsRUFBQyxrQkFBQSxVQUFELEVBQWEsdUJBQUEsZUFIYixDQUFBOztBQUFBLEVBSUMsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQUpELENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osb0RBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDRDQUFBLHdCQUFBLEdBQTBCLElBQTFCLENBQUE7O0FBQUEsNENBQ0EsSUFBQSxHQUFNLElBRE4sQ0FBQTs7QUFBQSw0Q0FHQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsMEJBQWYsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxTQUFmLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsVUFBZixDQUZBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxVQUFBLENBQVc7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO09BQVgsQ0FKZCxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLE1BQXBCLENBTGpCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxLQUFELEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FQVCxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFqQixDQUFxQixPQUFyQixDQVJBLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FWWCxDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixTQUF2QixDQVhBLENBQUE7QUFBQSxNQWFBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLGFBQWQsQ0FiQSxDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxLQUFkLENBZEEsQ0FBQTthQWVBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLE9BQWQsRUFoQmU7SUFBQSxDQUhqQixDQUFBOztBQUFBLDRDQXFCQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7QUFDaEIsTUFBQSxJQUFDLENBQUEsd0JBQUQsR0FBNEIsUUFBUSxDQUFDLGFBQXJDLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxHQUF1QixtQkFEdkIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxtQkFBYixDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEtBQWYsQ0FBQSxFQUpnQjtJQUFBLENBckJsQixDQUFBOztBQUFBLDRDQTJCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFrQyxDQUFDLFdBQW5DLENBQStDLElBQS9DLEVBRE07SUFBQSxDQTNCUixDQUFBOztBQUFBLDRDQThCQSxXQUFBLEdBQWEsU0FBQyxlQUFELEVBQWtCLGFBQWxCLEdBQUE7QUFDWCxVQUFBLGtEQUFBOztRQUFBLGdCQUFpQixDQUFDLENBQUQsRUFBSSxlQUFlLENBQUMsTUFBcEI7T0FBakI7QUFBQSxNQUNBLGlCQUFBLEdBQW9CLElBQUMsQ0FBQSxvQkFBRCxDQUFBLENBRHBCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFnQixJQUFJLENBQUMsSUFBTCxDQUFVLGlCQUFWLEVBQTZCLGVBQTdCLENBQWhCLENBRkEsQ0FBQTtBQUFBLE1BR0EsVUFBQSxHQUFhLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQWlCLENBQUMsTUFIL0IsQ0FBQTtBQUFBLE1BSUEsbUJBQUEsR0FBc0IsVUFBQSxHQUFhLGVBQWUsQ0FBQyxNQUpuRCxDQUFBO2FBS0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUErQixDQUFDLENBQUMsQ0FBRCxFQUFJLG1CQUFBLEdBQXNCLGFBQWMsQ0FBQSxDQUFBLENBQXhDLENBQUQsRUFBOEMsQ0FBQyxDQUFELEVBQUksbUJBQUEsR0FBc0IsYUFBYyxDQUFBLENBQUEsQ0FBeEMsQ0FBOUMsQ0FBL0IsRUFOVztJQUFBLENBOUJiLENBQUE7O0FBQUEsNENBc0NBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLEtBQUE7QUFBQSxNQUFBLElBQWMsdUJBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTs7YUFDeUIsQ0FBRSxLQUEzQixDQUFBO09BREE7YUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBeEIsRUFITTtJQUFBLENBdENSLENBQUE7O0FBQUEsNENBMkNBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUcsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsYUFBZCxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUNOLG1IQUFBLEdBQ3VDLENBQUMsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFELENBRHZDLEdBQzBELFNBSHBELENBQUE7ZUFLQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDbEIsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLEtBQUMsQ0FBQSxjQUFELENBQUEsQ0FBZCxDQUFBO0FBQUEsWUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVO0FBQUEsY0FBQSxXQUFBLEVBQWEsQ0FBQyxXQUFELENBQWI7QUFBQSxjQUE0QixPQUFBLEVBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQixDQUFyQzthQUFWLENBREEsQ0FBQTtBQUFBLFlBR0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCLHNGQUhyQixDQUFBO21CQU9BLFVBQUEsQ0FBVyxTQUFBLEdBQUE7cUJBQ1QsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQURTO1lBQUEsQ0FBWCxFQUVFLElBRkYsRUFSa0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixFQU5GO09BRE87SUFBQSxDQTNDVCxDQUFBOztBQUFBLDRDQThEQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLFVBQUEsd0JBQUE7QUFBQSxNQUFBLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFkLENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxDQUFDLENBQUMsU0FBRixDQUFZLElBQUksQ0FBQyxRQUFMLENBQWMsV0FBZCxDQUFaLENBRGQsQ0FBQTthQUVBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxXQUFiLENBQVYsRUFBcUMsV0FBckMsRUFIYztJQUFBLENBOURoQixDQUFBOztBQUFBLDRDQW1FQSxvQkFBQSxHQUFzQixTQUFBLEdBQUE7YUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtCQUFoQixDQUFBLElBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQURkLElBRUUsSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFFLENBQUMsZ0JBQUgsQ0FBQSxDQUFWLEVBQWlDLFFBQWpDLEVBSGtCO0lBQUEsQ0FuRXRCLENBQUE7O0FBQUEsNENBd0VBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQWQsQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFQLEdBQXNCLDBCQUFBLEdBQXlCLENBQUMsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFELENBQXpCLEdBQTRDLEdBQWxFLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQWIsR0FBdUIsT0FEdkIsQ0FBQTtlQUVBLE1BSEY7T0FBQSxNQUFBO2VBS0UsS0FMRjtPQURnQjtJQUFBLENBeEVsQixDQUFBOztBQUFBLDRDQWdGQSxXQUFBLEdBQWEsU0FBQyxXQUFELEVBQWMsUUFBZCxHQUFBO0FBQ1gsVUFBQSxZQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixFQUFlLFdBQWYsRUFBNEIsU0FBQSxHQUFTLElBQUMsQ0FBQSxRQUF0QyxDQUF4QixDQUFmLENBQUE7YUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBZCxDQUFBLENBQVosRUFBd0MsQ0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLEVBQUEsR0FBRyxXQUFsQixFQUFpQyxZQUFqQyxFQUErQyxZQUEvQyxDQUF4QyxFQUFzRyxRQUF0RyxFQUZXO0lBQUEsQ0FoRmIsQ0FBQTs7QUFBQSw0Q0FvRkEsV0FBQSxHQUFhLFNBQUMsV0FBRCxFQUFjLFFBQWQsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLENBQUMsTUFBRCxDQUFQLENBQUE7QUFDQSxNQUFBLElBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsQ0FBdEI7QUFBQSxRQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixDQUFBLENBQUE7T0FEQTtBQUFBLE1BRUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFXLENBQUMsUUFBWixDQUFBLENBQVYsQ0FGQSxDQUFBO2FBSUEsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQWQsQ0FBQSxDQUFaLEVBQXdDLElBQXhDLEVBQThDLFFBQTlDLEVBTFc7SUFBQSxDQXBGYixDQUFBOztBQUFBLDRDQTJGQSxjQUFBLEdBQWdCLFNBQUMsV0FBRCxFQUFjLFFBQWQsR0FBQTtBQUNkLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLENBQUMsU0FBRCxDQUFQLENBQUE7YUFFQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBZCxDQUFBLENBQVosRUFBd0MsSUFBeEMsRUFBOEMsUUFBOUMsRUFBd0Q7QUFBQSxRQUFBLEdBQUEsRUFBSyxXQUFMO09BQXhELEVBSGM7SUFBQSxDQTNGaEIsQ0FBQTs7QUFBQSw0Q0FnR0EsaUJBQUEsR0FBbUIsU0FBQyxXQUFELEdBQUE7QUFDakIsVUFBQSw2QkFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FBVixFQUFtQyxVQUFuQyxFQUErQyxJQUFJLENBQUMsR0FBcEQsQ0FBZixDQUFBO0FBQ0EsTUFBQSxJQUFlLFdBQVcsQ0FBQyxPQUFaLENBQW9CLFlBQXBCLENBQUEsS0FBcUMsQ0FBcEQ7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQURBO0FBQUEsTUFHQSxlQUFBLEdBQWtCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FBVixFQUFtQyxLQUFuQyxFQUEwQyxVQUExQyxFQUFzRCxJQUFJLENBQUMsR0FBM0QsQ0FIbEIsQ0FBQTthQUlBLFdBQVcsQ0FBQyxPQUFaLENBQW9CLGVBQXBCLENBQUEsS0FBd0MsRUFMdkI7SUFBQSxDQWhHbkIsQ0FBQTs7QUFBQSw0Q0F1R0Esa0JBQUEsR0FBb0IsU0FBQyxRQUFELEdBQUE7QUFDbEIsVUFBQSw4QkFBQTtBQUFBLE1BQUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBZCxDQUFBO0FBQUEsTUFDQSxpQkFBQSxHQUFvQixJQUFDLENBQUEsb0JBQUQsQ0FBQSxDQURwQixDQUFBO0FBR0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixXQUFuQixDQUFIO2VBQ0UsSUFBQyxDQUFBLFdBQUQsQ0FBYSxXQUFiLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUN4QixLQUFDLENBQUEsY0FBRCxDQUFnQixXQUFoQixFQUE2QixRQUE3QixFQUR3QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLEVBREY7T0FBQSxNQUFBO2VBSUUsSUFBQyxDQUFBLFdBQUQsQ0FBYSxXQUFiLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUN4QixLQUFDLENBQUEsV0FBRCxDQUFhLFdBQWIsRUFBMEIsU0FBQSxHQUFBO3FCQUN4QixLQUFDLENBQUEsY0FBRCxDQUFnQixXQUFoQixFQUE2QixRQUE3QixFQUR3QjtZQUFBLENBQTFCLEVBRHdCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsRUFKRjtPQUprQjtJQUFBLENBdkdwQixDQUFBOztBQUFBLDRDQW1IQSxVQUFBLEdBQVksU0FBQyxPQUFELEVBQVUsSUFBVixFQUFnQixJQUFoQixFQUFzQixPQUF0QixHQUFBOztRQUFzQixVQUFRO09BQ3hDO2FBQUksSUFBQSxlQUFBLENBQWdCO0FBQUEsUUFBQyxTQUFBLE9BQUQ7QUFBQSxRQUFVLE1BQUEsSUFBVjtBQUFBLFFBQWdCLE1BQUEsSUFBaEI7QUFBQSxRQUFzQixTQUFBLE9BQXRCO09BQWhCLEVBRE07SUFBQSxDQW5IWixDQUFBOzt5Q0FBQTs7S0FEMEMsWUFUNUMsQ0FBQTs7QUFBQSxFQWlJQSxNQUFNLENBQUMsT0FBUCxHQUFpQiw2QkFBQSxHQUFnQyxRQUFRLENBQUMsZUFBVCxDQUF5QiwwQkFBekIsRUFBcUQ7QUFBQSxJQUFBLFNBQUEsRUFBVyw2QkFBNkIsQ0FBQyxTQUF6QztHQUFyRCxDQWpJakQsQ0FBQTs7QUFBQSxFQW1JQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsMEJBQWxCLEVBQThDO0FBQUEsSUFDNUMsY0FBQSxFQUFnQixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsT0FBRCxDQUFBLEVBQUg7SUFBQSxDQUQ0QjtBQUFBLElBRTVDLGFBQUEsRUFBZSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7SUFBQSxDQUY2QjtHQUE5QyxDQW5JQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap-plugin-generator-element.coffee

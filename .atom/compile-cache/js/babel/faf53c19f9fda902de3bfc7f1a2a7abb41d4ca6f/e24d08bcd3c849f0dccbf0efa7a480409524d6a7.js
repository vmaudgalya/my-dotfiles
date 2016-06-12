Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _decoratorsElement = require('./decorators/element');

var _decoratorsElement2 = _interopRequireDefault(_decoratorsElement);

/**
 * @access private
 */
'use babel';

var MinimapPluginGeneratorElement = (function () {
  function MinimapPluginGeneratorElement() {
    _classCallCheck(this, _MinimapPluginGeneratorElement);
  }

  _createClass(MinimapPluginGeneratorElement, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.previouslyFocusedElement = null;
      this.mode = null;

      this.modal = document.createElement('atom-panel');

      this.modal.classList.add('minimap-plugin-generator');
      this.modal.classList.add('modal');
      this.modal.classList.add('overlay');
      this.modal.classList.add('from-top');

      this.editor = atom.workspace.buildTextEditor({ mini: true });
      this.editorElement = atom.views.getView(this.editor);

      this.error = document.createElement('div');
      this.error.classList.add('error');

      this.message = document.createElement('div');
      this.message.classList.add('message');

      this.modal.appendChild(this.editorElement);
      this.modal.appendChild(this.error);
      this.modal.appendChild(this.message);

      this.appendChild(this.modal);
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.previouslyFocusedElement = document.activeElement;
      this.message.textContent = 'Enter plugin path';
      this.setPathText('my-minimap-plugin');
      this.editorElement.focus();
    }
  }, {
    key: 'attach',
    value: function attach() {
      atom.views.getView(atom.workspace).appendChild(this);
    }
  }, {
    key: 'setPathText',
    value: function setPathText(placeholderName, rangeToSelect) {
      if (!rangeToSelect) {
        rangeToSelect = [0, placeholderName.length];
      }

      var packagesDirectory = this.getPackagesDirectory();

      this.editor.setText(_path2['default'].join(packagesDirectory, placeholderName));

      var pathLength = this.editor.getText().length;
      var endOfDirectoryIndex = pathLength - placeholderName.length;

      this.editor.setSelectedBufferRange([[0, endOfDirectoryIndex + rangeToSelect[0]], [0, endOfDirectoryIndex + rangeToSelect[1]]]);
    }
  }, {
    key: 'detach',
    value: function detach() {
      if (!this.parentNode) {
        return;
      }

      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
      }

      this.parentNode.removeChild(this);
    }
  }, {
    key: 'confirm',
    value: function confirm() {
      var _this = this;

      if (this.validPackagePath()) {
        this.removeChild(this.editorElement);
        this.message.innerHTML = '\n        <span class=\'loading loading-spinner-tiny inline-block\'></span>\n        Generate plugin at <span class="text-primary">' + this.getPackagePath() + '</span>\n      ';

        this.createPackageFiles(function () {
          var packagePath = _this.getPackagePath();
          atom.open({ pathsToOpen: [packagePath], devMode: atom.config.get('minimap.createPluginInDevMode') });

          _this.message.innerHTML = '<span class="text-success">Plugin successfully generated, opening it now...</span>';

          setTimeout(function () {
            _this.detach();
          }, 2000);
        });
      }
    }
  }, {
    key: 'getPackagePath',
    value: function getPackagePath() {
      var packagePath = this.editor.getText();
      var packageName = _underscorePlus2['default'].dasherize(_path2['default'].basename(packagePath));

      return _path2['default'].join(_path2['default'].dirname(packagePath), packageName);
    }
  }, {
    key: 'getPackagesDirectory',
    value: function getPackagesDirectory() {
      return atom.config.get('core.projectHome') || process.env.ATOM_REPOS_HOME || _path2['default'].join(_fsPlus2['default'].getHomeDirectory(), 'github');
    }
  }, {
    key: 'validPackagePath',
    value: function validPackagePath() {
      if (_fsPlus2['default'].existsSync(this.getPackagePath())) {
        this.error.textContent = 'Path already exists at \'' + this.getPackagePath() + '\'';
        this.error.style.display = 'block';
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'initPackage',
    value: function initPackage(packagePath, callback) {
      var templatePath = _path2['default'].resolve(__dirname, _path2['default'].join('..', 'templates', 'plugin-' + this.template));
      this.runCommand(atom.packages.getApmPath(), ['init', '-p', '' + packagePath, '--template', templatePath], callback);
    }
  }, {
    key: 'linkPackage',
    value: function linkPackage(packagePath, callback) {
      var args = ['link'];
      if (atom.config.get('minimap.createPluginInDevMode')) {
        args.push('--dev');
      }
      args.push(packagePath.toString());

      this.runCommand(atom.packages.getApmPath(), args, callback);
    }
  }, {
    key: 'installPackage',
    value: function installPackage(packagePath, callback) {
      var args = ['install'];

      this.runCommand(atom.packages.getApmPath(), args, callback, { cwd: packagePath });
    }
  }, {
    key: 'isStoredInDotAtom',
    value: function isStoredInDotAtom(packagePath) {
      var packagesPath = _path2['default'].join(atom.getConfigDirPath(), 'packages', _path2['default'].sep);
      if (packagePath.indexOf(packagesPath) === 0) {
        return true;
      }

      var devPackagesPath = _path2['default'].join(atom.getConfigDirPath(), 'dev', 'packages', _path2['default'].sep);

      return packagePath.indexOf(devPackagesPath) === 0;
    }
  }, {
    key: 'createPackageFiles',
    value: function createPackageFiles(callback) {
      var _this2 = this;

      var packagePath = this.getPackagePath();

      if (this.isStoredInDotAtom(packagePath)) {
        this.initPackage(packagePath, function () {
          _this2.installPackage(packagePath, callback);
        });
      } else {
        this.initPackage(packagePath, function () {
          _this2.linkPackage(packagePath, function () {
            _this2.installPackage(packagePath, callback);
          });
        });
      }
    }
  }, {
    key: 'runCommand',
    value: function runCommand(command, args, exit) {
      var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      return new _atom.BufferedProcess({ command: command, args: args, exit: exit, options: options });
    }
  }]);

  var _MinimapPluginGeneratorElement = MinimapPluginGeneratorElement;
  MinimapPluginGeneratorElement = (0, _decoratorsElement2['default'])('minimap-plugin-generator')(MinimapPluginGeneratorElement) || MinimapPluginGeneratorElement;
  return MinimapPluginGeneratorElement;
})();

exports['default'] = MinimapPluginGeneratorElement;

atom.commands.add('minimap-plugin-generator', {
  'core:confirm': function coreConfirm() {
    this.confirm();
  },
  'core:cancel': function coreCancel() {
    this.detach();
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAtcGx1Z2luLWdlbmVyYXRvci1lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OEJBRWMsaUJBQWlCOzs7O3NCQUNoQixTQUFTOzs7O29CQUNQLE1BQU07Ozs7b0JBQ08sTUFBTTs7aUNBQ2hCLHNCQUFzQjs7Ozs7OztBQU4xQyxXQUFXLENBQUE7O0lBWVUsNkJBQTZCO1dBQTdCLDZCQUE2Qjs7OztlQUE3Qiw2QkFBNkI7O1dBRWhDLDJCQUFHO0FBQ2pCLFVBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUE7QUFDcEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7O0FBRWhCLFVBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQTs7QUFFakQsVUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUE7QUFDcEQsVUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ2pDLFVBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNuQyxVQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7O0FBRXBDLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtBQUMxRCxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFcEQsVUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzFDLFVBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFakMsVUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7QUFFckMsVUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQzFDLFVBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNsQyxVQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRXBDLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQzdCOzs7V0FFZ0IsNEJBQUc7QUFDbEIsVUFBSSxDQUFDLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUE7QUFDdEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLENBQUE7QUFDOUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3JDLFVBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDM0I7OztXQUVNLGtCQUFHO0FBQ1IsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNyRDs7O1dBRVcscUJBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRTtBQUMzQyxVQUFJLENBQUMsYUFBYSxFQUFFO0FBQUUscUJBQWEsR0FBRyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7T0FBRTs7QUFFbkUsVUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTs7QUFFbkQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQUssSUFBSSxDQUFDLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUE7O0FBRWxFLFVBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFBO0FBQzdDLFVBQUksbUJBQW1CLEdBQUcsVUFBVSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUE7O0FBRTdELFVBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FDakMsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzNDLENBQUMsQ0FBQyxFQUFFLG1CQUFtQixHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUM1QyxDQUFDLENBQUE7S0FDSDs7O1dBRU0sa0JBQUc7QUFDUixVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLGVBQU07T0FBRTs7QUFFaEMsVUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7QUFDakMsWUFBSSxDQUFDLHdCQUF3QixDQUFDLEtBQUssRUFBRSxDQUFBO09BQ3RDOztBQUVELFVBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2xDOzs7V0FFTyxtQkFBRzs7O0FBQ1QsVUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtBQUMzQixZQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNwQyxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsMklBRTRCLElBQUksQ0FBQyxjQUFjLEVBQUUsb0JBQ3RFLENBQUE7O0FBRUQsWUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQU07QUFDNUIsY0FBSSxXQUFXLEdBQUcsTUFBSyxjQUFjLEVBQUUsQ0FBQTtBQUN2QyxjQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsV0FBVyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLEVBQUMsQ0FBQyxDQUFBOztBQUVsRyxnQkFBSyxPQUFPLENBQUMsU0FBUyxHQUFHLG9GQUFvRixDQUFBOztBQUU3RyxvQkFBVSxDQUFDLFlBQU07QUFBRSxrQkFBSyxNQUFNLEVBQUUsQ0FBQTtXQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDMUMsQ0FBQyxDQUFBO09BQ0g7S0FDRjs7O1dBRWMsMEJBQUc7QUFDaEIsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN2QyxVQUFJLFdBQVcsR0FBRyw0QkFBRSxTQUFTLENBQUMsa0JBQUssUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7O0FBRXpELGFBQU8sa0JBQUssSUFBSSxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQTtLQUN6RDs7O1dBRW9CLGdDQUFHO0FBQ3RCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLElBQzNCLGtCQUFLLElBQUksQ0FBQyxvQkFBRyxnQkFBZ0IsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2xEOzs7V0FFZ0IsNEJBQUc7QUFDbEIsVUFBSSxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUU7QUFDeEMsWUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLGlDQUE4QixJQUFJLENBQUMsY0FBYyxFQUFFLE9BQUcsQ0FBQTtBQUM1RSxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0FBQ2xDLGVBQU8sS0FBSyxDQUFBO09BQ2IsTUFBTTtBQUNMLGVBQU8sSUFBSSxDQUFBO09BQ1o7S0FDRjs7O1dBRVcscUJBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRTtBQUNsQyxVQUFJLFlBQVksR0FBRyxrQkFBSyxPQUFPLENBQUMsU0FBUyxFQUFFLGtCQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxjQUFZLElBQUksQ0FBQyxRQUFRLENBQUcsQ0FBQyxDQUFBO0FBQ25HLFVBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLE9BQUssV0FBVyxFQUFJLFlBQVksRUFBRSxZQUFZLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNwSDs7O1dBRVcscUJBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRTtBQUNsQyxVQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ25CLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsRUFBRTtBQUFFLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7T0FBRTtBQUM1RSxVQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBOztBQUVqQyxVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzVEOzs7V0FFYyx3QkFBQyxXQUFXLEVBQUUsUUFBUSxFQUFFO0FBQ3JDLFVBQUksSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRXRCLFVBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUE7S0FDaEY7OztXQUVpQiwyQkFBQyxXQUFXLEVBQUU7QUFDOUIsVUFBSSxZQUFZLEdBQUcsa0JBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLFVBQVUsRUFBRSxrQkFBSyxHQUFHLENBQUMsQ0FBQTtBQUMzRSxVQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUE7T0FBRTs7QUFFNUQsVUFBSSxlQUFlLEdBQUcsa0JBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsa0JBQUssR0FBRyxDQUFDLENBQUE7O0FBRXJGLGFBQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDbEQ7OztXQUVrQiw0QkFBQyxRQUFRLEVBQUU7OztBQUM1QixVQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7O0FBRXZDLFVBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ3ZDLFlBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLFlBQU07QUFDbEMsaUJBQUssY0FBYyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUMzQyxDQUFDLENBQUE7T0FDSCxNQUFNO0FBQ0wsWUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsWUFBTTtBQUNsQyxpQkFBSyxXQUFXLENBQUMsV0FBVyxFQUFFLFlBQU07QUFDbEMsbUJBQUssY0FBYyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQTtXQUMzQyxDQUFDLENBQUE7U0FDSCxDQUFDLENBQUE7T0FDSDtLQUNGOzs7V0FFVSxvQkFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBZ0I7VUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQzNDLGFBQU8sMEJBQW9CLEVBQUMsT0FBTyxFQUFQLE9BQU8sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBQyxDQUFDLENBQUE7S0FDM0Q7Ozt1Q0ExSmtCLDZCQUE2QjtBQUE3QiwrQkFBNkIsR0FEakQsb0NBQVEsMEJBQTBCLENBQUMsQ0FDZiw2QkFBNkIsS0FBN0IsNkJBQTZCO1NBQTdCLDZCQUE2Qjs7O3FCQUE3Qiw2QkFBNkI7O0FBNkpsRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRTtBQUM1QyxnQkFBYyxFQUFDLHVCQUFHO0FBQUUsUUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQUU7QUFDcEMsZUFBYSxFQUFDLHNCQUFHO0FBQUUsUUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0dBQUU7Q0FDbkMsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAtcGx1Z2luLWdlbmVyYXRvci1lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHtCdWZmZXJlZFByb2Nlc3N9IGZyb20gJ2F0b20nXG5pbXBvcnQgZWxlbWVudCBmcm9tICcuL2RlY29yYXRvcnMvZWxlbWVudCdcblxuLyoqXG4gKiBAYWNjZXNzIHByaXZhdGVcbiAqL1xuQGVsZW1lbnQoJ21pbmltYXAtcGx1Z2luLWdlbmVyYXRvcicpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaW5pbWFwUGx1Z2luR2VuZXJhdG9yRWxlbWVudCB7XG5cbiAgY3JlYXRlZENhbGxiYWNrICgpIHtcbiAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IG51bGxcbiAgICB0aGlzLm1vZGUgPSBudWxsXG5cbiAgICB0aGlzLm1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXRvbS1wYW5lbCcpXG5cbiAgICB0aGlzLm1vZGFsLmNsYXNzTGlzdC5hZGQoJ21pbmltYXAtcGx1Z2luLWdlbmVyYXRvcicpXG4gICAgdGhpcy5tb2RhbC5jbGFzc0xpc3QuYWRkKCdtb2RhbCcpXG4gICAgdGhpcy5tb2RhbC5jbGFzc0xpc3QuYWRkKCdvdmVybGF5JylcbiAgICB0aGlzLm1vZGFsLmNsYXNzTGlzdC5hZGQoJ2Zyb20tdG9wJylcblxuICAgIHRoaXMuZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHttaW5pOiB0cnVlfSlcbiAgICB0aGlzLmVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5lZGl0b3IpXG5cbiAgICB0aGlzLmVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmVycm9yLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJylcblxuICAgIHRoaXMubWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5tZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKVxuXG4gICAgdGhpcy5tb2RhbC5hcHBlbmRDaGlsZCh0aGlzLmVkaXRvckVsZW1lbnQpXG4gICAgdGhpcy5tb2RhbC5hcHBlbmRDaGlsZCh0aGlzLmVycm9yKVxuICAgIHRoaXMubW9kYWwuYXBwZW5kQ2hpbGQodGhpcy5tZXNzYWdlKVxuXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLm1vZGFsKVxuICB9XG5cbiAgYXR0YWNoZWRDYWxsYmFjayAoKSB7XG4gICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgdGhpcy5tZXNzYWdlLnRleHRDb250ZW50ID0gJ0VudGVyIHBsdWdpbiBwYXRoJ1xuICAgIHRoaXMuc2V0UGF0aFRleHQoJ215LW1pbmltYXAtcGx1Z2luJylcbiAgICB0aGlzLmVkaXRvckVsZW1lbnQuZm9jdXMoKVxuICB9XG5cbiAgYXR0YWNoICgpIHtcbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkKHRoaXMpXG4gIH1cblxuICBzZXRQYXRoVGV4dCAocGxhY2Vob2xkZXJOYW1lLCByYW5nZVRvU2VsZWN0KSB7XG4gICAgaWYgKCFyYW5nZVRvU2VsZWN0KSB7IHJhbmdlVG9TZWxlY3QgPSBbMCwgcGxhY2Vob2xkZXJOYW1lLmxlbmd0aF0gfVxuXG4gICAgbGV0IHBhY2thZ2VzRGlyZWN0b3J5ID0gdGhpcy5nZXRQYWNrYWdlc0RpcmVjdG9yeSgpXG5cbiAgICB0aGlzLmVkaXRvci5zZXRUZXh0KHBhdGguam9pbihwYWNrYWdlc0RpcmVjdG9yeSwgcGxhY2Vob2xkZXJOYW1lKSlcblxuICAgIGxldCBwYXRoTGVuZ3RoID0gdGhpcy5lZGl0b3IuZ2V0VGV4dCgpLmxlbmd0aFxuICAgIGxldCBlbmRPZkRpcmVjdG9yeUluZGV4ID0gcGF0aExlbmd0aCAtIHBsYWNlaG9sZGVyTmFtZS5sZW5ndGhcblxuICAgIHRoaXMuZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoW1xuICAgICAgWzAsIGVuZE9mRGlyZWN0b3J5SW5kZXggKyByYW5nZVRvU2VsZWN0WzBdXSxcbiAgICAgIFswLCBlbmRPZkRpcmVjdG9yeUluZGV4ICsgcmFuZ2VUb1NlbGVjdFsxXV1cbiAgICBdKVxuICB9XG5cbiAgZGV0YWNoICgpIHtcbiAgICBpZiAoIXRoaXMucGFyZW50Tm9kZSkgeyByZXR1cm4gfVxuXG4gICAgaWYgKHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50KSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpXG4gICAgfVxuXG4gICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpXG4gIH1cblxuICBjb25maXJtICgpIHtcbiAgICBpZiAodGhpcy52YWxpZFBhY2thZ2VQYXRoKCkpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5lZGl0b3JFbGVtZW50KVxuICAgICAgdGhpcy5tZXNzYWdlLmlubmVySFRNTCA9IGBcbiAgICAgICAgPHNwYW4gY2xhc3M9J2xvYWRpbmcgbG9hZGluZy1zcGlubmVyLXRpbnkgaW5saW5lLWJsb2NrJz48L3NwYW4+XG4gICAgICAgIEdlbmVyYXRlIHBsdWdpbiBhdCA8c3BhbiBjbGFzcz1cInRleHQtcHJpbWFyeVwiPiR7dGhpcy5nZXRQYWNrYWdlUGF0aCgpfTwvc3Bhbj5cbiAgICAgIGBcblxuICAgICAgdGhpcy5jcmVhdGVQYWNrYWdlRmlsZXMoKCkgPT4ge1xuICAgICAgICBsZXQgcGFja2FnZVBhdGggPSB0aGlzLmdldFBhY2thZ2VQYXRoKClcbiAgICAgICAgYXRvbS5vcGVuKHtwYXRoc1RvT3BlbjogW3BhY2thZ2VQYXRoXSwgZGV2TW9kZTogYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLmNyZWF0ZVBsdWdpbkluRGV2TW9kZScpfSlcblxuICAgICAgICB0aGlzLm1lc3NhZ2UuaW5uZXJIVE1MID0gJzxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+UGx1Z2luIHN1Y2Nlc3NmdWxseSBnZW5lcmF0ZWQsIG9wZW5pbmcgaXQgbm93Li4uPC9zcGFuPidcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5kZXRhY2goKSB9LCAyMDAwKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBnZXRQYWNrYWdlUGF0aCAoKSB7XG4gICAgbGV0IHBhY2thZ2VQYXRoID0gdGhpcy5lZGl0b3IuZ2V0VGV4dCgpXG4gICAgbGV0IHBhY2thZ2VOYW1lID0gXy5kYXNoZXJpemUocGF0aC5iYXNlbmFtZShwYWNrYWdlUGF0aCkpXG5cbiAgICByZXR1cm4gcGF0aC5qb2luKHBhdGguZGlybmFtZShwYWNrYWdlUGF0aCksIHBhY2thZ2VOYW1lKVxuICB9XG5cbiAgZ2V0UGFja2FnZXNEaXJlY3RvcnkgKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUucHJvamVjdEhvbWUnKSB8fFxuICAgICAgICAgICBwcm9jZXNzLmVudi5BVE9NX1JFUE9TX0hPTUUgfHxcbiAgICAgICAgICAgcGF0aC5qb2luKGZzLmdldEhvbWVEaXJlY3RvcnkoKSwgJ2dpdGh1YicpXG4gIH1cblxuICB2YWxpZFBhY2thZ2VQYXRoICgpIHtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyh0aGlzLmdldFBhY2thZ2VQYXRoKCkpKSB7XG4gICAgICB0aGlzLmVycm9yLnRleHRDb250ZW50ID0gYFBhdGggYWxyZWFkeSBleGlzdHMgYXQgJyR7dGhpcy5nZXRQYWNrYWdlUGF0aCgpfSdgXG4gICAgICB0aGlzLmVycm9yLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBpbml0UGFja2FnZSAocGFja2FnZVBhdGgsIGNhbGxiYWNrKSB7XG4gICAgbGV0IHRlbXBsYXRlUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHBhdGguam9pbignLi4nLCAndGVtcGxhdGVzJywgYHBsdWdpbi0ke3RoaXMudGVtcGxhdGV9YCkpXG4gICAgdGhpcy5ydW5Db21tYW5kKGF0b20ucGFja2FnZXMuZ2V0QXBtUGF0aCgpLCBbJ2luaXQnLCAnLXAnLCBgJHtwYWNrYWdlUGF0aH1gLCAnLS10ZW1wbGF0ZScsIHRlbXBsYXRlUGF0aF0sIGNhbGxiYWNrKVxuICB9XG5cbiAgbGlua1BhY2thZ2UgKHBhY2thZ2VQYXRoLCBjYWxsYmFjaykge1xuICAgIGxldCBhcmdzID0gWydsaW5rJ11cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLmNyZWF0ZVBsdWdpbkluRGV2TW9kZScpKSB7IGFyZ3MucHVzaCgnLS1kZXYnKSB9XG4gICAgYXJncy5wdXNoKHBhY2thZ2VQYXRoLnRvU3RyaW5nKCkpXG5cbiAgICB0aGlzLnJ1bkNvbW1hbmQoYXRvbS5wYWNrYWdlcy5nZXRBcG1QYXRoKCksIGFyZ3MsIGNhbGxiYWNrKVxuICB9XG5cbiAgaW5zdGFsbFBhY2thZ2UgKHBhY2thZ2VQYXRoLCBjYWxsYmFjaykge1xuICAgIGxldCBhcmdzID0gWydpbnN0YWxsJ11cblxuICAgIHRoaXMucnVuQ29tbWFuZChhdG9tLnBhY2thZ2VzLmdldEFwbVBhdGgoKSwgYXJncywgY2FsbGJhY2ssIHtjd2Q6IHBhY2thZ2VQYXRofSlcbiAgfVxuXG4gIGlzU3RvcmVkSW5Eb3RBdG9tIChwYWNrYWdlUGF0aCkge1xuICAgIGxldCBwYWNrYWdlc1BhdGggPSBwYXRoLmpvaW4oYXRvbS5nZXRDb25maWdEaXJQYXRoKCksICdwYWNrYWdlcycsIHBhdGguc2VwKVxuICAgIGlmIChwYWNrYWdlUGF0aC5pbmRleE9mKHBhY2thZ2VzUGF0aCkgPT09IDApIHsgcmV0dXJuIHRydWUgfVxuXG4gICAgbGV0IGRldlBhY2thZ2VzUGF0aCA9IHBhdGguam9pbihhdG9tLmdldENvbmZpZ0RpclBhdGgoKSwgJ2RldicsICdwYWNrYWdlcycsIHBhdGguc2VwKVxuXG4gICAgcmV0dXJuIHBhY2thZ2VQYXRoLmluZGV4T2YoZGV2UGFja2FnZXNQYXRoKSA9PT0gMFxuICB9XG5cbiAgY3JlYXRlUGFja2FnZUZpbGVzIChjYWxsYmFjaykge1xuICAgIGxldCBwYWNrYWdlUGF0aCA9IHRoaXMuZ2V0UGFja2FnZVBhdGgoKVxuXG4gICAgaWYgKHRoaXMuaXNTdG9yZWRJbkRvdEF0b20ocGFja2FnZVBhdGgpKSB7XG4gICAgICB0aGlzLmluaXRQYWNrYWdlKHBhY2thZ2VQYXRoLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5zdGFsbFBhY2thZ2UocGFja2FnZVBhdGgsIGNhbGxiYWNrKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbml0UGFja2FnZShwYWNrYWdlUGF0aCwgKCkgPT4ge1xuICAgICAgICB0aGlzLmxpbmtQYWNrYWdlKHBhY2thZ2VQYXRoLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbnN0YWxsUGFja2FnZShwYWNrYWdlUGF0aCwgY2FsbGJhY2spXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJ1bkNvbW1hbmQgKGNvbW1hbmQsIGFyZ3MsIGV4aXQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyZWRQcm9jZXNzKHtjb21tYW5kLCBhcmdzLCBleGl0LCBvcHRpb25zfSlcbiAgfVxufVxuXG5hdG9tLmNvbW1hbmRzLmFkZCgnbWluaW1hcC1wbHVnaW4tZ2VuZXJhdG9yJywge1xuICAnY29yZTpjb25maXJtJyAoKSB7IHRoaXMuY29uZmlybSgpIH0sXG4gICdjb3JlOmNhbmNlbCcgKCkgeyB0aGlzLmRldGFjaCgpIH1cbn0pXG4iXX0=
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/minimap-plugin-generator-element.js

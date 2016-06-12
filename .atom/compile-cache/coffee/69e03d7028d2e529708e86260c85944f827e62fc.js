
/*
Requires [puppet-link](http://puppet-lint.com/)
 */

(function() {
  "use strict";
  var Beautifier, PuppetFix,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PuppetFix = (function(_super) {
    __extends(PuppetFix, _super);

    function PuppetFix() {
      return PuppetFix.__super__.constructor.apply(this, arguments);
    }

    PuppetFix.prototype.name = "puppet-lint";

    PuppetFix.prototype.options = {
      Puppet: true
    };

    PuppetFix.prototype.cli = function(options) {
      if (options.puppet_path == null) {
        return new Error("'puppet-lint' path is not set!" + " Please set this in the Atom Beautify package settings.");
      } else {
        return options.puppet_path;
      }
    };

    PuppetFix.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("puppet-lint", ['--fix', tempFile = this.tempFile("input", text)], {
        ignoreReturnCode: true,
        help: {
          link: "http://puppet-lint.com/"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return PuppetFix;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHVwcGV0LWZpeC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBR0EsWUFIQSxDQUFBO0FBQUEsTUFBQSxxQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBSmIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRXJCLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx3QkFBQSxJQUFBLEdBQU0sYUFBTixDQUFBOztBQUFBLHdCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsTUFBQSxFQUFRLElBREQ7S0FGVCxDQUFBOztBQUFBLHdCQU1BLEdBQUEsR0FBSyxTQUFDLE9BQUQsR0FBQTtBQUNILE1BQUEsSUFBTywyQkFBUDtBQUNFLGVBQVcsSUFBQSxLQUFBLENBQU0sZ0NBQUEsR0FDZix5REFEUyxDQUFYLENBREY7T0FBQSxNQUFBO0FBSUUsZUFBTyxPQUFPLENBQUMsV0FBZixDQUpGO09BREc7SUFBQSxDQU5MLENBQUE7O0FBQUEsd0JBYUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLFVBQUEsUUFBQTthQUFBLElBQUMsQ0FBQSxHQUFELENBQUssYUFBTCxFQUFvQixDQUNsQixPQURrQixFQUVsQixRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRk8sQ0FBcEIsRUFHSztBQUFBLFFBQ0QsZ0JBQUEsRUFBa0IsSUFEakI7QUFBQSxRQUVELElBQUEsRUFBTTtBQUFBLFVBQ0osSUFBQSxFQUFNLHlCQURGO1NBRkw7T0FITCxDQVNFLENBQUMsSUFUSCxDQVNRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLEVBREk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVRSLEVBRFE7SUFBQSxDQWJWLENBQUE7O3FCQUFBOztLQUZ1QyxXQU56QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/beautifiers/puppet-fix.coffee

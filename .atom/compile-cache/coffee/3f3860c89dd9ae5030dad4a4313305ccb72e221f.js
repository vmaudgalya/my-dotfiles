(function() {
  var LoadingView, TextEditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  module.exports = LoadingView = (function(_super) {
    __extends(LoadingView, _super);

    function LoadingView() {
      this.show = __bind(this.show, this);
      this.hide = __bind(this.hide, this);
      return LoadingView.__super__.constructor.apply(this, arguments);
    }

    LoadingView.content = function() {
      return this.div({
        "class": 'atom-beautify message-panel'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top'
          }, function() {
            return _this.div({
              "class": "tool-panel panel-bottom"
            }, function() {
              return _this.div({
                "class": "inset-panel"
              }, function() {
                _this.div({
                  "class": "panel-heading"
                }, function() {
                  _this.div({
                    "class": 'btn-toolbar pull-right'
                  }, function() {
                    return _this.button({
                      "class": 'btn',
                      click: 'hide'
                    }, 'Hide');
                  });
                  return _this.span({
                    "class": 'text-primary',
                    outlet: 'title'
                  }, 'Atom Beautify');
                });
                return _this.div({
                  "class": "panel-body padded select-list text-center",
                  outlet: 'body'
                }, function() {
                  return _this.div(function() {
                    _this.span({
                      "class": 'text-center loading loading-spinner-large inline-block'
                    });
                    return _this.div({
                      "class": ''
                    }, 'Beautification in progress.');
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    LoadingView.prototype.hide = function(event, element) {
      return this.detach();
    };

    LoadingView.prototype.show = function() {
      if (!this.hasParent()) {
        return atom.workspace.addTopPanel({
          item: this
        });
      }
    };

    return LoadingView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvdmlld3MvbG9hZGluZy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBQVAsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOzs7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FDRTtBQUFBLFFBQUEsT0FBQSxFQUFPLDZCQUFQO09BREYsRUFDd0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDcEMsS0FBQyxDQUFBLEdBQUQsQ0FDRTtBQUFBLFlBQUEsT0FBQSxFQUFPLGtCQUFQO1dBREYsRUFDNkIsU0FBQSxHQUFBO21CQUN6QixLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8seUJBQVA7YUFBTCxFQUF1QyxTQUFBLEdBQUE7cUJBQ3JDLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sYUFBUDtlQUFMLEVBQTJCLFNBQUEsR0FBQTtBQUN6QixnQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsa0JBQUEsT0FBQSxFQUFPLGVBQVA7aUJBQUwsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLGtCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxvQkFBQSxPQUFBLEVBQU8sd0JBQVA7bUJBQUwsRUFBc0MsU0FBQSxHQUFBOzJCQUNwQyxLQUFDLENBQUEsTUFBRCxDQUNFO0FBQUEsc0JBQUEsT0FBQSxFQUFPLEtBQVA7QUFBQSxzQkFDQSxLQUFBLEVBQU8sTUFEUDtxQkFERixFQUdFLE1BSEYsRUFEb0M7a0JBQUEsQ0FBdEMsQ0FBQSxDQUFBO3lCQUtBLEtBQUMsQ0FBQSxJQUFELENBQ0U7QUFBQSxvQkFBQSxPQUFBLEVBQU8sY0FBUDtBQUFBLG9CQUNBLE1BQUEsRUFBUSxPQURSO21CQURGLEVBR0UsZUFIRixFQU4yQjtnQkFBQSxDQUE3QixDQUFBLENBQUE7dUJBVUEsS0FBQyxDQUFBLEdBQUQsQ0FDRTtBQUFBLGtCQUFBLE9BQUEsRUFBTywyQ0FBUDtBQUFBLGtCQUNBLE1BQUEsRUFBUSxNQURSO2lCQURGLEVBR0UsU0FBQSxHQUFBO3lCQUNFLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQSxHQUFBO0FBQ0gsb0JBQUEsS0FBQyxDQUFBLElBQUQsQ0FDRTtBQUFBLHNCQUFBLE9BQUEsRUFBTyx3REFBUDtxQkFERixDQUFBLENBQUE7MkJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FDRTtBQUFBLHNCQUFBLE9BQUEsRUFBTyxFQUFQO3FCQURGLEVBRUUsNkJBRkYsRUFIRztrQkFBQSxDQUFMLEVBREY7Z0JBQUEsQ0FIRixFQVh5QjtjQUFBLENBQTNCLEVBRHFDO1lBQUEsQ0FBdkMsRUFEeUI7VUFBQSxDQUQ3QixFQURvQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHhDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsMEJBNEJBLElBQUEsR0FBTSxTQUFDLEtBQUQsRUFBUSxPQUFSLEdBQUE7YUFDSixJQUFDLENBQUEsTUFBRCxDQUFBLEVBREk7SUFBQSxDQTVCTixDQUFBOztBQUFBLDBCQStCQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFHLENBQUEsSUFBSyxDQUFDLFNBQUYsQ0FBQSxDQUFQO2VBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFmLENBQTJCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUEzQixFQURGO09BREk7SUFBQSxDQS9CTixDQUFBOzt1QkFBQTs7S0FEd0IsS0FIMUIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/views/loading-view.coffee

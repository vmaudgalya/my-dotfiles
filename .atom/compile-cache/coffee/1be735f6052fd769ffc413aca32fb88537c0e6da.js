(function() {
  var $, $$, $$$, MessageView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, $$ = _ref.$$, $$$ = _ref.$$$, View = _ref.View;

  module.exports = MessageView = (function(_super) {
    __extends(MessageView, _super);

    MessageView.prototype.messages = [];

    MessageView.content = function() {
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
                      click: 'clearMessages'
                    }, 'Clear');
                  });
                  return _this.span({
                    "class": '',
                    outlet: 'title'
                  }, 'Atom Beautify Message');
                });
                return _this.div({
                  "class": "panel-body padded select-list",
                  outlet: 'body'
                }, function() {
                  return _this.ol({
                    "class": 'list-group',
                    outlet: 'messageItems'
                  }, function() {
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title Currently there is no way to display a message to the user, such as errors or warnings or deprecation notices (see #40). Let\'s put a little overlay on the top for displaying such information.');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'This is the title Currently there is no way to display a message to the user, such as errors or warnings or deprecation notices (see #40). Let\'s put a little overlay on the top for displaying such information.');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'test');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    return _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-added icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-file-text'
                      }, 'Primary line');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    function MessageView() {
      this.refresh = __bind(this.refresh, this);
      this.show = __bind(this.show, this);
      this.close = __bind(this.close, this);
      this.clearMessages = __bind(this.clearMessages, this);
      this.addMessage = __bind(this.addMessage, this);
      MessageView.__super__.constructor.apply(this, arguments);
    }

    MessageView.prototype.destroy = function() {};

    MessageView.prototype.addMessage = function(message) {
      this.messages.push(message);
      return this.refresh();
    };

    MessageView.prototype.clearMessages = function() {
      this.messages = [];
      return this.refresh();
    };

    MessageView.prototype.close = function(event, element) {
      return this.detach();
    };

    MessageView.prototype.show = function() {
      if (!this.hasParent()) {
        return atom.workspaceView.appendToTop(this);
      }
    };

    MessageView.prototype.refresh = function() {
      if (this.messages.length === 0) {
        return this.close();
      } else {
        return this.show();
      }
    };

    return MessageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvdmlld3MvbWVzc2FnZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQ0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQXFCLE9BQUEsQ0FBUSxzQkFBUixDQUFyQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLFdBQUEsR0FBUixFQUFhLFlBQUEsSUFBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7O0FBQUEsMEJBQUEsUUFBQSxHQUFVLEVBQVYsQ0FBQTs7QUFBQSxJQUNBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FDRTtBQUFBLFFBQUEsT0FBQSxFQUFPLDZCQUFQO09BREYsRUFDd0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDcEMsS0FBQyxDQUFBLEdBQUQsQ0FDRTtBQUFBLFlBQUEsT0FBQSxFQUFPLGtCQUFQO1dBREYsRUFDNkIsU0FBQSxHQUFBO21CQUN6QixLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8seUJBQVA7YUFBTCxFQUF1QyxTQUFBLEdBQUE7cUJBQ3JDLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sYUFBUDtlQUFMLEVBQTJCLFNBQUEsR0FBQTtBQUN6QixnQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsa0JBQUEsT0FBQSxFQUFPLGVBQVA7aUJBQUwsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLGtCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxvQkFBQSxPQUFBLEVBQU8sd0JBQVA7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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/views/message-view.coffee

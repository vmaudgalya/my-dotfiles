(function() {
  var $, PromptView, TextEditorView, View, method, noop, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  noop = function() {};

  method = function(delegate, method) {
    var _ref1;
    return (delegate != null ? (_ref1 = delegate[method]) != null ? _ref1.bind(delegate) : void 0 : void 0) || noop;
  };

  module.exports = PromptView = (function(_super) {
    __extends(PromptView, _super);

    function PromptView() {
      return PromptView.__super__.constructor.apply(this, arguments);
    }

    PromptView.attach = function() {
      return new PromptView;
    };

    PromptView.content = function() {
      return this.div({
        "class": 'emmet-prompt tool-panel panel-bottom'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'emmet-prompt__input'
          }, function() {
            return _this.subview('panelInput', new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    PromptView.prototype.initialize = function() {
      this.panelEditor = this.panelInput.getModel();
      this.panelEditor.onDidStopChanging((function(_this) {
        return function() {
          if (!_this.attached) {
            return;
          }
          return _this.handleUpdate(_this.panelEditor.getText());
        };
      })(this));
      atom.commands.add(this.panelInput.element, 'core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      return atom.commands.add(this.panelInput.element, 'core:cancel', (function(_this) {
        return function() {
          return _this.cancel();
        };
      })(this));
    };

    PromptView.prototype.show = function(delegate) {
      var text;
      this.delegate = delegate != null ? delegate : {};
      this.editor = this.delegate.editor;
      this.editorView = this.delegate.editorView;
      this.panelInput.element.setAttribute('placeholder', this.delegate.label || 'Enter abbreviation');
      this.updated = false;
      this.attach();
      text = this.panelEditor.getText();
      if (text) {
        this.panelEditor.selectAll();
        return this.handleUpdate(text);
      }
    };

    PromptView.prototype.undo = function() {
      if (this.updated) {
        return this.editor.undo();
      }
    };

    PromptView.prototype.handleUpdate = function(text) {
      this.undo();
      this.updated = true;
      return this.editor.transact((function(_this) {
        return function() {
          return method(_this.delegate, 'update')(text);
        };
      })(this));
    };

    PromptView.prototype.confirm = function() {
      this.handleUpdate(this.panelEditor.getText());
      this.trigger('confirm');
      method(this.delegate, 'confirm')();
      return this.detach();
    };

    PromptView.prototype.cancel = function() {
      this.undo();
      this.trigger('cancel');
      method(this.delegate, 'cancel')();
      return this.detach();
    };

    PromptView.prototype.detach = function() {
      var _ref1;
      if (!this.hasParent()) {
        return;
      }
      this.detaching = true;
      if ((_ref1 = this.prevPane) != null) {
        _ref1.activate();
      }
      PromptView.__super__.detach.apply(this, arguments);
      this.detaching = false;
      this.attached = false;
      this.trigger('detach');
      return method(this.delegate, 'hide')();
    };

    PromptView.prototype.attach = function() {
      this.attached = true;
      this.prevPane = atom.workspace.getActivePane();
      atom.workspace.addBottomPanel({
        item: this,
        visible: true
      });
      this.panelInput.focus();
      this.trigger('attach');
      return method(this.delegate, 'show')();
    };

    return PromptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvZW1tZXQvbGliL3Byb21wdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdURBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLHNCQUFBLGNBQUosRUFBb0IsWUFBQSxJQUFwQixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLFNBQUEsR0FBQSxDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFBLEdBQVMsU0FBQyxRQUFELEVBQVcsTUFBWCxHQUFBO0FBQ1IsUUFBQSxLQUFBO3lFQUFpQixDQUFFLElBQW5CLENBQXdCLFFBQXhCLG9CQUFBLElBQXFDLEtBRDdCO0VBQUEsQ0FIVCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNMLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxNQUFELEdBQVMsU0FBQSxHQUFBO2FBQUcsR0FBQSxDQUFBLFdBQUg7SUFBQSxDQUFULENBQUE7O0FBQUEsSUFFQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxzQ0FBUDtPQUFMLEVBQW9ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBRW5ELEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxxQkFBUDtXQUFMLEVBQW1DLFNBQUEsR0FBQTttQkFDbEMsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsY0FBQSxDQUFlO0FBQUEsY0FBQSxJQUFBLEVBQU0sSUFBTjthQUFmLENBQTNCLEVBRGtDO1VBQUEsQ0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/emmet/lib/prompt.coffee

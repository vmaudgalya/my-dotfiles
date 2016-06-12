Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.create = create;

var _messageElement = require('./message-element');

'use babel';

function create(message) {
  var bubble = document.createElement('div');
  bubble.id = 'linter-inline';
  bubble.appendChild(_messageElement.Message.fromMessage(message, false));
  if (message.trace && message.trace.length) {
    message.trace.forEach(function (trace) {
      bubble.appendChild(_messageElement.Message.fromMessage(trace).updateVisibility('Project'));
    });
  }
  return bubble;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvbWVzc2FnZS1idWJibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OEJBRXNCLG1CQUFtQjs7QUFGekMsV0FBVyxDQUFBOztBQUlKLFNBQVMsTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUM5QixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLFFBQU0sQ0FBQyxFQUFFLEdBQUcsZUFBZSxDQUFBO0FBQzNCLFFBQU0sQ0FBQyxXQUFXLENBQUMsd0JBQVEsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBO0FBQ3ZELE1BQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUN6QyxXQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNwQyxZQUFNLENBQUMsV0FBVyxDQUFDLHdCQUFRLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0tBQzNFLENBQUMsQ0FBQTtHQUNIO0FBQ0QsU0FBTyxNQUFNLENBQUE7Q0FDZCIsImZpbGUiOiIvVXNlcnMvdm1hdWRnYWx5YS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL21lc3NhZ2UtYnViYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtNZXNzYWdlfSBmcm9tICcuL21lc3NhZ2UtZWxlbWVudCdcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShtZXNzYWdlKSB7XG4gIGNvbnN0IGJ1YmJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGJ1YmJsZS5pZCA9ICdsaW50ZXItaW5saW5lJ1xuICBidWJibGUuYXBwZW5kQ2hpbGQoTWVzc2FnZS5mcm9tTWVzc2FnZShtZXNzYWdlLCBmYWxzZSkpXG4gIGlmIChtZXNzYWdlLnRyYWNlICYmIG1lc3NhZ2UudHJhY2UubGVuZ3RoKSB7XG4gICAgbWVzc2FnZS50cmFjZS5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNlKSB7XG4gICAgICBidWJibGUuYXBwZW5kQ2hpbGQoTWVzc2FnZS5mcm9tTWVzc2FnZSh0cmFjZSkudXBkYXRlVmlzaWJpbGl0eSgnUHJvamVjdCcpKVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIGJ1YmJsZVxufVxuIl19
//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/ui/message-bubble.js

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _atom = require('atom');

'use babel';

var idCounter = 0;
var nextId = function nextId() {
  return idCounter++;
};

/**
 * The `Decoration` class represents a decoration in the Minimap.
 *
 * It has the same API than the `Decoration` class of a text editor.
 */

var Decoration = (function () {
  _createClass(Decoration, null, [{
    key: 'isType',

    /**
     * Returns `true` if the passed-in decoration properties matches the
     * specified type.
     *
     * @param  {Object} decorationProperties the decoration properties to match
     * @param  {string} type the decoration type to match
     * @return {boolean} whether the decoration properties match the type
     */
    value: function isType(decorationProperties, type) {
      if (_underscorePlus2['default'].isArray(decorationProperties.type)) {
        if (decorationProperties.type.indexOf(type) >= 0) {
          return true;
        }
        return false;
      } else {
        return type === decorationProperties.type;
      }
    }

    /**
     * Creates a new decoration.
     *
     * @param  {Marker} marker the target marker for the decoration
     * @param  {Minimap} minimap the Minimap where the decoration will
     *                           be displayed
     * @param  {Object} properties the decoration's properties
     */
  }]);

  function Decoration(marker, minimap, properties) {
    var _this = this;

    _classCallCheck(this, Decoration);

    /**
     * @access private
     */
    this.marker = marker;
    /**
     * @access private
     */
    this.minimap = minimap;
    /**
     * @access private
     */
    this.emitter = new _atom.Emitter();
    /**
     * @access private
     */
    this.id = nextId();
    /**
     * @access private
     */
    this.properties = null;
    this.setProperties(properties);
    this.properties.id = this.id;
    /**
     * @access private
     */
    this.destroyed = false;
    /**
     * @access private
     */
    this.markerDestroyDisposable = this.marker.onDidDestroy(function () {
      _this.destroy();
    });
  }

  /**
   * Destroy this marker.
   *
   * If you own the marker, you should use `Marker#destroy` which will destroy
   * this decoration.
   */

  _createClass(Decoration, [{
    key: 'destroy',
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      this.markerDestroyDisposable.dispose();
      this.markerDestroyDisposable = null;
      this.destroyed = true;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
    }

    /**
     * Returns whether this decoration is destroyed or not.
     *
     * @return {boolean} whether this decoration is destroyed or not
     */
  }, {
    key: 'isDestroyed',
    value: function isDestroyed() {
      return this.destroyed;
    }

    /**
     * Registers an event listener to the `did-change-properties` event.
     *
     * This event is triggered when the decoration update method is called.
     *
     * @param  {function(change:Object):void} callback a function to call
     *                                        when the event is triggered
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeProperties',
    value: function onDidChangeProperties(callback) {
      return this.emitter.on('did-change-properties', callback);
    }

    /**
     * Registers an event listener to the `did-destroy` event.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }

    /**
     * An id unique across all Decoration objects.
     *
     * @return {number} the decoration id
     */
  }, {
    key: 'getId',
    value: function getId() {
      return this.id;
    }

    /**
     * Returns the marker associated with this Decoration.
     *
     * @return {Marker} the decoration's marker
     */
  }, {
    key: 'getMarker',
    value: function getMarker() {
      return this.marker;
    }

    /**
     * Check if this decoration is of type `type`.
     *
     * @param  {string|Array} type a type like `'line-number'`, `'line'`, etc.
     *                             `type` can also be an Array of Strings, where
     *                             it will return true if the decoration's type
     *                             matches any in the array.
     * @return {boolean} whether this decoration match the passed-in type
     */
  }, {
    key: 'isType',
    value: function isType(type) {
      return Decoration.isType(this.properties, type);
    }

    /**
     * Returns the Decoration's properties.
     *
     * @return {Object} the decoration's properties
     */
  }, {
    key: 'getProperties',
    value: function getProperties() {
      return this.properties;
    }

    /**
     * Update the marker with new properties. Allows you to change the
     * decoration's class.
     *
     * @param {Object} newProperties the new properties for the decoration
     */
  }, {
    key: 'setProperties',
    value: function setProperties(newProperties) {
      if (this.destroyed) {
        return;
      }

      var oldProperties = this.properties;
      this.properties = newProperties;
      this.properties.id = this.id;

      this.emitter.emit('did-change-properties', { oldProperties: oldProperties, newProperties: newProperties });
    }
  }]);

  return Decoration;
})();

exports['default'] = Decoration;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2RlY29yYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFYyxpQkFBaUI7Ozs7b0JBQ1QsTUFBTTs7QUFINUIsV0FBVyxDQUFBOztBQUtYLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixJQUFJLE1BQU0sR0FBRyxTQUFULE1BQU0sR0FBZTtBQUFFLFNBQU8sU0FBUyxFQUFFLENBQUE7Q0FBRSxDQUFBOzs7Ozs7OztJQU8xQixVQUFVO2VBQVYsVUFBVTs7Ozs7Ozs7Ozs7V0FVZixnQkFBQyxvQkFBb0IsRUFBRSxJQUFJLEVBQUU7QUFDekMsVUFBSSw0QkFBRSxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDeEMsWUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQTtTQUFFO0FBQ2pFLGVBQU8sS0FBSyxDQUFBO09BQ2IsTUFBTTtBQUNMLGVBQU8sSUFBSSxLQUFLLG9CQUFvQixDQUFDLElBQUksQ0FBQTtPQUMxQztLQUNGOzs7Ozs7Ozs7Ozs7QUFVVyxXQTNCTyxVQUFVLENBMkJoQixNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTs7OzBCQTNCdkIsVUFBVTs7Ozs7QUErQjNCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBOzs7O0FBSXBCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBOzs7O0FBSXRCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTs7OztBQUk1QixRQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sRUFBRSxDQUFBOzs7O0FBSWxCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDOUIsUUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQTs7OztBQUk1QixRQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTs7OztBQUl0QixRQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUM1RCxZQUFLLE9BQU8sRUFBRSxDQUFBO0tBQ2YsQ0FBQyxDQUFBO0dBQ0g7Ozs7Ozs7OztlQTVEa0IsVUFBVTs7V0FvRXJCLG1CQUFHO0FBQ1QsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsZUFBTTtPQUFFOztBQUU5QixVQUFJLENBQUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdEMsVUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQTtBQUNuQyxVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtBQUNyQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNoQyxVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3ZCOzs7Ozs7Ozs7V0FPVyx1QkFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtLQUFFOzs7Ozs7Ozs7Ozs7O1dBV2xCLCtCQUFDLFFBQVEsRUFBRTtBQUMvQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLHVCQUF1QixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzFEOzs7Ozs7Ozs7OztXQVNZLHNCQUFDLFFBQVEsRUFBRTtBQUN0QixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRDs7Ozs7Ozs7O1dBT0ssaUJBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxFQUFFLENBQUE7S0FBRTs7Ozs7Ozs7O1dBT2pCLHFCQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0tBQUU7Ozs7Ozs7Ozs7Ozs7V0FXNUIsZ0JBQUMsSUFBSSxFQUFFO0FBQ1osYUFBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDaEQ7Ozs7Ozs7OztXQU9hLHlCQUFHO0FBQ2YsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFBO0tBQ3ZCOzs7Ozs7Ozs7O1dBUWEsdUJBQUMsYUFBYSxFQUFFO0FBQzVCLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGVBQU07T0FBRTs7QUFFOUIsVUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQTtBQUNuQyxVQUFJLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQTtBQUMvQixVQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFBOztBQUU1QixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxFQUFDLGFBQWEsRUFBYixhQUFhLEVBQUUsYUFBYSxFQUFiLGFBQWEsRUFBQyxDQUFDLENBQUE7S0FDM0U7OztTQS9Ka0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvZGVjb3JhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cydcbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnYXRvbSdcblxudmFyIGlkQ291bnRlciA9IDBcbnZhciBuZXh0SWQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpZENvdW50ZXIrKyB9XG5cbi8qKlxuICogVGhlIGBEZWNvcmF0aW9uYCBjbGFzcyByZXByZXNlbnRzIGEgZGVjb3JhdGlvbiBpbiB0aGUgTWluaW1hcC5cbiAqXG4gKiBJdCBoYXMgdGhlIHNhbWUgQVBJIHRoYW4gdGhlIGBEZWNvcmF0aW9uYCBjbGFzcyBvZiBhIHRleHQgZWRpdG9yLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWNvcmF0aW9uIHtcblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHBhc3NlZC1pbiBkZWNvcmF0aW9uIHByb3BlcnRpZXMgbWF0Y2hlcyB0aGVcbiAgICogc3BlY2lmaWVkIHR5cGUuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gZGVjb3JhdGlvblByb3BlcnRpZXMgdGhlIGRlY29yYXRpb24gcHJvcGVydGllcyB0byBtYXRjaFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHR5cGUgdGhlIGRlY29yYXRpb24gdHlwZSB0byBtYXRjaFxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoZSBkZWNvcmF0aW9uIHByb3BlcnRpZXMgbWF0Y2ggdGhlIHR5cGVcbiAgICovXG4gIHN0YXRpYyBpc1R5cGUgKGRlY29yYXRpb25Qcm9wZXJ0aWVzLCB0eXBlKSB7XG4gICAgaWYgKF8uaXNBcnJheShkZWNvcmF0aW9uUHJvcGVydGllcy50eXBlKSkge1xuICAgICAgaWYgKGRlY29yYXRpb25Qcm9wZXJ0aWVzLnR5cGUuaW5kZXhPZih0eXBlKSA+PSAwKSB7IHJldHVybiB0cnVlIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHlwZSA9PT0gZGVjb3JhdGlvblByb3BlcnRpZXMudHlwZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGRlY29yYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSAge01hcmtlcn0gbWFya2VyIHRoZSB0YXJnZXQgbWFya2VyIGZvciB0aGUgZGVjb3JhdGlvblxuICAgKiBAcGFyYW0gIHtNaW5pbWFwfSBtaW5pbWFwIHRoZSBNaW5pbWFwIHdoZXJlIHRoZSBkZWNvcmF0aW9uIHdpbGxcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBiZSBkaXNwbGF5ZWRcbiAgICogQHBhcmFtICB7T2JqZWN0fSBwcm9wZXJ0aWVzIHRoZSBkZWNvcmF0aW9uJ3MgcHJvcGVydGllc1xuICAgKi9cbiAgY29uc3RydWN0b3IgKG1hcmtlciwgbWluaW1hcCwgcHJvcGVydGllcykge1xuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMubWFya2VyID0gbWFya2VyXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5taW5pbWFwID0gbWluaW1hcFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmlkID0gbmV4dElkKClcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnByb3BlcnRpZXMgPSBudWxsXG4gICAgdGhpcy5zZXRQcm9wZXJ0aWVzKHByb3BlcnRpZXMpXG4gICAgdGhpcy5wcm9wZXJ0aWVzLmlkID0gdGhpcy5pZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2VcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLm1hcmtlckRlc3Ryb3lEaXNwb3NhYmxlID0gdGhpcy5tYXJrZXIub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIHRoaXMuZGVzdHJveSgpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoaXMgbWFya2VyLlxuICAgKlxuICAgKiBJZiB5b3Ugb3duIHRoZSBtYXJrZXIsIHlvdSBzaG91bGQgdXNlIGBNYXJrZXIjZGVzdHJveWAgd2hpY2ggd2lsbCBkZXN0cm95XG4gICAqIHRoaXMgZGVjb3JhdGlvbi5cbiAgICovXG4gIGRlc3Ryb3kgKCkge1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5tYXJrZXJEZXN0cm95RGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICB0aGlzLm1hcmtlckRlc3Ryb3lEaXNwb3NhYmxlID0gbnVsbFxuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciB0aGlzIGRlY29yYXRpb24gaXMgZGVzdHJveWVkIG9yIG5vdC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGlzIGRlY29yYXRpb24gaXMgZGVzdHJveWVkIG9yIG5vdFxuICAgKi9cbiAgaXNEZXN0cm95ZWQgKCkgeyByZXR1cm4gdGhpcy5kZXN0cm95ZWQgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLXByb3BlcnRpZXNgIGV2ZW50LlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBkZWNvcmF0aW9uIHVwZGF0ZSBtZXRob2QgaXMgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihjaGFuZ2U6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGxcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlUHJvcGVydGllcyAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXByb3BlcnRpZXMnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtZGVzdHJveWAgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGV2ZW50XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgdHJpZ2dlcmVkXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkRGVzdHJveSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIEFuIGlkIHVuaXF1ZSBhY3Jvc3MgYWxsIERlY29yYXRpb24gb2JqZWN0cy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgZGVjb3JhdGlvbiBpZFxuICAgKi9cbiAgZ2V0SWQgKCkgeyByZXR1cm4gdGhpcy5pZCB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1hcmtlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBEZWNvcmF0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJuIHtNYXJrZXJ9IHRoZSBkZWNvcmF0aW9uJ3MgbWFya2VyXG4gICAqL1xuICBnZXRNYXJrZXIgKCkgeyByZXR1cm4gdGhpcy5tYXJrZXIgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIGRlY29yYXRpb24gaXMgb2YgdHlwZSBgdHlwZWAuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ3xBcnJheX0gdHlwZSBhIHR5cGUgbGlrZSBgJ2xpbmUtbnVtYmVyJ2AsIGAnbGluZSdgLCBldGMuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdHlwZWAgY2FuIGFsc28gYmUgYW4gQXJyYXkgb2YgU3RyaW5ncywgd2hlcmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0IHdpbGwgcmV0dXJuIHRydWUgaWYgdGhlIGRlY29yYXRpb24ncyB0eXBlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzIGFueSBpbiB0aGUgYXJyYXkuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhpcyBkZWNvcmF0aW9uIG1hdGNoIHRoZSBwYXNzZWQtaW4gdHlwZVxuICAgKi9cbiAgaXNUeXBlICh0eXBlKSB7XG4gICAgcmV0dXJuIERlY29yYXRpb24uaXNUeXBlKHRoaXMucHJvcGVydGllcywgdHlwZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBEZWNvcmF0aW9uJ3MgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgZGVjb3JhdGlvbidzIHByb3BlcnRpZXNcbiAgICovXG4gIGdldFByb3BlcnRpZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIG1hcmtlciB3aXRoIG5ldyBwcm9wZXJ0aWVzLiBBbGxvd3MgeW91IHRvIGNoYW5nZSB0aGVcbiAgICogZGVjb3JhdGlvbidzIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gbmV3UHJvcGVydGllcyB0aGUgbmV3IHByb3BlcnRpZXMgZm9yIHRoZSBkZWNvcmF0aW9uXG4gICAqL1xuICBzZXRQcm9wZXJ0aWVzIChuZXdQcm9wZXJ0aWVzKSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybiB9XG5cbiAgICBsZXQgb2xkUHJvcGVydGllcyA9IHRoaXMucHJvcGVydGllc1xuICAgIHRoaXMucHJvcGVydGllcyA9IG5ld1Byb3BlcnRpZXNcbiAgICB0aGlzLnByb3BlcnRpZXMuaWQgPSB0aGlzLmlkXG5cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1wcm9wZXJ0aWVzJywge29sZFByb3BlcnRpZXMsIG5ld1Byb3BlcnRpZXN9KVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/vmaudgalya/.atom/packages/minimap/lib/decoration.js

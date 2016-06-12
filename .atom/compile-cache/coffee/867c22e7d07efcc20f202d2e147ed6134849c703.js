(function() {
  var VariablesCollection;

  VariablesCollection = require('../lib/variables-collection');

  describe('VariablesCollection', function() {
    var changeSpy, collection, createVar, _ref;
    _ref = [], collection = _ref[0], changeSpy = _ref[1];
    createVar = function(name, value, range, path, line) {
      return {
        name: name,
        value: value,
        range: range,
        path: path,
        line: line
      };
    };
    return describe('with an empty collection', function() {
      beforeEach(function() {
        collection = new VariablesCollection;
        changeSpy = jasmine.createSpy('did-change');
        return collection.onDidChange(changeSpy);
      });
      describe('::addMany', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        it('stores them in the collection', function() {
          return expect(collection.length).toEqual(5);
        });
        it('detects that two of the variables are color variables', function() {
          return expect(collection.getColorVariables().length).toEqual(2);
        });
        it('dispatches a change event', function() {
          var arg;
          expect(changeSpy).toHaveBeenCalled();
          arg = changeSpy.mostRecentCall.args[0];
          expect(arg.created.length).toEqual(5);
          expect(arg.destroyed).toBeUndefined();
          return expect(arg.updated).toBeUndefined();
        });
        it('stores the names of the variables', function() {
          return expect(collection.variableNames.sort()).toEqual(['foo', 'bar', 'baz', 'bat', 'bab'].sort());
        });
        it('builds a dependencies map', function() {
          return expect(collection.dependencyGraph).toEqual({
            foo: ['baz'],
            bar: ['bat'],
            bat: ['bab']
          });
        });
        describe('appending an already existing variable', function() {
          beforeEach(function() {
            return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1)]);
          });
          it('leaves the collection untouched', function() {
            expect(collection.length).toEqual(5);
            return expect(collection.getColorVariables().length).toEqual(2);
          });
          return it('does not trigger an update event', function() {
            return expect(changeSpy.callCount).toEqual(1);
          });
        });
        return describe('appending an already existing variable with a different value', function() {
          describe('that has a different range', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#aabbcc', [0, 14], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#aabbcc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#aabbcc');
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that has a different range and a different line', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#abc', [52, 64], '/path/to/foo.styl', 6)]);
            });
            it('appends the new variables', function() {
              expect(collection.length).toEqual(6);
              return expect(collection.getColorVariables().length).toEqual(3);
            });
            it('stores the two variables', function() {
              var variables;
              variables = collection.findAll({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              return expect(variables.length).toEqual(2);
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created.length).toEqual(1);
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(1);
            });
          });
          describe('that is still a color', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#abc', [0, 10], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#abc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#abc');
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that is no longer a color', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '20px', [0, 10], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection variables untouched', function() {
              return expect(collection.length).toEqual(5);
            });
            it('affects the colors variables within the collection', function() {
              return expect(collection.getColorVariables().length).toEqual(0);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('20px');
              return expect(variable.isColor).toBeFalsy();
            });
            it('updates the variables depending on the changed variable', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              return expect(variable.isColor).toBeFalsy();
            });
            return it('emits a change event', function() {
              var arg;
              arg = changeSpy.mostRecentCall.args[0];
              expect(changeSpy.callCount).toEqual(2);
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that breaks a dependency', function() {
            beforeEach(function() {
              return collection.addMany([createVar('baz', '#abc', [22, 30], '/path/to/foo.styl', 3)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#abc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#abc');
            });
            return it('updates the dependencies graph', function() {
              return expect(collection.dependencyGraph).toEqual({
                bar: ['bat'],
                bat: ['bab']
              });
            });
          });
          return describe('that adds a dependency', function() {
            beforeEach(function() {
              return collection.addMany([createVar('baz', 'transparentize(foo, bar)', [22, 30], '/path/to/foo.styl', 3)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('transparentize(foo, bar)');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor(255, 255, 255, 0.5);
            });
            return it('updates the dependencies graph', function() {
              return expect(collection.dependencyGraph).toEqual({
                foo: ['baz'],
                bar: ['bat', 'baz'],
                bat: ['bab']
              });
            });
          });
        });
      });
      describe('::removeMany', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        describe('with variables that were not colors', function() {
          beforeEach(function() {
            return collection.removeMany([createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
          });
          it('removes the variables from the collection', function() {
            return expect(collection.length).toEqual(3);
          });
          it('dispatches a change event', function() {
            var arg;
            expect(changeSpy).toHaveBeenCalled();
            arg = changeSpy.mostRecentCall.args[0];
            expect(arg.created).toBeUndefined();
            expect(arg.destroyed.length).toEqual(2);
            return expect(arg.updated).toBeUndefined();
          });
          it('stores the names of the variables', function() {
            return expect(collection.variableNames.sort()).toEqual(['foo', 'bar', 'baz'].sort());
          });
          it('updates the variables per path map', function() {
            return expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(3);
          });
          return it('updates the dependencies map', function() {
            return expect(collection.dependencyGraph).toEqual({
              foo: ['baz']
            });
          });
        });
        return describe('with variables that were referenced by a color variable', function() {
          beforeEach(function() {
            return collection.removeMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1)]);
          });
          it('removes the variables from the collection', function() {
            expect(collection.length).toEqual(4);
            return expect(collection.getColorVariables().length).toEqual(0);
          });
          it('dispatches a change event', function() {
            var arg;
            expect(changeSpy).toHaveBeenCalled();
            arg = changeSpy.mostRecentCall.args[0];
            expect(arg.created).toBeUndefined();
            expect(arg.destroyed.length).toEqual(1);
            return expect(arg.updated.length).toEqual(1);
          });
          it('stores the names of the variables', function() {
            return expect(collection.variableNames.sort()).toEqual(['bar', 'baz', 'bat', 'bab'].sort());
          });
          it('updates the variables per path map', function() {
            return expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(4);
          });
          return it('updates the dependencies map', function() {
            return expect(collection.dependencyGraph).toEqual({
              bar: ['bat'],
              bat: ['bab']
            });
          });
        });
      });
      describe('::updatePathCollection', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        describe('when a new variable is added', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5), createVar('baa', '#f00', [52, 60], '/path/to/foo.styl', 6)]);
          });
          return it('detects the addition and leave the rest of the collection unchanged', function() {
            expect(collection.length).toEqual(6);
            expect(collection.getColorVariables().length).toEqual(3);
            expect(changeSpy.mostRecentCall.args[0].created.length).toEqual(1);
            expect(changeSpy.mostRecentCall.args[0].destroyed).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].updated).toBeUndefined();
          });
        });
        describe('when a variable is removed', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4)]);
          });
          return it('removes the variable that is not present in the new array', function() {
            expect(collection.length).toEqual(4);
            expect(collection.getColorVariables().length).toEqual(2);
            expect(changeSpy.mostRecentCall.args[0].destroyed.length).toEqual(1);
            expect(changeSpy.mostRecentCall.args[0].created).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].updated).toBeUndefined();
          });
        });
        return describe('when a new variable is changed', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', '#abc', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
          });
          return it('detects the update', function() {
            expect(collection.length).toEqual(5);
            expect(collection.getColorVariables().length).toEqual(4);
            expect(changeSpy.mostRecentCall.args[0].updated.length).toEqual(2);
            expect(changeSpy.mostRecentCall.args[0].destroyed).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].created).toBeUndefined();
          });
        });
      });
      describe('::serialize', function() {
        describe('with an empty collection', function() {
          return it('returns an empty serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: []
            });
          });
        });
        describe('with a collection that contains a non-color variable', function() {
          beforeEach(function() {
            return collection.add(createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'bar',
                  value: '0.5',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2
                }
              ]
            });
          });
        });
        describe('with a collection that contains a color variable', function() {
          beforeEach(function() {
            return collection.add(createVar('bar', '#abc', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'bar',
                  value: '#abc',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: []
                }
              ]
            });
          });
        });
        return describe('with a collection that contains color variables with references', function() {
          beforeEach(function() {
            collection.add(createVar('foo', '#abc', [0, 10], '/path/to/foo.styl', 1));
            return collection.add(createVar('bar', 'foo', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'foo',
                  value: '#abc',
                  range: [0, 10],
                  path: '/path/to/foo.styl',
                  line: 1,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: []
                }, {
                  name: 'bar',
                  value: 'foo',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: ['foo']
                }
              ]
            });
          });
        });
      });
      return describe('.deserialize', function() {
        beforeEach(function() {
          return collection = atom.deserializers.deserialize({
            deserializer: 'VariablesCollection',
            content: [
              {
                name: 'foo',
                value: '#abc',
                range: [0, 10],
                path: '/path/to/foo.styl',
                line: 1,
                isColor: true,
                color: [170, 187, 204, 1],
                variables: []
              }, {
                name: 'bar',
                value: 'foo',
                range: [12, 20],
                path: '/path/to/foo.styl',
                line: 2,
                isColor: true,
                color: [170, 187, 204, 1],
                variables: ['foo']
              }, {
                name: 'baz',
                value: '0.5',
                range: [22, 30],
                path: '/path/to/foo.styl',
                line: 3
              }
            ]
          });
        });
        it('restores the variables', function() {
          expect(collection.length).toEqual(3);
          return expect(collection.getColorVariables().length).toEqual(2);
        });
        return it('restores all the denormalized data in the collection', function() {
          expect(collection.variableNames).toEqual(['foo', 'bar', 'baz']);
          expect(Object.keys(collection.variablesByPath)).toEqual(['/path/to/foo.styl']);
          expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(3);
          return expect(collection.dependencyGraph).toEqual({
            foo: ['bar']
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy92YXJpYWJsZXMtY29sbGVjdGlvbi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSw2QkFBUixDQUF0QixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixRQUFBLHNDQUFBO0FBQUEsSUFBQSxPQUEwQixFQUExQixFQUFDLG9CQUFELEVBQWEsbUJBQWIsQ0FBQTtBQUFBLElBRUEsU0FBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxLQUFkLEVBQXFCLElBQXJCLEVBQTJCLElBQTNCLEdBQUE7YUFDVjtBQUFBLFFBQUMsTUFBQSxJQUFEO0FBQUEsUUFBTyxPQUFBLEtBQVA7QUFBQSxRQUFjLE9BQUEsS0FBZDtBQUFBLFFBQXFCLE1BQUEsSUFBckI7QUFBQSxRQUEyQixNQUFBLElBQTNCO1FBRFU7SUFBQSxDQUZaLENBQUE7V0FLQSxRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsVUFBQSxHQUFhLEdBQUEsQ0FBQSxtQkFBYixDQUFBO0FBQUEsUUFDQSxTQUFBLEdBQVksT0FBTyxDQUFDLFNBQVIsQ0FBa0IsWUFBbEIsQ0FEWixDQUFBO2VBRUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsU0FBdkIsRUFIUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFhQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULFVBQVUsQ0FBQyxPQUFYLENBQW1CLENB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/variables-collection-spec.coffee

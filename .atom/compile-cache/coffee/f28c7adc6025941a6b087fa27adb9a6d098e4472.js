(function() {
  var grammarTest, path;

  path = require('path');

  grammarTest = require('atom-grammar-test');

  describe('Grammar', function() {
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-babel');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-todo');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-hyperlink');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-mustache');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-html');
      });
    });
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/flow.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-class.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-functions.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-symbols.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-template-strings.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-attributes.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-es6.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-features.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-full-react-class.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-text.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/declare.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/browser-polyfill.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/jquery-2.1.4.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/bundle.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/jquery-2.1.4.min.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/everythingJs/es2015-module.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/doc-keywords.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/issues.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/misc.js'));
    return grammarTest(path.join(__dirname, 'fixtures/grammar/es6module.js'));
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvc3BlYy9ncmFtbWFyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsbUJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZ0JBQTlCLEVBRGM7TUFBQSxDQUFoQixDQUFBLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCLEVBRGM7TUFBQSxDQUFoQixDQUZBLENBQUE7QUFBQSxNQUlBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLG9CQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FKQSxDQUFBO0FBQUEsTUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixtQkFBOUIsRUFEYztNQUFBLENBQWhCLENBTkEsQ0FBQTthQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCLEVBRGM7TUFBQSxDQUFoQixFQVRTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQWFBLFdBQUEsQ0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsd0NBQXJCLENBQVosQ0FiQSxDQUFBO0FBQUEsSUFjQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLDRDQUFyQixDQUFaLENBZEEsQ0FBQTtBQUFBLElBZUEsV0FBQSxDQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixnREFBckIsQ0FBWixDQWZBLENBQUE7QUFBQSxJQWdCQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLDhDQUFyQixDQUFaLENBaEJBLENBQUE7QUFBQSxJQWlCQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLHVEQUFyQixDQUFaLENBakJBLENBQUE7QUFBQSxJQWtCQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLG1EQUFyQixDQUFaLENBbEJBLENBQUE7QUFBQSxJQW1CQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLDRDQUFyQixDQUFaLENBbkJBLENBQUE7QUFBQSxJQW9CQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGlEQUFyQixDQUFaLENBcEJBLENBQUE7QUFBQSxJQXFCQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLHlEQUFyQixDQUFaLENBckJBLENBQUE7QUFBQSxJQXNCQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLDZDQUFyQixDQUFaLENBdEJBLENBQUE7QUFBQSxJQXlCQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLDZCQUFyQixDQUFaLENBekJBLENBQUE7QUFBQSxJQTRCQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtEQUFyQixDQUFaLENBNUJBLENBQUE7QUFBQSxJQTZCQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLDhDQUFyQixDQUFaLENBN0JBLENBQUE7QUFBQSxJQThCQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLHdDQUFyQixDQUFaLENBOUJBLENBQUE7QUFBQSxJQStCQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtEQUFyQixDQUFaLENBL0JBLENBQUE7QUFBQSxJQWtDQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGdEQUFyQixDQUFaLENBbENBLENBQUE7QUFBQSxJQXFDQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtDQUFyQixDQUFaLENBckNBLENBQUE7QUFBQSxJQXdDQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLDRCQUFyQixDQUFaLENBeENBLENBQUE7QUFBQSxJQTJDQSxXQUFBLENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLDBCQUFyQixDQUFaLENBM0NBLENBQUE7V0E0Q0EsV0FBQSxDQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQiwrQkFBckIsQ0FBWixFQTdDa0I7RUFBQSxDQUFwQixDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/spec/grammar-spec.coffee

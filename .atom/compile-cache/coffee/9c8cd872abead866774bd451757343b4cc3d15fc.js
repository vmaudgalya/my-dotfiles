(function() {
  var ColorContext, ColorExpression, ColorParser, registry;

  require('./helpers/matchers');

  ColorParser = require('../lib/color-parser');

  ColorContext = require('../lib/color-context');

  ColorExpression = require('../lib/color-expression');

  registry = require('../lib/color-expressions');

  describe('ColorParser', function() {
    var asColor, getParser, itParses, parser;
    parser = [][0];
    asColor = function(value) {
      return "color:" + value;
    };
    getParser = function(context) {
      context = new ColorContext(context != null ? context : {
        registry: registry
      });
      return context.parser;
    };
    itParses = function(expression) {
      return {
        description: '',
        asColor: function(r, g, b, a) {
          var context;
          if (a == null) {
            a = 1;
          }
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("parses '" + expression + "' as a color", function() {
              var _ref, _ref1;
              if (context != null) {
                return expect(parser.parse(expression, (_ref = this.scope) != null ? _ref : 'less')).toBeColor(r, g, b, a, Object.keys(context).sort());
              } else {
                return expect(parser.parse(expression, (_ref1 = this.scope) != null ? _ref1 : 'less')).toBeColor(r, g, b, a);
              }
            });
          });
        },
        asUndefined: function() {
          var context;
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("does not parse '" + expression + "' and return undefined", function() {
              var _ref;
              return expect(parser.parse(expression, (_ref = this.scope) != null ? _ref : 'less')).toBeUndefined();
            });
          });
        },
        asInvalid: function() {
          var context;
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("parses '" + expression + "' as an invalid color", function() {
              var _ref;
              return expect(parser.parse(expression, (_ref = this.scope) != null ? _ref : 'less')).not.toBeValid();
            });
          });
        },
        withContext: function(variables) {
          var colorVars, name, path, value, vars;
          vars = [];
          colorVars = [];
          path = "/path/to/file.styl";
          for (name in variables) {
            value = variables[name];
            if (value.indexOf('color:') !== -1) {
              value = value.replace('color:', '');
              vars.push({
                name: name,
                value: value,
                path: path
              });
              colorVars.push({
                name: name,
                value: value,
                path: path
              });
            } else {
              vars.push({
                name: name,
                value: value,
                path: path
              });
            }
          }
          this.context = {
            variables: vars,
            colorVariables: colorVars,
            registry: registry
          };
          this.description = "with variables context " + (jasmine.pp(variables)) + " ";
          return this;
        }
      };
    };
    itParses('@list-item-height').withContext({
      '@text-height': '@scale-b-xxl * 1rem',
      '@component-line-height': '@text-height',
      '@list-item-height': '@component-line-height'
    }).asUndefined();
    itParses('$text-color !default').withContext({
      '$text-color': asColor('cyan')
    }).asColor(0, 255, 255);
    itParses('c').withContext({
      'c': 'c'
    }).asUndefined();
    itParses('c').withContext({
      'c': 'd',
      'd': 'e',
      'e': 'c'
    }).asUndefined();
    itParses('#ff7f00').asColor(255, 127, 0);
    itParses('#f70').asColor(255, 119, 0);
    itParses('#ff7f00cc').asColor(255, 127, 0, 0.8);
    itParses('#f70c').asColor(255, 119, 0, 0.8);
    itParses('0xff7f00').asColor(255, 127, 0);
    itParses('0x00ff7f00').asColor(255, 127, 0, 0);
    describe('in context other than css and pre-processors', function() {
      beforeEach(function() {
        return this.scope = 'xaml';
      });
      return itParses('#ccff7f00').asColor(255, 127, 0, 0.8);
    });
    itParses('rgb(255,127,0)').asColor(255, 127, 0);
    itParses('rgb(255,127,0)').asColor(255, 127, 0);
    itParses('rgb($r,$g,$b)').asInvalid();
    itParses('rgb($r,0,0)').asInvalid();
    itParses('rgb(0,$g,0)').asInvalid();
    itParses('rgb(0,0,$b)').asInvalid();
    itParses('rgb($r,$g,$b)').withContext({
      '$r': '255',
      '$g': '127',
      '$b': '0'
    }).asColor(255, 127, 0);
    itParses('rgba(255,127,0,0.5)').asColor(255, 127, 0, 0.5);
    itParses('rgba(255,127,0,.5)').asColor(255, 127, 0, 0.5);
    itParses('rgba(255,127,0,)').asUndefined();
    itParses('rgba($r,$g,$b,$a)').asInvalid();
    itParses('rgba($r,0,0,0)').asInvalid();
    itParses('rgba(0,$g,0,0)').asInvalid();
    itParses('rgba(0,0,$b,0)').asInvalid();
    itParses('rgba(0,0,0,$a)').asInvalid();
    itParses('rgba($r,$g,$b,$a)').withContext({
      '$r': '255',
      '$g': '127',
      '$b': '0',
      '$a': '0.5'
    }).asColor(255, 127, 0, 0.5);
    itParses('rgba(green, 0.5)').asColor(0, 128, 0, 0.5);
    itParses('rgba($c,$a,)').asUndefined();
    itParses('rgba($c,$a)').asInvalid();
    itParses('rgba($c,1)').asInvalid();
    itParses('rgba($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('rgba($c,$a)').withContext({
      '$c': asColor('green'),
      '$a': '0.5'
    }).asColor(0, 128, 0, 0.5);
    itParses('hsl(200,50%,50%)').asColor(64, 149, 191);
    itParses('hsl(200,50,50)').asColor(64, 149, 191);
    itParses('hsl(200.5,50.5,50.5)').asColor(65, 150, 193);
    itParses('hsl($h,$s,$l,)').asUndefined();
    itParses('hsl($h,$s,$l)').asInvalid();
    itParses('hsl($h,0%,0%)').asInvalid();
    itParses('hsl(0,$s,0%)').asInvalid();
    itParses('hsl(0,0%,$l)').asInvalid();
    itParses('hsl($h,$s,$l)').withContext({
      '$h': '200',
      '$s': '50%',
      '$l': '50%'
    }).asColor(64, 149, 191);
    itParses('hsla(200,50%,50%,0.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200,50%,50%,.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200,50,50,.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200.5,50.5,50.5,.5)').asColor(65, 150, 193, 0.5);
    itParses('hsla(200,50%,50%,)').asUndefined();
    itParses('hsla($h,$s,$l,$a)').asInvalid();
    itParses('hsla($h,0%,0%,0)').asInvalid();
    itParses('hsla(0,$s,0%,0)').asInvalid();
    itParses('hsla(0,0%,$l,0)').asInvalid();
    itParses('hsla(0,0%,0%,$a)').asInvalid();
    itParses('hsla($h,$s,$l,$a)').withContext({
      '$h': '200',
      '$s': '50%',
      '$l': '50%',
      '$a': '0.5'
    }).asColor(64, 149, 191, 0.5);
    itParses('hsv(200,50%,50%)').asColor(64, 106, 128);
    itParses('hsb(200,50%,50%)').asColor(64, 106, 128);
    itParses('hsb(200,50,50)').asColor(64, 106, 128);
    itParses('hsb(200.5,50.5,50.5)').asColor(64, 107, 129);
    itParses('hsv($h,$s,$v,)').asUndefined();
    itParses('hsv($h,$s,$v)').asInvalid();
    itParses('hsv($h,0%,0%)').asInvalid();
    itParses('hsv(0,$s,0%)').asInvalid();
    itParses('hsv(0,0%,$v)').asInvalid();
    itParses('hsv($h,$s,$v)').withContext({
      '$h': '200',
      '$s': '50%',
      '$v': '50%'
    }).asColor(64, 106, 128);
    itParses('hsva(200,50%,50%,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200,50,50,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsba(200,50%,50%,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200,50%,50%,.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200.5,50.5,50.5,.5)').asColor(64, 107, 129, 0.5);
    itParses('hsva(200,50%,50%,)').asUndefined();
    itParses('hsva($h,$s,$v,$a)').asInvalid();
    itParses('hsva($h,0%,0%,0)').asInvalid();
    itParses('hsva(0,$s,0%,0)').asInvalid();
    itParses('hsva(0,0%,$v,0)').asInvalid();
    itParses('hsva($h,$s,$v,$a)').withContext({
      '$h': '200',
      '$s': '50%',
      '$v': '50%',
      '$a': '0.5'
    }).asColor(64, 106, 128, 0.5);
    itParses('hwb(210,40%,40%)').asColor(102, 128, 153);
    itParses('hwb(210,40,40)').asColor(102, 128, 153);
    itParses('hwb(210,40%,40%, 0.5)').asColor(102, 128, 153, 0.5);
    itParses('hwb(210.5,40.5,40.5)').asColor(103, 128, 152);
    itParses('hwb(210.5,40.5%,40.5%, 0.5)').asColor(103, 128, 152, 0.5);
    itParses('hwb($h,$w,$b,)').asUndefined();
    itParses('hwb($h,$w,$b)').asInvalid();
    itParses('hwb($h,0%,0%)').asInvalid();
    itParses('hwb(0,$w,0%)').asInvalid();
    itParses('hwb(0,0%,$b)').asInvalid();
    itParses('hwb($h,0%,0%,0)').asInvalid();
    itParses('hwb(0,$w,0%,0)').asInvalid();
    itParses('hwb(0,0%,$b,0)').asInvalid();
    itParses('hwb(0,0%,0%,$a)').asInvalid();
    itParses('hwb($h,$w,$b)').withContext({
      '$h': '210',
      '$w': '40%',
      '$b': '40%'
    }).asColor(102, 128, 153);
    itParses('hwb($h,$w,$b,$a)').withContext({
      '$h': '210',
      '$w': '40%',
      '$b': '40%',
      '$a': '0.5'
    }).asColor(102, 128, 153, 0.5);
    itParses('cmyk(0,0.5,1,0)').asColor('#ff7f00');
    itParses('cmyk(c,m,y,k)').withContext({
      'c': '0',
      'm': '0.5',
      'y': '1',
      'k': '0'
    }).asColor('#ff7f00');
    itParses('cmyk(c,m,y,k)').asInvalid();
    itParses('gray(100%)').asColor(255, 255, 255);
    itParses('gray(100)').asColor(255, 255, 255);
    itParses('gray(100%, 0.5)').asColor(255, 255, 255, 0.5);
    itParses('gray($c, $a,)').asUndefined();
    itParses('gray($c, $a)').asInvalid();
    itParses('gray(0%, $a)').asInvalid();
    itParses('gray($c, 0)').asInvalid();
    itParses('gray($c, $a)').withContext({
      '$c': '100%',
      '$a': '0.5'
    }).asColor(255, 255, 255, 0.5);
    itParses('yellowgreen').asColor('#9acd32');
    itParses('YELLOWGREEN').asColor('#9acd32');
    itParses('yellowGreen').asColor('#9acd32');
    itParses('YellowGreen').asColor('#9acd32');
    itParses('yellow_green').asColor('#9acd32');
    itParses('YELLOW_GREEN').asColor('#9acd32');
    itParses('>YELLOW_GREEN').asColor('#9acd32');
    itParses('darken(cyan, 20%)').asColor(0, 153, 153);
    itParses('darken(cyan, 20)').asColor(0, 153, 153);
    itParses('darken(#fff, 100%)').asColor(0, 0, 0);
    itParses('darken(cyan, $r)').asInvalid();
    itParses('darken($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('darken($c, $r)').withContext({
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(0, 153, 153);
    itParses('darken($a, $r)').withContext({
      '$a': asColor('rgba($c, 1)'),
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(0, 153, 153);
    itParses('lighten(cyan, 20%)').asColor(102, 255, 255);
    itParses('lighten(cyan, 20)').asColor(102, 255, 255);
    itParses('lighten(#000, 100%)').asColor(255, 255, 255);
    itParses('lighten(cyan, $r)').asInvalid();
    itParses('lighten($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('lighten($c, $r)').withContext({
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(102, 255, 255);
    itParses('lighten($a, $r)').withContext({
      '$a': asColor('rgba($c, 1)'),
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(102, 255, 255);
    itParses('transparentize(cyan, 50%)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, 50)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, .5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fade-out(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fade_out(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, .5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, @r)').asInvalid();
    itParses('fadeout($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('fadeout(@c, @r)').withContext({
      '@c': asColor('cyan'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 0.5);
    itParses('fadeout(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('cyan'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 0.5);
    itParses('opacify(0x7800FFFF, 50%)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, 50)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, .5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fade-in(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fade_in(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, .5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, @r)').asInvalid();
    itParses('fadein($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('fadein(@c, @r)').withContext({
      '@c': asColor('0x7800FFFF'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 1);
    itParses('fadein(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('0x7800FFFF'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 1);
    itParses('saturate(#855, 20%)').asColor(158, 63, 63);
    itParses('saturate(#855, 20)').asColor(158, 63, 63);
    itParses('saturate(#855, 0.2)').asColor(158, 63, 63);
    itParses('saturate(#855, @r)').asInvalid();
    itParses('saturate($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('saturate(@c, @r)').withContext({
      '@c': asColor('#855'),
      '@r': '0.2'
    }).asColor(158, 63, 63);
    itParses('saturate(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#855'),
      '@r': '0.2'
    }).asColor(158, 63, 63);
    itParses('desaturate(#9e3f3f, 20%)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, 20)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, 0.2)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, .2)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, @r)').asInvalid();
    itParses('desaturate($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('desaturate(@c, @r)').withContext({
      '@c': asColor('#9e3f3f'),
      '@r': '0.2'
    }).asColor(136, 85, 85);
    itParses('desaturate(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f'),
      '@r': '0.2'
    }).asColor(136, 85, 85);
    itParses('grayscale(#9e3f3f)').asColor(111, 111, 111);
    itParses('greyscale(#9e3f3f)').asColor(111, 111, 111);
    itParses('grayscale(@c)').asInvalid();
    itParses('grayscale($c)').withContext({
      '$c': asColor('hsv($h, $s, $v)')
    }).asInvalid();
    itParses('grayscale(@c)').withContext({
      '@c': asColor('#9e3f3f')
    }).asColor(111, 111, 111);
    itParses('grayscale(@a)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f')
    }).asColor(111, 111, 111);
    itParses('invert(#9e3f3f)').asColor(97, 192, 192);
    itParses('invert(@c)').asInvalid();
    itParses('invert($c)').withContext({
      '$c': asColor('hsv($h, $s, $v)')
    }).asInvalid();
    itParses('invert(@c)').withContext({
      '@c': asColor('#9e3f3f')
    }).asColor(97, 192, 192);
    itParses('invert(@a)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f')
    }).asColor(97, 192, 192);
    itParses('adjust-hue(#811, 45deg)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45deg)').asColor(136, 17, 106);
    itParses('adjust-hue(#811, 45%)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45%)').asColor(136, 17, 106);
    itParses('adjust-hue(#811, 45)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45)').asColor(136, 17, 106);
    itParses('adjust-hue($c, $r)').asInvalid();
    itParses('adjust-hue($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('adjust-hue($c, $r)').withContext({
      '$c': asColor('#811'),
      '$r': '-45deg'
    }).asColor(136, 17, 106);
    itParses('adjust-hue($a, $r)').withContext({
      '$a': asColor('rgba($c, 0.5)'),
      '$c': asColor('#811'),
      '$r': '-45deg'
    }).asColor(136, 17, 106, 0.5);
    itParses('mix(rgb(255,0,0), blue)').asColor(127, 0, 127);
    itParses('mix(red, rgb(0,0,255), 25%)').asColor(63, 0, 191);
    itParses('mix(#ff0000, 0x0000ff)').asColor('#7f007f');
    itParses('mix(#ff0000, 0x0000ff, 25%)').asColor('#3f00bf');
    itParses('mix(red, rgb(0,0,255), 25)').asColor(63, 0, 191);
    itParses('mix($a, $b, $r)').asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('hsv($h, $s, $v)'),
      '$b': asColor('blue'),
      '$r': '25%'
    }).asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('blue'),
      '$b': asColor('hsv($h, $s, $v)'),
      '$r': '25%'
    }).asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('red'),
      '$b': asColor('blue'),
      '$r': '25%'
    }).asColor(63, 0, 191);
    itParses('mix($c, $d, $r)').withContext({
      '$a': asColor('red'),
      '$b': asColor('blue'),
      '$c': asColor('rgba($a, 1)'),
      '$d': asColor('rgba($b, 1)'),
      '$r': '25%'
    }).asColor(63, 0, 191);
    describe('stylus and less', function() {
      beforeEach(function() {
        return this.scope = 'styl';
      });
      itParses('tint(#fd0cc7,66%)').asColor(254, 172, 235);
      itParses('tint(#fd0cc7,66)').asColor(254, 172, 235);
      itParses('tint($c,$r)').asInvalid();
      itParses('tint($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('tint($c,$r)').withContext({
        '$c': asColor('#fd0cc7'),
        '$r': '66%'
      }).asColor(254, 172, 235);
      itParses('tint($c,$r)').withContext({
        '$a': asColor('#fd0cc7'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '66%'
      }).asColor(254, 172, 235, 0.966);
      itParses('shade(#fd0cc7,66%)').asColor(86, 4, 67);
      itParses('shade(#fd0cc7,66)').asColor(86, 4, 67);
      itParses('shade($c,$r)').asInvalid();
      itParses('shade($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('shade($c,$r)').withContext({
        '$c': asColor('#fd0cc7'),
        '$r': '66%'
      }).asColor(86, 4, 67);
      return itParses('shade($c,$r)').withContext({
        '$a': asColor('#fd0cc7'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '66%'
      }).asColor(86, 4, 67, 0.966);
    });
    describe('scss and sass', function() {
      beforeEach(function() {
        return this.scope = 'sass';
      });
      itParses('tint(#BADA55, 42%)').asColor('#e2efb7');
      itParses('tint(#BADA55, 42)').asColor('#e2efb7');
      itParses('tint($c,$r)').asInvalid();
      itParses('tint($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('tint($c,$r)').withContext({
        '$c': asColor('#BADA55'),
        '$r': '42%'
      }).asColor('#e2efb7');
      itParses('tint($c,$r)').withContext({
        '$a': asColor('#BADA55'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '42%'
      }).asColor(226, 239, 183, 0.942);
      itParses('shade(#663399, 42%)').asColor('#2a1540');
      itParses('shade(#663399, 42)').asColor('#2a1540');
      itParses('shade($c,$r)').asInvalid();
      itParses('shade($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('shade($c,$r)').withContext({
        '$c': asColor('#663399'),
        '$r': '42%'
      }).asColor('#2a1540');
      return itParses('shade($c,$r)').withContext({
        '$a': asColor('#663399'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '42%'
      }).asColor(0x2a, 0x15, 0x40, 0.942);
    });
    itParses('color(#fd0cc7 tint(66%))').asColor(254, 172, 236);
    itParses('color(var(--foo) tint(66%))').withContext({
      'var(--foo)': asColor('#fd0cc7')
    }).asColor(254, 172, 236);
    itParses('adjust-color(#102030, $red: -5, $blue: 5)', 11, 32, 53);
    itParses('adjust-color(hsl(25, 100%, 80%), $lightness: -30%, $alpha: -0.4)', 255, 106, 0, 0.6);
    itParses('adjust-color($c, $red: $a, $blue: $b)').asInvalid();
    itParses('adjust-color($d, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$d': asColor('rgba($c, 1)')
    }).asInvalid();
    itParses('adjust-color($c, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$c': asColor('#102030')
    }).asColor(11, 32, 53);
    itParses('adjust-color($d, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$c': asColor('#102030'),
      '$d': asColor('rgba($c, 1)')
    }).asColor(11, 32, 53);
    itParses('scale-color(rgb(200, 150, 170), $green: -40%, $blue: 70%)').asColor(200, 90, 230);
    itParses('change-color(rgb(200, 150, 170), $green: 40, $blue: 70)').asColor(200, 40, 70);
    itParses('scale-color($c, $green: $a, $blue: $b)').asInvalid();
    itParses('scale-color($d, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$d': asColor('rgba($c, 1)')
    }).asInvalid();
    itParses('scale-color($c, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$c': asColor('rgb(200, 150, 170)')
    }).asColor(200, 90, 230);
    itParses('scale-color($d, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$c': asColor('rgb(200, 150, 170)'),
      '$d': asColor('rgba($c, 1)')
    }).asColor(200, 90, 230);
    itParses('spin(#F00, 120)').asColor(0, 255, 0);
    itParses('spin(#F00, 120)').asColor(0, 255, 0);
    itParses('spin(#F00, 120deg)').asColor(0, 255, 0);
    itParses('spin(#F00, -120)').asColor(0, 0, 255);
    itParses('spin(#F00, -120deg)').asColor(0, 0, 255);
    itParses('spin(@c, @a)').withContext({
      '@c': asColor('#F00'),
      '@a': '120'
    }).asColor(0, 255, 0);
    itParses('spin(@c, @a)').withContext({
      '@a': '120'
    }).asInvalid();
    itParses('spin(@c, @a)').withContext({
      '@a': '120'
    }).asInvalid();
    itParses('spin(@c, @a,)').asUndefined();
    itParses('fade(#F00, 0.5)').asColor(255, 0, 0, 0.5);
    itParses('fade(#F00, 50%)').asColor(255, 0, 0, 0.5);
    itParses('fade(#F00, 50)').asColor(255, 0, 0, 0.5);
    itParses('fade(@c, @a)').withContext({
      '@c': asColor('#F00'),
      '@a': '0.5'
    }).asColor(255, 0, 0, 0.5);
    itParses('fade(@c, @a)').withContext({
      '@a': '0.5'
    }).asInvalid();
    itParses('fade(@c, @a)').withContext({
      '@a': '0.5'
    }).asInvalid();
    itParses('fade(@c, @a,)').asUndefined();
    itParses('contrast(#bbbbbb)').asColor(0, 0, 0);
    itParses('contrast(#333333)').asColor(255, 255, 255);
    itParses('contrast(#bbbbbb, rgb(20,20,20))').asColor(20, 20, 20);
    itParses('contrast(#333333, rgb(20,20,20), rgb(140,140,140))').asColor(140, 140, 140);
    itParses('contrast(#666666, rgb(20,20,20), rgb(140,140,140), 13%)').asColor(140, 140, 140);
    itParses('contrast(@base)').withContext({
      '@base': asColor('#bbbbbb')
    }).asColor(0, 0, 0);
    itParses('contrast(@base)').withContext({
      '@base': asColor('#333333')
    }).asColor(255, 255, 255);
    itParses('contrast(@base, @dark)').withContext({
      '@base': asColor('#bbbbbb'),
      '@dark': asColor('rgb(20,20,20)')
    }).asColor(20, 20, 20);
    itParses('contrast(@base, @dark, @light)').withContext({
      '@base': asColor('#333333'),
      '@dark': asColor('rgb(20,20,20)'),
      '@light': asColor('rgb(140,140,140)')
    }).asColor(140, 140, 140);
    itParses('contrast(@base, @dark, @light, @threshold)').withContext({
      '@base': asColor('#666666'),
      '@dark': asColor('rgb(20,20,20)'),
      '@light': asColor('rgb(140,140,140)'),
      '@threshold': '13%'
    }).asColor(140, 140, 140);
    itParses('contrast(@base)').asInvalid();
    itParses('contrast(@base)').asInvalid();
    itParses('contrast(@base, @dark)').asInvalid();
    itParses('contrast(@base, @dark, @light)').asInvalid();
    itParses('contrast(@base, @dark, @light, @threshold)').asInvalid();
    itParses('multiply(#ff6600, 0x666666)').asColor('#662900');
    itParses('multiply(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#662900');
    itParses('multiply(@base, @modifier)').asInvalid();
    itParses('screen(#ff6600, 0x666666)').asColor('#ffa366');
    itParses('screen(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ffa366');
    itParses('screen(@base, @modifier)').asInvalid();
    itParses('overlay(#ff6600, 0x666666)').asColor('#ff5200');
    itParses('overlay(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ff5200');
    itParses('overlay(@base, @modifier)').asInvalid();
    itParses('softlight(#ff6600, 0x666666)').asColor('#ff5a00');
    itParses('softlight(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ff5a00');
    itParses('softlight(@base, @modifier)').asInvalid();
    itParses('hardlight(#ff6600, 0x666666)').asColor('#cc5200');
    itParses('hardlight(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#cc5200');
    itParses('hardlight(@base, @modifier)').asInvalid();
    itParses('difference(#ff6600, 0x666666)').asColor('#990066');
    itParses('difference(#ff6600,)()').asInvalid();
    itParses('difference(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#990066');
    itParses('difference(@base, @modifier)').asInvalid();
    itParses('exclusion(#ff6600, 0x666666)').asColor('#997a66');
    itParses('exclusion(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#997a66');
    itParses('exclusion(@base, @modifier)').asInvalid();
    itParses('average(#ff6600, 0x666666)').asColor('#b36633');
    itParses('average(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#b36633');
    itParses('average(@base, @modifier)').asInvalid();
    itParses('negation(#ff6600, 0x666666)').asColor('#99cc66');
    itParses('negation(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#99cc66');
    itParses('negation(@base, @modifier)').asInvalid();
    itParses('blend(rgba(#FFDE00,.42), 0x19C261)').asColor('#7ace38');
    itParses('blend(@top, @bottom)').withContext({
      '@top': asColor('rgba(#FFDE00,.42)'),
      '@bottom': asColor('0x19C261')
    }).asColor('#7ace38');
    itParses('blend(@top, @bottom)').asInvalid();
    itParses('complement(red)').asColor('#00ffff');
    itParses('complement(@base)').withContext({
      '@base': asColor('red')
    }).asColor('#00ffff');
    itParses('complement(@base)').asInvalid();
    itParses('transparentify(#808080)').asColor(0, 0, 0, 0.5);
    itParses('transparentify(#414141, black)').asColor(255, 255, 255, 0.25);
    itParses('transparentify(#91974C, 0xF34949, 0.5)').asColor(47, 229, 79, 0.5);
    itParses('transparentify(a)').withContext({
      'a': asColor('#808080')
    }).asColor(0, 0, 0, 0.5);
    itParses('transparentify(a, b, 0.5)').withContext({
      'a': asColor('#91974C'),
      'b': asColor('#F34949')
    }).asColor(47, 229, 79, 0.5);
    itParses('transparentify(a)').asInvalid();
    itParses('red(#000, 255)').asColor(255, 0, 0);
    itParses('red(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(255, 0, 0);
    itParses('red(a, b)').asInvalid();
    itParses('green(#000, 255)').asColor(0, 255, 0);
    itParses('green(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(0, 255, 0);
    itParses('green(a, b)').asInvalid();
    itParses('blue(#000, 255)').asColor(0, 0, 255);
    itParses('blue(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(0, 0, 255);
    itParses('blue(a, b)').asInvalid();
    itParses('alpha(#000, 0.5)').asColor(0, 0, 0, 0.5);
    itParses('alpha(a, b)').withContext({
      'a': asColor('#000'),
      'b': '0.5'
    }).asColor(0, 0, 0, 0.5);
    itParses('alpha(a, b)').asInvalid();
    itParses('hue(#00c, 90deg)').asColor(0x66, 0xCC, 0);
    itParses('hue(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '90deg'
    }).asColor(0x66, 0xCC, 0);
    itParses('hue(a, b)').asInvalid();
    itParses('saturation(#00c, 50%)').asColor(0x33, 0x33, 0x99);
    itParses('saturation(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '50%'
    }).asColor(0x33, 0x33, 0x99);
    itParses('saturation(a, b)').asInvalid();
    itParses('lightness(#00c, 80%)').asColor(0x99, 0x99, 0xff);
    itParses('lightness(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '80%'
    }).asColor(0x99, 0x99, 0xff);
    itParses('lightness(a, b)').asInvalid();
    describe('lua color', function() {
      beforeEach(function() {
        return this.scope = 'lua';
      });
      itParses('Color(255, 0, 0, 255)').asColor(255, 0, 0);
      itParses('Color(r, g, b, a)').withContext({
        'r': '255',
        'g': '0',
        'b': '0',
        'a': '255'
      }).asColor(255, 0, 0);
      return itParses('Color(r, g, b, a)').asInvalid();
    });
    describe('elm-lang support', function() {
      beforeEach(function() {
        return this.scope = 'elm';
      });
      itParses('rgba 255 0 0 1').asColor(255, 0, 0);
      itParses('rgba r g b a').withContext({
        'r': '255',
        'g': '0',
        'b': '0',
        'a': '1'
      }).asColor(255, 0, 0);
      itParses('rgba r g b a').asInvalid();
      itParses('rgb 255 0 0').asColor(255, 0, 0);
      itParses('rgb r g b').withContext({
        'r': '255',
        'g': '0',
        'b': '0'
      }).asColor(255, 0, 0);
      itParses('rgb r g b').asInvalid();
      itParses('hsla (degrees 200) 50 50 0.5').asColor(64, 149, 191, 0.5);
      itParses('hsla (degrees h) s l a').withContext({
        'h': '200',
        's': '50',
        'l': '50',
        'a': '0.5'
      }).asColor(64, 149, 191, 0.5);
      itParses('hsla (degrees h) s l a').asInvalid();
      itParses('hsla 3.49 50 50 0.5').asColor(64, 149, 191, 0.5);
      itParses('hsla h s l a').withContext({
        'h': '3.49',
        's': '50',
        'l': '50',
        'a': '0.5'
      }).asColor(64, 149, 191, 0.5);
      itParses('hsla h s l a').asInvalid();
      itParses('hsl (degrees 200) 50 50').asColor(64, 149, 191);
      itParses('hsl (degrees h) s l').withContext({
        'h': '200',
        's': '50',
        'l': '50'
      }).asColor(64, 149, 191);
      itParses('hsl (degrees h) s l').asInvalid();
      itParses('hsl 3.49 50 50').asColor(64, 149, 191);
      itParses('hsl h s l').withContext({
        'h': '3.49',
        's': '50',
        'l': '50'
      }).asColor(64, 149, 191);
      itParses('hsl h s l').asInvalid();
      itParses('grayscale 1').asColor(0, 0, 0);
      itParses('greyscale 0.5').asColor(127, 127, 127);
      itParses('grayscale 0').asColor(255, 255, 255);
      itParses('grayscale g').withContext({
        'g': '0.5'
      }).asColor(127, 127, 127);
      itParses('grayscale g').asInvalid();
      itParses('complement rgb 255 0 0').asColor('#00ffff');
      itParses('complement base').withContext({
        'base': asColor('red')
      }).asColor('#00ffff');
      return itParses('complement base').asInvalid();
    });
    return describe('latex support', function() {
      beforeEach(function() {
        return this.scope = 'tex';
      });
      itParses('[gray]{1}').asColor('#ffffff');
      itParses('[rgb]{1,0.5,0}').asColor('#ff7f00');
      itParses('[RGB]{255,127,0}').asColor('#ff7f00');
      itParses('[cmyk]{0,0.5,1,0}').asColor('#ff7f00');
      itParses('[HTML]{ff7f00}').asColor('#ff7f00');
      itParses('{blue}').asColor('#0000ff');
      itParses('{blue!20}').asColor('#ccccff');
      itParses('{blue!20!black}').asColor('#000033');
      return itParses('{blue!20!black!30!green}').asColor('#00590f');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1wYXJzZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0RBQUE7O0FBQUEsRUFBQSxPQUFBLENBQVEsb0JBQVIsQ0FBQSxDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQUZkLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSLENBSGYsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHlCQUFSLENBSmxCLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDBCQUFSLENBTFgsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLG9DQUFBO0FBQUEsSUFBQyxTQUFVLEtBQVgsQ0FBQTtBQUFBLElBRUEsT0FBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO2FBQVksUUFBQSxHQUFRLE1BQXBCO0lBQUEsQ0FGVixDQUFBO0FBQUEsSUFJQSxTQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7QUFDVixNQUFBLE9BQUEsR0FBYyxJQUFBLFlBQUEsbUJBQWEsVUFBVTtBQUFBLFFBQUMsVUFBQSxRQUFEO09BQXZCLENBQWQsQ0FBQTthQUNBLE9BQU8sQ0FBQyxPQUZFO0lBQUEsQ0FKWixDQUFBO0FBQUEsSUFRQSxRQUFBLEdBQVcsU0FBQyxVQUFELEdBQUE7YUFDVDtBQUFBLFFBQUEsV0FBQSxFQUFhLEVBQWI7QUFBQSxRQUNBLE9BQUEsRUFBUyxTQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsR0FBQTtBQUNQLGNBQUEsT0FBQTs7WUFEYyxJQUFFO1dBQ2hCO0FBQUEsVUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/spec/color-parser-spec.coffee

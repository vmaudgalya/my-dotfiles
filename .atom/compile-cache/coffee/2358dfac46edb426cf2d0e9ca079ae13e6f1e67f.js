
/*
Global Logger
 */

(function() {
  module.exports = (function() {
    var Emitter, emitter, levels, stream, winston, writable;
    Emitter = require('event-kit').Emitter;
    emitter = new Emitter();
    winston = require('winston');
    stream = require('stream');
    writable = new stream.Writable();
    writable._write = function(chunk, encoding, next) {
      var msg;
      msg = chunk.toString();
      emitter.emit('logging', msg);
      return next();
    };
    levels = {
      silly: 0,
      input: 1,
      verbose: 2,
      prompt: 3,
      debug: 4,
      info: 5,
      data: 6,
      help: 7,
      warn: 8,
      error: 9
    };
    return function(label) {
      var logger, loggerMethods, method, transport, wlogger, _i, _len;
      transport = new winston.transports.File({
        label: label,
        level: 'debug',
        timestamp: true,
        stream: writable,
        json: false
      });
      wlogger = new winston.Logger({
        transports: [transport]
      });
      wlogger.on('logging', function(transport, level, msg, meta) {
        var d, levelNum, loggerLevel, loggerLevelNum, path, _ref;
        loggerLevel = (_ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify.general.loggerLevel') : void 0) != null ? _ref : "warn";
        loggerLevelNum = levels[loggerLevel];
        levelNum = levels[level];
        if (loggerLevelNum <= levelNum) {
          path = require('path');
          label = "" + (path.dirname(transport.label).split(path.sep).reverse()[0]) + "" + path.sep + (path.basename(transport.label));
          d = new Date();
          return console.log("" + (d.toLocaleDateString()) + " " + (d.toLocaleTimeString()) + " - " + label + " [" + level + "]: " + msg, meta);
        }
      });
      loggerMethods = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];
      logger = {};
      for (_i = 0, _len = loggerMethods.length; _i < _len; _i++) {
        method = loggerMethods[_i];
        logger[method] = wlogger[method];
      }
      logger.onLogging = function(handler) {
        var subscription;
        subscription = emitter.on('logging', handler);
        return subscription;
      };
      return logger;
    };
  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbG9nZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFvQixDQUFBLFNBQUEsR0FBQTtBQUVsQixRQUFBLG1EQUFBO0FBQUEsSUFBQyxVQUFXLE9BQUEsQ0FBUSxXQUFSLEVBQVgsT0FBRCxDQUFBO0FBQUEsSUFDQSxPQUFBLEdBQWMsSUFBQSxPQUFBLENBQUEsQ0FEZCxDQUFBO0FBQUEsSUFJQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FKVixDQUFBO0FBQUEsSUFLQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FMVCxDQUFBO0FBQUEsSUFNQSxRQUFBLEdBQWUsSUFBQSxNQUFNLENBQUMsUUFBUCxDQUFBLENBTmYsQ0FBQTtBQUFBLElBT0EsUUFBUSxDQUFDLE1BQVQsR0FBa0IsU0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixJQUFsQixHQUFBO0FBQ2hCLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBTixDQUFBO0FBQUEsTUFFQSxPQUFPLENBQUMsSUFBUixDQUFhLFNBQWIsRUFBd0IsR0FBeEIsQ0FGQSxDQUFBO2FBR0EsSUFBQSxDQUFBLEVBSmdCO0lBQUEsQ0FQbEIsQ0FBQTtBQUFBLElBYUEsTUFBQSxHQUFTO0FBQUEsTUFDUCxLQUFBLEVBQU8sQ0FEQTtBQUFBLE1BRVAsS0FBQSxFQUFPLENBRkE7QUFBQSxNQUdQLE9BQUEsRUFBUyxDQUhGO0FBQUEsTUFJUCxNQUFBLEVBQVEsQ0FKRDtBQUFBLE1BS1AsS0FBQSxFQUFPLENBTEE7QUFBQSxNQU1QLElBQUEsRUFBTSxDQU5DO0FBQUEs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/atom-beautify/src/logger.coffee

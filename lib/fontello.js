var needle = require('needle');
var fs = require('fs');
var stream = require('stream');
var open = require("open");
var prompt = require('prompt');
var unzip = require('unzip');
var print = require('util').print;
var path = require('path');
var replaceStream = require('replacestream');

var HOST = 'http://fontello.com';
var _sessionId = null;
var _options = {};

// Setup prompt module
prompt.message = '';
prompt.delimiter = '';

// Download currect active session, to call this function, system should have valid _sessionId
var _downloadSession = function() {
  needle.get(HOST + "/" + _sessionId + "/get", function(err) {
    if (err) {
      throw err;
    }
  }).pipe(unzip.Parse()).on('entry', function(entry) {
    var cssPath, dirName, fileName, fontPath, pathName, type, _ref;
    pathName = entry.path;
    type = entry.type;

    if (type === 'File') {
      dirName = (_ref = path.dirname(pathName).match(/\/([^\/]*)$/)) != null ? _ref[1] : void 0;
      fileName = path.basename(pathName);
      switch (dirName) {
        case 'css':
          if (!_options.cssFiles || _options.cssFiles.indexOf(fileName) >= 0) {
            cssPath = path.join(_options.cssPath, fileName);
            entry.pipe(_options.cssFontPath?replaceStream('../font/', _options.cssFontPath):new stream.PassThrough())
              .pipe(fs.createWriteStream(cssPath));

          } else {
            entry.autodrain();
          }
          break;
        case 'font':
          fontPath = path.join(_options.fontPath, fileName);
          entry.pipe(fs.createWriteStream(fontPath));
          break;
        default:
          if (fileName === 'config.json') {
            entry.pipe(fs.createWriteStream(_options.config));
          } else {
            entry.autodrain();
          }
      }

    }
  }).on('finish', function() {
    print('Install complete.\n'.green);
     process.exit(0);
  });

};

// Open new session
var _openSession = function(callback) {
  needle.post(HOST, {
    config: {
      file: _options.config,
      content_type: 'application/json'
    }
  }, {
    multipart: true
  }, function(error, response, body) {
    if (response.statusCode === 200) {
      _sessionId = body;
      //return _downloadSession();
      open(HOST + '/' + body);
      print('This should have open new session for you, please select icons in your browser and hit "Save Session" in top right corner.\n\n'.green);
      prompt.start();

      prompt.get({
        properties: {
          install: {
            description: 'I have hit "Save Session", and ready to install? Press enter > '.red
          }
        }
      }, function(err, result) {
        if (err) {
          throw err;
        }
        _downloadSession();
      });

    } else {
      console.log(body);
    }
  });
};

var _replaceFontPath = function(file, newFontPath) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var result = data.replace(/..\/font\//g, newFontPath);

    fs.writeFile(file, result, 'utf8', function(err) {
      if (err) {
        throw err;
      }
    });
  });
};

var _run = function(options) {

  _options = options || _options;

  if (!_options.config) {
    return print('Please provide config.json path'.red);
  }

  if (!_options.cssPath || !_options.fontPath) {
    return print('Please provide path to font/css folders'.red);
  }

  if (!fs.existsSync(_options.cssPath)) {
    return print(('CSS folder (' + _options.cssPath + ') does not exists, cretaing one').red);
  }
  if (!fs.existsSync(_options.fontPath)) {
    return print(('Font folder (' + _options.fontPath + ') does not exists, cretaing one').red);
  }

  if (fs.existsSync(_options.config)) {
    _openSession();
  } else {
    prompt.get({
      properties: {
        createFile: {
          description: 'Config file does not exists, create one? (Y/N) > '.magenta
        }
      }
    }, function(err, result) {
      if (err) {
        throw err;
      }
      if (result.createFile.toUpperCase() === "Y") {
        fs.writeFile(_options.config, '{"name": "","css_prefix_text": "icon-","css_use_suffix": false,"hinting": true,"units_per_em": 3000,"ascent": 850}', function(err) {
          if (err) {
            throw err;
          }
          _openSession();
        });

      }
    });
  }
};

var fontelloInstaller = {
  run: _run
};

module.exports = fontelloInstaller;

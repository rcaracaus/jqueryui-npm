#!/usr/bin/env node

var fs = require('fs');

fs.readdirSync(__dirname + '/ui').forEach(function(file) {
  if (!/\.js$/.test(file)) return;

  var filename = __dirname + '/ui/' + file;
  var contents = fs.readFileSync(filename, 'utf8');
  var prepend = ["var jQuery = require('jquery');"];

  // parse dependencies in comments
  var deps = contents.match(/\s*\/* Depends:\s*\n(?:[\s\*]*(jquery\.ui\..+\.js)\s*\n)+/);
  if (deps) {
    deps[0].split('\n').slice(1, -1).forEach(function(dep) {
      dep = dep.replace(/[\s\*]/g, '').replace(/^jquery-ui\./, '').replace(/\.js$/, '');
      prepend.push("require('./" + dep + "');");
    });
  }

  // prepend jQuery require and all dependencies for the module
  contents = contents.replace(/^(.|\n)*?\/\*!/, prepend.join('\n') + '\n\n/*!');
  fs.writeFileSync(filename /*__dirname + '/ui/' + file.replace(/jquery\.ui\./, '')*/, contents, 'utf8');
});

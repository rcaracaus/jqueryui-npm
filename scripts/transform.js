#!/usr/bin/env node

var fs = require('fs');

fs.readdirSync(__dirname + '/../ui').forEach(function(file) {
  if (!/\.js$/.test(file)) return;

  var filename = __dirname + '/../ui/' + file;
  var contents = fs.readFileSync(filename, 'utf8');
  var prepends = ["var jQuery = require('jquery');"];

  // parse dependencies from AMD definition
  var defs = contents.match(/define\(\[([^\]]+)\]/);

  if (defs) {
    var deps = defs[1]
      .split('\n')
      // remove clutter
      .map(function(dep) {
        return dep.replace(/[\s,"]/g, '');
      })
      // exluclude empty rows and jquery
      .filter(function(dep) {
        return dep !== '' && dep !== 'jquery';
      }).
      // build require syntax string
      map(function(dep) {
        return 'require("' + dep + '");';
      });

      prepends = prepends.concat(deps);
  }

  // prepends jQuery require and all dependencies for the module
  contents = prepends.join('\n') + '\n\n' + contents;

  fs.writeFileSync(__dirname + '/../' + file.replace(/^jquery[.-]ui\.(.+)\.js/, '$1.js'), contents, 'utf8');
});

var Fs = require('fs');
var version = process.argv[2];

var pkgContent = JSON.parse(Fs.readFileSync('package.json', 'utf8'));
pkgContent.version = version;
Fs.writeFileSync('package.json', JSON.stringify(pkgContent, null, '  '));

var versionContent = Fs.readFileSync('cocos/cocos2d.cpp', 'utf8');
var re = /return\s"(.+)";$/gm;
versionContent = versionContent.replace(re, `return "${version}";`);
Fs.writeFileSync('cocos/cocos2d.cpp', versionContent);
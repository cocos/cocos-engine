'use strict';

const CustomAssetMeta = Editor.metas['custom-asset'];

const Fs = require('fire-fs');
const Path = require('fire-path');
const Url = require('fire-url');

const DOMParser = require('xmldom').DOMParser;
const TMX_ENCODING = { encoding: 'utf-8' };

function searchDependFiles(tmxFile, cb) {
  if (!Fs.existsSync(tmxFile)) {
    return cb(new Error(`${tmxFile} is not found!`));
  }

  var fileContent = Fs.readFileSync(tmxFile, 'utf-8');
  var doc = new DOMParser().parseFromString(fileContent);
  if (!doc) {
    return cb(new Error(`Parse ${tmxFile} failed.`));
  }

  var textures = [];
  var tsxFiles = [];
  function parseTilesetImages(tilesetNode, sourcePath) {
    var images = tilesetNode.getElementsByTagName('image');
    for (var i = 0, n = images.length; i < n ; i++) {
      var imageCfg = images[i].getAttribute('source');
      if (imageCfg) {
        var imgPath = Path.join(Path.dirname(sourcePath), imageCfg);
        textures.push(imgPath);
      }
    }
  }

  var rootElement = doc.documentElement;
  var tilesetElements = rootElement.getElementsByTagName('tileset');
  for (var i = 0, n = tilesetElements.length; i < n; i++) {
    var tileset = tilesetElements[i];
    var sourceTSX = tileset.getAttribute('source');
    if (sourceTSX) {
      var tsxPath = Path.join(Path.dirname(tmxFile), sourceTSX);

      if (Fs.existsSync(tsxPath)) {
        tsxFiles.push(tsxPath);
        var tsxContent = Fs.readFileSync(tsxPath, 'utf-8');
        var tsxDoc = new DOMParser().parseFromString(tsxContent);
        if (tsxDoc) {
          parseTilesetImages(tsxDoc, tsxPath);
        } else {
          Editor.warn('Parse %s failed.', tsxPath);
        }
      }
    }

    // import images
    parseTilesetImages(tileset, tmxFile);
  }

  cb(null, { textures: textures, tsxFiles: tsxFiles });
}

const AssetRootUrl = 'db://assets/';

class TiledMapMeta extends CustomAssetMeta {
  constructor (assetdb) {
    super(assetdb);
    this.textures = [];
    this.tsxFiles = [];
  }

  static version () { return '1.0.2'; }
  static defaultType() { return 'tiled-map'; }

  import (fspath, cb) {
    Fs.readFile(fspath, TMX_ENCODING, (err, data) => {
      if (err) {
        return cb(err);
      }

      var db = this._assetdb;
      var asset = new cc.TiledMapAsset();
      asset.name = Path.basenameNoExt(fspath);
      asset.tmxXmlStr = data;
      asset.tmxFolderPath = Path.relative(AssetRootUrl, Url.dirname(db.fspathToUrl(fspath)));
      asset.tmxFolderPath = asset.tmxFolderPath.replace('\\', '/');

      searchDependFiles(fspath, (err, info) => {
        if (err) {
          return cb(err);
        }

        this.textures = info.textures.map(p => db.fspathToUrl(p));
        this.tsxFiles = info.tsxFiles.map(p => db.fspathToUrl(p));

        asset.textures = this.textures;
        asset.tsxFiles = this.tsxFiles;

        db.saveAssetToLibrary(this.uuid, asset);
        cb();
      });
    });
  }
}

TiledMapMeta.prototype.export = null;

module.exports = TiledMapMeta;

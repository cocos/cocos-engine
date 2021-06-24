/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

'use strict';

const CustomAssetMeta = Editor.metas['custom-asset'];

const Fs = require('fire-fs');
const Path = require('fire-path');
const Url = require('fire-url');

const DOMParser = require('xmldom').DOMParser;
const TMX_ENCODING = { encoding: 'utf-8' };
const Sharp = require(Editor.url('app://editor/share/sharp'));

async function searchDependFiles(tmxFile, tmxFileData, cb) {
  var doc = new DOMParser().parseFromString(tmxFileData);
  if (!doc) {
    return cb(new Error(cc.debug.getError(7222, tmxFile)));
  }

  var imageLayerTextures = [];
  var imageLayerTextureNames = [];
  var textures = [];
  var tsxFiles = [];
  var textureNames = [];
  var textureSizes = [];
  async function parseTilesetImages(tilesetNode, sourcePath) {
    var images = tilesetNode.getElementsByTagName('image');
    for (var i = 0, n = images.length; i < n ; i++) {
      var imageCfg = images[i].getAttribute('source');
      if (imageCfg) {
        var imgPath = Path.join(Path.dirname(sourcePath), imageCfg);
        textures.push(imgPath);

        // Since it is possible to compress the texture at build time, meta file must save the original size of the texture when importing it
        if (Fs.existsSync(imgPath)) {
          let metaData = await Sharp(imgPath).metadata();
          textureSizes.push(cc.size(
              metaData.width,
              metaData.height
          ));
        } else {
          // The image file does not exist
          textureSizes.push(cc.size(0,0));
          Editor.warn("Can not find image file %s", imgPath);
        }

        let textureName = Path.relative(Path.dirname(sourcePath), imgPath);
        textureName = textureName.replace(/\\/g, '\/');
        textureNames.push(textureName);
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
        tsxFiles.push(sourceTSX);
        var tsxContent = Fs.readFileSync(tsxPath, 'utf-8');
        var tsxDoc = new DOMParser().parseFromString(tsxContent);
        if (tsxDoc) {
          await parseTilesetImages(tsxDoc, tsxPath);
        } else {
          Editor.warn('Parse %s failed.', tsxPath);
        }
      }
    }

    // import images
    await parseTilesetImages(tileset, tmxFile);
  }

  var imageLayerElements = rootElement.getElementsByTagName('imagelayer');
  for (var ii = 0, nn = imageLayerElements.length; ii < nn; ii++) {
    var imageLayer = imageLayerElements[ii];
    var imageInfos = imageLayer.getElementsByTagName('image');
    if (imageInfos && imageInfos.length > 0) {
        var imageInfo = imageInfos[0];
        var imageSource = imageInfo.getAttribute('source');
        var imgPath = Path.join(Path.dirname(tmxFile), imageSource);
        if (Fs.existsSync(imgPath)) {
            imageLayerTextures.push(imgPath);
            let imgName = Path.relative(Path.dirname(tmxFile), imgPath);
            imgName = imgName.replace(/\\/g, '\/');
            imageLayerTextureNames.push(imgName);
        } else {
            Editor.warn('Parse %s failed.', imgPath);
        }
    }
  }

  cb(null, { textures, tsxFiles, textureNames, textureSizes, imageLayerTextures, imageLayerTextureNames});
}

const AssetRootUrl = 'db://assets/';

class TiledMapMeta extends CustomAssetMeta {
  constructor (assetdb) {
    super(assetdb);
    this._tmxData = '';
    this._textures = [];
    this._tsxFiles = [];
    this._textureNames = [];
    this._textureSizes = [];
    this._imageLayerTextures = [];
    this._imageLayerTextureNames = [];
  }

  static version () { return '2.0.4'; }
  static defaultType() { return 'tiled-map'; }

  import (fspath, cb) {
    Fs.readFile(fspath, TMX_ENCODING, (err, data) => {
      if (err) {
        return cb(err);
      }

      this._tmxData = data;
      searchDependFiles(fspath, data, (err, info) => {
        if (err) {
          return cb(err);
        }

        this._textures = info.textures;
        this._tsxFiles = info.tsxFiles;
        this._textureNames = info.textureNames;
        this._textureSizes = info.textureSizes;
        this._imageLayerTextures = info.imageLayerTextures;
        this._imageLayerTextureNames = info.imageLayerTextureNames;

        cb();
      });
    });
  }

  postImport ( fspath, cb ) {
    var db = this._assetdb;
    var asset = new cc.TiledMapAsset();
    asset.name = Path.basenameNoExt(fspath);
    asset.tmxXmlStr = this._tmxData;
    asset.textures = this._textures.map(p => {
        var uuid = db.fspathToUuid(p);
        return uuid ? Editor.serialize.asAsset(uuid) : null;
    });
    asset.textureNames = this._textureNames;
    asset.textureSizes = this._textureSizes;

    asset.imageLayerTextures = this._imageLayerTextures.map(p => {
        var uuid = db.fspathToUuid(p);
        return uuid ? Editor.serialize.asAsset(uuid) : null;
    });
    asset.imageLayerTextureNames = this._imageLayerTextureNames;

    asset.tsxFiles = this._tsxFiles.map(p => {
        var tsxPath = Path.join(Path.dirname(fspath), p);
        var uuid = db.fspathToUuid(tsxPath);
        if (uuid) {
            asset.tsxFileNames.push(p);
            return Editor.serialize.asAsset(uuid);
        } else {
            Editor.error(`Can not find file ${tsxPath}`);
            asset.tsxFileNames.push('');
        }
        return null;
    });
    db.saveAssetToLibrary(this.uuid, asset);
    cb();
  }
}

module.exports = TiledMapMeta;

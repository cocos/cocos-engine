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

/*
 * Reference:
 * http://en.esotericsoftware.com/spine-json-format
 */

const Fs = require('fire-fs');
const Path = require('fire-path');
const Spine = require('../lib/spine');

const ATLAS_EXTS = ['.atlas', '.txt', '.atlas.txt', ''];
const SPINE_ENCODING = { encoding: 'utf-8' };

const CustomAssetMeta = Editor.metas['custom-asset'];

function searchAtlas (skeletonPath, callback) {
    skeletonPath = Path.stripExt(skeletonPath);

    function next (index) {
        var suffix = ATLAS_EXTS[index];
        var path = skeletonPath + suffix;
        Fs.exists(path, exists => {
            if (exists) {
                return callback(null, path);
            }
            else if (index + 1 < ATLAS_EXTS.length) {
                next(index + 1);
            }
            else {
                callback(new Error(`Can not find ${skeletonPath + ATLAS_EXTS[0]}`));
            }
        });
    }

    next(0);
}

function loadAtlasText (skeletonPath, callback) {
    searchAtlas(skeletonPath, (err, path) => {
        if (err) {
            return callback(err);
        }
        Fs.readFile(path, SPINE_ENCODING, (err, data) => {
            callback(err, {
                data: data,
                atlasPath: path
            });
        });
    });
}

// A dummy texture loader to record all textures in atlas
class TextureParser {
    constructor (atlasPath) {
        this.atlasPath = atlasPath;
        // array of loaded texture uuid
        this.textures = [];
        // array of corresponding line
        this.textureNames = [];
    }
    load (line) {
        var name = Path.basename(line);
        var base = Path.dirname(this.atlasPath);
        var path = Path.resolve(base, name);
        var uuid = Editor.assetdb.fspathToUuid(path);
        if (uuid) {
            console.log('UUID is initialized for "%s".', path);
            this.textures.push(uuid);
            this.textureNames.push(line);
            var tex = new Spine.Texture({});
            tex.setFilters = function() {};
            tex.setWraps = function() {};
            return tex;
        }
        else if (!Fs.existsSync(path)) {
            Editor.error('Can not find texture "%s" for atlas "%s"', line, this.atlasPath);
        }
        else {
            // AssetDB may call postImport more than once, we can get uuid in the next time.
            console.warn('WARN: UUID not yet initialized for "%s".', path);
        }

        return null;
    }
}

const RAW_SKELETON_FILE = 'raw-skeleton.json';

class SpineMeta extends CustomAssetMeta {
    constructor (assetdb) {
        super(assetdb);
        this.textures = [];
        this.scale = 1;
    }

    // HACK - for inspector
    get texture () {
        //return this.textures[0];
        return Editor.assetdb.uuidToUrl(this.textures[0]);
    }
    set texture (value) {
        this.textures[0] = Editor.assetdb.urlToUuid(value);
        //this.textures[0] = value;
    }

    static version () { return '1.2.2'; }
    static defaultType () {
        return 'spine';
    }

    static validate (assetpath) {
        // TODO - import as a folder named '***.spine'
        var json;
        var text = Fs.readFileSync(assetpath, 'utf8');
        var fastTest = text.slice(0, 30);
        var maybe = ( fastTest.indexOf('slots') > 0 ||
                      fastTest.indexOf('skins') > 0 ||
                      fastTest.indexOf('events') > 0 ||
                      fastTest.indexOf('animations') > 0 ||
                      fastTest.indexOf('bones') > 0 ||
                      fastTest.indexOf('skeleton') > 0 ||
                      fastTest.indexOf('\"ik\"') > 0
                    );
        if (maybe) {
            try {
                json = JSON.parse(text);
            }
            catch (e) {
                return false;
            }
            return Array.isArray(json.bones);
        }
        return false;
    }
    
    postImport (fspath, cb) {
        Fs.readFile(fspath, SPINE_ENCODING, (err, data) => {
            if (err) {
                return cb(err);
            }

            var json;
            try {
                json = JSON.parse(data);
            }
            catch (e) {
                return cb(e);
            }

            var asset = new sp.SkeletonData();
            asset.name = Path.basenameNoExt(fspath);
            asset.skeletonJson = json;
            asset.scale = this.scale;

            loadAtlasText(fspath, (err, res) => {
                if (err) {
                    return cb(err);
                }

                var db = this._assetdb;

                // parse atlas textures
                var textureParser = new TextureParser(res.atlasPath);

                try {
                    new Spine.TextureAtlas(res.data, textureParser.load.bind(textureParser));
                }
                catch (err) {
                    return cb(new Error(`Failed to load atlas file: "${res.atlasPath}". ${err.stack || err}`));
                }

                this.textures = textureParser.textures;
                asset.textures = textureParser.textures.map(Editor.serialize.asAsset);
                asset.textureNames = textureParser.textureNames;
                asset.atlasText = res.data;
                db.saveAssetToLibrary(this.uuid, asset);
                cb();
            });
        });
    }
}

module.exports = SpineMeta;

/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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

const Fs = require('fire-fs');
const Path = require('fire-path');
const DRAGONBONES_ENCODING = { encoding: 'utf-8' };
const CustomAssetMeta = Editor.metas['custom-asset'];
const RAW_DRAGONBONES_FILE = 'raw-dragonbones.json';

class DragonBonesMeta extends CustomAssetMeta {
    constructor (assetdb) {
        super(assetdb);
        this.dragonBonesJson = '';
    }

    static version () { return '1.0.1'; }
    static defaultType () {
        return 'dragonbones';
    }

    static validate (assetpath) {
        var json;
        var text = Fs.readFileSync(assetpath, 'utf8');
        try {
            json = JSON.parse(text);
        }
        catch (e) {
            return false;
        }

        return Array.isArray(json.armature);
    }

    dests () {
        var res = super.dests();
        // for JSB
        res.push(Path.join(this._assetdb._uuidToImportPathNoExt(this.uuid), RAW_DRAGONBONES_FILE));
        return res;
    }

    import (fspath, cb) {
        Fs.readFile(fspath, DRAGONBONES_ENCODING, (err, data) => {
            if (err) {
                return cb(err);
            }

            this.dragonBonesJson = data;

            var asset = new dragonBones.DragonBonesAsset();
            asset.name = Path.basenameNoExt(fspath);
            asset.dragonBonesJson = this.dragonBonesJson;

            // save raw assets for JSB..
            this._assetdb.mkdirForAsset(this.uuid);
            var rawJsonPath = Path.join(this._assetdb._uuidToImportPathNoExt(this.uuid), RAW_DRAGONBONES_FILE);
            Fs.copySync(fspath, rawJsonPath);

            asset._setRawAsset(RAW_DRAGONBONES_FILE);
            this._assetdb.saveAssetToLibrary(this.uuid, asset);
            cb();
        });
    }
}

module.exports = DragonBonesMeta;

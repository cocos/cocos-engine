/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 */
/**
 * @hidden
 */

import {pushToMap} from '../utils/misc';
import {createMap, isChildClassOf} from '../utils/js';
import url from './url';
import { errorID } from '../platform/debug';
import { extname } from '../utils/path';
import { SpriteFrame } from '../assets/sprite-frame';
import { SpriteAtlas } from '../assets/sprite-atlas';
import { DEBUG } from 'internal:constants';

class Entry {
    public uuid: string;
    public type;
    constructor (uuid, type) {
        this.uuid = uuid;
        this.type = type;
    }
}

function isMatchByWord (path, test) {
    if (path.length > test.length) {
        let nextAscii = path.charCodeAt(test.length);
        return (nextAscii === 47); // '/'
    }
    return true;
}

/*
 * @en AssetTable is used to find asset's uuid by url.
 * @zh AssetTable 用于查找资源的 uuid 和 url。
 */
export class AssetTable {
    private _pathToUuid: Map<string, Entry> | Map<string, Array<Entry>>;
    constructor () {
        this._pathToUuid = createMap(true);
    }

    /**
     * Retrieve the asset uuid with the asset path and type
     */
    getUuid (path: string, type: Function) {
        path = url.normalize(path);
        let item = this._pathToUuid[path];
        if (item) {
            if (Array.isArray(item)) {
                if (type) {
                    for (let i = 0; i < item.length; i++) {
                        let entry = item[i];
                        if (isChildClassOf(entry.type, type)) {
                            return entry.uuid;
                        }
                    }
                    // not found
                    if (DEBUG && isChildClassOf(type, SpriteFrame)) {
                        for (let i = 0; i < item.length; i++) {
                            let entry = item[i];
                            if (isChildClassOf(entry.type, SpriteAtlas)) {
                                // not support sprite frame in atlas
                                errorID(4932, path);
                                break;
                            }
                        }
                    }
                }
                else {
                    return item[0].uuid;
                }
            }
            else if (!type || isChildClassOf(item.type, type)) {
                return item.uuid;
            }
            else if (DEBUG && isChildClassOf(type, SpriteFrame) && isChildClassOf(item.type, SpriteAtlas)) {
                // not support sprite frame in atlas
                errorID(4932, path);
            }
        }
        return '';
    }

    /**
     * Retrieve an uuid array with the asset path and type
     */
    getUuidArray (path: string, type: Function, out_urls: string[]) {
        path = url.normalize(path);
        if (path[path.length - 1] === '/') {
            path = path.slice(0, -1);
        }
        let path2uuid = this._pathToUuid;
        let uuids: Array<string> = [];
        let _foundAtlasUrl;
        for (let p in path2uuid) {
            if ((p.startsWith(path) && isMatchByWord(p, path)) || !path) {
                let item = path2uuid[p];
                if (Array.isArray(item)) {
                    for (let i = 0; i < item.length; i++) {
                        let entry = item[i];
                        if (!type || isChildClassOf(entry.type, type)) {
                            uuids.push(entry.uuid);
                            if (out_urls) {
                                out_urls.push(p);
                            }
                        }
                        else if (DEBUG && entry.type === SpriteAtlas) {
                            _foundAtlasUrl = p;
                        }
                    }
                }
                else {
                    if (!type || isChildClassOf(item.type, type)) {
                        uuids.push(item.uuid);
                        if (out_urls) {
                            out_urls.push(p);
                        }
                    }
                    else if (DEBUG && item.type === SpriteAtlas) {
                        _foundAtlasUrl = p;
                    }
                }
            }
        }
        if (DEBUG && uuids.length === 0 && _foundAtlasUrl && isChildClassOf(type, SpriteFrame)) {
            // not support sprite frame in atlas
            errorID(4932, _foundAtlasUrl);
        }
        return uuids;
    }

    // /**
    //  * @en Returns all asset paths in the table.
    //  * @zh 返回表中的所有资源路径。
    //  * @method getAllPaths
    //  * @return {string[]}
    //  */
    // getAllPaths () {
    //     return Object.keys(this._pathToUuid);
    // }

    /**
     * @en Add an asset entry with path as key and asset uuid & type as value to the table
     * @zh 以路径为 key，uuid 和资源类型为值添加到表中。
     * @param path - the path of the asset, should NOT include filename extensions.
     * @param uuid - The uuid of the asset
     * @param type - Constructor of the asset
     * @param isMainAsset
     * @private
     */
    add (path: string, uuid: string, type: Function, isMainAsset: boolean) {
        // remove extname
        // (can not use path.slice because length of extname maybe 0)
        isMainAsset && (path = path.substring(0, path.length - extname(path).length));
        let newEntry = new Entry(uuid, type);
        pushToMap(this._pathToUuid, path, newEntry, isMainAsset);
    }

    _getInfo_DEBUG (uuid, out_info) {
        let path2uuid = this._pathToUuid;
        let paths = Object.keys(path2uuid);
        for (let p = 0; p < paths.length; ++p) {
            let path = paths[p];
            let item = path2uuid[path];
            if (Array.isArray(item)) {
                for (let i = 0; i < item.length; i++) {
                    let entry = item[i];
                    if (entry.uuid === uuid) {
                        out_info.path = path;
                        out_info.type = entry.type;
                        return true;
                    }
                }
            }
            else if (item.uuid === uuid) {
                out_info.path = path;
                out_info.type = item.type;
                return true;
            }
        }
        return false;
    }

    reset () {
        this._pathToUuid = createMap(true);
    }
}

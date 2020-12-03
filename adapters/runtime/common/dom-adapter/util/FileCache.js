let md5 = require("../lib/md5.min");

let fileMgr = jsb.getFileSystemManager();
let cacheDir = jsb.env.USER_DATA_PATH + "/fileCache/";

class FileCache {
    constructor() {
        this._caches = {};
    }

    getCache(data) {
        let key = FileCache._genDataKey(data);
        if (key in this._caches) {
            return this._caches[key];
        } else {
            return "";
        }
    }
    /**
     * 设置缓存
     * @param path {String} 路径
     * @param data {ArrayBuffer} 数据
     */
    setCache(path, data) {
        let key = FileCache._genDataKey(data);
        this._caches[key] = path;
    }

    /**
     * 设置新项，通过数据转换成key，如果key存在对应项，不做任何处理，否则判断路径，如果路径存在则储存项（key-path）,否则通过写数据生成path再储存项（key-path）
     * @param {*} data 数据
     * @param {*} [path] 本地路径
     * @param {*} [key] 本地路径
     * @param {Function} [callBack] 回调函数
     */
    setItem(data, path, key, callBack) {
        key = key || FileCache._genDataKey(data);
        let caches = this._caches;
        if (key in caches) {
            callBack && callBack(caches[key]);
            return;
        }
        if (!path) {
            path = cacheDir + key;
            fileMgr.writeFile({
                filePath: path,
                data: data,
                encoding: "binary",
                success() {
                    caches[key] = path;
                    callBack && callBack(path);
                },
                fail() {
                    callBack && callBack();
                    throw path + "writeFile fail!";
                }
            });
        }
    }

    /**
     * 获取数据路径，如果存在数据路径则返回路径，否则进行设置项来生成路径再返回路径
     * @param {*} data 数据
     * @param {Function} callBack 回调函数
     */
    getPath(data, callBack) {
        let key = FileCache._genDataKey(data);
        let caches = this._caches;

        if (key in caches) {
            callBack(caches[key]);
        } else {
            this.setItem(data, undefined, key, callBack);
        }
    }

    /**
     * 获取key
     * @param {*} data 数据
     */
    static _genDataKey(data) {
        let view = new DataView(data);
        let length = view.byteLength / 4;
        let count = 10;
        let space = length / count;

        let key = "length:" + length;
        key += "first:" + view.getInt32(0);
        key += "last:" + view.getInt32(length - 1);
        while (count--) {
            key += count + ":" + view.getInt32(Math.floor(space * count));
        }

        return md5(key);
    }
}

// 清除临时文件
try {
    fileMgr.accessSync(cacheDir);
    fileMgr.rmdirSync(cacheDir, true);
} catch (e) {
}
fileMgr.mkdirSync(cacheDir, true);

export default new FileCache();
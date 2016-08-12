
function parseDepends (key, parsed) {
    var item = cc.loader.getItem(key);
    if (item) {
        var depends = item.dependKeys;
        if (depends) {
            for (var i = 0; i < depends.length; i++) {
                var depend = depends[i];
                if ( !parsed[depend] ) {
                    parsed[depend] = true;
                    parseDepends(depend, parsed);
                }
            }
        }
    }
}

function release (loader, key, nextSceneAssets) {
    if (!nextSceneAssets || nextSceneAssets.indexOf(key) === -1) {
        var item = loader.getItem(key);
        if (item) {
            loader.removeItem(key);
            console.log('auto release: ' + key);
            // TODO: Audio
            var asset = item.content;
            if (asset instanceof cc.Texture2D) {
                cc.textureCache.removeTextureForKey(item.url);
            }
            //else if (asset instanceof cc.SpriteFrame) {
            //    // for the "Temporary solution" in deserialize.js
            //    console.log('release sprite frame: ' + key);
            //    if (CC_JSB) {
            //        asset.release();
            //    }
            //}
        }
    }
}

module.exports = {

    // get asset url or uuid
    getKey: function (loader, assetOrUrl) {
        if (assetOrUrl) {
            if (typeof assetOrUrl === 'string') {
                return assetOrUrl;
            }
            else if (assetOrUrl instanceof cc.Asset) {
                return assetOrUrl._uuid;
            }
            else if (assetOrUrl instanceof cc.Texture2D) {
                return assetOrUrl.url;
            }
            else if (assetOrUrl instanceof cc.Audio) {
                return assetOrUrl.src;
            }
            else if (CC_DEV) {
                cc.warn('unknown asset type');
            }
        }
        return '';
    },

    // do auto release
    autoRelease: function (loader, oldSceneAssets, nextSceneAssets) {
        var releaseSettings = loader._autoReleaseSetting;
        var i, key;

        // remove ununsed scene assets
        if (oldSceneAssets) {
            for (i = 0; i < oldSceneAssets.length; i++) {
                key = oldSceneAssets[i];
                if (releaseSettings[key] !== false) {
                    release(loader, key, nextSceneAssets);
                }
            }
        }

        // remove auto release assets
        var keys = Object.keys(releaseSettings);
        // releasing asset will change _autoReleaseSetting, so don't use enumerator
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            if (releaseSettings[key] === true) {
                release(loader, key, nextSceneAssets);
            }
        }
    },

    // get dependencies not including self
    getDependsRecursively: function (key) {
        var depends = {};
        parseDepends(key, depends);
        return Object.keys(depends);
    }
};

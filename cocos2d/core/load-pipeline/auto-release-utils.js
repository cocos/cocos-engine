
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
            var removed = loader.removeItem(key);
            //console.log('auto release: ' + key);
            // TODO: Audio
            var asset = item.content;
            if (asset instanceof cc.Texture2D) {
                cc.textureCache.removeTextureForKey(item.url);
            }
            else if (CC_JSB && asset instanceof cc.SpriteFrame && removed) {
                // for the "Temporary solution" in deserialize.js
                asset.release();
            }
        }
    }
}

module.exports = {

    // get asset url or uuid
    getKey: function (loader, assetOrUrlOrUuid) {
        if (assetOrUrlOrUuid) {
            if (typeof assetOrUrlOrUuid === 'string') {
                // try to convert uuid to url
                var item = cc.loader.getItem(assetOrUrlOrUuid);
                return (item && item.url) || assetOrUrlOrUuid;
            }
            else if (assetOrUrlOrUuid instanceof cc.Asset) {
                return assetOrUrlOrUuid._uuid;
            }
            else if (assetOrUrlOrUuid instanceof cc.Texture2D) {
                return assetOrUrlOrUuid.url;
            }
            else if (!CC_JSB && cc.Audio && assetOrUrlOrUuid instanceof cc.Audio) {
                return assetOrUrlOrUuid.src;
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


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
        loader.release(key);
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
            else if (assetOrUrlOrUuid._uuid) {
                return assetOrUrlOrUuid._uuid;
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


// mount point of actual urls for raw asset (only used in editor)
var _mounts = {};

/**
 * @class url
 * @static
 */
cc.url = {

    /**
     * The base url of raw assets.
     * @property {Object} _rawAssets
     * @private
     * @readOnly
     */
    _rawAssets: '',

    /**
     * The base url of builtin raw assets.
     * @property {Object} _builtinRawAssets
     * @private
     * @readOnly
     */
    _builtinRawAssets: '',

    /**
     * Returns the url of raw assets.
     * @method raw
     * @param {String} url
     * @return {String}
     * @example {@link utils/api/engine/docs/cocos2d/core/platform/url/raw.js}
     */
    raw: function (url) {
        if (!this._rawAssets && CC_EDITOR) {
            cc.error('Failed to init asset\'s raw path.');
            return '';
        }

        // normalize
        if (url[0] === '.' && url[1] === '/') {
            url = url.slice(2);
        }
        else if (url[0] === '/') {
            url = url.slice(1);
        }

        return this._rawAssets + url;
    },

    /**
     * Returns the url of builtin raw assets.
     * @method builtinRaw
     * @param {String} url
     * @return {String}
     * @example {@link utils/api/engine/docs/cocos2d/core/platform/url/builtinRaw.js}
     */
    builtinRaw: function (url) {
        if (!this._rawAssets && CC_EDITOR) {
            cc.error('Failed to init builtin asset\'s raw path.');
            return '';
        }

        // normalize
        if (url[0] === '.' && url[1] === '/') {
            url = url.slice(2);
        }
        else if (url[0] === '/') {
            url = url.slice(1);
        }

        return this._builtinRawAssets + url;
    },

    _init: function (mountPaths) {
        for (var dir in mountPaths) {
            var path = mountPaths[dir];
            path = cc.path._setEndWithSep(path, '/');
            _mounts[dir] = path;
        }

        this._rawAssets = _mounts.assets;
        this._builtinRawAssets = _mounts.internal;
    }
};

module.exports = cc.url;

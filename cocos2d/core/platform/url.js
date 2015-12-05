/**
 * @class url
 * @static
 */
cc.url = {

    /**
     * The base url of raw assets.
     * @property _rawAssets
     * @readOnly
     */
    _rawAssets: '',

    /**
     * Returns the url of raw assets.
     * @method raw
     * @param {String} url
     * @return {String}
     * @example {@link utils/api/cocos/docs/cocos2d/core/platform/url/raw.js}
     */
    raw: function (url) {
        if (url[0] === '.' && url[1] === '/') {
            url = url.slice(2);
        }
        else if (url[0] === '/') {
            url = url.slice(1);
        }
        return this._rawAssets + url;
    }
};

module.exports = cc.url;

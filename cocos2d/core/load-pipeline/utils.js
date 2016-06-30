var _noCacheRex = /\?/;

module.exports = {
    //isUrlCrossOrigin: function (url) {
    //    if (!url) {
    //        cc.log('invalid URL');
    //        return false;
    //    }
    //    var startIndex = url.indexOf('://');
    //    if (startIndex === -1)
    //        return false;
    //
    //    var endIndex = url.indexOf('/', startIndex + 3);
    //    var urlOrigin = (endIndex === -1) ? url : url.substring(0, endIndex);
    //    return urlOrigin !== location.origin;
    //},
    urlAppendTimestamp: function (url) {
        if (cc.game.config['noCache'] && typeof url === 'string') {
            if(_noCacheRex.test(url))
                url += '&_t=' + (new Date() - 0);
            else
                url += '?_t=' + (new Date() - 0);
        }
        return url;
    }
};

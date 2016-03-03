
module.exports = {
    setFontToNode: function(fontAsset, node) {
        if (fontAsset) {
            var config = {type:'font', name: fontAsset.fontFamily, id:fontAsset.url, srcs:[fontAsset.url]};
            cc.loader.load(config, function (err, result) {
                if (err) throw err;

                node.fontName = config.name;
            });
        }
        else {
            node.fontName = 'Arial';
        }
    }
};

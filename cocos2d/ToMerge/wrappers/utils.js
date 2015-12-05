
module.exports = {
    setFontToNode: function(fontAsset, node) {
        if (fontAsset) {
            var config = {type:'font', name: fontAsset.fontFamily, srcs:[fontAsset.url]};
            cc.loader.load(config, function (err, results) {
                if (err) throw err;

                node.fontName = config.name;
            });
        }
        else {
            node.fontName = 'Arial';
        }
    }
};

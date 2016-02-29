
var NodeWrapper = require('./node');

var TiledMapWrapper = cc.Class({
    name: 'cc.TiledMapWrapper',
    extends: NodeWrapper,

    properties: {

        file_: {
            get: function () {
                return this.targetN._file || '';
            },
            set: function (value) {
                if ( !value ) {
                    cc.error('The new file must not be null');
                    return;
                }

                // first remove all layers
                var layers = target.allLayers();
                layers.forEach( function (layer) {
                    target.removeChild(layer);
                });

                TiledMapWrapper.preloadTmx( value , function (err, textures) {
                    if (err) {
                        throw err;
                        return;
                    }

                    this._textures = textures;
                    target._file = value;
                    target.initWithTMXFile( value );
                }.bind(this) );
            },
            url: cc.TiledMapAsset,
            displayName: 'File'
        },

        childrenN: {
            get: function () {
                var children = this.targetN.children.filter( function (child) {
                    return !(child instanceof _ccsg.TMXLayer);
                });
                return children;
            },
        },

        _textures: {
            default: [],
            url: [cc.Texture2D]
        },

        file: {
            default: '',
            url: cc.TiledMapAsset,
            visible: false
        }
    },

    statics: {
        preloadTmx: function (file, cb) {
            cc.loader.load(file, function (err) {
                if (err) {
                    if (cb) cb(err);
                    return;
                }

                var mapInfo = new cc.TMXMapInfo(file);
                var sets = mapInfo.getTilesets();

                if (sets) {
                    var textures = sets.map(function (set) {
                        return set.sourceImage;
                    });

                    cc.loader.load(textures, function (err) {
                        cb(err, textures);
                    });
                }
                else {
                    if (cb) cb();
                }
            });
        }
    },

    onBeforeSerialize: function () {
        this.file = this.file_;
    },

    createNode: function (node) {
        node = node || new cc.TMXTiledMap( this.file );
        node._file = this.file;

        NodeWrapper.prototype.createNode.call(this, node);

        return node;
    }
});

cc.TiledMapWrapper = module.exports = TiledMapWrapper;

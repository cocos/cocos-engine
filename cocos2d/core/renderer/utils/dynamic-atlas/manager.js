const Atlas = require('./atlas');

let _atlases = [];
let _atlasIndex = -1;

let _maxAtlasCount = 5;
let _textureSize = 2048;
let _maxFrameSize = 512;

function newAtlas () {
    let atlas = new Atlas(_textureSize, _textureSize);
    _atlases.push(atlas);
    _atlasIndex++;
    return atlas;
}


let dynamicAtlasManager = {
    enabled: true,

    get maxAtlasCount () {
        return _maxAtlasCount;
    },
    set maxAtlasCount (value) {
        _maxAtlasCount = value;
    },

    get textureSize () {
        return _textureSize;
    },
    set textureSize (value) {
        _textureSize = value;
    },

    get maxFrameSize () {
        return _maxFrameSize;
    },
    set maxFrameSize (value) {
        _maxFrameSize = value;
    },

    insertSpriteFrame (spriteFrame) {
        if (!this.enabled || _atlasIndex === _maxAtlasCount ||
            !spriteFrame || spriteFrame._oriInfo) return;
        
        let rect = spriteFrame._rect;
        if (rect.width > _maxFrameSize || rect.height > _maxFrameSize) {
            return;
        }

        let atlas = _atlases[_atlasIndex];
        if (!atlas) {
            atlas = newAtlas();
        }

        if (!atlas.insertSpriteFrame(spriteFrame) && _atlasIndex !== _maxAtlasCount) {
            atlas = newAtlas();
            atlas.insertSpriteFrame(spriteFrame);
        }
    },

    releaseAll () {
        for (let i = 0, l = _atlases.length; i < l; i++) {
            _atlases[i].destroy();
        }
        _atlases.length = 0;
    }
};

module.exports = cc.dynamicAtlasManager = dynamicAtlasManager;
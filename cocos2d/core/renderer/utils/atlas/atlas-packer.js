const Atlas = require('./atlas');

let _atlases = [];
let _atlasIndex = -1;

let _textureWidth = 2048;
let _textureHeight = 2048;

let _maxFrameWidth = 512;
let _maxFrameHeight = 512;

module.exports = {
    insertSpriteFrame (spriteFrame) {
        if (!spriteFrame || spriteFrame._oriInfo) return;

        let rect = spriteFrame._rect;
        if (rect.width > _maxFrameWidth || rect.height > _maxFrameHeight) {
            return;
        }

        let atlas = _atlases[_atlasIndex];
        if (!atlas) {
            atlas = new Atlas(_textureWidth, _textureHeight);
            _atlases.push(atlas);
            _atlasIndex++;
        }

        if (!atlas.insertSpriteFrame(spriteFrame)) {
            atlas = new Atlas(_textureWidth, _textureHeight);
            _atlases.push(atlas);
            _atlasIndex++;
            atlas.insertSpriteFrame(spriteFrame);
        }
    }
};

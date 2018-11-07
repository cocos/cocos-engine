const dynamicAtlasManager = require('../../../utils/dynamic-atlas/manager');

module.exports = {
    packToDynamicAtlas (sprite) {
        let frame = sprite._spriteFrame;
        
        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        if (frame) {
            if (!frame._original && dynamicAtlasManager) {
                dynamicAtlasManager.insertSpriteFrame(frame);
            }
            if (sprite.sharedMaterials[0].getProperty('texture') !== frame._texture) {
                sprite._activateMaterial();
            }
        }
    }
}
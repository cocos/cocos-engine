const dynamicAtlasManager = require('./dynamic-atlas/manager');

module.exports = {
    packToDynamicAtlas (comp, frame) {
        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        if (frame && !CC_TEST) {
            if (!frame._original && dynamicAtlasManager) {
                let packedFrame = dynamicAtlasManager.insertSpriteFrame(frame);
                if (packedFrame) {
                    frame._setDynamicAtlasFrame(packedFrame);
                }
            }
            if (comp.sharedMaterials[0].getProperty('texture') !== frame._texture) {
                comp._activateMaterial(true);
            }
        }
    }, 

    deleteFromDynamicAtlas (comp, frame) {
        if (frame && !CC_TEST) {
            if (frame._original && dynamicAtlasManager) {
                dynamicAtlasManager.deleteAtlasTexture(frame);
                frame._resetDynamicAtlasFrame();
            }
        }
    }
}
const dynamicAtlasManager = require('./dynamic-atlas/manager');
const ttf = require('./label/ttf');
const bmfont = require('./label/bmfont');

module.exports = cc.assemblers.utils = {
    ttf,
    bmfont,

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
            let material = comp.sharedMaterials[0];
            if (!material) return;
            
            if (material.getProperty('texture') !== frame._texture) {
                comp._activateMaterial();
            }

            if (CC_JSB && CC_NATIVERENDERER) {
                comp._renderHandle.updateMaterial(0, material);
            }
        }
    }
}
import { builtinResMgr } from "../../cocos/asset/asset-manager";
import { Material } from "../../cocos/asset/assets/material";
import { color } from "../../cocos/core";
import { game, Game } from "../../cocos/game";

export function initBuiltinMaterial () {
    const materialsToBeCompiled: any[] = [];

    // material indicating missing effect (yellow)
    const missingEfxMtl = new Material();
    missingEfxMtl._uuid = 'missing-effect-material';
    missingEfxMtl.initialize({
        effectName: 'builtin-unlit',
        defines: { USE_COLOR: true },
    });
    missingEfxMtl.setProperty('mainColor', color('#ffff00'));
    builtinResMgr.addAsset(missingEfxMtl._uuid, missingEfxMtl);
    materialsToBeCompiled.push(missingEfxMtl);

    // material indicating missing material (purple)
    const missingMtl = new Material();
    missingMtl._uuid = 'missing-material';
    missingMtl.initialize({
        effectName: 'builtin-unlit',
        defines: { USE_COLOR: true },
    });
    missingMtl.setProperty('mainColor', color('#ff00ff'));
    builtinResMgr.addAsset(missingMtl._uuid, missingMtl);
    materialsToBeCompiled.push(missingMtl);

    const clearStencilMtl = new Material();
    clearStencilMtl._uuid = 'default-clear-stencil';
    clearStencilMtl.initialize({
        defines: { USE_TEXTURE: false },
        effectName: 'builtin-clear-stencil',
    });
    builtinResMgr.addAsset(clearStencilMtl._uuid, clearStencilMtl);
    materialsToBeCompiled.push(clearStencilMtl);

    // sprite material
    const spriteMtl = new Material();
    spriteMtl._uuid = 'ui-base-material';
    spriteMtl.initialize({
        defines: { USE_TEXTURE: false },
        effectName: 'builtin-sprite',
    });
    builtinResMgr.addAsset(spriteMtl._uuid, spriteMtl);
    materialsToBeCompiled.push(spriteMtl);

    // sprite material
    const spriteColorMtl = new Material();
    spriteColorMtl._uuid = 'ui-sprite-material';
    spriteColorMtl.initialize({
        defines: { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: false, IS_GRAY: false },
        effectName: 'builtin-sprite',
    });
    builtinResMgr.addAsset(spriteColorMtl._uuid, spriteColorMtl);
    materialsToBeCompiled.push(spriteColorMtl);

    // sprite alpha test material
    const alphaTestMaskMtl = new Material();
    alphaTestMaskMtl._uuid = 'ui-alpha-test-material';
    alphaTestMaskMtl.initialize({
        defines: { USE_TEXTURE: true, USE_ALPHA_TEST: true, CC_USE_EMBEDDED_ALPHA: false, IS_GRAY: false },
        effectName: 'builtin-sprite',
    });
    builtinResMgr.addAsset(alphaTestMaskMtl._uuid, alphaTestMaskMtl);
    materialsToBeCompiled.push(alphaTestMaskMtl);

    // sprite gray material
    const spriteGrayMtl = new Material();
    spriteGrayMtl._uuid = 'ui-sprite-gray-material';
    spriteGrayMtl.initialize({
        defines: { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: false, IS_GRAY: true },
        effectName: 'builtin-sprite',
    });
    builtinResMgr.addAsset(spriteGrayMtl._uuid, spriteGrayMtl);
    materialsToBeCompiled.push(spriteGrayMtl);

    // sprite alpha material
    const spriteAlphaMtl = new Material();
    spriteAlphaMtl._uuid = 'ui-sprite-alpha-sep-material';
    spriteAlphaMtl.initialize({
        defines: { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: true, IS_GRAY: false },
        effectName: 'builtin-sprite',
    });
    builtinResMgr.addAsset(spriteAlphaMtl._uuid, spriteAlphaMtl);
    materialsToBeCompiled.push(spriteAlphaMtl);

    // sprite alpha & gray material
    const spriteAlphaGrayMtl = new Material();
    spriteAlphaGrayMtl._uuid = 'ui-sprite-gray-alpha-sep-material';
    spriteAlphaGrayMtl.initialize({
        defines: { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: true, IS_GRAY: true },
        effectName: 'builtin-sprite',
    });
    builtinResMgr.addAsset(spriteAlphaGrayMtl._uuid, spriteAlphaGrayMtl);
    materialsToBeCompiled.push(spriteAlphaGrayMtl);

    // ui graphics material
    const defaultGraphicsMtl = new Material();
    defaultGraphicsMtl._uuid = 'ui-graphics-material';
    defaultGraphicsMtl.initialize({ effectName: 'builtin-graphics' });
    builtinResMgr.addAsset(defaultGraphicsMtl._uuid, defaultGraphicsMtl);
    materialsToBeCompiled.push(defaultGraphicsMtl);

    // default particle material
    const defaultParticleMtl = new Material();
    defaultParticleMtl._uuid = 'default-particle-material';
    defaultParticleMtl.initialize({ effectName: 'builtin-particle' });
    builtinResMgr.addAsset(defaultParticleMtl._uuid, defaultParticleMtl);
    materialsToBeCompiled.push(defaultParticleMtl);

    // default particle gpu material
    const defaultParticleGPUMtl = new Material();
    defaultParticleGPUMtl._uuid = 'default-particle-gpu-material';
    defaultParticleGPUMtl.initialize({ effectName: 'builtin-particle-gpu' });
    builtinResMgr.addAsset(defaultParticleGPUMtl._uuid, defaultParticleGPUMtl);
    materialsToBeCompiled.push(defaultParticleGPUMtl);

    // default particle material
    const defaultTrailMtl = new Material();
    defaultTrailMtl._uuid = 'default-trail-material';
    defaultTrailMtl.initialize({ effectName: 'builtin-particle-trail' });
    builtinResMgr.addAsset(defaultTrailMtl._uuid, defaultTrailMtl);
    materialsToBeCompiled.push(defaultTrailMtl);

    // default particle material
    const defaultBillboardMtl = new Material();
    defaultBillboardMtl._uuid = 'default-billboard-material';
    defaultBillboardMtl.initialize({ effectName: 'builtin-billboard' });
    builtinResMgr.addAsset(defaultBillboardMtl._uuid, defaultBillboardMtl);
    materialsToBeCompiled.push(defaultBillboardMtl);

    // ui spine two color material
    const spineTwoColorMtl = new Material();
    spineTwoColorMtl._uuid = 'default-spine-material';
    spineTwoColorMtl.initialize({
        defines: {
            USE_TEXTURE: true,
            CC_USE_EMBEDDED_ALPHA: false,
            IS_GRAY: false,
        },
        effectName: 'builtin-spine',
    });
    builtinResMgr.addAsset(spineTwoColorMtl._uuid, spineTwoColorMtl);
    materialsToBeCompiled.push(spineTwoColorMtl);

    game.on(Game.EVENT_GAME_INITED, () => {
        for (let i = 0; i < materialsToBeCompiled.length; ++i) {
            const mat = materialsToBeCompiled[i];
            for (let j = 0; j < mat.passes.length; ++j) {
                mat.passes[j].tryCompile();
            }
        }
    });
}
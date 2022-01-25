/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { TEST } from 'internal:constants';
import { Asset } from '../assets/asset';
import { ImageAsset, ImageSource } from '../assets/image-asset';
import { SpriteFrame } from '../../2d/assets/sprite-frame';
import { Texture2D } from '../assets/texture-2d';
import { TextureCube } from '../assets/texture-cube';
import { Device } from '../gfx';
import { effects } from './effects';
import { legacyCC } from '../global-exports';
import { getDeviceShaderVersion } from '../renderer/core/program-lib';
import shaderSourceAssembly from './shader-source-assembly';

class BuiltinResMgr {
    protected _device: Device | null = null;
    protected _resources: Record<string, Asset> = {};

    // this should be called after renderer initialized
    public initBuiltinRes (device: Device): Promise<void> {
        this._device = device;
        const resources = this._resources;

        const len = 2;
        const numChannels = 4;

        const blackValueView   = new Uint8Array(len * len * numChannels);
        const emptyValueView   = new Uint8Array(len * len * numChannels);
        const greyValueView    = new Uint8Array(len * len * numChannels);
        const whiteValueView   = new Uint8Array(len * len * numChannels);
        const normalValueView  = new Uint8Array(len * len * numChannels);

        let offset = 0;
        for (let i = 0; i < len * len; i++) {
            blackValueView[offset]     = 0;
            blackValueView[offset + 1] = 0;
            blackValueView[offset + 2] = 0;
            blackValueView[offset + 3] = 255;

            emptyValueView[offset]     = 0;
            emptyValueView[offset + 1] = 0;
            emptyValueView[offset + 2] = 0;
            emptyValueView[offset + 3] = 0;

            greyValueView[offset]     = 119;
            greyValueView[offset + 1] = 119;
            greyValueView[offset + 2] = 119;
            greyValueView[offset + 3] = 255;

            whiteValueView[offset]     = 255;
            whiteValueView[offset + 1] = 255;
            whiteValueView[offset + 2] = 255;
            whiteValueView[offset + 3] = 255;

            normalValueView[offset]     = 127;
            normalValueView[offset + 1] = 127;
            normalValueView[offset + 2] = 255;
            normalValueView[offset + 3] = 255;

            offset += numChannels;
        }

        const defaultSize = 16;
        const halfDefaultSize = defaultSize / 2;
        const defaultValueView = new Uint8Array(defaultSize * defaultSize * numChannels);

        offset = 0;
        for (let i = 0; i < defaultSize * defaultSize; i++) {
            defaultValueView[offset]     = 221;
            defaultValueView[offset + 1] = 221;
            defaultValueView[offset + 2] = 221;
            defaultValueView[offset + 3] = 255;

            offset += numChannels;
        }
        offset = 0;
        for (let i = 0; i < halfDefaultSize; i++) {
            for (let j = 0; j < halfDefaultSize; j++) {
                defaultValueView[offset]     = 85;
                defaultValueView[offset + 1] = 85;
                defaultValueView[offset + 2] = 85;
                defaultValueView[offset + 3] = 255;

                offset += numChannels;
            }
            offset += halfDefaultSize * numChannels;
        }
        offset += halfDefaultSize * numChannels;
        for (let i = 0; i < halfDefaultSize; i++) {
            for (let j = 0; j < halfDefaultSize; j++) {
                defaultValueView[offset]     = 85;
                defaultValueView[offset + 1] = 85;
                defaultValueView[offset + 2] = 85;
                defaultValueView[offset + 3] = 255;

                offset += numChannels;
            }
            offset += halfDefaultSize * numChannels;
        }

        const blackMemImageSource: ImageSource = {
            width: len,
            height: len,
            _data: blackValueView,
            _compressed: false,
            format: Texture2D.PixelFormat.RGBA8888,
        };

        const emptyMemImageSource: ImageSource = {
            width: len,
            height: len,
            _data: emptyValueView,
            _compressed: false,
            format: Texture2D.PixelFormat.RGBA8888,
        };

        const greyMemImageSource: ImageSource = {
            width: len,
            height: len,
            _data: greyValueView,
            _compressed: false,
            format: Texture2D.PixelFormat.RGBA8888,
        };

        const whiteMemImageSource: ImageSource = {
            width: len,
            height: len,
            _data: whiteValueView,
            _compressed: false,
            format: Texture2D.PixelFormat.RGBA8888,
        };

        const normalMemImageSource: ImageSource = {
            width: len,
            height: len,
            _data: normalValueView,
            _compressed: false,
            format: Texture2D.PixelFormat.RGBA8888,
        };

        const defaultMemImageSource: ImageSource = {
            width: defaultSize,
            height: defaultSize,
            _data: defaultValueView,
            _compressed: false,
            format: Texture2D.PixelFormat.RGBA8888,
        };

        // ============================
        // builtin textures
        // ============================

        // black texture
        const imgAsset = new ImageAsset(blackMemImageSource);
        const blackTexture = new Texture2D();
        blackTexture._uuid = 'black-texture';
        blackTexture.image = imgAsset;
        resources[blackTexture._uuid] = blackTexture;

        // empty texture
        const emptyImgAsset = new ImageAsset(emptyMemImageSource);
        const emptyTexture = new Texture2D();
        emptyTexture._uuid = 'empty-texture';
        emptyTexture.image = emptyImgAsset;
        resources[emptyTexture._uuid] = emptyTexture;

        // black texture
        const blackCubeTexture = new TextureCube();
        blackCubeTexture._uuid = 'black-cube-texture';
        blackCubeTexture.setMipFilter(TextureCube.Filter.NEAREST);
        blackCubeTexture.image = {
            front: new ImageAsset(blackMemImageSource),
            back: new ImageAsset(blackMemImageSource),
            left: new ImageAsset(blackMemImageSource),
            right: new ImageAsset(blackMemImageSource),
            top: new ImageAsset(blackMemImageSource),
            bottom: new ImageAsset(blackMemImageSource),
        };
        resources[blackCubeTexture._uuid] = blackCubeTexture;

        // grey texture
        const greyImgAsset = new ImageAsset(greyMemImageSource);
        const greyTexture = new Texture2D();
        greyTexture._uuid = 'grey-texture';
        greyTexture.image = greyImgAsset;
        resources[greyTexture._uuid] = greyTexture;

        // white texture
        const whiteImgAsset = new ImageAsset(whiteMemImageSource);
        const whiteTexture = new Texture2D();
        whiteTexture._uuid = 'white-texture';
        whiteTexture.image = whiteImgAsset;
        resources[whiteTexture._uuid] = whiteTexture;

        // white cube texture
        const whiteCubeTexture = new TextureCube();
        whiteCubeTexture._uuid = 'white-cube-texture';
        whiteCubeTexture.setMipFilter(TextureCube.Filter.NEAREST);
        whiteCubeTexture.image = {
            front: new ImageAsset(whiteMemImageSource),
            back: new ImageAsset(whiteMemImageSource),
            left: new ImageAsset(whiteMemImageSource),
            right: new ImageAsset(whiteMemImageSource),
            top: new ImageAsset(whiteMemImageSource),
            bottom: new ImageAsset(whiteMemImageSource),
        };
        resources[whiteCubeTexture._uuid] = whiteCubeTexture;

        // normal texture
        const normalImgAsset = new ImageAsset(normalMemImageSource);
        const normalTexture = new Texture2D();
        normalTexture._uuid = 'normal-texture';
        normalTexture.image = normalImgAsset;
        resources[normalTexture._uuid] = normalTexture;

        // default texture
        const defaultImgAsset = new ImageAsset(defaultMemImageSource);
        const defaultTexture = new Texture2D();
        defaultTexture._uuid = 'default-texture';
        defaultTexture.image = defaultImgAsset;
        resources[defaultTexture._uuid] = defaultTexture;

        // default cube texture
        const defaultCubeTexture = new TextureCube();
        defaultCubeTexture.setMipFilter(TextureCube.Filter.NEAREST);
        defaultCubeTexture._uuid = 'default-cube-texture';
        defaultCubeTexture.image = {
            front: new ImageAsset(defaultMemImageSource),
            back: new ImageAsset(defaultMemImageSource),
            left: new ImageAsset(defaultMemImageSource),
            right: new ImageAsset(defaultMemImageSource),
            top: new ImageAsset(defaultMemImageSource),
            bottom: new ImageAsset(defaultMemImageSource),
        };
        resources[defaultCubeTexture._uuid] = defaultCubeTexture;

        if (legacyCC.SpriteFrame) {
            const spriteFrame = new legacyCC.SpriteFrame() as SpriteFrame;
            const image = imgAsset;
            const texture = new Texture2D();
            texture.image = image;
            spriteFrame.texture = texture;
            spriteFrame._uuid = 'default-spriteframe';
            resources[spriteFrame._uuid] = spriteFrame;
        }

        const shaderVersionKey = getDeviceShaderVersion(device);
        if (!shaderVersionKey) {
            return Promise.reject(Error('Failed to initialize builtin shaders: unknown device.'));
        }

        const shaderSources = shaderSourceAssembly[shaderVersionKey];
        if (!shaderSources) {
            return Promise.reject(Error(
                `Current device is requiring builtin shaders of version ${shaderVersionKey} `
                + `but shaders of that version are not assembled in this build.`,
            ));
        }

        return Promise.resolve().then(() => {
            effects.forEach((e, effectIndex) => {
                const effect = Object.assign(new legacyCC.EffectAsset(), e);
                effect.shaders.forEach((shaderInfo, shaderIndex) => {
                    const shaderSource = shaderSources[effectIndex][shaderIndex];
                    if (shaderSource) {
                        shaderInfo[shaderVersionKey] = shaderSource;
                    }
                });
                effect.hideInEditor = true;
                effect.onLoaded();
            });
            this._initMaterials();
        });
    }

    public get<T extends Asset> (uuid: string) {
        return this._resources[uuid] as T;
    }

    private _initMaterials () {
        const resources = this._resources;
        const materialsToBeCompiled: any[] = [];

        // standard material
        const standardMtl = new legacyCC.Material();
        standardMtl._uuid = 'standard-material';
        standardMtl.initialize({
            effectName: 'standard',
        });
        resources[standardMtl._uuid] = standardMtl;
        materialsToBeCompiled.push(standardMtl);

        // material indicating missing effect (yellow)
        const missingEfxMtl = new legacyCC.Material();
        missingEfxMtl._uuid = 'missing-effect-material';
        missingEfxMtl.initialize({
            effectName: 'unlit',
            defines: { USE_COLOR: true },
        });
        missingEfxMtl.setProperty('mainColor', legacyCC.color('#ffff00'));
        resources[missingEfxMtl._uuid] = missingEfxMtl;
        materialsToBeCompiled.push(missingEfxMtl);

        // material indicating missing material (purple)
        const missingMtl = new legacyCC.Material();
        missingMtl._uuid = 'missing-material';
        missingMtl.initialize({
            effectName: 'unlit',
            defines: { USE_COLOR: true },
        });
        missingMtl.setProperty('mainColor', legacyCC.color('#ff00ff'));
        resources[missingMtl._uuid] = missingMtl;
        materialsToBeCompiled.push(missingMtl);

        const clearStencilMtl = new legacyCC.Material();
        clearStencilMtl._uuid = 'default-clear-stencil';
        clearStencilMtl.initialize({
            defines: { USE_TEXTURE: false },
            effectName: 'clear-stencil',
        });
        resources[clearStencilMtl._uuid] = clearStencilMtl;
        materialsToBeCompiled.push(clearStencilMtl);

        // sprite material
        const spriteMtl = new legacyCC.Material();
        spriteMtl._uuid = 'ui-base-material';
        spriteMtl.initialize({
            defines: { USE_TEXTURE: false },
            effectName: 'sprite',
        });
        resources[spriteMtl._uuid] = spriteMtl;
        materialsToBeCompiled.push(spriteMtl);

        // sprite material
        const spriteColorMtl = new legacyCC.Material();
        spriteColorMtl._uuid = 'ui-sprite-material';
        spriteColorMtl.initialize({
            defines: { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: false, IS_GRAY: false },
            effectName: 'sprite',
        });
        resources[spriteColorMtl._uuid] = spriteColorMtl;
        materialsToBeCompiled.push(spriteColorMtl);

        // sprite alpha test material
        const alphaTestMaskMtl = new legacyCC.Material();
        alphaTestMaskMtl._uuid = 'ui-alpha-test-material';
        alphaTestMaskMtl.initialize({
            defines: { USE_TEXTURE: true, USE_ALPHA_TEST: true, CC_USE_EMBEDDED_ALPHA: false, IS_GRAY: false },
            effectName: 'sprite',
        });
        resources[alphaTestMaskMtl._uuid] = alphaTestMaskMtl;
        materialsToBeCompiled.push(alphaTestMaskMtl);

        // sprite gray material
        const spriteGrayMtl = new legacyCC.Material();
        spriteGrayMtl._uuid = 'ui-sprite-gray-material';
        spriteGrayMtl.initialize({
            defines: { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: false, IS_GRAY: true },
            effectName: 'sprite',
        });
        resources[spriteGrayMtl._uuid] = spriteGrayMtl;
        materialsToBeCompiled.push(spriteGrayMtl);

        // sprite alpha material
        const spriteAlphaMtl = new legacyCC.Material();
        spriteAlphaMtl._uuid = 'ui-sprite-alpha-sep-material';
        spriteAlphaMtl.initialize({
            defines: { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: true, IS_GRAY: false },
            effectName: 'sprite',
        });
        resources[spriteAlphaMtl._uuid] = spriteAlphaMtl;
        materialsToBeCompiled.push(spriteAlphaMtl);

        // sprite alpha & gray material
        const spriteAlphaGrayMtl = new legacyCC.Material();
        spriteAlphaGrayMtl._uuid = 'ui-sprite-gray-alpha-sep-material';
        spriteAlphaGrayMtl.initialize({
            defines: { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: true, IS_GRAY: true },
            effectName: 'sprite',
        });
        resources[spriteAlphaGrayMtl._uuid] = spriteAlphaGrayMtl;
        materialsToBeCompiled.push(spriteAlphaGrayMtl);

        // ui graphics material
        const defaultGraphicsMtl = new legacyCC.Material();
        defaultGraphicsMtl._uuid = 'ui-graphics-material';
        defaultGraphicsMtl.initialize({ effectName: 'graphics' });
        resources[defaultGraphicsMtl._uuid] = defaultGraphicsMtl;
        materialsToBeCompiled.push(defaultGraphicsMtl);

        // default particle material
        const defaultParticleMtl = new legacyCC.Material();
        defaultParticleMtl._uuid = 'default-particle-material';
        defaultParticleMtl.initialize({ effectName: 'particle' });
        resources[defaultParticleMtl._uuid] = defaultParticleMtl;
        materialsToBeCompiled.push(defaultParticleMtl);

        // default particle gpu material
        if (!TEST) {
            const defaultParticleGPUMtl = new legacyCC.Material();
            defaultParticleGPUMtl._uuid = 'default-particle-gpu-material';
            defaultParticleGPUMtl.initialize({ effectName: 'particle-gpu' });
            resources[defaultParticleGPUMtl._uuid] = defaultParticleGPUMtl;
            materialsToBeCompiled.push(defaultParticleGPUMtl);
        }

        // default particle material
        const defaultTrailMtl = new legacyCC.Material();
        defaultTrailMtl._uuid = 'default-trail-material';
        defaultTrailMtl.initialize({ effectName: 'particle-trail' });
        resources[defaultTrailMtl._uuid] = defaultTrailMtl;
        materialsToBeCompiled.push(defaultTrailMtl);

        // default particle material
        const defaultBillboardMtl = new legacyCC.Material();
        defaultBillboardMtl._uuid = 'default-billboard-material';
        defaultBillboardMtl.initialize({ effectName: 'billboard' });
        resources[defaultBillboardMtl._uuid] = defaultBillboardMtl;
        materialsToBeCompiled.push(defaultBillboardMtl);

        // ui spine two color material
        const spineTwoColorMtl = new legacyCC.Material();
        spineTwoColorMtl._uuid = 'default-spine-material';
        spineTwoColorMtl.initialize({
            defines: {
                USE_TEXTURE: true,
                CC_USE_EMBEDDED_ALPHA: false,
                IS_GRAY: false,
            },
            effectName: 'spine',
        });
        resources[spineTwoColorMtl._uuid] = spineTwoColorMtl;
        materialsToBeCompiled.push(spineTwoColorMtl);

        legacyCC.game.on(legacyCC.Game.EVENT_GAME_INITED, () => {
            for (let i = 0; i < materialsToBeCompiled.length; ++i) {
                const mat = materialsToBeCompiled[i];
                for (let j = 0; j < mat.passes.length; ++j) {
                    mat.passes[j].tryCompile();
                }
            }
        });
    }
}

const builtinResMgr = legacyCC.builtinResMgr = new BuiltinResMgr();
export { builtinResMgr };

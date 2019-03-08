import { Asset } from '../../assets/asset';
import { SpriteFrame } from '../../assets/CCSpriteFrame';
import { ImageAsset } from '../../assets/image-asset';
import { Texture2D } from '../../assets/texture-2d';
import { Rect } from '../../core/value-types';
import { GFXDevice } from '../../gfx/device';
import { EffectAsset } from '../assets/effect-asset';
import { TextureCube } from '../assets/texture-cube';
import effects from './effects';

class BuiltinResMgr {
    protected _device: GFXDevice | null = null;
    protected _resources: Record<string, Asset> = {};

    // this should be called after renderer initialized
    public initBuiltinRes (device: GFXDevice) {
        this._device = device;
        const resources = this._resources;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        const imgAsset = new ImageAsset(canvas);
        const l = canvas.width = canvas.height = 2;

        // ============================
        // builtin textures
        // ============================

        // black texture
        context.fillStyle = '#000';
        context.fillRect(0, 0, l, l);
        const blackTexture = new Texture2D();
        blackTexture._uuid = 'black-texture';
        blackTexture.image = imgAsset;
        resources[blackTexture._uuid] = blackTexture;

        // black texture
        const blackCubeTexture = new TextureCube();
        blackCubeTexture._uuid = 'black-cube-texture';
        blackCubeTexture.setGenMipmap(true);
        blackCubeTexture.image = {
            front: new ImageAsset(canvas),
            back: new ImageAsset(canvas),
            left: new ImageAsset(canvas),
            right: new ImageAsset(canvas),
            top: new ImageAsset(canvas),
            bottom: new ImageAsset(canvas),
        };
        resources[blackCubeTexture._uuid] = blackCubeTexture;

        // grey texture
        context.fillStyle = '#777';
        context.fillRect(0, 0, l, l);
        const greyTexture = new Texture2D();
        greyTexture._uuid = 'grey-texture';
        greyTexture.image = imgAsset;
        resources[greyTexture._uuid] = greyTexture;

        // white texture
        context.fillStyle = '#fff';
        context.fillRect(0, 0, l, l);
        const whiteTexture = new Texture2D();
        whiteTexture._uuid = 'white-texture';
        whiteTexture.image = imgAsset;
        resources[whiteTexture._uuid] = whiteTexture;

        // white cube texture
        const whiteCubeTexture = new TextureCube();
        whiteCubeTexture._uuid = 'white-cube-texture';
        whiteCubeTexture.setGenMipmap(true);
        whiteCubeTexture.image = {
            front: new ImageAsset(canvas),
            back: new ImageAsset(canvas),
            left: new ImageAsset(canvas),
            right: new ImageAsset(canvas),
            top: new ImageAsset(canvas),
            bottom: new ImageAsset(canvas),
        };
        resources[whiteCubeTexture._uuid] = whiteCubeTexture;

        // normal texture
        context.fillStyle = '#7f7fff';
        context.fillRect(0, 0, l, l);
        const normalTexture = new Texture2D();
        normalTexture._uuid = 'normal-texture';
        normalTexture.image = imgAsset;
        resources[normalTexture._uuid] = normalTexture;

        // default texture
        canvas.width = canvas.height = 16;
        context.fillStyle = '#ddd';
        context.fillRect(0, 0, 16, 16);
        context.fillStyle = '#555';
        context.fillRect(0, 0, 8, 8);
        context.fillStyle = '#555';
        context.fillRect(8, 8, 8, 8);
        const defaultTexture = new Texture2D();
        defaultTexture._uuid = 'default-texture';
        defaultTexture.image = imgAsset;
        resources[defaultTexture._uuid] = defaultTexture;

        // default cube texture
        const defaultCubeTexture = new TextureCube();
        defaultCubeTexture.setGenMipmap(true);
        defaultCubeTexture._uuid = 'default-cube-texture';
        defaultCubeTexture.image = {
            front: new ImageAsset(canvas),
            back: new ImageAsset(canvas),
            left: new ImageAsset(canvas),
            right: new ImageAsset(canvas),
            top: new ImageAsset(canvas),
            bottom: new ImageAsset(canvas),
        };
        resources[defaultCubeTexture._uuid] = defaultCubeTexture;

        const spriteFrame = new SpriteFrame();
        spriteFrame._uuid = 'default-spriteframe';
        spriteFrame.setOriginalSize(cc.size(imgAsset.width, imgAsset.height));
        spriteFrame.setRect(new Rect(0, 0, imgAsset.width, imgAsset.height));
        spriteFrame.image = imgAsset;
        spriteFrame.onLoaded();
        resources[spriteFrame._uuid] = spriteFrame;

        // builtin effects
        effects.forEach((e: any) => {
            const effect = Object.assign(new EffectAsset(), e);
            effect.onLoaded();
        });

        // tonemap material
        const tonemapMtl = new cc.Material();
        tonemapMtl._uuid = 'tonemap-material';
        tonemapMtl.initialize({
            effectName: 'builtin-tonemap',
        });
        resources[tonemapMtl._uuid] = tonemapMtl;

        // standard material
        const standardMtl = new cc.Material();
        standardMtl._uuid = 'standard-material';
        standardMtl.initialize({
            effectName: 'builtin-standard',
        });
        resources[standardMtl._uuid] = standardMtl;

        // default material
        const defaultMtl = new cc.Material();
        defaultMtl._uuid = 'default-material';
        defaultMtl.initialize({
            effectName: 'builtin-standard',
        });
        resources[defaultMtl._uuid] = defaultMtl;

        // sprite material
        const spriteMtl = new cc.Material();
        spriteMtl._uuid = 'sprite-material';
        spriteMtl.initialize({ effectName: 'builtin-sprite' });
        spriteMtl.setProperty('mainTexture', defaultTexture);
        resources[spriteMtl._uuid] = spriteMtl;

        // default particle material
        const defaultParticleMtl = new cc.Material();
        defaultParticleMtl._uuid = 'default-particle-material';
        defaultParticleMtl.initialize({ effectName: 'builtin-particle' });
        resources[defaultParticleMtl._uuid] = defaultParticleMtl;
    }

    public get<T extends Asset> (uuid: string) {
        return this._resources[uuid] as T;
    }
}

const builtinResMgr = cc.builtinResMgr = new BuiltinResMgr();
export { builtinResMgr };

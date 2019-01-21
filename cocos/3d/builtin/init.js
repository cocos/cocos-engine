import Texture2D from '../../assets/texture-2d';
import TextureCube from '../assets/texture-cube';
import ImageAsset from '../../assets/image-asset';
import { Material } from '../assets/material';
import { EffectAsset } from '../assets/effect-asset';
import effects from './effects';
import { SpriteFrame} from '../../assets/CCSpriteFrame';

let builtinResMgr = {
    // this should be called after renderer initialized
    initBuiltinRes: function (device) {
        builtinResMgr.device = device;
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        // ============================
        // builtin textures
        // ============================

        // default texture canvas fill
        canvas.width = canvas.height = 128;
        context.fillStyle = '#ddd';
        context.fillRect(0, 0, 128, 128);
        context.fillStyle = '#555';
        context.fillRect(0, 0, 64, 64);
        context.fillStyle = '#555';
        context.fillRect(64, 64, 64, 64);

        const canvasImage = new ImageAsset(canvas);

        // default-texture
        let defaultTexture = new Texture2D();
        defaultTexture.setMipFilter(Texture2D.Filter.LINEAR);
        defaultTexture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
        defaultTexture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        defaultTexture._uuid = 'default-texture';
        defaultTexture.image = canvasImage;

        // default-texture-cube
        // let defaultTextureCube = new TextureCube();
        // defaultTextureCube._uuid = 'default-texture-cube';
        // defaultTextureCube.image = {
        //     front: canvasImage,
        //     back: canvasImage,
        //     left: canvasImage,
        //     right: canvasImage,
        //     top: canvasImage,
        //     bottom: canvasImage,
        // };

        // black texture canvas fill
        canvas.width = canvas.height = 2;
        context.fillStyle = '#000';
        context.fillRect(0, 0, 2, 2);

        // black-texture
        let blackTexture = new Texture2D();
        blackTexture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        blackTexture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        blackTexture._uuid = 'black-texture';
        defaultTexture.image = canvasImage;

        // white texture canvas fill
        canvas.width = canvas.height = 2;
        context.fillStyle = '#fff';
        context.fillRect(0, 0, 2, 2);

        // white-texture
        let whiteTexture = new Texture2D();
        blackTexture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        blackTexture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        whiteTexture._uuid = 'white-texture';
        defaultTexture.image = canvasImage;

        let spriteFrame = new SpriteFrame();
        spriteFrame.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        spriteFrame.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        spriteFrame._uuid = 'default-spriteframe';
        spriteFrame.setOriginalSize(cc.size(canvasImage.width, canvasImage.height));
        spriteFrame.setRect(0, 0, canvasImage.width, canvasImage.height);
        spriteFrame.image = canvasImage;
        if (spriteFrame.onLoaded) {
            spriteFrame.onLoaded();
        }

        // essential builtin effects
        let efxs = effects.map(e => {
            let effect = Object.assign(new EffectAsset(), e);
            effect.onLoaded(); return effect;
        });

        // default material
        let defaultMtl = new Material();
        defaultMtl._uuid = 'default-material';
        defaultMtl.setDefines({ USE_COLOR: true });
        defaultMtl.effectName = 'builtin-effect-unlit';
        defaultMtl.setProperty('color', cc.color('#FF00FF'));

        // sprite material
        let spriteMtl = new Material();
        spriteMtl._uuid = 'sprite-material';
        spriteMtl.effectName = 'builtin-effect-sprite';
        defaultMtl.setProperty('mainTexture', defaultTexture);

        let builtins = {
            [defaultTexture._uuid]: defaultTexture,
            // [defaultTextureCube._uuid]: defaultTextureCub
            [blackTexture._uuid]: blackTexture,
            [whiteTexture._uuid]: whiteTexture,
            [spriteMtl._uuid]: spriteMtl,
            [spriteFrame._uuid]:spriteFrame
        };
        return Object.assign(builtinResMgr, builtins);
    },
    initEffects(effectUUIDs, OnComplete) {
        // ============================
        // async builtin effects
        // ============================
        let remainingJobs = effectUUIDs.length;
        for (let i = 0; i < effectUUIDs.length; ++i) {
            let uuid = effectUUIDs[i];
            cc.AssetLibrary.loadAsset(uuid, err => {
                if (err) console.error(err);
                if (!--remainingJobs) OnComplete();
            });
        }
    }
};

cc.BuiltinResMgr = builtinResMgr;
export default builtinResMgr;

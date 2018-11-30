import Texture2D from '../../assets/CCTexture2D';
import TextureCube from '../assets/texture-cube';
import ImageAsset from '../../assets/image-asset';

let builtinResMgr = {
    // this should be called after renderer initialized
    initBuiltinRes: function(device, effectUUIDs, OnComplete) {
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
        let defaultTexture = new Texture2D(device);
        defaultTexture.setMipFilter(Texture2D.Filter.LINEAR);
        defaultTexture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
        defaultTexture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        defaultTexture._uuid = 'default-texture';
        defaultTexture.image = canvasImage;

        // default-texture-cube
        let defaultTextureCube = new TextureCube(device);
        defaultTextureCube._uuid = 'default-texture-cube';
        defaultTextureCube.image = {
            front: canvasImage,
            back: canvasImage,
            left: canvasImage,
            right: canvasImage,
            top: canvasImage,
            bottom: canvasImage,
        };

        // black texture canvas fill
        canvas.width = canvas.height = 2;
        context.fillStyle = '#000';
        context.fillRect(0, 0, 2, 2);

        // black-texture
        let blackTexture = new Texture2D(device);
        blackTexture.setMipmap(false);
        blackTexture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        blackTexture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        blackTexture._uuid = 'black-texture';
        defaultTexture.image = canvasImage;

        // white texture canvas fill
        canvas.width = canvas.height = 2;
        context.fillStyle = '#fff';
        context.fillRect(0, 0, 2, 2);

        // white-texture
        let whiteTexture = new Texture2D(device);
        blackTexture.setMipmap(false);
        blackTexture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        blackTexture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        whiteTexture._uuid = 'white-texture';
        defaultTexture.image = canvasImage;

        let builtins = {
            [defaultTexture._uuid]: defaultTexture,
            [defaultTextureCube._uuid]: defaultTextureCube,
            [blackTexture._uuid]: blackTexture,
            [whiteTexture._uuid]: whiteTexture,
        };

        // ============================
        // async builtin effects
        // ============================

        let remainingJobs = effectUUIDs.length;
        for (let i = 0; i < effectUUIDs.length; ++i) {
            let uuid = effectUUIDs[i];
            cc.AssetLibrary.loadAsset(uuid, (err, asset) => {
                if (err) { console.error(err); return; }
                cc.EffectAsset.register(asset);
                if (!--remainingJobs) OnComplete(builtins);
            });
        }
    },
};

cc._builtinResMgr = builtinResMgr;
export default builtinResMgr;

import Texture2D from '../../assets/CCTexture2D';
import TextureCube from '../assets/texture-cube';
import downloadText from '../../load-pipeline/text-downloader';
import ProgramLib from '../../renderer/core/program-lib';
import EffectAsset from '../assets/effect-asset';
import ImageAsset from '../../assets/image-asset';

let builtinResMgr = {
    // this should be called after renderer initialized
    initBuiltinRes: function (device, effects, shaderDir, onComplete) {
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
            bottom: canvasImage
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
            [whiteTexture._uuid]: whiteTexture
        };

        let remainingJobs = 2;
        // ============================
        // async builtin shaders
        // ============================

        this.loadShaders(shaderDir, (temps, chunks) => {
            builtins['program-lib'] = new ProgramLib(device, temps, chunks);
            if (!--remainingJobs) onComplete(builtins);
        });

        // ============================
        // async builtin effects
        // ============================

        this.loadEffects(effects, effects => {
            Object.assign(builtins, effects);
            if (!--remainingJobs) onComplete(builtins);
        });
    },

    // this can be called anytime
    loadEffects: function (url, onComplete) {
        let effects = {};
        downloadText({ url }, (status, responseText) => {
            let effectJsons = JSON.parse(responseText);
            for (let i = 0; i < effectJsons.length; ++i) {
                let effectJson = effectJsons[i];
                let effect = new EffectAsset();
                effect.setRawJson(effectJson, true);
                effects[effect._uuid] = effect;
            }
            onComplete(effects);
        });
    },

    loadShaders: function (dir, onComplete) {
        let templates, chunks;
        if (/.*[/\\]$/.test(dir)) dir = dir.slice(0, -1);
        downloadText({ url: `${dir}/templates/index.json` }, (status, responseText) => {
            templates = JSON.parse(responseText);
            if (chunks) onComplete(templates, chunks);
        });
        downloadText({ url: `${dir}/chunks/index.json` }, (status, responseText) => {
            chunks = JSON.parse(responseText);
            if (templates) onComplete(templates, chunks);
        });
    }
};

cc._builtinResMgr = builtinResMgr;
export default builtinResMgr;

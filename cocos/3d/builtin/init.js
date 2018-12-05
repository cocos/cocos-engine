import Texture2D from '../../assets/CCTexture2D';
import TextureCube from '../assets/texture-cube';
import ImageAsset from '../../assets/image-asset';
import Material from '../assets/material';
import EffectAsset from '../assets/effect-asset';

let builtinResMgr = {
    // this should be called after renderer initialized
    initBuiltinRes: function(device) {
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

        // classic ugly pink indicating missing material
        let pinkEffect = new EffectAsset();
        pinkEffect.name = 'default';
        pinkEffect.techniques.push({ passes: [{ program: 'default' }] });
        pinkEffect.shaders.push({
            name: 'default',
            vert: `attribute vec3 a_position; \n uniform mat4 model; \n uniform mat4 _viewProj_; \n void main() { gl_Position = _viewProj_ * model * vec4(a_position, 1); }`,
            frag: `void main() { gl_FragColor = vec4(1, 0, 1, 1); }`,
            uniforms: [{ name: "model", type: cc.renderer.PARAM_MAT4, defines: [] }], defines: [], attributes: [], extensions: []
        });
        pinkEffect.onLoaded();
        let defaultMtl = new Material();
        defaultMtl._uuid = 'default-material';
        defaultMtl.effectAsset = pinkEffect;

        let builtins = {
            [defaultTexture._uuid]: defaultTexture,
            [defaultTextureCube._uuid]: defaultTextureCube,
            [blackTexture._uuid]: blackTexture,
            [whiteTexture._uuid]: whiteTexture,
            [defaultMtl._uuid]: defaultMtl
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
            cc.AssetLibrary.loadAsset(uuid, (err, asset) => {
                if (err) { console.error(err); return; }
                cc.EffectAsset.register(asset);
                if (!--remainingJobs) OnComplete(builtinResMgr);
            });
        }
    }
};

cc.BuiltinResMgr = builtinResMgr;
export default builtinResMgr;

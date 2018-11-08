import renderer from '../../renderer';
import * as primitives from '../primitive';

import Mesh from '../assets/mesh';
import Material from '../assets/material';
import Texture2D from '../../assets/CCTexture2D';
import TextureCube from '../assets/texture-cube';
import Effect from '../../renderer/core/effect';
import Sprite from '../assets/sprite';
import { vec3 } from '../../core/vmath';
import downloadText from '../../load-pipeline/text-downloader';

import effectJsons from './effects/index';
import EffectAsset from '../assets/effect-asset';

let builtinResMgr = {

    effects: {},

    // this should be called after renderer initialized
    initBuiltinRes: function (device) {
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

        // default-texture
        let defaultTexture = new Texture2D(device);
        defaultTexture.setMipFilter(Texture2D.Filter.LINEAR);
        defaultTexture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
        defaultTexture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        defaultTexture._uuid = 'default-texture';
        defaultTexture.initWithElement(canvas);

        // default-texture-cube
        let defaultTextureCube = new TextureCube(device);
        defaultTextureCube._uuid = 'default-texture-cube';
        defaultTextureCube.initWithElement(
            [canvas, canvas, canvas, canvas, canvas, canvas]
        );

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
        defaultTexture.initWithElement(canvas);

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
        defaultTexture.initWithElement(canvas);

        // ============================
        // builtin sprites
        // ============================

        // default-sprites
        let defaultSprite = new Sprite();
        defaultSprite.texture = whiteTexture;
        defaultSprite.width = whiteTexture.width;
        defaultSprite.height = whiteTexture.height;
        defaultSprite._uuid = 'default-sprite';
        defaultSprite.commit();

        // ============================
        // builtin meshes
        // ============================

        // builtin-cube
        let cubeMesh = new Mesh();
        cubeMesh._subMeshes = new Array(1);
        let cubeDesc = primitives.box(1, 1, 1, {
            widthSegments: 1,
            heightSegments: 1,
            lengthSegments: 1,
        });
        cubeMesh._subMeshes[0] = renderer.createIA(device, cubeDesc);
        cubeMesh._uuid = 'builtin-cube';
        cubeMesh._loaded = true;
        cubeMesh._minPos = vec3.clone(cubeDesc.minPos);
        cubeMesh._maxPos = vec3.clone(cubeDesc.maxPos);

        // builtin-sphere
        let sphereMesh = new Mesh();
        sphereMesh._subMeshes = new Array(1);
        let sphereDesc = primitives.sphere(0.5, {
            segments: 64,
        });
        sphereMesh._subMeshes[0] = renderer.createIA(device, sphereDesc);
        sphereMesh._uuid = 'builtin-sphere';
        sphereMesh._loaded = true;
        sphereMesh._minPos = vec3.clone(sphereDesc.minPos);
        sphereMesh._maxPos = vec3.clone(sphereDesc.maxPos);

        // builtin-cylinder
        let cylinderMesh = new Mesh();
        cylinderMesh._subMeshes = new Array(1);
        let cylinderDesc = primitives.cylinder(0.5, 0.5, 2, {
            radialSegments: 20,
            capped: true,
        });
        cylinderMesh._subMeshes[0] = renderer.createIA(device, cylinderDesc);
        cylinderMesh._uuid = 'builtin-cylinder';
        cylinderMesh._loaded = true;
        cylinderMesh._minPos = vec3.clone(cylinderDesc.minPos);
        cylinderMesh._maxPos = vec3.clone(cylinderDesc.maxPos);

        // builtin-plane
        let planeMesh = new Mesh();
        planeMesh._subMeshes = new Array(1);
        let planeDesc = primitives.plane(10, 10, {
            uSegments: 10,
            vSegments: 10,
        });
        planeMesh._subMeshes[0] = renderer.createIA(device, planeDesc);
        planeMesh._uuid = 'builtin-plane';
        planeMesh._loaded = true;
        planeMesh._minPos = vec3.clone(planeDesc.minPos);
        planeMesh._maxPos = vec3.clone(planeDesc.maxPos);

        // builtin-capsule
        let capsuleMesh = new Mesh();
        capsuleMesh._subMeshes = new Array(1);
        let capsuleDesc = primitives.capsule(0.5, 0.5, 2, {
            heightSegments: 30,
            sides: 20,
        });
        capsuleMesh._subMeshes[0] = renderer.createIA(device, capsuleDesc);
        capsuleMesh._uuid = 'builtin-capsule';
        capsuleMesh._loaded = true;
        capsuleMesh._minPos = vec3.clone(capsuleDesc.minPos);
        capsuleMesh._maxPos = vec3.clone(capsuleDesc.maxPos);

        // ============================
        // builtin effects
        // ============================

        this.loadBuiltinEffect();
        
        // ============================
        // builtin materials
        // ============================

        let materials = {};
        // [
        //     'sprite',
        //     'font'
        // ].forEach(name => {
        //     let mat = new Material();
        //     mat.effectAsset = effects[`builtin-effect-${name}`];
        //     mat._uuid = `builtin-material-${name}`;
        //     mat._loaded = true;
        //     materials[mat._uuid] = mat;
        // });

        return Object.assign(cc.game._builtins, {
            [defaultTexture._uuid]: defaultTexture,
            [defaultTextureCube._uuid]: defaultTextureCube,
            [blackTexture._uuid]: blackTexture,
            [whiteTexture._uuid]: whiteTexture,
            [defaultSprite._uuid]: defaultSprite,
            [cubeMesh._uuid]: cubeMesh,
            [sphereMesh._uuid]: sphereMesh,
            [cylinderMesh._uuid]: cylinderMesh,
            [planeMesh._uuid]: planeMesh,
            [capsuleMesh._uuid]: capsuleMesh,
        }, materials);
    },

    // this can be called anytime
    loadBuiltinEffect: function (onComplete) {
        if (Object.keys(this.effects).length != 0)
            return;
        // TODO:to be changed to load from file
        // downloadText({ url: "" }, (status, responseText) => {
        //     let effectJsons = JSON.parse(responseText);
            for (let i = 0; i < effectJsons.length; ++i) {
                let effectJson = effectJsons[i];
                let effect = new EffectAsset();
                effect.setRawJson(effectJson, true);
                this.effects[effect._uuid] = effect;
            }
            Object.assign(cc.game._builtins, this.effects);
            if (onComplete) {
                onComplete();
            }
        // });
    }
};

cc._builtinResMgr = builtinResMgr;
export default builtinResMgr;

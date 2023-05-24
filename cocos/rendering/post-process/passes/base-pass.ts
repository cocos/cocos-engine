import { EDITOR } from 'internal:constants';

import { Material } from '../../../asset/assets';
import { Camera } from '../../../render-scene/scene';
import { getCameraUniqueID } from '../../custom/define';
import { BasicPipeline, Pipeline } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';
import { Format } from '../../../gfx';
import { supportsRGBA16FloatTexture } from '../../define';
import { macro } from '../../../core';

let _BasePassID = 0;

export function GetRTFormatBeforeToneMapping (ppl: BasicPipeline) {
    const useFloatOutput = ppl.getMacroBool('CC_USE_FLOAT_OUTPUT');
    return ppl.pipelineSceneData.isHDR && useFloatOutput && supportsRGBA16FloatTexture(ppl.device) ? Format.RGBA16F : Format.RGBA8;
}
export function ForceEnableFloatOutput (ppl: BasicPipeline) {
    if (ppl.pipelineSceneData.isHDR && !ppl.getMacroBool('CC_USE_FLOAT_OUTPUT')) {
        const supportFloatOutput = supportsRGBA16FloatTexture(ppl.device);
        ppl.setMacroBool('CC_USE_FLOAT_OUTPUT', supportFloatOutput);
        macro.ENABLE_FLOAT_OUTPUT = supportFloatOutput;
    }
}

export abstract class BasePass {
    abstract name: string;
    effectName = 'pipeline/post-process/blit-screen';

    _id = 0
    constructor () {
        this._id = _BasePassID++;
    }

    context = passContext;
    getCameraUniqueID = getCameraUniqueID;

    // private _materialMap: Map<Camera, Material> = new Map()

    _material: Material | undefined
    get material () {
        const effectReloaded = false;
        // if (EDITOR && this._material) {
        //     const effect = builtinResMgr.get(this.effectName);
        //     effectReloaded = effect && this._material.effectAsset !== effect;
        // }

        if (!this._material || effectReloaded) {
            const mat = new Material();
            mat._uuid = `${this.name}-${this.effectName}-material`;
            mat.initialize({ effectName: this.effectName });
            this._material = mat;
        }

        let material: Material | undefined;
        // if (EDITOR) {
        //     if (passUtils.camera) {
        //         material = this._materialMap.get(passUtils.camera);
        //         if (!material || material.parent !== this._material) {
        //             material = new MaterialInstance({
        //                 parent: this._material,
        //             });
        //             this._materialMap.set(passUtils.camera, material);
        //         }
        //     }
        // }

        return material || this._material;
    }

    enable = true;
    outputNames: string[] = []

    lastPass: BasePass | undefined;

    slotName (camera: Camera, index = 0) {
        const name = this.outputNames[index] + this.name;
        return `${name}_${this._id}_${getCameraUniqueID(camera)}`;
    }

    enableInAllEditorCamera = false;
    checkEnable (camera: Camera) {
        return this.enable;
    }

    renderProfiler (camera) {
        if (passContext.isFinalCamera && !EDITOR) {
            passContext.pass!.showStatistics = true;
        }
    }

    abstract render (camera: Camera, ppl: Pipeline);
}

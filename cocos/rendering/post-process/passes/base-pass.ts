import { EDITOR } from 'internal:constants';

import { Material } from '../../../asset/assets';
import { Camera } from '../../../render-scene/scene';
import { getCameraUniqueID } from '../../custom/define';
import { BasicPipeline, Pipeline, PipelineRuntime } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';
import { Address, Filter, Format, Sampler, SamplerInfo } from '../../../gfx';
import { supportsRGBA16HalfFloatTexture } from '../../define';
import { cclegacy, macro } from '../../../core';

let _BasePassID = 0;
let _pointSampler: Sampler| null = null;
const _samplerPointInfo = new SamplerInfo(
    Filter.POINT,
    Filter.POINT,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
);

export function getRTFormatBeforeToneMapping (ppl: BasicPipeline): Format {
    const useFloatOutput = ppl.getMacroBool('CC_USE_FLOAT_OUTPUT');
    return ppl.pipelineSceneData.isHDR && useFloatOutput && supportsRGBA16HalfFloatTexture(ppl.device) ? Format.RGBA16F : Format.RGBA8;
}
export function forceEnableFloatOutput (ppl: PipelineRuntime): boolean {
    let enabled = ppl.getMacroBool('CC_USE_FLOAT_OUTPUT');
    if (ppl.pipelineSceneData.isHDR && !enabled) {
        const supportFloatOutput = supportsRGBA16HalfFloatTexture(ppl.device);
        ppl.setMacroBool('CC_USE_FLOAT_OUTPUT', supportFloatOutput);
        macro.ENABLE_FLOAT_OUTPUT = supportFloatOutput;
        enabled = supportFloatOutput;
    }

    return enabled;
}

export function disablePostProcessForDebugView (): boolean {
    const debugView = cclegacy.director.root.debugView;
    return debugView.singleMode as number > 0;
}

export function getShadowMapSampler (): Sampler | undefined {
    if (!_pointSampler) {
        const director = cclegacy.director;
        const pipeline = director.root.pipeline;
        const device = pipeline.device;
        _pointSampler = device.getSampler(_samplerPointInfo);
    }
    return _pointSampler || undefined;
}

export abstract class BasePass {
    abstract name: string;
    effectName = 'pipeline/post-process/blit-screen';

    _id = 0;
    constructor () {
        this._id = _BasePassID++;
    }

    context = passContext;
    getCameraUniqueID = getCameraUniqueID;

    // private _materialMap: Map<Camera, Material> = new Map()

    _material: Material | undefined;
    get material (): Material {
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
    outputNames: string[] = [];

    lastPass: BasePass | undefined;

    slotName (camera: Camera, index = 0): string {
        const name = this.outputNames[index] + this.name;
        return `${name}_${this._id}_${getCameraUniqueID(camera)}`;
    }

    enableInAllEditorCamera = false;
    checkEnable (camera: Camera): boolean {
        return this.enable;
    }

    onGlobalPipelineStateChanged?(): void;

    renderProfiler (camera): void {
        if (passContext.isFinalCamera && !EDITOR) {
            passContext.pass!.showStatistics = true;
        }
    }

    abstract render (camera: Camera, ppl: Pipeline): any;
}

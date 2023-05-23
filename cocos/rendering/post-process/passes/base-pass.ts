import { EDITOR } from 'internal:constants';
import { builtinResMgr } from '../../../asset/asset-manager';

import { Material, RenderTexture } from '../../../asset/assets';
import { director } from '../../../game';
import { Rect } from '../../../gfx';
import { MaterialInstance } from '../../../render-scene';
import { Camera } from '../../../render-scene/scene';
import { getCameraUniqueID, getRenderArea } from '../../custom/define';
import { Pipeline } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';

let _BasePassID = 0;

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

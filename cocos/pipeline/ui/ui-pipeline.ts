import { Root } from '../../core/root';
import { mat4 } from '../../core/vmath';
import { UBOGlobal } from '../define';
import { IRenderPipelineInfo, RenderPipeline } from '../render-pipeline';
import { RenderView } from '../render-view';
import { UIFlow } from './ui-flow';

const _vec4Array = new Float32Array(4);
const _mat4Array = new Float32Array(16);

export class UIPipeline extends RenderPipeline {

    constructor (root: Root) {
        super(root);
    }

    public initialize (info: IRenderPipelineInfo): boolean {

        if (!this.createUBOs()) {
            return false;
        }

        // create flows
        this.createFlow<UIFlow>(UIFlow, {
            name: 'UIFlow',
            priority: 0,
        });

        return true;
    }

    public destroy () {
        this.destroyFlows();
        this.clearRenderPasses();
        this.destroyUBOs();
        this.destroyQuadInputAssembler();
    }

    protected updateUBOs (view: RenderView) {
        const camera = view.camera;
        mat4.array(_mat4Array, camera.matViewProj);
        this._defaultUboGlobal!.view.set(_mat4Array, UBOGlobal.MAT_VIEW_PROJ_OFFSET);

        _vec4Array[0] = camera.exposure;
        _vec4Array[1] = _vec4Array[0] * this._fpScaleInv;
        _vec4Array[2] = 0.0;
        _vec4Array[3] = 1.0 / _vec4Array[1];
        this._defaultUboGlobal!.view.set(_vec4Array, UBOGlobal.EXPOSURE_OFFSET);

        // update ubos
        this._globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!.update(this._defaultUboGlobal!.view.buffer);
    }
}

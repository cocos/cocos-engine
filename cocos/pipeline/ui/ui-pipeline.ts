import { Root } from '../../core/root';
import { RenderPassStage, UBOGlobal } from '../define';
import { RenderPipeline } from '../render-pipeline';
import { RenderView } from '../render-view';
import { UIFlow } from './ui-flow';
import { mat4 } from '../../core/vmath';

const _mat4Array = new Float32Array(16);

export class UIPipeline extends RenderPipeline {

    constructor (root: Root) {
        super(root);
    }

    public initialize (): boolean {

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
        // update ubos
        this._globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!.update(this._defaultUboGlobal!.view.buffer);
    }
}

import { ccclass, executionOrder, menu } from '../../../core/data/class-decorator';
import { RenderPriority } from '../../../pipeline/define';
import { UI } from '../../../renderer/ui/ui';
import { Material } from '../../assets';
import { RenderableComponent } from '../../framework/renderable-component';
import { UIComponent } from './ui-component';

/**
 * @zh
 * UI 模型基础类。
 */
@ccclass('cc.UIModelComponent')
@executionOrder(110)
@menu('UI/Model')
export class UIModelComponent extends UIComponent {

    public get modelComponent () {
        return this._modelComponent;
    }

    private _modelComponent: RenderableComponent | null = null;

    public onLoad () {
        this._modelComponent = this.getComponent(cc.RenderableComponent) as RenderableComponent;
        (this._modelComponent as any)._sceneGetter = cc.director.root.ui.getRenderSceneGetter();
        this._modelComponent.recreateModel();
    }

    public onDestroy () {
        this._modelComponent = this.getComponent(cc.RenderableComponent) as RenderableComponent;
        (this._modelComponent as any)._sceneGetter = null;
        this._modelComponent.recreateModel();
    }

    public updateAssembler (render: UI) {
        if (this._modelComponent) {
            render.commitModel.call(render, this, this._modelComponent._getModel(), this._modelComponent.material);
            return true;
        }

        return false;
    }

    public update () {
        this._fitUIRenderQueue();
    }

    private _fitUIRenderQueue () {
        if (!this._modelComponent) {
            return;
        }
        const matNum = this._modelComponent.sharedMaterials.length;
        for (let i = 0; i < matNum; i++) {
            const material = this._modelComponent.getMaterial(i, CC_EDITOR)! as Material;
            if (material == null) {
                continue;
            }
            const passes = material.passes;
            const ea = material.effectAsset!;
            const techIdx = material.technique;
            const passNum = passes.length;
            let needReconstruct = false;
            for (let j = 0; j < passNum; j++) {
                if (!passes[j].blendState.targets[0].blend) {
                    needReconstruct = true;
                    const bs = passes[j].blendState.targets[0];
                    bs.blend = true;
                    passes[j].overridePipelineStates(ea.techniques[techIdx].passes[j], { blendState: passes[j].blendState });
                }
            }
            if (needReconstruct) {
                // @ts-ignore
                material._onPassesChange();
            }
        }
        for (let i = 0; i < matNum; i++) {
            const material = this._modelComponent.getMaterial(i, CC_EDITOR)!;
            if (material == null) {
                continue;
            }
            const passes = material.passes;
            for (const p of passes as any[]) {
                p._priority = RenderPriority.MAX - 11;
            }
        }
    }
}

cc.UIModelComponent = UIModelComponent;

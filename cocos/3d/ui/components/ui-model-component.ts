import { ccclass, executionOrder, menu } from '../../../core/data/class-decorator';
import { UIRenderComponent } from './ui-render-component';
import { Component } from '../../../components/component';
import { RenderableComponent } from '../../framework/renderable-component';
import { UI } from '../../../renderer/ui/ui';
import { Effect } from '../../../renderer';
import { RenderPriority } from '../../../pipeline/define';
import { UIComponent } from './ui-component';

@ccclass('cc.UIModelComponent')
@executionOrder(100)
@menu('UI/Model')
export class UIModelComponent extends UIComponent {

    private _modelComponent: RenderableComponent | null = null;

    public get modelComponent () {
        return this._modelComponent;
    }

    public onLoad () {
        this._modelComponent = this.getComponent(cc.RenderableComponent) as RenderableComponent;
        (this._modelComponent as any)._sceneGetter = cc.director.root.ui.getRenderSceneGetter();
    }

    public onEnable () {
        this._fitUIRenderQueue();
    }

    private _fitUIRenderQueue () {
        if (!this._modelComponent) {
            return;
        }
        const matNum = this._modelComponent.sharedMaterials.length;
        for (let i = 0; i < matNum; i++) {
            const material = this._modelComponent.getMaterial(i, CC_EDITOR)! as any;
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
                    passes[j].overridePipelineStates(Effect.getPassesInfo(ea, techIdx)[j], { blendState: passes[j].blendState });
                }
            }
            if (needReconstruct) {
                material._onPassesChange();
            }
        }
        for (let i = 0; i < matNum; i++) {
            const passes = this._modelComponent.getMaterial(i, CC_EDITOR)!.passes;
            for (const p of passes as any[]) {
                p._priority = RenderPriority.MAX - 11;
            }
        }
    }

    public updateAssembler (render: UI) {
        if (this._modelComponent) {
            render.commitComp.call(render, this);
            return true;
        }

        return false;
    }

    public update () {
        this._fitUIRenderQueue();
    }
}

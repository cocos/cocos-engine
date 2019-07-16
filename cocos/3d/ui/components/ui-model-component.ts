/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @category ui
 */

import { ccclass, executionOrder, menu } from '../../../core/data/class-decorator';
import { RenderPriority } from '../../../pipeline/define';
import { UI } from '../../../renderer/ui/ui';
import { Material } from '../../assets';
import { RenderableComponent } from '../../framework/renderable-component';
import { UIComponent } from './ui-component';

/**
 * @zh
 * UI 模型基础组件。
 * 可通过 cc.UIModelComponent 获得该组件。
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
        this._modelComponent = this.getComponent('cc.RenderableComponent') as RenderableComponent;
        if (!this._modelComponent){
            console.warn(`Use this component on a node（${this.node && this.node.name}） that has a model component`);
            return;
        }

        this._modelComponent._sceneGetter = cc.director.root.ui.getRenderSceneGetter();
        this._modelComponent.recreateModel();
    }

    public onDestroy () {
        this._modelComponent = this.getComponent('cc.RenderableComponent') as RenderableComponent;
        if (!this._modelComponent){
            return;
        }

        this._modelComponent._sceneGetter = null;
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
            const material = this._modelComponent.getMaterial(i)! as Material;
            if (material == null) {
                continue;
            }
            const passes = material.passes;
            const ea = material.effectAsset!;
            const techIdx = material.technique;
            const passNum = passes.length;
            let needReconstruct = false;
            for (let j = 0; j < passNum; j++) {
                let override = false;
                if (!passes[j].blendState.targets[0].blend) {
                    needReconstruct = true;
                    const bs = passes[j].blendState.targets[0];
                    bs.blend = true;
                    override = true;
                }

                if (passes[j].depthStencilState.depthTest) {
                    needReconstruct = true;
                    passes[j].depthStencilState.depthTest = false;
                    override = true;
                }

                if (override) {
                    passes[j].overridePipelineStates(ea.techniques[techIdx].passes[j], {
                        blendState: passes[j].blendState,
                        depthStencilState: passes[j].depthStencilState,
                    });
                }
            }
            if (needReconstruct) {
                // @ts-ignore
                material._onPassesChange();
            }
        }
        for (let i = 0; i < matNum; i++) {
            const material = this._modelComponent.getMaterial(i);
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

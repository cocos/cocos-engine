/*
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

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

import { RenderableComponent } from '../../../core/3d/framework/renderable-component';
import { ccclass, property } from '../../../core/data/class-decorator';
import { Color } from '../../../core/math';
import { SystemEventType } from '../../../core/platform/event-manager/event-enum';
import { ccenum } from '../../../core/value-types/enum';
import { builtinResMgr } from '../../3d/builtin/init';
import { Material } from '../../assets';
import { GFXBlendFactor } from '../../gfx/define';
import { MaterialInstance } from '../../renderer';
import { IMaterialInstanceInfo } from '../../renderer/core/material-instance';
import { IAssembler, IAssemblerManager } from '../../renderer/ui/base';
import { RenderData } from '../../renderer/ui/render-data';
import { UI } from '../../renderer/ui/ui';
import { Node } from '../../scene-graph';
import { TransformBit } from '../../scene-graph/node-enum';
import { UIComponent } from './ui-component';

// hack
ccenum(GFXBlendFactor);

/**
 * @zh
 * 实例后的材质的着色器属性类型。
 */
export enum InstanceMaterialType {
    /**
     * @zh
     * 着色器只带颜色属性。
     */
    ADDCOLOR = 0,

    /**
     * @zh
     * 着色器带颜色和贴图属性。
     */
    ADDCOLORANDTEXTURE = 1,

    /**
     * @zh
     * 着色器带颜色和贴图属性,并使用灰度模式。
     */
    GRAYSCALE = 2,
}

const _matInsInfo: IMaterialInstanceInfo = {
    parent: null!,
    owner: null!,
    subModelIdx: 0,
};

/**
 * @zh
 * 所有支持渲染的 UI 组件的基类。
 * 可通过 cc.UIRenderComponent 获得该组件。
 */
@ccclass('cc.UIRenderComponent')
export class UIRenderComponent extends UIComponent {

    /**
     * @zh
     * 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的。
     *
     * @param value 原图混合模式。
     * @example
     * ```typescript
     * sprite.srcBlendFactor = GFXBlendFactor.ONE;
     * ```
     */
    @property({
        type: GFXBlendFactor,
        displayOrder: 0,
        tooltip: '原图混合模式',
    })
    get srcBlendFactor () {
        return this._srcBlendFactor;
    }

    set srcBlendFactor (value: GFXBlendFactor) {
        if (this._srcBlendFactor === value) {
            return;
        }

        this._srcBlendFactor = value;
        this._updateBlendFunc();
    }

    /**
     * @zh
     * 指定目标的混合模式。
     *
     * @param value 目标混合模式。
     * @example
     * ```typescript
     * sprite.dstBlendFactor = GFXBlendFactor.ONE;
     * ```
     */
    @property({
        type: GFXBlendFactor,
        displayOrder: 1,
        tooltip: '目标混合模式',
    })
    get dstBlendFactor () {
        return this._dstBlendFactor;
    }

    set dstBlendFactor (value: GFXBlendFactor) {
        if (this._dstBlendFactor === value) {
            return;
        }

        this._dstBlendFactor = value;
        this._updateBlendFunc();
    }

    /**
     * @zh
     * 渲染颜色。
     *
     * @param value 渲染颜色。
     */
    @property({
        displayOrder: 2,
        tooltip: '渲染颜色',
    })
    // @constget
    get color (): Readonly<Color> {
        return this._color;
    }

    set color (value) {
        if (this._color === value) {
            return;
        }

        this._color.set(value);
        this._updateColor();
        this.markForUpdateRenderData();
    }

    /**
     * @zh
     * 渲染使用材质，实际使用材质是实例后材质。
     *
     * @param value 源材质。
     */
    @property({
        type: Material,
        displayOrder: 3,
        tooltip: '源材质',
        visible: false,
    })
    get sharedMaterial () {
        return this._sharedMaterial;
    }

    set sharedMaterial (value) {
        if (this._sharedMaterial === value) {
            return;
        }

        this._sharedMaterial = value;
        if (this._instanceMaterial) {
            this._instanceMaterial();
        }
    }

    get material () {
        if (!this._material){
            if (this._instanceMaterial) {
                this._instanceMaterial();
            }
        }

        return this._material;
    }

    get renderData () {
        return this._renderData;
    }

    // Render data can be submitted even if it is not on the node tree
    set delegateSrc (value: Node) {
        this._delegateSrc = value;
    }

    public static BlendState = GFXBlendFactor;
    public static Assembler: IAssemblerManager | null = null;
    public static PostAssembler: IAssemblerManager | null = null;

    @property
    protected _srcBlendFactor = GFXBlendFactor.SRC_ALPHA;
    @property
    protected _dstBlendFactor = GFXBlendFactor.ONE_MINUS_SRC_ALPHA;
    @property
    protected _color: Color = Color.WHITE.clone();
    @property
    protected _sharedMaterial: Material | null = null;

    protected _assembler: IAssembler | null = null;
    protected _postAssembler: IAssembler | null = null;
    protected _renderData: RenderData | null = null;
    protected _renderDataFlag = true;
    protected _renderFlag = true;
    // 特殊渲染节点，给一些不在节点树上的组件做依赖渲染（例如 mask 组件内置两个 graphics 来渲染）
    protected _delegateSrc: Node | null = null;
    protected _material: Material | null = null;
    protected _instanceMaterialType = InstanceMaterialType.ADDCOLORANDTEXTURE;
    protected _blendTemplate = {
        blendState: {
            targets: [
                {
                    blendSrc: GFXBlendFactor.SRC_ALPHA,
                    blendDst: GFXBlendFactor.ONE_MINUS_SRC_ALPHA,
                },
            ],
        },
        depthStencilState: {},
        rasterizerState: {},
    };

    public __preload (){
        super.__preload();
        this._instanceMaterial();
        if (this._flushAssembler){
            this._flushAssembler();
        }
    }

    public onEnable () {
        super.onEnable();
        this.node.on(SystemEventType.ANCHOR_CHANGED, this._nodeStateChange, this);
        this.node.on(SystemEventType.SIZE_CHANGED, this._nodeStateChange, this);
        this._renderFlag = this._canRender();
    }

    public onDisable () {
        super.onDisable();
        this.node.off(SystemEventType.ANCHOR_CHANGED, this._nodeStateChange, this);
        this.node.off(SystemEventType.SIZE_CHANGED, this._nodeStateChange, this);
        this._renderFlag = false;
    }

    public onDestroy () {
        super.onDestroy();
        this.destroyRenderData();
        if (this._material){
            this._material.destroy();
        }

        this._updateMaterial(null);
        this._renderData = null;
    }

    /**
     * @zh
     * 标记当前组件的渲染数据为已修改状态，这样渲染数据才会重新计算。
     *
     * @param enable 是否标记为已修改。
     */
    public markForUpdateRenderData (enable: boolean = true) {
        this._renderFlag = this._canRender();
        if (enable && this._renderFlag) {
            const renderData = this._renderData;
            if (renderData) {
                renderData.vertDirty = true;
            }

            this._renderDataFlag = enable;
        } else if (!enable) {
            this._renderDataFlag = enable;
        }
    }

    /**
     * @zh
     * 请求渲染数据。
     *
     * @return 渲染数据 RenderData。
     */
    public requestRenderData () {
        const data = RenderData.add();
        this._renderData = data;
        return data;
    }

    /**
     * @zh
     * 渲染数据销毁。
     */
    public destroyRenderData () {
        if (!this._renderData) {
            return;
        }

        RenderData.remove(this._renderData);
        this._renderData = null;
    }

    public updateAssembler (render: UI) {
        super.updateAssembler(render);
        if (this._renderFlag){
            this._checkAndUpdateRenderData();
            this._render(render);
        }
    }

    public postUpdateAssembler (render: UI) {
        super.postUpdateAssembler(render);
        if (this._renderFlag) {
            this._postRender(render);
        }
    }

    // 开始提交渲染数据给中转站
    protected _render (render: UI) { }

    // 开始提交渲染数据给中转站
    protected _postRender (render: UI) { }

    // 像组装器更新渲染数据
    protected _checkAndUpdateRenderData (){
        if (this._renderDataFlag) {
            this._assembler!.updateRenderData!(this);
            this._renderDataFlag = false;
        }
    }

    protected _canRender () {
        return this.material !== null && this.enabled && (this._delegateSrc ? this._delegateSrc.activeInHierarchy : this.enabledInHierarchy);
    }

    protected _postCanRender (){}

    protected _updateColor () {
        if (this._assembler && this._assembler.updateColor) {
            this._assembler!.updateColor(this);
        }
    }

    protected _updateMaterial (material: Material | null) {
        this._material = material;

        this._updateBlendFunc();
    }

    protected _updateBlendFunc () {
        if (!this._material) {
            return;
        }

        const target = this._blendTemplate.blendState.targets[0];
        if (target.blendDst !== this._dstBlendFactor || target.blendSrc !== this._srcBlendFactor) {
            target.blendDst = this._dstBlendFactor;
            target.blendSrc = this._srcBlendFactor;
            this._blendTemplate.depthStencilState = this._material.passes[0].depthStencilState;
            this._blendTemplate.rasterizerState = this._material.passes[0].rasterizerState;
            this._material.overridePipelineStates(this._blendTemplate, 0);
        }
    }

    // pos, rot, scale changed
    protected _nodeStateChange (type: TransformBit){
        if (this._renderData) {
            this.markForUpdateRenderData();
        }

        for (const child of this.node.children) {
            const renderComp = child.getComponent(UIRenderComponent);
            if (renderComp) {
                renderComp.markForUpdateRenderData();
            }
        }
    }

    protected _instanceMaterial () {
        let mat: Material | null = null;
        _matInsInfo.owner = new RenderableComponent();
        if (this._sharedMaterial) {
            _matInsInfo.parent = this._sharedMaterial;
            mat = new MaterialInstance(_matInsInfo);
        } else {
            switch (this._instanceMaterialType) {
                case InstanceMaterialType.ADDCOLOR:
                    _matInsInfo.parent = builtinResMgr.get('ui-base-material');
                    mat = new MaterialInstance(_matInsInfo);
                    break;
                case InstanceMaterialType.ADDCOLORANDTEXTURE:
                    _matInsInfo.parent = builtinResMgr.get('ui-sprite-material');
                    mat = new MaterialInstance(_matInsInfo);
                    break;
                case InstanceMaterialType.GRAYSCALE:
                    _matInsInfo.parent = builtinResMgr.get('ui-sprite-gray-material');
                    mat = new MaterialInstance(_matInsInfo);
                    break;
            }
        }

        this._updateMaterial(mat);
    }

    protected _flushAssembler? (): void;
}

cc.UIRenderComponent = UIRenderComponent;

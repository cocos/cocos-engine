/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @module ui
 */

import { ccclass, executeInEditMode, requireComponent, disallowMultiple, tooltip, type, displayOrder, serializable } from 'cc.decorator';
import { Color } from '../../math';
import { SystemEventType } from '../../platform/event-manager/event-enum';
import { ccenum } from '../../value-types/enum';
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
import { UITransform } from './ui-transform';
import { RenderableComponent } from '../../3d/framework/renderable-component';
import { EDITOR } from 'internal:constants';
import { Stage } from '../../renderer/ui/stencil-manager';

// hack
ccenum(GFXBlendFactor);

/**
 * @en
 * The shader property type of the material after instantiation.
 *
 * @zh
 * 实例后的材质的着色器属性类型。
 */
export enum InstanceMaterialType {
    /**
     * @en
     * The shader only has color properties.
     *
     * @zh
     * 着色器只带颜色属性。
     */
    ADD_COLOR = 0,

    /**
     * @en
     * The shader has color and texture properties.
     *
     * @zh
     * 着色器带颜色和贴图属性。
     */
    ADD_COLOR_AND_TEXTURE = 1,

    /**
     * @en
     * The shader has color and texture properties and uses grayscale mode.
     *
     * @zh
     * 着色器带颜色和贴图属性,并使用灰度模式。
     */
    GRAYSCALE = 2,

    /**
     * @en
     * The shader has color and texture properties and uses embedded alpha mode.
     *
     * @zh
     * 着色器带颜色和贴图属性,并使用透明通道分离贴图。
     */
    USE_ALPHA_SEPARATED = 3,

    /**
     * @en
     * The shader has color and texture properties and uses embedded alpha and grayscale mode.
     *
     * @zh
     * 着色器带颜色和贴图属性,并使用灰度模式。
     */
    USE_ALPHA_SEPARATED_AND_GRAY = 4,
}

const _matInsInfo: IMaterialInstanceInfo = {
    parent: null!,
    owner: null!,
    subModelIdx: 0,
};

/**
 * @en Base class for 2D components which supports rendering features.
 * This component will setup [[NodeUIProperties.uiComp]] in its owner [[Node]]
 *
 * @zh 所有支持渲染的 2D 组件的基类。
 * 这个组件会设置 [[Node]] 上的 [[NodeUIProperties.uiComp]]。
 */
@ccclass('cc.UIRenderable')
@requireComponent(UITransform)
@disallowMultiple
@executeInEditMode
export class UIRenderable extends RenderableComponent {

    /**
     * @en Specifies the source blend mode, it will clone a new material object.
     * @zh 指定源的混合模式，这会克隆一个新的材质对象，注意这带来的性能和内存损耗。
     * @example
     * ```ts
     * sprite.srcBlendFactor = GFXBlendFactor.ONE;
     * ```
     */
    @type(GFXBlendFactor)
    @displayOrder(0)
    @tooltip('Source blend factor')
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
     * @en Specifies the destination blend mode.
     * @zh 指定目标的混合模式，这会克隆一个新的材质对象，注意这带来的性能和内存损耗。
     * @example
     * ```ts
     * sprite.dstBlendFactor = GFXBlendFactor.ONE_MINUS_SRC_ALPHA;
     * ```
     */
    @type(GFXBlendFactor)
    @displayOrder(1)
    @tooltip('destination blend factor')
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
     * @en Main color for rendering, it normally multiplies with texture color.
     * @zh 渲染颜色，一般情况下会和贴图颜色相乘。
     */
    @displayOrder(2)
    @tooltip('渲染颜色')
    get color (): Readonly<Color> {
        return this._color;
    }

    set color (value) {
        if (this._color.equals(value)) {
            return;
        }

        this._color.set(value);
        this._updateColor();
        this.markForUpdateRenderData();
        if (EDITOR) {
            let clone = value.clone();
            this.node.emit(SystemEventType.COLOR_CHANGED, clone);
        }
    }

    // hack for builtinMaterial
    protected _uiMaterial: Material | null = null;
    protected _uiMaterialIns: MaterialInstance | null = null;

    public getUIRenderMaterial () {
        return this._uiMaterialIns || this._uiMaterial;
    }

    public getUIMaterialInstance () {
        if (!this._uiMaterialIns || this._uiMatInsDirty) {
            _matInsInfo.owner = this;
            _matInsInfo.parent = this._uiMaterial!;
            this._uiMaterialIns = new MaterialInstance(_matInsInfo);
            this._uiMatInsDirty = false;
        }
        return this._uiMaterialIns;
    }

    protected _uiMaterialDirty = false;
    protected _uiMatInsDirty = false;

    // materialInstance only for Stencil // Will remove at v3.0
    public _materialInstanceForStencil;
    public getMaterialInstanceForStencil () {
        if (!this._materialInstanceForStencil) {
            let patentMaterial;
            if (this.getRenderMaterial(0)) {
                patentMaterial = this.getMaterial(0);
            } else {
                patentMaterial = this._uiMaterial;
            }
            _matInsInfo.owner = this;
            _matInsInfo.parent = patentMaterial;
            this._materialInstanceForStencil = new MaterialInstance(_matInsInfo);
        }
        return this._materialInstanceForStencil;
    }

    protected _onMaterialModified (idx: number, material: Material | null) {
        if (this._materialInstanceForStencil) {
            const inst = this._materialInstanceForStencil;
            inst.destroy();
            this._materialInstanceForStencil = null;
        }
    }

    /**
     * @en The user customized material, if not set, it will use builtin material resources, and will show nothing on inspector field.
     * @zh 用户自定义材质，如果没有设置过，那么将使用引擎内置的材质资源，在面板上也不会显示。
     */
    get uiMaterial () {
        return this._uiMaterial;
    }
    set uiMaterial (val) {
        this._uiMaterial = val;
    }

    get renderData () {
        return this._renderData;
    }

    // Render data can be submitted even if it is not on the node tree
    set delegateSrc (value: Node) {
        this._delegateSrc = value;
    }

    /**
     * @en The component stencil stage (please do not any modification directly on this object)
     * @zh 组件模板缓冲状态 (注意：请不要直接修改它的值)
     */
    public stencilStage : Stage = Stage.DISABLED;

    /**
     * @en The blend factor enums
     * @zh 混合模式枚举类型
     * @see [[GFXBlendFactor]]
     */
    public static BlendState = GFXBlendFactor;
    /**
     * @en The render data assembler
     * @zh 渲染数据组装器
     */
    public static Assembler: IAssemblerManager | null = null;
    /**
     * @en The post render data assembler
     * @zh 后置渲染数据组装器
     */
    public static PostAssembler: IAssemblerManager | null = null;

    @serializable
    protected _srcBlendFactor = GFXBlendFactor.SRC_ALPHA;
    @serializable
    protected _dstBlendFactor = GFXBlendFactor.ONE_MINUS_SRC_ALPHA;
    @serializable
    protected _color: Color = Color.WHITE.clone();

    protected _assembler: IAssembler | null = null;
    protected _postAssembler: IAssembler | null = null;
    protected _renderData: RenderData | null = null;
    protected _renderDataFlag = true;
    protected _renderFlag = true;
    // 特殊渲染节点，给一些不在节点树上的组件做依赖渲染（例如 mask 组件内置两个 graphics 来渲染）
    protected _delegateSrc: Node | null = null;
    protected _instanceMaterialType = InstanceMaterialType.ADD_COLOR_AND_TEXTURE;
    protected _blendTemplate = {
        blendState: {
            targets: [
                {
                    blendSrc: GFXBlendFactor.SRC_ALPHA,
                    blendDst: GFXBlendFactor.ONE_MINUS_SRC_ALPHA,
                },
            ],
        },
    };

    protected _lastParent: Node | null = null;

    public __preload (){
        this.node._uiProps.uiComp = this;
        if (this._flushAssembler){
            this._flushAssembler();
        }
    }

    public onEnable () {
        this.node.on(SystemEventType.ANCHOR_CHANGED, this._nodeStateChange, this);
        this.node.on(SystemEventType.SIZE_CHANGED, this._nodeStateChange, this);
        this._renderFlag = this._canRender();
    }

    public onDisable () {
        this.node.off(SystemEventType.ANCHOR_CHANGED, this._nodeStateChange, this);
        this.node.off(SystemEventType.SIZE_CHANGED, this._nodeStateChange, this);
        this._renderFlag = false;
    }

    public onDestroy () {
        if (this.node._uiProps.uiComp === this) {
            this.node._uiProps.uiComp = null;
        }
        this.destroyRenderData();
        if (this._materialInstances){
            for(let i = 0; i < this._materialInstances.length; i++) {
                this._materialInstances[i]!.destroy();
            }
        }
        if (this._uiMaterialIns) {
            this._uiMaterialIns.destroy();
        }
        this._renderData = null;
    }

    /**
     * @en Marks the render data of the current component as modified so that the render data is recalculated.
     * @zh 标记当前组件的渲染数据为已修改状态，这样渲染数据才会重新计算。
     * @param enable Marked necessary to update or not
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
     * @en Request new render data object.
     * @zh 请求新的渲染数据对象。
     * @return The new render data
     */
    public requestRenderData () {
        const data = RenderData.add();
        this._renderData = data;
        return data;
    }

    /**
     * @en Destroy current render data.
     * @zh 销毁当前渲染数据。
     */
    public destroyRenderData () {
        if (!this._renderData) {
            return;
        }

        RenderData.remove(this._renderData);
        this._renderData = null;
    }

    /**
     * @en Render data submission procedure, it update and assemble the render data to 2D data buffers before all children submission process.
     * Usually called each frame when the ui flow assemble all render data to geometry buffers.
     * Don't call it unless you know what you are doing.
     * @zh 渲染数据组装程序，这个方法会在所有子节点数据组装之前更新并组装当前组件的渲染数据到 UI 的顶点数据缓冲区中。
     * 一般在 UI 渲染流程中调用，用于组装所有的渲染数据到顶点数据缓冲区。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     */
    public updateAssembler (render: UI) {
        if (this._renderFlag){
            this._checkAndUpdateRenderData();
            this._render(render);
        }
    }

    /**
     * @en Post render data submission procedure, it's executed after assembler updated for all children.
     * It may assemble some extra render data to the geometry buffers, or it may only change some render states.
     * Don't call it unless you know what you are doing.
     * @zh 后置渲染数据组装程序，它会在所有子节点的渲染数据组装完成后被调用。
     * 它可能会组装额外的渲染数据到顶点数据缓冲区，也可能只是重置一些渲染状态。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     */
    public postUpdateAssembler (render: UI) {
        if (this._renderFlag) {
            this._postRender(render);
        }
    }

    protected _render (render: UI) {}

    protected _postRender (render: UI) {}

    protected _checkAndUpdateRenderData () {
        if (this._renderDataFlag) {
            this._assembler!.updateRenderData!(this);
            this._renderDataFlag = false;
        }
    }

    protected _canRender () {
        // this.getMaterial(0) !== null still can render is hack for builtin Material
        return this.enabled && (this._delegateSrc ? this._delegateSrc.activeInHierarchy : this.enabledInHierarchy) && this._color.a > 0;
    }

    protected _postCanRender () {}

    protected _updateColor () {
        if (this._assembler && this._assembler.updateColor) {
            this._assembler!.updateColor(this);
        }
    }

    public _updateBlendFunc () {
        let mat = this.getMaterial(0);
        const target = this._blendTemplate.blendState.targets[0];

        if(mat) {
            if (target.blendDst !== this._dstBlendFactor || target.blendSrc !== this._srcBlendFactor) {
                mat = this.material!;
                target.blendDst = this._dstBlendFactor;
                target.blendSrc = this._srcBlendFactor;
                mat.overridePipelineStates(this._blendTemplate, 0);
            }
            return mat;
        }

        if (this._uiMaterialIns !== null && (this._uiMatInsDirty ||
            target.blendDst !== this._dstBlendFactor || target.blendSrc !== this._srcBlendFactor)) {
            mat = this.getUIMaterialInstance();
            target.blendDst = this._dstBlendFactor;
            target.blendSrc = this._srcBlendFactor;
            mat.overridePipelineStates(this._blendTemplate, 0);
        }

        return mat || this.getUIRenderMaterial();
    }

    // pos, rot, scale changed
    protected _nodeStateChange (type: TransformBit) {
        if (this._renderData) {
            this.markForUpdateRenderData();
        }

        for (let i = 0; i < this.node.children.length; ++i) {
            let child = this.node.children[i];
            const renderComp = child.getComponent(UIRenderable);
            if (renderComp) {
                renderComp.markForUpdateRenderData();
            }
        }
    }

    public _updateBuiltinMaterial () : Material {
        // not need _uiMaterialDirty at firstTime
        let init = false;
        if (!this._uiMaterial) { init = true; }

        if (this._uiMaterial && !this._uiMaterialDirty) {
            return this._uiMaterial;
        } else {
            switch (this._instanceMaterialType) {
                case InstanceMaterialType.ADD_COLOR:
                    this._uiMaterial = builtinResMgr.get('ui-base-material') as Material;
                    break;
                case InstanceMaterialType.ADD_COLOR_AND_TEXTURE:
                    this._uiMaterial = builtinResMgr.get('ui-sprite-material') as Material;
                    break;
                case InstanceMaterialType.GRAYSCALE:
                    this._uiMaterial = builtinResMgr.get('ui-sprite-gray-material') as Material;
                    break;
                case InstanceMaterialType.USE_ALPHA_SEPARATED:
                    this._uiMaterial = builtinResMgr.get('ui-sprite-alpha-sep-material') as Material;
                    break;
                case InstanceMaterialType.USE_ALPHA_SEPARATED_AND_GRAY:
                    this._uiMaterial = builtinResMgr.get('ui-sprite-gray-alpha-sep-material') as Material;
                    break;
                default:
                    this._uiMaterial = builtinResMgr.get('ui-sprite-material') as Material;
                    break;
            }
            this._uiMaterialDirty = false;
            if(!init) {this._uiMatInsDirty = true;}
            // materialInstance only for Stencil // Will remove at v3.0
            if(this._materialInstanceForStencil) {
                const inst = this._materialInstanceForStencil;
                inst.destroy();
                this._materialInstanceForStencil = null;
            }
            return this._uiMaterial;
        }
    }

    protected _flushAssembler? (): void;
}

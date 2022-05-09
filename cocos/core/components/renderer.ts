/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { EDITOR } from 'internal:constants';
import {
    ccclass, type, displayOrder, displayName, serializable,
} from 'cc.decorator';
import { Material } from '../assets/material';
import { Component } from './component';
import { IMaterialInstanceInfo, MaterialInstance } from '../renderer/core/material-instance';
import { warnID } from '../platform/debug';

const _matInsInfo: IMaterialInstanceInfo = {
    parent: null!,
    owner: null!,
    subModelIdx: 0,
};

/**
 * @zh 所有渲染组件的基类。
 * @en Base class for all rendering components.
 */
@ccclass('cc.Renderer')
export class Renderer extends Component {
    /**
     * @zh 组件的材质。
     * @en The materials of the component.
     */
    @type(Material)
    @displayOrder(0)
    @displayName('Materials')
    get sharedMaterials () {
        // if we don't create an array copy, the editor will modify the original array directly.
        return (EDITOR && this._materials.slice()) || this._materials;
    }

    set sharedMaterials (val) {
        for (let i = 0; i < val.length; i++) {
            if (val[i] !== this._materials[i]) {
                this.setMaterial(val[i], i);
            }
        }
        if (val.length < this._materials.length) {
            for (let i = val.length; i < this._materials.length; i++) {
                this.setMaterial(null, i);
            }
            this._materials.splice(val.length);
        }
    }

    // _materials should be defined after sharedMaterials for Editor reset component reason
    @type([Material])
    protected _materials: (Material | null)[] = [];

    /**
     * @en The materials of the model.
     * @zh 模型材质。
     */
    get materials (): (MaterialInstance | null)[] {
        for (let i = 0; i < this._materials.length; i++) {
            this._materialInstances[i] = this.getMaterialInstance(i) as MaterialInstance;
        }
        return this._materialInstances;
    }

    set materials (val: (Material | MaterialInstance | null)[]) {
        const newLength = val.length;
        const oldLength = this._materials.length;
        for (let i = newLength; i < oldLength; i++) {
            this.setMaterialInstance(null, i);
        }
        this._materials.length = newLength;
        this._materialInstances.length = newLength;
        for (let i = 0; i < newLength; i++) {
            // they could be either undefined or null
            // eslint-disable-next-line eqeqeq
            if (this._materialInstances[i] != val[i]) {
                this.setMaterialInstance(val[i], i);
            }
        }
    }

    protected _materialInstances: (MaterialInstance | null)[] = [];

    /**
     * @en Get the shared material asset of the first sub-model.
     * @zh 获取第一个子模型的共享材质资源。
     */
    get sharedMaterial () {
        return this.getMaterial(0);
    }

    /**
     * @en Get the shared material asset of the specified sub-model.
     * @zh 获取指定子模型的共享材质资源。
     */
    public getMaterial (idx: number): Material | null {
        if (idx < 0 || idx >= this._materials.length) {
            return null;
        }
        return this._materials[idx];
    }

    /**
     * @en Set the shared material asset of the specified sub-model,
     * new material instance will be created automatically if the sub-model is already using one.
     * @zh 设置指定子模型的 sharedMaterial，如果对应位置有材质实例则会创建一个对应的材质实例。
     */
    public setMaterial (material: Material | null, index: number) {
        if (material && material instanceof MaterialInstance) {
            console.error('Can\'t set a material instance to a sharedMaterial slot');
        }
        this._materials[index] = material;
        const inst = this._materialInstances[index];
        if (inst) {
            inst.destroy();
            this._materialInstances[index] = null;
        }
        this._onMaterialModified(index, this._materials[index]);
    }

    /**
     * @en Get the material instance of the first sub-model.
     * @zh 获取第一个子模型的材质实例。
     */
    get material (): MaterialInstance | null {
        return this.getMaterialInstance(0);
    }

    set material (val: Material | MaterialInstance | null) {
        if (this._materials.length === 1 && !this._materialInstances[0] && this._materials[0] === val) {
            return;
        }
        this.setMaterialInstance(val, 0);
    }

    /**
     * @en Get the material instance of the specified sub-model.
     * @zh 获取指定子模型的材质实例。
     */
    public getMaterialInstance (idx: number): MaterialInstance | null {
        const mat = this._materials[idx];
        if (!mat) {
            return null;
        }
        if (!this._materialInstances[idx]) {
            _matInsInfo.parent = this._materials[idx]!;
            _matInsInfo.owner = this;
            _matInsInfo.subModelIdx = idx;
            const instantiated = new MaterialInstance(_matInsInfo);
            _matInsInfo.parent = null!;
            _matInsInfo.owner = null!;
            _matInsInfo.subModelIdx = 0!;
            this.setMaterialInstance(instantiated, idx);
        }
        return this._materialInstances[idx];
    }

    /**
     * @en Set the material instance of the specified sub-model.
     * @zh 获取指定子模型的材质实例。
     */
    public setMaterialInstance (matInst: Material | MaterialInstance | null, index: number) {
        if (typeof matInst === 'number') {
            warnID(12007);
            const temp: any = matInst;
            matInst = index as any;
            index = temp;
        }

        const curInst = this._materialInstances[index];

        // If the new material is an MaterialInstance
        if (matInst && matInst.parent) {
            if (matInst !== curInst) {
                this._materialInstances[index] = matInst as MaterialInstance;
                this._onMaterialModified(index, matInst);
            }
            return;
        }

        // Skip identity check if it's a Material property
        // Or if there is a MaterialInstance already
        if (matInst !== this._materials[index] || curInst) {
            this.setMaterial(matInst as Material, index);
        }
    }

    /**
     * @en Get the actual rendering material of the specified sub-model.
     * (material instance if there is one, or the shared material asset)
     * @zh 获取指定位置可供渲染的材质，如果有材质实例则使用材质实例，如果没有则使用材质资源
     */
    public getRenderMaterial (index: number): Material | null {
        return this._materialInstances[index] || this._materials[index];
    }

    protected _onMaterialModified (index: number, material: Material | null) {
    }

    protected _onRebuildPSO (index: number, material: Material | null) {
    }

    protected _clearMaterials () {
    }
}

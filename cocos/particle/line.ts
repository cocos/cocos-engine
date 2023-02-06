/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, help, executeInEditMode, menu, tooltip, displayOrder, type, serializable, range, visible, override } from 'cc.decorator';
import { Material, Texture2D } from '../asset/assets';
import { Vec3, Vec2, Vec4, cclegacy } from '../core';
import { LineModel } from './models/line-model';
import { builtinResMgr } from '../asset/asset-manager';
import CurveRange from './animator/curve-range';
import GradientRange from './animator/gradient-range';
import { IMaterialInstanceInfo, MaterialInstance } from '../render-scene/core/material-instance';
import { ModelRenderer } from '../misc';

const _matInsInfo: IMaterialInstanceInfo = {
    parent: null!,
    owner: null!,
    subModelIdx: 0,
};

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
const define = { CC_USE_WORLD_SPACE: false };

@ccclass('cc.Line')
@help('i18n:cc.Line')
@menu('Effects/Line')
@executeInEditMode
export class Line extends ModelRenderer {
    @serializable
    private _lineMaterial: Material | null = null;
    private _lineMatIns: MaterialInstance | null = null;

    @type(Material)
    @displayOrder(1)
    @tooltip('i18n:line.material')
    get lineMaterial () {
        return this._lineMaterial;
    }

    set lineMaterial (val) {
        super.material = val;
        this._lineMaterial = val;
        if (this._lineMaterial) {
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            _matInsInfo.parent = this._lineMaterial;
            _matInsInfo.subModelIdx = 0;
            this._lineMatIns = new MaterialInstance(_matInsInfo);
            this.setMaterialInstance(this._lineMatIns, 0);
            _matInsInfo.parent = null!;
            _matInsInfo.subModelIdx = 0;
            this._lineMatIns.recompileShaders(define);
        }
        if (this._models[0]) {
            const lineModel = this._models[0] as LineModel;
            lineModel.updateMaterial(this._lineMatIns!);
        }
    }

    @override
    @visible(false)
    @type(Material)
    @serializable
    get sharedMaterials () {
        return super.sharedMaterials;
    }

    set sharedMaterials (val) {
        super.sharedMaterials = val;
    }

    @serializable
    private _worldSpace = false;

    /**
     * @zh positions是否为世界空间坐标。
     */
    @displayOrder(1)
    @tooltip('i18n:line.worldSpace')
    get worldSpace () {
        return this._worldSpace;
    }

    set worldSpace (val) {
        this._worldSpace = val;
        if (this._lineMatIns) {
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            this._lineMatIns.recompileShaders(define);
            if (this._models[0]) {
                this._models[0].setSubModelMaterial(0, this._lineMatIns);
            }
        }
    }

    @type([Vec3])
    private _positions = [];

    /**
     * @en Inflection point positions of each polyline
     * @zh 每段折线的拐点坐标。
     */
    @type([Vec3])
    @displayOrder(2)
    @tooltip('i18n:line.positions')
    get positions () {
        return this._positions;
    }

    set positions (val) {
        this._positions = val;
        if (this._models[0]) {
            const lineModel = this._models[0] as LineModel;
            lineModel.addLineVertexData(this._positions, this.width, this.color);
        }
    }

    /**
     * @zh 线段的宽度。
     */
    @serializable
    @type(CurveRange)
    @range([0, 1])
    @displayOrder(3)
    @tooltip('i18n:line.width')
    public width = new CurveRange();

    /**
     * @zh 线段颜色。
     */
    @serializable
    @type(GradientRange)
    @displayOrder(6)
    @tooltip('i18n:line.color')
    public color = new GradientRange();

    constructor () {
        super();
    }

    public onLoad () {
        const model = cclegacy.director.root.createModel(LineModel);
        if (this._models.length === 0) {
            this._models.push(model);
        } else {
            this._models[0] = model;
        }
        model.node = model.transform = this.node;
        if (this._lineMaterial === null) {
            this._lineMaterial = new Material();
            super.material = this._lineMaterial;
            this._lineMaterial.copy(builtinResMgr.get<Material>('default-trail-material'));
        }
        if (this._lineMaterial) {
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            _matInsInfo.parent = this._lineMaterial;
            _matInsInfo.subModelIdx = 0;
            this._lineMatIns = new MaterialInstance(_matInsInfo);
            this.setMaterialInstance(this._lineMatIns, 0);
            _matInsInfo.parent = null!;
            _matInsInfo.subModelIdx = 0;
            this._lineMatIns.recompileShaders(define);
        }
        model.updateMaterial(this._lineMatIns!);
        model.setCapacity(100);
    }

    public onEnable () {
        super.onEnable();
        if (this._models.length === 0 || !this._models[0]) {
            return;
        }
        this._attachToScene();
        const lineModel = this._models[0] as LineModel;
        lineModel.addLineVertexData(this._positions, this.width, this.color);
    }

    public onDisable () {
        if (this._models.length > 0 && this._models[0]) {
            this._detachFromScene();
        }
    }

    protected _attachToScene () {
        super._attachToScene();
        if (this._models.length > 0 && this._models[0] && this.node && this.node.scene) {
            const lineModel = this._models[0];
            if (lineModel.scene) {
                this._detachFromScene();
            }
            this._getRenderScene().addModel(lineModel);
        }
    }

    protected _detachFromScene () {
        super._detachFromScene();
        if (this._models.length > 0 && this._models[0]) {
            const lineModel = this._models[0];
            if (lineModel.scene) {
                lineModel.scene.removeModel(lineModel);
            }
        }
    }

    protected update (dt: number): void {
        if (this._models.length > 0 && this._models[0]) {
            const lineModel = this._models[0] as LineModel;
            lineModel.addLineVertexData(this._positions, this.width, this.color);
        }
    }
}

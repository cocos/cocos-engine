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

import { ccclass, help, executeInEditMode, menu, tooltip, displayOrder, type, serializable, range } from 'cc.decorator';
import { Material, Texture2D } from '../asset/assets';
import { Component } from '../scene-graph';
import { Vec3, Vec2, Vec4, cclegacy } from '../core';
import { LineModel } from './models/line-model';
import { builtinResMgr } from '../asset/asset-manager';
import CurveRange from './animator/curve-range';
import GradientRange from './animator/gradient-range';
import { IMaterialInstanceInfo, MaterialInstance } from '../render-scene/core/material-instance';

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
export class Line extends Component {
    @serializable
    private _material: Material | null = null;
    private _materialInstance: MaterialInstance | null = null;

    @type(Material)
    @displayOrder(1)
    @tooltip('i18n:line.material')
    get material () {
        return this._material;
    }

    set material (val) {
        this._material = val;
        if (this._material) {
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            _matInsInfo.parent = this._material;
            _matInsInfo.subModelIdx = 0;
            this._materialInstance = new MaterialInstance(_matInsInfo);
            _matInsInfo.parent = null!;
            _matInsInfo.subModelIdx = 0;
            this._materialInstance.recompileShaders(define);
        }
        if (this._model) {
            this._model.updateMaterial(this._materialInstance!);
        }
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
        if (this._materialInstance) {
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            this._materialInstance.recompileShaders(define);
            if (this._model) {
                this._model.setSubModelMaterial(0, this._materialInstance);
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
        if (this._model) {
            this._model.addLineVertexData(this._positions, this.width, this.color);
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

    /**
     * @ignore
     */
    private _model: LineModel | null = null;
    private _tile_offset: Vec4 = new Vec4();

    constructor () {
        super();
    }

    public onLoad () {
        const model = this._model = cclegacy.director.root.createModel(LineModel);
        model.node = model.transform = this.node;
        if (this._material === null) {
            this._material = new Material();
            this._material.copy(builtinResMgr.get<Material>('default-trail-material'));
        }
        if (this._material) {
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            _matInsInfo.parent = this._material;
            _matInsInfo.subModelIdx = 0;
            this._materialInstance = new MaterialInstance(_matInsInfo);
            _matInsInfo.parent = null!;
            _matInsInfo.subModelIdx = 0;
            this._materialInstance.recompileShaders(define);
        }
        model.updateMaterial(this._materialInstance!);
        model.setCapacity(100);
    }

    public onEnable () {
        if (!this._model) {
            return;
        }
        this._attachToScene();
        this._model.addLineVertexData(this._positions, this.width, this.color);
    }

    public onDisable () {
        if (this._model) {
            this._detachFromScene();
        }
    }

    protected _attachToScene () {
        if (this._model && this.node && this.node.scene) {
            if (this._model.scene) {
                this._detachFromScene();
            }
            this._getRenderScene().addModel(this._model);
        }
    }

    protected _detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }

    protected update (dt: number): void {
        if (this._model) {
            this._model.addLineVertexData(this._positions, this.width, this.color);
        }
    }
}

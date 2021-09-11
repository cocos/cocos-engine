/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module particle
 */

import { ccclass, help, executeInEditMode, menu, tooltip, displayOrder, type, serializable, range } from 'cc.decorator';
import { Material, Texture2D } from '../core/assets';
import { Component } from '../core/components';
import { Vec3, Vec2, Vec4 } from '../core/math';
import { LineModel } from './models/line-model';
import { builtinResMgr } from '../core/builtin';
import CurveRange from './animator/curve-range';
import GradientRange from './animator/gradient-range';
import { legacyCC } from '../core/global-exports';
import { IMaterialInstanceInfo, MaterialInstance } from '../core/renderer/core/material-instance';

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
    @type(Texture2D)
    private _texture = null;

    /**
     * @zh 显示的纹理。
     */
    @type(Texture2D)
    @displayOrder(0)
    @tooltip('i18n:line.texture')
    get texture () {
        return this._texture;
    }

    set texture (val) {
        this._texture = val;
        if (this._materialInstance) {
            this._materialInstance.setProperty('mainTexture', val);
        }
    }

    private _material: Material | null = null;
    private _materialInstance: MaterialInstance | null = null;

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
     * 每段折线的拐点坐标。
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
            this._model.addLineVertexData(this._positions, this._width, this._color);
        }
    }

    @type(CurveRange)
    @range([0, 1])
    private _width = new CurveRange();

    /**
     * @zh 线段的宽度。
     */
    @type(CurveRange)
    @range([0, 1])
    @displayOrder(3)
    @tooltip('i18n:line.width')
    get width () {
        return this._width;
    }

    set width (val) {
        this._width = val;
        if (this._model) {
            this._model.addLineVertexData(this._positions, this._width, this._color);
        }
    }

    @serializable
    private _tile = new Vec2(1, 1);

    /**
     * @zh 图块数。
     */
    @type(Vec2)
    @displayOrder(4)
    @tooltip('i18n:line.tile')
    get tile () {
        return this._tile;
    }

    set tile (val) {
        this._tile.set(val);
        if (this._materialInstance) {
            this._tile_offset.x = this._tile.x;
            this._tile_offset.y = this._tile.y;
            this._materialInstance.setProperty('mainTiling_Offset', this._tile_offset);
        }
    }

    @serializable
    private _offset = new Vec2(0, 0);

    @type(Vec2)
    @displayOrder(5)
    @tooltip('i18n:line.offset')
    get offset () {
        return this._offset;
    }

    set offset (val) {
        this._offset.set(val);
        if (this._materialInstance) {
            this._tile_offset.z = this._offset.x;
            this._tile_offset.w = this._offset.y;
            this._materialInstance.setProperty('mainTiling_Offset', this._tile_offset);
        }
    }

    @type(GradientRange)
    private _color = new GradientRange();

    /**
     * @zh 线段颜色。
     */
    @type(GradientRange)
    @displayOrder(6)
    @tooltip('i18n:line.color')
    get color () {
        return this._color;
    }

    set color (val) {
        this._color = val;
        if (this._model) {
            this._model.addLineVertexData(this._positions, this._width, this._color);
        }
    }

    /**
     * @ignore
     */
    private _model: LineModel | null = null;
    private _tile_offset: Vec4 = new Vec4();

    constructor () {
        super();
    }

    public onLoad () {
        const model = this._model = legacyCC.director.root.createModel(LineModel);
        model.node = model.transform = this.node;
        if (this._material === null) {
            this._material = new Material();
            this._material.copy(builtinResMgr.get<Material>('default-trail-material'));
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
        this.texture = this._texture;
        this.tile = this._tile;
        this.offset = this._offset;
        this._model.addLineVertexData(this._positions, this._width, this._color);
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
}

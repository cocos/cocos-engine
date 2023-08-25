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

import { ccclass, help, executeInEditMode, menu, tooltip, displayOrder, type, serializable, range, visible, override, displayName } from 'cc.decorator';
import { Material, Texture2D } from '../asset/assets';
import { Vec3, cclegacy, Vec4, Vec2, CCBoolean } from '../core';
import { LineModel } from './models/line-model';
import { builtinResMgr } from '../asset/asset-manager';
import CurveRange from './animator/curve-range';
import GradientRange from './animator/gradient-range';
import { ModelRenderer } from '../misc';

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
const CC_USE_WORLD_SCALE = 'CC_USE_WORLD_SCALE';
const define = { CC_USE_WORLD_SPACE: false, CC_USE_WORLD_SCALE: true };

@ccclass('cc.Line')
@help('i18n:cc.Line')
@menu('Effects/Line')
@executeInEditMode
export class Line extends ModelRenderer {
    @type(Texture2D)
    private _texture = null;

    /**
     * @zh 显示的纹理。
     * @en Texture used.
     */
    @type(Texture2D)
    @displayOrder(0)
    @tooltip('i18n:line.texture')
    get texture (): null {
        return this._texture;
    }

    set texture (val) {
        this._texture = val;
        if (this.material) {
            this.material.setProperty('mainTexture', val);
        }
    }

    @serializable
    private _material: Material | null = null;

    @type(Material)
    @displayOrder(1)
    @tooltip('i18n:line.material')
    @displayName('Material')
    get lineMaterial (): Material | null {
        return this.getSharedMaterial(0);
    }

    set lineMaterial (val) {
        this.setSharedMaterial(val, 0);
    }

    @override
    @visible(false)
    @serializable
    get sharedMaterials (): (Material | null)[] {
        return super.sharedMaterials;
    }

    set sharedMaterials (val) {
        super.sharedMaterials = val;
    }

    @serializable
    private _worldSpace = false;

    /**
     * @zh positions是否为世界空间坐标。
     * @en Whether positions are world space coordinates.
     */
    @displayOrder(1)
    @tooltip('i18n:line.worldSpace')
    get worldSpace (): boolean {
        return this._worldSpace;
    }

    set worldSpace (val) {
        this._worldSpace = val;
        const matIns = this.getMaterialInstance(0);
        if (matIns) {
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            matIns.recompileShaders(define);
            if (this._models[0]) {
                this._models[0].setSubModelMaterial(0, matIns);
            }
        }
    }

    @type([Vec3])
    private _positions: Vec3[] = [];

    /**
     * @en Inflection point positions of each polyline.
     * @zh 每段折线的拐点坐标。
     */
    @type([Vec3])
    @displayOrder(2)
    @tooltip('i18n:line.positions')
    get positions (): Vec3[] {
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
     * @en Width of this line.
     */
    @type(CurveRange)
    @range([0, 1])
    @displayOrder(3)
    @tooltip('i18n:line.width')
    get width (): CurveRange {
        return this._width;
    }

    set width (val) {
        this._width = val;
        if (this._models[0]) {
            const lineModel = this._models[0] as LineModel;
            lineModel.addLineVertexData(this._positions, this._width, this._color);
        }
    }

    @serializable
    private _width = new CurveRange();

    /**
     * @zh 线段颜色。
     * @en Color of this line.
     */
    @type(GradientRange)
    @displayOrder(6)
    @tooltip('i18n:line.color')
    get color (): GradientRange {
        return this._color;
    }

    set color (val) {
        this._color = val;
        if (this._models[0]) {
            const lineModel = this._models[0] as LineModel;
            lineModel.addLineVertexData(this._positions, this._width, this._color);
        }
    }

    @serializable
    private _color = new GradientRange();

    @serializable
    private _tile = new Vec2(1, 1);

    private _tile_offset: Vec4 = new Vec4();

    /**
     * @zh 图块数。
     * @en Texture tile count.
     */
    @type(Vec2)
    @displayOrder(4)
    @tooltip('i18n:line.tile')
    get tile (): Vec2 {
        return this._tile;
    }

    set tile (val) {
        this._tile.set(val);
        if (this.material) {
            this._tile_offset.x = this._tile.x;
            this._tile_offset.y = this._tile.y;
            this.material.setProperty('mainTiling_Offset', this._tile_offset);
        }
    }

    @serializable
    private _offset = new Vec2(0, 0);

    @type(Vec2)
    @displayOrder(5)
    @tooltip('i18n:line.offset')
    get offset (): Vec2 {
        return this._offset;
    }

    set offset (val) {
        this._offset.set(val);
        if (this.material) {
            this._tile_offset.z = this._offset.x;
            this._tile_offset.w = this._offset.y;
            this.material.setProperty('mainTiling_Offset', this._tile_offset);
        }
    }

    constructor () {
        super();
    }

    public onLoad (): void {
        const model = cclegacy.director.root.createModel(LineModel);
        if (this._models.length === 0) {
            this._models.push(model);
        } else {
            this._models[0] = model;
        }
        model.node = model.transform = this.node;
        if (this._material) {
            this.lineMaterial = this._material;
            this._material = null;
        }
        if (this.lineMaterial === null) {
            const mat = builtinResMgr.get<Material>('default-trail-material');
            this.material = mat;
        }
        const matIns = this.getMaterialInstance(0);
        if (matIns) {
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            matIns.recompileShaders(define);
            model.updateMaterial(matIns);
        }
        model.setCapacity(100);
    }

    public onEnable (): void {
        super.onEnable();
        if (this._models.length === 0 || !this._models[0]) {
            return;
        }
        this._attachToScene();
        this.texture = this._texture;
        this.tile = this._tile;
        this.offset = this._offset;
        const lineModel = this._models[0] as LineModel;
        lineModel.addLineVertexData(this._positions, this.width, this.color);
    }

    public onDisable (): void {
        if (this._models.length > 0 && this._models[0]) {
            this._detachFromScene();
        }
    }

    protected _attachToScene (): void {
        super._attachToScene();
        if (this._models.length > 0 && this._models[0] && this.node && this.node.scene) {
            const lineModel = this._models[0];
            if (lineModel.scene) {
                this._detachFromScene();
            }
            this._getRenderScene().addModel(lineModel);
        }
    }

    /**
     * @engineInternal
     */
    public _detachFromScene (): void {
        super._detachFromScene();
        if (this._models.length > 0 && this._models[0]) {
            const lineModel = this._models[0];
            if (lineModel.scene) {
                lineModel.scene.removeModel(lineModel);
            }
        }
    }

    protected _onMaterialModified (index: number, material: Material | null): void {
        super._onMaterialModified(index, material);
        const matIns = this.getMaterialInstance(0);
        if (matIns) {
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            matIns.recompileShaders(define);
            if (this._models[0]) {
                const lineModel = this._models[0] as LineModel;
                lineModel.updateMaterial(matIns);
            }
        }
    }
}

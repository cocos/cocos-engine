/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable func-names */
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

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    visible,
    type,
    editable,
    serializable,
    tooltip,
} from 'cc.decorator';
import { Vec3, IVec3Like } from '../../../../core';
import { Collider } from './collider';
import { ISimplexShape } from '../../../spec/i-physics-shape';
import { ESimplexType, EColliderType } from '../../physics-enum';

/**
 * @en
 * Simplex collider, support point, line, triangle, tetrahedron.
 * @zh
 * 单纯形碰撞器，支持点、线、三角形、四面体。
 */
@ccclass('cc.SimplexCollider')
@help('i18n:cc.SimplexCollider')
@menu('Physics/SimplexCollider')
@executeInEditMode
export class SimplexCollider extends Collider {
    static readonly ESimplexType = ESimplexType;

    /// PUBLIC PROPERTY GETTER\SETTER ///

    @type(ESimplexType)
    @tooltip('i18n:physics3d.collider.simplex_shapeType')
    get shapeType () {
        return this._shapeType;
    }

    set shapeType (v) {
        this._shapeType = v;
        if (this._shape) {
            this.shape.setShapeType(v);
        }
    }

    @editable
    @tooltip('i18n:physics3d.collider.simplex_vertex0')
    get vertex0 () {
        return this._vertices[0];
    }

    set vertex0 (v: IVec3Like) {
        Vec3.copy(this._vertices[0], v);
        this.updateVertices();
    }

    @visible(function (this: SimplexCollider) { return this._shapeType > 1; })
    @tooltip('i18n:physics3d.collider.simplex_vertex1')
    get vertex1 () {
        return this._vertices[1];
    }

    set vertex1 (v: IVec3Like) {
        Vec3.copy(this._vertices[1], v);
        this.updateVertices();
    }

    @visible(function (this: SimplexCollider) { return this._shapeType > 2; })
    @tooltip('i18n:physics3d.collider.simplex_vertex2')
    get vertex2 () {
        return this._vertices[2];
    }

    set vertex2 (v: IVec3Like) {
        Vec3.copy(this._vertices[2], v);
        this.updateVertices();
    }

    @visible(function (this: SimplexCollider) { return this._shapeType > 3; })
    @tooltip('i18n:physics3d.collider.simplex_vertex3')
    get vertex3 () {
        return this._vertices[3];
    }

    set vertex3 (v: IVec3Like) {
        Vec3.copy(this._vertices[3], v);
        this.updateVertices();
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get shape () {
        return this._shape as ISimplexShape;
    }

    get vertices () {
        return this._vertices;
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _shapeType: ESimplexType = ESimplexType.TETRAHEDRON;

    @serializable
    private _vertices: IVec3Like[] = [
        new Vec3(0, 0, 0),
        new Vec3(0, 0, 1),
        new Vec3(1, 0, 0),
        new Vec3(0, 1, 0),
    ];

    constructor () {
        super(EColliderType.SIMPLEX);
    }

    updateVertices () {
        if (this._shape) {
            this.shape.setVertices(this._vertices);
        }
    }
}

export namespace SimplexCollider {
    export type ESimplexType = EnumAlias<typeof ESimplexType>;
}

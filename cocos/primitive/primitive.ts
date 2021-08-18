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
 * @module 3d/primitive
 */

import { ccclass, type, serializable, editable } from 'cc.decorator';
import { createMesh } from '../3d/misc';
import { Mesh } from '../3d/assets/mesh';
import * as primitives from './index';
import { ccenum } from '../core/value-types/enum';
import { legacyCC } from '../core/global-exports';

enum PrimitiveType {
    BOX = 0,
    SPHERE = 1,
    CYLINDER = 2,
    CONE = 3,
    CAPSULE = 4,
    TORUS = 5,
    PLANE = 6,
    QUAD = 7,
}
ccenum(PrimitiveType);

/**
 * @en
 * Basic primitive mesh, this can be generate some primitive mesh at runtime.
 * @zh
 * 基础图形网格，可以在运行时构建一些基础的网格。
 */
@ccclass('cc.Primitive')
export class Primitive extends Mesh {
    public static PrimitiveType = PrimitiveType;

    /**
     * @en
     * The type of the primitive mesh, set it before you call onLoaded.
     * @zh
     * 此基础图形网格的类型，请在 onLoaded 调用之前设置。
     */
    @type(PrimitiveType)
    public type: number = PrimitiveType.BOX;

    /**
     * @en
     * The option for build the primitive mesh, set it before you call onLoaded.
     * @zh
     * 创建此基础图形网格的可选参数，请在 onLoaded 调用之前设置。
     */
    @serializable
    @editable
    public info: Record<string, number> = {};

    constructor (type = PrimitiveType.BOX) {
        super();
        this.type = type;
    }

    /**
     * @en
     * Construct the primitive mesh with `type` and `info`.
     * @zh
     * 根据`type`和`info`构建相应的网格。
     */
    public onLoaded () {
        createMesh(primitives[PrimitiveType[this.type].toLowerCase()](this.info), this);
    }
}

export declare namespace Primitive {
    export type PrimitiveType = EnumAlias<typeof PrimitiveType>;
}

legacyCC.Primitive = Primitive;

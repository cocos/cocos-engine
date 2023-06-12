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
import { CCFloat, Vec3, serializable } from '../../core';
import { ccclass, type } from '../../core/data/class-decorator';
import { VFXParameterMap } from '../vfx-parameter-map';
import { Vec3Expression } from './vec3';

@ccclass('cc.ConstantVec3Expression')
export class ConstantVec3Expression extends Vec3Expression {
    @type(CCFloat)
    @serializable
    public x = 0;

    @type(CCFloat)
    @serializable
    public y = 0;

    @type(CCFloat)
    @serializable
    public z = 0;

    public get isConstant (): boolean {
        return true;
    }

    constructor (x = 0, y = 0, z = 0) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public tick (parameterMap: VFXParameterMap) {}
    public bind (parameterMap: VFXParameterMap) {}

    public evaluate (index: number, out: Vec3) {
        out.x = this.x;
        out.y = this.y;
        out.z = this.z;
        return out;
    }

    public evaluateSingle (out: Vec3) {
        out.x = this.x;
        out.y = this.y;
        out.z = this.z;
        return out;
    }
}

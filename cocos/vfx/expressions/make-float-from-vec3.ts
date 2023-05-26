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
import { Enum, Vec3 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ContextDataSet } from '../context-data-set';
import { EmitterDataSet } from '../emitter-data-set';
import { ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { UserDataSet } from '../user-data-set';
import { ConstantVec3Expression } from './constant-vec3';
import { FloatExpression } from './float';
import { Vec3Expression } from './vec3';

const temp = new Vec3();

export enum Vec3Channel {
    X,
    Y,
    Z,
}

@ccclass('cc.MakeFloatFromVec3Expression')
export class MakeFloatFromVec3Expression extends FloatExpression {
    @type(Vec3Expression)
    @serializable
    public vec3 = new ConstantVec3Expression();

    @type(Enum(Vec3Channel))
    @serializable
    public channel = Vec3Channel.X;

    public get isConstant (): boolean {
        return this.vec3.isConstant;
    }

    private _getChannel = this._getX;

    private _getX (vec3: Vec3) {
        return vec3.x;
    }

    private _getY (vec3: Vec3) {
        return vec3.y;
    }

    private _getZ (vec3: Vec3) {
        return vec3.z;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        this.vec3.tick(particles, emitter, user, context);
        switch (this.channel) {
        case Vec3Channel.X: this._getChannel = this._getX; break;
        case Vec3Channel.Y: this._getChannel = this._getY; break;
        case Vec3Channel.Z: this._getChannel = this._getZ; break;
        default: this._getChannel = this._getX; break;
        }
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        this.vec3.bind(particles, emitter, user, context);
    }

    public evaluate (index: number): number {
        this.vec3.evaluate(index, temp);
        return this._getChannel(temp);
    }

    public evaluateSingle (): number {
        this.vec3.evaluateSingle(temp);
        switch (this.channel) {
        case Vec3Channel.X: return temp.x;
        case Vec3Channel.Y: return temp.y;
        case Vec3Channel.Z: return temp.z;
        default: return temp.x;
        }
    }
}

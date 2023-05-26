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
import { ccclass, serializable, type, visible } from 'cc.decorator';
import { ShapeLocationModule } from './shape-location';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { CCBoolean, Vec3 } from '../../core';
import { ParticleDataSet, POSITION } from '../particle-data-set';
import { FROM_INDEX, ModuleExecContext, TO_INDEX } from '../module-exec-context';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression, ConstantVec3Expression, FloatExpression, Vec3Expression } from '../expressions';

const tempPosition = new Vec3();
const pos = new Vec3();
const tempBoxSize = new Vec3();
const tempBoxCenter = new Vec3();
@ccclass('cc.BoxLocationModule')
@VFXModule.register('BoxLocation', ModuleExecStageFlags.SPAWN, [POSITION.name])
export class BoxLocationModule extends ShapeLocationModule {
    @type(Vec3Expression)
    public get boxSize () {
        if (!this._boxSize) {
            this._boxSize = new ConstantVec3Expression(Vec3.ONE);
        }
        return this._boxSize;
    }

    public set boxSize (val) {
        this._boxSize = val;
    }

    @type(Vec3Expression)
    public get boxCenter () {
        if (!this._boxCenter) {
            this._boxCenter = new ConstantVec3Expression(new Vec3(0.5, 0.5, 0.5));
        }
        return this._boxCenter;
    }

    public set boxCenter (val) {
        this._boxCenter = val;
    }

    @type(CCBoolean)
    @serializable
    public surfaceOnly = false;

    @type(FloatExpression)
    @visible(function (this: BoxLocationModule) {
        return this.surfaceOnly;
    })
    public get surfaceThickness () {
        if (!this._surfaceThickness) {
            this._surfaceThickness = new ConstantFloatExpression();
        }
        return this._surfaceThickness;
    }

    public set surfaceThickness (val) {
        this._surfaceThickness = val;
    }

    @serializable
    private _surfaceThickness: FloatExpression | null = null;
    @serializable
    private _boxSize: Vec3Expression | null = null;
    @serializable
    private _boxCenter: Vec3Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        this.boxSize.tick(particles, emitter, user, context);
        this.boxCenter.tick(particles, emitter, user, context);
        if (this.surfaceThickness) {
            this.surfaceThickness.tick(particles, emitter, user, context);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.execute(particles, emitter, user, context);
        const boxSize = this._boxSize as Vec3Expression;
        const boxCenter = this._boxCenter as Vec3Expression;
        boxSize.bind(particles, emitter, user, context);
        boxCenter.bind(particles, emitter, user, context);
        const fromIndex = context.getUint32Parameter(FROM_INDEX).data;
        const toIndex = context.getUint32Parameter(TO_INDEX).data;
        const position = particles.getVec3Parameter(POSITION);
        const rand = this.randomStream;
        if (!this.surfaceOnly) {
            for (let i = fromIndex; i < toIndex; ++i) {
                boxSize.evaluate(i, tempBoxSize);
                boxCenter.evaluate(i, tempBoxCenter);
                Vec3.set(pos, (rand.getFloat() - tempBoxCenter.x) * tempBoxSize.x,
                    (rand.getFloat() - tempBoxCenter.y) * tempBoxSize.y, (rand.getFloat() - tempBoxCenter.z) * tempBoxSize.z);
                this.storePosition(i, pos, position);
            }
        } else {
            const surfaceThickness = this._surfaceThickness as FloatExpression;
            for (let i = fromIndex; i < toIndex; ++i) {
                const x = rand.getFloat();
                const y = rand.getFloat();
                const z = rand.getFloat();
                const face = rand.getIntFromRange(0, 3);
                Vec3.set(tempPosition,
                    face === 0 ? (x >= 0.5 ? 1 : 0) : x,
                    face === 1 ? (y >= 0.5 ? 1 : 0) : y,
                    face === 2 ? (z >= 0.5 ? 1 : 0) : z);
                boxSize.evaluate(i, tempBoxSize);
                boxCenter.evaluate(i, tempBoxCenter);
                const thickness = surfaceThickness.evaluate(i);
                tempPosition.x *= rand.getFloatFromRange(tempBoxSize.x - thickness, tempBoxSize.x);
                tempPosition.y *= rand.getFloatFromRange(tempBoxSize.y - thickness, tempBoxSize.y);
                tempPosition.z *= rand.getFloatFromRange(tempBoxSize.z - thickness, tempBoxSize.z);
                Vec3.set(pos, tempPosition.x - tempBoxSize.x * tempBoxCenter.x, tempPosition.y - tempBoxSize.y * tempBoxCenter.y, tempPosition.z - tempBoxSize.z * tempBoxCenter.z);
                this.storePosition(i, pos, position);
            }
        }
    }
}

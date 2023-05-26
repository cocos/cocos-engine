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
import { ccclass, serializable, type } from 'cc.decorator';
import { ShapeLocationModule } from './shape-location';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { POSITION, ParticleDataSet } from '../particle-data-set';
import { FROM_INDEX, ModuleExecContext, TO_INDEX } from '../module-exec-context';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { Vec2, Vec3 } from '../../core';
import { ConstantVec2Expression, Vec2Expression } from '../expressions';

const center = new Vec2();
const size = new Vec2();
const pos = new Vec3();
@ccclass('cc.PlaneLocationModule')
@VFXModule.register('PlaneLocation', ModuleExecStageFlags.SPAWN, [POSITION.name])
export class PlaneLocationModule extends ShapeLocationModule {
    @type(Vec2Expression)
    public get planeSize () {
        if (!this._planeSize) {
            this._planeSize = new ConstantVec2Expression(Vec2.ONE);
        }
        return this._planeSize;
    }

    public set planeSize (val) {
        this._planeSize = val;
    }

    @type(Vec2Expression)
    public get planeCenter () {
        if (!this._planeCenter) {
            this._planeCenter = new ConstantVec2Expression(new Vec2(0.5, 0.5));
        }
        return this._planeCenter;
    }

    public set planeCenter (val) {
        this._planeCenter = val;
    }

    @serializable
    private _planeSize: Vec2Expression | null = null;
    @serializable
    private _planeCenter: Vec2Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        this.planeCenter.tick(particles, emitter, user, context);
        this.planeSize.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.execute(particles, emitter, user, context);
        const planeSize = this._planeSize as Vec2Expression;
        const planeCenter = this._planeCenter as Vec2Expression;
        planeSize.bind(particles, emitter, user, context);
        planeCenter.bind(particles, emitter, user, context);
        const fromIndex = context.getUint32Parameter(FROM_INDEX).data;
        const toIndex = context.getUint32Parameter(TO_INDEX).data;
        const position = particles.getVec3Parameter(POSITION);
        const rand = this.randomStream;
        for (let i = fromIndex; i < toIndex; i++) {
            planeCenter.evaluate(i, center);
            planeSize.evaluate(i, size);
            Vec2.set(pos, rand.getFloatFromRange(0, size.x), rand.getFloatFromRange(0, size.y));
            pos.x -= size.x * center.x;
            pos.y -= size.y * center.y;
            this.storePosition(i, pos, position);
        }
    }
}

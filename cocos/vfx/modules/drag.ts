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

import { ccclass, type, serializable, visible } from 'cc.decorator';
import { Vec3, CCBoolean, Enum, Vec2 } from '../../core';
import { FloatExpression } from '../expressions/float';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FROM_INDEX, ContextDataSet, TO_INDEX } from '../context-data-set';
import { BASE_VELOCITY, PHYSICS_FORCE, POSITION, ParticleDataSet, SCALE, SPRITE_SIZE, VELOCITY } from '../particle-data-set';
import { ConstantFloatExpression } from '../expressions';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { Uint32Parameter, Vec2ArrayParameter, Vec3ArrayParameter } from '../parameters';

const _tempVec3 = new Vec3();
const _tempVec2 = new Vec2();

export enum RadiusSource {
    SPRITE_SIZE,
    MESH_SCALE,
    CUSTOM,
}
@ccclass('cc.DragModule')
@VFXModule.register('Drag', ModuleExecStageFlags.UPDATE, [VELOCITY.name], [VELOCITY.name, SCALE.name, SPRITE_SIZE.name])
export class DragModule extends VFXModule {
    @type(FloatExpression)
    @visible(true)
    @serializable
    public drag: FloatExpression = new ConstantFloatExpression();

    @type(CCBoolean)
    @serializable
    public multiplyByRadius = true;

    @type(Enum(RadiusSource))
    @visible(function (this: DragModule) { return this.multiplyByRadius; })
    @serializable
    public radiusSource = RadiusSource.SPRITE_SIZE;

    @type(FloatExpression)
    @visible(function (this: DragModule) { return this.multiplyByRadius && this.radiusSource === RadiusSource.CUSTOM; })
    public get radius () {
        if (!this._radius) {
            this._radius = new ConstantFloatExpression(1);
        }
        return this._radius;
    }

    public set radius (val) {
        this._radius = val;
    }

    @type(CCBoolean)
    @serializable
    public multiplyBySpeed = true;
    @serializable
    private _radius: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(POSITION);
        particles.markRequiredParameter(BASE_VELOCITY);
        particles.markRequiredParameter(VELOCITY);
        particles.markRequiredParameter(PHYSICS_FORCE);
        this.drag.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const physicsForce = particles.getParameterUnsafe<Vec3ArrayParameter>(PHYSICS_FORCE);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        const exp = this.drag;
        exp.bind(particles, emitter, user, context);
        const multiplyByRadius = this.multiplyByRadius;
        const radiusSource = this.radiusSource;
        const spriteSize = multiplyByRadius && radiusSource === RadiusSource.SPRITE_SIZE ? particles.getParameterUnsafe<Vec2ArrayParameter>(SPRITE_SIZE) : null;
        const scale = multiplyByRadius && radiusSource === RadiusSource.MESH_SCALE ? particles.getParameterUnsafe<Vec3ArrayParameter>(SCALE) : null;
        const radius = multiplyByRadius && radiusSource === RadiusSource.CUSTOM ? this.radius : null;
        const multiplyBySpeed = this.multiplyBySpeed;
        const velocity = particles.getParameterUnsafe<Vec3ArrayParameter>(VELOCITY);

        for (let i = fromIndex; i < toIndex; i++) {
            let drag = exp.evaluate(i);
            const length = velocity.getVec3At(_tempVec3, i).length();

            drag = this.scaleDrag(multiplyByRadius, radiusSource, multiplyBySpeed, length, drag, i, spriteSize, scale, radius);
            Vec3.multiplyScalar(_tempVec3, _tempVec3, -drag / length);
            physicsForce.addVec3At(_tempVec3, i);
        }
    }

    private scaleDrag (multiplyByRadius: boolean, radiusSource: RadiusSource, multiplyBySpeed: boolean, speed: number, drag: number, index: number, spriteSize: Vec2ArrayParameter | null, scale: Vec3ArrayParameter | null, radius: FloatExpression | null) {
        if (multiplyByRadius) {
            if (radiusSource === RadiusSource.SPRITE_SIZE) {
                spriteSize!.getVec2At(_tempVec2, index);
                const maxDimension = Math.max(_tempVec2.x, _tempVec2.y) * 0.5;
                drag *= maxDimension ** 2 * Math.PI;
            } else if (radiusSource === RadiusSource.MESH_SCALE) {
                scale!.getVec3At(_tempVec3, index);
                const maxDimension = Math.max(_tempVec3.x, _tempVec3.y, _tempVec3.z);
                drag *= maxDimension ** 2 * Math.PI;
            } else {
                drag *= radius!.evaluate(index) ** 2 * Math.PI;
            }
        }
        if (multiplyBySpeed) {
            drag *= speed;
        }
        return drag;
    }
}

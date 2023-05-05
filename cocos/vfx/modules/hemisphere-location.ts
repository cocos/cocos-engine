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
import { ccclass, serializable, tooltip } from 'cc.decorator';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { Vec3 } from '../../core';
import { INITIAL_DIR, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { AngleBasedLocationModule } from './angle-based-location';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '..';

@ccclass('cc.HemisphereLocationModule')
@VFXModule.register('HemisphereLocation', ModuleExecStageFlags.SPAWN, [INITIAL_DIR.name])
export class HemisphereLocationModule extends AngleBasedLocationModule {
    /**
      * @zh 粒子发射器半径。
      */
    @serializable
    public radius = 1;

    /**
        * @zh 粒子发射器发射位置（对 Box 类型的发射器无效）：<bg>
        * - 0 表示从表面发射；
        * - 1 表示从中心发射；
        * - 0 ~ 1 之间表示在中心到表面之间发射。
        */
    @serializable
    public radiusThickness = 1;

    private _innerRadius = 0;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        this._innerRadius = (1 - this.radiusThickness) ** 3;
    }

    protected generatePosAndDir (index: number, angle: number, dir: Vec3, pos: Vec3) {
        const innerRadius = this._innerRadius;
        const radius = this.radius;
        const rand = this.randomStream;
        const z = rand.getFloatFromRange(0, 1);
        const r = Math.sqrt(1 - z * z);
        Vec3.set(dir, r * Math.cos(angle), r * Math.sin(angle), z);
        Vec3.multiplyScalar(pos, dir, rand.getFloatFromRange(innerRadius, 1.0) ** 0.3333 * radius);
    }
}

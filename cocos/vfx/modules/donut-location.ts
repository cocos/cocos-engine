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

import { ccclass, serializable } from 'cc.decorator';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { Vec3 } from '../../core';
import { POSITION, ParticleDataSet, EmitterDataSet, ContextDataSet, UserDataSet } from '../data-set';
import { ShapeLocationModule } from './shape-location';

@ccclass('cc.DonutLocationModule')
@VFXModule.register('DonutLocation', ModuleExecStageFlags.SPAWN, [POSITION.name])
export class DonutLocationModule extends ShapeLocationModule {
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

    @serializable
    public donutRadius = 0.2;

    private _donutInnerRadius = 0;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        super.tick(particles, emitter, user, context);
        this._donutInnerRadius = (1 - this.radiusThickness) ** 2;
    }

    protected generatePosAndDir (index: number, angle: number, dir: Vec3, pos: Vec3) {
        const innerRadius = this._donutInnerRadius;
        const radius = this.radius;
        const donutRadius = this.donutRadius;
        const rand = this.randomStream;
        const radiusRandom = Math.sqrt(rand.getFloatFromRange(innerRadius, 1.0));
        const r = radiusRandom * donutRadius;
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        const donutAngle = rand.getFloatFromRange(0, Math.PI * 2);
        const dx = Math.cos(donutAngle);
        const dy = Math.sin(donutAngle);
        Vec3.set(dir, x * dx, y * dx, dy);
        Vec3.set(pos, (radius + r * dx) * x, (radius + r * dy) * y, r * dy);
    }
}

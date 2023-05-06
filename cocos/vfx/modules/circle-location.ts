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
import { INITIAL_DIR, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { AngleBasedLocationModule } from './angle-based-location';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

@ccclass('cc.CircleLocationModule')
@VFXModule.register('CircleLocation', ModuleExecStageFlags.SPAWN, [INITIAL_DIR.name])
export class CircleLocationModule extends AngleBasedLocationModule {
    /**
      * @zh 粒子发射器半径。
      */
    @serializable
    public radius = 1;

    /**
      * @zh 发射区域的半径厚度，范围为 0 ~ 1。
      */
    @serializable
    public radiusThickness = 1;

    private _innerRadius = 0;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        this._innerRadius = (1 - this.radiusThickness) ** 2;
    }

    protected generatePosAndDir (index: number, angle: number, dir: Vec3, pos: Vec3) {
        const radiusRandom = Math.sqrt(this.randomStream.getFloatFromRange(this._innerRadius, 1.0));
        const r = radiusRandom * this.radius;
        dir.x = Math.cos(angle);
        dir.y = Math.sin(angle);
        dir.z = 0;
        Vec3.multiplyScalar(pos, dir, r);
    }
}

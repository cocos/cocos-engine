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
import { ccclass, serializable, tooltip, type } from 'cc.decorator';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { Enum, toDegree, toRadian, Vec3 } from '../../core';
import { POSITION, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext } from '../module-exec-context';
import { AngleBasedLocationModule } from './angle-based-location';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

enum LocationMode {
    BASE = 0,
    VOLUME = 1,
}

@ccclass('cc.ConeLocationModule')
@VFXModule.register('ConeLocation', ModuleExecStageFlags.SPAWN, [POSITION.name])
export class ConeLocationModule extends AngleBasedLocationModule {
    static LocationMode = LocationMode;

    get angle () {
        return Math.round(toDegree(this._angle) * 100) / 100;
    }

    set angle (val) {
        this._angle = toRadian(val);
    }

    /**
     * @zh 粒子发射器半径。
     */
    @serializable
    @tooltip('i18n:shapeModule.radius')
    public radius = 1;

    @serializable
    public length = 5;

    /**
      * @zh 粒子发射器发射位置（对 Box 类型的发射器无效）：<bg>
      * - 0 表示从表面发射；
      * - 1 表示从中心发射；
      * - 0 ~ 1 之间表示在中心到表面之间发射。
      */
    @serializable
    @tooltip('i18n:shapeModule.radiusThickness')
    public radiusThickness = 1;

    @type(Enum(LocationMode))
    @serializable
    public locationMode = LocationMode.BASE;

    @serializable
    private _angle = toRadian(25);
    private _sinAngle = 0;
    private _cosAngle = 0;
    private _innerRadius = 0;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        this._sinAngle = Math.sin(this._angle);
        this._cosAngle = Math.cos(this._angle);
        this._innerRadius = (1 - this.radiusThickness) ** 2;
    }

    protected generatePosAndDir (index: number, angle: number, dir: Vec3, pos: Vec3) {
        const rand = this.randomStream;
        const innerRadius = this._innerRadius;
        const radius = this.radius;
        const sinAngle = this._sinAngle;
        const cosAngle = this._cosAngle;
        const length = this.length;
        if (this.locationMode === LocationMode.BASE) {
            const r = Math.sqrt(rand.getFloatFromRange(innerRadius, 1)) * radius;
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            Vec3.set(pos, x * r, y * r, 0);
        } else {
            const r = Math.sqrt(rand.getFloatFromRange(innerRadius, 1)) * radius;
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            Vec3.set(pos, x * r, y * r, 0);
            Vec3.scaleAndAdd(pos, pos, dir, rand.getFloat() * length);
        }
    }
}

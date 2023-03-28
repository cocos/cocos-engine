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
import { ShapeModule, DistributionMode } from './shape';
import { ccclass, displayOrder, range, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { Enum, toDegree, toRadian, Vec3 } from '../../core';
import { ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { CurveRange } from '../curve-range';

@ccclass('cc.LineShapeModule')
@ParticleModule.register('LineShape', ModuleExecStage.SPAWN)
export class LineShapeModule extends ShapeModule {
    /**
       * @zh 粒子发射器半径。
       */
    @serializable
    @tooltip('i18n:shapeModule.radius')
    public length = 1;

    /**
        * @zh 粒子在扇形范围内的发射方式 [[ArcMode]]。
        */
    @type(Enum(DistributionMode))
    @serializable
    @tooltip('i18n:shapeModule.arcMode')
    public distributionMode = DistributionMode.RANDOM;

    /**
        * @zh 控制可能产生粒子的弧周围的离散间隔。
        */
    @serializable
    @tooltip('i18n:shapeModule.arcSpread')
    public spread = 0;

    /**
        * @zh 粒子沿圆周发射的速度。
        */
    @type(CurveRange)
    @range([0, 1])
    @serializable
    @tooltip('i18n:shapeModule.arcSpeed')
    @visible(function (this: LineShapeModule) {
        return this.distributionMode !== DistributionMode.RANDOM;
    })
    public speed = new CurveRange();

    public tick (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        super.tick(particles, params, context);
    }

    public execute () {

    }
}

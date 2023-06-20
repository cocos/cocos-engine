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
import { VFXExecutionStageFlags, VFXModule, VFXStage } from '../vfx-module';
import { Vec2, Vec3 } from '../../core';
import { ConstantVec2Expression, Vec2Expression } from '../expressions';
import { P_POSITION, C_FROM_INDEX, C_TO_INDEX, P_ID, E_RANDOM_SEED } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { randFloat2 } from '../rand';
import { VFXParameterRegistry } from '../vfx-parameter';

const center = new Vec2();
const size = new Vec2();
const pos = new Vec3();
const randVec2 = new Vec2();
@ccclass('cc.PlaneLocationModule')
@VFXModule.register('PlaneLocation', VFXExecutionStageFlags.SPAWN, [P_POSITION.name])
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
        this.requireRecompile();
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
        this.requireRecompile();
    }

    @serializable
    private _planeSize: Vec2Expression | null = null;
    @serializable
    private _planeCenter: Vec2Expression | null = null;
    @serializable
    private _randomOffset = Math.floor(Math.random() * 0xffffffff);

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(P_ID);
        this.planeCenter.compile(parameterMap, parameterRegistry, this);
        this.planeSize.compile(parameterMap, parameterRegistry, this);
    }

    public execute (parameterMap: VFXParameterMap) {
        super.execute(parameterMap);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const position = parameterMap.getVec3ArrayValue(P_POSITION);
        const randomSeed = parameterMap.getUint32Value(E_RANDOM_SEED).data;
        const id = parameterMap.getUint32ArrayValue(P_ID).data;
        const randomOffset = this._randomOffset;
        const planeSizeExp = this._planeSize as Vec2Expression;
        const planeCenterExp = this._planeCenter as Vec2Expression;
        planeSizeExp.bind(parameterMap);
        planeCenterExp.bind(parameterMap);

        for (let i = fromIndex; i < toIndex; i++) {
            planeCenterExp.evaluate(i, center);
            planeSizeExp.evaluate(i, size);
            randFloat2(randVec2, randomSeed, id[i], randomOffset);
            Vec2.set(pos, randVec2.x * size.x, randVec2.y * size.y);
            pos.x -= size.x * center.x;
            pos.y -= size.y * center.y;
            this.storePosition(i, pos, position);
        }
    }
}

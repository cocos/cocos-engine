import { CCInteger, Enum } from '../../core';
import { ccclass, rangeMin, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { C_DELTA_TIME, DelayMode, E_AGE, E_CURRENT_DELAY, E_CURRENT_LOOP_COUNT, E_LOOPED_AGE, E_NORMALIZED_LOOP_AGE, LoopMode } from '../define';
import { ConstantFloatExpression, ConstantInt32Expression, FloatExpression, Int32Expression } from '../expressions';
import { VFXExecutionStageFlags, VFXModule, VFXStage } from '../vfx-module';
import { VFXParameterMap } from '../vfx-parameter-map';

@ccclass('cc.EmitterStateModule')
@VFXModule.register('EmitterState', VFXExecutionStageFlags.EMITTER, [E_NORMALIZED_LOOP_AGE.name, E_LOOPED_AGE.name])
export class EmitterStateModule extends VFXModule {
    /**
     * @zh 粒子系统运行时间。
     */
    @type(FloatExpression)
    @rangeMin(0.01)
    public get loopDuration () {
        if (!this._loopDuration) {
            this._loopDuration = new ConstantFloatExpression(2);
        }
        return this._loopDuration;
    }

    public set loopDuration (val) {
        this._loopDuration = val;
        this.requireRecompile();
    }

    /**
     * @zh 粒子系统是否循环播放。
     */
    @type(Enum(LoopMode))
    public get loopMode () {
        return this._loopMode;
    }

    public set loopMode (val) {
        this._loopMode = val;
        this.requireRecompile();
    }

    @type(Int32Expression)
    @visible(function (this: EmitterStateModule) { return this.loopMode === LoopMode.MULTIPLE; })
    @rangeMin(1)
    public get loopCount () {
        if (!this._loopCount) {
            this._loopCount = new ConstantInt32Expression(1);
        }
        return this._loopCount;
    }

    public set loopCount (val) {
        this._loopCount = val;
        this.requireRecompile();
    }

    @visible(true)
    @type(Enum(DelayMode))
    public get delayMode () {
        return this._delayMode;
    }

    public set delayMode (val) {
        this._delayMode = val;
        this.requireRecompile();
    }

    /**
     * @zh 粒子系统开始运行后，延迟粒子发射的时间。
     */
    @type(FloatExpression)
    @rangeMin(0)
    @visible(function (this: EmitterStateModule) { return this.delayMode !== DelayMode.NONE; })
    public get loopDelay () {
        if (!this._loopDelay) {
            this._loopDelay = new ConstantFloatExpression(0);
        }
        return this._loopDelay;
    }

    public set loopDelay (val) {
        this._loopDelay = val;
        this.requireRecompile();
    }

    @serializable
    private _loopMode = LoopMode.INFINITE;
    @serializable
    private _loopCount: Int32Expression | null = null;
    @serializable
    private _loopDuration: FloatExpression | null = null;
    @serializable
    private _delayMode = DelayMode.NONE;
    @serializable
    private _loopDelay: FloatExpression | null = null;

    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        super.compile(parameterMap, owner);
    }

    public execute (parameterMap: VFXParameterMap) {
        parameterMap.getFloatValue(E_CURRENT_DELAY).data = ;
        const deltaTime = parameterMap.getFloatValue(C_DELTA_TIME).data;
        if (DEBUG) {
            assertIsTrue(deltaTime < params.duration,
                'The delta time should not exceed the duration of the particle system. please adjust the duration of the particle system.');
            assertIsTrue(deltaTime >= 0);
        }

        const delayMode = this._delayMode;
        const delay = parameterMap.getFloatValue(E_CURRENT_DELAY).data;
        const loopMode = this._loopMode;
        const loopCount = this._loopCount;
        const duration = this._loopDuration;

        const age = parameterMap.getFloatValue(E_AGE);
        let prevTime = age.data;
        age.data += deltaTime;
        let currentTime = age.data;
        prevTime = delayMode === DelayMode.FIRST_LOOP_ONLY ? Math.max(prevTime - delay, 0) : prevTime;
        currentTime = delayMode === DelayMode.FIRST_LOOP_ONLY ? Math.max(currentTime - delay, 0) : currentTime;
        const expectedLoopCount = loopMode === LoopMode.INFINITE ? Number.MAX_SAFE_INTEGER
            : (loopMode === LoopMode.MULTIPLE ? loopCount : 1);
        const invDuration = 1 / duration;
        const durationAndDelay = delayMode === DelayMode.EVERY_LOOP ? (duration + delay) : duration;
        const invDurationAndDelay = delayMode === DelayMode.EVERY_LOOP ? (1 / durationAndDelay) : invDuration;
        const count = Math.floor(currentTime * invDurationAndDelay);
        if (count < expectedLoopCount) {
            prevTime %= durationAndDelay;
            currentTime %= durationAndDelay;
            parameterMap.getUint32Value(E_CURRENT_LOOP_COUNT).data = count;
        } else {
            if (Math.floor(prevTime * invDurationAndDelay) >= expectedLoopCount) {
                prevTime = durationAndDelay;
            } else {
                prevTime %= durationAndDelay;
            }
            currentTime = durationAndDelay;
            parameterMap.getUint32Value(E_CURRENT_LOOP_COUNT).data = expectedLoopCount;
        }
        if (delayMode === DelayMode.EVERY_LOOP) {
            prevTime = Math.max(prevTime - delay, 0);
            currentTime = Math.max(currentTime - delay, 0);
        }

        parameterMap.getFloatValue(E_LOOPED_AGE).data = currentTime;
        parameterMap.getFloatValue(E_NORMALIZED_LOOP_AGE).data = currentTime * invDuration;
    }
}

import { ccclass, serializable } from 'cc.decorator';
import { Motion } from './motion';
import { State, InteractiveState } from './state';
import { BindableNumber } from './parametric';
import { MotionStateEval } from './graph-eval';

@ccclass('cc.animation.Motion')
export class MotionState extends InteractiveState {
    @serializable
    public motion: Motion | null = null;

    @serializable
    public startRatio = new BindableNumber();

    @serializable
    public speed = new BindableNumber(1.0);

    @serializable
    public loop = true;

    public clone () {
        const that = new MotionState();
        that.motion = this.motion?.clone() ?? null;
        that.startRatio = this.startRatio.clone();
        that.speed = this.speed.clone();
        that.loop = this.loop;
        return that;
    }
}

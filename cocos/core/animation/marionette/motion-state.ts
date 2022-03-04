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
    public speed = new BindableNumber(1.0);

    public clone () {
        const that = new MotionState();
        that.motion = this.motion?.clone() ?? null;
        that.speed = this.speed.clone();
        return that;
    }
}

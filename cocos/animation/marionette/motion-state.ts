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
    public speed = 1.0;

    /**
     * Should be float.
     */
    @serializable
    public speedMultiplier = '';

    @serializable
    public speedMultiplierEnabled = false;

    public copyTo (that: MotionState) {
        super.copyTo(that);
        that.motion = this.motion?.clone() ?? null;
        that.speed = this.speed;
        that.speedMultiplier = this.speedMultiplier;
        that.speedMultiplierEnabled = this.speedMultiplierEnabled;
        return this;
    }

    public _clone () {
        const that = new MotionState();
        this.copyTo(that);
        return that;
    }
}

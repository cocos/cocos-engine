import { Node } from "../../../cocos/core";
import { addSubRegionTag, AnimationClip } from "../../../cocos/core/animation/animation-clip";
import { InstantiatedSubRegionPlayer } from "../../../cocos/core/animation/subregion/subregion";
import { Subregion } from "../../../editor/exports/subregion";

export class SubRegionHostMock {
    constructor(root: Node, private _subregion: Subregion, _hostDuration: number) {
        const instantiatedPlayer = this._subregion.player.instantiate(root);
        this._instantiatedPlayer = instantiatedPlayer;
    }

    get wellInstantiated() {
        return !!this._instantiatedPlayer;
    }

    get randomAccessible() {
        return this._instantiatedPlayer.randomAccess;
    }

    public play(time: number) {
        this._instantiatedPlayer.play(time);
    }

    public stop() {
        this._instantiatedPlayer.stop();
    }

    public setSpeed(speed: number) {
        this._instantiatedPlayer.setSpeed(speed);
    }

    private _instantiatedPlayer: InstantiatedSubRegionPlayer | null;
}

export class AnimationClipHostSubRegionMock {
    constructor(_root: Node, subregion: Subregion, hostDuration: number) {
        const animationClip = new AnimationClip();
        animationClip.duration = hostDuration;
        animationClip[addSubRegionTag](subregion);
        const evaluator = animationClip.createEvaluator({ target: _root });
        this._animationEvaluator = evaluator;
    }

    public play(time: number) {
        this._animationEvaluator.notifyHostPlay(time);
    }

    public pause(time: number) {
        this._animationEvaluator.notifyHostPause(time);
    }

    public stop() {
        this._animationEvaluator.notifyHostStop();
    }

    public setSpeed(speed: number) {
        this._animationEvaluator.notifyHostSpeedChanged(speed);
    }

    public evaluateAt(time: number) {
        this._animationEvaluator.evaluate(time);
    }

    private _animationEvaluator: ReturnType<AnimationClip['createEvaluator']>;
}
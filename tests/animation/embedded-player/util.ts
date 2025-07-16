import { Node } from "../../../cocos/scene-graph";
import { addEmbeddedPlayerTag, AnimationClip } from "../../../cocos/animation/animation-clip";
import { EmbeddedPlayableState } from "../../../cocos/animation/embedded-player/embedded-player";
import { EmbeddedPlayer } from "../../../editor/exports/embedded-player";

export class EmbeddedPlayerHostMock {
    constructor(root: Node, private _embeddedPlayer: EmbeddedPlayer, _hostDuration: number) {
        const instantiatedPlayer = this._embeddedPlayer.playable?.instantiate(root) ?? null;
        this._instantiatedPlayer = instantiatedPlayer;
    }

    get wellInstantiated() {
        return !!this._instantiatedPlayer;
    }

    get randomAccessible() {
        return this._instantiatedPlayer?.randomAccess ?? false;
    }

    public play(time: number) {
        this._instantiatedPlayer?.play();
    }

    public stop() {
        this._instantiatedPlayer?.stop();
    }

    public setSpeed(speed: number) {
        this._instantiatedPlayer?.setSpeed(speed);
    }

    private _instantiatedPlayer: EmbeddedPlayableState | null;
}

export class AnimationClipHostEmbeddedPlayerMock {
    constructor(_root: Node, embeddedPlayer: EmbeddedPlayer, hostDuration: number) {
        const animationClip = new AnimationClip();
        animationClip.duration = hostDuration;
        animationClip[addEmbeddedPlayerTag](embeddedPlayer);
        const evaluator = animationClip.createEmbeddedPlayerEvaluator(_root);
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

    public evaluateAt(time: number, iterations: number) {
        this._animationEvaluator.evaluate(time, iterations);
    }

    private _animationEvaluator: ReturnType<AnimationClip['createEmbeddedPlayerEvaluator']>;
}
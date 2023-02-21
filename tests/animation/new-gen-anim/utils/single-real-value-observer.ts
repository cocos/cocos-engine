import { VectorTrack } from "../../../../cocos/animation/animation";
import { AnimationClip } from "../../../../cocos/animation/animation-clip";
import { ClipMotion } from "../../../../cocos/animation/marionette/clip-motion";
import { Node } from "../../../../cocos/scene-graph";
import { CreateMotionContext } from "./fixtures";

type NonNullableClipMotion = Omit<ClipMotion, 'clip'> & { 'clip': NonNullable<ClipMotion['clip']> };

export class SingleRealValueObserver {
    constructor(initialValue = 0.0) {
        const root = new Node();
        root.setPosition(initialValue, 0.0, 0.0);
        this._root = root;
    }

    get root() {
        return this._root;
    }

    get value() {
        return this._root.position.x;
    }

    public getCreateMotionContext(): CreateMotionContext {
        return {
            createClipMotion(
                keyframes, {
                name = '',
                duration,
            }) {
                const clip = new AnimationClip();
                clip.name = name;
                clip.enableTrsBlending = true;
                clip.duration = duration;
                const track = new VectorTrack();
                track.componentsCount = 3;
                track.path.toProperty('position');
                track.channels()[0].curve.assignSorted(keyframes);
                clip.addTrack(track);
                const clipMotion = new ClipMotion();
                clipMotion.clip = clip;
                return clipMotion as NonNullableClipMotion;
            },
        };
    }

    private _root: Node;
}
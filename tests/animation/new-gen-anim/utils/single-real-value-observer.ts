import { VectorTrack } from "../../../../cocos/animation/animation";
import { additiveSettingsTag, AnimationClip } from "../../../../cocos/animation/animation-clip";
import { Pose } from "../../../../cocos/animation/core/pose";
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext } from "../../../../cocos/animation/marionette/animation-graph-context";
import { ClipMotion } from "../../../../cocos/animation/marionette/motion";
import { WrapMode } from "../../../../cocos/animation/types";
import { Node } from "../../../../cocos/scene-graph";
import { Vec3 } from "../../../../exports/base";
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
                additive = false,
                wrapMode = WrapMode.Normal,
            }) {
                const clip = new AnimationClip();
                clip.name = name;
                clip.enableTrsBlending = true;
                clip.duration = duration;
                clip[additiveSettingsTag].enabled = additive;
                clip.wrapMode = wrapMode;
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

    public createPoseWriter(bindingContext: AnimationGraphBindingContext): {
        write(value: number, context: AnimationGraphEvaluationContext): Pose;
    } {
        const handle = bindingContext.bindTransform('');
        expect(handle).not.toBeNull();
        return {
            write(value, context) {
                const pose = context.pushDefaultedPose();
                pose.transforms.setPosition(handle!.index, new Vec3(value));
                return pose;
            },
        };
    }

    private _root: Node;
}
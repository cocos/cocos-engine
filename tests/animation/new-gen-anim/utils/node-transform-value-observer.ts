import { QuatTrack, VectorTrack } from "../../../../cocos/animation/animation";
import { additiveSettingsTag, AnimationClip } from "../../../../cocos/animation/animation-clip";
import { ClipMotion } from "../../../../cocos/animation/marionette/motion";
import { WrapMode } from "../../../../cocos/animation/types";
import { Quat, toDegree, toRadian, Vec3 } from "../../../../cocos/core";
import { Node } from "../../../../cocos/scene-graph";
import { CreateMotionContext } from "./fixtures";

type NonNullableClipMotion = Omit<ClipMotion, 'clip'> & { 'clip': NonNullable<ClipMotion['clip']> };

/**
 * Utility class to observe node's transform properties.
 * **Each kind of property has one DoF for simplicity**.
 * 
 * It observes(* means a single DoF number):
 * 
 * - Node's position.
 *   The position is observed as a uniformed vectors (*, *, *).
 *   > The idea: components of a vector should be equivalent.
 * 
 * - Node's scale.
 *   Similar to position.
 * 
 * - Node's euler angles rotation.
 *   The euler angles rotation is observed as (*, 0, 0).
 * 
 * - Node's quaternion rotation.
 *   The quaternion rotation is observed in axis-angle form,
 *   where the axis is fixed(`NodeTransformValueObserver.quatRotationAxisSeed`) and the angle can be varied.
 */
export class NodeTransformValueObserver {
    private static _FIXED_ROTATION_AXIS = new Vec3(0.618, 3.1415, -6.6).normalize();

    constructor(initialValue: Readonly<NodeTransformValueObserver.Value>) {
        const root = new Node();

        root.position = new Vec3(initialValue.position, initialValue.position, initialValue.position);

        root.scale = new Vec3(initialValue.scale, initialValue.scale, initialValue.scale);

        root.rotation = Quat.fromAxisAngle(new Quat(),
        NodeTransformValueObserver._FIXED_ROTATION_AXIS, toRadian(initialValue.rotation));

        const eulerAngleRotationNode = new Node('EulerAnglesRotation');
        root.addChild(eulerAngleRotationNode);
        eulerAngleRotationNode.eulerAngles = new Vec3(initialValue.eulerAngles, 0.0, 0.0);

        this._root = root;
        this._eulerAngleRotationNode = eulerAngleRotationNode;
    }

    get root() {
        return this._root;
    }

    get value(): NodeTransformValueObserver.Value {
        const checkUniformVec3 = (v: Readonly<Vec3>) => {
            expect(v.y).toBeCloseTo(v.x, 8);
            expect(v.z).toBeCloseTo(v.x, 8);
        };

        checkUniformVec3(this._root.position);

        checkUniformVec3(this._root.scale);

        const qAxis = new Vec3();
        const qAngle = toDegree(Quat.getAxisAngle(qAxis, this._root.rotation));
        expect(Vec3.equals(qAxis, NodeTransformValueObserver._FIXED_ROTATION_AXIS, 1e-6));

        expect(this._eulerAngleRotationNode.eulerAngles.y).toBeCloseTo(0.0, 8);
        expect(this._eulerAngleRotationNode.eulerAngles.z).toBeCloseTo(0.0, 8);

        return {
            position: this._root.position.x,
            rotation: qAngle,
            scale: this._root.scale.y,
            eulerAngles: this._eulerAngleRotationNode.eulerAngles.x,
        };
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
                { // translation
                    const track = new VectorTrack();
                    track.componentsCount = 3;
                    track.path.toProperty('position');
                    for (let i = 0; i < 3; ++i) {
                        track.channels()[i].curve.assignSorted(keyframes);
                    }
                    clip.addTrack(track);
                }
                { // quaternion rotation
                    const track = new QuatTrack();
                    track.path.toProperty('rotation');
                    for (let i = 0; i < 3; ++i) {
                        track.channel.curve.assignSorted(keyframes.map(([time, value]) => [time, {
                            value: Quat.fromAxisAngle(
                                new Quat(), NodeTransformValueObserver._FIXED_ROTATION_AXIS, toRadian(value)),
                        }]));
                    }
                    clip.addTrack(track);
                }
                { // scale
                    const track = new VectorTrack();
                    track.componentsCount = 3;
                    track.path.toProperty('scale');
                    for (let i = 0; i < 3; ++i) {
                        track.channels()[i].curve.assignSorted(keyframes);
                    }
                    clip.addTrack(track);
                }
                { // euler angles
                    const track = new VectorTrack();
                    track.componentsCount = 3;
                    track.path.toHierarchy('EulerAnglesRotation').toProperty('eulerAngles');
                    track.channels()[0].curve.assignSorted(keyframes);
                    clip.addTrack(track);
                }
                const clipMotion = new ClipMotion();
                clipMotion.clip = clip;
                return clipMotion as NonNullableClipMotion;
            },
        };
    }

    private _root: Node;
    private _eulerAngleRotationNode: Node;
}

namespace NodeTransformValueObserver {
    export interface Value {
        position: number;
        rotation: number;
        scale: number;
        eulerAngles: number;
    }
}
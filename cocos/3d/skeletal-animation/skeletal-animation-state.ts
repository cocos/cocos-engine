/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

/**
 * @packageDocumentation
 * @module animation
 */

import { Mat4, Quat, Vec3 } from '../../core/math';
import { IAnimInfo, JointAnimationInfo } from './skeletal-animation-utils';
import { Node } from '../../core/scene-graph/node';
import { AnimationClip } from '../../core/animation/animation-clip';
import { AnimationState } from '../../core/animation/animation-state';
import { SkeletalAnimation, Socket } from './skeletal-animation';
import { SkelAnimDataHub } from './skeletal-animation-data-hub';
import { legacyCC } from '../../core/global-exports';
import { JSB } from '../../core/default-constants';

const m4_1 = new Mat4();
const m4_2 = new Mat4();

interface ITransform {
    pos: Vec3;
    rot: Quat;
    scale: Vec3;
}

interface ISocketData {
    target: Node;
    frames: ITransform[];
}

export class SkeletalAnimationState extends AnimationState {
    protected _frames = 1;

    protected _bakedDuration = 0;

    protected _animInfo: IAnimInfo | null = null;

    protected _sockets: ISocketData[] = [];

    protected _animInfoMgr: JointAnimationInfo;

    protected _parent: SkeletalAnimation | null = null;

    protected _curvesInited = false;

    constructor (clip: AnimationClip, name = '') {
        super(clip, name);
        this._animInfoMgr = legacyCC.director.root.dataPoolManager.jointAnimationInfo;
    }

    public initialize (root: Node) {
        if (this._curveLoaded) { return; }
        this._parent = root.getComponent('cc.SkeletalAnimation') as SkeletalAnimation;
        const baked = this._parent.useBakedAnimation;
        this._doNotCreateEval = baked;
        super.initialize(root);
        this._curvesInited = !baked;
        const { frames, samples } = SkelAnimDataHub.getOrExtract(this.clip);
        this._frames = frames - 1;
        this._animInfo = this._animInfoMgr.getData(root.uuid);
        this._bakedDuration = this._frames / samples; // last key
        this.setUseBaked(baked);
    }

    /**
     * @internal This method only friends to `SkeletalAnimation`.
     */
    public setUseBaked (useBaked: boolean) {
        if (useBaked) {
            this._sampleCurves = this._sampleCurvesBaked;
            this.duration = this._bakedDuration;
        } else {
            this._sampleCurves = super._sampleCurves;
            this.duration = this.clip.duration;
            if (!this._curvesInited) {
                this._curveLoaded = false;
                super.initialize(this._targetNode!);
                this._curvesInited = true;
            }
        }
    }

    public rebuildSocketCurves (sockets: Socket[]) {
        this._sockets.length = 0;
        if (!this._targetNode) { return; }
        const root = this._targetNode;
        for (let i = 0; i < sockets.length; ++i) {
            const socket = sockets[i];
            const targetNode = root.getChildByPath(socket.path);
            if (!socket.target) { continue; }
            const clipData = SkelAnimDataHub.getOrExtract(this.clip);
            let animPath = socket.path;
            let source = clipData.joints[animPath];
            let animNode = targetNode;
            let downstream: Mat4 | undefined;
            while (!source) {
                const idx = animPath.lastIndexOf('/');
                animPath = animPath.substring(0, idx);
                source = clipData.joints[animPath];
                if (animNode) {
                    if (!downstream) { downstream = Mat4.identity(m4_2); }
                    Mat4.fromRTS(m4_1, animNode.rotation, animNode.position, animNode.scale);
                    Mat4.multiply(downstream, m4_1, downstream);
                    animNode = animNode.parent;
                }
                if (idx < 0) { break; }
            }
            const curveData: Mat4[] | undefined = source && source.transforms;
            const { frames } = clipData;
            const transforms: ITransform[] = [];
            for (let f = 0; f < frames; f++) {
                let mat: Mat4;
                if (curveData && downstream) { // curve & static two-way combination
                    mat = Mat4.multiply(m4_1, curveData[f], downstream);
                } else if (curveData) { // there is a curve directly controlling the joint
                    mat = curveData[f];
                } else if (downstream) { // fallback to default pose if no animation curve can be found upstream
                    mat = downstream;
                } else { // bottom line: render the original mesh as-is
                    mat = new Mat4();
                }
                const tfm = { pos: new Vec3(), rot: new Quat(), scale: new Vec3() };
                Mat4.toRTS(mat, tfm.rot, tfm.pos, tfm.scale);
                transforms.push(tfm);
            }
            this._sockets.push({
                target: socket.target,
                frames: transforms,
            });
        }
    }

    private _sampleCurvesBaked (time: number) {
        const ratio = time / this.duration;
        const info = this._animInfo!;
        const clip = this.clip;

        // Ensure I'm the one on which the anim info is sampling.
        if (info.currentClip !== clip) {
            // If not, switch to me.
            this._animInfoMgr.switchClip(this._animInfo!, clip);

            const users = this._parent!.getUsers();
            users.forEach((user) => {
                user.uploadAnimation(clip);
            });
        }

        const curFrame = (ratio * this._frames + 0.5) | 0;
        if (curFrame === info.data[0]) { return; }
        info.data[0] = curFrame;
        info.dirty = true;
        if (JSB) {
            info.dirtyForJSB[0] = 1;
        }
        for (let i = 0; i < this._sockets.length; ++i) {
            const { target, frames } = this._sockets[i];
            const { pos, rot, scale } = frames[curFrame]; // ratio guaranteed to be in [0, 1]
            target.setRTS(rot, pos, scale);
        }
    }
}

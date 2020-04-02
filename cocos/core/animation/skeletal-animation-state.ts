/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * @category animation
 */

import { SkinningModelComponent } from '../3d/framework/skinning-model-component';
import { Mat4, Quat, Vec3 } from '../math';
import { IAnimInfo, JointAnimationInfo } from '../renderer/models/skeletal-animation-utils';
import { deleteTransform, getTransform, getWorldMatrix, IJointTransform } from '../renderer/models/skinning-model';
import { Node } from '../scene-graph/node';
import { AnimationClip, IRuntimeCurve } from './animation-clip';
import { AnimationState } from './animation-state';
import { SkeletalAnimationComponent, Socket } from './skeletal-animation-component';
import { SkelAnimDataHub } from './skeletal-animation-data-hub';
import { getWorldTransformUntilRoot } from './transform-utils';

const m4_1 = new Mat4();
const m4_2 = new Mat4();

interface ITransform {
    pos: Vec3;
    rot: Quat;
    scale: Vec3;
}

interface ISocketData {
    target: Node;
    transform: IJointTransform;
    frames: ITransform[];
}

const noCurves: IRuntimeCurve[] = [];

export class SkeletalAnimationState extends AnimationState {

    protected _frames = 1;
    protected _bakedDuration = 0;
    protected _animInfo: IAnimInfo | null = null;
    protected _sockets: ISocketData[] = [];
    protected _animInfoMgr: JointAnimationInfo;
    protected _comps: SkinningModelComponent[] = [];
    protected _parent: SkeletalAnimationComponent | null = null;
    protected _curvesInited = false;

    constructor (clip: AnimationClip, name = '') {
        super(clip, name);
        this._animInfoMgr = cc.director.root.dataPoolManager.jointAnimationInfo;
    }

    public initialize (root: Node) {
        if (this._curveLoaded) { return; }
        this._comps.length = 0;
        const comps = root.getComponentsInChildren(SkinningModelComponent);
        for (let i = 0; i < comps.length; ++i) {
            const comp = comps[i];
            if (comp.skinningRoot === root) {
                this._comps.push(comp);
            }
        }
        this._parent = root.getComponent('cc.SkeletalAnimationComponent') as SkeletalAnimationComponent;
        const baked = this._parent.useBakedAnimation;
        super.initialize(root, baked ? noCurves : undefined);
        this._curvesInited = !baked;
        const info = SkelAnimDataHub.getOrExtract(this.clip).info;
        this._frames = info.frames - 1;
        this._animInfo = this._animInfoMgr.getData(root.uuid);
        this._bakedDuration = this._frames / info.sample; // last key
    }

    public onPlay () {
        super.onPlay();
        const baked = this._parent!.useBakedAnimation;
        if (baked) {
            this._sampleCurves = this._sampleCurvesBaked;
            this.duration = this._bakedDuration;
            this._animInfoMgr.switchClip(this._animInfo!, this._clip);
            for (let i = 0; i < this._comps.length; ++i) {
                this._comps[i].uploadAnimation(this.clip);
            }
        } else {
            this._sampleCurves = this._sampleCurvesRealTime;
            this.duration = this._clip.duration;
            if (!this._curvesInited) {
                this._curveLoaded = false;
                super.initialize(this._targetNode!);
                this._curvesInited = true;
            }
        }
    }

    public rebuildSocketCurves (sockets: Socket[]) {
        for (let i = 0; i < this._sockets.length; ++i) {
            const socket = this._sockets[i];
            deleteTransform(socket.transform.node);
        }
        this._sockets.length = 0;
        if (!this._targetNode) { return null; }
        const root = this._targetNode;
        for (let i = 0; i < sockets.length; ++i) {
            const socket = sockets[i];
            const targetNode = root.getChildByPath(socket.path);
            const transform = targetNode && getTransform(targetNode, root);
            if (!transform || !socket.target) { continue; }
            const sourceData = SkelAnimDataHub.getOrExtract(this.clip).data;
            // find lowest joint animation
            let animPath = socket.path;
            let source = sourceData[animPath];
            let animNode = targetNode!;
            while (!source) {
                const idx = animPath.lastIndexOf('/');
                animPath = animPath.substring(0, idx);
                source = sourceData[animPath];
                animNode = animNode.parent!;
                if (idx < 0) { continue; }
            }
            // create animation data
            const socketData: ISocketData = {
                target: socket.target, transform,
                frames: source.worldMatrix.values.map(() => ({ pos: new Vec3(), rot: new Quat(), scale: new Vec3() })),
            };
            const frames = source.worldMatrix.values as Mat4[];
            const data = socketData.frames;
            // apply downstream default pose
            getWorldTransformUntilRoot(targetNode!, animNode, m4_1);
            for (let j = 0; j < socketData.frames.length; j++) {
                const m = frames[j]; const dst = data[j];
                Mat4.toRTS(Mat4.multiply(m4_2, m, m4_1), dst.rot, dst.pos, dst.scale);
            }
            this._sockets.push(socketData);
        }
    }

    private _sampleCurvesBaked (ratio: number) {
        const info = this._animInfo!;
        const curFrame = (ratio * this._frames + 0.5) | 0;
        if (curFrame === info.data[1]) { return; }
        info.data[0] = curFrame;
        info.dirty = true;
        for (let i = 0; i < this._sockets.length; ++i) {
            const { target, frames } = this._sockets[i];
            const { pos, rot, scale } = frames[curFrame]; // ratio guaranteed to be in [0, 1]
            target.setRTS(rot, pos, scale);
        }
    }

    private _sampleCurvesRealTime (ratio: number) {
        super._sampleCurves(ratio);
        const stamp = cc.director.getTotalFrames();
        for (let i = 0; i < this._sockets.length; ++i) {
            const { target, transform } = this._sockets[i];
            target.matrix = getWorldMatrix(transform, stamp);
        }
    }
}

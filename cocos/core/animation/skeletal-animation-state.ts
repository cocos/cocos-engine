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
import { Mat4 } from '../math';
import { IAnimInfo, JointsAnimationInfo } from '../renderer/models/skeletal-animation-utils';
import { Node } from '../scene-graph';
import { AnimationClip } from './animation-clip';
import { AnimationState } from './animation-state';
import { Socket } from './skeletal-animation-component';
import { SkelAnimDataHub } from './skeletal-animation-data-hub';
import { getWorldTransformUntilRoot } from './transform-utils';

const m4_1 = new Mat4();
const _defaultCurves = []; // no curves

interface ISocketData {
    target: Node;
    frames: Mat4[];
}

export class SkeletalAnimationState extends AnimationState {

    protected _frames = 1;
    protected _animInfo: IAnimInfo | null = null;
    protected _sockets: ISocketData[] = [];

    constructor (clip: AnimationClip, name = '') {
        super(clip, name);
    }

    public initialize (root: Node) {
        if (this._curveLoaded) { return; }
        const info = SkelAnimDataHub.getOrExtract(this.clip).info;
        super.initialize(root, _defaultCurves);
        this._frames = info.frames - 1;
        this._animInfo = (cc.director.root.dataPoolManager.jointsAnimationInfo as JointsAnimationInfo).create(root.uuid);
        this.duration = this._frames / info.sample; // last key
    }

    public onPlay () {
        super.onPlay();
        const comps = this._targetNode!.getComponentsInChildren(SkinningModelComponent);
        for (let i = 0; i < comps.length; ++i) {
            const comp = comps[i];
            if (comp.skinningRoot === this._targetNode) {
                comp.uploadAnimation(this.clip);
            }
        }
    }

    public rebuildSocketCurves (sockets: Socket[]) {
        this._sockets.length = 0;
        for (let i = 0; i < sockets.length; ++i) {
            const socket = this._buildSocketData(sockets[i]);
            if (socket) { this._sockets.push(socket); }
        }
    }

    protected _sampleCurves (ratio: number) {
        const info = this._animInfo!;
        const curFrame = (ratio * this._frames + 0.5) | 0;
        info.data[1] = curFrame;
        info.dirty = true;
        for (let i = 0; i < this._sockets.length; ++i) {
            const { target, frames } = this._sockets[i];
            target.matrix = frames[curFrame]; // ratio guaranteed to be in [0, 1]
        }
    }

    private _buildSocketData (socket: Socket) {
        if (!this._targetNode) { return null; }
        const root = this._targetNode;
        const targetNode = root.getChildByPath(socket.path);
        if (!targetNode || !socket.target) { return null; }
        const targetPath = socket.path;
        const sourceData = SkelAnimDataHub.getOrExtract(this.clip).data;
        // find lowest joint animation
        let animPath = targetPath;
        let source = sourceData[animPath];
        let animNode = targetNode;
        while (!source) {
            const idx = animPath.lastIndexOf('/');
            animPath = animPath.substring(0, idx);
            source = sourceData[animPath];
            animNode = animNode.parent!;
            if (idx < 0) { return null; }
        }
        // create animation data
        const socketData: ISocketData = {
            target: socket.target,
            frames: source.worldMatrix.values.map((v) => v.clone()) as Mat4[],
        };
        // apply downstream default pose
        getWorldTransformUntilRoot(targetNode, animNode, m4_1);
        for (let i = 0; i < socketData.frames.length; i++) {
            const m = socketData.frames[i];
            Mat4.multiply(m, m, m4_1);
        }
        return socketData;
    }
}

cc.SkeletalAnimationState = SkeletalAnimationState;

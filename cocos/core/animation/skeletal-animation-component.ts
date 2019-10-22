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

import { ccclass, executeInEditMode, executionOrder, menu, property } from '../data/class-decorator';
import { Mat4 } from '../math';
import { IJointsAnimInfo, JointsAnimationInfo } from '../renderer/models/skinning-model';
import { Node } from '../scene-graph/node';
import { INode } from '../utils/interfaces';
import { AnimationClip } from './animation-clip';
import { AnimationComponent } from './animation-component';
import { SkeletalAnimationClip } from './skeletal-animation-clip';
import { SkeletalAnimationState } from './skeletal-animation-state';
import { getWorldTransformUntilRoot } from './transform-utils';

@ccclass('cc.SkeletalAnimationComponent.Socket')
export class Socket {
    @property
    public path: string = '';
    @property(Node)
    public target: INode | null = null;
    constructor (path = '', target: INode | null = null) {
        this.path = path;
        this.target = target;
    }
}

const m4_1 = new Mat4();

function collectRecursively (node: INode, prefix = '', out: string[] = []) {
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (!child) { continue; }
        const path = prefix ? `${prefix}/${child.name}` : child.name;
        out.push(path);
        collectRecursively(child, path, out);
    }
    return out;
}

/**
 * 骨骼动画组件，额外提供骨骼挂点功能
 */
@ccclass('cc.SkeletalAnimationComponent')
@executionOrder(99)
@executeInEditMode
@menu('Components/SkeletalAnimation')
export class SkeletalAnimationComponent extends AnimationComponent {

    public static Socket = Socket;

    @property({ type: [Socket] })
    public _sockets: Socket[] = [];

    @property({ type: [Socket] })
    get sockets () {
        return this._sockets;
    }
    set sockets (val) {
        this._sockets = val;
        this.rebuildSocketAnimations();
    }

    protected _animInfo: IJointsAnimInfo | null = null;

    set frameID (fid: number) {
        if (!this._animInfo) { return; }
        const { data, buffer } = this._animInfo;
        data[1] = fid; buffer.update(data);
    }
    get frameID () {
        return this._animInfo && this._animInfo.data[1] || 0;
    }

    public onLoad () {
        super.onLoad();
        this._animInfo = JointsAnimationInfo.create(this.node.uuid);
    }

    public onDestroy () {
        if (this._animInfo) {
            JointsAnimationInfo.destroy(this.node.uuid);
            this._animInfo = null;
        }
        super.onDestroy();
    }

    public start () {
        super.start();
        this.sockets = this._sockets;
    }

    public querySockets () {
        const animPaths = this._defaultClip && Object.keys((this._defaultClip as SkeletalAnimationClip).convertedData).sort().reduce((acc, cur) =>
            cur.startsWith(acc[acc.length - 1]) ? acc : (acc.push(cur), acc), [] as string[]) || [];
        if (!animPaths.length) { return ['default animation clip missing/invalid']; }
        const out: string[] = [];
        for (let i = 0; i < animPaths.length; i++) {
            const path = animPaths[i];
            const node = this.node.getChildByPath(path);
            if (!node) { continue; }
            out.push(path);
            collectRecursively(node, path, out);
        }
        return out;
    }

    public rebuildSocketAnimations () {
        for (const socket of this._sockets) {
            const joint = this.node.getChildByPath(socket.path);
            const target = socket.target;
            if (joint && target) {
                target.name = `${socket.path.substring(socket.path.lastIndexOf('/') + 1)} Socket`;
                target.parent = this.node;
                getWorldTransformUntilRoot(joint, this.node, m4_1);
                target.matrix = m4_1;
            }
        }
        for (const stateName of Object.keys(this._nameToState)) {
            const state = this._nameToState[stateName] as SkeletalAnimationState;
            state.rebuildSocketCurves(this._sockets);
        }
    }

    public createSocket (path: string): INode | null {
        const socket = this._sockets.find((s) => s.path === path);
        if (socket) { return socket.target; }
        const joint = this.node.getChildByPath(path);
        if (!joint) { console.warn('illegal socket path'); return null; }
        const target = new Node() as INode;
        target.parent = this.node;
        this._sockets.push(new Socket(path, target));
        this.rebuildSocketAnimations();
        return target;
    }

    protected _createState (clip: AnimationClip, name?: string) {
        return new SkeletalAnimationState(clip, name);
    }

    protected _doCreateState (clip: AnimationClip, name: string) {
        if (!(clip instanceof SkeletalAnimationClip)) { console.warn('non-skeletal clip in skeletal component'); }
        const state = super._doCreateState(clip, name) as SkeletalAnimationState;
        state.rebuildSocketCurves(this._sockets);
        return state;
    }
}

cc.SkeletalAnimationComponent = SkeletalAnimationComponent;

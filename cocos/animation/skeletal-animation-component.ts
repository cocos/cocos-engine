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

import { AnimationComponent } from './animation-component';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../core/data/class-decorator';
import { Node } from '../scene-graph/node';
import { SkeletalAnimationState } from './skeletal-animation-state';
import { INode } from '../core/utils/interfaces';
import { Vec3, Quat } from '../core/math';
import { getWorldTransformUntilRoot } from './transform-utils';

@ccclass('cc.SkeletalAnimationComponent.Socket')
export class Socket {
    @property
    path: string = '';
    @property(Node)
    target: INode | null = null;
    constructor (path = '', target: INode | null = null) {
        this.path = path;
        this.target = target;
    }
}

const v3_1 = new Vec3();
const v3_2 = new Vec3();
const qt_1 = new Quat();

/**
 * 骨骼动画组件，额外提供骨骼挂点功能
 */
@ccclass('cc.SkeletalAnimationComponent')
@executionOrder(99)
@executeInEditMode
@menu('Components/SkeletalAnimationComponent')
export class SkeletalAnimationComponent extends AnimationComponent {

    static Socket = Socket;

    @property({ type: [Socket] })
    _sockets: Socket[] = [];

    @property({ type: [Socket] })
    get sockets () {
        return this._sockets;
    }
    set sockets (val) {
        this._sockets = val;
        this.rebuildSocketAnimations();
    }

    public start () {
        super.start();
        this.sockets = this._sockets;
    }

    public querySockets (parent = this.node, prefix = '', out: string[] = []) {
        for (const child of parent.children) {
            const path = prefix ? `${prefix}/${child.name}` : child.name;
            out.push(path);
            this.querySockets(child, path, out);
        }
        return out;
    }

    public rebuildSocketAnimations () {
        for (const socket of this._sockets) {
            const joint = this.node.getChildByPath(socket.path);
            const target = socket.target;
            if (joint && target) {
                getWorldTransformUntilRoot(joint, this.node, v3_1, qt_1, v3_2);
                target.setPosition(v3_1);
                target.setRotation(qt_1);
                target.setScale(v3_2);
            }
        }
        for (const stateName of Object.keys(this._nameToState)) {
            const state = this._nameToState[stateName] as SkeletalAnimationState;
            state.rebuildSocketAnimations(this._sockets);
        }
    }

    public createSocket (path: string): INode | null {
        let s = this._sockets.find((s) => s.path === path);
        if (s) { return s.target; }
        const joint = this.node.getChildByPath(path);
        if (!joint) { console.warn('illegal socket path'); return null; }
        const target = new cc.Node();
        target.name = `${path.substring(path.lastIndexOf('/') + 1)} Socket`;
        target.parent = this.node;
        this._sockets.push(new Socket(path, target));
        this.rebuildSocketAnimations();
        return target;
    }

    protected _getStateCtor () {
        return SkeletalAnimationState;
    }
}

cc.SkeletalAnimationComponent = SkeletalAnimationComponent;

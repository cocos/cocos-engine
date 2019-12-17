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
import { INode } from '../utils/interfaces';
import { IObjectCurveData } from './animation-clip';
import { AnimCurve } from './animation-curve';
import { AnimationState, ICurveInstance } from './animation-state';
import { Socket } from './skeletal-animation-component';
import { SkelAnimDataHub } from './skeletal-animation-data-hub';
import { ComponentModifier, HierachyModifier, TargetModifier } from './target-modifier';
import { getPathFromRoot, getWorldTransformUntilRoot } from './transform-utils';

const m4_1 = new Mat4();

function isFrameIDCurve (modifiers: TargetModifier[]) {
    return modifiers.length === 3 &&
        modifiers[0] instanceof HierachyModifier &&
        modifiers[1] instanceof ComponentModifier &&
        modifiers[2] === 'frameID';
}

export class SkeletalAnimationState extends AnimationState {

    public initialize (root: INode) {
        const info = SkelAnimDataHub.getOrExtract(this.clip).info;
        super.initialize(root, info.curves);
        this.duration = (info.frames - 1) / info.sample; // last key
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
        // TODO: curve reuse perhaps?
        // delete previous sockets
        if (!this._samplerSharedGroups.length) { return; }
        const curves = this._samplerSharedGroups[0].curves;
        for (let iCurve = 0; iCurve < curves.length; iCurve++) {
            const curveDetail = curves[iCurve].curveDetail;
            if (isFrameIDCurve(curveDetail.modifiers)) {
                continue;
            } else {
                curves.splice(iCurve--, 1);
            }
        }
        // build new ones
        for (let iSocket = 0; iSocket < sockets.length; ++iSocket) {
            const curve = this._buildSocketData(sockets[iSocket]);
            if (curve) { curves.push(curve); }
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
        const data: IObjectCurveData = {
            matrix: { keys: 0, interpolate: false, values: source.worldMatrix.values.map((v) => v.clone()) },
        };
        const matrix = data.matrix.values;
        // apply downstream default pose
        getWorldTransformUntilRoot(targetNode, animNode, m4_1);
        for (let i = 0; i < matrix.length; i++) {
            const m = matrix[i];
            Mat4.multiply(m, m, m4_1);
        }
        if (CC_EDITOR) { // assign back to clip to sync with animation editor
            const path = getPathFromRoot(socket.target, root);
            const curves = this.clip.curves;
            const dstcurve = curves.find((curve) => {
                const modifier = curve.modifiers[0];
                return modifier instanceof HierachyModifier && modifier.path === path && curve.modifiers[1] === 'matrix';
            });
            if (dstcurve) { dstcurve.data = data.matrix; }
            else { curves.push({ modifiers: [ new HierachyModifier(path), 'matrix' ], data: data.matrix }); }
            this.clip.curves = curves;
        }
        // wrap up
        const duration = this.clip.duration;
        const hierachyModifier = new HierachyModifier();
        return new ICurveInstance({
            curve: new AnimCurve(data.matrix, duration),
            modifiers: [ hierachyModifier, 'matrix' ],
        }, socket.target);
    }
}

cc.SkeletalAnimationState = SkeletalAnimationState;

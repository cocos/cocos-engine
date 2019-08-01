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

import { AnimationState, ICurveInstance } from './animation-state';
import { SkinningModelComponent } from '../3d';
import { Socket } from './skeletal-animation-component';
import { SkeletalAnimationClip } from './skeletal-animation-clip';
import { IObjectCurveData } from './animation-clip';
import { Vec3, Quat } from '../core/math';
import { AnimCurve } from './animation-curve';
import { getPathFromRoot, getWorldTransformUntilRoot } from './transform-utils';

export class SkeletalAnimationState extends AnimationState {

    public onPlay () {
        super.onPlay();
        for (const comp of this._targetNode!.getComponentsInChildren(SkinningModelComponent)) {
            if (comp.skinningRoot === this._targetNode) {
                comp.uploadAnimation(this.clip as SkeletalAnimationClip);
            }
        }
    }

    public rebuildSocketCurves (sockets: Socket[]) {
        // TODO: curve reuse perhaps?
        // delete previous sockets
        if (!this._samplerSharedGroups.length) { return; }
        const curves = this._samplerSharedGroups[0].curves;
        for (let iCurve = 0; iCurve < curves.length; iCurve++) {
            if (curves[iCurve].propertyName !== 'frameID') {
                curves.splice(iCurve--, 1);
            }
        }
        // build new ones
        for (let iSocket = 0; iSocket < sockets.length; ++iSocket) {
            const anims = this._buildSocketData(sockets[iSocket]);
            for (let iAnim = 0; iAnim < anims.length; iAnim++) {
                curves.push(anims[iAnim]);
            }
        }
    }

    private _buildSocketData (socket: Socket) {
        if (!this._targetNode) { return []; }
        const root = this._targetNode;
        const targetNode = root.getChildByPath(socket.path);
        if (!targetNode || !socket.target) { return []; }
        const targetPath = socket.path;
        const sourceData = (this.clip as SkeletalAnimationClip).convertedData;
        // find lowest joint animation
        let animPath = targetPath;
        let source = sourceData[animPath];
        let animNode = targetNode;
        while (!source || !source.props) {
            const idx = animPath.lastIndexOf('/');
            animPath = animPath.substring(0, idx);
            source = sourceData[animPath];
            animNode = animNode.parent!;
            if (idx < 0) { return []; }
        }
        // create animation data
        const data: IObjectCurveData = {
            position: { keys: 0, interpolate: false, values: source.props.position.values.map((v) => v.clone()) },
            rotation: { keys: 0, interpolate: false, values: source.props.rotation.values.map((v) => v.clone()) },
            scale: { keys: 0, interpolate: false, values: source.props.scale.values.map((v) => v.clone()) },
        };
        const position = data.position.values;
        const rotation = data.rotation.values;
        const scale = data.scale.values;
        // apply downstream default pose
        getWorldTransformUntilRoot(targetNode, animNode, v3_1, qt_1, v3_2);
        for (let i = 0; i < position.length; i++) {
            const T = position[i];
            const R = rotation[i];
            const S = scale[i];
            Vec3.multiply(v3_3, v3_1, S);
            Vec3.transformQuat(v3_3, v3_3, R);
            Vec3.add(T, v3_3, T);
            Quat.multiply(R, R, qt_1);
            Vec3.multiply(S, S, v3_2);
        }
        if (CC_EDITOR) { // assign back to clip to sync with animation editor
            const path = getPathFromRoot(socket.target, root);
            if (!this.clip.curveDatas[path]) { this.clip.curveDatas[path] = {}; }
            this.clip.curveDatas[path].props = data;
        }
        // wrap up
        const duration = this.clip.duration;
        return [
            new ICurveInstance(new AnimCurve(data.position, 'position', duration, true), socket.target, 'position'),
            new ICurveInstance(new AnimCurve(data.rotation, 'rotation', duration, true), socket.target, 'rotation'),
            new ICurveInstance(new AnimCurve(data.scale, 'scale', duration, true), socket.target, 'scale'),
        ];
    }
}

const v3_1 = new Vec3();
const v3_2 = new Vec3();
const qt_1 = new Quat();
const v3_3 = new Vec3();

cc.SkeletalAnimationState = SkeletalAnimationState;

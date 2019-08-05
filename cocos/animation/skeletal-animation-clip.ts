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

import { RenderableComponent } from '../3d/framework/renderable-component';
import { SkinningModelComponent } from '../3d/framework/skinning-model-component';
import { Quat, Vec3 } from '../core/math';
import { ccclass } from '../core/data/class-decorator';
import { getClassName } from '../core/utils/js';
import { AnimationClip, ICurveData, IObjectCurveData, IPropertyCurve } from './animation-clip';
import { AnimationComponent } from './animation-component';
import { IPropertyCurveData } from './animation-curve';
import { INode } from '../core/utils/interfaces';
import { getPathFromRoot } from './transform-utils';

function isTargetSkinningModel (comp: RenderableComponent, root: INode) {
    if (!(comp instanceof SkinningModelComponent)) { return false; }
    const curRoot = comp.skinningRoot;
    if (curRoot === root) { return true; }
    if (curRoot && curRoot.getComponent(AnimationComponent)) { return false; }
    // find the lowest AnimationComponent node
    let node: INode | null = comp.node;
    while (node && !node.getComponent(AnimationComponent)) { node = node.parent; }
    if (node === root) { return true; }
    return false;
}

/**
 * 骨骼动画剪辑。
 */
@ccclass('cc.SkeletalAnimationClip')
export class SkeletalAnimationClip extends AnimationClip {

    public convertedData: ICurveData = {};
    protected _converted = false;

    public getPropertyCurves (root: INode): ReadonlyArray<IPropertyCurve> {
        this.hash; // calculate hash before conversion
        this._convertToSkeletalCurves(root);
        return super.getPropertyCurves(root);
    }

    private _convertToSkeletalCurves (root: INode) {
        if (this._converted) { return; }
        this.convertedData = this.curveDatas; this.curveDatas = {};
        // sort the keys to make sure parent bone always comes first
        const paths = Object.keys(this.convertedData).sort();
        for (const path of paths) {
            const nodeData = this.convertedData[path];
            if (!nodeData.props) { continue; }
            const { position, rotation, scale } = nodeData.props;
            // fixed step pre-sample
            this._convertToUniformSample(position);
            this._convertToUniformSample(rotation);
            this._convertToUniformSample(scale);
            // turn off interpolation
            position.interpolate = false;
            rotation.interpolate = false;
            scale.interpolate = false;
            // transform to world space
            this._convertToWorldSpace(path, nodeData.props);
        }
        // convert to SkinningModelComponent.fid animation
        const values = [...Array(Math.ceil(this.sample * this._duration))].map((_, i) => i);
        for (const comp of root.getComponentsInChildren(RenderableComponent)) {
            if (isTargetSkinningModel(comp, root)) {
                const path = getPathFromRoot(comp.node, root);
                if (!this.curveDatas[path]) { this.curveDatas[path] = {}; }
                this.curveDatas[path].comps = { [getClassName(comp)]: { frameID: { keys: 0, values, interpolate: false } } };
            }
        }
        this._keys = [values.map((_, i) => i / this.sample)];
        this._duration = (values.length - 1) / this.sample;
        this._converted = true;
    }

    private _convertToUniformSample (curve: IPropertyCurveData) {
        const keys = this._keys[curve.keys]; curve.keys = 0;
        curve.values = [...Array(Math.ceil(this._duration * this.sample))].map((_, i) => {
            if (!keys || keys.length === 1) { return curve.values[0].clone(); } // never forget to clone
            let time = i / this.sample;
            let idx = keys.findIndex((k) => k > time);
            if (idx < 0) { idx = keys.length - 1; time = keys[idx]; }
            else if (idx === 0) { idx = 1; }
            const from = curve.values[idx - 1].clone();
            from.lerp(curve.values[idx], (time - keys[idx - 1]) / (keys[idx] - keys[idx - 1]));
            return from;
        });
    }

    private _convertToWorldSpace (path: string, props: IObjectCurveData) {
        const idx = path.lastIndexOf('/');
        if (idx < 0) { return; }
        const name = path.substring(0, idx);
        const data = this.convertedData[name];
        if (!data || !data.props) { console.warn('no data for parent bone?'); return; }
        const pPos = data.props.position.values;
        const pRot = data.props.rotation.values;
        const pScale = data.props.scale.values;
        // parent is already in world space
        const position = props.position.values;
        const rotation = props.rotation.values;
        const scale = props.scale.values;
        // all props should have the same length now
        for (let i = 0; i < position.length; i++) {
            const parentT = pPos[i];
            const parentR = pRot[i];
            const parentS = pScale[i];
            const T = position[i];
            const R = rotation[i];
            const S = scale[i];
            Vec3.multiply(T, T, parentS);
            Vec3.transformQuat(T, T, parentR);
            Vec3.add(T, T, parentT);
            Quat.multiply(R, parentR, R);
            Vec3.multiply(S, parentS, S);
        }
    }
}

cc.SkeletalAnimationClip = SkeletalAnimationClip;

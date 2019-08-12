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
import { Mat4 } from '../core/math';
import { ccclass } from '../core/data/class-decorator';
import { getClassName } from '../core/utils/js';
import { AnimationClip, IObjectCurveData, IRuntimeCurve } from './animation-clip';
import { AnimationComponent } from './animation-component';
import { IPropertyCurveData, CurveValueAdapter } from './animation-curve';
import { INode } from '../core/utils/interfaces';
import { getPathFromRoot } from './transform-utils';
import { HierachyModifier, ComponentModifier, isCustomTargetModifier, isPropertyModifier } from './target-modifier';

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

type ConvertedData = Record<string, {
    props: Record<string, IPropertyCurveData>;
}>;

export class FrameIDValueAdapter extends CurveValueAdapter {
    public path: string;

    public component: string;

    constructor (path: string, component: string) {
        super();
        this.path = path;
        this.component = component;
    }

    forTarget (target: any) {
        const node = new HierachyModifier(this.path).get(target);
        const component = new ComponentModifier(this.component).get(node) as SkinningModelComponent;
        return {
            set: (value: any) => {
                component.frameID = value;
            },
        };
    }
}

/**
 * 骨骼动画剪辑。
 */
@ccclass('cc.SkeletalAnimationClip')
export class SkeletalAnimationClip extends AnimationClip {

    public convertedData: ConvertedData = {};
    protected _converted = false;

    public getPropertyCurves (root: INode): ReadonlyArray<IRuntimeCurve> {
        this.hash; // calculate hash before conversion
        this._convertToSkeletalCurves(root);
        return super.getPropertyCurves(root);
    }

    private _convertToSkeletalCurves (root: INode) {
        if (this._converted) { return; }
        const convertedData: ConvertedData = {};
        this.curves.forEach((curve) => {
            if (!curve.valueAdapter &&
                curve.modifiers.length === 2 &&
                isCustomTargetModifier(curve.modifiers[0], HierachyModifier) &&
                isPropertyModifier(curve.modifiers[1])) {
                const path = (curve.modifiers[0] as HierachyModifier).path;
                let cs = convertedData[path];
                if (!cs) {
                    cs = {
                        props: {},
                    };
                    convertedData[path] = cs;
                }
                const property = curve.modifiers[1] as string;
                cs.props[property] = curve.data;
            }
        });
        this.convertedData = convertedData; this.curves = [];
        // sort the keys to make sure parent bone always comes first
        const paths = Object.keys(this.convertedData).sort();
        const values: number[] = new Array(Math.ceil(this.sample * this._duration / this.speed));
        for (let i = 0; i < values.length; i++) { values[i] = i; }
        for (const path of paths) {
            const nodeData = this.convertedData[path];
            if (!nodeData.props) { continue; }
            const { position, rotation, scale } = nodeData.props;
            // fixed step pre-sample
            this._convertToUniformSample(position, values);
            this._convertToUniformSample(rotation, values);
            this._convertToUniformSample(scale, values);
            // transform to world space
            this._convertToWorldSpace(path, nodeData.props);
        }
        // convert to SkinningModelComponent.fid animation
        for (const comp of root.getComponentsInChildren(RenderableComponent)) {
            if (isTargetSkinningModel(comp, root)) {
                const path = getPathFromRoot(comp.node, root);
                const compName = getClassName(comp);
                const curves = this.curves;
                const dstcurve = curves.find((curve) =>
                    curve.valueAdapter && (curve.valueAdapter instanceof FrameIDValueAdapter) &&
                    curve.valueAdapter.path === path && curve.valueAdapter.component === compName);
                if (dstcurve) {
                    dstcurve.data = { keys: 0, values, interpolate: false };
                } else {
                    curves.push({
                        modifiers: [],
                        data: { keys: 0, values, interpolate: false },
                        valueAdapter: new FrameIDValueAdapter(path, compName),
                    });
                }
                this.curves = curves;
            }
        }
        this._keys = [values.map((_, i) => i / this.sample)];
        this._duration = (values.length - 1) / this.sample;
        this._converted = true;
    }

    private _convertToUniformSample (curve: IPropertyCurveData, counts: number[]) {
        const keys = this._keys[curve.keys]; curve.keys = 0;
        curve.values = counts.map((_, i) => {
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
        const oPos = props.position.values;
        const oRot = props.rotation.values;
        const oScale = props.scale.values;
        const matrix = oPos.map(() => new Mat4());
        const idx = path.lastIndexOf('/');
        let pMatrix: Mat4[] | null = null;
        if (idx > 0) {
            const name = path.substring(0, idx);
            const data = this.convertedData[name];
            if (!data || !data.props) { console.warn('no data for parent bone?'); return; }
            // parent is already in world space
            pMatrix = data.props.worldMatrix.values;
        }
        // all props should have the same length now
        for (let i = 0; i < oPos.length; i++) {
            const oT = oPos[i];
            const oR = oRot[i];
            const oS = oScale[i];
            const m = matrix[i];
            Mat4.fromRTS(m, oR, oT, oS);
            if (pMatrix) { Mat4.multiply(m, pMatrix[i], m); }
        }
        Object.keys(props).forEach((k) => delete props[k]);
        props.worldMatrix = { keys: 0, interpolate: false, values: matrix };
    }
}

cc.SkeletalAnimationClip = SkeletalAnimationClip;

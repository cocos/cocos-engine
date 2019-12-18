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

import { Mat4, Quat, Vec3 } from '../math';
import { getClassName } from '../utils/js';
import { AnimationClip, IObjectCurveData } from './animation-clip';
import { IPropertyCurveData } from './animation-curve';
import { ComponentModifier, HierachyModifier, isCustomTargetModifier, isPropertyModifier } from './target-modifier';

type CurveData = Vec3 | Quat;
type ConvertedData = Record<string, {
    props: Record<string, IPropertyCurveData>;
}>;

/**
 * 骨骼动画数据转换中心。
 */
export class SkelAnimDataHub {

    public static getOrExtract (clip: AnimationClip) {
        let data = SkelAnimDataHub.pool.get(clip);
        if (!data) { data = convertToSkeletalCurves(clip); SkelAnimDataHub.pool.set(clip, data); }
        return data;
    }

    public static destroy (clip: AnimationClip) {
        SkelAnimDataHub.pool.delete(clip);
    }

    protected static pool = new Map<AnimationClip, ConvertedData>();
}

function convertToSkeletalCurves (clip: AnimationClip) {
    // tslint:disable-next-line: no-unused-expression
    clip.hash; // calculate hash before conversion
    const originalKeys = clip.keys;
    const convertedData: ConvertedData = {};
    clip.curves.forEach((curve) => {
        if (!curve.valueAdapter &&
            isCustomTargetModifier(curve.modifiers[0], HierachyModifier) &&
            isPropertyModifier(curve.modifiers[1])) {
            const path = (curve.modifiers[0] as HierachyModifier).path;
            let cs = convertedData[path];
            if (!cs) { cs = convertedData[path] = { props: {} }; }
            const property = curve.modifiers[1] as string;
            cs.props[property] = curve.data;
        }
    });
    // lazy eval the conversion due to memory-heavy ops
    // many animation paths may not be actually in-use
    for (const path of Object.keys(convertedData)) {
        const props = convertedData[path] && convertedData[path].props;
        if (!props) { continue; }
        Object.defineProperty(props, 'worldMatrix', {
            get: () => {
                if (!props._worldMatrix) {
                    const { position, rotation, scale } = props;
                    // fixed step pre-sample
                    convertToUniformSample(clip, originalKeys, position);
                    convertToUniformSample(clip, originalKeys, rotation);
                    convertToUniformSample(clip, originalKeys, scale);
                    // transform to world space
                    convertToWorldSpace(convertedData, path, props);
                }
                return props._worldMatrix;
            },
        });
    }
    const values: number[] = new Array(Math.ceil(clip.sample * clip.duration / clip.speed) + 1);
    for (let i = 0; i < values.length; i++) { values[i] = i; }
    clip.curves = [{ // leave only frameID animation
        modifiers: [
            new HierachyModifier(''),
            new ComponentModifier(getClassName(cc.SkeletalAnimationComponent)),
            'frameID',
        ],
        data: { keys: 0, values, interpolate: false },
    }];
    clip.keys = [values.map((_, i) => i * clip.speed / clip.sample)];
    clip.duration = clip.keys[0][values.length - 1];
    return convertedData;
}

function convertToUniformSample (clip: AnimationClip, originalKeys: number[][], curve: IPropertyCurveData) {
    const keys = originalKeys[curve.keys]; curve.keys = 0;
    const len = clip.keys[0].length;
    const values: any[] = [];
    if (!keys || keys.length === 1) {
        for (let i = 0; i < len; i++) {
            values[i] = curve.values[0].clone(); // never forget to clone
        }
    } else {
        for (let i = 0, idx = 0; i < len; i++) {
           let time = i * clip.speed / clip.sample;
           while (keys[idx] <= time) { idx++; }
           if (idx > keys.length - 1) { idx = keys.length - 1; time = keys[idx]; }
           else if (idx === 0) { idx = 1; }
           const from = curve.values[idx - 1].clone() as CurveData;
           from.lerp(curve.values[idx], (time - keys[idx - 1]) / (keys[idx] - keys[idx - 1]));
           values[i] = from;
       }
    }
    curve.values = values;
}

function convertToWorldSpace (convertedData: ConvertedData, path: string, props: IObjectCurveData) {
    const oPos = props.position.values;
    const oRot = props.rotation.values;
    const oScale = props.scale.values;
    const matrix = oPos.map(() => new Mat4());
    const idx = path.lastIndexOf('/');
    let pMatrix: Mat4[] | null = null;
    if (idx > 0) {
        const name = path.substring(0, idx);
        const data = convertedData[name];
        if (!data || !data.props) { console.warn('no data for parent bone?'); return; }
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
    props._worldMatrix = { keys: 0, interpolate: false, values: matrix };
}

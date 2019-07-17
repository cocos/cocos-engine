
/**
 * @category animation
 */

import { SkinningModelComponent } from '../3d/framework/skinning-model-component';
import { ccclass } from '../core/data/class-decorator';
import { quat, vec3 } from '../core/vmath';
import { Node } from '../scene-graph';
import { AnimationClip, ICurveData, IObjectCurveData, IPropertyCurve } from './animation-clip';
import { IPropertyCurveData } from './animation-curve';

/**
 * 骨骼动画剪辑。
 */
@ccclass('cc.SkeletalAnimationClip')
export class SkeletalAnimationClip extends AnimationClip {

    public convertedData: ICurveData = {};
    protected _converted = false;

    public getPropertyCurves (root: Node): ReadonlyArray<IPropertyCurve> {
        this._convertToSkeletalCurves(root);
        return super.getPropertyCurves(root);
    }

    public onPlay = (root: Node) => {
        for (const comp of root.getComponentsInChildren(SkinningModelComponent)) {
            comp.uploadAnimationClip(this);
        }
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
        const data = this.curveDatas[name];
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
            vec3.multiply(T, T, parentS);
            vec3.transformQuat(T, T, parentR);
            vec3.add(T, T, parentT);
            quat.multiply(R, parentR, R);
            vec3.multiply(S, parentS, S);
        }
    }

    private _convertToSkeletalCurves (root: Node) {
        if (this._converted) { return; }
        // sort the keys to make sure parent bone always comes first
        const paths = Object.keys(this.curveDatas).sort();
        for (const path of paths) {
            const nodeData = this.curveDatas[path];
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
        this.convertedData = this.curveDatas;
        // convert to SkinningModelComponent.fid animation
        this.curveDatas = {};
        const values = [...Array(Math.ceil(this.sample * this._duration))].map((_, i) => i);
        root.getComponentsInChildren(SkinningModelComponent).map((comp) => {
            let node: Node | null = comp.node;
            let path = '';
            while (node !== null && node !== root) {
                path = `${node.name}/${path}`;
                node = node.parent;
            }
            return path.slice(0, -1);
        }).forEach((path) => {
            this.curveDatas[path] = { comps: { 'cc.SkinningModelComponent': { frameID: { keys: 0, values, interpolate: false } } } };
        });
        this._keys = [values.map((_, i) => i / this.sample)];
        this._converted = true;
    }
}

cc.SkeletalAnimationClip = SkeletalAnimationClip;


/**
 * @category animation
 */

import { IBindTRS } from '../3d/assets/skeleton';
import { SkinningModelComponent } from '../3d/framework/skinning-model-component';
import { ccclass, property } from '../core/data/class-decorator';
import { quat, vec3 } from '../core/vmath';
import { Node } from '../scene-graph';
import { AnimationClip, ICurveData, IObjectCurveData, IPropertyCurve } from './animation-clip';
import { IPropertyCurveData } from './animation-curve';

/**
 * 骨骼动画剪辑。
 */
@ccclass('cc.SkeletalAnimationClip')
export class SkeletalAnimationClip extends AnimationClip {

    @property
    public aggressiveCaching = true;

    protected _backedUp = false;
    protected _backUpCurves: ICurveData = {};

    public getPropertyCurves (root: Node): ReadonlyArray<IPropertyCurve> {
        if (this.aggressiveCaching) { this._convertToSkeletalCurves(root); }
        return super.getPropertyCurves(root);
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
        // sort the keys to make sure parent bone always comes first
        const paths = Object.keys(this.curveDatas).sort();
        if (!this._backedUp) { // only need to do these once
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
            this._backUpCurves = JSON.parse(JSON.stringify(this.curveDatas));
            this._keys = [[...Array(Math.ceil(this.sample * this._duration))].map((_, i) => i / this.sample)];
            this._backedUp = true;
        }
        // skeleton specific optimizations
        const comps = root.getComponentsInChildren(SkinningModelComponent);
        for (const path of paths) {
            const nodeData = this.curveDatas[path];
            if (!nodeData.props) { continue; }
            let bindpose: IBindTRS | null = null;
            for (const comp of comps) {
                const skeleton = comp.skeleton;
                if (!skeleton) { continue; }
                const idx = skeleton.joints.findIndex((j) => j === path);
                if (idx < 0) { continue; }
                bindpose = skeleton.bindTRS[idx];
                break;
            }
            if (!bindpose) { continue; }
            const props = this._backUpCurves[path].props!;
            const bPos = props.position.values;
            const bRot = props.rotation.values;
            const bScale = props.scale.values;
            const position = nodeData.props.position.values;
            const rotation = nodeData.props.rotation.values;
            const scale = nodeData.props.scale.values;
            for (let i = 0; i < position.length; i++) {
                const backupT = bPos[i];
                const backupR = bRot[i];
                const backupS = bScale[i];
                const T = position[i];
                const R = rotation[i];
                const S = scale[i];
                vec3.multiply(T, bindpose.position, backupS);
                vec3.transformQuat(T, T, backupR);
                vec3.add(T, T, backupT);
                quat.multiply(R, backupR, bindpose.rotation);
                vec3.multiply(S, backupS, bindpose.scale);
            }
        }
    }
}

cc.SkeletalAnimationClip = SkeletalAnimationClip;

import { Vec2, Vec3, clamp } from '../../math';
import { property } from '../../data/class-decorator';
import { IBlenderTemplate } from './blender-base';
import { ccenum } from '../../value-types/enum';
import { instantiateSymbol } from './instantiate-symbol';

export enum Algorithm {
    simpleDirectional,
    freeformCartesian,
    freeformDirectional,
}

ccenum(Algorithm);

export class Blender2DTemplate implements IBlenderTemplate {
    @property
    public algorithm = Algorithm.simpleDirectional;

    @property
    public value: Vec2 = new Vec2();

    @property([Vec2])
    private _thresholds: Vec2[] = [];

    constructor (thresholds: readonly Vec2[], algorithm: Algorithm) {
        this.algorithm = algorithm;
        this.thresholds = thresholds;
    }

    @property
    get thresholds () {
        return this._thresholds;
    }

    set thresholds (thresholds: readonly Vec2[]) {
        this._thresholds = thresholds.slice().map((threshold) => threshold.clone());
    }

    public [instantiateSymbol] () {
        return new Blender2D(this);
    }
}

export class Blender2D {
    private _data: Readonly<Blender2DTemplate>;
    private _weights: number[] = [];
    private _value: Vec2;

    constructor (data: Readonly<Blender2DTemplate>) {
        this._data = data;
        this._value = data.value.clone();
        this._weights = new Array(data.thresholds.length).fill(0);
        this.setValue(this._value);
    }

    get weights () {
        return this._weights;
    }

    public setValue (value: Readonly<Vec2>) {
        for (let i = 0; i < this._weights.length; ++i) {
            this._weights[i] = 0;
        }
        switch (this._data.algorithm) {
            case Algorithm.simpleDirectional:
                this._sampleSimpleDirectional(value);
                break;
            case Algorithm.freeformCartesian:
                this._sampleFreeformCartesian(value);
                break;
            case Algorithm.freeformDirectional:
                this._sampleFreeformDirectional(value);
                break;
        }
    }

    private _sampleSimpleDirectional (value: Readonly<Vec2>) {
        const closestSamples = this._sdGetClosestAngleThresholds(value);
        const nodeInfluences = calcInfluence(value, this._data.thresholds[closestSamples.first], this._data.thresholds[closestSamples.second]);
        // Node influence part
        const nodeInfluencePartUnclamped = nodeInfluences.t1 + nodeInfluences.t2;
        const nodeInfluencePart = clamp(nodeInfluencePartUnclamped, 0, 1);
        this._weights[closestSamples.first] = nodeInfluences.t1 / nodeInfluencePartUnclamped * nodeInfluencePart;
        this._weights[closestSamples.second] = nodeInfluences.t2 / nodeInfluencePartUnclamped * nodeInfluencePart;
        // Center influence part
        if (nodeInfluencePart < 1) {
            const centerInfluencePart = 1 - nodeInfluencePart;
            if (closestSamples.center >= 0) {
                this._weights[closestSamples.center] = centerInfluencePart;
            } else {
                const average = centerInfluencePart / this._weights.length;
                for (let i = 0; i < this._weights.length; ++i) {
                    this._weights[i] += average;
                }
            }
        }
    }

    private _sampleFreeformCartesian (value: Readonly<Vec2>) {
        this._sampleFreeformX(value, cartesianInfluenceFx);
    }

    private _sampleFreeformDirectional (value: Readonly<Vec2>) {
        this._sampleFreeformX(value, directionalInfluenceFx);
    }

    private _sdGetClosestAngleThresholds (value: Vec2) {
        // atan2 返回的角度是[-180, 180]，四个象限的角度范围（逆时针）分别是[0,90]、[90,180]、[-180,-90]、[-90,0]
        const angleQueriedPoint = Math.atan2(value.y, value.x);
        const dangles: Array<{ index: number; dangle: number }> = [];
        let center = -1;
        for (let iThreshold = 0; iThreshold < this._data.thresholds.length; ++iThreshold) {
            const threshold = this._data.thresholds[iThreshold];
            if (Vec2.equals(threshold, Vec2.ZERO)) {
                center = iThreshold;
                continue;
            }
            const angle = Math.atan2(threshold.y, threshold.x);
            const dangle = repeat(angle - angleQueriedPoint, 2 * Math.PI);
            dangles.push({ index: iThreshold, dangle: dangle });
        }
        dangles.sort((a, b) => a.dangle - b.dangle);
        return { first: dangles[0].index, second: dangles[dangles.length - 1].index, center: center };
    }

    private _sampleFreeformX = (() => {
        return function (this: Blender2D, value: Vec2, influenceFx: InfluenceFx) {
            const hiList: number[] = [];
            let hiSum = 0;
            const pip = new Vec2(0, 0);
            const pipj = new Vec2(0, 0);
            this._data.thresholds.forEach((pi, ii) => {
                let hi = Number.MAX_VALUE;
                this._data.thresholds.forEach((pj, ij) => {
                    if (ij == ii) {
                        return;
                    }
                    influenceFx(value, pi, pj, pip, pipj);
                    const t = 1 - Vec2.dot(pip, pipj) / Vec2.lengthSqr(pipj);
                    if (t < 0) {
                        hi = 0;
                        return;
                    }
                    //t = clamp(t, 0, 1);
                    if (t < hi) {
                        hi = t;
                    }
                });
                hiList.push(hi);
                hiSum += hi;
            });
            hiList.forEach((hi, index) => this._weights[index] = hi / hiSum);
        };
    })();
}

function repeat (t: number, length: number) {
    return clamp(t - Math.floor(t / length) * length, 0, length);
}

function calcInfluence (point: Vec2, first: Vec2, second: Vec2) {
    // Satisfy:
    //	pQueried = firstSample * t1 + secondSample * t2
    //  Because the variables are all vec2, so it can be solved.
    // |  firstSample.x   secondSample.x |         |t1|       |pQueried.x|
    // |                                 |    x    |  |   =   ||
    // |  firstSample.y   secondSample.y |         |t2|       |pQueried.y|
    const x1 = first.x, y1 = first.y, x2 = second.x, y2 = second.y;
    // Calculate the determinant
    let det = x1 * y2 - x2 * y1;
    if (!det)
        return { t1: 0, t2: 0 };
    det = 1.0 / det;
    // The inverse matrix
    const inv00 = y2 * det;
    const inv10 = -y1 * det;
    const inv01 = -x2 * det;
    const inv11 = x1 * det;
    let t1 = inv00 * point.x + inv01 * point.y;
    let t2 = inv10 * point.x + inv11 * point.y;
    if (t1 < 0 || t2 < 0)
        t1 = t2 = 0.5;
    return { t1: t1, t2: t2 };
}

type InfluenceFx = (point: Vec2, pi: Vec2, pj: Vec2, pip: Vec2, pipj: Vec2) => void;

const cartesianInfluenceFx: InfluenceFx = (point, pi, pj, pip, pipj) => {
    Vec2.subtract(pip, point, pi);
    Vec2.subtract(pipj, pj, pi);
};

const directionalInfluenceFx = ((): InfluenceFx => {
    const axis = new Vec3(0, 0, 0); // buffer for axis
    const tmpV3 = new Vec3(0, 0, 0); // buffer for temp vec3
    const pQueriedProjected = new Vec3(0, 0, 0); // buffer for pQueriedProjected
    const pi3 = new Vec3(0, 0, 0); // buffer for pi3
    const pj3 = new Vec3(0, 0, 0); // buffer for pj3
    const pQueried3 = new Vec3(0, 0, 0); // buffer for pQueried3
    return (pQueried, pi, pj, pip, pipj) => {
        let aIJ = 0.0;
        let aIQ = 0.0;
        let angleMultiplier = 2.0;
        Vec3.set(pQueriedProjected, pQueried.x, pQueried.y, 0.0);
        if (Vec2.equals(pi, Vec2.ZERO)) {
            aIJ = Vec2.angle(pQueried, pj);
            aIQ = 0.0;
            angleMultiplier = 1.0;
        } else if (Vec2.equals(pj, Vec2.ZERO)) {
            aIJ = Vec2.angle(pQueried, pi);
            aIQ = aIJ;
            angleMultiplier = 1.0;
        } else {
            aIJ = Vec2.angle(pi, pj);
            if (aIJ <= 0.0) {
                aIQ = 0.0;
            } else if (Vec2.equals(pQueried, Vec2.ZERO)) {
                aIQ = aIJ;
            } else {
                Vec3.set(pi3, pi.x, pi.y, 0);
                Vec3.set(pj3, pj.x, pj.y, 0);
                Vec3.set(pQueried3, pQueried.x, pQueried.y, 0);
                Vec3.cross(axis, pi3, pj3);
                Vec3.projectOnPlane(pQueriedProjected, pQueried3, axis);
                aIQ = Vec3.angle(pi3, pQueriedProjected);
                if (aIJ < Math.PI * 0.99) {
                    if (Vec3.dot(Vec3.cross(tmpV3, pi3, pQueriedProjected), axis) < 0) {
                        aIQ = -aIQ;
                    }
                }
            }
        }
        const lenpi = Vec2.len(pi);
        const lenpj = Vec2.len(pj);
        const deno = (lenpj + lenpi) / 2;
        Vec2.set(pipj, (lenpj - lenpi) / deno, aIJ * angleMultiplier);
        Vec2.set(pip, (Vec3.len(pQueriedProjected) - lenpi) / deno, aIQ * angleMultiplier);
    };
})();


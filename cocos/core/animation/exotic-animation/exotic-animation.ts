import { EDITOR } from 'internal:constants';
import { binarySearchEpsilon } from '../../algorithm/binary-search';
import { ccclass, serializable } from '../../data/decorators';
import { assertIsTrue } from '../../data/utils/asserts';
import { Quat, Vec3 } from '../../math';
import { error } from '../../platform/debug';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { Binder, RuntimeBinding, TrackBinding, TrackPath } from '../tracks/track';

/**
 * Animation that:
 * - does not exposed by users;
 * - does not compatible with regular animation;
 * - non-editable;
 * - currently only generated imported from model file.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticAnimation`)
export class ExoticAnimation {
    public createEvaluator (binder: Binder) {
        return new ExoticTrsAnimationEvaluator(this._nodeAnimations, binder);
    }

    public addNodeAnimation (path: string) {
        const nodeAnimation = new ExoticNodeAnimation(path);
        this._nodeAnimations.push(nodeAnimation);
        return nodeAnimation;
    }

    public collectAnimatedJoints () {
        return Array.from(new Set(this._nodeAnimations.map(({ path }) => path)));
    }

    public split (from: number, to: number) {
        if (!EDITOR) {
            // TODO: better handling
            error(`split() only valid in Editor.`);
            return this;
        }
        const newAnimation = new ExoticAnimation();
        newAnimation._nodeAnimations = this._nodeAnimations.map((nodeAnimation) => nodeAnimation.split(from, to));
        return newAnimation;
    }

    @serializable
    private _nodeAnimations: ExoticNodeAnimation[] = [];
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticNodeAnimation`)
class ExoticNodeAnimation {
    constructor (path: string) {
        this._path = path;
    }

    public createPosition (times: FloatArray, values: FloatArray) {
        this._position = new ExoticVec3Track(times, values);
    }

    public createRotation (times: FloatArray, values: FloatArray) {
        this._rotation = new ExoticQuatTrack(times, values);
    }

    public createScale (times: FloatArray, values: FloatArray) {
        this._scale = new ExoticVec3Track(times, values);
    }

    public createEvaluator (binder: Binder) {
        return new ExoticNodeAnimationEvaluator(
            this._path,
            this._position,
            this._rotation,
            this._scale,
            binder,
        );
    }

    public split (from: number, to: number) {
        if (!EDITOR) {
            // TODO: better handling
            error(`split() only valid in Editor.`);
            return this;
        }
        const newAnimation = new ExoticNodeAnimation(this._path);
        const {
            _position: position,
            _rotation: rotation,
            _scale: scale,
        } = this;
        if (position) {
            newAnimation._position = position.split(from, to);
        }
        if (rotation) {
            newAnimation._rotation = rotation.split(from, to);
        }
        if (scale) {
            newAnimation._scale = scale.split(from, to);
        }
        return newAnimation;
    }

    get path () {
        return this._path;
    }

    @serializable
    private _path = '';

    @serializable
    private _position: ExoticVec3Track | null = null;

    @serializable
    private _rotation: ExoticQuatTrack | null = null;

    @serializable
    private _scale: ExoticVec3Track | null = null;
}

interface ExoticTrackValues<TValue extends Vec3 | Quat> {
    get (index: number, resultValue: TValue): void;

    lerp(prevIndex: number,
        nextIndex: number,
        ratio: number,
        prevValue: TValue,
        nextValue: TValue,
        resultValue: TValue): void;
}

type MayBeQuantized = FloatArray | QuantizedFloatArray;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticVec3TrackValues`)
class ExoticVec3TrackValues implements ExoticTrackValues<Vec3> {
    constructor (values: FloatArray) {
        this._values = values;
        this._isQuantized = false;
    }

    public quantize (type: QuantizationType) {
        assertIsTrue(!this._isQuantized);
        this._values = quantize(this._values as FloatArray, type);
        this._isQuantized = true;
    }

    public get (index: number, resultValue: Vec3): void {
        const {
            _values: values,
            _isQuantized: isQuantized,
        } = this;
        if (isQuantized) {
            loadVec3FromQuantized(values as QuantizedFloatArray, index, resultValue);
        } else {
            Vec3.fromArray(resultValue, values as FloatArray, index * 3);
        }
    }

    public lerp (
        prevIndex: number,
        nextIndex: number,
        ratio: number,
        prevValue: Vec3,
        nextValue: Vec3,
        resultValue: Vec3,
    ): void {
        const {
            _values: values,
            _isQuantized: isQuantized,
        } = this;
        if (isQuantized) {
            loadVec3FromQuantized(values as QuantizedFloatArray, prevIndex, prevValue);
            loadVec3FromQuantized(values as QuantizedFloatArray, nextIndex, nextValue);
        } else {
            Vec3.fromArray(prevValue, values as FloatArray, prevIndex * 3);
            Vec3.fromArray(nextValue, values as FloatArray, nextIndex * 3);
        }
        Vec3.lerp(resultValue, prevValue, nextValue, ratio);
    }

    @serializable
    private _values: MayBeQuantized;

    @serializable
    private _isQuantized: boolean;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticVec3Track`)
class ExoticVec3Track {
    constructor (times: FloatArray, values: FloatArray) {
        this._times = times;
        this._values = new ExoticVec3TrackValues(values);
    }

    public createEvaluator () {
        return new ExoticTrackEvaluator<Vec3>(
            this._times,
            this._values,
            Vec3,
        );
    }

    public split (from: number, to: number) {
        if (!EDITOR) {
            // TODO: better handling
            error(`split() only valid in Editor.`);
            return this;
        }
        return this;
    }

    @serializable
    private _times: FloatArray;

    @serializable
    private _values: ExoticVec3TrackValues;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticQuatTrackValues`)
class ExoticQuatTrackValues implements ExoticTrackValues<Quat> {
    constructor (values: FloatArray) {
        this._values = values;
        this._isQuantized = false;
    }

    public quantize (type: QuantizationType) {
        assertIsTrue(!this._isQuantized);
        this._values = quantize(this._values as FloatArray, type);
        this._isQuantized = true;
    }

    public get (index: number, resultValue: Quat): void {
        const {
            _values: values,
            _isQuantized: isQuantized,
        } = this;
        if (isQuantized) {
            loadQuatFromQuantized(values as QuantizedFloatArray, index, resultValue);
        } else {
            Quat.fromArray(resultValue, values as FloatArray, index * 4);
        }
    }

    public lerp (
        prevIndex: number,
        nextIndex: number,
        ratio: number,
        prevValue: Quat,
        nextValue: Quat,
        resultValue: Quat,
    ): void {
        const {
            _values: values,
            _isQuantized: isQuantized,
        } = this;
        if (isQuantized) {
            loadQuatFromQuantized(values as QuantizedFloatArray, prevIndex, prevValue);
            loadQuatFromQuantized(values as QuantizedFloatArray, nextIndex, nextValue);
        } else {
            Quat.fromArray(prevValue, values as FloatArray, prevIndex * 4);
            Quat.fromArray(nextValue, values as FloatArray, nextIndex * 4);
        }
        Quat.slerp(resultValue, prevValue, nextValue, ratio);
    }

    @serializable
    private _values: FloatArray | QuantizedFloatArray;

    @serializable
    private _isQuantized: boolean;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticQuatTrack`)
class ExoticQuatTrack {
    constructor (times: FloatArray, values: FloatArray) {
        this._times = times;
        this._values = new ExoticQuatTrackValues(values);
    }

    public createEvaluator () {
        return new ExoticTrackEvaluator<Quat>(
            this._times,
            this._values,
            Quat,
        );
    }

    public split (from: number, to: number) {
        if (!EDITOR) {
            // TODO: better handling
            error(`split() only valid in Editor.`);
            return this;
        }
        return this;
    }

    @serializable
    private _times: FloatArray;

    @serializable
    private _values: ExoticQuatTrackValues;
}

class ExoticTrsAnimationEvaluator {
    constructor (nodeAnimations: ExoticNodeAnimation[], binder: Binder) {
        this._nodeEvaluations = nodeAnimations.map((nodeAnimation) => nodeAnimation.createEvaluator(binder));
    }

    public evaluate (time: number) {
        this._nodeEvaluations.forEach((nodeEvaluator) => {
            nodeEvaluator.evaluate(time);
        });
    }

    private _nodeEvaluations: ExoticNodeAnimationEvaluator[];
}

class ExoticNodeAnimationEvaluator {
    constructor (
        path: string,
        position: ExoticVec3Track | null,
        rotation: ExoticQuatTrack | null,
        scale: ExoticVec3Track | null,
        binder: Binder,
    ) {
        if (position) {
            this._position = createExoticTrackEvaluationRecord(position, path, 'position', binder);
        }
        if (rotation) {
            this._rotation = createExoticTrackEvaluationRecord(rotation, path, 'rotation', binder);
        }
        if (scale) {
            this._scale = createExoticTrackEvaluationRecord(scale, path, 'scale', binder);
        }
    }

    public evaluate (time: number) {
        if (this._position) {
            const value = this._position.evaluator.evaluate(time);
            this._position.runtimeBinding.setValue(value);
        }
        if (this._rotation) {
            const value = this._rotation.evaluator.evaluate(time);
            this._rotation.runtimeBinding.setValue(value);
        }
        if (this._scale) {
            const value = this._scale.evaluator.evaluate(time);
            this._scale.runtimeBinding.setValue(value);
        }
    }

    private _position: ExoticTrackEvaluationRecord<Vec3> | null = null;
    private _rotation: ExoticTrackEvaluationRecord<Quat> | null = null;
    private _scale: ExoticTrackEvaluationRecord<Vec3> | null = null;
}

class ExoticTrackEvaluator<TValue extends Vec3 | Quat> {
    constructor (times: FloatArray, values: ExoticTrackValues<TValue>, ValueConstructor: new () => TValue) {
        this._times = times;
        this._values = values;
        this._prevValue = new ValueConstructor();
        this._nextValue = new ValueConstructor();
        this._resultValue = new ValueConstructor();
    }

    public evaluate (time: number) {
        const {
            _times: times,
            _values: values,
            _resultValue: resultValue,
        } = this;

        const nFrames = times.length;

        if (nFrames === 0) {
            return resultValue;
        }

        const inputSampleResult = sampleInput(times, time, this._inputSampleResultCache);
        if (inputSampleResult.just) {
            values.get(inputSampleResult.index, resultValue);
        } else {
            values.lerp(
                inputSampleResult.index,
                inputSampleResult.nextIndex,
                inputSampleResult.ratio,
                this._prevValue,
                this._nextValue,
                resultValue,
            );
        }

        return resultValue;
    }

    private _times: FloatArray;
    private _inputSampleResultCache: InputSampleResult = {
        just: false,
        index: -1,
        nextIndex: -1,
        ratio: 0.0,
    };
    private _values: ExoticTrackValues<TValue>;
    private _prevValue: TValue;
    private _nextValue: TValue;
    private _resultValue: TValue;
}

interface ExoticTrackEvaluationRecord<TValue extends Vec3 | Quat> {
    runtimeBinding: RuntimeBinding;
    evaluator: ExoticTrackEvaluator<TValue>;
}

interface InputSampleResult {
    just: boolean;
    index: number;
    nextIndex: number;
    ratio: number;
}

function sampleInput (values: FloatArray, time: number, result: InputSampleResult) {
    const nFrames = values.length;
    assertIsTrue(nFrames !== 0);

    const firstTime = values[0];
    const lastTime = values[nFrames - 1];
    if (time < firstTime) {
        result.just = true;
        result.index = 0;
    } else if (time > lastTime) {
        result.just = true;
        result.index = nFrames - 1;
    } else {
        const index = binarySearchEpsilon(values, time);
        if (index >= 0) {
            result.just = true;
            result.index = index;
        } else {
            const nextIndex = ~index;
            assertIsTrue(nextIndex !== 0 && nextIndex !== nFrames && nFrames > 1);
            const prevIndex = nextIndex - 1;
            const prevTime = values[prevIndex];
            const nextTime = values[nextIndex];
            const ratio = (time - values[prevIndex]) / (nextTime - prevTime);
            result.just = false;
            result.index = prevIndex;
            result.nextIndex = nextIndex;
            result.ratio = ratio;
        }
    }

    return result;
}

type UintArray = Uint8Array | Uint16Array | Uint32Array;

type FloatArray = Float32Array | Float64Array;

type UintArrayConstructor = Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor;

type IntArrayConstructor = Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor;

type QuantizationType = 'uint8' | 'uint16';

type QuantizationArrayConstructor = Uint8ArrayConstructor | Uint16ArrayConstructor;

const QUANTIZATION_TYPE_TO_ARRAY_VIEW_CONSTRUCTOR_MAP: Record<QuantizationType, QuantizationArrayConstructor> = {
    uint8: Uint8Array,
    uint16: Uint16Array,
};

@ccclass(`${CLASS_NAME_PREFIX_ANIM}QuantizedFloatArray`)
class QuantizedFloatArray {
    @serializable
    public min!: number;

    @serializable
    public extent!: number;

    @serializable
    public values!: UintArray;

    constructor (values: UintArray, extent: number, min = 0.0) {
        this.values = values;
        this.extent = extent;
        this.min = min;
    }
}

function quantize (values: FloatArray, type: QuantizationType) {
    const TypedArrayViewConstructor = QUANTIZATION_TYPE_TO_ARRAY_VIEW_CONSTRUCTOR_MAP[type];
    const MAX = 1 << TypedArrayViewConstructor.BYTES_PER_ELEMENT;
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    values.forEach((value) => {
        min = Math.min(value, min);
        max = Math.max(value, max);
    });
    const extent = max - min;
    // Should consider `extent === 0.0`.
    const normalized = TypedArrayViewConstructor.from(values, (value) => (value - min) / extent * MAX);
    return new QuantizedFloatArray(normalized, extent, min);
}

function indexQuantized (quantized: QuantizedFloatArray, index: number) {
    const quantizedValue = quantized.values[index];
    const MAX_VALUE = 1 << quantized.values.BYTES_PER_ELEMENT;
    return quantizedValue / MAX_VALUE * quantized.extent + quantized.min;
}

function createExoticTrackEvaluationRecord<T extends ExoticVec3Track | ExoticQuatTrack> (
    track: T,
    path: string,
    property: 'position' | 'scale' | 'rotation',
    binder: Binder,
) {
    const trackBinding = new TrackBinding();
    trackBinding.path = new TrackPath().hierarchy(path).property(property);
    const runtimeBinding = binder(trackBinding);
    if (!runtimeBinding) {
        return null;
    }
    const evaluator =  track.createEvaluator();
    return {
        runtimeBinding,
        evaluator,
    } as (T extends ExoticVec3Track ? ExoticTrackEvaluationRecord<Vec3> : ExoticTrackEvaluationRecord<Quat>);
}

function loadVec3FromQuantized (values: QuantizedFloatArray, index: number, out: Vec3) {
    Vec3.set(
        out,
        indexQuantized(values, 3 * index + 0),
        indexQuantized(values, 3 * index + 1),
        indexQuantized(values, 3 * index + 2),
    );
}

function loadQuatFromQuantized (values: QuantizedFloatArray, index: number, out: Quat) {
    Quat.set(
        out,
        indexQuantized(values, 4 * index + 0),
        indexQuantized(values, 4 * index + 1),
        indexQuantized(values, 4 * index + 2),
        indexQuantized(values, 4 * index + 3),
    );
}

import { ccclass, editable, serializable, type } from 'cc.decorator';
import { removeIf } from '../../core/utils/array';
import { AnimationClip } from '../animation-clip';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { AnimationGraph } from './animation-graph';
import { AnimationGraphLike } from './animation-graph-like';
import { ReadonlyClipOverrideMap } from './graph-eval';

/**
 * @en
 * An opacity type which denotes what the animation graph variant seems like outside the engine.
 * @zh
 * 一个非透明的类型，它是动画图变体在引擎外部的表示。
 */
export interface AnimationGraphVariantRunTime {
    /**
     * @internal
     */
    readonly __brand: 'AnimationGraphVariant';
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ClipOverrideEntry`)
class ClipOverrideEntry {
    @serializable
    public original: AnimationClip = null!;

    @serializable
    public substitution: AnimationClip = null!;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationGraphVariant`)
export class AnimationGraphVariant extends AnimationGraphLike implements AnimationGraphVariantRunTime {
    declare __brand: 'AnimationGraphVariant';

    @type(AnimationGraph)
    @editable
    get original () {
        return this._graph;
    }

    set original (value) {
        this._graph = value;
    }

    get clipOverrides (): ClipOverrideMap {
        return this._clipOverrides;
    }

    @serializable
    private _graph: AnimationGraph | null = null;

    @serializable
    private _clipOverrides: ClipOverrideMap = new ClipOverrideMap();
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ClipOverrideMap`)
class ClipOverrideMap implements ReadonlyClipOverrideMap {
    get size () {
        return this._entries.length;
    }

    public [Symbol.iterator] () {
        return this._entries[Symbol.iterator]();
    }

    public has (original: AnimationClip) {
        return !!this._entries.find(({ original: o }) => o === original);
    }

    public get (original: AnimationClip) {
        const entry = this._entries.find(({ original: o }) => o === original);
        return entry?.substitution;
    }

    public set (original: AnimationClip, substitution: AnimationClip) {
        const entry = this._entries.find(({ original: o }) => o === original);
        if (entry) {
            entry.substitution = substitution;
        } else {
            const newEntry = new ClipOverrideEntry();
            newEntry.original = original;
            newEntry.substitution = substitution;
            this._entries.push(newEntry);
        }
    }

    public delete (original: AnimationClip) {
        removeIf(this._entries, ({ original: o }) => o === original);
    }

    public clear () {
        this._entries.length = 0;
    }

    @serializable
    private _entries: ClipOverrideEntry[] = [];
}

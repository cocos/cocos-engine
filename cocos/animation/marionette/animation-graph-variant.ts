/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, editable, serializable, type } from 'cc.decorator';
import { removeIf } from '../../core/utils/array';
import { AnimationClip } from '../animation-clip';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { AnimationGraph } from './animation-graph';
import { AnimationGraphLike } from './animation-graph-like';
import type { ReadonlyClipOverrideMap } from './clip-overriding';

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
    get original (): AnimationGraph | null {
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
    get size (): number {
        return this._entries.length;
    }

    public [Symbol.iterator] (): IterableIterator<ClipOverrideEntry> {
        return this._entries[Symbol.iterator]();
    }

    public has (original: AnimationClip): boolean {
        return !!this._entries.find(({ original: o }) => o === original);
    }

    public get (original: AnimationClip): AnimationClip | undefined {
        const entry = this._entries.find(({ original: o }) => o === original);
        return entry?.substitution;
    }

    public set (original: AnimationClip, substitution: AnimationClip): void {
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

    public delete (original: AnimationClip): void {
        removeIf(this._entries, ({ original: o }) => o === original);
    }

    public clear (): void {
        this._entries.length = 0;
    }

    @serializable
    private _entries: ClipOverrideEntry[] = [];
}

/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import spine from './lib/spine-core.js';

let _listener_ID = 0;

type TrackListener = (x: spine.TrackEntry) => void;
type TrackListener2 = (x: spine.TrackEntry, ev: spine.Event) => void;

type CommonTrackEntryListener = TrackListener | TrackListener2;
export class TrackEntryListeners {
    start?: ((entry: spine.TrackEntry) => void);
    interrupt?: ((entry: spine.TrackEntry) => void);
    end?: ((entry: spine.TrackEntry) => void);
    dispose?: ((entry: spine.TrackEntry) => void);
    complete?: ((entry: spine.TrackEntry) => void);
    event?: ((entry: spine.TrackEntry, event: spine.Event) => void);

    static getListeners (entry: spine.TrackEntry) {
        if (!entry.listener) {
            entry.listener = new TrackEntryListeners() as any;
        }
        return entry.listener;
    }

    static emitListener (id: number, entry: spine.TrackEntry, event: spine.Event): void {
        const listener = TrackEntryListeners._listenerSet.get(id);
        if (!listener) return;
        const listener2 = listener as TrackListener2;
        if (listener2) {
            listener2(entry, event);
        }
    }

    static addListener (listener: CommonTrackEntryListener): number {
        const id = ++_listener_ID;
        TrackEntryListeners._listenerSet.set(id, listener);
        return id;
    }

    private static _listenerSet = new Map<number, CommonTrackEntryListener>();
}

globalThis.TrackEntryListeners = TrackEntryListeners;

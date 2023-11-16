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
import { warn } from '../core';

let _listener_ID = 0;
let _track_ID = 0;

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

    static getListeners (entry: spine.TrackEntry, instance: spine.SkeletonInstance): spine.AnimationStateListener {
        if (!entry.listener) {
            entry.listener = new TrackEntryListeners() as any;
            const id = ++_track_ID;
            instance.setTrackEntryListener(id, entry);
            TrackEntryListeners._trackSet.set(id, entry);
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

    static emitTrackEntryListener (id: number, entry: spine.TrackEntry, event: spine.Event, eventType: spine.EventType): void {
        const curTrack = this._trackSet.get(id);
        if (!curTrack) return;
        switch (eventType) {
        case spine.EventType.start:
            if (curTrack.listener.start) {
                curTrack.listener.start(entry);
            }
            break;
        case spine.EventType.interrupt:
            if (curTrack.listener.interrupt) {
                curTrack.listener.interrupt(entry);
            }
            break;
        case spine.EventType.end:
            if (curTrack.listener.end) {
                curTrack.listener.end(entry);
            }
            break;
        case spine.EventType.dispose:
            if (curTrack.listener.dispose) {
                curTrack.listener.dispose(entry);
            }
            this._trackSet.delete(id);
            curTrack.listener = null as any;
            break;
        case spine.EventType.complete:
            if (curTrack.listener.complete) {
                curTrack.listener.complete(entry);
            }
            break;
        case spine.EventType.event:
            if (curTrack.listener.event) {
                curTrack.listener.event(entry, event);
            }
            break;
        default:
            warn('TrackEntry doesn\'t handled', eventType);
            break;
        }
    }

    static addListener (listener: CommonTrackEntryListener): number {
        const id = ++_listener_ID;
        TrackEntryListeners._listenerSet.set(id, listener);
        return id;
    }

    private static _listenerSet = new Map<number, CommonTrackEntryListener>();
    private static _trackSet = new Map<number, spine.TrackEntry>();
}

globalThis.TrackEntryListeners = TrackEntryListeners;

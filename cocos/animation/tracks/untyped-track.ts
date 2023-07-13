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

import { ccclass, serializable } from 'cc.decorator';
import { RealCurve, Color, Size, Vec2, Vec3, Vec4, getError } from '../../core';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import { IValueProxyFactory } from '../value-proxy';
import { ColorTrack, ColorTrackEval } from './color-track';
import { SizeTrackEval } from './size-track';
import { Channel, RealChannel, Track, TrackEval, TrackPath } from './track';
import { Vec2TrackEval, Vec3TrackEval, Vec4TrackEval, VectorTrack } from './vector-track';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}UntypedTrackChannel`)
class UntypedTrackChannel extends Channel<RealCurve> {
    @serializable
    public property = '';

    constructor () {
        super(new RealCurve());
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}UntypedTrack`)
export class UntypedTrack extends Track {
    @serializable
    private _channels: UntypedTrackChannel[] = [];

    public channels (): UntypedTrackChannel[] {
        return this._channels;
    }

    public [createEvalSymbol] (): TrackEval<unknown> {
        throw new Error(`UntypedTrack should be handled specially. Please file an issue.`);
    }

    /**
     * @internal
     */
    public createLegacyEval (hintValue?: unknown): Vec2TrackEval | Vec3TrackEval | Vec4TrackEval | ColorTrackEval | SizeTrackEval {
        const trySearchCurve = (property: string): RealCurve | undefined => this._channels.find((channel): boolean => channel.property === property)?.curve;
        switch (true) {
        default:
            throw new Error(getError(3931));
        case hintValue instanceof Vec2:
            return new Vec2TrackEval(
                trySearchCurve('x'),
                trySearchCurve('y'),
            );
        case hintValue instanceof Vec3:
            return new Vec3TrackEval(
                trySearchCurve('x'),
                trySearchCurve('y'),
                trySearchCurve('z'),
            );
        case hintValue instanceof Vec4:
            return new Vec4TrackEval(
                trySearchCurve('x'),
                trySearchCurve('y'),
                trySearchCurve('z'),
                trySearchCurve('w'),
            );
        case hintValue instanceof Color:
            // TODO: what if x, y, z, w?
            return new ColorTrackEval(
                trySearchCurve('r'),
                trySearchCurve('g'),
                trySearchCurve('b'),
                trySearchCurve('a'),
            );
        case hintValue instanceof Size:
            return new SizeTrackEval(
                trySearchCurve('width'),
                trySearchCurve('height'),
            );
        }
    }

    public addChannel (property: string): UntypedTrackChannel {
        const channel = new UntypedTrackChannel();
        channel.property = property;
        this._channels.push(channel);
        return channel;
    }

    public upgrade (refine: UntypedTrackRefine): Track | null {
        const trySearchChannel = (property: string, outChannel: RealChannel): void => {
            const untypedChannel = this.channels().find((channel): boolean => channel.property === property);
            if (untypedChannel) {
                outChannel.name = untypedChannel.name;
                outChannel.curve.assignSorted(
                    Array.from(untypedChannel.curve.times()),
                    Array.from(untypedChannel.curve.values()),
                );
            }
        };
        const kind = refine(this.path, this.proxy);
        switch (kind) {
        default:
            break;
        case 'vec2': case 'vec3': case 'vec4': {
            const track = new VectorTrack();
            track.path = this.path;
            track.proxy = this.proxy;
            track.componentsCount = kind === 'vec2' ? 2 : kind === 'vec3' ? 3 : 4;
            const [x, y, z, w] = track.channels();
            switch (kind) {
            case 'vec4':
                trySearchChannel('w', w);
                // fall through
            case 'vec3':
                trySearchChannel('z', z);
                // fall through
            default:
            case 'vec2':
                trySearchChannel('x', x);
                trySearchChannel('y', y);
            }
            return track;
        }
        case 'color': {
            const track = new ColorTrack();
            const [r, g, b, a] = track.channels();
            trySearchChannel('r', r);
            trySearchChannel('g', g);
            trySearchChannel('b', b);
            trySearchChannel('a', a);
            // TODO: we need float-int conversion if xyzw
            trySearchChannel('x', r);
            trySearchChannel('y', g);
            trySearchChannel('z', b);
            trySearchChannel('w', a);
            return track;
        }
        case 'size':
            break;
        }

        return null;
    }
}

export type UntypedTrackRefine = (path: Readonly<TrackPath>, proxy: IValueProxyFactory | undefined) => 'vec2' | 'vec3' | 'vec4' | 'color' | 'size';

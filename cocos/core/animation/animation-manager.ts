/**
 * @category animation
 */

import System from '../components/system';
import { ccclass } from '../data/class-decorator';
import { director, Director } from '../director';
import { errorID } from '../platform/debug';
import { Node } from '../scene-graph';
import { Scheduler } from '../scheduler';
import { MutableForwardIterator, remove } from '../utils/array';
import { BlendStateBuffer } from './skeletal-animation-blending';
import { AnimationState } from './animation-state';
import { CrossFade } from './cross-fade';
import { legacyCC } from '../global-exports';
import { IJointTransform, deleteTransform, getTransform, getWorldMatrix } from '../renderer/models/skinning-model';
import { Socket } from './skeletal-animation-component';

interface ISocketData {
    target: Node;
    transform: IJointTransform;
}

@ccclass
export class AnimationManager extends System {

    public get blendState () {
        return this._blendStateBuffer;
    }

    public static ID = 'animation';
    private _anims = new MutableForwardIterator<AnimationState>([]);
    private _delayEvents: {
        fn: Function;
        thisArg: any;
        args: any[];
    }[] = [];
    private _blendStateBuffer: BlendStateBuffer = new BlendStateBuffer();
    private _crossFades: CrossFade[] = [];
    private _sockets: ISocketData[] = [];

    public addCrossFade (crossFade: CrossFade) {
        this._crossFades.push(crossFade);
    }

    public removeCrossFade (crossFade: CrossFade) {
        remove(this._crossFades, crossFade);
    }

    public update (dt: number) {
        const { _delayEvents, _crossFades, _sockets } = this;

        for (let i = 0, l = _crossFades.length; i < l; i++) {
            _crossFades[i].update(dt);
        }
        const iterator = this._anims;
        const array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            const anim = array[iterator.i];
            if (!anim.isMotionless) {
                anim.update(dt);
            }
        }
        this._blendStateBuffer.apply();

        const stamp = legacyCC.director.getTotalFrames();
        for (let i = 0, l = _sockets.length; i < l; i++) {
            const { target, transform } = _sockets[i];
            target.matrix = getWorldMatrix(transform, stamp);
        }

        for (let i = 0, l = _delayEvents.length; i < l; i++) {
            const event = _delayEvents[i];
            event.fn.apply(event.thisArg, event.args);
        }
        _delayEvents.length = 0;
    }

    public destruct () {

    }

    public addAnimation (anim: AnimationState) {
        const index = this._anims.array.indexOf(anim);
        if (index === -1) {
            this._anims.push(anim);
        }
    }

    public removeAnimation (anim: AnimationState) {
        const index = this._anims.array.indexOf(anim);
        if (index >= 0) {
            this._anims.fastRemoveAt(index);
        } else {
            errorID(3907);
        }
    }

    public pushDelayEvent (fn: Function, thisArg: any, args: any[]) {
        this._delayEvents.push({
            fn,
            thisArg,
            args,
        });
    }

    public addSockets (root: Node, sockets: Socket[]) {
        for (let i = 0; i < sockets.length; ++i) {
            const socket = sockets[i];
            if (this._sockets.find((s) => s.target === socket.target)) { continue; }
            const targetNode = root.getChildByPath(socket.path);
            const transform = socket.target && targetNode && getTransform(targetNode, root);
            if (transform) {
                this._sockets.push({ target: socket.target!, transform });
            }
        }
    }

    public removeSockets (root: Node, sockets: Socket[]) {
        for (let i = 0; i < sockets.length; ++i) {
            const socketToRemove = sockets[i];
            for (let j = 0; j < this._sockets.length; ++j) {
                const socket = this._sockets[j];
                if (socket.target ===  socketToRemove.target) {
                    deleteTransform(socket.transform.node);
                    this._sockets[j] = this._sockets[this._sockets.length - 1];
                    this._sockets.length--;
                    break;
                }
            }
        }
    }
}

director.on(Director.EVENT_INIT, () => {
    const animationManager = new AnimationManager();
    director.registerSystem(AnimationManager.ID, animationManager, Scheduler.PRIORITY_SYSTEM);
});

legacyCC.AnimationManager = AnimationManager;

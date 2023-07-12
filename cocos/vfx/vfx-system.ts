/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { DEBUG, EDITOR } from 'internal:constants';
import { assertIsTrue, warn } from '../core';
import { ccclass, executeInEditMode, executionOrder, help, menu, serializable, tooltip } from '../core/data/class-decorator';
import { rangeMin, visible } from '../core/data/decorators';
import { legacyCC } from '../core/global-exports';
import { Component } from '../scene-graph/component';
import { PlayingState } from './define';
import { VFXEmitter } from './vfx-emitter';
import { vfxManager } from './vfx-manager';

@ccclass('cc.VFXSystem')
@help('i18n:cc.VFXSystem')
@menu('Effects/VFXSystem')
@executionOrder(99)
@executeInEditMode
export class VFXSystem extends Component {
    /**
     * @zh 粒子系统加载后是否自动开始播放。
     */
    @tooltip('i18n:particle_system.playOnAwake')
    public get playOnAwake () {
        return this._playOnAwake;
    }

    public set playOnAwake (val) {
        this._playOnAwake = val;
    }
    /**
     * @zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）。
     */
    @tooltip('i18n:particle_system.prewarm')
    public get prewarm () {
        return this._prewarm;
    }

    public set prewarm (val) {
        this._prewarm = val;
    }

    @visible(function (this: VFXSystem) { return this.prewarm; })
    @rangeMin(0.001)
    public get prewarmTime () {
        return this._prewarmTime;
    }

    public set prewarmTime (val) {
        this._prewarmTime = Math.max(val, 0.001);
    }

    @visible(function (this: VFXSystem) { return this.prewarm; })
    @rangeMin(0.001)
    public get prewarmTimeStep () {
        return this._prewarmTimeStep;
    }

    public set prewarmTimeStep (val) {
        this._prewarmTimeStep = Math.max(val, 0.001);
    }

    /**
      * @zh 控制整个粒子系统的更新速度。
      */
    @tooltip('i18n:particle_system.simulationSpeed')
    @rangeMin(0.001)
    public get simulationSpeed () {
        return this._simulationSpeed;
    }

    public set simulationSpeed (val) {
        this._simulationSpeed = Math.max(val, 0.001);
    }

    @visible(true)
    @rangeMin(0.001)
    public get maxDeltaTime () {
        return this._maxDeltaTime;
    }

    public set maxDeltaTime (val) {
        this._maxDeltaTime = Math.max(val, 0.001);
    }

    public get playingState () {
        return this._playingState;
    }

    @serializable
    private _prewarm = false;
    @serializable
    private _prewarmTime = 5;
    @serializable
    private _prewarmTimeStep = 0.03;
    @serializable
    private _simulationSpeed = 1.0;
    @serializable
    private _playOnAwake = true;
    @serializable
    private _maxDeltaTime = 0.05;
    private _playingState = PlayingState.STOPPED;
    private _emitters: VFXEmitter[] = [];
    private _emitterDirty = true;

    /**
     * @internal
     * @engineInternal
     */
    protected onEnable () {
        if (this.playOnAwake && (!EDITOR || legacyCC.GAME_VIEW)) {
            this.play();
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    protected onDisable () {
        this.stop(true);
    }

    private _prewarmSystem () {
        let prewarmTime = this.prewarmTime;
        const timeStep = Math.max(this.prewarmTimeStep, 0.001);
        const count = Math.ceil(prewarmTime / timeStep);

        for (let i = 0; i < count; ++i) {
            const dt = Math.min(timeStep, prewarmTime);
            prewarmTime -= dt;
            this.tick(dt);
        }
    }

    /**
     * @en play particle system
     * @zh 播放粒子效果。
     */
    public play () {
        if (!this.enabledInHierarchy) {
            throw new Error('Particle Emitter is not active, Please make sure the node is active in the scene.');
        }
        if (this._playingState === PlayingState.PLAYING) {
            return;
        }
        if (this._playingState === PlayingState.STOPPED) {
            for (let i = 0, l = this._emitters.length; i < l; i++) {
                this._emitters[i].init();
            }
            if (this.prewarm) {
                this._prewarmSystem();
            }
        }

        this._playingState = PlayingState.PLAYING;
        vfxManager.addSystem(this);
    }

    /**
     * @en pause particle system
     * @zh 暂停播放粒子效果。
     */
    public pause () {
        if (this._playingState !== PlayingState.PLAYING) {
            warn('pause(): particle system is already stopped.');
            return;
        }
        this._playingState = PlayingState.PAUSED;
    }

    /**
     * @en stop particle system
     * @zh 停止播放粒子。
     */
    public stop (clear = false) {
        if (clear) {
            this._playingState = PlayingState.STOPPED;
            for (let i = 0, l = this._emitters.length; i < l; i++) {
                this._emitters[i].reset();
            }
            vfxManager.removeSystem(this);
        }
    }

    public addEmitter (emitter: VFXEmitter) {
        this._emitters.push(emitter);
        this._emitterDirty = true;
    }

    public removeEmitter (emitter: VFXEmitter) {
        const index = this._emitters.indexOf(emitter);
        if (index >= 0) {
            this._emitters.splice(index, 1);
            this._emitterDirty = true;
        }
    }

    public findEmitterByName (name: string) {
        for (let i = 0, l = this._emitters.length; i < l; i++) {
            const emitter = this._emitters[i];
            if (emitter.node.name === name) {
                return emitter;
            }
        }
        return null;
    }

    public tick (deltaTime: number) {
        if (DEBUG) {
            assertIsTrue(this._playingState !== PlayingState.STOPPED, 'Particle Emitter is not playing, please call play() method first.');
        }
        let scaledDeltaTime = deltaTime * Math.max(this.simulationSpeed, 0);
        if (scaledDeltaTime > this.maxDeltaTime) {
            scaledDeltaTime /= Math.ceil(scaledDeltaTime / this.maxDeltaTime);
        }
        if (this._emitterDirty) {
            this._emitters.sort((a, b) => a.order - b.order);
            this._emitterDirty = false;
        }
        const emitters = this._emitters;
        for (let i = 0, len = emitters.length; i < len; i++) {
            const emitter = emitters[i];
            if (emitter.isValid) {
                emitter.tick(scaledDeltaTime);
            }
        }
    }
}

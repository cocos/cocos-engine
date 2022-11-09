/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, disallowMultiple, displayName, editable, executeInEditMode, menu, range, serializable, tooltip, type } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { NodeEventType } from '../../scene-graph/node-event';
import { Component } from '../../scene-graph/component';
import { Vec3, CCInteger } from '../../core';
import { AutoPlacement, PlaceMethod } from './auto-placement';

/**
 * @en The light probe group component.
 * @zh 光照探针组组件。
 */
@ccclass('cc.LightProbeGroup')
@menu('Rendering/LightProbeGroup')
@disallowMultiple
@executeInEditMode
export class LightProbeGroup extends Component {
    @serializable
    protected _probes: Vec3[] = [];

    @serializable
    protected _method = PlaceMethod.UNIFORM;

    @serializable
    protected _minPos = new Vec3(-10, -10, -10);

    @serializable
    protected _maxPos = new Vec3(10, 10, 10);

    @serializable
    protected _nProbesX = 3;

    @serializable
    protected _nProbesY = 3;

    @serializable
    protected _nProbesZ = 3;

    get probes (): Vec3[] {
        return this._probes;
    }
    set probes (val: Vec3[]) {
        this._probes = val;
    }

    @editable
    @type(PlaceMethod)
    @tooltip('i18n:light_probe_group.method')
    @displayName('Generating Method')
    get method () {
        return this._method;
    }
    set method (val) {
        this._method = val;
    }

    /**
     * @en Minimum position of the light probe group
     * @zh 光照探针组包围盒最小值
     */
    @editable
    @tooltip('i18n:light_probe_group.minPos')
    @displayName('Generating Min Pos')
    get minPos (): Vec3 {
        return this._minPos;
    }
    set minPos (val: Vec3) {
        this._minPos = val;
    }

    /**
     * @en Maximum position of the light probe group
     * @zh 光照探针组包围盒最大值
     */
    @editable
    @tooltip('i18n:light_probe_group.maxPos')
    @displayName('Generating Max Pos')
    get maxPos (): Vec3 {
        return this._maxPos;
    }
    set maxPos (val: Vec3) {
        this._maxPos = val;
    }

    @editable
    @range([2, 65535, 1])
    @type(CCInteger)
    @tooltip('i18n:light_probe_group.nProbesX')
    @displayName('Number Of Probes X')
    get nProbesX (): number {
        return this._nProbesX;
    }
    set nProbesX (val: number) {
        this._nProbesX = val;
    }

    @editable
    @range([2, 65535, 1])
    @type(CCInteger)
    @tooltip('i18n:light_probe_group.nProbesY')
    @displayName('Number Of Probes Y')
    get nProbesY (): number {
        return this._nProbesY;
    }
    set nProbesY (val: number) {
        this._nProbesY = val;
    }

    @editable
    @range([2, 65535, 1])
    @type(CCInteger)
    @tooltip('i18n:light_probe_group.nProbesZ')
    @displayName('Number Of Probes Z')
    get nProbesZ (): number {
        return this._nProbesZ;
    }
    set nProbesZ (val: number) {
        this._nProbesZ = val;
    }

    public onEnable () {
        if (!EDITOR) {
            return;
        }

        if (!this.node) {
            return;
        }

        this.node.on(NodeEventType.ANCESTOR_TRANSFORM_CHANGED, this.onAncestorTransformChanged, this);
        const changed = this.node.scene.globals.lightProbeInfo.addGroup(this);
        if (changed) {
            this.onProbeChanged();
        }
    }

    public onDisable () {
        if (!EDITOR) {
            return;
        }

        if (!this.node) {
            return;
        }

        const changed = this.node.scene.globals.lightProbeInfo.removeGroup(this);
        if (changed) {
            this.onProbeChanged();
        }
        this.node.off(NodeEventType.ANCESTOR_TRANSFORM_CHANGED, this.onAncestorTransformChanged, this);
    }

    public generateLightProbes () {
        if (!this.node) {
            return;
        }

        this._probes = AutoPlacement.generate({
            method: this._method,
            nProbesX: this._nProbesX,
            nProbesY: this._nProbesY,
            nProbesZ: this._nProbesZ,
            minPos: this._minPos,
            maxPos: this._maxPos,
        });

        this.onProbeChanged();
    }

    public onProbeChanged (updateTet = true, emitEvent = true) {
        this.node.scene.globals.lightProbeInfo.update(updateTet);
        if (emitEvent) {
            this.node.emit(NodeEventType.LIGHT_PROBE_CHANGED);
        }
    }

    private onAncestorTransformChanged () {
        if (!this.node) {
            return;
        }

        const updateTet = !this.node.scene.globals.lightProbeInfo.isUniqueGroup();
        this.node.updateWorldTransform();
        this.onProbeChanged(updateTet);
    }
}

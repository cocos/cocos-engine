/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

/**
 * @category scene-graph
 */

import { ccclass, property } from '../data/class-decorator';
import { Mat4, Quat, Vec3 } from '../math';
import { warnID } from '../platform/debug';
import { RenderScene } from '../renderer/scene/render-scene';
import { BaseNode } from './base-node';
import { SceneGlobals } from './scene-globals';
import { EDITOR, TEST } from 'internal:constants';
import { legacyCC } from '../global-exports';

/**
 * @en
 * cc.Scene is a subclass of cc.Node that is used only as an abstract concept.<br/>
 * cc.Scene and cc.Node are almost identical with the difference that users can not modify cc.Scene manually.
 * @zh
 * cc.Scene 是 cc._BaseNode 的子类，仅作为一个抽象的概念。<br/>
 * cc.Scene 和 cc._BaseNode 有点不同，用户不应直接修改 cc.Scene。
 */
@ccclass('cc.Scene')
export class Scene extends BaseNode {

    get renderScene () {
        return this._renderScene;
    }

    get globals () {
        return this._globals;
    }

    /**
     * @en Indicates whether all (directly or indirectly) static referenced assets of this scene are releasable by default after scene unloading.
     * @zh 指示该场景中直接或间接静态引用到的所有资源是否默认在场景切换后自动释放。
     */
    @property
    public autoReleaseAssets = false;

    /**
     * @en Per-scene level rendering info
     * @zh 场景级别的渲染信息
     */
    @property
    public _globals = new SceneGlobals();

    public _renderScene: RenderScene | null = null;
    public dependAssets = null; // cache all depend assets for auto release

    protected _inited: boolean;
    protected _prefabSyncedInLiveReload = false;

    // support Node access parent data from Scene
    protected _pos = Vec3.ZERO;
    protected _rot = Quat.IDENTITY;
    protected _scale = Vec3.ONE;
    protected _mat = Mat4.IDENTITY;
    protected _dirtyFlags = 0;

    constructor (name: string) {
        super(name);
        this._activeInHierarchy = false;
        if (legacyCC.director && legacyCC.director.root) {
            this._renderScene = legacyCC.director.root.createScene({});
        }
        this._inited = legacyCC.game ? !legacyCC.game._isCloning : true;
    }

    public destroy () {
        const success = super.destroy();
        legacyCC.director.root.destroyScene(this._renderScene);
        this._activeInHierarchy = false;
        return success;
    }

    public addComponent (typeOrClassName: string | Function) {
        warnID(3822);
        return null;
    }

    public _onHierarchyChanged () { }

    public _onBatchCreated () {
        super._onBatchCreated();
        const len = this._children.length;
        for (let i = 0; i < len; ++i) {
            this._children[i]._onBatchCreated();
        }
    }

    public _onBatchRestored () {
        this._onBatchCreated();
    }

    // transform helpers

    public getPosition (out?: Vec3): Vec3 { return Vec3.copy(out || new Vec3(), Vec3.ZERO); }
    public getRotation (out?: Quat): Quat { return Quat.copy(out || new Quat(), Quat.IDENTITY); }
    public getScale (out?: Vec3): Vec3 { return Vec3.copy(out || new Vec3(), Vec3.ONE); }
    public getWorldPosition (out?: Vec3) { return Vec3.copy(out || new Vec3(), Vec3.ZERO); }
    public getWorldRotation (out?: Quat) { return Quat.copy(out || new Quat(), Quat.IDENTITY); }
    public getWorldScale (out?: Vec3) { return Vec3.copy(out || new Vec3(), Vec3.ONE); }
    public getWorldMatrix (out?: Mat4): Mat4 { return Mat4.copy(out || new Mat4(), Mat4.IDENTITY); }
    public getWorldRS (out?: Mat4): Mat4 { return Mat4.copy(out || new Mat4(), Mat4.IDENTITY); }
    public getWorldRT (out?: Mat4): Mat4 { return Mat4.copy(out || new Mat4(), Mat4.IDENTITY); }
    public get position (): Readonly<Vec3> { return Vec3.ZERO; }
    public get worldPosition (): Readonly<Vec3> { return Vec3.ZERO; }
    public get rotation (): Readonly<Quat> { return Quat.IDENTITY; }
    public get worldRotation (): Readonly<Quat> { return Quat.IDENTITY; }
    public get scale (): Readonly<Vec3> { return Vec3.ONE; }
    public get worldScale (): Readonly<Vec3> { return Vec3.ONE; }
    public get eulerAngles (): Readonly<Vec3> { return Vec3.ZERO; }
    public get worldMatrix (): Readonly<Mat4> { return Mat4.IDENTITY; }
    public updateWorldTransform () {}

    // life-cycle call backs

    protected _instantiate () { }

    protected _load () {
        if (!this._inited) {
            if (TEST) {
                legacyCC.assert(!this._activeInHierarchy, 'Should deactivate ActionManager and EventManager by default');
            }
            this._onBatchCreated();
            this._inited = true;
        }
        // static methode can't use this as parameter type
        this.walk(BaseNode._setScene);
    }

    protected _activate (active: boolean) {
        active = (active !== false);
        if (EDITOR || TEST) {
            // register all nodes to editor
            this._registerIfAttached!(active);
        }
        legacyCC.director._nodeActivator.activateNode(this, active);
        this._globals.renderScene = this._renderScene!;
    }
}

legacyCC.Scene = Scene;

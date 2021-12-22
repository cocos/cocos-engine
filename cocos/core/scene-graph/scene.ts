/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @module scene-graph
 */

import { ccclass, serializable, editable } from 'cc.decorator';
import { EDITOR, JSB, TEST } from 'internal:constants';
import { CCObject } from '../data/object';
import { Mat4, Quat, Vec3 } from '../math';
import { assert, getError } from '../platform/debug';
import { RenderScene } from '../renderer/scene/render-scene';
import { BaseNode } from './base-node';
import { legacyCC } from '../global-exports';
import { Component } from '../components/component';
import { SceneGlobals } from './scene-globals';
import { applyTargetOverrides, expandNestedPrefabInstanceNode } from '../utils/prefab/utils';
import { NativeScene } from '../renderer/scene/native-scene';

/**
 * @en
 * Scene is a subclass of [[BaseNode]], composed by nodes, representing the root of a runnable environment in the game.
 * It's managed by [[Director]] and user can switch from a scene to another using [[Director.loadScene]]
 * @zh
 * Scene 是 [[BaseNode]] 的子类，由节点所构成，代表着游戏中可运行的某一个整体环境。
 * 它由 [[Director]] 管理，用户可以使用 [[Director.loadScene]] 来切换场景
 */
@ccclass('cc.Scene')
export class Scene extends BaseNode {
    /**
     * @en The renderer scene, normally user don't need to use it
     * @zh 渲染层场景，一般情况下用户不需要关心它
     */
    get renderScene () {
        return this._renderScene;
    }

    @editable
    get globals () {
        return this._globals;
    }

    /**
     * @en Indicates whether all (directly or indirectly) static referenced assets of this scene are releasable by default after scene unloading.
     * @zh 指示该场景中直接或间接静态引用到的所有资源是否默认在场景切换后自动释放。
     */
    @serializable
    @editable
    public autoReleaseAssets = false;

    /**
     * @en Per-scene level rendering info
     * @zh 场景级别的渲染信息
     *
     * @legacy_public
     */
    @serializable
    public _globals = new SceneGlobals();

    public dependAssets = null; // cache all depend assets for auto release

    protected _renderScene: RenderScene | null = null;

    protected _inited: boolean;

    protected _prefabSyncedInLiveReload = false;

    // support Node access parent data from Scene
    protected _pos = Vec3.ZERO;

    protected _rot = Quat.IDENTITY;

    protected _scale = Vec3.ONE;

    protected _mat = Mat4.IDENTITY;

    protected _dirtyFlags = 0;

    protected declare _nativeObj: NativeScene | null;

    protected _lpos = Vec3.ZERO;

    protected _lrot = Quat.IDENTITY;

    protected _lscale = Vec3.ONE;

    protected _updateScene () {
        this._scene = this;
    }

    get native (): any {
        return this._nativeObj;
    }

    protected _init () {
        if (JSB) {
            this._nativeObj = new NativeScene();
        }
    }

    constructor (name: string) {
        super(name);
        this._activeInHierarchy = false;
        if (legacyCC.director && legacyCC.director.root) {
            this._renderScene = legacyCC.director.root.createScene({});
        }
        this._inited = legacyCC.game ? !legacyCC.game._isCloning : true;
        this._init();
    }

    /**
     * @en Destroy the current scene and all its nodes, this action won't destroy related assets
     * @zh 销毁当前场景中的所有节点，这个操作不会销毁资源
     */
    public destroy () {
        const success = CCObject.prototype.destroy.call(this);
        if (success) {
            const children = this._children;
            for (let i = 0; i < children.length; ++i) {
                children[i].active = false;
            }
        }
        if (this._renderScene) legacyCC.director.root.destroyScene(this._renderScene);
        this._active = false;
        this._activeInHierarchy = false;
        return success;
    }

    /**
     * @en Only for compatibility purpose, user should not add any component to the scene
     * @zh 仅为兼容性保留，用户不应该在场景上直接添加任何组件
     */
    public addComponent(...args: any[]): Component;

    /**
     * @en Only for compatibility purpose, user should not add any component to the scene
     * @zh 仅为兼容性保留，用户不应该在场景上直接添加任何组件
     */
    public addComponent (): Component {
        throw new Error(getError(3822));
    }

    /**
     * @legacy_public
     */
    public _onHierarchyChanged () { }

    /**
     * @legacy_public
     */
    public _onBatchCreated (dontSyncChildPrefab: boolean) {
        super._onBatchCreated(dontSyncChildPrefab);
        const len = this._children.length;
        for (let i = 0; i < len; ++i) {
            this.children[i]._siblingIndex = i;
            this._children[i]._onBatchCreated(dontSyncChildPrefab);
        }
    }

    // transform helpers

    /**
     * Refer to [[Node.getPosition]]
     */
    public getPosition (out?: Vec3): Vec3 { return Vec3.copy(out || new Vec3(), Vec3.ZERO); }

    /**
     * Refer to [[Node.getRotation]]
     */
    public getRotation (out?: Quat): Quat { return Quat.copy(out || new Quat(), Quat.IDENTITY); }

    /**
     * Refer to [[Node.getScale]]
     */
    public getScale (out?: Vec3): Vec3 { return Vec3.copy(out || new Vec3(), Vec3.ONE); }

    /**
     * Refer to [[Node.getWorldPosition]]
     */
    public getWorldPosition (out?: Vec3) { return Vec3.copy(out || new Vec3(), Vec3.ZERO); }

    /**
     * Refer to [[Node.getWorldRotation]]
     */
    public getWorldRotation (out?: Quat) { return Quat.copy(out || new Quat(), Quat.IDENTITY); }

    /**
     * Refer to [[Node.getWorldScale]]
     */
    public getWorldScale (out?: Vec3) { return Vec3.copy(out || new Vec3(), Vec3.ONE); }

    /**
     * Refer to [[Node.getWorldMatrix]]
     */
    public getWorldMatrix (out?: Mat4): Mat4 { return Mat4.copy(out || new Mat4(), Mat4.IDENTITY); }

    /**
     * Refer to [[Node.getWorldRS]]
     */
    public getWorldRS (out?: Mat4): Mat4 { return Mat4.copy(out || new Mat4(), Mat4.IDENTITY); }

    /**
     * Refer to [[Node.getWorldRT]]
     */
    public getWorldRT (out?: Mat4): Mat4 { return Mat4.copy(out || new Mat4(), Mat4.IDENTITY); }

    /**
     * Refer to [[Node.position]]
     */
    public get position (): Readonly<Vec3> { return Vec3.ZERO; }

    /**
     * Refer to [[Node.worldPosition]]
     */
    public get worldPosition (): Readonly<Vec3> { return Vec3.ZERO; }

    /**
     * Refer to [[Node.rotation]]
     */
    public get rotation (): Readonly<Quat> { return Quat.IDENTITY; }

    /**
     * Refer to [[Node.worldRotation]]
     */
    public get worldRotation (): Readonly<Quat> { return Quat.IDENTITY; }

    /**
     * Refer to [[Node.scale]]
     */
    public get scale (): Readonly<Vec3> { return Vec3.ONE; }

    /**
     * Refer to [[Node.worldScale]]
     */
    public get worldScale (): Readonly<Vec3> { return Vec3.ONE; }

    /**
     * Refer to [[Node.eulerAngles]]
     */
    public get eulerAngles (): Readonly<Vec3> { return Vec3.ZERO; }

    /**
     * Refer to [[Node.worldMatrix]]
     */
    public get worldMatrix (): Readonly<Mat4> { return Mat4.IDENTITY; }

    /**
     * Refer to [[Node.updateWorldTransform]]
     */
    public updateWorldTransform () {}

    // life-cycle call backs

    protected _instantiate () { }

    protected _load () {
        if (!this._inited) {
            if (TEST) {
                assert(!this._activeInHierarchy, 'Should deactivate ActionManager by default');
            }

            expandNestedPrefabInstanceNode(this);
            applyTargetOverrides(this);
            this._onBatchCreated(EDITOR && this._prefabSyncedInLiveReload);
            this._inited = true;
        }
        // static method can't use this as parameter type
        this.walk(BaseNode._setScene);
    }

    protected _activate (active: boolean) {
        active = (active !== false);
        if (EDITOR) {
            // register all nodes to editor
            this._registerIfAttached!(active);
        }
        legacyCC.director._nodeActivator.activateNode(this, active);
        // The test environment does not currently support the renderer
        if (!TEST) {
            this._globals.activate();
            if (this._renderScene) {
                this._renderScene.activate();
            }
        }
    }
}

legacyCC.Scene = Scene;

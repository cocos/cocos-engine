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
import { RenderScene } from '../renderer/scene/render-scene';
import { BaseNode } from './base-node';
import { SceneGlobals } from './scene-globals';
import { Vec3, Quat, Mat4 } from '../math';
import { warnID } from '../platform/debug';

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

    protected _inited: boolean;
    protected _prefabSyncedInLiveReload = false;

    // Support Node access parent data from Scene
    protected _pos = new Vec3(0, 0, 0);
    protected _rot = new Quat(0, 0, 0, 1);
    protected _scale = new Vec3(1, 1, 1);
    protected _mat = Mat4.IDENTITY;

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

    get renderScene () {
        return this._renderScene;
    }

    get globals () {
        return this._globals;
    }

    constructor (name: string) {
        super(name);
        this._activeInHierarchy = false;
        if (cc.director && cc.director.root) {
            this._renderScene = cc.director.root.createScene({});
        }
        this._inited = cc.game ? !cc.game._isCloning : true;
    }

    public destroy () {
        const success = super.destroy();
        cc.director.root.destroyScene(this._renderScene);
        this._activeInHierarchy = false;
        return success;
    }

    public getPosition (out?: Vec3): Vec3 {
        if (out) {
            return Vec3.set(out, this._pos.x, this._pos.y, this._pos.z);
        } else {
            return Vec3.copy(new Vec3(), this._pos);
        }
    }

    public getRotation (out?: Quat): Quat {
        if (out) {
            return Quat.set(out, this._rot.x, this._rot.y, this._rot.z, this._rot.w);
        } else {
            return Quat.copy(new Quat(), this._rot);
        }
    }

    public getScale (out?: Vec3): Vec3 {
        if (out) {
            return Vec3.set(out, this._scale.x, this._scale.y, this._scale.z);
        } else {
            return Vec3.copy(new Vec3(), this._scale);
        }
    }

    public getWorldPosition (out?: Vec3) {
        return this.getPosition(out);
    }

    public getWorldRotation (out?: Quat) {
        return this.getRotation(out);
    }

    public getWorldScale (out?: Vec3) {
        return this.getScale(out);
    }

    public updateWorldTransform () { }

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

    protected _instantiate () { }

    protected _load () {
        if (!this._inited) {
            if (CC_TEST) {
                cc.assert(!this._activeInHierarchy, 'Should deactivate ActionManager and EventManager by default');
            }
            this._onBatchCreated();
            this._inited = true;
        }
        // @ts-ignore
        // static methode can't use this as parameter type
        this.walk(BaseNode._setScene);
    }

    protected _activate (active: boolean) {
        active = (active !== false);
        if (CC_EDITOR || CC_TEST) {
            // register all nodes to editor
            this._registerIfAttached!(active);
        }
        cc.director._nodeActivator.activateNode(this, active);
        this._globals.renderScene = this._renderScene!;
    }
}

cc.Scene = Scene;

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
import { Node } from './node';
import { SceneGlobals } from './scene-globals';

/**
 * @en
 * cc.Scene is a subclass of cc.Node that is used only as an abstract concept.<br/>
 * cc.Scene and cc.Node are almost identical with the difference that users can not modify cc.Scene manually.
 * @zh
 * cc.Scene 是 cc.Node 的子类，仅作为一个抽象的概念。<br/>
 * cc.Scene 和 cc.Node 有点不同，用户不应直接修改 cc.Scene。
 */
@ccclass('cc.Scene')
export class Scene extends Node {

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

    public _onHierarchyChanged () { }
    protected _instantiate () { }

    protected _load () {
        if (!this._inited) {
            if (CC_TEST) {
                cc.assert(!this._activeInHierarchy, 'Should deactivate ActionManager and EventManager by default');
            }
            this._onBatchCreated();
            this._inited = true;
        }
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

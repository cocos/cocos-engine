/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
 ****************************************************************************/

import { CCObject } from '../core/data/object';
import { getClassName, value } from '../core/utils/js';
import IDGenerator from '../core/utils/id-generator';
import { ccclass, property } from '../core/data/class-decorator';
import { Node } from '../scene-graph/node';
import { RenderScene } from '../renderer/scene/render-scene';

export class Component extends CCObject {
    node: Node;
    uuid: string;
    enabled: boolean;
    enabledInHierarchy: boolean;

    public constructor();

    protected _getRenderScene (): RenderScene;
    public addComponent<T extends Component> (typeOrClassName: string | (new () => T)): T;
    public getComponent<T extends Component> (typeOrClassName: string | (new () => T)): T;
    public getComponents<T extends Component> (typeOrClassName: string | (new () => T)): T[];
    public getComponentInChildren<T extends Component> (typeOrClassName: string | (new () => T)): T;
    public getComponentsInChildren<T extends Component> (typeOrClassName: string | (new () => T)): T[];
    public schedule (callback: Function, interval: number, repeat: number, delay: number): void;
    public scheduleOnce (callback: Function, delay: number): void;
    public unschedule (callback: Function): void;
    public unscheduleAllCallbacks (): void;

    // friend to class BaseNode
    public _id: string;
    public _enabled: boolean;
}

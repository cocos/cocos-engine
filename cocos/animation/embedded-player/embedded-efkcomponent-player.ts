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
import { warn, js } from '../../core';
import type { Node } from '../../scene-graph/node';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { EmbeddedPlayableState, EmbeddedPlayable } from './embedded-player';
import { Component } from '../../scene-graph';

interface IEFKComponent extends Component {
    play: () => void  // 播放接口
    setSpeed: (speed: number) => void  // 设置速度接口
    setPause: (b: boolean) => void // 暂停接口
    setRpeat: (b: boolean) => void // 重复播放接口
    stop: () => void  // 停止接口
}

/**
 * @en
 * User-customized player. This player plays the user-specified efk component player in the sub-area.
 * @zh
 * 用户定制播放器。此播放器在子区域上播放用户指定的efk组件播放器。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}EmbeddedEFKComponentPlayable`)
export class EmbeddedEFKComponentPlayable extends EmbeddedPlayable {
    /**
     * @en
     * Path to the node where efk system inhabits, relative from animation context root.
     * @zh
     * efk组件系统所在的结点路径，相对于动画上下文的根节点。
     */
    @serializable
    public path = '';

    public instantiate (root: Node): EmbeddedEFKComponentPlayableState | null {
        const node = root.getChildByPath(this.path);
        if (!node) {
            warn(`Hierarchy path ${this.path} does not exists.`);
            return null;
        }

        const EfkComponentConstructor = js.getClassByName(`EFKComponent`) as IEFKComponent | undefined;
        if (!EfkComponentConstructor) {
            warn(`efkComponent is required for embedded efkComponent system player.`);
            return null;
        }
        const efkComponent = node.getComponent<IEFKComponent>(EfkComponentConstructor);
        if (!efkComponent) {
            warn(`${this.path} does not includes a efk component.`);
            return null;
        }
        return new EmbeddedEFKComponentPlayableState(efkComponent);
    }
}

class EmbeddedEFKComponentPlayableState extends EmbeddedPlayableState {
    constructor (efkSystem: IEFKComponent) {
        super(false);
        this._efkSystem = efkSystem;
    }

    public destroy (): void {
        // DO NOTHING
    }

    /**
     * Plays the efk system from the beginning no matter current time.
     */
    public play (): void {
        this._efkSystem.play();
    }

    /**
     * Pause the efk system no matter current time.
     */
    public pause (): void {
        this._efkSystem.setPause(true);
    }

    /**
     * Stops the efk system.
     */
    public stop (): void {
        this._efkSystem.stop();
    }

    /**
     * Sets the speed of the efk system.
     * @param speed The speed.
     */
    public setSpeed (speed: number): void {
        this._efkSystem.setSpeed(speed);
    }

    private _efkSystem: IEFKComponent;
}

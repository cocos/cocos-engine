/**
 * @category ui
 */

import { Component } from '../../core/components/component';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';

/**
 * @en
 * Set the UI transparency component.
 * This component can be used to influence subsequent render nodes.
 * Nodes that already have a rendering component can modify the alpha channel of color directly.
 *
 * @zh
 * UI 透明度设置组件。可以通过该组件设置透明度来影响后续的渲染节点。已经带有渲染组件的节点可以直接修改 color 的 alpha 通道。
 */
@ccclass('cc.UIOpacityComponent')
@executionOrder(110)
@menu('UI/UIOpacity')
@executeInEditMode
export class UIOpacityComponent extends Component {
    /**
     * @en
     * The transparency value of the impact.
     *
     * @zh
     * 透明度。
     */
    @property
    get opacity () {
        return this._opacity;
    }

    set opacity (value) {
        if (this._opacity === value) {
            return;
        }

        this._opacity = value;
        this.node.uiProps.opacity = value / 255;
    }

    @property
    protected _opacity = 255;

    public onEnable () {
        this.node.uiProps.opacity = this._opacity / 255;
    }

    public onDisable (){
        this.node.uiProps.opacity = 1;
    }
}

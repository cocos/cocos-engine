
import { Component } from '../../core/components/component';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';

/**
 * @zh UI 透明度设置组件。可以通过该组件设置透明度来影响后续的渲染节点。已经带有渲染组件的节点可以直接修改 color 的 alpha 通道。
 */
@ccclass('cc.UIOpacityComponent')
@executionOrder(110)
@menu('UI/UIOpacity')
@executeInEditMode
export class UIOpacityComponent extends Component {
    @property
    get opacity () {
        return this._opacity;
    }

    set opacity (value) {
        if (this._opacity === value) {
            return;
        }

        this._opacity = value;
        this.node._uiProps.opacity = value / 255;
    }

    @property
    protected _opacity = 255;

    public onLoad () {
        this.node._uiProps.opacity = this._opacity / 255;
    }
}

import { Component } from '../../../components/component';
import { ccclass, executeInEditMode, executionOrder, property } from '../../../core/data/class-decorator';
import { UI } from '../../../renderer/ui/ui';

@ccclass('cc.UIComponent')
@executionOrder(100)
@executeInEditMode
export class UIComponent extends Component {

    /**
     * !#en render order, render order according to width, and arrange once under the same level node.
     * !#zh 渲染先后顺序，按照广度渲染排列，同级节点下进行一次排列
     */
    @property
    get priority () {
        return this._priority;
    }

    set priority (value) {
        if (this._priority === value) {
            return;
        }

        this._priority = value;
    }

    /**
     * !#en find the rendered camera
     * !#zh 查找被渲染相机
     */
    get visibility () {
        return this._visibility;
    }

    @property
    protected _priority = 0;

    protected _visibility = -1;

    public updateAssembler (render: UI) {
    }

    public postUpdateAssembler (render: UI) {
    }
}

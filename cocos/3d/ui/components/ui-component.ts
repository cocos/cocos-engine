import { Component } from '../../../components';
import { ccclass, executeInEditMode, executionOrder, property } from '../../../core/data/class-decorator';
import { UI } from '../../../renderer/ui/ui';

/**
 * @zh
 * UI 及 UI 模型渲染基类
 */
@ccclass('cc.UIComponent')
@executionOrder(110)
@executeInEditMode
export class UIComponent extends Component {

    /**
     * @zh
     * 渲染先后顺序，按照广度渲染排列，同级节点下进行一次排列。
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
     * @zh
     * 查找被渲染相机。
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

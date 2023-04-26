import { ccclass, executeInEditMode, requireComponent } from '../../../core/data/decorators';
import { Component } from '../../../scene-graph';
import { PostProcess } from './post-process';

@ccclass('cc.PostProcessSetting')
@requireComponent(PostProcess)
@executeInEditMode
export class PostProcessSetting extends Component {
    static _default: PostProcessSetting | undefined
    static get default () {
        if (!this._default) {
            this._default = new this();
        }
        return this._default;
    }

    onEnable () {
        const pp = this.getComponent(PostProcess);
        pp?.addSetting(this);
    }
    onDisable () {
        const pp = this.getComponent(PostProcess);
        pp?.removeSetting(this);
    }
}

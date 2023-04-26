import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode } from '../../../core/data/decorators';
import { Component } from '../../../scene-graph';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.PostProcess')
@disallowMultiple
@executeInEditMode
export class PostProcess extends Component {
    static all: PostProcess[] = []

    @property
    global = true
    @property({ range: [0.01, 1], step: 0.01 })
    shadingScale = 1

    settings: Map<typeof PostProcessSetting, PostProcessSetting> = new Map()

    addSetting (setting: PostProcessSetting) {
        this.settings.set(setting.constructor as typeof PostProcessSetting, setting);
    }
    removeSetting (setting: PostProcessSetting) {
        this.settings.delete(setting.constructor as typeof PostProcessSetting);
    }

    getSetting (ctor: typeof PostProcessSetting) {
        return this.settings.get(ctor);
    }

    onEnable () {
        PostProcess.all.push(this);
    }
    onDisable () {
        const idx = PostProcess.all.indexOf(this);
        if (idx !== -1) {
            PostProcess.all.splice(idx, 1);
        }
    }
}

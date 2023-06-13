import { EDITOR } from 'internal:constants';
import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, range, slide } from '../../../core/data/decorators';
import { Director, director } from '../../../game';
import { Component } from '../../../scene-graph';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.PostProcess')
@disallowMultiple
@executeInEditMode
export class PostProcess extends Component {
    static all: PostProcess[] = []

    @property
    global = true;

    @property
    _shadingScale = 1
    @slide
    @range([0.01, 1, 0.01])
    @property
    get shadingScale (): number {
        return this._shadingScale;
    }
    set shadingScale (v) {
        this._shadingScale = v;
        if (EDITOR) {
            setTimeout(() => {
                globalThis.cce.Engine.repaintInEditMode();
            }, 50);
        }
    }

    @property
    enableShadingScaleInEditor = false;

    settings: Map<typeof PostProcessSetting, PostProcessSetting> = new Map()

    addSetting (setting: PostProcessSetting): void {
        this.settings.set(setting.constructor as typeof PostProcessSetting, setting);
    }
    removeSetting (setting: PostProcessSetting): void {
        this.settings.delete(setting.constructor as typeof PostProcessSetting);
    }

    getSetting (ctor: typeof PostProcessSetting): PostProcessSetting | undefined {
        return this.settings.get(ctor);
    }

    onEnable (): void {
        PostProcess.all.push(this);
    }
    onDisable (): void {
        const idx = PostProcess.all.indexOf(this);
        if (idx !== -1) {
            PostProcess.all.splice(idx, 1);
        }
    }
}

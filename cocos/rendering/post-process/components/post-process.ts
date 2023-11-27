import { EDITOR } from 'internal:constants';
import { property, serializable } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, help, range, slide, tooltip } from '../../../core/data/decorators';
import { Director, director } from '../../../game';
import { Component } from '../../../scene-graph';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.PostProcess')
@help('cc.PostProcess')
@disallowMultiple
@executeInEditMode
export class PostProcess extends Component {
    static all: PostProcess[] = [];

    @tooltip('i18n:postprocess.global')
    @property
    @serializable
    global = true;

    @serializable
    protected _shadingScale = 1;
    @tooltip('i18n:postprocess.shadingScale')
    @slide
    @range([0.01, 4, 0.01])
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

    @tooltip('i18n:postprocess.enableShadingScaleInEditor')
    @property
    @serializable
    enableShadingScaleInEditor = false;

    settings: Map<typeof PostProcessSetting, PostProcessSetting> = new Map();

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

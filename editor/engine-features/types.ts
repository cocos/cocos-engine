// tslint:disable:interface-name

export type EngineFeature =
    | 'gfx-webgl'
    | 'gfx-webgl2'
    | 'gfx-webgpu'
    | 'base'
    | 'graphcis'
    | '3d'
    | '2d'
    | 'xr'
    | 'ui'
    | 'particle'
    | 'physics'
    | 'physics-cannon'
    | 'physics-ammo'
    | 'physics-builtin'
    | 'physics-physx'
    | 'particle-2d'
    | 'webview'
    | 'tween'
    | 'physics-2d'
    | 'physics-2d-box2d'
    | 'physics-2d-builtin'
    | 'physics-2d-box2d-wasm'
    | 'intersection-2d'
    | 'audio'
    | 'video'
    | 'terrain'
    | 'tiled-map'
    | 'spine'
    | 'dragon-bones'
    | 'primitive'
    | 'profiler'
    | 'marionette'
    | 'animation'
    | 'skeletal-animation';
export interface ModuleRenderConfig {
    $schema?: string;

    /**
     * The modules info
     */
    features: Features;

    /**
     * The categories info
     */
    categories: { [category: string]: CategoryInfo };
}

export type Features = Record<EngineFeature, IFeatureItem>;

export interface BaseItem {
    /**
     * Display text.
     */
    label: string;

    /**
     * Description.
     */
    description?: string;

    required?: boolean;

    native?: string;

    wechatPlugin?: boolean;

    isNativeCode?: boolean;

    /**
     * Different with wechat plugin, taobao plugin can't read buffer from local wasm.
     * So we need another config item for taobao minigame plugin.
     */
    taobaoMinigamePlugin?: boolean;

    default?: string[];

    category?: string;
}

export interface IFeatureItem extends BaseItem {
    /**
     * Whether if the feature of options allow multiple selection.
     */
    multi?: boolean;

    options?: Record<EngineFeature, BaseItem>;
}

export interface CategoryInfo {
    label?: string;
    description?: string;
}

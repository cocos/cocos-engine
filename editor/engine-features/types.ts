// tslint:disable:interface-name

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

    version: string;

    /**
     * The script to migrate, this script should export a const migrations: Migration[]`.
     */
    migrationScript?: string;
}

export interface Migration {
    version: string;
    migrate(moduleCache: Record<string, boolean>): Record<string, boolean>;
}

export type IModuleItem = IFeatureItem | IFeatureGroup;

export interface Features {
    [feature: string]: IModuleItem;
};

export interface BaseItem {
    /**
     * @zh 在项目设置上显示的模块名称，支持 i18n 格式
     * @en the module name displayed on the project settings, can be configured in i18n format.
     */
    label?: string;

    /**
     * @zh 模块详细描述，将会显示在模块鼠标上移后的提示，支持 `i18n` 的格式
     * @en the detailed description of the module, which will be displayed in the tooltip when the mouse is moved over the module, can be configured in i18n format.
     */
    description?: string;

    /**
     * @zh 是否默认包含该模块
     * @en whether the module is included by default.
     */
    default: boolean;

    /**
     * @zh 标识是否为只读模块，设为 `true` 后用户无法开启或关闭该模块。
     * @en whether the module is read-only. If set to true, users cannot modify this module.
     */
    readonly?: boolean;

    /**
     * @zh 是否在项目设置上隐藏该模块，设为 `true` 后将不会显示在项目设置中。
     * @en Whether to hide the module in the project settings. If set to true, it will not be displayed in the project settings.
     */
    hidden?: boolean;

    /**
     * @zh 默认的模块分组归属，对应 `features` 字段同级的 `categories` 中配置的目录。
     * @en The default module group belongs to, corresponding to the directory configured under the `categories` field at the same level of the `features` field.
     */
    category?: string;

    /**
     * @zh 是否为必选模块，新增模块为必选模块时，旧版本升级后会强制选择此模块，否则不会选择。
     * @en Whether it is a required module. When adding a new module, the old version will be forced to select this module after the upgrade, otherwise it will not be selected.
     */
    required?: boolean;

    /**
     * @zh 该模块依赖的其他模块，如果依赖了其他模块，则此模块勾选后，依赖模块也会被自动勾选。反过来，依赖的模块被移除勾选，此模块也会被一并移除。
     * @en The other modules that this module depends on. If the module depends on other modules, the dependent modules will be automatically selected. In addition, if the dependent module is removed, this module will also be removed.
     */
    dependencies?: string[];
}

export interface IFeatureItem extends BaseItem {
    /**
     * @zh 是否默认以及允许包含在上传的各个小游戏引擎插件内，目前由于部分引擎模块包体较大，默认不会打包在官方的微信引擎分离插件内。（临时方案）
     * @en Whether it is included in the upload of the various engine plugins by default. Currently, because some engine modules are packaged in a large package, the official WeChat engine separation plugin does not package them by default. (Temporary solution)
     */
    enginePlugin?: boolean;

    /**
     * @zh 限定的使用环境，允许宏的组合条件判断，默认为空支持任意环境，配置后限定为指定环境。如设置为 "$NATIVE || $HTML5" 则仅在 native 和 html5 环境下生效。
     * @en The restricted usage environment allows for conditional judgments using macro combinations. By default, it supports any environment, but once configured, it is limited to the specified environment. For example, if set to "$NATIVE || $HTML5", it will only take effect in native and HTML5 environments.
     */
    envCondition?: string;

    /**
     * @zh 当环境不符合限定的使用环境时，自动回退的模块名称。仅当 `envCondition` 配置后才有效。
     * @en The name of the engine feature to automatically fall back to when the environment does not meet the restricted usage conditions. This is only effective when `envCondition` is configured.
     */
    fallback?: string;

    /**
     * @zh 当选择了某个模块时，可以做些附加的配置
     * @en When a module is selected, additional configurations can be made
     */
    flags: {[k: string]: Pick<BaseItem, 'default' | 'label' | 'description' > & {'ui-type': 'checkbox' | 'select'}}

    /**
     * @zh 是否为原生模块，这部分模块的编译模式可能是 wasm 也可能是共存或只有 asmjs，为 true 的模块，如果模块勾选构建面板上才会显示原生代码打包模式的配置。
     * @en Whether it is a native module. This part of the module may be compiled as wasm or asmjs, and the module with this attribute will be displayed in the packaging mode configuration in the build panel if it is selected.
     */
    isNativeModule?: boolean;

    /**
     * @zh 在原生引擎的模块宏配置，如果在原生端有原生实现，在此处补充对应字段，后续根据项目设置的配置情况，会将选择值设置到 `cmake` 配置内。
     * @en The macro configuration of the native module in the native engine. If there is a native implementation in the native engine, please fill in the corresponding fields here. The value will be set to `cmake` configuration according to the project settings.
     */
    cmakeConfig?: string;
}

export interface IFeatureGroup extends BaseItem {
    options: {[feature: string]: IFeatureItem};
}

export interface CategoryInfo {
    label?: string;
    description?: string;
    checkable?: boolean;
    required?: boolean;
}

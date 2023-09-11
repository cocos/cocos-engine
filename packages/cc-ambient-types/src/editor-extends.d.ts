interface EditorAssetInfo {
    name: string; // 资源名字
    displayName: string; // 资源用于显示的名字
    source: string; // url 地址
    path: string; // loader 加载的层级地址
    url: string; // loader 加载地址会去掉扩展名，这个参数不去掉
    file: string; // 绝对路径
    uuid: string; // 资源的唯一 ID
    importer: string; // 使用的导入器名字
    type: string; // 类型
    isDirectory: boolean; // 是否是文件夹
    library: { [key: string]: string }; // 导入资源的 map
    subAssets: { [key: string]: EditorAssetInfo }; // 子资源 map
    visible: boolean; // 是否显示
    readonly: boolean; // 是否只读
    instantiation: string | undefined; // 虚拟资源可以实例化成实体的话，会带上这个扩展名
    redirect?: string; // 跳转指向资源
    meta?: any,
    fatherInfo?: any;
}

interface EditorExtendsScript {
    add(uuid: string, ctor: any): any;
    remove(uuid: string, ctor: any): any;
    getCtors(uuid: string): { [uuid: string]: any }
}

interface EditorExtendsNode {
    add(uuid: string, node: any): any;
    remove(uuid: string): any;
    clear(): any;
    getNode(uuid: string): any;
    getNodes(): {[uuid: string]: any};
    emit(name: string, ...args: any): void;
}

interface EditorExtendsPrefabUtils {
    addPrefabInstance(node: import('cocos/scene-graph/node').Node);
}

interface EditorExtendsComponent {
    addMenu(component: Function, path: string, priority?: number);
    removeMenu(component: Function);
    getMenus(): { [uuid: string]: Object };
    add(uuid: string, component: any): any;
    remove(uuid: string): any;
    clear(): any;
    getComponent(uuid: string): any;
    getComponents(): {[uuid: string]: any};
}

interface EditorExtendsAsset {
    queryAssetInfo(uuid: string, callback: Function): any;
    getAssetInfoFromUrl(url: string): EditorAssetInfo;
    saveDataToImage(buffer: Uint8Array | null, width: number, height: number, sceneName: string, fileName: string): any;
    bakeReflectionProbe(files: string[], isHDR: boolean, sceneName:string, probeID: number, callback: Function): any
}

interface EditorExtendsUuid {
    NonUuidMark: string;
    compressUuid(uuid: string, min: boolean): string;
    compressHex(hexString: string, reservedHeadLength: number): string;
    decompressUuid(str: string): string;
    isUuid(str: string): boolean;
    getUuidFromLibPath(path: string): string;
    uuid(): string;
}

declare namespace EditorExtends {
    const Script: EditorExtendsScript;
    const Node: EditorExtendsNode;
    const Component: EditorExtendsComponent;
    const Asset: EditorExtendsAsset;
    const UuidUtils: EditorExtendsUuid;
    const PrefabUtils:EditorExtendsPrefabUtils;
    const MissingReporter: {
        classInstance: any;
        class: any;
        object: any;
    };

    const serialize: any;

    interface EventMap {
        /**
         * Called when a cc-class is registered.
         * @param classConstructor Registering class.
         */
        'class-registered'(classConstructor: Function, metadata: Readonly<any> | undefined, className: string):  void;
    }

    type EventArgs<EventName extends keyof EventMap> = Parameters<EventMap[EventName]>;

    type Listener<EventName extends keyof EventMap> = (...args: EventArgs<EventName>) => void;

    function emit<EventName extends keyof EventMap>(name: EventName, ...args: EventArgs<EventName>): void;

    function on<EventName extends keyof EventMap>(name: EventName, listener: Listener<EventName>): void;

    function removeListener<EventName extends keyof EventMap>(name: EventName, listener: Listener<EventName>): void;
}
import {define, declareProperties} from "./CCClass";
// let define, declareProperties;
// CCClass of v1.4.x is different.
// if (/^1.4/.test(cc.ENGINE_VERSION)) {
//     define = define14;
//     declareProperties = declareProperties14;
// } else {
//     define = define13;
//     declareProperties = declareProperties13;
// }
declare interface ICCProperty {
    type?: any;
    visible?: boolean;
    displayName?: string;
    tooltip?: string;
    multiline?: boolean;
    readonly?: boolean;
    min?: number;
    max?: number;
    step?: number;
    range?: Array<number>;
    slide?: boolean;
    serializable?: boolean;
    editorOnly?: boolean;
    default?: any;
    url?: any;
    notify?: (oldValue: any)=>void;
    override?: boolean;
    animatable?: boolean;
    get?: ()=>any;
    set?: (newValue: any)=>void
}
declare interface ICCProperties {
    [propertyName: string]: ICCProperty
}
declare interface ICCEditor {
    requireComponent?: cc.Component;
    disallowMultiple?: cc.Component;
    menu?: string;
    executeInEditMode?: boolean;
    playOnFocus?: boolean;
    inspector?: string;
    icon?: string;
    help?: string;
}
let currentProperties: {[uuid: string]: ICCProperties} = {};
let currentMixins: {[uuid: string]: Array<any>} = {};
let currentEditor: {[uuid: string]: ICCEditor} = {};
let defined: {[uuid: string]: boolean} = {};
let definedClass: {[uuid: string]: any} = {};
// Get the UUID of currently compiling script
function getUUID() {
    return cc._RFpeek().uuid;
}
// Get the name of currently compiling script
function getScriptName() {
    return cc._RFpeek().script;
}
/*
 Decorator of components that inherit cc.Component. Usage:
 --------------------------
 @CCComponent
 export class ComponentName extends cc.Component {}
 --------------------------
 */
export function CCComponent(constructor) {
    if (constructor.length > 0) {
        cc.warn(`Please do not define parameters for a component constructor in ${getScriptName()}!`);
    }
    let uuid = getUUID();
    if (defined[uuid]) return definedClass[uuid];
    constructor.$super = cc.Component;
    let cls = define(void 0, constructor, currentMixins[uuid], void 0, {});
    let name = cc.js.getClassName(cls);
    declareProperties(cls, name, currentProperties[uuid], constructor, void 0);
    if (currentEditor.hasOwnProperty(uuid)) {
        cc.Component._registerEditorProps(constructor, currentEditor[uuid]);
    }
    currentProperties = {};
    currentMixins = {};
    currentEditor = {};
    defined[uuid] = true;
    definedClass[uuid] = cls;
    return cls;
}
/*
 Decorator of a property in cc.Component.
 @CCProperty must be used with @CCComponent. Usage:
 --------------------------
 @CCComponent
 export class ComponentName extends cc.Component {
     @CCProperty({
         default: null,
         type: cc.Node
     })
     public someNode: cc.Node;
     @CCProperty(cc.Button)
     public someButton: cc.Button;
 }
 --------------------------
 */
export function CCProperty(option: ICCProperty) {
    return function (constructor, propertyName) {
        let uuid = getUUID();
        if (!currentProperties.hasOwnProperty(uuid)) currentProperties[uuid] = {};
        currentProperties[uuid][propertyName] = option;
    }
}
/*
 Decorator of editor properties.
 @CCEditor must be used with @CCComponent. Usage:
 --------------------------
 @CCEditor({
    executeInEditMode: true
 })
 @CCComponent
 export class ComponentName extends cc.Component {}
 --------------------------
 */
export function CCEditor(editor: ICCEditor) {
    return function (constructor: any) {
        if (CC_EDITOR) {
            let uuid = getUUID();
            if (!defined.hasOwnProperty(uuid) || !defined[uuid]) {
                currentEditor[uuid] = editor;
            } else {
                cc.Component._registerEditorProps(constructor, editor);
            }
        }
        return constructor;
    }
}
/*
 Decorator of mixins.
 @CCMixins must be used before @CCComponent. Usage:
 --------------------------
 @CCComponent
 @CCMixins(mixin1, mixin2, mixin3, ...)
 export class ComponentName extends cc.Component {}
 --------------------------
 */
export function CCMixins(...args) {
    return function (cls) {
        let uuid = getUUID();
        if (CC_EDITOR && defined.hasOwnProperty(uuid) && defined[uuid]) {
            cc.error(`@CCMixins should be used before @CCComponent in ${getScriptName()}!`);
        }
        currentMixins[uuid] = args;
        return cls;
    }
}
"use strict";
exports.__esModule = true;
var CCClass_1 = require("./CCClass");
var currentProperties = {};
var currentMixins = {};
var currentEditor = {};
var defined = {};
var definedClass = {};
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
function component(constructor) {
    if (constructor.length > 0) {
        cc.warn("Please do not define parameters for a component constructor in " + getScriptName() + "!");
    }
    var uuid = getUUID();
    if (defined[uuid])
        return definedClass[uuid];
    constructor.$super = cc.Component;
    var cls = CCClass_1.define(void 0, constructor, currentMixins[uuid], void 0, {});
    var name = cc.js.getClassName(cls);
    CCClass_1.declareProperties(cls, name, currentProperties[uuid], constructor, void 0);
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
exports.component = component;
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
function property(option) {
    return function (constructor, propertyName) {
        var uuid = getUUID();
        if (!currentProperties.hasOwnProperty(uuid))
            currentProperties[uuid] = {};
        currentProperties[uuid][propertyName] = option;
    };
}
exports.property = property;
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
function editor(editor) {
    return function (constructor) {
        if (CC_EDITOR) {
            var uuid = getUUID();
            if (!defined.hasOwnProperty(uuid) || !defined[uuid]) {
                currentEditor[uuid] = editor;
            }
            else {
                cc.Component._registerEditorProps(constructor, editor);
            }
        }
        return constructor;
    };
}
exports.editor = editor;
/*
 Decorator of mixins.
 @CCMixins must be used before @CCComponent. Usage:
 --------------------------
 @CCComponent
 @CCMixins(mixin1, mixin2, mixin3, ...)
 export class ComponentName extends cc.Component {}
 --------------------------
 */
function mixins() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (cls) {
        var uuid = getUUID();
        if (CC_EDITOR && defined.hasOwnProperty(uuid) && defined[uuid]) {
            cc.error("@CCMixins should be used before @CCComponent in " + getScriptName() + "!");
        }
        currentMixins[uuid] = args;
        return cls;
    };
}
exports.mixins = mixins;


if (CC_EDITOR) {
    exports.reset = function () {
        currentProperties = {};
        currentMixins = {};
        currentEditor = {};
        defined = {};
        definedClass = {};
    };
}

cc.Class.decorator = exports;

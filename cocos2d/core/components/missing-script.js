/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var JS = cc.js;

/*
 * A temp fallback to contain the original component which can not be loaded.
 * Actually, this class will be used whenever a class failed to deserialize,
 * regardless of whether it is child class of component.
 */
var MissingScript = cc.Class({
    name: 'cc.MissingScript', 
    extends: cc.Component,
    editor: {
        inspector: 'app://editor/page/inspector/missing-script.html',
    },
    properties: {
        //_scriptUuid: {
        //    get: function () {
        //        var id = this._$erialized.__type__;
        //        if (Editor.UuidUtils.isUuid(id)) {
        //            return Editor.UuidUtils.decompressUuid(id);
        //        }
        //        return '';
        //    },
        //    set: function (value) {
        //        if ( !sandbox.compiled ) {
        //            cc.error('Scripts not yet compiled, please fix script errors and compile first.');
        //            return;
        //        }
        //        if (value && Editor.UuidUtils.isUuid(value._uuid)) {
        //            var classId = Editor.UuidUtils.compressUuid(value);
        //            if (cc.js._getClassById(classId)) {
        //                this._$erialized.__type__ = classId;
        //                Editor.Ipc.sendToWins('reload:window-scripts', sandbox.compiled);
        //            }
        //            else {
        //                cc.error('Can not find a component in the script which uuid is "%s".', value);
        //            }
        //        }
        //        else {
        //            cc.error('invalid script');
        //        }
        //    }
        //},
        compiled: {
            default: false,
            serializable: false
        },
        // the serialized data for original script object
        _$erialized: {
            default: null,
            visible: false,
            editorOnly: true
        }
    },
    ctor: CC_EDITOR && function () {
        this.compiled = _Scene.Sandbox.compiled;
    },
    statics: {
        /*
         * @param {string} id
         * @return {function} constructor
         */
        safeFindClass: function (id) {
            var cls = JS._getClassById(id);
            if (cls) {
                return cls;
            }
            if (id) {
                return MissingScript;
            }
            return null;
        }
    },
    onLoad: function () {
        cc.warn('The referenced component script on node "%s" is missing!', this.node.name);
    }
});

cc._MissingScript = module.exports = MissingScript;

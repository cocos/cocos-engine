/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import {_getClassById} from '../core/utils/js';
import {BUILTIN_CLASSID_RE} from '../core/utils/misc';
import Component from './CCComponent';
import {ccclass, property, inspector} from '../core/data/class-decorator';

/*
 * A temp fallback to contain the original serialized data which can not be loaded.
 */
@ccclass('cc.MissingClass')
class MissingClass {
    // the serialized data for original object
    @property({
        visible: false,
        editorOnly: true
    })
    _$erialized = null;
}

/*
 * A temp fallback to contain the original component which can not be loaded.
 */
@ccclass('cc.MissingScript')
@inspector('packages://inspector/inspectors/comps/missing-script.js')
export default class MissingScript extends Component {
    
    //_scriptUuid: {
    //    get: function () {
    //        var id = this._$erialized.__type__;
    //        if (Editor.Utils.UuidUtils.isUuid(id)) {
    //            return Editor.Utils.UuidUtils.decompressUuid(id);
    //        }
    //        return '';
    //    },
    //    set: function (value) {
    //        if ( !sandbox.compiled ) {
    //            cc.error('Scripts not yet compiled, please fix script errors and compile first.');
    //            return;
    //        }
    //        if (value && Editor.Utils.UuidUtils.isUuid(value._uuid)) {
    //            var classId = Editor.Utils.UuidUtils.compressUuid(value);
    //            if (_getClassById(classId)) {
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

    @property({
        serializable: false
    })
    compiled = false;

    // the serialized data for original script object
    @property({
        visible: false,
        editorOnly: true
    })
    _$erialized = null;

    constructor () {
        super();
        if (CC_EDITOR) {
            this.compiled = _Scene.Sandbox.compiled;
        }
    }

    /*
     * @param {string} id
     * @return {function} constructor
     */
    static safeFindClass (id, data) {
        var cls = _getClassById(id);
        if (cls) {
            return cls;
        }
        if (id) {
            cc.deserialize.reportMissingClass(id);
            return MissingScript.getMissingWrapper(id, data);
        }
        return null;
    }
    static getMissingWrapper (id, data) {
        if (data.node && (/^[0-9a-zA-Z+/]{23}$/.test(id) || BUILTIN_CLASSID_RE.test(id))) {
            // is component
            return MissingScript;
        }
        else {
            return MissingClass;
        }
    }

    onLoad () {
        cc.warnID(4600, this.node.name);
    }
}

cc._MissingScript = MissingScript;

var JS = cc.js;

/*
 * A temp fallback to contain the original component which can not be loaded.
 * Actually, this class will be used whenever a class failed to deserialize,
 * regardless of whether it is child class of component.
 */
var MissingScript = cc.Class({
    name: 'cc.MissingScript', extends: cc.Component,
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
        //                Editor.sendToWindows('reload:window-scripts', sandbox.compiled);
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
        error: {
            default: '',
            multiline: true,
            readonly: true,
            serializable: false,
            displayName: '(Error)'
        },
        // the serialized data for original script object
        _$erialized: {
            default: null,
            visible: false,
            editorOnly: true
        }
    },
    ctor: CC_EDITOR && function () {
        this.error = _Scene.Sandbox.compiled ?
                     Editor.T('COMPONENT.missing_scirpt.error_compiled') :
                     Editor.T('COMPONENT.missing_scirpt.error_not_compiled')
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
        cc.warn('The referenced script on "%s" is missing!', this.name);
    }
});

cc._MissingScript = module.exports = MissingScript;

import HTMLElement from "./HTMLElement"

window.jsb = window.jsb || {};

export default class HTMLInputElement extends HTMLElement {
    constructor() {
        super("INPUT");
    }

    focus() {
        super.focus();
        debugger;
        jsb.showKeyboard({
            defaultValue: this.value,
            maxLength: this.maxLength,
            multiple: false,
            confirmHold: false,
            // confirmType: getKeyboardReturnType(editBoxImpl._returnType),
            // inputType: inputTypeString,
            success: function (res) {
            },
            fail: function (res) {
            }
        });
    }

    blur() {
        super.blur();
        rt.hideKeyboard({});
    }
}
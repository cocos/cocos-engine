import Element from './Element'

export default class HTMLElement extends Element {
    className = '';
    childern = [];
    style = {
        width: `${jsb.width}px`,
        height: `${jsb.height}px`
    };

    insertBefore = function () {
    };

    innerHTML = '';

    constructor(tagName) {
        super(tagName);
    }

    setAttribute(name, value) {
        this[name] = value
    }

    getAttribute(name) {
        return this[name]
    }

    get clientWidth() {
        const ret = parseInt(this.style.fontSize, 10) * this.innerHTML.length

        return Number.isNaN(ret) ? 0 : ret
    }

    get clientHeight() {
        const ret = parseInt(this.style.fontSize, 10);

        return Number.isNaN(ret) ? 0 : ret
    }
}

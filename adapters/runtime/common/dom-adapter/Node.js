import EventTarget from './EventTarget'
import Event from "./Event";

export default class Node extends EventTarget {
    childNodes = [];
    parentNode = null;
    _nodeName = "";

    constructor(nodeName) {
        super();
        this._nodeName = nodeName;
    }

    appendChild(node) {
        this.childNodes.push(node);
        node.parentNode = this;
        let nodeName = node.nodeName;
        if (nodeName === "SCRIPT" || nodeName === "STYLE") {
            node.dispatchEvent(new Event("append"));
        }
        return node;
    }

    cloneNode() {
        const copyNode = Object.create(this);
        Object.assign(copyNode, this);
        copyNode.parentNode = null;
        return copyNode
    }

    removeChild(node) {
        const index = this.childNodes.findIndex((child) => child === node);

        if (index > -1) {
            let node = this.childNodes.splice(index, 1)[0];
            node.parentNode = null;
            return node;
        }
        return null
    }

    dispatchEvent() {
        let result = true;
        let length = this.childNodes.length;
        for (let index = length - 1; result && index >= 0; --index) {
            result = this.childNodes[index].dispatchEvent(...arguments);
        }
        if (result) {
            return super.dispatchEvent(...arguments);
        }
        return false;
    }

    get nodeName() {
        return this._nodeName;
    }
}

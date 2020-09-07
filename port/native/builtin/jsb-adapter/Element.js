const Node = require('./Node');
const DOMRect = require('./DOMRect');

class Element extends Node {
    constructor() {
        super()
        this.className = ''
        this.children = []
        this.clientLeft = 0;
        this.clientTop = 0;
        this.scrollLeft = 0;
        this.scrollTop = 0;
    }

    get clientWidth() {
        return 0;
    }

    get clientHeight() {
        return 0;
    }

    getBoundingClientRect() {
        return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
    }

    // attrName is a string that names the attribute to be removed from element.
    removeAttribute(attrName) {

    }
}

module.exports = Element;

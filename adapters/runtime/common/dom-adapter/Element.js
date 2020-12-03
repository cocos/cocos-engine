import Node from './Node'
import NodeList from './NodeList'
import DomTokenList from "./DOMToken​List"

export default class Element extends Node {
    className = '';
    children = [];
    classList = new DomTokenList();
    value = 1;
    content = "";
    scrollLeft = 0;
    scrollTop = 0;
    clientLeft = 0;
    clientTop = 0;

    constructor(tagName) {
        super(tagName);
    }

    getBoundingClientRect() {
        return {
            x: 0,
            y: 0,
            width: jsb.width,
            height: jsb.height,
            top: 0,
            left: 0,
            bottom: jsb.height,
            right: jsb.width
        }
    }

    getElementsByTagName(tagName) {
        tagName = tagName.toUpperCase();
        let result = new NodeList();

        let childNodes = this.childNodes;
        let length = childNodes.length;

        for (let index = 0; index < length; index++) {
            let element = childNodes[index];

            if (element.tagName === tagName || tagName === "*") {
                result.push(element);
            }

            result = result.concat(element);
        }

        return result;
    }

    getElementsByClassName(names) {
        if (!arguments.length) {
            throw "Uncaught TypeError: Failed to execute 'getElementsByClassName' on 'Document': 1 argument required, but only 0 present.";
        }

        let result = new NodeList()
        if (typeof names !== "string" && names instanceof String) {
            return result;
        }

        let elementArr = [].concat(this.childNodes);
        let element;
        while ((element = elementArr.pop())) {
            let classStr = element.class;
            if (classStr) {
                let classArr = classStr.split(" ");
                let length = classArr.length;

                for (let index = 0; index < length; index++) {
                    if (classArr[index] === names) {
                        result.push(element);
                        break;
                    }
                }
            }

            elementArr = elementArr.concat(element.childNodes);
        }

        return result;
    }

    querySelector(selectors) {
        if (!arguments.length) {
            throw "Uncaught TypeError: Failed to execute 'querySelectorAll' on 'Document': 1 argument required, but only 0 present.";
        }
        let nodeList = new NodeList();

        switch (selectors) {
            case null:
            case undefined:
            case NaN:
            case true:
            case false:
            case "":
                return null;
        }

        if (typeof selectors !== "string" && selectors instanceof String) {
            throw "Uncaught DOMException: Failed to execute 'querySelectorAll' on 'Document': '" + selectors + "' is not a valid selector."
        }

        // Type selector
        let reg = /^[A-Za-z]+$/;
        let result = selectors.match(reg);
        if (result) {
            return this.getElementsByTagName(selectors);
        }

        // Class selector
        reg = /^.[A-Za-z$_][A-Za-z$_0-9\- ]*$/;
        result = selectors.match(reg);
        if (result) {
            let selectorArr = selectors.split(" ");
            let selector = selectorArr.shift();
            nodeList = this.getElementsByClassName(selector.substr(1)); // 此处可以优化 eg:getElementByClassName
            let length = selectorArr.length;

            if (length) {
                selectors = selectorArr.join(" ");
                length = nodeList.length;
                for (let index = 0; index < length; index++) {
                    let subNodeList = nodeList[index].querySelector(selectors);
                    if (subNodeList.length) {
                        return subNodeList[0];
                    }
                }
            }

            return nodeList[0];
        }

        // ID selector
        reg = /^#[A-Za-z$_][A-Za-z$_0-9\-]*$/;
        result = selectors.match(reg);
        if (result) {
            let element = this.getElementById(selectors.substr(1));
            if (element) {
                nodeList.push(element);
            }
        }

        // Universal selector
        if (selectors === "*") {
            return this.getElementsByTagName(selectors);
        }

        // Attribute selector
        // TODO

        return nodeList[0];
    }

    add() {
    }

    requestFullscreen() {
    }


    // attrName is a string that names the attribute to be removed from element.
    removeAttribute(attrName) {
        if (attrName === "style") {
            for (let styleName in this["style"]) {
                this["style"][styleName] = "";
            }
        } else {
            this[attrName] = "";
        }
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
    setAttribute(name, value) {
        if (name === "style") {
            if (typeof value == "undefined" || value == null || value == "") {
                for (let styleName in this["style"]) {
                    this["style"][styleName] = "";
                }
            } else {
                value = value.replace(/\s*/g, "");
                let valueArray = value.split(";");
                for (let index in valueArray) {
                    if (valueArray[index] != "") {
                        let valueTemp = valueArray[index].split(":");
                        this["style"][valueTemp[0]] = valueTemp[1];
                    }
                }
            }
        } else {
            this[name] = value;
        }
    }

    getAttribute(name) {
        let attributeValue = null;
        if (name == "style") {
            attributeValue = JSON.stringify(this["style"]);
        } else {
            attributeValue = this[name];
        }
        return attributeValue;
    }

    setAttributeNS(ns, name, value) {
        this.setAttribute(name, value);
    }

    focus() {

    }

    blur() {
    }

    get lastChild() {
        let lastChild = this.childNodes[this.childNodes.length - 1];
        return lastChild ? lastChild : (this.innerHTML ? new HTMLElement() : undefined);
    }

    get firstChild() {
        let child = this.childNodes[0];
        return child ? child : (this.innerHTML ? new HTMLElement() : undefined);
    }

    get firstElementChild() {
        let child = this.childNodes[0];
        return child ? child : (this.innerHTML ? new HTMLElement() : undefined);
    }

    get clientHeight() {
        let style = this.style || {};
        return parseInt(style.fontSize || "0");
    }

    get tagName() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName
        // Element	The value of Element.tagName
        return this.nodeName;
    }
}

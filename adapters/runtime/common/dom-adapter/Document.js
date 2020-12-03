import Audio from './Audio'
import FontFaceSet from './FontFaceSet'
import Node from './Node'
import NodeList from './NodeList'
import HTMLAnchorElement from './HTMLAnchorElement'
import HTMLElement from './HTMLElement'
import HTMLHtmlElement from './HTMLHtmlElement'
import HTMLBodyElement from './HTMLBodyElement'
import HTMLHeadElement from './HTMLHeadElement'
import HTMLCanvasElement from './HTMLCanvasElement'
import HTMLVideoElement from './HTMLVideoElement'
import HTMLScriptElement from './HTMLScriptElement'
import HTMLStyleElement from './HTMLStyleElement'
import _weakMap from "./util/WeakMap"

let _html = new HTMLHtmlElement();

export default class Document extends Node {
    head = new HTMLHeadElement(_html);
    body = new HTMLBodyElement(_html);
    fonts = new FontFaceSet();
    cookie = "";
    documentElement = _html;
    readyState = "complete";
    visibilityState = "visible";
    hidden = false;
    style = {};
    location = window.location;
    ontouchstart = null;
    ontouchmove = null;
    ontouchend = null;

    get characterSet() {
        return "UTF-8";
    }

    get scripts() {
        return _weakMap.get(this).scripts.slice(0);
    }

    constructor() {
        super();

        _html.appendChild(this.head);
        _html.appendChild(this.body);
        _weakMap.get(this).scripts = [];
    }

    createElement(tagName) {
        if (typeof tagName !== "string") {
            return null;
        }
        tagName = tagName.toUpperCase();
        if (tagName === 'CANVAS') {
            return new HTMLCanvasElement()
        } else if (tagName === 'IMG') {
            return new Image()
        } else if (tagName === 'VIDEO') {
            return new HTMLVideoElement();
        } else if (tagName === 'SCRIPT') {
            return new HTMLScriptElement();
        } else if (tagName === "INPUT") {
            return new HTMLInputElement();
        } else if (tagName === "AUDIO") {
            return new Audio();
        } else if (tagName === "STYLE") {
            return new HTMLStyleElement();
        } else if (tagName === "A") {
            return new HTMLAnchorElement();
        }
        return new HTMLElement(tagName)
    }

    createElementNS(namespaceURI, qualifiedName, options) {
        return this.createElement(qualifiedName);
    }

    createEvent(type) {
        if (window[type]) {
            return new window[type];
        }
        return null;
    }

    createTextNode() {
        console.warn("document.createTextNode() is not support!");
    }

    dispatchEvent() {
        if (_html.dispatchEvent(...arguments)) {
            return super.dispatchEvent(...arguments);
        }
        return false;
    }

    appendChild(node) {
        let nodeName = node.nodeName;
        if (nodeName === "SCRIPT") {
            _weakMap.get(this).scripts.push(node);
        }
        return super.appendChild(node);
    }

    removeChild(node) {
        let nodeName = node.nodeName;
        if (nodeName === "SCRIPT") {
            let scripts = _weakMap.get(this).scripts;
            for (let index = 0, length = scripts.length; index < length; ++index) {
                if (node === scripts[index]) {
                    scripts.slice(index, 1);
                    break;
                }
            }
        }
        return super.removeChild(node);
    }

    getElementById(id) {
        if (!arguments.length) {
            throw "Uncaught TypeError: Failed to execute 'getElementById' on 'Document': 1 argument required, but only 0 present.";
        }

        let rootElement = this.documentElement;
        let elementArr = [].concat(rootElement.childNodes);
        let element;
        if (id === "canvas" || id === "glcanvas") {
            while ((element = elementArr.pop())) {
                if (element.id === "canvas" || element.id === "glcanvas") {
                    return element;
                }
                elementArr = elementArr.concat(element.childNodes);
            }
        } else {
            while ((element = elementArr.pop())) {
                if (element.id === id) {
                    return element;
                }

                elementArr = elementArr.concat(element.childNodes);
            }
        }
        return null;
    }

    getElementsByClassName(names) {
        if (!arguments.length) {
            throw "Uncaught TypeError: Failed to execute 'getElementsByClassName' on 'Document': 1 argument required, but only 0 present.";
        }

        if (typeof names !== "string" && names instanceof String) {
            return new NodeList();
        }

        return this.documentElement.getElementsByClassName(names);
    }

    getElementsByTagName(tagName) {
        if (!arguments.length) {
            throw "Uncaught TypeError: Failed to execute 'getElementsByTagName' on 'Document': 1 argument required, but only 0 present.";
        }

        tagName = tagName.toUpperCase();
        let rootElement = this.documentElement;
        let result = new NodeList();

        switch (tagName) {
            case "HEAD": {
                result.push(document.head);
                break;
            }
            case "BODY": {
                result.push(document.body);
                break;
            }
            default: {
                result = result.concat(rootElement.getElementsByTagName(tagName));
            }
        }
        return result;
    }

    getElementsByName(name) {
        if (!arguments.length) {
            throw "Uncaught TypeError: Failed to execute 'getElementsByName' on 'Document': 1 argument required, but only 0 present.";
        }

        let elementArr = [].concat(this.childNodes);
        let result = new NodeList();
        let element;
        while ((element = elementArr.pop())) {
            if (element.name === name) {
                result.push(element);
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
        reg = /^\.[A-Za-z$_][A-Za-z$_0-9\- ]*$/;
        result = selectors.match(reg);
        if (result) {
            let selectorArr = selectors.split(" ");
            let selector = selectorArr.shift();
            nodeList = this.getElementsByClassName(selector.substr(1));
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

    /**
     * 返回与指定的选择器组匹配的文档中的元素列表
     * @param selectors 一个 DOMString 包含一个或多个匹配的选择器
     * @returns {NodeList}
     */
    querySelectorAll(selectors) {
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
                return nodeList;
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
        reg = /^\.[A-Za-z$_][A-Za-z$_0-9\-]*$/;
        result = selectors.match(reg);
        if (result) {
            return this.getElementsByClassName(selectors.substr(1));
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

        return nodeList;
    }
}

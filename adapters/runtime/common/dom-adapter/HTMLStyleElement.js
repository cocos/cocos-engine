import FontFace from "./FontFace"
import HTMLElement from "./HTMLElement"

export default class HTMLStyleElement extends HTMLElement {
    constructor() {
        super("STYLE");

        let self = this;
        let onAppend =  function () {
            self.removeEventListener("append", onAppend);
            let textContent = self.textContent || self.innerHTML || "";
            let fontFaceStr = "";
            let start = 0;
            let length = textContent.length;
            let flag = 0;
            for (let index = 0; index < length; ++index) {
                if (start > 0) {
                    if (textContent[index] === "{") {
                        flag++;
                    } else if (textContent[index] === "}") {
                        flag--;
                        if (flag === 0) {
                            fontFaceStr = textContent.substring(start, index + 1);
                            break;
                        } else if (flag < 0) {
                            break;
                        }
                    }
                } else {
                    if (textContent[index] === "@"
                        && textContent.substr(index, "@font-face".length) === "@font-face") {
                        index += 9;
                        start = index + 1;
                    }
                }
            }
            // { font-family:Fontin-SmallCaps_LABEL; src:url('assets/resources/native/5b/5b9cbc23-76b3-41ff-9953-4219fdbea72c/Fontin-SmallCaps.ttf');}
            if (fontFaceStr) {
                let fontFamily;
                let length = fontFaceStr.length;
                let start = fontFaceStr.indexOf("font-family");
                if (start === -1) {
                    return;
                }
                start += "font-family".length + 1;
                let end = start;
                for (; end < length; ++end) {
                    if (fontFaceStr[end] === ";") {
                        fontFamily = fontFaceStr.substring(start, end).trim();
                        break;
                    } else if (fontFaceStr[end] === ":") {
                        start = end + 1;
                    }
                }
                if (!fontFamily) {
                    return;
                }
                end = fontFaceStr.indexOf("url(");
                start = 0;
                let source;
                for (; end < length; ++end) {
                    if (fontFaceStr[end] === "'" || fontFaceStr[end] === '"') {
                        if (start > 0) {
                            source = fontFaceStr.substring(start, end).trim();
                            break;
                        }
                        start = end + 1;
                    }
                }
                if (source) {
                    let fontFace = new FontFace(fontFamily, source);
                    fontFace.load();
                    document.fonts.add(fontFace);
                }
            }
        };
        this.addEventListener("append", onAppend);
    }
}
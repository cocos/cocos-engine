import HTMLImageElement from "./HTMLImageElement";
import { isIDE } from "./utils/util";

export default function Image(){
    const image = my.createImage();
    if(!isIDE) {
        image.__proto__ = new HTMLImageElement()
        if(image.tagName === undefined) {
            image.tagName = "IMG";
        }

        image.onload = () => {
            image.dispatchEvent({
                type: "load",
            });
        }

        image.onerror = () => {
            image.dispatchEvent({
                type: "error"
            });
        }

    }


    return image;
}
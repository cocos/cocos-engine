/* eslint-disable */
import CommonComputedStyle from './CommonComputedStyle'

function getImageComputedStyle(image) {
    const width = image.width;
    const height = image.height;
    const style = Object.assign(CommonComputedStyle, {
        "display": "inline",
        "position": "static",
        "inlineSize": width + "px",
        "perspectiveOrigin": width / 2 + "px " + height / 2 + "px",
        "transformOrigin": width / 2 + "px " + height / 2 + "px",
        "webkitLogicalWidth": width + "px",
        "webkitLogicalHeight": height + "px",
        "width": width + "px",
        "height": height + "px",
    });
    return style;
}

export default getImageComputedStyle;

/* eslint-disable */
import CommonComputedStyle from './CommonComputedStyle'

function getCanvasComputedStyle(canvas) {
    const rect = canvas.getBoundingClientRect();
    const style = Object.assign(CommonComputedStyle, {
        "display": "inline",
        "position": "static",
        "inlineSize": rect.width + "px",
        "perspectiveOrigin": rect.width / 2 + "px " + rect.height / 2 + "px",
        "transformOrigin": rect.width / 2 + "px " + rect.height / 2 + "px",
        "webkitLogicalWidth": rect.width + "px",
        "webkitLogicalHeight": rect.height + "px",
        "width": rect.width + "px",
        "height": rect.height + "px",
    });
    return style;
}

export default getCanvasComputedStyle;
